// So "Total Stock" (Google Sheet) voi ton kho tu Key in (deal ON) tren trang leverage-dashboard that. Chi doc.
import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', timezoneId: 'Asia/Ho_Chi_Minh' });
const p = await ctx.newPage();
await p.goto('https://khoanguyeninvest.vn/leverage-dashboard/?cb=' + Date.now(), { waitUntil: 'domcontentloaded' });
await p.waitForFunction(() => typeof fetchKeyInFull === 'function' && typeof fetchSheet === 'function', null, { timeout: 30000 });
const kq = await p.evaluate(async () => {
  const ts = await fetchSheet('Total Stock');
  const tot = {}; ts.forEach(r => { const t = (r[0] || '').trim(); if (t) tot[t] = num(r[1]); });
  const rows = await fetchKeyInFull();
  const qty = {}, val = {}, mua = {};
  for (let i = 2; i < rows.length; i++) { const r = rows[i]; const cust = cellStr(r[1]), bd = cellDate(r[2]), tk = cellStr(r[6]);
    if (!cust || !bd || !tk || tk === '-') continue; if (cellStr(r[10]).toUpperCase() !== 'ON') continue;
    const q = cellNum(r[8]); if (!(q > 0)) continue;
    qty[tk] = (qty[tk] || 0) + q; mua[tk] = (mua[tk] || 0) + cellNum(r[9]); const cur = cellNum(r[28]) || cellNum(r[27]); val[tk] = (val[tk] || 0) + (cur > 0 ? cur : 0); }
  let api = {}; try { const a = await fetchSheetJSON('API'); a.forEach(r => { const t = cellStr(r[0]), pr = cellNum(r[2]); if (t && pr > 0) api[t] = pr; }); } catch (e) { api = { loi: String(e) }; }
  return { tot, qty, val, mua, api: Object.fromEntries(Object.keys(qty).map(t => [t, api[t]])) };
});
console.log(JSON.stringify(kq, null, 1));
await b.close();
