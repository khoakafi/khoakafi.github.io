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
  for (let k = 0; ; k++) {
    const code = execFileSync('curl', ['-s', '--compressed', '-L', '-m', '40', '-c', '/tmp/_ls.jar', '-b', '/tmp/_ls.jar', '-o', f, '-w', '%{http_code}',
      '-H', 'User-Agent: ' + UA, '-H', 'Accept-Language: vi-VN,vi;q=0.9', url]).toString();
    if (code === '200') return fs.readFileSync(f);
    // NHNN chan ~5 luot/IP (403) -> doi 70 s thu lai, toi da 2 lan
    if (code === '403' && k < 2) { execFileSync('sleep', ['70']); continue; }
    throw new Error(`HTTP ${code} ${url.slice(0, 120)}`);
  }
}
// 22/10/2026: link bai tieng Viet khong deu (nhieu thang 404 du dung mau) -> thu them ban tieng Anh, link deu:
// /en/w/developments-of-interest-rates-applied-by-credit-institutions-<thang>-<nam>-  (kem cung PDF)
const EN = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const DELAY = +(process.env.DELAY || 6000);
const linkVn = (y, m) => '/w/' + encodeURIComponent(`diễn-biến-lãi-suất-của-tổ-chức-tín-dụng-đối-với-khách-hàng-tháng-${m}`) + '/' + y;
// co thang co dau '-' cuoi (november-2025-), co thang khong (july-2026)
const linkEn = (y, m) => [`/en/w/developments-of-interest-rates-applied-by-credit-institutions-${EN[m - 1]}-${y}-`, `/en/w/developments-of-interest-rates-applied-by-credit-institutions-${EN[m - 1]}-${y}`];
async function timBai(y, m) {
  for (const l of [linkVn(y, m), ...linkEn(y, m)]) {
    let h = null;
    try { h = tai(BASE + l, '/tmp/_ls_thu.html').toString('utf8'); } catch (e) { if (!/HTTP 404/.test(e.message)) throw e; }
    await ngu(DELAY);
    if (h && /Diễn biến lãi suất của tổ chức tín dụng|interest rates applied by credit institutions/i.test(h)) return { l, bai: h };
  }
  return null;
}
const so = x => +x.replace(',', '.');
const R = String.raw`(\d+(?:,\d+)?)\s*[-–]\s*(\d+(?:,\d+)?)\s*%`;
// PDF ban tieng Anh ("Developments of interest rates applied by credit institutions <Month> YYYY")
export function docPdfEn(t) {
  t = t.replace(/\s+/g, ' ');
  const o = {}, n = String.raw`(\d+(?:\.\d+)?)\s*%?`, dep = t.split(/interest rates? in USD/i)[0];
  for (const m of dep.matchAll(new RegExp(n + String.raw`(?:\s*[-–]\s*` + n + String.raw`)?\s*(?:p\.a\.\s*)?for ([^;%]*?terms)`, 'gi'))) {
    const a = +m[1], b = m[2] != null ? +m[2] : a, lab = m[3];
    const k = /24-month plus|over 24|above 24/i.test(lab) ? 'd24' : /12-month( plus)? to (below )?24/i.test(lab) ? 'd12_24' : /6-month to (below )?12/i.test(lab) ? 'd6_12'
      : /1-month to below 6/i.test(lab) ? 'd1_6' : /demand|below 1-month/i.test(lab) ? 'kkh' : null;
    if (k && !o[k]) o[k] = [a, b];
  }
  const cv = t.slice(t.search(/Lending interest rates/i) + 1);
  const mv = cv.match(new RegExp(String.raw`average lending interest rates were between ` + n + String.raw`\s*[-–]\s*` + n, 'i')); if (mv) o.vay = [+mv[1], +mv[2]];
  const mu = cv.match(/priority sectors and areas was (\d+(?:\.\d+)?)\s*%/i); if (mu) o.uutien = +mu[1];
  const mt = t.match(/credit institutions\s*\(?\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
  if (mt) o.thang = `${mt[2]}-${String(EN.indexOf(mt[1].toLowerCase()) + 1).padStart(2, '0')}`;
  return o;
}
export function docPdf(t) {
  if (/Developments of interest rates/i.test(t) && !/Lãi suất/.test(t)) return docPdfEn(t);
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
// Doc PDF cua bai, tra { key, o } — nem loi neu khong du so (khong bao gio ghi so thieu)
async function layPdf(bai, l, key) {
  const p = (bai.match(/(\/documents\/[^"'\s>]+?\.pdf[^"'\s>]*)/i) || [])[1];
  if (!p) throw new Error('Bai khong co PDF: ' + l);
  tai(BASE + p.replace(/&amp;/g, '&'), '/tmp/_ls.pdf'); await ngu(DELAY);
  execFileSync('pdftotext', ['-layout', '/tmp/_ls.pdf', '/tmp/_ls.txt']);
  const t = fs.readFileSync('/tmp/_ls.txt', 'utf8');
  if (process.env.IN_PDF) console.log('--- PDF', key, p, '\n' + t.slice(0, +process.env.IN_PDF));
  const o = docPdf(t);
  if (key && o.thang && o.thang !== key) throw new Error(`PDF ghi thang ${o.thang}, can ${key}: ${p}`);
  const k = o.thang || key;
  if (!k || !o.d6_12 || !o.vay) throw new Error('Doc PDF khong ra du so: ' + JSON.stringify(o));
  delete o.thang; o.pdf = BASE + p.replace(/&amp;/g, '&'); o.lay = new Date().toISOString().slice(0, 10);
  return { k, o };
}
if (process.argv[1] && process.argv[1].endsWith('lai-suat-thang.mjs') && !process.env.CHI_THU) {
  const db = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : { nguon: 'NHNN — Diễn biến lãi suất của TCTD đối với khách hàng (PDF hằng tháng)', thang: {} };
  const ghi = (k, o) => {
    db.thang[k] = o; db.capNhat = o.lay;
    db.thang = Object.fromEntries(Object.entries(db.thang).sort());
    fs.writeFileSync(FILE, JSON.stringify(db, null, 1));
    console.log('THEM', k, JSON.stringify(o));
  };
  const DS = (process.env.THANG || '').split(/[ ,]+/).filter(Boolean);
  if (DS.length) {
    // Chay bu tung thang (THANG="2025-06,2025-08"): loi thang nao bo thang do, khong ghi so thieu
    for (const key of DS) {
      const [y, m] = key.split('-').map(Number);
      try {
        const r = await timBai(y, m);
        if (!r) { console.log(key, 'khong tim thay bai (VN + EN deu 404)'); continue; }
        const { k, o } = await layPdf(r.bai, r.l, key); ghi(k, o);
      } catch (e) { console.log(key, 'LOI', e.message); }
    }
    process.exit(0);
  }
  const home = tai(BASE + '/').toString('utf8'); await ngu(4000);
  let l = (home.match(/href="((?:https:\/\/sbv\.gov\.vn)?\/(?:vi\/)?w\/di%E1%BB%85n-bi%E1%BA%BFn-l%C3%A3i-su%E1%BA%A5t[^"#?]*)"/i) || [])[1];
  let bai = null, key = null;
  if (l) {
    const km = decodeURIComponent(l).match(/tháng-(\d{1,2})\/(\d{4})/);
    key = km ? `${km[2]}-${km[1].padStart(2, '0')}` : null;
    if (key && db.thang[key]) { console.log('Da co', key, '— khong doi gi'); process.exit(0); }
    bai = tai(l.startsWith('http') ? l : BASE + l).toString('utf8'); await ngu(DELAY);
  } else {
    // Bai thuong khong len trang chu -> thu thang KE TIEP thang cuoi trong db (link VN, roi EN). Khong thay = NHNN chua dang.
    const cuoi = Object.keys(db.thang).sort().pop() || '2026-08';
    let [y, m] = cuoi.split('-').map(Number); m++; if (m > 12) { m = 1; y++; }
    key = `${y}-${String(m).padStart(2, '0')}`;
    let r = await timBai(y, m);
    // Qua han (da sang thang M+2 tu ngay 25) ma van khong thay -> co the NHNN bo/doi link thang do: thu luon thang sau de khong ket mai
    const nay = new Date(Date.now() + 7 * 3600e3), han = new Date(Date.UTC(y, m + 1, 25));
    if (!r && nay >= han) {
      console.log(`Thang ${m}/${y} qua han ma khong tim thay bai — thu thang sau`);
      m++; if (m > 12) { m = 1; y++; } key = `${y}-${String(m).padStart(2, '0')}`; r = await timBai(y, m);
    }
    if (!r) { console.log('Trang chu khong co link; bai thang', `${m}/${y}`, 'chua co (VN + EN deu 404) — khong doi gi'); process.exit(0); }
    ({ l, bai } = r);
  }
  const { k, o } = await layPdf(bai, l, key);
  ghi(k, o);
}
