// Do toc do tab Chi tiet ma tren trinh duyet that (Chromium tren runner): thoi gian doi ma + request cham.
import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const req = new Map(), cham = [];
p.on('request', r => req.set(r, Date.now()));
p.on('requestfinished', async r => { const t0 = req.get(r); const ms = Date.now() - t0; if (ms > 400) cham.push([ms, r.url().slice(0, 140)]); });
p.on('requestfailed', r => cham.push(['LOI ' + (Date.now() - req.get(r)), r.url().slice(0, 140), r.failure()?.errorText]));
const t0 = Date.now();
await p.goto('https://khoanguyeninvest.vn/?cb=' + Date.now(), { waitUntil: 'domcontentloaded' });
console.log('DOMContentLoaded', Date.now() - t0, 'ms');
await p.waitForFunction(() => typeof window.openDetail === 'function' || typeof window.showView === 'function', null, { timeout: 30000 });
console.log('JS san sang', Date.now() - t0, 'ms');
for (const ma of (process.env.MA || 'KDH,NVL,HPG,FPT,KDH').split(',')) {
  const s = Date.now();
  await p.evaluate(m => { (window.openDetail || ((x) => { showView('detail'); loadDetail(x); }))(m); }, ma);
  try { await p.waitForFunction(m => window.curOhlcFor === m || (typeof curOhlcFor !== 'undefined' && curOhlcFor === m), ma, { timeout: 30000, polling: 50 }); console.log('Doi ma', ma, ':', Date.now() - s, 'ms'); }
  catch (e) { console.log('Doi ma', ma, ': QUA 30s'); }
  await p.waitForTimeout(1500);
}
cham.sort((a, b) => (+String(b[0]).replace(/\D/g, '')) - (+String(a[0]).replace(/\D/g, '')));
console.log('\nRequest > 400ms:'); cham.slice(0, 40).forEach(x => console.log('  ', ...x));
await b.close();
