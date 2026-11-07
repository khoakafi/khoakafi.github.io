// Tim + tai danh muc ky quy VPS / SSI / Vietcap bang Chromium that (chi doc).
import { chromium } from 'playwright';
import fs from 'fs';
const MA = 'POW MSB MSN CMG KDH SHS MBB FPT MWG VSC ORS NLG VIB F88'.split(' ');
const RX = new RegExp('(?<![A-Z0-9])(' + MA.join('|') + ')(?![A-Z0-9])');
const KEY = /k[yý]\s*qu[yỹ]|margin|giao-dich-ky-quy|danh-muc|ky-quy|tỷ lệ cho vay|cho vay/i;
const START = (process.env.START || '').split('\n').map(s => s.trim()).filter(Boolean);
const b = await chromium.launch();
const ctx = await b.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh', acceptDownloads: true });
fs.mkdirSync('/tmp/m4', { recursive: true });
let nf = 0; const daTai = new Set(), daXem = new Set();
async function taiFile(p, u) {
  if (daTai.has(u) || nf > 30) return; daTai.add(u);
  try { const r = await p.request.get(u, { timeout: 40000 }); const buf = await r.body();
    const f = `/tmp/m4/${++nf}`; fs.writeFileSync(f, buf); fs.writeFileSync(f + '.url', u);
    console.log('   ## file', r.status(), buf.length, u, '->', f); } catch (e) { console.log('   ## file LOI', u, e.message); }
}
async function xem(p, u, sau) {
  if (daXem.has(u)) return; daXem.add(u);
  console.log('#'.repeat(16), u);
  let resp; try { resp = await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 }); await p.waitForTimeout(+(process.env.WAIT || 6000)); await p.mouse.wheel(0, 4000).catch(()=>{}); await p.waitForTimeout(2000); } catch (e) { console.log('  LOI', e.message); return; }
  console.log('  HTTP', resp && resp.status(), 'title:', await p.title());
  const ct = resp && resp.headers()['content-type'] || '';
  if (/pdf|excel|spreadsheet|octet/.test(ct)) { await taiFile(p, u); return; }
  const txt = await p.evaluate(() => document.body ? document.body.innerText : '');
  const dong = txt.split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const khop = dong.filter(l => RX.test(l) && l.length < 300);
  console.log('  dong co ma:', khop.length); khop.slice(0, 60).forEach(l => console.log('   *', l));
  const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => [a.href, (a.innerText || a.title || '').replace(/\s+/g, ' ').trim().slice(0, 120)]));
  const files = links.filter(([h]) => /\.(pdf|xlsx?)(\?|#|$)/i.test(h) || /download|attachment|upload/i.test(h));
  const lienQuan = links.filter(([h, t]) => KEY.test(h) || KEY.test(t));
  if (process.env.ALL_LINKS) [...new Map(links)].slice(0, 200).forEach(([h, t]) => console.log('   . ', t, '=>', h));
  console.log('  link lien quan:', lienQuan.length); [...new Map(lienQuan)].slice(0, 40).forEach(([h, t]) => console.log('   -', t, '=>', h));
  for (const [h, t] of files) if (KEY.test(h) || KEY.test(t)) await taiFile(p, h);
  if (sau > 0) for (const [h, t] of [...new Map(lienQuan)].slice(0, 8)) if (!/\.(pdf|xlsx?)/i.test(h) && /^https?:/.test(h)) await xem(p, h, sau - 1);
}
const p = await ctx.newPage();
const MAXB = +(process.env.MAXB || 3000);
p.on('response', async r => { try {
  const u = r.url(), ct = r.headers()['content-type'] || '';
  if (!/json|excel|spreadsheet|pdf|text\/plain|csv/.test(ct) || /google|facebook|analytics|sentry|clarity|hotjar/.test(u)) return;
  const body = await r.text().catch(() => '');
  const n = (body.match(new RegExp(RX.source, 'g')) || []).length;
  console.log('   ~ XHR', r.status(), ct.split(';')[0], body.length, 'ma:', n, u.slice(0, 220));
  if (n > 0 || /margin|ky-?quy|loan|ratio/i.test(u)) { const f = `/tmp/m4/x${++nf}.txt`; fs.writeFileSync(f, body); console.log('     body:', body.slice(0, MAXB).replace(/\s+/g, ' ')); }
} catch (e) {} });
for (const u of START) await xem(p, u, /\.(pdf|xlsx?)/i.test(u) ? 0 : 1);
await b.close();
