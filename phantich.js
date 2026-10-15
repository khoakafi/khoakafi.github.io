/* ===== Phan tich co ban chuyen sau (15/10/2026) =====
   Khoi nam ngay duoi "Tai chinh — 12 quy gan nhat" o tab Chi tiet ma (web + app).
   Nguon: VNDirect finfo financial_statements — BCTC NAM (5 nam) + QUY (4 quy gan nhat), cung nguon du phong cua knFfQuy.
   Cham diem theo NGUONG CO DINH (rule-based), tinh tu BCTC + bang gia. Khong phai mo hinh hoc may, khong phai khuyen nghi.
   Ma chi tieu (do 15/10/2026 tren runner bang do-api2, FPT + VCB):
     CDKT: 11000 TSNH, 11100 tien, 11200 DTTC ngan han, 11300 phai thu NH, 11400 HTK, 12700 tong TS, 13000 no phai tra,
           13100 no NH, 13110 vay NH, 13340 vay DH, 14000 VCSH (GOM co dong thieu so), 14110 von gop, 14240 CD thieu so
     KQKD: 21001 DT thuan, 22100 gia von, 23100 LN gop, 22510 chi phi lai vay, 23110 LN thuan HDKD, 23800 LNTT,
           23003 LNST, 23000 LNST cong ty me, 23001 EPS, 23300 LN lien ket, 22200 QLDN (ngan hang: chi phi hoat dong)
     LCTT: 32000 CFO, 32100 mua TSCD (so am), 33100 thu tu phat hanh CP, 33600 co tuc da tra (so am)
     Ngan hang: 421701 TOI, 421900 thu nhap lai thuan, 423200 lai thuan dich vu, 422900 chi phi du phong,
           88888 LN truoc du phong, 412100 cho vay KH, 412200 du phong cho vay (so am), 413300 tien gui KH
   LCTT theo quy o VN hay ghi LUY KE tu dau nam -> cot "4 quy gan nhat" khong tinh dong tien.
   Cache theo phien (kn_pt_<ma>), CHI ghi khi tai duoc >= 2 nam BCTC (khong bao gio ghi ket qua rong). */
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
  async function ptTai(t){
    var u = function(r){ return K().KN_FF + 'financial_statements?q=code:' + t + '~reportType:' + r + '~itemCode:' + MA + '&sort=fiscalDate:desc&size=' + (r === 'ANNUAL' ? 350 : 400); };
    var kq = await Promise.all([ K().jget(u('ANNUAL')), K().jget(u('QUARTER')).catch(function(){ return { data: [] }; }) ]);
    var nam = gom(kq[0] && kq[0].data);
    // Moi nam tai chinh mot dong (doi nien do -> giu ky moi nhat)
    var theoNam = {}; nam.forEach(function(o){ theoNam[o.y] = o; });
    nam = Object.keys(theoNam).sort().map(function(k){ return theoNam[k]; }).slice(-7);
    return { nam: nam, quy: gom(kq[1] && kq[1].data).slice(-9) };
  }
  function ptLuu(t, khoa, raw){
    try {
      var ds = []; try { ds = JSON.parse(localStorage.getItem('kn_pt__ds') || '[]'); } catch(e){}
      ds = ds.filter(function(x){ return x !== t; }); ds.push(t);
      while (ds.length > 20) { try { localStorage.removeItem('kn_pt_' + ds.shift()); } catch(e){} }
      try { localStorage.setItem('kn_pt_' + t, JSON.stringify({ k: khoa, v: raw })); }
      catch(e){ ds.forEach(function(x){ try { localStorage.removeItem('kn_pt_' + x); } catch(e2){} }); ds = []; }
      localStorage.setItem('kn_pt__ds', JSON.stringify(ds));
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
      + '#ptcs .ptb{border:1px solid var(--border);border-radius:10px;padding:10px 12px;min-width:0}'
      + '#ptcs .ptb h4{margin:0 0 6px;font-size:13px}#ptcs .ptb ul{margin:0;padding-left:18px;font-size:12.5px;line-height:1.55}'
      + '#ptcs .ptb li.ok::marker{color:var(--green)}#ptcs .ptb li.no::marker{color:var(--red)}#ptcs .ptb li.na{color:var(--muted)}'
      + '#ptcs .fs{font-size:22px;font-weight:800}#ptcs .fs small{font-size:13px;color:var(--muted);font-weight:600}'
      + '#ptcs table.ptt{width:100%;border-collapse:collapse;font-size:12.5px}#ptcs table.ptt th,#ptcs table.ptt td{padding:5px 8px;text-align:right;border-bottom:1px solid var(--border);white-space:nowrap}'
      + '#ptcs table.ptt td:first-child,#ptcs table.ptt th:first-child{text-align:left;white-space:normal;min-width:150px}'
      + '#ptcs table.ptt tr.sec td{background:var(--panel2);font-weight:700;font-size:11.5px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted)}'
      + '#ptcs table.ptt td.g{font-size:11px}#ptcs table.ptt .ttm{background:#f6f9ff}'
      + '#ptcs table.ptn{width:100%;border-collapse:collapse;font-size:12.5px}#ptcs table.ptn td{padding:4px 4px;border-bottom:1px solid var(--border)}#ptcs table.ptn td+td{text-align:right}'
      + '#ptcs .pl{cursor:pointer;color:var(--blue);font-weight:700}'
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
  function ptVe(t, d){
    var el = hop(); if (!el) return;
    var C = d.cols, L = C[C.length - 1], r = hang(t) || {};
    var cham = ptCham(t, d), fsc = d.loai === 'dn' ? ptFscore(C) : null, co = ptCo(d), ng = ptNganh(t), ls = ptLichSuDinhGia(t);
    ptCoRts = !!ls;
    var h = '<div class="pth"><b>Phân tích cơ bản chuyên sâu</b><span class="mini">' + esc(t) + ' · BCTC năm FY' + C[Math.max(0, C.length - 5)].lb + '–FY' + L.lb
      + (d.ttm ? ' + 4 quý đến Q' + d.ttm.o.q + '/' + d.ttm.o.y : '') + ' · nguồn VNDirect'
      + (d.loai === 'nh' ? ' · mô hình ngân hàng' : (d.loai === 'khac' ? ' · mô hình CTCK/bảo hiểm' : '')) + '</span></div>';
    h += '<div class="ptp">' + cham.map(function(x){ var nh = x.dinhGia ? MUC_DG : MUC;
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
    var raw = khoa ? k.knDocCache('kn_pt_' + t, khoa) : null;
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
      if (khoa) ptLuu(t, khoa, raw);
    }
    try { ptVe(t, ptTinh(raw, t)); window.__ptLast = { t: t, raw: raw }; }
    catch(e){ console.warn('phantich', e); ptBao(t, 'Lỗi tính chỉ số: ' + esc(e.message)); }
  }
  window.__knPhanTich = ptMo;
  window.__knPtTinh = function(raw, t){ return ptTinh(raw, t); };

  setInterval(function(){
    try {
      var curT = K() ? K().ma() : null;
      if (!curT || !document.getElementById('finFull')) return;
      if (curT !== ptFor) { ptMo(curT); return; }
      hop();
      // Chi so quy (P/E lich su) ve sau BCTC nam -> ve lai mot lan cho o Dinh gia
      if (ptDaVe === curT && !ptCoRts && ptLichSuDinhGia(curT) && window.__ptLast && window.__ptLast.t === curT) ptVe(curT, ptTinh(window.__ptLast.raw, curT));
    } catch(e){}
  }, 700);
})();
