#!/usr/bin/env node
/* Nuong san gia nam nay cho B* -> bstar_live.js, de trang dau hien 602% NGAY khi mo
   (ke ca tab an danh), khong phai "dang tinh 2026..." roi cho 15 loi goi dchart.

   CHAY O DAU: tren may phat hanh cua anh Khoa (may commit [AUTO] moi toi ~20:12),
   ngay sau khi cap nhat signals_data.js. KHONG chay duoc tren GitHub Actions:
   VNDirect chan IP trung tam du lieu (403).

   CACH DUNG:   node scripts/bstar-live.js        -> ghi bstar_live.js o goc repo
                git add bstar_live.js && git commit -m "[AUTO] gia B* $(date +%F)" && git push

   Luat chon ma y het bstarDeals()/bstarLoadPrices() trong dashboard_app.js:
   dau X trong signals_data.js (bo ma cam BO_CUNG), deal tu dau nam nay hoac trong
   200 ngay gan nhat, cong them cac vi the mang sang (BSTAR_CURVE.carry) va VNINDEX. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BO_CUNG = new Set(['DCL', 'VC3', 'SSB', 'KHG', 'VPI']);
const GIU_TU = '2025-12-01';          // chi giu tu thang 12 nam truoc: du cho duong 2026 + vi the mang sang

function docWindow(file) {
  const c = {}; vm.createContext(c);
  vm.runInContext('var window=this;' + fs.readFileSync(path.join(ROOT, file), 'utf8'), c);
  return c;
}
const iso = ts => new Date((ts + 7 * 3600) * 1000).toISOString().slice(0, 10);

function bstarDeals(SIGS) {
  const out = []; const T = (SIGS && SIGS.t) || {};
  Object.keys(T).forEach(t => {
    if (BO_CUNG.has(t)) return;
    const m = T[t].m || [];
    m.forEach((mk, i) => {
      if (mk[1] !== 'X') return;
      let sell = null;
      for (let k = i + 1; k < m.length; k++) { const q = m[k][1]; if (q === 'S') { sell = m[k]; break; } if ('XBTW'.indexOf(q) >= 0) break; }
      out.push({ t, bdate: iso(mk[0]), sdate: sell ? iso(sell[0]) : null });
    });
  });
  return out;
}

async function taiMot(sym, from, to) {
  const u = `https://dchart-api.vndirect.com.vn/dchart/history?symbol=${sym}&resolution=D&from=${from}&to=${to}`;
  const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json', 'Referer': 'https://khoanguyeninvest.vn/' } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json();
  if (!j || !j.t || !j.t.length) throw new Error('rong');
  const mp = {}, ds = [];
  j.t.forEach((ts, i) => { const d = iso(ts); if (d < GIU_TU) return; mp[d] = j.c[i]; ds.push(d); });
  return { mp, ds, last: j.c[j.c.length - 1], lastd: ds[ds.length - 1] };
}

async function main() {
  const SIGS = docWindow('signals_data.js').SIGS;
  const C = docWindow('bstar_books.js').BSTAR_CURVE;
  const y = new Date().getFullYear();
  const moc = new Date(Date.now() - 200 * 86400000).toISOString().slice(0, 10);
  const need = new Set(bstarDeals(SIGS).filter(d => d.bdate >= (y + '-01-01') || d.bdate >= moc).map(d => d.t));
  ((C && C.carry) || []).forEach(c => need.add(c.t));
  const syms = [...need].sort(); syms.push('VNINDEX');
  const to = Math.floor(Date.now() / 1000) + 86400, from = to - 86400 * 330;
  const px = {}; const hong = [];
  for (let i = 0; i < syms.length; i += 4) {
    await Promise.all(syms.slice(i, i + 4).map(async s => {
      for (let lan = 0; lan < 3; lan++) {
        try { px[s] = await taiMot(s, from, to); return; }
        catch (e) { if (lan === 2) hong.push(s + ': ' + e.message); else await new Promise(r => setTimeout(r, 800 * (lan + 1))); }
      }
    }));
  }
  if (!px.VNINDEX) { console.error('KHONG co VNINDEX -> khong ghi file. Loi:', hong.join('; ')); process.exit(1); }
  if (hong.length) console.error('Canh bao, ma hong (khong ghi vao file):', hong.join('; '));
  const out = { as_of: px.VNINDEX.lastd, ghi_luc: new Date().toISOString(), px };
  fs.writeFileSync(path.join(ROOT, 'bstar_live.js'), 'window.BSTAR_LIVE=' + JSON.stringify(out) + ';\n');
  const kb = Math.round(fs.statSync(path.join(ROOT, 'bstar_live.js')).size / 1024);
  console.log(`bstar_live.js: ${Object.keys(px).length}/${syms.length} ma, den phien ${out.as_of}, ${kb} KB`);
  return out;
}
module.exports = { main, bstarDeals };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
