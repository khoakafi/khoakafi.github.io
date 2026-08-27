#!/usr/bin/env node
/* ============================================================
   Bộ quét giá chạy trên GitHub Actions — đẩy Web Push về iPhone
   kể cả khi app đã đóng.

   Chạy 5 phút/lần trong giờ phiên. Áp ĐÚNG bộ luật của app:
     · TÍN HIỆU MUA  : giá ≥ ngưỡng kích hoạt VÀ khối lượng ≥ ngưỡng
     · SÁT ĐIỂM MUA  : giá ≥ 98,5% ngưỡng nhưng chưa vượt
     · +2% / +4%     : mã trong watchlist tăng tốc
   Mỗi (mã × bậc) chỉ báo 1 lần/phiên — trạng thái lưu ở nhánh
   push-state nên chạy lại workflow cũng không báo trùng.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const ROOT = path.resolve(__dirname, '..');
const STATE_FILE = process.env.STATE_FILE || path.join(ROOT, '.push-state.json');
const DRY = process.env.DRY_RUN === '1';

/* ---------- đọc dữ liệu app (cùng nguồn với trình duyệt) ---------- */
function readWindowJson(file, varName) {
  const s = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const i = s.indexOf('=');
  return JSON.parse(s.slice(i + 1).trim().replace(/;\s*$/, ''));
}
const SUM = readWindowJson('dashboard_data.js');
const SIGS = readWindowJson('signals_data.js');
const TRIG = SIGS.trig || {};
const BO_CUNG = new Set(['DCL', 'VC3', 'SSB', 'KHG', 'VPI']);

/* ---------- giờ phiên Việt Nam (UTC+7) ---------- */
function nowVN() { return new Date(Date.now() + 7 * 3600 * 1000); }
function inSession() {
  if (process.env.FORCE_RUN === '1') return true;
  const d = nowVN();
  const dow = d.getUTCDay();
  if (dow < 1 || dow > 5) return false;
  const h = d.getUTCHours() + d.getUTCMinutes() / 60;
  return (h >= 9 && h < 11.5) || (h >= 13 && h < 14.84);
}
function phienKey() {
  const d = nowVN();
  return d.toISOString().slice(0, 10);
}

/* ---------- lấy giá realtime ---------- */
const VPS = 'https://bgapidatafeed.vps.com.vn/getliststockdata/';
async function layGia(codes) {
  const out = {};
  for (let i = 0; i < codes.length; i += 60) {
    const lot = codes.slice(i, i + 60);
    try {
      const r = await fetch(VPS + lot.join(','), {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
        signal: AbortSignal.timeout(20000)
      });
      if (!r.ok) { console.error('VPS HTTP', r.status); continue; }
      const arr = await r.json();
      (Array.isArray(arr) ? arr : []).forEach(x => {
        if (!x || !x.sym) return;
        const gia = Number(x.lastPrice) || Number(x.r) || 0;
        const kl = Number(x.lot) || Number(x.totalVol) || 0;
        if (gia > 0) out[String(x.sym).toUpperCase()] = { p: gia, vol: kl * (x.lot ? 10 : 1) };
      });
    } catch (e) { console.error('VPS lỗi:', e.message); }
  }
  return out;
}

/* ---------- trạng thái chống trùng ---------- */
function docState() {
  try {
    const j = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    if (j.phien === phienKey()) return j;
  } catch (e) {}
  return { phien: phienKey(), daBao: {} };
}
function ghiState(st) { fs.writeFileSync(STATE_FILE, JSON.stringify(st, null, 1)); }
/* Nhat ky lan chay gan nhat — commit len nhanh push-state de soi tu xa */
function ghiNhatKy(o){
  try { fs.writeFileSync(path.join(path.dirname(STATE_FILE), '.push-run.json'),
    JSON.stringify(Object.assign({ luc: new Date().toISOString() }, o), null, 1)); } catch(e){}
}

/* ---------- luật báo ---------- */
function quet(gia, st) {
  const BAT = (process.env.ALERT_KINDS || 'signal,near,move').split(',');
  const ra = [];
  const them = (key, tieuDe, than, ngan) => {
    if (st.daBao[key]) return;
    st.daBao[key] = Date.now();
    ra.push({ key, tieuDe, than, ngan });
  };

  for (const r of SUM.rows) {
    /* Khop DUNG app: ma hang yeu (FA chua dat) khong bao bat ky bac nao */
    if (!r.watch || r.wgrade === 'weak' || BO_CUNG.has(r.t)) continue;
    const live = gia[r.t];
    if (!live) continue;
    const g = TRIG[r.t];
    const p = live.p;
    const chg = r.p ? ((p / r.p) - 1) * 100 : null;   // r.p = giá tham chiếu phiên trước

    if (g && g[0] > 0) {
      const nguong = +g[0], klNguong = +g[1] || 0;
      const duKL = !klNguong || live.vol >= klNguong;
      if (p >= nguong && duKL && BAT.includes('signal')) {
        them('SIG' + r.t, r.t + ' — TÍN HIỆU MUA KÍCH HOẠT',
          'Giá ' + p.toFixed(2) + ' vượt ngưỡng ' + nguong.toFixed(2) + ' kèm dòng tiền đạt chuẩn.',
          r.t + ' KÍCH HOẠT MUA');
        continue;
      }
      if (p < nguong && p >= nguong * 0.985 && BAT.includes('near')) {
        them('NEAR' + r.t, r.t + ' — sát điểm mua',
          'Giá ' + p.toFixed(2) + ', còn cách ngưỡng ' + nguong.toFixed(2) + ' chưa tới 1,5%.',
          r.t + ' sát điểm mua');
      }
    }
    if (chg != null && BAT.includes('move')) {
      if (chg >= 4) them('W4' + r.t, r.t + ' +' + chg.toFixed(1) + '% — NÓNG MÁY',
        'Mã trong vùng theo dõi đang tăng tốc mạnh.', r.t + ' +' + chg.toFixed(1) + '%');
      else if (chg >= 2) them('W2' + r.t, r.t + ' +' + chg.toFixed(1) + '% — khởi động',
        'Mã trong vùng theo dõi bắt đầu chạy.', r.t + ' +' + chg.toFixed(1) + '%');
    }
  }
  return ra;
}

/* ---------- gửi ---------- */
/* Danh sach thiet bi lay tu Google Sheet (Apps Script), du phong PUSH_SUBS */
async function layDanhSach() {
  const ra = [];
  const api = process.env.SHEET_API, tok = process.env.SHEET_TOKEN;
  if (api && tok) {
    try {
      const r = await fetch(api + '?token=' + encodeURIComponent(tok),
        { redirect: 'follow', signal: AbortSignal.timeout(25000) });
      const j = await r.json();
      if (j && j.ok && Array.isArray(j.subs)) {
        console.log('Sheet trả về', j.subs.length, 'thiết bị');
        ra.push(...j.subs);
      } else console.error('Sheet trả lời không hợp lệ:', JSON.stringify(j).slice(0, 200));
    } catch (e) { console.error('Không gọi được Sheet:', e.message); }
  }
  /* Gop them PUSH_SUBS (may cam tay tu truoc) -> khong ai bi mat tin hieu
     trong luc chuyen sang dang ky qua Sheet. Trung endpoint thi bo. */
  try {
    const cu = JSON.parse(process.env.PUSH_SUBS || '[]');
    const da = new Set(ra.map(x => x.endpoint));
    cu.forEach(x => { if (x && x.endpoint && !da.has(x.endpoint)) { da.add(x.endpoint); ra.push(x); } });
  } catch (e) {}
  return ra;
}

/* Bao nguoc ve Sheet: may het han -> tat; gui thanh cong -> ghi moc thoi gian */
async function baoVeSheet(payload) {
  const api = process.env.SHEET_API, tok = process.env.SHEET_TOKEN;
  if (!api || !tok) return;
  try {
    await fetch(api, { method: 'POST', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(Object.assign({ token: tok }, payload)),
      signal: AbortSignal.timeout(20000) });
  } catch (e) { console.error('Không báo được về Sheet:', e.message); }
}

async function gui(tin) {
  const subs = await layDanhSach();
  if (!subs.length) { console.log('Chưa có thiết bị nào đăng ký.'); return; }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:khoanguyengstt@gmail.com',
    process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);

  let tieuDe, than, tag;
  if (tin.length === 1) { tieuDe = tin[0].tieuDe; than = tin[0].than; tag = tin[0].key; }
  else {
    tieuDe = tin.length + ' mã theo dõi đang chuyển động';
    than = tin.map(x => x.ngan).join('  ·  ');
    tag = 'kn-multi';
  }
  const payload = JSON.stringify({ title: tieuDe, body: than, tag, url: '/' });

  const daGui = [];
  for (const s of subs) {
    try {
      await webpush.sendNotification(s, payload, { TTL: 900, urgency: 'high' });
      daGui.push(s.endpoint);
      console.log('đã đẩy tới', String(s.endpoint).slice(0, 55) + '…');
    } catch (e) {
      console.error('đẩy lỗi', e.statusCode || '', e.message);
      if (e.statusCode === 404 || e.statusCode === 410) {
        console.error('  -> thiết bị hết hạn, tự tắt trong Sheet');
        await baoVeSheet({ action: 'dead', endpoint: s.endpoint });
      }
    }
  }
  if (daGui.length) await baoVeSheet({ action: 'sent', endpoints: daGui });
  return daGui.length;
}

/* ---------- chạy ---------- */
(async () => {
  /* Che do gui thu that: commit co [test-push] -> ban 1 thong bao roi thoat.
     Dung de kiem tra duong day sau khi cam thiet bi, khong dung luc chay lich. */
  if (process.env.TEST_PUSH === '1') {
    const gio = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(11, 19);
    await gui([{ key: 'kn-test-' + Date.now(),
      tieuDe: 'Khoa Nguyen Signal — thử từ máy chủ',
      than: 'Thông báo đẩy từ GitHub lúc ' + gio + ' giờ VN. Nếu bạn thấy dòng này lúc app đang đóng thì hệ thống đã chạy.',
      ngan: 'thử từ máy chủ' }]);
    ghiNhatKy({ ok: true, cheDo: 'TEST_PUSH', soThietBi: (JSON.parse(process.env.PUSH_SUBS || '[]')).length });
    return;
  }
  /* Tong ket cuoi phien — mot tin duy nhat luc ~14h50 */
  if (process.env.SUMMARY === '1') {
    const st0 = docState();
    const cb = Object.keys(st0.daBao || {});
    const sig = cb.filter(k => k.indexOf('SIG') === 0).map(k => k.slice(3));
    const nong = cb.filter(k => k.indexOf('W4') === 0).map(k => k.slice(2));
    const sat = cb.filter(k => k.indexOf('NEAR') === 0).map(k => k.slice(4));
    var than;
    if (!cb.length) than = 'Hôm nay không có mã nào đạt điều kiện. Hệ thống đứng ngoài.';
    else {
      const ph = [];
      if (sig.length) ph.push(sig.length + ' tín hiệu mua: ' + sig.join(', '));
      if (sat.length) ph.push(sat.length + ' mã sát điểm mua: ' + sat.join(', '));
      if (nong.length) ph.push(nong.length + ' mã tăng trên 4%: ' + nong.join(', '));
      than = ph.join('. ') + '.';
    }
    await gui([{ key: 'TK' + phienKey(), tieuDe: 'Tổng kết phiên ' +
      nowVN().toISOString().slice(8,10) + '/' + nowVN().toISOString().slice(5,7),
      than: than, ngan: 'tổng kết phiên' }]);
    ghiNhatKy({ ok: true, cheDo: 'SUMMARY', soCanhBao: cb.length });
    return;
  }
  if (!inSession()) { console.log('Ngoài giờ phiên — bỏ qua.'); return; }
  const codes = SUM.rows.filter(r => r.watch && !BO_CUNG.has(r.t)).map(r => r.t);
  if (!codes.length) { console.log('Watchlist rỗng.'); return; }
  console.log('Quét', codes.length, 'mã:', codes.join(','));

  const gia = await layGia(codes);
  const soMa = Object.keys(gia).length;
  console.log('Lấy được giá', soMa, '/', codes.length, 'mã');
  const mau = Object.entries(gia).slice(0, 3).map(([k, v]) => k + '=' + v.p);
  if (!soMa) {
    console.error('KHÔNG lấy được giá nào từ VPS — có thể bị chặn theo vùng.');
    ghiNhatKy({ ok: false, loi: 'VPS không trả dữ liệu', soMaQuet: codes.length, soMaLayDuoc: 0, dry: DRY });
    process.exit(0);
  }

  const st = docState();
  const tin = quet(gia, st);
  const soSub = (await layDanhSach()).length;
  ghiNhatKy({ ok: true, soMaQuet: codes.length, soMaLayDuoc: soMa, mauGia: mau,
              soCanhBao: tin.length, canhBao: tin.map(x => x.ngan), soThietBi: soSub, dry: DRY });

  if (!tin.length) { console.log('Không có cảnh báo mới.'); ghiState(st); return; }
  console.log('Cảnh báo mới:', tin.map(x => x.ngan).join(' | '));
  if (DRY) console.log('(DRY_RUN — không gửi thật)');
  else await gui(tin);
  ghiState(st);
})().catch(e => { console.error(e); process.exit(1); });
