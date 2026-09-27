/* ===== tongquan.js — Tab "Toàn cảnh": dòng tiền dẫn đường + lãi suất + rổ top 150 vs VN-Index =====
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
#view-tq .tqh{display:flex;align-items:baseline;gap:10px;margin:2px 0 4px}
#view-tq .tqh b{font-size:17px}
#view-tq .tqlead{font-size:13px;color:#374151;margin:0 0 14px;max-width:880px;line-height:1.55}
#view-tq .tqsec{font-size:11.5px;font-weight:800;letter-spacing:.5px;color:${MUT};text-transform:uppercase;margin:22px 0 10px}
#view-tq .tqt{font-size:14px;font-weight:700;color:#111827;margin:0 0 3px}
#view-tq .tqs{font-size:12.5px;color:${MUT};margin:0 0 10px;line-height:1.5}
#view-tq .tqleg{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:#374151;margin:0 0 6px}
#view-tq .tqleg i{display:inline-block;width:14px;height:2px;vertical-align:3px;margin-right:6px}
#view-tq .tqleg i.bx{width:12px;height:12px;border-radius:3px;vertical-align:-2px;border:1px solid var(--border)}
#view-tq .tqc{position:relative;height:320px}
#view-tq .tqc.sm{height:200px}
#view-tq .tqnote{background:var(--panel2);border-left:3px solid var(--green);border-radius:0 8px 8px 0;padding:10px 14px;margin-top:12px;font-size:13px;line-height:1.6;color:#1F2937}
#view-tq .tqcho{border:1.5px solid var(--border);border-radius:12px;background:#fff;padding:18px 20px 14px;margin-bottom:16px;box-shadow:0 1px 3px rgba(16,24,40,.05)}
#view-tq .tqcho .ey{font-size:11.5px;font-weight:800;letter-spacing:.5px;color:${MUT};text-transform:uppercase}
#view-tq .tqcho h3{font-size:20px;margin:4px 0 4px;color:#111827}
#view-tq .tqdk{display:grid;grid-template-columns:30px 1fr;gap:3px 12px;padding:12px 0;border-top:1px solid var(--border)}
#view-tq .tqdk .ic{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:800;color:#fff;margin-top:1px}
#view-tq .tqdk .ic.x{background:var(--red)} #view-tq .tqdk .ic.v{background:var(--green)}
#view-tq .tqdk .t{font-weight:700;font-size:14px}
#view-tq .tqdk .s{grid-column:2;color:#4B5563;font-size:12.5px;line-height:1.5}
#view-tq .tqbar{grid-column:2;height:9px;border-radius:5px;background:var(--panel2);position:relative;margin:5px 0 3px;max-width:520px}
#view-tq .tqbar i{position:absolute;left:0;top:0;bottom:0;border-radius:5px;background:${EWC}}
#view-tq .tqbar b{position:absolute;top:-4px;bottom:-4px;width:2px;background:#111827}
#view-tq .tqbar em{position:absolute;top:-19px;font-size:10.5px;font-style:normal;color:${MUT};transform:translateX(-50%)}
#view-tq .tqkq{background:var(--green-soft);border-radius:10px;padding:11px 14px;margin-top:6px;font-size:13px;line-height:1.6;color:#14532D}
#view-tq table.tqtb{width:100%;border-collapse:collapse}
#view-tq .tqtb th{font-size:10.5px;color:#7A828E;font-weight:700;text-transform:uppercase;letter-spacing:.3px;padding:7px 9px;border-bottom:1px solid var(--border);text-align:right;background:#FCFDFD;white-space:nowrap}
#view-tq .tqtb td{padding:8px 9px;border-bottom:1px solid #F4F6F8;text-align:right;font-variant-numeric:tabular-nums;font-size:13px;white-space:nowrap}
#view-tq .tqtb th:first-child,#view-tq .tqtb td:first-child{text-align:left}
#view-tq .up{color:var(--green-dark);font-weight:700} #view-tq .dn{color:var(--red);font-weight:700}
#view-tq .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:7px;vertical-align:1px}
#view-tq .tqg2{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
#view-tq .tqg2 .card{margin-bottom:0}
@media(max-width:900px){#view-tq .tqg2{grid-template-columns:1fr}#view-tq .tqc{height:260px}#view-tq .tqcho h3{font-size:18px}}`;
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
      e.pk = (N[mx][1]/i0 - 1) * 100; e.pkd = N[mx][0]; e.pkk = mx; e.len = e.b - e.a + 1; });
    const st = {}; N.forEach((r, k) => { if (!N[k+60]) return; const o = st[r[3]] = st[r[3]] || {n:0, s:0, p:0}; const f = N[k+60][1]/r[1] - 1; o.n++; o.s += f; o.p += f > 0; });
    return {N, kL, nL, ma50, gt20, can, k0, eps, st};
  }

  function html(T, X){
    const {N, kL, nL, ma50, gt20, can, k0, eps, st} = X;
    const dk1 = nL[2] >= 1.2, dk2 = nL[1] > ma50[kL], lech = (nL[1]/ma50[kL] - 1) * 100;
    const co = eps.filter(e => e.f60 != null), ok = co.filter(e => e.f60 > 0), hong = co.filter(e => e.f60 <= 0);
    const tb = co.reduce((a, e) => a + e.f60, 0) / co.length;
    const tt = {A:['up','Tiền vào + giá lên'], B:['','Tiền vào nhưng giá giảm'], C:['','Ở giữa'], D:['dn','Tiền rút']}[nL[3]];
    const tong = Object.values(st).reduce((a, o) => a + o.n, 0);
    const D = T.D, dl = D[D.length-1], d11 = D.find(r => r.m === '2025-11');
    const ls = T.ls, lsN = ls.m.length - 1;
    const pct = v => Math.min(100, v / 1.5 * 100);
    return `
<div class="tqh"><b>Toàn cảnh thị trường</b><span class="mini">dữ liệu đến ${ngay(nL[0])}</span></div>
<p class="tqlead">Sóng lớn chỉ đến khi <b>dòng tiền quay lại</b>. Tab này theo dõi đúng một điều: tiền đang vào hay đang rút — và còn thiếu gì để bắt đầu một con sóng mới.</p>

<div class="tqcho">
  <div class="ey">Hiện tại · ${ngay(nL[0])}</div>
  <h3>${dk1 && dk2 ? 'Tín hiệu đã bật — dòng tiền đang vào' : 'Đang chờ: dòng tiền quay lại'}</h3>
  <div class="tqs" style="margin:0 0 4px">Trạng thái <b class="${tt[0]}">${tt[1]}</b> từ ${ngay(N[k0][0])} (${kL-k0+1} phiên). Một con sóng mới cần <b>cả hai</b> điều kiện:</div>
  <div class="tqdk"><span class="ic ${dk1?'v':'x'}" aria-label="${dk1?'Đạt':'Chưa đạt'}">${dk1?'✓':'✕'}</span>
    <div class="t">Dòng tiền ≥ 1,2 — hiện ${vn(nL[2],2)}</div>
    <div class="tqbar" aria-hidden="true" style="margin-top:20px"><i style="width:${pct(nL[2])}%"></i><b style="left:${pct(1.2)}%"></b><em style="left:${pct(1.2)}%">1,2</em></div>
    <div class="s">Giá trị khớp bình quân 20 phiên <b>${vn(gt20/1000,1)} nghìn tỷ/phiên</b>. Cần khoảng <b>${vn(can/1000,1)} nghìn tỷ/phiên</b> (gấp ${vn(can/gt20,1)} lần hiện nay).</div></div>
  <div class="tqdk"><span class="ic ${dk2?'v':'x'}" aria-label="${dk2?'Đạt':'Chưa đạt'}">${dk2?'✓':'✕'}</span>
    <div class="t">Rổ top 150 trên đường trung bình 50 phiên — hiện ${lech >= 0 ? 'trên' : 'dưới'} ${vn(Math.abs(lech))}%</div>
    <div class="s">Giá phải xác nhận: tiền vào mà giá vẫn giảm thường là bán tháo, chưa phải sóng.</div></div>
  <div class="tqkq">Từ 2018, hai điều kiện cùng bật <b>${eps.length} lần — ${ok.length} lần rổ tăng sau 60 phiên</b> (bình quân ${vn(tb)}%), gồm mọi con sóng lớn.${hong.length ? ` Lần hỏng (${hong.map(e => ngay(N[e.a][0])).join(', ')}) tín hiệu chỉ giữ ${hong.map(e => e.len).join(', ')} phiên rồi tắt — <b>tín hiệu thật giữ được vài chục phiên</b>.` : ''}</div>
</div>

<div class="tqsec">Bằng chứng từ 2018 đến nay</div>
<div class="card">
  <div class="tqt">Sóng lớn chỉ đến khi tiền vào</div>
  <div class="tqs">Rổ 150 mã thanh khoản cao nhất, mỗi mã tỷ trọng bằng nhau — phản ánh số đông cổ phiếu đúng hơn VN-Index. Nền xanh: <b>tiền vào + giá lên</b>. Nền đỏ: <b>tiền rút</b>. Số trên chart: mức tăng tới đỉnh sóng tính từ lúc tín hiệu bật. Rê chuột lên một chart, chart còn lại hiện cùng phiên.</div>
  <div class="tqleg"><span><i style="background:${EWC}"></i>Rổ top 150 (01/2018 = 100)</span><span><i class="bx" style="background:${XANH}"></i>Tiền vào + giá lên</span><span><i class="bx" style="background:${DO}"></i>Tiền rút</span></div>
  <div class="tqc"><canvas id="tqC1" aria-label="Rổ top 150 theo phiên, nền màu theo trạng thái dòng tiền"></canvas></div>
  <div class="tqleg" style="margin-top:12px"><span><i style="background:${EWC}"></i>Chỉ báo dòng tiền — vạch 1,2: ngưỡng tiền vào · 0,8: ngưỡng tiền rút</span></div>
  <div class="tqc sm"><canvas id="tqC2" aria-label="Chỉ báo dòng tiền theo phiên"></canvas></div>
  <div class="tqnote"><b>Mọi đoạn tăng mạnh đều nằm trên nền xanh</b> — lúc chỉ báo dòng tiền vượt 1,2. Khi chỉ báo dưới 0,8 (nền đỏ), rổ đi ngang hoặc giảm. Con sóng 2020–2021 (+${vn(Math.max(...eps.map(e => e.pk)),0)}%) giữ chỉ báo trên 1,2 suốt hơn một năm.</div>
</div>

<div class="tqg2">
  <div class="card" style="overflow-x:auto">
    <div class="tqt">Mỗi lần tín hiệu "tiền vào + giá lên" bật</div>
    <div class="tqs">Phiên đầu tiên bật (trước đó ít nhất 20 phiên không có tín hiệu). Lợi suất của rổ top 150.</div>
    <table class="tqtb"><tr><th>Phiên bật</th><th>Giữ</th><th>60 phiên sau</th><th>Tới đỉnh</th><th>Ngày đỉnh</th></tr>
    ${eps.map(e => `<tr><td>${ngay(N[e.a][0])}</td><td>${e.len} phiên</td><td class="${e.f60 == null ? '' : e.f60 > 0 ? 'up' : 'dn'}">${e.f60 == null ? '…' : (e.f60 > 0 ? '+' : '') + vn(e.f60) + '%'}</td><td>+${vn(e.pk)}%</td><td>${ngay(e.pkd)}</td></tr>`).join('')}</table>
  </div>
  <div class="card" style="overflow-x:auto">
    <div class="tqt">Đứng ở mỗi trạng thái thì 60 phiên sau thế nào</div>
    <div class="tqs">Toàn bộ các phiên từ 2018. "Ở giữa" là vùng nhiễu — dễ bị kéo lên rồi rơi lại.</div>
    <table class="tqtb"><tr><th>Trạng thái</th><th>Thời gian</th><th>Rổ 60 phiên sau</th><th>Số lần tăng</th></tr>
    ${['A','C','D','B'].filter(k => st[k]).map(k => { const o = st[k], m = o.s/o.n*100; return `<tr><td><span class="dot" style="background:${k==='A'?'var(--green)':k==='D'?'var(--red)':'#B8BEC6'}"></span>${TEN[k]}</td><td>${Math.round(o.n/tong*100)}%</td><td class="${m > 3 ? 'up' : m < 0 ? 'dn' : ''}">${m > 0 ? '+' : ''}${vn(m)}%</td><td>${Math.round(o.p/o.n*100)}%</td></tr>`; }).join('')}</table>
  </div>
</div>

<div class="tqsec">Bối cảnh: vì sao tiền đang rút</div>
<div class="tqg2">
  <div class="card">
    <div class="tqt">Lãi suất 2019 – nay</div>
    <div class="tqs">Lãi cao thì tiền nằm ngân hàng, không vào chứng khoán. Đường liền: số tháng NHNN công bố (cận trên của khoảng). Đường đứt: bình quân năm (World Bank), chỉ để xem hướng đi. Nền đỏ: tháng dòng tiền rút.</div>
    <div class="tqleg"><span><i style="background:${LEND}"></i>Cho vay bình quân</span><span><i style="background:${DEP}"></i>Tiền gửi 6–12 tháng</span><span><i style="background:repeating-linear-gradient(90deg,#6B7280 0 4px,transparent 4px 7px)"></i>Bình quân năm</span></div>
    <div class="tqc"><canvas id="tqC3" aria-label="Lãi suất cho vay và tiền gửi 2019 đến nay"></canvas></div>
    <div class="tqnote">2021 lãi tiền gửi xuống thấp nhất (bình quân 3,4%) — đúng con sóng lớn nhất. Từ 2022 lãi quay đầu tăng — thị trường sập. Hiện tiền gửi 6–12 tháng <b>${vn(ls.dep[lsN])}%</b>, cho vay <b>${vn(ls.lend[lsN])}%</b> (${thang(ls.m[lsN])}), tăng từ ${vn(ls.dep[0])}% / ${vn(ls.lend[0])}% hồi ${thang(ls.m[0])}. <b>Lãi suất hạ nhiệt là điều kiện nền để dòng tiền quay lại.</b> <span class="mini">Chưa có số tháng 2024 – 5/2025 có nguồn; số NHNN tự cập nhật khoảng ngày 17–18 hằng tháng.</span></div>
  </div>
  <div class="card">
    <div class="tqt">VN-Index đang che một thị trường yếu</div>
    <div class="tqs">Cùng quy về 100 tại 08/2017, theo tháng.</div>
    <div class="tqleg"><span><i style="background:${EWC}"></i>Rổ top 150 (số đông cổ phiếu)</span><span><i style="background:${INK}"></i>VN-Index</span></div>
    <div class="tqc"><canvas id="tqC4" aria-label="Rổ top 150 và VN-Index theo tháng"></canvas></div>
    ${d11 ? `<div class="tqnote">Từ 12/2025 rổ top 150 <b>${dl.ew >= d11.ew ? 'tăng' : 'giảm'} ${vn(Math.abs((dl.ew/d11.ew - 1) * 100))}%</b> trong khi VN-Index <b>${dl.vni >= d11.vni ? 'tăng' : 'giảm'} ${vn(Math.abs((dl.vni/d11.vni - 1) * 100))}%</b> — vài mã vốn hoá lớn kéo chỉ số, số đông cổ phiếu đi hướng khác. Vì vậy tab này đo bằng rổ top 150.</div>` : ''}
  </div>
</div>

<div class="card" style="margin-top:16px">
  <div class="tqt">Cách đọc</div>
  <div class="tqs" style="margin:6px 0 0;line-height:1.75">
    <b>Chỉ báo dòng tiền</b> = giá trị khớp lệnh thật bình quân 20 phiên ÷ bình quân 250 phiên (≈ 1 tháng so với 1 năm), toàn thị trường.<br>
    <b class="up">Tiền vào + giá lên</b>: chỉ báo ≥ 1,2 <b>và</b> rổ top 150 trên đường trung bình 50 phiên — tín hiệu cần chờ.<br>
    <b class="dn">Tiền rút</b>: chỉ báo &lt; 0,8 — thị trường thiếu lực, sóng khó hình thành. <b>Ở giữa</b>: còn lại.<br>
    <span class="mini">Nguồn: giá và giá trị khớp VNDirect (≈700 mã); lãi suất NHNN (PDF "Diễn biến lãi suất" hằng tháng) và World Bank. Quy tắc cố định, không dùng mô hình học máy. Kết quả quá khứ không bảo đảm tương lai; thông tin chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</span>
  </div>
</div>`;
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
    const nen = {id:'tqNen', beforeDatasetsDraw(ch){ const {ctx, chartArea:ca, scales:{x}} = ch, col = {A:XANH, D:DO}; ctx.save(); let k = 0;
      while (k < N.length) { const s = N[k][3]; let j = k; while (j+1 < N.length && N[j+1][3] === s) j++;
        if (col[s]) { const x0 = Math.max(ca.left, x.getPixelForValue(k)), x1 = Math.min(ca.right, x.getPixelForValue(j+1 < N.length ? j+1 : j));
          ctx.fillStyle = col[s]; ctx.fillRect(x0, ca.top, Math.max(1, x1 - x0), ca.bottom - ca.top); }
        k = j + 1; } ctx.restore(); }};
    const nhan = {id:'tqNhan', afterDatasetsDraw(ch){ const {ctx, scales:{x, y}} = ch; ctx.save(); ctx.font = '700 11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
      if (ch.width >= 560) eps.filter(e => e.pk >= 9).filter((e, i, arr) => !arr.some(o => o !== e && Math.abs(o.pkk - e.pkk) < 40 && o.pk > e.pk)).forEach(e => { ctx.fillStyle = '#128A3E'; ctx.fillText('+' + vn(e.pk, 0) + '%', x.getPixelForValue(e.pkk), y.getPixelForValue(N[e.pkk][1]) - 8); });
      const px = x.getPixelForValue(kL), py = y.getPixelForValue(nL[1]); ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(px, py, 4, 0, 7); ctx.fill();
      ctx.textAlign = 'right'; ctx.fillText('Hôm nay', px - 8, py - 9); ctx.restore(); }};
    const vach = {id:'tqVach', beforeDatasetsDraw(ch){ const {ctx, chartArea:ca, scales:{y}} = ch; ctx.save(); ctx.setLineDash([4,4]); ctx.lineWidth = 1; ctx.font = '11px Inter, system-ui';
      [[1.2,'#128A3E'],[0.8,'#E5484D']].forEach(([v, c]) => { const py = y.getPixelForValue(v); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(ca.left, py); ctx.lineTo(ca.right, py); ctx.stroke();
        ctx.fillStyle = c; ctx.fillText(vn(v, 1), ca.left + 4, py - 4); }); ctx.restore(); }};
    const tieuDe = it => 'Phiên ' + ngay(it[0].label), chan = it => { const r = N[it[0].dataIndex]; return 'Dòng tiền ' + vn(r[2], 2) + ' · ' + TEN[r[3]]; };
    const duong = (label, data, c, w = 1.5) => ({label, data, borderColor:c, backgroundColor:c, borderWidth:w, pointRadius:0, pointHoverRadius:4, tension:0, spanGaps:true});
    const c1 = new Chart(document.getElementById('tqC1'), {type:'line', plugins:[nen, nhan],
      data:{labels:lab, datasets:[duong('Rổ top 150', N.map(r => r[1]), EWC)]},
      options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index', intersect:false}, layout:{padding:{top:14}},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:tieuDe, footer:chan, label:it => ' Rổ top 150: ' + vn(it.parsed.y, 1)}}},
        scales:{x:trucX(nam), y:trucY(v => vn(v, 0))}}});
    const c2 = new Chart(document.getElementById('tqC2'), {type:'line', plugins:[nen, vach],
      data:{labels:lab, datasets:[duong('Dòng tiền', N.map(r => r[2]), EWC)]},
      options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index', intersect:false},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:tieuDe, footer:chan, label:it => ` Chỉ báo ${vn(it.parsed.y, 2)} · khớp ${vn(N[it.dataIndex][4]/1000, 1)} nghìn tỷ`}}},
        scales:{x:trucX(nam), y:{...trucY(v => vn(v, 1)), min:0.3, max:2.6}}}});
    const dongBo = (a, b) => (e, act) => { try {
      if (!act.length) { b.setActiveElements([]); b.tooltip.setActiveElements([], {x:0, y:0}); b.update('none'); return; }
      const i = act[0].index, el = [{datasetIndex:0, index:i}], p = b.getDatasetMeta(0).data[i];
      b.setActiveElements(el); b.tooltip.setActiveElements(el, {x:p.x, y:p.y}); b.update('none'); } catch(err){} };
    c1.options.onHover = dongBo(c1, c2); c2.options.onHover = dongBo(c2, c1);
    // lãi suất theo tháng 2019 -> tháng NHNN mới nhất
    const ls = T.ls, lsI = {}; ls.m.forEach((m, k) => lsI[m] = k);
    const M = []; for (let y = 2019; ; y++) { let het = false; for (let m = 1; m <= 12; m++) { const k = y + '-' + String(m).padStart(2,'0'); if (k > ls.m[ls.m.length-1]) { het = true; break; } M.push(k); } if (het) break; }
    const cuoiThang = {}; N.forEach(r => cuoiThang[r[0].slice(0,7)] = r[3]);
    const nenRut = {id:'tqRut', beforeDatasetsDraw(ch){ const {ctx, chartArea:ca, scales:{x}} = ch, w = x.getPixelForValue(1) - x.getPixelForValue(0); ctx.save(); ctx.fillStyle = DO;
      M.forEach((m, k) => { if (cuoiThang[m] !== 'D') return; const cx = x.getPixelForValue(k); ctx.fillRect(Math.max(ca.left, cx - w/2), ca.top, w, ca.bottom - ca.top); }); ctx.restore(); }};
    const namT = function(v){ const m = M[v]; if (!m || !m.endsWith('-01')) return ''; return this.chart.width < 420 ? (+m.slice(0,4) % 2 ? '' : m.slice(0,4)) : m.slice(0,4); };
    const net = d => ({...d, borderDash:[5,4], stepped:'middle', spanGaps:false, pointRadius:0});
    const c3 = new Chart(document.getElementById('tqC3'), {type:'line', plugins:[nenRut],
      data:{labels:M, datasets:[
        {...duong('Cho vay (NHNN)', M.map(m => m in lsI ? ls.lend[lsI[m]] : null), LEND, 2), pointRadius:2, spanGaps:false},
        {...duong('Tiền gửi 6–12T (NHNN)', M.map(m => m in lsI ? ls.dep[lsI[m]] : null), DEP, 2), pointRadius:2, spanGaps:false},
        net(duong('Cho vay (bình quân năm)', M.map(m => WB[m.slice(0,4)] ? WB[m.slice(0,4)][0] : null), LEND)),
        net(duong('Tiền gửi (bình quân năm)', M.map(m => WB[m.slice(0,4)] ? WB[m.slice(0,4)][1] : null), DEP))]},
      options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index', intersect:false},
        plugins:{legend:{display:false}, tooltip:{...tip, filter:it => it.parsed.y != null, callbacks:{title:it => 'Tháng ' + thang(it[0].label), label:it => ` ${it.dataset.label}: ${vn(it.parsed.y, 2)}%`}}},
        scales:{x:trucX(namT), y:{...trucY(v => vn(v, 0) + '%'), min:2, max:12}}}});
    const D = T.D;
    const c4 = new Chart(document.getElementById('tqC4'), {type:'line',
      data:{labels:D.map(r => r.m), datasets:[duong('Rổ top 150', D.map(r => r.ew), EWC, 2), duong('VN-Index', D.map(r => r.vni), INK, 2)]},
      options:{responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index', intersect:false},
        plugins:{legend:{display:false}, tooltip:{...tip, callbacks:{title:it => 'Tháng ' + thang(it[0].label), label:it => ` ${it.dataset.label}: ${vn(it.parsed.y, 0)}`}}},
        scales:{x:trucX(function(v){ const m = D[v] && D[v].m; return m && m.endsWith('-01') ? (this.chart.width < 420 && +m.slice(0,4) % 2 ? '' : m.slice(0,4)) : ''; }), y:trucY(v => vn(v, 0))}}});
    charts = [c1, c2, c3, c4];
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
