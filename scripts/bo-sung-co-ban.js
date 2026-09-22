// Luoi an toan: dien co ban (VNDirect) vao dashboard_data.js khi file phat hanh dang thieu.
// Chay tren GitHub Actions (.github/workflows/bo-sung-co-ban.yml) — VNDirect finfo mo cho runner (dchart thi khong).
// Khong thieu thi khong dong vao file (exit 0, khong commit). Chi dung du lieu that; khong bao gio ghi so gia.
const fs = require('fs'), vm = require('vm');
const FILE = 'dashboard_data.js';
(async () => {
  const src = fs.readFileSync(FILE, 'utf8');
  const ctx = { window: {} }; vm.runInNewContext(src, ctx);
  const S = ctx.window.SUMMARY;
  if (!S || !S.rows || !S.rows.length) { console.log('khong doc duoc SUMMARY'); process.exit(1); }
  const g = { fetch: globalThis.fetch }; vm.runInNewContext(fs.readFileSync('coban_vnd.js', 'utf8'), { globalThis: g, window: undefined, setTimeout });
  const thieu = g.knCoBanThieu(S.rows);
  console.log('ma:', S.rows.length, '| thieu co ban:', thieu, '| updated:', S.updated, '| coBan:', S.coBan || '-');
  if (thieu < S.rows.length * 0.2) { console.log('du roi, khong sua'); return; }
  const kq = await g.knBoSungCoBan(S.rows, { lo: 40, onTien: (a, b) => console.log('  ', a + '/' + b) });
  console.log('dien:', kq.dien, '/', kq.can, kq.hong.length ? '| hong: ' + kq.hong.join(' ; ') : '');
  if (kq.dien < thieu * 0.5) { console.log('dien duoc qua it, khong ghi'); process.exit(1); }
  S.coBan = 'vndirect ' + new Date().toISOString().slice(0, 10) + ' (github)' + (kq.hong.length ? ' (hỏng ' + kq.hong.length + ' lô)' : '');
  fs.writeFileSync(FILE, 'window.SUMMARY=' + JSON.stringify(S) + ';');
  console.log('da ghi', FILE);
})().catch(e => { console.error(e); process.exit(1); });
