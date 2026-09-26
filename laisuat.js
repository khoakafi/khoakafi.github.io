/* ===== laisuat.js — Lai suat tien gui & cho vay binh quan (NHNN) + so voi loi suat loi nhuan VN-Index =====
   Dat trong tab Hang hoa (dang an). 26/09/2026 anh Khoa: CHUA dua len trang chinh — chot y tuong/insight truoc. So NHNN: can tren cua khoang cong bo, cap nhat tay moi thang (NHNN tre ~3 tuan).
   P/E VN-Index lay song tu VNDirect finfo (fallback so chot san). */
window.LS = {
  nguon: 'NHNN — cận trên khoảng công bố',
  m:    ['2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08'],
  dep:  [5.5, 5.5, 5.5, 5.5, 5.5, 5.6, 5.9, 6.3, 6.5, 6.8, 7.1, 7.4, 7.6, 7.8, 8.0],   // tien gui 6-12 thang
  lend: [8.8, 8.9, 8.8, 8.9, 9.0, 8.9, 9.0, 9.3, 9.4, 9.7, 10.0, 10.1, 10.5, 10.5, 10.7], // cho vay binh quan
  pe:   [13.21, 13.91, 15.19, 15.03, 14.38, 14.72, 16.38, 16.25, 15.52, 13.91, 14.45, 14.01, 14.00, 11.93, 12.52] // P/E VN-Index cuoi thang (fallback)
};
(function(){
  const DEP = '#1F6FB2', LEND = '#0F7A3D', EY = '#14201C', GRID = '#EEF0F2', MUT = '#6B7280';
  const f1 = v => v == null ? '—' : (+v).toFixed(1).replace('.', ',');
  const f2 = v => v == null ? '—' : (+v).toFixed(2).replace('.', ',');
  const lab = k => (+k.slice(5)) + '.' + k.slice(0, 4);
  let peMo = null, peNow = null, ch1 = null, ch2 = null;

  function css(){
    if (document.getElementById('lscss')) return;
    const s = document.createElement('style'); s.id = 'lscss';
    s.textContent = `
#lsCard{margin-top:16px}
#lsCard .lsg{display:grid;grid-template-columns:1fr 1fr;gap:22px}
#lsCard .lsbox{min-width:0}
#lsCard .lst{font-size:13px;font-weight:700;color:#111827;margin:0 0 2px}
#lsCard .lss{font-size:12px;color:${MUT};margin:0 0 8px}
#lsCard .lsc{height:300px;position:relative}
#lsCard .lsn{font-size:12px;color:${MUT};margin-top:8px}
#lsCard .lsn b{color:#111827;font-weight:700}
#lsCard .lsleg{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:#374151;margin:0 0 6px}
#lsCard .lsleg i{display:inline-block;width:14px;height:2px;vertical-align:3px;margin-right:6px}
@media(max-width:900px){ #lsCard .lsg{grid-template-columns:1fr} }`;
    document.head.appendChild(s);
  }

  async function loadPE(){
    if (peMo) return;
    try {
      const r = await fetch('https://api-finfo.vndirect.com.vn/v4/ratios?q=code:VNINDEX~ratioCode:PRICE_TO_EARNINGS&sort=reportDate:desc&size=600').then(r => r.json());
      const arr = (r.data || []).map(x => [x.reportDate, x.value]).reverse();
      if (!arr.length) return;
      const mo = {}; arr.forEach(x => { mo[x[0].slice(0, 7)] = x; });
      peMo = mo; peNow = arr[arr.length - 1];
    } catch(e){}
  }

  function series(){
    const L = window.LS;
    const months = L.m.slice();
    const pe = L.m.map((k, i) => (peMo && peMo[k]) ? peMo[k][1] : L.pe[i]);
    // thang hien tai (NHNN chua cong bo) — chi co P/E song
    if (peNow && peNow[0].slice(0, 7) > months[months.length - 1]) { months.push(peNow[0].slice(0, 7)); pe.push(peNow[1]); }
    return { months, pe, ey: pe.map(v => v > 0 ? 100 / v : null) };
  }

  function opts(extra){
    return Object.assign({
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111827', padding: 10, titleFont: { weight: '700' },
        callbacks: { label: c => ' ' + c.dataset.label + ': ' + (c.parsed.y == null ? '—' : f2(c.parsed.y) + '%') } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: MUT, font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
        y: { grid: { color: GRID }, border: { display: false }, ticks: { color: MUT, font: { size: 11 }, callback: v => v + '%' } }
      },
      elements: { point: { radius: 0, hoverRadius: 4 }, line: { borderWidth: 2, tension: 0.3, cubicInterpolationMode: 'monotone' } }
    }, extra || {});
  }

  function build(){
    const host = document.getElementById('view-hh'); if (!host || !window.Chart) return;
    if (document.getElementById('lsCard')) return;
    css();
    const L = window.LS, n = L.m.length - 1;
    const card = document.createElement('div'); card.className = 'card'; card.id = 'lsCard';
    card.innerHTML = `
      <h2>LÃI SUẤT TRONG NƯỚC <span class="hint">% / năm · ${L.nguon} · số tháng ${lab(L.m[n])}</span></h2>
      <div class="lsg">
        <div class="lsbox">
          <div class="lst">Lãi suất tiền gửi, cho vay bình quân hàng tháng</div>
          <div class="lss">Áp dụng với VNĐ</div>
          <div class="lsleg"><span><i style="background:${DEP}"></i>Tiền gửi 6–12 tháng</span><span><i style="background:${LEND}"></i>Cho vay bình quân</span></div>
          <div class="lsc"><canvas id="lsCv1"></canvas></div>
          <div class="lsn" id="lsN1"></div>
        </div>
        <div class="lsbox">
          <div class="lst">Cổ phiếu hay tiết kiệm?</div>
          <div class="lss">Lợi suất lợi nhuận VN-Index (1 / P/E) so với lãi tiền gửi 6–12 tháng</div>
          <div class="lsleg"><span><i style="background:${EY}"></i>Lợi suất lợi nhuận VN-Index</span><span><i style="background:${DEP}"></i>Tiền gửi 6–12 tháng</span></div>
          <div class="lsc"><canvas id="lsCv2"></canvas></div>
          <div class="lsn" id="lsN2"></div>
        </div>
      </div>
      <div class="hint" style="padding-top:10px;font-size:11.5px">Nguồn: Ngân hàng Nhà nước (lãi suất, công bố trễ khoảng 3 tuần) · VNDirect (P/E VN-Index, cập nhật theo phiên).</div>`;
    host.appendChild(card);
    draw();
  }

  function draw(){
    const L = window.LS, n = L.m.length - 1;
    const c1 = document.getElementById('lsCv1'), c2 = document.getElementById('lsCv2'); if (!c1 || !c2) return;
    // Chart 1 — dung nhu VnExpress
    if (ch1) ch1.destroy();
    ch1 = new Chart(c1, { type: 'line',
      data: { labels: L.m.map(lab), datasets: [
        { label: 'Cho vay bình quân', data: L.lend, borderColor: LEND, backgroundColor: LEND },
        { label: 'Tiền gửi 6–12 tháng', data: L.dep, borderColor: DEP, backgroundColor: DEP } ] },
      options: opts({ plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111827', padding: 10,
        callbacks: { label: c => ' ' + c.dataset.label + ': ' + f1(c.parsed.y) + '%',
                     afterBody: it => { const i = it[0].dataIndex; return 'Chênh lệch: ' + f1(L.lend[i] - L.dep[i]) + ' điểm %'; } } } } })
    });
    const n1 = document.getElementById('lsN1');
    if (n1) n1.innerHTML = `Tháng ${lab(L.m[n])}: cho vay <b>${f1(L.lend[n])}%</b> · tiền gửi <b>${f1(L.dep[n])}%</b> · chênh lệch <b>${f1(L.lend[n] - L.dep[n])}</b> điểm % — một năm trước: ${f1(L.lend[Math.max(0, n-12)])}% và ${f1(L.dep[Math.max(0, n-12)])}%.`;

    // Chart 2 — loi suat loi nhuan VN-Index vs tien gui
    const S = series();
    const dep2 = S.months.map((k, i) => i < L.dep.length ? L.dep[i] : null);
    if (ch2) ch2.destroy();
    ch2 = new Chart(c2, { type: 'line',
      data: { labels: S.months.map(lab), datasets: [
        { label: 'Lợi suất lợi nhuận VN-Index', data: S.ey, borderColor: EY, backgroundColor: EY },
        { label: 'Tiền gửi 6–12 tháng', data: dep2, borderColor: DEP, backgroundColor: DEP } ] },
      options: opts({ plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111827', padding: 10,
        callbacks: { label: c => ' ' + c.dataset.label + ': ' + (c.parsed.y == null ? 'chưa công bố' : f2(c.parsed.y) + '%'),
                     afterBody: it => { const i = it[0].dataIndex; const p = S.pe[i];
                       const g = (S.ey[i] != null && dep2[i] != null) ? (S.ey[i] - dep2[i]) : null;
                       return ['P/E VN-Index: ' + f2(p)].concat(g == null ? [] : ['Chênh lệch: ' + (g >= 0 ? '+' : '−') + f2(Math.abs(g)) + ' điểm %']); } } } } })
    });
    const n2 = document.getElementById('lsN2');
    if (n2) {
      const eyL = S.ey[S.ey.length - 1], peL = S.pe[S.pe.length - 1], g = S.ey[n] - L.dep[n], g0 = S.ey[0] - L.dep[0];
      const nowTxt = (peNow && S.months.length > L.m.length) ? ` · hiện tại (${peNow[0].slice(8,10)}/${peNow[0].slice(5,7)}): P/E ${f2(peL)} → <b>${f2(eyL)}%</b>` : '';
      n2.innerHTML = `Tháng ${lab(L.m[n])}: VN-Index <b>${f2(S.ey[n])}%</b> so với tiết kiệm <b>${f1(L.dep[n])}%</b> → chênh <b>${(g >= 0 ? '+' : '−') + f2(Math.abs(g))}</b> điểm % (tháng ${lab(L.m[0])}: ${(g0 >= 0 ? '+' : '−') + f2(Math.abs(g0))})${nowTxt}.`;
    }
  }

  async function tick(){
    try {
      const host = document.getElementById('view-hh'); if (!host) return;
      if (!document.getElementById('lsCard')) { await loadPE(); build(); }
      // mo tab khi canvas dang an -> ve lai cho du khung
      if (host.offsetParent && ch1 && ch1.width < 50) draw();
    } catch(e){ console.warn('[ls]', e); }
  }
  const start = () => { tick(); setInterval(tick, 1500); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 800);
})();
