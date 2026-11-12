/* scripts/khoi-ngoai.mjs — dựng khoingoai_data.js cho tab "Khối ngoại" (12/11/2026).
   Chạy trên runner GitHub (workflow khoi-ngoai.yml) vì trình duyệt tải 60 phiên × 2.500 mã thì quá nặng.
   Nguồn: VNDirect finfo
     - foreigns?q=tradingDate:D  : mua/bán/ròng (KL, GT) + room (currentRoom, totalRoom) của MỌI mã, chỉ số, phái sinh
     - stock_prices?q=date:D     : giá đóng cửa điều chỉnh (adClose) để so ròng với diễn biến giá
   Số của VNDirect khớp bảng giá VPS (fBVol×10, fBValue×1000) — đã đối chiếu MBB/FPT/VIC/TCB 12/11/2026.
   % sở hữu = (totalRoom − currentRoom) ÷ số CP; số CP = vốn hóa (dashboard_data.js) ÷ giá. Khớp CafeF (ACB 21,98%).
   Hỏng / thiếu thì KHÔNG ghi file (giữ bản cũ). */
import fs from 'node:fs';

const N = +(process.env.SO_PHIEN || 60);
const API = 'https://api-finfo.vndirect.com.vn/v4';
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', 'Accept': 'application/json' };

async function lay(url, thu = 4){
  for (let i = 0; i < thu; i++){
    try { const r = await fetch(url, { headers: UA }); if (r.ok) return await r.json(); console.warn('HTTP', r.status, url); }
    catch(e){ console.warn('loi', e.message, url); }
    await new Promise(r => setTimeout(r, 1500 * (i + 1)));
  }
  throw new Error('khong tai duoc ' + url);
}

/* ---- Vũ trụ mã + ngành (từ chính file web) ---- */
function docJs(path, ten){
  const s = fs.readFileSync(path, 'utf8'); const i = s.indexOf('{', s.indexOf(ten));
  let d = 0, j = i; for (; j < s.length; j++){ if (s[j] === '{') d++; else if (s[j] === '}' && --d === 0) break; }
  return JSON.parse(s.slice(i, j + 1));
}
const SUM = docJs('dashboard_data.js', 'window.SUMMARY');
const SEC = docJs('dashboard_app.js', 'const SEC_MAP');
const ROWS = {}; for (const r of SUM.rows) ROWS[r.t] = r;
console.log('vu tru', Object.keys(ROWS).length, 'ma; SEC_MAP', Object.keys(SEC).length);

/* ---- Phiên giao dịch: theo dòng VNINDEX ---- */
const vni = await lay(`${API}/foreigns?q=code:VNINDEX&sort=tradingDate:desc&size=${N}`);
const NGAY = vni.data.map(x => x.tradingDate).sort();
if (NGAY.length < Math.min(40, N)) throw new Error('it phien: ' + NGAY.length);
console.log('phien', NGAY[0], '->', NGAY[NGAY.length - 1], NGAY.length);

const CHI_SO = { VNINDEX: 'VNINDEX', VN30: 'VN30', HNX: 'HNX', UPCOM: 'UPCOM', FU: 'FU_HNX' };
const F = {};   // code -> [row|null per ngày]
const P = {};   // code -> [adClose per ngày]
const GT = {};  // code -> [giá trị giao dịch khớp + thoả thuận per ngày] (số ngoại của VNDirect gồm cả thoả thuận)
for (let k = 0; k < NGAY.length; k++){
  const d = NGAY[k];
  const [f, p] = await Promise.all([
    lay(`${API}/foreigns?q=tradingDate:${d}&size=4000`),
    lay(`${API}/stock_prices?q=date:${d}&size=4000&fields=code,adClose,close,nmValue,ptValue`)
  ]);
  let n = 0;
  for (const x of f.data){ const c = x.code; if (!ROWS[c] && !Object.values(CHI_SO).includes(c)) continue;
    (F[c] ||= Array(NGAY.length).fill(null))[k] = x; n++; }
  for (const x of p.data){ if (!ROWS[x.code]) continue; (P[x.code] ||= Array(NGAY.length).fill(null))[k] = x.adClose ?? x.close;
    (GT[x.code] ||= Array(NGAY.length).fill(0))[k] = (+x.nmValue || 0) + (+x.ptValue || 0); }
  console.log(d, 'foreigns', f.data.length, '-> giu', n, '| gia', p.data.length);
  if (f.data.length < 500) throw new Error('phien ' + d + ' thieu du lieu foreigns: ' + f.data.length);
}

/* ---- Gói gọn ---- */
const ty = v => v == null ? null : Math.round(v / 1e7) / 100;           // VND -> tỷ, 2 số lẻ
const m = {};
for (const [k, c] of Object.entries(CHI_SO)){ const a = F[c]; if (!a) continue;
  m[k] = { b: a.map(x => x ? ty(x.buyVal) : null), s: a.map(x => x ? ty(x.sellVal) : null) }; }

const s = {}; let co = 0;
for (const [c, r] of Object.entries(ROWS)){
  const a = F[c]; if (!a) continue;
  const net = a.map(x => x ? ty(x.netVal) : null);
  const coGd = a.some(x => x && (x.buyVal > 0 || x.sellVal > 0));
  const cuoi = a[a.length - 1] || a.slice().reverse().find(Boolean);
  if (!coGd || !(r.val20 >= 500)) continue;                                // bỏ mã không có giao dịch ngoại / GTGD TB20 < 0,5 tỷ
  const sh = r.cap > 0 && r.p > 0 ? r.cap * 1e9 / (r.p * 1000) : 0;         // số CP ước tính
  /* % sở hữu theo ngày = (1 − room còn ÷ room tối đa) × trần %. Không chia cho số CP từng ngày: room tối đa đổi theo đợt phát hành
     (FPT 29/10 nhảy 23,8% -> 26,0% chỉ vì đổi số CP) -> quy về tỷ lệ trên room thì liền mạch. Trần % = room tối đa phiên cuối ÷ số CP. */
  const limPct = (sh > 0 && cuoi && cuoi.totalRoom > 0) ? cuoi.totalRoom / sh * 100 : null;
  const own = a.map(x => (x && limPct && x.totalRoom > 0) ? Math.round((1 - x.currentRoom / x.totalRoom) * limPct * 100) / 100 : null);
  s[c] = {
    sec: (SEC[c] || '').trim(), san: r.b, ten: r.n, cap: r.cap, v20: r.val20, p: r.p,
    lim: (sh > 0 && cuoi && cuoi.totalRoom > 0) ? Math.round(cuoi.totalRoom / sh * 1e4) / 100 : null,
    room: cuoi ? cuoi.currentRoom : null, tr: cuoi ? cuoi.totalRoom : null, sh: Math.round(sh),
    n: net, o: own, bt: cuoi ? ty(cuoi.buyVal) : 0, xt: cuoi ? ty(cuoi.sellVal) : 0,
    /* tổng 1 / 5 / 20 phiên: ngoại mua, ngoại bán, giá trị giao dịch toàn mã (tỷ) -> "ngoại chiếm bao nhiêu % giao dịch" */
    kb: [1, 5, 20].map(k => ty(a.slice(-k).reduce((t, x) => t + (x ? x.buyVal : 0), 0))),
    kx: [1, 5, 20].map(k => ty(a.slice(-k).reduce((t, x) => t + (x ? x.sellVal : 0), 0))),
    kg: [1, 5, 20].map(k => ty((GT[c] || []).slice(-k).reduce((t, v) => t + (v || 0), 0))),
    px: (P[c] || []).map(v => v == null ? null : +(+v).toFixed(2))
  };
  co++;
}
if (co < 150) throw new Error('qua it ma: ' + co);
const out = { asof: NGAY[NGAY.length - 1], tao: new Date().toISOString(), d: NGAY, m, s };
fs.writeFileSync('khoingoai_data.js', 'window.KNG=' + JSON.stringify(out) + ';\n');
console.log('ghi khoingoai_data.js', co, 'ma,', (fs.statSync('khoingoai_data.js').size / 1024).toFixed(0), 'KB');
