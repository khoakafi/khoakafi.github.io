// Tai bai "Dien bien lai suat cua TCTD doi voi khach hang thang M/YYYY" cua NHNN + PDF dinh kem.
// Chay tren runner GitHub (may task bi chan sbv.gov.vn). Ket qua: $OUT/sbv/<YYYY-MM>.{html,txt,pdf,pdf.txt}
// Chi doc nguon cong khai cua NHNN, khong dung/sua du lieu web.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT || '/tmp/out') + '/sbv';
fs.mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const BASE = 'https://sbv.gov.vn';
const SLUG = 'diễn-biến-lãi-suất-của-tổ-chức-tín-dụng-đối-với-khách-hàng-tháng-';
const ngu = ms => new Promise(r => setTimeout(r, ms));
async function tai(url, bin) {
  for (let k = 0; k < 3; k++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'vi-VN,vi;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(40000) });
      if (r.status === 404) return null;
      if (!r.ok) { await ngu(1500); continue; }
      return bin ? Buffer.from(await r.arrayBuffer()) : { url: r.url, text: await r.text() };
    } catch (e) { await ngu(1500); }
  }
  return null;
}
const text = h => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const tu = process.env.TU || '2012-01';
const log = [];
const now = new Date();
for (let y = +tu.slice(0, 4); y <= now.getUTCFullYear(); y++) for (let m = 1; m <= 12; m++) {
  const key = `${y}-${String(m).padStart(2, '0')}`;
  if (key < tu || key > `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`) continue;
  let got = null;
  for (const mm of [String(m), String(m).padStart(2, '0')]) {
    for (const pre of ['/vi/w/', '/w/']) {
      const r = await tai(BASE + pre + encodeURI(SLUG + mm + '/' + y));
      if (r && /Diễn biến lãi suất/i.test(r.text) && !/Trang Chủ - Ngân hàng/.test(r.text.slice(0, 3000))) { got = r; break; }
    }
    if (got) break;
  }
  if (!got) { log.push(`${key} khong co bai`); continue; }
  const pdfs = [...new Set([...got.text.matchAll(/(\/documents\/[^"'\s>]+?\.pdf[^"'\s>]*)/gi)].map(x => x[1].replace(/&amp;/g, '&')))];
  const t = text(got.text);
  const i = t.search(/Diễn biến lãi suất của tổ chức tín dụng đối với khách hàng tháng/i);
  fs.writeFileSync(`${OUT}/${key}.txt`, t.slice(Math.max(0, i), i + 6000));
  let n = 0;
  for (const p of pdfs) {
    const b = await tai(BASE + p, true); if (!b) continue;
    const f = `${OUT}/${key}${n ? '-' + n : ''}.pdf`; fs.writeFileSync(f, b); n++;
    try { execFileSync('pdftotext', ['-layout', f, f + '.txt']); } catch (e) { log.push(`${key} pdftotext loi ${e.message}`); }
  }
  log.push(`${key} OK pdf=${n} ${got.url}`);
  await ngu(400);
}
fs.writeFileSync(`${OUT}/log.txt`, log.join('\n'));
console.log(log.join('\n'));
