/* ===== Phan tich co ban chuyen sau (15/10/2026) =====
   Khoi nam ngay duoi "Tai chinh — 12 quy gan nhat" o tab Chi tiet ma (web + app).
   Nguon: VNDirect finfo financial_statements — BCTC NAM (5 nam) + QUY (4 quy gan nhat), cung nguon du phong cua knFfQuy.
   Cham diem theo NGUONG CO DINH (rule-based), tinh tu BCTC + bang gia. Khong phai mo hinh hoc may.
   Ket luan MUA CO/KHONG (16/10/2026): quy tac co dinh da kiem dinh lich su o kafi-core research/co-ban — xem khoi "KET LUAN" ben duoi.
   Ma chi tieu (do 15/10/2026 tren runner bang do-api2, FPT + VCB):
     CDKT: 11000 TSNH, 11100 tien, 11200 DTTC ngan han, 11300 phai thu NH, 11400 HTK, 12700 tong TS, 13000 no phai tra,
           13100 no NH, 13110 vay NH, 13340 vay DH, 14000 VCSH (GOM co dong thieu so), 14110 von gop, 14240 CD thieu so
     KQKD: 21001 DT thuan, 22100 gia von, 23100 LN gop, 22510 chi phi lai vay, 23110 LN thuan HDKD, 23800 LNTT,
           23003 LNST, 23000 LNST cong ty me, 23001 EPS, 23300 LN lien ket, 22200 QLDN (ngan hang: chi phi hoat dong)
     LCTT: 32000 CFO, 32100 mua TSCD (so am), 33100 thu tu phat hanh CP, 33600 co tuc da tra (so am)
     Ngan hang: 421701 TOI, 421900 thu nhap lai thuan, 423200 lai thuan dich vu, 422900 chi phi du phong,
           88888 LN truoc du phong, 412100 cho vay KH, 412200 du phong cho vay (so am), 413300 tien gui KH
   LCTT theo quy o VN hay ghi LUY KE tu dau nam -> cot "4 quy gan nhat" khong tinh dong tien.
   Cache theo phien (kn_pt3_<ma>; kn_pt_, kn_pt2_ la ban cu, tu xoa), CHI ghi khi tai duoc >= 2 nam BCTC (khong bao gio ghi ket qua rong). */
(function(){
  'use strict';
  var MA = '11000,11100,11200,11300,11400,12700,13000,13100,13110,13340,14000,14110,14240,21001,22100,23100,22510,23110,23800,23003,23000,23001,21500,23300,32000,32100,33100,33600,421701,421900,423200,422900,88888,412100,412200,413300,22200';
  var DONG = ['21001','22100','23100','22510','23110','23800','23003','23000','23001','21500','23300','22200','421701','421900','423200','422900','88888'];
  var ptFor = null, ptCho = null, ptDaVe = null, ptCoRts = false;

  function so(v){ var n = +v; return (v == null || v === '' || !isFinite(n)) ? null : n; }
  function V(o, c){ return o && o.v && o.v[c] != null ? o.v[c] : null; }
  function chia(a, b){ return (a == null || b == null || b === 0) ? null : a / b; }
  function tb2(a, b){ return a == null ? null : (b == null ? a : (a + b) / 2); }
  function tang(a, b){ return (a == null || b == null || !(b > 0)) ? null : (a / b - 1) * 100; }
  function cagr(a, b, n){ return (a > 0 && b > 0 && n > 0) ? (Math.pow(a / b, 1 / n) - 1) * 100 : null; }
  function cong(){ var s = null; for (var i = 0; i < arguments.length; i++) if (arguments[i] != null) s = (s || 0) + arguments[i]; return s; }
  function trungVi(a){ var x = a.filter(function(v){ return v != null && isFinite(v); }).sort(function(p, q){ return p - q; });
    if (!x.length) return null; var m = x.length >> 1; return x.length % 2 ? x[m] : (x[m-1] + x[m]) / 2; }
  function trungBinh(a){ var x = a.filter(function(v){ return v != null && isFinite(v); }); return x.length ? x.reduce(function(s, v){ return s + v; }, 0) / x.length : null; }
  /* dashboard_app.js boc trong IIFE -> doc trang thai qua window.__knCt (xuat ngay sau loadDetail) */
  function K(){ return window.__knCt || null; }
  function hang(t){ var k = K(); return (k && k.byT[t]) || null; }
  function f(v, d){ return (K() && K().fmt) ? K().fmt(v, d) : (v == null ? '—' : (+v).toFixed(d)); }
  function mau(v){ return (K() && K().cls) ? K().cls(v) : ''; }
  function ty(v){ if (v == null) return '—'; var x = v / 1e9; return f(x, Math.abs(x) < 100 ? 1 : 0); }
  function ph(v, d){ return v == null ? '—' : f(v, d == null ? 1 : d) + '%'; }
  function lan(v){ return v == null ? '—' : f(v, 2); }
  function dau(v, d){ return v == null ? '—' : (v > 0 ? '+' : '') + f(v, d == null ? 1 : d) + '%'; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* ---------- Tai du lieu ---------- */
  function gom(arr){
    var m = {};
    (arr || []).forEach(function(x){
      var d = String(x.fiscalDate || '').slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
      var v = so(x.numericValue); if (v == null) return;
      var o = m[d] || (m[d] = { fd: d, y: +d.slice(0, 4), q: Math.ceil(+d.slice(5, 7) / 3), v: {} });
      var ic = String(Math.round(+x.itemCode)); if (o.v[ic] == null) o.v[ic] = v;
    });
    return Object.keys(m).sort().map(function(k){ return m[k]; });
  }
  /* Quy (dong 16/10/2026): them ~70 ma chi tiet de "soi" theo nganh — CTCK (moi gioi, margin, tu doanh, du phong),
     ngan hang (NII, phi, FX, du phong, cho vay/tien gui, vay NHNN), DN thuong (CPBH, QLDN, tai chinh, nguoi mua tra truoc,
     XDCB do dang). Loc fiscalDate = 10 cuoi quy gan nhat (API nhan danh sach) -> goi nho, khong keo ca lich su. */
  var SAU = '21001,22100,23100,22110,22200,21500,22500,22510,22509,23300,21900,22900,23900,23800,23003,23000,23001,12700,14000,14240,11000,13100,13110,13340,11100,11200,11300,11400,13130,13199,12460,'
    + '621110,700056,700044,700039,700046,700043,631243,610083,621160,610086,700053,700001,700072,700073,'
    + '421701,421900,423200,423300,423400,423500,421600,421700,88888,422900,412100,412200,413300,411400,412300,413100,413200';
  function cuoiQuy(n){
    var out = [], now = new Date(), y = now.getFullYear(), q = Math.ceil((now.getMonth() + 1) / 3) - 1;
    if (q < 1) { q = 4; y--; }
    for (var i = 0; i < n; i++) { out.push(new Date(Date.UTC(y, q * 3, 0)).toISOString().slice(0, 10)); q--; if (q < 1) { q = 4; y--; } }
    return out;
  }
  // Nhom so sanh: cung nganh (SEC_MAP), lay 30 ma von hoa lon nhat (CTCK: 45 vi nhieu ma "Dich vu tai chinh" khong phai CTCK)
  function dsPeer(t){
    var k = K(), sec = (k && k.SEC_MAP[t]) || ''; if (!sec) return null;
    var ck = /Dịch vụ tài chính/.test(sec), nh = sec === 'Ngân hàng';
    var rs = k.sum().rows.filter(function(r){ return k.SEC_MAP[r.t] === sec; }).sort(function(a, b){ return (b.cap || 0) - (a.cap || 0); });
    var ma = rs.slice(0, ck ? 45 : 30).map(function(r){ return r.t; }); if (ma.indexOf(t) < 0) ma.push(t);
    if (ma.length < 4) return null;
    return { sec: sec, ma: ma, items: nh ? '421701,412100,413300,23000' : (ck ? '621110,700001,21001,23000' : '21001,23100,23000') };
  }
  function gomPeer(arr){
    var m = {};
    (arr || []).forEach(function(x){
      var c = x.code, d = String(x.fiscalDate || '').slice(0, 10), v = so(x.numericValue); if (!c || v == null || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
      var a = m[c] || (m[c] = {}); var b = a[d] || (a[d] = {}); var ic = String(Math.round(+x.itemCode)); if (b[ic] == null) b[ic] = v;
    });
    return m;
  }
  async function ptTai(t){
    var ff = K().KN_FF + 'financial_statements?q=code:', fd = cuoiQuy(10).join(',');
    var uNam = ff + t + '~reportType:ANNUAL~itemCode:' + MA + '&sort=fiscalDate:desc&size=350';
    var uQuy = ff + t + '~reportType:QUARTER~itemCode:' + SAU + '~fiscalDate:' + fd + '&size=1000';
    var pr = dsPeer(t);
    var uPeer = pr ? ff + pr.ma.join(',') + '~reportType:QUARTER~itemCode:' + pr.items + '~fiscalDate:' + fd + '&size=' + (pr.ma.length * pr.items.split(',').length * 10 + 50) : null;
    var kq = await Promise.all([ K().jget(uNam), K().jget(uQuy).catch(function(){ return { data: [] }; }),
      uPeer ? K().jget(uPeer).catch(function(){ return null; }) : Promise.resolve(null),
      // Bao cao phan tich CTCK (Simplize, nhu tab CTCK KN): ngay, CTCK, khuyen nghi, gia muc tieu, tieu de, PDF
      K().jget('https://api2.simplize.vn/api/company/analysis-report/list?ticker=' + t + '&page=0&size=40&isWl=false').catch(function(){ return null; }),
      nmTai(t) ]);
    var nam = gom(kq[0] && kq[0].data);
    // Moi nam tai chinh mot dong (doi nien do -> giu ky moi nhat)
    var theoNam = {}; nam.forEach(function(o){ theoNam[o.y] = o; });
    nam = Object.keys(theoNam).sort().map(function(k){ return theoNam[k]; }).slice(-7);
    var peer = (pr && kq[2] && kq[2].data && kq[2].data.length) ? { sec: pr.sec, d: gomPeer(kq[2].data) } : null;
    var bc = (kq[3] && Array.isArray(kq[3].data)) ? kq[3].data.filter(function(x){ return x && x.issueDate; }).map(function(x){
      return { d: x.issueDate, s: x.source || '', r: x.recommend || '', tp: +x.targetPrice > 0 ? +x.targetPrice : null, ti: x.title || '', l: x.attachedLink || '' }; }) : null;
    return { nam: nam, quy: gom(kq[1] && kq[1].data).slice(-10), peer: peer, bc: bc, lsQ: kq[4].lsQ, gia: kq[4].gia };
  }
  // Lich su dai cho ket luan theo gia hom nay: BCTC quy ~15 nam (11 chi tieu, kem ngay nhap) + gia goc/dieu chinh cuoi moi thang 6 nam
  async function nmTai(t){
    var kq = await Promise.all([
      K().jget(K().KN_FF + 'financial_statements?q=code:' + t + '~reportType:QUARTER~itemCode:' + NM_MA + '&sort=fiscalDate:desc&size=1000').catch(function(){ return null; }),
      K().jget(K().KN_FF + 'stock_prices?sort=date&q=code:' + t + '~date:gte:' + new Date(Date.now() - 6.2 * 365 * 864e5).toISOString().slice(0, 10) + '&size=2000&fields=date,close,adClose').catch(function(){ return null; }) ]);
    // [ngay tai chinh, ma chi tieu, gia tri, ngay nhap] — gon de luu cache theo phien
    var lsQ = (kq[0] && Array.isArray(kq[0].data)) ? kq[0].data.map(function(x){ return [String(x.fiscalDate || '').slice(0, 10), Math.round(+x.itemCode), +x.numericValue, String(x.createdDate || '').slice(0, 10)]; }) : null;
    var gia = null;
    if (kq[1] && Array.isArray(kq[1].data) && kq[1].data.length) { var th = {};
      kq[1].data.forEach(function(x){ var d = String(x.date || '').slice(0, 10); if (+x.close > 0) th[d.slice(0, 7)] = [d.slice(0, 7), d, +x.close, +x.adClose || +x.close]; });
      gia = Object.keys(th).sort().map(function(k){ return th[k]; }); }
    return { lsQ: lsQ, gia: gia };
  }
  function ptLuu(t, khoa, raw){
    try {
      ['kn_pt_', 'kn_pt2_'].forEach(function(tr){ try { var cu = JSON.parse(localStorage.getItem(tr + '_ds') || 'null'); if (cu) { cu.forEach(function(x){ localStorage.removeItem(tr + x); }); localStorage.removeItem(tr + '_ds'); } } catch(e){} });
      var ds = []; try { ds = JSON.parse(localStorage.getItem('kn_pt3__ds') || '[]'); } catch(e){}
      ds = ds.filter(function(x){ return x !== t; }); ds.push(t);
      while (ds.length > 15) { try { localStorage.removeItem('kn_pt3_' + ds.shift()); } catch(e){} }
      try { localStorage.setItem('kn_pt3_' + t, JSON.stringify({ k: khoa, v: raw })); }
      catch(e){ ds.forEach(function(x){ try { localStorage.removeItem('kn_pt3_' + x); } catch(e2){} }); ds = []; }
      localStorage.setItem('kn_pt3__ds', JSON.stringify(ds));
    } catch(e){}
  }

  /* ---------- Tinh chi so ---------- */
  function chiSo(o, p, coDongTien){
    var c = { lb: o.lb || String(o.y), o: o };
    c.dt = V(o, '421701') || V(o, '21001');
    c.gv = V(o, '22100'); c.gp = V(o, '23100'); c.op = V(o, '23110'); c.pbt = V(o, '23800');
    c.np = V(o, '23003'); c.npm = V(o, '23000'); if (c.npm == null) c.npm = c.np;
    c.eps = V(o, '23001');
    c.ta = V(o, '12700'); c.eq = V(o, '14000'); c.nci = V(o, '14240') || 0;
    c.eqP = c.eq != null ? c.eq - c.nci : null;
    var pTa = V(p, '12700'), pEq = V(p, '14000'), pEqP = pEq != null ? pEq - (V(p, '14240') || 0) : null;
    c.gm = chia(c.gp, c.dt) != null ? chia(c.gp, c.dt) * 100 : null;
    c.opm = chia(c.op, c.dt) != null ? chia(c.op, c.dt) * 100 : null;
    c.nm = chia(c.np, c.dt) != null ? chia(c.np, c.dt) * 100 : null;
    c.roe = chia(c.npm, tb2(c.eqP, pEqP)); if (c.roe != null) c.roe *= 100;
    c.roa = chia(c.np, tb2(c.ta, pTa)); if (c.roa != null) c.roa *= 100;
    c.vq = chia(c.dt, tb2(c.ta, pTa));
    c.db = chia(tb2(c.ta, pTa), tb2(c.eq, pEq));
    c.roeT = chia(c.np, tb2(c.eq, pEq)); if (c.roeT != null) c.roeT *= 100;
    c.vay = cong(V(o, '13110'), V(o, '13340'));
    c.tien = cong(V(o, '11100'), V(o, '11200'));
    c.noRong = (c.vay != null || c.tien != null) ? (c.vay || 0) - (c.tien || 0) : null;
    c.ndE = chia(c.noRong, c.eq);
    c.ltdTa = chia(V(o, '13340') || 0, c.ta);
    c.hh = chia(V(o, '11000'), V(o, '13100'));
    var lv = V(o, '22510'); c.icr = (lv > 0 && c.pbt != null) ? (c.pbt + lv) / lv : null;
    c.dso = (V(o, '11300') != null && c.dt > 0) ? V(o, '11300') / c.dt * 365 : null;
    c.dio = (V(o, '11400') != null && c.gv > 0) ? V(o, '11400') / c.gv * 365 : null;
    c.lk = chia(V(o, '23300'), c.pbt);
    if (coDongTien) {
      c.cfo = V(o, '32000'); c.capex = V(o, '32100');
      c.fcf = c.cfo != null ? c.cfo + (c.capex || 0) : null;
      c.cfoNp = (c.cfo != null && c.np > 0) ? c.cfo / c.np : null;
      c.ctuc = V(o, '33600') != null ? -V(o, '33600') : null;
      c.phatHanh = V(o, '33100');
    }
    // Ngan hang
    c.nii = V(o, '421900'); c.niiTy = chia(c.nii, c.dt) != null ? chia(c.nii, c.dt) * 100 : null;
    c.dv = V(o, '423200');
    c.cir = (V(o, '421701') && V(o, '22200') != null) ? Math.abs(V(o, '22200')) / V(o, '421701') * 100 : null;
    c.ppop = V(o, '88888'); c.dp = V(o, '422900');
    c.loan = V(o, '412100'); c.dep = V(o, '413300');
    c.cc = (c.dp != null && tb2(c.loan, V(p, '412100'))) ? Math.abs(c.dp) / tb2(c.loan, V(p, '412100')) * 100 : null;
    c.llr = (V(o, '412200') != null && c.loan) ? Math.abs(V(o, '412200')) / c.loan * 100 : null;
    c.ldr = chia(c.loan, c.dep) != null ? chia(c.loan, c.dep) * 100 : null;
    c.eqTa = chia(c.eq, c.ta) != null ? chia(c.eq, c.ta) * 100 : null;
    c.gLoan = tang(c.loan, V(p, '412100')); c.gDep = tang(c.dep, V(p, '413300'));
    c.von = V(o, '14110');
    if (p) { c.gDt = tang(c.dt, V(p, '421701') || V(p, '21001')); var pn = V(p, '23000'); if (pn == null) pn = V(p, '23003'); c.gNp = tang(c.npm, pn); c.gEps = tang(c.eps, V(p, '23001')); }
    return c;
  }
  // 4 quy lien tiep gan nhat (ket thuc o quy `k` tinh tu cuoi) -> mot "nam" ao: dong cong don, can doi lay quy cuoi
  function bonQuy(Q, het){
    var ds = Q.slice(Math.max(0, het - 3), het + 1);
    if (ds.length < 4) return null;
    for (var i = 1; i < 4; i++) if ((ds[i].y * 4 + ds[i].q) - (ds[i-1].y * 4 + ds[i-1].q) !== 1) return null;
    if (ds.some(function(o){ return V(o, '23000') == null && V(o, '23003') == null; })) return null;
    var cuoi = ds[3], v = {};
    Object.keys(cuoi.v).forEach(function(k){ if (DONG.indexOf(k) < 0) v[k] = cuoi.v[k]; });
    // Chi cong khi du ca 4 quy (thieu 1 quy -> tong sai, vd EPS quy cua CTCK hay de 0)
    DONG.forEach(function(k){ var s = 0, d = 0; ds.forEach(function(o){ var x = V(o, k); if (x != null && !(k === '23001' && x === 0)) { s += x; d++; } }); if (d === 4) v[k] = s; });
    return { fd: cuoi.fd, y: cuoi.y, q: cuoi.q, v: v, lb: '4Q→Q' + cuoi.q + '/' + String(cuoi.y).slice(2) };
  }
  function ptTinh(raw, t){
    var N = raw.nam, Q = raw.quy;
    var nh = N.some(function(o){ return V(o, '421701'); });
    // CTCK, bao hiem cung co dong "LN gop" -> phan loai theo nganh, khong theo ma chi tieu
    var sec = (K() && t && K().SEC_MAP[t]) || '';
    var dn = !nh && !/Dịch vụ tài chính|Bảo hiểm/.test(sec) && N.some(function(o){ return V(o, '23100') != null && V(o, '21001'); });
    var loai = nh ? 'nh' : (dn ? 'dn' : 'khac');
    var cols = N.map(function(o, i){ return chiSo(o, i > 0 ? N[i-1] : null, true); });
    // Cot 4 quy gan nhat — chi khi moi hon nam tai chinh cuoi
    var ttm = null, last = N[N.length - 1];
    var bq = Q.length ? bonQuy(Q, Q.length - 1) : null;
    if (bq && (!last || bq.fd > last.fd)) {
      var bqTruoc = bonQuy(Q, Q.length - 5);
      var canDoiTruoc = Q.length >= 5 ? Q[Q.length - 5] : last;   // can doi cung ky nam truoc -> binh quan
      var o2 = { v: Object.assign({}, bq.v) };
      ['12700','14000','14240','412100','413300'].forEach(function(k){ if (canDoiTruoc && V(canDoiTruoc, k) != null) o2.v[k] = V(canDoiTruoc, k); else delete o2.v[k]; });
      ['421701','21001','23000','23003','23001'].forEach(function(k){ if (bqTruoc && V(bqTruoc, k) != null) o2.v[k] = V(bqTruoc, k); else delete o2.v[k]; });
      ttm = chiSo(bq, o2, false); ttm.ttm = true;
      if (!bqTruoc) { ttm.gDt = null; ttm.gNp = null; ttm.gEps = null; }
    }
    return { loai: loai, cols: cols, ttm: ttm };
  }

  /* ---------- Cham diem ---------- */
  function ptNganh(t){
    try {
      var k = K(); if (!k) return null;
      var M = k.SEC_MAP, sec = M[t] || '';
      if (!sec) return null;
      var rs = k.sum().rows.filter(function(r){ return M[r.t] === sec && r.t !== t; });   // trung vi KHONG gom chinh ma
      if (rs.length < 3) return { sec: sec, n: rs.length, rows: rs };
      // Can >= 3 ma co so moi tinh trung vi (ROE/ROA trong bang gia gan nhu trong tu 22/09 -> khong dung)
      var lay = function(k, lo, hi){ var x = rs.map(function(r){ var v = r[k]; return (v != null && (lo == null || v > lo) && (hi == null || v < hi)) ? v : null; }).filter(function(v){ return v != null; }); return x.length >= 3 ? trungVi(x) : null; };
      return { sec: sec, n: rs.length, rows: rs, pe: lay('pe', 0, 80), pb: lay('pb', 0, 20), roe: lay('roe'), npatYoY: lay('npatYoY', -100, 1000),
        revYoY: lay('revYoY', -100, 1000), cagr3: lay('cagr3', -100, 1000), dy: lay('dy') };
    } catch(e){ return null; }
  }
  function ptLichSuDinhGia(t){
    try {
      if (!K()) return null;
      var k = K().kho().get(t); if (!k || !k.rts || !k.rts.length) return null;
      var ls = k.rts.filter(function(x){ return x._av == null; });
      if (ls.length < 4) return null;
      return { pe: trungVi(ls.map(function(x){ return x.pe > 0 && x.pe < 200 ? x.pe : null; })),
               pb: trungVi(ls.map(function(x){ return x.pb > 0 ? x.pb : null; })), n: ls.length };
    } catch(e){ return null; }
  }
  function muc(m, ten, y){ return { m: m, ten: ten, y: y }; }
  function ptCham(t, d){
    var C = d.cols, n = C.length, L = C[n-1], P = C[n-2] || null, out = [];
    var r = hang(t) || {};
    // 1. Tang truong 3 nam
    var b3 = n >= 4 ? C[n-4] : null;
    var gN = b3 ? cagr(L.npm, b3.npm, 3) : null, gD = b3 ? cagr(L.dt, b3.dt, 3) : null;
    if (L.npm != null && L.npm <= 0) out.push(muc('yeu', 'Tăng trưởng', 'Năm ' + L.lb + ' lỗ ' + ty(L.npm) + ' tỷ.'));
    else if (gN == null) out.push(muc('na', 'Tăng trưởng', 'Chưa đủ 4 năm lợi nhuận dương để tính tăng trưởng 3 năm.'));
    else out.push(muc(gN >= 15 && (gD == null || gD >= 10) ? 'tot' : (gN < 0 ? 'yeu' : 'tb'), 'Tăng trưởng',
      'LNST mẹ ' + dau(gN) + '/năm, ' + (d.loai === 'nh' ? 'TOI ' : 'doanh thu ') + dau(gD) + '/năm (' + b3.lb + '→' + L.lb + ').'));
    // 2. Sinh loi
    var roe3 = trungBinh(C.slice(-3).map(function(c){ return c.roe; }));
    if (roe3 == null) out.push(muc('na', 'Sinh lời', 'Thiếu số vốn chủ để tính ROE.'));
    else out.push(muc(roe3 >= 15 ? 'tot' : (roe3 >= 10 ? 'tb' : 'yeu'), 'Sinh lời',
      'ROE bình quân 3 năm ' + ph(roe3) + ' (năm ' + L.lb + ': ' + ph(L.roe) + '), ROA ' + ph(L.roa) + '.'));
    // 3. Suc khoe tai chinh
    if (d.loai === 'nh') {
      var mH = L.eqTa == null ? 'na' : (L.eqTa >= 8 && (L.llr == null || L.llr >= 1.2) ? 'tot' : (L.eqTa < 6 ? 'yeu' : 'tb'));
      out.push(muc(mH, 'Sức khỏe tài chính', 'VCSH/Tổng tài sản ' + ph(L.eqTa) + ', dự phòng/dư nợ ' + ph(L.llr, 2) + ', cho vay/tiền gửi KH ' + ph(L.ldr, 0) + '.'));
    } else if (d.loai === 'dn') {
      var mS = L.ndE == null ? 'na' : ((L.ndE <= 0.3 && (L.icr == null || L.icr >= 5) && (L.hh == null || L.hh >= 1)) ? 'tot'
        : ((L.ndE > 1.5 || (L.icr != null && L.icr < 2) || (L.hh != null && L.hh < 0.8)) ? 'yeu' : 'tb'));
      var nr = L.noRong == null ? '' : (L.noRong < 0 ? 'Tiền ròng ' + ty(-L.noRong) + ' tỷ (tiền + đầu tư ngắn hạn > nợ vay)' : 'Nợ vay ròng/VCSH ' + lan(L.ndE) + ' lần');
      out.push(muc(mS, 'Sức khỏe tài chính', nr + (L.icr != null ? ', lợi nhuận gấp ' + f(L.icr, 1) + ' lần lãi vay' : ', gần như không vay') + (L.hh != null ? ', thanh toán hiện hành ' + lan(L.hh) : '') + '.'));
    } else {
      out.push(muc('na', 'Sức khỏe tài chính', 'VCSH/Tổng tài sản ' + ph(L.eqTa) + ' — mô hình CTCK/bảo hiểm, không chấm theo thang doanh nghiệp thường.'));
    }
    // 4. Chat luong loi nhuan / hieu qua van hanh
    if (d.loai === 'nh') {
      out.push(muc(L.cir == null ? 'na' : (L.cir <= 35 ? 'tot' : (L.cir <= 50 ? 'tb' : 'yeu')), 'Hiệu quả vận hành',
        'Chi phí/TOI (CIR) ' + ph(L.cir) + ', chi phí dự phòng/dư nợ bình quân ' + ph(L.cc, 2) + ', thu nhập lãi chiếm ' + ph(L.niiTy, 0) + ' TOI.'));
    } else if (d.loai === 'dn') {
      var s3 = C.slice(-3), sc = 0, sn = 0, du = true;
      s3.forEach(function(c){ if (c.cfo == null || c.np == null) du = false; else { sc += c.cfo; sn += c.np; } });
      var tl = du && sn > 0 ? sc / sn : null;
      out.push(muc(tl == null ? 'na' : (tl >= 0.8 ? 'tot' : (tl >= 0.3 ? 'tb' : 'yeu')), 'Chất lượng lợi nhuận',
        tl == null ? 'Thiếu số dòng tiền hoặc lợi nhuận âm.' : 'Dòng tiền kinh doanh 3 năm = ' + f(tl, 2) + ' lần LNST (' + ty(sc) + ' / ' + ty(sn) + ' tỷ).'));
    } else {
      out.push(muc('na', 'Chất lượng lợi nhuận', 'CTCK/bảo hiểm: dòng tiền kinh doanh gồm cả cho vay ký quỹ, mua bán tài sản tài chính — không dùng để chấm.'));
    }
    // 5. Dinh gia
    var ls = ptLichSuDinhGia(t), ng = ptNganh(t), dungPB = d.loai !== 'dn';
    var cur = dungPB ? r.pb : r.pe, mOwn = ls ? (dungPB ? ls.pb : ls.pe) : null, mSec = ng ? (dungPB ? ng.pb : ng.pe) : null, ten = dungPB ? 'P/B' : 'P/E';
    var mV;
    if (!(cur > 0)) mV = muc('na', 'Định giá', dungPB ? 'Chưa có P/B.' : 'LNST 4 quý âm hoặc chưa có P/E — không định giá bằng P/E.');
    else {
      var re = (mOwn && cur < mOwn * 0.9 && (mSec == null || cur < mSec)) ? 'tot' : ((mOwn && cur > mOwn * 1.15 && (mSec == null || cur > mSec * 1.15)) ? 'yeu' : 'tb');
      if (mOwn == null && mSec == null) re = 'na';
      mV = muc(re, 'Định giá', ten + ' ' + lan(cur) + (mOwn != null ? ' — trung vị ~4 năm của mã ' + lan(mOwn) : '') + (mSec != null ? ', trung vị ngành ' + lan(mSec) : '') + '.');
    }
    mV.dinhGia = true; out.push(mV);
    return out;
  }
  function ptFscore(C){
    var n = C.length; if (n < 3) return null;
    var L = C[n-1], P = C[n-2], ds = [];
    var add = function(ten, ok){ ds.push({ ten: ten, ok: ok }); };
    add('ROA dương', L.roa == null ? null : L.roa > 0);
    add('Dòng tiền kinh doanh dương', L.cfo == null ? null : L.cfo > 0);
    add('ROA tăng so với năm trước', (L.roa == null || P.roa == null) ? null : L.roa > P.roa);
    add('Dòng tiền KD lớn hơn LNST', (L.cfo == null || L.np == null) ? null : L.cfo > L.np);
    add('Tỷ lệ vay dài hạn/tài sản không tăng', (L.ltdTa == null || P.ltdTa == null) ? null : L.ltdTa <= P.ltdTa);
    add('Thanh toán hiện hành cải thiện', (L.hh == null || P.hh == null) ? null : L.hh > P.hh);
    add('Không phát hành thêm cổ phiếu lấy tiền', L.eq == null ? null : !((L.phatHanh || 0) > 0.02 * L.eq));
    add('Biên lợi nhuận gộp tăng', (L.gm == null || P.gm == null) ? null : L.gm > P.gm);
    add('Vòng quay tài sản tăng', (L.vq == null || P.vq == null) ? null : L.vq > P.vq);
    var co = ds.filter(function(x){ return x.ok != null; });
    return { d: co.filter(function(x){ return x.ok; }).length, n: co.length, ds: ds, nam: L.lb };
  }
  function ptCo(d){
    var C = d.cols, n = C.length, L = C[n-1], P = C[n-2] || {}, tot = [], xau = [];
    var dem = function(fn){ return C.filter(fn).length; };
    if (d.loai === 'dn') {
      var s3 = C.slice(-3);
      if (s3.filter(function(c){ return c.cfo != null && c.cfo < 0; }).length >= 2) xau.push('Dòng tiền kinh doanh âm ' + s3.filter(function(c){ return c.cfo < 0; }).length + '/3 năm gần nhất.');
      var gPt = tang(V(L.o, '11300'), V(P.o, '11300'));
      if (gPt != null && L.gDt != null && gPt - L.gDt > 20 && L.dso > 30) xau.push('Phải thu ngắn hạn tăng ' + dau(gPt, 0) + ' trong khi doanh thu ' + dau(L.gDt, 0) + ' (năm ' + L.lb + ').');
      var gHt = tang(V(L.o, '11400'), V(P.o, '11400')), gGv = tang(L.gv, P.gv);
      if (gHt != null && gGv != null && gHt - gGv > 25 && L.dio > 30) xau.push('Hàng tồn kho tăng ' + dau(gHt, 0) + ', nhanh hơn giá vốn (' + dau(gGv, 0) + ').');
      if (n >= 4 && C[n-1].gm < C[n-2].gm && C[n-2].gm < C[n-3].gm && C[n-3].gm < C[n-4].gm) xau.push('Biên lợi nhuận gộp giảm 3 năm liên tiếp (' + ph(C[n-4].gm) + ' → ' + ph(L.gm) + ').');
      if (L.icr != null && L.icr < 3) xau.push('Lợi nhuận chỉ gấp ' + f(L.icr, 1) + ' lần chi phí lãi vay.');
      if (L.ndE != null && L.ndE > 1.5) xau.push('Nợ vay ròng gấp ' + lan(L.ndE) + ' lần vốn chủ.');
      if (dem(function(c){ return c.fcf != null; }) >= 4 && dem(function(c){ return c.fcf > 0; }) >= dem(function(c){ return c.fcf != null; }) - 1) tot.push('Dòng tiền tự do dương ' + dem(function(c){ return c.fcf > 0; }) + '/' + dem(function(c){ return c.fcf != null; }) + ' năm.');
      if (L.noRong != null && L.noRong < 0) tot.push('Tiền ròng ' + ty(-L.noRong) + ' tỷ — không phụ thuộc vốn vay.');
    }
    if (d.loai === 'nh') {
      if (L.cc != null && L.cc > 1.5) xau.push('Chi phí dự phòng ' + ph(L.cc, 2) + ' dư nợ bình quân — cao.');
      if (L.cir != null && P.cir != null && L.cir - P.cir > 5) xau.push('CIR tăng ' + f(L.cir - P.cir, 1) + ' điểm % so với năm trước.');
      if (L.eqTa != null && L.eqTa < 7) xau.push('VCSH chỉ ' + ph(L.eqTa) + ' tổng tài sản — đệm vốn mỏng.');
      if (L.gLoan != null && L.gLoan >= 15) tot.push('Cho vay khách hàng tăng ' + dau(L.gLoan, 0) + ' năm ' + L.lb + ', tiền gửi ' + dau(L.gDep, 0) + '.');
      if (L.cir != null && L.cir <= 35) tot.push('Chi phí hoạt động chỉ ' + ph(L.cir) + ' TOI.');
    }
    if (L.npm != null && L.npm < 0) xau.push('Năm ' + L.lb + ' lỗ ' + ty(-L.npm) + ' tỷ (LNST mẹ).');
    if (L.lk != null && L.lk > 0.3) xau.push(f(L.lk * 100, 0) + '% lợi nhuận trước thuế đến từ công ty liên doanh, liên kết.');
    var gVon = tang(L.von, P.von); if (gVon != null && gVon > 15) xau.push('Vốn góp tăng ' + dau(gVon, 0) + ' năm ' + L.lb + ' (phát hành/cổ tức cổ phiếu — EPS bị pha loãng).');
    var cRoe = C.filter(function(c){ return c.roe != null; });
    if (cRoe.length >= 3 && cRoe.every(function(c){ return c.roe >= 15; })) tot.push('ROE ≥ 15% liên tục ' + cRoe.length + ' năm.');
    var tangLien = 0; for (var i = n - 1; i > 0; i--) { if (C[i].npm > 0 && C[i-1].npm > 0 && C[i].npm > C[i-1].npm) tangLien++; else break; }
    if (tangLien >= 3) tot.push('LNST mẹ tăng ' + tangLien + ' năm liên tiếp.');
    var ctuc = C.filter(function(c){ return c.ctuc > 0; }).length;
    if (ctuc >= 4 && ctuc === C.filter(function(c){ return c.ctuc != null; }).length) tot.push('Trả cổ tức tiền mặt đều ' + ctuc + '/' + ctuc + ' năm.');
    return { tot: tot, xau: xau };
  }

  /* ---------- Soi BCTC: insight theo nganh (16/10/2026) ----------
     Moi cau la mot phep so sanh tu so BCTC that: quy moi nhat vs cung ky, 4 quy vs 4 quy truoc, vs nhom niem yet cung nganh.
     Cau truc "cau loi nhuan" (LNTT ky nay - ky truoc = tong thay doi tung mang) khop toi tung ty voi VCB/HPG/VND (do 16/10).
     Khong doan nguyen nhan ngoai BCTC; thieu so thi bo cau do, khong dien. Ngan hang: nguon khong co no xau/CASA. */
  var SODU = ['12700','14000','14240','11000','13100','13110','13340','11100','11200','11300','11400','13130','13199','12460','700001','412100','412200','413300','411400','412300','413100','413200'];
  function kQ(o){ return o.y * 4 + o.q; }
  function mapQ(Q){ var m = {}; Q.forEach(function(o){ m[kQ(o)] = o; }); return m; }
  function lbQ(k){ var y = Math.floor((k - 1) / 4), q = k - y * 4; return 'Q' + q + '/' + String(y).slice(2); }
  function fdQ(k){ var y = Math.floor((k - 1) / 4), q = k - y * 4; return new Date(Date.UTC(y, q * 3, 0)).toISOString().slice(0, 10); }
  function g(c){ return function(o){ return V(o, c); }; }
  function am(c){ return function(o){ var x = V(o, c); return x == null ? null : -x; }; }
  function gop(){ var a = arguments; return function(o){ var s = null; for (var i = 0; i < a.length; i++){ var x = typeof a[i] === 'function' ? a[i](o) : V(o, a[i]); if (x != null) s = (s || 0) + x; } return s; }; }
  function oTong(m, k){
    var v = {};
    for (var i = 0; i < 4; i++) { var o = m[k - i]; if (!o || V(o, '23800') == null) return null; Object.keys(o.v).forEach(function(c){ v[c] = (v[c] || 0) + o.v[c]; }); }
    SODU.forEach(function(c){ if (m[k].v[c] != null) v[c] = m[k].v[c]; else delete v[c]; });
    return { v: v };
  }
  function tyD(v){ return v == null ? '—' : (v > 0 ? '+' : (v < 0 ? '−' : '')) + ty(Math.abs(v)); }
  function bien(a, b){                         // thay doi co dau ca khi ky truoc am
    if (a == null || b == null) return '—';
    if (b > 0) { var x = (a / b - 1) * 100; return dau(x, Math.abs(x) < 10 ? 1 : 0); }
    if (b < 0 && a > 0) return 'từ lỗ sang lãi';
    if (b < 0 && a < 0) return a > b ? 'lỗ ít hơn' : 'lỗ nhiều hơn';
    return '—';
  }
  function diem(a, b, d){ return (a == null || b == null) ? '—' : (a - b > 0 ? '+' : (a - b < 0 ? '−' : '')) + f(Math.abs(a - b), d == null ? 1 : d) + ' điểm %'; }
  function viTri(v, ds){ var x = ds.filter(function(z){ return z != null && isFinite(z); }); if (v == null || x.length < 5) return '';
    if (x.every(function(z){ return v >= z; })) return 'cao nhất ' + x.length + ' quý';
    if (x.every(function(z){ return v <= z; })) return 'thấp nhất ' + x.length + ' quý'; return ''; }
  var CAU = {
    dn: [['Lợi nhuận gộp', g('23100')], ['Chi phí bán hàng', am('22110')], ['Chi phí quản lý', am('22200')], ['Doanh thu tài chính', g('21500')],
         ['Chi phí tài chính', am('22500')], ['Liên doanh, liên kết', g('23300')], ['Thu nhập khác ròng', g('23900')]],
    ck: [['Môi giới (sau chi phí MG)', gop('621110', am('700056'))], ['Lãi cho vay margin', g('700044')], ['Tự doanh (lãi − lỗ FVTPL)', gop('700039', am('700046'))],
         ['Lãi đầu tư giữ đến đáo hạn', g('700043')], ['Tư vấn, bảo lãnh, lưu ký, khác', gop('631243', '610083', '621160', '610086')],
         ['Dự phòng (hoàn nhập +, trích −)', am('700053')], ['Chi phí lãi vay', am('22509')], ['Chi phí quản lý', am('22200')]],
    nh: [['Thu nhập lãi thuần', g('421900')], ['Dịch vụ', g('423200')], ['Ngoại hối', g('423300')], ['Chứng khoán', gop('423400', '423500')],
         ['Hoạt động khác', g('421600')], ['Góp vốn, mua cổ phần', g('421700')], ['Chi phí hoạt động', am('22200')], ['Chi phí dự phòng', am('422900')]]
  };
  function gon(x){ var s = x.ten.replace(/\s*\(.*\)\s*/, ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function cauLN(loai, A, B){
    if (!A || !B || !CAU[loai]) return null;
    var pa = V(A, '23800'), pb = V(B, '23800'); if (pa == null || pb == null) return null;
    var ds = CAU[loai].map(function(x){ var a = x[1](A), b = x[1](B); return { ten: x[0], a: a, b: b, d: (a == null && b == null) ? null : (a || 0) - (b || 0) }; })
      .filter(function(x){ return x.d != null && (x.a || x.b); });
    var con = (pa - pb) - ds.reduce(function(s, x){ return s + x.d; }, 0);
    if (Math.abs(con) > Math.max(Math.abs(pa), Math.abs(pb), 1) * 0.01) ds.push({ ten: 'Khoản khác', a: null, b: null, d: con });
    return { pa: pa, pb: pb, ds: ds };
  }
  /* Nhom cung nganh: quy "du" = so ma bao cao >= 80% so ma nhieu nhat (dau mua BCTC chi vai ma ra som -> khong tinh thi phan) */
  function peerQ(peer, item){
    if (!peer || !peer.d) return null;
    var dem = {}, maxN = 0;
    Object.keys(peer.d).forEach(function(c){ Object.keys(peer.d[c]).forEach(function(fd){ if (peer.d[c][fd][item] != null) dem[fd] = (dem[fd] || 0) + 1; }); });
    Object.keys(dem).forEach(function(fd){ if (dem[fd] > maxN) maxN = dem[fd]; });
    var du = Object.keys(dem).filter(function(fd){ return dem[fd] >= Math.max(3, maxN * 0.8); }).sort();
    return { du: du, dem: dem };
  }
  function giaTri(peer, c, fd, item){ var a = peer.d[c] && peer.d[c][fd]; return a && a[item] != null ? a[item] : null; }
  function ttmPeer(peer, c, k, item){ var s = 0; for (var i = 0; i < 4; i++){ var x = giaTri(peer, c, fdQ(k - i), item); if (x == null) return null; s += x; } return s; }
  // Thi phan cua t trong nhom tai quy k: kieu 'q' (gia tri quy / so du) hoac 'ttm' (cong 4 quy)
  function thiPhan(peer, t, k, item, kieu){
    var ds = [];
    Object.keys(peer.d).forEach(function(c){ var v = kieu === 'ttm' ? ttmPeer(peer, c, k, item) : giaTri(peer, c, fdQ(k), item); if (v != null && v > 0) ds.push({ c: c, v: v }); });
    var tong = ds.reduce(function(s, x){ return s + x.v; }, 0), me = ds.filter(function(x){ return x.c === t; })[0];
    if (!me || !tong || ds.length < 4) return null;
    ds.sort(function(a, b){ return b.v - a.v; });
    return { p: me.v / tong * 100, hang: ds.map(function(x){ return x.c; }).indexOf(t) + 1, n: ds.length, v: me.v, tong: tong, ds: ds };
  }
  function kDu(pq){ if (!pq || !pq.du.length) return null; var fd = pq.du[pq.du.length - 1]; return (+fd.slice(0, 4)) * 4 + Math.ceil(+fd.slice(5, 7) / 3); }

  function ptSoi(t, raw, loai0){
    var Q = raw.quy || []; if (Q.length < 5) return null;
    var m = mapQ(Q), ks = Object.keys(m).map(Number).sort(function(a, b){ return a - b; });
    var K = null; for (var i = ks.length - 1; i >= 0; i--) if (V(m[ks[i]], '23800') != null) { K = ks[i]; break; }
    if (K == null) return null;
    var ck = Q.some(function(o){ return V(o, '621110') != null || V(o, '700001') != null; });
    var loai = loai0 === 'nh' ? 'nh' : (ck ? 'ck' : (Q.some(function(o){ return V(o, '23100') != null; }) ? 'dn' : null));
    if (!loai) return null;
    var L = m[K], P = m[K - 4], T = oTong(m, K), T0 = oTong(m, K - 4), peer = raw.peer;
    var out = [], add = function(s, w, txt){ out.push({ s: s, w: w, t: txt }); };
    var lb = lbQ(K), lbP = lbQ(K - 4);
    // 1. Cau loi nhuan
    var cq = cauLN(loai, L, P), ct = cauLN(loai, T, T0);
    if (cq) {
      var dd = cq.pa - cq.pb, ds = cq.ds.slice().sort(function(a, b){ return Math.abs(b.d) - Math.abs(a.d); });
      var len = ds.filter(function(x){ return x.d > 0; }).slice(0, 2), xu = ds.filter(function(x){ return x.d < 0; }).slice(0, 2);
      var chinh = ds[0] && Math.sign(ds[0].d) === Math.sign(dd) && Math.abs(ds[0].d) >= Math.abs(dd) * 0.6 ? ds[0] : null;
      add(Math.sign(dd), 100, '<b>Lợi nhuận trước thuế ' + lb + ': ' + ty(cq.pa) + ' tỷ, ' + bien(cq.pa, cq.pb) + ' so với ' + lbP + ' (' + tyD(dd) + ' tỷ)'
        + (chinh ? ', chủ yếu ' + (chinh.d > 0 ? 'nhờ' : 'do') + ' <u>' + gon(chinh) + '</u> (' + tyD(chinh.d) + ' tỷ)' : '') + '.</b>'
        + (len.length ? ' Đẩy lên: ' + len.map(function(x){ return gon(x) + ' ' + tyD(x.d); }).join(', ') + '.' : '')
        + (xu.length ? ' Kéo xuống: ' + xu.map(function(x){ return gon(x) + ' ' + tyD(x.d); }).join(', ') + '.' : ''));
    }
    // Khoan khong deu (thu nhap khac NH, DT tai chinh/thu nhap khac DN) gop > 30% phan tang LNTT -> canh bao
    var batThuong = { nh: { 'Hoạt động khác': 'thu nhập hoạt động khác (chủ yếu thu hồi nợ đã xử lý, không đều theo quý)' },
                      dn: { 'Doanh thu tài chính': 'doanh thu tài chính', 'Thu nhập khác ròng': 'thu nhập khác' } }[loai] || {};
    [[cq, lb + ' so với ' + lbP, 0], [ct, '4 quý gần nhất', 1]].forEach(function(z){ var c = z[0]; if (!c) return; var dd2 = c.pa - c.pb; if (!(dd2 > 0)) return;
      c.ds.forEach(function(x){ if (!batThuong[x.ten] || !(x.d > dd2 * 0.3) || !(x.d > 0)) return;
        var dinh = null; if (z[2]) { for (var j = 0; j < 4; j++) { var oo = m[K - j], vv = CAU[loai].filter(function(c2){ return c2[0] === x.ten; })[0][1](oo); if (vv != null && (!dinh || vv > dinh.v)) dinh = { k: K - j, v: vv }; } }
        add(-1, 93 - z[2], f(x.d / dd2 * 100, 0) + '% phần tăng LNTT ' + z[1] + ' (' + tyD(x.d) + ' tỷ) đến từ ' + batThuong[x.ten] + (dinh ? ' — riêng ' + lbQ(dinh.k) + ' ' + ty(dinh.v) + ' tỷ' : '') + '. Cần xem có lặp lại không.'); }); });
    if (ct) add(Math.sign(ct.pa - ct.pb), 92, 'Cộng 4 quý đến ' + lb + ': LNTT ' + ty(ct.pa) + ' tỷ, ' + bien(ct.pa, ct.pb) + ' so với 4 quý trước đó'
      + (T && T0 ? '; LNST công ty mẹ ' + ty(V(T, '23000')) + ' tỷ (' + bien(V(T, '23000'), V(T0, '23000')) + ')' : '') + '.');

    if (loai === 'dn') {
      var dt = V(L, '21001'), dt0 = V(P, '21001');
      if (dt != null && T && T0) add(Math.sign(n(tang(V(T, '21001'), V(T0, '21001')))), 84, 'Doanh thu cộng 4 quý đến ' + lb + ' ' + ty(V(T, '21001')) + ' tỷ (' + bien(V(T, '21001'), V(T0, '21001')) + ' so với 4 quý trước).');
      var gmS = ks.map(function(k){ return chia(V(m[k], '23100'), V(m[k], '21001')); }).map(function(x){ return x == null ? null : x * 100; });
      var gm = chia(V(L, '23100'), dt), gm0 = chia(V(P, '23100'), dt0);
      if (gm != null && gm0 != null) { var vt = viTri(gm * 100, gmS);
        if (Math.abs(gm - gm0) * 100 >= 1 || vt) add(Math.sign(gm - gm0), 80, 'Biên lợi nhuận gộp ' + ph(gm * 100) + ' (' + diem(gm * 100, gm0 * 100) + ' so với cùng kỳ' + (vt ? ', ' + vt : '') + ').'); }
      var lk = V(L, '23300'), lk0 = V(P, '23300');
      if (dt0 > 0 && dt < dt0 * 0.9 && lk > 0 && lk > Math.max(lk0 || 0, 0) * 3 && lk > Math.abs(V(L, '23800') || 0) * 0.1)
        add(0, 87, 'Doanh thu giảm ' + bien(dt, dt0).replace('-', '') + ' trong khi lãi liên doanh, liên kết tăng từ ' + ty(lk0 || 0) + ' lên ' + ty(lk) + ' tỷ — dấu hiệu một công ty con có thể đã thôi hợp nhất (chuyển thành liên kết); so sánh cùng kỳ bị lệch cơ sở.');
      var sg = chia(gop('22110', '22200')(L), dt), sg0 = chia(gop('22110', '22200')(P), dt0);
      if (sg != null && sg0 != null && Math.abs(sg - sg0) * 100 >= 1) add(-Math.sign(sg - sg0), 60, 'Chi phí bán hàng + quản lý chiếm ' + ph(sg * 100) + ' doanh thu (cùng kỳ ' + ph(sg0 * 100) + ').');
      var lv = V(L, '22510') || V(L, '22509'), lv0 = V(P, '22510') || V(P, '22509'), xd = V(L, '12460'), xd0 = V(P, '12460');
      if (lv > 0 && lv0 > 0 && (lv / lv0 >= 1.5 || lv / lv0 <= 0.67) && lv > Math.abs(V(L, '23800') || 0) * 0.05) {
        var tx = 'Chi phí lãi vay ' + lb + ' ' + ty(lv) + ' tỷ, ' + (lv > lv0 ? 'gấp ' + f(lv / lv0, 1) + ' lần' : 'giảm ' + f((1 - lv / lv0) * 100, 0) + '% so với') + ' cùng kỳ (' + ty(lv0) + ' tỷ).';
        if (lv > lv0 && xd0 > 0 && xd != null && xd < xd0 * 0.6) tx += ' Cùng lúc xây dựng dở dang giảm từ ' + ty(xd0) + ' xuống ' + ty(xd) + ' tỷ — khớp với việc dự án đã đưa vào chạy: lãi vay thôi được vốn hóa, đi thẳng vào chi phí.';
        add(lv > lv0 ? -1 : 1, 70, tx);
      } else if (xd != null && xd0 != null && V(L, '12700') && Math.abs(xd - xd0) > V(L, '12700') * 0.02 && Math.abs(xd - xd0) > xd0 * 0.3)
        add(0, 45, 'Xây dựng cơ bản dở dang ' + ty(xd) + ' tỷ (cùng kỳ ' + ty(xd0) + ') — ' + (xd > xd0 ? 'đang dồn vốn đầu tư, chưa tạo ra doanh thu.' : 'phần lớn đã chuyển thành tài sản hoạt động.'));
      var vay = gop('13110', '13340'), tien = gop('11100', '11200');
      var nd = (vay(L) || 0) - (tien(L) || 0), nd0 = (vay(P) || 0) - (tien(P) || 0), eq = V(L, '14000');
      if (eq > 0 && P && Math.abs(nd - nd0) > eq * 0.1) add(nd > nd0 ? -1 : 1, 55, (nd >= 0 ? 'Nợ vay ròng ' + ty(nd) + ' tỷ' : 'Tiền ròng ' + ty(-nd) + ' tỷ') + ' cuối ' + lb + ' (cùng kỳ ' + (nd0 >= 0 ? 'nợ vay ròng ' + ty(nd0) : 'tiền ròng ' + ty(-nd0)) + ' tỷ)' + (nd > 0 ? ' = ' + lan(nd / eq) + ' lần vốn chủ' : '') + '.');
      var gv = T && T0 ? tang(V(T, '22100'), V(T0, '22100')) : null, ht = tang(V(L, '11400'), V(P, '11400'));
      if (ht != null && gv != null && ht - gv > 20 && V(L, '11400') > (V(L, '12700') || 0) * 0.08) add(-1, 65, 'Hàng tồn kho ' + ty(V(L, '11400')) + ' tỷ (' + dau(ht, 0) + ' YoY) tăng nhanh hơn giá vốn 4 quý (' + dau(gv, 0) + ').');
      var dtT = T && T0 ? tang(V(T, '21001'), V(T0, '21001')) : null, pt = tang(V(L, '11300'), V(P, '11300'));
      if (pt != null && dtT != null && pt - dtT > 25 && V(L, '11300') > (V(L, '12700') || 0) * 0.1) add(-1, 62, 'Phải thu ngắn hạn ' + ty(V(L, '11300')) + ' tỷ (' + dau(pt, 0) + ' YoY) trong khi doanh thu 4 quý ' + dau(dtT, 0) + ' — tiền chưa về theo doanh thu.');
      var tt = V(L, '13130'), tt0 = V(P, '13130'), dtt = T ? V(T, '21001') : null;
      if (tt != null && dtt > 0 && tt > dtt * 0.15) add(Math.sign(n(tang(tt, tt0))), 86, 'Người mua trả tiền trước ' + ty(tt) + ' tỷ (' + bien(tt, tt0) + ' YoY), bằng ' + f(tt / dtt, 1) + ' lần doanh thu 4 quý — tiền khách đã trả cho hàng/dự án chưa bàn giao, sẽ thành doanh thu các quý tới.');
      var cth = V(L, '13199'), cth0 = V(P, '13199');
      if (cth != null && dtt > 0 && cth > dtt * 0.05) add(Math.sign(n(tang(cth, cth0))), 50, 'Doanh thu chưa thực hiện ' + ty(cth) + ' tỷ (' + bien(cth, cth0) + ' YoY) — hợp đồng đã thu tiền, ghi nhận dần.');
      if (T && V(T, '23800') > 0) { var ngoai = (V(T, '21500') || 0) + (V(T, '23300') || 0) + (V(T, '23900') || 0), tl = ngoai / V(T, '23800');
        if (tl > 0.4) add(-1, 75, f(tl * 100, 0) + '% LNTT 4 quý đến từ doanh thu tài chính, liên doanh liên kết và thu nhập khác (' + ty(ngoai) + ' tỷ) — không phải từ bán hàng cốt lõi.'); }
      var pq = peerQ(peer, '21001'), kc = kDu(pq);
      if (kc) { var a = thiPhan(peer, t, kc, '21001', 'ttm'), b = thiPhan(peer, t, kc - 4, '21001', 'ttm');
        if (a) { add(b ? Math.sign(a.p - b.p) : 0, 84, 'Doanh thu 4 quý đến ' + lbQ(kc) + ' chiếm <b>' + ph(a.p) + '</b> tổng ' + a.n + ' doanh nghiệp niêm yết cùng ngành' + (b ? ' (cùng kỳ ' + ph(b.p) + ', ' + diem(a.p, b.p) + ')' : '') + ' — đứng thứ ' + a.hang + '/' + a.n + '.');
          var gs = a.ds.map(function(x){ return tang(x.v, ttmPeer(peer, x.c, kc - 4, '21001')); }), gMe = tang(a.v, ttmPeer(peer, t, kc - 4, '21001')), gMed = trungVi(gs);
          if (gMe != null && gMed != null) add(Math.sign(gMe - gMed), 58, 'Tăng trưởng doanh thu 4 quý ' + dau(gMe, 0) + ' so với trung vị ngành ' + dau(gMed, 0) + '.');
          var bg = a.ds.map(function(x){ var gp = ttmPeer(peer, x.c, kc, '23100'); return gp != null ? gp / x.v * 100 : null; }), me = ttmPeer(peer, t, kc, '23100');
          if (me != null && trungVi(bg) != null) add(Math.sign(me / a.v * 100 - trungVi(bg)), 52, 'Biên gộp 4 quý ' + ph(me / a.v * 100) + ' so với trung vị ngành ' + ph(trungVi(bg)) + '.');
          raw.__bangPeer = { ten: 'Doanh thu 4 quý', k: kc, a: a, b: b, item: '21001', kieu: 'ttm' };
        } }
    }

    if (loai === 'ck') {
      var mg = V(L, '621110'), mg0 = V(P, '621110'), pqm = peerQ(peer, '621110'), kcm = kDu(pqm);
      if (mg != null) { var tx2 = 'Doanh thu môi giới ' + lb + ' ' + ty(mg) + ' tỷ (' + bien(mg, mg0) + ' cùng kỳ)' + (T && T0 ? ', 4 quý ' + bien(V(T, '621110'), V(T0, '621110')) : '') + '.';
        var s2 = Math.sign(n(tang(mg, mg0)));
        if (kcm) { var a2 = thiPhan(peer, t, kcm, '621110', 'q'), b2 = thiPhan(peer, t, kcm - 4, '621110', 'q');
          if (a2) { tx2 += ' Thị phần doanh thu môi giới trong ' + a2.n + ' CTCK niêm yết: <b>' + ph(a2.p) + '</b> ' + lbQ(kcm) + (b2 ? ', cùng kỳ ' + ph(b2.p) + ' (' + diem(a2.p, b2.p) + ')' : '') + ' — đứng thứ ' + a2.hang + '.';
            if (b2) s2 = Math.sign(a2.p - b2.p); raw.__bangPeer = { ten: 'Doanh thu môi giới quý', k: kcm, a: a2, b: b2, item: '621110', kieu: 'q' }; } }
        add(s2, 96, tx2); }
      var mr = V(L, '700001'), mr0 = V(P, '700001'), pqr = peerQ(peer, '700001'), kcr = kDu(pqr);
      if (mr != null) { var tx3 = 'Dư nợ cho vay (margin) ' + ty(mr) + ' tỷ (' + bien(mr, mr0) + ' YoY)' + (V(L, '14000') ? ', bằng ' + lan(mr / V(L, '14000')) + ' lần vốn chủ' : '') + '.';
        var s3 = Math.sign(n(tang(mr, mr0)));
        if (kcr) { var a3 = thiPhan(peer, t, kcr, '700001', 'q'), b3 = thiPhan(peer, t, kcr - 4, '700001', 'q');
          if (a3) { var gN = b3 ? tang(a3.tong, b3.tong) : null; tx3 += ' Thị phần margin ' + ph(a3.p) + ' ' + lbQ(kcr) + (b3 ? ' (cùng kỳ ' + ph(b3.p) + ')' : '') + (gN != null ? '; cả nhóm ' + dau(gN, 0) + ' YoY' : '') + '.'; if (b3) s3 = Math.sign(a3.p - b3.p); } }
        add(s3, 90, tx3); }
      var td = gop('700039', am('700046'))(L), td0 = gop('700039', am('700046'))(P);
      if (td != null) add(Math.sign(td - (td0 || 0)), 72, 'Tự doanh (lãi − lỗ tài sản FVTPL) ' + tyD(td) + ' tỷ ' + lb + ' (cùng kỳ ' + tyD(td0) + ' tỷ)' + (V(L, '23800') > 0 ? ', bằng ' + f(td / V(L, '23800') * 100, 0) + '% LNTT' : '') + '.');
      var cth2 = V(L, '700073'), pbt = V(L, '23800');
      if (cth2 != null && pbt > 0 && cth2 / pbt > 0.2) add(-1, 74, f(cth2 / pbt * 100, 0) + '% LNTT ' + lb + ' (' + ty(cth2) + ' tỷ) là lãi <u>chưa thực hiện</u> — đánh giá lại danh mục, thị trường giảm là mất.');
      var dp = V(L, '700053');
      if (dp != null && pbt > 0 && Math.abs(dp) > pbt * 0.1) add(-1, 94, (dp < 0 ? '<b>Hoàn nhập dự phòng ' + ty(-dp) + ' tỷ = ' + f(-dp / pbt * 100, 0) + '% LNTT ' + lb + '</b> — khoản một lần, không lặp lại đều như doanh thu' : 'Trích dự phòng ' + ty(dp) + ' tỷ = ' + f(dp / pbt * 100, 0) + '% LNTT') + (V(P, '700053') != null ? ' (cùng kỳ ' + (V(P, '700053') < 0 ? 'hoàn nhập ' + ty(-V(P, '700053')) : 'trích ' + ty(V(P, '700053'))) + ' tỷ)' : '') + '.');
      var dtk = V(L, '21001'), dtk0 = V(P, '21001');
      if (dtk > 0 && dtk0 > 0 && mg != null && mg0 != null) {
        var co = [['môi giới', '621110'], ['lãi margin', '700044'], ['lãi FVTPL', '700039']].map(function(x){ return x[0] + ' ' + ph(V(L, x[1]) / dtk * 100, 0) + ' (cùng kỳ ' + ph(V(P, x[1]) / dtk0 * 100, 0) + ')'; });
        add(0, 50, 'Cơ cấu doanh thu ' + lb + ': ' + co.join(', ') + '.');
      }
      var lvm = V(L, '22509'), lm = V(L, '700044');
      if (lvm > 0 && lm > 0) add(lm > lvm ? 1 : -1, 40, 'Lãi cho vay margin ' + ty(lm) + ' tỷ so với chi phí lãi vay ' + ty(lvm) + ' tỷ (' + f(lm / lvm, 2) + ' lần).');
    }

    if (loai === 'nh') {
      var ln = V(L, '412100'), ln0 = V(P, '412100'), lnD = m[Math.floor((K - 1) / 4) * 4] ? V(m[Math.floor((K - 1) / 4) * 4], '412100') : null;
      var pqn = peerQ(peer, '412100'), kcn = kDu(pqn), tx4 = 'Cho vay khách hàng ' + ty(ln) + ' tỷ: ' + (lnD ? dau(tang(ln, lnD), 1) + ' từ đầu năm, ' : '') + bien(ln, ln0) + ' YoY';
      if (kcn) { var a4 = thiPhan(peer, t, kcn, '412100', 'q'), b4 = thiPhan(peer, t, kcn - 4, '412100', 'q');
        if (a4) { var gs4 = trungVi(a4.ds.map(function(x){ return tang(x.v, giaTri(peer, x.c, fdQ(kcn - 4), '412100')); }));
          tx4 += (gs4 != null ? ' (trung vị ' + a4.n + ' ngân hàng niêm yết ' + dau(gs4, 0) + ')' : '') + '. Thị phần tín dụng trong nhóm <b>' + ph(a4.p) + '</b>' + (b4 ? ', cùng kỳ ' + ph(b4.p) + ' (' + diem(a4.p, b4.p, 2) + ')' : '') + ' — đứng thứ ' + a4.hang;
          raw.__bangPeer = { ten: 'Cho vay khách hàng', k: kcn, a: a4, b: b4, item: '412100', kieu: 'q' }; } }
      if (ln != null) add(Math.sign(n(tang(ln, ln0))), 90, tx4 + '.');
      var dep = V(L, '413300'), dep0 = V(P, '413300');
      if (dep && dep0 && ln0) add(Math.sign(n(tang(dep, dep0)) - n(tang(ln, ln0))), 74, 'Tiền gửi khách hàng ' + bien(dep, dep0) + ' YoY ' + (tang(dep, dep0) < tang(ln, ln0) ? 'chậm hơn' : 'nhanh hơn') + ' cho vay → cho vay/tiền gửi ' + ph(ln / dep * 100, 0) + ' (cùng kỳ ' + ph(ln0 / dep0 * 100, 0) + ').');
      var nn = V(L, '413100'), nn0 = V(P, '413100'), ta = V(L, '12700');
      if (nn > 0 && nn0 > 0 && nn / nn0 > 1.5 && ta && nn > ta * 0.03) add(-1, 68, 'Nợ Chính phủ & NHNN ' + ty(nn) + ' tỷ, gấp ' + f(nn / nn0, 1) + ' lần cùng kỳ — nguồn vốn ngoài tiền gửi dân cư tăng mạnh.');
      var ea = function(o){ return gop('412100', '411400', '412300')(o); };
      var nim = (T && ea(L) && m[K - 4] && ea(m[K - 4])) ? V(T, '421900') / ((ea(L) + ea(m[K - 4])) / 2) * 100 : null;
      var nim0 = (T0 && m[K - 4] && m[K - 8] && ea(m[K - 4]) && ea(m[K - 8])) ? V(T0, '421900') / ((ea(m[K - 4]) + ea(m[K - 8])) / 2) * 100 : null;
      if (nim != null) add(nim0 != null ? Math.sign(nim - nim0) : 0, 86, 'Biên lãi thuần ước tính (thu nhập lãi thuần 4 quý ÷ cho vay + tiền gửi liên ngân hàng + chứng khoán đầu tư bình quân) <b>' + ph(nim, 2) + '</b>' + (nim0 != null ? ' (cùng kỳ ' + ph(nim0, 2) + ', ' + diem(nim, nim0, 2) + ')' : '') + '.');
      var toi = V(L, '421701'), toi0 = V(P, '421701');
      if (toi && toi0 && V(L, '421900') != null) { var ng1 = (1 - V(L, '421900') / toi) * 100, ng0 = (1 - V(P, '421900') / toi0) * 100;
        add(0, 55, 'Thu nhập ngoài lãi chiếm ' + ph(ng1, 0) + ' TOI (cùng kỳ ' + ph(ng0, 0) + '); phí dịch vụ ' + bien(V(L, '423200'), V(P, '423200')) + ', ngoại hối ' + bien(V(L, '423300'), V(P, '423300')) + ' YoY.'); }
      if (toi && toi0 && V(L, '22200') != null && V(P, '22200') != null) { var ci = V(L, '22200') / toi * 100, ci0 = V(P, '22200') / toi0 * 100;
        if (Math.abs(ci - ci0) >= 2) add(-Math.sign(ci - ci0), 58, 'Chi phí hoạt động/TOI (CIR) ' + ph(ci, 0) + ' (cùng kỳ ' + ph(ci0, 0) + ').'); }
      var dpr = V(L, '412200'), dpr0 = V(P, '412200');
      if (dpr != null && dpr0 != null && ln && ln0) { var b1 = Math.abs(dpr) / ln * 100, b0 = Math.abs(dpr0) / ln0 * 100;
        add(Math.sign(b1 - b0), 82, 'Quỹ dự phòng/dư nợ ' + ph(b1, 2) + ' (cùng kỳ ' + ph(b0, 2) + ')' + (b1 < b0 - 0.2 ? ' — bộ đệm mỏng đi, lợi nhuận đang được hỗ trợ bởi trích dự phòng ít hơn' : '') + '.'); }
      if (T && T0 && ln && ln0 && m[K - 4]) { var cc = V(T, '422900') / ((ln + V(m[K - 4], '412100')) / 2) * 100, cc0 = (m[K - 8] && V(m[K - 8], '412100')) ? V(T0, '422900') / ((ln0 + V(m[K - 8], '412100')) / 2) * 100 : null;
        if (isFinite(cc)) add(cc0 != null ? -Math.sign(cc - cc0) : 0, 64, 'Chi phí dự phòng 4 quý = ' + ph(cc, 2) + ' dư nợ bình quân' + (cc0 != null ? ' (cùng kỳ ' + ph(cc0, 2) + ')' : '') + '.'); }
    }
    out.sort(function(a, b){ return b.w - a.w; });
    // Cho ket luan: tang truong LNTT 4 quy "loi" (bo phan thay doi cua khoan khong deu), co do, thi phan
    var KD = { dn: ['Doanh thu tài chính', 'Thu nhập khác ròng'], nh: ['Hoạt động khác'], ck: ['Dự phòng (hoàn nhập +, trích −)'] }[loai];
    var loi = null;
    if (ct && ct.pb > 0) { var bt = ct.ds.filter(function(x){ return KD.indexOf(x.ten) >= 0; }).reduce(function(s2, x){ return s2 + x.d; }, 0);
      loi = { g: ((ct.pa - ct.pb) - bt) / ct.pb * 100, gTho: (ct.pa / ct.pb - 1) * 100, bt: bt }; }
    var gq = cq && cq.pb > 0 ? (cq.pa / cq.pb - 1) * 100 : (cq && cq.pb < 0 && cq.pa > 0 ? 100 : null);
    var co2 = {};
    if (loai === 'ck') { var pb2 = V(L, '23800'); if (pb2 > 0) { co2.hoanNhap = V(L, '700053') < 0 ? -V(L, '700053') / pb2 * 100 : 0; co2.chuaTH = V(L, '700073') != null ? V(L, '700073') / pb2 * 100 : null; } }
    var bp = raw.__bangPeer, tp = (bp && bp.a && bp.b) ? { ten: bp.ten, a: bp.a.p, b: bp.b.p, k: bp.k } : null;
    return { loai: loai, K: K, lb: lb, lbP: lbP, ds: out, cq: cq, ct: ct, m: m, loi: loi, gq: gq, co: co2, tp: tp };
  }
  function n(x){ return x == null ? 0 : x; }

  /* Bang quy chi tiet theo nganh — 8 quy gan nhat */
  function bangQuy(s, raw, t){
    var m = s.m, K = s.K, ks = []; for (var k = K - 7; k <= K; k++) if (m[k]) ks.push(k);
    var peer = raw.peer, share = function(item){ return function(o, k){ var pq = peerQ(peer, item); if (!pq || pq.du.indexOf(fdQ(k)) < 0) return null; var a = thiPhan(peer, t, k, item, 'q'); return a ? a.p : null; }; };
    var R;
    if (s.loai === 'ck') R = [
      ['Doanh thu môi giới', g('621110'), ty], ['Lãi cho vay margin', g('700044'), ty], ['Tự doanh ròng (lãi − lỗ FVTPL)', gop('700039', am('700046')), ty],
      ['Lãi đầu tư giữ đến đáo hạn', g('700043'), ty], ['Dự phòng (+ trích, − hoàn nhập)', g('700053'), ty], ['Chi phí lãi vay', g('22509'), ty],
      ['Lợi nhuận trước thuế', g('23800'), ty], ['  trong đó chưa thực hiện', g('700073'), ty], ['Dư nợ margin', g('700001'), ty],
      ['Thị phần DT môi giới (%)', share('621110'), function(v){ return ph(v, 2); }], ['Thị phần margin (%)', share('700001'), function(v){ return ph(v, 2); }], ['Vốn chủ sở hữu', g('14000'), ty]];
    else if (s.loai === 'nh') R = [
      ['Tổng thu nhập hoạt động', g('421701'), ty], ['Thu nhập lãi thuần', g('421900'), ty], ['Dịch vụ', g('423200'), ty], ['Ngoại hối', g('423300'), ty],
      ['Chi phí hoạt động', g('22200'), ty], ['Chi phí dự phòng', g('422900'), ty], ['Lợi nhuận trước thuế', g('23800'), ty],
      ['Cho vay khách hàng', g('412100'), ty], ['Tiền gửi khách hàng', g('413300'), ty],
      ['Cho vay/tiền gửi (%)', function(o){ return chia(V(o, '412100'), V(o, '413300')) == null ? null : V(o, '412100') / V(o, '413300') * 100; }, function(v){ return ph(v, 0); }],
      ['Quỹ dự phòng/dư nợ (%)', function(o){ return (V(o, '412200') != null && V(o, '412100')) ? Math.abs(V(o, '412200')) / V(o, '412100') * 100 : null; }, function(v){ return ph(v, 2); }],
      ['Nợ Chính phủ & NHNN', g('413100'), ty], ['Thị phần tín dụng (%)', share('412100'), function(v){ return ph(v, 2); }]];
    else R = [
      ['Doanh thu thuần', g('21001'), ty], ['Lợi nhuận gộp', g('23100'), ty],
      ['Biên gộp (%)', function(o){ return chia(V(o, '23100'), V(o, '21001')) == null ? null : V(o, '23100') / V(o, '21001') * 100; }, ph],
      ['CP bán hàng + quản lý/DT (%)', function(o){ var x = gop('22110', '22200')(o); return (x != null && V(o, '21001')) ? x / V(o, '21001') * 100 : null; }, ph],
      ['Doanh thu tài chính', g('21500'), ty], ['Chi phí lãi vay', function(o){ return V(o, '22510') != null ? V(o, '22510') : V(o, '22509'); }, ty],
      ['Lợi nhuận trước thuế', g('23800'), ty], ['LNST công ty mẹ', g('23000'), ty],
      ['Hàng tồn kho', g('11400'), ty], ['Phải thu ngắn hạn', g('11300'), ty], ['Người mua trả tiền trước', g('13130'), ty],
      ['Xây dựng dở dang', g('12460'), ty], ['Nợ vay', gop('13110', '13340'), ty]];
    var h = '<tr><th></th>' + ks.map(function(k){ return '<th>' + lbQ(k) + '</th>'; }).join('') + '</tr>';
    R.forEach(function(r){ var vs = ks.map(function(k){ return r[1](m[k], k); }); if (!vs.some(function(v){ return v != null && v !== 0; })) return;
      h += '<tr><td>' + r[0] + '</td>' + vs.map(function(v){ return '<td>' + r[2](v) + '</td>'; }).join('') + '</tr>'; });
    return '<table class="ptt">' + h + '</table>';
  }
  function bangPeer(t, bp){
    if (!bp || !bp.a) return '';
    var a = bp.a, cu = {}; if (bp.b) bp.b.ds.forEach(function(x){ cu[x.c] = x.v / bp.b.tong * 100; });
    var ds = a.ds.slice(0, 8); if (ds.map(function(x){ return x.c; }).indexOf(t) < 0) ds.push(a.ds[a.hang - 1]);
    var h = '<tr><th>Mã</th><th>' + esc(bp.ten) + ' (tỷ)</th><th>Thị phần</th><th>so cùng kỳ</th></tr>';
    ds.forEach(function(x){ var p = x.v / a.tong * 100, p0 = cu[x.c];
      h += '<tr' + (x.c === t ? ' class="me"' : '') + '><td><span class="pl" data-t="' + esc(x.c) + '">' + esc(x.c) + '</span></td><td>' + ty(x.v) + '</td><td>' + ph(p, 1) + '</td><td class="' + mau(p0 == null ? null : p - p0) + '">' + (p0 == null ? '—' : diem(p, p0).replace(' điểm %', '')) + '</td></tr>'; });
    return '<div class="ptb"><h4>Thị phần trong nhóm niêm yết cùng ngành · ' + lbQ(bp.k) + (bp.kieu === 'ttm' ? ' (4 quý)' : '') + '</h4><table class="ptn ptpeer">' + h + '</table>'
      + '<div class="mini" style="margin-top:6px">' + a.n + ' mã có số liệu; thị phần tính trong nhóm này, không phải toàn thị trường.</div></div>';
  }
  function bangCau(cq, ten){
    if (!cq) return '';
    var mx = Math.max.apply(null, cq.ds.map(function(x){ return Math.abs(x.d); }).concat([1]));
    var h = cq.ds.slice().sort(function(a, b){ return Math.abs(b.d) - Math.abs(a.d); }).map(function(x){
      var w = Math.round(Math.abs(x.d) / mx * 100);
      return '<tr><td>' + x.ten + '</td><td class="' + mau(x.d) + '" style="white-space:nowrap">' + tyD(x.d) + '</td><td style="width:42%"><div class="bar ' + (x.d >= 0 ? 'up' : 'dn') + '" style="width:' + w + '%"></div></td></tr>'; }).join('');
    return '<div class="ptb"><h4>' + ten + '</h4><div class="mini" style="margin-bottom:6px">LNTT ' + ty(cq.pb) + ' → <b>' + ty(cq.pa) + '</b> tỷ (' + tyD(cq.pa - cq.pb) + ')</div><table class="ptn ptcau">' + h + '</table></div>';
  }
  /* ---------- Tang truong 2 quy gan nhat + DIEM SANG / DIEM TOI (16/10/2026, anh Khoa: "key tang truong") ----------
     Rule-based tu BCTC quy (raw.quy): moi quy so voi cung ky nam truoc (YoY) cho 2 quy gan nhat; QoQ chi de tham khao.
     Nhan tang truong de MO TA. Kiem dinh (kafi-core ba-muc.mjs): LN khong giam 2 quy lien mot minh chi hon thi truong +1,1%/6 thang
     (2021– ~0) — loi the chi ro khi tang truong di cung gia hop ly (muc TICH CUC). */
  function npQuy(o){ return o ? (V(o, '23000') != null ? V(o, '23000') : V(o, '23003')) : null; }
  function dtQuy(loai, o){ return o ? (loai === 'nh' ? V(o, '421701') : V(o, '21001')) : null; }
  // LN cot loi: DN = LN gop − ban hang − quan ly; NH = LN truoc du phong; CTCK = moi gioi rong + margin + dao han − lai vay − quan ly
  function loiQuy(loai, o){
    if (!o) return null;
    if (loai === 'dn') { var gp = V(o, '23100'); return gp == null ? null : gp - (V(o, '22110') || 0) - (V(o, '22200') || 0); }
    if (loai === 'nh') return V(o, '88888');
    if (loai === 'ck') return V(o, '621110') == null ? null : gop('621110', am('700056'), '700044', '700043', am('22509'), am('22200'))(o);
    return null;
  }
  var TEN_LOI = { dn: 'LN cốt lõi (LN gộp − chi phí bán hàng, quản lý)', nh: 'LN trước dự phòng', ck: 'LN mảng cốt lõi (môi giới ròng + margin + đáo hạn − lãi vay − quản lý)' };
  function yoy(a, b){ return (a != null && b != null && b > 0) ? (a / b - 1) * 100 : null; }
  // chu so sanh 1 quy: "+12%", "chuyen lai 50 ty (cung ky lo 20)", "lo 30 ty (cung ky lai 40)"...
  function soCk(a, b){
    if (a == null || b == null) return '—';
    if (b > 0) return a >= 0 ? dau((a / b - 1) * 100, 0) : 'lỗ ' + ty(-a) + ' tỷ (cùng kỳ lãi ' + ty(b) + ')';
    if (a > 0) return 'lãi ' + ty(a) + ' tỷ (cùng kỳ lỗ ' + ty(-b) + ')';
    return 'lỗ ' + ty(-a) + ' tỷ (cùng kỳ lỗ ' + ty(-b) + ')';
  }
  function tangTruong(s){
    if (!s || !s.m) return null;
    var m = s.m, K = s.K, loai = s.loai;
    var q = [K - 1, K].filter(function(k){ return m[k]; }).map(function(k){
      var o = m[k], c = m[k - 4], np = npQuy(o), np0 = npQuy(c), rv = dtQuy(loai, o), rv0 = dtQuy(loai, c), lc = loiQuy(loai, o), lc0 = loiQuy(loai, c);
      return { k: k, lb: lbQ(k), np: np, np0: np0, gNP: yoy(np, np0), h: (np != null && np0 != null) ? (np >= np0 ? 1 : -1) : null,
        rv: rv, rv0: rv0, gRv: yoy(rv, rv0), lc: lc, lc0: lc0, gLc: yoy(lc, lc0), pbt: V(o, '23800'), pbt0: c ? V(c, '23800') : null,
        gm: loai === 'dn' ? chia(V(o, '23100'), rv) : null, gm0: loai === 'dn' ? chia(V(c, '23100'), rv0) : null, gp: V(o, '23100'), gp0: c ? V(c, '23100') : null,
        lk: V(o, '23300'), lk0: c ? V(c, '23300') : null,
        dp: loai === 'nh' ? V(o, '422900') : null, dp0: (loai === 'nh' && c) ? V(c, '422900') : null,
        td: loai === 'ck' ? gop('700039', am('700046'))(o) : null, td0: (loai === 'ck' && c) ? gop('700039', am('700046'))(c) : null };
    });
    if (!q.length) return null;
    var A = q[q.length - 1], B = q.length > 1 ? q[0] : null;   // A = quy gan nhat, B = quy truoc do
    var sap = A.h === -1 && (A.gNP == null || A.gNP <= -30);
    var nhan, mau;
    if (A.h == null) { nhan = 'CHƯA ĐỦ SỐ'; mau = 'kq'; }
    else if (sap) { nhan = 'LỢI NHUẬN SỤT MẠNH'; mau = 'tcu'; }
    else if (A.h === -1 && B && B.h === -1) { nhan = 'SUY GIẢM'; mau = 'tcu'; }
    else if (A.h === 1 && B && B.h === 1) { nhan = (A.gNP != null && A.gNP >= 20 && B.gNP != null && B.gNP >= 20 && !(A.gRv != null && A.gRv < 0)) ? 'TĂNG TRƯỞNG MẠNH' : 'ĐANG TĂNG TRƯỞNG'; mau = 'tc'; }
    else { nhan = 'CHỮNG LẠI'; mau = 'kq'; }
    var nhip = (A.h === 1 && A.gNP != null && B && B.gNP != null) ? (A.gNP - B.gNP >= 10 ? 'tăng tốc' : (A.gNP - B.gNP <= -10 ? 'chậm lại' : '')) : '';
    // diem sang / toi bo sung tu goc nhin 2 quy
    var them = [], add = function(sg, w, txt){ them.push({ s: sg, w: w, t: txt }); };
    var hai = function(f){ return (B ? B.lb + ' ' + f(B) + ', ' : '') + A.lb + ' ' + f(A); };
    var dau2 = function(a, b){ return (a == null || b == null) ? 0 : (a > 0 && b > 0 ? 1 : (a < 0 && b < 0 ? -1 : Math.sign(a))); };
    add(A.h == null ? 0 : (B && B.h != null ? (A.h + B.h > 0 ? 1 : (A.h + B.h < 0 ? -1 : A.h)) : A.h), 99,
      '<b>LNST công ty mẹ ' + hai(function(z){ return soCk(z.np, z.np0); }) + ' so với cùng kỳ</b>' + (nhip ? ' — ' + nhip : '') + ' (quý gần nhất ' + ty(A.np) + ' tỷ).');
    if (A.rv != null) add(dau2(A.gRv, B ? B.gRv : null), 97, (loai === 'nh' ? 'Tổng thu nhập hoạt động ' : 'Doanh thu ') + hai(function(z){ return z.gRv == null ? '—' : dau(z.gRv, 0); }) + ' so với cùng kỳ (quý gần nhất ' + ty(A.rv) + ' tỷ).');
    if (A.lc != null && A.lc0 != null) add(dau2(A.gLc, B ? B.gLc : null), 95, TEN_LOI[loai] + ' ' + hai(function(z){ return soCk(z.lc, z.lc0); }) + ' so với cùng kỳ.');
    // nhan dinh (tong hop)
    var nd = [], pt = function(x){ return f(Math.abs(x), 0) + '%'; }, tenDt = loai === 'nh' ? 'tổng thu nhập hoạt động' : 'doanh thu', TenDt = loai === 'nh' ? 'Tổng thu nhập hoạt động' : 'Doanh thu';
    var thoiHN = loai === 'dn' && A.gRv != null && A.gRv < -10 && A.lk > 0 && A.lk > Math.max(A.lk0 || 0, 0) * 3 && A.pbt && A.lk > Math.abs(A.pbt) * 0.1;
    // khoan ngoai kinh doanh chinh dong gop nhieu nhat vao phan tang LNTT quy (tu "Loi nhuan den tu dau")
    var NGOAI = { dn: ['Doanh thu tài chính', 'Liên doanh, liên kết', 'Thu nhập khác ròng', 'Chi phí tài chính'], nh: ['Hoạt động khác', 'Chi phí dự phòng', 'Chứng khoán'],
      ck: ['Tự doanh (lãi − lỗ FVTPL)', 'Dự phòng (hoàn nhập +, trích −)'] }[loai] || [];
    var ngoaiMax = (s.cq ? s.cq.ds : []).filter(function(z){ return NGOAI.indexOf(z.ten) >= 0 && z.d > 0; }).sort(function(a, b){ return b.d - a.d; })[0];
    if (A.gm != null && A.gm < 0) nd.push('<b>Lỗ gộp ' + A.lb + '</b> (biên gộp ' + ph(A.gm * 100) + '): giá vốn vượt doanh thu — thường do giảm giá hàng tồn kho, bán dưới giá vốn hoặc giá đầu vào tăng đột biến; cần đọc thuyết minh BCTC.');
    if (thoiHN) nd.push('<b>Doanh thu giảm ' + pt(A.gRv) + ' nhưng lãi liên doanh, liên kết tăng từ ' + ty(A.lk0 || 0) + ' lên ' + ty(A.lk) + ' tỷ</b> — dấu hiệu một công ty con đã thôi hợp nhất: so sánh cùng kỳ bị lệch cơ sở, chưa chắc kinh doanh đi xuống.');
    if (A.gRv != null && A.h != null && !(A.gm != null && A.gm < 0) && !thoiHN) {
      var gmUp = A.gm != null && A.gm0 != null && A.gm - A.gm0 >= 0.005, gmDn = A.gm != null && A.gm0 != null && A.gm0 - A.gm >= 0.005;
      var bgm = (A.gm != null && A.gm0 != null) ? ' (biên gộp ' + ph(A.gm0 * 100) + ' → ' + ph(A.gm * 100) + ')' : '';
      if (A.gRv > 0 && A.h === 1) nd.push(gmUp ? '<b>Tăng trưởng chất lượng:</b> doanh thu tăng ' + pt(A.gRv) + ' và biên lãi gộp mở rộng' + bgm + ' — lợi nhuận tăng nhanh hơn doanh thu.'
        : (gmDn ? '<b>Lợi nhuận tăng nhờ quy mô</b> (doanh thu tăng ' + pt(A.gRv) + ') nhưng biên gộp thu hẹp' + bgm + ' — theo dõi giá bán và chi phí đầu vào các quý tới.'
        : '<b>' + TenDt + ' và lợi nhuận cùng tăng</b> (' + tenDt + ' ' + dau(A.gRv, 0) + ', LNST ' + soCk(A.np, A.np0) + ').'));
      else if (A.gRv > 0 && A.h === -1) nd.push('<b>' + TenDt + ' tăng ' + pt(A.gRv) + ' nhưng lợi nhuận giảm</b>' + bgm + ' — chi phí đang ăn mòn tăng trưởng (xem "Lợi nhuận đến từ đâu").');
      else if (A.gRv < 0 && A.h === 1) nd.push('<b>Lợi nhuận tăng dù ' + tenDt + ' giảm ' + pt(A.gRv) + '</b>' + bgm + ' — nhờ biên/chi phí hoặc khoản ngoài kinh doanh chính; khó kéo dài nếu ' + tenDt + ' không hồi phục.');
      else if (A.gRv < 0 && A.h === -1) nd.push('<b>' + TenDt + ' và lợi nhuận cùng giảm</b> (' + tenDt + ' ' + dau(A.gRv, 0) + ', LNST ' + soCk(A.np, A.np0) + ') — hoạt động kinh doanh đang co lại.');
    }
    if (A.gNP != null && A.gLc != null) {
      if (A.gNP > 0 && A.gLc < 0 && !thoiHN) nd.push('<b>Chất lượng lợi nhuận thấp:</b> LNST tăng nhưng ' + TEN_LOI[loai].replace(/\s*\(.*\)/, '') + ' giảm ' + pt(A.gLc) + ' — phần tăng đến từ khoản ngoài kinh doanh chính'
        + (ngoaiMax ? ' (nhiều nhất: ' + gon(ngoaiMax) + ' ' + tyD(ngoaiMax.d) + ' tỷ)' : '') + '.');
      else if (A.gNP > 0 && A.gLc >= A.gNP - 10) nd.push('<b>Tăng trưởng đến từ kinh doanh cốt lõi</b> (' + TEN_LOI[loai].replace(/\s*\(.*\)/, '') + ' ' + dau(A.gLc, 0) + ') — bền hơn tăng nhờ khoản một lần.');
      else if (A.gNP < 0 && A.gLc > 0) nd.push('<b>Nền kinh doanh chưa xấu đi:</b> LNST giảm nhưng ' + TEN_LOI[loai].replace(/\s*\(.*\)/, '') + ' vẫn tăng ' + pt(A.gLc) + ' — sụt do chi phí tài chính/khoản bất thường.');
    }
    if (nhip && B) nd.push('Nhịp tăng trưởng LNST <b>' + nhip + '</b>: ' + B.lb + ' ' + dau(B.gNP, 0) + ' → ' + A.lb + ' ' + dau(A.gNP, 0) + '.');
    if (loai === 'nh' && A.dp != null && A.dp0 != null && A.dp0 !== 0) { var gdp = yoy(Math.abs(A.dp), Math.abs(A.dp0));
      if (gdp != null && Math.abs(gdp) >= 20) nd.push('Chi phí dự phòng ' + A.lb + ' ' + (gdp < 0 ? 'giảm ' : 'tăng ') + pt(gdp) + ' so với cùng kỳ' + (gdp < 0 && A.h === 1 ? ' — một phần tăng lợi nhuận đến từ trích dự phòng ít hơn.' : (gdp > 0 ? ' — ngân hàng đang trích lập mạnh tay hơn, lợi nhuận bị kìm.' : '.'))); }
    if (loai === 'ck' && A.td != null && A.pbt > 0 && Math.abs(A.td) > A.pbt * 0.3) nd.push('Tự doanh chiếm ' + f(A.td / A.pbt * 100, 0) + '% LNTT ' + A.lb + ' — lợi nhuận phụ thuộc nhiều vào diễn biến thị trường.');
    return { q: q, A: A, B: B, nhan: nhan, mau: mau, nhip: nhip, them: them, nd: nd, loai: loai };
  }
  function bang2Quy(tt){
    var q = tt.q, loai = tt.loai, R = [];
    var dong = function(ten, get, get0){ R.push('<tr><td>' + ten + '</td>' + q.map(function(z){ var a = get(z), b = get0(z);
      return '<td>' + ty(a) + '</td><td class="' + mau(yoy(a, b)) + '">' + soCk(a, b).replace(/ \(cùng kỳ[^)]*\)/, '') + '</td>'; }).join('') + '</tr>'); };
    dong(loai === 'nh' ? 'Tổng thu nhập hoạt động' : 'Doanh thu', function(z){ return z.rv; }, function(z){ return z.rv0; });
    if (loai === 'dn') { dong('Lợi nhuận gộp', function(z){ return z.gp; }, function(z){ return z.gp0; });
      R.push('<tr><td class="mini">&nbsp;&nbsp;biên gộp</td>' + q.map(function(z){ return '<td class="mini">' + (z.gm != null ? ph(z.gm * 100) : '—') + '</td><td class="mini">' + (z.gm != null && z.gm0 != null ? diem(z.gm * 100, z.gm0 * 100) : '') + '</td>'; }).join('') + '</tr>'); }
    if (loai === 'ck') dong('Tự doanh ròng', function(z){ return z.td; }, function(z){ return z.td0; });
    if (loai === 'nh') dong('Chi phí dự phòng', function(z){ return z.dp == null ? null : Math.abs(z.dp); }, function(z){ return z.dp0 == null ? null : Math.abs(z.dp0); });
    dong(TEN_LOI[loai].replace(/\s*\(.*\)/, ''), function(z){ return z.lc; }, function(z){ return z.lc0; });
    dong('Lợi nhuận trước thuế', function(z){ return z.pbt; }, function(z){ return z.pbt0; });
    dong('<b>LNST công ty mẹ</b>', function(z){ return z.np; }, function(z){ return z.np0; });
    return '<table class="ptn pt2q"><tr><td class="mini">tỷ đồng</td>' + q.map(function(z){ return '<td class="mini"><b>' + z.lb + '</b></td><td class="mini">so cùng kỳ</td>'; }).join('') + '</tr>' + R.join('') + '</table>';
  }
  function soiHtml(t, raw, d, s){
    if (!s || !s.ds.length) return '';
    var tt = raw.__tt, ds = s.ds.concat(tt ? tt.them : []).sort(function(a, b){ return b.w - a.w; });
    var sang = ds.filter(function(x){ return x.s > 0; }), toi = ds.filter(function(x){ return x.s < 0; }), ghi = ds.filter(function(x){ return !x.s; });
    var li = function(a){ return a.map(function(x){ return '<li>' + x.t + '</li>'; }).join(''); };
    var kieu = s.loai === 'ck' ? 'công ty chứng khoán' : (s.loai === 'nh' ? 'ngân hàng' : 'doanh nghiệp');
    var h = '<div class="soi"><h3>Soi BCTC 2 quý gần nhất' + (tt && tt.B ? ' — ' + tt.B.lb + ' và ' + tt.A.lb : ' — ' + s.lb) + ' · ' + kieu
      + (tt ? ' <span class="ttc ' + tt.mau + '">' + tt.nhan + (tt.nhip ? ' · ' + tt.nhip : '') + '</span>' : '') + '</h3>';
    if (tt) h += '<div style="overflow-x:auto;margin-bottom:8px">' + bang2Quy(tt) + '</div>';
    h += '<div class="st2"><div class="sang"><h4>Điểm sáng (' + sang.length + ')</h4>' + (sang.length ? '<ul>' + li(sang) + '</ul>' : '<div class="mini">Không có điểm sáng nổi bật theo bộ lọc.</div>') + '</div>'
      + '<div class="toi"><h4>Điểm tối (' + toi.length + ')</h4>' + (toi.length ? '<ul>' + li(toi) + '</ul>' : '<div class="mini">Không có điểm tối nổi bật theo bộ lọc.</div>') + '</div></div>';
    if (tt && tt.nd.length) h += '<div class="nd"><h4>Nhận định</h4><ul>' + tt.nd.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>'
      + '<div class="mini">Kết luận tăng trưởng: <b>' + tt.nhan.toLowerCase() + '</b>' + (tt.nhip ? ' (' + tt.nhip + ')' : '') + '. Kiểm định 2014 – 2026: lợi nhuận tăng 2 quý liền <u>một mình</u> chỉ hơn thị trường +1,1% sau 6 tháng;'
      + ' lợi thế rõ khi tăng trưởng đi cùng giá hợp lý (mức TÍCH CỰC +5,7%).</div></div>';
    if (ghi.length) h += '<details class="sgc"><summary>Ghi chú thêm (' + ghi.length + ')</summary><ul>' + li(ghi) + '</ul></details>';
    h += '</div>';
    h += '<div class="pt3">' + bangCau(s.cq, 'Lợi nhuận đến từ đâu · ' + s.lb + ' so với ' + s.lbP) + bangCau(s.ct, 'Cộng 4 quý đến ' + s.lb + ' so với 4 quý trước') + bangPeer(t, raw.__bangPeer) + '</div>';
    h += '<div style="overflow-x:auto;margin-bottom:12px">' + bangQuy(s, raw, t) + '</div>';
    return h;
  }

  /* ---------- Dinh gia + KET LUAN MUA CO / KHONG theo gia hom nay (16/10/2026) ----------
     Mo hinh da kiem dinh o kafi-core research/co-ban (KET-QUA.md, chot.mjs): 1.628 ma (gom ma da huy niem yet), 2013 – 10/2026,
     BCTC point-in-time (ngay VNDirect nhap; lui ve han 45 ngay khi ngay nhap vo ly), vu tru top 250 thanh khoan va >= 1 ty/phien.
       CO          = P/E < 15 & PEG <= 1 & LN quy >= cung ky & gia >= 80% dinh 12 thang (gia cuoi thang) & khong "chu ky o dinh"
       KHONG (dat) = P/E >= 25, hoac P/E >= 20 & PEG >= 2,5. Ngan hang khong xep "dat" (nhom nay lich su khong kem thi truong).
       KHONG       = con lai (chua du dieu kien).
     Cach tinh trung tung dong voi research/co-ban/dac-trung.mjs: P/E = gia goc x (von gop/10.000) / LNST me 4 quy, dieu chinh khi
     chia/thuong co phieu sau ngay can doi (adClose/close lech > 8%); PEG = P/E / (100 x tang truong LN 4 quy binh quan 2 nam);
     giam toc = tang truong 4 quy cao nhat 3 quy truoc - hien tai (chan 300%). Chu ky = tung giam LN 4 quy >= 50% tu dinh (>= 16 quy)
     hoac nganh chu ky; "o dinh" = LN 4 quy >= 85% dinh lich su va (giam toc >= 25 diem % hoac bien gop >= 85% lich su).
     Web bo dieu kien gia hang hoa 6 thang (FRED, trinh duyet khong goi duoc): doi 0,8% so lan, thang 10/2026 khong doi ma nao. */
  var NM_MA = '21001,421701,23000,23003,23100,14110,14000,14240,21500,23900,23800';
  var NGANH_CK = ['Kim loại công nghiệp', 'Hóa chất', 'Khai thác mỏ', 'Sản xuất dầu khí', 'Dụng cụ, dịch vụ & Phân phối Dầu',
    'Dịch vụ tài chính', 'Dịch vụ Đầu tư Bất Động Sản', 'Xây dựng & Vật liệu', 'Sản xuất giấy & Trồng rừng', 'Ôtô & phụ tùng ôtô'];
  // So lieu kiem dinh (loi nhuan VUOT trung binh deu top 250 cung thang, 2014 – 10/2026) — kafi-core chot.mjs + kiem-chot.mjs
  var KD = {
    tc: 'Lịch sử 2014 – 10/2026: 3.467 lần TÍCH CỰC (341 mã) — trung bình <b>hơn thị trường +3,6% sau 3 tháng, +5,7% sau 6 tháng, +8,5% sau 12 tháng</b>; dương 11/12 năm (trừ 2021). Chỉ ~52% số lần thắng thị trường: lợi thế nằm ở trung bình nhiều mã, không phải mã nào TÍCH CỰC cũng tăng.',
    kq: 'Lịch sử 2014 – 10/2026: nhóm KHẢ QUAN (19.244 lần) nhỉnh hơn thị trường +0,3% sau 3 tháng, +0,9% sau 6 tháng, +1,3% sau 12 tháng; dương 10/12 năm — giữ hoặc theo dõi, chưa có lợi thế rõ để mua mạnh.',
    tcu: 'Lịch sử 2014 – 10/2026: nhóm TIÊU CỰC (12.152 lần) <b>kém thị trường −1,7% sau 3 tháng, −3,3% sau 6 tháng, −4,7% sau 12 tháng</b>; âm cả 12/12 năm.',
    sap: 'Riêng loại "lợi nhuận sụt mạnh nhưng giá chưa đắt" gần ngang thị trường (−0,7% sau 6 tháng; 2014–20 −1,9%, từ 2021 +0,9%) — xếp Tiêu cực vì lợi nhuận đang đi xuống, chưa có lý do để mua.',
    dm: 'Danh mục mua đều mọi mã TÍCH CỰC, xét lại hằng tháng, giữ 3 tháng, đã trừ phí + thuế: <b>+21,3%/năm</b> 2014 – nay (trung bình thị trường +6,6%/năm); riêng giai đoạn kiểm tra 2021 – nay +17,4%/năm (VN-Index +8,6%/năm). Sụt lớn nhất −40% (2022).',
    dat: 'Lịch sử 2014 – 10/2026: 4.308 lần ở nhóm này (299 mã) — trung bình <b>kém thị trường −3,9% sau 3 tháng, −8,7% sau 6 tháng, −15,6% sau 12 tháng</b>; âm 11/12 năm; 66% số lần thua thị trường.',
    thap: 'Riêng loại "P/E cao vì LN đang thấp" (P/E trên LN bình quân 5 năm < 25): −3,3% sau 6 tháng (2014–20 −6,6%, từ 2021 +0,7%) — LN có thể phục hồi như MWG cuối 2023, nhưng chưa có lợi thế để mua.',
    dao: 'Mã rẻ + tăng trưởng nhưng giá đã rơi quá 20% từ đỉnh 12 tháng: lịch sử kém thị trường −2,4% sau 3 tháng (1.220 lần) — chưa nên bắt dao rơi.',
    lnq: 'Mã rẻ + tăng trưởng nhưng quý gần nhất LN giảm: lịch sử ngang thị trường (−0,7% sau 6 tháng, 2.172 lần).',
    b: 'Mã chu kỳ ở đỉnh lợi nhuận dù P/E thấp: 22% số lần giảm ≥ 30% trong 12 tháng sau (nhóm TÍCH CỰC: 13%) — như HPG cuối 2021.',
    bc: 'Kiểm định 2022 – 2026: trong nhóm TÍCH CỰC, mã được CTCK dự báo dư địa ≥ 15% không tăng tốt hơn (+3,3% so với +7,1% sau 6 tháng) — mô hình không dùng giá mục tiêu.',
    // nhom CO theo trang thai tab Toan canh tai thoi diem mua (2018 – 10/2026) — kafi-core theo-trang-thai.mjs
    tt: ['Lịch sử 2018 – 2026 khi thị trường ở trạng thái này: nhóm TÍCH CỰC hơn thị trường +3,6% sau 3 tháng; tính tuyệt đối +2,8% sau 3 tháng, +7,0% sau 6 tháng.',
      'Lịch sử 2018 – 2026 khi thị trường Tích cực: nhóm TÍCH CỰC hơn thị trường +3,4% sau 3 tháng; tính tuyệt đối +11,3% sau 3 tháng, 64% số lần có lãi — thời điểm thuận lợi nhất.',
      'Lịch sử 2018 – 2026 khi thị trường Thận trọng: nhóm TÍCH CỰC vẫn hơn thị trường (+1,5% sau 3 tháng) nhưng <b>tính tuyệt đối −5,1% sau 6 tháng, chỉ 38% số lần có lãi</b>. Danh mục TÍCH CỰC không mua mới khi Thận trọng: sụt lớn nhất −29% thay vì −40%, lợi nhuận/năm không giảm — nên giải ngân từng phần hoặc chờ.']
  };
  function nmCong(d, n){ var x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); }
  function nmKQ(fd){ return (+fd.slice(0, 4)) * 4 + Math.ceil(+fd.slice(5, 7) / 3); }
  function nmPv(x, arr){ var a = arr.filter(function(v){ return v != null && isFinite(v); }); if (!a.length || x == null) return null; var n = 0; a.forEach(function(v){ if (v <= x) n++; }); return n / a.length; }
  function cap3(x){ return x == null ? null : Math.min(3, x); }
  function thangCong(ym, n){ var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + n; y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; return y + '-' + String(m + 1).padStart(2, '0'); }
  function thuong(s){ return /^.[a-zà-ỹđ]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function thangVn(ym){ return ym.slice(5, 7) + '/' + ym.slice(0, 4); }
  // rawQ: [[fiscalDate, itemCode, numericValue, createdDate]] (hoac doi tuong cung ten), gia: [[yyyy-mm, ngay, close, adClose]] (thang, tang dan)
  function nmTinh(rawQ, gia, giaSong, ngaySong){
    var Q = {}, laNH = false;
    (rawQ || []).forEach(function(x){
      if (!Array.isArray(x)) x = [x.fiscalDate, x.itemCode, x.numericValue, x.createdDate];
      var fd = String(x[0] || '').slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(fd)) return; var v = +x[2]; if (!isFinite(v)) return;
      var k = nmKQ(fd), q = Q[k] || (Q[k] = { k: k, fd: fd, v: {}, c: null }), ic = String(Math.round(+x[1])); if (q.v[ic] == null) q.v[ic] = v;
      var cd = String(x[3] || '').slice(0, 10); if (/^\d{4}-\d{2}-\d{2}$/.test(cd) && (!q.c || cd < q.c)) q.c = cd;
    });
    var ks = Object.keys(Q).map(Number).sort(function(a, b){ return a - b; });
    if (!ks.length || !gia || gia.length < 13) return null;
    ks.forEach(function(k){ var q = Q[k], o = q.v;
      q.pub = (q.c && q.c >= nmCong(q.fd, 10) && q.c <= nmCong(q.fd, 100)) ? q.c : nmCong(q.fd, 45);
      q.rev = (o['21001'] != null && o['21001'] !== 0) ? o['21001'] : (o['421701'] != null ? o['421701'] : null);
      q.np = o['23000'] != null ? o['23000'] : (o['23003'] != null ? o['23003'] : null);
      q.gp = o['23100'] != null ? o['23100'] : null; q.von = o['14110'] || null;
      q.eq = o['14000'] != null ? o['14000'] - (o['14240'] || 0) : null; if (o['421701'] != null) laNH = true; });
    function ttm(k, f){ var s = 0; for (var j = 0; j < 4; j++){ var q = Q[k - j]; if (!q || q[f] == null) return null; s += q[f]; } return s; }
    // dac trung theo quy (dinh LN, chuoi ky luc, bien gop) — tinh mot lan
    var FQ = {}, mxN = null, mxR = null, streak = 0, runPk = null, ddMin = 1, nT = 0, gmS = [];
    ks.forEach(function(k){ var npT = ttm(k, 'np'), revT = ttm(k, 'rev'), gpT = ttm(k, 'gp');
      var recNP = npT != null && npT > 0 && (mxN == null || npT > mxN), recRev = revT != null && revT > 0 && (mxR == null || revT > mxR);
      streak = (recNP && recRev) ? streak + 1 : 0;
      if (npT != null) { nT++; if (runPk == null || npT > runPk) runPk = npT; if (runPk > 0) ddMin = Math.min(ddMin, npT / runPk); }
      var gm = (gpT != null && revT > 0) ? gpT / revT : null; if (gm != null) gmS.push(gm);
      FQ[k] = { npT: npT, revT: revT, recNP: recNP, recRev: recRev, streak: streak, gm: gm, gmPct: (gm != null && gmS.length >= 8) ? nmPv(gm, gmS) : null,
        peakRatio: (npT != null && runPk > 0) ? npT / Math.max(runPk, npT) : null, cycHist: nT >= 16 && ddMin <= 0.5 };
      if (npT != null && (mxN == null || npT > mxN)) mxN = npT; if (revT != null && (mxR == null || revT > mxR)) mxR = revT; });
    var thang = gia.map(function(r){ return r[0]; }), C = gia.map(function(r){ return r[2]; }), A = gia.map(function(r){ return r[3]; });
    var iTh = {}; thang.forEach(function(m, i){ iTh[m] = i; });
    function knTai(ngay){ for (var j = ks.length - 1; j >= 0; j--) if (Q[ks[j]].pub <= ngay) return ks[j]; return null; }
    function voHoa(kn, gGoc, gDc){   // ty dong
      var von = null, kv = null; for (var j = ks.indexOf(kn); j >= 0; j--) if (Q[ks[j]].von) { von = Q[ks[j]].von; kv = ks[j]; break; }
      if (!von) return null; var cp = von / 1e4, mi = iTh[Q[kv].fd.slice(0, 7)];
      if (mi != null && C[mi] && A[mi] && gGoc && gDc) { var r = (gDc / gGoc) / (A[mi] / C[mi]); if (r > 1.08) cp *= r; }
      return gGoc * cp / 1e6; }
    var g = function(a, b){ return (a != null && b != null && b > 0) ? a / b - 1 : null; };
    // huong LNST me quy k so voi cung ky: 1 khong giam, -1 giam, null thieu so (giong dac-trung.mjs)
    function huong(k){ var a = Q[k] ? Q[k].np : null, b = Q[k - 4] ? Q[k - 4].np : null; return (a == null || b == null) ? null : (a >= b ? 1 : -1); }
    // P/E chuan hoa (Anderson & Brooks): von hoa / LN 4 quy binh quan 20 quy gan nhat (can >= 12 quy)
    function peChuan(kn, mc){ var a = []; for (var j = 0; j < 20; j++){ var v = ttm(kn - j, 'np'); if (v != null) a.push(v); }
      if (a.length < 12 || !mc) return null; var tb = a.reduce(function(s2, v){ return s2 + v; }, 0) / a.length; return tb > 0 ? mc / (tb / 1e9) : null; }
    // dac trung tai thang i (gia goc gGoc, gia dieu chinh gDc, ngay xet) — lich su: gia cuoi thang; hien tai: gia song
    function dt(i, gGoc, gDc, ngay){
      var kn = knTai(ngay); if (kn == null || (new Date(ngay) - new Date(Q[kn].fd)) / 864e5 > 200) return null;
      var F = FQ[kn], npT = F.npT, mc = voHoa(kn, gGoc, gDc), pe = (mc && npT > 0) ? mc / (npT / 1e9) : null;
      var np8 = ttm(kn - 8, 'np'), g2 = (npT > 0 && np8 > 0) ? Math.sqrt(npT / np8) - 1 : null, gNP = g(npT, ttm(kn - 4, 'np'));
      var gPrev = [1, 2, 3].map(function(j){ return cap3(g(ttm(kn - j, 'np'), ttm(kn - j - 4, 'np'))); }).filter(function(x){ return x != null; });
      var hiT = null; for (var j = Math.max(0, i - 11); j < Math.min(i, A.length); j++) if (A[j] && (hiT == null || A[j] > hiT)) hiT = A[j];
      var hi = (gDc && (hiT == null || gDc > hiT)) ? gDc : hiT;
      return { i: i, kn: kn, mcap: mc, npT: npT, revT: F.revT, pe: pe, g2: g2, peg: (pe != null && g2 > 0) ? pe / (g2 * 100) : null, gNP: gNP,
        gNPq: (Q[kn].np != null && Q[kn - 4] && Q[kn - 4].np > 0) ? Q[kn].np / Q[kn - 4].np - 1 : null, npQ: Q[kn].np, npQ4: Q[kn - 4] ? Q[kn - 4].np : null,
        decel: (gNP != null && gPrev.length) ? Math.max.apply(null, gPrev) - cap3(gNP) : null,
        hiTruoc: hiT, dHi52: hi ? gDc / hi - 1 : null, peakRatio: F.peakRatio, cycHist: F.cycHist, gm: F.gm, gmPct: F.gmPct,
        recNP: F.recNP, recRev: F.recRev, streak: F.streak, bank: laNH, peNorm: peChuan(kn, mc), h0: huong(kn), h1: huong(kn - 1),
        gNPq1: (Q[kn - 1] && Q[kn - 1].np != null && Q[kn - 5] && Q[kn - 5].np > 0) ? Q[kn - 1].np / Q[kn - 5].np - 1 : null };
    }
    // lich su theo thang (P/E cho dai 5 nam + ket luan tung quy)
    var ls = [];
    for (var i = 0; i < gia.length; i++) ls.push(dt(i, C[i], A[i], gia[i][1]));
    // hien tai: gia song thay gia cuoi thang; sang thang moi ma du lieu gia chua co phien nao -> thang hien tai = iL + 1
    var iL = gia.length - 1, ngayL = ngaySong || gia[iL][1];
    var moi = !!ngaySong && ngaySong.slice(0, 7) > thang[iL], iC = moi ? iL + 1 : iL, thC = moi ? ngaySong.slice(0, 7) : thang[iL];
    var kAdj = A[iL] / C[iL], gGoc = giaSong || C[iL], gDc = giaSong ? kAdj * giaSong : A[iL];
    var cur = dt(iC, gGoc, gDc, ngayL); if (!cur) return null;
    var peLs = ls.map(function(x){ return x && x.pe != null && x.pe < 300 ? x.pe : null; });
    var ls5 = peLs.slice(Math.max(0, iC - 60), iC).filter(function(x){ return x != null; });
    var srt = ls5.slice().sort(function(a, b){ return a - b; });
    var q = function(p){ return srt.length ? srt[Math.min(srt.length - 1, Math.floor(p * srt.length))] : null; };
    var i12 = iTh[thangCong(thC, -12)];
    var kn0 = cur.kn;
    return { cur: cur, kq: kn0, quy: 'Q' + (kn0 - Math.floor((kn0 - 1) / 4) * 4) + '/' + Math.floor((kn0 - 1) / 4), mcap: cur.mcap, pe: cur.pe,
      pePct: (cur.pe != null && ls5.length >= 24) ? nmPv(cur.pe, ls5) : null, peP05: q(0.05), peP20: q(0.2), peP50: q(0.5), peP80: q(0.8), peP95: q(0.95), peN: ls5.length,
      pe12: i12 != null ? peLs[i12] : null, np12: (i12 != null && ls[i12]) ? ls[i12].npT : null, peLs: peLs.slice(Math.max(0, iC - 60), iC), gNP: cur.gNP, gRev: g(cur.revT, ttm(kn0 - 4, 'rev')), gNPq: cur.gNPq,
      decel: cur.decel, peg: cur.peg, ret12: (i12 != null && A[i12]) ? gDc / A[i12] - 1 : null, recNP: cur.recNP, recRev: cur.recRev, streak: cur.streak,
      gm: cur.gm, gmPct: cur.gmPct, peakRatio: cur.peakRatio, cycHist: cur.cycHist, npT: cur.npT, revT: cur.revT,
      ls: ls, thang: thang, A: A, iC: iC, thC: thC, kAdj: kAdj, gDc: gDc };
  }
  function laB(x, nganh){ return !!x && (x.cycHist || NGANH_CK.indexOf(nganh) >= 0) && x.peakRatio != null && x.peakRatio >= 0.85 && ((x.decel != null && x.decel >= 0.25) || (x.gmPct != null && x.gmPct >= 0.85)); }
  function laDat(x){ return !!x && x.pe != null && (x.pe >= 25 || (x.pe >= 20 && x.peg != null && x.peg >= 2.5)); }
  /* Khuyen nghi 3 muc (16/10/2026, anh Khoa: "Tieu cuc - Kha quan - Tich cuc") — kafi-core ba-muc.mjs, phuong an C:
     TICH CUC = quy tac CO; TIEU CUC = dat that HOAC LNST quy gan nhat sut >= 30% / lo; KHA QUAN = con lai.
     Ma loai: 'tc' | 'dat' | 'sap' (2 loai TIEU CUC) | 'thap' | 'kq' (2 loai KHA QUAN). */
  function phanLoai(x, nganh){
    if (!x) return 'kq';
    if (x.pe != null && x.pe < 15 && x.peg != null && x.peg <= 1 && x.gNPq != null && x.gNPq >= 0 && x.dHi52 != null && x.dHi52 >= -0.2 && !laB(x, nganh)) return 'tc';
    var dat = laDat(x) && !x.bank;
    if (dat && !(x.peNorm != null && x.peNorm < 25)) return 'dat';
    if (laSap(x)) return 'sap';
    return dat ? 'thap' : 'kq';   // P/E cao chi vi LN dang thap (P/E tren LN binh quan 5 nam < 25): khong goi la "dat"
  }
  function laSap(x){ return !!x && x.h0 === -1 && (x.gNPq == null || x.gNPq <= -0.3); }
  function muc3(lo){ return lo === 'tc' ? 'tc' : ((lo === 'dat' || lo === 'sap') ? 'tcu' : 'kq'); }
  var TEN3 = { tc: 'TÍCH CỰC', kq: 'KHẢ QUAN', tcu: 'TIÊU CỰC' };
  // vu tru kiem dinh: top 250 GTGD TB20 (SUMMARY, trieu dong) va >= 1 ty/phien
  function phamVi(t){
    var k = K(), r = hang(t); if (!k || !r || r.val20 == null) return null;
    var thu = 1; k.sum().rows.forEach(function(x){ if ((x.val20 || 0) > r.val20) thu++; });
    return { ok: thu <= 250 && r.val20 >= 1000, thu: thu, val: r.val20 / 1000 };
  }
  // gia dung yen -> sau bao nhieu thang thi gia >= 80% dinh 12 thang (dinh cu roi khoi cua so)
  function thangDuDinh(nm){
    var A = nm.A, iC = nm.iC, p = nm.gDc;
    for (var d = 1; d <= 11; d++) { var hi = p; for (var j = Math.max(0, iC - 11 + d); j < Math.min(iC, A.length); j++) if (A[j] > hi) hi = A[j]; if (p >= 0.8 * hi) return d; }
    return 12;
  }

  // Diem nhan dau the ket luan: LN 4 quy vs gia 12 thang (P/E co / no), chuoi ky luc
  function diemNhan(nm){
    var cau = [];
    // cung cua so: gia 12 thang va LN 4 quy DA CONG BO tai hai moc (khop voi P/E hai moc)
    var gLN = (nm.npT > 0 && nm.np12 > 0) ? nm.npT / nm.np12 - 1 : null;
    if (gLN != null && nm.ret12 != null) {
      var gap = gLN - nm.ret12;
      cau.push('12 tháng qua giá ' + dau(nm.ret12 * 100, 0) + ', LNST 4 quý (số đã công bố) ' + ty(nm.np12) + ' → ' + ty(nm.npT) + ' tỷ (' + dau(gLN * 100, 0) + ')'
        + (nm.pe12 != null && nm.pe != null ? ' → P/E từ ' + f(nm.pe12, 1) + ' ' + (nm.pe < nm.pe12 ? 'co về' : 'nở lên') + ' ' + f(nm.pe, 1) : '') + '.'
        + (gap >= 0.2 ? (nm.gNPq != null && nm.gNPq < 0 ? ' Nhưng LN quý gần nhất ' + (nm.cur.npQ < 0 ? 'đã lỗ' : 'đã giảm so với cùng kỳ') + ' — giá có thể đang phản ánh sự đi xuống này, chưa phải "giá chưa theo kịp lợi nhuận".'
          : (nm.cur.dHi52 != null && nm.cur.dHi52 < -0.2 ? ' <b>Giá giảm dù lợi nhuận tăng</b> — P/E co mạnh, nhưng giá vẫn đang rơi (quá 20% từ đỉnh 12 tháng): lịch sử kiểu này thường chưa phải đáy.'
          : ' <b>Lợi nhuận đi nhanh hơn giá</b> — giá chưa phản ánh hết tăng trưởng.')) : (gap <= -0.3 ? ' <b>Giá đi nhanh hơn lợi nhuận</b> — kỳ vọng đã vào giá.' : '')));
    }
    if (nm.streak >= 2) cau.push('LN và doanh thu 4 quý cùng lập kỷ lục <b>' + nm.streak + ' quý liên tiếp</b>.');
    return cau;
  }
  /* Ket luan + vung gia + lich su ket luan tren chinh ma. Ve lai moi khi gia song doi. */
  function ketLuanHtml(t, nm, raw){
    var r = hang(t) || {}, p = r.p > 0 ? r.p : (raw.gia ? raw.gia[raw.gia.length - 1][2] : null), x = nm && nm.cur;
    var nganh = (K() && K().SEC_MAP[t]) || '', pv = phamVi(t), ngoai = !!(pv && !pv.ok);
    var loai = phanLoai(x, nganh); if (loai === 'tc' && ngoai) loai = 'kq';   // ngoai vu tru kiem dinh: khong bao gio TICH CUC
    var muc = muc3(loai);
    var tieuDe = function(kl, sub){ return '<div class="klh"><div class="klv">KHUYẾN NGHỊ ' + esc(t) + (p ? ' ở giá ' + f(p, 2) : '') + ': <b>' + kl + '</b></div><div class="kls">' + sub + '</div></div>'; };
    if (!x) return '<div class="kl kq">' + tieuDe('CHƯA ĐỦ DỮ LIỆU', 'BCTC quý gần nhất cách quá 200 ngày, thiếu số, hoặc chưa đủ 13 tháng giá — chưa xếp mức.') + '</div>';
    var dk = [], th = function(ten, ok, txt, kd, gia, tk){ dk.push({ ten: ten, ok: ok, txt: txt, kd: kd || '', gia: !!gia, tk: !!tk }); };
    th('P/E dưới 15', x.pe != null && x.pe < 15, x.pe == null ? (x.npT != null && x.npT <= 0 ? 'LNST công ty mẹ 4 quý âm — không định giá được bằng P/E.' : 'Chưa đủ 4 quý BCTC.')
      : 'P/E ' + f(x.pe, 1) + ' = vốn hóa ' + ty(x.mcap * 1e9) + ' tỷ ÷ LNST công ty mẹ 4 quý ' + ty(x.npT) + ' tỷ.', '', x.pe != null);
    th('PEG ≤ 1', x.peg != null && x.peg <= 1, x.peg != null ? 'PEG ' + f(x.peg, 2) + ' = P/E ' + f(x.pe, 1) + ' ÷ tốc độ tăng LN 4 quý bình quân 2 năm (' + dau(x.g2 * 100, 0) + '/năm).'
      : (x.g2 != null && x.g2 <= 0 ? 'LN 4 quý không cao hơn 2 năm trước (' + dau(x.g2 * 100, 0) + '/năm) — không có tăng trưởng bù cho P/E.' : 'Chưa đủ 12 quý LN dương để tính.'), '', x.peg != null);
    th('LN quý gần nhất không giảm', x.gNPq != null && x.gNPq >= 0, x.gNPq != null
        ? (x.npQ < 0 ? 'LNST công ty mẹ ' + nm.quy + ' lỗ ' + ty(-x.npQ) + ' tỷ (cùng kỳ lãi ' + ty(x.npQ4) + ' tỷ).' : 'LNST công ty mẹ ' + nm.quy + ' ' + dau(x.gNPq * 100, 0) + ' so với cùng kỳ (' + ty(x.npQ) + ' so với ' + ty(x.npQ4) + ' tỷ).')
        : (x.npQ4 != null && x.npQ4 <= 0 ? 'Cùng kỳ năm trước lỗ (' + ty(x.npQ4) + ' tỷ) — không so được tăng trưởng' + (x.npQ != null ? '; quý ' + nm.quy + (x.npQ > 0 ? ' lãi ' + ty(x.npQ) : ' lỗ ' + ty(-x.npQ)) + ' tỷ' : '') + '.' : 'Thiếu số liệu quý cùng kỳ.'),
      x.gNPq != null && x.gNPq < 0 ? KD.lnq : '');
    var hiG = x.hiTruoc ? x.hiTruoc / nm.kAdj : null, dTxt = '';
    if (x.dHi52 != null && x.dHi52 < -0.2) { var d = thangDuDinh(nm);
      dTxt = d <= 11 ? ' Nếu giá đứng yên, điều kiện này tự đạt từ tháng ' + thangVn(thangCong(nm.thC, d)) + ' (đỉnh cũ rời khỏi cửa sổ 12 tháng).' : ''; }
    th('Giá không rơi quá 20% từ đỉnh 12 tháng', x.dHi52 != null && x.dHi52 >= -0.2, x.dHi52 == null ? 'Chưa đủ lịch sử giá.'
      : 'Giá ' + f(p, 2) + ' = ' + f((1 + x.dHi52) * 100, 0) + '% mức cao nhất 12 tháng' + (x.dHi52 < 0 && hiG ? ' (' + f(hiG, 2) + ', giá cuối tháng đã điều chỉnh)' : ' — đang ở đỉnh') + '.' + dTxt,
      x.dHi52 != null && x.dHi52 < -0.2 ? KD.dao : '', true);
    var ck = x.cycHist || NGANH_CK.indexOf(nganh) >= 0, b = laB(x, nganh);
    var vsCk = x.cycHist ? 'mã từng giảm LN 4 quý ≥ 50% từ đỉnh' : 'ngành chu kỳ (' + esc(nganh) + ')';
    th('Không phải chu kỳ ở đỉnh', !b, b ? 'LN 4 quý đang ở ' + f(x.peakRatio * 100, 0) + '% đỉnh lịch sử, ' + vsCk + ', và '
        + (x.decel != null && x.decel >= 0.25 ? 'tăng trưởng đang chậm lại (' + dau(cap3(x.gNP) * 100, 0) + ', thấp hơn ' + f(x.decel * 100, 0) + ' điểm % so với đỉnh tăng trưởng 3 quý trước)' : 'biên LN gộp ở vùng cao nhất lịch sử (cao hơn ' + f(x.gmPct * 100, 0) + '% số quý)') + '.'
      : (ck ? 'Thuộc nhóm chu kỳ (' + vsCk + ') — ' + (x.npT != null && x.npT <= 0 ? 'LN 4 quý đang âm: chưa ở vùng đỉnh.' : x.peakRatio == null ? 'chưa đủ số để xét đỉnh.' : (x.peakRatio >= 0.85
          ? 'LN 4 quý đang ở ' + f(x.peakRatio * 100, 0) + '% đỉnh lịch sử nhưng tăng trưởng chưa chậm lại và biên LN gộp chưa ở vùng cao nhất: chưa có dấu hiệu đỉnh chu kỳ.'
          : 'LN 4 quý mới bằng ' + f(x.peakRatio * 100, 0) + '% đỉnh lịch sử: chưa ở vùng đỉnh.')) : 'Không thuộc nhóm chu kỳ.'),
      b ? KD.b : '');
    if (ngoai) th('Thanh khoản trong phạm vi kiểm định', false, 'GTGD TB 20 phiên ' + f(pv.val, 1) + ' tỷ/phiên, hạng ' + pv.thu + ' — mô hình chỉ kiểm định trên top 250 thanh khoản và ≥ 1 tỷ/phiên.', '', false, true);
    var hong = dk.filter(function(z){ return !z.ok; });
    var vuong = hong.map(function(z){ return thuong(z.ten); }).join('; ');
    var sub = loai === 'tc' ? 'Đang tăng trưởng và giá còn rẻ so với tốc độ tăng trưởng — đạt cả 5 điều kiện (kiểm định 2014 – 2026).'
      : loai === 'dat' ? 'Định giá quá cao: P/E ' + f(x.pe, 1) + (x.pe >= 25 ? ' ≥ 25' : ' ≥ 20 và PEG ' + f(x.peg, 1) + ' ≥ 2,5') + (x.peNorm != null ? ', và trên LN bình quân 5 năm vẫn ' + f(x.peNorm, 1) + '.' : '.')
      : loai === 'sap' ? 'Lợi nhuận đang sụt: LNST công ty mẹ ' + nm.quy + ' ' + (x.npQ < 0 ? (x.npQ4 > 0 ? 'chuyển sang lỗ ' : 'lỗ ') + ty(-x.npQ) + ' tỷ' : dau(x.gNPq * 100, 0) + ' so với cùng kỳ') + '.'
      : loai === 'thap' ? 'P/E ' + f(x.pe, 1) + ' cao vì LN 4 quý đang thấp — tính trên LN bình quân 5 năm P/E chỉ ' + f(x.peNorm, 1) + ': chưa hẳn đắt. Chưa đủ điều kiện TÍCH CỰC.'
      : 'Chưa đủ điều kiện TÍCH CỰC — vướng: ' + vuong + '.';
    var h = '<div class="kl ' + muc + '">' + tieuDe(TEN3[muc], sub);
    var tg = raw && raw.__tt;
    if (tg) h += '<div class="kltg">Tăng trưởng 2 quý gần nhất: <span class="ttc ' + tg.mau + '">' + tg.nhan + (tg.nhip ? ' · ' + tg.nhip : '') + '</span> LNST công ty mẹ '
      + (tg.B ? tg.B.lb + ' ' + soCk(tg.B.np, tg.B.np0) + ', ' : '') + tg.A.lb + ' ' + soCk(tg.A.np, tg.A.np0) + ' so với cùng kỳ — điểm sáng, điểm tối ở phần Soi BCTC bên dưới.</div>';
    var dn = diemNhan(nm); if (dn.length) h += '<div class="klnh">' + dn.join(' ') + '</div>';
    h += '<ul class="kld">' + dk.map(function(z){ return '<li class="' + (z.ok ? 'ok' : 'no') + '"><b>' + (z.ok ? '✓ ' : '✗ ') + z.ten + '</b> — ' + z.txt
      + (z.kd && !z.ok ? '<div class="mini">' + z.kd + '</div>' : '') + '</li>'; }).join('') + '</ul>';
    if (x.bank && laDat(x)) h += '<div class="kldc">Ngân hàng P/E cao thường do lợi nhuận tạm giảm (trích lập dự phòng). Lịch sử nhóm này không kém thị trường nên mô hình không xếp vào "đắt" — nhưng chưa đạt điều kiện TÍCH CỰC.</div>';
    // Vung gia: P/E, PEG ti le thuan voi gia; dinh 12 thang co dinh trong thang -> khoang gia cho ket luan CO voi BCTC hien tai
    var bctcOk = x.pe != null && x.peg != null && x.gNPq != null && x.gNPq >= 0 && !b && !ngoai && p;
    var vg = '';
    if (bctcOk) {
      var tren = Math.min(p * 15 / x.pe, p / x.peg), duoi = hiG ? 0.8 * hiG : 0;
      if (duoi < tren) vg = 'Với BCTC hiện tại, mô hình là <b>TÍCH CỰC khi giá trong khoảng ' + f(duoi, 2) + ' – ' + f(tren, 2) + '</b>'
        + (loai === 'tc' ? ' — giá hôm nay nằm trong vùng này.' : (p < duoi ? ' — giá hôm nay thấp hơn vùng (đã rơi quá 20% từ đỉnh 12 tháng).' : ' — giá hôm nay đã cao hơn vùng.'))
        + ' Trên ' + f(tren, 2) + ': ' + (p * 15 / x.pe <= p / x.peg ? 'P/E chạm 15' : 'PEG vượt 1') + (duoi ? '; dưới ' + f(duoi, 2) + ': giá rơi quá 20% từ đỉnh 12 tháng.' : '.');
      else vg = 'Không có mức giá nào thỏa cùng lúc: muốn P/E < 15 và PEG ≤ 1 giá phải ≤ ' + f(tren, 2) + ', nhưng như vậy đã rơi quá 20% so với đỉnh 12 tháng (' + f(hiG, 2) + ').';
    } else if (loai === 'dat') {
      var nguong = p * Math.min(25 / x.pe, Math.max(20 / x.pe, x.peg ? 2.5 / x.peg : Infinity));
      vg = 'Ra khỏi vùng "đắt" khi giá dưới ' + f(nguong, 2) + ' (' + dau((nguong / p - 1) * 100, 0) + ' so với hôm nay)'
        + (laSap(x) ? ', nhưng LN quý đang sụt nên vẫn TIÊU CỰC cho tới BCTC quý mới.' : ' → về KHẢ QUAN, với BCTC hiện tại.');
    } else {
      var bc = dk.filter(function(z){ return !z.ok && !z.gia && !z.tk; });
      if (ngoai) vg = 'Thanh khoản ngoài phạm vi kiểm định — mô hình không xếp TÍCH CỰC cho mã này ở bất kỳ mức giá nào.';
      else if (bc.length) vg = 'Kết luận không đổi theo giá cho tới khi có BCTC quý mới: vướng ' + bc.map(function(z){ return thuong(z.ten); }).join('; ') + '.';
    }
    if (vg) h += '<div class="kldc">' + vg + '</div>';
    // Thong tin ngoai: trang thai thi truong tab Toan canh (TQ.tt.S: 0 Quan sat, 1 Tich cuc, 2 Than trong) — chi kem ket luan CO
    var S = window.TQ && window.TQ.tt && window.TQ.tt.S, st = (S && S.length) ? S[S.length - 1][1] : null;
    if (loai === 'tc' && st != null && KD.tt[st]) h += '<div class="kltt t' + st + '">Toàn cảnh thị trường hôm nay: <b class="pl" onclick="window.showView&&window.showView(\'tq\')">' + ['QUAN SÁT', 'TÍCH CỰC', 'THẬN TRỌNG'][st] + '</b> — ' + KD.tt[st] + '</div>';
    h += '<div class="klkd">' + (muc === 'tc' ? KD.tc + '<br>' + KD.dm : muc === 'tcu' ? KD.tcu + '<br>' + (loai === 'dat' ? KD.dat : KD.sap) : KD.kq + (loai === 'thap' ? '<br>' + KD.thap : '')) + '</div>';
    // Lich su ket luan tren chinh ma: cuoi moi quy, 5 nam
    var ds = [];
    for (var i = Math.max(11, nm.iC - 63); i < nm.ls.length && i < nm.iC; i++) {
      if (+nm.thang[i].slice(5, 7) % 3) continue; var z = nm.ls[i]; if (!z) continue;
      var lo = muc3(phanLoai(z, nganh)), j6 = i + 6, sau = null, den = false;
      if (j6 < nm.A.length && nm.A[j6] && (j6 < nm.iC)) sau = nm.A[j6] / nm.A[i] - 1; else if (nm.A[i]) { sau = nm.gDc / nm.A[i] - 1; den = true; }
      ds.push('<span class="lk ' + lo + '" title="P/E ' + (z.pe != null ? f(z.pe, 1) : '—') + ' · PEG ' + (z.peg != null ? f(z.peg, 2) : '—') + ' · LN quý ' + (z.gNPq != null ? dau(z.gNPq * 100, 0) : '—')
        + ' · ' + (z.dHi52 != null ? f((1 + z.dHi52) * 100, 0) + '% đỉnh 12T' : '') + '"><b>' + thangVn(nm.thang[i]).replace('/20', '/') + '</b> ' + TEN3[lo]
        + (sau != null ? ' <i class="' + mau(sau) + '">' + dau(sau * 100, 0) + (den ? '*' : '') + '</i>' : '') + '</span>');
    }
    if (ds.length) h += '<details class="klls"><summary>Mô hình trên chính ' + esc(t) + ' — khuyến nghị cuối mỗi quý và giá 6 tháng sau</summary><div class="lks">' + ds.join('') + '</div>'
      + '<div class="mini">Tính lại bằng đúng quy tắc trên, chỉ dùng BCTC đã công bố tại thời điểm đó. Số sau khuyến nghị = thay đổi giá (đã điều chỉnh) 6 tháng sau, chưa trừ thị trường; * = đến hôm nay.</div></details>';
    // Bao cao CTCK: tham khao
    var bcx = ptBaoCao(raw, p);
    if (bcx && bcx.ds.length) {
      var dsb = bcx.ds.slice(0, 6);
      h += '<details class="klbc"><summary>Báo cáo CTCK gần nhất (' + bcx.g3.length + ' trong 3 tháng' + (bcx.n >= 2 ? ', giá mục tiêu trung vị ' + f(bcx.tv, 1) + ' — ' + dau(bcx.up, 0) : '') + ') · tham khảo</summary><table class="ptn">'
        + dsb.map(function(z){ var up = (z.tp && p > 0) ? (z.tp / 1000 / p - 1) * 100 : null;
          return '<tr' + (Date.now() - z.ts > NGAY90 ? ' class="cu"' : '') + '><td style="white-space:nowrap">' + esc(z.d) + '</td><td><b>' + esc(z.s) + '</b> · ' + esc(z.r) + '<div class="mini">'
            + (z.l ? '<a href="' + esc(z.l) + '" target="_blank" rel="noopener">' + esc(z.ti) + ' ↗</a>' : esc(z.ti)) + '</div></td><td>' + (z.tp ? f(z.tp / 1000, 1) : '—') + '</td><td class="' + mau(up) + '">' + (up == null ? '' : dau(up, 0)) + '</td></tr>'; }).join('')
        + '</table><div class="mini">' + KD.bc + '</div></details>';
    }
    h += '<div class="mini" style="margin-top:6px">Kết luận tự động theo quy tắc cố định (rule-based), tính lại mỗi khi giá đổi và khi có BCTC quý mới; 77% số lần TÍCH CỰC và 86% số lần TIÊU CỰC giữ nguyên sang tháng sau. '
      + 'Kiểm định trên 1.628 mã (gồm mã đã hủy niêm yết) 2014 – 10/2026, chỉ dùng BCTC đã công bố tại từng thời điểm. Lịch sử không bảo đảm tương lai. Nguồn: BCTC + giá VNDirect, báo cáo CTCK qua Simplize.</div></div>';
    return h;
  }

  /* The "Dinh gia theo gia hom nay": ket luan CO/KHONG + P/E song so voi dai P/E 5 nam cua chinh ma + cau chuyen LN vs gia 12 thang.
     Ve lai khi gia song doi (vong lap 700ms) -> khach thay ket luan va muc dat/re thay doi theo tung phien. */
  function dinhGiaHtml(t, raw){
    if (!raw || !raw.lsQ || !raw.gia) return '<div class="kl khong"><div class="kls">Chưa tải được lịch sử BCTC quý / giá để kết luận — mở lại mã để thử lại.</div></div>';
    var r = hang(t) || {}, gSong = r.p > 0 ? r.p : null, ngay = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
    var nm = null; try { nm = nmTinh(raw.lsQ, raw.gia, gSong, ngay); } catch(e){ console.warn('nmTinh', e); }
    window.__nmLast = { t: t, nm: nm };
    var h = '';
    try { h += ketLuanHtml(t, nm, raw); } catch(e){ console.warn('ketLuan', e); }
    if (!nm) return h;
    h += '<div class="dg" id="ptDg"><div class="dgh"><b>Định giá theo giá hôm nay</b><span class="mini">giá ' + f(gSong || raw.gia[raw.gia.length - 1][2], 2) + ' · LN 4 quý đến ' + nm.quy + '</span></div>';
    if (nm.pe == null) {
      h += '<div class="mini">LNST công ty mẹ 4 quý ' + (nm.npT != null && nm.npT <= 0 ? 'âm' : 'chưa đủ số') + ' — không tính được P/E.</div></div>';
      return h;
    }
    var ls = nm.peLs.filter(function(x){ return x != null; });
    // thang do: P5 – min(P95, 3 x trung vi) — bo cac thang LN sap (P/E vai tram) de dai 20–80% con nhin thay
    var hiTho = nm.peP95 != null ? nm.peP95 : nm.pe, tran = nm.peP50 != null ? 3 * nm.peP50 : hiTho, cat = hiTho > tran && nm.pe < tran;
    var lo = Math.min(nm.peP05 != null ? nm.peP05 : nm.pe, nm.pe), hi = Math.max(cat ? tran : hiTho, nm.pe), w = hi - lo || 1;
    var vt = function(v){ return Math.max(0, Math.min(100, (v - lo) / w * 100)); };
    var muc = nm.pePct == null ? null : (nm.pePct <= 0.2 ? ['re', 'Thấp so với 5 năm của mã'] : (nm.pePct >= 0.8 ? ['dat', 'Cao so với 5 năm của mã'] : ['tb', 'Quanh mức thường của mã']));
    h += '<div class="dgv"><span class="dgpe">P/E ' + f(nm.pe, 1) + '</span>' + (muc ? '<span class="pm tb">' + muc[1] + '</span>' : '')
      + (nm.pePct != null ? '<span class="mini">cao hơn ' + f(nm.pePct * 100, 0) + '% số tháng trong 5 năm</span>' : '<span class="mini">chưa đủ 2 năm lịch sử để so</span>') + '</div>';
    if (ls.length >= 24) {
      h += '<div class="dgbar"><div class="dgband" style="left:' + vt(nm.peP20) + '%;width:' + (vt(nm.peP80) - vt(nm.peP20)) + '%"></div>'
        + '<div class="dgmed" style="left:' + vt(nm.peP50) + '%"></div><div class="dgnow" style="left:' + vt(nm.pe) + '%"></div></div>'
        + '<div class="dgsc"><span>' + f(lo, 1) + '</span><span>20–80% thời gian: ' + f(nm.peP20, 1) + '–' + f(nm.peP80, 1) + ' · trung vị ' + f(nm.peP50, 1) + '</span><span>' + f(hi, 1) + (cat ? '+' : '') + '</span></div>';
    }
    var cau = [];
    if (nm.decel != null && nm.decel >= 0.25 && nm.gNP != null) cau.push('Tăng trưởng LN 4 quý đang chậm lại: ' + dau(cap3(nm.gNP) * 100, 0) + ', thấp hơn ' + f(nm.decel * 100, 0) + ' điểm % so với mức cao nhất 3 quý trước.');
    if (cau.length) h += '<ul class="dgc">' + cau.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>';
    h += '<div class="mini" style="margin-top:6px">P/E cao hay thấp so với lịch sử của chính mã <b>không</b> dự báo được giá (kiểm định 2014 – 2026: chênh lệch ~0); mô hình kết luận dùng P/E tuyệt đối và PEG.</div>';
    h += '</div>';
    return h;
  }
  var NGAY90 = 90 * 86400000;
  function ngayBc(s){ var p = String(s || '').split('/'); return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]).getTime() : 0; }
  function loaiKN(s){ var u = String(s || '').toUpperCase();
    if (/KÉM KHẢ QUAN|KEM KHA QUAN|GIẢM TỶ TRỌNG|UNDERPERFORM|UNDERWEIGHT|BÁN|SELL/.test(u)) return -1;
    if (/MUA|KHẢ QUAN|TĂNG TỶ TRỌNG|OUTPERFORM|BUY|OVERWEIGHT|TÍCH CỰC/.test(u)) return 1; return 0; }
  function ptBaoCao(raw, gia){
    if (!raw.bc) return null;
    var now = Date.now(), ds = raw.bc.map(function(x){ return Object.assign({ ts: ngayBc(x.d), k: loaiKN(x.r) }, x); }).sort(function(a, b){ return b.ts - a.ts; });
    var g3 = ds.filter(function(x){ return now - x.ts <= NGAY90; }), co = g3.filter(function(x){ return x.tp; });
    var truoc = ds.filter(function(x){ return now - x.ts > NGAY90 && now - x.ts <= 3 * NGAY90 && x.tp; });
    var tv = trungVi(co.map(function(x){ return x.tp / 1000; })), tv0 = trungVi(truoc.map(function(x){ return x.tp / 1000; }));
    var nang = g3.filter(function(x){ return /nâng (dự phóng|giá mục tiêu|khuyến nghị)/i.test(x.ti); }).length, ha = g3.filter(function(x){ return /hạ (dự phóng|giá mục tiêu|khuyến nghị)|giảm dự phóng/i.test(x.ti); }).length;
    return { ds: ds, g3: g3, n: co.length, mua: g3.filter(function(x){ return x.k > 0; }).length, ban: g3.filter(function(x){ return x.k < 0; }).length,
      tv: tv, up: (tv && gia > 0) ? (tv / gia - 1) * 100 : null, tv0: tv0, xuHuong: (tv && tv0) ? (tv / tv0 - 1) * 100 : null, nang: nang, ha: ha, cuoi: ds[0] || null };
  }

  /* ---------- Ve ---------- */
  function css(){
    if (document.getElementById('ptCss')) return;
    var st = document.createElement('style'); st.id = 'ptCss';
    st.textContent =
      '#ptcs{margin-top:14px;border:1px solid var(--border);border-radius:12px;padding:14px 16px;background:#fff}'
      + '#ptcs .pth{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:10px}#ptcs .pth b{font-size:15px}'
      + '#ptcs .ptp{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:12px}'
      + '@media (max-width:1100px){#ptcs .ptp{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:560px){#ptcs .ptp{grid-template-columns:1fr}}'
      + '#ptcs .ptc{border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--panel2);min-width:0}'
      + '#ptcs .ptc .pk{display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}'
      + '#ptcs .ptc .py{font-size:12.5px;line-height:1.5;margin-top:6px;color:var(--text)}'
      + '#ptcs .pm{font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px;text-transform:none;letter-spacing:0;white-space:nowrap}'
      + '#ptcs .pm.tot{background:var(--green-soft);color:var(--green-dark)}#ptcs .pm.tb{background:var(--amber-soft);color:#B45309}'
      + '#ptcs .pm.yeu{background:var(--red-soft);color:var(--red)}#ptcs .pm.na{background:#eef0f3;color:#6b7280}'
      + '#ptcs .pt3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:12px}@media (max-width:900px){#ptcs .pt3{grid-template-columns:1fr}}'
      + '#ptcs .ptb{border:1px solid var(--border);border-radius:10px;padding:10px 12px;min-width:0;overflow-x:auto}'
      + '#ptcs .ptb h4{margin:0 0 6px;font-size:13px}#ptcs .ptb ul{margin:0;padding-left:18px;font-size:12.5px;line-height:1.55}'
      + '#ptcs .ptb li.ok::marker{color:var(--green)}#ptcs .ptb li.no::marker{color:var(--red)}#ptcs .ptb li.na{color:var(--muted)}'
      + '#ptcs .fs{font-size:22px;font-weight:800}#ptcs .fs small{font-size:13px;color:var(--muted);font-weight:600}'
      + '#ptcs table.ptt{width:100%;border-collapse:collapse;font-size:12.5px}#ptcs table.ptt th,#ptcs table.ptt td{padding:5px 8px;text-align:right;border-bottom:1px solid var(--border);white-space:nowrap}'
      + '#ptcs table.ptt td:first-child,#ptcs table.ptt th:first-child{text-align:left;white-space:normal;min-width:150px}'
      + '#ptcs table.ptt tr.sec td{background:var(--panel2);font-weight:700;font-size:11.5px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted)}'
      + '#ptcs table.ptt td.g{font-size:11px}#ptcs table.ptt .ttm{background:#f6f9ff}'
      + '#ptcs table.ptn{width:100%;border-collapse:collapse;font-size:12.5px}#ptcs table.ptn td{padding:4px 4px;border-bottom:1px solid var(--border)}#ptcs table.ptn td+td{text-align:right}'
      + '#ptcs .pl{cursor:pointer;color:var(--blue);font-weight:700}'
      + '#ptcs .soi{border:1px solid var(--border);border-left:4px solid var(--blue);border-radius:10px;padding:10px 14px 6px;margin-bottom:12px;background:#fbfcff}'
      + '#ptcs h3{margin:0 0 8px;font-size:14px}#ptcs .pth3{margin:4px 0 8px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}'
      + '#ptcs ul.sl{list-style:none;margin:0;padding:0}#ptcs ul.sl li{display:flex;gap:9px;align-items:flex-start;font-size:13px;line-height:1.55;padding:5px 0;border-top:1px dashed var(--border)}#ptcs ul.sl li:first-child{border-top:0}'
      + '#ptcs .sd{flex:none;width:9px;height:9px;border-radius:50%;margin-top:6px}#ptcs .sd.up{background:var(--green)}#ptcs .sd.dn{background:var(--red)}#ptcs .sd.fl{background:#9aa3ae}'
      + '#ptcs .bar{height:9px;border-radius:3px;min-width:2px}#ptcs .bar.up{background:var(--green)}#ptcs .bar.dn{background:var(--red);margin-left:auto}'
      + '#ptcs table.ptcau td{padding:4px 4px}#ptcs table.ptpeer td,#ptcs table.ptpeer th{text-align:right;padding:4px}#ptcs table.ptpeer td:first-child,#ptcs table.ptpeer th:first-child{text-align:left}'
      + '#ptcs table.ptpeer th{font-size:11px;color:var(--muted);font-weight:600}#ptcs tr.me td{background:#fff8e6;font-weight:700}'
      + '#ptcs .kl{border-radius:12px;padding:12px 14px;margin-bottom:12px;border:2px solid}#ptcs .kl.tc{border-color:var(--green);background:var(--green-soft)}#ptcs .kl.kq{border-color:#9fb6d8;background:#f4f7fc}#ptcs .kl.tcu{border-color:var(--red);background:var(--red-soft)}'
      + '#ptcs .klh{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}#ptcs .klv{font-size:22px;font-weight:800}#ptcs .kl.tc .klv b{color:var(--green-dark)}#ptcs .kl.kq .klv b{color:#2f5597}#ptcs .kl.tcu .klv b{color:var(--red)}'
      + '#ptcs .kls{font-size:13px;font-weight:600}#ptcs ul.kld{list-style:none;margin:8px 0 0;padding:0}#ptcs ul.kld li{font-size:12.5px;line-height:1.55;padding:4px 0;border-top:1px dashed rgba(0,0,0,.08)}'
      + '#ptcs ul.kld li.ok b{color:var(--green-dark)}#ptcs ul.kld li.no b{color:var(--red)}#ptcs .kldc{margin-top:8px;font-size:13px;line-height:1.55;background:#fff;border-radius:8px;padding:8px 10px}'
      + '#ptcs .klnh{margin-top:6px;font-size:13px;line-height:1.55}#ptcs .kltg{margin-top:8px;font-size:13px;line-height:1.7}#ptcs .ttc{display:inline-block;font-size:11.5px;font-weight:800;padding:1px 9px;border-radius:999px;vertical-align:1px;white-space:nowrap}#ptcs .ttc.tc{background:var(--green-soft);color:var(--green-dark)}#ptcs .ttc.kq{background:#e8eef8;color:#2f5597}#ptcs .ttc.tcu{background:var(--red-soft);color:var(--red)}#ptcs .st2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:6px 0 8px}@media (max-width:760px){#ptcs .st2{grid-template-columns:1fr}}#ptcs .st2>div{border-radius:10px;padding:8px 12px;background:#fff;border:1px solid var(--border);min-width:0}#ptcs .st2 .sang{border-top:3px solid var(--green)}#ptcs .st2 .toi{border-top:3px solid var(--red)}#ptcs .st2 h4,#ptcs .nd h4{margin:0 0 4px;font-size:13px}#ptcs .st2 .sang h4{color:var(--green-dark)}#ptcs .st2 .toi h4{color:var(--red)}#ptcs .st2 ul,#ptcs .nd ul,#ptcs details.sgc ul{margin:0;padding-left:18px;font-size:12.8px;line-height:1.55}#ptcs .st2 li,#ptcs .nd li{margin:3px 0}#ptcs .nd{border-radius:10px;padding:8px 12px;background:#fff;border:1px solid var(--border);border-left:4px solid var(--blue);margin-bottom:8px}#ptcs details.sgc{margin-bottom:6px;font-size:12.5px}#ptcs details.sgc summary{cursor:pointer;color:var(--muted)}#ptcs table.pt2q td{text-align:right;white-space:nowrap}#ptcs table.pt2q td:first-child{text-align:left;white-space:normal;min-width:130px}@media (max-width:560px){#ptcs table.pt2q{font-size:11.5px}#ptcs table.pt2q td{padding:4px 3px}}#ptcs .kltt{margin-top:8px;font-size:12.5px;line-height:1.55;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid var(--border)}#ptcs .kltt.t1{border-color:var(--green)}#ptcs .kltt.t2{border-color:var(--red);background:#fff7f7}#ptcs .klkd{margin-top:8px;font-size:12.5px;line-height:1.55;padding:8px 10px;border-left:3px solid var(--blue);background:#fff;border-radius:0 8px 8px 0}#ptcs details.klls{margin-top:8px;background:#fff;border-radius:8px;padding:6px 10px}#ptcs details.klls summary{cursor:pointer;font-size:12.5px;font-weight:700}#ptcs .lks{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 6px}#ptcs .lk{font-size:11.5px;padding:3px 8px;border-radius:999px;background:#eef0f3;color:#4b5563;white-space:nowrap}#ptcs .lk.tc{background:var(--green-soft);color:var(--green-dark)}#ptcs .lk.tcu{background:var(--red-soft);color:var(--red)}#ptcs .lk.kq{background:#eef3fb;color:#3b5b8c}#ptcs .lk i{font-style:normal;font-weight:700}#ptcs details.klbc{margin-top:8px;background:#fff;border-radius:8px;padding:6px 10px;overflow-x:auto}#ptcs details.klbc td{word-break:break-word}#ptcs details.klbc td:nth-child(2){text-align:left}#ptcs .kl,#ptcs .soi{min-width:0;overflow-wrap:anywhere}#ptcs details.klbc summary{cursor:pointer;font-size:12.5px;font-weight:700}#ptcs details.klbc td{vertical-align:top}#ptcs tr.cu{opacity:.55}#ptcs details.klbc a{color:var(--muted);text-decoration:none}'
      + '#ptcs .dg{border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:12px;background:#fff}#ptcs .dgh{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:6px}'
      + '#ptcs .dgv{display:flex;gap:10px;align-items:center;flex-wrap:wrap}#ptcs .dgpe{font-size:22px;font-weight:800}'
      + '#ptcs .dgbar{position:relative;height:14px;margin:12px 4px 4px;background:var(--panel2);border-radius:7px}#ptcs .dgband{position:absolute;top:0;bottom:0;background:#dbe6f7;border-radius:7px}'
      + '#ptcs .dgmed{position:absolute;top:-3px;bottom:-3px;width:2px;background:#7A828E}#ptcs .dgnow{position:absolute;top:-5px;width:14px;height:24px;margin-left:-7px;border-radius:7px;background:var(--blue);border:2px solid #fff;box-shadow:0 0 0 1px var(--blue)}'
      + '#ptcs .dgsc{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:var(--muted);margin:2px 4px 0}#ptcs ul.dgc{margin:10px 0 0;padding-left:18px;font-size:13px;line-height:1.55}'
      + '.kn-app #ptcs{border:0;border-radius:15px;padding:14px 16px;margin:0 14px 12px;box-shadow:var(--ksh)}';
    document.head.appendChild(st);
  }
  function hop(){
    var el = document.getElementById('ptcs');
    var ff = document.getElementById('finFull');
    if (!ff || !ff.parentElement) return null;
    if (!el) { el = document.createElement('div'); el.id = 'ptcs'; css(); }
    if (ff.nextElementSibling !== el) ff.parentElement.insertBefore(el, ff.nextSibling);
    return el;
  }
  var MUC = { tot: 'Tốt', tb: 'Trung bình', yeu: 'Yếu', na: 'Chưa chấm' };
  var MUC_DG = { tot: 'Hấp dẫn', tb: 'Hợp lý', yeu: 'Đắt', na: 'Chưa chấm' };
  function bang(d){
    var C = d.cols.slice(-5), T = d.ttm, all = T ? C.concat([T]) : C;
    var R = [];
    var sec = function(t){ R.push({ sec: t }); };
    var row = function(t, k, fm, g){ R.push({ t: t, k: k, fm: fm, g: g }); };
    if (d.loai === 'nh') {
      sec('Kết quả kinh doanh');
      row('Tổng thu nhập hoạt động (TOI, tỷ)', 'dt', ty, 'gDt');
      row('Thu nhập lãi thuần (tỷ)', 'nii', ty); row('Lãi thuần dịch vụ (tỷ)', 'dv', ty);
      row('LN trước dự phòng (tỷ)', 'ppop', ty); row('Chi phí dự phòng (tỷ)', 'dp', ty);
      row('LNST công ty mẹ (tỷ)', 'npm', ty, 'gNp'); row('EPS (đồng)', 'eps', function(v){ return f(v, 0); }, 'gEps');
      sec('Bảng cân đối');
      row('Cho vay khách hàng (tỷ)', 'loan', ty, 'gLoan'); row('Tiền gửi khách hàng (tỷ)', 'dep', ty, 'gDep');
      row('Tổng tài sản (tỷ)', 'ta', ty); row('Vốn chủ sở hữu (tỷ)', 'eq', ty);
      sec('Chỉ số');
      row('ROE (%)', 'roe', ph); row('ROA (%)', 'roa', function(v){ return ph(v, 2); });
      row('Thu nhập lãi/TOI (%)', 'niiTy', ph); row('CIR — chi phí/TOI (%)', 'cir', ph);
      row('Chi phí dự phòng/dư nợ BQ (%)', 'cc', function(v){ return ph(v, 2); }); row('Dự phòng/dư nợ (%)', 'llr', function(v){ return ph(v, 2); });
      row('Cho vay/tiền gửi KH (%)', 'ldr', ph); row('VCSH/Tổng tài sản (%)', 'eqTa', ph);
    } else {
      sec('Kết quả kinh doanh');
      row('Doanh thu thuần (tỷ)', 'dt', ty, 'gDt'); row('Lợi nhuận gộp (tỷ)', 'gp', ty);
      row('Biên LN gộp (%)', 'gm', ph); row('Biên LN thuần HĐKD (%)', 'opm', ph);
      row('LNST công ty mẹ (tỷ)', 'npm', ty, 'gNp'); row('Biên LNST (%)', 'nm', ph);
      row('EPS (đồng)', 'eps', function(v){ return f(v, 0); }, 'gEps');
      sec('Hiệu quả & DuPont');
      row('ROE cổ đông mẹ (%)', 'roe', ph); row('ROA (%)', 'roa', ph);
      row('Vòng quay tài sản (lần)', 'vq', lan); row('Đòn bẩy — TS/VCSH (lần)', 'db', lan);
      row('Số ngày phải thu', 'dso', function(v){ return f(v, 0); }); row('Số ngày tồn kho', 'dio', function(v){ return f(v, 0); });
      row('LN liên doanh, liên kết/LNTT (%)', 'lk', function(v){ return v == null ? '—' : f(v * 100, 0) + '%'; });
      sec('Cân đối & nợ');
      row('Tổng tài sản (tỷ)', 'ta', ty); row('Vốn chủ sở hữu (tỷ)', 'eq', ty);
      row('Nợ vay (tỷ)', 'vay', ty); row('Tiền + đầu tư ngắn hạn (tỷ)', 'tien', ty);
      row('Nợ vay ròng/VCSH (lần)', 'ndE', lan); row('Thanh toán hiện hành (lần)', 'hh', lan);
      row('LN trước thuế & lãi vay/lãi vay (lần)', 'icr', function(v){ return v == null ? '—' : f(v, 1); });
      sec('Dòng tiền (năm)');
      row('Dòng tiền kinh doanh (tỷ)', 'cfo', ty); row('Mua sắm TSCĐ (tỷ)', 'capex', ty);
      row('Dòng tiền tự do (tỷ)', 'fcf', ty); row('Dòng tiền KD/LNST (lần)', 'cfoNp', lan);
      row('Cổ tức tiền mặt đã trả (tỷ)', 'ctuc', ty);
    }
    // CTCK/bao hiem: tien, phai thu, vay ky quy la tai san kinh doanh -> bo cac ty le kieu doanh nghiep thuong
    var BO = d.loai === 'khac' ? ['ndE','hh','icr','dso','dio','tien','fcf','cfoNp','capex'] : [];
    var co = function(k){ return BO.indexOf(k) < 0 && all.some(function(c){ return c[k] != null && !(k === 'lk' && Math.abs(c[k]) < 0.01); }); };
    var h = '<tr><th></th>' + all.map(function(c){ return '<th' + (c.ttm ? ' class="ttm" title="Cộng 4 quý gần nhất; cân đối lấy quý cuối"' : '') + '>' + esc(c.ttm ? c.lb : 'FY' + c.lb) + '</th>'; }).join('') + '</tr>';
    var dangSec = null;
    R.forEach(function(x){
      if (x.sec) { dangSec = x.sec; return; }
      if (!co(x.k)) return;
      if (dangSec) { h += '<tr class="sec"><td colspan="' + (all.length + 1) + '">' + dangSec + '</td></tr>'; dangSec = null; }
      h += '<tr><td>' + x.t + '</td>' + all.map(function(c){ return '<td' + (c.ttm ? ' class="ttm"' : '') + '>' + x.fm(c[x.k]) + '</td>'; }).join('') + '</tr>';
      if (x.g && all.some(function(c){ return c[x.g] != null; }))
        h += '<tr><td class="g mini">&nbsp;&nbsp;tăng trưởng</td>' + all.map(function(c){ var v = c[x.g];
          return '<td class="g ' + mau(v) + (c.ttm ? ' ttm' : '') + '">' + (v == null ? '—' : dau(v, 1)) + '</td>'; }).join('') + '</tr>';
    });
    return '<table class="ptt">' + h + '</table>';
  }
  function ptVe(t, d, raw){
    var el = hop(); if (!el) return;
    var C = d.cols, L = C[C.length - 1], r = hang(t) || {};
    var cham = ptCham(t, d), fsc = d.loai === 'dn' ? ptFscore(C) : null, co = ptCo(d), ng = ptNganh(t), ls = ptLichSuDinhGia(t);
    ptCoRts = !!ls;
    var h = '<div class="pth"><b>Phân tích cơ bản chuyên sâu</b><span class="mini">' + esc(t) + ' · BCTC năm FY' + C[Math.max(0, C.length - 5)].lb + '–FY' + L.lb
      + (d.ttm ? ' + 4 quý đến Q' + d.ttm.o.q + '/' + d.ttm.o.y : '') + ' · nguồn VNDirect'
      + (d.loai === 'nh' ? ' · mô hình ngân hàng' : (d.loai === 'khac' ? ' · mô hình CTCK/bảo hiểm' : '')) + '</span></div>';
    var sv = null;
    if (raw) { try { sv = ptSoi(t, raw, d.loai); } catch(e){ console.warn('ptSoi', e); }
      try { raw.__tt = tangTruong(sv); } catch(e){ console.warn('tangTruong', e); raw.__tt = null; } }
    if (raw) h += '<div id="ptDgO">' + dinhGiaHtml(t, raw) + '</div>';
    if (raw) h += soiHtml(t, raw, d, sv);
    h += '<h3 class="pth3">Chấm điểm 5 năm</h3><div class="ptp">' + cham.map(function(x){ var nh = x.dinhGia ? MUC_DG : MUC;
      return '<div class="ptc"><div class="pk"><span>' + x.ten + '</span><span class="pm ' + x.m + '">' + nh[x.m] + '</span></div><div class="py">' + x.y + '</div></div>'; }).join('') + '</div>';
    // Hang 2: F-score / diem manh-yeu / dinh gia & nganh
    var b1;
    if (fsc) {
      b1 = '<div class="ptb"><h4>Piotroski F-score năm ' + fsc.nam + '</h4><div class="fs">' + fsc.d + '<small> / ' + fsc.n + ' tiêu chí đạt</small></div><ul>'
        + fsc.ds.map(function(x){ return '<li class="' + (x.ok == null ? 'na' : (x.ok ? 'ok' : 'no')) + '">' + (x.ok == null ? '' : (x.ok ? '✓ ' : '✗ ')) + x.ten + (x.ok == null ? ' — thiếu số' : '') + '</li>'; }).join('')
        + '</ul><div class="mini" style="margin-top:6px">≥ 7: nền tài chính đang cải thiện; ≤ 3: đang xấu đi (so năm ' + fsc.nam + ' với năm trước).</div></div>';
    } else {
      var L2 = L;
      b1 = '<div class="ptb"><h4>' + (d.loai === 'nh' ? 'Cấu trúc thu nhập năm ' : 'Tóm tắt năm ') + L2.lb + '</h4><ul>'
        + (d.loai === 'nh'
          ? '<li>Thu nhập lãi thuần: ' + ty(L2.nii) + ' tỷ (' + ph(L2.niiTy, 0) + ' TOI)</li><li>Lãi thuần dịch vụ: ' + ty(L2.dv) + ' tỷ</li><li>LN trước dự phòng: ' + ty(L2.ppop) + ' tỷ</li><li>Chi phí dự phòng: ' + ty(L2.dp) + ' tỷ</li>'
          : '<li>Doanh thu: ' + ty(L2.dt) + ' tỷ</li><li>LNST mẹ: ' + ty(L2.npm) + ' tỷ</li><li>Tổng tài sản: ' + ty(L2.ta) + ' tỷ</li><li>VCSH/Tổng tài sản: ' + ph(L2.eqTa) + '</li>')
        + '</ul></div>';
    }
    var b2 = '<div class="ptb"><h4>Điểm mạnh</h4><ul>' + (co.tot.length ? co.tot.map(function(x){ return '<li class="ok">' + x + '</li>'; }).join('') : '<li class="na">Chưa có điểm nổi bật theo bộ lọc.</li>') + '</ul>'
      + '<h4 style="margin-top:10px">Cần lưu ý</h4><ul>' + (co.xau.length ? co.xau.map(function(x){ return '<li class="no">' + x + '</li>'; }).join('') : '<li class="na">Không có cờ đỏ theo bộ lọc.</li>') + '</ul></div>';
    var b3 = '<div class="ptb"><h4>Định giá & so với ngành' + (ng && ng.sec ? ' <span class="mini">(' + esc(ng.sec) + ', ' + ng.n + ' mã)</span>' : '') + '</h4>';
    if (ng && ng.n >= 3) {
      var dong = function(ten, a, b, fm){ return '<tr><td>' + ten + '</td><td><b>' + fm(a) + '</b></td><td class="mini">' + fm(b) + '</td></tr>'; };
      b3 += '<table class="ptn"><tr><td></td><td class="mini">' + esc(t) + '</td><td class="mini">Trung vị ' + ng.n + ' mã khác</td></tr>'
        + dong('P/E', r.pe, ng.pe, lan) + dong('P/B', r.pb, ng.pb, lan)
        + dong('+/- LN quý gần nhất', r.npatYoY, ng.npatYoY, function(v){ return dau(v, 0); })
        + dong('LN tăng TB 3 năm', r.cagr3, ng.cagr3, function(v){ return dau(v, 0); })
        + dong('Tỷ suất cổ tức (%)', r.dy, ng.dy, function(v){ return ph(v); }) + '</table>';
      var cung = ng.rows.filter(function(x){ return x.t !== t && x.cap; }).sort(function(a, b){ return b.cap - a.cap; }).slice(0, 5);
      if (cung.length) b3 += '<div class="mini" style="margin-top:6px">Cùng ngành: ' + cung.map(function(x){ return '<span class="pl" data-t="' + esc(x.t) + '">' + esc(x.t) + '</span> <span class="mini">P/E ' + lan(x.pe) + '</span>'; }).join(' · ') + '</div>';
    } else b3 += '<div class="mini">Không đủ mã cùng ngành để so sánh.</div>';
    // Gia tham chieu theo boi so trung vi cua chinh ma (khong phai gia muc tieu)
    var thamChieu = null;
    if (ls && r.p > 0) {
      if (d.loai === 'dn' && ls.pe && d.ttm && d.ttm.eps > 0) thamChieu = { ten: 'EPS 4 quý ' + f(d.ttm.eps, 0) + ' đ × P/E trung vị ' + lan(ls.pe), g: d.ttm.eps * ls.pe / 1000 };
      else if (d.loai === 'dn' && ls.pe && L.eps > 0) thamChieu = { ten: 'EPS FY' + L.lb + ' ' + f(L.eps, 0) + ' đ × P/E trung vị ' + lan(ls.pe), g: L.eps * ls.pe / 1000 };
      else if (d.loai !== 'dn' && ls.pb && L.eqP > 0 && L.von > 0) {
        var bv = (d.ttm && d.ttm.eqP > 0 ? d.ttm.eqP : L.eqP) / (L.von / 1e4);
        thamChieu = { ten: 'Giá trị sổ sách ' + f(bv, 0) + ' đ/cp × P/B trung vị ' + lan(ls.pb), g: bv * ls.pb / 1000 };
      }
    }
    if (thamChieu && isFinite(thamChieu.g)) {
      var lech = (thamChieu.g / r.p - 1) * 100;
      b3 += '<div style="margin-top:8px;padding:8px 10px;background:var(--panel2);border-radius:8px;font-size:12.5px;line-height:1.5">Giá theo bội số trung vị ~4 năm: <b>' + f(thamChieu.g, 1) + '</b> '
        + '<span class="' + mau(lech) + '">(' + dau(lech, 0) + ' so với giá ' + f(r.p, 2) + ')</span><div class="mini">' + thamChieu.ten + ' — mốc tham chiếu, không phải giá mục tiêu.</div></div>';
    }
    b3 += '</div>';
    h += '<div class="pt3">' + b1 + b2 + b3 + '</div>';
    h += '<div style="overflow-x:auto">' + bang(d) + '</div>';
    h += '<div class="mini" style="margin-top:8px;font-style:italic">Chấm tự động theo ngưỡng cố định từ BCTC hợp nhất (VNDirect) và bảng giá — không phải khuyến nghị đầu tư. '
      + 'Tăng trưởng: LNST mẹ ≥ 15%/năm và doanh thu ≥ 10%/năm trong 3 năm là Tốt. Sinh lời: ROE bình quân 3 năm ≥ 15% Tốt, &lt; 10% Yếu. '
      + 'Định giá so với trung vị ~4 năm của chính mã và trung vị ngành' + (d.loai !== 'dn' ? ' (dùng P/B cho ngân hàng, CTCK, bảo hiểm)' : '') + '. '
      + 'Cột 4 quý gần nhất không tính dòng tiền vì LCTT quý thường ghi lũy kế.</div>';
    el.innerHTML = h;
    el.style.display = '';
    el.querySelectorAll('.pl').forEach(function(a){ a.onclick = function(){ try { window.openDetail(a.dataset.t); window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(e){} }; });
    ptDaVe = t;
  }
  function ptBao(t, html){ var el = hop(); if (!el) return; el.style.display = ''; el.innerHTML = '<div class="pth"><b>Phân tích cơ bản chuyên sâu</b><span class="mini">' + esc(t) + '</span></div><div class="mini">' + html + '</div>'; }

  async function ptMo(t){
    ptFor = t; ptDaVe = null;
    var el = hop(); if (!el) return;
    if (!hang(t)) { el.style.display = 'none'; el.innerHTML = ''; return; }
    var k = K(), khoa = k ? k.knKhoaPhien(k.KN_MOC_SEC) : null;
    var raw = khoa ? k.knDocCache('kn_pt3_' + t, khoa) : null;
    if (!raw) {
      ptBao(t, 'Đang tải BCTC 5 năm… <span class="spin"></span>');
      var viec = ptTai(t); ptCho = viec;
      try { raw = await viec; } catch(e){ raw = null; }
      if (ptFor !== t) return;
      if (!raw || raw.nam.length < 2) {
        ptBao(t, 'Chưa tải được BCTC năm từ VNDirect' + (raw ? ' (nguồn chỉ có ' + raw.nam.length + ' năm)' : '') + '. <span class="pl" id="ptLai">Thử lại</span>');
        var b = document.getElementById('ptLai'); if (b) b.onclick = function(){ ptMo(t); };
        return;                                   // KHONG ghi cache khi tai hong / thieu
      }
      if (khoa && raw.bc && raw.lsQ && raw.gia) ptLuu(t, khoa, raw);   // mot nguon tai hong -> khong luu, lan sau thu lai
    }
    try { ptVe(t, ptTinh(raw, t), raw); window.__ptLast = { t: t, raw: raw }; }
    catch(e){ console.warn('phantich', e); ptBao(t, 'Lỗi tính chỉ số: ' + esc(e.message)); }
  }
  window.__knPhanTich = ptMo;
  window.__knPtTinh = function(raw, t){ return ptTinh(raw, t); };
  window.__knDinhGia = { tai: function(t){ return nmTai(t); }, tinh: function(q, g, p, d){ return nmTinh(q, g, p, d); }, loai: function(x, n){ return phanLoai(x, n); } };   // de kiem tra

  setInterval(function(){
    try {
      var curT = K() ? K().ma() : null;
      if (!curT || !document.getElementById('finFull')) return;
      if (curT !== ptFor) { ptMo(curT); return; }
      hop();
      // Gia song doi -> ve lai the "Dinh gia theo gia hom nay" (re/dat thay doi trong phien)
      if (ptDaVe === curT && window.__ptLast && window.__ptLast.t === curT) { var rr = hang(curT); var pNow = rr && rr.p;
        if (pNow && pNow !== window.__ptGiaVe) { window.__ptGiaVe = pNow; var o2 = document.getElementById('ptDgO');
          if (o2) { var mo = {}; o2.querySelectorAll('details').forEach(function(x){ if (x.open) mo[x.className] = 1; });
            o2.innerHTML = dinhGiaHtml(curT, window.__ptLast.raw); o2.querySelectorAll('details').forEach(function(x){ if (mo[x.className]) x.open = true; }); } } }
      // Chi so quy (P/E lich su) ve sau BCTC nam -> ve lai mot lan cho o Dinh gia
      if (ptDaVe === curT && !ptCoRts && ptLichSuDinhGia(curT) && window.__ptLast && window.__ptLast.t === curT) ptVe(curT, ptTinh(window.__ptLast.raw, curT), window.__ptLast.raw);
    } catch(e){}
  }, 700);
})();
