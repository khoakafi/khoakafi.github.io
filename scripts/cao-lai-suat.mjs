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
async function tai(url, bin) {
  for (let k = 0; k < 3; k++) {
    try {
      const f = '/tmp/_cao.bin';
      const out = execFileSync('curl', ['-s', '--compressed', '-L', '-m', '40', '-o', f, '-w', '%{http_code} %{url_effective}',
        '-H', 'User-Agent: ' + UA, '-H', 'Accept: text/html,application/pdf,*/*', '-H', 'Accept-Language: vi-VN,vi;q=0.9', url]).toString();
      const code = +out.slice(0, 3); codes.push(code + ' ' + url.slice(0, 160));
      if (code === 404) return null;
      if (code !== 200) { await ngu(1500); continue; }
      const b = fs.readFileSync(f);
      return bin ? b : { url: out.slice(4), text: b.toString('utf8') };
    } catch (e) { codes.push('ERR ' + e.message.slice(0, 80)); await ngu(1500); }
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
      const r = await tai(BASE + pre + SLUG + mm + '/' + y);
      if (r && /<title>[^<]*Diễn biến lãi suất[^<]*<\/title>/i.test(r.text)) { got = r; break; }
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
fs.writeFileSync(`${OUT}/http.txt`, codes.join('\n'));
console.log(log.join('\n'));
