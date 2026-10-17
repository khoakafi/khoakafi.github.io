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
    var tv = trungVi(tps), pe26 = ct.map(function(x){ return peTu(gia, p.cp_trieu, x.ln26); }).filter(function(v){ return v != null; });
    return { tv: tv, up: (tv && gia > 0) ? (tv / 1000 / gia - 1) * 100 : null, n: tps.length,
      pe26lo: pe26.length ? Math.min.apply(null, pe26) : null, pe26hi: pe26.length ? Math.max.apply(null, pe26) : null };
  }
  function dien(s, sg){ return esc(s).replace(/\{pe26\}/g, sg.pe26lo != null ? (Math.abs(sg.pe26hi - sg.pe26lo) < 0.5 ? f(sg.pe26lo, 1) : f(sg.pe26lo, 1) + '–' + f(sg.pe26hi, 1)) : '—'); }

  /* ---------- Phan A: dau trang + can can (ve lai khi gia doi) ---------- */
  var TEN3 = { tc: 'TÍCH CỰC', kq: 'KHẢ QUAN', tcu: 'TIÊU CỰC' };
  function phanA(p, cx){
    var gia = cx.gia, sg = soGia(p, gia), soBc = (p.ctck || []).length, soWeb = (p.nguon || []).length - soBc;
    var h = '<div class="hs hsA"><div class="hsH"><span class="hsK">Hồ sơ phân tích</span><b>' + esc(p.ma) + ' · ' + esc(p.ten) + '</b>'
      + '<span class="mini">cập nhật ' + ngVn(p.cap_nhat) + ' · tổng hợp ' + soBc + ' báo cáo CTCK gần nhất' + (soWeb > 0 ? ' + ' + soWeb + ' tài liệu, bài báo' : '') + '</span></div>';
    h += '<div class="hsM">' + dien(p.dong_mo, sg) + '</div>';
    if (p.cau_hoi) h += '<div class="hsQ"><b>Câu hỏi quyết định:</b> ' + esc(p.cau_hoi) + '</div>';
    var mo = cx.mo;
    h += '<div class="hsG">'
      + '<div class="hsTi"><small>Giá hôm nay</small><b>' + (gia > 0 ? f(gia, 2) : '—') + '</b><em class="mut">nghìn đồng</em></div>'
      + '<div class="hsTi"><small>Giá mục tiêu trung vị ' + sg.n + ' CTCK</small><b>' + (sg.tv ? f(sg.tv / 1000, 1) : '—') + '</b><em class="' + lop(sg.up) + '">' + (sg.up != null ? pct(sg.up) + ' so với hôm nay' : '') + '</em></div>'
      + '<div class="hsTi"><small>P/E dự phóng 2026</small><b>' + (sg.pe26lo != null ? f(sg.pe26lo, 1) + (sg.pe26hi - sg.pe26lo >= 0.5 ? '–' + f(sg.pe26hi, 1) : '') : '—') + '</b><em class="mut">theo lợi nhuận dự phóng của CTCK</em></div>'
      + '<div class="hsTi"><small>Mô hình định lượng của trang</small><b class="hsMo ' + (mo ? mo.muc : '') + '">' + (mo ? TEN3[mo.muc] || '—' : '—') + '</b><em class="mut">' + (mo && mo.hanh ? esc(mo.hanh) : 'xem khung bên dưới') + '</em></div>'
      + '</div>';
    if (p.tom_tat && p.tom_tat.length) h += '<ol class="hsTT">' + p.tom_tat.map(function(z){ return '<li>' + esc(z.t) + nguon(z.ng) + '</li>'; }).join('') + '</ol>';
    h += '</div>';
    // Can can
    h += '<div class="hs"><div class="hsH"><span class="hsK">Cán cân lợi nhuận – rủi ro</span></div><div class="hs2">'
      + '<div class="hsLy tg"><h5>▲ Vì sao giá có thể tăng</h5><ul>' + (p.tang || []).map(function(z){ return '<li>' + esc(z.t) + nguon(z.ng) + '</li>'; }).join('') + '</ul></div>'
      + '<div class="hsLy gm"><h5>▼ Vì sao giá có thể giảm</h5><ul>' + (p.giam || []).map(function(z){ return '<li>' + esc(z.t) + nguon(z.ng) + '</li>'; }).join('') + '</ul></div></div>';
    h += '<div class="hs2 hsSo">' + maTran(p, gia) + '<div>' + cauLn(p) + duPhong(p) + '</div></div></div>';
    return h;
  }
  // Ma tran: loi nhuan 2027 du phong (cot) x P/E (hang) -> gia; so voi gia hom nay
  function maTran(p, gia){
    var kb = p.kich_ban, cp = p.cp_trieu; if (!kb || !cp || !(gia > 0) || !kb.ln27 || kb.ln27.length < 2) return '';
    var lnG = kb.ln27[Math.floor(kb.ln27.length / 2)][1], sg = soGia(p, gia);
    var pes = kb.pe.map(function(z){
      if (z[0] === 'now') return { v: peTu(gia, cp, lnG), ten: z[1], ngan: z[2] || 'hôm nay', now: 1 };
      if (z[0] === 'tp') return { v: sg.tv ? peTu(sg.tv / 1000, cp, lnG) : null, ten: z[1], ngan: z[2] || 'giá MT' };
      return { v: +z[0], ten: z[1], ngan: z[2] || '' };
    }).filter(function(z){ return z.v > 0; }).sort(function(a, b){ return a.v - b.v; });
    var duoi = [], tren = 0, tong = 0;
    var h = '<div><h5>Giá hôm nay đã tính kịch bản nào?</h5><div class="hsMt"><table><tr><th>P/E × LN 2027</th>' + kb.ln27.map(function(c){ var ai = (/\((.*)\)/.exec(c[0]) || [])[1]; return '<th>' + esc(c[0].replace(/\s*\(.*\)/, '')) + '<small>' + (ai ? esc(ai) + ' · ' : '') + f(c[1], 0) + ' tỷ</small></th>'; }).join('') + '</tr>';
    pes.forEach(function(r){
      h += '<tr><th title="' + esc(r.ten) + '">P/E ' + f(r.v, 1) + '<small>' + esc(r.ngan) + '</small></th>';
      kb.ln27.forEach(function(c){ var g = r.v * c[1] / cp, d = (g / gia - 1) * 100; tong++;
        if (d < -10) duoi.push(c[0].replace(/\s*\(.*\)/, '').toLowerCase() + ' × P/E ' + f(r.v, 1)); else if (d > 10) tren++;
        var cl = d < -10 ? 'mD' : (d > 10 ? 'mU' : 'mE');
        h += '<td class="' + cl + (r.now && c[1] === lnG ? ' nay' : '') + '" title="' + esc(f(c[1], 0) + ' tỷ × P/E ' + f(r.v, 1) + ' ÷ ' + f(cp, 1) + ' triệu cp') + '"><b>' + f(g, 1) + '</b><span>' + (d > 10 ? '▲ ' : (d < -10 ? '▼ ' : '')) + pct(d) + '</span></td>'; });
      h += '</tr>';
    });
    h += '</table></div><div class="hsY">Hàng: ' + pes.map(function(r){ return '<b>P/E ' + f(r.v, 1) + '</b> = ' + esc(r.ten.charAt(0).toLowerCase() + r.ten.slice(1)); }).join('; ') + '. Ô viền đậm = giá hôm nay. ' + tren + '/' + tong + ' ô cao hơn giá hôm nay quá 10%' + (duoi.length ? ', ' + duoi.length + ' ô thấp hơn quá 10% (' + duoi.join('; ') + ')' : ', không ô nào thấp hơn quá 10%') + '. ' + esc(kb.y || '') + nguon(kb.ng) + '</div></div>';
    return h;
  }
  // Cau loi nhuan: buoc thay doi tu nam truoc sang nam sau (thanh hai phia)
  function cauLn(p){
    var c = p.cau_ln; if (!c || !c.buoc) return '';
    var mx = Math.max.apply(null, c.buoc.map(function(z){ return Math.abs(z[1]); }).concat([1])), d = c.cuoi[1] - c.dau[1];
    return '<h5>' + esc(c.ten) + '</h5><div class="cau hsCau">' + c.buoc.map(function(z){
      return '<div class="caur" title="' + esc(z[0] + ': ' + (z[1] > 0 ? '+' : '') + f(z[1], 0) + ' tỷ') + '"><span>' + esc(z[0]) + '</span><span class="caub"><i class="' + (z[1] >= 0 ? 'up' : 'dn') + '" style="width:'
        + (Math.abs(z[1]) / mx * 50).toFixed(1) + '%"></i></span><b class="' + (z[1] >= 0 ? 'up' : 'down') + '">' + (z[1] > 0 ? '+' : (z[1] < 0 ? '−' : '')) + f(Math.abs(z[1]), 0) + '</b></div>'; }).join('')
      + '<div class="caur tong"><span>' + esc(c.dau[0]) + ' ' + f(c.dau[1], 0) + ' → ' + esc(c.cuoi[0]) + ' ' + f(c.cuoi[1], 0) + ' tỷ</span><span></span><b class="' + lop(d) + '">' + pct(d / c.dau[1] * 100, 1) + '</b></div></div>'
      + '<div class="hsY">' + esc(c.y || '') + nguon(c.ng) + '</div>';
  }
  // Du phong loi nhuan tung CTCK (cot doi 2026 / 2027)
  function duPhong(p){
    var ds = (p.ctck || []).filter(function(x){ return x.ln26 || x.ln27; }); if (ds.length < 2) return '';
    var ss = [{ ten: 'LN 2026 dự phóng', v: ds.map(function(x){ return x.ln26; }), cls: 'c1' }, { ten: 'LN 2027 dự phóng', v: ds.map(function(x){ return x.ln27; }), cls: 'c2' }];
    var fm = function(v){ return f(v / 1000, 1); };
    return '<h5 style="margin-top:14px">Lợi nhuận dự phóng của từng CTCK (nghìn tỷ đồng)</h5>' + chuGiai(ss) + bdCot(ss, ds.map(function(x){ return x.ctck; }), { cao: 104, fm: fm, nhan: 1, moiNhan: 1 });
  }

  /* ---------- Phan B: top-down, mang kinh doanh, bieu do KPI, ke hoach ---------- */
  function phanB(p){
    var h = '';
    if (p.top_down && p.top_down.length) {
      h += '<div class="hs"><div class="hsH"><span class="hsK">Từ trên xuống: vĩ mô → ngành → doanh nghiệp</span></div><div class="hsTd">'
        + p.top_down.map(function(t, i){ return '<div class="hsTc"><div class="hsTh">' + (i + 1) + '. ' + esc(t.tang) + '</div><ul>' + t.y.map(function(z){
          var ic = z.h > 0 ? ['up', '▲'] : (z.h < 0 ? ['dn', '▼'] : ['fl', '◆']);
          return '<li><i class="' + ic[0] + '" title="' + (z.h > 0 ? 'Thuận lợi' : (z.h < 0 ? 'Bất lợi' : 'Trung tính / hai mặt')) + '">' + ic[1] + '</i><span>' + esc(z.t) + nguon(z.ng) + '</span></li>'; }).join('') + '</ul></div>'; }).join('')
        + '</div><div class="hsY"><i class="hsI up">▲</i> thuận lợi · <i class="hsI dn">▼</i> bất lợi · <i class="hsI fl">◆</i> hai mặt</div></div>';
    }
    if (p.mang && p.mang.length) {
      h += '<div class="hs"><div class="hsH"><span class="hsK">Bên trong doanh nghiệp: từng mảng</span></div><div class="hsMg">'
        + p.mang.map(function(m){ return '<div class="hsMc"><div class="hsMt1">' + esc(m.ten) + '</div><div class="hsMt2">' + esc(m.phu || '') + '</div>'
          + (m.so && m.so.length ? '<div class="hsMs">' + m.so.map(function(z){ return '<span><small>' + esc(z[0]) + '</small><b>' + esc(z[1]) + '</b>' + (z[2] ? '<em>' + esc(z[2]) + '</em>' : '') + '</span>'; }).join('') + '</div>' : '')
          + '<ul>' + (m.y || []).map(function(z){ return '<li>' + esc(z.t) + nguon(z.ng) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>';
      if (p.bieu_do && p.bieu_do.length) h += '<div class="hsBd">' + p.bieu_do.map(bieuDo).join('') + '</div>';
      h += '</div>';
    }
    if (p.ke_hoach && p.ke_hoach.ds) h += keHoach(p.ke_hoach);
    return h;
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

  /* ---------- Phan C: CTCK (ve lai khi gia doi) ---------- */
  function phanC(p, cx){
    var ct = p.ctck || []; if (!ct.length) return '';
    var gia = cx.gia, sg = soGia(p, gia);
    var h = '<div class="hs"><div class="hsH"><span class="hsK">CTCK nói gì</span><span class="mini">' + ct.length + ' báo cáo gần nhất mỗi công ty · số trong báo cáo, lời tóm tắt là của trang</span></div><div class="hsCt">';
    ct.forEach(function(x){ var dc = tpDc(p, x), up = (dc && gia > 0) ? (dc / 1000 / gia - 1) * 100 : null;
      h += '<div class="hsCr"><div class="hsC1"><b>' + esc(x.ctck) + '</b><span class="mini">' + ngVn(x.ngay) + '</span><span class="hsKn">' + esc(x.kn) + '</span></div>'
        + '<div class="hsC2"><span><small>Giá mục tiêu</small><b>' + (x.tp ? f(x.tp / 1000, 1) : '—') + '</b>' + (x.tp && dc !== x.tp ? '<em title="Đã trừ cổ tức tiền mặt chi sau ngày ra báo cáo">sau cổ tức ' + f(dc / 1000, 1) + '</em>' : '') + '</span>'
        + '<span><small>So với hôm nay</small><b class="' + lop(up) + '">' + pct(up) + '</b></span>'
        + '<span><small>LN 2026F</small><b>' + (x.ln26 ? f(x.ln26, 0) : '—') + '</b></span><span><small>LN 2027F</small><b>' + (x.ln27 ? f(x.ln27, 0) : '—') + '</b></span></div>'
        + '<div class="hsC3">' + esc(x.y || '') + (x.pp ? ' <span class="mini">· ' + esc(x.pp) + '</span>' : '') + (x.link ? ' <a href="' + esc(x.link) + '" target="_blank" rel="noopener">báo cáo gốc</a>' : '') + '</div></div>'; });
    h += '</div>';
    var tp = cx.raw ? tpLichSu(cx.raw, gia) : '';
    if (tp) h += tp;
    h += '<div class="hsY">' + esc(p.ctck_chu || '') + (sg.tv ? ' Trung vị ' + sg.n + ' báo cáo: ' + f(sg.tv / 1000, 1) + ' (' + pct(sg.up) + ').' : '') + '</div></div>';
    return h;
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
    svg += '<polyline class="bdp c4" points="' + gThang.map(function(z){ return X(z[0]).toFixed(2) + ',' + Y(z[1]).toFixed(2); }).join(' ') + '"/></svg>';
    var h = '<h5 style="margin-top:12px">Giá mục tiêu từng báo cáo và giá cổ phiếu, 16 tháng</h5><div class="bdlg"><span><i class="c1 tron"></i>Giá mục tiêu (mỗi chấm một báo cáo)</span><span><i class="c4"></i>Giá cổ phiếu cuối tháng</span></div>'
      + '<div class="bdd bddt" style="height:150px">' + svg;
    for (var g2 = mn; g2 <= mx + st / 2; g2 += st) h += '<span class="bdgl" style="top:' + Y(g2).toFixed(1) + '%">' + f(g2, 0) + '</span>';
    bc.forEach(function(x){ h += '<i class="bdo tp c1" style="left:' + X(ts(x.d)).toFixed(1) + '%;top:' + Y(x.tp / 1000).toFixed(1) + '%" title="' + esc(x.d + ' · ' + x.s + ' · ' + (x.r || '') + ' · ' + f(x.tp / 1000, 1)) + '"></i>'; });
    if (gia > 0) h += '<i class="bdo c4" style="left:100%;top:' + Y(gia).toFixed(1) + '%" title="Hôm nay ' + f(gia, 2) + '"></i>';
    // trung vi gia muc tieu theo quy
    var q = {}; bc.forEach(function(x){ var p = x.d.split('/'), k = p[2] + '-Q' + Math.ceil(+p[1] / 3); (q[k] = q[k] || []).push(x.tp / 1000); });
    var qs = Object.keys(q).sort();
    var mlb = []; for (var i = 0; i <= 4; i++) { var dd = new Date(t0 + (now - t0) * i / 4); mlb.push('<span>' + ('0' + (dd.getUTCMonth() + 1)).slice(-2) + '/' + String(dd.getUTCFullYear()).slice(2) + '</span>'); }
    h += '</div><div class="bdx2 t deu">' + mlb.join('') + '</div>';
    h += '<div class="hsY">Trung vị giá mục tiêu theo quý: ' + qs.map(function(k){ return k.slice(5) + '/' + k.slice(2, 4) + ' <b>' + f(trungVi(q[k]), 1) + '</b> (' + q[k].length + ')'; }).join(' → ')
      + '. Nguồn danh sách: Simplize (giá mục tiêu đã điều chỉnh cổ tức).</div>';
    return h;
  }

  /* ---------- Phan D: rui ro, lich, nguon ---------- */
  function phanD(p){
    var h = '';
    if ((p.rui_ro && p.rui_ro.length) || (p.lich && p.lich.length)) {
      h += '<div class="hs"><div class="hs2 hsRr">';
      if (p.rui_ro && p.rui_ro.length) h += '<div><div class="hsH"><span class="hsK">Rủi ro cần theo dõi</span></div><ul class="hsRl">' + p.rui_ro.map(function(z){
        var m = Math.max(1, Math.min(3, z.muc || 1));
        return '<li><span class="hsLv l' + m + '" title="Mức ' + ['', 'thấp', 'vừa', 'cao'][m] + '">' + '●●●'.slice(0, m) + '<s>' + '●●●'.slice(m) + '</s></span><div><b>' + esc(z.t) + '</b> <span class="mini">' + ['', 'thấp', 'vừa', 'cao'][m] + '</span>'
          + (z.ct ? '<div>' + esc(z.ct) + '</div>' : '') + (z.theo_doi ? '<div class="hsTd2"><b>Theo dõi:</b> ' + esc(z.theo_doi) + '</div>' : '') + nguon(z.ng) + '</div></li>'; }).join('') + '</ul></div>';
      if (p.lich && p.lich.length) h += '<div><div class="hsH"><span class="hsK">Sự kiện sắp tới</span></div><ul class="hsLc">' + p.lich.map(function(z){ return '<li><b>' + esc(z.khi) + '</b><span>' + esc(z.t) + '</span></li>'; }).join('') + '</ul></div>';
      h += '</div></div>';
    }
    if (p.nguon && p.nguon.length) h += '<div class="hs hsNg"><div class="hsH"><span class="hsK">Nguồn</span><span class="mini">bấm để mở bản gốc</span></div><ol>'
      + p.nguon.map(function(z){ return '<li><a href="' + esc(z.link) + '" target="_blank" rel="noopener">' + esc(z.ten) + '</a> <span class="mini">' + esc(z.ngay || '') + '</span></li>'; }).join('') + '</ol>'
      + '<div class="hsY">Hồ sơ do khoanguyeninvest.vn tổng hợp từ báo cáo CTCK và thông tin doanh nghiệp công bố; mỗi con số ghi nguồn. Không phải khuyến nghị đầu tư. '
      + 'Mô hình định lượng của trang là quy tắc cố định (rule-based), kiểm định trên dữ liệu 2014 – 2026.</div></div>';
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
      + '#ptcs .bdb.c1,#ptcs .bdlg i.c1{background:#2a78d6}#ptcs .bdb.c2,#ptcs .bdlg i.c2{background:#eb6834}#ptcs .bdb.c3,#ptcs .bdlg i.c3{background:#1A9E77}#ptcs .bdb.c4,#ptcs .bdlg i.c4{background:#7B61C9}'
      + '#ptcs .bd0{position:absolute;left:0;right:0;height:1px;background:#9AA3AE;z-index:1}#ptcs .bdv{position:absolute;transform:translate(-50%,-2px);font-style:normal;font-size:10.5px;font-weight:700;color:var(--text);white-space:nowrap;line-height:1;margin-bottom:2px}'
      + '#ptcs .bdx{display:flex}#ptcs .bdx span{flex:1;min-width:0;text-align:center;font-size:10.5px;color:var(--muted);white-space:nowrap;overflow:visible;margin-top:3px}'
      + '#ptcs .bdd{position:relative;margin:6px 0 0}#ptcs .bdd.bddt{margin-left:34px}#ptcs .bds{position:absolute;inset:0;width:100%;height:100%;overflow:visible}'
      + '#ptcs .bdp{fill:none;stroke-width:2.2;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}#ptcs .bdp.net{stroke-dasharray:5 3}#ptcs .bdp.c1{stroke:#2a78d6}#ptcs .bdp.c2{stroke:#eb6834}#ptcs .bdp.c3{stroke:#1A9E77}#ptcs .bdp.c4{stroke:#7B61C9}'
      + '#ptcs .bdg{stroke:#E6E9EE;stroke-width:1;vector-effect:non-scaling-stroke}#ptcs .bdr{stroke:#9AA3AE;stroke-width:1;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}'
      + '#ptcs .bdgl{position:absolute;left:-34px;width:30px;text-align:right;transform:translateY(-50%);font-size:10px;color:var(--muted);white-space:nowrap}'
      + '#ptcs .bdrl{position:absolute;right:0;transform:translateY(-110%);font-size:10px;color:var(--muted);white-space:nowrap}#ptcs .bdrl.l{right:auto;left:0}'
      + '#ptcs .bdo{position:absolute;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.08);z-index:2}#ptcs .bdo.nho{width:6px;height:6px;margin:-3px 0 0 -3px;border-width:1px;z-index:1}'
      + '#ptcs .bdo.c1{background:#2a78d6}#ptcs .bdo.c2{background:#eb6834}#ptcs .bdo.c3{background:#1A9E77}#ptcs .bdo.c4{background:#7B61C9}#ptcs .bdo.tp{width:8px;height:8px;margin:-4px 0 0 -4px;border:1.5px solid #fff;opacity:.85;cursor:default}#ptcs .bdo.tp:hover{opacity:1;transform:scale(1.4)}'
      + '#ptcs .bdvl{position:absolute;right:-6px;transform:translate(100%,-50%);font-size:10.5px;white-space:nowrap}#ptcs .bdvl.c1{color:#2a78d6}#ptcs .bdvl.c2{color:#c4501f}#ptcs .bdvl.c3{color:#13795B}#ptcs .bdvl.c4{color:#6A4FBF}'
      + '#ptcs .bdol{position:absolute;transform:translate(-100%,-150%);font-size:11px;white-space:nowrap;background:rgba(255,255,255,.85);padding:0 3px;border-radius:3px}'
      + '#ptcs .bdh{position:absolute;inset:0;display:flex}#ptcs .bdh span{flex:1;cursor:default}#ptcs .bdh span:hover{background:rgba(42,120,214,.07)}'
      + '#ptcs .bdx2{display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);margin-top:3px}#ptcs .bdx2.t{margin-left:34px}#ptcs .bdx2.deu span{flex:1;text-align:center}#ptcs .bdx2.deu span:first-child{text-align:left}#ptcs .bdx2.deu span:last-child{text-align:right}'
      + '#ptcs .bdlg{display:flex;flex-wrap:wrap;gap:3px 14px;font-size:11.5px;margin:4px 0 2px}#ptcs .bdlg i{display:inline-block;width:14px;height:3px;border-radius:2px;margin-right:5px;vertical-align:3px}#ptcs .bdlg i.q,#ptcs .bdlg i.tron{width:9px;height:9px;vertical-align:0}#ptcs .bdlg i.tron{border-radius:50%}'
      + '#ptcs .bdlg i.net{background:repeating-linear-gradient(90deg,currentColor 0 5px,transparent 5px 8px)!important}#ptcs .bdlg i.c1.net{color:#2a78d6}#ptcs .bdlg i.c2.net{color:#eb6834}#ptcs .bdlg i.c3.net{color:#1A9E77}#ptcs .bdlg i.c4.net{color:#7B61C9}'
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
      + '@media (max-width:560px){#ptcs .bdx2.deu span.an{visibility:hidden}#ptcs .hs{padding:12px 10px}#ptcs .hsM{font-size:14.5px}#ptcs .hsTi b{font-size:18px}#ptcs .hsMt table{border-spacing:3px}#ptcs .hsMt td{min-width:0;padding:5px 2px}#ptcs .hsMt td b{font-size:13.5px}#ptcs .hsMt td span{font-size:11px}#ptcs .hsMt tr th:first-child{max-width:96px;font-size:11px}#ptcs .hsMt th small{font-size:9.5px}#ptcs .caur{grid-template-columns:minmax(0,1.3fr) minmax(0,.8fr) 52px;font-size:12px}}';
    document.head.appendChild(st);
  }

  window.__knHoSo = {
    tai: tai, lay: function(t){ return HS[t] || null; }, css: css,
    phanA: function(p, cx){ css(); return phanA(p, cx); }, phanB: phanB, phanC: phanC, phanD: phanD
  };
})();
