// Do sut gia ngan han tung ma (dchart VNDirect, gia dieu chinh). Chi doc.
const MA = 'POW MSB MSN CMG KDH SHS MBB FPT MWG VSC ORS NLG VIB F88 VNINDEX'.split(' ');
const to = Math.floor(Date.now() / 1000), from = to - 3 * 366 * 86400;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const d = s => new Date(s * 1000).toISOString().slice(0, 10);
for (const m of MA) {
  let j;
  try { j = await (await fetch(`https://dchart-api.vndirect.com.vn/dchart/history?resolution=D&symbol=${m}&from=${from}&to=${to}`, { headers: { 'User-Agent': UA, Origin: 'https://khoanguyeninvest.vn', Referer: 'https://khoanguyeninvest.vn/' } })).json(); }
  catch (e) { console.log(m, 'LOI', e.message); continue; }
  const c = j.c || [], v = j.v || [], t = j.t || [];
  if (c.length < 30) { console.log(m, 'it du lieu', c.length); continue; }
  const r = c.map((x, i) => i ? x / c[i - 1] - 1 : 0);
  const worst = k => { let w = 0, at = 0; for (let i = k; i < c.length; i++) { const x = c[i] / c[i - k] - 1; if (x < w) { w = x; at = i; } } return [(w * 100).toFixed(1), d(t[at])]; };
  const dem = (k, th) => { let n = 0; for (let i = k; i < c.length; i++) if (c[i] / c[i - k] - 1 <= th) { n++; i += k - 1; } return n; };
  // phien san (giam >= 6.5% HOSE; ma HNX/UPCoM bien do lon hon nen dem chung nguong -6.5%)
  let san = 0, chuoi = 0, maxChuoi = 0, klSan = [], kl20 = [];
  for (let i = 1; i < c.length; i++) {
    const a = v.slice(Math.max(0, i - 20), i); const tb = a.reduce((s, x) => s + x, 0) / (a.length || 1);
    if (r[i] <= -0.065) { san++; chuoi++; maxChuoi = Math.max(maxChuoi, chuoi); if (tb > 0) klSan.push(v[i] / tb); } else chuoi = 0;
  }
  const sd = Math.sqrt(r.slice(-250).reduce((s, x) => s + x * x, 0) / Math.min(250, r.length)) * 100;
  const kl = klSan.sort((a, b) => a - b); const med = kl.length ? kl[Math.floor(kl.length / 2)].toFixed(2) : '-'; const minKl = kl.length ? kl[0].toFixed(2) : '-';
  const val20 = v.slice(-20).reduce((s, x, i) => s + x * c[c.length - 20 + i], 0) / 20 * 1000 / 1e9;
  console.log(JSON.stringify({ m, tu: d(t[0]), n: c.length, gia: c.at(-1), val20_ty: +val20.toFixed(1), bienDongNgay: +sd.toFixed(2), te1: worst(1), te3: worst(3), te5: worst(5), te10: worst(10), lan3ngay_sut17: dem(3, -0.167), lan5ngay_sut17: dem(5, -0.167), lan10ngay_sut17: dem(10, -0.167), phienSan: san, chuoiSanDaiNhat: maxChuoi, klPhienSan_soTB20_trungvi: med, klPhienSan_thapNhat: minKl }));
}
