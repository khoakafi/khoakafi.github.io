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
  for (let k = 0; k < 4; k++) {
    try {
      const f = '/tmp/_cao.bin';
      const out = execFileSync('curl', ['-s', '--compressed', '-L', '-m', '40', '-o', f, '-w', '%{http_code} %{url_effective}',
        '-H', 'User-Agent: ' + UA, '-H', 'Accept: text/html,application/pdf,*/*', '-H', 'Accept-Language: vi-VN,vi;q=0.9', url]).toString();
      const code = +out.slice(0, 3); codes.push(code + ' ' + url.slice(0, 160));
      if (code === 404) return null;
      if (code !== 200) { await ngu(code === 403 ? 90000 : 3000); continue; }
      const b = fs.readFileSync(f);
      return bin ? b : { url: out.slice(4), text: b.toString('utf8') };
    } catch (e) { codes.push('ERR ' + e.message.slice(0, 80)); await ngu(1500); }
  }
  return null;
}
const text = h => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const log = [];
const DELAY = +(process.env.DELAY || 8000);
// Lan theo chuoi link: moi bai co link sang cac bai "Dien bien lai suat" khac (thang truoc).
const seen = new Set(), queue = [BASE + '/vi/w/' + SLUG + '8/2026'];
const RE_LINK = /href="((?:https:\/\/sbv\.gov\.vn)?\/(?:vi\/)?w\/di%E1%BB%85n-bi%E1%BA%BFn-l%C3%A3i-su%E1%BA%A5t[^"#?]*)"/gi;
const MAX = +(process.env.MAX || 400);
let n0 = 0;
while (queue.length && n0++ < MAX) {
  const url = queue.shift(); const k0 = decodeURIComponent(url).replace(/^https:\/\/sbv\.gov\.vn/, '').replace(/^\/vi/, '');
  if (seen.has(k0) || /\/-\/categories\//.test(k0)) continue; seen.add(k0);
  const got = await tai(url.startsWith('http') ? url : BASE + url);
  await ngu(DELAY);
  if (!got || !/<title>[^<]*Diễn biến lãi suất[^<]*<\/title>/i.test(got.text)) { log.push(`LOI ${k0}`); continue; }
  for (const m of got.text.matchAll(RE_LINK)) {
    const l = m[1].replace(/^https:\/\/sbv\.gov\.vn/, '');
    const k = decodeURIComponent(l).replace(/^\/vi/, '');
    if (!seen.has(k) && !/\/-\/categories\//.test(k)) queue.push(l);
  }
  const tt = (got.text.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  const mt = tt.match(/tháng\s*(\d{1,2})\s*[\/.-]\s*(\d{4})/i) || tt.match(/(\d{1,2})\s*[\/.-]\s*(\d{4})/);
  const key = mt ? `${mt[2]}-${String(+mt[1]).padStart(2, '0')}` : 'x' + n0;
  const pdfs = [...new Set([...got.text.matchAll(/(\/documents\/[^"'\s>]+?\.pdf[^"'\s>]*)/gi)].map(x => x[1].replace(/&amp;/g, '&')))];
  const t = text(got.text);
  const i = t.search(/Diễn biến lãi suất của tổ chức tín dụng/i);
  fs.writeFileSync(`${OUT}/${key}.txt`, tt + '\n' + t.slice(Math.max(0, i), i + 6000));
  let n = 0;
  for (const p of pdfs) {
    const b = await tai(BASE + p, true); await ngu(DELAY / 2); if (!b) continue;
    const f = `${OUT}/${key}${n ? '-' + n : ''}.pdf`; fs.writeFileSync(f, b); n++;
    try { execFileSync('pdftotext', ['-layout', f, f + '.txt']); } catch (e) { log.push(`${key} pdftotext loi ${e.message}`); }
  }
  log.push(`${key} OK pdf=${n} ${k0}`);
  console.log(log.at(-1));
}
fs.writeFileSync(`${OUT}/log.txt`, log.join('\n'));
fs.writeFileSync(`${OUT}/http.txt`, codes.join('\n'));
console.log(log.join('\n'));
