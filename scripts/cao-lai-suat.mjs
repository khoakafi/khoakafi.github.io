// Tai bai "Dien bien lai suat cua TCTD doi voi khach hang thang M/YYYY" cua NHNN + PDF dinh kem.
// Chay tren runner GitHub (may task bi chan sbv.gov.vn). Ket qua: $OUT/sbv/<YYYY-MM>.{html,txt,pdf,pdf.txt}
// Chi doc nguon cong khai cua NHNN, khong dung/sua du lieu web.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT || '/tmp/out') + '/sbv';
fs.mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const BASE = 'https://sbv.gov.vn';
// slug da ma hoa, chep nguyen tu link tren trang NHNN
const SLUG = 'di%E1%BB%85n-bi%E1%BA%BFn-l%C3%A3i-su%E1%BA%A5t-c%E1%BB%A7a-t%E1%BB%95-ch%E1%BB%A9c-t%C3%ADn-d%E1%BB%A5ng-%C4%91%E1%BB%91i-v%E1%BB%9Bi-kh%C3%A1ch-h%C3%A0ng-th%C3%A1ng-';
const ngu = ms => new Promise(r => setTimeout(r, ms));
// Dung curl (fetch cua Node bi sbv.gov.vn tu choi, curl thi qua) — ghi ma HTTP de do.
const codes = [];
let chan = 0;
async function tai(url, bin) {
  for (let k = 0; k < 4; k++) {
    try {
      const f = '/tmp/_cao.bin';
      const out = execFileSync('curl', ['-s', '--compressed', '-L', '-m', '40', '-c', '/tmp/_cao.jar', '-b', '/tmp/_cao.jar', '-e', BASE + '/', '-o', f, '-w', '%{http_code} %{url_effective}',
        '-H', 'User-Agent: ' + UA, '-H', 'Accept: text/html,application/xhtml+xml,application/pdf,*/*;q=0.8', '-H', 'Sec-Fetch-Mode: navigate', '-H', 'Upgrade-Insecure-Requests: 1', '-H', 'Accept-Language: vi-VN,vi;q=0.9', url]).toString();
      const code = +out.slice(0, 3); codes.push(code + ' ' + url.slice(0, 160));
      if (code === 404) { chan = 0; return null; }
      if (code === 403) { chan++; if (chan >= 6) { console.log('BI CHAN 403 lien tuc -> dung'); throw new Error('CHAN'); } await ngu(60000); continue; }
      if (code !== 200) { await ngu(3000); continue; }
      chan = 0;
      const b = fs.readFileSync(f);
      return bin ? b : { url: out.slice(4), text: b.toString('utf8') };
    } catch (e) { if (e.message === 'CHAN') throw e; codes.push('ERR ' + e.message.slice(0, 80)); await ngu(1500); }
  }
  return null;
}
const text = h => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const log = [];
const DELAY = +(process.env.DELAY || 12000);
// mo trang chu truoc de lay cookie nhu trinh duyet
await tai(BASE + '/'); await ngu(3000);
// Quet lui tung thang theo slug (cham DELAY ms/lan de khong bi WAF 403). Dung khi MISS thang lien tiep khong co bai.
const MISS = +(process.env.MISS || 14);
let d = new Date(Date.UTC(+(process.env.DEN || '2026-08').slice(0, 4), +(process.env.DEN || '2026-08').slice(5) - 1, 1)), miss = 0;
const tu = process.env.TU || '2008-01';
try {
while (miss < MISS) {
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, key = `${y}-${String(m).padStart(2, '0')}`;
  if (key < tu) break;
  d = new Date(Date.UTC(y, m - 2, 1));
  let got = null;
  for (const mm of [String(m), String(m).padStart(2, '0')]) {
    if (mm === String(m) && m >= 10 && got === null && mm.length === 2 && false) continue;
    const r = await tai(BASE + '/vi/w/' + SLUG + mm + '/' + y); await ngu(DELAY);
    if (r && /<title>[^<]*Diễn biến lãi suất[^<]*<\/title>/i.test(r.text)) { got = r; break; }
    if (m >= 10) break;
  }
  if (!got) { miss++; log.push(`${key} khong co`); console.log(log.at(-1)); fs.writeFileSync(`${OUT}/log.txt`, log.join('\n')); continue; }
  miss = 0;
  const pdfs = [...new Set([...got.text.matchAll(/(\/documents\/[^"'\s>]+?\.pdf[^"'\s>]*)/gi)].map(x => x[1].replace(/&amp;/g, '&')))];
  const t = text(got.text);
  const i = t.search(/Diễn biến lãi suất của tổ chức tín dụng/i);
  fs.writeFileSync(`${OUT}/${key}.txt`, t.slice(Math.max(0, i), i + 6000));
  let n = 0;
  for (const p of pdfs) {
    const b = await tai(BASE + p, true); await ngu(DELAY / 2); if (!b) continue;
    const f = `${OUT}/${key}${n ? '-' + n : ''}.pdf`; fs.writeFileSync(f, b); n++;
    try { execFileSync('pdftotext', ['-layout', f, f + '.txt']); } catch (e) { log.push(`${key} pdftotext loi ${e.message}`); }
  }
  log.push(`${key} OK pdf=${n}`); console.log(log.at(-1));
  fs.writeFileSync(`${OUT}/log.txt`, log.join('\n'));
}
} catch (e) { log.push('DUNG: ' + e.message); }
fs.writeFileSync(`${OUT}/log.txt`, log.join('\n'));
fs.writeFileSync(`${OUT}/http.txt`, codes.join('\n'));
console.log(log.join('\n'));
