/* ===== market_v2.js — Trang Hieu suat theo thiet ke Claude Design (09/2026) =====
   Du lieu: window.__bstar (curve/stats/recent/live), window.BSTAR_BOOKS, window.SUMMARY.
   Chi thay noi dung #view-market. Kich hoat: ?mkt=2 (thu) hoac window.__MKT2_ON = true. */
(function(){
  const ON = /[?&]mkt=2\b/.test(location.search) || window.__MKT2_ON === true;
  if (!ON) return;

  const INK='#14201C', MUT='#5F6A62', GREEN='#0F7A3D', GRAPH='#18A34B', RED='#C4453E', LINE='#E4E2DB', BG='#FBFAF7';
  const MONO="'JetBrains Mono',ui-monospace,Menlo,monospace", SERIF="'Lora',Georgia,serif";

  /* ---------- dinh dang vi-VN ---------- */
  const pct = (v, d) => { if (v == null || !isFinite(v)) return '—';
    const s = Math.abs(v).toFixed(d == null ? 1 : d).replace('.', ',');
    return (v > 0 ? '+' : v < 0 ? '−' : '') + s + '%'; };
  const num = (v, d) => v == null ? '—' : (+v).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const col = v => v > 0 ? GREEN : v < 0 ? RED : INK;

  /* ---------- CSS ---------- */
  function css(){
    if (document.getElementById('mkt2css')) return;
    const st = document.createElement('style'); st.id = 'mkt2css';
    st.textContent = `
#view-market.m2{background:${BG};margin:-14px -16px 0;padding:0 0 60px;color:${INK};font-family:'Be Vietnam Pro',Inter,system-ui,sans-serif}
#view-market.m2 *{box-sizing:border-box}
.m2w{max-width:1240px;margin:0 auto;padding:0 24px}
.m2 h1,.m2 h2,.m2 h3,.m2 p{margin:0}
.m2 .hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:56px;align-items:center;padding-top:52px}
.m2 .eyebrow{font-family:${MONO};font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${GREEN};font-weight:500}
.m2 .h1{font-family:${SERIF};font-size:56px;line-height:1.06;letter-spacing:-.02em;margin-top:18px;font-weight:400}
.m2 .h1 i{font-style:italic;color:${GREEN}}
.m2 .lead{font-size:17px;line-height:1.65;color:#4B564F;margin-top:20px;max-width:52ch}
.m2 .btns{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap}
.m2 .btnP{background:${GREEN};color:#fff;font-weight:700;font-size:15px;padding:14px 24px;border-radius:10px;cursor:pointer;border:0}
.m2 .btnP:hover{background:${INK}}
.m2 .btnS{border:1.5px solid #DAD8D0;color:${INK};background:transparent;font-weight:700;font-size:15px;padding:14px 24px;border-radius:10px;cursor:pointer}
.m2 .btnS:hover{border-color:${INK}}
.m2 .meta{display:flex;gap:18px;flex-wrap:wrap;margin-top:26px;font-size:13px;color:${MUT};font-family:${MONO}}
.m2 .meta i{color:#D5D3CB;font-style:normal}
.m2 .k4{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:${LINE};border:1px solid ${LINE};border-radius:14px;overflow:hidden}
.m2 .k4 > div{background:#fff;padding:22px 20px}
.m2 .kl{font-size:13px;font-weight:600;color:${MUT};letter-spacing:.02em}
.m2 .kv{font-family:${MONO};font-weight:700;font-size:34px;letter-spacing:-.02em;margin-top:8px}
.m2 .ks{font-size:13px;color:${MUT};margin-top:4px}
.m2 .card{background:#fff;border:1px solid ${LINE};border-radius:16px}
.m2 .chartCard{margin-top:48px;padding:24px 26px 20px}
.m2 .ch{display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap}
.m2 .h2{font-size:20px;font-weight:800;letter-spacing:-.01em}
.m2 .lg{display:flex;gap:18px;margin-top:10px;font-size:13px;font-weight:600}
.m2 .lg span{display:flex;align-items:center;gap:7px}
.m2 .lg b{width:14px;height:3px;border-radius:2px;display:inline-block}
.m2 .seg2{display:inline-flex;background:#F2F1EC;border-radius:9px;padding:3px;gap:2px}
.m2 .seg2 span{font-size:13px;font-weight:700;padding:7px 14px;border-radius:7px;cursor:pointer;color:${MUT}}
.m2 .seg2 span.on{background:#fff;color:${INK}}
.m2 .scale{border:1px solid ${LINE};border-radius:9px;padding:7px 13px;font-size:13px;font-weight:700;cursor:pointer;color:#4B564F;font-family:${MONO}}
.m2 .badges{position:absolute;right:0;top:0;display:flex;flex-direction:column;gap:6px;align-items:flex-end;pointer-events:none}
.m2 .bd1{background:#128A3E;color:#fff;font-family:${MONO};font-weight:700;font-size:13px;padding:5px 10px;border-radius:7px}
.m2 .bd2{background:#EFEEE8;color:#4B564F;font-family:${MONO};font-weight:700;font-size:13px;padding:5px 10px;border-radius:7px}
.m2 .ddh{display:flex;justify-content:space-between;font-size:12px;font-family:${MONO};color:${MUT};margin-bottom:4px}
.m2 .foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:14px;font-size:12.5px;color:${MUT};font-family:${MONO}}
.m2 .k6{margin-top:16px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:${LINE};border:1px solid ${LINE};border-radius:14px;overflow:hidden}
.m2 .k6 > div{background:#fff;padding:18px 20px}
.m2 .k6 .kv{font-size:24px;margin-top:6px;letter-spacing:-.01em}
.m2 .sec{margin-top:48px}
.m2 .secH{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:14px}
.m2 .hs{font-family:${SERIF};font-size:32px;letter-spacing:-.01em;font-weight:400}
.m2 .sub{font-size:15px;color:${MUT};margin-top:6px}
.m2 .lnk{font-size:13.5px;font-weight:700;color:${GREEN};cursor:pointer}
.m2 table.dl{width:100%;border-collapse:collapse;font-size:14px;min-width:820px}
.m2 table.dl th{position:sticky;top:0;background:#FAF9F5;text-align:right;font-size:12px;font-family:${MONO};letter-spacing:.08em;color:${MUT};font-weight:500;padding:12px 14px;border-bottom:1px solid ${LINE};z-index:1}
.m2 table.dl th:first-child{text-align:left;padding-left:20px;position:sticky;left:0;z-index:2}
.m2 table.dl td{padding:13px 14px;text-align:right;font-family:${MONO};border-bottom:1px solid #F4F3EE;font-size:13px;color:${MUT}}
.m2 table.dl td.s{font-weight:500;color:${INK};font-size:14px}
.m2 table.dl td:first-child{position:sticky;left:0;background:#fff;text-align:left;padding-left:20px}
.m2 table.dl tr:hover td{background:#FAFBF8}
.m2 .tk{font-weight:800;font-size:15px;letter-spacing:.01em;color:${INK};font-family:'Be Vietnam Pro',Inter,sans-serif;cursor:pointer}
.m2 .tk:hover{color:${GREEN}}
.m2 .star{font-size:10.5px;font-weight:700;font-family:${MONO};color:${MUT};border:1px solid ${LINE};border-radius:5px;padding:2px 6px;margin-left:9px}
.m2 .ret{display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:15px}
.m2 .ret i{font-size:10px;font-style:normal}
.m2 .heatCard{padding:24px 26px}
.m2 .hgrid{display:grid;grid-template-columns:56px repeat(12,minmax(0,1fr)) 78px 78px;gap:4px;align-items:stretch;margin-bottom:4px}
.m2 .hh{font-size:12px;font-family:${MONO};color:${MUT};letter-spacing:.06em;text-align:center}
.m2 .hy{font-family:${MONO};font-weight:700;font-size:13px;display:flex;align-items:center}
.m2 .hc{border-radius:5px;height:30px;display:flex;align-items:center;justify-content:center;font-family:${MONO};font-size:13px;font-weight:500;color:${INK}}
.m2 .ht{border-radius:5px;height:30px;display:flex;align-items:center;justify-content:flex-end;padding-right:9px;font-family:${MONO};font-size:13px;font-weight:700;background:#F7F6F1}
.m2 .hv{border-radius:5px;height:30px;display:flex;align-items:center;justify-content:flex-end;padding-right:9px;font-family:${MONO};font-size:13px;font-weight:500;color:${MUT}}
.m2 .g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:18px}
.m2 .g3 .card{padding:22px 22px 24px;border-radius:14px}
.m2 .tag{font-family:${MONO};font-size:12px;letter-spacing:.12em}
.m2 .g3 h3{font-size:18px;font-weight:800;margin-top:12px}
.m2 .g3 p{font-size:15px;line-height:1.65;color:#4B564F;margin-top:9px}
.m2 .author{margin-top:28px;background:${INK};border-radius:16px;padding:34px 36px;display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:28px;align-items:center;color:#fff}
.m2 .author .nm{font-family:${SERIF};font-size:32px;margin-top:10px}
.m2 .author .ds{font-size:16px;color:#B9C4BC;margin-top:8px;line-height:1.6}
.m2 .author .zl{background:${GREEN};color:#fff;font-weight:700;font-size:14.5px;padding:13px 22px;border-radius:10px;text-align:center;cursor:pointer;text-decoration:none;display:block}
.m2 .author .zl:hover{background:#14A05A}
.m2 .author .ph{font-family:${MONO};font-size:14px;color:#B9C4BC;text-align:center;margin-top:10px}
.m2 .m2foot{margin-top:40px;border-top:1px solid ${LINE};padding-top:22px;display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:40px}
.m2 .m2foot p{font-size:14px;line-height:1.7;color:${MUT}}
.m2 .m2foot a{display:block;font-size:14px;font-weight:600;color:${INK};text-decoration:none;margin-bottom:10px;cursor:pointer}
@media(max-width:960px){
  .m2 .hero{grid-template-columns:1fr;gap:28px;padding-top:32px}
  .m2 .h1{font-size:40px}
  .m2 .k6{grid-template-columns:1fr 1fr}
  .m2 .g3{grid-template-columns:1fr}
  .m2 .author{grid-template-columns:1fr;text-align:center}
  .m2 .author svg{margin:0 auto}
  .m2 .m2foot{grid-template-columns:1fr}
}
@media(max-width:560px){ .m2 .k4{grid-template-columns:1fr} .m2 .k6{grid-template-columns:1fr} .m2 .kv{font-size:28px} }
`;
    document.head.appendChild(st);
  }

  /* ---------- du lieu ---------- */
  const B = () => window.__bstar || {};
  function curveAll(){ try { return (B().curve && B().curve()) || (window.BSTAR_CURVE && window.BSTAR_CURVE.pts) || []; } catch(e){ return []; } }
  function statsAll(){ try { return (B().stats && B().stats(curveAll())) || {}; } catch(e){ return {}; } }
  function recent(){ try { return (B().recent && B().recent()) || []; } catch(e){ return []; } }
  function books(){
    const out = Object.assign({}, window.BSTAR_BOOKS || {});
    try { const lv = B().live && B().live(); if (lv) out[String(new Date().getFullYear())] = lv; } catch(e){}
    return out;
  }
  function years(){ const cv = curveAll(); if (cv.length < 2) return 7.6;
    return (Date.parse(cv[cv.length-1][0]) - Date.parse(cv[0][0])) / (365.25*86400000); }
  function cagr(total, yrs){ return (Math.pow(1 + total/100, 1/yrs) - 1) * 100; }
  function ddOf(arr){ let pk = -Infinity, worst = 0; const out = arr.map(v => { const eq = 1 + v/100; pk = Math.max(pk, eq); const d = (eq/pk - 1)*100; worst = Math.min(worst, d); return d; }); return { dd: out, worst }; }

  /* ---------- chart ---------- */
  let range = 'all', logScale = true;
  function slice(cv){
    const n = cv.length; if (!n) return { s: [], b: [], d: [] };
    let from = 0, to = n;
    const yr = new Date().getFullYear();
    if (range === '1y') from = Math.max(0, n - 53);
    else if (range === '6m') from = Math.max(0, n - 27);
    else if (range === 'y2025') { from = cv.findIndex(p => p[0] >= '2025-01-01'); to = cv.findIndex(p => p[0] >= '2026-01-01'); if (to < 0) to = n; }
    else if (range === 'y2026') from = cv.findIndex(p => p[0] >= '2026-01-01');
    if (from < 0) from = 0;
    if (from > 0) from -= 1;                       // moc goc = diem ngay truoc
    const seg = cv.slice(from, to);
    const reb = (i) => { const b0 = 1 + seg[0][i]/100; return seg.map(p => ((1 + p[i]/100)/b0 - 1)*100); };
    return { s: reb(1), b: reb(2), d: seg.map(p => p[0]) };
  }
  const tf = v => logScale ? Math.log(1 + Math.max(v, -95)/100) : v;
  function path(vals, lo, hi, H, close){
    const W = 1000, n = vals.length; if (!n) return '';
    const y = v => H - ((tf(v) - lo)/(hi - lo))*H;
    let d = '';
    vals.forEach((v, i) => { d += (i ? 'L' : 'M') + (i/(n-1)*W).toFixed(1) + ' ' + y(v).toFixed(1) + ' '; });
    if (close) d += 'L1000 ' + H + ' L0 ' + H + ' Z';
    return d;
  }
  function drawChart(){
    const el = document.getElementById('m2chart'); if (!el) return;
    const cv = curveAll(); const { s, b, d } = slice(cv);
    if (!s.length) { el.innerHTML = '<div style="padding:60px;text-align:center;color:'+MUT+'">Đang tải đường vốn…</div>'; return; }
    const all = s.concat(b).map(tf);
    let lo = Math.min(...all), hi = Math.max(...all); const pad = (hi - lo)*0.12 || 1; lo -= pad; hi += pad;
    const H = 330;
    const tickVals = logScale
      ? [-50, -25, 0, 25, 50, 100, 200, 400, 600, 1000].filter(v => tf(v) > lo && tf(v) < hi)
      : (() => { const out = []; const step = Math.max(5, Math.round((hi - lo)/5/25)*25); for (let v = Math.ceil(lo/step)*step; v < hi; v += step) out.push(v); return out; })();
    const ticks = tickVals.map(v => { const y = H - ((tf(v) - lo)/(hi - lo))*H;
      return '<line x1="0" y1="'+y.toFixed(1)+'" x2="1000" y2="'+y.toFixed(1)+'" stroke="#EFEEE8"/><text x="0" y="'+(y-5).toFixed(1)+'" fill="#606B63" font-size="11" font-family="JetBrains Mono, monospace">'+(v>0?'+':'')+v+'%</text>'; }).join('');
    // truc thoi gian: 5 moc
    const xt = []; for (let k = 0; k <= 4; k++) { const i = Math.round((d.length-1)*k/4); const dt = d[i] || ''; xt.push('<text x="'+(k/4*1000).toFixed(0)+'" y="'+(H+16)+'" fill="#606B63" font-size="11" text-anchor="'+(k===0?'start':k===4?'end':'middle')+'" font-family="JetBrains Mono, monospace">'+dt.slice(5,7)+'/'+dt.slice(2,4)+'</text>'); }
    el.innerHTML =
      '<svg viewBox="0 0 1000 '+(H+22)+'" preserveAspectRatio="none" style="width:100%;height:352px;display:block;overflow:visible">'
      + ticks + xt.join('')
      + '<defs><linearGradient id="m2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+GRAPH+'" stop-opacity=".16"/><stop offset="100%" stop-color="'+GRAPH+'" stop-opacity="0"/></linearGradient></defs>'
      + '<path d="'+path(s, lo, hi, H, true)+'" fill="url(#m2g)"/>'
      + '<path d="'+path(b, lo, hi, H)+'" fill="none" stroke="#B5BCB6" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>'
      + '<path d="'+path(s, lo, hi, H)+'" fill="none" stroke="'+GRAPH+'" stroke-width="2.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>'
      + '</svg>'
      + '<div class="badges"><div class="bd1">'+pct(s[s.length-1])+'</div><div class="bd2">'+pct(b[b.length-1])+'</div></div>';
    // drawdown toan chuoi
    const full = cv.map(p => p[1]); const { dd, worst } = ddOf(full);
    const ddEl = document.getElementById('m2dd');
    if (ddEl) {
      const h = 64, n = dd.length; let dp = 'M0 0 ';
      dd.forEach((v, i) => { dp += 'L' + (i/(n-1)*1000).toFixed(1) + ' ' + (worst ? (v/worst*h) : 0).toFixed(1) + ' '; });
      dp += 'L1000 0 Z';
      ddEl.innerHTML = '<div class="ddh"><span>SỤT GIẢM TỪ ĐỈNH · TOÀN CHUỘI</span><span>đáy sâu nhất '+pct(worst)+'</span></div>'
        + '<svg viewBox="0 0 1000 64" preserveAspectRatio="none" style="width:100%;height:64px;display:block"><path d="'+dp+'" fill="'+RED+'" fill-opacity=".14" stroke="'+RED+'" stroke-width="1.4" vector-effect="non-scaling-stroke"/></svg>';
    }
    document.querySelectorAll('#m2seg span').forEach(x => x.classList.toggle('on', x.dataset.r === range));
    const sc = document.getElementById('m2scale'); if (sc) sc.textContent = logScale ? 'LOG' : 'LINEAR';
  }

  /* ---------- heat & thang ---------- */
  function heatCell(v, mx){
    if (v == null) return '<div class="hc" style="background:'+BG+'"></div>';
    const k = Math.min(1, Math.abs(v)/mx), mix = (a, b) => Math.round(a + (b - a)*(0.18 + k*0.82));
    const bg = v >= 0 ? 'rgb('+mix(242,88)+','+mix(241,176)+','+mix(236,124)+')' : 'rgb('+mix(242,205)+','+mix(241,92)+','+mix(236,84)+')';
    const txt = (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1).replace('.', ',');
    return '<div class="hc" style="background:'+bg+'">'+(Math.abs(v) < 0.05 ? '0' : txt)+'</div>';
  }
  function monthStats(bk){
    let n = 0, win = 0, best = null, worst = null;
    Object.keys(bk).forEach(y => { const m = bk[y].m || {}; for (let k = 1; k <= 12; k++) { const v = m[k]; if (v == null || Math.abs(v) < 0.005) continue; n++; if (v > 0) win++;
      if (best == null || v > best.v) best = { v, y, k }; if (worst == null || v < worst.v) worst = { v, y, k }; } });
    return { n, win, best, worst };
  }

  /* ---------- render ---------- */
  function render(){
    const el = document.getElementById('view-market'); if (!el) return;
    css();
    const cv = curveAll(), st = statsAll(), bk = books(), rc = recent();
    const yrs = years();
    const total = st.all != null ? st.all : (cv.length ? cv[cv.length-1][1] : null);
    const vtotal = st.vall != null ? st.vall : (cv.length ? cv[cv.length-1][2] : null);
    const cg = total != null ? cagr(total, yrs) : null, vcg = vtotal != null ? cagr(vtotal, yrs) : null;
    const ddS = ddOf(cv.map(p => p[1])).worst, ddV = ddOf(cv.map(p => p[2])).worst;
    const ms = monthStats(bk);
    const ndeal = st.ndeal || 0, wr = st.winrate, rr = st.rr;
    const yNow = String(new Date().getFullYear());
    const nNow = rc.filter(r => String(r.bdate || '').slice(0,4) === yNow).length || ((bk[yNow] && bk[yNow].n) || 0);
    const upd = (window.SUMMARY && window.SUMMARY.updated) || '';
    // TB ngay nam giu
    let hold = null; try { const ds = (B().deals && B().deals()) || []; const cl = ds.filter(x => x.sdate); if (cl.length) hold = Math.round(cl.reduce((a, x) => a + (Date.parse(x.sdate) - Date.parse(x.bdate))/86400000, 0)/cl.length); } catch(e){}

    const thN = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
    const yrsList = Object.keys(bk).sort((a, b) => b.localeCompare(a));
    let heatMax = 1; yrsList.forEach(y => { const m = bk[y].m || {}; Object.keys(m).forEach(k => { if (m[k] != null) heatMax = Math.max(heatMax, Math.abs(m[k])); }); });
    const heatRows = yrsList.map(y => { const r = bk[y]; const m = r.m || {}; let h = '<div class="hgrid"><div class="hy">'+y+(r.live ? '<span style="font-size:9px;color:'+GREEN+';margin-left:4px">●</span>' : '')+'</div>';
      for (let k = 1; k <= 12; k++) h += heatCell(m[k] == null ? null : m[k], heatMax);
      h += '<div class="ht" style="color:'+col(r.year)+'">'+pct(r.year)+'</div><div class="hv">'+pct(r.vni)+'</div></div>'; return h; }).join('');

    const rcY = rc.filter(r => String(r.bdate || '').slice(0,4) === yNow);
    const dealRows = rcY.map(r => {
      const hold = r.open ? '—' : Math.round((Date.parse(r.sdate || r.bdate) - Date.parse(r.bdate))/86400000) + ' ngày';
      return '<tr><td><span class="tk" data-t="'+r.t+'">'+r.t+'</span><span class="star">B★</span></td>'
        + '<td>'+r.bd+'</td><td class="s">'+num(r.bp, 2)+'</td>'
        + '<td>'+(r.open ? '<span style="color:'+GREEN+';font-weight:700">đang giữ</span>' : r.sd)+'</td>'
        + '<td class="s">'+num(r.sp, 2)+'</td><td>'+hold+'</td>'
        + '<td style="padding-right:20px"><span class="ret" style="color:'+col(r.ret)+'"><i>'+(r.ret >= 0 ? '▲' : '▼')+'</i>'+pct(r.ret)+'</span></td></tr>';
    }).join('');

    el.classList.add('m2');
    el.innerHTML = `
<div class="m2w">
  <div class="hero">
    <div>
      <div class="eyebrow">Khoa Nguyen Signal · Trend Following</div>
      <h1 class="h1">Mua khi xu hướng bắt đầu.<br><i>Bán khi nó kết thúc.</i></h1>
      <p class="lead">Hệ thống tín hiệu định lượng cho thị trường chứng khoán Việt Nam — vào lệnh theo xu hướng, cắt lỗ bằng quy tắc, không dự đoán.</p>
      <div class="btns"><button class="btnP" id="m2goWatch">Xem tín hiệu hôm nay →</button><button class="btnS" id="m2goHow">Phương pháp luận</button></div>
      <div class="meta"><span>Backtest 2019 → ${yNow}</span><i>·</i><span>Phí 0,4% mỗi vòng đã tính</span><i>·</i><span>VNDirect · Vietcap IQ</span></div>
    </div>
    <div class="k4">
      <div><div class="kl">Lợi nhuận kép / năm</div><div class="kv" style="color:${GREEN}">${pct(cg)}</div><div class="ks">VN-Index ${pct(vcg)}</div></div>
      <div><div class="kl">Sụt giảm tối đa</div><div class="kv">${pct(ddS)}</div><div class="ks">VN-Index ${pct(ddV)}</div></div>
      <div><div class="kl">Tỷ lệ thắng</div><div class="kv">${wr != null ? Math.round(wr) + '%' : '—'}</div><div class="ks">trên ${ndeal} deal</div></div>
      <div><div class="kl">Lãi / lỗ bình quân</div><div class="kv">${rr != null ? rr.toFixed(1).replace('.', ',') + '×' : '—'}</div><div class="ks">R:R toàn hệ B★</div></div>
    </div>
  </div>

  <div class="card chartCard">
    <div class="ch">
      <div style="flex:1;min-width:240px">
        <h2 class="h2">Đường vốn hệ thống vs VN-Index</h2>
        <div class="lg"><span><b style="background:${GRAPH}"></b>Khoa Nguyen Signal</span><span style="color:${MUT}"><b style="background:#B5BCB6"></b>VN-Index</span></div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div class="seg2" id="m2seg"><span data-r="all">Tất cả</span><span data-r="1y">1 năm</span><span data-r="6m">6 tháng</span><span data-r="y2025">2025</span><span data-r="y2026">2026</span></div>
        <div class="scale" id="m2scale">LOG</div>
      </div>
    </div>
    <div style="position:relative;margin-top:18px" id="m2chart"></div>
    <div style="margin-top:14px;border-top:1px solid #EFEEE8;padding-top:12px" id="m2dd"></div>
    <div class="foot"><span>Cập nhật ${upd}</span><span>Backtest · đã trừ phí · chưa tính trượt giá</span></div>
  </div>

  <div class="k6">
    <div><div class="kl">Tổng lợi nhuận từ 2019</div><div class="kv" style="color:${GREEN}">${pct(total)}</div><div class="ks">VN-Index ${pct(vtotal)}</div></div>
    <div><div class="kl">Lợi nhuận kép / năm</div><div class="kv" style="color:${GREEN}">${pct(cg)}</div><div class="ks">trên ${yrs.toFixed(1).replace('.', ',')} năm</div></div>
    <div><div class="kl">Sụt giảm tối đa</div><div class="kv">${pct(ddS)}</div><div class="ks">VN-Index ${pct(ddV)}</div></div>
    <div><div class="kl">Tỷ lệ tháng có lãi</div><div class="kv">${ms.n ? Math.round(ms.win/ms.n*100) + '%' : '—'}</div><div class="ks">tháng lãi nhất ${ms.best ? pct(ms.best.v) + ' (T' + ms.best.k + '/' + ms.best.y + ')' : '—'}</div></div>
    <div><div class="kl">Tháng lỗ nặng nhất</div><div class="kv" style="color:${RED}">${ms.worst ? pct(ms.worst.v) : '—'}</div><div class="ks">${ms.worst ? 'tháng ' + ms.worst.k + '/' + ms.worst.y : ''}</div></div>
    <div><div class="kl">Tổng số deal B★</div><div class="kv">${ndeal}</div><div class="ks">${hold != null ? 'trung bình ' + hold + ' ngày / deal' : ''}</div></div>
  </div>

  <div class="sec">
    <div class="secH">
      <div><h2 class="hs">Tín hiệu B★ năm ${yNow}</h2><p class="sub">${nNow} deal · mỗi deal vào đúng 25% NAV đầu năm</p></div>
      <div class="lnk" id="m2goHeat">Xem sổ theo năm từ 2019 ↓</div>
    </div>
    <div class="card" style="overflow:hidden"><div style="overflow-x:auto;max-height:520px;overflow-y:auto">
      <table class="dl"><thead><tr><th>MÃ</th><th>VÀO LỆNH</th><th>GIÁ MUA</th><th>RA LỆNH</th><th>GIÁ BÁN</th><th>NẮM GIỮ</th><th style="padding-right:20px">LỢI SUẤT</th></tr></thead>
      <tbody>${dealRows || '<tr><td colspan="7" style="text-align:center;padding:30px">Đang tải giá…</td></tr>'}</tbody></table>
    </div></div>
  </div>

  <div class="sec card heatCard" id="m2heat">
    <div class="secH" style="margin-bottom:0"><div><h2 class="h2">Lợi suất theo tháng</h2><p class="sub" style="font-size:14px;margin-top:5px">Ô trống = không có deal nào trong tháng · NAV chốt lại đầu mỗi năm</p></div>
      <div style="display:flex;align-items:center;gap:9px;font-size:12px;font-family:${MONO};color:${MUT}"><span>−${Math.round(heatMax)}%</span><span style="width:26px;height:12px;background:#E8837C;border-radius:2px"></span><span style="width:26px;height:12px;background:#F6DAD8;border-radius:2px"></span><span style="width:26px;height:12px;background:#F2F1EC;border-radius:2px"></span><span style="width:26px;height:12px;background:#D3EBDC;border-radius:2px"></span><span style="width:26px;height:12px;background:#6BB98A;border-radius:2px"></span><span>+${Math.round(heatMax)}%</span></div>
    </div>
    <div style="overflow-x:auto;margin-top:18px"><div style="min-width:820px">
      <div class="hgrid" style="margin-bottom:6px"><div></div>${thN.map(t => '<div class="hh">'+t+'</div>').join('')}<div class="hh" style="text-align:right">CẢ NĂM</div><div class="hh" style="text-align:right">VN-INDEX</div></div>
      ${heatRows}
    </div></div>
  </div>

  <div class="sec" id="m2how">
    <h2 class="hs">Hệ thống này hoạt động thế nào</h2>
    <div class="g3">
      <div class="card"><div class="tag" style="color:${GREEN}">01 / TÍN HIỆU</div><h3>Xu hướng, không phải dự báo</h3><p>Tín hiệu B★ phát sinh khi giá bứt khỏi nền tích luỹ chặt kèm khối lượng bùng nổ, doanh nghiệp có lợi nhuận tăng trưởng. Không kỳ vọng chủ quan, không đọc tin.</p></div>
      <div class="card"><div class="tag" style="color:${GREEN}">02 / QUẢN TRỊ VỐN</div><h3>25% NAV mỗi deal, cắt lỗ cứng</h3><p>Mỗi tín hiệu vào đúng 25% NAV đầu năm. Lệnh sai bị loại trong vài ngày theo quy tắc — đó là lý do tỷ lệ thắng ${wr != null ? Math.round(wr) : '~48'}% vẫn cho lãi/lỗ bình quân ${rr != null ? rr.toFixed(1).replace('.', ',') : '5'}×.</p></div>
      <div class="card"><div class="tag" style="color:${RED}">03 / GIỚI HẠN</div><h3>Đây là backtest</h3><p>Số liệu mô phỏng trên dữ liệu lịch sử, đã trừ phí giao dịch nhưng chưa tính trượt giá và thanh khoản thực. Quá khứ không đảm bảo tương lai.</p></div>
    </div>
  </div>

  <div class="author">
    <svg viewBox="0 0 100 100" style="width:120px;height:120px;border-radius:12px;display:block"><defs><pattern id="m2st" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#233029"/><rect width="4" height="8" fill="#2C3B33"/></pattern></defs><rect width="100" height="100" fill="url(#m2st)"/><text x="50" y="52" text-anchor="middle" fill="#8FA096" font-size="7" font-family="JetBrains Mono, monospace">ẢNH CHÂN DUNG</text></svg>
    <div>
      <div class="tag" style="color:#7FB894;letter-spacing:.14em">NGƯỜI XÂY HỆ THỐNG</div>
      <div class="nm">Nguyễn Ngọc Anh Khoa</div>
      <div class="ds">Giám đốc Tư vấn Đầu tư — Chứng khoán KAFI · Chứng chỉ hành nghề số <span style="font-family:${MONO}">••••••</span> · 10 năm giao dịch theo xu hướng</div>
    </div>
    <div><a class="zl" href="https://zalo.me/0339136452" target="_blank" rel="noopener">Tư vấn qua Zalo</a><div class="ph">0339 136 452</div></div>
  </div>

  <div class="m2foot">
    <p>Số liệu hiệu suất tính từ mô phỏng lịch sử (backtest) của hệ Khoa Nguyen Signal, rổ tín hiệu B★, đã gồm phí giao dịch 0,4% mỗi vòng mua–bán. Kết quả quá khứ không đảm bảo cho kết quả tương lai. Nguồn dữ liệu: VNDirect (giá), Vietcap IQ (báo cáo tài chính). Thông tin chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</p>
    <div><a id="m2f1">Phương pháp luận</a><a id="m2f2">Sổ lợi suất theo năm</a><a href="https://zalo.me/0339136452" target="_blank" rel="noopener">Liên hệ</a></div>
  </div>
</div>`;

    // hanh vi
    const go = (sel) => { const t = document.getElementById(sel); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    const q = id => document.getElementById(id);
    if (q('m2goWatch')) q('m2goWatch').onclick = () => { try { window.showView('watch'); } catch(e){} };
    if (q('m2goHow')) q('m2goHow').onclick = () => go('m2how');
    if (q('m2f1')) q('m2f1').onclick = () => go('m2how');
    if (q('m2goHeat')) q('m2goHeat').onclick = () => go('m2heat');
    if (q('m2f2')) q('m2f2').onclick = () => go('m2heat');
    document.querySelectorAll('#m2seg span').forEach(x => x.onclick = () => { range = x.dataset.r; drawChart(); });
    if (q('m2scale')) q('m2scale').onclick = () => { logScale = !logScale; drawChart(); };
    el.querySelectorAll('.tk').forEach(x => x.onclick = () => { try { window.showView('detail'); setTimeout(() => window.openDetail(x.dataset.t), 350); } catch(e){} });
    drawChart();
  }

  /* ---------- kich hoat ---------- */
  let done = false, lastSig = '';
  function tick(){
    const el = document.getElementById('view-market'); if (!el) return;
    const S = (B().S) || {};
    const sig = (S.ready ? 'r' : 'n') + Object.keys(S.px || {}).length + '|' + ((window.SUMMARY || {}).updated || '');
    if (!done || sig !== lastSig) {                 // ve lan dau, roi ve lai khi gia deal tai xong / du lieu doi
      if (!S.ready && done) return;
      lastSig = sig; done = true;
      try { render(); } catch(e){ console.warn('[mkt2]', e); }
    }
  }
  const start = () => { tick(); setInterval(tick, 3000); window.addEventListener('resize', () => { try { drawChart(); } catch(e){} }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 1500);
})();
