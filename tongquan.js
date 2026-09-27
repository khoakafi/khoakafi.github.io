/* ===== tongquan.js — Tab "Toàn cảnh": dòng tiền dẫn đường + lãi suất =====
   27/09 (2): anh Khoa — đơn giản, dễ hiểu, bắt mắt; bỏ chart rổ vs VN-Index. Dòng tiền ghi bằng % mức bình thường (120% / 80%).
   27/09/2026 anh Khoa: tab riêng, để khách nhìn là thấy "đang chờ gì". Không đưa B★ vào (B★ cũng theo dòng tiền chung).
   Dữ liệu: tongquan_data.js (window.TQ) — kafi-core workflow "Toan canh thi truong" dựng lại mỗi ngày 17:05 (research/phat-tongquan.mjs).
   Chỉ báo dòng tiền = giá trị khớp THẬT bình quân 20 phiên ÷ 250 phiên, toàn thị trường (~700 mã VNDirect).
   Trạng thái: A = tiền vào + giá lên (≥1,2 và rổ top 150 > MA50), B = tiền vào giá giảm, C = ở giữa, D = tiền rút (<0,8). */
(function(){
  const INK = '#14201C', EWC = '#1F6FB2', LEND = '#0F7A3D', DEP = '#1F6FB2', MUT = '#6B7280', GRID = '#EEF0F2',
        XANH = 'rgba(24,163,75,.13)', DO = 'rgba(229,72,77,.10)';
  const WB = {2019:[7.71,4.98], 2020:[7.65,4.12], 2021:[7.81,3.38], 2022:[8.01,3.82], 2023:[9.32,4.78]}; // World Bank FR.INR.LEND / FR.INR.DPST (bình quân năm)
  const TEN = {A:'Tiền vào + giá lên', B:'Tiền vào nhưng giá giảm (bán tháo)', C:'Ở giữa', D:'Tiền rút'};
  const vn = (x, d = 1) => x.toLocaleString('vi-VN', {minimumFractionDigits:d, maximumFractionDigits:d});
  const ngay = d => d.slice(8,10) + '/' + d.slice(5,7) + '/' + d.slice(0,4);
  const thang = m => m.slice(5) + '/' + m.slice(0,4);
  let charts = [], ve = false;

  function css(){
    if (document.getElementById('tqcss')) return;
    const s = document.createElement('style'); s.id = 'tqcss';
    s.textContent = `
#view-tq{max-width:1180px}
#view-tq .tqh{display:flex;align-items:baseline;gap:10px;margin:2px 0 12px}
#view-tq .tqh b{font-size:17px}
#view-tq .tqt{font-size:16px;font-weight:800;color:#111827;margin:0 0 3px}
#view-tq .tqs{font-size:13px;color:${MUT};margin:0 0 12px;line-height:1.5}
#view-tq .tqc{position:relative;height:300px}
#view-tq .tqc.sm{height:190px}
#view-tq .tqhero{background:#fff;border:1px solid var(--border);border-radius:14px;padding:22px 24px 20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(16,24,40,.05)}
#view-tq .tqhero .ey{font-size:11.5px;font-weight:800;letter-spacing:.6px;color:${MUT};text-transform:uppercase}
#view-tq .tqhero h3{font-size:24px;line-height:1.25;margin:6px 0 4px;color:#111827}
#view-tq .tqhero .big{font-size:15px;color:#374151;margin:0 0 18px}
#view-tq .tqhero .big b{font-size:15px}
#view-tq .tqgau{position:relative;margin:46px 0 8px}
#view-tq .tqgau .zn{display:flex;height:16px;border-radius:8px;overflow:hidden}
#view-tq .tqgau .zn i{display:block;height:100%}
#view-tq .tqgau .lb{display:flex;font-size:12px;font-weight:700;margin-top:7px}
#view-tq .tqgau .lb span{text-align:center}
#view-tq .tqgau .mk{position:absolute;top:-30px;transform:translateX(-50%);text-align:center;font-weight:800;font-size:13px;color:#111827;white-space:nowrap}
#view-tq .tqgau .mk:after{content:'';display:block;margin:3px auto 0;width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid #111827}
#view-tq .tqdks{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
#view-tq .tqdk{border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;gap:11px;align-items:flex-start}
#view-tq .tqdk .ic{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:800;color:#fff}
#view-tq .tqdk .ic.x{background:var(--red)} #view-tq .tqdk .ic.v{background:var(--green)}
#view-tq .tqdk b{display:block;font-size:14px;color:#111827;margin-bottom:2px}
#view-tq .tqdk span{font-size:12.5px;color:#4B5563;line-height:1.45}
#view-tq .tqso{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
#view-tq .tqso div{background:#fff;border:1px solid var(--border);border-radius:12px;padding:14px 16px}
#view-tq .tqso b{display:block;font-size:26px;font-weight:800;color:var(--green-dark);line-height:1.15}
#view-tq .tqso span{font-size:12.5px;color:#4B5563}
#view-tq .tqsong{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
#view-tq .tqsong div{background:var(--green-soft);border-radius:9px;padding:7px 11px;font-size:12px;color:#374151}
#view-tq .tqsong div b{display:block;font-size:15px;color:var(--green-dark)}
#view-tq .tqsong div.hong{background:var(--red-soft)} #view-tq .tqsong div.hong b{color:var(--red)}
#view-tq .tqleg{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#374151;margin:0 0 6px}
#view-tq .tqleg i{display:inline-block;width:14px;height:3px;vertical-align:3px;margin-right:6px;border-radius:2px}
#view-tq .tqleg i.bx{width:12px;height:12px;vertical-align:-2px}
#view-tq .ft{font-size:11.5px;color:${MUT};line-height:1.6;margin:4px 2px 0}
@media(max-width:900px){#view-tq .tqdks{grid-template-columns:1fr}#view-tq .tqso{gap:8px}#view-tq .tqso div{padding:10px}#view-tq .tqso b{font-size:19px}#view-tq .tqso span{font-size:11.5px}#view-tq .tqhero h3{font-size:20px}#view-tq .tqc{height:250px}#view-tq .tqhero{padding:18px 16px}}`;
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

  function html(T, X){
    const {N, kL, nL, ma50, gt20, can, k0, eps} = X;
    const pct = Math.round(nL[2] * 100), dk1 = nL[2] >= 1.2, dk2 = nL[1] > ma50[kL];
    const co = eps.filter(e => e.f60 != null), ok = co.filter(e => e.f60 > 0);
    const tb = co.reduce((a, e) => a + e.f60, 0) / co.length;
    const ls = T.ls, lsN = ls.m.length - 1;
    // thanh 3 vùng: 0% .. 200%
    const vt = v => Math.max(1, Math.min(99, v / 200 * 100));
    const tieuDe = dk1 && dk2 ? 'Tiền đang vào mạnh — sóng đã bắt đầu' : nL[3] === 'D' ? 'Tiền đang rút khỏi thị trường — chờ tiền quay lại' : 'Tiền chưa vào đủ mạnh — tiếp tục chờ';
    return `
<div class="tqh"><b>Toàn cảnh thị trường</b><span class="mini">cập nhật ${ngay(nL[0])}</span></div>

<div class="tqhero">
  <div class="ey">Hôm nay</div>
  <h3>${tieuDe}</h3>
  <div class="tqbig">Tiền giao dịch 1 tháng qua ${pct < 100 ? 'chỉ bằng' : 'bằng'} <b>${pct}%</b> mức bình thường của cả năm.${nL[3] === 'D' ? ` Tiền rút kéo dài từ ${ngay(N[k0][0])}.` : ''}</div>
  <div class="tqgau" role="img" aria-label="Thanh khoản hiện ${pct}% mức bình thường">
    <div class="mk" style="left:${vt(pct)}%">Hôm nay ${pct}%</div>
    <div class="zn"><i style="width:40%;background:#F6C9CB"></i><i style="width:20%;background:#E5E7EB"></i><i style="width:40%;background:#BFE6CD"></i></div>
    <div class="lb"><span style="width:40%;color:var(--red)">Tiền rút · dưới 80%</span><span style="width:20%;color:${MUT}">Bình thường</span><span style="width:40%;color:var(--green-dark)">Tiền vào mạnh · trên 120%</span></div>
  </div>
  <div class="tqdks">
    <div class="tqdk"><span class="ic ${dk1?'v':'x'}">${dk1?'✓':'✕'}</span><div><b>Tiền vào mạnh (trên 120%)</b>
      <span>${dk1 ? 'Đã đạt.' : `Cần khoảng <b style="display:inline;font-size:12.5px">${vn(can/1000,0)} nghìn tỷ</b>/phiên, hiện ${vn(gt20/1000,1)} nghìn tỷ.`}</span></div></div>
    <div class="tqdk"><span class="ic ${dk2?'v':'x'}">${dk2?'✓':'✕'}</span><div><b>Giá cổ phiếu quay đầu đi lên</b>
      <span>${dk2 ? 'Đã đạt — giá đang trên xu hướng 50 phiên.' : 'Chưa — giá vẫn dưới xu hướng 50 phiên.'}</span></div></div>
  </div>
</div>

<div class="tqso">
  <div><b>${eps.length} lần</b><span>tiền vào mạnh + giá đi lên, từ 2018</span></div>
  <div><b>${ok.length}/${co.length} lần</b><span>thị trường tăng trong 3 tháng sau đó</span></div>
  <div><b>+${vn(tb)}%</b><span>tăng bình quân 3 tháng sau tín hiệu</span></div>
</div>

<div class="card">
  <div class="tqt">Mỗi con sóng lớn đều bắt đầu khi tiền vào mạnh</div>
  <div class="tqs">Giá 150 cổ phiếu giao dịch nhiều nhất. Vùng xanh: lúc tiền vào mạnh và giá đi lên.</div>
  <div class="tqleg"><span><i style="background:${EWC}"></i>Giá 150 cổ phiếu (2018 = 100)</span><span><i class="bx" style="background:${XANH}"></i>Tiền vào mạnh</span></div>
  <div class="tqc"><canvas id="tqC1" aria-label="Giá 150 cổ phiếu giao dịch nhiều nhất, vùng xanh là lúc tiền vào mạnh"></canvas></div>
  <div class="tqt" style="font-size:14px;margin-top:16px">Tiền giao dịch so với mức bình thường của năm</div>
  <div class="tqc sm"><canvas id="tqC2" aria-label="Thanh khoản so với mức bình thường của năm, %"></canvas></div>
  <div class="tqsong">${eps.map(e => `${e.f60 != null && e.f60 <= 0 ? `<div class="hong">${ngay(N[e.a][0]).slice(3)}<b>Tín hiệu hỏng</b>tắt sau ${e.len} phiên</div>` : `<div>${ngay(N[e.a][0]).slice(3)}<b>+${vn(e.pk,0)}%</b>tới đỉnh sóng</div>`}`).join('')}</div>
</div>

<div class="card">
  <div class="tqt">Vì sao tiền rút: lãi tiết kiệm lên ${vn(ls.dep[lsN])}%</div>
  <div class="tqs">Gửi ngân hàng lãi cao, không rủi ro — tiền nằm yên ở ngân hàng thay vì vào chứng khoán. Con sóng lớn nhất (2020–2021) đến khi lãi thấp nhất.</div>
  <div class="tqleg"><span><i style="background:${DEP}"></i>Lãi tiết kiệm 6–12 tháng</span><span><i style="background:${LEND}"></i>Lãi cho vay</span><span><i style="background:repeating-linear-gradient(90deg,#9CA3AF 0 4px,transparent 4px 7px)"></i>2019–2023: bình quân năm</span></div>
  <div class="tqc"><canvas id="tqC3" aria-label="Lãi suất tiết kiệm và cho vay từ 2019"></canvas></div>
</div>

<div class="ft">Tiền giao dịch = giá trị khớp lệnh bình quân 1 tháng so với bình quân 1 năm, toàn thị trường. Giá đi lên = nhóm 150 cổ phiếu giao dịch nhiều nhất nằm trên đường trung bình 50 phiên.
Nguồn: VNDirect, NHNN, World Bank. Quy tắc cố định, không dùng mô hình học máy. Kết quả quá khứ không bảo đảm tương lai; chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</div>`;
  }

  function veChart(T, X){
    if (typeof Chart === 'undefined') return;
    charts.forEach(c => { try { c.destroy(); } catch(e){} }); charts = [];
    const {N, kL, nL, eps} = X, lab = N.map(r => r[0]);
    const tip = { backgroundColor:'#fff', titleColor:'#111827', bodyColor:'#374151', footerColor:MUT, borderColor:'#E5E7EB', borderWidth:1, padding:10, boxPadding:4, usePointStyle:true };
    const nam = function(v){ const d = lab[v], p = lab[v-1]; if (!d || !p || d.slice(0,4) === p.slice(0,4)) return '';
      return this.chart.width < 520 ? (+d.slice(0,4) % 2 ? '' : d.slice(0,4)) : d.slice(0,4); };
    const trucX = cb => ({grid:{display:false}, ticks:{color:MUT, maxRotation:0, autoSkip:false, callback:cb, font:{size:11}}});
    const trucY = f => ({grid:{color:GRID}, border:{display:false}, ticks:{color:MUT, callback:f, font:{size:11}}});
    const nen = {id:'tqNen', beforeDatasetsDraw(ch){ const {ctx, chartArea:ca, scales:{x}} = ch; ctx.save(); ctx.fillStyle = XANH; let k = 0;
      while (k < N.length) { const s = N[k][3]; let j = k; while (j+1 < N.length && N[j+1][3] === s) j++;
        if (s === 'A') { const x0 = Math.max(ca.left, x.getPixelForValue(k)), x1 = Math.min(ca.right, x.getPixelForValue(j+1 < N.length ? j+1 : j));
          ctx.fillRect(x0, ca.top, Math.max(1, x1 - x0), ca.bottom - ca.top); }
        k = j + 1; } ctx.restore(); }};
    const nhan = {id:'tqNhan', afterDatasetsDraw(ch){ const {ctx, scales:{x, y}} = ch; ctx.save(); ctx.font = '800 12px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
      if (ch.width >= 560) eps.filter(e => e.pk >= 15).filter((e, i, arr) => !arr.some(o => o !== e && Math.abs(o.pkk - e.pkk) < 40 && o.pk > e.pk))
        .forEach(e => { const t = '+' + vn(e.pk, 0) + '%', tx = x.getPixelForValue(e.pkk), ty = y.getPixelForValue(N[e.pkk][1]) - 9; ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.strokeText(t, tx, ty); ctx.fillStyle = '#128A3E'; ctx.fillText('+' + vn(e.pk, 0) + '%', x.getPixelForValue(e.pkk), y.getPixelForValue(N[e.pkk][1]) - 9); });
      const px = x.getPixelForValue(kL), py = y.getPixelForValue(nL[1]); ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(px, py, 4.5, 0, 7); ctx.fill();
      ctx.textAlign = 'right'; ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.strokeText('Hôm nay', px - 6, py - 12); ctx.fillText('Hôm nay', px - 6, py - 12); ctx.restore(); }};
    // chart dòng tiền: dải ngang 3 vùng (dưới 80% đỏ, trên 120% xanh)
    const vung = {id:'tqVung', beforeDatasetsDraw(ch){ const {ctx, chartArea:ca, scales:{y}} = ch; ctx.save();
      const y120 = y.getPixelForValue(120), y80 = y.getPixelForValue(80);
      ctx.fillStyle = 'rgba(24,163,75,.10)'; ctx.fillRect(ca.left, ca.top, ca.width, y120 - ca.top);
      ctx.fillStyle = 'rgba(229,72,77,.08)'; ctx.fillRect(ca.left, y80, ca.width, ca.bottom - y80);
      ctx.font = '700 11px Inter, system-ui'; ctx.textAlign = 'left';
      ctx.fillStyle = '#128A3E'; ctx.fillText('Tiền vào mạnh · trên 120%', ca.left + 6, ca.top + 13);
      ctx.fillStyle = '#E5484D'; ctx.fillText('Tiền rút · dưới 80%', ca.left + 6, ca.bottom - 6); ctx.restore(); }};
    const tieuDe = it => 'Ngày ' + ngay(it[0].label);
    const duong = (label, data, c, w = 1.6) => ({label, data, borderColor:c, backgroundColor:c, borderWidth:w, pointRadius:0, pointHoverRadius:4, tension:0, spanGaps:true});
    const c1 = new Chart(document.getElementById('tqC1'), {type:'line', plugins:[nen, nhan],
      data:{labels:lab, datasets:[duong('Giá 150 cổ phiếu', N.map(r => r[1]), EWC)]},
      options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index', intersect:false}, layout:{padding:{top:16}},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:tieuDe, label:it => ' Giá 150 cổ phiếu: ' + vn(it.parsed.y, 0),
          footer:it => 'Tiền giao dịch: ' + Math.round(N[it[0].dataIndex][2] * 100) + '% mức bình thường'}}},
        scales:{x:trucX(nam), y:trucY(v => vn(v, 0))}}});
    const c2 = new Chart(document.getElementById('tqC2'), {type:'line', plugins:[vung],
      data:{labels:lab, datasets:[duong('Tiền giao dịch', N.map(r => Math.round(r[2] * 100)), '#111827', 1.4)]},
      options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index', intersect:false},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:tieuDe, label:it => ` ${it.parsed.y}% mức bình thường · ${vn(N[it.dataIndex][4]/1000, 1)} nghìn tỷ/phiên`}}},
        scales:{x:trucX(nam), y:{...trucY(v => v + '%'), min:30, max:260}}}});
    const dongBo = (a, b) => (e, act) => { try {
      if (!act.length) { b.setActiveElements([]); b.tooltip.setActiveElements([], {x:0, y:0}); b.update('none'); return; }
      const i = act[0].index, el = [{datasetIndex:0, index:i}], p = b.getDatasetMeta(0).data[i];
      b.setActiveElements(el); b.tooltip.setActiveElements(el, {x:p.x, y:p.y}); b.update('none'); } catch(err){} };
    c1.options.onHover = dongBo(c1, c2); c2.options.onHover = dongBo(c2, c1);
    // lãi suất 2019 -> tháng NHNN mới nhất
    const ls = T.ls, lsI = {}; ls.m.forEach((m, k) => lsI[m] = k);
    const M = []; for (let y = 2019; ; y++) { let het = false; for (let m = 1; m <= 12; m++) { const k = y + '-' + String(m).padStart(2,'0'); if (k > ls.m[ls.m.length-1]) { het = true; break; } M.push(k); } if (het) break; }
    const namT = function(v){ const m = M[v]; if (!m || !m.endsWith('-01')) return ''; return this.chart.width < 420 ? (+m.slice(0,4) % 2 ? '' : m.slice(0,4)) : m.slice(0,4); };
    const net = d => ({...d, borderDash:[5,4], stepped:'middle', spanGaps:false, pointRadius:0});
    const trong = {id:'tqTrong', afterDatasetsDraw(ch){ const {ctx, chartArea:ca, scales:{x}} = ch;
      const a = M.indexOf('2024-01'), b = M.indexOf(ls.m[0]); if (a < 0 || b <= a) return;
      const cx = (x.getPixelForValue(a) + x.getPixelForValue(b)) / 2; ctx.save(); ctx.font = '600 11px Inter, system-ui'; ctx.fillStyle = MUT; ctx.textAlign = 'center';
      ctx.fillText('chưa có', cx, (ca.top + ca.bottom) / 2 - 7); ctx.fillText('số tháng', cx, (ca.top + ca.bottom) / 2 + 8); ctx.restore(); }};
    const c3 = new Chart(document.getElementById('tqC3'), {type:'line', plugins:[trong],
      data:{labels:M, datasets:[
        {...duong('Lãi tiết kiệm 6–12 tháng', M.map(m => m in lsI ? ls.dep[lsI[m]] : null), DEP, 2.4), spanGaps:false},
        {...duong('Lãi cho vay', M.map(m => m in lsI ? ls.lend[lsI[m]] : null), LEND, 2.4), spanGaps:false},
        net(duong('Tiết kiệm (bình quân năm)', M.map(m => WB[m.slice(0,4)] ? WB[m.slice(0,4)][1] : null), DEP, 1.5)),
        net(duong('Cho vay (bình quân năm)', M.map(m => WB[m.slice(0,4)] ? WB[m.slice(0,4)][0] : null), LEND, 1.5))]},
      options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index', intersect:false},
        plugins:{legend:{display:false}, tooltip:{...tip, filter:it => it.parsed.y != null, callbacks:{title:it => 'Tháng ' + thang(it[0].label), label:it => ` ${it.dataset.label}: ${vn(it.parsed.y, 1)}%`}}},
        scales:{x:trucX(namT), y:{...trucY(v => vn(v, 0) + '%'), min:2, max:12}}}});
    charts = [c1, c2, c3];
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
