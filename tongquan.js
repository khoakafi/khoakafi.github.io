/* ===== tongquan.js — Tab "Toàn cảnh": dòng tiền dẫn đường + lãi suất =====
   27/09 (2): anh Khoa — đơn giản, dễ hiểu, bắt mắt; bỏ chart rổ vs VN-Index. Dòng tiền ghi bằng % mức bình thường (120% / 80%).
   27/09/2026 anh Khoa: tab riêng, để khách nhìn là thấy "đang chờ gì". Không đưa B★ vào (B★ cũng theo dòng tiền chung).
   Dữ liệu: tongquan_data.js (window.TQ) — kafi-core workflow "Toan canh thi truong" dựng lại mỗi ngày 17:05 (research/phat-tongquan.mjs).
   Chỉ báo dòng tiền = giá trị khớp THẬT bình quân 20 phiên ÷ 250 phiên, toàn thị trường (~700 mã VNDirect).
   Trạng thái: A = tiền vào + giá lên (≥1,2 và rổ top 150 > MA50), B = tiền vào giá giảm, C = ở giữa, D = tiền rút (<0,8). */
(function(){
  const INK = '#14201C', EWC = '#1F6FB2', LEND = '#0F7A3D', DEP = '#1F6FB2', MUT = '#6B7280', GRID = '#EEF0F2',
        XANH = 'rgba(24,163,75,.13)', DO = 'rgba(229,72,77,.10)';
  const TEN = {A:'Tiền vào + giá lên', B:'Tiền vào nhưng giá giảm (bán tháo)', C:'Ở giữa', D:'Tiền rút'};
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

  function html(T, X){
    const {N, kL, nL, ma50, gt20, can, k0, eps} = X;
    const pct = Math.round(nL[2] * 100), dk1 = nL[2] >= 1.2, dk2 = nL[1] > ma50[kL];
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
  <div class="tqt">Mỗi lần tiền vào mạnh, thị trường đi lên sau đó</div>
  <div class="tqs">Giá 150 cổ phiếu giao dịch nhiều nhất từ 2018. Nhìn chấm xanh và ô số trên chart để thấy những lần "chờ tiền vào" trước đây đã đáng chờ thế nào.</div>
  <div class="tqleg tqleg2">
    <span><b class="lgc"></b>Tiền vào mạnh + giá đi lên = <b>thời điểm mua</b></span>
    <span><b class="lgp">+31%</b>thị trường tăng tới đỉnh sau đó</span>
    <span><b class="lgp lgx">✕ hỏng</b>tín hiệu tắt nhanh, không thành sóng</span>
    <span><i class="bx" style="background:${XANH}"></i>giai đoạn tiền còn vào</span>
  </div>
  <div class="tqc"><canvas id="tqC1" aria-label="Giá 150 cổ phiếu giao dịch nhiều nhất, vùng xanh là lúc tiền vào mạnh"></canvas></div>
  <div class="tqt" style="font-size:14px;margin-top:16px">Tiền giao dịch so với mức bình thường của năm <span class="mini" style="font-weight:500">— chấm xanh: lúc vượt 120%</span></div>
  <div class="tqc sm"><canvas id="tqC2" aria-label="Thanh khoản so với mức bình thường của năm, %"></canvas></div>
</div>

<div class="card">
  <div class="tqt">Vì sao tiền rút: lãi tiết kiệm lên ${vn(ls.dep[lsN])}%</div>
  <div class="tqs">Gửi ngân hàng lãi cao, không rủi ro — tiền nằm yên ở ngân hàng thay vì vào chứng khoán. Từ ${thang(ls.m[0])} lãi tiết kiệm tăng ${vn(ls.dep[lsN] - ls.dep[0])} điểm %, đúng lúc tiền rút khỏi thị trường. Số NHNN, cập nhật mỗi tháng.</div>
  <div class="tqleg"><span><i style="background:${DEP}"></i>Lãi tiết kiệm 6–12 tháng</span><span><i style="background:${LEND}"></i>Lãi cho vay</span></div>
  <div class="tqc"><canvas id="tqC3" aria-label="Lãi suất tiết kiệm và cho vay theo tháng"></canvas></div>
</div>

<div class="ft">Tiền giao dịch = giá trị khớp lệnh bình quân 1 tháng so với bình quân 1 năm, toàn thị trường. Giá đi lên = nhóm 150 cổ phiếu giao dịch nhiều nhất nằm trên đường trung bình 50 phiên.
Nguồn: VNDirect, NHNN. Quy tắc cố định, không dùng mô hình học máy. Kết quả quá khứ không bảo đảm tương lai; chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</div>`;
  }

  function veChart(T, X){
    if (typeof Chart === 'undefined') return;
    charts.forEach(c => { try { c.destroy(); } catch(e){} }); charts = [];
    const {N, kL, nL, eps} = X, lab = N.map(r => r[0]);
    const FONT = 'Inter, system-ui, sans-serif';
    const tip = { backgroundColor:'rgba(17,24,39,.94)', titleColor:'#fff', bodyColor:'#E5E7EB', footerColor:'#9CA3AF', borderWidth:0, padding:11, cornerRadius:9,
      boxPadding:5, usePointStyle:true, titleFont:{weight:'700', family:FONT}, bodyFont:{family:FONT}, footerFont:{family:FONT, weight:'500'} };
    const nam = function(v){ const d = lab[v], p = lab[v-1]; if (!d || !p || d.slice(0,4) === p.slice(0,4)) return '';
      return this.chart.width < 520 ? (+d.slice(0,4) % 2 ? '' : d.slice(0,4)) : d.slice(0,4); };
    const trucX = cb => ({grid:{display:false}, border:{display:false}, ticks:{color:'#9CA3AF', maxRotation:0, autoSkip:false, callback:cb, font:{size:11, family:FONT}}});
    const trucY = f => ({position:'right', grid:{color:'#F1F3F5', drawTicks:false}, border:{display:false}, ticks:{color:'#9CA3AF', padding:8, callback:f, font:{size:11, family:FONT}}});
    const doc = (c, top, bot) => (ctx) => { const {chart} = ctx, {ctx:g, chartArea:a} = chart; if (!a) return null;
      const gr = g.createLinearGradient(0, a.top, 0, a.bottom); gr.addColorStop(0, top); gr.addColorStop(1, bot); return gr; };
    // viên thuốc chữ (nhãn đỉnh sóng, Hôm nay)
    const pill = (g, text, x, y, bg, fg, bd) => { g.save(); g.font = '700 11.5px ' + FONT; const w = g.measureText(text).width + 14, h = 21;
      x = Math.max(w/2 + 2, Math.min(g.canvas.width / (window.devicePixelRatio || 1) - w/2 - 2, x));
      g.beginPath(); (g.roundRect ? g.roundRect(x - w/2, y - h/2, w, h, 10.5) : g.rect(x - w/2, y - h/2, w, h)); g.fillStyle = bg; g.fill();
      if (bd) { g.strokeStyle = bd; g.lineWidth = 1; g.stroke(); }
      g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y + .5); g.restore(); };
    const cham = (g, x, y, c) => { g.save(); g.fillStyle = c + '33'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(x, y, 3.5, 0, 7); g.fill(); g.restore(); };
    // vạch dọc theo chuột
    const doc_ = {id:'tqDoc', afterDatasetsDraw(ch){ const a = ch.tooltip && ch.tooltip.getActiveElements && ch.tooltip.getActiveElements(); if (!a || !a.length) return;
      const x = a[0].element.x, {ctx:g, chartArea:c} = ch; g.save(); g.strokeStyle = 'rgba(17,24,39,.35)'; g.setLineDash([3,3]); g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, c.top); g.lineTo(x, c.bottom); g.stroke(); g.restore(); }};
    // chart 1: nền xanh lúc tiền vào mạnh
    const nen = {id:'tqNen', beforeDatasetsDraw(ch){ const {ctx:g, chartArea:c, scales:{x}} = ch; g.save(); let k = 0;
      const gr = g.createLinearGradient(0, c.top, 0, c.bottom); gr.addColorStop(0, 'rgba(24,163,75,.16)'); gr.addColorStop(1, 'rgba(24,163,75,.04)'); g.fillStyle = gr;
      while (k < N.length) { const s = N[k][3]; let j = k; while (j+1 < N.length && N[j+1][3] === s) j++;
        if (s === 'A') { const x0 = Math.max(c.left, x.getPixelForValue(k)), x1 = Math.min(c.right, x.getPixelForValue(j+1 < N.length ? j+1 : j));
          g.fillRect(x0, c.top, Math.max(1.5, x1 - x0), c.bottom - c.top); }
        k = j + 1; } g.restore(); }};
    const nhan = {id:'tqNhan', afterDatasetsDraw(ch){ const {ctx:g, chartArea:c, scales:{x, y}} = ch, nho = ch.width < 560, dat = [];
      g.save(); g.font = '800 11.5px ' + FONT;
      eps.forEach(e => { const hong = e.f60 != null && e.f60 <= 0, px = x.getPixelForValue(e.a), py = y.getPixelForValue(N[e.a][1]);
        const t = hong ? '✕ hỏng' : '+' + vn(e.pk, 0) + '%', w = g.measureText(t).width + 16;
        if (nho && !hong && e.pk < 30) { cham(g, px, py, '#18A34B'); return; }
        let ty = Math.max(c.top + 12, py - 34);
        while (dat.some(d => Math.abs(d.x - px) < (d.w + w) / 2 + 4 && Math.abs(d.y - ty) < 23)) ty -= 24;
        if (ty < c.top + 10) { ty = py + 34; while (dat.some(d => Math.abs(d.x - px) < (d.w + w) / 2 + 4 && Math.abs(d.y - ty) < 23)) ty += 24; }
        dat.push({x:px, y:ty, w});
        g.strokeStyle = hong ? 'rgba(229,72,77,.6)' : 'rgba(24,163,75,.7)'; g.lineWidth = 1.2; g.setLineDash([2,2]);
        g.beginPath(); g.moveTo(px, py); g.lineTo(px, ty + (ty < py ? 10 : -10)); g.stroke(); g.setLineDash([]);
        cham(g, px, py, hong ? '#E5484D' : '#18A34B');
        pill(g, t, px, ty, hong ? '#FFF5F5' : '#fff', hong ? '#D93D42' : '#128A3E', hong ? '#F4B4B6' : '#9FD9B4'); });
      g.restore();
      const px = x.getPixelForValue(kL), py = y.getPixelForValue(nL[1]); cham(g, px, py, '#111827');
      const tn = nho ? 'Hôm nay' : (nL[3] === 'A' ? 'Hôm nay · tiền đang vào' : 'Hôm nay · đang chờ'); pill(g, tn, px - (nho ? 24 : 60), py + 24, '#111827', '#fff'); }};
    const c1 = new Chart(document.getElementById('tqC1'), {type:'line', plugins:[nen, nhan, doc_],
      data:{labels:lab, datasets:[{label:'Giá 150 cổ phiếu', data:N.map(r => r[1]), borderColor:EWC, borderWidth:2, pointRadius:0, pointHoverRadius:5,
        pointHoverBackgroundColor:EWC, pointHoverBorderColor:'#fff', pointHoverBorderWidth:2, tension:.25,
        fill:'start', backgroundColor:doc(EWC, 'rgba(31,111,178,.22)', 'rgba(31,111,178,0)')}]},
      options:{responsive:true, maintainAspectRatio:false, animation:{duration:600}, interaction:{mode:'index', intersect:false}, layout:{padding:{top:30, right:4}},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:it => ngay(it[0].label), label:it => ' Giá 150 cổ phiếu: ' + vn(it.parsed.y, 0),
          footer:it => { const r = N[it[0].dataIndex]; return 'Tiền giao dịch ' + Math.round(r[2] * 100) + '% mức bình thường' + (r[3] === 'A' ? ' · tiền vào mạnh' : ''); }}}},
        scales:{x:trucX(nam), y:trucY(v => vn(v, 0))}}});
    // chart 2: dòng tiền (%), đường đổi màu theo vùng
    const mau = v => v >= 120 ? '#18A34B' : v < 80 ? '#E5484D' : '#9CA3AF';
    const vung = {id:'tqVung', beforeDatasetsDraw(ch){ const {ctx:g, chartArea:c, scales:{y}} = ch; g.save();
      const y120 = y.getPixelForValue(120), y80 = y.getPixelForValue(80);
      g.fillStyle = 'rgba(24,163,75,.07)'; g.fillRect(c.left, c.top, c.width, y120 - c.top);
      g.fillStyle = 'rgba(229,72,77,.06)'; g.fillRect(c.left, y80, c.width, c.bottom - y80);
      g.setLineDash([4,4]); g.lineWidth = 1;
      [[y120,'rgba(24,163,75,.55)'],[y80,'rgba(229,72,77,.55)']].forEach(([yy, cl]) => { g.strokeStyle = cl; g.beginPath(); g.moveTo(c.left, yy); g.lineTo(c.right, yy); g.stroke(); });
      g.setLineDash([]); g.font = '700 11px ' + FONT; g.textAlign = 'left';
      g.fillStyle = '#128A3E'; g.fillText('TIỀN VÀO MẠNH · trên 120%', c.left + 8, c.top + 15);
      g.fillStyle = '#D93D42'; g.fillText('TIỀN RÚT · dưới 80%', c.left + 8, c.bottom - 8); g.restore(); },
      afterDatasetsDraw(ch){ const {ctx:g, scales:{x, y}} = ch, v = Math.round(nL[2] * 100), px = x.getPixelForValue(kL), py = y.getPixelForValue(v);
        eps.forEach(e => cham(g, x.getPixelForValue(e.a), y.getPixelForValue(Math.round(N[e.a][2] * 100)), e.f60 != null && e.f60 <= 0 ? '#E5484D' : '#18A34B'));
        cham(g, px, py, mau(v)); pill(g, v + '%', px - 28, py - 18, mau(v), '#fff'); }};
    const c2 = new Chart(document.getElementById('tqC2'), {type:'line', plugins:[vung, doc_],
      data:{labels:lab, datasets:[{label:'Tiền giao dịch', data:N.map(r => Math.round(r[2] * 100)), borderWidth:2, pointRadius:0, pointHoverRadius:5,
        pointHoverBorderColor:'#fff', pointHoverBorderWidth:2, tension:.3, borderColor:'#9CA3AF',
        segment:{borderColor:c => mau((c.p0.parsed.y + c.p1.parsed.y) / 2)}}]},
      options:{responsive:true, maintainAspectRatio:false, animation:{duration:600}, interaction:{mode:'index', intersect:false}, layout:{padding:{top:6, right:4}},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:it => ngay(it[0].label),
          label:it => ` ${it.parsed.y}% mức bình thường`, footer:it => vn(N[it[0].dataIndex][4]/1000, 1) + ' nghìn tỷ/phiên'}}},
        scales:{x:trucX(nam), y:{...trucY(v => v + '%'), min:30, max:260}}}});
    const dongBo = (a, b) => (e, act) => { try {
      if (!act.length) { b.setActiveElements([]); b.tooltip.setActiveElements([], {x:0, y:0}); b.update('none'); return; }
      const i = act[0].index, el = [{datasetIndex:0, index:i}], p = b.getDatasetMeta(0).data[i];
      b.setActiveElements(el); b.tooltip.setActiveElements(el, {x:p.x, y:p.y}); b.update('none'); } catch(err){} };
    c1.options.onHover = dongBo(c1, c2); c2.options.onHover = dongBo(c2, c1);
    // chart 3: lãi suất NHNN theo tháng (liền mạch), ghi số hiện tại ở cuối đường
    const ls = T.ls, M = ls.m;
    const cuoi = {id:'tqCuoi', afterDatasetsDraw(ch){ const g = ch.ctx;
      ch.data.datasets.forEach((d, i) => { const m = ch.getDatasetMeta(i), p = m.data[m.data.length-1]; if (!p) return;
        cham(g, p.x, p.y, d.borderColor); pill(g, vn(d.data[d.data.length-1], 1) + '%', p.x - 30, p.y - 18, d.borderColor, '#fff');
        const p0 = m.data[0]; g.save(); g.font = '600 11px ' + FONT; g.fillStyle = d.borderColor; g.textAlign = 'left';
        g.fillText(vn(d.data[0], 1) + '%', p0.x + 2, p0.y - 9); g.restore(); }); }};
    const c3 = new Chart(document.getElementById('tqC3'), {type:'line', plugins:[cuoi, doc_],
      data:{labels:M, datasets:[
        {label:'Lãi cho vay', data:ls.lend, borderColor:LEND, borderWidth:2.6, pointRadius:0, pointHoverRadius:5, pointHoverBorderColor:'#fff', pointHoverBorderWidth:2, pointHoverBackgroundColor:LEND,
          tension:.35, fill:'start', backgroundColor:doc(LEND, 'rgba(15,122,61,.14)', 'rgba(15,122,61,0)')},
        {label:'Lãi tiết kiệm 6–12 tháng', data:ls.dep, borderColor:DEP, borderWidth:2.6, pointRadius:0, pointHoverRadius:5, pointHoverBorderColor:'#fff', pointHoverBorderWidth:2, pointHoverBackgroundColor:DEP,
          tension:.35, fill:'start', backgroundColor:doc(DEP, 'rgba(31,111,178,.16)', 'rgba(31,111,178,0)')}]},
      options:{responsive:true, maintainAspectRatio:false, animation:{duration:600}, interaction:{mode:'index', intersect:false}, layout:{padding:{top:22, right:6}},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:it => 'Tháng ' + thang(it[0].label), label:it => ` ${it.dataset.label}: ${vn(it.parsed.y, 1)}%`}}},
        scales:{x:{...trucX(function(v){ const m = M[v]; if (!m) return ''; const nho = this.chart.width < 520;
            return (nho ? (+m.slice(5) % 3 === 0 || v === 0) : true) ? (+m.slice(5)) + '/' + m.slice(2,4) : ''; })},
          y:{...trucY(v => vn(v, 0) + '%'), min:4, max:12}}}});
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
