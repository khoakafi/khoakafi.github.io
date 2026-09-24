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

/* Danh sach bo cung doc THANG tu dashboard_app.js de khong lech voi web.
   Truoc day chep tay vao day -> ben kia sua ma ben nay khong biet. */
function docBoCung() {
  try {
    const s = fs.readFileSync(path.join(ROOT, 'dashboard_app.js'), 'utf8');
    const m = s.match(/BO_CUNG\s*=\s*new Set\(\[([^\]]*)\]\)/);
    if (m) {
      const ds = m[1].split(',').map(x => x.replace(/['"\s]/g, '')).filter(Boolean);
      if (ds.length) { console.log('Bỏ cứng (đọc từ web):', ds.join(',')); return new Set(ds); }
    }
  } catch (e) {}
  return new Set(['DCL', 'VC3', 'SSB', 'KHG', 'VPI']);
}
const BO_CUNG = docBoCung();

/* ĐIỀU KIỆN BẮT BUỘC trước khi báo bất cứ bậc nào (theo bản chốt 28/08):
     st tồn tại  VÀ  st.c[0] không chứa chữ "YẾU"
   · st = null  -> nền hoặc thanh khoản không đạt -> im
   · "...HẠNG YẾU" -> cơ bản không đạt -> im
   Chỉ lọc theo wgrade là CHƯA ĐỦ: wgrade nói về cơ bản, st nói về nền.
   Ngày 28/08 có 4 mã (HDG, SHB, HSG, MBS) wgrade=strong nhưng st=null —
   lọc kiểu cũ là bắn tín hiệu mua giả cho khách. */
function duDieuKien(ma) {
  const t = (SIGS.t || {})[ma];
  const st = t && t.st;
  if (!st) return false;
  const nhan = String((st.c || [])[0] || '');
  return !/Y[EẾ]U/i.test(nhan);
}

/* 24/09/2026: web/app CHỈ còn B★ — máy chủ lọc y như web (dashboard_app.js lúc nạp SUM.rows):
   watch && wstar===1 && wgrade!=='weak' && nền >= 5% (nền < 5% engine ra B!, không bao giờ thành B★). */
function laSao(r) {
  return !!(r && r.watch && r.wstar === 1 && r.wgrade !== 'weak' && !(r.wrng < 5) && !BO_CUNG.has(r.t) && duDieuKien(r.t));
}
/* Luật tín hiệu: giá × TB KL 20 phiên GỒM phiên nổ ≥ 15 tỷ (web: knDuTK). v20 = TB 20 phiên đến hôm qua ≈ 19 phiên cũ. */
function duTK(r, p, vol) { return !!(r.v20 && p > 0 && p * (19 * r.v20 + (vol || 0)) / 20 / 1e6 >= 15); }
/* Ngưỡng kích hoạt tính từ giá đóng cửa ngày dữ liệu. Dữ liệu cũ quá (máy phát hành lỡ ngày) -> ngưỡng sai -> không báo mua. */
function duLieuMoi() {
  const d = String(SUM.updated || '').slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const tre = (Date.parse(phienKey()) - Date.parse(d)) / 86400000;
  return tre >= 1 && tre <= 4;
}
/* ---------- giờ phiên Việt Nam (UTC+7) ---------- */
function nowVN() { return new Date(Date.now() + 7 * 3600 * 1000); }
function gioVN() { const d = nowVN(); return d.getUTCHours() + d.getUTCMinutes() / 60; }
function ngayLamViec() { const dow = nowVN().getUTCDay(); return dow >= 1 && dow <= 5; }
function inSession() {
  if (process.env.FORCE_RUN === '1') return true;
  if (!ngayLamViec()) return false;
  const h = gioVN();
  return (h >= 9 && h < 11.5) || (h >= 13 && h < 14.84);
}
/* ATO 9:00-9:15, ATC 14:30-14:45: bảng giá chỉ có GIÁ DỰ KHỚP, chưa khớp thật -> không báo gì. */
function duKhop() {
  if (process.env.FORCE_RUN === '1') return null;
  const h = gioVN();
  return (h >= 9 && h < 9.25) ? 'ATO' : ((h >= 14.5 && h < 14.75) ? 'ATC' : null);
}
/* Tổng kết CHỈ được gửi ngay sau khi đóng cửa. GitHub Actions hay chạy trễ
   (có hôm trễ mấy tiếng) — không chặn thì khách nhận tổng kết lúc tối. */
function trongKhungTongKet() {
  if (process.env.FORCE_RUN === '1') return true;
  if (!ngayLamViec()) return false;
  const h = gioVN();
  return h >= 14.7 && h < 16;
}
/* Thân tin phải có chữ thật. Trước đây tổng kết ghép chuỗi rỗng + '.' -> khách
   nhận được đúng một dấu chấm. Không bao giờ để chuyện đó lặp lại. */
function coNoiDung(s) {
  return typeof s === 'string' &&
    s.replace(/[^0-9A-Za-zÀ-ỹ]/g, '').length >= 8;
}
function catGon(s, n) {
  s = String(s || '').trim();
  return s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,·]+$/, '') + '…';
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
        if (gia > 0) out[String(x.sym).toUpperCase()] = { p: gia, vol: kl * (x.lot ? 10 : 1), ref: Number(x.r) || 0 };
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
function ghiState(st) { if (DRY) { console.log('(DRY_RUN — không ghi state, không chiếm khóa chống trùng)'); return; } fs.writeFileSync(STATE_FILE, JSON.stringify(st, null, 1)); }
/* Nhat ky lan chay gan nhat — commit len nhanh push-state de soi tu xa */
function ghiNhatKy(o){
  try { fs.writeFileSync(path.join(path.dirname(STATE_FILE), '.push-run.json'),
    JSON.stringify(Object.assign({ luc: new Date().toISOString() }, o), null, 1)); } catch(e){}
}

/* ---------- luật báo ---------- */
function quet(gia, st) {
  const BAT = (process.env.ALERT_KINDS || 'signal,near,move').split(',');
  const ra = [];
  const them = (key, tieuDe, than, ngan, ma) => {
    if (st.daBao[key]) return;
    st.daBao[key] = Date.now();
    ra.push({ key, tieuDe, than, ngan, ma });
  };

  for (const r of SUM.rows) {
    /* Cong kiem duy nhat cho ca 3 bac (SIG / NEAR / W2-W4) */
    if (!laSao(r)) continue;
    const live = gia[r.t];
    if (!live) continue;
    const g = TRIG[r.t];
    const p = live.p;
    const ref = live.ref > 0 ? live.ref : r.p;          // giá tham chiếu HÔM NAY từ VPS (r.p có thể là phiên cũ)
    const chg = ref ? ((p / ref) - 1) * 100 : null;

    if (g && g[0] > 0 && duLieuMoi()) {
      const nguong = +g[0], klNguong = +g[1] || 0;
      const duKL = !klNguong || live.vol >= klNguong;
      if (p >= nguong && duKL && duTK(r, p, live.vol) && BAT.includes('signal')) {
        them('SIG' + r.t, r.t + ' — TÍN HIỆU MUA KÍCH HOẠT',
          'Giá ' + p.toFixed(2) + ' vượt ngưỡng ' + nguong.toFixed(2) + ' kèm dòng tiền đạt chuẩn.',
          r.t + ' KÍCH HOẠT MUA', r.t);
        continue;
      }
      if (p < nguong && p >= nguong * 0.985 && BAT.includes('near')) {
        them('NEAR' + r.t, r.t + ' — sát điểm mua',
          'Giá ' + p.toFixed(2) + ', còn cách ngưỡng ' + nguong.toFixed(2) + ' chưa tới 1,5%.',
          r.t + ' sát điểm mua', r.t);
      }
    }
    if (chg != null && BAT.includes('move')) {
      if (chg >= 4) them('W4' + r.t, r.t + ' +' + chg.toFixed(1) + '% — NÓNG MÁY',
        'Mã trong vùng theo dõi đang tăng tốc mạnh.', r.t + ' +' + chg.toFixed(1) + '%', r.t);
      else if (chg >= 2) them('W2' + r.t, r.t + ' +' + chg.toFixed(1) + '% — khởi động',
        'Mã trong vùng theo dõi bắt đầu chạy.', r.t + ' +' + chg.toFixed(1) + '%', r.t);
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
    cu.forEach(x => { if (x && x.endpoint) ra.push(x); });
  } catch (e) {}

  /* Bo trung theo endpoint tren TOAN BO danh sach — ke ca trung ngay trong Sheet.
     Hai khach bam dang ky cung luc co the sinh 2 dong cung mot may; khong loc thi
     may do nhan 2 thong bao giong het nhau. */
  const thay = new Set(), sach = [];
  for (const s of ra) {
    if (!s || !s.endpoint || thay.has(s.endpoint)) continue;
    thay.add(s.endpoint); sach.push(s);
  }
  if (sach.length !== ra.length) console.log('Bỏ', ra.length - sach.length, 'thiết bị trùng endpoint');
  console.log('Tổng cộng', sach.length, 'thiết bị sẽ nhận');
  return sach;
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

  let tieuDe, than, tag, url, ma = '';
  if (tin.length === 1) {
    tieuDe = tin[0].tieuDe; than = tin[0].than; tag = tin[0].key;
    ma = tin[0].ma || '';
    /* Bấm vào tin 1 mã -> mở thẳng tab Chi tiết mã đó. Tin nhiều mã -> mở Watchlist. */
    url = ma ? '/?ma=' + encodeURIComponent(ma) + '&src=push' : (tin[0].url || '/?src=push');
  } else {
    tieuDe = tin.length + ' mã theo dõi đang chuyển động';
    than = tin.map(x => x.ngan).join('  ·  ');
    tag = 'kn-multi';
    url = '/?tab=watch&src=push';
  }
  /* Luật cuối cùng trước khi bắn: tiêu đề và thân phải có chữ thật. */
  if (!coNoiDung(tieuDe) || !coNoiDung(than)) {
    console.error('BỎ GỬI — nội dung rỗng/không hợp lệ:', JSON.stringify({ tieuDe, than }));
    ghiNhatKy({ ok: false, loi: 'noi dung rong', tieuDe: tieuDe, than: than });
    return 0;
  }
  than = catGon(than, 180);
  const payload = JSON.stringify({ title: tieuDe, body: than, tag, url, ma });

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
    /* Noi dung tin thu doc tu scripts/.trigger:
         dong 1 = tieu de, cac dong sau = noi dung. Bo trong thi dung mac dinh. */
    let tt = '', tb = '';
    try {
      const raw = fs.readFileSync(path.join(ROOT, 'scripts/.trigger'), 'utf8').trim().split('\n');
      if (raw[0] && !/^\d{4}-\d{2}-\d{2}T/.test(raw[0])) {
        tt = raw[0].trim();
        tb = raw.slice(1).join(' ').trim();
      }
    } catch (e) {}
    await gui([{ key: 'kn-test-' + Date.now(),
      tieuDe: tt || 'Khoa Nguyen Signal — thử từ máy chủ',
      than: tb || 'Thông báo đẩy từ GitHub lúc ' + gio + ' giờ VN. Nếu bạn thấy dòng này lúc app đang đóng thì hệ thống đã chạy.',
      ngan: 'thử từ máy chủ' }]);
    ghiNhatKy({ ok: true, cheDo: 'TEST_PUSH', soThietBi: (JSON.parse(process.env.PUSH_SUBS || '[]')).length });
    return;
  }
  /* Tổng kết cuối phiên — một tin duy nhất, ngay sau khi đóng cửa.
     LUẬT:
       1. Chỉ gửi trong khung 14:45–16:00 giờ VN của ngày giao dịch. Workflow chạy
          trễ (GitHub hay dồn việc) thì BỎ, không gửi lúc tối.
       2. Mỗi phiên gửi đúng 1 lần — chạy lại workflow không bắn lại.
       3. Số liệu phải là số ĐÓNG CỬA, hỏi lại giá rồi mới viết. Mã từng bật >4%
          trong phiên nhưng đóng cửa thấp hơn thì KHÔNG được xếp vào nhóm "trên 4%".
       4. Thân tin rỗng -> không gửi (hàm gui() chặn lần cuối). */
  if (process.env.SUMMARY === '1') {
    if (!trongKhungTongKet()) {
      console.log('Ngoài khung tổng kết (' + gioVN().toFixed(2) + 'h VN) — bỏ qua.');
      ghiNhatKy({ ok: true, cheDo: 'SUMMARY', boQua: 'ngoai khung gio', gioVN: +gioVN().toFixed(2) });
      return;
    }
    const st0 = docState();
    const khoaTK = 'TK' + phienKey();
    if (st0.daBao && st0.daBao[khoaTK]) {
      console.log('Tổng kết phiên này đã gửi rồi — bỏ qua.');
      ghiNhatKy({ ok: true, cheDo: 'SUMMARY', boQua: 'da gui' });
      return;
    }
    /* Nổ ở phiên ATC (14:30-14:45) thì lần quét trong phiên không thấy -> quét lại TOÀN BỘ danh sách B★ bằng giá đóng cửa. */
    if (duLieuMoi() && gioVN() >= 14.75) {
      const ds = SUM.rows.filter(laSao), dong = await layGia(ds.map(r => r.t));
      ds.forEach(r => { const g = TRIG[r.t], L = dong[r.t]; if (!g || !L || st0.daBao['SIG' + r.t]) return;
        if (L.p >= +g[0] && (!+g[1] || L.vol >= +g[1]) && duTK(r, L.p, L.vol)) { st0.daBao['SIG' + r.t] = Date.now(); console.log('SIG lúc đóng cửa:', r.t); } });
    }
    const cb = Object.keys(st0.daBao || {});
    const lay = pre => cb.filter(k => k.indexOf(pre) === 0).map(k => k.slice(pre.length));
    const sig = lay('SIG'), sat = lay('NEAR'), w4 = lay('W4'), w2 = lay('W2');

    /* Hỏi lại giá đóng cửa của đúng những mã đã báo trong phiên */
    const canHoi = [...new Set([].concat(sig, sat, w4, w2))];
    const chot = canHoi.length ? await layGia(canHoi) : {};
    const refOf = t => { const r = (SUM.rows || []).find(x => x.t === t); return r && r.p; };
    const chgOf = t => {
      const live = chot[t], ref = refOf(t);
      if (!live || !(ref > 0)) return null;
      return ((live.p / ref) - 1) * 100;
    };
    const keo = t => { const c = chgOf(t); return c == null ? t : t + ' ' + (c >= 0 ? '+' : '') + c.toFixed(1).replace('.', ',') + '%'; };

    /* Phân loại lại theo giá ĐÓNG CỬA, không dùng lại nhãn lúc báo trong phiên */
    const daBat = [...new Set([].concat(w4, w2))];
    const coSo = daBat.some(t => chgOf(t) != null);
    const tren4 = daBat.filter(t => (chgOf(t) || 0) >= 4);
    const haNhiet = daBat.filter(t => w4.includes(t) && (chgOf(t) || 0) < 4);
    const conLai = daBat.filter(t => !tren4.includes(t) && !haNhiet.includes(t) && (chgOf(t) || 0) >= 2);

    let than;
    if (!cb.length) {
      than = 'Hôm nay không có mã nào đạt điều kiện. Hệ thống đứng ngoài, không mua đuổi.';
    } else {
      const ph = [];
      if (sig.length) ph.push('Tín hiệu mua: ' + sig.map(keo).join(', '));
      if (sat.length) ph.push('Sát điểm mua: ' + sat.join(', '));
      if (!coSo) {
        /* Không hỏi được giá đóng cửa -> chỉ nêu tên, tuyệt đối không phán số */
        if (daBat.length) ph.push('Có chuyển động trong phiên: ' + daBat.join(', '));
      } else {
        if (tren4.length) ph.push('Đóng cửa trên +4%: ' + tren4.map(keo).join(', '));
        if (conLai.length) ph.push('Tăng khá: ' + conLai.map(keo).join(', '));
        if (haNhiet.length) ph.push('Bật mạnh rồi hạ nhiệt: ' + haNhiet.map(keo).join(', '));
      }
      than = ph.length ? ph.join('. ') + '.'
                       : 'Phiên nay không có mã nào giữ được nhịp tới cuối phiên.';
    }
    const d = nowVN();
    const soGui = await gui([{ key: khoaTK,
      tieuDe: 'Tổng kết phiên ' + d.toISOString().slice(8, 10) + '/' + d.toISOString().slice(5, 7),
      than: than, ngan: 'tổng kết phiên', url: '/?tab=watch&src=push' }]);
    if (soGui) { st0.daBao[khoaTK] = Date.now(); ghiState(st0); }
    ghiNhatKy({ ok: true, cheDo: 'SUMMARY', soCanhBao: cb.length, than: than, soGui: soGui || 0 });
    return;
  }
  if (!inSession()) { console.log('Ngoài giờ phiên — bỏ qua.'); return; }
  if (duKhop()) { console.log(duKhop() + ' — chỉ có giá dự khớp, chưa khớp thật — bỏ qua.'); ghiNhatKy({ ok: true, boQua: duKhop() }); return; }
  if (!duLieuMoi()) console.log('Dữ liệu ' + SUM.updated + ' không phải phiên trước — chỉ báo +2%/+4%, không báo mua.');
  /* Chi hoi gia nhung ma thuc su co the bao -> nhe hon, va khop voi luat quet */
  const codes = SUM.rows.filter(laSao).map(r => r.t);
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
