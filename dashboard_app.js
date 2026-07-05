/* Dashboard Cổ Phiếu VN — HOSE + HNX — dữ liệu sống từ VNDirect + Vietcap IQ */
(function(){
'use strict';
// ================= DỮ LIỆU & TIỆN ÍCH =================
let SUM = window.SUMMARY;
try { const ls = localStorage.getItem('summary_v1'); if (ls) { const p = JSON.parse(ls); if (p && p.rows && p.rows.length > 500) SUM = p; } } catch(e){}
const ROWS = () => SUM.rows;
const byT = {}; SUM.rows.forEach(r => byT[r.t] = r);
document.getElementById('bgeData').textContent = 'Dữ liệu screener: ' + SUM.updated;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = (x,d=1) => x==null||isNaN(x) ? '—' : Number(x).toLocaleString('vi-VN',{maximumFractionDigits:d,minimumFractionDigits:0});
const pct = (x,d=1) => x==null||isNaN(x) ? '—' : (x>0?'+':'')+Number(x).toFixed(d)+'%';
const cls = x => x==null ? 'mut' : x>0 ? 'up' : x<0 ? 'down' : 'mut';
const toast = m => { const t = $('#toast'); t.textContent = m; t.style.display='block'; setTimeout(()=>t.style.display='none', 3500); };
const NOW = () => Math.floor(Date.now()/1000);

const REV = ['isa3','isb27','isi64','nos689','nos693'], NPAT = ['isa22','isa20'];
const pick = (row, codes) => { for (const c of codes) if (row[c]!=null) return row[c]; return null; };

async function jget(u){ const r = await fetch(u); if(!r.ok) throw new Error(r.status); return r.json(); }
const api = {
  ohlc: async (sym, days) => { const to = NOW()+86400; return jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${sym}&resolution=D&from=${to-86400*days}&to=${to}`); },
  kqkd: async t => (await jget(`https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/${t}/financial-statement?section=INCOME_STATEMENT`))?.data?.quarters || [],
  ratios: async t => ((await jget(`https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/${t}/statistics-financial`))?.data||[]).filter(x=>x.ratioType==='RATIO_TTM'&&x.quarter>=1&&x.quarter<=4)
};

// ============ CHỈ BÁO KỸ THUẬT ============
function smaS(a,n){ const o=[]; let s=0; for(let i=0;i<a.length;i++){ s+=a[i]; if(i>=n) s-=a[i-n]; o.push(i>=n-1 ? s/n : null);} return o; }
function emaS(a,n){ const o=[]; const k=2/(n+1); let e=null; for(let i=0;i<a.length;i++){ e = e==null ? a[i] : a[i]*k + e*(1-k); o.push(i>=n-1?e:null);} return o; }
function rsiS(c,n=14){ const o=[null]; let g=0,l=0; for(let i=1;i<c.length;i++){ const d=c[i]-c[i-1]; const up=Math.max(d,0), dn=Math.max(-d,0); if(i<=n){ g+=up; l+=dn; o.push(i===n ? 100-100/(1+(g/n)/((l/n)||1e-9)) : null); if(i===n){g/=n;l/=n;} } else { g=(g*(n-1)+up)/n; l=(l*(n-1)+dn)/n; o.push(100-100/(1+g/(l||1e-9))); } } return o; }
function macdS(c){ const e12=emaS(c,12), e26=emaS(c,26); const m=c.map((_,i)=>e12[i]!=null&&e26[i]!=null?e12[i]-e26[i]:null); const valid=m.map(x=>x==null?0:x); const sig=emaS(valid,9).map((x,i)=>m[i]==null?null:x); return {m, sig, hist:m.map((x,i)=>x!=null&&sig[i]!=null?x-sig[i]:null)}; }
function bollS(c,n=20,k=2){ const ma=smaS(c,n); return c.map((_,i)=>{ if(ma[i]==null) return [null,null]; let s=0; for(let j=i-n+1;j<=i;j++) s+=Math.pow(c[j]-ma[i],2); const sd=Math.sqrt(s/n); return [ma[i]+k*sd, ma[i]-k*sd]; }); }

// ================= ĐIỀU HƯỚNG =================
const views = ['market','screener','detail','compare'];
$$('nav .btn').forEach(b => b.onclick = () => showView(b.dataset.view));
function showView(v, skip){ views.forEach(x => { $('#view-'+x).style.display = x===v?'':'none'; }); $$('nav .btn').forEach(b=>b.classList.toggle('active', b.dataset.view===v)); if(!skip) inits[v] && inits[v](); }
const inits = {};

// ================= 1. THỊ TRƯỜNG =================
let mktDone = false, M_STATUS = null;
inits.market = async function(){
  if (mktDone) return; mktDone = true;
  const el = $('#view-market');
  el.innerHTML = `<div class="card"><h2>VN-Index &nbsp;<span id="vniNow" class="mini"></span></h2><div id="mBanner" style="margin-bottom:10px"></div><div id="chartVni" style="height:380px"></div></div>
  <div class="grid g2">
    <div class="card"><h2>Top CANSLIM hôm nay</h2><div id="topCs"></div></div>
    <div class="card"><h2>Top sức mạnh giá (RS)</h2><div id="topRs"></div></div>
  </div>`;
  const mini = (rows, cols) => `<table><tr><th>Mã</th>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr>` +
    rows.map(r=>`<tr class="row" onclick="openDetail('${r.t}')"><td><b>${r.t}</b> <span class="mini">${(r.n||'').slice(0,22)}</span></td>${cols.map(c=>`<td class="${c[2]?c[2](r):''}">${c[1](r)}</td>`).join('')}</tr>`).join('') + '</table>';
  const csCols = [['CANSLIM',r=>r.csTong+'/6'],['RS',r=>r.rs??'—'],['LNST YoY',r=>pct(r.npatYoY),r=>cls(r.npatYoY)],['Cách đỉnh',r=>pct(r.dHi),r=>cls(r.dHi)],['GTGD (tỷ)',r=>fmt((r.val20||0)/1000,0)]];
  // Chỉ lấy mã thanh khoản >= 20 tỷ/ngày (giá close x volume TB 20 phiên) để loại mã rác
  const thanhKhoan = r => (r.val20||0) >= 20000;
  $('#topCs').innerHTML = mini([...ROWS()].filter(thanhKhoan).sort((a,b)=>b.csTong-a.csTong||(b.rs||0)-(a.rs||0)).slice(0,10), csCols);
  $('#topRs').innerHTML = mini([...ROWS()].filter(thanhKhoan).sort((a,b)=>(b.rs||0)-(a.rs||0)||(b.r3||0)-(a.r3||0)).slice(0,10), csCols);
  try {
    const d = await api.ohlc('VNINDEX', 1500);
    const c = d.c, last = c[c.length-1], prev = c[c.length-2];
    const ma50 = smaS(c,50), ma200 = smaS(c,200);
    M_STATUS = last > ma50[ma50.length-1];
    $('#vniNow').innerHTML = `${fmt(last,2)} <span class="${cls(last-prev)}">(${pct((last/prev-1)*100,2)})</span>`;
    $('#mBanner').innerHTML = M_STATUS
      ? `<span class="tag" style="background:#e7f6ec;color:#128a3e">M — Xu hướng thị trường: TÍCH CỰC (VN-Index trên MA50) ✓</span>`
      : `<span class="tag" style="background:#fdecec;color:#e5484d">M — Xu hướng thị trường: THẬN TRỌNG (VN-Index dưới MA50)</span>`;
    const ch = LightweightCharts.createChart($('#chartVni'), chartOpts());
    const cs = ch.addCandlestickSeries(candleOpts());
    cs.setData(d.t.map((t,i)=>({time:t, open:d.o[i], high:d.h[i], low:d.l[i], close:d.c[i]})));
    addLine(ch, d.t, ma50, '#d97706', 'MA50'); addLine(ch, d.t, ma200, '#8b5cf6', 'MA200');
    ch.timeScale().fitContent();
  } catch(e){ $('#mBanner').innerHTML = '<span class="mini">Không tải được VN-Index: '+e+'</span>'; }
};

function chartOpts(){ return {layout:{background:{color:'transparent'},textColor:'#6b7280'},grid:{vertLines:{color:'#eef1f4'},horzLines:{color:'#eef1f4'}},timeScale:{borderColor:'#e4e8ec'},rightPriceScale:{borderColor:'#e4e8ec'},autoSize:true}; }
function candleOpts(){ return {upColor:'#18a34b',downColor:'#e5484d',borderUpColor:'#18a34b',borderDownColor:'#e5484d',wickUpColor:'#18a34b',wickDownColor:'#e5484d'}; }
function addLine(ch, times, vals, color, title){ const s = ch.addLineSeries({color, lineWidth:1.5, title, priceLineVisible:false, lastValueVisible:false}); s.setData(times.map((t,i)=>vals[i]!=null?{time:t,value:vals[i]}:null).filter(Boolean)); return s; }

// ================= 2. SCREENER =================
let scInit = false, sortKey = 'csTong', sortDir = -1;
const COLS = [
  ['t','Mã'],['p','Giá'],['dHi','%Đỉnh 52T'],['rs','RS'],['csTong','CANSLIM'],['pe','P/E'],['pb','P/B'],['roe','ROE%'],
  ['npatYoY','LNST YoY%'],['revYoY','DT YoY%'],['cagr3','LN 3n%/n'],['cap','Vốn hóa (tỷ)'],['val20','GTGD (tỷ/ph)'],['rsi','RSI'],['vx','Vol x TB']
];
const PRESETS = {
  canslim: {label:'CANSLIM ≥ 4', f: r => r.csTong>=4},
  growth: {label:'Tăng trưởng cao', f: r => (r.npatYoY||0)>=30 && (r.revYoY||0)>=15},
  value: {label:'Định giá rẻ', f: r => r.pe!=null && r.pe>0 && r.pe<10 && r.pb!=null && r.pb<1.5 && (r.roe||0)>=12},
  divi: {label:'Cổ tức cao', f: r => (r.dy||0)>=5},
  breakout: {label:'Gần đỉnh + vol lớn', f: r => (r.dHi||-99)>=-5 && (r.vx||0)>=1.5}
};
inits.screener = function(){
  if (scInit) return; scInit = true;
  const el = $('#view-screener');
  el.innerHTML = `<div class="card">
    <div class="filters">
      <div><label>Tìm mã / tên</label><input id="fQ" style="width:150px" placeholder="VD: FPT, thép..."></div>
      <div><label>Sàn</label><select id="fSan"><option value="">Cả hai</option><option value="HO">HOSE</option><option value="HN">HNX</option></select></div>
      <div><label>P/E ≤</label><input id="fPe" type="number"></div>
      <div><label>P/B ≤</label><input id="fPb" type="number"></div>
      <div><label>ROE ≥ %</label><input id="fRoe" type="number"></div>
      <div><label>LNST YoY ≥ %</label><input id="fNp" type="number"></div>
      <div><label>RS ≥</label><input id="fRs" type="number"></div>
      <div><label>CANSLIM ≥</label><input id="fCs" type="number"></div>
      <div><label>Vốn hóa ≥ tỷ</label><input id="fCap" type="number"></div>
      <div><label>GTGD ≥ tỷ</label><input id="fVal" type="number"></div>
      <button class="btn" id="fClear">Xóa lọc</button>
    </div>
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">${Object.entries(PRESETS).map(([k,p])=>`<span class="pill" data-p="${k}">${p.label}</span>`).join('')}</div>
  </div>
  <div class="card"><div class="mini" id="scCount" style="margin-bottom:8px"></div><div style="max-height:65vh;overflow:auto"><table id="scTable"></table></div></div>`;
  ['fQ','fSan','fPe','fPb','fRoe','fNp','fRs','fCs','fCap','fVal'].forEach(id => $('#'+id).addEventListener('input', renderSc));
  $('#fClear').onclick = () => { ['fQ','fPe','fPb','fRoe','fNp','fRs','fCs','fCap','fVal'].forEach(id=>$('#'+id).value=''); $('#fSan').value=''; activePreset=null; $$('.pill').forEach(p=>p.classList.remove('on')); renderSc(); };
  $$('.pill').forEach(p => p.onclick = () => { activePreset = activePreset===p.dataset.p ? null : p.dataset.p; $$('.pill').forEach(x=>x.classList.toggle('on', x.dataset.p===activePreset)); renderSc(); });
  renderSc();
};
let activePreset = null;
function renderSc(){
  const q = ($('#fQ').value||'').toUpperCase();
  const num = id => { const v = $('#'+id).value; return v===''?null:+v; };
  const [pe,pb,roe,np,rs,cs,cap,val] = ['fPe','fPb','fRoe','fNp','fRs','fCs','fCap','fVal'].map(num);
  const san = $('#fSan').value;
  let rows = ROWS().filter(r =>
    (!q || r.t.includes(q) || (r.n||'').toUpperCase().includes(q)) &&
    (!san || r.b===san) &&
    (pe==null || (r.pe!=null && r.pe>0 && r.pe<=pe)) &&
    (pb==null || (r.pb!=null && r.pb<=pb)) &&
    (roe==null || (r.roe||-99)>=roe) &&
    (np==null || (r.npatYoY!=null && r.npatYoY>=np)) &&
    (rs==null || (r.rs||0)>=rs) &&
    (cs==null || r.csTong>=cs) &&
    (cap==null || (r.cap||0)>=cap) &&
    (val==null || (r.val20||0)/1000>=val)
  );
  if (activePreset) rows = rows.filter(PRESETS[activePreset].f);
  rows.sort((a,b)=>{ const x=a[sortKey], y=b[sortKey]; if(x==null) return 1; if(y==null) return -1; return (x<y?-1:x>y?1:0)*sortDir*-1; });
  $('#scCount').textContent = rows.length + ' mã thỏa điều kiện (bấm tiêu đề cột để sắp xếp, bấm dòng để xem chi tiết)';
  const head = '<tr>' + COLS.map(c=>`<th data-k="${c[0]}" class="${sortKey===c[0]?'on':''}">${c[1]}${sortKey===c[0]?(sortDir>0?' ↓':' ↑'):''}</th>`).join('') + '</tr>';
  const body = rows.slice(0,400).map(r => `<tr class="row" onclick="openDetail('${r.t}')">
    <td><b>${r.t}</b> <span class="mini">${r.b==='HO'?'HOSE':'HNX'}</span><br><span class="mini">${(r.n||'').slice(0,26)}</span></td>
    <td>${fmt(r.p,2)}</td><td class="${cls(r.dHi)}">${pct(r.dHi)}</td><td>${r.rs??'—'}</td>
    <td><b class="${r.csTong>=4?'up':''}">${r.csTong}/6</b></td>
    <td>${fmt(r.pe,1)}</td><td>${fmt(r.pb,2)}</td><td>${fmt(r.roe,1)}</td>
    <td class="${cls(r.npatYoY)}">${pct(r.npatYoY)}</td><td class="${cls(r.revYoY)}">${pct(r.revYoY)}</td><td class="${cls(r.cagr3)}">${pct(r.cagr3)}</td>
    <td>${fmt(r.cap,0)}</td><td>${fmt((r.val20||0)/1000,1)}</td><td>${r.rsi??'—'}</td><td>${fmt(r.vx,2)}</td></tr>`).join('');
  $('#scTable').innerHTML = head + body;
  $$('#scTable th').forEach(th => th.onclick = () => { const k = th.dataset.k; if (sortKey===k) sortDir*=-1; else { sortKey=k; sortDir=-1; } renderSc(); });
}

// ================= 3. CHI TIẾT MÃ =================
let dtInit = false, dtCharts = [], kqChart = null, rtChart = null, curT = null, curOhlc = null;
let proLoadedFor = null, proChart = null, useLog = false;
function addProBadges(){
  if (!proChart || !curOhlc) return;
  const tix = {}; curOhlc.t.forEach((tt,i)=>tix[tt]=i);
  curMarkers.forEach(m => {
    const i = tix[m.time]; if (i == null) return;
    proChart.createOverlay({ name: 'simpleAnnotation', lock: true, extendData: m.text,
      points: [{ timestamp: m.time*1000, value: m.position==='belowBar' ? curOhlc.l[i] : curOhlc.h[i] }],
      styles: { text: { color: '#fff', backgroundColor: m.color, borderRadius: 4, paddingLeft: 5, paddingRight: 5, paddingTop: 3, paddingBottom: 3 } } });
  });
}
function loadProChart(){
  if (!curT || !curOhlc || proLoadedFor === curT) return;
  const init = () => {
    proLoadedFor = curT;
    const wrap = document.getElementById('chartProWrap');
    wrap.innerHTML = '<div style="display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap;align-items:center" id="proTools">'
      + '<span class="mini" style="margin-right:4px">Công cụ vẽ:</span>'
      + [['segment','✏️ Xu hướng'],['horizontalStraightLine','― Ngang'],['rayLine','↗ Tia'],['fibonacciLine','𝑓 Fibonacci'],['priceChannelLine','∥ Kênh giá']]
        .map(x=>`<button class="btn" style="padding:3px 10px;font-size:12px" data-ov="${x[0]}">${x[1]}</button>`).join('')
      + '<button class="btn" style="padding:3px 10px;font-size:12px" id="proClear">🗑 Xóa nét vẽ</button>'
      + '<span class="mini" style="margin-left:auto">Badge B/S = tín hiệu Trần Phá Nền v1.1</span></div>'
      + '<div id="proK" style="height:620px"></div>';
    try { klinecharts.dispose('proK'); } catch(e){}
    proChart = klinecharts.init('proK');
    // Bang mau TradingView
    const UP = '#089981', DOWN = '#F23645';
    proChart.setStyles({
      grid: { horizontal: { color: '#F0F3FA' }, vertical: { color: '#F0F3FA' } },
      candle: {
        bar: { upColor: UP, downColor: DOWN, upBorderColor: UP, downBorderColor: DOWN, upWickColor: UP, downWickColor: DOWN },
        priceMark: { last: { upColor: UP, downColor: DOWN } },
        tooltip: { text: { color: '#131722' } }
      },
      indicator: {
        lines: [{color:'#2962FF'},{color:'#FF6D00'},{color:'#9C27B0'},{color:'#E91E63'},{color:'#787B86'}],
        bars: [{ upColor: 'rgba(8,153,129,.5)', downColor: 'rgba(242,54,69,.5)', noChangeColor: '#888' }],
        tooltip: { text: { color: '#131722' } }
      },
      xAxis: { axisLine: { color: '#DDE1E6' }, tickText: { color: '#787B86' } },
      yAxis: { axisLine: { color: '#DDE1E6' }, tickText: { color: '#787B86' } },
      crosshair: { horizontal: { line: { color: '#9598A1' }, text: { backgroundColor: '#131722' } },
                   vertical:   { line: { color: '#9598A1' }, text: { backgroundColor: '#131722' } } }
    });
    proChart.applyNewData(curOhlc.t.map((tt,i)=>({ timestamp: tt*1000, open: curOhlc.o[i], high: curOhlc.h[i], low: curOhlc.l[i], close: curOhlc.c[i], volume: curOhlc.v[i] })));
    proChart.createIndicator({ name: 'MA', calcParams: [10, 20, 50, 200] }, true, { id: 'candle_pane' });
    proChart.createIndicator('VOL');
    proChart.createIndicator('MACD');
    addProBadges();
    wrap.querySelectorAll('[data-ov]').forEach(b => b.onclick = () => proChart.createOverlay(b.dataset.ov));
    const clr = wrap.querySelector('#proClear');
    if (clr) clr.onclick = () => { proChart.removeOverlay(); addProBadges(); };
  };
  if (window.klinecharts) init();
  else { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/klinecharts@9/dist/klinecharts.min.js'; s.onload = init; s.onerror = () => toast('Không tải được thư viện chart'); document.head.appendChild(s); }
}
window.openDetail = t => { showView('detail', true); $$('nav .btn').forEach(b=>b.classList.toggle('active', b.dataset.view==='detail')); inits.detail(t); };
inits.detail = function(t){
  const el = $('#view-detail');
  if (!dtInit) { dtInit = true;
    el.innerHTML = `<div class="card">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <div class="search-wrap"><input id="dQ" placeholder="Nhập mã hoặc tên công ty…" style="width:260px"><div id="sugg"></div></div>
        <div id="dTitle" style="font-size:17px;font-weight:700"></div>
        <button class="btn" id="btnCmpAdd">+ Thêm vào So sánh</button>
      </div></div>
      <div id="dBody" style="display:none">
      <div class="card"><div class="kpis" id="dKpis"></div></div>
      <div class="card"><h2>Tín hiệu Trần Phá Nền v1.1</h2><div id="dTpn"></div></div>
      <div class="card"><h2 id="dChartTitle">Biểu đồ giá</h2>
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;align-items:center" id="dRanges">
          <button class="btn active" id="btnChartSig">Chart Tín hiệu</button>
          <button class="btn" id="btnChartPro">Chart Pro + Tín hiệu</button>
          <span style="width:14px"></span>
          ${[['3T',0.25],['6T',0.5],['1N',1],['3N',3],['5N',5],['Tất cả',14]].map((x,i)=>`<button class="btn rng ${i===2?'active':''}" data-y="${x[1]}">${x[0]}</button>`).join('')}
          <label class="mini" style="margin-left:10px"><input type="checkbox" id="ckBoll"> Bollinger</label>
        </div>
        <div id="chartSigWrap" style="position:relative">
          <div id="ohlcLegend" style="position:absolute;top:6px;left:8px;z-index:20;font-size:12.5px;color:#374151;background:rgba(255,255,255,.85);padding:3px 10px;border-radius:6px;border:1px solid #e4e8ec"></div>
          <div style="position:absolute;top:6px;right:76px;z-index:20;display:flex;gap:6px">
            <button class="btn" id="btnLog" style="padding:2px 10px;font-size:11px">Log</button>
            <button class="btn" id="btnFull" style="padding:2px 10px;font-size:11px">⛶ Toàn màn hình</button>
          </div>
          <div id="chartMain"></div><div id="chartRsi"></div><div id="chartMacd"></div>
        </div>
        <div id="chartProWrap" style="display:none;height:640px"></div>
      </div>
      <div class="card"><h2>Đánh giá CANSLIM tự động</h2><div id="dCs"></div></div>
      <div class="grid g2">
        <div class="card"><h2>KQKD theo quý — Doanh thu &amp; LNST (tỷ đồng)</h2><canvas id="cvKq" height="240"></canvas></div>
        <div class="card"><h2>Định giá theo quý — P/E, P/B, ROE</h2><canvas id="cvRt" height="240"></canvas></div>
      </div>
      <div class="card"><h2>Bảng KQKD 12 quý gần nhất</h2><div style="overflow:auto"><table id="tbKq"></table></div></div>
      </div>`;
      // eslint-disable-next-line
  const dq = $('#dQ');
    dq.addEventListener('input', () => {
      const q = dq.value.toUpperCase(); const box = $('#sugg');
      if (!q) { box.style.display='none'; return; }
      const hits = ROWS().filter(r=>r.t.startsWith(q) || (r.n||'').toUpperCase().includes(q)).slice(0,12);
      box.innerHTML = hits.map(r=>`<div onclick="openDetail('${r.t}')"><b>${r.t}</b> <span class="mini">${r.n||''} · ${r.b==='HO'?'HOSE':'HNX'}</span></div>`).join('');
      box.style.display = hits.length?'block':'none';
    });
    dq.addEventListener('keydown', e => { if (e.key==='Enter') { const q = dq.value.toUpperCase().trim(); if (byT[q]) openDetail(q); } });
    document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) $('#sugg').style.display='none'; });
    $('#dRanges').addEventListener('click', e => { const b = e.target.closest('button.rng'); if (!b) return; $$('#dRanges .btn.rng').forEach(x=>x.classList.remove('active')); b.classList.add('active'); drawPrice(+b.dataset.y); });
    $('#btnChartSig').onclick = () => { $('#chartSigWrap').style.display=''; $('#chartProWrap').style.display='none'; $('#btnChartSig').classList.add('active'); $('#btnChartPro').classList.remove('active'); };
    $('#btnChartPro').onclick = () => {
      $('#chartSigWrap').style.display='none'; $('#chartProWrap').style.display='';
      $('#btnChartPro').classList.add('active'); $('#btnChartSig').classList.remove('active');
      loadProChart();
    };
    $('#ckBoll').onchange = () => { const b = $('#dRanges .btn.active'); drawPrice(b?+b.dataset.y:1); };
    $('#btnCmpAdd').onclick = () => { if (curT) addCmp(curT); };
    $('#btnLog').onclick = function(){ useLog = !useLog; this.classList.toggle('active', useLog); const b = $('#dRanges .btn.rng.active'); drawPrice(b?+b.dataset.y:1); };
    $('#btnFull').onclick = () => { const el = $('#chartSigWrap'); if (document.fullscreenElement) document.exitFullscreen(); else { el.style.background='#fff'; el.requestFullscreen(); } };
  }
  if (typeof t === 'string') loadDetail(t);
  else if (!curT) loadDetail('FPT');
};
async function loadDetail(t){
  curT = t; const r = byT[t] || {t};
  $('#sugg').style.display='none'; $('#dQ').value='';
  $('#dTitle').innerHTML = `${t} <span class="mini">— ${r.n||''} (${r.b==='HO'?'HOSE':'HNX'})</span> <span class="spin"></span>`;
  $('#dBody').style.display='';
  try {
    const [oh, qs, rts] = await Promise.all([api.ohlc(t, 5100), api.kqkd(t), api.ratios(t)]);
    curOhlc = oh;
    const tpn = computeTPN(oh, r.b || 'HO');
    curMarkers = tpn.markers;
    renderTPN(tpn.state);
    if (proLoadedFor && proLoadedFor !== t) { proLoadedFor = null; if (document.getElementById('chartProWrap').style.display !== 'none') loadProChart(); }
    $('#dTitle').innerHTML = `${t} <span class="mini">— ${r.n||''} (${r.b==='HO'?'HOSE':'HNX'})</span>`;
    // KPI
    const c = oh.c||[], last = c[c.length-1], prev = c[c.length-2]||last;
    const L = rts[rts.length-1]||{};
    $('#dKpis').innerHTML = [
      ['Giá', `${fmt(last,2)} <span class="${cls(last-prev)}" style="font-size:13px">${pct((last/prev-1)*100,2)}</span>`],
      ['P/E', fmt(L.pe,1)], ['P/B', fmt(L.pb,2)], ['ROE', L.roe!=null?fmt(L.roe*100,1)+'%':'—'],
      ['Vốn hóa', L.marketCap?fmt(L.marketCap/1e12,1)+' nghìn tỷ':'—'],
      ['EV/EBITDA', fmt(L.evToEbitda,1)], ['Cổ tức', L.dividendYield!=null?fmt(L.dividendYield*100,1)+'%':'—'],
      ['RS', r.rs??'—'], ['RSI14', r.rsi??'—'], ['Cách đỉnh 52T', `<span class="${cls(r.dHi)}">${pct(r.dHi)}</span>`]
    ].map(k=>`<div class="kpi"><div class="l">${k[0]}</div><div class="v">${k[1]}</div></div>`).join('');
    drawPrice(1);
    drawCanslim(r, qs);
    drawKq(qs);
    drawRt(rts);
  } catch(e){ toast('Lỗi tải dữ liệu '+t+': '+e.message); }
}
// ===== HỆ TRẦN PHÁ NỀN v1.1 — tín hiệu trên chart =====
// Mua: cây trần ĐẦU TIÊN (30 phiên trước không trần) phá nền tích lũy (biên độ 30 phiên <=12%),
//      vol >= 2.5x TB20, GTGD TB20 >= 20 tỷ. Bán: T+3 lỗ chém / cắt lỗ -7% / gãy MA20 hai phiên.
function computeTPN(oh, boardCode){
  const c = oh.c, v = oh.v, t = oh.t, n = c.length;
  const ceilThr = boardCode === 'HN' ? 8.8 : 6.3;
  const markers = [];
  const ma20 = [], v20 = [];
  for (let i = 0; i < n; i++) {
    if (i >= 19) {
      let s = 0, sv = 0;
      for (let k = i-19; k <= i; k++) { s += c[k]; sv += v[k]; }
      ma20.push(s/20); v20.push(sv/20);
    } else { ma20.push(null); v20.push(null); }
  }
  const baseInfo = i => {   // thong tin nen 30 phien truoc bar i
    let hi = -1e9, lo = 1e9, hasCeil = false;
    for (let k = i-30; k < i; k++) {
      if (c[k] > hi) hi = c[k]; if (c[k] < lo) lo = c[k];
      if (k > 0 && (c[k]/c[k-1]-1)*100 >= ceilThr) hasCeil = true;
    }
    return {rng: (hi-lo)/lo*100, hasCeil};
  };
  let inPos = false, fill = 0, ei = 0;
  for (let i = 31; i < n; i++) {
    if (!inPos) {
      const chg = (c[i]/c[i-1]-1)*100;
      if (chg < ceilThr) continue;
      if (!v20[i] || v[i] < 2.5*v20[i]) continue;
      if (c[i]*v20[i]/1e6 < 20) continue;                    // GTGD TB >= 20 tỷ
      const b = baseInfo(i);
      if (b.hasCeil || b.rng > 12) continue;
      inPos = true; fill = c[i]; ei = i;
      markers.push({time: t[i], position:'belowBar', color:'#18a34b', shape:'circle', text:'B'});
    } else {
      const h = i - ei, pnl = c[i]/fill - 1;
      let reason = null;
      if (h === 3 && pnl <= 0) reason = 'T+3';
      else if (h >= 3 && pnl <= -0.07) reason = 'CL7';
      else if (h > 3 && ma20[i] && c[i] < ma20[i] && c[i-1] < ma20[i-1]) reason = 'MA20';
      if (reason) {
        markers.push({time: t[i], position:'aboveBar', color: pnl>0 ? '#2563eb' : '#e5484d', shape:'circle', text:'S ' + (pnl>0?'+':'') + (pnl*100).toFixed(0) + '%'});
        inPos = false;
      }
    }
  }
  // trang thai hien tai (bar cuoi)
  const L = n-1, b = baseInfo(L+0), chgL = (c[L]/c[L-1]-1)*100;
  const state = {
    inPos, gtgd: v20[L] ? c[L]*v20[L]/1e6 : 0, volx: v20[L] ? v[L]/v20[L] : 0,
    rng: b.rng, hasCeil: b.hasCeil, chg: chgL, ma20: ma20[L], close: c[L], ceilThr,
    buyToday: !inPos ? false : ei === L, fill, holdDays: inPos ? L-ei : 0,
    pnl: inPos ? (c[L]/fill-1)*100 : 0, buyDate: inPos ? new Date(t[ei]*1000).toISOString().slice(0,10) : null,
    belowMa20: ma20[L] ? c[L] < ma20[L] : false
  };
  return {markers, state};
}
let curMarkers = [];
function renderTPN(s){
  const el = document.getElementById('dTpn');
  if (!el) return;
  let chip, desc;
  if (s.inPos && s.buyToday) { chip = ['MUA HÔM NAY', '#e7f6ec', '#128a3e']; desc = `Cây trần phá nền vừa xuất hiện — theo luật: quét giá tím trong phiên. Phán quyết T+3: hàng về lỗ là bán.`; }
  else if (s.inPos) {
    chip = [`ĐANG GỒNG — T+${s.holdDays}, ${s.pnl>0?'+':''}${s.pnl.toFixed(1)}%`, s.pnl>0?'#e7f6ec':'#fdecec', s.pnl>0?'#128a3e':'#e5484d'];
    desc = `Mua ${s.buyDate} giá ${s.fill.toFixed(2)}. ` + (s.holdDays<3 ? `Chờ hàng về (T+3) — nếu đóng cửa ≤ giá mua thì BÁN.` : (s.belowMa20 ? `⚠️ Đang thủng MA20 — thêm 1 phiên đóng dưới nữa là BÁN.` : `Gồng tới khi đóng cửa dưới MA20 hai phiên liên tiếp. Cắt lỗ cứng −7%.`));
  }
  else if (!s.hasCeil && s.rng <= 12 && s.gtgd >= 20) { chip = ['NỀN ĐẠT — CHỜ CÂY TRẦN', '#fef9e7', '#b45309']; desc = `Nền 30 phiên biên độ ${s.rng.toFixed(1)}% (≤12%), chưa có trần, GTGD ${s.gtgd.toFixed(0)} tỷ/phiên. Chỉ chờ phiên kịch trần (+${s.ceilThr}%) với volume ≥2,5× TB là kích hoạt MUA.`; }
  else { chip = ['CHƯA CÓ SETUP', '#f3f5f7', '#6b7280']; const why = []; if (s.rng > 12) why.push(`nền còn rộng ${s.rng.toFixed(1)}% (cần ≤12%)`); if (s.hasCeil) why.push('đã có trần trong 30 phiên (sóng đã mở)'); if (s.gtgd < 20) why.push(`GTGD ${s.gtgd.toFixed(0)} tỷ (cần ≥20)`); desc = 'Thiếu: ' + why.join(' · '); }
  el.innerHTML = `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:8px">
    <span class="tag" style="background:${chip[1]};color:${chip[2]};font-size:14px;padding:6px 14px">${chip[0]}</span>
    <span class="mini">${desc}</span></div>
  <div class="kpis">
    <div class="kpi"><div class="l">Biên độ nền 30 phiên</div><div class="v" style="color:${s.rng<=12?'#128a3e':'#e5484d'}">${s.rng.toFixed(1)}%</div></div>
    <div class="kpi"><div class="l">Trần trong nền</div><div class="v" style="color:${!s.hasCeil?'#128a3e':'#e5484d'}">${s.hasCeil?'Có':'Chưa'}</div></div>
    <div class="kpi"><div class="l">GTGD TB20</div><div class="v" style="color:${s.gtgd>=20?'#128a3e':'#6b7280'}">${s.gtgd.toFixed(0)} tỷ</div></div>
    <div class="kpi"><div class="l">Vol hôm nay / TB20</div><div class="v">${s.volx.toFixed(2)}x</div></div>
    <div class="kpi"><div class="l">% hôm nay</div><div class="v" style="color:${s.chg>0?'#128a3e':'#e5484d'}">${s.chg>0?'+':''}${s.chg.toFixed(2)}%</div></div>
    <div class="kpi"><div class="l">Ngưỡng trần</div><div class="v">+${s.ceilThr}%</div></div>
  </div>`;
}

function drawPrice(years){
  if (!curOhlc) return;
  dtCharts.forEach(c=>c.remove()); dtCharts = [];
  ['chartMain','chartRsi','chartMacd'].forEach(id=>$('#'+id).innerHTML='');
  const oh = curOhlc; const n = oh.t.length;
  const from = years>=14 ? 0 : Math.max(0, n - Math.round(250*years));
  const T = oh.t.slice(from), O = oh.o.slice(from), H = oh.h.slice(from), Lo = oh.l.slice(from), C = oh.c.slice(from), V = oh.v.slice(from);
  const opts = chartOpts();
  opts.rightPriceScale.mode = useLog ? 1 : 0;
  const ch = LightweightCharts.createChart($('#chartMain'), opts); dtCharts.push(ch);
  const cs = ch.addCandlestickSeries(candleOpts());
  cs.setData(T.map((t,i)=>({time:t,open:O[i],high:H[i],low:Lo[i],close:C[i]})));
  if (curMarkers.length) cs.setMarkers(curMarkers.filter(m=>m.time>=T[0]));
  // OHLC legend theo con tro (kieu TradingView)
  const leg = document.getElementById('ohlcLegend');
  const fmtL = (i) => { const chgP = i>0 ? (C[i]/C[i-1]-1)*100 : 0; const cl = C[i]>=O[i] ? '#128a3e' : '#e5484d';
    return `<b>${curT}</b> &nbsp;O <span style="color:${cl}">${O[i]}</span> &nbsp;H <span style="color:${cl}">${H[i]}</span> &nbsp;L <span style="color:${cl}">${Lo[i]}</span> &nbsp;C <span style="color:${cl}">${C[i]}</span> &nbsp;<span style="color:${chgP>=0?'#128a3e':'#e5484d'}">${chgP>=0?'+':''}${chgP.toFixed(2)}%</span> &nbsp;<span class="mini">KL ${(V[i]/1e6).toFixed(2)}tr</span>`; };
  if (leg && T.length) { leg.innerHTML = fmtL(T.length-1);
    ch.subscribeCrosshairMove(p => { if (!p || !p.time) { leg.innerHTML = fmtL(T.length-1); return; } const ix = T.indexOf(p.time); if (ix>=0) leg.innerHTML = fmtL(ix); }); }
  const vs = ch.addHistogramSeries({priceScaleId:'vol', priceFormat:{type:'volume'}});
  ch.priceScale('vol').applyOptions({scaleMargins:{top:0.82,bottom:0}});
  vs.setData(T.map((t,i)=>({time:t,value:V[i],color: C[i]>=O[i] ? 'rgba(24,163,75,.35)':'rgba(229,72,77,.35)'})));
  const cAll = oh.c;
  const cut = a => a.slice(from);
  addLine(ch, T, cut(smaS(cAll,20)), '#2563eb', 'MA20');
  addLine(ch, T, cut(smaS(cAll,50)), '#d97706', 'MA50');
  if (cAll.length>=200) addLine(ch, T, cut(smaS(cAll,200)), '#8b5cf6', 'MA200');
  if ($('#ckBoll').checked) { const bb = bollS(cAll); addLine(ch, T, cut(bb.map(x=>x[0])), 'rgba(107,114,128,.55)', 'BB+'); addLine(ch, T, cut(bb.map(x=>x[1])), 'rgba(107,114,128,.55)', 'BB-'); }
  ch.timeScale().fitContent();
  // RSI
  const ch2 = LightweightCharts.createChart($('#chartRsi'), chartOpts()); dtCharts.push(ch2);
  addLine(ch2, T, cut(rsiS(cAll)), '#2563eb', 'RSI14');
  [30,70].forEach(v => ch2.addLineSeries({color:'#d1d5db',lineWidth:1,priceLineVisible:false,lastValueVisible:false}).setData(T.map(t=>({time:t,value:v}))));
  ch2.timeScale().fitContent();
  // MACD
  const ch3 = LightweightCharts.createChart($('#chartMacd'), chartOpts()); dtCharts.push(ch3);
  const md = macdS(cAll);
  const hs = ch3.addHistogramSeries({});
  hs.setData(T.map((t,i)=>{ const v = md.hist[from+i]; return v!=null?{time:t,value:v,color:v>=0?'rgba(24,163,75,.5)':'rgba(229,72,77,.5)'}:null; }).filter(Boolean));
  addLine(ch3, T, cut(md.m), '#2563eb', 'MACD'); addLine(ch3, T, cut(md.sig), '#d97706', 'Signal');
  ch3.timeScale().fitContent();
  // đồng bộ trục thời gian
  const sync = (a,b) => a.timeScale().subscribeVisibleLogicalRangeChange(r => r && b.timeScale().setVisibleLogicalRange(r));
  sync(ch,ch2); sync(ch,ch3); sync(ch2,ch);
}
function drawCanslim(r, qs){
  const np = qs.map(x=>pick(x,NPAT));
  const items = [
    ['C', r.cs?.C, `LNST quý gần nhất ${pct(r.npatYoY)} so với cùng kỳ (chuẩn: ≥ +25%)`],
    ['A', r.cs?.A, `Tăng trưởng LNST (TTM) 3 năm: ${pct(r.cagr3)}/năm (chuẩn: ≥ +20%)`],
    ['N', r.cs?.N, `Giá cách đỉnh 52 tuần ${pct(r.dHi)} (chuẩn: trong vòng 15%)`],
    ['S', r.cs?.S, `Volume phiên cuối gấp ${fmt(r.vx,2)} lần TB 20 phiên (chuẩn: ≥ 1.2x)`],
    ['L', r.cs?.L, `Sức mạnh giá RS = ${r.rs??'—'}/99 so với toàn thị trường (chuẩn: ≥ 70)`],
    ['I', r.cs?.I, `GTGD trung bình ${fmt((r.val20||0)/1000,1)} tỷ/phiên — thanh khoản đủ hút tổ chức (chuẩn: ≥ 5 tỷ)`],
    ['M', M_STATUS, M_STATUS==null ? 'Mở tab Thị trường để tính xu hướng VN-Index' : (M_STATUS?'VN-Index đang trên MA50 — thị trường thuận lợi':'VN-Index dưới MA50 — thị trường bất lợi')]
  ];
  $('#dCs').innerHTML = items.map(x=>`<div style="display:flex;align-items:center;margin:6px 0"><span class="cs-letter ${x[1]?'cs-on':'cs-off'}">${x[0]}</span><span class="mini" style="font-size:13px">${x[2]}</span></div>`).join('')
    + `<div style="margin-top:8px"><b>Tổng: ${(r.csTong||0)+(M_STATUS?1:0)}/7</b> <span class="mini">— chấm tự động từ dữ liệu, chỉ tham khảo</span></div>`;
}
function drawKq(qs){
  const last12 = qs.slice(-12);
  const labels = last12.map(x=>x.yearReport+'Q'+x.lengthReport);
  const rev = last12.map(x=>{ const v = pick(x,REV); return v!=null?v/1e9:null; });
  const np = last12.map(x=>{ const v = pick(x,NPAT); return v!=null?v/1e9:null; });
  if (kqChart) kqChart.destroy();
  kqChart = new Chart($('#cvKq'), { data: { labels, datasets: [
    {type:'bar', label:'Doanh thu', data:rev, backgroundColor:'rgba(24,163,75,.45)', yAxisID:'y'},
    {type:'line', label:'LNST', data:np, borderColor:'#2563eb', backgroundColor:'#2563eb', yAxisID:'y2', tension:.25}
  ]}, options: chartJsOpts(2) });
  // bảng 12 quý
  const yoy = (arr,i) => { const j = last12.length-12+i; const q = last12[i]; const prevIdx = qs.findIndex(x=>x.yearReport===q.yearReport-1 && x.lengthReport===q.lengthReport); const cur = pick(q,NPAT); const prev = prevIdx>=0?pick(qs[prevIdx],NPAT):null; return (cur!=null&&prev!=null&&prev!==0)?(cur/Math.abs(prev)-1)*100:null; };
  $('#tbKq').innerHTML = '<tr><th>Quý</th><th>Doanh thu (tỷ)</th><th>LNST (tỷ)</th><th>LNST YoY</th><th>Ngày công bố</th></tr>' +
    last12.slice().reverse().map((q,ri)=>{ const i = last12.length-1-ri; const g = yoy(last12,i);
      return `<tr><td><b>${labels[i]}</b></td><td>${fmt(rev[i],0)}</td><td class="${cls(np[i])}">${fmt(np[i],0)}</td><td class="${cls(g)}">${pct(g)}</td><td class="mini">${(q.publicDate||'').slice(0,10)}</td></tr>`; }).join('');
}
function drawRt(rts){
  const labels = rts.map(x=>x.yearReport+'Q'+x.quarter);
  if (rtChart) rtChart.destroy();
  rtChart = new Chart($('#cvRt'), { data: { labels, datasets: [
    {type:'line', label:'P/E', data:rts.map(x=>x.pe), borderColor:'#2563eb', yAxisID:'y', tension:.25},
    {type:'line', label:'P/B', data:rts.map(x=>x.pb), borderColor:'#d97706', yAxisID:'y2', tension:.25},
    {type:'line', label:'ROE %', data:rts.map(x=>x.roe!=null?x.roe*100:null), borderColor:'#18a34b', yAxisID:'y2', tension:.25}
  ]}, options: chartJsOpts(2) });
}
function chartJsOpts(axes){ const o = {responsive:true, plugins:{legend:{labels:{color:'#374151'}}}, scales:{x:{ticks:{color:'#6b7280'},grid:{color:'#eef1f4'}}, y:{ticks:{color:'#6b7280'},grid:{color:'#eef1f4'}}}}; if (axes===2) o.scales.y2 = {position:'right', ticks:{color:'#6b7280'}, grid:{drawOnChartArea:false}}; return o; }

// ================= 4. SO SÁNH =================
let cmpList = [], cmpInit = false, cmpChart = null;
window.addCmp = t => { if (!cmpList.includes(t)) { if (cmpList.length>=4) return toast('Tối đa 4 mã'); cmpList.push(t); } showView('compare'); };
inits.compare = function(){
  const el = $('#view-compare');
  if (!cmpInit) { cmpInit = true;
    el.innerHTML = `<div class="card"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <input id="cQ" placeholder="Thêm mã (Enter)…" style="width:170px"><span id="cChips"></span>
      <select id="cRange"><option value="0.5">6 tháng</option><option value="1" selected>1 năm</option><option value="3">3 năm</option></select>
    </div></div>
    <div class="card"><h2>Biến động giá (chuẩn hóa % từ đầu kỳ)</h2><canvas id="cvCmp" height="130"></canvas></div>
    <div class="card"><h2>So sánh chỉ số</h2><div style="overflow:auto"><table id="tbCmp"></table></div></div>`;
    $('#cQ').addEventListener('keydown', e => { if (e.key==='Enter') { const t = e.target.value.toUpperCase().trim(); if (byT[t]) { if (!cmpList.includes(t) && cmpList.length<4) cmpList.push(t); e.target.value=''; renderCmp(); } else toast('Không tìm thấy mã '+t); } });
    $('#cRange').onchange = renderCmp;
  }
  if (!cmpList.length) cmpList = ['FPT','HPG'];
  renderCmp();
};
async function renderCmp(){
  $('#cChips').innerHTML = cmpList.map(t=>`<span class="cmp-chip">${t}<span onclick="rmCmp('${t}')">✕</span></span>`).join('');
  window.rmCmp = t => { cmpList = cmpList.filter(x=>x!==t); renderCmp(); };
  if (!cmpList.length) { if (cmpChart) cmpChart.destroy(); $('#tbCmp').innerHTML=''; return; }
  const years = +$('#cRange').value;
  try {
    const days = Math.round(365*years)+10;
    const data = await Promise.all(cmpList.map(t=>api.ohlc(t, days)));
    const colors = ['#18a34b','#2563eb','#d97706','#8b5cf6'];
    // dùng trục thời gian của mã có ít nến nhất
    const base = data.reduce((a,b)=>(a.t||[]).length<=(b.t||[]).length?a:b);
    const labels = base.t.map(t=>new Date(t*1000).toISOString().slice(0,10));
    const ds = data.map((d,i)=>{ const map = {}; d.t.forEach((t,j)=>map[t]=d.c[j]); let first = null;
      const vals = base.t.map(t=>{ const v = map[t]; if (v!=null && first==null) first = v; return v!=null&&first?(v/first-1)*100:null; });
      return {type:'line', label:cmpList[i], data:vals, borderColor:colors[i], pointRadius:0, borderWidth:2, tension:.1}; });
    if (cmpChart) cmpChart.destroy();
    cmpChart = new Chart($('#cvCmp'), {data:{labels, datasets:ds}, options:{responsive:true, plugins:{legend:{labels:{color:'#374151'}}}, scales:{x:{ticks:{color:'#6b7280',maxTicksLimit:12},grid:{color:'#eef1f4'}}, y:{ticks:{color:'#6b7280',callback:v=>v+'%'},grid:{color:'#eef1f4'}}}}});
  } catch(e){ toast('Lỗi tải giá so sánh: '+e.message); }
  const metrics = [['Giá','p',2],['P/E','pe',1],['P/B','pb',2],['ROE %','roe',1],['LNST YoY %','npatYoY',1],['DT YoY %','revYoY',1],['LN 3 năm %/n','cagr3',1],['RS','rs',0],['CANSLIM','csTong',0],['Vốn hóa (tỷ)','cap',0],['Cổ tức %','dy',1],['Cách đỉnh 52T %','dHi',1]];
  $('#tbCmp').innerHTML = '<tr><th>Chỉ số</th>' + cmpList.map(t=>`<th>${t}</th>`).join('') + '</tr>' +
    metrics.map(m=>`<tr><td><b>${m[0]}</b></td>${cmpList.map(t=>{ const v = (byT[t]||{})[m[1]]; return `<td>${fmt(v,m[2])}</td>`; }).join('')}</tr>`).join('');
}

// ================= CẬP NHẬT DỮ LIỆU (client-side) =================
$('#btnRefresh').onclick = async function(){
  if (!confirm('Tải lại toàn bộ dữ liệu 702 mã từ API? Mất khoảng 1-2 phút.')) return;
  this.disabled = true; const st = $('#refreshStatus');
  try {
    const list = SUM.rows.map(r=>({t:r.t, b:r.b==='HO'?'HOSE':'HNX', n:r.n}));
    const out = []; const CONC = 6;
    const sma = (a,n)=>a.length>=n?a.slice(-n).reduce((x,y)=>x+y,0)/n:null;
    const one = async tk => { try {
      const now = NOW();
      const [oh, qsArr, rts] = await Promise.all([
        jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${tk.t}&resolution=D&from=${now-86400*420}&to=${now}`),
        api.kqkd(tk.t), api.ratios(tk.t)
      ]);
      const c = oh.c||[], v = oh.v||[], o = {t:tk.t, b:tk.b==='HOSE'?'HO':'HN', n:tk.n};
      if (c.length>30) { const last = c[c.length-1]; o.p = last;
        o.hi52 = Math.max(...c); o.lo52 = Math.min(...c); o.dHi = +((last/o.hi52-1)*100).toFixed(1);
        o.ma20 = +(last/sma(c,20)-1).toFixed(3); o.ma50 = c.length>=50?+(last/sma(c,50)-1).toFixed(3):null; o.ma200 = c.length>=200?+(last/sma(c,200)-1).toFixed(3):null;
        const rr = rsiS(c); o.rsi = rr[rr.length-1]!=null?Math.round(rr[rr.length-1]):null;
        o.v20 = Math.round(sma(v,20)||0); o.vx = o.v20?+(v[v.length-1]/o.v20).toFixed(2):null;
        o.val20 = Math.round((sma(v,20)||0)*last/1000);
        const ret = n => c.length>n?+((last/c[c.length-1-n]-1)*100).toFixed(1):null;
        o.r3 = ret(63); o.r6 = ret(126); o.r12 = ret(250); }
      const qs = qsArr;
      if (qs.length) { const rev = qs.map(x=>pick(x,REV)), np2 = qs.map(x=>pick(x,NPAT)); const n = qs.length;
        o.q = qs.slice(-9).map((x,i,arr)=>{ const idx = n-arr.length+i; return [x.yearReport,x.lengthReport,rev[idx],np2[idx]]; });
        if (n>=5 && np2[n-5]!=null && np2[n-1]!=null && np2[n-5]!==0) o.npatYoY = +((np2[n-1]/Math.abs(np2[n-5])-1)*100).toFixed(1);
        if (n>=5 && rev[n-5] && rev[n-1]!=null) o.revYoY = +((rev[n-1]/Math.abs(rev[n-5])-1)*100).toFixed(1);
        if (n>=17) { const a = np2.slice(n-4).reduce((x,y)=>x+(y||0),0), b = np2.slice(n-16,n-12).reduce((x,y)=>x+(y||0),0); if (a>0&&b>0) o.cagr3 = +((Math.pow(a/b,1/3)-1)*100).toFixed(1); } }
      if (rts.length) { const L = rts[rts.length-1];
        o.pe = L.pe!=null?+L.pe.toFixed(2):null; o.pb = L.pb!=null?+L.pb.toFixed(2):null;
        o.roe = L.roe!=null?+(L.roe*100).toFixed(1):null; o.roa = L.roa!=null?+(L.roa*100).toFixed(1):null;
        o.cap = L.marketCap?Math.round(L.marketCap/1e9):null; o.dte = L.debtToEquity!=null?+L.debtToEquity.toFixed(2):null;
        o.gm = L.grossMargin!=null?+(L.grossMargin*100).toFixed(1):null; o.dy = L.dividendYield!=null?+(L.dividendYield*100).toFixed(2):null; }
      out.push(o);
    } catch(e){} };
    for (let i=0;i<list.length;i+=CONC) { await Promise.all(list.slice(i,i+CONC).map(one)); st.innerHTML = `<span class="spin"></span> ${Math.min(i+CONC,list.length)}/${list.length} mã…`; }
    // RS + CANSLIM — RS chỉ xếp hạng trong nhóm thanh khoản >= 10 tỷ/ngày để không bị nhiễu bởi mã rác
    const score = r => (r.r3!=null?0.4*r.r3:0)+(r.r6!=null?0.3*r.r6:0)+(r.r12!=null?0.3*r.r12:0);
    const sorted = out.filter(r=>r.p!=null && (r.val20||0)>=10000).map(r=>({t:r.t,s:score(r)})).sort((a,b)=>a.s-b.s);
    const rk = {}; sorted.forEach((x,i)=>rk[x.t]=Math.max(1,Math.round((i+1)/sorted.length*99)));
    for (const r of out) { r.rs = rk[r.t]||null;
      r.cs = {C:r.npatYoY>=25?1:0, A:(r.cagr3||0)>=20?1:0, N:(r.dHi??-99)>=-15?1:0, S:(r.vx||0)>=1.2?1:0, L:(r.rs||0)>=70?1:0, I:(r.val20||0)>=5000?1:0};
      r.csTong = Object.values(r.cs).reduce((a,b)=>a+b,0); }
    SUM = {updated: new Date().toISOString().slice(0,16).replace('T',' ')+' (trình duyệt)', nTickers: out.length, rows: out};
    try { localStorage.setItem('summary_v1', JSON.stringify(SUM)); } catch(e){}
    Object.keys(byT).forEach(k=>delete byT[k]); SUM.rows.forEach(r=>byT[r.t]=r);
    $('#bgeData').textContent = 'Dữ liệu screener: ' + SUM.updated;
    st.textContent = '✓ Đã cập nhật ' + out.length + ' mã';
    scInit = false; mktDone = false;
    const cur = views.find(v=>$('#view-'+v).style.display!=='none');
    inits[cur] && inits[cur]();
  } catch(e){ st.textContent = 'Lỗi: '+e.message; }
  this.disabled = false;
};

// ================= KHỞI ĐỘNG =================
inits.market();
})();
