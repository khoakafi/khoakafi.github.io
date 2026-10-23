// So tab HQKD (Mua/Ban theo thang) voi tong Trans_All theo thang tren trang leverage-dashboard that. Chi doc.
import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', timezoneId: 'Asia/Ho_Chi_Minh' });
const p = await ctx.newPage();
await p.goto('https://khoanguyeninvest.vn/leverage-dashboard/?cb=' + Date.now(), { waitUntil: 'domcontentloaded' });
await p.waitForFunction(() => typeof fetchSheetJSON === 'function' && typeof fetchSheet === 'function', null, { timeout: 30000 });
const kq = await p.evaluate(async () => {
  const k = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  const hq = {}; (await fetchSheet('HQKD')).slice(1).forEach(r => { const d = parseMDY(r[0]); if (d) hq[k(d)] = [num(r[1]), num(r[2])]; });
  const tr = {}; let n = 0, max = null;
  (await fetchSheetJSON('Trans_All')).forEach(r => { const d = cellDate(r[0]), side = cellStr(r[3]).toUpperCase(), v = cellNum(r[6]);
    if (!d || !(v > 0) || (side !== 'BUY' && side !== 'SELL')) return; n++; if (!max || d > max) max = d;
    const a = tr[k(d)] = tr[k(d)] || [0, 0]; a[side === 'BUY' ? 0 : 1] += v; });
  return { n, max: max && max.toISOString(), thang: [...new Set([...Object.keys(hq), ...Object.keys(tr)])].sort().map(m => [m, hq[m], tr[m]]) };
});
console.log('Trans_All:', kq.n, 'dong, moi nhat', kq.max);
for (const [m, h, t] of kq.thang) console.log(m, 'HQKD', JSON.stringify(h), 'Trans_All', JSON.stringify(t && t.map(Math.round)), h && t ? 'lech mua ' + Math.round(t[0] - h[0]) + ' ban ' + Math.round(t[1] - h[1]) : '');
await b.close();
