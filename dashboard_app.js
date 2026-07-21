/* Dashboard Cổ Phiếu VN — HOSE + HNX — dữ liệu sống từ VNDirect + Vietcap IQ */
(function(){
'use strict';
// ================= DỮ LIỆU & TIỆN ÍCH =================
let SUM = window.SUMMARY;
try { const ls = localStorage.getItem('summary_v1'); if (ls) { const p = JSON.parse(ls); if (p && p.rows && p.rows.length > 500) { if (!p.tpn && window.SUMMARY.tpn) p.tpn = window.SUMMARY.tpn; if (!p.rows.some(r=>r.watch) && window.SUMMARY.rows.some(r=>r.watch)) { const wm={}; window.SUMMARY.rows.forEach(r=>{ if(r.watch) wm[r.t]=r; }); p.rows.forEach(r=>{ const w=wm[r.t]; if(w){ r.watch=1; r.wrng=w.wrng; r.wdb=w.wdb; r.wgrade=w.wgrade; } }); } SUM = p; } } } catch(e){}
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

const ga = (n,p) => { try { window.gtag && gtag('event', n, p||{}); } catch(e){} };
const _ntf = {};
function beepSound(){ try { const a = new (window.AudioContext||window.webkitAudioContext)(); const o = a.createOscillator(), g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = 880; g.gain.value = 0.12; o.start(); o.stop(a.currentTime + 0.3); } catch(e){} }
function notifyPush(key, title, body, repeatMs){
  const now = Date.now();
  if (_ntf[key] && now - _ntf[key] < (repeatMs || 8.64e7)) return;
  _ntf[key] = now;
  toast(title + ' — ' + body);
  beepSound();
  try { if ('Notification' in window && Notification.permission === 'granted') {
    const n = new Notification(title, {body, tag: key, requireInteraction: true, renotify: true});
    n.onclick = () => { window.focus(); n.close(); };
  } } catch(e){}
}
document.addEventListener('click', () => { try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch(e){} }, {once:true});
// ============ CHỈ BÁO KỸ THUẬT ============
function smaS(a,n){ const o=[]; let s=0; for(let i=0;i<a.length;i++){ s+=a[i]; if(i>=n) s-=a[i-n]; o.push(i>=n-1 ? s/n : null);} return o; }
function emaS(a,n){ const o=[]; const k=2/(n+1); let e=null; for(let i=0;i<a.length;i++){ e = e==null ? a[i] : a[i]*k + e*(1-k); o.push(i>=n-1?e:null);} return o; }
function rsiS(c,n=14){ const o=[null]; let g=0,l=0; for(let i=1;i<c.length;i++){ const d=c[i]-c[i-1]; const up=Math.max(d,0), dn=Math.max(-d,0); if(i<=n){ g+=up; l+=dn; o.push(i===n ? 100-100/(1+(g/n)/((l/n)||1e-9)) : null); if(i===n){g/=n;l/=n;} } else { g=(g*(n-1)+up)/n; l=(l*(n-1)+dn)/n; o.push(100-100/(1+g/(l||1e-9))); } } return o; }
function macdS(c){ const e12=emaS(c,12), e26=emaS(c,26); const m=c.map((_,i)=>e12[i]!=null&&e26[i]!=null?e12[i]-e26[i]:null); const valid=m.map(x=>x==null?0:x); const sig=emaS(valid,9).map((x,i)=>m[i]==null?null:x); return {m, sig, hist:m.map((x,i)=>x!=null&&sig[i]!=null?x-sig[i]:null)}; }
function bollS(c,n=20,k=2){ const ma=smaS(c,n); return c.map((_,i)=>{ if(ma[i]==null) return [null,null]; let s=0; for(let j=i-n+1;j<=i;j++) s+=Math.pow(c[j]-ma[i],2); const sd=Math.sqrt(s/n); return [ma[i]+k*sd, ma[i]-k*sd]; }); }

// ================= ĐIỀU HƯỚNG =================
const views = ['market','screener','watch','detail','compare','leader'];
$$('.nav-link').forEach(b => b.onclick = () => showView(b.dataset.view));
function showView(v, skip){ ga('view_tab', {tab_name: v}); views.forEach(x => { $('#view-'+x).style.display = x===v?'':'none'; }); $$('.nav-link').forEach(b=>b.classList.toggle('active', b.dataset.view===v)); if(!skip) inits[v] && inits[v](); }
window.showView = showView;

const inits = {};
// ================= LEADER BOARD =================
(function addLeaderTab(){
  const nav = document.querySelector('nav');
  if (nav && !nav.querySelector('[data-view="leader"]')) {
    const b = document.createElement('button');
    b.className = 'nav-link'; b.dataset.view = 'leader'; b.textContent = 'Leader Board';
    b.onclick = () => showView('leader');
    nav.appendChild(b);
  }
  if (nav) ['market','detail','leader','compare','screener','watch'].forEach(v => {
    const b = nav.querySelector('[data-view="'+v+'"]'); if (b) nav.appendChild(b);
  });
  if (!document.getElementById('lbCss')) {
    const st = document.createElement('style'); st.id = 'lbCss';
    st.textContent = '.wrap,.topbar-in{max-width:min(1800px,96vw)!important}'
      + '#lbGrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:5px;align-items:start;padding:6px 0 8px}'
      + '#lbGrid .lbCol{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:5px 4px;min-width:0}'
      + '#lbGrid .lbHd{font-weight:700;font-size:9px;line-height:1.15;color:var(--text);padding-bottom:4px;margin-bottom:5px;border-bottom:2px solid var(--green);min-height:23px;display:flex;align-items:flex-end}'
      + '#lbGrid .lbR{display:flex;justify-content:space-between;gap:3px;padding:2px 4px;margin-bottom:1.5px;border-radius:3px;cursor:pointer;font-size:10.5px;line-height:1.4}'
      + '#lbGrid .lbR b{font-weight:700}'
      + '@media(max-width:1150px){#lbGrid{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(104px,1fr);overflow-x:auto}}';
    document.head.appendChild(st);
  }
  if (!document.getElementById('view-leader')) {
    const d = document.createElement('div');
    d.id = 'view-leader'; d.style.display = 'none';
    const a = document.getElementById('view-compare');
    if (a && a.parentNode) a.parentNode.insertBefore(d, a.nextSibling);
    else { const w = document.querySelector('.wrap'); if (w) w.appendChild(d); }
  }
})();

(function brandFooter(){
  const f = document.querySelector('footer');
  if (!f || f.dataset.branded) return;
  f.dataset.branded = '1';
  f.innerHTML =
    '<div style="font-style:normal;font-weight:700;font-size:13.5px;color:var(--text)">'
    + 'Nguyễn Ngọc Anh Khoa'
    + '<span style="color:var(--border);font-weight:400;margin:0 8px">|</span>'
    + '<a href="tel:0339136452" style="color:var(--green-dark);text-decoration:none">0339 136 452</a>'
    + '<span style="color:var(--border);font-weight:400;margin:0 8px">|</span>'
    + 'Giám đốc Tư vấn Đầu tư — Chứng khoán KAFI'
    + '</div>'
    + '<div style="margin-top:7px;font-size:11px;font-style:italic">Số liệu hiệu suất từ mô phỏng lịch sử (backtest) đã gồm phí giao dịch; kết quả quá khứ không đảm bảo tương lai — thông tin chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</div>';
})();

const LB_SECTORS = {
  "THÉP": ["HPG","HSG","VGS","NKG"],
  "BĐS": ["DXG","CEO","DXS","DPG","NVL","VHM","VIC","NTL","NLG","DIG","HDC","ITC","TCH","PDR","DTD","KDH","ASM","TDC","L14","TIG"],
  "CHỨNG KHOÁN": ["CTS","VND","SHS","VIX","SSI","MBS","ORS","FTS","BVS","AGR","HCM","VCI","BSI"],
  "NGÂN HÀNG": ["SHB","MBB","STB","OCB","TCB","CTG","MSB","VPB","EIB","ACB","HDB","TPB","LPB","BID","VIB","VCB","NAB"],
  "BĐS KCN": ["PHR","GVR","SZC","DPR","KBC","VGC","IDC","IJC","SIP"],
  "CẢNG - VẬN TẢI": ["PVP","VOS","DXP","VIP","GMD","HAH","VSC"],
  "ĐẦU TƯ CÔNG": ["CTI","VCG","HT1","PLC","CTD","HHV","FCN","KSB","CII","LCG","HUT"],
  "DẦU KHÍ": ["PVC","GAS","PVS","PVB","PVT","OIL","PLX","PVD","BSR"],
  "BÁN LẺ": ["DGW","MWG","PET","FRT","PNJ"],
  "PHÂN BÓN - HÓA CHẤT": ["DDV","BFC","DCM","DPM","LAS","DGC","CSV"],
  "MID": ["DBC","GEX","ANV","HDG","REE","GIL","TNG","NTP","MSH","BMP","HVN","CTR","QNS","TV2","SCS","VHC","VGI","DRC","EVF","VCS","PC1","VTP","ACV","VPG"],
  "VN30": ["GAS","MBB","STB","TCB","CTG","MSN","MWG","HPG","VHM","VIC","VPB","SHB","ACB","VRE","BVH","SSI","BID","VIB","VCB","BCM","VNM","FPT","SAB"]
};
const LB_BANDS = [
  {max:400,  label:'Yếu',       rng:'&lt;400',    bg:'#BFE6F7', fg:'#0F3D56'},
  {max:500,  label:'Trung Bình',rng:'400-500',    bg:'#FFFFFF', fg:'#1F2937'},
  {max:550,  label:'Khá',       rng:'500-550',    bg:'#D9EFD9', fg:'#14532D'},
  {max:600,  label:'Khỏe',      rng:'550-600',    bg:'#00A550', fg:'#FFFFFF'},
  {max:1e9,  label:'Rất Khỏe',  rng:'&gt;600',    bg:'#C77DD6', fg:'#FFFFFF'}
];
const lbBand = v => LB_BANDS.find(b => v < b.max) || LB_BANDS[LB_BANDS.length-1];

function lbRangePos(c, L, p){
  if (L-p+1 < 0) return null;
  const s = c.slice(L-p+1, L+1);
  let hi=-Infinity, lo=Infinity;
  for (const x of s){ if(x.h>hi) hi=x.h; if(x.l<lo) lo=x.l; }
  return hi===lo ? 0 : 100*(c[L].c-lo)/(hi-lo);
}
function lbMoneyFlow(c, L, p){
  if (L-p+1 < 0) return null;
  const s = c.slice(L-p+1, L+1);
  let pos=0, neg=0;
  for (let i=1;i<s.length;i++){
    const a=(s[i].h+s[i].l+s[i].c)/3, b=(s[i-1].h+s[i-1].l+s[i-1].c)/3;
    const f=a*s[i].v;
    if (a>b) pos+=f; else if (a<b) neg+=f;
  }
  if (neg===0) return 100;
  return 100-(100/(1+pos/neg));
}
function lbScore(c, L){
  const P=[20,50,100,200];
  let t=0;
  for (const p of P){
    const k=lbRangePos(c,L,p), m=lbMoneyFlow(c,L,p);
    if (k===null||m===null) return null;
    t += k+m;
  }
  return t;
}

let lbRaw = null, lbLoading = false, lbTimer = null, lbStamp = '';
const LB_SYMS = [...new Set(Object.values(LB_SECTORS).flat())];
const lbInSession = () => { const d=new Date(), w=d.getDay(), m=d.getHours()*60+d.getMinutes();
  return w>=1 && w<=5 && m>=9*60 && m<=15*60; };

async function lbFetchAll(onProg){
  const now = Math.floor(Date.now()/1000);
  const from = now - 86400*500, to = now + 86400;
  const out = {}; let idx = 0, done = 0;
  await Promise.all(Array.from({length:8}, async () => {
    while (idx < LB_SYMS.length){
      const sy = LB_SYMS[idx++];
      try {
        const r = await fetch(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${sy}&resolution=D&from=${from}&to=${to}`).then(x=>x.json());
        if (r && r.t && r.t.length >= 200) out[sy] = r.t.map((tt,i)=>({t:tt, h:r.h[i], l:r.l[i], c:r.c[i], v:r.v[i]}));
      } catch(e){}
      done++; onProg && onProg(done, LB_SYMS.length);
    }
  }));
  return out;
}

function lbRender(){
  const grid = document.getElementById('lbGrid');
  if (!grid || !lbRaw) return;
  grid.innerHTML = Object.entries(LB_SECTORS).map(([name, syms]) => {
    const rows = syms.map(sy => {
      const c = lbRaw[sy]; if (!c) return null;
      const v = lbScore(c, c.length-1); if (v===null) return null;
      return {t:sy, sm:Math.round(v)};
    }).filter(Boolean).sort((a,b)=>b.sm-a.sm);
    if (!rows.length) return '';
    const body = rows.map(r => {
      const b = lbBand(r.sm);
      const brd = b.bg === '#FFFFFF' ? ';box-shadow:inset 0 0 0 1px var(--border)' : '';
      return `<div class="lbR" onclick="openDetail('${r.t}')" style="background:${b.bg};color:${b.fg}${brd}"><b>${r.t}</b><span>${r.sm}</span></div>`;
    }).join('');
    return `<div class="lbCol"><div class="lbHd">${name}</div>${body}</div>`;
  }).join('');
  const st = document.getElementById('lbStatus');
  if (st) st.textContent = lbStamp;
}

async function lbLoad(){
  if (lbLoading) return;
  lbLoading = true;
  const st = document.getElementById('lbStatus');
  if (st && !lbRaw) st.innerHTML = '<span class="spin"></span> Đang tải dữ liệu…';
  try {
    lbRaw = await lbFetchAll((d,n)=>{ if (st && !lbRaw && d%25===0) st.innerHTML = '<span class="spin"></span> Đang xử lý ' + d + '/' + n + ' mã…'; });
    let ngay = '';
    const any = Object.values(lbRaw)[0];
    if (any) { const d = new Date(any[any.length-1].t*1000); ngay = ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2); }
    lbStamp = (lbInSession() ? 'Trong phiên · giá chạy realtime' : 'Kết phiên ' + ngay)
            + ' · cập nhật ' + new Date().toTimeString().slice(0,5) + ' · ' + Object.keys(lbRaw).length + ' mã';
    lbRender();
  } catch(e){
    if (st) st.textContent = 'Lỗi tải dữ liệu: ' + e.message;
  }
  lbLoading = false;
}

inits.leader = function(){
  const el = $('#view-leader');
  if (!el.dataset.built) {
    el.dataset.built = '1';
    el.innerHTML = `<div class="card" style="padding:14px 14px 12px">
      <div style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:4px">
        <h2 style="margin:0">Leader Board <span class="hint">sức mạnh dòng tiền theo ngành</span></h2>
        <div class="mini" id="lbStatus" style="margin-left:auto"></div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;border-bottom:1px solid var(--border);padding-bottom:9px;margin-bottom:2px">
        <span class="mini" style="font-weight:600">Thang điểm:</span>
        ${LB_BANDS.map(b=>{
          const brd = b.bg==='#FFFFFF' ? ';box-shadow:inset 0 0 0 1px var(--border)' : '';
          return `<span style="border-radius:4px;padding:2px 8px;font-size:10.5px;font-weight:700;background:${b.bg};color:${b.fg}${brd}">${b.rng} ${b.label}</span>`;
        }).join('')}
        <span class="mini" style="margin-left:auto;font-style:italic">Bấm vào mã để xem chi tiết</span>
      </div>
      <div id="lbGrid"></div>
    </div>`;
  }
  if (!lbRaw && !lbLoading) lbLoad(); else lbRender();
  if (!lbTimer) lbTimer = setInterval(() => {
    const v = document.getElementById('view-leader');
    if (v && v.style.display !== 'none' && lbInSession() && !lbLoading) lbLoad();
  }, 180000);
};

// ===== Tim kiem tren navbar =====
(function(){
  const q = $('#navQ'), box = $('#navSugg');
  if (!q) return;
  q.addEventListener('input', () => {
    const s = q.value.toUpperCase();
    if (!s) { box.style.display='none'; return; }
    const hits = ROWS().filter(r=>r.t.startsWith(s) || (r.n||'').toUpperCase().includes(s)).slice(0,10);
    box.innerHTML = hits.map(r=>`<div onclick="openDetail('${r.t}');document.getElementById('navQ').value='';document.getElementById('navSugg').style.display='none'"><b>${r.t}</b> <span class="mini">${r.n||''} · ${r.b==='HO'?'HOSE':'HNX'}</span></div>`).join('');
    box.style.display = hits.length?'block':'none';
  });
  q.addEventListener('keydown', e => { if (e.key==='Enter') { const t = q.value.toUpperCase().trim(); if (byT[t]) { window.openDetail(t); q.value=''; box.style.display='none'; } } });
  document.addEventListener('click', e => { if (!e.target.closest('.searchbox')) box.style.display='none'; });
})();

// ================= 1. THỊ TRƯỜNG =================
let mktDone = false, M_STATUS = null, perfChart = null, perfRange = 'all';
function rrect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
const endBadge = { id:'endBadge', afterDatasetsDraw(chart){
  const ctx = chart.ctx;
  chart.data.datasets.forEach((ds,di)=>{
    const meta = chart.getDatasetMeta(di); const pt = meta.data[meta.data.length-1]; if (!pt) return;
    const val = ds.data[ds.data.length-1];
    const txt = (val>=0?'+':'')+val.toFixed(1)+'%';
    ctx.save(); ctx.font = '700 12px Inter, sans-serif';
    const w = ctx.measureText(txt).width + 16;
    ctx.fillStyle = ds.borderColor; rrect(ctx, pt.x+7, pt.y-12, w, 24, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText(txt, pt.x+15, pt.y+1); ctx.restore();
  });
}};
function drawPerf(){
  const tpn = SUM.tpn; if (!tpn || !tpn.curve || !tpn.curve.length) return;
  let cv = tpn.curve;
  if (/^20\d\d$/.test(perfRange)) cv = cv.filter(x=>x[0].startsWith(perfRange));
  else if (perfRange !== 'all') cv = cv.slice(perfRange==='1y' ? -52 : -26);
  const b0 = cv[0];
  const labels = cv.map(x => x[0].slice(5,7)+'/'+x[0].slice(2,4));
  const dsT = cv.map(x => +(((1+x[1]/100)/(1+b0[1]/100)-1)*100).toFixed(1));
  const dsV = cv.map(x => +(((1+x[2]/100)/(1+b0[2]/100)-1)*100).toFixed(1));
  if (perfChart) perfChart.destroy();
  perfChart = new Chart(document.getElementById('cvPerf'), { type:'line',
    data:{ labels, datasets:[
      {label:'Khoa KAFI Signal', data:dsT, borderColor:'#128A3E', backgroundColor:'#128A3E', pointRadius:0, borderWidth:2.5, tension:.35},
      {label:'VN-Index', data:dsV, borderColor:'#E5484D', backgroundColor:'#E5484D', pointRadius:0, borderWidth:2, tension:.35}]},
    options:{ responsive:true, maintainAspectRatio:false, layout:{padding:{right:70}}, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{labels:{color:'#1F2937', usePointStyle:true, pointStyle:'circle', boxWidth:7, boxHeight:7, font:{weight:600, size:12, family:'Inter'}}},
        tooltip:{callbacks:{label:c=>c.dataset.label+': '+(c.parsed.y>=0?'+':'')+c.parsed.y+'%'}} },
      scales:{ x:{ticks:{color:'#7A828E', maxTicksLimit:10, font:{size:11}}, grid:{display:false}},
               y:{ticks:{color:'#7A828E', callback:v=>v+'%', font:{size:11}}, grid:{color:'#F1F3F6'}} } },
    plugins:[endBadge] });
}
async function liveQuote(){
  try {
    let data = null;
    for (let k = 0; k < 7; k++) {
      const day = new Date(Date.now()-k*86400000).toISOString().slice(0,10);
      const r = await jget(`https://api-finfo.vndirect.com.vn/v4/stock_prices?sort=code&q=date:gte:${day}~date:lte:${day}&size=3000`);
      if (r.data && r.data.length > 300) { data = r.data; break; }   // ngay giao dich gan nhat
    }
    if (!data) return false;
    let n = 0;
    data.forEach(d=>{ const row = byT[d.code]; if (!row) return;
      if (d.close!=null) row.p = d.close;
      if (d.pctChange!=null) row.chg = +(+d.pctChange).toFixed(2);
      if (row.v20 && d.nmVolume!=null) row.vx = +(d.nmVolume/row.v20).toFixed(2);
      n++; });
    if (n) { const el = document.getElementById('bgeData'); if (el) el.textContent = 'Giá cập nhật lúc ' + new Date().toTimeString().slice(0,5) + ' (phiên ' + data[0].date.slice(8,10)+'/'+data[0].date.slice(5,7) + ') · FA/screener: ' + (SUM.updated||''); }
    return n > 0;
  } catch(e){ return false; }
}
function renderTops(){
  const el = document.getElementById('topCs'); if (!el) return;
  const mini2 = (rows, cols) => `<table><tr><th>Mã</th>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr>` +
    rows.map(r=>`<tr class="row" onclick="openDetail('${r.t}')"><td><b>${r.t}</b> <span class="mini">${(r.n||'').slice(0,22)}</span></td>${cols.map(c=>`<td class="${c[2]?c[2](r):''}">${c[1](r)}</td>`).join('')}</tr>`).join('') + '</table>';
  const gCols = [['Giá',r=>fmt(r.p,2)],['+/- %',r=>pct(r.chg,2),r=>cls(r.chg)],['KL (tr)',r=>r.vx&&r.v20?fmt(r.vx*r.v20/1e6,2):'—'],['KL xTB20',r=>r.vx?fmt(r.vx,1)+'x':'—',r=>(r.vx||0)>=1.5?'up':'mut'],['GTGD TB20 (tỷ)',r=>fmt((r.val20||0)/1000,0)]];
  const lq = r => (r.val20||0) >= 20000 && r.chg != null;
  el.innerHTML = mini2([...ROWS()].filter(lq).sort((a,b)=>(b.chg||-99)-(a.chg||-99)).slice(0,10), gCols);
  const el2 = document.getElementById('topRs');
  if (el2) el2.innerHTML = mini2([...ROWS()].filter(lq).sort((a,b)=>((b.vx||0)*(b.v20||0))-((a.vx||0)*(a.v20||0))).slice(0,10), gCols);
}
function renderMonthly(){
  const el = document.getElementById('moTable'); if (!el) return;
  const tpn = SUM.tpn; if (!tpn || !tpn.curve || !tpn.curve.length) return;
  const ends = {}, order = [];
  tpn.curve.forEach(x => { const k = x[0].slice(0,7); if (!(k in ends)) order.push(k); ends[k] = x; });
  const mret = {}, yend = {}, yorder = [];
  let prev = null;
  order.forEach(k => {
    const y = k.slice(0,4), m = +k.slice(5,7), cur = ends[k];
    const pt = prev ? prev[1] : 0;
    (mret[y] = mret[y] || {})[m] = ((1+cur[1]/100)/(1+pt/100)-1)*100;
    if (!yend[y]) yorder.push(y);
    yend[y] = cur; prev = cur;
  });
  const G = ['#EAF7EF','#D0EFDC','#AEE4C4','#86D7A8','#5CC98C'], R = ['#FDEEEE','#FBD9DA','#F8C2C3','#F3A6A8','#EE8A8D'];
  let nAct = 0, nPos = 0, best = null, worst = null;
  yorder.forEach(y => { for (const m in mret[y]) { const v = mret[y][m]; if (Math.abs(v) < 0.05) continue; nAct++; if (v > 0) nPos++; if (best==null || v > best) best = v; if (worst==null || v < worst) worst = v; } });
  const sum = document.getElementById('moSum');
  if (sum && nAct) sum.innerHTML = `Tỷ lệ tháng có lãi: <b class="up">${Math.round(nPos/nAct*100)}%</b> &nbsp;·&nbsp; Tháng lãi cao nhất: <b class="up">+${best.toFixed(1)}%</b> &nbsp;·&nbsp; Tháng lỗ sâu nhất: <b class="down">−${Math.abs(worst).toFixed(1)}%</b>`;
  const cell = v => {
    if (v==null || Math.abs(v) < 0.05) return '<td style="border-top:none;text-align:center;padding:6px 0;border-radius:4px;background:#FAFBFC;color:#C6CBD1;font-weight:400">·</td>';
    const i = Math.min(4, Math.floor(Math.abs(v)/15*5));
    const bg = v>0 ? G[i] : R[i], tc = v>0 ? '#0d6e31' : '#B03A3E';
    return `<td style="border-top:none;text-align:center;padding:6px 0;border-radius:4px;background:${bg};color:${tc};font-weight:600">${v>0?'+':'−'}${Math.abs(v).toFixed(1)}</td>`;
  };
  const thS = 'border-bottom:none;text-align:center;padding:4px 0;font-size:11px';
  const head = `<tr><th style="${thS};text-align:left;padding-left:4px">Năm</th>` + Array.from({length:12},(_,i)=>`<th style="${thS}">T${i+1}</th>`).join('') + `<th style="${thS}">Cả năm</th><th style="${thS}">VN-Index</th></tr>`;
  let prevY = null; const rows = [];
  yorder.forEach(y => {
    const e = yend[y], pt = prevY ? prevY[1] : 0, pv = prevY ? prevY[2] : 0;
    const yr = ((1+e[1]/100)/(1+pt/100)-1)*100, vr = ((1+e[2]/100)/(1+pv/100)-1)*100;
    rows.push(`<tr><td style="border-top:none;text-align:left;padding:6px 4px"><b>${y}</b></td>` + Array.from({length:12},(_,i)=>cell(mret[y]&&mret[y][i+1]!=null?mret[y][i+1]:null)).join('') + `<td style="border-top:none;text-align:center;padding:6px 0;border-radius:4px;background:${yr>=0?'#128A3E':'#E5484D'};color:#fff;font-weight:700">${yr>0?'+':'−'}${Math.abs(yr).toFixed(1)}</td><td style="border-top:none;text-align:center;padding:6px 0;color:#7A828E">${vr>0?'+':'−'}${Math.abs(vr).toFixed(1)}</td></tr>`);
    prevY = e;
  });
  el.innerHTML = `<table style="border-collapse:separate;border-spacing:2px;table-layout:fixed;font-size:12px">` + head + rows.reverse().join('') + '</table>';
}
function renderRecent(){
  const el = document.getElementById('recentWrap'); if (!el) return;
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  el.innerHTML = `<table class="sigtb"><tr><th>Mã</th><th>Giá mua</th><th>Giá bán / TT</th><th>Lợi suất</th></tr>` +
    tpn.recent.map(d=>{ const sp = d.bp*(1+(d.ret+(d.open?0.15:0.4))/100); return `<tr class="row" onclick="openDetail('${d.t}')">
      <td><div class="l1">${d.t} ${d.open?(d.today?'<span class="chip g">Mua hôm nay</span>':'<span class="chip a">Đang mở</span>'):''}</div><div class="l2">${d.bd}</div></td>
      <td><div class="l1" style="font-size:13px">${d.bp}</div></td>
      <td><div class="l1" style="font-size:13px">${sp>=100?sp.toFixed(1):sp.toFixed(2)}</div><div class="l2">${d.open?'giá TT':'bán '+d.sd}</div></td>
      <td><span class="${d.ret>=0?'up':'down'}" style="font-size:14px">${d.ret>=0?'+':''}${d.ret}%</span></td></tr>`;}).join('') + '</table>';
}
function loadLiveDeals(){ try { return JSON.parse(localStorage.getItem('kafi_live_deals')) || []; } catch(e){ return []; } }
function saveLiveDeals(a){ try { localStorage.setItem('kafi_live_deals', JSON.stringify(a.slice(-20))); } catch(e){} }
function mergeLiveDeals(){
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  const cut = Date.now() - 185*86400000;
  const store = loadLiveDeals().filter(x => new Date(x.bdate).getTime() > cut);
  store.forEach(x => {
    if (tpn.recent.some(y => y.t === x.t && y.bdate === x.bdate)) return;
    tpn.recent.unshift({t:x.t, bd:x.bd, bdate:x.bdate, bp:x.bp, sd:'—', ret:-0.15, open:true});
  });
  saveLiveDeals(store);
}
function ensureFreshBanner(){
  try {
    const meta = document.getElementById('bgeData');
    if (!meta || document.getElementById('staleBtn')) return;
    const m = (SUM.updated||'').match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return;
    const age = (Date.now() - new Date(m[1]+'-'+m[2]+'-'+m[3]).getTime()) / 86400000;
    if (age < 5) return;
    const b = document.createElement('button');
    b.id = 'staleBtn'; b.className = 'btn';
    b.style.cssText = 'margin-left:10px;padding:4px 12px;font-size:12px;background:#fdecec;border:1px solid #f0a8ab;color:#c0353a;font-weight:700;border-radius:8px;cursor:pointer';
    b.textContent = 'Dữ liệu cơ bản đã cũ ' + Math.floor(age) + ' ngày — bấm cập nhật (~2 phút)';
    b.onclick = () => { b.remove(); document.getElementById('btnRefresh').click(); };
    meta.parentNode.appendChild(b);
  } catch(e){}
}
function ensureNotifBanner(){
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') return;
  const meta = document.getElementById('bgeData');
  if (!meta || document.getElementById('notifBtn')) return;
  const b = document.createElement('button');
  b.id = 'notifBtn'; b.className = 'btn';
  b.style.cssText = 'margin-left:10px;padding:5px 14px;font-size:12px;background:#e8f7ee;border:1px solid #7fd2a1;color:#0d6e31;font-weight:700;border-radius:999px;cursor:pointer';
  b.textContent = '🔔 Bật thông báo realtime';
  b.onclick = async () => {
    if (Notification.permission === 'denied') {
      alert('Thông báo của trang đang bị CHẶN.' + String.fromCharCode(10,10) + 'Cách mở: bấm biểu tượng Ổ KHÓA cạnh thanh địa chỉ, chọn Thông báo: Cho phép, rồi tải lại trang.');
      return;
    }
    const p = await Notification.requestPermission();
    if (p === 'granted') {
      try { new Notification('Khoa KAFI Signal', {body: 'Đã bật thông báo realtime — có tín hiệu mới sẽ báo ngay tại đây, kể cả khi bạn đang mở tab khác.'}); } catch(e){}
      b.remove();
    }
  };
  meta.parentNode.appendChild(b);
}
async function verifySignalAt(t, ds){
  try {
    const bts = Math.floor(new Date(ds+'T00:00:00Z').getTime()/1000);
    const r = await jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${t}&resolution=D&from=${bts-120*86400}&to=${bts+43200}`);
    const c = r.c, v = r.v, tt = r.t; if (!c || c.length < 35) return null;
    const i = c.length-1;
    if (Math.abs(tt[i]-bts) > 86400) return null;
    const thr = (byT[t] && byT[t].b === 'HN') ? 8.8 : 6.3;
    const chg = (c[i]/c[i-1]-1)*100; if (chg < thr) return null;
    let hi=-1e9, lo=1e9, hc=false, sv=0, svv=0;
    for (let k=i-30; k<i; k++){ if(c[k]>hi)hi=c[k]; if(c[k]<lo)lo=c[k]; if((c[k]/c[k-1]-1)*100>=thr)hc=true; }
    for (let k=i-20; k<i; k++){ sv+=v[k]; svv+=c[k]*v[k]; }
    const v20=sv/20, gt=svv/20/1e6;
    if (hc || (hi-lo)/lo*100 > 12 || v[i] < 2*v20 || gt < 15) return null;
    return {bp: +c[i].toFixed(2)};
  } catch(e){ return null; }
}
async function retroScanSignals(){
  try {
    const KEY='kafi_retro_ts';
    if (Date.now() - (+localStorage.getItem(KEY)||0) < 6*3600*1000) return;
    const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
    let store = loadLiveDeals(); let changed = false;
    for (let k=1; k<=10; k++){
      const D = new Date(Date.now()-k*86400000);
      if (D.getDay()===0 || D.getDay()===6) continue;
      const ds = D.toISOString().slice(0,10);
      let rows = [];
      try { const rr = await jget(`https://api-finfo.vndirect.com.vn/v4/stock_prices?sort=code&q=date:gte:${ds}~date:lte:${ds}&size=3000`); rows = rr.data||[]; } catch(e){ continue; }
      for (const d of rows){
        const r0 = byT[d.code]; if (!r0) continue;
        const thr = r0.b==='HN' ? 8.8 : 6.3;
        if (d.pctChange==null || +d.pctChange < thr) continue;
        if (r0.npatYoY!=null && r0.npatYoY>=0 && r0.npatYoY<25) continue;
        if (store.some(x=>x.t===d.code && x.bdate===ds)) continue;
        if (tpn.recent.some(x=>x.t===d.code && (x.bdate===ds || x.open))) continue;
        const ok = await verifySignalAt(d.code, ds); if (!ok) continue;
        const bd = ds.slice(8,10)+'/'+ds.slice(5,7)+'/'+ds.slice(2,4);
        tpn.recent.unshift({t:d.code, bd, bdate:ds, bp:ok.bp, sd:'—', ret:0, open:true});
        store.push({t:d.code, bd, bdate:ds, bp:ok.bp});
        changed = true;
      }
    }
    if (changed){ saveLiveDeals(store); if (tpn.recent.length>12) tpn.recent = tpn.recent.slice(0,12); refreshOpenDeals(); }
    localStorage.setItem(KEY, ''+Date.now());
  } catch(e){}
}
function scanNewSignals(){
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  const now = new Date();
  const dstr = ('0'+now.getDate()).slice(-2)+'/'+('0'+(now.getMonth()+1)).slice(-2)+'/'+String(now.getFullYear()).slice(2);
  const biso = now.toISOString().slice(0,10);
  const qualify = t => { const r = byT[t]; if (!r) return false;
    const thr = r.b === 'HN' ? 8.8 : 6.3;
    return r.chg != null && r.chg >= thr && r.vx >= 2.0; };
  // tin hieu trong phien rot chuan -> tu rut khoi bang + so
  tpn.recent = tpn.recent.filter(x => !(x.today && x.bdate === biso && !qualify(x.t)));
  let store = loadLiveDeals().filter(x => !(x.bdate === biso && !qualify(x.t)));
  ROWS().forEach(r=>{
    if (!r.watch || r.wgrade === 'weak') return;
    if (!qualify(r.t)) return;
    if (tpn.recent.some(x => x.t === r.t && (x.open || x.bdate === biso))) return;
    const nd = {t:r.t, bd:dstr, bdate:biso, bp:+(+r.p).toFixed(2), sd:'—', ret:-0.15, open:true, today:1};
    tpn.recent.unshift(nd);
    notifyPush('SIG'+r.t+biso, r.t+' — TÍN HIỆU MUA KÍCH HOẠT', 'Cây bùng nổ đạt chuẩn kèm dòng tiền tại giá '+nd.bp+'. Mở dashboard xem chi tiết.', 15*60000);
    if (!store.some(x => x.t === r.t && x.bdate === biso)) store.push({t:r.t, bd:dstr, bdate:biso, bp:nd.bp});
  });
  saveLiveDeals(store);
  if (tpn.recent.length > 12) tpn.recent = tpn.recent.slice(0,12);
}
function checkWatchAlerts(){
  try {
    if (!liveWatch.inSession()) return;
    ROWS().forEach(r=>{
      if (!r.watch || r.wgrade === 'weak' || r.chg == null) return;
      const thr = r.b === 'HN' ? 8.8 : 6.3;
      if (r.chg >= thr) return;  // da co thong bao TIN HIEU MUA lo
      if (r.chg >= 4) notifyPush('W4'+r.t, r.t+' +'+(+r.chg).toFixed(1)+'% — NÓNG MÁY', 'Mã trong vùng theo dõi đang tăng tốc mạnh. Canh chặt tới cuối phiên.', 10*60000);
      else if (r.chg >= 2) notifyPush('W2'+r.t, r.t+' +'+(+r.chg).toFixed(1)+'% — khởi động', 'Mã trong vùng theo dõi bắt đầu chạy. Để mắt.', 15*60000);
    });
  } catch(e){}
}
async function refreshOpenDeals(){
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  const opens = tpn.recent.filter(d=>d.open && d.bdate);
  if (!opens.length) { renderRecent(); return; }
  const now = NOW();
  await Promise.all(opens.map(async d => { try {
    const bts = Math.floor(new Date(d.bdate+'T00:00:00Z').getTime()/1000);
    const r = await jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${d.t}&resolution=D&from=${bts-120*86400}&to=${now}`);
    const c = r.c, tt = r.t; if (!c || c.length < 5) return;
    let gi = -1; for (let i = 0; i < tt.length; i++){ if (tt[i] >= bts - 43200){ gi = i; break; } }
    if (gi < 0) return;
    const fill = c[gi] || d.bp;   // lay close ngay tin hieu tu chuoi da dieu chinh (tranh lech khi chia co tuc/quyen)
    d.bp = +fill.toFixed(2);
    const sma = (i,n) => { if (i < n-1) return null; let x = 0; for (let k = i-n+1; k <= i; k++) x += c[k]; return x/n; };
    let big = false, closed = false;
    for (let i = gi+3; i < c.length; i++){
      const h = i-gi, pnl = c[i]/fill-1;
      if (pnl >= 0.25) big = true;
      const gate = (h === 3 && pnl <= 0) || pnl <= -0.07;
      const m20 = sma(i,20), m20p = sma(i-1,20), m10 = sma(i,10), m10p = sma(i-1,10);
      const brk = big ? (m10 && c[i] < m10 && c[i-1] < m10p) : (h > 3 && m20 && c[i] < m20 && c[i-1] < m20p);
      if (gate || brk){
        d.open = false; d.ret = +((pnl*100)-0.4).toFixed(1);
        const dt = new Date(tt[i]*1000);
        d.sd = ('0'+dt.getDate()).slice(-2)+'/'+('0'+(dt.getMonth()+1)).slice(-2)+'/'+String(dt.getFullYear()).slice(2);
        closed = true; break;
      }
    }
    if (!closed){ d.ret = +(((c[c.length-1]/fill-1)*100)-0.15).toFixed(1); }
  } catch(e){} }));
  renderRecent();
}
inits.market = async function(){
  if (mktDone) return; mktDone = true;
  const el = $('#view-market');
  const tpn = SUM.tpn || {stats:{}, recent:[], curve:[]};
  const st = tpn.stats || {};
  el.innerHTML = `
  <div class="hero">
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px">
        <h2 style="margin:0">Hiệu suất Khoa KAFI Signal</h2>
        <div class="seg" id="perfSeg"><button data-r="all" class="on">Tất cả</button><button data-r="1y">1 năm</button><button data-r="6m">6 tháng</button><button data-r="2025">2025</button><button data-r="2026">2026</button></div>
      </div>
      <div style="height:565px"><canvas id="cvPerf"></canvas></div>
    </div>
    <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
      <h2 style="text-align:center;letter-spacing:.02em">TOP TÍN HIỆU 6 THÁNG QUA</h2>
      <div style="flex:1;overflow:auto" id="recentWrap"></div>
      <button class="btn-cta" style="width:100%;margin-top:12px" onclick="showView('screener')">KHÁM PHÁ BỘ LỌC 702 MÃ</button>
    </div>
  </div>
  <div style="height:16px"></div>
  <div class="stats4">
    <div class="card" style="margin:0"><h2>Khoa KAFI Signal</h2>
      <div class="perf-row"><span class="l">1 năm</span><span class="v up">${st.y1>=0?'+':''}${st.y1}%</span></div>
      <div class="perf-row"><span class="l">3 năm</span><span class="v up">+${st.y3}%</span></div>
      <div class="perf-row"><span class="l">Từ 2019</span><span class="v up">+${st.all}%</span></div></div>
    <div class="card" style="margin:0"><h2>VN-Index cùng kỳ</h2>
      <div class="perf-row"><span class="l">1 năm</span><span class="v">${st.vy1>=0?'+':''}${st.vy1}%</span></div>
      <div class="perf-row"><span class="l">3 năm</span><span class="v">+${st.vy3}%</span></div>
      <div class="perf-row"><span class="l">Từ 2019</span><span class="v">+${st.vall}%</span></div></div>
    <div class="card" style="margin:0"><h2>Chất lượng hệ thống</h2>
      <div class="perf-row"><span class="l">R:R</span><span class="v">${st.rr}</span></div>
      <div class="perf-row"><span class="l">Win rate</span><span class="v">${st.winrate}%</span></div>
      <div class="perf-row"><span class="l">Tổng số deal</span><span class="v">${st.ndeal}</span></div></div>
    <div class="card" style="margin:0"><h2>Rủi ro</h2>
      <div class="perf-row"><span class="l">Max Drawdown hệ</span><span class="v down">${st.maxdd}%</span></div>
      <div class="perf-row"><span class="l">Max DD VN-Index</span><span class="v mut">−40.3%</span></div>
      <div class="perf-row"><span class="l">Phí giao dịch</span><span class="v mut">0,15% mua · 0,25% bán</span></div></div>
  </div>
  <div style="height:16px"></div>
  <div class="card"><h2>Lợi suất theo tháng <span class="hint">% · màu đậm = biên độ lớn · chấm mờ = đứng ngoài thị trường</span></h2><div class="mini" id="moSum" style="margin-bottom:10px"></div><div id="moTable" style="overflow-x:auto"></div></div>`;
  drawPerf();
  renderRecent();
  renderMonthly();
  refreshOpenDeals();
  if (!window._odTimer) window._odTimer = setInterval(refreshOpenDeals, 120000);
  $('#perfSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    $$('#perfSeg button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); perfRange = b.dataset.r; drawPerf(); });
  const mini = (rows, cols) => `<table><tr><th>Mã</th>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr>` +
    rows.map(r=>`<tr class="row" onclick="openDetail('${r.t}')"><td><b>${r.t}</b> <span class="mini">${(r.n||'').slice(0,22)}</span></td>${cols.map(c=>`<td class="${c[2]?c[2](r):''}">${c[1](r)}</td>`).join('')}</tr>`).join('') + '</table>';
  renderTops();
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
  el.innerHTML = `<div class="grid g2" style="margin-bottom:16px">
    <div class="card" style="margin:0"><h2>Top tăng giá hôm nay <span class="hint">GTGD TB20 ≥ 20 tỷ · cuối phiên gần nhất</span></h2><div id="topCs"></div></div>
    <div class="card" style="margin:0"><h2>Top khối lượng hôm nay <span class="hint">GTGD TB20 ≥ 20 tỷ · cuối phiên gần nhất</span></h2><div id="topRs"></div></div>
  </div><div class="card">
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
  renderTops();
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
let dtData = null;
function updateKpis(i){
  if (!dtData) return;
  const oh = dtData.oh, c = oh.c, v = oh.v, t = oh.t, n = c.length;
  if (i == null || i < 0 || i >= n) i = n-1;
  const isNow = i === n-1;
  let sVal = 0, cnt = 0;
  for (let k = Math.max(0, i-19); k <= i; k++){ sVal += c[k]*(v[k]||0); cnt++; }
  const gtgd20 = sVal/cnt/1e6;
  const ts = t[i];
  const rt = dtData.rtsAv.filter(x=>x.av<=ts).slice(-1)[0] || {};
  const qq = dtData.qsAv.filter(x=>x.pub<=ts).slice(-1)[0] || {};
  const r = byT[curT] || {};
  const peV = isNow && r.pe != null ? r.pe : rt.pe;
  const pbV = isNow && r.pb != null ? r.pb : rt.pb;
  const capT = isNow && r.cap != null ? r.cap/1000 : (rt.cap != null ? rt.cap/1e12 : null);
  const roeV = isNow && r.roe != null ? r.roe : (rt.roe != null ? rt.roe*100 : null);
  const rows = [
    ['Vốn hóa', capT != null ? fmt(capT,1)+' nghìn tỷ' : '—'],
    ['TB GTGD 20 phiên', fmt(gtgd20,0)+' tỷ'],
    ['P/E', fmt(peV,1)],
    ['P/B', fmt(pbV,2)],
    ['ROE', roeV != null ? fmt(roeV,1)+'%' : '—'],
    ['RS', r.rs != null ? r.rs+'/99' : '—'],
    ['+/- DT quý gần nhất', `<span class="${cls(qq.revY)}">${pct(qq.revY,1)}</span>`],
    ['+/- LN quý gần nhất', `<span class="${cls(qq.npY)}">${pct(qq.npY,1)}</span>`]
  ];
  const el = document.getElementById('dSide');
  if (el) el.innerHTML = `<div style="font-weight:700;font-size:14.5px;margin:4px 0 2px">Chỉ số cơ bản</div>
    ${rows.map(k=>`<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:9.5px 0;border-bottom:1px solid var(--border);font-size:13.5px">
      <span style="color:var(--muted)">${k[0]}</span><span style="font-weight:700">${k[1]}</span></div>`).join('')}`;
}
function renderDHead(){
  const el = document.getElementById('dHead'); if (!el || !curOhlc) return;
  const r = byT[curT] || {};
  const c = curOhlc.c, n = c.length;
  const p = r.p != null ? r.p : c[n-1];
  const chg = r.chg != null ? r.chg : (n>1 ? (c[n-1]/c[n-2]-1)*100 : 0);
  const col = chg > 0 ? '#089981' : (chg < 0 ? '#F23645' : '#787B86');
  const vol = ((curOhlc.v[n-1]||0)/1e6);
  const vx = r.vx != null ? Math.round(r.vx*100) : null;
  el.innerHTML = `<div style="display:flex;align-items:center;gap:10px">
    <div id="dLogo" style="width:44px;height:44px;flex:none;border-radius:50%;overflow:hidden;border:1px solid var(--border);background:var(--green-soft);display:flex;align-items:center;justify-content:center">
      <span style="color:var(--green-dark);font-weight:800;font-size:${curT.length>3?10:12}px">${curT}</span>
    </div>
    <div style="flex:1;min-width:0">
      <div style="font-size:19px;font-weight:800;line-height:1.15">${curT} <span class="mini" style="font-weight:600">${r.b==='HN'?'HNX':'HOSE'}</span></div>
      <div class="mini" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.n||''}</div>
    </div>
  </div>
  <div style="margin:10px 0 2px;display:flex;justify-content:space-between;align-items:baseline;gap:8px">
    <div style="font-size:27px;font-weight:800;color:${col};line-height:1">${fmt(p,2)} <span style="font-size:15px;font-weight:700">(${chg>0?'+':''}${fmt(chg,1)}%)</span></div>
    <div style="font-size:14px;font-weight:800;white-space:nowrap">KL ${fmt(vol,2)} tr${vx!=null?` <span style="font-weight:700;color:${vx>=150?'#B45309':'var(--muted)'}">(${vx}%)</span>`:''}</div>
  </div>`;
  const img = new Image();
  img.onload = () => { const d = document.getElementById('dLogo'); if (d) { d.innerHTML = ''; img.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#fff'; d.appendChild(img); } };
  img.src = 'https://cdn.simplize.vn/simplizevn/logo/' + curT + '.jpeg';
}
function renderSigTab(){
  const box = document.getElementById('tab-sig'); if (!box) return;
  const src = document.getElementById('dTpn');
  let html = (src && src.innerHTML) || '';
  const tix = {}; if (curOhlc) curOhlc.t.forEach((tt,ii)=>{ tix[tt]=ii; });
  const deals = []; let od = null;
  (curMarkers||[]).forEach(m => {
    const ii = tix[m.time];
    const d = new Date(m.time*1000);
    const ds = ('0'+d.getUTCDate()).slice(-2)+'/'+('0'+(d.getUTCMonth()+1)).slice(-2)+'/'+String(d.getUTCFullYear()).slice(2);
    if (m.position === 'belowBar') {
      if (m.text === 'BUY') od = { bd: ds, bp: (ii!=null&&curOhlc)?curOhlc.c[ii]:null, add: false };
      else if (m.text === 'ADD' && od) od.add = true;
    } else if (od) { od.sd = ds; od.ret = m.text; deals.push(od); od = null; }
  });
  if (od) { od.sd = '—'; od.ret = 'đang mở'; deals.push(od); }
  if (deals.length) {
    html += `<div style="font-weight:700;font-size:14.5px;margin:16px 0 4px">Lịch sử tín hiệu mã này <span class="hint">${deals.length} deal</span></div>
    <table style="font-size:12.5px"><tr><th style="text-align:left">Mua · giá</th><th>Bán</th><th>Kết quả</th></tr>` +
      deals.slice().reverse().map(x => `<tr><td style="text-align:left"><b>${x.bd}</b> @${x.bp!=null?fmt(x.bp,2):'—'}${x.add?' <span class="chip g" style="font-size:10.5px">+Bồi</span>':''}</td>
      <td>${x.sd}</td><td class="${x.ret==='đang mở'?'mut':((''+x.ret).indexOf('-')===0?'down':'up')}" style="font-weight:700">${x.ret}</td></tr>`).join('') + '</table>';
  } else {
    html += '<div class="mini" style="margin-top:14px">Hệ thống chưa từng có tín hiệu mua với mã này trong dữ liệu hiện có.</div>';
  }
  box.innerHTML = html;
}
async function loadRecs(){
  const box = document.getElementById('tab-rec'); if (!box || !curT) return;
  if (window._recFor === curT) return;
  box.innerHTML = '<div class="mini">Đang tải khuyến nghị…</div>';
  try {
    const r = await jget(`https://api-finfo.vndirect.com.vn/v4/recommendations?q=code:${curT}&size=10&sort=reportDate:desc`);
    const d0 = (r && r.data) || [];
    const cut = Date.now() - 240*86400000;
    const d = d0.filter(x => x.reportDate && new Date(x.reportDate).getTime() >= cut).slice(0, 6);
    window._recFor = curT;
    if (!d.length) { box.innerHTML = '<div class="mini" style="padding:8px 0">Chưa có báo cáo phân tích nào của CTCK trong 8 tháng gần đây.</div>'; return; }
    const rr = byT[curT] || {}; const cur = rr.p != null ? rr.p : (curOhlc ? curOhlc.c[curOhlc.c.length-1] : null);
    const chip = ty => ty==='BUY' ? '<span class="chip g">MUA</span>' : (ty==='SELL' ? '<span class="chip r">BÁN</span>' : '<span class="chip a">'+(ty||'—')+'</span>');
    box.innerHTML = '<table style="font-size:12.5px"><tr><th style="text-align:left">CTCK · Ngày</th><th>Loại</th><th>Giá MT</th><th>Upside</th></tr>' +
      d.map(x => { const up = (cur && x.targetPrice) ? (x.targetPrice/cur-1)*100 : null;
        return `<tr><td style="text-align:left"><b>${x.firm||x.source||'—'}</b><div class="mini">${(x.reportDate||'').split('-').reverse().join('/')}</div></td>
        <td>${chip(x.type)}</td><td><b>${x.targetPrice!=null?fmt(x.targetPrice,2):'—'}</b></td>
        <td class="${up!=null?cls(up):'mut'}">${up!=null?pct(up,0):'—'}</td></tr>`; }).join('') + '</table>' +
      '<div class="mini" style="margin-top:8px">Upside so với giá hiện tại · tổng hợp từ báo cáo các CTCK</div>';
  } catch(e){ box.innerHTML = '<div class="mini">Không tải được dữ liệu khuyến nghị.</div>'; }
}
let proLoadedFor = null, proChart = null, useLog = false;
function addProBadges(){
  if (!proChart || !curOhlc) return;
  if (!window._kbadgeReg && window.klinecharts) {
    klinecharts.registerIndicator({
      name: 'KBADGE', calc: list => list, figures: [],
      createTooltipDataSource: () => ({ name: '', calcParamsText: '', values: [], legends: [] }),
      draw: p => {
        const ctx = p.ctx, yAxis = p.yAxis;
        const bs = window._kafiBadges || [];
        if (!bs.length || !proChart) return true;
        let vdl = [];
        try { vdl = proChart.getChartStore().getVisibleDataList() || []; } catch(e){ return true; }
        const xm = {};
        vdl.forEach(d => { xm[d.dataIndex] = d.x; });
        ctx.save();
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        bs.forEach(b => {
          const cx = xm[b.i];
          if (cx == null) return;
          const yv = yAxis.convertToPixel(b.value);
          const dir = b.below ? 1 : -1;          // dưới nến (mua) mũi tên chỉ lên, trên nến (bán) chỉ xuống
          const gap = 3, ah = 7, aw = 5;
          const tipY = yv + dir * gap;           // đỉnh mũi tên chạm sát cây nến
          const baseY = tipY + dir * ah;
          // mũi tên nhọn chỉ đúng vào cây nến (kiểu AmiBroker)
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.moveTo(cx, tipY);
          ctx.lineTo(cx - aw, baseY);
          ctx.lineTo(cx + aw, baseY);
          ctx.closePath();
          ctx.fill();
          // nhãn gọn ngay sau mũi tên
          const lbl = b.text.replace(/^[\u25B2\u25BC]\s*/, '');
          const h = 16, r = 3, w = ctx.measureText(lbl).width + 10;
          const top = b.below ? baseY + 1 : baseY - 1 - h;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.moveTo(cx - w/2 + r, top);
          ctx.arcTo(cx + w/2, top, cx + w/2, top + h, r);
          ctx.arcTo(cx + w/2, top + h, cx - w/2, top + h, r);
          ctx.arcTo(cx - w/2, top + h, cx - w/2, top, r);
          ctx.arcTo(cx - w/2, top, cx + w/2, top, r);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.fillText(lbl, cx, top + h/2 + 0.5);
        });
        ctx.restore();
        return true;
      }
    });
    window._kbadgeReg = true;
  }
  const tix = {}; curOhlc.t.forEach((tt,i)=>{ tix[tt]=i; });
  window._kafiBadges = curMarkers.map(m => {
    const i = tix[m.time]; if (i == null) return null;
    const isBuy = m.position === 'belowBar';
    const lbl = isBuy ? (m.text === 'ADD' ? '▲ Add' : (m.text === 'WEAK' ? '▲ Weak' : '▲ B')) : '▼ S ' + m.text;
    return { i: i, below: isBuy, text: lbl, color: m.color, value: isBuy ? curOhlc.l[i] : curOhlc.h[i] };
  }).filter(Boolean);
  try { proChart.createIndicator('KBADGE', true, { id: 'candle_pane' }); } catch(e){}
  window._dbg = { get chart(){ return proChart; }, get markers(){ return curMarkers; }, get oh(){ return curOhlc; }, get badges(){ return window._kafiBadges; } };
}
function loadProChart(){
  if (!curT || !curOhlc || proLoadedFor === curT) return;
  const init = () => {
    proLoadedFor = curT;
    const wrap = document.getElementById('chartProWrap');
    wrap.innerHTML = '<div id="proK" style="height:470px"></div>';
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
      xAxis: { axisLine: { color: '#DDE1E6' }, tickText: { color: '#787B86', size: 12 } },
      yAxis: { axisLine: { color: '#DDE1E6' }, tickText: { color: '#787B86', size: 12 } },
      crosshair: { horizontal: { line: { color: '#9598A1' }, text: { backgroundColor: '#131722' } },
                   vertical:   { line: { color: '#9598A1' }, text: { backgroundColor: '#131722' } } }
    });
    proChart.applyNewData(curOhlc.t.map((tt,i)=>({ timestamp: tt*1000, open: curOhlc.o[i], high: curOhlc.h[i], low: curOhlc.l[i], close: curOhlc.c[i], volume: curOhlc.v[i] })));
    proChart.createIndicator({ name: 'MA', calcParams: [20] }, true, { id: 'candle_pane' });
    if (!window._kvolReg) {
      klinecharts.registerIndicator({
        name: 'KVOL', shortName: 'KL', series: 'volume', precision: 0, shouldFormatBigNumber: true,
        calc: list => list.map((d, i) => { let s = 0, c = 0; for (let k = Math.max(0, i - 20); k < i; k++) { s += list[k].volume || 0; c++; } return { volume: d.volume, avg: c >= 10 ? s / c : null }; }),
        figures: [{ key: 'volume', title: 'KL: ', type: 'bar', baseValue: 0,
          styles: d => { const k = (d.current && d.current.kLineData) || {}; return { color: (k.close >= k.open) ? 'rgba(8,153,129,.55)' : 'rgba(242,54,69,.55)' }; } }],
        createTooltipDataSource: p => {
          const list = p.kLineDataList || [], res = (p.indicator && p.indicator.result) || [];
          const i = (p.crosshair && p.crosshair.dataIndex != null) ? p.crosshair.dataIndex : list.length - 1;
          const r = res[i] || {};
          const fv = v => v == null ? '—' : (v >= 1e6 ? (v / 1e6).toFixed(2) + 'tr' : Math.round((v || 0) / 1e3) + 'k');
          const pct = (r.avg && r.volume != null) ? (r.volume / r.avg - 1) * 100 : null;
          const pctTxt = pct == null ? '—' : (pct >= 0 ? '+' : '−') + Math.abs(pct).toFixed(0) + '% so với TB 20 phiên';
          const pcol = pct == null ? '#787B86' : (pct >= 100 ? '#B45309' : (pct >= 0 ? '#089981' : '#787B86'));
          const items = [
            { title: { text: 'KL: ', color: '#787B86' }, value: { text: fv(r.volume), color: '#131722' } },
            { title: { text: 'Đột biến: ', color: '#787B86' }, value: { text: pctTxt, color: pcol } }
          ];
          return { name: '', calcParamsText: '', values: items, legends: items };
        }
      });
      window._kvolReg = true;
    }
    proChart.createIndicator('KVOL', false, { height: 96 });
    try { proChart.setBarSpace(9); proChart.setOffsetRightDistance(70); } catch(e){}
    addProBadges();
    // bang so lieu chay theo con tro tren Chart Pro
    const tmap = {}; curOhlc.t.forEach((tt,i)=>{ tmap[tt*1000] = i; });
    proChart.subscribeAction('onCrosshairChange', d => {
      const ts = d && d.kLineData ? d.kLineData.timestamp : null;
      updateKpis(ts != null && tmap[ts] != null ? tmap[ts] : null);
    });
  };
  if (window.klinecharts) init();
  else { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/klinecharts@9/dist/klinecharts.min.js'; s.onload = init; s.onerror = () => toast('Không tải được thư viện chart'); document.head.appendChild(s); }
}
window.openDetail = t => { ga('view_ticker', {ticker: t}); showView('detail', true); $$('.nav-link').forEach(b=>b.classList.toggle('active', b.dataset.view==='detail')); inits.detail(t); };
inits.detail = function(t){
  const el = $('#view-detail');
  if (!dtInit) { dtInit = true;
    el.innerHTML = `<div id="dBody" style="display:none">
      <div class="card" style="padding:13px 16px 14px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:9px">
          <div class="search-wrap"><input id="dQ" placeholder="Nhập mã hoặc tên công ty…" style="width:206px;padding:6px 11px"><div id="sugg"></div></div>
          <div id="dTitle" style="font-size:15.5px;font-weight:700"></div>
          <div style="display:flex;gap:9px;align-items:center;margin-left:auto;flex-wrap:wrap" id="dRanges">
            <span style="background:var(--green);color:#fff;border-radius:7px;padding:5px 12px;font-size:12px;font-weight:700;letter-spacing:.02em;white-space:nowrap">CHART TÍN HIỆU AI</span>
            <span class="mini" style="font-style:italic;white-space:nowrap">điểm Mua · Bồi · Bán hiện ngay trên nến</span>
          </div>
        </div>
        <div id="dTpn" style="margin-bottom:10px"></div>
        <div style="display:flex;gap:16px;align-items:flex-start" id="dFlex">
          <div style="flex:1;min-width:0">
            <div id="chartSigWrap" style="display:none">
              <div style="flex:1;min-width:0;position:relative">
                <div id="ohlcLegend" style="position:absolute;top:6px;left:8px;z-index:20;font-size:12.5px;color:#374151;background:rgba(255,255,255,.85);padding:3px 10px;border-radius:6px;border:1px solid #e4e8ec"></div>
                <div style="position:absolute;top:6px;right:76px;z-index:20;display:flex;gap:6px">
                  <button class="btn" id="btnLog" style="padding:2px 10px;font-size:11px">Log</button>
                  <button class="btn" id="btnFull" style="padding:2px 10px;font-size:11px">\u26f6 Toàn màn hình</button>
                </div>
                <div id="chartMain"></div><div id="chartVol"></div>
              </div>
            </div>
            <div id="chartProWrap"></div>
          </div>
          <div style="width:360px;flex:none;border:1px solid var(--border);border-radius:12px;padding:14px 16px;background:#fff" id="dPanel">
            <div id="dHead" style="margin-bottom:10px"></div>
            <div id="dTabs" style="display:flex;border-bottom:1px solid var(--border);margin-bottom:10px">
              <button class="dtab active" data-t="ov">Tổng quan</button>
              <button class="dtab" data-t="fin">Tài chính</button>
              <button class="dtab" data-t="sig">Tín hiệu</button>
              <button class="dtab" data-t="rec">CTCK KN</button>
            </div>
            <div id="tab-ov"><div id="dSide"></div></div>
            <div id="tab-fin" style="display:none">
              <div class="mini" id="dFundCur" style="margin-bottom:8px;font-size:12.5px"></div>
              <div style="overflow:auto;max-height:480px"><table id="tbFund"></table></div>
              <div class="mini" style="margin-top:8px;font-style:italic">Ô "--" là quý nguồn chưa công bố.</div>
            </div>
            <div id="tab-sig" style="display:none"></div>
            <div id="tab-rec" style="display:none"></div>
          </div>
        </div>
      </div>
    </div>
  `;
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
    $('#dTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      $$('#dTabs button').forEach(x=>x.classList.toggle('active', x===b));
      ['ov','fin','sig','rec'].forEach(k => { const d = document.getElementById('tab-'+k); if (d) d.style.display = (b.dataset.t===k?'':'none'); });
      if (b.dataset.t==='sig') renderSigTab();
      if (b.dataset.t==='rec') loadRecs();
    });
    $('#btnLog').onclick = function(){ useLog = !useLog; this.classList.toggle('active', useLog); const b = $('#dRanges .btn.rng.active'); drawPrice(b?+b.dataset.y:14); };
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
    // du lieu quy as-of (theo ngay cong bo) — dung cho ca bang KPI va engine tin hieu
    const qsAv = [];
    qs.forEach(q => {
      if (!q.publicDate) return;
      const pv = qs.find(x=>x.yearReport===q.yearReport-1 && x.lengthReport===q.lengthReport);
      let revY = null, npY = null;
      if (pv) {
        const r1 = pick(q,REV), r0 = pick(pv,REV), n1 = pick(q,NPAT), n0 = pick(pv,NPAT);
        if (r1!=null && r0) revY = (r1/Math.abs(r0)-1)*100;
        if (n1!=null && n0) npY = (n1/Math.abs(n0)-1)*100;
      }
      qsAv.push({pub: Date.parse(q.publicDate.slice(0,10))/1000, revY, npY});
    });
    qsAv.sort((a,b)=>a.pub-b.pub);
    const tpn = computeTPN(oh, r.b || 'HO', qsAv);
    curMarkers = tpn.markers;
    renderTPN(tpn.state);
    if (proLoadedFor && proLoadedFor !== t) { proLoadedFor = null; if (document.getElementById('chartProWrap').style.display !== 'none') loadProChart(); }
    $('#dTitle').innerHTML = `${t} <span class="mini">— ${r.n||''} (${r.b==='HO'?'HOSE':'HNX'})</span>`;
    // KPI
    const rtsAv = rts.map(x => ({
      av: Date.UTC(x.yearReport, x.quarter*3, 1)/1000 + 45*86400,  // sau khi het quy ~45 ngay (BCTC ra)
      pe: x.pe, pb: x.pb, cap: x.marketCap, roe: x.roe
    })).sort((a,b)=>a.av-b.av);
    dtData = {oh, qsAv, rtsAv};
    updateKpis(null);
    drawPrice(14);
    if (document.getElementById('chartProWrap').style.display !== 'none') loadProChart();
    drawFund(r, qs, rts);
    renderDHead();
    window._recFor = null;
    const _at = document.querySelector('#dTabs button.active');
    if (_at && _at.dataset.t==='rec') loadRecs();
    if (_at && _at.dataset.t==='sig') renderSigTab();
  } catch(e){ toast('Lỗi tải dữ liệu '+t+': '+e.message); }
}
// ===== Khoa KAFI Signal engine v2 =====
function computeTPN(oh, boardCode, qsAv){
  // xep hang do tin cay tin hieu theo du lieu co ban as-of (chi tiet thuat toan khong cong bo)
  const npYAt = ts => { let y = null; (qsAv||[]).forEach(q => { if (q.pub <= ts) y = q.npY; }); return y; };
  const gradeAt = ts => { const y = npYAt(ts); return (y != null && y >= 0 && y < 25) ? 0 : 1; };
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
  const ma10 = [], hi10 = [];
  for (let i = 0; i < n; i++) {
    if (i >= 9) { let s2 = 0, hh = -1e9; for (let k = i-9; k <= i; k++) { s2 += c[k]; if (c[k] > hh) hh = c[k]; } ma10.push(s2/10); hi10.push(hh); }
    else { ma10.push(null); hi10.push(null); }
  }
  const baseInfo = i => {   // thong tin nen 30 phien truoc bar i
    let hi = -1e9, lo = 1e9, hasCeil = false;
    for (let k = i-30; k < i; k++) {
      if (c[k] > hi) hi = c[k]; if (c[k] < lo) lo = c[k];
      if (k > 0 && (c[k]/c[k-1]-1)*100 >= ceilThr) hasCeil = true;
    }
    return {rng: (hi-lo)/lo*100, hasCeil};
  };
  let inPos = false, fill = 0, ei = 0, lastWeakIdx = -9, big = false, added = false;
  for (let i = 31; i < n; i++) {
    if (!inPos) {
      const chg = (c[i]/c[i-1]-1)*100;
      if (chg < ceilThr) continue;
      if (!v20[i] || v[i] < 2.0*v20[i]) continue;
      if (c[i]*v20[i]/1e6 < 15) continue;
      const b = baseInfo(i);
      if (b.hasCeil || b.rng > 12) continue;
      if (!gradeAt(t[i])) {
        // tin hieu YEU: chi hien thi doc lap — KHONG mo vi the, khong anh huong model chinh
        lastWeakIdx = i;
        markers.push({time: t[i], position:'belowBar', color:'#b45309', shape:'arrowUp', text:'WEAK'});
        continue;
      }
      inPos = true; fill = c[i]; ei = i; big = false; added = false;
      markers.push({time: t[i], position:'belowBar', color:'#18a34b', shape:'arrowUp', text:'BUY'});
    } else {
      const h = i - ei, pnl = c[i]/fill - 1;
      if (pnl >= 0.25) big = true;
      if (!added && h > 3 && h <= 7 && pnl >= 0.10 && hi10[i] && c[i] >= hi10[i]*0.999) {
        added = true;
        markers.push({time: t[i], position:'belowBar', color:'#67c98b', shape:'arrowUp', text:'ADD'});
      }
      let reason = null;
      if (h === 3 && pnl <= 0) reason = 'T+3';
      else if (h >= 3 && pnl <= -0.07) reason = 'CL7';
      else if (big && ma10[i] && c[i] < ma10[i] && c[i-1] < ma10[i-1]) reason = 'MA10';
      else if (!big && h > 3 && ma20[i] && c[i] < ma20[i] && c[i-1] < ma20[i-1]) reason = 'MA20';
      if (reason) {
        markers.push({time: t[i], position:'aboveBar', color:'#e5484d', shape:'arrowDown', text: (pnl>0?'+':'') + (pnl*100).toFixed(0) + '%'});
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
    belowMa20: ma20[L] ? c[L] < ma20[L] : false,
    weakToday: lastWeakIdx === L,
    v20L: v20[L] || 0, closePrev: L>0 ? c[L-1] : c[L], v20Prev: L>0 ? (v20[L-1]||v20[L]||0) : (v20[L]||0), lastBarTs: t[L],
    hi10L: hi10[L] || null, ma10L: ma10[L] || null, ma20L: ma20[L] || null,
    bigPos: inPos ? big : false, addedPos: inPos ? added : false,
    faOK: gradeAt(t[L])
  };
  return {markers, state};
}
let curMarkers = [];
function renderTPN(s){
  const el = document.getElementById('dTpn');
  if (!el) return;
  let chip, desc;
  const f2 = x => x >= 100 ? x.toFixed(1) : x.toFixed(2);
  if (s.inPos && s.buyToday) {
    chip = ['TÍN HIỆU MUA HÔM NAY', '#e7f6ec', '#128a3e'];
    desc = `Vào lệnh ngay trong phiên tại ${f2(s.fill)}. T+3 hệ thống sẽ phán quyết giữ/bán khi hàng về.`;
  }
  else if (s.inPos) {
    chip = [`ĐANG NẮM GIỮ — T+${s.holdDays}, ${s.pnl>0?'+':''}${s.pnl.toFixed(1)}%`, s.pnl>0?'#e7f6ec':'#fdecec', s.pnl>0?'#128a3e':'#e5484d'];
    const stop7 = s.fill*0.93;
    const maLv = s.bigPos ? s.ma10L : s.ma20L;
    const maName = s.bigPos ? 'MA10' : 'MA20';
    const belowMa = maLv ? s.close < maLv : false;
    let parts = [`Giá vốn ${f2(s.fill)}.`];
    if (s.holdDays < 3) {
      parts.push(`Chờ hàng về — T+3: đóng cửa ≤ ${f2(s.fill)} là BÁN toàn bộ.`);
      parts.push(`Van cắt lỗ: đóng dưới ${f2(stop7)} (−7%).`);
    } else {
      if (!s.addedPos && s.holdDays >= 3 && s.holdDays < 7) {
        const addTrig = Math.max(s.fill*1.10, s.hi10L || 0);
        parts.push(`BỒI (1 lần): nếu đóng cửa ≥ ${f2(addTrig)} → mua thêm nửa suất.`);
      }
      let sells = [`đóng ≤ ${f2(stop7)} (cắt lỗ −7%)`];
      if (maLv) sells.push(belowMa
        ? `đóng dưới ${f2(maLv)} (hôm qua đã vi phạm — hôm nay đóng dưới là BÁN)`
        : `đóng dưới ${f2(maLv)} hai phiên liên tiếp`);
      parts.push(`BÁN cuối phiên nếu: ` + sells.join(' · ') + '.');
      if (s.bigPos) parts.push(`Deal lãi lớn — van bán đang ở chế độ siết chặt.`);
      parts.push(`Các ngưỡng tự cập nhật theo từng phiên.`);
    }
    desc = parts.join(' ');
  }
  else if (s.weakToday) { chip = ['TÍN HIỆU YẾU (WEAK) — ĐỨNG NGOÀI', '#fef6e7', '#b45309']; desc = `Có tín hiệu kỹ thuật trong phiên nhưng bộ xếp hạng AI đánh giá độ tin cậy thấp — không khuyến nghị vào lệnh.`; }
  else if (!s.hasCeil && s.rng <= 12 && s.gtgd >= 15) {
    chip = s.faOK ? ['VÙNG THEO DÕI — CHỜ ĐIỂM MUA', '#fef9e7', '#b45309'] : ['VÙNG THEO DÕI — HẠNG YẾU', '#f3f5f7', '#6b7280'];
    const nowVN = new Date();
    const lastBarDay = new Date(s.lastBarTs*1000).toDateString();
    const isLive = lastBarDay === nowVN.toDateString() && (nowVN.getHours() + nowVN.getMinutes()/60) < 15;
    const refPx = isLive ? s.closePrev : s.close;
    const refV20 = isLive ? s.v20Prev : s.v20L;
    const buyPx = refPx*(1+s.ceilThr/100);
    desc = s.faOK
      ? `MUA nếu ${isLive ? 'HÔM NAY' : 'phiên tới'} đóng cửa ≥ ${f2(buyPx)} kèm khối lượng tối thiểu ${(2*refV20/1e6).toFixed(1)} triệu cp. Ngưỡng trailing tự cập nhật mỗi phiên.`
      : `Nền kỹ thuật đạt chuẩn nhưng bộ xếp hạng AI đánh giá hạng YẾU — nếu bùng nổ cũng chỉ mang tính quan sát, không khuyến nghị vào lệnh. Hạng sẽ được chấm lại khi có báo cáo quý mới.`;
  }
  else { chip = ['CHƯA CÓ TÍN HIỆU', '#f3f5f7', '#6b7280']; desc = ''; }
  el.innerHTML = `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:4px">
    <span class="tag" style="background:${chip[1]};color:${chip[2]};font-size:14px;padding:6px 14px">${chip[0]}</span>
    <span class="mini">${desc}</span></div>`;
}

function drawPrice(years){
  if (!curOhlc) return;
  dtCharts.forEach(c=>c.remove()); dtCharts = [];
  ['chartMain','chartVol'].forEach(id=>$('#'+id).innerHTML='');
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
    ch.subscribeCrosshairMove(p => {
      if (!p || !p.time) { leg.innerHTML = fmtL(T.length-1); updateKpis(null); return; }
      const ix = T.indexOf(p.time);
      if (ix>=0) { leg.innerHTML = fmtL(ix); updateKpis(from + ix); }   // bang so lieu chay theo con tro
    }); }

  const cAll = oh.c;
  const cut = a => a.slice(from);
  addLine(ch, T, cut(smaS(cAll,20)), '#2563eb', 'MA20');
  addLine(ch, T, cut(smaS(cAll,50)), '#d97706', 'MA50');
  if (cAll.length>=200) addLine(ch, T, cut(smaS(cAll,200)), '#8b5cf6', 'MA200');
  if (false) { const bb = bollS(cAll); addLine(ch, T, cut(bb.map(x=>x[0])), 'rgba(107,114,128,.55)', 'BB+'); addLine(ch, T, cut(bb.map(x=>x[1])), 'rgba(107,114,128,.55)', 'BB-'); }
  // Volume — khung rieng tach khoi chart gia
  const chV = LightweightCharts.createChart($('#chartVol'), chartOpts()); dtCharts.push(chV);
  const vs = chV.addHistogramSeries({priceFormat:{type:'volume'}});
  vs.setData(T.map((t,i)=>({time:t,value:V[i],color: C[i]>=O[i] ? 'rgba(24,163,75,.55)':'rgba(229,72,77,.55)'})));
  // đồng bộ trục thời gian
  const sync = (a,b) => a.timeScale().subscribeVisibleLogicalRangeChange(r => r && b.timeScale().setVisibleLogicalRange(r));
  sync(ch,chV); sync(chV,ch);
  const SHOW = Math.min(T.length, 130);
  ch.timeScale().setVisibleLogicalRange({from: T.length - SHOW, to: T.length + 3});
}
function drawFund(r, qs, rts){
  const cur = [];
  if (r.pe!=null) cur.push(`P/E hiện tại: <b>${fmt(r.pe,2)}</b>`);
  if (r.pb!=null) cur.push(`P/B hiện tại: <b>${fmt(r.pb,2)}</b>`);
  if (r.roe!=null) cur.push(`ROE hiện tại (TTM): <b>${fmt(r.roe,1)}%</b>`);
  $('#dFundCur').innerHTML = cur.join(' &nbsp;·&nbsp; ');
  const last12 = qs.slice(-12);
  const rtByQ = {}; rts.forEach(x=>{ rtByQ[x.yearReport+'Q'+x.quarter] = x; });
  const cols = last12.map(q => {
    const key = q.yearReport+'Q'+q.lengthReport;
    const pv = qs.find(x=>x.yearReport===q.yearReport-1 && x.lengthReport===q.lengthReport);
    const rev = pick(q,REV), np = pick(q,NPAT);
    const rev0 = pv?pick(pv,REV):null, np0 = pv?pick(pv,NPAT):null;
    const rt = rtByQ[key] || {};
    return { lb: 'Q'+q.lengthReport+'/'+q.yearReport,
      rev: rev!=null?rev/1e9:null, np: np!=null?np/1e9:null,
      ydt: (rev!=null&&rev0)?(rev/Math.abs(rev0)-1)*100:null,
      yln: (np!=null&&np0)?(np/Math.abs(np0)-1)*100:null,
      roe: rt.roe!=null?rt.roe*100:null, pe: rt.pe, pb: rt.pb };
  });
  const cell = (v,d,suf='',color=false) => v==null ? '<td class="mut">--</td>' : `<td class="${color?cls(v):''}">${(color&&v>0?'+':'')+fmt(v,d)+suf}</td>`;
  const trend = cols.map((c,i)=>{ if (i===0 || c.yln==null || cols[i-1].yln==null) return '<td class="mut">--</td>';
    return c.yln>=cols[i-1].yln ? '<td><span class="chip g">Tăng tốc ▲</span></td>' : '<td><span class="chip r">Giảm tốc ▼</span></td>'; });
  $('#tbFund').innerHTML =
    '<tr><th style="text-align:left">Quý</th>'+cols.map(c=>`<th>${c.lb}</th>`).join('')+'</tr>'
    +'<tr><td style="text-align:left"><b>Doanh thu (tỷ)</b></td>'+cols.map(c=>cell(c.rev,1)).join('')+'</tr>'
    +'<tr><td style="text-align:left"><b>LNST (tỷ)</b></td>'+cols.map(c=>cell(c.np,1)).join('')+'</tr>'
    +'<tr><td style="text-align:left">%YoY DT</td>'+cols.map(c=>cell(c.ydt,1,'%',true)).join('')+'</tr>'
    +'<tr><td style="text-align:left">%YoY LN</td>'+cols.map(c=>cell(c.yln,1,'%',true)).join('')+'</tr>'
    +'<tr><td style="text-align:left">ROE (%)</td>'+cols.map(c=>cell(c.roe,1,'%',true)).join('')+'</tr>'
    +'<tr><td style="text-align:left">Xu hướng LN</td>'+trend.join('')+'</tr>'
    +'<tr><td style="text-align:left">P/E</td>'+cols.map(c=>cell(c.pe,2)).join('')+'</tr>'
    +'<tr><td style="text-align:left">P/B</td>'+cols.map(c=>cell(c.pb,2)).join('')+'</tr>';
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
    el.innerHTML = `<div class="card"><h2>Định giá theo dòng <span class="hint">P/B lịch sử 6 năm + ROE — cập nhật theo phiên</span></h2>
      <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">
        <div class="seg" id="secGrp"><button data-g="bank" class="on">Ngân hàng</button><button data-g="sec">Chứng khoán</button></div>
        <span class="mini" style="align-self:center"><span style="display:inline-block;width:10px;height:10px;background:#128A3E;border-radius:3px;vertical-align:-1px"></span> khoảng P/B &nbsp; <span style="display:inline-block;width:10px;height:10px;background:#67D98B;border-radius:3px;vertical-align:-1px"></span> P/B hiện tại &nbsp; <span style="display:inline-block;width:10px;height:10px;background:#D97706;border-radius:50%;vertical-align:-1px"></span> ROE hiện tại</span>
        <span class="mini" id="secSt" style="align-self:center"></span>
      </div>
      <div style="height:380px"><canvas id="cvSec"></canvas></div></div>`;
    $('#secGrp').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#secGrp button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); secGrp = b.dataset.g; drawSec(); });
  }
  drawSec();
};
// ===== DINH GIA THEO DONG (khoang P/B & ROE lich su, hien tai theo phien) =====
const SEC_GROUPS = { bank:['VCB','BID','CTG','TCB','MBB','ACB','STB','SHB','VPB','TPB','VIB','MSB','OCB'], sec:['SSI','VND','VCI','HCM','MBS','VDS','BSI','SHS','VIX','FTS','ORS'] };
let secCache = {}, secChart = null, secGrp = 'bank';
async function drawSec(){
  const st = $('#secSt'); const codes = SEC_GROUPS[secGrp];
  if (!secCache[secGrp]) {
    if (st) st.innerHTML = '<span class="spin"></span> đang tải…';
    const out = {};
    try { const f = await jget('https://api-finfo.vndirect.com.vn/v4/ratios/latest?filter=ratioCode:PRICE_TO_BOOK&where=code:'+codes.join(',')+'&size=50');
      (f.data||[]).forEach(x=>{ out[x.code] = {curPb: x.value}; }); } catch(e){}
    for (let i=0;i<codes.length;i+=6) await Promise.all(codes.slice(i,i+6).map(async t => { try {
      const rts = await api.ratios(t); const h = rts.slice(-24);
      const pbs = h.map(x=>x.pb).filter(v=>v!=null&&isFinite(v)), roes = h.map(x=>x.roe!=null?x.roe*100:null).filter(v=>v!=null&&isFinite(v));
      out[t] = Object.assign(out[t]||{}, { pbLo:Math.min(...pbs), pbHi:Math.max(...pbs), roeLo:Math.min(...roes), roeHi:Math.max(...roes),
        curRoe: rts.length && rts[rts.length-1].roe!=null ? rts[rts.length-1].roe*100 : null });
      if (out[t].curPb == null) out[t].curPb = rts.length ? rts[rts.length-1].pb : null;
    } catch(e){} }));
    secCache[secGrp] = out;
    if (st) st.textContent = '';
  }
  const D = secCache[secGrp];
  const items = codes.filter(c => D[c] && D[c].pbLo!=null && isFinite(D[c].pbLo));
  if (secChart) secChart.destroy();
  const secLbl = { id:'secLbl', afterDatasetsDraw(chart){ const ctx = chart.ctx; const meta = chart.getDatasetMeta(0);
    meta.data.forEach((bar,i)=>{ const d = D[items[i]];
      ctx.save(); ctx.font = '700 11px Inter, sans-serif'; ctx.fillStyle = '#1F2937'; ctx.textAlign = 'center';
      ctx.fillText(d.pbHi.toFixed(1), bar.x, bar.y-6);
      if (d.curPb!=null && isFinite(d.curPb)) { const yPix = chart.scales.y.getPixelForValue(d.curPb);
        ctx.strokeStyle = '#67D98B'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bar.x-bar.width/2, yPix); ctx.lineTo(bar.x+bar.width/2, yPix); ctx.stroke();
        ctx.fillStyle = '#128A3E'; ctx.textAlign = 'left'; ctx.fillText((+d.curPb).toFixed(1), bar.x+bar.width/2+4, yPix+4); }
      ctx.restore(); }); }};
  secChart = new Chart($('#cvSec'), {
    data:{ labels: items, datasets:[
      { type:'bar', data: items.map(c=>[D[c].pbLo, D[c].pbHi]), backgroundColor:'#128A3E', borderRadius:5, barPercentage:.42, yAxisID:'y', order:2 },
      { type:'line', showLine:false, data: items.map(c=>D[c].curRoe), pointBackgroundColor:'#D97706', pointBorderColor:'#fff', pointBorderWidth:1.5, pointRadius:5.5, yAxisID:'y2', order:1 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{callbacks:{ label: c => { const d = D[items[c.dataIndex]];
        return c.datasetIndex===1 ? 'ROE hiện tại: '+(d.curRoe!=null?d.curRoe.toFixed(1)+'%':'--')
          : ['P/B cao nhất: '+d.pbHi.toFixed(2), 'P/B thấp nhất: '+d.pbLo.toFixed(2), 'P/B hiện tại: '+(d.curPb!=null?(+d.curPb).toFixed(2):'--')]; } }} },
      scales:{ x:{grid:{display:false}, ticks:{color:'#1F2937', font:{weight:600, size:12, family:'Inter'}}},
               y:{beginAtZero:true, grid:{color:'#F1F3F6'}, ticks:{color:'#7A828E', font:{size:11}}, title:{display:true, text:'P/B', color:'#7A828E', font:{size:11}}},
               y2:{position:'right', beginAtZero:true, grid:{drawOnChartArea:false}, ticks:{color:'#D97706', font:{size:11}, callback:v=>v+'%'}, title:{display:true, text:'ROE', color:'#D97706', font:{size:11}}} } },
    plugins:[secLbl] });
}

async function renderCmp(){
  $('#cChips').innerHTML = cmpList.map(t=>`<span class="cmp-chip">${t}<span onclick="rmCmp('${t}')">✕</span></span>`).join('');
  window.rmCmp = t => { cmpList = cmpList.filter(x=>x!==t); renderCmp(); };
  if (!cmpList.length) { $('#tbCmp').innerHTML=''; return; }
  const metrics = [['Giá','p',2],['P/E','pe',1],['P/B','pb',2],['ROE %','roe',1],['LNST YoY %','npatYoY',1],['DT YoY %','revYoY',1],['LN 3 năm %/n','cagr3',1],['RS','rs',0],['CANSLIM','csTong',0],['Vốn hóa (tỷ)','cap',0],['Cổ tức %','dy',1],['Cách đỉnh 52T %','dHi',1]];
  $('#tbCmp').innerHTML = '<tr><th>Chỉ số</th>' + cmpList.map(t=>`<th>${t}</th>`).join('') + '</tr>' +
    metrics.map(m=>`<tr><td><b>${m[0]}</b></td>${cmpList.map(t=>{ const v = (byT[t]||{})[m[1]]; return `<td>${fmt(v,m[2])}</td>`; }).join('')}</tr>`).join('');
}

// ================= CẬP NHẬT DỮ LIỆU (client-side) =================
// ================= TAB THEO DÕI (quét cuối phiên — canh phiên bùng nổ) =================
let wSortK='wrng', wSortD=1;
window.sortWatch = k => { if (wSortK===k) wSortD=-wSortD; else { wSortK=k; wSortD=(k==='t'||k==='n'||k==='b'||k==='wrng')?1:-1; } inits.watch(); };
inits.watch = function(){
  const el = $('#view-watch');
  const ws = ROWS().filter(r=>r.watch).sort((a,b)=>{
    let x=a[wSortK], y=b[wSortK];
    if (wSortK==='wgrade'){ x=a.wgrade==='weak'?0:1; y=b.wgrade==='weak'?0:1; }
    if (typeof x==='string'||typeof y==='string'){ return wSortD*String(x||'').localeCompare(String(y||'')); }
    x=(x==null?-1e18:x); y=(y==null?-1e18:y); return wSortD*(x-y);
  });
  const H=(k,lb,left)=>`<th ${left?'style="text-align:left"':''}class="${wSortK===k?'on':''}" onclick="event.stopPropagation();sortWatch('${k}')">${lb}${wSortK===k?(wSortD>0?' ▲':' ▼'):''}</th>`;
  el.innerHTML = `<div class="card">
    <h2>Vùng theo dõi — canh phiên bùng nổ <span class="hint">quét cuối phiên · ${ws.length} mã đạt chuẩn nền · ${(SUM.updated||'')}</span></h2>
    <div class="mini" style="margin-bottom:10px">Danh sách mã đã đạt chuẩn tích lũy + dòng tiền của Khoa KAFI Signal tính đến hết phiên gần nhất. Sáng mai chỉ cần tập trung các mã này: mã nào bùng nổ đạt chuẩn trong phiên là tín hiệu MUA được kích hoạt. Độ nén càng thấp — lò xo càng chặt. Bấm tiêu đề cột để sắp xếp.</div>
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
      <button class="btn" id="btnLive">Bật trực chiến trong phiên</button>
      <span class="mini" id="liveSt"></span>
    </div>
    <div style="overflow:auto"><table><tr>${H('t','Mã')}${H('n','Tên',1)}${H('b','Sàn')}${H('p','Giá')}${H('_lv','Trong phiên')}${H('val20','GTGD TB20 (tỷ)')}${H('wrng','Độ nén nền')}${H('wdb','Cách đỉnh nền')}${H('rs','RS')}${H('wgrade','Hạng AI')}</tr>
    ${ws.map(r=>{ const lv=r._lv, vv=r._lvv||0;
      const lvtxt = lv!=null ? ((lv>=0?'+':'')+lv.toFixed(1)+'%'+(vv>=1.5?' · KL x'+vv.toFixed(1):'')) : '—';
      const lvcls = lv!=null ? (lv>=3?'up':(lv<=-2?'down':'mut')) : 'mut';
      return `<tr class="row" onclick="openDetail('${r.t}')">
      <td><b>${r.t}</b></td><td style="text-align:left" class="mini">${r.n||''}</td><td>${r.b==='HO'?'HOSE':'HNX'}</td>
      <td>${fmt(r.p,2)}</td><td id="lv_${r.t}" class="${lvcls}">${lvtxt}</td><td>${fmt((r.val20||0)/1000,0)}</td>
      <td><span class="chip ${r.wrng<=8?'g':'a'}">${r.wrng}%</span></td>
      <td class="${cls(r.wdb)}">${pct(r.wdb)}</td><td>${r.rs??'—'}</td>
      <td><span class="chip ${r.wgrade==='weak'?'a':'g'}">${r.wgrade==='weak'?'Yếu':'Mạnh'}</span></td></tr>`;}).join('')}
    </table></div>${ws.length?'':'<div class="mini" style="padding:14px">Chưa có mã nào đạt chuẩn nền — bấm "Cập nhật dữ liệu" để quét lại cuối phiên.</div>'}</div>`;
  $('#btnLive').onclick = () => liveWatch.toggle(ws);
  liveWatch.paint();
  if (liveWatch.timer) liveWatch.applyFilter();
};
// ===== TRỰC CHIẾN TRONG PHIÊN: poll giá realtime các mã vùng theo dõi, báo khi bùng nổ =====
const liveWatch = {
  timer: null, list: [],
  inSession(){ const h = new Date().getHours()+new Date().getMinutes()/60; const d = new Date().getDay(); return d>=1 && d<=5 && ((h>=9 && h<11.5) || (h>=13 && h<14.83)); },
  paint(){ const b = document.getElementById('btnLive'), st = document.getElementById('liveSt'); if(!b) return;
    b.classList.toggle('active', !!this.timer);
    b.textContent = this.timer ? 'Đang trực chiến — bấm để tắt' : 'Bật trực chiến trong phiên';
    if (st && !this.timer) st.textContent = 'Quét mỗi 90 giây trong giờ giao dịch, báo ngay khi có mã bùng nổ. Giữ tab này mở.'; },
  async toggle(ws){
    if (this.timer) { clearInterval(this.timer); this.timer = null; document.querySelectorAll('#view-watch tr.row').forEach(tr=>tr.style.display=''); const em=document.getElementById('liveEmpty'); if(em) em.textContent=''; this.paint(); return; }
    ga('live_watch_on');
    if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
    if (!('Notification' in window)) {
      toast('Thiết bị này không hỗ trợ thông báo đẩy (iPhone/Safari) — hãy giữ tab này mở, bảng lọc vẫn tự cập nhật.');
    } else if (Notification.permission === 'granted') {
      try { new Notification('Khoa KAFI Signal', {body: 'Trực chiến đã bật — thông báo hoạt động tốt. Có mã bùng nổ sẽ báo ngay tại đây.'}); } catch(e){}
    } else if (Notification.permission === 'denied') {
      toast('THÔNG BÁO ĐANG BỊ CHẶN — bấm ổ khóa cạnh thanh địa chỉ, mở Thông báo: Cho phép, rồi bật lại trực chiến.');
      alert('Thông báo của trang đang bị CHẶN nên cảnh báo sẽ không nổi lên.' + String.fromCharCode(10,10) + 'Cách mở: bấm biểu tượng Ổ KHÓA cạnh thanh địa chỉ, chọn Thông báo: Cho phép, tải lại trang và bật lại Trực chiến.');
    } else {
      toast('Bạn chưa cho phép thông báo — trực chiến vẫn chạy nhưng chỉ hiện trên bảng, không có cảnh báo nổi.');
    }
    this.list = ws.map(r=>({t:r.t, b:r.b, v20:r.v20||0}));
    this.timer = setInterval(()=>this.tick(), 90000);
    this.paint(); this.tick();
  },
  applyFilter(){
    if (!this.timer) return 0;
    let shown = 0;
    document.querySelectorAll('#view-watch tr.row').forEach(tr=>{
      const t = (tr.cells[0] ? tr.cells[0].textContent : '').trim();
      const r = byT[t]; const on = r && r._lv != null && r._lv >= 2;
      tr.style.display = on ? '' : 'none'; if (on) shown++;
    });
    let em = document.getElementById('liveEmpty');
    const tb = document.querySelector('#view-watch table');
    if (!em && tb) { em = document.createElement('div'); em.id='liveEmpty'; em.className='mini'; em.style.padding='16px 4px'; tb.parentNode.appendChild(em); }
    if (em) em.textContent = shown ? '' : 'Chưa mã nào trong vùng theo dõi tăng ≥2% — bảng sẽ tự hiện ngay khi có hàng nóng máy. Máy quét vẫn chạy mỗi 90 giây.';
    return shown;
  },
  notify(key, title, body, repeatMs){ notifyPush(key, title, body, repeatMs); },
  async tick(){
    const st = document.getElementById('liveSt');
    if (!this.inSession()) { if (st) st.textContent = 'Ngoài giờ giao dịch — chờ phiên sau (quét tự động 9:00-11:30, 13:00-14:50).'; return; }
    const now = NOW(); let hot = 0;
    const h = new Date().getHours()+new Date().getMinutes()/60;
    const elapsed = Math.max(0.08, Math.min(1, (h<11.5 ? (h-9) : (h<13 ? 2.5 : 2.5+(h-13))) / 4.33));
    const one = async m => { try {
      const d = await jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${m.t}&resolution=D&from=${now-86400*7}&to=${now}`);
      const c = d.c||[], v = d.v||[]; if (c.length < 2) return;
      const px = c[c.length-1], chg = (px/c[c.length-2]-1)*100;
      const volR = m.v20 ? (v[v.length-1]/elapsed)/m.v20 : 0;
      const rw = byT[m.t]; if (rw) { rw._lv = chg; rw._lvv = volR; }
      const cell = document.getElementById('lv_'+m.t);
      if (cell) { cell.textContent = (chg>=0?'+':'')+chg.toFixed(1)+'%' + (volR>=1.5?' · KL x'+volR.toFixed(1):''); cell.className = chg>=3?'up':(chg<=-2?'down':'mut'); }
      const thr = m.b==='HN' ? 8.8 : 6.3;
      if (chg >= thr-0.15 && volR >= 1.8) { hot++; this.notify('L2'+m.t, m.t+' '+(chg>=0?'+':'')+chg.toFixed(1)+'% kèm dòng tiền mạnh', 'Tín hiệu MUA có thể kích hoạt cuối phiên — mở dashboard kiểm tra ngay.', 5*60000); }
      else if (chg >= 4) { hot++; this.notify('W4'+m.t, m.t+' +'+chg.toFixed(1)+'% — NÓNG MÁY', 'Mã trong vùng theo dõi đang tăng tốc mạnh. Canh chặt tới cuối phiên.', 10*60000); }
      else if (chg >= 2) { hot++; this.notify('W2'+m.t, m.t+' +'+chg.toFixed(1)+'% — khởi động', 'Mã trong vùng theo dõi bắt đầu chạy. Để mắt.', 15*60000); }
    } catch(e){} };
    for (let i=0;i<this.list.length;i+=6) await Promise.all(this.list.slice(i,i+6).map(one));
    const shown = this.applyFilter();
    if (st) st.textContent = 'Quét lúc ' + new Date().toTimeString().slice(0,5) + ' — đang lọc trực chiến: ' + shown + ' mã tăng ≥2% / ' + this.list.length + ' mã nền' + (hot ? ' · ' + hot + ' mã nóng' : '');
  }
};
async function pushDataToGitHub(){
  const tk = localStorage.getItem('kafi_gh_token'); if (!tk) return false;
  const st = document.getElementById('refreshStatus');
  try {
    if (st) st.innerHTML = '<span class="spin"></span> đang phát hành dữ liệu cho mọi khách…';
    const apiU = 'https://api.github.com/repos/khoakafi/khoakafi.github.io/contents/dashboard_data.js';
    const H = { 'Authorization': 'Bearer ' + tk, 'Accept': 'application/vnd.github+json' };
    const cur = await fetch(apiU, { headers: H }).then(r => r.json());
    const content = 'window.SUMMARY=' + JSON.stringify(SUM) + ';';
    const b64 = btoa(unescape(encodeURIComponent(content)));
    const res = await fetch(apiU, { method: 'PUT', headers: H, body: JSON.stringify({ message: 'Auto data publish ' + SUM.updated, content: b64, sha: cur.sha }) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (st) st.textContent = 'Đã phát hành dữ liệu mới cho tất cả khách truy cập';
    return true;
  } catch(e) { if (st) st.textContent = 'Phát hành lỗi: ' + e.message; return false; }
}
async function maybeAutoPublish(){
  try {
    if (!localStorage.getItem('kafi_gh_token')) return;
    const vnNow = new Date(Date.now() + (7*60 + new Date().getTimezoneOffset())*60000);
    const today = vnNow.toISOString().slice(0,10);
    if (localStorage.getItem('kafi_autopub') === today) return;
    const h = vnNow.getHours() + vnNow.getMinutes()/60;
    if (h < 15.75) return;
    const m = (SUM.updated || '').match(/\d{4}-\d{2}-\d{2}/);
    if (m && m[0] >= today) return;
    localStorage.setItem('kafi_autopub', today);
    window._autoRefresh = true;
    const b = document.getElementById('btnRefresh'); if (b) b.click();
  } catch(e){}
}
$('#btnRefresh').onclick = async function(){
  if (!window._autoRefresh && !confirm('Tải lại toàn bộ dữ liệu 702 mã từ API? Mất khoảng 1-2 phút.')) return;
  window._autoRefresh = false;
  ga('refresh_data');
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
        o.chg = c[c.length-2] ? +((last/c[c.length-2]-1)*100).toFixed(2) : null;
        o.hi52 = Math.max(...c); o.lo52 = Math.min(...c); o.dHi = +((last/o.hi52-1)*100).toFixed(1);
        o.ma20 = +(last/sma(c,20)-1).toFixed(3); o.ma50 = c.length>=50?+(last/sma(c,50)-1).toFixed(3):null; o.ma200 = c.length>=200?+(last/sma(c,200)-1).toFixed(3):null;
        const rr = rsiS(c); o.rsi = rr[rr.length-1]!=null?Math.round(rr[rr.length-1]):null;
        o.v20 = Math.round(sma(v,20)||0); o.vx = o.v20?+(v[v.length-1]/o.v20).toFixed(2):null;
        o.val20 = Math.round((sma(v,20)||0)*last/1000);
        const ret = n => c.length>n?+((last/c[c.length-1-n]-1)*100).toFixed(1):null;
        o.r3 = ret(63); o.r6 = ret(126); o.r12 = ret(250);
        // trạng thái vùng theo dõi của engine tín hiệu (chi tiết thuật toán không công bố)
        if (c.length>32 && (o.val20||0)>=15000) {
          const thr = o.b==='HN'?8.8:6.3; const L2 = c.length-1;
          let hi=-1e9, lo=1e9, hc=false;
          for (let k=L2-29;k<=L2;k++){ if(c[k]>hi)hi=c[k]; if(c[k]<lo)lo=c[k]; if(k>0&&(c[k]/c[k-1]-1)*100>=thr)hc=true; }
          const rng=(hi-lo)/lo*100;
          if (!hc && rng<=12) { o.watch=1; o.wrng=+rng.toFixed(1); o.wdb=+((c[L2]/hi-1)*100).toFixed(1); }
        } }
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
      if (o.watch) o.wgrade = (o.npatYoY!=null && o.npatYoY>=0 && o.npatYoY<25) ? 'weak' : 'strong';
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
    SUM = {updated: new Date().toISOString().slice(0,16).replace('T',' ')+' (trình duyệt)', nTickers: out.length, rows: out, tpn: SUM.tpn || window.SUMMARY.tpn};
    try { localStorage.setItem('summary_v1', JSON.stringify(SUM)); } catch(e){}
    Object.keys(byT).forEach(k=>delete byT[k]); SUM.rows.forEach(r=>byT[r.t]=r);
    $('#bgeData').textContent = 'Dữ liệu screener: ' + SUM.updated;
    st.textContent = '\u2713 Đã cập nhật ' + out.length + ' mã';
    pushDataToGitHub();
    scInit = false; mktDone = false;
    const cur = views.find(v=>$('#view-'+v).style.display!=='none');
    inits[cur] && inits[cur]();
  } catch(e){ st.textContent = 'Lỗi: '+e.message; }
  this.disabled = false;
};

// ================= KHỞI ĐỘNG =================
(async () => { try { await liveQuote(); mergeLiveDeals(); scanNewSignals(); checkWatchAlerts(); } catch(e){} inits.market(); ensureNotifBanner(); ensureFreshBanner(); retroScanSignals();
  if (location.search.indexOf('setup_publish') >= 0) {
    const t = prompt('Dán GitHub token (fine-grained, quyền Contents Read&Write của repo khoakafi.github.io) để biến máy này thành máy phát hành:');
    if (t) { localStorage.setItem('kafi_gh_token', t.trim()); alert('Đã lưu. Từ giờ máy này mở trang sau 15h45 sẽ tự cập nhật dữ liệu và phát hành cho mọi khách.'); }
  }
  maybeAutoPublish();
})();
setInterval(async () => { if (await liveQuote()) { renderTops(); scanNewSignals(); checkWatchAlerts(); renderRecent(); } }, 120000);
})();
