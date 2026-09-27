// Lay so lai suat thang moi nhat cua NHNN ("Dien bien lai suat cua TCTD doi voi khach hang thang M/YYYY").
// NHNN dang ~ngay 17-18 thang sau, kem PDF. Chay tren runner GitHub (may task bi chan sbv.gov.vn).
// Chi 3 luot goi (trang chu -> bai -> PDF) vi NHNN chan ~5 luot/IP. Ghi/cap nhat $FILE (mac dinh sbv-thang.json).
// Khong bao gio ghi so khi doc PDF khong ra du cac muc (tien gui 6-12 thang + cho vay).
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const FILE = process.env.FILE || 'sbv-thang.json';
const BASE = 'https://sbv.gov.vn';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const ngu = ms => new Promise(r => setTimeout(r, ms));
function tai(url, f = '/tmp/_ls.bin') {
  const code = execFileSync('curl', ['-s', '--compressed', '-L', '-m', '40', '-c', '/tmp/_ls.jar', '-b', '/tmp/_ls.jar', '-o', f, '-w', '%{http_code}',
    '-H', 'User-Agent: ' + UA, '-H', 'Accept-Language: vi-VN,vi;q=0.9', url]).toString();
  if (code !== '200') throw new Error(`HTTP ${code} ${url.slice(0, 120)}`);
  return fs.readFileSync(f);
}
const so = x => +x.replace(',', '.');
const R = String.raw`(\d+(?:,\d+)?)\s*[-–]\s*(\d+(?:,\d+)?)\s*%`;
export function docPdf(t) {
  t = t.replace(/\s+/g, ' ');
  const o = {}, dep = t.split('Lãi suất USD')[0];
  for (const m of dep.matchAll(new RegExp(R + String.raw`/năm,? (?:đối với|cho) (?:tiền gửi )?(?:có )?(kỳ hạn(?:(?!%| và \d)[^;])*|tiền gửi không kỳ hạn(?:(?!%| và \d)[^;])*)`, 'g'))) {
    const [a, b, lab] = [so(m[1]), so(m[2]), m[3]];
    const k = /trên 24/.test(lab) ? 'd24' : /trên 12/.test(lab) ? 'd12_24' : /6 tháng đến (dưới )?12/.test(lab) ? 'd6_12'
      : /1 tháng đến dưới 6/.test(lab) ? 'd1_6' : /không kỳ hạn|dưới 1 tháng/.test(lab) ? 'kkh' : null;
    if (k) o[k] = [a, b];
  }
  if (!o.d24) { const m1 = dep.match(/(\d+(?:,\d+)?)\s*%\/năm đối với (?:tiền gửi có )?kỳ hạn trên 24 tháng/); if (m1) o.d24 = [so(m1[1]), so(m1[1])]; }
  const m0 = dep.match(new RegExp(R + '/năm đối với tiền gửi không kỳ hạn')); if (m0) o.kkh = [so(m0[1]), so(m0[2])];
  const cv = t.includes('Lãi suất cho vay') ? t.slice(t.indexOf('Lãi suất cho vay')) : '';
  const mv = cv.match(new RegExp(String.raw`cho vay (?:mới và cũ còn dư nợ|bình quân)[^%]*?ở mức ` + R)); if (mv) o.vay = [so(mv[1]), so(mv[2])];
  const mu = cv.match(/ưu tiên khoảng (\d+(?:,\d+)?)\s*%/); if (mu) o.uutien = so(mu[1]);
  const mt = t.match(/THÁNG\s+(\d{1,2})\s*\/\s*(\d{4})/i); if (mt) o.thang = `${mt[2]}-${mt[1].padStart(2, '0')}`;
  return o;
}
if (process.argv[1] && process.argv[1].endsWith('lai-suat-thang.mjs') && !process.env.CHI_THU) {
  const db = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : { nguon: 'NHNN — Diễn biến lãi suất của TCTD đối với khách hàng (PDF hằng tháng)', thang: {} };
  const home = tai(BASE + '/').toString('utf8'); await ngu(4000);
  const l = (home.match(/href="((?:https:\/\/sbv\.gov\.vn)?\/(?:vi\/)?w\/di%E1%BB%85n-bi%E1%BA%BFn-l%C3%A3i-su%E1%BA%A5t[^"#?]*)"/i) || [])[1];
  if (!l) { console.log('Trang chu NHNN khong co link "Dien bien lai suat" — khong doi gi'); process.exit(0); }
  const km = decodeURIComponent(l).match(/tháng-(\d{1,2})\/(\d{4})/);
  const key = km ? `${km[2]}-${km[1].padStart(2, '0')}` : null;
  if (key && db.thang[key]) { console.log('Da co', key, '— khong doi gi'); process.exit(0); }
  const bai = tai(l.startsWith('http') ? l : BASE + l).toString('utf8'); await ngu(4000);
  const p = (bai.match(/(\/documents\/[^"'\s>]+?\.pdf[^"'\s>]*)/i) || [])[1];
  if (!p) throw new Error('Bai khong co PDF: ' + l);
  tai(BASE + p.replace(/&amp;/g, '&'), '/tmp/_ls.pdf');
  execFileSync('pdftotext', ['-layout', '/tmp/_ls.pdf', '/tmp/_ls.txt']);
  const o = docPdf(fs.readFileSync('/tmp/_ls.txt', 'utf8'));
  const k = o.thang || key;
  if (!k || !o.d6_12 || !o.vay) throw new Error('Doc PDF khong ra du so: ' + JSON.stringify(o));
  delete o.thang; o.pdf = BASE + p.replace(/&amp;/g, '&'); o.lay = new Date().toISOString().slice(0, 10);
  db.thang[k] = o; db.capNhat = o.lay;
  db.thang = Object.fromEntries(Object.entries(db.thang).sort());
  fs.writeFileSync(FILE, JSON.stringify(db, null, 1));
  console.log('THEM', k, JSON.stringify(o));
}
