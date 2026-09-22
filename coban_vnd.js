/* coban_vnd.js — bo sung CO BAN tu VNDirect finfo cho bang gia (dashboard_data.js).
   Ly do (21/09/2026): engine trong kho rieng kafi-core (chay tren Chrome anh Khoa) lay co ban tu vietcap;
   vietcap chan moi request cross-origin -> file phat hanh mat sach 12 truong: q, npatYoY, revYoY, cagr3,
   pe, pb, roe, roa, cap, dte, gm, dy -> Bo loc, Leader Board, Tong quan trong.
   Dung chung 2 noi: autorun.js (sau khi engine chay, truoc khi PUT) va scripts/bo-sung-co-ban.js
   (GitHub Actions, luoi an toan hang ngay). Chi DIEN truong dang null, khong ghi de so engine da co.
   Rule-based; nguon ghi ro o SUMMARY.coBan = "vndirect YYYY-MM-DD".
   Ma chi so (ratios/latest): PRICE_TO_EARNINGS, PRICE_TO_BOOK, MARKETCAP (VND), DIVIDEND_YIELD, ROAE_TR_AVG4Q,
   ROAA_TR_AVG4Q, GROSS_MARGIN_TR, DEBT_TO_EQUITY_AQ, NET_SALES_QR_GRYOY, NET_PROFIT_QR_GRYOY (ti le, x100 = %).
   Ma BCTC (financial_statements): 21001 doanh thu thuan (moi mo hinh KQKD), 421701 TOI ngan hang, 23000 LNST me. */
(function (root) {
  var FF = 'https://api-finfo.vndirect.com.vn/v4/';
  var MA_TL = 'PRICE_TO_EARNINGS,PRICE_TO_BOOK,MARKETCAP,DIVIDEND_YIELD,ROAE_TR_AVG4Q,ROAA_TR_AVG4Q,GROSS_MARGIN_TR,DEBT_TO_EQUITY_AQ,NET_SALES_QR_GRYOY,NET_PROFIT_QR_GRYOY';
  var TRUONG = ['pe','pb','cap','dy','roe','roa','gm','dte','revYoY','npatYoY','cagr3','q'];
  function so(v){ var n = +v; return isFinite(n) ? n : null; }
  function lam(v, d){ if (v == null) return null; var m = Math.pow(10, d); return Math.round(v * m) / m; }
  /* "thieu" = mat cai loi (P/E hoac chuoi quy); gm/dte ngan hang von khong co nen khong tinh la thieu */
  function thieu(r){ return !!(r && r.t && (r.pe == null || !r.q || !r.q.length)); }
  function ngayDauQuy(nQuyTruoc){
    var d = new Date(); var idx = d.getUTCFullYear()*4 + Math.ceil((d.getUTCMonth()+1)/3) - 1 - nQuyTruoc;
    var y = Math.floor(idx/4), q = idx % 4 + 1;
    return y + '-' + ('0' + ((q-1)*3 + 1)).slice(-2) + '-01';
  }
  async function taiJson(u, fetchFn){ var r = await fetchFn(u); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }
  async function boSungLo(codes, fetchFn){
    var w = codes.join(',');
    var kq = await Promise.all([
      taiJson(FF + 'ratios/latest?order=reportDate&filter=ratioCode:' + MA_TL + '&where=code:' + w + '&size=' + (codes.length*12), fetchFn),
      taiJson(FF + 'financial_statements?q=code:' + w + '~reportType:QUARTER~itemCode:21001,421701,23000~fiscalDate:gte:' + ngayDauQuy(17) + '&sort=fiscalDate&size=' + (codes.length*3*18), fetchFn)
    ]);
    var tl = kq[0], bc = kq[1], out = {};
    (tl.data || []).forEach(function(x){
      var v = so(x.value); if (v == null || !x.code) return; var o = out[x.code] || (out[x.code] = {});
      switch (x.ratioCode) {
        case 'PRICE_TO_EARNINGS': o.pe = lam(v, 2); break;      case 'PRICE_TO_BOOK': o.pb = lam(v, 2); break;
        case 'MARKETCAP': o.cap = Math.round(v/1e9); break;     case 'DIVIDEND_YIELD': o.dy = lam(v*100, 1); break;
        case 'ROAE_TR_AVG4Q': o.roe = lam(v*100, 1); break;     case 'ROAA_TR_AVG4Q': o.roa = lam(v*100, 1); break;
        case 'GROSS_MARGIN_TR': o.gm = lam(v*100, 1); break;    case 'DEBT_TO_EQUITY_AQ': o.dte = lam(v, 2); break;
        case 'NET_SALES_QR_GRYOY': o.revYoY = lam(v*100, 1); break; case 'NET_PROFIT_QR_GRYOY': o.npatYoY = lam(v*100, 1); break;
      }
    });
    var quy = {};
    (bc.data || []).forEach(function(x){
      var d = String(x.fiscalDate || '').slice(0,10); if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !x.code) return;
      var y = +d.slice(0,4), q = Math.ceil(+d.slice(5,7)/3), k = y*4 + q, ic = Math.round(+x.itemCode), v = so(x.numericValue);
      var m = quy[x.code] || (quy[x.code] = {}); var o = m[k] || (m[k] = { y: y, q: q, rev: 0, np: null });
      if (ic === 21001 || ic === 421701) { if (v) o.rev = v; } else if (ic === 23000) o.np = v;
    });
    Object.keys(quy).forEach(function(c){
      var o = out[c] || (out[c] = {});
      var ds = Object.keys(quy[c]).map(Number).sort(function(a,b){ return a-b; }).map(function(k){ return quy[c][k]; }).filter(function(z){ return z.np != null; });
      if (ds.length) o.q = ds.slice(-9).map(function(z){ return [z.y, z.q, z.rev, z.np]; });
      /* cagr3: LNST 4 quy gan nhat so voi 4 quy cung ky 3 nam truoc, %/nam; ca hai phai duong moi tinh */
      if (ds.length >= 16) { var n = ds.length, ttm = 0, ttm3 = 0;
        for (var i = 0; i < 4; i++) { ttm += ds[n-1-i].np; ttm3 += ds[n-13-i].np; }
        if (ttm > 0 && ttm3 > 0) o.cagr3 = lam((Math.pow(ttm/ttm3, 1/3) - 1)*100, 1); }
    });
    return out;
  }
  /* rows: SUMMARY.rows (sua tai cho). opt: {fetch, lo, onTien(daXong, tong)}. Tra {can, dien, hong[]} */
  async function boSung(rows, opt){
    opt = opt || {}; var fetchFn = opt.fetch || function(u){ return root.fetch(u); }; var lo = opt.lo || 40; var tien = opt.onTien || function(){};
    var can = rows.filter(thieu), codes = can.map(function(r){ return r.t; }), hong = [], dien = 0;
    for (var i = 0; i < codes.length; i += lo) {
      var nhom = codes.slice(i, i+lo), kq = null;
      for (var lan = 0; lan < 3 && !kq; lan++) {
        try { kq = await boSungLo(nhom, fetchFn); }
        catch(e){ if (lan === 2) hong.push(nhom[0] + '..' + nhom[nhom.length-1] + ': ' + e.message); else await new Promise(function(s){ setTimeout(s, 800*(lan+1)); }); }
      }
      if (kq) can.slice(i, i+lo).forEach(function(r){ var o = kq[r.t]; if (!o) return; var co = false;
        TRUONG.forEach(function(k){ if (r[k] == null && o[k] != null) { r[k] = o[k]; co = true; } }); if (co) dien++; });
      tien(Math.min(i+lo, codes.length), codes.length);
    }
    return { can: codes.length, dien: dien, hong: hong };
  }
  root.knBoSungCoBan = boSung;
  root.knCoBanThieu = function(rows){ return (rows || []).filter(thieu).length; };
})(typeof window !== 'undefined' ? window : globalThis);
