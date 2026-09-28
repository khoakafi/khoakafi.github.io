/* ===== tongquan.js — Tab "Toàn cảnh": dòng tiền dẫn đường + lãi suất =====
   27/09 (2): anh Khoa — đơn giản, dễ hiểu, bắt mắt; bỏ chart rổ vs VN-Index. Dòng tiền ghi bằng % mức bình thường (120% / 80%).
   27/09/2026 anh Khoa: tab riêng, để khách nhìn là thấy "đang chờ gì". Không đưa B★ vào (B★ cũng theo dòng tiền chung).
   Dữ liệu: tongquan_data.js (window.TQ) — kafi-core workflow "Toan canh thi truong" dựng lại mỗi ngày 17:05 (research/phat-tongquan.mjs).
   Chỉ báo dòng tiền = giá trị khớp THẬT bình quân 20 phiên ÷ 250 phiên, toàn thị trường (~700 mã VNDirect).
   Trạng thái: A = tiền vào + giá lên (≥1,2 và rổ top 150 > MA50), B = tiền vào giá giảm, C = ở giữa, D = tiền rút (<0,8). */
(function(){
  const INK = '#14201C', EWC = '#1F6FB2', LEND = '#0F7A3D', DEP = '#1F6FB2', MUT = '#6B7280', GRID = '#EEF0F2',
        XANH = 'rgba(24,163,75,.13)', DO = 'rgba(229,72,77,.10)';
  const TEN = {A:'Tiền vào + giá lên', B:'Tiền vào nhưng giá giảm', C:'Ở giữa', D:'Tiền rút'};
  const vn = (x, d = 1) => x.toLocaleString('vi-VN', {minimumFractionDigits:d, maximumFractionDigits:d});
  const ngay = d => d.slice(8,10) + '/' + d.slice(5,7) + '/' + d.slice(0,4);
  const thang = m => m.slice(5) + '/' + m.slice(0,4);
  let charts = [], ve = false;

  function css(){
    if (document.getElementById('tqcss')) return;
    const s = document.createElement('style'); s.id = 'tqcss';
    s.textContent = `
#view-tq .tqh{display:flex;align-items:baseline;gap:10px;margin:2px 0 12px}
#view-tq .tqh b{font-size:17px}
#view-tq .tqt{font-size:16px;font-weight:800;color:#111827;margin:0 0 3px}
#view-tq .tqs{font-size:13px;color:${MUT};margin:0 0 12px;line-height:1.5}
#view-tq .tqc{position:relative;height:300px}
#view-tq .tqc.sm{height:190px}
#view-tq .tqst{background:#fff;border:1px solid var(--border);border-radius:14px;padding:20px 24px 16px;margin-bottom:16px;box-shadow:0 1px 3px rgba(16,24,40,.05)}
#view-tq .tqst .tp{display:flex;gap:18px;align-items:center}
#view-tq .tqst .ico{flex:none;width:64px;height:64px;border-radius:50%;display:grid;place-items:center}
#view-tq .tqst .ey{font-size:11.5px;font-weight:800;letter-spacing:.6px;color:${MUT};text-transform:uppercase}
#view-tq .tqst .ten{font-size:28px;font-weight:900;letter-spacing:.5px;line-height:1.15;margin:2px 0 2px}
#view-tq .tqst .mt{font-size:15px;color:#374151}
#view-tq .tqst .hd{font-size:13px;color:${MUT};margin-top:2px}
#view-tq .tqst .nh{margin-top:14px;border-radius:10px;padding:10px 14px;font-size:13.5px;color:#374151;display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
#view-tq .tqst .nh b{font-size:12px;font-weight:800;border-radius:9px;padding:2px 9px;color:#fff;white-space:nowrap}
#view-tq .tqst .tl{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
#view-tq .tqst .tl>div{border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12.5px;color:${MUT};min-width:0}
#view-tq .tqst .tl b{display:block;font-size:13.5px;color:#111827;margin-bottom:2px}
#view-tq .tqst .tl i{font-style:normal;font-weight:800}
#view-tq .tqst .ls{margin-top:16px}
#view-tq .tqst .ls .bar{display:flex;height:12px;border-radius:6px;overflow:hidden}
#view-tq .tqst .ls .bar span{display:block;height:100%}
#view-tq .tqst .ls .yr{position:relative;height:16px;font-size:11px;color:${MUT}}
#view-tq .tqst .ls .yr span{position:absolute;transform:translateX(-50%);top:3px}
#view-tq .tqst .ls .cap{font-size:12px;color:${MUT};display:flex;gap:14px;flex-wrap:wrap;margin-bottom:6px}
#view-tq .tqst .ls .cap i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
@media(max-width:700px){#view-tq .tqst .tl{grid-template-columns:1fr}#view-tq .tqst .ten{font-size:23px}#view-tq .tqst .ico{width:52px;height:52px}#view-tq .tqst{padding:16px}}
#view-tq .tqhero{background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px 24px 20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(16,24,40,.05)}
#view-tq .tqhero .ey{font-size:11.5px;font-weight:800;letter-spacing:.6px;color:${MUT};text-transform:uppercase}
#view-tq .tqhero h3{font-size:24px;line-height:1.25;margin:6px 0 4px;color:#111827}
#view-tq .tqhero .big{font-size:15px;color:#374151;margin:0 0 18px}
#view-tq .tqhero .big b{font-size:15px}
#view-tq .tqgau{position:relative;margin:46px 0 8px}
#view-tq .tqgau .zn{display:flex;height:14px;border-radius:7px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.06)}
#view-tq .tqgau .zn i{display:block;height:100%}
#view-tq .tqgau .lb{display:flex;font-size:12px;font-weight:700;margin-top:7px}
#view-tq .tqgau .lb span{text-align:center}
#view-tq .tqgau .mk{position:absolute;top:-36px;transform:translateX(-50%);text-align:center;font-weight:800;font-size:12.5px;color:#fff;background:#111827;border-radius:11px;padding:3px 10px;white-space:nowrap;box-shadow:0 2px 6px rgba(17,24,39,.25)}
#view-tq .tqgau .mk:after{content:'';position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #111827}
#view-tq .tqdks{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
#view-tq .tqdk{border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;gap:11px;align-items:flex-start}
#view-tq .tqdk .ic{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:800;color:#fff}
#view-tq .tqdk .ic.x{background:var(--red)} #view-tq .tqdk .ic.v{background:var(--green)}
#view-tq .tqdk b{display:block;font-size:14px;color:#111827;margin-bottom:2px}
#view-tq .tqdk span{font-size:12.5px;color:#4B5563;line-height:1.45}
#view-tq .tqleg{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#374151;margin:0 0 6px}
#view-tq .tqleg i{display:inline-block;width:14px;height:3px;vertical-align:3px;margin-right:6px;border-radius:2px}
#view-tq .tqleg i.bx{width:12px;height:12px;vertical-align:-2px}
#view-tq .tqleg2{gap:8px 18px;margin:0 0 10px}
#view-tq .tqleg2 span{display:inline-flex;align-items:center;gap:7px}
#view-tq .lgc{width:12px;height:12px;border-radius:50%;background:#18A34B;box-shadow:0 0 0 3px #fff,0 0 0 5px rgba(24,163,75,.3);display:inline-block}
#view-tq .lgp{font-size:11px;font-weight:800;color:#128A3E;background:#fff;border:1px solid #9FD9B4;border-radius:10px;padding:1px 7px}
#view-tq .lgp.lgx{color:#D93D42;border-color:#F4B4B6;background:#FFF5F5}
#view-tq .tqhd{display:flex;align-items:flex-start;gap:12px;justify-content:space-between}
#view-tq .tqzoom,#tqModal .tqx{flex:none;border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 11px;font:600 12.5px Inter,system-ui,sans-serif;color:#374151;cursor:pointer}
#view-tq .tqzoom:hover,#tqModal .tqx:hover{border-color:var(--green);color:var(--green-dark)}
#view-tq .tqt2{font-size:14px;margin-top:16px}
#view-tq .tqvh{font-size:12px;font-weight:500;color:#6B7280;margin-left:8px;white-space:nowrap}
#view-tq .tqvh i{display:inline-block;width:16px;border-top:2px dashed;vertical-align:4px;margin:0 5px 0 8px}
#view-tq .tqleg2 .sep,#tqModal .tqleg2 .sep{width:1px;height:14px;background:var(--border)}
#view-tq .tqc,#tqModal .tqc{touch-action:pan-y}
.tqvx{position:absolute;left:0;width:1px;background:rgba(17,24,39,.32);pointer-events:none;opacity:0;will-change:transform}
.tqdot{position:absolute;left:0;top:0;width:12px;height:12px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25);pointer-events:none;opacity:0;will-change:transform}
.tqbox{position:absolute;left:0;top:6px;width:260px;box-sizing:border-box;background:rgba(17,24,39,.94);color:#E5E7EB;border-radius:10px;padding:9px 11px;font:12px Inter,system-ui,sans-serif;pointer-events:none;opacity:0;will-change:transform;box-shadow:0 6px 18px rgba(17,24,39,.22);z-index:2}
.tqbox .d{font-weight:700;color:#fff;margin-bottom:5px}
.tqbox .r{display:flex;justify-content:space-between;gap:8px;line-height:1.6;white-space:nowrap}
.tqbox .r i,.tqbox .s i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}
.tqbox .r b{color:#fff;font-weight:700}
.tqbox .s{margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,.12);font-weight:700}
#tqModal{position:fixed;inset:0;z-index:70;background:rgba(17,24,39,.55);display:none;align-items:center;justify-content:center;padding:18px}
#tqModal .tqmp{background:#fff;border-radius:14px;width:min(1500px,100%);height:min(900px,100%);display:flex;flex-direction:column;padding:16px 18px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
#tqModal .tqmh{display:flex;align-items:center;gap:14px;margin-bottom:10px}
#tqModal .tqmh b{font-size:16px}
#tqModal .tqms{font-size:12.5px;color:#6B7280;margin-top:2px}
#tqModal .tqx{margin-left:auto}
#tqModal .tqkh{display:inline-flex;background:var(--panel2);border-radius:9px;padding:3px;gap:2px}
#tqModal .tqkh button{border:0;background:none;border-radius:7px;padding:5px 11px;font:600 12.5px Inter,system-ui,sans-serif;color:#4B5563;cursor:pointer}
#tqModal .tqkh button.on{background:#fff;color:var(--green-dark);box-shadow:0 1px 3px rgba(0,0,0,.1)}
#tqModal .tqmb{flex:1;min-height:0;display:flex;flex-direction:column}
#tqModal .tqmb .tqc{position:relative}
#tqModal .tqleg2{display:flex;flex-wrap:wrap;gap:8px 16px;font-size:12px;color:#374151;margin:0 0 8px}
#tqModal .tqleg2 span{display:inline-flex;align-items:center;gap:7px}
#tqModal .tqleg2 i{display:inline-block;width:14px;height:3px;border-radius:2px}
#tqModal .lgc{width:12px;height:12px;border-radius:50%;background:#18A34B;box-shadow:0 0 0 3px #fff,0 0 0 5px rgba(24,163,75,.3);display:inline-block}
#tqModal .lgp{font-size:11px;font-weight:800;color:#128A3E;background:#fff;border:1px solid #9FD9B4;border-radius:10px;padding:1px 7px}
#tqModal .lgp.lgx{color:#D93D42;border-color:#F4B4B6;background:#FFF5F5}
@media(max-width:700px){#tqModal{padding:0}#tqModal .tqmp{border-radius:0;height:100%;padding:12px}#tqModal .tqmh{flex-wrap:wrap}}
#view-tq .ft{font-size:11.5px;color:${MUT};line-height:1.6;margin:4px 2px 0}
@media(max-width:900px){#view-tq .tqdks{grid-template-columns:1fr}#view-tq .tqhero h3{font-size:20px}#view-tq .tqc{height:250px}#view-tq .tqhero{padding:18px 16px}}`;
    document.head.appendChild(s);
  }

  /* ---- số liệu dẫn xuất ---- */
  function tinh(T){
    const N = T.N, kL = N.length - 1, nL = N[kL];
    const ma50 = N.map((r, k) => { if (k < 49) return null; let s = 0; for (let j = k-49; j <= k; j++) s += N[j][1]; return s / 50; });
    const gt = N.map(r => r[4]);
    const gt20 = gt.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const s230 = gt.slice(-230).reduce((a, b) => a + b, 0);
    const can = 1.2 * s230 / (250 - 24);   // TB20 = x và TB250 = (s230 + 20x)/250  ->  x = 1,2·s230/226
    let k0 = kL; while (k0 > 0 && N[k0-1][3] === nL[3]) k0--;
    const eps = []; { let ngoai = 99, cur = null;
      N.forEach((r, k) => { if (r[3] === 'A') { if (ngoai >= 20) { cur = {a:k}; eps.push(cur); } ngoai = 0; cur.b = k; } else ngoai++; }); }
    eps.forEach(e => { const i0 = N[e.a][1]; e.f60 = N[e.a+60] ? (N[e.a+60][1]/i0 - 1) * 100 : null;
      let mx = e.a; for (let k = e.a; k <= Math.min(kL, e.b + 120); k++) if (N[k][1] > N[mx][1]) mx = k;
      e.pk = (N[mx][1]/i0 - 1) * 100; e.pkk = mx; e.len = e.b - e.a + 1; });
    return {N, kL, nL, ma50, gt20, can, k0, eps};
  }

  /* ---- trạng thái thị trường: 3 trạng thái + 1 nhãn phụ (máy phát hành tính, không hiện điều kiện) ---- */
  const TS = [
    { ten: 'QUAN SÁT', mau: '#6B7280', nen: '#F3F4F6', mt: 'Chưa rõ xu hướng.', hd: 'Đứng ngoài quan sát, chờ tín hiệu.',
      ico: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>' },
    { ten: 'TÍCH CỰC', mau: '#18A34B', nen: '#E8F6ED', mt: 'Dòng tiền xác nhận xu hướng tăng.', hd: 'Nắm giữ, đi theo xu hướng.',
      ico: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>' },
    { ten: 'THẬN TRỌNG', mau: '#E5484D', nen: '#FDECEC', mt: 'Áp lực vĩ mô lớn, rủi ro điều chỉnh cao.', hd: 'Hạn chế giải ngân, ưu tiên bảo toàn vốn.',
      ico: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3z"/><path d="M12 10v4"/><path d="M12 17.5v.01"/></svg>' } ];
  const NH = [null,
    { ten: 'Lực bán cạn dần', mau: '#1F6FB2', nen: '#EAF2FA', mt: 'Bán tháo đã lan rộng, vùng đáy đang hình thành — có thể bắt đầu giải ngân từng phần.' },
    { ten: 'Rủi ro đang tăng', mau: '#D97706', nen: '#FEF3E2', mt: 'Xu hướng còn tốt nhưng áp lực bên ngoài lớn dần — không mua đuổi, giữ kỷ luật chốt lời.' } ];
  function trangThai(T, dkTien, pct){
    const tt = T.tt; if (!tt || !tt.ht || !tt.S || !tt.S.length) return '';
    const h = tt.ht, S = TS[h.st] || TS[0], nh = NH[h.nhan];
    const ruiRo = h.rr >= 2 && h.c && h.c.d_vimo;
    // dải lịch sử: gộp các đoạn liền nhau cùng trạng thái
    const L = tt.S, n = L.length, seg = [];
    L.forEach((r, i) => { const last = seg[seg.length - 1]; if (last && last.st === r[1]) last.n++; else seg.push({ st: r[1], n: 1, i }); });
    const yr = []; L.forEach((r, i) => { if (i && r[0].slice(0,4) !== L[i-1][0].slice(0,4)) yr.push([i, r[0].slice(0,4)]); });
    return `<div class="tqst">
  <div class="tp"><div class="ico" style="background:${S.mau}">${S.ico}</div>
    <div><div class="ey">Trạng thái thị trường · từ ${ngay(h.tu)}</div><div class="ten" style="color:${S.mau}">${S.ten}</div>
    <div class="mt">${S.mt}</div><div class="hd">${S.hd}</div></div></div>
  ${nh ? `<div class="nh" style="background:${nh.nen}"><b style="background:${nh.mau}">${nh.ten}</b><span>${nh.mt}</span></div>` : ''}
  <div class="tl">
    <div><b>Dòng tiền</b>${dkTien ? '<i style="color:#128A3E">Đã vào mạnh</i> — thị trường có lực.' : `<i style="color:#374151">Chưa</i> — tiền mới bằng ${pct}% mức bình thường.`}</div>
    <div><b>Lực bán</b>${h.nhan === 1 ? '<i style="color:#1F6FB2">Đã cạn dần</i> — vùng đáy đang hình thành.' : '<i style="color:#374151">Chưa cạn</i> — chưa có dấu hiệu tạo đáy.'}</div>
    <div><b>Áp lực vĩ mô</b>${ruiRo ? '<i style="color:#E5484D">Đang lớn</i> — lãi suất, USD thế giới tăng nhanh.' : '<i style="color:#374151">Bình thường</i>'}</div>
  </div>
  <div class="ls"><div class="cap"><span>Trạng thái các năm qua:</span>${[1,0,2].map(k => `<span><i style="background:${TS[k].mau}"></i>${TS[k].ten[0] + TS[k].ten.slice(1).toLowerCase()}</span>`).join('')}</div>
    <div class="bar">${seg.map(g => `<span style="width:${g.n / n * 100}%;background:${TS[g.st].mau}" title="${TS[g.st].ten} ${ngay(L[g.i][0])} – ${ngay(L[g.i + g.n - 1][0])}"></span>`).join('')}</div>
    <div class="yr">${yr.map(([i, y]) => `<span style="left:${i / n * 100}%">${y}</span>`).join('')}</div></div>
</div>`;
  }

  function html(T, X){
    const {N, kL, nL, ma50, gt20, can, k0, eps} = X;
    const pct = Math.round(nL[2] * 100), dk1 = nL[2] >= 1.2, dk2 = nL[1] > ma50[kL];
    const ls = T.ls, lsN = ls.m.length - 1;
    // thanh 3 vùng: 0% .. 200%
    const vt = v => Math.max(1, Math.min(99, v / 200 * 100));
    const tieuDe = dk1 && dk2 ? 'Tiền đang vào mạnh — sóng đã bắt đầu' : nL[3] === 'D' ? 'Tiền đang rút khỏi thị trường — chờ tiền quay lại' : 'Tiền chưa vào đủ mạnh — tiếp tục chờ';
    return `
<div class="tqh"><b>Toàn cảnh thị trường</b><span class="mini">cập nhật ${ngay(nL[0])}</span></div>
${trangThai(T, dk1 && dk2, pct)}

<div class="tqhero">
  <div class="ey">Hôm nay</div>
  <h3>${tieuDe}</h3>
  <div class="tqbig">Tiền giao dịch 1 tháng qua ${pct < 100 ? 'chỉ bằng' : 'bằng'} <b>${pct}%</b> mức bình thường của cả năm.${nL[3] === 'D' ? ` Tiền rút kéo dài từ ${ngay(N[k0][0])}.` : ''}</div>
  <div class="tqgau" role="img" aria-label="Thanh khoản hiện ${pct}% mức bình thường">
    <div class="mk" style="left:${vt(pct)}%">Hôm nay ${pct}%</div>
    <div class="zn"><i style="width:40%;background:linear-gradient(90deg,#F4A9AC,#F9D5D6)"></i><i style="width:20%;background:#E5E7EB"></i><i style="width:40%;background:linear-gradient(90deg,#CDEBD7,#7FCB9B)"></i></div>
    <div class="lb"><span style="width:40%;color:var(--red)">Tiền rút · dưới 80%</span><span style="width:20%;color:${MUT}">Bình thường</span><span style="width:40%;color:var(--green-dark)">Tiền vào mạnh · trên 120%</span></div>
  </div>
  <div class="tqdks">
    <div class="tqdk"><span class="ic ${dk1?'v':'x'}">${dk1?'✓':'✕'}</span><div><b>Tiền vào mạnh (trên 120%)</b>
      <span>${dk1 ? 'Đã đạt.' : `Cần khoảng <b style="display:inline;font-size:12.5px">${vn(can/1000,0)} nghìn tỷ</b>/phiên, hiện ${vn(gt20/1000,1)} nghìn tỷ.`}</span></div></div>
    <div class="tqdk"><span class="ic ${dk2?'v':'x'}">${dk2?'✓':'✕'}</span><div><b>Giá cổ phiếu quay đầu đi lên</b>
      <span>${dk2 ? 'Đã đạt — giá đang trên xu hướng 50 phiên.' : 'Chưa — giá vẫn dưới xu hướng 50 phiên.'}</span></div></div>
  </div>
</div>

<div class="card">
  <div class="tqhd"><div><div class="tqt">Mỗi lần tiền vào mạnh, thị trường đi lên sau đó</div>
    <div class="tqs">Giá 150 cổ phiếu giao dịch nhiều nhất từ 2018. Màu đường cho biết tiền đang vào hay rút; chấm xanh là điểm mua, ô số là kết quả sau đó.</div></div>
    <button class="tqzoom" data-z="gia" aria-label="Phóng to chart giá và dòng tiền">⤢ Phóng to</button></div>
  ${chuGiai()}
  <div class="tqc" id="tqW1"><canvas id="tqC1" aria-label="Giá 150 cổ phiếu giao dịch nhiều nhất, tô màu theo trạng thái dòng tiền"></canvas></div>
  <div class="tqt tqt2">Tiền giao dịch so với mức bình thường của năm <span class="tqvh"><i style="border-color:#18A34B"></i>120%: tiền vào mạnh <i style="border-color:#E5484D"></i>80%: tiền rút</span></div>
  <div class="tqc sm" id="tqW2"><canvas id="tqC2" aria-label="Thanh khoản so với mức bình thường của năm, %"></canvas></div>
</div>

<div class="card">
  <div class="tqhd"><div><div class="tqt">Lãi suất tiết kiệm và cho vay</div>
    <div class="tqs">Lãi suất bình quân của các tổ chức tín dụng theo tháng, từ ${thang(ls.m[0])}. Số NHNN, cập nhật mỗi tháng.</div></div>
    <button class="tqzoom" data-z="ls" aria-label="Phóng to chart lãi suất">⤢ Phóng to</button></div>
  <div class="tqleg"><span><i style="background:${DEP}"></i>Lãi tiết kiệm 6–12 tháng</span><span><i style="background:${LEND}"></i>Lãi cho vay</span></div>
  <div class="tqc" id="tqW3"><canvas id="tqC3" aria-label="Lãi suất tiết kiệm và cho vay theo tháng"></canvas></div>
</div>

<div class="ft">Tiền giao dịch = giá trị khớp lệnh bình quân 1 tháng so với bình quân 1 năm, toàn thị trường. Giá đi lên = nhóm 150 cổ phiếu giao dịch nhiều nhất nằm trên đường trung bình 50 phiên.
Nguồn: VNDirect, NHNN. Quy tắc cố định, không dùng mô hình học máy. Kết quả quá khứ không bảo đảm tương lai; chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</div>`;
  }

  /* ---- màu theo trạng thái (dùng CHUNG cho cả đường giá và đường dòng tiền nên hai chart luôn khớp màu) ---- */
  const MAU = {A:'#18A34B', B:'#E08A00', C:'#A3AAB5', D:'#E5484D'};
  const TENM = {A:'Tiền vào mạnh + giá lên', B:'Tiền vào mạnh nhưng giá giảm — rung lắc hoặc phân phối, chờ xác nhận', C:'Bình thường', D:'Tiền rút'};
  function chuGiai(){
    return `<div class="tqleg tqleg2">
      <span><i style="background:${MAU.A}"></i>Tiền vào mạnh + giá lên</span>
      <span><i style="background:${MAU.B}"></i>Tiền vào mạnh nhưng giá giảm (chờ xác nhận)</span>
      <span><i style="background:${MAU.C}"></i>Bình thường</span>
      <span><i style="background:${MAU.D}"></i>Tiền rút</span>
      <span class="sep"></span>
      <span><b class="lgc"></b>điểm mua</span>
      <span><b class="lgp">+31%</b>tăng tới đỉnh sau đó</span>
      <span><b class="lgp lgx">✕ hỏng</b>tín hiệu tắt nhanh</span></div>`;
  }
  const FONT = 'Inter, system-ui, sans-serif';
  const pill = (g, text, x, y, bg, fg, bd) => { g.save(); g.font = '700 11.5px ' + FONT; const w = g.measureText(text).width + 14, h = 21;
    x = Math.max(w/2 + 2, Math.min(g.canvas.width / (window.devicePixelRatio || 1) - w/2 - 2, x));
    g.beginPath(); (g.roundRect ? g.roundRect(x - w/2, y - h/2, w, h, 10.5) : g.rect(x - w/2, y - h/2, w, h)); g.fillStyle = bg; g.fill();
    if (bd) { g.strokeStyle = bd; g.lineWidth = 1; g.stroke(); }
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y + .5); g.restore(); };
  const cham = (g, x, y, c) => { g.save(); g.fillStyle = c + '33'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(x, y, 3.5, 0, 7); g.fill(); g.restore(); };
  const trucX = cb => ({grid:{display:false}, border:{display:false}, ticks:{color:'#9CA3AF', maxRotation:0, autoSkip:false, callback:cb, font:{size:11, family:FONT}}});
  const trucY = f => ({position:'right', grid:{color:'#F1F3F5', drawTicks:false}, border:{display:false}, afterFit:s => { s.width = 50; },
    ticks:{color:'#9CA3AF', padding:8, callback:f, font:{size:11, family:FONT}}});
  // nhãn trục x: theo năm; khung ngắn (≤ 300 phiên) thì theo tháng
  function nhanX(lab){
    const ngan = lab.length <= 300;
    return function(v){ const d = lab[v], p = lab[v-1]; if (!d || !p) return '';
      if (ngan) { if (d.slice(0,7) === p.slice(0,7)) return ''; return (this.chart.width < 520 && +d.slice(5,7) % 2) ? '' : d.slice(5,7) + '/' + d.slice(2,4); }
      if (d.slice(0,4) === p.slice(0,4)) return ''; return this.chart.width < 520 ? (+d.slice(0,4) % 2 ? '' : d.slice(0,4)) : d.slice(0,4); };
  }
  const coBan = {responsive:true, maintainAspectRatio:false, animation:false, events:[], plugins:{legend:{display:false}, tooltip:{enabled:false}}};

  // chart giá: đường tô màu theo trạng thái + chấm điểm mua + ô kết quả
  function veGia(cv, X, i0){
    const {N, kL, nL, eps} = X, R = N.slice(i0), lab = R.map(r => r[0]);
    const nhan = {id:'tqNhan', afterDatasetsDraw(ch){ const {ctx:g, chartArea:c, scales:{x, y}} = ch, nho = ch.width < 560, dat = [];
      eps.filter(e => e.a >= i0).forEach(e => { const hong = e.f60 != null && e.f60 <= 0, px = x.getPixelForValue(e.a - i0), py = y.getPixelForValue(N[e.a][1]);
        g.save(); g.font = '800 11.5px ' + FONT; const t = hong ? '✕ hỏng' : '+' + vn(e.pk, 0) + '%', w = g.measureText(t).width + 16; g.restore();
        if (nho && !hong && e.pk < 30) { cham(g, px, py, MAU.A); return; }
        let ty = Math.max(c.top + 12, py - 34);
        while (dat.some(d => Math.abs(d.x - px) < (d.w + w) / 2 + 4 && Math.abs(d.y - ty) < 23)) ty -= 24;
        if (ty < c.top + 10) { ty = py + 34; while (dat.some(d => Math.abs(d.x - px) < (d.w + w) / 2 + 4 && Math.abs(d.y - ty) < 23)) ty += 24; }
        dat.push({x:px, y:ty, w});
        g.save(); g.strokeStyle = hong ? 'rgba(229,72,77,.6)' : 'rgba(24,163,75,.7)'; g.lineWidth = 1.2; g.setLineDash([2,2]);
        g.beginPath(); g.moveTo(px, py); g.lineTo(px, ty + (ty < py ? 10 : -10)); g.stroke(); g.restore();
        cham(g, px, py, hong ? MAU.D : MAU.A);
        pill(g, t, px, ty, hong ? '#FFF5F5' : '#fff', hong ? '#D93D42' : '#128A3E', hong ? '#F4B4B6' : '#9FD9B4'); });
      const px = x.getPixelForValue(kL - i0), py = y.getPixelForValue(nL[1]); cham(g, px, py, '#111827');
      const tn = nho ? 'Hôm nay' : (nL[3] === 'A' ? 'Hôm nay · tiền đang vào' : 'Hôm nay · đang chờ'); pill(g, tn, px - (nho ? 24 : 60), py + 24, '#111827', '#fff'); }};
    return new Chart(cv, {type:'line', plugins:[nhan],
      data:{labels:lab, datasets:[{data:R.map(r => r[1]), borderWidth:2.2, pointRadius:0, tension:.2, borderCapStyle:'round',
        borderColor:MAU.C, segment:{borderColor:c => MAU[R[c.p1DataIndex][3]]}}]},
      options:{...coBan, layout:{padding:{top:30, right:4}}, scales:{x:trucX(nhanX(lab)), y:trucY(v => vn(v, 0))}}});
  }
  // chart dòng tiền (%): cùng màu trạng thái; vạch 120% / 80%
  function veTien(cv, X, i0){
    const {N, kL, nL, eps} = X, R = N.slice(i0), lab = R.map(r => r[0]);
    const vach = {id:'tqVach', beforeDatasetsDraw(ch){ const {ctx:g, chartArea:c, scales:{y}} = ch; g.save(); g.setLineDash([5,4]); g.lineWidth = 1.2; g.font = '700 11px ' + FONT;
        [[120, MAU.A, 'Tiền vào mạnh 120%', -6], [80, MAU.D, 'Tiền rút 80%', 14]].forEach(([v, cl, t, dy]) => { const yy = y.getPixelForValue(v);
          g.strokeStyle = cl; g.globalAlpha = .7; g.beginPath(); g.moveTo(c.left, yy); g.lineTo(c.right, yy); g.stroke(); g.globalAlpha = 1;
          }); g.restore(); },
      afterDatasetsDraw(ch){ const {ctx:g, scales:{x, y}} = ch, v = Math.round(nL[2] * 100), px = x.getPixelForValue(kL - i0), py = y.getPixelForValue(v);
        eps.filter(e => e.a >= i0).forEach(e => cham(g, x.getPixelForValue(e.a - i0), y.getPixelForValue(Math.round(N[e.a][2] * 100)), e.f60 != null && e.f60 <= 0 ? MAU.D : MAU.A));
        cham(g, px, py, MAU[nL[3]]); pill(g, v + '%', px - 28, py - 18, MAU[nL[3]], '#fff'); }};
    const vs = R.map(r => r[2] * 100), hi = Math.max(140, ...vs), lo = Math.min(60, ...vs), buoc = hi - lo > 150 ? 50 : 20;
    const mx = Math.ceil(hi / buoc) * buoc, mn = Math.max(0, Math.floor(lo / buoc) * buoc);
    return new Chart(cv, {type:'line', plugins:[vach],
      data:{labels:lab, datasets:[{data:R.map(r => Math.round(r[2] * 100)), borderWidth:2, pointRadius:0, tension:.25, borderCapStyle:'round',
        borderColor:MAU.C, segment:{borderColor:c => MAU[R[c.p1DataIndex][3]]}}]},
      options:{...coBan, layout:{padding:{top:8, right:4}}, scales:{x:trucX(nhanX(lab)), y:(() => { const t = trucY(v => v + '%'); t.ticks.stepSize = buoc; return {...t, min:mn, max:mx}; })()}}});
  }
  // chart lãi suất theo tháng
  function veLs(cv, T){
    const ls = T.ls, M = ls.m;
    const doc = (top, bot) => (ctx) => { const {chart} = ctx, {ctx:g, chartArea:a} = chart; if (!a) return null;
      const gr = g.createLinearGradient(0, a.top, 0, a.bottom); gr.addColorStop(0, top); gr.addColorStop(1, bot); return gr; };
    const cuoi = {id:'tqCuoi', afterDatasetsDraw(ch){ const g = ch.ctx;
      ch.data.datasets.forEach((d, i) => { const m = ch.getDatasetMeta(i), p = m.data[m.data.length-1]; if (!p) return;
        cham(g, p.x, p.y, d.borderColor); pill(g, vn(d.data[d.data.length-1], 1) + '%', p.x - 30, p.y - 18, d.borderColor, '#fff');
        const p0 = m.data[0]; g.save(); g.font = '600 11px ' + FONT; g.fillStyle = d.borderColor; g.textAlign = 'left';
        g.fillText(vn(d.data[0], 1) + '%', p0.x + 2, p0.y - 9); g.restore(); }); }};
    return new Chart(cv, {type:'line', plugins:[cuoi],
      data:{labels:M, datasets:[
        {label:'Lãi cho vay', data:ls.lend, borderColor:LEND, borderWidth:2.6, pointRadius:0, tension:.35, fill:'start', backgroundColor:doc('rgba(15,122,61,.14)', 'rgba(15,122,61,0)')},
        {label:'Lãi tiết kiệm 6–12 tháng', data:ls.dep, borderColor:DEP, borderWidth:2.6, pointRadius:0, tension:.35, fill:'start', backgroundColor:doc('rgba(31,111,178,.16)', 'rgba(31,111,178,0)')}]},
      options:{...coBan, layout:{padding:{top:22, right:6}},
        scales:{x:trucX(function(v){ const m = M[v]; if (!m) return ''; const nho = this.chart.width < 520;
            return (nho ? (+m.slice(5) % 3 === 0 || v === 0) : true) ? (+m.slice(5)) + '/' + m.slice(2,4) : ''; }),
          y:{...trucY(v => vn(v, 0) + '%'), min:4, max:12}}}});
  }

  /* ---- con trỏ: tự vẽ bằng lớp phủ (không vẽ lại chart) -> mượt; ô thông tin rộng cố định ---- */
  function conTro(ds, noiDung){   // ds = [{chart, wrap, y:(i)=>giá trị, mau:(i)=>màu}]
    const lop = ds.map(d => { const v = document.createElement('div'); v.className = 'tqvx'; const c = document.createElement('div'); c.className = 'tqdot';
      d.wrap.appendChild(v); d.wrap.appendChild(c); return {v, c}; });
    const box = document.createElement('div'); box.className = 'tqbox'; ds[0].wrap.appendChild(box);
    let cho = null, xCuoi = null, wCuoi = null;
    const an = () => { lop.forEach(l => { l.v.style.opacity = 0; l.c.style.opacity = 0; }); box.style.opacity = 0; };
    const ve = () => { cho = null; const d0 = ds[0], ch = d0.chart, sx = ch.scales.x, n = ch.data.labels.length;
      const rect = wCuoi.getBoundingClientRect(), xx = xCuoi - rect.left;
      let i = Math.round(sx.getValueForPixel(xx)); if (!(i >= 0)) i = 0; if (i > n - 1) i = n - 1;
      ds.forEach((d, k) => { const c = d.chart, a = c.chartArea, px = c.scales.x.getPixelForValue(i), py = c.scales.y.getPixelForValue(d.y(i));
        const l = lop[k]; l.v.style.height = (a.bottom - a.top) + 'px'; l.v.style.top = a.top + 'px'; l.v.style.transform = `translateX(${px}px)`; l.v.style.opacity = 1;
        l.c.style.transform = `translate(${px - 6}px, ${py - 6}px)`; l.c.style.background = d.mau(i); l.c.style.opacity = 1; });
      const px = ch.scales.x.getPixelForValue(i), W = d0.wrap.clientWidth, bw = box.offsetWidth || 260;
      box.innerHTML = noiDung(i); box.style.transform = `translateX(${px + bw + 22 > W - 50 ? px - bw - 14 : px + 14}px)`; box.style.opacity = 1; };
    ds.forEach(d => {
      d.wrap.addEventListener('pointermove', e => { xCuoi = e.clientX; wCuoi = d.wrap; if (!cho) cho = requestAnimationFrame(ve); });
      d.wrap.addEventListener('pointerleave', () => { if (cho) { cancelAnimationFrame(cho); cho = null; } an(); });
    });
  }
  function hopGia(X, i0){ const N = X.N;
    return i => { const r = N[i0 + i]; return `<div class="d">${ngay(r[0])}</div>
      <div class="r"><span>Giá 150 cổ phiếu</span><b>${vn(r[1], 1)}</b></div>
      <div class="r"><span>Tiền giao dịch / bình thường</span><b>${Math.round(r[2] * 100)}%</b></div>
      <div class="s" style="color:${MAU[r[3]]}"><i style="background:${MAU[r[3]]}"></i>${TENM[r[3]]}</div>`; }; }
  function ganGia(X, i0, c1, w1, c2, w2){ const N = X.N;
    conTro([{chart:c1, wrap:w1, y:i => N[i0 + i][1], mau:i => MAU[N[i0 + i][3]]}, {chart:c2, wrap:w2, y:i => Math.round(N[i0 + i][2] * 100), mau:i => MAU[N[i0 + i][3]]}], hopGia(X, i0)); }
  function ganLs(T, c3, w3){ const ls = T.ls;
    conTro([{chart:c3, wrap:w3, y:i => ls.lend[i], mau:() => LEND}], i => `<div class="d">Tháng ${thang(ls.m[i])}</div>
      <div class="r"><span><i style="background:${LEND}"></i>Lãi cho vay</span><b>${vn(ls.lend[i], 1)}%</b></div>
      <div class="r"><span><i style="background:${DEP}"></i>Lãi tiết kiệm 6–12T</span><b>${vn(ls.dep[i], 1)}%</b></div>`); }

  function veChart(T, X){
    if (typeof Chart === 'undefined') return;
    charts.forEach(c => { try { c.destroy(); } catch(e){} }); charts = [];
    const w1 = document.getElementById('tqW1'), w2 = document.getElementById('tqW2'), w3 = document.getElementById('tqW3');
    const c1 = veGia(document.getElementById('tqC1'), X, 0), c2 = veTien(document.getElementById('tqC2'), X, 0), c3 = veLs(document.getElementById('tqC3'), T);
    ganGia(X, 0, c1, w1, c2, w2); ganLs(T, c3, w3);
    charts = [c1, c2, c3];
    document.querySelectorAll('#view-tq .tqzoom').forEach(b => b.onclick = () => phongTo(b.dataset.z, T, X));
  }

  /* ---- phóng to: khung lớn, chọn khoảng thời gian ---- */
  let mcharts = [];
  function phongTo(loai, T, X){
    let m = document.getElementById('tqModal');
    if (!m) { m = document.createElement('div'); m.id = 'tqModal'; document.body.appendChild(m);
      m.addEventListener('click', e => { if (e.target === m) dong(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') dong(); }); }
    const dong = () => { mcharts.forEach(c => { try { c.destroy(); } catch(e){} }); mcharts = []; m.style.display = 'none'; document.body.style.overflow = ''; };
    const KH = [['6 tháng', 125], ['1 năm', 250], ['3 năm', 750], ['Tất cả', 0]];
    const gia = loai === 'gia';
    m.innerHTML = `<div class="tqmp"><div class="tqmh"><div><b>${gia ? 'Giá 150 cổ phiếu và dòng tiền' : 'Lãi suất tiết kiệm và cho vay'}</b>${gia ? '' : '<div class="tqms">Lãi suất bình quân của các tổ chức tín dụng theo tháng. Số NHNN, cập nhật mỗi tháng.</div>'}</div>
      ${gia ? `<div class="tqkh">${KH.map(([t, n]) => `<button data-n="${n}">${t}</button>`).join('')}</div>` : ''}
      <button class="tqx" aria-label="Đóng">✕</button></div>
      ${gia ? chuGiai() : `<div class="tqleg2"><span><i style="background:${DEP}"></i>Lãi tiết kiệm 6–12 tháng</span><span><i style="background:${LEND}"></i>Lãi cho vay</span></div>`}
      <div class="tqmb">${gia ? '<div class="tqc" id="tqMW1" style="height:58%"><canvas id="tqMC1"></canvas></div><div class="tqc" id="tqMW2" style="height:34%;margin-top:10px"><canvas id="tqMC2"></canvas></div>'
        : '<div class="tqc" id="tqMW1" style="height:100%"><canvas id="tqMC1"></canvas></div>'}</div></div>`;
    const tb = document.querySelector('.topbar'), nb = document.getElementById('nameBar');
    const tren = tb && tb.offsetParent ? Math.max(0, tb.getBoundingClientRect().bottom) : 0;
    const duoi = nb && getComputedStyle(nb).display !== 'none' ? nb.getBoundingClientRect().height : 0;
    m.style.top = tren + 'px'; m.style.bottom = duoi + 'px';
    m.style.display = 'flex'; document.body.style.overflow = 'hidden';
    m.querySelector('.tqx').onclick = dong;
    const ve = n => { mcharts.forEach(c => { try { c.destroy(); } catch(e){} }); mcharts = [];
      m.querySelectorAll('.tqvx,.tqdot,.tqbox').forEach(x => x.remove());
      if (gia) { const i0 = n ? Math.max(0, X.N.length - n) : 0;
        const a = veGia(document.getElementById('tqMC1'), X, i0), b = veTien(document.getElementById('tqMC2'), X, i0);
        mcharts = [a, b]; ganGia(X, i0, a, document.getElementById('tqMW1'), b, document.getElementById('tqMW2'));
        m.querySelectorAll('.tqkh button').forEach(x => x.classList.toggle('on', +x.dataset.n === n)); }
      else { const a = veLs(document.getElementById('tqMC1'), T); mcharts = [a]; ganLs(T, a, document.getElementById('tqMW1')); } };
    m.querySelectorAll('.tqkh button').forEach(x => x.onclick = () => ve(+x.dataset.n));
    requestAnimationFrame(() => ve(gia ? 750 : 0));
  }

  function render(){
    const el = document.getElementById('view-tq'); if (!el) return;
    const T = window.TQ;
    if (!T || !T.N || T.N.length < 300) { el.innerHTML = '<div class="card"><b>Toàn cảnh thị trường</b><div class="mini" style="margin-top:6px">Chưa tải được dữ liệu — thử tải lại trang.</div></div>'; return; }
    css();
    const X = tinh(T);
    if (!ve) { el.innerHTML = html(T, X); veChart(T, X); ve = true; }
    else charts.forEach(c => { try { c.resize(); } catch(e){} });
  }
  function hien(){
    document.querySelectorAll('[id^="view-"]').forEach(x => { x.style.display = 'none'; });
    const e = document.getElementById('view-tq'); if (e) e.style.display = '';
    document.querySelectorAll('.nav-link').forEach(x => x.classList.toggle('active', x.dataset.view === 'tq'));
    const fd = document.getElementById('footDisc'); if (fd) fd.style.display = 'none';
    try { gtag('event', 'view_tab', {tab_name: 'tq'}); } catch(err){}
    render();
  }
  (function(){ const _sv = window.showView; if (!_sv || window.__svTQ) return; window.__svTQ = 1;
    window.showView = function(v){ if (v === 'tq') { hien(); return; }
      const e = document.getElementById('view-tq'); if (e) e.style.display = 'none';
      return _sv.apply(this, arguments); };
  })();
  function them(){
    const nav = document.querySelector('nav'); if (!nav || document.getElementById('view-tq')) return;
    const b = document.createElement('button'); b.className = 'nav-link'; b.dataset.view = 'tq'; b.textContent = 'Toàn cảnh';
    b.onclick = function(){ hien(); try { history.replaceState(null, '', '#toan-canh'); } catch(e){} };
    const first = nav.querySelector('button'); nav.insertBefore(b, first ? first.nextSibling : null);
    // nút tab gốc chuyển view nội bộ (không qua window.showView) -> tự ẩn view-tq
    nav.addEventListener('click', function(e){ const t = e.target.closest('button'); if (!t || !t.dataset.view || t.dataset.view === 'tq') return;
      const v = document.getElementById('view-tq'); if (v) v.style.display = 'none';
      if (location.hash === '#toan-canh') try { history.replaceState(null, '', location.pathname + location.search); } catch(err){} }, true);
    setInterval(function(){ const v = document.getElementById('view-tq'); if (!v || v.style.display === 'none') return;
      const khac = [].slice.call(document.querySelectorAll('[id^="view-"]')).filter(x => x !== v && x.style.display !== 'none' && x.offsetParent !== null);
      if (khac.length) v.style.display = 'none'; }, 700);
    const wrap = document.getElementById('view-market').parentElement;
    const d = document.createElement('div'); d.id = 'view-tq'; d.style.display = 'none';
    const foot = wrap.querySelector('footer'); wrap.insertBefore(d, foot || null);
    if (location.hash === '#toan-canh') setTimeout(hien, 300);   // link chia sẻ cho khách
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', them); else them();
})();
