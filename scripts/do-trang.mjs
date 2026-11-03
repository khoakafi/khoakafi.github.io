// Mo mot trang bang Chromium that tren runner, in chu + ket qua EVAL (chi doc).
import { chromium, webkit, devices } from 'playwright';
const URL_ = process.env.URL_, EVAL = process.env.EVAL || '', CHO = +(process.env.CHO || 6000);
const WK = process.env.TRINH === 'webkit';
const b = await (WK ? webkit : chromium).launch();
const p = await b.newPage(WK ? { ...devices['iPhone 13'] } : { viewport: { width: +(process.env.VW || 1280), height: 900 } });
const req = [];
p.on('request', r => { const u = r.url(); if (!/\.(png|jpe?g|svg|woff2?|css)(\?|$)/.test(u)) req.push(r.method() + ' ' + u); });
p.on('console', m => console.log('[console]', m.text().slice(0, 300)));
await p.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 });
await p.waitForTimeout(CHO);
console.log('=== TITLE', await p.title());
console.log('=== TEXT\n' + (await p.evaluate(() => document.body.innerText)).slice(0, +(process.env.CHARS || 4000)));
if (EVAL) {
  try { const v = await p.evaluate(new Function('return (async()=>{' + EVAL + '})()')); console.log('=== EVAL\n' + (typeof v === 'string' ? v : JSON.stringify(v, null, 1)).slice(0, 12000)); }
  catch (e) { console.log('=== EVAL LOI', e.message); }
}
if (process.env.FEVAL) for (const f of p.frames()) { if (f === p.mainFrame()) continue;
  try { const v = await f.evaluate(new Function('return (async()=>{' + process.env.FEVAL + '})()')); console.log('=== FRAME ' + f.url().slice(0, 90) + '\n' + String(v).slice(0, 4000)); } catch (e) { console.log('=== FRAME LOI', e.message); } }
console.log('=== REQUESTS\n' + [...new Set(req)].filter(u => !/google|facebook|doubleclick|livechat/.test(u)).slice(0, 80).join('\n'));
await b.close();
