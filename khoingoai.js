/* ===== khoingoai.js — Tab "Khối ngoại" (12/11/2026, anh Khoa: "như FireAnt nhưng nhìn ra insight, đa chiều, sang") =====
   Dữ liệu cuối phiên: khoingoai_data.js (window.KNG) — workflow khoi-ngoai.yml (scripts/khoi-ngoai.mjs) dựng sau phiên, 60 phiên, VNDirect.
   Trong phiên: luỹ kế hôm nay của từng mã lấy bảng giá VPS (fBVol×10, fBValue×1000 = đúng số VNDirect), chỉ số + phái sinh lấy VNDirect.
   Nạp lười: chỉ tải khi mở tab. Không có số thì ghi rõ, không bịa. */
(function(){
  const G = '#18A34B', GD = '#0F7A3A', R = '#E5484D', INK = '#12203A', MUT = '#64748B', GRID = '#EEF1F4', SL = '#94A3B8';
  const $ = s => document.querySelector(s);
  const vn = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : x.toLocaleString('vi-VN', {minimumFractionDigits:d, maximumFractionDigits:d});
  const sg = (x, d = 1) => (x == null || !isFinite(x)) ? '—' : (x > 0 ? '+' : x < 0 ? '−' : '') + vn(Math.abs(x), d);
  const ty = x => sg(x, Math.abs(x) >= 100 ? 0 : 1) + ' tỷ';
  const dm = d => d.slice(8,10) + '/' + d.slice(5,7);
  const mau = x => x > 0 ? G : x < 0 ? R : SL;
  const sum = (a, k) => a.slice(-k).reduce((s, v) => s + (v || 0), 0);
  const NGANH = [
    ['Ngân hàng', /^Ngân hàng/], ['Chứng khoán', /Dịch vụ tài chính/], ['Bất động sản', /Bất Động Sản/],
    ['Xây dựng & VL', /Xây dựng/], ['Thép & kim loại', /Kim loại/], ['Dầu khí', /dầu khí|Dầu/i], ['Hóa chất & phân bón', /Hóa chất/],
    ['Thực phẩm & đồ uống', /thực phẩm|Đồ uống|Thuốc lá/i], ['Bán lẻ', /Bán lẻ/], ['Điện, nước, khí', /Điện lực|Ga, nước/],
    ['Vận tải & cảng', /Giao thông/], ['Công nghệ', /Phần mềm|công nghệ phần cứng|Viễn thông/], ['Bảo hiểm', /Bảo hiểm/],
    ['Hàng không & du lịch', /Du lịch/], ['Thiết bị điện', /Dụng cụ điện/], ['Dệt may & tiêu dùng', /Hàng hóa cá nhân|Hàng gia dụng|giải trí/]
  ];
  const nganh = s => { for (const [t, re] of NGANH) if (re.test(s || '')) return t; return 'Khác'; };
  let D = null, KY = '5', charts = {}, live = null, liveT = 0, tkMa = '', timer = 0;

  /* ---------- CSS ---------- */
  function css(){
    if (document.getElementById('kngcss')) return;
    const s = document.createElement('style'); s.id = 'kngcss';
    s.textContent = `
#view-kng{--kg:${G};--kr:${R};--ink:${INK};--mu:${MUT}}
#view-kng .kn-card{background:#fff;border:1px solid #E6EBEF;border-radius:16px;box-shadow:0 1px 2px rgba(18,32,58,.04),0 12px 32px -24px rgba(18,32,58,.35);padding:18px 20px;margin-bottom:16px}
#view-kng .kn-card{overflow-x:auto;min-width:0}#view-kng .kn-g2>*,#view-kng .kn-g3>*,#view-kng .kn-tk>*{min-width:0}#view-kng .kn-kpi>*{min-width:0}
#view-kng .kn-ey{font:800 11px/1 Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${GD}}
#view-kng .kn-h{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:6px 0 2px}
#view-kng .kn-h h2{font-size:19px;font-weight:800;color:${INK};margin:0;letter-spacing:-.01em}
#view-kng .kn-sub{font-size:13px;color:${MUT};margin:0 0 12px;line-height:1.5}
#view-kng .kn-top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:2px 0 14px}
#view-kng .kn-top h1{font-size:24px;font-weight:800;color:${INK};margin:0;letter-spacing:-.02em}
#view-kng .kn-live{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:${GD};background:#ECF7F0;border:1px solid #CDEBD8;border-radius:999px;padding:4px 12px}
#view-kng .kn-live i{width:7px;height:7px;border-radius:50%;background:${G};box-shadow:0 0 0 3px rgba(24,163,75,.2);animation:knp 1.6s infinite}
#view-kng .kn-live.eod{color:${MUT};background:#F3F5F8;border-color:#E3E8EE}#view-kng .kn-live.eod i{background:${SL};box-shadow:none;animation:none}
@keyframes knp{50%{opacity:.35}}
#view-kng .kn-kpi{display:grid;grid-template-columns:1.35fr repeat(4,1fr);gap:12px;margin-bottom:16px}
#view-kng .kn-k{background:#fff;border:1px solid #E6EBEF;border-radius:14px;padding:14px 16px;position:relative;overflow:hidden}
#view-kng .kn-k.main{background:linear-gradient(135deg,#0F2A1E,#12203A);border:0;color:#fff}
#view-kng .kn-k .l{font-size:12px;font-weight:700;color:${MUT};letter-spacing:.02em}
#view-kng .kn-k.main .l{color:#A7C4B3}
#view-kng .kn-k .v{font-size:26px;font-weight:800;letter-spacing:-.02em;margin:4px 0 2px;font-variant-numeric:tabular-nums}
#view-kng .kn-k.main .v{font-size:34px}
#view-kng .kn-k .s{font-size:12px;color:${MUT}}#view-kng .kn-k.main .s{color:#C9D6CF}
#view-kng .kn-k .bar{display:flex;height:6px;border-radius:4px;overflow:hidden;margin-top:9px;background:#ffffff22}
#view-kng .kn-g2{display:grid;grid-template-columns:1.1fr .9fr;gap:16px}
#view-kng .kn-ch{position:relative;height:210px}#view-kng .kn-ch.sm{height:120px}#view-kng .kn-ch.q{height:400px}
#view-kng .kn-seg{display:inline-flex;background:#F1F4F7;border-radius:10px;padding:3px;gap:2px;margin-left:auto}
#view-kng .kn-seg button{border:0;background:none;font:700 12.5px Inter,sans-serif;color:${MUT};padding:6px 12px;border-radius:8px;cursor:pointer}
#view-kng .kn-seg button.on{background:#fff;color:${INK};box-shadow:0 1px 3px rgba(18,32,58,.12)}
#view-kng table.kn-t{width:100%;border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums}
#view-kng .kn-t th{font-size:11px;font-weight:700;color:${MUT};text-align:right;padding:6px 8px;border-bottom:1px solid #E6EBEF;white-space:nowrap}
#view-kng .kn-t th:first-child,#view-kng .kn-t td:first-child{text-align:left}
#view-kng .kn-t td{padding:7px 8px;border-bottom:1px solid #F1F4F7;text-align:right;white-space:nowrap}
#view-kng .kn-t tr.ck{cursor:pointer}#view-kng .kn-t tr.ck:hover td{background:#F7FAF8}
#view-kng .kn-t td b{color:${INK}}#view-kng .kn-t .tg{font-size:11px;color:${MUT};font-weight:500;margin-left:6px}
#view-kng .kn-db{display:flex;align-items:center;gap:6px;justify-content:flex-end}
#view-kng .kn-db span{display:inline-block;height:8px;border-radius:3px}
#view-kng .kn-hm{border-radius:6px;padding:3px 8px;font-weight:700;display:inline-block;min-width:62px}
#view-kng .kn-own{display:flex;align-items:center;gap:7px;justify-content:flex-end}
#view-kng .kn-own .tr{position:relative;width:70px;height:7px;border-radius:4px;background:#EEF1F4;overflow:hidden}
#view-kng .kn-own .tr i{position:absolute;left:0;top:0;bottom:0;background:${INK};border-radius:4px}
#view-kng .kn-chip{display:inline-block;font-size:11px;font-weight:700;border-radius:6px;padding:2px 7px;white-space:nowrap}
#view-kng .kn-q4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px}
#view-kng .kn-q4>div{border-radius:12px;padding:10px 12px;border:1px solid #E6EBEF}
#view-kng .kn-q4 b{display:block;font-size:13px;color:${INK}}#view-kng .kn-q4 span{font-size:12px;color:${MUT};line-height:1.45}
#view-kng .kn-q4 em{font-style:normal;font-weight:700;font-size:12px}
#view-kng .kn-g2.eq{grid-template-columns:1fr 1fr;gap:24px}
#view-kng .kn-sb{font-size:13px;font-weight:800;color:${INK};margin:4px 0 6px}
#view-kng .kn-ng{display:grid;grid-template-columns:150px 1fr 64px 44px 84px;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #F1F4F7;font-size:13px}
#view-kng .kn-g2.eq .kn-ng{grid-template-columns:110px 1fr 56px}
#view-kng .kn-ng .t{font-weight:700;color:${INK};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#view-kng .kn-ng .b{position:relative;height:10px;background:linear-gradient(90deg,transparent calc(50% - .5px),#CBD5E1 calc(50% - .5px),#CBD5E1 calc(50% + .5px),transparent calc(50% + .5px))}
#view-kng .kn-ng .b i{position:absolute;top:0;bottom:0;border-radius:3px}
#view-kng .kn-ng .v{text-align:right;font-weight:800;font-variant-numeric:tabular-nums}
#view-kng .kn-ng .m{font-size:11.5px;font-weight:700;color:${INK};text-align:right}#view-kng .kn-ng .x{font-size:11px;color:${MUT};text-align:right;white-space:nowrap}
#view-kng .kn-ng.ck{cursor:pointer}#view-kng .kn-ng.ck:hover{background:#F7FAF8}
#view-kng .kn-tkr{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;margin:12px 0 4px}
#view-kng .kn-tkr div{background:#F6F8FA;border-radius:10px;padding:8px 10px}
#view-kng .kn-tkr span{display:block;font-size:11px;color:${MUT};font-weight:600;white-space:nowrap}#view-kng .kn-tkr b{font-size:16px;color:${INK};white-space:nowrap}
#view-kng .kn-g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
#view-kng .kn-lst{list-style:none;margin:0;padding:0}
#view-kng .kn-lst li{display:flex;align-items:center;gap:10px;padding:8px 2px;border-bottom:1px solid #F1F4F7;cursor:pointer;font-size:13px}
#view-kng .kn-lst li:hover{background:#F7FAF8}
#view-kng .kn-lst li b{width:44px;color:${INK}}#view-kng .kn-lst li .x{flex:1;color:${MUT};font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#view-kng .kn-tk{display:grid;grid-template-columns:260px 1fr;gap:20px}
#view-kng .kn-tk input{width:100%;border:1.5px solid #E1E7ED;border-radius:12px;padding:10px 14px;font:700 15px Inter,sans-serif;text-transform:uppercase;outline:none}
#view-kng .kn-tk input:focus{border-color:${G}}
#view-kng .kn-st{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
#view-kng .kn-st div{background:#F6F8FA;border-radius:10px;padding:9px 11px}
#view-kng .kn-st span{display:block;font-size:11px;color:${MUT};font-weight:600}#view-kng .kn-st b{font-size:16px;color:${INK}}
#view-kng .kn-note{font-size:11.5px;color:${SL};margin-top:10px;line-height:1.5}
#view-kng .kn-ins{display:flex;flex-direction:column;gap:8px;margin:2px 0 14px}
#view-kng .kn-ins div{display:flex;gap:10px;align-items:baseline;font-size:13.5px;color:#334155;line-height:1.5}
#view-kng .kn-ins i{flex:none;width:7px;height:7px;border-radius:50%;margin-top:6px}
@media(max-width:1000px){#view-kng .kn-g2.eq{grid-template-columns:1fr}#view-kng .kn-tkr{grid-template-columns:repeat(2,1fr)}#view-kng .kn-ng{grid-template-columns:120px 1fr 56px}#view-kng .kn-kpi{grid-template-columns:1fr 1fr}#view-kng .kn-k.main{grid-column:1/-1}
  #view-kng .kn-g2,#view-kng .kn-g3,#view-kng .kn-tk{grid-template-columns:1fr}#view-kng .kn-q4{grid-template-columns:1fr 1fr}
  #view-kng .kn-ch.q{height:330px}#view-kng .kn-card{padding:14px 13px}#view-kng .kn-hide{display:none}}
`;
    document.head.appendChild(s);
  }

  /* ---------- Dữ liệu ---------- */
  function napData(){
    return new Promise((ok, loi) => {
      if (window.KNG) return ok(window.KNG);
      const sc = document.createElement('script'); sc.src = 'khoingoai_data.js?t=' + Math.floor(Date.now() / 300000);
      sc.onload = () => window.KNG ? ok(window.KNG) : loi(new Error('trống')); sc.onerror = () => loi(new Error('không tải được'));
      document.head.appendChild(sc);
    });
  }
  const gioVN = () => { const d = new Date(Date.now() + 7*3600e3); return {ngay: d.toISOString().slice(0,10), h: d.getUTCHours() + d.getUTCMinutes()/60, w: d.getUTCDay(), hm: d.toISOString().slice(11,16)}; };
  async function napLive(){
    const g = gioVN(); if (g.w < 1 || g.w > 5 || g.h < 9.25) return null;
    if (!D || g.ngay <= D.asof) return null;                                   // file cuối phiên đã có hôm nay
    const ma = Object.keys(D.s).sort((a, b) => (D.s[b].v20 || 0) - (D.s[a].v20 || 0)).slice(0, 260);
    const out = {ngay: g.ngay, hm: g.hm, s: {}, m: {}};
    const lo = []; for (let i = 0; i < ma.length; i += 65) lo.push(ma.slice(i, i + 65));
    await Promise.all(lo.map(async l => { try {
      const j = await (await fetch('https://bgapidatafeed.vps.com.vn/getliststockdata/' + l.join(','), {cache: 'no-store'})).json();
      (j || []).forEach(x => { const b = (+x.fBValue || 0) * 1000 / 1e9, se = (+x.fSValue || 0) * 1000 / 1e9;
        out.s[x.sym] = {b, x: se, n: b - se, room: (+x.fRoom || 0) * 10, p: +x.lastPrice || null, g: (+x.lot || 0) * 10 * (+x.avePrice || 0) * 1000 / 1e9}; });
    } catch(e){} }));
    try { const j = await (await fetch('https://api-finfo.vndirect.com.vn/v4/foreigns?q=code:VNINDEX,HNX,UPCOM,FU_HNX~tradingDate:' + g.ngay + '&size=10', {cache: 'no-store'})).json();
      (j.data || []).forEach(x => { out.m[x.code] = {b: x.buyVal / 1e9, x: x.sellVal / 1e9}; }); } catch(e){}
    if (!Object.keys(out.s).length) return null;
    return out;
  }

  /* ---------- Tính chỉ số ---------- */
  function tinh(){
    const d = D.d.slice(), L0 = d.length;
    const mk = k => { const m = D.m[k]; return m ? m.b.map((b, i) => (b || 0) - (m.s[i] || 0)) : Array(L0).fill(0); };
    let co = mk('VNINDEX').map((v, i) => v + mk('HNX')[i] + mk('UPCOM')[i]);
    let fu = mk('FU');
    let bTong = ['VNINDEX','HNX','UPCOM'].reduce((s, k) => s + ((D.m[k] && D.m[k].b[L0-1]) || 0), 0);
    let xTong = ['VNINDEX','HNX','UPCOM'].reduce((s, k) => s + ((D.m[k] && D.m[k].s[L0-1]) || 0), 0);
    if (live) {
      d.push(live.ngay);
      const lm = k => live.m[k] ? live.m[k].b - live.m[k].x : null;
      let hn = ['VNINDEX','HNX','UPCOM'].map(lm);
      let tong = hn.every(v => v == null) ? Object.values(live.s).reduce((s, x) => s + x.n, 0) : hn.reduce((s, v) => s + (v || 0), 0);
      co = co.concat(tong); fu = fu.concat(lm('FU') || 0);
      bTong = ['VNINDEX','HNX','UPCOM'].reduce((s, k) => s + (live.m[k] ? live.m[k].b : 0), 0) || Object.values(live.s).reduce((s, x) => s + x.b, 0);
      xTong = ['VNINDEX','HNX','UPCOM'].reduce((s, k) => s + (live.m[k] ? live.m[k].x : 0), 0) || Object.values(live.s).reduce((s, x) => s + x.x, 0);
    }
    const L = d.length - 1;
    const ma = Object.entries(D.s).map(([t, x]) => {
      const n = x.n.map(v => v || 0); let o = x.o.slice(), px = x.px.slice();
      const lv = live && live.s[t];
      if (live) { n.push(lv ? lv.n : 0); o.push(lv && x.sh && x.tr ? (x.tr - lv.room) / x.sh * 100 : o[o.length-1]); px.push(lv && lv.p ? lv.p : px[px.length-1]); }
      let st = 0; for (let i = n.length - 1; i >= 0; i--){ if (Math.abs(n[i]) < 0.05) break; if (st === 0) st = Math.sign(n[i]); else if (Math.sign(n[i]) !== Math.sign(st)) break; else st += Math.sign(n[i]); }
      if (Math.abs(st) === 1 && Math.abs(n[n.length-1]) < 0.05) st = 0;
      const gd20 = (x.v20 || 0) / 1000 * 20;
      const p20 = px[L] && px[L-20] ? (px[L] / px[L-20] - 1) * 100 : null, p5 = px[L] && px[L-5] ? (px[L] / px[L-5] - 1) * 100 : null;
      const o20 = o[L] != null && o[L-20] != null ? o[L] - o[L-20] : null;
      return {t, sec: x.sec, ng: nganh(x.sec), ten: x.ten, v20: x.v20, cap: x.cap, lim: x.lim, own: o[L], o20, n, o, px,
        d1: n[L], d5: sum(n, 5), d20: sum(n, 20), d60: sum(n, n.length), st, dom: gd20 > 0 ? sum(n, 20) / gd20 * 100 : null, p5, p20,
        con: x.lim != null && o[L] != null ? x.lim - o[L] : null, hb: lv ? lv.b : x.bt, hx: lv ? lv.x : x.xt,
        p1: px[L] && px[L-1] ? (px[L] / px[L-1] - 1) * 100 : null,
        /* kỳ 1/5/20: ngoại mua, ngoại bán, GTGD toàn mã (tỷ). Trong phiên: kỳ 1 lấy VPS, kỳ 5/20 lấy file (trễ 1 phiên). */
        k: {1: lv ? {b: lv.b, x: lv.x, g: lv.g} : (x.kb ? {b: x.kb[0], x: x.kx[0], g: x.kg[0]} : null),
            5: x.kb ? {b: x.kb[1], x: x.kx[1], g: x.kg[1]} : null, 20: x.kb ? {b: x.kb[2], x: x.kx[2], g: x.kg[2]} : null}};
    });
    return {d, L, co, fu, bTong, xTong, ma};
  }

  /* ---------- Vẽ ---------- */
  function huy(){ Object.values(charts).forEach(c => { try { c.destroy(); } catch(e){} }); charts = {}; }
  const opt = (extra) => Object.assign({responsive: true, maintainAspectRatio: false, animation: false,
    plugins: {legend: {display: false}, tooltip: {backgroundColor: 'rgba(18,32,58,.94)', padding: 10, cornerRadius: 9, titleFont: {size: 12}, bodyFont: {size: 13, weight: '600'}, displayColors: false}},
    scales: {x: {grid: {display: false}, ticks: {color: MUT, font: {size: 10.5}, maxRotation: 0, autoSkip: true, maxTicksLimit: 9}},
             y: {grid: {color: GRID}, border: {display: false}, ticks: {color: MUT, font: {size: 10.5}}}}}, extra || {});

  function veTatCa(){
    const el = $('#view-kng'); if (!el) return;
    const T = tinh(), {d, L, co, fu, ma} = T;
    const ky = {1: 'd1', 5: 'd5', 20: 'd20'}[KY];
    const tenKy = {1: 'hôm nay', 5: '5 phiên', 20: '20 phiên'}[KY];
    const SAN = {1: 3, 5: 10, 20: 20};
    ma.forEach(m => { const q = m.k[KY]; m.pk = {1: m.p1, 5: m.p5, 20: m.p20}[KY];
      m.kk = q && q.g > 0 ? {g: q.g, mb: q.b / q.g * 100, mx: q.x / q.g * 100, r: (q.b - q.x) / q.g * 100} : null; });
    /* chuỗi thị trường */
    let st = 0; for (let i = L; i >= 0; i--){ const s = Math.sign(co[i]); if (!st) st = s; else if (s !== Math.sign(st)) break; else st += s; }
    const c5 = sum(co, 5), c20 = sum(co, 20);
    /* ngành */
    const NG = {}; ma.forEach(m => { const g = NG[m.ng] ||= {t: m.ng, d1: 0, d5: 0, d20: 0, n: 0, top: []}; g.d1 += m.d1; g.d5 += m.d5; g.d20 += m.d20; g.n++; g.top.push(m); });
    const ngs = Object.values(NG).filter(g => g.t !== 'Khác' && g.n >= 3).sort((a, b) => b[ky] - a[ky]);
    /* insight tự sinh — chỉ mô tả số */
    const ins = [];
    ins.push([mau(c20), `20 phiên gần nhất khối ngoại ${c20 < 0 ? 'bán ròng' : 'mua ròng'} <b>${vn(Math.abs(c20), 0)} tỷ</b> trên cổ phiếu; ${Math.abs(st) >= 2 ? `đang có chuỗi <b>${Math.abs(st)} phiên ${st < 0 ? 'bán' : 'mua'} ròng liên tiếp</b>` : 'chưa có chuỗi rõ'}.`]);
    if (ngs.length) { const a = ngs[0], z = ngs[ngs.length - 1];
      ins.push([G, `Được gom mạnh nhất (${tenKy}): <b>${a.t}</b> ${ty(a[ky])}${a[ky] <= 0 ? ' — cả thị trường đều bị bán, đây là ngành bị bán ít nhất' : ''}. Bị xả nhiều nhất: <b>${z.t}</b> ${ty(z[ky])}.`]); }
    const fu1 = fu[L];
    if (fu1 && Math.sign(fu1) !== Math.sign(co[L]) && Math.abs(fu1) > 50) ins.push([SL, `Phái sinh ngược chiều cổ phiếu: ${fu1 > 0 ? 'mua' : 'bán'} ròng ${vn(Math.abs(fu1), 0)} tỷ hợp đồng tương lai trong khi ${co[L] < 0 ? 'bán' : 'mua'} ròng cổ phiếu — có thể là phòng hộ, không hẳn là rút/vào vốn thật.`]);
    const gomGiam = ma.filter(m => m.v20 >= 20000 && m.dom >= 3 && m.p20 != null && m.p20 < -3).sort((a, b) => b.dom - a.dom).slice(0, 4);
    const chiPhoi = ma.filter(m => m.v20 >= 10000 && m.kk && Math.abs(m[ky]) >= SAN[KY] && Math.abs(m.kk.r) >= 15).sort((a, b) => Math.abs(b.kk.r) - Math.abs(a.kk.r)).slice(0, 4);
    if (chiPhoi.length) ins.push([INK, `Khối ngoại chi phối thanh khoản (${tenKy}): ${chiPhoi.map(m => `<b>${m.t}</b> ${m.kk.r > 0 ? 'mua' : 'bán'} ròng ${vn(Math.abs(m.kk.r), 0)}% GTGD`).join(' · ')}.`]);
    if (gomGiam.length) ins.push([GD, `Ngoại gom trong lúc giá giảm (20 phiên): ${gomGiam.map(m => `<b>${m.t}</b>`).join(', ')} — nhóm đáng theo dõi nhất.`]);

    const liveTxt = live ? `<span class="kn-live"><i></i>Trong phiên · cập nhật ${live.hm}</span>` : `<span class="kn-live eod"><i></i>Kết phiên ${dm(D.asof)}</span>`;
    const tong = T.bTong + T.xTong;
    el.innerHTML = `
    <div class="kn-top"><div><div class="kn-ey">Dòng vốn ngoại</div><h1>Khối ngoại</h1></div>${liveTxt}
      <div class="kn-seg" id="knKy">${[['1','Hôm nay'],['5','5 phiên'],['20','20 phiên']].map(([k, t]) => `<button data-k="${k}" class="${KY === k ? 'on' : ''}">${t}</button>`).join('')}</div></div>
    <div class="kn-kpi">
      <div class="kn-k main"><div class="l">Ròng ${live ? 'trong phiên' : 'phiên ' + dm(d[L])} · HOSE + HNX + UPCoM</div><div class="v" style="color:${co[L] >= 0 ? '#4ADE80' : '#FF8A8E'}">${ty(co[L])}</div>
        <div class="s">Mua ${vn(T.bTong, 0)} tỷ · Bán ${vn(T.xTong, 0)} tỷ</div>
        <div class="bar"><i style="flex:${T.bTong || 1};background:#4ADE80"></i><i style="flex:${T.xTong || 1};background:#FF8A8E"></i></div></div>
      <div class="kn-k"><div class="l">Luỹ kế 5 phiên</div><div class="v" style="color:${mau(c5)}">${ty(c5)}</div><div class="s">TB ${sg(c5 / 5, 0)} tỷ/phiên</div></div>
      <div class="kn-k"><div class="l">Luỹ kế 20 phiên</div><div class="v" style="color:${mau(c20)}">${ty(c20)}</div><div class="s">TB ${sg(c20 / 20, 0)} tỷ/phiên</div></div>
      <div class="kn-k"><div class="l">Chuỗi hiện tại</div><div class="v" style="color:${mau(st)}">${Math.abs(st) >= 2 ? Math.abs(st) + ' phiên' : st < 0 ? 'Đảo sang bán' : 'Đảo sang mua'}</div><div class="s">${Math.abs(st) >= 2 ? (st < 0 ? 'bán ròng liên tiếp' : 'mua ròng liên tiếp') : 'phiên trước ' + (co[L-1] >= 0 ? 'mua' : 'bán') + ' ròng ' + vn(Math.abs(co[L-1]), 0) + ' tỷ'}</div></div>
      <div class="kn-k"><div class="l">Phái sinh (HĐ tương lai)</div><div class="v" style="color:${mau(fu1)}">${ty(fu1 || 0)}</div><div class="s">${live ? 'trong phiên' : 'phiên ' + dm(d[L])} · 5 phiên ${ty(sum(fu, 5))}</div></div>
    </div>
    <div class="kn-card"><div class="kn-ey">Nhận định từ số liệu</div><div class="kn-ins" style="margin-top:10px">${ins.map(x => `<div><i style="background:${x[0]}"></i><span>${x[1]}</span></div>`).join('')}</div></div>
    <div class="kn-card">
      <div class="kn-h"><h2>Dòng tiền ngoại ${d.length} phiên</h2><span class="kn-sub" style="margin:0">mua ròng / bán ròng mỗi phiên trên cổ phiếu, tỷ đồng</span></div>
      <div class="kn-ch"><canvas id="knC1"></canvas></div>
      <div class="kn-h" style="margin-top:10px"><h2 style="font-size:14px">Luỹ kế</h2><span class="kn-sub" style="margin:0">cộng dồn từ ${dm(d[0])}</span></div>
      <div class="kn-ch sm"><canvas id="knC2"></canvas></div>
    </div>
    <div class="kn-card"><div class="kn-ey">Ngoại chi phối giao dịch · ${tenKy}</div>
      <div class="kn-h"><h2>Mã nào khối ngoại thực sự tác động</h2></div>
      <p class="kn-sub">Xếp theo <b>ròng ÷ giá trị giao dịch của chính mã</b> — tiền ngoại chiếm bao nhiêu phần trăm thanh khoản, không xếp theo số tỷ tuyệt đối.
        Chỉ mã GTGD ≥ 10 tỷ/phiên và ròng ≥ ${vn(SAN[KY], 0)} tỷ.</p>
      <div class="kn-g2 eq">${['mua', 'ban'].map(c => {
        const ds = ma.filter(m => m.v20 >= 10000 && m.kk && m.kk.g > 0 && (c === 'mua' ? m[ky] >= SAN[KY] : m[ky] <= -SAN[KY]))
          .sort((a, b) => c === 'mua' ? b.kk.r - a.kk.r : a.kk.r - b.kk.r).slice(0, 10);
        return `<div><div class="kn-sb" style="color:${c === 'mua' ? GD : '#B42318'}">${c === 'mua' ? 'Ngoại gom' : 'Ngoại xả'}</div>
        <table class="kn-t"><thead><tr><th>Mã</th><th>Ròng</th><th>Ngoại ${c === 'mua' ? 'mua' : 'bán'} chiếm</th><th>Ròng / GTGD</th><th>Giá</th></tr></thead><tbody>
        ${ds.map(m => { const sh = c === 'mua' ? m.kk.mb : m.kk.mx;
          return `<tr class="ck" data-t="${m.t}"><td><b>${m.t}</b><span class="tg kn-hide">${m.ng}</span></td><td>${sg(m[ky])} tỷ</td>
          <td><div class="kn-db"><span style="width:${Math.round(Math.min(100, sh) * .7)}px;background:${c === 'mua' ? G : R};opacity:.85"></span><b>${vn(sh, 0)}%</b></div></td>
          <td style="color:${c === 'mua' ? GD : '#B42318'};font-weight:700">${sg(m.kk.r)}%</td>
          <td style="color:${mau(m.pk)}">${m.pk == null ? '—' : sg(m.pk) + '%'}</td></tr>`; }).join('') || '<tr><td colspan="5" style="color:#94A3B8">Chưa có mã đủ ngưỡng</td></tr>'}</tbody></table></div>`; }).join('')}</div>
      <div class="kn-note" style="margin-top:8px">"Ngoại mua chiếm" = giá trị ngoại mua ÷ tổng giá trị giao dịch của mã trong kỳ (khớp lệnh + thoả thuận). Trên 30% là khối ngoại gần như dẫn dắt mã đó.</div></div>
    <div class="kn-g2">
      <div class="kn-card"><div class="kn-ey">Theo ngành · ${tenKy}</div><div class="kn-h"><h2>Tiền ngoại đi vào ngành nào</h2></div>
        <div style="margin-top:10px">${(() => { const mx = Math.max(...ngs.map(g => Math.abs(g[ky])), 1);
          return ngs.map(g => { const v = g[ky], w = Math.abs(v) / mx * 46, tp = g.top.slice().sort((a, b) => v >= 0 ? b[ky] - a[ky] : a[ky] - b[ky])[0];
            return `<div class="kn-ng"><span class="t">${g.t}</span><span class="b"><i style="${v >= 0 ? 'left:50%' : 'right:50%'};width:${w}%;background:${v >= 0 ? G : R}"></i></span>
              <span class="v" style="color:${mau(v)}">${sg(v, Math.abs(v) >= 100 ? 0 : 1)}</span><span class="m kn-hide">${tp ? tp.t : ''}</span>
              <span class="x kn-hide" title="20 phiên">${KY === '20' ? '' : '20P ' + sg(g.d20, 0)}</span></div>`; }).join(''); })()}</div></div>
      <div class="kn-card"><div class="kn-ey">Bản đồ hành vi · 20 phiên</div><div class="kn-h"><h2>Ngoại gom hay xả, giá đi đâu</h2></div>
        <p class="kn-sub">Ngang: giá 20 phiên · Dọc: ròng ÷ GTGD của chính mã. Mã GTGD ≥ 20 tỷ/phiên, chấm to = ròng lớn. Bấm chấm để xem mã.</p>
        <div class="kn-ch q"><canvas id="knC3"></canvas></div></div>
    </div>
    <div class="kn-card"><div class="kn-ey">Sở hữu &amp; room ngoại</div><div class="kn-h"><h2>Tỷ lệ nắm giữ của nhà đầu tư nước ngoài</h2></div>
      <div class="kn-g2 eq" style="margin-top:6px">
        <div><div class="kn-sb">Thay đổi sở hữu 20 phiên <span class="tg">điểm %, mã GTGD ≥ 10 tỷ</span></div>
          ${(() => { const ds = ma.filter(m => m.o20 != null && m.v20 >= 10000 && Math.abs(m.o20) >= .05);
            const up = ds.slice().sort((a, b) => b.o20 - a.o20).slice(0, 6), dn = ds.slice().sort((a, b) => a.o20 - b.o20).slice(0, 6).reverse();
            const mx = Math.max(...up.concat(dn).map(m => Math.abs(m.o20)), .1);
            return up.concat(dn).map(m => `<div class="kn-ng ck" data-t="${m.t}"><span class="t"><b>${m.t}</b> <span class="tg">${vn(m.own, 1)}%</span></span>
              <span class="b"><i style="${m.o20 >= 0 ? 'left:50%' : 'right:50%'};width:${Math.abs(m.o20) / mx * 46}%;background:${m.o20 >= 0 ? G : R}"></i></span>
              <span class="v" style="color:${mau(m.o20)}">${sg(m.o20, 2)}</span></div>`).join(''); })()}</div>
        <div><div class="kn-sb">Room sắp kín <span class="tg">ngoại chỉ mua được khi có ngoại khác bán</span></div>
          <table class="kn-t"><thead><tr><th>Mã</th><th>Sở hữu / trần</th><th>Còn</th><th>Ròng 20P</th></tr></thead><tbody>
          ${ma.filter(m => m.con != null && m.lim > 0 && m.v20 >= 5000 && m.con < 2).sort((a, b) => a.con - b.con).slice(0, 8).map(m => `<tr class="ck" data-t="${m.t}"><td><b>${m.t}</b><span class="tg kn-hide">${m.ng}</span></td>
            <td>${ownHtml(m)}</td><td>${m.con < .2 ? `<span class="kn-chip" style="background:${INK};color:#fff">Kín</span>` : vn(m.con, 1) + '%'}</td>
            <td style="color:${mau(m.d20)}">${sg(m.d20)} tỷ</td></tr>`).join('') || '<tr><td colspan="4" style="color:#94A3B8">Không có mã</td></tr>'}</tbody></table></div>
      </div>
      <div class="kn-note" style="margin-top:8px">% sở hữu = (1 − room còn lại ÷ room tối đa) × trần sở hữu. Trần = room tối đa ÷ số cổ phiếu (ước tính từ vốn hoá).</div></div>
    <div class="kn-card" id="knTk"></div>
    <div class="kn-note">Nguồn: VNDirect (cuối phiên, ${d.length - (live ? 1 : 0)} phiên đến ${dm(D.asof)}); trong phiên: bảng giá VPS, chỉ tính ~260 mã thanh khoản cao nhất. % sở hữu tính từ room công bố và vốn hóa (ước tính số cổ phiếu), có thể lệch nhỏ với số công bố của sàn. Chỉ mô tả dòng tiền đã xảy ra, không phải khuyến nghị.</div>`;

    /* sự kiện */
    el.querySelectorAll('#knKy button').forEach(b => b.onclick = () => { KY = b.dataset.k; veTatCa(); });
    el.querySelectorAll('[data-t]').forEach(r => r.onclick = () => { veMa(r.dataset.t); document.getElementById('knTk').scrollIntoView({behavior: 'smooth', block: 'start'}); });
    huy();
    const lab = d.map(dm);
    /* Phiên đột biến (thường là thoả thuận khối lớn, vd MCH −9.594 tỷ ngày 09/10): cắt cột ở trần trục + ghi số, để các phiên khác không bị đè dẹt */
    const ab = co.map(Math.abs).sort((a, b) => a - b), tran = Math.ceil(Math.max(300, ab[Math.floor(ab.length * .9)] * 2.2) / 500) * 500;
    const dot = co.map((v, i) => Math.abs(v) > tran ? i : -1).filter(i => i >= 0);
    const ghiDot = {id: 'kndot', afterDatasetsDraw(c){ const x = c.ctx, me = c.getDatasetMeta(0); x.save(); x.font = '700 10.5px Inter,sans-serif'; x.textAlign = 'center';
      dot.forEach(i => { const e = me.data[i], v = co[i]; const lon = ma.filter(m => Math.abs(m.n[i]) > Math.abs(v) * .5).map(m => m.t)[0];
        x.fillStyle = v < 0 ? '#B42318' : GD; x.fillText((lon ? lon + ' ' : '') + ty(v) + (lon ? ' · thoả thuận' : ''), Math.min(Math.max(e.x, 90), c.chartArea.right - 90), v < 0 ? c.chartArea.bottom - 6 : c.chartArea.top + 12); }); x.restore(); }};
    charts.c1 = new Chart($('#knC1'), {type: 'bar', plugins: [ghiDot], data: {labels: lab, datasets: [{data: co.map(v => Math.max(-tran, Math.min(tran, v))), backgroundColor: co.map((v, i) => dot.includes(i) ? (v >= 0 ? 'rgba(24,163,75,.45)' : 'rgba(229,72,77,.45)') : v >= 0 ? G : R), borderRadius: 3, maxBarThickness: 14}]},
      options: opt({plugins: {legend: {display: false}, tooltip: {callbacks: {label: c => ty(co[c.dataIndex]) + (dot.includes(c.dataIndex) ? ' (đột biến)' : '')}}},
        scales: {x: {grid: {display: false}, ticks: {color: MUT, font: {size: 10.5}, maxRotation: 0, autoSkip: true, maxTicksLimit: 9}},
                 y: {min: -tran, max: tran, grid: {color: GRID}, border: {display: false}, ticks: {color: MUT, font: {size: 10.5}, callback: v => vn(v, 0)}}}})});
    let ck = 0; const cum = co.map(v => ck += v);
    charts.c2 = new Chart($('#knC2'), {type: 'line', data: {labels: lab, datasets: [{data: cum, borderColor: INK, borderWidth: 2, pointRadius: 0, fill: {target: 'origin', above: 'rgba(24,163,75,.10)', below: 'rgba(229,72,77,.10)'}, tension: .25}]},
      options: opt({plugins: {legend: {display: false}, tooltip: {mode: 'index', intersect: false, callbacks: {label: c => 'Luỹ kế ' + ty(c.raw)}}}})});
    const pts = ma.filter(m => m.v20 >= 20000 && m.p20 != null && m.dom != null).map(m => ({x: Math.max(-30, Math.min(30, m.p20)), y: Math.max(-25, Math.min(25, m.dom)), m}));
    const nhan = {id: 'knlab', afterDatasetsDraw(c){ const x = c.ctx; x.save(); x.font = '700 10.5px Inter,sans-serif'; x.fillStyle = INK; x.textAlign = 'center';
      const me = c.getDatasetMeta(0); pts.forEach((p, i) => { if (Math.abs(p.m.dom) < 6 && Math.abs(p.m.d20) < 150) return; const e = me.data[i]; x.fillText(p.m.t, e.x, e.y - 8); });
      const a = c.chartArea, sx = c.scales.x, sy = c.scales.y; x.font = '800 10px Inter,sans-serif'; x.fillStyle = 'rgba(100,116,139,.75)';
      x.textAlign = 'left'; x.fillText('GOM ÂM THẦM', a.left + 6, a.top + 12); x.fillText('ÁP LỰC BÁN', a.left + 6, a.bottom - 6);
      x.textAlign = 'right'; x.fillText('ĐỒNG THUẬN TĂNG', a.right - 6, a.top + 12); x.fillText('NỘI ĐỠ GIÁ', a.right - 6, a.bottom - 6);
      x.strokeStyle = '#CBD5E1'; x.setLineDash([4, 4]); x.beginPath(); x.moveTo(sx.getPixelForValue(0), a.top); x.lineTo(sx.getPixelForValue(0), a.bottom);
      x.moveTo(a.left, sy.getPixelForValue(0)); x.lineTo(a.right, sy.getPixelForValue(0)); x.stroke(); x.restore(); }};
    charts.c3 = new Chart($('#knC3'), {type: 'scatter', plugins: [nhan], data: {datasets: [{data: pts,
        pointBackgroundColor: pts.map(p => p.m.dom >= 0 ? 'rgba(24,163,75,.75)' : 'rgba(229,72,77,.72)'), pointBorderColor: '#fff', pointBorderWidth: 1.5,
        pointRadius: pts.map(p => Math.max(4, Math.min(13, Math.sqrt(Math.abs(p.m.d20)) * .9))), pointHoverRadius: 12}]},
      options: opt({onClick: (e, a) => { if (a.length) { veMa(pts[a[0].index].m.t); document.getElementById('knTk').scrollIntoView({behavior: 'smooth'}); } },
        plugins: {legend: {display: false}, tooltip: {callbacks: {title: c => c[0].raw.m.t + ' · ' + c[0].raw.m.ng, label: c => [`Ròng 20P: ${ty(c.raw.m.d20)} (${sg(c.raw.m.dom)}% GTGD)`, `Giá 20P: ${sg(c.raw.m.p20)}%`, `Sở hữu: ${vn(c.raw.m.own, 1)}%`]}}},
        scales: {x: {grid: {color: GRID}, border: {display: false}, ticks: {color: MUT, font: {size: 10.5}, callback: v => v + '%'}, title: {display: true, text: 'Giá 20 phiên', color: MUT, font: {size: 11}}},
                 y: {grid: {color: GRID}, border: {display: false}, ticks: {color: MUT, font: {size: 10.5}, callback: v => v + '%'}, title: {display: true, text: 'Ròng ÷ GTGD', color: MUT, font: {size: 11}}}}})});
    veMa(tkMa || (ma.slice().sort((a, b) => Math.abs(b.d20) - Math.abs(a.d20))[0] || {}).t, T);
  }
  function ownHtml(m){
    if (m.own == null || !m.lim) return '<span style="color:#CBD5E1">—</span>';
    const w = Math.max(2, Math.min(100, m.own / m.lim * 100));
    return `<div class="kn-own"><span>${vn(m.own, 1)}%</span><span class="tr" title="trần ${vn(m.lim, 0)}%"><i style="width:${w}%;background:${w > 97 ? INK : '#5B6B82'}"></i></span></div>`;
  }

  /* ---------- Từng mã ---------- */
  function veMa(t, T){
    const box = $('#knTk'); if (!box || !t) return;
    T = T || tinh(); const m = T.ma.find(x => x.t === t);
    tkMa = t;
    const goiY = T.ma.slice().sort((a, b) => (b.v20 || 0) - (a.v20 || 0)).slice(0, 8).map(x => x.t);
    box.innerHTML = `<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div><div class="kn-ey">Tra cứu từng mã</div><div style="font-size:13px;color:${MUT};margin-top:4px">${m ? (m.ten || '') + ' · ' + m.ng : ''}</div></div>
        <input id="knQ" value="${t}" maxlength="5" placeholder="Nhập mã" style="width:120px;border:1.5px solid #E1E7ED;border-radius:10px;padding:8px 12px;font:800 15px Inter,sans-serif;text-transform:uppercase;outline:none;margin-left:auto">
        <div style="display:flex;flex-wrap:wrap;gap:6px">${goiY.map(x => `<span class="kn-chip" data-q="${x}" style="background:${x === t ? INK : '#F1F4F7'};color:${x === t ? '#fff' : INK};cursor:pointer;padding:5px 9px">${x}</span>`).join('')}</div></div>
      ${m ? `<div class="kn-tkr">
          <div><span>Ròng hôm nay</span><b style="color:${mau(m.d1)}">${ty(m.d1)}</b></div>
          <div><span>Ròng 20 phiên</span><b style="color:${mau(m.d20)}">${ty(m.d20)}</b></div>
          <div><span>Ròng / GTGD 20P</span><b>${m.k[20] && m.k[20].g > 0 ? sg((m.k[20].b - m.k[20].x) / m.k[20].g * 100) + '%' : '—'}</b></div>
          <div><span>Ngoại chiếm GTGD 20P</span><b>${m.k[20] && m.k[20].g > 0 ? vn((m.k[20].b + m.k[20].x) / 2 / m.k[20].g * 100, 0) + '%' : '—'}</b></div>
          <div><span>Chuỗi</span><b>${Math.abs(m.st) >= 2 ? Math.abs(m.st) + ' phiên ' + (m.st > 0 ? 'mua' : 'bán') : '—'}</b></div>
          <div><span>Sở hữu / trần</span><b>${vn(m.own, 1)}% <small style="color:${MUT};font-weight:600">/ ${m.lim ? vn(m.lim, 0) + '%' : '—'}</small></b></div>
          <div><span>Sở hữu 20P</span><b style="color:${mau(m.o20)}">${m.o20 == null ? '—' : sg(m.o20, 2) + ' đ%'}</b></div>
          <div><span>Room còn</span><b>${m.con == null ? '—' : vn(m.con, 2) + '%'}</b></div>
        </div>
        <div class="kn-h"><h2 style="font-size:15px">Giá</h2><span class="kn-sub" style="margin:0">đóng cửa điều chỉnh</span></div><div class="kn-ch sm"><canvas id="knT1"></canvas></div>
        <div class="kn-h"><h2 style="font-size:15px">Mua/bán ròng mỗi phiên</h2><span class="kn-sub" style="margin:0">tỷ đồng</span></div><div class="kn-ch sm"><canvas id="knT2"></canvas></div>
        <div class="kn-h"><h2 style="font-size:15px">% sở hữu nước ngoài</h2><span class="kn-sub" style="margin:0">nét đứt = trần sở hữu (khi gần chạm)</span></div><div class="kn-ch sm"><canvas id="knT3"></canvas></div>`
      : `<p class="kn-sub" style="margin-top:12px">Không có dữ liệu khối ngoại cho ${t} (mã ít giao dịch ngoại hoặc GTGD &lt; 0,5 tỷ/phiên).</p>`}`;
    box.querySelectorAll('[data-q]').forEach(c => c.onclick = () => veMa(c.dataset.q));
    const q = box.querySelector('#knQ'); q.onfocus = () => q.select(); q.onkeydown = e => { if (e.key === 'Enter') veMa(q.value.toUpperCase().trim()); };
    ['t1', 't2', 't3'].forEach(k => { if (charts[k]) { try { charts[k].destroy(); } catch(e){} delete charts[k]; } });
    if (!m) return;
    const lab = T.d.map(dm), base = {plugins: {legend: {display: false}, tooltip: {mode: 'index', intersect: false}}};
    charts.t1 = new Chart($('#knT1'), {type: 'line', data: {labels: lab, datasets: [{data: m.px, borderColor: INK, borderWidth: 2, pointRadius: 0, tension: .2}]},
      options: opt({plugins: {legend: {display: false}, tooltip: {mode: 'index', intersect: false, callbacks: {label: c => 'Giá ' + vn(c.raw, 2)}}}})});
    charts.t2 = new Chart($('#knT2'), {type: 'bar', data: {labels: lab, datasets: [{data: m.n, backgroundColor: m.n.map(v => v >= 0 ? G : R), borderRadius: 2, maxBarThickness: 12}]},
      options: opt({plugins: {legend: {display: false}, tooltip: {mode: 'index', intersect: false, callbacks: {label: c => ty(c.raw)}}}})});
    const ds = [{data: m.o, borderColor: G, borderWidth: 2, pointRadius: 0, tension: .2, fill: {target: 'origin', above: 'rgba(24,163,75,.08)'}}];
    if (m.lim) ds.push({data: m.o.map(() => m.lim), borderColor: SL, borderDash: [5, 4], borderWidth: 1.2, pointRadius: 0});
    const ov = m.o.filter(v => v != null), lo = Math.min(...ov), hi = Math.max(...ov);
    const gan = m.lim && m.lim - hi < (hi - lo) * 3 + .5;
    charts.t3 = new Chart($('#knT3'), {type: 'line', data: {labels: lab, datasets: gan ? ds : ds.slice(0, 1)},
      options: opt({plugins: {legend: {display: false}, tooltip: {mode: 'index', intersect: false, callbacks: {label: c => (c.datasetIndex ? 'Trần ' : 'Sở hữu ') + vn(c.raw, 2) + '%'}}},
        scales: {x: {grid: {display: false}, ticks: {color: MUT, font: {size: 10.5}, maxRotation: 0, maxTicksLimit: 9}}, y: {grid: {color: GRID}, border: {display: false}, ticks: {color: MUT, font: {size: 10.5}, callback: v => vn(v, 1) + '%'}}}})});
  }

  /* ---------- Vào tab ---------- */
  async function render(){
    css();
    const el = $('#view-kng');
    if (!D) { el.innerHTML = '<div class="kn-card"><div class="kn-sub" style="margin:0">Đang tải dữ liệu khối ngoại…</div></div>';
      try { D = await napData(); } catch(e){ el.innerHTML = `<div class="kn-card"><b>Chưa có dữ liệu khối ngoại.</b><p class="kn-sub">Dữ liệu được dựng sau mỗi phiên. ${e.message}</p></div>`; return; } }
    if (typeof Chart === 'undefined') { el.innerHTML = '<div class="kn-card"><div class="kn-sub" style="margin:0">Không tải được thư viện biểu đồ.</div></div>'; return; }
    try { live = await napLive(); liveT = Date.now(); } catch(e){ live = null; }
    veTatCa();
    clearInterval(timer);
    timer = setInterval(async () => { const v = $('#view-kng'); if (!v || v.style.display === 'none' || document.visibilityState !== 'visible') return;
      const g = gioVN(); if (g.w < 1 || g.w > 5 || g.h < 9.25 || g.h > 15.2) return;
      try { const l = await napLive(); if (l) { live = l; const y = window.scrollY; veTatCa(); window.scrollTo(0, y); } } catch(e){} }, 60000);
  }
  function hien(){
    document.querySelectorAll('[id^="view-"]').forEach(x => { x.style.display = 'none'; });
    const e = document.getElementById('view-kng'); if (e) e.style.display = '';
    document.querySelectorAll('.nav-link').forEach(x => x.classList.toggle('active', x.dataset.view === 'kng'));
    const fd = document.getElementById('footDisc'); if (fd) fd.style.display = 'none';
    try { gtag('event', 'view_tab', {tab_name: 'kng'}); } catch(err){}
    render();
  }
  window.__knKhoiNgoai = hien;
  (function(){ const _sv = window.showView; if (!_sv || window.__svKNG) return; window.__svKNG = 1;
    window.showView = function(v){ if (v === 'kng') { hien(); return; }
      const e = document.getElementById('view-kng'); if (e) e.style.display = 'none';
      return _sv.apply(this, arguments); };
  })();
  function them(){
    const nav = document.querySelector('nav'); if (!nav || document.getElementById('view-kng')) return;
    const b = document.createElement('button'); b.className = 'nav-link'; b.dataset.view = 'kng'; b.textContent = 'Khối ngoại';
    b.onclick = function(){ hien(); try { history.replaceState(null, '', '#khoi-ngoai'); } catch(e){} };
    const tq = nav.querySelector('[data-view="tq"]'), first = nav.querySelector('button');
    const sau = tq || first; nav.insertBefore(b, sau ? sau.nextSibling : null);
    nav.addEventListener('click', function(e){ const t = e.target.closest('button'); if (!t || !t.dataset.view || t.dataset.view === 'kng') return;
      const v = document.getElementById('view-kng'); if (v) v.style.display = 'none';
      if (location.hash === '#khoi-ngoai') try { history.replaceState(null, '', location.pathname + location.search); } catch(err){} }, true);
    setInterval(function(){ const v = document.getElementById('view-kng'); if (!v || v.style.display === 'none') return;
      const khac = [].slice.call(document.querySelectorAll('[id^="view-"]')).filter(x => x !== v && x.style.display !== 'none' && x.offsetParent !== null);
      if (khac.length) v.style.display = 'none'; }, 700);
    const wrap = document.getElementById('view-market').parentElement;
    const d = document.createElement('div'); d.id = 'view-kng'; d.style.display = 'none';
    const foot = wrap.querySelector('footer'); wrap.insertBefore(d, foot || null);
    if (location.hash === '#khoi-ngoai') setTimeout(hien, 350);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(them, 50)); else setTimeout(them, 50);
})();
