// Kiem tra luat B*: deal nao ma GTGD TB20 tinh den PHIEN TRUOC ngay no < 15 ty (tuc chi lot nho chinh phien no keo trung binh len)?
// Chay tren GitHub Actions (dchart goi duoc). Chi doc, in ra log. Nguon deal: signals_data.js (marker X) trong checkout.
import fs from 'node:fs';
const BO_CUNG = ['DCL','VC3','SSB','KHG','VPI'];
const w = {}; new Function('window', fs.readFileSync('signals_data.js','utf8'))(w);
const T = w.SIGS.t; const X = [];
for (const t of Object.keys(T)) { if (BO_CUNG.includes(t)) continue; (T[t].m||[]).forEach(m => { if (m[1]==='X') X.push({t, ts:m[0]}); }); }
X.sort((a,b)=>a.ts-b.ts);
const iso = ts => new Date(ts*1000).toISOString().slice(0,10);
const to = Math.floor(Date.now()/1000)+86400, from = to-86400*5100;
const cache = {};
async function oh(t){ if (cache[t]) return cache[t]; const r = await fetch(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${t}&resolution=D&from=${from}&to=${to}`); const j = await r.json(); cache[t]=j; return j; }
const rows = []; let loi = 0;
for (const x of X) {
  try {
    const o = await oh(x.t); const i = o.t.indexOf(x.ts); if (i < 21) { rows.push({...x, ghi:'khong tim thay nen'}); continue; }
    const c=o.c, v=o.v;
    let s=0; for (let k=i-20;k<i;k++) s+=v[k]; const v20t = s/20;                 // TB20 den phien truoc
    const valTruoc = c[i-1]*v20t/1e6;                                               // ty dong, gia phien truoc x KL TB
    let s2=0; for (let k=i-19;k<=i;k++) s2+=v[k]; const valEngine = c[i]*(s2/20)/1e6; // dieu kien engine (gom ca phien no)
    rows.push({ t:x.t, d:iso(x.ts), valTruoc:+valTruoc.toFixed(1), valEngine:+valEngine.toFixed(1), vx:+(v[i]/v20t).toFixed(1), chg:+((c[i]/c[i-1]-1)*100).toFixed(1) });
  } catch(e){ loi++; rows.push({...x, ghi:'loi '+e.message}); }
}
const thap = rows.filter(r => r.valTruoc != null && r.valTruoc < 15);
console.log('Tong deal B*:', rows.length, '| loi:', loi, '| TB20 phien truoc < 15 ty:', thap.length);
console.log('ma | ngay no | TB20 phien truoc (ty) | theo engine gom phien no (ty) | KL/TB | %gia');
thap.forEach(r => console.log([r.t, r.d, r.valTruoc, r.valEngine, r.vx+'x', r.chg+'%'].join(' | ')));
console.log('--- 10 deal thap nhat ke ca >=15:');
rows.filter(r=>r.valTruoc!=null).sort((a,b)=>a.valTruoc-b.valTruoc).slice(0,10).forEach(r => console.log([r.t, r.d, r.valTruoc, r.valEngine].join(' | ')));
rows.filter(r=>r.ghi).forEach(r=>console.log('bo qua:', r.t, iso(r.ts), r.ghi));
