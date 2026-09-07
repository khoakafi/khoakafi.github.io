/* ===== market_v2.js — Khoi dau trang Hieu suat (cau dan + 4 chi so), dat TREN trang cu =====
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
.m2hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:48px;align-items:center;padding:14px 6px 30px;color:${INK}}
.m2hero *{box-sizing:border-box}
.m2hero .eyebrow{font-family:${MONO};font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${GREEN};font-weight:500}
.m2hero .h1{font-family:${SERIF};font-size:52px;line-height:1.08;letter-spacing:-.02em;margin:16px 0 0;font-weight:400}
.m2hero .h1 i{font-style:italic;color:${GREEN}}
.m2hero .lead{font-size:16.5px;line-height:1.65;color:#4B564F;margin:18px 0 0;max-width:56ch}
.m2hero .btns{display:flex;gap:12px;margin-top:26px;flex-wrap:wrap}
.m2hero .btnP{background:${GREEN};color:#fff;font-weight:700;font-size:14.5px;padding:13px 22px;border-radius:10px;cursor:pointer;border:0;font-family:inherit}
.m2hero .btnP:hover{background:${INK}}
.m2hero .btnS{border:1.5px solid #DAD8D0;color:${INK};background:transparent;font-weight:700;font-size:14.5px;padding:13px 22px;border-radius:10px;cursor:pointer;font-family:inherit}
.m2hero .btnS:hover{border-color:${INK}}
.m2hero .meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:22px;font-size:12.5px;color:${MUT};font-family:${MONO}}
.m2hero .meta i{color:#D5D3CB;font-style:normal}
.m2hero .k4{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:${LINE};border:1px solid ${LINE};border-radius:14px;overflow:hidden}
.m2hero .k4 > div{background:#fff;padding:20px 20px}
.m2hero .kl{font-size:13px;font-weight:600;color:${MUT};letter-spacing:.02em}
.m2hero .kv{font-family:${MONO};font-weight:700;font-size:32px;letter-spacing:-.02em;margin-top:6px}
.m2hero .ks{font-size:13px;color:${MUT};margin-top:4px}
@media(max-width:960px){ .m2hero{grid-template-columns:1fr;gap:24px;padding-top:6px} .m2hero .h1{font-size:38px} }
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
    return { cg, vcg, ddS: cv.length ? ddWorst(cv.map(p => p[1])) : null, ddV: cv.length ? ddWorst(cv.map(p => p[2])) : null,
             wr: st.winrate, rr: st.rr, n: st.ndeal || 0, yNow: new Date().getFullYear() };
  }

  function build(){
    const el = document.getElementById('view-market'); if (!el || document.getElementById('m2hero')) return false;
    css();
    const h = document.createElement('div'); h.id = 'm2hero'; h.className = 'm2hero';
    h.innerHTML = `
    <div>
      <div class="eyebrow">Khoa Nguyen Signal · Trend Following</div>
      <h1 class="h1">Mua khi xu hướng bắt đầu.<br><i>Bán khi nó kết thúc.</i></h1>
      <p class="lead">Hệ thống tín hiệu định lượng cho thị trường chứng khoán Việt Nam — vào lệnh theo xu hướng, cắt lỗ bằng quy tắc, không dự đoán.</p>
      <div class="btns"><button class="btnP" id="m2goWatch">Xem tín hiệu hôm nay →</button><button class="btnS" id="m2goDetail">Chi tiết mã</button></div>
      <div class="meta" id="m2meta"></div>
    </div>
    <div class="k4" id="m2k4"></div>`;
    el.insertBefore(h, el.firstChild);
    const q = id => document.getElementById(id);
    if (q('m2goWatch')) q('m2goWatch').onclick = () => { try { window.showView('watch'); } catch(e){} };
    if (q('m2goDetail')) q('m2goDetail').onclick = () => { try { window.showView('detail'); } catch(e){} };
    return true;
  }

  let lastSig = '';
  function fill(){
    const k = kpis();
    const sig = JSON.stringify([k.cg, k.ddS, k.wr, k.rr, k.n]); if (sig === lastSig) return; lastSig = sig;
    const k4 = document.getElementById('m2k4'), meta = document.getElementById('m2meta'); if (!k4) return;
    k4.innerHTML =
      '<div><div class="kl">Lợi nhuận kép / năm</div><div class="kv" style="color:'+GREEN+'">'+pct(k.cg)+'</div><div class="ks">VN-Index '+pct(k.vcg)+'</div></div>'
    + '<div><div class="kl">Sụt giảm tối đa</div><div class="kv">'+pct(k.ddS)+'</div><div class="ks">VN-Index '+pct(k.ddV)+'</div></div>'
    + '<div><div class="kl">Tỷ lệ thắng</div><div class="kv">'+(k.wr != null ? Math.round(k.wr) + '%' : '—')+'</div><div class="ks">trên '+k.n+' deal B★</div></div>'
    + '<div><div class="kl">Lãi / lỗ bình quân</div><div class="kv">'+(k.rr != null ? k.rr.toFixed(1).replace('.', ',') + '×' : '—')+'</div><div class="ks">R:R toàn hệ B★</div></div>';
    if (meta) meta.innerHTML = '<span>Backtest 2019 → '+k.yNow+'</span><i>·</i><span>Phí 0,4% mỗi vòng đã tính</span><i>·</i><span>VNDirect · Vietcap IQ</span>';
  }

  function tick(){ try { build(); fill(); } catch(e){ console.warn('[mkt2]', e); } }
  const start = () => { tick(); setInterval(tick, 3000); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 1200);
})();
