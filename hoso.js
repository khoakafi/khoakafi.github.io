/* Ho so phan tich tung ma — 17/10/2026.
   Anh Khoa: "phan tich detail tung business nhu mot analysis that, khong dung o P/E, PEG; moi ma doc 3-5 bao cao CTCK + bai bao
   (ke hoach loi nhuan, muc tieu, tin tuc); top-down; danh gia risk/reward; ~100 ma top thanh khoan". Va: "trai ra, khong bam mo;
   doc vao biet gia hien tai, quy nay lam an sao, gia do okay khong, rui ro, vay no, chi phi; chart nhu so cua hang, doanh thu/cua hang".
   Noi dung = hoso/<MA>.json (tu viet lai tu tai lieu, moi so co nguon; ban goc CTCK nam o kho rieng kafi-core, nhanh ho-so-data).
   File nay chi VE. Cac so phu thuoc gia (P/E du phong, tiem nang, ma tran kich ban) tinh lai theo gia song.
   Tai hong thi KHONG nho ket qua (lan sau thu lai). Bieu do HTML/CSS + SVG, khong thu vien; phantich.js dung chung bdCot/bdDuong. */
(function(){
  'use strict';
  var IX = null, IXP = null, HS = {}, CHO = {};
  function K(){ return window.__knCt || null; }
  function f(v, d){ var k = K(); d = d == null ? 1 : d; return (k && k.fmt) ? k.fmt(v, d) : (v == null || !isFinite(v) ? '—' : (+v).toFixed(d)); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function pct(v, d){ return (v == null || !isFinite(v)) ? '—' : (v > 0 ? '+' : (v < 0 ? '−' : '')) + f(Math.abs(v), d == null ? 0 : d) + '%'; }
  function lop(v){ return v == null || !isFinite(v) ? 'mut' : (v > 0 ? 'up' : (v < 0 ? 'down' : 'mut')); }
  function ngVn(iso){ var s = String(iso || ''); return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4) : s; }
  function trungVi(a){ var x = a.filter(function(v){ return v != null && isFinite(v); }).sort(function(p, q){ return p - q; }); if (!x.length) return null; var m = x.length >> 1; return x.length % 2 ? x[m] : (x[m - 1] + x[m]) / 2; }
  function ty(v){ if (v == null || !isFinite(v)) return '—'; var x = v / 1e9; return f(x, Math.abs(x) < 100 ? 1 : 0); }
  function tyGon(v){ return v == null ? '—' : (v < 0 ? '−' + ty(-v) : ty(v)); }
  function nguon(s){ return s ? '<span class="hsN">' + esc(s) + '</span>' : ''; }

  /* ---------- Tai ---------- */
  function chiMuc(){
    if (IX) return Promise.resolve(IX);
    if (!IXP) IXP = fetch('hoso/index.json', { cache: 'no-cache' }).then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(j){ IX = (j && typeof j === 'object') ? j : {}; return IX; }).catch(function(){ IXP = null; return null; });
    return IXP;
  }
  function tai(t){
    if (Object.prototype.hasOwnProperty.call(HS, t)) return Promise.resolve(HS[t]);
    if (CHO[t]) return CHO[t];
    CHO[t] = chiMuc().then(function(ix){
      if (!ix) return undefined;                                         // loi mang: khong nho, lan sau thu lai
      if (!ix[t]) { HS[t] = null; return null; }                          // ma chua co ho so
      return fetch('hoso/' + t + '.json?d=' + encodeURIComponent(ix[t]), { cache: 'no-cache' })
        .then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function(p){ if (p && p.ma === t) { HS[t] = p; return p; } return undefined; });
    }).catch(function(){ return undefined; }).then(function(p){ delete CHO[t]; return p == null ? null : p; });
    return CHO[t];
  }

  /* ---------- Bieu do (dung chung voi phantich.js) ---------- */
  // Cot doc: ss = [{ten, v, cls}] (1 hoac 2 chuoi cung don vi); o.hl / o.cmp: chi so to dam / cung ky (1 chuoi); o.fm dinh dang; o.nhan: ghi so tren cot
  function bdCot(ss, lbs, o){
    o = o || {}; var n = lbs.length, k = ss.length, all = [0];
    ss.forEach(function(s){ s.v.forEach(function(v){ if (v != null && isFinite(v)) all.push(v); }); });
    var mx = Math.max.apply(null, all), mn = Math.min.apply(null, all), sp = (mx - mn) || 1, nen = -mn / sp * 100;
    var hl = o.hl || [], cmp = o.cmp || [], fm = o.fm || tyGon, w = k > 1 ? 36 : 62;
    var z = '<div class="bdz' + (o.nhan ? ' bdzn' : '') + '" style="height:' + (o.cao || 90) + 'px">' + (mn < 0 ? '<i class="bd0" style="bottom:' + nen.toFixed(1) + '%"></i>' : '');
    for (var i = 0; i < n; i++) {
      var tip = lbs[i] + ': ' + ss.map(function(s){ return (k > 1 ? s.ten + ' ' : '') + (s.v[i] == null ? '—' : fm(s.v[i])); }).join(' · ');
      z += '<div class="bdk" title="' + esc(tip) + '">';
      ss.forEach(function(s, j){ var v = s.v[i]; if (v == null || !isFinite(v)) return;
        var hh = Math.abs(v) / sp * 100, left = 50 - (w * k) / 2 + w * j;
        var cls = 'bdb' + (s.cls ? ' ' + s.cls : '') + (k === 1 ? (hl.indexOf(i) >= 0 ? ' hl' : (cmp.indexOf(i) >= 0 ? ' cmp' : '')) : '') + (v < 0 ? ' am' : '');
        var bot = v >= 0 ? nen : nen - hh;
        z += '<i class="' + cls + '" style="left:' + left.toFixed(1) + '%;width:' + w + '%;bottom:' + bot.toFixed(1) + '%;height:' + Math.max(hh, 1.5).toFixed(1) + '%"></i>';
        if (o.nhan) z += '<em class="bdv" style="left:' + (left + w / 2).toFixed(1) + '%;bottom:' + (v >= 0 ? bot + Math.max(hh, 1.5) : bot - 12).toFixed(1) + '%">' + fm(v) + '</em>'; });
      z += '</div>';
    }
    var hien = {}; hien[0] = 1; hien[n - 1] = 1; [cmp[0], hl[0]].forEach(function(i){ if (i != null && !hien[i - 1] && !hien[i + 1]) hien[i] = 1; });
    z += '</div><div class="bdx">' + lbs.map(function(lb, i){ return '<span>' + ((o.moiNhan || hien[i]) ? esc(lb) : '') + '</span>'; }).join('') + '</div>';
    return '<div class="bdc">' + z + '</div>';
  }
  // Cot chong: ss cung don vi, moi chuoi mot mau; tong ghi tren dinh cot
  function bdChong(ss, lbs, o){
    o = o || {}; var n = lbs.length, fm = o.fm || function(v){ return f(v, 1); }, tong = [];
    for (var i = 0; i < n; i++) tong.push(ss.reduce(function(s, x){ var v = x.v[i]; return s + (v > 0 ? v : 0); }, 0));
    var mx = Math.max.apply(null, tong.concat([1e-9]));
    var z = '<div class="bdz bdzn" style="height:' + (o.cao || 110) + 'px">';
    for (var j = 0; j < n; j++) {
      var tip = lbs[j] + ': ' + ss.map(function(s){ return s.ten + ' ' + (s.v[j] == null ? '—' : fm(s.v[j])); }).join(' · ') + ' · tổng ' + fm(tong[j]);
      z += '<div class="bdk" title="' + esc(tip) + '">'; var day = 0;
      ss.forEach(function(s){ var v = s.v[j]; if (!(v > 0)) return; var hh = v / mx * 100;
        z += '<i class="bdb ' + s.cls + '" style="left:19%;width:62%;bottom:' + day.toFixed(2) + '%;height:' + hh.toFixed(2) + '%"></i>'; day += hh; });
      z += '<em class="bdv" style="left:50%;bottom:' + day.toFixed(1) + '%">' + fm(tong[j]) + '</em></div>';
    }
    z += '</div><div class="bdx">' + lbs.map(function(lb){ return '<span>' + esc(lb) + '</span>'; }).join('') + '</div>';
    return '<div class="bdc">' + z + '</div>';
  }
  function nice(v){ var e = Math.pow(10, Math.floor(Math.log10(Math.abs(v) || 1))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e; }
  // Duong: ss cung don vi (khong 2 truc); o.ref: [{v, ten, trai}] duong tham chieu; o.diem: {i, v, ten}; o.truc: ve vach + so truc tung; o.nhanCuoi: ghi so diem cuoi
  function bdDuong(ss, lbs, o){
    o = o || {}; var n = lbs.length, all = [];
    ss.forEach(function(s){ s.v.forEach(function(v){ if (v != null && isFinite(v)) all.push(v); }); });
    (o.ref || []).forEach(function(r){ all.push(r.v); });
    if (all.length < 2) return '';
    var mn = Math.min.apply(null, all), mx = Math.max.apply(null, all); if (o.tu0 && mn > 0) mn = 0;
    var vach = [];
    if (o.truc) { var st = nice((mx - mn) / 3 || Math.abs(mx) / 3 || 1); mn = Math.floor(mn / st) * st; mx = Math.ceil(mx / st) * st; if (mx === mn) mx = mn + st;
      for (var g = mn; g <= mx + st / 2; g += st) vach.push(g); }
    else { var pad = (mx - mn) * 0.12 || Math.abs(mx) * 0.12 || 1; mn -= pad; mx += pad; }
    var X = function(i){ return n > 1 ? i / (n - 1) * 100 : 50; }, Y = function(v){ return 100 - (v - mn) / (mx - mn) * 100; };
    var fm = o.fm || function(v){ return f(v, 1); }, fmT = o.fmTruc || fm;
    var svg = '<svg class="bds" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
    vach.forEach(function(g){ var y = Y(g).toFixed(2); svg += '<line class="bdg" x1="0" x2="100" y1="' + y + '" y2="' + y + '"/>'; });
    (o.ref || []).forEach(function(r){ var y = Y(r.v).toFixed(2); svg += '<line class="bdr" x1="0" x2="100" y1="' + y + '" y2="' + y + '"/>'; });
    ss.forEach(function(s){ var seg = [], segs = [];
      s.v.forEach(function(v, i){ if (v == null || !isFinite(v)) { if (seg.length) segs.push(seg); seg = []; } else seg.push(X(i).toFixed(2) + ',' + Y(v).toFixed(2)); });
      if (seg.length) segs.push(seg);
      segs.forEach(function(sg){ if (sg.length > 1) svg += '<polyline class="bdp ' + s.cls + (s.net ? ' net' : '') + '" points="' + sg.join(' ') + '"/>'; }); });
    svg += '</svg>';
    var h = '<div class="bdd' + (o.truc ? ' bddt' : '') + '" style="height:' + (o.cao || 100) + 'px">' + svg;
    vach.forEach(function(g){ h += '<span class="bdgl" style="top:' + Y(g).toFixed(1) + '%">' + fmT(g) + '</span>'; });
    (o.ref || []).forEach(function(r){ h += '<span class="bdrl' + (r.trai ? ' l' : '') + '" style="top:' + Y(r.v).toFixed(1) + '%">' + r.ten + '</span>'; });
    ss.forEach(function(s){
      if (o.moiDiem) s.v.forEach(function(v, i){ if (v != null && isFinite(v)) h += '<i class="bdo nho ' + s.cls + '" style="left:' + X(i).toFixed(1) + '%;top:' + Y(v).toFixed(1) + '%"></i>'; });
      for (var i = n - 1; i >= 0; i--) if (s.v[i] != null && isFinite(s.v[i])) {
        h += '<i class="bdo ' + s.cls + '" style="left:' + X(i).toFixed(1) + '%;top:' + Y(s.v[i]).toFixed(1) + '%"></i>';
        if (o.nhanCuoi) h += '<b class="bdvl ' + s.cls + '" style="top:' + Y(s.v[i]).toFixed(1) + '%">' + fm(s.v[i]) + '</b>';
        break; } });
    if (o.diem && o.diem.v != null) h += '<b class="bdol" style="left:' + X(o.diem.i).toFixed(1) + '%;top:' + Y(o.diem.v).toFixed(1) + '%">' + o.diem.ten + '</b>';
    h += '<div class="bdh">' + lbs.map(function(lb, i){ return '<span title="' + esc(lb + ': ' + ss.map(function(s){ return (ss.length > 1 ? s.ten + ' ' : '') + (s.v[i] == null ? '—' : fm(s.v[i])); }).join(' · ')) + '"></span>'; }).join('') + '</div>';
    var x = o.moiNhan ? lbs.map(function(lb, i){ return '<span' + ((n - 1 - i) % 2 ? ' class="an"' : '') + '>' + esc(lb) + '</span>'; }).join('')
      : '<span>' + esc(lbs[0]) + '</span>' + (n > 4 ? '<span>' + esc(lbs[Math.floor((n - 1) / 2)]) + '</span>' : '') + '<span>' + esc(lbs[n - 1]) + '</span>';
    return h + '</div><div class="bdx2' + (o.moiNhan ? ' deu' : '') + (o.truc ? ' t' : '') + (o.nhanCuoi ? ' nc' : '') + '">' + x + '</div>';
  }
  function chuGiai(ss, fm){ return '<div class="bdlg">' + ss.map(function(s){ var last = null; for (var i = s.v.length - 1; i >= 0; i--) if (s.v[i] != null && isFinite(s.v[i])) { last = s.v[i]; break; }
    return '<span><i class="' + s.cls + (s.cot ? ' q' : '') + (s.net ? ' net' : '') + '"></i>' + esc(s.ten) + (last != null && fm ? ' <b>' + fm(last) + '</b>' : '') + '</span>'; }).join('') + '</div>'; }
  // Thanh ngang: ds = [{ten, v, nhan, me, tip}]
  function bdNgang(ds){
    var mx = Math.max.apply(null, ds.map(function(z){ return z.v; }).concat([1e-9]));
    return '<div class="bdn">' + ds.map(function(z){ return '<div class="bdnr' + (z.me ? ' me' : '') + '" title="' + esc(z.tip || '') + '"><span class="bdnt">' + z.ten + '</span><span class="bdnb"><i style="width:'
      + Math.max(0.5, z.v / mx * 100).toFixed(1) + '%"></i></span><span class="bdnv">' + z.nhan + '</span></div>'; }).join('') + '</div>';
  }
  window.__knBd = { cot: bdCot, chong: bdChong, duong: bdDuong, chuGiai: chuGiai, ngang: bdNgang };
  var MAU = ['c1', 'c2', 'c3', 'c4'];

  /* ---------- So tinh theo gia song ---------- */
  // gia: nghin dong/cp; cp: trieu cp; ln: ty dong -> von hoa (ty) = gia * cp; P/E = gia * cp / ln
  function peTu(gia, cp, ln){ return (gia > 0 && cp > 0 && ln > 0) ? gia * cp / ln : null; }
  function tpDc(p, x){ var tru = 0; (p.co_tuc || []).forEach(function(c){ if (c[0] > x.ngay) tru += +c[1] || 0; }); return x.tp ? x.tp - tru : null; }   // dong
  function soGia(p, gia){
    var ct = p.ctck || [], tps = ct.map(function(x){ return tpDc(p, x); }).filter(function(v){ return v > 0; });
    var tv = trungVi(tps);
    return { tv: tv, up: (tv && gia > 0) ? (tv / 1000 / gia - 1) * 100 : null, n: tps.length,
      lo: tps.length ? Math.min.apply(null, tps) / 1000 : null, hi: tps.length ? Math.max.apply(null, tps) / 1000 : null };
  }
  // Gia co phieu con dang niem yet (DMX cua MWG...): dchart (co gia trong phien), hong thi finfo. Nho 60 s trong bo nho; loi thi khong nho.
  var CON = {}, CON_CHO = {}, NGHE = null;
  function giaCon(ma){
    var c = CON[ma]; if (c && Date.now() - c.luc < 60000) return c;
    if (!CON_CHO[ma] && K() && K().jget) {
      var to = Math.floor(Date.now() / 1000) + 86400;
      CON_CHO[ma] = K().jget('https://dchart-api.vndirect.com.vn/dchart/history?symbol=' + ma + '&resolution=D&from=' + (to - 86400 * 20) + '&to=' + to)
        .then(function(d){ var n = d && d.c ? d.c.length : 0; if (!n || !(d.c[n - 1] > 0)) throw new Error('rong');
          return { gia: +d.c[n - 1], ngay: new Date(d.t[n - 1] * 1000 + 7 * 3600e3).toISOString().slice(0, 10) }; })
        .catch(function(){ return K().jget(K().KN_FF + 'stock_prices?sort=date:desc&q=code:' + ma + '&size=1&fields=date,close')
          .then(function(j){ var x = j && j.data && j.data[0]; if (!x || !(x.close > 0)) throw new Error('rong'); return { gia: +x.close, ngay: String(x.date).slice(0, 10) }; }); })
        .then(function(z){ z.luc = Date.now(); var cu = CON[ma]; CON[ma] = z; delete CON_CHO[ma]; if (NGHE && (!cu || cu.gia !== z.gia)) try { NGHE(); } catch(e){} return z; })
        .catch(function(){ delete CON_CHO[ma]; return null; });
    }
    return c || null;
  }
  var TEN3 = { tc: 'TÍCH CỰC', kq: 'KHẢ QUAN', tcu: 'TIÊU CỰC' };
  // Moi so phu thuoc gia: tiem nang theo kich ban, can can, tong cac phan theo gia thi truong cua cong ty con
  function soLive(p, cx){
    var gia = cx.gia, cp = p.cp_trieu, kb = p.kich_ban || [], s = p.sotp, o = { gia: gia, von: gia > 0 ? gia * cp : null, mo: cx.mo };
    var cs = kb.filter(function(k){ return k.ten === 'Cơ sở'; })[0] || kb[1];
    o.gt = cs ? cs.gia : null; o.up = (o.gt && gia > 0) ? (o.gt / gia - 1) * 100 : null;
    o.xau = kb.length ? kb[0].gia : null; o.tot = kb.length ? kb[kb.length - 1].gia : null;
    o.rr = (gia > 0 && o.xau != null && o.tot != null && gia > o.xau && gia < o.tot) ? (o.tot - gia) / (gia - o.xau) : null;
    if (s && s.con) { var gc = giaCon(s.con.ma); o.con = gc;
      if (gc && o.von) { o.vonCon = gc.gia * s.con.cp_trieu; o.phanCon = o.vonCon * s.con.so_huu; o.conLai = o.von - o.phanCon; o.pctCon = o.phanCon / o.von * 100;
        o.peConLai = (s.conlai && s.conlai.ln27 > 0 && o.conLai > 0) ? o.conLai / s.conlai.ln27 : null;
        o.peCon26 = s.con.ln26 > 0 ? o.vonCon / s.con.ln26 : null; o.peCon27 = s.con.ln27 > 0 ? o.vonCon / s.con.ln27 : null; } }
    return o;
  }
  function dien(s, o){
    var m = { pe_conlai: o.peConLai != null ? f(o.peConLai, 1) : '…', gt: o.gt != null ? f(o.gt, 1) + ' nghìn đ/cp' : '—', up: o.up != null ? pct(o.up) + ' so với giá hiện tại' : '—',
      rr: o.rr != null ? f(o.rr, 1) : '—', dmx_gia: o.con ? f(o.con.gia * 1000, 0) : '…', dmx_pct: o.pctCon != null ? f(o.pctCon, 0) + '%' : '…', mo: o.mo ? (TEN3[o.mo.muc] || '—') : '—' };
    return esc(s).replace(/\{(\w+)\}/g, function(a, k){ return m[k] != null ? '<b>' + m[k] + '</b>' : a; });
  }
  function o5(ten, so, phu, lopPhu, lopO){ return '<div class="hsVo' + (lopO ? ' ' + lopO : '') + '"><small>' + ten + '</small><b>' + so + '</b><em class="' + (lopPhu || '') + '">' + phu + '</em></div>'; }

  /* ---------- Phan A: ket luan, luan diem, thi truong dang tra bao nhieu cho tung phan (ve lai khi gia doi) ---------- */
  function phanA(p, cx){
    var o = soLive(p, cx), soBc = (p.ctck || []).length, soTl = (p.nguon || []).length, mo = o.mo;
    var h = '<div class="hs hsA"><div class="hsH"><span class="hsK">Hồ sơ phân tích</span><b>' + esc(p.ma) + ' · ' + esc(p.ten) + '</b>'
      + '<span class="mini">kỳ ' + esc(p.ky || '') + ' · cập nhật ' + ngVn(p.cap_nhat) + (p.lan_sau ? ' · làm lại ' + esc(p.lan_sau) : '') + ' · ' + soTl + ' tài liệu (' + soBc + ' báo cáo CTCK)</span></div>';
    h += '<div class="hsM">' + dien(p.dong_mo, o) + '</div>';
    var dx = (o.xau != null && o.gia > 0) ? (o.xau / o.gia - 1) * 100 : null, dt = (o.tot != null && o.gia > 0) ? (o.tot / o.gia - 1) * 100 : null;
    h += '<div class="hsV">'
      + o5('Giá hiện tại', o.gia > 0 ? f(o.gia, 2) : '—', 'nghìn đồng', 'mut')
      + o5('Giá trị theo mô hình', o.gt != null ? f(o.gt, 1) : '—', (o.up != null ? pct(o.up) : '') + ' · kịch bản cơ sở, 12 tháng', lop(o.up), 'chinh')
      + o5('Kịch bản xấu', o.xau != null ? f(o.xau, 1) : '—', dx != null ? pct(dx) + ' so với giá hiện tại' : '', lop(dx))
      + o5('Kịch bản tốt', o.tot != null ? f(o.tot, 1) : '—', dt != null ? pct(dt) + ' so với giá hiện tại' : '', lop(dt))
      + o5('Tín hiệu định lượng của trang', mo ? (TEN3[mo.muc] || '—') : '—', mo && mo.hanh ? esc(mo.hanh) : 'P/E, PEG, tăng trưởng — khung bên dưới', 'mut', 'mo ' + (mo ? mo.muc : ''))
      + '</div>';
    h += thangKb(p, o);
    h += '<div class="hs2 hsLd"><div><h5>Luận điểm đầu tư</h5><div class="hsLdL">' + (p.luan_diem || []).map(function(z){
        return '<div class="hsLdR"><div class="hsLdS">' + (z.so ? '<b>' + esc(z.so) + '</b><small>' + esc(z.nhan || '') + '</small>' : '') + '</div>'
          + '<div class="hsLdT">' + (z.tieu ? '<b>' + esc(z.tieu) + '</b>' : '') + '<span>' + esc(z.t) + nguon(z.ng) + '</span></div></div>'; }).join('') + '</div></div>'
      + '<div>' + sotpHtml(p, o) + '</div></div></div>';
    return h;
  }
  // Thang gia: day xau -> tot, vach co so, cham gia hien tai; lan tren la dai gia muc tieu CTCK (tham khao)
  function thangKb(p, o){
    if (o.xau == null || o.tot == null) return '';
    var sg = soGia(p, o.gia), vs = [o.xau, o.tot, o.gt].concat(o.gia > 0 ? [o.gia] : []).concat(sg.lo != null ? [sg.lo, sg.hi] : []);
    var lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs), pad = (hi - lo) * 0.05; lo -= pad; hi += pad;
    var X = function(v){ return (v - lo) / (hi - lo) * 100; };
    var h = '<div class="hsSb">';
    if (sg.lo != null) h += '<div class="hsSbB" style="left:' + X(sg.lo).toFixed(2) + '%;width:' + (X(sg.hi) - X(sg.lo)).toFixed(2) + '%" title="Giá mục tiêu ' + sg.n + ' báo cáo CTCK, đã trừ cổ tức (tham khảo)"></div>'
      + '<span class="hsSbBl' + (X(sg.hi) > 70 ? ' tr' : '') + '" style="left:' + (X(sg.hi) > 70 ? X(sg.lo) : X(sg.hi)).toFixed(2) + '%">giá mục tiêu ' + sg.n + ' CTCK ' + f(sg.lo, 0) + '–' + f(sg.hi, 0) + ' (tham khảo)</span>';
    h += '<div class="hsSbT"></div><div class="hsSbR" style="left:' + X(o.xau).toFixed(2) + '%;width:' + (X(o.tot) - X(o.xau)).toFixed(2) + '%"></div>';
    [['x', 'Xấu', o.xau], ['c', 'Cơ sở', o.gt], ['t', 'Tốt', o.tot]].forEach(function(z){ if (z[2] == null) return; var d = o.gia > 0 ? (z[2] / o.gia - 1) * 100 : null;
      h += '<div class="hsSbM ' + z[0] + '" style="left:' + X(z[2]).toFixed(2) + '%"><i></i><span>' + z[1] + ' <b>' + f(z[2], 1) + '</b>' + (d != null ? ' <em class="' + lop(d) + '">' + pct(d) + '</em>' : '') + '</span></div>'; });
    if (o.gia > 0) h += '<div class="hsSbP" style="left:' + X(o.gia).toFixed(2) + '%"><span>Giá hiện tại <b>' + f(o.gia, 1) + '</b></span><i></i></div>';
    h += '</div><div class="hsY hsSbG">Cán cân lên/xuống ' + (o.rr != null ? '<b>' + f(o.rr, 1) + ' lần</b>' : '—') + ' · giá trị 12 tháng theo tổng các phần, tính trên LN 2027E · cách tính ở phần mô hình bên dưới</div>';
    return h;
  }
  // Thi truong dang tra bao nhieu cho tung phan: von hoa me - % cong ty con theo gia thi truong; P/E tung phan so voi cung nganh khu vuc
  function sotpHtml(p, o){
    var s = p.sotp; if (!s || !s.con) return '';
    var h = '<h5>Thị trường đang trả bao nhiêu cho từng phần?</h5>';
    if (!o.con || o.phanCon == null) return h + '<div class="hsY">Đang lấy giá ' + esc(s.con.ma) + '…</div>';
    var w = Math.max(0, Math.min(100, o.pctCon));
    h += '<div class="hsSt"><i class="a" style="width:' + w.toFixed(1) + '%" title="' + esc(s.con.ma + ' ' + f(o.con.gia, 1) + ' × ' + f(s.con.cp_trieu, 1) + ' triệu cp × ' + f(s.con.so_huu * 100, 2) + '%') + '"><span>'
      + f(s.con.so_huu * 100, 0) + '% ' + esc(s.con.ma) + ' theo giá thị trường · ' + f(o.phanCon, 0) + ' tỷ</span></i>'
      + '<i class="b" style="width:' + (100 - w).toFixed(1) + '%"><span>' + (o.conLai > 0 ? f(o.conLai, 0) + ' tỷ' : '—') + '</span></i></div>'
      + '<div class="hsStl"><span>Vốn hóa ' + esc(p.ma) + ' <b>' + f(o.von, 0) + ' tỷ</b> = ' + f(o.pctCon, 0) + '% là ' + esc(s.con.ma) + '</span><span>' + esc(s.conlai.ten) + '</span></div>';
    h += peKv(s, o);
    h += '<div class="hsY">' + esc(s.con.ma) + ' ' + f(o.con.gia, 1) + ' (' + ngVn(o.con.ngay) + '), vốn hóa ' + f(o.vonCon, 0) + ' tỷ, giao dịch mỏng (~' + (s.con.gtgd || '—') + ' tỷ/phiên) — giá chưa phải thước đo ổn định. '
      + 'LN 2027E theo mô hình cơ sở: ' + esc(s.con.ma) + ' ' + f(s.con.ln27, 0) + ' tỷ, phần còn lại ' + f(s.conlai.ln27, 0) + ' tỷ. ' + esc(s.ng || '') + '; ' + esc(s.kv_ng || '') + '.</div>';
    return h;
  }
  // P/E 2027E thi truong dang tra cho tung phan, dat canh P/E 2027F tung doanh nghiep cung nganh khu vuc (cham xam) va trung vi
  function peKv(s, o){
    if (!s.con.kv || !s.conlai || !s.conlai.kv) return '';
    var ds = [{ ten: s.con.ma, phu: s.con.kv_ten, v: o.peCon27, kv: s.con.kv, tv: s.con.kv_tv },
              { ten: 'Phần còn lại', phu: s.conlai.kv_ten, v: o.peConLai, kv: s.conlai.kv, tv: s.conlai.kv_tv }];
    var mx = 20, X = function(v){ return (Math.max(0, Math.min(v, mx)) / mx * 100).toFixed(1); };
    var h = '<div class="hsPk"><div class="hsPkH">P/E trên LN 2027E: thị trường đang trả <i class="me"></i> so với doanh nghiệp cùng ngành khu vực <i class="kv"></i> (vạch: trung vị)</div>';
    ds.forEach(function(r){
      h += '<div class="hsPkR"><div class="hsPkT"><b>' + esc(r.ten) + '</b><small>' + esc(r.phu) + '</small></div><div class="hsPkB">';
      r.kv.forEach(function(k){ h += '<i class="kv" style="left:' + X(k[1]) + '%" title="' + esc(k[0] + ': P/E 2027F ' + f(k[1], 1)) + '"></i>'; });
      var vuot = r.kv.filter(function(k){ return k[1] > mx; });
      if (vuot.length) h += '<em class="vuot">' + vuot.map(function(k){ return esc(k[0]) + ' ' + f(k[1], 1); }).join(', ') + ' ›</em>';
      h += '<i class="tv" style="left:' + X(r.tv) + '%" title="Trung vị cùng ngành ' + f(r.tv, 1) + '"></i>';
      if (r.v != null) { var lech = (r.v / r.tv - 1) * 100;
        h += '<i class="me" style="left:' + X(r.v) + '%" title="' + esc(r.ten + ': ' + f(r.v, 1) + ' lần, ' + (Math.abs(lech) < 10 ? 'ngang' : (lech < 0 ? 'thấp hơn' : 'cao hơn') + ' trung vị ' + f(Math.abs(lech), 0) + '%')) + '"></i>'
          + '<b class="mel" style="left:' + X(r.v) + '%">' + f(r.v, 1) + '</b>'; }
      var lc = r.v != null ? (r.v / r.tv - 1) * 100 : null;
      h += '</div><div class="hsPkV">' + (lc == null ? '…' : (Math.abs(lc) < 10 ? '<b>ngang</b>' : '<b>' + pct(lc) + '</b>') + '<small>so với trung vị ' + f(r.tv, 1) + '</small>') + '</div></div>';
    });
    return h + '<div class="hsPkX"><span></span><div>' + [0, 5, 10, 15, 20].map(function(t){ return '<span style="left:' + X(t) + '%">' + t + '</span>'; }).join('') + '</div><span></span></div></div>';
  }

  /* ---------- Phan B: mo hinh du phong, theo doi theo quy, dong luc van hanh, top-down, ke hoach ---------- */
  function phanB(p, cx){
    var o = soLive(p, cx), h = '';
    if (p.mo_hinh) h += moHinh(p, o, cx);
    if (p.mang && p.mang.length) {
      h += '<div class="hs"><div class="hsH"><span class="hsK">Động lực vận hành</span><span class="mini">số liệu vận hành từ doanh nghiệp và báo cáo CTCK, có ghi nguồn</span></div><div class="hsMg">'
        + p.mang.map(function(m){ return '<div class="hsMc"><div class="hsMt1">' + esc(m.ten) + '</div><div class="hsMt2">' + esc(m.phu || '') + '</div>'
          + (m.so && m.so.length ? '<div class="hsMs">' + m.so.map(function(z){ return '<span><small>' + esc(z[0]) + '</small><b>' + esc(z[1]) + '</b>' + (z[2] ? '<em>' + esc(z[2]) + '</em>' : '') + '</span>'; }).join('') + '</div>' : '')
          + '<ul>' + (m.y || []).map(function(z){ return '<li>' + esc(z.t) + nguon(z.ng) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>';
      if (p.bieu_do && p.bieu_do.length) h += '<div class="hsBd">' + p.bieu_do.map(bieuDo).join('') + '</div>';
      h += '</div>';
    }
    if (p.top_down && p.top_down.length) {
      h += '<div class="hs"><div class="hsH"><span class="hsK">Từ vĩ mô đến doanh nghiệp</span></div><div class="hsTd">'
        + p.top_down.map(function(t, i){ return '<div class="hsTc"><div class="hsTh">' + (i + 1) + '. ' + esc(t.tang) + '</div><ul>' + t.y.map(function(z){
          var ic = z.h > 0 ? ['up', '▲'] : (z.h < 0 ? ['dn', '▼'] : ['fl', '◆']);
          return '<li><i class="' + ic[0] + '" title="' + (z.h > 0 ? 'Thuận lợi' : (z.h < 0 ? 'Bất lợi' : 'Hai mặt')) + '">' + ic[1] + '</i><span>' + esc(z.t) + nguon(z.ng) + '</span></li>'; }).join('') + '</ul></div>'; }).join('')
        + '</div><div class="hsY"><i class="hsI up">▲</i> thuận lợi · <i class="hsI dn">▼</i> bất lợi · <i class="hsI fl">◆</i> hai mặt</div></div>';
    }
    if (p.ke_hoach && p.ke_hoach.ds) h += keHoach(p.ke_hoach);
    return h;
  }
  // Bang du phong + cau LN + 3 kich ban + gia dinh + do nhay + theo doi theo quy
  function moHinh(p, o, cx){
    var M = p.mo_hinh, cot = M.cot || [], n = cot.length;
    var t = '<table class="hsMh"><tr><th></th>' + cot.map(function(c){ return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>';
    M.dong.forEach(function(r){
      if (r.nhom) { t += '<tr class="g"><td colspan="' + (n + 1) + '">' + esc(r.nhom) + '</td></tr>'; return; }
      t += '<tr' + (r.dam ? ' class="dam"' : '') + '><td>' + esc(r.ten) + '</td>';
      for (var i = 0; i < n; i++) { var v = r.s ? r.s[i] : (r.v ? r.v[i] : null), so = r.s ? esc(v) : (v == null ? '—' : (r.d ? Number(v).toLocaleString('vi-VN', { minimumFractionDigits: r.d, maximumFractionDigits: r.d }) : f(v, 0)));
        var g = (r.tang && i > 0 && r.v[i - 1] > 0 && v != null) ? (v / r.v[i - 1] - 1) * 100 : null;
        t += '<td' + (i === 0 ? ' class="a"' : '') + '>' + so + (g != null ? '<small class="' + lop(g) + '">' + pct(g) + '</small>' : '') + '</td>'; }
      t += '</tr>';
      if (r.eps && o.gia > 0) t += '<tr class="pe"><td>P/E tại giá hiện tại</td>' + r.v.map(function(e, i){ return '<td' + (i === 0 ? ' class="a"' : '') + '>' + (e > 0 ? f(o.gia * 1000 / e, 1) : '—') + '</td>'; }).join('') + '</tr>';
    });
    t += '</table>';
    var h = '<div class="hs"><div class="hsH"><span class="hsK">Mô hình dự phóng của trang</span><span class="mini">' + esc(p.ky || '') + ' · làm lại mỗi quý khi có BCTC</span></div>'
      + '<div class="hsMh2"><div><h5>Dự phóng theo mảng</h5>' + t + '<div class="hsY">' + esc(M.ghi || '') + '</div></div><div>' + cauLn(p) + theoDoi(p, cx) + '</div></div>';
    if (p.dinh_gia) h += '<div class="hsMh2 hsGdw"><div>' + kichBan3(p, o) + bangDinhGia(p, o) + '</div><div>' + peLichSu(p) + doNhay(p) + '</div></div>';
    if (p.gia_dinh && p.gia_dinh.length) {
      h += '<div class="hsGdw"><h5>Giả định chính theo kịch bản</h5><table class="hsGd"><colgroup><col style="width:23%"><col style="width:8%"><col style="width:8%"><col style="width:8%"><col></colgroup><tr><th>Biến số</th><th>Xấu</th><th>Cơ sở</th><th>Tốt</th><th>Căn cứ</th></tr>'
        + p.gia_dinh.map(function(g){ return '<tr><td>' + esc(g.ten) + '</td>' + g.v.map(function(v, i){ return '<td class="' + (i === 1 ? 'cs' : 'v') + '">' + esc(v) + '</td>'; }).join('') + '<td class="ld">' + esc(g.ly_do || '') + '</td></tr>'; }).join('')
        + '</table></div>';
    }
    return h + '</div>';
  }
  // Ba kich ban: thanh chong gia tri tung phan (nghin dong/cp, da tru chiet khau cong ty me), vach gia hien tai
  function kichBan3(p, o){
    var D = p.dinh_gia; if (!D || !D.phan || !D.gia) return '';
    var ck = D.ck || 0, kb = p.kich_ban || [], TEN = ['Xấu', 'Cơ sở', 'Tốt'];
    var ph = D.phan.map(function(z){ return { ten: z.ten, mau: /^c[1-4]$/.test(z.mau || '') ? z.mau : 'c4', v: z.gt.map(function(g){ return g * (1 - ck) / D.cp; }) }; });
    var mx = Math.max.apply(null, D.gia.concat(o.gia > 0 ? [o.gia] : [])), st = nice(mx / 5), top = Math.ceil(mx / st) * st;
    var X = function(v){ return v / top * 100; };
    var h = '<h5>Định giá: ba kịch bản, từng phần <small class="mut">nghìn đ/cp, 12 tháng</small></h5>'
      + '<div class="bdlg">' + ph.map(function(z){ return '<span><i class="' + z.mau + ' q"></i>' + esc(z.ten) + '</span>'; }).join('') + (o.gia > 0 ? '<span><i class="gia"></i>Giá hiện tại ' + f(o.gia, 1) + '</span>' : '') + '</div><div class="hsFf">';
    D.gia.forEach(function(g, i){ var d = o.gia > 0 ? (g / o.gia - 1) * 100 : null, k = kb[i] || {};
      h += '<div class="hsFfR' + (i === 1 ? ' cs' : '') + '"><span class="hsFfT">' + (TEN[i] || '') + '</span><span class="hsFfB">';
      ph.forEach(function(z){ var w = X(z.v[i]);
        h += '<i class="' + z.mau + '" style="width:' + w.toFixed(2) + '%" title="' + esc((TEN[i] || '') + ' · ' + z.ten + ': ' + f(z.v[i], 1) + ' nghìn đ/cp') + '">' + (w >= 7 ? '<span>' + f(z.v[i], 1) + '</span>' : '') + '</i>'; });
      if (o.gia > 0) h += '<s style="left:' + X(o.gia).toFixed(2) + '%"></s>';
      h += '</span><span class="hsFfV"><b>' + f(g, 1) + '</b>' + (d != null ? '<em class="' + lop(d) + '">' + pct(d) + '</em>' : '') + '</span></div>'
        + (k.mo_ta ? '<div class="hsFfM">' + esc(k.mo_ta) + '</div>' : ''); });
    var tk = []; for (var v = 0; v <= top + st / 2; v += st) tk.push('<span style="left:' + X(v).toFixed(2) + '%">' + f(v, 0) + '</span>');
    return h + '<div class="hsFfX"><span></span><span class="tk">' + tk.join('') + '</span><span></span></div></div>';
  }
  // Bang tinh: LN 2027E x P/E x ty le so huu cho tung phan -> tong -> tru chiet khau -> chia so co phieu
  function bangDinhGia(p, o){
    var D = p.dinh_gia; if (!D || !D.phan) return '';
    var ck = D.ck || 0, tong = [0, 1, 2].map(function(i){ return D.phan.reduce(function(s, z){ return s + z.gt[i]; }, 0); });
    var td = function(i, a, b){ return '<td' + (i === 1 ? ' class="cs"' : '') + '>' + a + (b ? '<small>' + b + '</small>' : '') + '</td>'; };
    var t = '<table class="hsDgT"><tr><th>Cách tính <small>tỷ đồng</small></th><th>Xấu</th><th>Cơ sở</th><th>Tốt</th></tr>';
    D.phan.forEach(function(z){
      t += '<tr><td><i class="sw ' + (z.mau || 'c4') + '"></i>' + esc(z.ten) + '<small>LN 2027E × P/E' + (z.sh < 1 ? ' × ' + f(z.sh * 100, 2) + '%' : '') + '</small></td>'
        + [0, 1, 2].map(function(i){ return td(i, f(z.gt[i], 0), f(z.ln[i], 0) + ' × ' + f(z.pe[i], 0)); }).join('') + '</tr>'; });
    t += '<tr class="sum"><td>Tổng các phần</td>' + tong.map(function(v, i){ return td(i, f(v, 0)); }).join('') + '</tr>'
      + '<tr><td>Trừ ' + f(ck * 100, 0) + '% chiết khấu công ty mẹ</td>' + D.von.map(function(v, i){ return td(i, f(v, 0)); }).join('') + '</tr>'
      + '<tr class="dam"><td>Giá trị mỗi cổ phiếu<small>÷ ' + f(D.cp, 1) + ' triệu cp · nghìn đ</small></td>' + D.gia.map(function(v, i){ return td(i, f(v, 1)); }).join('') + '</tr>';
    if (o.gia > 0) t += '<tr><td>So với giá hiện tại ' + f(o.gia, 1) + '</td>' + D.gia.map(function(v, i){ var d = (v / o.gia - 1) * 100; return td(i, '<span class="' + lop(d) + '">' + pct(d) + '</span>'); }).join('') + '</tr>';
    return t + '</table>';
  }
  // P/E 4 quy cua chinh ma theo thang (mo ta) + vach muc thap 10% va trung vi; P/E vuot khung (LN gan 0) bo trong
  function peLichSu(p){
    var L = p.pe_ls; if (!L || !L.t || L.t.length < 24) return '';
    var tran = 30, v = L.v.map(function(x){ return x != null && x > 0 && x <= tran ? x : null; }), vuot = L.v.filter(function(x){ return x > tran; }).length;
    var lbs = L.t.map(function(m){ return m.slice(5, 7) + '/' + m.slice(0, 4); });
    var gd = (p.gia_dinh || []).filter(function(g){ return g.ten === 'P/E DMX'; })[0];
    return '<h5>P/E của ' + esc(p.ma) + ' từ ' + L.t[0].slice(0, 4) + ' <small class="mut">P/E 4 quý, cuối mỗi tháng</small></h5><div class="hsPeL">'
      + bdDuong([{ ten: 'P/E', v: v, cls: 'ink' }], lbs, { truc: 1, cao: 150, tu0: 1, fm: function(x){ return f(x, 1); }, fmTruc: function(x){ return f(x, 0); }, nhanCuoi: 1,
          ref: [{ v: L.p10, ten: 'thấp 10%: ' + f(L.p10, 1), trai: 1 }, { v: L.tv, ten: 'trung vị: ' + f(L.tv, 1), trai: 1 }] }) + '</div>'
      + '<div class="hsY">' + (gd ? 'P/E dùng cho DMX: xấu <b>' + esc(gd.v[0]) + '</b> · cơ sở <b>' + esc(gd.v[1]) + '</b> · tốt <b>' + esc(gd.v[2]) + '</b> — từ mức thấp 10% đến dưới trung vị. ' : '')
      + 'Thấp nhất ' + f(L.thap[1], 1) + ' (' + L.thap[0].slice(5, 7) + '/' + L.thap[0].slice(0, 4) + ')' + (vuot ? '; ' + vuot + ' tháng 2023–2024 LN gần bằng 0, P/E vượt ' + tran + ' nên bỏ trống' : '')
      + '. Chỉ để chọn P/E cho kịch bản — kiểm định của trang: P/E so với lịch sử của chính mã không dự báo được giá.</div>';
  }
  // Do nhay gia tri (nghin dong/cp) theo tung bien so — thanh hai phia
  function doNhay(p){
    var ds = p.nhay || []; if (!ds.length) return '';
    var mx = Math.max.apply(null, ds.map(function(z){ return z[2]; }).concat([1e-9]));
    return '<h5 style="margin-top:14px">Giá trị cơ sở nhạy với gì nhất? <small class="mut">nghìn đ/cp</small></h5><div class="hsTn">' + ds.map(function(z){ var w = (z[2] / mx * 50).toFixed(1);
      return '<div class="hsTnr" title="' + esc(z[0] + (z[1] != null ? ': ±' + f(z[1], 0) + ' tỷ LN về cổ đông' : '') + ': ±' + f(z[2], 1) + ' nghìn đ/cp') + '"><span>' + esc(z[0]) + '</span><span class="hsTnb"><i class="dn" style="width:' + w + '%"></i><i class="up" style="width:' + w + '%"></i></span><b>±' + f(z[2], 1) + '</b></div>'; }).join('')
      + '</div>';
  }
  // Theo doi du phong theo quy: khoang xau -> tot, vach co so, cung ky nam truoc; so thuc te tu BCTC VNDirect khi co
  function theoDoi(p, cx){
    var ds = p.theo_doi || []; if (!ds.length) return '';
    var Q = (cx && cx.raw && cx.raw.quy) || [], tim = function(fd){ return Q.filter(function(o){ return o.fd === fd; })[0] || null; };
    var rows = ds.map(function(z){ var o = z.fd ? tim(z.fd) : null;
      return { z: z, tt: o && o.v && o.v['23000'] != null ? o.v['23000'] / 1e9 : null, dtt: o && o.v && o.v['21001'] != null ? o.v['21001'] / 1e9 : null }; });
    var all = []; rows.forEach(function(r){ if (!r.z.fd || !r.z.ln) return; all.push(r.z.ln[0], r.z.ln[2]); if (r.z.ck) all.push(r.z.ck); if (r.tt != null) all.push(r.tt); });
    var lo = all.length ? Math.min.apply(null, all) : 0, hi = all.length ? Math.max.apply(null, all) : 1, pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    var X = function(v){ return ((v - lo) / (hi - lo) * 100).toFixed(1); };
    var h = '<h5 style="margin-top:16px">Theo dõi dự phóng theo quý <small class="mut">LN cổ đông, tỷ đồng</small></h5><table class="hsTq"><tr><th>Kỳ</th><th>Doanh thu</th><th class="rg">Xấu – tốt · <b>cơ sở</b> · ○ cùng kỳ' + (rows.some(function(r){ return r.tt != null; }) ? ' · ◆ thực tế' : '') + '</th><th>Thực tế</th></tr>';
    rows.forEach(function(r){ var z = r.z, lech = (r.tt != null && z.ln) ? (r.tt / z.ln[1] - 1) * 100 : null, ve = '';
      if (z.fd && z.ln) ve = '<div class="hsRg" title="' + esc(z.quy + ': xấu ' + f(z.ln[0], 0) + ' · cơ sở ' + f(z.ln[1], 0) + ' · tốt ' + f(z.ln[2], 0) + (z.ck ? ' · cùng kỳ ' + f(z.ck, 0) : '')) + '">'
        + '<i class="r" style="left:' + X(z.ln[0]) + '%;width:' + (X(z.ln[2]) - X(z.ln[0])).toFixed(1) + '%"></i><i class="c" style="left:' + X(z.ln[1]) + '%"></i>'
        + (z.ck ? '<i class="ck" style="left:' + X(z.ck) + '%"></i>' : '') + (r.tt != null ? '<i class="tt" style="left:' + X(r.tt) + '%"></i>' : '') + '</div>'
        + '<div class="hsRgL"><span>' + f(z.ln[0], 0) + '</span><b>' + f(z.ln[1], 0) + '</b><span>' + f(z.ln[2], 0) + '</span></div>';
      else if (z.ln) ve = '<div class="hsRgN">' + f(z.ln[0], 0) + ' · <b>' + f(z.ln[1], 0) + '</b> · ' + f(z.ln[2], 0) + '</div>';
      h += '<tr><td>' + esc(z.quy) + (z.ck ? '<small>cùng kỳ ' + f(z.ck, 0) + '</small>' : '') + '</td><td>' + (r.dtt != null ? f(r.dtt, 0) : (z.dt ? f(z.dt, 0) + (z.dt_tt ? ' <small>sơ bộ</small>' : ' <small>ước</small>') : '—')) + '</td>'
        + '<td class="rg">' + ve + '</td>'
        + '<td>' + (r.tt != null ? '<b>' + f(r.tt, 0) + '</b> <small class="' + lop(lech) + '">' + pct(lech) + ' so với cơ sở</small>' : (z.fd ? '<span class="mut">chờ BCTC</span>' : '')) + '</td></tr>'; });
    return h + '</table>';
  }
  // Cau loi nhuan dang thac nuoc: tong dau -> tung buoc tang/giam -> tong cuoi (truc tu 0)
  function cauLn(p){
    var c = p.cau_ln; if (!c || !c.buoc) return '';
    var dong = [{ ten: c.dau[0], tu: 0, den: c.dau[1], cls: 'tong', so: f(c.dau[1], 0) }], cum = c.dau[1], mx = c.dau[1];
    c.buoc.forEach(function(z){ var a = cum; cum += z[1]; mx = Math.max(mx, cum);
      dong.push({ ten: z[0], tu: Math.min(a, cum), den: Math.max(a, cum), cls: z[1] >= 0 ? 'tang' : 'giam', so: (z[1] > 0 ? '+' : (z[1] < 0 ? '−' : '')) + f(Math.abs(z[1]), 0) }); });
    var d = c.cuoi[1] - c.dau[1]; mx = Math.max(mx, c.cuoi[1]);
    dong.push({ ten: c.cuoi[0], tu: 0, den: c.cuoi[1], cls: 'tong', so: f(c.cuoi[1], 0) + ' <em class="' + lop(d) + '">' + pct(d / c.dau[1] * 100, 1) + '</em>' });
    var X = function(v){ return v / (mx * 1.02) * 100; };
    return '<h5>' + esc(c.ten) + ' <small class="mut">tỷ đồng</small></h5><div class="hsWf">' + dong.map(function(r){
      return '<div class="hsWfR ' + r.cls + '" title="' + esc(r.ten) + ': ' + r.so.replace(/<[^>]+>/g, '') + '"><span class="hsWfT">' + esc(r.ten) + '</span><span class="hsWfB"><i style="left:' + X(r.tu).toFixed(2) + '%;width:' + Math.max(0.4, X(r.den) - X(r.tu)).toFixed(2) + '%"></i></span><b>' + r.so + '</b></div>'; }).join('')
      + '</div><div class="hsY">' + esc(c.y || '') + nguon(c.ng) + '</div>';
  }
  function bieuDo(b){
    var cot = b.kieu === 'cot' || b.kieu === 'cot_chong';
    var ss = b.ss.map(function(s, i){ return { ten: s.ten, v: s.v, cls: /^c[1-4]$/.test(s.mau || '') ? s.mau : MAU[i % MAU.length], net: !cot && (s.net != null ? !!s.net : i >= 2), cot: cot }; });   // mau co dinh theo doi tuong qua cac bieu do
    var d = b.so_le == null ? 0 : b.so_le, fm = function(v){ return f(v, d); }, ve;
    if (b.kieu === 'cot_chong') ve = chuGiai(ss) + bdChong(ss, b.nhan, { fm: fm, cao: 120 });
    else if (b.kieu === 'cot') ve = chuGiai(ss) + bdCot(ss, b.nhan, { fm: fm, cao: 110, nhan: ss.length === 1, moiNhan: 1 });
    else ve = chuGiai(ss, fm) + bdDuong(ss, b.nhan, { fm: fm, cao: 124, truc: 1, moiDiem: 1, moiNhan: 1 });
    return '<div class="hsBc"><div class="hsBt">' + esc(b.ten) + (b.dv ? ' <small>(' + esc(b.dv) + ')</small>' : '') + '</div>' + ve + (b.y ? '<div class="hsY">' + esc(b.y) + nguon(b.ng) + '</div>' : nguon(b.ng)) + '</div>';
  }
  function keHoach(k){
    var h = '<div class="hs"><div class="hsH"><span class="hsK">Kế hoạch ' + k.nam + ' và tiến độ</span><span class="mini">vạch dọc = phần thời gian đã qua trong năm</span></div><div class="hsKh">';
    k.ds.forEach(function(z){ var r = z.kh > 0 ? z.th / z.kh * 100 : null, w = r == null ? 0 : Math.min(r, 100), vuot = r != null && z.tg != null && r >= z.tg;
      h += '<div class="hsKr"><div class="hsKt"><b>' + esc(z.ten) + '</b><span class="mini">' + f(z.th, 0) + ' / ' + f(z.kh, 0) + ' ' + esc(z.dv || '') + ' · ' + esc(z.ky || '') + (z.chu ? ' · ' + esc(z.chu) : '') + '</span></div>'
        + '<div class="hsKb"><i class="' + (vuot ? 'ok' : 'cham') + '" style="width:' + w.toFixed(1) + '%"></i>' + (z.tg != null ? '<s style="left:' + z.tg + '%" title="Đã qua ' + z.tg + '% thời gian"></s>' : '') + '</div>'
        + '<div class="hsKp ' + (vuot ? 'up' : '') + '">' + (r == null ? '—' : f(r, 0) + '%') + '</div>' + nguon(z.ng) + '</div>'; });
    return h + '</div>' + (k.y ? '<div class="hsY">' + esc(k.y) + nguon(k.ng) + '</div>' : '') + '</div>';
  }

  /* ---------- Phan C: catalyst, rui ro, tham dinh quan diem CTCK (ve lai khi gia doi) ---------- */
  var DG = { '2': ['ok', '✓ Đồng ý'], '1': ['mot', '≈ Đồng ý một phần'], '0': ['no', '✗ Không dùng'], '-1': ['tk', 'ℹ Chỉ tham khảo'] };
  function phanC(p, cx){
    var o = soLive(p, cx), h = '';
    if ((p.catalyst && p.catalyst.length) || (p.rui_ro && p.rui_ro.length)) {
      h += '<div class="hs"><div class="hs2 hsRr">';
      if (p.catalyst && p.catalyst.length) h += '<div><div class="hsH"><span class="hsK">Catalyst</span><span class="mini">sự kiện có thể khiến thị trường định giá lại</span></div><ul class="hsLc">'
        + p.catalyst.map(function(z){ return '<li><b>' + esc(z.khi) + '</b><span>' + esc(z.t) + '</span></li>'; }).join('') + '</ul></div>';
      if (p.rui_ro && p.rui_ro.length) h += '<div><div class="hsH"><span class="hsK">Rủi ro chính</span><span class="mini">mức độ · tác động lên lợi nhuận và giá trị · cần theo dõi</span></div><ul class="hsRl">' + p.rui_ro.map(function(z){
        var m = Math.max(1, Math.min(3, z.muc || 1));
        return '<li><span class="hsLv l' + m + '" title="Mức ' + ['', 'thấp', 'vừa', 'cao'][m] + '">' + '●●●'.slice(0, m) + '<s>' + '●●●'.slice(m) + '</s></span><div class="hsRc"><div class="hsRh"><b>' + esc(z.t) + '</b><span class="mini">' + ['', 'thấp', 'vừa', 'cao'][m] + '</span>'
          + (z.tac ? '<span class="hsTac" title="Tác động lên giá trị cơ sở">' + esc(z.tac) + '</span>' : '') + '</div>'
          + (z.ct ? '<div>' + esc(z.ct) + '</div>' : '') + (z.theo_doi ? '<div class="hsTd2"><b>Theo dõi:</b> ' + esc(z.theo_doi) + '</div>' : '') + nguon(z.ng) + '</div></li>'; }).join('') + '</ul></div>';
      h += '</div></div>';
    }
    if (p.tham_dinh && p.tham_dinh.length) {
      var dem = {}; p.tham_dinh.forEach(function(z){ var k = DG[String(z.dg)] ? String(z.dg) : '-1'; dem[k] = (dem[k] || 0) + 1; });
      h += '<div class="hs"><div class="hsH"><span class="hsK">Thẩm định quan điểm CTCK</span><span class="mini">mỗi luận điểm của CTCK được kiểm bằng số liệu thực tế và mô hình của trang</span></div>'
        + '<div class="hsTgS">' + ['2', '1', '0', '-1'].filter(function(k){ return dem[k]; }).map(function(k){ return '<i class="' + DG[k][0] + '" style="flex:' + dem[k] + '"><span>' + dem[k] + ' ' + DG[k][1].slice(2).toLowerCase() + '</span></i>'; }).join('') + '</div>'
        + '<div class="hsTg"><div class="hsTgh"><span>Quan điểm</span><span>Đánh giá</span><span>Bằng chứng</span><span>Trong mô hình của trang</span></div>'
        + p.tham_dinh.map(function(z){ var d = DG[String(z.dg)] || DG['-1'];
          return '<div class="hsTgr"><div><b>' + esc(z.lq) + '</b><small>' + esc(z.ai || '') + '</small></div><div><span class="hsDg ' + d[0] + '">' + d[1] + '</span></div><div>' + dien(z.bc || '', o) + '</div><div class="mh">' + dien(z.mh || '', o) + '</div></div>'; }).join('')
        + '</div></div>';
    }
    return h;
  }

  /* ---------- Phan D: tham khao CTCK, nguon (ve lai khi gia doi) ---------- */
  function phanD(p, cx){
    var ct = p.ctck || [], gia = cx.gia, sg = soGia(p, gia), h = '';
    if (ct.length) {
      h += '<div class="hs hsTk"><div class="hsH"><span class="hsK">Tham khảo: báo cáo CTCK</span><span class="mini">' + ct.length + ' báo cáo gần nhất, mỗi công ty một bản · số trong báo cáo, lời tóm tắt của trang</span></div><div class="hsMh2"><div class="hsCt">';
      ct.forEach(function(x){ var dc = tpDc(p, x), up = (dc && gia > 0) ? (dc / 1000 / gia - 1) * 100 : null;
        h += '<div class="hsCr"><div class="hsC1"><b>' + esc(x.ctck) + '</b><span class="mini">' + ngVn(x.ngay) + '</span><span class="hsKn">' + esc(x.kn) + '</span></div>'
          + '<div class="hsC2"><span><small>Giá mục tiêu</small><b>' + (x.tp ? f(x.tp / 1000, 1) : '—') + '</b>' + (x.tp && dc !== x.tp ? '<em title="Đã trừ cổ tức tiền mặt chi sau ngày ra báo cáo">sau cổ tức ' + f(dc / 1000, 1) + '</em>' : '') + '</span>'
          + '<span><small>So với giá hiện tại</small><b class="' + lop(up) + '">' + pct(up) + '</b></span>'
          + '<span><small>LN 2026F</small><b>' + (x.ln26 ? f(x.ln26, 0) : '—') + '</b></span><span><small>LN 2027F</small><b>' + (x.ln27 ? f(x.ln27, 0) : '—') + '</b></span></div>'
          + '<div class="hsC3">' + esc(x.y || '') + (x.pp ? ' <span class="mini">· ' + esc(x.pp) + '</span>' : '') + (x.link ? ' <a href="' + esc(x.link) + '" target="_blank" rel="noopener">báo cáo gốc</a>' : '') + '</div></div>'; });
      h += '</div><div>' + duPhong(p) + (cx.raw ? tpLichSu(cx.raw, gia) : '') + '</div></div>';
      h += '<div class="hsY">' + esc(p.ctck_chu || '') + (sg.tv ? ' Trung vị ' + sg.n + ' báo cáo: ' + f(sg.tv / 1000, 1) + ' (' + pct(sg.up) + ').' : '') + '</div></div>';
    }
    if (p.nguon && p.nguon.length) h += '<div class="hs hsNg"><div class="hsH"><span class="hsK">Nguồn</span><span class="mini">bấm để mở bản gốc</span></div><ol>'
      + p.nguon.map(function(z){ return '<li><a href="' + esc(z.link) + '" target="_blank" rel="noopener">' + esc(z.ten) + '</a> <span class="mini">' + esc(z.ngay || '') + '</span></li>'; }).join('') + '</ol>'
      + '<div class="hsY">Hồ sơ do khoanguyeninvest.vn tổng hợp và tự dựng mô hình từ BCTC, thông tin doanh nghiệp công bố và báo cáo CTCK (tham khảo); mỗi con số ghi nguồn. '
      + 'Không phải khuyến nghị đầu tư. Tín hiệu định lượng của trang là quy tắc cố định (rule-based), kiểm định trên dữ liệu 2014 – 2026.</div></div>';
    return h;
  }
  // Du phong loi nhuan: tung CTCK va mo hinh cua trang (cot doi 2026 / 2027)
  function duPhong(p){
    var ds = (p.ctck || []).filter(function(x){ return x.ln26 || x.ln27; }); if (ds.length < 2) return '';
    var kb = (p.kich_ban || []).filter(function(k){ return k.ten === 'Cơ sở'; })[0], lbs = ds.map(function(x){ return x.ctck; });
    var a = ds.map(function(x){ return x.ln26; }), b = ds.map(function(x){ return x.ln27; });
    if (kb) { lbs.push('Mô hình trang'); a.push(kb.ln26); b.push(kb.ln27); }
    var ss = [{ ten: 'LN 2026 dự phóng', v: a, cls: 'c1' }, { ten: 'LN 2027 dự phóng', v: b, cls: 'c2' }];
    return '<h5>Lợi nhuận dự phóng: CTCK và mô hình của trang (nghìn tỷ đồng)</h5>' + chuGiai(ss) + bdCot(ss, lbs, { cao: 104, fm: function(v){ return f(v / 1000, 1); }, nhan: 1, moiNhan: 1 });
  }
  // Gia muc tieu cac CTCK theo thoi gian (Simplize, da dieu chinh co tuc) va gia dieu chinh cuoi thang
  function tpLichSu(raw, gia){
    var bc = (raw.bc || []).filter(function(x){ return x.tp > 0 && /^\d{2}\/\d{2}\/\d{4}$/.test(x.d); }), G = raw.gia || [];
    if (bc.length < 4 || G.length < 6) return '';
    var ts = function(s){ var q = s.split('/'); return Date.UTC(+q[2], +q[1] - 1, +q[0]); };
    var now = Date.now(), t0 = now - 16 * 30.4 * 864e5;
    bc = bc.filter(function(x){ return ts(x.d) >= t0; }); if (bc.length < 4) return '';
    var gThang = G.filter(function(z){ return Date.UTC(+z[0].slice(0, 4), +z[0].slice(5, 7) - 1, 28) >= t0; }).map(function(z){ return [Date.UTC(+z[1].slice(0, 4), +z[1].slice(5, 7) - 1, +z[1].slice(8, 10)), z[3] > 0 ? z[3] : z[2]]; });
    var chia = Math.max.apply(null, gThang.map(function(z){ return z[1]; })) > 1000 ? 1000 : 1;   // gia nghin dong
    gThang = gThang.map(function(z){ return [z[0], z[1] / chia]; });
    if (gia > 0) gThang.push([now, gia]);
    var vs = bc.map(function(x){ return x.tp / 1000; }).concat(gThang.map(function(z){ return z[1]; }));
    var mn = Math.min.apply(null, vs), mx = Math.max.apply(null, vs), st = nice((mx - mn) / 3 || 10); mn = Math.floor(mn / st) * st; mx = Math.ceil(mx / st) * st;
    var X = function(t){ return (t - t0) / (now - t0) * 100; }, Y = function(v){ return 100 - (v - mn) / (mx - mn) * 100; };
    var svg = '<svg class="bds" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
    for (var g = mn; g <= mx + st / 2; g += st) svg += '<line class="bdg" x1="0" x2="100" y1="' + Y(g).toFixed(2) + '" y2="' + Y(g).toFixed(2) + '"/>';
    svg += '<polyline class="bdp ink" points="' + gThang.map(function(z){ return X(z[0]).toFixed(2) + ',' + Y(z[1]).toFixed(2); }).join(' ') + '"/></svg>';
    var h = '<h5 style="margin-top:12px">Giá mục tiêu từng báo cáo và giá cổ phiếu, 16 tháng</h5><div class="bdlg"><span><i class="c1 tron"></i>Giá mục tiêu (mỗi chấm một báo cáo)</span><span><i class="ink"></i>Giá cổ phiếu cuối tháng</span></div>'
      + '<div class="bdd bddt" style="height:150px">' + svg;
    for (var g2 = mn; g2 <= mx + st / 2; g2 += st) h += '<span class="bdgl" style="top:' + Y(g2).toFixed(1) + '%">' + f(g2, 0) + '</span>';
    bc.forEach(function(x){ h += '<i class="bdo tp c1" style="left:' + X(ts(x.d)).toFixed(1) + '%;top:' + Y(x.tp / 1000).toFixed(1) + '%" title="' + esc(x.d + ' · ' + x.s + ' · ' + (x.r || '') + ' · ' + f(x.tp / 1000, 1)) + '"></i>'; });
    if (gia > 0) h += '<i class="bdo ink" style="left:100%;top:' + Y(gia).toFixed(1) + '%" title="Hôm nay ' + f(gia, 2) + '"></i>';
    var q = {}; bc.forEach(function(x){ var p = x.d.split('/'), k = p[2] + '-Q' + Math.ceil(+p[1] / 3); (q[k] = q[k] || []).push(x.tp / 1000); });
    var qs = Object.keys(q).sort();
    var mlb = []; for (var i = 0; i <= 4; i++) { var dd = new Date(t0 + (now - t0) * i / 4); mlb.push('<span>' + ('0' + (dd.getUTCMonth() + 1)).slice(-2) + '/' + String(dd.getUTCFullYear()).slice(2) + '</span>'); }
    h += '</div><div class="bdx2 t deu">' + mlb.join('') + '</div>';
    h += '<div class="hsY">Trung vị giá mục tiêu theo quý: ' + qs.map(function(k){ return k.slice(5) + '/' + k.slice(2, 4) + ' <b>' + f(trungVi(q[k]), 1) + '</b> (' + q[k].length + ')'; }).join(' → ')
      + '. Nguồn danh sách: Simplize (giá mục tiêu đã điều chỉnh cổ tức).</div>';
    return h;
  }

  /* ---------- CSS ---------- */
  function css(){
    if (document.getElementById('hsCss')) return;
    var st = document.createElement('style'); st.id = 'hsCss';
    st.textContent =
      /* bieu do chung */
      '#ptcs .bdc{margin:4px 0 2px}#ptcs .bdz{position:relative;display:flex;align-items:stretch;border-bottom:1px solid #D5DAE0}#ptcs .bdz.bdzn{margin-top:16px}#ptcs .bdk{position:relative;flex:1;min-width:0;cursor:default}#ptcs .bdk:hover{background:rgba(42,120,214,.06)}'
      + '#ptcs .bdb{position:absolute;border-radius:3px 3px 0 0;background:#C9CFD7}#ptcs .bdb.am{border-radius:0 0 3px 3px}#ptcs .bdb.hl{background:#2a78d6}#ptcs .bdb.cmp{background:#7A828E}'
      + '#ptcs .bdb.c1,#ptcs .bdlg i.c1{background:#2a78d6}#ptcs .bdb.c2,#ptcs .bdlg i.c2{background:#eb6834}#ptcs .bdb.c3,#ptcs .bdlg i.c3{background:#1A9E77}#ptcs .bdb.c4,#ptcs .bdlg i.c4{background:#8E98A6}'
      + '#ptcs .bd0{position:absolute;left:0;right:0;height:1px;background:#9AA3AE;z-index:1}#ptcs .bdv{position:absolute;transform:translate(-50%,-2px);font-style:normal;font-size:10.5px;font-weight:700;color:var(--text);white-space:nowrap;line-height:1;margin-bottom:2px}'
      + '#ptcs .bdx{display:flex}#ptcs .bdx span{flex:1;min-width:0;text-align:center;font-size:10.5px;color:var(--muted);white-space:nowrap;overflow:visible;margin-top:3px}'
      + '#ptcs .bdd{position:relative;margin:6px 0 0}#ptcs .bdd.bddt{margin-left:34px}#ptcs .bds{position:absolute;inset:0;width:100%;height:100%;overflow:visible}'
      + '#ptcs .bdp{fill:none;stroke-width:2.2;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}#ptcs .bdp.net{stroke-dasharray:5 3}#ptcs .bdp.c1{stroke:#2a78d6}#ptcs .bdp.c2{stroke:#eb6834}#ptcs .bdp.c3{stroke:#1A9E77}#ptcs .bdp.c4{stroke:#8E98A6}'
      + '#ptcs .bdg{stroke:#E6E9EE;stroke-width:1;vector-effect:non-scaling-stroke}#ptcs .bdr{stroke:#9AA3AE;stroke-width:1;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}'
      + '#ptcs .bdgl{position:absolute;left:-34px;width:30px;text-align:right;transform:translateY(-50%);font-size:10px;color:var(--muted);white-space:nowrap}'
      + '#ptcs .bdrl{position:absolute;right:0;transform:translateY(-110%);font-size:10px;color:var(--muted);white-space:nowrap}#ptcs .bdrl.l{right:auto;left:0}'
      + '#ptcs .bdo{position:absolute;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.08);z-index:2}#ptcs .bdo.nho{width:6px;height:6px;margin:-3px 0 0 -3px;border-width:1px;z-index:1}'
      + '#ptcs .bdo.c1{background:#2a78d6}#ptcs .bdo.c2{background:#eb6834}#ptcs .bdo.c3{background:#1A9E77}#ptcs .bdo.c4{background:#8E98A6}#ptcs .bdo.tp{width:8px;height:8px;margin:-4px 0 0 -4px;border:1.5px solid #fff;opacity:.85;cursor:default}#ptcs .bdo.tp:hover{opacity:1;transform:scale(1.4)}'
      + '#ptcs .bdvl{position:absolute;right:-6px;transform:translate(100%,-50%);font-size:10.5px;white-space:nowrap}#ptcs .bdvl.c1{color:#2a78d6}#ptcs .bdvl.c2{color:#c4501f}#ptcs .bdvl.c3{color:#13795B}#ptcs .bdvl.c4{color:#5B6676}'
      + '#ptcs .bdol{position:absolute;transform:translate(-100%,-150%);font-size:11px;white-space:nowrap;background:rgba(255,255,255,.85);padding:0 3px;border-radius:3px}'
      + '#ptcs .bdh{position:absolute;inset:0;display:flex}#ptcs .bdh span{flex:1;cursor:default}#ptcs .bdh span:hover{background:rgba(42,120,214,.07)}'
      + '#ptcs .bdx2{display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);margin-top:3px}#ptcs .bdx2.t{margin-left:34px}#ptcs .bdx2.deu span{flex:1;text-align:center}#ptcs .bdx2.deu span:first-child{text-align:left}#ptcs .bdx2.deu span:last-child{text-align:right}'
      + '#ptcs .bdlg{display:flex;flex-wrap:wrap;gap:3px 14px;font-size:11.5px;margin:4px 0 2px}#ptcs .bdlg i{display:inline-block;width:14px;height:3px;border-radius:2px;margin-right:5px;vertical-align:3px}#ptcs .bdlg i.q,#ptcs .bdlg i.tron{width:9px;height:9px;vertical-align:0}#ptcs .bdlg i.tron{border-radius:50%}'
      + '#ptcs .bdlg i.net{background:repeating-linear-gradient(90deg,currentColor 0 5px,transparent 5px 8px)!important}#ptcs .bdlg i.c1.net{color:#2a78d6}#ptcs .bdlg i.c2.net{color:#eb6834}#ptcs .bdlg i.c3.net{color:#1A9E77}#ptcs .bdlg i.c4.net{color:#8E98A6}'
      + '#ptcs .bdn{display:flex;flex-direction:column;gap:4px}#ptcs .bdnr{display:grid;grid-template-columns:62px minmax(0,1fr) 54px;gap:8px;align-items:center;font-size:12px}#ptcs .bdnb{height:10px;background:#EEF1F4;border-radius:3px}#ptcs .bdnb i{display:block;height:100%;background:#9DB9DF;border-radius:3px}#ptcs .bdnr.me .bdnb i{background:#2a78d6}#ptcs .bdnr.me{font-weight:700}#ptcs .bdnv{text-align:right}'
      + '#ptcs .cau{display:flex;flex-direction:column;gap:3px}#ptcs .caur{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr) 62px;gap:8px;align-items:center;font-size:12.5px}#ptcs .caub{position:relative;height:11px;background:linear-gradient(90deg,transparent calc(50% - .5px),#9AA3AE calc(50% - .5px),#9AA3AE calc(50% + .5px),transparent calc(50% + .5px))}'
      + '#ptcs .caub i{position:absolute;top:0;bottom:0;border-radius:2px}#ptcs .caub i.up{left:50%;background:var(--green)}#ptcs .caub i.dn{right:50%;background:var(--red)}#ptcs .caur b{text-align:right;white-space:nowrap}#ptcs .caur b.up{color:var(--green-dark)}#ptcs .caur b.down{color:var(--red)}#ptcs .caur.tong{border-top:1px solid var(--border);padding-top:4px;margin-top:2px;font-weight:700}'
      /* ho so */
      + '#ptcs .hs{background:#fff;border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:12px}#ptcs .hsA{border-top:4px solid var(--green)}'
      + '#ptcs .hsH{display:flex;align-items:baseline;gap:4px 12px;flex-wrap:wrap;margin-bottom:8px}#ptcs .hsH b{font-size:15px}#ptcs .hsK{font-size:11.5px;font-weight:800;color:var(--green-dark);letter-spacing:.05em;text-transform:uppercase}'
      + '#ptcs .hsM{font-size:15.5px;font-weight:700;line-height:1.5;margin:2px 0 10px}#ptcs .hsQ{font-size:13px;line-height:1.5;background:#FFF8E6;border-left:4px solid #D97706;padding:7px 11px;border-radius:8px;margin-bottom:12px}'
      + '#ptcs .hsG{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:12px}@media (max-width:760px){#ptcs .hsG{grid-template-columns:repeat(2,minmax(0,1fr))}}'
      + '#ptcs .hsTi{background:var(--panel2);border-radius:10px;padding:9px 11px;min-width:0;display:flex;flex-direction:column;gap:2px}#ptcs .hsTi small{font-size:11.5px;color:var(--muted);font-weight:700;line-height:1.3}#ptcs .hsTi b{font-size:21px;line-height:1.2}#ptcs .hsTi em{font-style:normal;font-size:12px;line-height:1.35}'
      + '#ptcs .hsTi em.up{color:var(--green-dark);font-weight:700}#ptcs .hsTi em.down{color:var(--red);font-weight:700}#ptcs .hsMo.tc{color:var(--green-dark)}#ptcs .hsMo.kq{color:#475569}#ptcs .hsMo.tcu{color:var(--red)}'
      + '#ptcs ol.hsTT{margin:0;padding-left:20px;font-size:13.5px;line-height:1.55}#ptcs ol.hsTT li{padding:3px 0}#ptcs ol.hsTT li::marker{font-weight:800;color:var(--green-dark)}'
      + '#ptcs .hsN{display:inline-block;max-width:100%;font-size:10.5px;color:#6B7280;background:#F1F3F6;border-radius:4px;padding:0 5px;margin-left:5px;vertical-align:1px;line-height:1.6}'
      + '#ptcs .hs2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#ptcs .hs2>*{min-width:0}@media (max-width:860px){#ptcs .hs2{grid-template-columns:1fr}}#ptcs .hs2.hsSo{margin-top:14px;padding-top:12px;border-top:1px dashed var(--border)}'
      + '#ptcs .hs h5{margin:0 0 6px;font-size:13px}#ptcs .hsLy{border-radius:10px;padding:10px 12px}#ptcs .hsLy.tg{background:#F0FAF4}#ptcs .hsLy.gm{background:#FFF5F5}#ptcs .hsLy.tg h5{color:var(--green-dark)}#ptcs .hsLy.gm h5{color:var(--red)}'
      + '#ptcs .hsLy ul,#ptcs .hsMc ul{margin:0;padding-left:17px;font-size:13px;line-height:1.55}#ptcs .hsLy li{padding:2px 0}'
      + '#ptcs .hsMt{overflow-x:auto}#ptcs .hsMt table{width:100%;border-collapse:separate;border-spacing:4px;font-size:12px}#ptcs .hsMt th{font-weight:700;text-align:center;padding:3px 4px;line-height:1.25;vertical-align:bottom;text-transform:none;letter-spacing:0;white-space:normal}#ptcs .hsMt th small{display:block;font-weight:400;color:var(--muted);font-size:10.5px}'
      + '#ptcs .hsMt tr th:first-child{text-align:left;white-space:normal;max-width:150px}#ptcs .hsMt td{text-align:center;border-radius:8px;padding:6px 4px;min-width:64px}#ptcs .hsMt td b{display:block;font-size:15px}#ptcs .hsMt td span{font-size:11.5px;font-weight:700}'
      + '#ptcs .hsMt td.mU{background:#E7F6EC}#ptcs .hsMt td.mU span{color:var(--green-dark)}#ptcs .hsMt td.mD{background:#FDECEC}#ptcs .hsMt td.mD span{color:var(--red)}#ptcs .hsMt td.mE{background:#F1F3F6}#ptcs .hsMt td.mE span{color:#475569}#ptcs .hsMt td.nay{box-shadow:inset 0 0 0 2px var(--text)}'
      + '#ptcs .hsY{font-size:12px;color:var(--muted);line-height:1.5;margin-top:6px}#ptcs .hsY b{color:var(--text)}'
      + '#ptcs .hsTd{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}@media (max-width:900px){#ptcs .hsTd{grid-template-columns:1fr}}#ptcs .hsTc{background:var(--panel2);border-radius:10px;padding:10px 12px;position:relative}'
      + '#ptcs .hsTh{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#475569;margin-bottom:6px}#ptcs .hsTc ul{list-style:none;margin:0;padding:0}#ptcs .hsTc li{display:flex;gap:7px;font-size:12.5px;line-height:1.5;padding:3px 0}'
      + '#ptcs .hsTc li>i,#ptcs .hsI{flex:none;font-style:normal;font-size:11px;width:14px;text-align:center;line-height:1.9}#ptcs .hsTc li>i.up,#ptcs .hsI.up{color:var(--green)}#ptcs .hsTc li>i.dn,#ptcs .hsI.dn{color:var(--red)}#ptcs .hsTc li>i.fl,#ptcs .hsI.fl{color:#7A828E}'
      + '#ptcs .hsMg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}@media (max-width:1000px){#ptcs .hsMg{grid-template-columns:1fr}}#ptcs .hsMc{border:1px solid var(--border);border-radius:10px;padding:10px 12px;min-width:0}'
      + '#ptcs .hsMt1{font-size:14px;font-weight:800}#ptcs .hsMt2{font-size:12px;color:var(--muted);line-height:1.4;margin:2px 0 8px}#ptcs .hsMs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-bottom:8px}'
      + '#ptcs .hsMs span{background:var(--panel2);border-radius:8px;padding:6px 8px;display:flex;flex-direction:column;min-width:0}#ptcs .hsMs small{font-size:11px;color:var(--muted);line-height:1.3}#ptcs .hsMs b{font-size:16px;line-height:1.25}#ptcs .hsMs em{font-style:normal;font-size:11px;color:#475569}'
      + '#ptcs .hsMc li{padding:2px 0}#ptcs .hsBd{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}@media (max-width:860px){#ptcs .hsBd{grid-template-columns:1fr}}'
      + '#ptcs .hsBc{border:1px solid var(--border);border-radius:10px;padding:10px 12px 10px;min-width:0}#ptcs .hsBt{font-size:13px;font-weight:700;margin-bottom:4px}#ptcs .hsBt small{font-weight:400;color:var(--muted)}'
      + '#ptcs .bdx2.nc{margin-right:36px}#ptcs .hsKh{display:flex;flex-direction:column;gap:8px}#ptcs .hsKr{display:grid;grid-template-columns:minmax(190px,.8fr) minmax(0,1.7fr) 52px;gap:4px 12px;align-items:center}@media (max-width:640px){#ptcs .hsKr{grid-template-columns:minmax(0,1fr) 48px}#ptcs .hsKt{grid-column:1/3}}'
      + '#ptcs .hsKr>.hsN{grid-column:1/-1;justify-self:start;margin:0}#ptcs .hsKt{display:flex;flex-direction:column;font-size:13px;line-height:1.35}#ptcs .hsKb{position:relative;height:12px;background:#E9ECF0;border-radius:6px}#ptcs .hsKb i{position:absolute;left:0;top:0;bottom:0;border-radius:6px}'
      + '#ptcs .hsKb i.ok{background:var(--green)}#ptcs .hsKb i.cham{background:#D97706}#ptcs .hsKb s{position:absolute;top:-4px;bottom:-4px;width:2px;margin-left:-1px;background:var(--text);border-radius:1px}#ptcs .hsKp{font-weight:800;text-align:right;font-size:14px}#ptcs .hsKp.up{color:var(--green-dark)}'
      + '#ptcs .hsCt{display:flex;flex-direction:column}#ptcs .hsCr{display:grid;grid-template-columns:minmax(150px,.9fr) minmax(0,2fr);gap:4px 16px;padding:9px 0;border-top:1px solid var(--border)}#ptcs .hsCr:first-child{border-top:0;padding-top:2px}'
      + '#ptcs .hsC1{display:flex;flex-direction:column;gap:2px;align-items:flex-start}#ptcs .hsC1 b{font-size:14px}#ptcs .hsC2{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}#ptcs .hsC2 span{display:flex;flex-direction:column;min-width:0}'
      + '#ptcs .hsC2 small{font-size:11px;color:var(--muted)}#ptcs .hsC2 b{font-size:15px}#ptcs .hsC2 b.up{color:var(--green-dark)}#ptcs .hsC2 b.down{color:var(--red)}#ptcs .hsC2 em{font-style:normal;font-size:11px;color:var(--muted)}'
      + '#ptcs .hsC3{grid-column:1/-1;font-size:12.5px;color:#475569;line-height:1.5}#ptcs .hsKn{font-size:11px;font-weight:800;padding:1px 7px;border-radius:999px;background:var(--green-soft);color:var(--green-dark)}#ptcs .hsC3 a{color:var(--blue);font-weight:600;white-space:nowrap}'
      + '@media (max-width:640px){#ptcs .hsCr{grid-template-columns:1fr}#ptcs .hsC1{flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 8px}#ptcs .hsC2{grid-template-columns:repeat(2,minmax(0,1fr))}}'
      + '#ptcs ul.hsRl,#ptcs ul.hsLc{list-style:none;margin:0;padding:0}#ptcs .hsRl li{display:flex;gap:10px;font-size:12.5px;line-height:1.5;padding:7px 0;border-top:1px dashed var(--border)}#ptcs .hsRl li:first-child{border-top:0;padding-top:0}'
      + '#ptcs .hsLv{flex:none;font-size:11px;letter-spacing:1px;width:34px;line-height:1.9}#ptcs .hsLv s{text-decoration:none;color:#D5DAE0}#ptcs .hsLv.l3{color:var(--red)}#ptcs .hsLv.l2{color:#D97706}#ptcs .hsLv.l1{color:#7A828E}#ptcs .hsTd2{color:#475569;margin-top:2px}'
      + '#ptcs .hsLc li{display:grid;grid-template-columns:110px minmax(0,1fr);gap:10px;font-size:12.5px;line-height:1.5;padding:6px 0 6px 12px;border-left:2px solid #CBD5E1;position:relative}#ptcs .hsLc li:before{content:"";position:absolute;left:-6px;top:11px;width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid var(--green)}'
      + '@media (max-width:480px){#ptcs .hsLc li{grid-template-columns:1fr;gap:0}}#ptcs .hsNg ol{margin:0;padding-left:20px;font-size:12.5px;line-height:1.6;columns:2;column-gap:28px}@media (max-width:760px){#ptcs .hsNg ol{columns:1}}#ptcs .hsNg a{color:var(--blue)}'
      /* ho so ban 2: ket luan, thang kich ban, tong cac phan, mo hinh, gia dinh, do nhay, theo doi quy, tham dinh */
      + '#ptcs .hsV{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:4px 0 4px}@media (max-width:1000px){#ptcs .hsV{grid-template-columns:repeat(3,minmax(0,1fr))}}'
      + '#ptcs .hsVo{background:var(--panel2);border-radius:10px;padding:10px 12px;min-width:0;display:flex;flex-direction:column;gap:2px;border:1px solid transparent}#ptcs .hsVo small{font-size:11.5px;color:var(--muted);font-weight:700;line-height:1.3}'
      + '#ptcs .hsVo b{font-size:22px;line-height:1.2}#ptcs .hsVo em{font-style:normal;font-size:12px;line-height:1.35;color:var(--muted)}#ptcs .hsVo em.up{color:var(--green-dark);font-weight:700}#ptcs .hsVo em.down{color:var(--red);font-weight:700}'
      + '#ptcs .hsVo.chinh{background:#F0FAF4;border-color:#BFE5CC}#ptcs .hsVo.mo.tc b{color:var(--green-dark)}#ptcs .hsVo.mo.kq b{color:#475569}#ptcs .hsVo.mo.tcu b{color:var(--red)}'
      + '#ptcs .hsSb{position:relative;height:84px;margin:10px 64px 0}#ptcs .hsSbT{position:absolute;left:0;right:0;top:33px;height:2px;background:#E3E7EC;border-radius:1px}'
      + '#ptcs .hsSbR{position:absolute;top:30px;height:8px;border-radius:4px;background:#CBD3DD}#ptcs .hsSbB{position:absolute;top:73px;height:6px;border-radius:3px;background:#D5DBE3}'
      + '#ptcs .hsSbBl{position:absolute;top:69px;padding-left:7px;font-size:10.5px;color:var(--muted);white-space:nowrap}#ptcs .hsSbBl.tr{transform:translateX(-100%);padding:0 7px 0 0}'
      + '#ptcs .hsSbM{position:absolute;top:24px;transform:translateX(-50%);text-align:center}#ptcs .hsSbM i{display:block;width:3px;height:20px;margin:0 auto;border-radius:2px;background:#64748B}'
      + '#ptcs .hsSbM.x i{background:var(--red)}#ptcs .hsSbM.t i{background:var(--green)}#ptcs .hsSbM.c i{background:var(--text);width:4px}#ptcs .hsSbM span{display:block;font-size:11.5px;white-space:nowrap;margin-top:4px;color:#475569}'
      + '#ptcs .hsSbM span b{color:var(--text)}#ptcs .hsSbM em{font-style:normal;font-weight:700;font-size:11px}#ptcs .hsSbM em.up{color:var(--green-dark)}#ptcs .hsSbM em.down{color:var(--red)}'
      + '#ptcs .hsSbP{position:absolute;top:0;width:0;height:44px}#ptcs .hsSbP span{position:absolute;top:0;left:0;transform:translateX(-50%);font-size:11.5px;white-space:nowrap;color:var(--text)}'
      + '#ptcs .hsSbP i{position:absolute;top:27px;left:-7px;width:14px;height:14px;border-radius:50%;background:var(--text);box-shadow:0 0 0 3px #fff;z-index:2}#ptcs .hsSbG{text-align:center}'
      + '#ptcs .hsLd{margin-top:12px;padding-top:12px;border-top:1px dashed var(--border)}#ptcs .hsSt{display:flex;height:30px;border-radius:6px;overflow:hidden;margin:4px 0 3px}'
      + '#ptcs .hsSt i{display:flex;align-items:center;justify-content:center;font-style:normal;font-size:11.5px;font-weight:700;white-space:nowrap;overflow:hidden;color:#fff;padding:0 6px}#ptcs .hsSt i.a{background:#2a78d6}#ptcs .hsSt i.b{background:#1A9E77}'
      + '#ptcs .hsStl{display:flex;justify-content:space-between;gap:8px;font-size:11.5px;color:var(--muted)}#ptcs ul.hsSo2{margin:8px 0 0;padding-left:18px;font-size:12.5px;line-height:1.55}#ptcs .hsSo2 li{padding:2px 0}#ptcs .hsSo2 li.mut{color:var(--muted)}'
      + '#ptcs .hsMh2{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:20px}@media (max-width:1000px){#ptcs .hsMh2{grid-template-columns:1fr}}#ptcs .hsMh2>*{min-width:0}#ptcs .hsGdw{margin-top:16px;padding-top:12px;border-top:1px dashed var(--border)}'
      + '#ptcs table.hsMh{width:100%;border-collapse:collapse;font-size:12.5px}#ptcs table.hsMh th{font-size:11.5px;color:var(--muted);text-align:right;padding:4px 8px;border-bottom:1px solid var(--border);text-transform:none;letter-spacing:0}'
      + '#ptcs table.hsMh td{padding:4px 8px;text-align:right;border-bottom:1px solid #F1F3F6;white-space:nowrap;vertical-align:top}#ptcs table.hsMh td:first-child{text-align:left;white-space:normal;color:#334155}#ptcs table.hsMh td.a{color:var(--muted)}'
      + '#ptcs table.hsMh tr.g td{background:var(--panel2);font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#475569;padding-top:6px}#ptcs table.hsMh tr.dam td{font-weight:800;font-size:13.5px;border-top:1.5px solid var(--text);color:var(--text)}'
      + '#ptcs table.hsMh tr.pe td{color:#475569;font-style:italic}#ptcs table.hsMh small{display:block;font-size:10.5px;font-weight:700}#ptcs table.hsMh small.up{color:var(--green-dark)}#ptcs table.hsMh small.down{color:var(--red)}'
      + '#ptcs .hs h5 small{font-weight:400;font-size:11.5px}#ptcs .bdp.ink{stroke:#334155}#ptcs .bdo.ink{background:#334155}#ptcs .bdvl.ink{color:#334155;font-weight:700}#ptcs .bdlg i.ink{background:#334155}'
      + '#ptcs .bdrl{background:rgba(255,255,255,.85);padding:0 3px;border-radius:3px}#ptcs .hsPeL{padding-right:34px}'
      + '#ptcs .hsLdL{display:flex;flex-direction:column}#ptcs .hsLdR{display:grid;grid-template-columns:112px minmax(0,1fr);gap:14px;padding:9px 0;border-top:1px solid #EEF0F3}#ptcs .hsLdR:first-child{border-top:0;padding-top:2px}'
      + '#ptcs .hsLdS b{display:block;font-size:21px;font-weight:800;line-height:1.1;color:var(--text);letter-spacing:-.01em}#ptcs .hsLdS small{display:block;font-size:11px;color:var(--muted);line-height:1.3;margin-top:3px}'
      + '#ptcs .hsLdT b{display:block;font-size:13.5px;margin-bottom:1px}#ptcs .hsLdT span{font-size:13px;line-height:1.55;color:#334155}'
      + '#ptcs .hsPk{margin-top:14px}#ptcs .hsPkH{font-size:12px;color:#475569;margin-bottom:2px}#ptcs .hsPkH i{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:-1px;margin:0 1px}#ptcs .hsPkH i.me{background:var(--text)}#ptcs .hsPkH i.kv{background:#B8C0CB}'
      + '#ptcs .hsPkR,#ptcs .hsPkX{display:grid;grid-template-columns:128px minmax(0,1fr) 118px;gap:12px;align-items:center}#ptcs .hsPkR{padding:3px 0}#ptcs .hsPkT b{display:block;font-size:12.5px}#ptcs .hsPkT small{display:block;font-size:11px;color:var(--muted);line-height:1.25}'
      + '#ptcs .hsPkB{position:relative;height:32px;background:linear-gradient(#E3E7EC,#E3E7EC) 0 22px/100% 1px no-repeat}#ptcs .hsPkB i{position:absolute;top:22px}'
      + '#ptcs .hsPkB i.kv{width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#B8C0CB;box-shadow:0 0 0 1.5px #fff}#ptcs .hsPkB i.tv{width:2px;height:16px;margin:-8px 0 0 -1px;background:#64748B;border-radius:1px}'
      + '#ptcs .hsPkB i.me{width:13px;height:13px;margin:-6.5px 0 0 -6.5px;border-radius:50%;background:var(--text);box-shadow:0 0 0 2px #fff;z-index:2}#ptcs .hsPkB b.mel{position:absolute;top:0;transform:translateX(-50%);font-size:11.5px;font-weight:800;white-space:nowrap;line-height:1.2}'
      + '#ptcs .hsPkB em.vuot{position:absolute;right:0;top:0;font-style:normal;font-size:10px;color:var(--muted)}#ptcs .hsPkV{text-align:right;padding-top:8px;line-height:1.25}#ptcs .hsPkV b{display:block;font-size:13px;color:var(--text)}#ptcs .hsPkV small{font-size:10.5px;color:var(--muted)}'
      + '#ptcs .hsPkX>div{position:relative;height:14px}#ptcs .hsPkX>div span{position:absolute;transform:translateX(-50%);font-size:10px;color:var(--muted)}'
      + '#ptcs .hsFf{margin-top:4px}#ptcs .hsFfR,#ptcs .hsFfX{display:grid;grid-template-columns:50px minmax(0,1fr) 96px;gap:10px;align-items:center}#ptcs .hsFfR{margin-top:9px}#ptcs .hsFfT{font-size:12.5px;color:#475569}#ptcs .hsFfR.cs .hsFfT{font-weight:800;color:var(--text)}'
      + '#ptcs .hsFfB{position:relative;display:flex;height:24px}#ptcs .hsFfB i{display:flex;align-items:center;justify-content:center;height:100%;margin-right:2px;font-style:normal;font-size:11px;font-weight:700;color:#fff;overflow:hidden;white-space:nowrap;cursor:default}'
      + '#ptcs .hsFfB i:first-child{border-radius:4px 0 0 4px}#ptcs .hsFfB i:last-of-type{border-radius:0 4px 4px 0;margin-right:0}#ptcs .hsFfB i.c1{background:#2a78d6}#ptcs .hsFfB i.c2{background:#eb6834}#ptcs .hsFfB i.c3{background:#1A9E77}#ptcs .hsFfB i.c4{background:#8E98A6}'
      + '#ptcs .hsFfB s{position:absolute;top:-3px;bottom:-3px;width:2px;margin-left:-1px;background:var(--text);border-radius:1px}#ptcs .hsFfV{display:flex;align-items:baseline;justify-content:flex-end;gap:6px}#ptcs .hsFfV b{font-size:15px}'
      + '#ptcs .hsFfV em{font-style:normal;font-size:11.5px;font-weight:700}#ptcs .hsFfV em.up{color:var(--green-dark)}#ptcs .hsFfV em.down{color:var(--red)}#ptcs .hsFfM{margin:2px 0 0 60px;font-size:11px;color:var(--muted);line-height:1.35}'
      + '#ptcs .hsFfX{margin-top:6px}#ptcs .hsFfX .tk{position:relative;height:15px;border-top:1px solid #D5DAE0}#ptcs .hsFfX .tk span{position:absolute;top:2px;transform:translateX(-50%);font-size:10px;color:var(--muted)}#ptcs .bdlg i.gia{width:2px;height:12px;background:var(--text);vertical-align:-2px;border-radius:0}'
      + '#ptcs table.hsDgT{width:100%;border-collapse:collapse;font-size:12px;margin-top:14px}#ptcs table.hsDgT th{font-size:11px;color:var(--muted);text-align:right;padding:4px 8px;border-bottom:1px solid var(--border);text-transform:none;letter-spacing:0;font-weight:700}'
      + '#ptcs table.hsDgT th:first-child{text-align:left}#ptcs table.hsDgT th small{font-weight:400}#ptcs table.hsDgT td{padding:4px 8px;text-align:right;border-bottom:1px solid #F1F3F6;white-space:nowrap;vertical-align:top}'
      + '#ptcs table.hsDgT td:first-child{text-align:left;white-space:normal;color:#334155}#ptcs table.hsDgT td small{display:block;font-size:10.5px;color:var(--muted);font-weight:400}#ptcs table.hsDgT td.cs{background:#F6F8FA;font-weight:700}'
      + '#ptcs table.hsDgT tr.sum td{border-top:1px solid #D5DAE0}#ptcs table.hsDgT tr.dam td{font-weight:800;font-size:13.5px;border-top:1.5px solid var(--text);color:var(--text)}#ptcs table.hsDgT span.up{color:var(--green-dark)}#ptcs table.hsDgT span.down{color:var(--red)}'
      + '#ptcs table.hsDgT i.sw{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:6px}#ptcs table.hsDgT i.sw.c1{background:#2a78d6}#ptcs table.hsDgT i.sw.c2{background:#eb6834}#ptcs table.hsDgT i.sw.c3{background:#1A9E77}#ptcs table.hsDgT i.sw.c4{background:#8E98A6}'
      + '#ptcs .hsWf{display:flex;flex-direction:column;gap:5px}#ptcs .hsWfR{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) 104px;gap:10px;align-items:center;font-size:12.5px;cursor:default}#ptcs .hsWfT{color:#334155}#ptcs .hsWfR.tong .hsWfT{font-weight:700;color:var(--text)}'
      + '#ptcs .hsWfB{position:relative;height:14px}#ptcs .hsWfB i{position:absolute;top:0;bottom:0;border-radius:3px}#ptcs .hsWfR.tong i{background:#A3AFBF}#ptcs .hsWfR.tang i{background:var(--green)}#ptcs .hsWfR.giam i{background:var(--red)}'
      + '#ptcs .hsWfR b{text-align:right;white-space:nowrap}#ptcs .hsWfR.tong b{font-weight:800}#ptcs .hsWfR b em{font-style:normal;font-size:11px;margin-left:4px}#ptcs .hsWfR b em.up{color:var(--green-dark)}#ptcs .hsWfR b em.down{color:var(--red)}'
      + '#ptcs table.hsTq th.rg{text-align:center;font-weight:400}#ptcs table.hsTq th.rg b{font-weight:800;color:var(--text)}#ptcs table.hsTq td.rg{width:44%;padding-top:8px}#ptcs table.hsTq td:first-child small{display:block}'
      + '#ptcs .hsRg{position:relative;height:14px;background:linear-gradient(#E3E7EC,#E3E7EC) 0 50%/100% 1px no-repeat}#ptcs .hsRg i{position:absolute;top:50%}#ptcs .hsRg i.r{height:8px;margin-top:-4px;border-radius:4px;background:#CBD3DD}'
      + '#ptcs .hsRg i.c{width:3px;height:16px;margin:-8px 0 0 -1.5px;background:var(--text);border-radius:1px}#ptcs .hsRg i.ck{width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;border:2px solid #64748B;background:#fff;box-sizing:border-box}'
      + '#ptcs .hsRg i.tt{width:11px;height:11px;margin:-5.5px 0 0 -5.5px;background:#2a78d6;transform:rotate(45deg);box-shadow:0 0 0 1.5px #fff;z-index:2}#ptcs .hsRgL{text-align:center;font-size:10.5px;color:var(--muted);margin-top:1px}#ptcs .hsRgL b{color:var(--text);margin:0 5px}#ptcs .hsRgN{text-align:center;font-size:11.5px;color:#475569}'
      + '#ptcs .hsRc{flex:1;min-width:0}#ptcs .hsRh{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px}#ptcs .hsTac{margin-left:auto;font-size:11.5px;font-weight:700;color:#334155;background:#F1F3F6;border-radius:6px;padding:1px 8px;white-space:nowrap}'
      + '#ptcs .hsTgS{display:flex;gap:2px;height:24px;margin:2px 0 10px;border-radius:6px;overflow:hidden}#ptcs .hsTgS i{display:flex;align-items:center;justify-content:center;font-style:normal;font-size:11.5px;font-weight:800;white-space:nowrap;overflow:hidden;padding:0 6px}'
      + '#ptcs .hsTgS i.ok{background:var(--green-soft);color:var(--green-dark)}#ptcs .hsTgS i.mot{background:var(--amber-soft);color:#B45309}#ptcs .hsTgS i.no{background:var(--red-soft);color:var(--red)}#ptcs .hsTgS i.tk{background:#EDF0F4;color:#475569}'
      + '#ptcs table.hsGd{width:100%;border-collapse:collapse;font-size:12px;table-layout:fixed}#ptcs table.hsGd th{font-size:11px;color:var(--muted);text-align:left;padding:4px 6px;border-bottom:1px solid var(--border);text-transform:none;letter-spacing:0}'
      + '#ptcs table.hsGd td{padding:5px 6px;border-bottom:1px solid #F1F3F6;vertical-align:top}#ptcs table.hsGd td.v,#ptcs table.hsGd td.cs{white-space:nowrap;text-align:center}#ptcs table.hsGd td.cs{font-weight:800;background:#F6F8FA}#ptcs table.hsGd td.ld{color:var(--muted);font-size:11.5px;line-height:1.45;white-space:normal;overflow-wrap:anywhere}#ptcs table.hsGd td{white-space:normal;text-align:left}#ptcs table.hsGd td.v,#ptcs table.hsGd td.cs{text-align:center}'
      + '#ptcs .hsTn{display:flex;flex-direction:column;gap:5px}#ptcs .hsTnr{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) 46px;gap:8px;align-items:center;font-size:12px;cursor:default}'
      + '#ptcs .hsTnb{position:relative;height:12px;background:linear-gradient(90deg,transparent calc(50% - .5px),#9AA3AE calc(50% - .5px),#9AA3AE calc(50% + .5px),transparent calc(50% + .5px))}#ptcs .hsTnb i{position:absolute;top:0;bottom:0}'
      + '#ptcs .hsTnb i.dn{right:50%;background:#F3A3A6;border-radius:3px 0 0 3px}#ptcs .hsTnb i.up{left:50%;background:#9ED9B4;border-radius:0 3px 3px 0}#ptcs .hsTnr b{text-align:right}'
      + '#ptcs table.hsTq{width:100%;border-collapse:collapse;font-size:12px}#ptcs table.hsTq th{font-size:11px;color:var(--muted);text-align:right;padding:4px 6px;border-bottom:1px solid var(--border);text-transform:none;letter-spacing:0;vertical-align:bottom}#ptcs table.hsTq th small{display:block;font-weight:400}'
      + '#ptcs table.hsTq td{padding:5px 6px;text-align:right;border-bottom:1px solid #F1F3F6;white-space:nowrap}#ptcs table.hsTq th:first-child,#ptcs table.hsTq td:first-child{text-align:left}#ptcs table.hsTq small{font-size:10.5px;color:var(--muted)}#ptcs table.hsTq small.up{color:var(--green-dark)}#ptcs table.hsTq small.down{color:var(--red)}'
      + '#ptcs .hsTg{display:flex;flex-direction:column}#ptcs .hsTgh,#ptcs .hsTgr{display:grid;grid-template-columns:minmax(0,1.05fr) 158px minmax(0,1.6fr) minmax(0,1.1fr);gap:14px}#ptcs .hsTgh{font-size:11px;font-weight:700;color:var(--muted);padding:0 0 6px;border-bottom:1px solid var(--border)}'
      + '#ptcs .hsTgr{padding:9px 0;border-bottom:1px solid #F1F3F6;font-size:12.5px;line-height:1.5}#ptcs .hsTgr small{display:block;color:var(--muted);font-size:11.5px}#ptcs .hsTgr .mh{color:#334155}'
      + '#ptcs .hsDg{display:inline-block;font-size:11.5px;font-weight:800;padding:2px 9px;border-radius:999px;white-space:nowrap}#ptcs .hsDg.ok{background:var(--green-soft);color:var(--green-dark)}#ptcs .hsDg.mot{background:var(--amber-soft);color:#B45309}#ptcs .hsDg.no{background:var(--red-soft);color:var(--red)}#ptcs .hsDg.tk{background:#EDF0F4;color:#475569}'
      + '@media (max-width:900px){#ptcs .hsTgh{display:none}#ptcs .hsTgr{grid-template-columns:1fr;gap:4px}}#ptcs .hsTk{background:#FBFCFD}#ptcs .hsTk h5{margin-top:0}'
      + '@media (max-width:560px){#ptcs .bdx2.deu span.an{visibility:hidden}#ptcs .hs{padding:12px 10px}#ptcs .hsM{font-size:14.5px}#ptcs .hsTi b{font-size:18px}#ptcs .hsMt table{border-spacing:3px}#ptcs .hsMt td{min-width:0;padding:5px 2px}#ptcs .hsMt td b{font-size:13.5px}#ptcs .hsMt td span{font-size:11px}#ptcs .hsMt tr th:first-child{max-width:96px;font-size:11px}#ptcs .hsMt th small{font-size:9.5px}#ptcs .caur{grid-template-columns:minmax(0,1.3fr) minmax(0,.8fr) 52px;font-size:12px}}';
    document.head.appendChild(st);
  }

  window.__knHoSo = {
    tai: tai, lay: function(t){ return HS[t] || null; }, css: css, nghe: function(fn){ NGHE = fn; },
    phanA: function(p, cx){ css(); return phanA(p, cx); }, phanB: phanB, phanC: phanC, phanD: phanD
  };
})();
