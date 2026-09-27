// Tim bai bao (CafeF) trich so lieu lai suat binh quan cua NHNN, 2019 -> nay. Chay tren runner GitHub.
// Ket qua: $OUT/bao/bai.jsonl — moi dong {url, tieuDe, ngay, cau: [cac cau co "bình quân" + "%"]}. Chi doc, khong dung du lieu web.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT || '/tmp/out') + '/bao';
fs.mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const ngu = ms => new Promise(r => setTimeout(r, ms));
function tai(url) {
  for (let k = 0; k < 3; k++) {
    try {
      const out = execFileSync('curl', ['-s', '--compressed', '-L', '-m', '30', '-o', '/tmp/_bao.html', '-w', '%{http_code}',
        '-H', 'User-Agent: ' + UA, '-H', 'Accept-Language: vi-VN,vi;q=0.9', url]).toString();
      if (out === '200') return fs.readFileSync('/tmp/_bao.html', 'utf8');
      if (out === '404') return null;
    } catch (e) {}
    execFileSync('sleep', ['2']);
  }
  return null;
}
const TU_KHOA = (process.env.TU_KHOA || 'lãi suất cho vay bình quân|diễn biến lãi suất của tổ chức tín dụng|lãi suất huy động bình quân|lãi suất cho vay bình quân của các khoản vay mới|lãi suất bình quân liên ngân hàng|Ngân hàng Nhà nước lãi suất cho vay bình quân giảm|lãi suất cho vay bình quân tăng').split('|');
const TRANG = +(process.env.TRANG || 40);
const bai = new Map();
for (const q of TU_KHOA) {
  let rong = 0;
  for (let p = 1; p <= TRANG && rong < 2; p++) {
    const u = p === 1 ? `https://cafef.vn/tim-kiem.chn?keywords=${encodeURIComponent(q)}` : `https://cafef.vn/tim-kiem/trang-${p}.chn?keywords=${encodeURIComponent(q)}`;
    const h = tai(u); await ngu(700);
    if (!h) { rong++; continue; }
    const links = [...h.matchAll(/href="(\/[a-z0-9-]+-(\d{18})\.chn)"[^>]*?(?:title="([^"]*)")?/g)];
    let moi = 0;
    for (const [, l, id, t] of links) {
      if (!/binh-quan|dien-bien-lai-suat|lai-suat/.test(l)) continue;
      if (/lai-suat-ngan-hang-[a-z]+-(moi-nhat|cuoi|thang|hom-nay)/.test(l)) continue; // bai lai suat tung ngan hang
      if (!bai.has(l)) { bai.set(l, { url: 'https://cafef.vn' + l, id, tieuDe: t || '' }); moi++; }
    }
    rong = moi ? 0 : rong + 1;
    console.log(q, 'trang', p, 'moi', moi, 'tong', bai.size);
  }
}
const ds = [...bai.values()];
fs.writeFileSync(`${OUT}/ds.json`, JSON.stringify(ds));
const ra = fs.createWriteStream(`${OUT}/bai.jsonl`);
let n = 0;
for (const b of ds) {
  const h = tai(b.url); await ngu(600); if (!h) continue;
  const ngay = (h.match(/article:published_time"\s+content="([^"]+)"/) || h.match(/"datePublished"\s*:\s*"([^"]+)"/) || [])[1] || '';
  const tieuDe = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || b.tieuDe;
  const body = h.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (x, c) => String.fromCharCode(+c)).replace(/\s+/g, ' ');
  const cau = body.split(/(?<=[.;])\s+/).filter(c => /bình quân/i.test(c) && /\d[,.]?\d*\s*%/.test(c) && c.length < 900);
  if (cau.length) { ra.write(JSON.stringify({ url: b.url, tieuDe: tieuDe.replace(/<[^>]+>/g, '').trim(), ngay, cau }) + '\n'); n++; }
}
ra.end();
console.log('bai co so lieu:', n, '/', ds.length);
