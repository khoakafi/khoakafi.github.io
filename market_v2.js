/* ===== market_v2.js — Khoi dau trang Hieu suat (cau dan + dai 4 chi so), dat TREN trang cu =====
   Du lieu: window.__bstar (curve/stats), window.BSTAR_BOOKS, window.SUMMARY. Khong dung phan duoi.
   Kich hoat: ?mkt=2 (thu) hoac window.__MKT2_ON = true. */
(function(){
  const ON = /[?&]mkt=2\b/.test(location.search) || window.__MKT2_ON === true;
  if (!ON) return;

  const INK='#14201C', MUT='#5F6A62', GREEN='#0F7A3D', RED='#C4453E', LINE='#E4E2DB';
  const MONO="'JetBrains Mono',ui-monospace,Menlo,monospace", SERIF="'Lora',Georgia,serif";

  const pct = (v, d) => { if (v == null || !isFinite(v)) return '—';
    const s = Math.abs(v).toFixed(d == null ? 1 : d).replace('.', ',');
    return (v > 0 ? '+' : v < 0 ? '−' : '') + s + '%'; };

  function css(){
    if (document.getElementById('mkt2css')) return;
    const st = document.createElement('style'); st.id = 'mkt2css';
    st.textContent = `
.m2hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:28px;align-items:stretch;padding:6px 4px 14px;color:${INK}}
.m2hero *{box-sizing:border-box}
.m2top{padding:0 2px 0;display:flex;flex-direction:column;justify-content:space-between;min-width:0}
.m2hero .eyebrow{font-family:${MONO};font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:${GREEN};font-weight:500}
.m2hero .h1{font-family:${SERIF};font-size:38px;line-height:1.1;letter-spacing:-.015em;margin:8px 0 0;font-weight:400}
.m2hero .h1 i{font-style:italic;color:${GREEN}}
.m2hero .lead{font-size:14.5px;line-height:1.6;color:#4B564F;margin:10px 0 0;max-width:70ch}
.m2row{margin-top:14px}
.m2hero .btns{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.m2hero .btnP{background:${GREEN};color:#fff;font-weight:700;font-size:13.5px;padding:10px 18px;border-radius:10px;cursor:pointer;border:0;font-family:inherit}
.m2hero .btnP:hover{background:${INK}}
.m2hero .btnS{border:1.5px solid #DAD8D0;color:${INK};background:transparent;font-weight:700;font-size:13.5px;padding:10px 18px;border-radius:10px;cursor:pointer;font-family:inherit}
.m2hero .btnS:hover{border-color:${INK}}
.m2hero .meta{font-size:11px;line-height:1.6;color:${MUT};font-family:${MONO};margin-top:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m2hero .meta i{color:#C9C7BF;font-style:normal;margin:0 7px}
.m2hero .k4{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:${LINE};border:1px solid ${LINE};border-radius:12px;overflow:hidden}
.m2hero .k4 > div{background:#fff;padding:14px 22px;display:flex;flex-direction:column;justify-content:center}
.m2hero .kl{font-size:11.5px;font-weight:600;color:${MUT};letter-spacing:.06em;text-transform:uppercase}
.m2hero .kv{font-family:${MONO};font-weight:700;font-size:30px;line-height:1.15;letter-spacing:-.02em;margin-top:7px;white-space:nowrap}
.m2hero .kv small{font-size:16px;font-weight:500;color:${MUT};margin:0 5px}
.m2hero .ks{font-size:12px;color:${MUT};margin-top:4px;white-space:nowrap}
#view-market .stats4{display:none !important}
#view-market > .stats4 + div{display:none !important}
@media(max-width:960px){ .m2hero{grid-template-columns:1fr;gap:16px} .m2hero .h1{font-size:30px} .m2hero .meta{white-space:normal} }
@media(max-width:560px){ .m2hero .k4{grid-template-columns:1fr} .m2hero .kv{font-size:28px} }
`;
    document.head.appendChild(st);
  }

  const B = () => window.__bstar || {};
  function curveAll(){ try { return (B().curve && B().curve()) || (window.BSTAR_CURVE && window.BSTAR_CURVE.pts) || []; } catch(e){ return []; } }
  function statsAll(){ try { return (B().stats && B().stats(curveAll())) || {}; } catch(e){ return {}; } }
  function years(){ const cv = curveAll(); if (cv.length < 2) return null;
    return (Date.parse(cv[cv.length-1][0]) - Date.parse(cv[0][0])) / (365.25*86400000); }
  function cagr(total, yrs){ return (Math.pow(1 + total/100, 1/yrs) - 1) * 100; }
  function ddWorst(arr){ let pk = -Infinity, worst = 0; arr.forEach(v => { const eq = 1 + v/100; pk = Math.max(pk, eq); worst = Math.min(worst, (eq/pk - 1)*100); }); return worst; }

  function kpis(){
    const cv = curveAll(), st = statsAll(), yrs = years();
    const total = st.all != null ? st.all : (cv.length ? cv[cv.length-1][1] : null);
    const vtotal = st.vall != null ? st.vall : (cv.length ? cv[cv.length-1][2] : null);
    const cg = (total != null && yrs) ? cagr(total, yrs) : null, vcg = (vtotal != null && yrs) ? cagr(vtotal, yrs) : null;
    return { total, vtotal, cg, vcg, ddS: cv.length ? ddWorst(cv.map(p => p[1])) : null, ddV: cv.length ? ddWorst(cv.map(p => p[2])) : null,
             wr: st.winrate, rr: st.rr, n: st.ndeal || 0, yNow: new Date().getFullYear() };
  }

  function build(){
    const el = document.getElementById('view-market'); if (!el || document.getElementById('m2hero')) return false;
    css();
    const h = document.createElement('div'); h.id = 'm2hero'; h.className = 'm2hero';
    h.innerHTML = `
    <div class="m2top">
      <div class="eyebrow">Khoa Nguyen Signal · Trend Following</div>
      <h1 class="h1">Mua khi xu hướng bắt đầu.<br><i>Bán khi nó kết thúc.</i></h1>
      <p class="lead">Hệ thống tín hiệu định lượng cho thị trường chứng khoán Việt Nam — vào lệnh theo xu hướng, cắt lỗ bằng quy tắc, không dự đoán.</p>
      <div class="m2row">
        <div class="btns"><button class="btnP" id="m2goWatch">Xem tín hiệu hôm nay →</button></div>
        <div class="meta" id="m2meta"></div>
      </div>
    </div>
    <div class="k4" id="m2k4"></div>`;
    el.insertBefore(h, el.firstChild);
    const q = id => document.getElementById(id);
    if (q('m2goWatch')) q('m2goWatch').onclick = () => { try { window.showView('watch'); } catch(e){} };
    setTimeout(fitChart, 150); setTimeout(fitChart, 900);
    return true;
  }

  function fitChart(){ try { const cv = document.getElementById('cvPerf'); const c = cv && window.Chart && Chart.getChart(cv); if (!c) return; c.resize();
    if (c.chartArea && c.chartArea.right < cv.clientWidth * 0.8 && window.__perf) window.__perf.draw(); } catch(e){} }
  window.addEventListener('resize', () => setTimeout(fitChart, 120));

  let lastSig = '';
  function fill(){
    const k = kpis();
    const sig = JSON.stringify([k.total, k.cg, k.ddS, k.wr, k.rr, k.n]); if (sig === lastSig) return; lastSig = sig;
    const k4 = document.getElementById('m2k4'), meta = document.getElementById('m2meta'); if (!k4) return;
    k4.innerHTML =
      '<div><div class="kl">Tổng lợi nhuận từ 2019</div><div class="kv" style="color:'+GREEN+'">'+pct(k.total)+'</div><div class="ks">VN-Index cùng kỳ '+pct(k.vtotal)+'</div></div>'
    + '<div><div class="kl">Lợi nhuận kép / năm</div><div class="kv" style="color:'+GREEN+'">'+pct(k.cg)+'</div><div class="ks">VN-Index '+pct(k.vcg)+'</div></div>'
    + '<div><div class="kl">Sụt giảm tối đa</div><div class="kv" style="color:'+RED+'">'+pct(k.ddS)+'</div><div class="ks">VN-Index '+pct(k.ddV)+'</div></div>'
    + '<div><div class="kl">Tỷ lệ thắng · Lãi/lỗ bình quân</div><div class="kv">'+(k.wr != null ? Math.round(k.wr) + '%' : '—')+'<small>·</small>'+(k.rr != null ? k.rr.toFixed(1).replace('.', ',') + '×' : '—')+'</div><div class="ks">trên '+k.n+' deal B★</div></div>';
    if (meta) meta.innerHTML = 'Backtest 2019 → '+k.yNow+'<i>·</i>Đã trừ phí 0,15% mua / 0,25% bán<i>·</i>Giá VNDirect<i>·</i>BCTC Vietcap IQ';
  }

  function tick(){ try { build(); fill(); } catch(e){ console.warn('[mkt2]', e); } }
  const start = () => { tick(); setInterval(tick, 3000); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 1200);
})();
