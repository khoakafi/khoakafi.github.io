/* ============================================================
   KN App Shell v2 — vỏ app thuần cho điện thoại
   Mô phỏng theo nếp của các app tài chính đã public
   (Robinhood / TCBS / Binance): tab bar 5 mục có nút giữa nổi,
   trang phụ dạng push/pop có nút Back, chuyển tab có hiệu ứng,
   kéo xuống làm mới, nhớ vị trí cuộn từng tab.

   CHỈ chạy ở chế độ APP (PWA đã cài / ?app=1 / điện thoại chạm).
   Desktop web GIỮ NGUYÊN 100%.
   ============================================================ */
(function(){
  'use strict';

  /* ---------- 1. Nhận diện chế độ APP ---------- */
  var force = /[?&](app=1|src=pwa)/.test(location.search);
  var standalone = false;
  try {
    standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches)
              || window.navigator.standalone === true;
  } catch(e){}
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var narrow  = window.innerWidth <= 900;
  var APP = force || standalone || (isTouch && narrow);
  if (!APP) return;                       // <-- máy tính: không đổi gì cả

  document.documentElement.classList.add('kn-app');
  function onReady(fn){ if(document.body) fn(); else addEventListener('DOMContentLoaded', fn); }

  /* Khóa zoom như app native (chỉ trong chế độ app) */
  try {
    var vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.setAttribute('content',
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  } catch(e){}

  /* Chart.js: tắt animation dài + giới hạn mật độ điểm ảnh -> vẽ nhanh trên máy 3x */
  try {
    if (window.Chart && Chart.defaults){
      Chart.defaults.animation = {duration: 220};
      Chart.defaults.devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
    }
  } catch(e){}

  /* ---------- 2. Icon SVG ---------- */
  function svg(inner, w){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||1.9)+'" '
         + 'stroke-linecap="round" stroke-linejoin="round" width="23" height="23">'+inner+'</svg>';
  }
  var IC = {
    watch:  svg('<path d="M12 3.2l2.6 5.3 5.9.5-4.5 3.9 1.4 5.7L12 15.9 6.6 18.6 8 12.9 3.5 9l5.9-.5z"/>'),
    detail: svg('<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="10" width="3" height="6" rx=".6"/><path d="M8.5 8v2M8.5 16v2"/><rect x="14" y="6" width="3" height="7" rx=".6"/><path d="M15.5 4v2M15.5 13v2"/>'),
    market: svg('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
    fund:   svg('<path d="M12 3a9 9 0 1 0 9 9h-9V3z"/><path d="M15.5 2.6A9 9 0 0 1 21.4 8.5H15.5V2.6z"/>'),
    leader: svg('<rect x="9.2" y="8" width="5.6" height="12" rx=".8"/><rect x="2.8" y="12.5" width="5.6" height="7.5" rx=".8"/><rect x="15.6" y="10.5" width="5.6" height="9.5" rx=".8"/><path d="M12 2.6l.9 1.8 2 .3-1.45 1.4.35 2L12 7.2l-1.8.9.35-2L9.1 4.7l2-.3z" fill="currentColor" stroke="none"/>'),
    back:   svg('<path d="M15 5l-7 7 7 7"/>', 2.2),
    filter: svg('<path d="M4 5h16l-6.2 7.2V19l-3.6 1.8v-8.6z"/>'),
    bell:   svg('<path d="M18 9a6 6 0 1 0-12 0c0 6-2.2 7-2.2 7h16.4S18 15 18 9z"/><path d="M10.2 20a2 2 0 0 0 3.6 0"/>')
  };

  /* ---------- 3. Khai báo tab ----------
     5 tab chính theo yêu cầu: Hiệu suất (giữa, nổi) · Watchlist ·
     Chi tiết mã · Fund Insight · Leader Board.
     Bộ lọc + So sánh = trang phụ (push) mở từ icon phễu trên header.
     Bài viết: BỎ hẳn khỏi app. */
  var TABS = [
    { v:'watch',  label:'Watchlist', icon:IC.watch  },
    { v:'detail', label:'Chi tiết',  icon:IC.detail },
    { v:'market', label:'Hiệu suất', icon:IC.market, center:true },
    { v:'fund',   label:'Fund',      icon:IC.fund   },
    { v:'leader', label:'Leader',    icon:IC.leader }
  ];
  var PRIMARY = {watch:1, detail:1, market:1, fund:1, leader:1};
  var SEC_TITLE = {screener:'Bộ lọc cổ phiếu', compare:'So sánh mã', news:'Bài viết'};

  /* ---------- 4. CSS vỏ app ---------- */
  var css = document.createElement('style'); css.id = 'knAppCss';
  css.textContent =
  /* ===== nền tảng ===== */
    'html.kn-app{-webkit-text-size-adjust:100%}'
  + '.kn-app body{overscroll-behavior-y:contain;touch-action:manipulation;'
  +   '-webkit-tap-highlight-color:transparent;'
  +   'padding-bottom:calc(104px + env(safe-area-inset-bottom,0px))!important}'
  /* ===== topbar ===== */
  + '.kn-app .topbar{padding-top:env(safe-area-inset-top,0px)}'
  + '.kn-app .topbar-in nav{display:none!important}'
  + '.kn-app #btnOpenKafi{display:none!important}'
  + '.kn-app .topbar-in{height:auto;padding:9px 12px;gap:10px}'
  + '.kn-app .logo{font-size:0;gap:0;user-select:none;-webkit-user-select:none}'
  + '.kn-app .logo .logo-mark{flex:none;font-size:15px;width:32px;height:32px;border-radius:9px}'
  + '.kn-app .logo .sub{display:none}'
  + '.kn-app .searchbox{flex:1;min-width:0;padding:8px 13px}'
  + '.kn-app .searchbox input{font-size:15px;min-width:0}'
  + '.kn-app .knIcoBtn{flex:none;width:38px;height:38px;border-radius:50%;border:1px solid var(--border);'
  +   'background:#fff;display:flex;align-items:center;justify-content:center;color:#4b5563;'
  +   'cursor:pointer;padding:0;transition:transform .12s}'
  + '.kn-app .knIcoBtn:active{transform:scale(.9)}'
  + '.kn-app .knIcoBtn svg{width:19px;height:19px}'
  /* CSS gốc gán order cho logo/search -> đặt order rõ ràng cho nút mới */
  + '.kn-app #knBack{order:-2}'
  + '.kn-app #knSecTitle{order:-1}'
  + '.kn-app #knFilter{order:8}'
  + '.kn-app #knBell{order:9}'
  /* topbar ở trang phụ: nút back + tiêu đề */
  + '.kn-app #knBack{display:none}'
  + '.kn-app.kn-sec #knBack{display:flex}'
  + '.kn-app #knSecTitle{display:none;flex:1;font-size:16.5px;font-weight:800;color:var(--text);'
  +   'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  + '.kn-app.kn-sec #knSecTitle{display:block}'
  + '.kn-app.kn-sec .logo,.kn-app.kn-sec .searchbox,.kn-app.kn-sec #knBell,.kn-app.kn-sec #knFilter{display:none!important}'
  /* ===== nội dung ===== */
  + '.kn-app .wrap{padding:8px 0 14px 0}'
  + '.kn-app .card{border-radius:0;border-left:0;border-right:0;box-shadow:none;margin:0 0 8px 0;padding:14px 13px}'
  + '.kn-app .card h2{text-align:left!important;letter-spacing:0!important;text-transform:none!important;font-size:16px}'
  + '.kn-app .card:not(:has(canvas)){content-visibility:auto;contain-intrinsic-size:auto 420px}'
  + '.kn-app table{font-size:13px}'
  + '.kn-app th,.kn-app td{padding:10px 8px}'
  + '.kn-app table tr.row{transition:background .12s}'
  + '.kn-app table tr.row:active{background:#EEF6F0}'
  /* chuyển tab: trượt nhẹ + mờ dần (chỉ transform/opacity -> chạy trên GPU) */
  + '@keyframes knViewIn{from{opacity:.25;transform:translateY(9px)}to{opacity:1;transform:none}}'
  + '.kn-app .knAnim{animation:knViewIn .19s cubic-bezier(.25,.8,.4,1)}'
  + '@media (prefers-reduced-motion:reduce){.kn-app .knAnim{animation:none}}'
  /* ===== Hiệu suất ===== */
  + '.kn-app #view-market div[style*="565"]{height:360px!important}'
  + '.kn-app #recentTbl td,.kn-app #recentWrap td{padding:11px 8px}'
  /* dải chọn khoảng thời gian: 1 hàng, cuộn ngang */
  + '.kn-app .seg{display:flex;flex-wrap:nowrap;overflow-x:auto;max-width:100%;'
  +   '-ms-overflow-style:none;scrollbar-width:none}'
  + '.kn-app .seg::-webkit-scrollbar{display:none}'
  + '.kn-app .seg button{flex:none;white-space:nowrap;padding:7px 14px}'
  /* bảng lợi suất theo tháng: cuộn ngang, cột NĂM ghim trái */
  + '.kn-app #moTable table{width:auto!important;min-width:100%;table-layout:auto}'
  + '.kn-app #moTable th,.kn-app #moTable td{min-width:46px;white-space:nowrap;padding-left:3px;padding-right:3px}'
  + '.kn-app #moTable th:first-child,.kn-app #moTable td:first-child{position:sticky;left:0;z-index:2;'
  +   'background:#fff;min-width:52px;box-shadow:1px 0 0 #EDEFF2;text-align:left;padding-left:2px}'
  /* ===== Watchlist ===== */
  + '.kn-app #view-watch table th{position:sticky;top:0;background:#fff;z-index:3}'
  + '.kn-app #view-watch table th:first-child,.kn-app #view-watch table td:first-child{'
  +   'position:sticky;left:0;background:#fff;z-index:4;box-shadow:1px 0 0 #EDEFF2}'
  + '.kn-app #view-watch table th:first-child{z-index:5}'
  /* Ghim cột đầu các bảng rộng (Bộ lọc / Leader / Fund) + cho cuộn ngang */
  + '.kn-app #view-screener table th:first-child,.kn-app #view-screener table td:first-child,'
  + '.kn-app #view-leader table th:first-child,.kn-app #view-leader table td:first-child,'
  + '.kn-app #view-fund table th:first-child,.kn-app #view-fund table td:first-child'
  + '{position:sticky;left:0;background:#fff;z-index:3;box-shadow:1px 0 0 #EDEFF2}'
  + '.kn-app #view-screener table,.kn-app #view-leader table{min-width:640px}'
  + '.kn-app .card>table,.kn-app #view-screener .card>table{display:block;overflow-x:auto}'
  /* Chú giải chart trong Chi tiết mã: gọn cho màn hẹp */
  + '.kn-app #proLegend,.kn-app #proVolLegend{font-size:11px!important;line-height:1.5!important;padding:2px 7px!important;max-width:calc(100% - 42px)!important}'
  + '.kn-app #proFsBtn{width:26px!important;height:26px!important}'
  /* ===== Leader Board: cột dạng thẻ vuốt ngang có điểm dừng ===== */
  + '.kn-app #lbGrid{grid-auto-columns:minmax(128px,1fr)!important;gap:7px!important;'
  +   'scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;padding-bottom:10px!important}'
  + '.kn-app #lbGrid .lbCol{scroll-snap-align:start;border-radius:11px;padding:7px 6px}'
  + '.kn-app #lbGrid .lbHd{font-size:10px;min-height:26px}'
  + '.kn-app #lbGrid .lbR{font-size:11.5px;padding:4px 5px;margin-bottom:2px;border-radius:6px}'
  /* ===== Fund Insight ===== */
  + '.kn-app #fiSplit{grid-template-columns:1fr!important}'
  + '.kn-app #view-fund .fiC{border-left:0;border-right:0;border-radius:0}'
  + '.kn-app #fiHero{border-left:0;border-right:0;border-radius:0}'
  /* ===== Bộ lọc (trang phụ) ===== */
  + '.kn-app #view-screener .card > div[style*="max-height"]{max-height:none!important;'
  +   'overflow:visible!important;min-height:0!important}'
  + '.kn-app .filters{gap:10px 12px}'
  + '.kn-app #scTable th:nth-child(2),.kn-app #scTable td:nth-child(2){display:none}'
  + '.kn-app #knScrToggle{display:flex;align-items:center;justify-content:space-between;width:100%;'
  +   'border:1px solid var(--border);background:#fff;border-radius:11px;padding:11px 14px;'
  +   'font:inherit;font-size:13.5px;font-weight:700;color:var(--text);cursor:pointer;margin:10px 0 0}'
  + '.kn-app #knScrToggle .cnt{font-size:11.5px;font-weight:700;color:#fff;background:#18A34B;'
  +   'border-radius:999px;padding:2px 8px;margin-left:8px}'
  + '.kn-app #knScrToggle .car{color:#8A919E;transition:transform .18s}'
  + '.kn-app.knScrOpen #knScrToggle .car{transform:rotate(180deg)}'
  + '.kn-app .filters.knHidden{display:none}'
  + '.kn-app #knPresets{display:flex;gap:8px;overflow-x:auto;padding:2px 0 2px;'
  +   '-ms-overflow-style:none;scrollbar-width:none}'
  + '.kn-app #knPresets::-webkit-scrollbar{display:none}'
  + '.kn-app #knPresets .pill{flex:none;white-space:nowrap}'
  /* ===== bảng rộng: bóng mờ mép phải báo còn cột ===== */
  + '.kn-app .knXs{box-shadow:inset -20px 0 15px -15px rgba(16,24,40,.22)}'
  + '.kn-app .knXs.knXsEnd{box-shadow:none}'
  /* ===== ẩn chip thông báo cũ (đã có chuông trên header) ===== */
  + '.kn-app #notifBtn{position:fixed;left:-9999px;top:-9999px}'
  /* ===== footer + dải liên hệ Zalo: nằm trong trang, không đè tab bar ===== */
  + '.kn-app footer{padding-bottom:6px}'
  + '.kn-app #nameBar{position:static!important;box-shadow:none!important;border-top:1px solid #E8EAEF}'
  /* ===== tab bar ===== */
  + '#knTabbar{position:fixed;left:0;right:0;bottom:0;z-index:9000;'
  +   'background:transparent;pointer-events:none;'
  +   'display:grid;grid-template-columns:repeat(5,1fr);'
  +   'padding-top:26px;'
  +   'padding-bottom:calc(8px + env(safe-area-inset-bottom,0px));'
  +   'font-family:Inter,system-ui,-apple-system,sans-serif}'
  + '#knTabbar::before{content:"";position:absolute;left:0;right:0;top:26px;bottom:0;'
  +   'background:#fff;border-top:1px solid #E8EAEF;box-shadow:0 -6px 20px rgba(20,26,40,.06)}'
  + '#knTabbar .knTab{position:relative;pointer-events:auto;background:none;border:0;cursor:pointer;'
  +   'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;'
  +   'gap:3px;padding:8px 2px 7px;color:#8A919E;font-size:10.5px;font-weight:600;'
  +   'line-height:1;-webkit-tap-highlight-color:transparent;'
  +   'transition:color .15s,transform .12s;user-select:none;-webkit-user-select:none}'
  + '#knTabbar .knTab:active{transform:scale(.9)}'
  + '#knTabbar .knTab svg{display:block}'
  + '#knTabbar .knTab.active{color:#128A3E}'
  + '#knTabbar .knTab.center{justify-content:flex-end}'
  + '#knTabbar .knTab.center .knBadge{position:absolute;top:-20px;left:50%;transform:translateX(-50%);'
  +   'width:52px;height:52px;border-radius:50%;background:#fff;color:#39414E;'
  +   'display:flex;align-items:center;justify-content:center;'
  +   'box-shadow:0 4px 12px rgba(34,38,52,.16);border:2px solid #39414E;'
  +   'transition:background .15s,border-color .15s,color .15s}'
  + '#knTabbar .knTab.center .knLbl{margin-top:34px}'
  + '#knTabbar .knTab.center.active .knBadge{background:#18A34B;border-color:#fff;color:#fff;box-shadow:0 6px 16px rgba(24,163,75,.4)}'
  + '#knTabbar .knTab.center.active{color:#128A3E}'
  /* ===== kéo xuống để tải lại ===== */
  + '#knPtr{position:fixed;left:0;right:0;top:0;height:0;overflow:hidden;z-index:8000;'
  +   'display:flex;align-items:flex-end;justify-content:center;padding-bottom:7px;'
  +   'color:#18A34B;pointer-events:none}'
  + '#knPtr svg{width:21px;height:21px;transition:transform .15s}'
  + '#knPtr.ready svg{transform:rotate(180deg)}'
  + '#knPtr.load svg{animation:knspin .9s linear infinite}'
  + '@keyframes knspin{to{transform:rotate(360deg)}}';
  document.head.appendChild(css);

  /* ---------- 5. Điều hướng ---------- */
  var scrollMem = {};
  var lastPrimary = 'market';

  function curView(){
    var found = null;
    ['watch','detail','market','screener','leader','compare','news','fund'].forEach(function(v){
      var el = document.getElementById('view-'+v);
      if (el && el.style.display !== 'none' && el.offsetParent !== null) found = v;
    });
    return found;
  }
  function rememberScroll(){
    var v = curView();
    if (v) scrollMem[v] = window.pageYOffset || 0;
  }
  function setActive(view){
    var bar = document.getElementById('knTabbar'); if(!bar) return;
    Array.prototype.forEach.call(bar.children, function(b){
      b.classList.toggle('active', b.dataset.view === view);
    });
    /* trang phụ: đổi header sang chế độ back + tiêu đề */
    var sec = !PRIMARY[view];
    document.documentElement.classList.toggle('kn-sec', sec);
    var tEl = document.getElementById('knSecTitle');
    if (tEl && sec) tEl.textContent = SEC_TITLE[view] || '';
    if (PRIMARY[view]) lastPrimary = view;
  }
  function animateIn(view){
    var el = document.getElementById('view-'+view);
    if (!el) return;
    el.classList.remove('knAnim');
    void el.offsetWidth;                 // ép reflow để phát lại animation
    el.classList.add('knAnim');
  }
  function go(view){
    var same = curView() === view;
    if (!same) rememberScroll();
    try { if (typeof window.showView === 'function') window.showView(view); } catch(e){}
    setActive(view);
    if (same){
      /* bấm lại tab đang mở -> lên đầu trang (nếp iOS) */
      try { window.scrollTo({top:0, behavior:'smooth'}); } catch(e){ window.scrollTo(0,0); }
    } else {
      var y = scrollMem[view] || 0;
      requestAnimationFrame(function(){ window.scrollTo(0, y); });
      animateIn(view);
    }
  }
  function goBack(){ go(lastPrimary || 'market'); }

  function build(){
    if (document.getElementById('knTabbar')) return;
    var bar = document.createElement('nav');
    bar.id = 'knTabbar';
    bar.setAttribute('aria-label','Điều hướng ứng dụng');
    TABS.forEach(function(t){
      var b = document.createElement('button');
      b.className = 'knTab' + (t.center ? ' center' : '');
      b.dataset.view = t.v;
      if (t.center){
        b.innerHTML = '<span class="knBadge">'+t.icon+'</span><span class="knLbl">'+t.label+'</span>';
      } else {
        b.innerHTML = t.icon + '<span class="knLbl">'+t.label+'</span>';
      }
      b.addEventListener('click', function(){ go(t.v); });
      bar.appendChild(b);
    });
    document.body.appendChild(bar);
  }

  /* Header: nút back + tiêu đề trang phụ + phễu bộ lọc + chuông thông báo */
  function buildHeader(){
    var tb = document.querySelector('.topbar-in');
    if (!tb || document.getElementById('knBack')) return;

    var back = document.createElement('button');
    back.id = 'knBack'; back.className = 'knIcoBtn';
    back.setAttribute('aria-label','Quay lại');
    back.innerHTML = IC.back;
    back.addEventListener('click', goBack);
    tb.insertBefore(back, tb.firstChild);

    var title = document.createElement('div');
    title.id = 'knSecTitle';
    tb.insertBefore(title, back.nextSibling);

    var filt = document.createElement('button');
    filt.id = 'knFilter'; filt.className = 'knIcoBtn';
    filt.setAttribute('aria-label','Bộ lọc cổ phiếu');
    filt.innerHTML = IC.filter;
    filt.addEventListener('click', function(){ go('screener'); });
    tb.appendChild(filt);

    var bell = document.createElement('button');
    bell.id = 'knBell'; bell.className = 'knIcoBtn';
    bell.setAttribute('aria-label','Bật thông báo');
    bell.innerHTML = IC.bell;
    bell.style.display = 'none';
    bell.addEventListener('click', function(){
      var b = document.getElementById('notifBtn');
      if (b) b.click();
    });
    tb.appendChild(bell);

    /* chuông chỉ hiện khi còn phải xin quyền (chip #notifBtn tồn tại) */
    setInterval(function(){
      var has = !!document.getElementById('notifBtn');
      bell.style.display = has ? 'flex' : 'none';
    }, 1500);
  }

  /* Gỡ tab Bài viết + So sánh khỏi luồng app: không có lối vào từ tab bar.
     Bài viết bỏ hẳn theo yêu cầu; So sánh chỉ còn đường link nhỏ trong Bộ lọc. */
  function addCompareLink(){
    var view = document.getElementById('view-screener');
    if (!view || document.getElementById('knCmpLink')) return;
    var card = view.querySelector('.card');
    if (!card) return;
    var a = document.createElement('button');
    a.id = 'knCmpLink';
    a.style.cssText = 'display:block;width:100%;margin:4px 0 10px;border:1px dashed var(--border);'
      + 'background:#fff;border-radius:11px;padding:10px 14px;font:600 13px Inter,sans-serif;'
      + 'color:#128A3E;cursor:pointer;text-align:center';
    a.textContent = 'So sánh nhiều mã với nhau →';
    a.addEventListener('click', function(){ go('compare'); });
    card.insertBefore(a, card.firstChild);
  }

  function hook(){
    if (typeof window.showView !== 'function'){ setTimeout(hook, 120); return; }
    if (window.__knHooked) return; window.__knHooked = true;
    var orig = window.showView;
    window.showView = function(v, skip){
      var r; try { r = orig.apply(this, arguments); } catch(e){}
      try { setActive(v); } catch(e){}
      return r;
    };
  }

  /* ---------- 6. Trang Bộ lọc: chip nhanh lên đầu, ô nhập gom lại ---------- */
  function reshapeScreener(){
    var view = document.getElementById('view-screener');
    if (!view) return;
    var filters = view.querySelector('.filters');
    if (!filters || filters.dataset.knDone === '1') return;
    var pills = view.querySelector('div[style*="flex-wrap:wrap"]');
    if (!pills || !pills.querySelector('.pill')) return;
    filters.dataset.knDone = '1';

    pills.id = 'knPresets';
    pills.removeAttribute('style');
    filters.parentNode.insertBefore(pills, filters);

    var btn = document.createElement('button');
    btn.type = 'button'; btn.id = 'knScrToggle';
    btn.innerHTML = '<span><span class="lbl">Bộ lọc nâng cao</span></span><span class="car">⌄</span>';
    filters.parentNode.insertBefore(btn, filters);
    filters.classList.add('knHidden');

    btn.addEventListener('click', function(){
      var open = filters.classList.toggle('knHidden') === false;
      document.documentElement.classList.toggle('knScrOpen', open);
    });

    function count(){
      var n = 0;
      filters.querySelectorAll('input,select').forEach(function(f){ if (f.value) n++; });
      var old = btn.querySelector('.cnt');
      if (old) old.remove();
      if (n){
        var s = document.createElement('span');
        s.className = 'cnt'; s.textContent = n;
        btn.querySelector('span').appendChild(s);
      }
    }
    filters.addEventListener('input', count);
    filters.addEventListener('change', count);
    var clear = filters.querySelector('#fClear');
    if (clear) clear.addEventListener('click', function(){ setTimeout(count, 0); });
    count();
    addCompareLink();
  }

  /* ---------- 7. Chữ HOA -> chữ thường; đánh dấu bảng cuộn ngang ---------- */
  function softenTitles(){
    document.querySelectorAll('.card h2').forEach(function(h){
      if (h.dataset.knCase === '1') return;
      var t = (h.firstChild && h.firstChild.nodeType === 3) ? h.firstChild.nodeValue : '';
      if (!t || !/[A-ZÀ-Ỹ]/.test(t)) return;
      var letters = t.replace(/[^A-Za-zÀ-ỹ]/g, '');
      if (!letters || letters !== letters.toUpperCase()) return;
      h.dataset.knCase = '1';
      h.firstChild.nodeValue = t.charAt(0) + t.slice(1).toLowerCase();
    });
  }
  function markScrollers(){
    document.querySelectorAll('.wrap div[style*="overflow"]').forEach(function(d){
      if (d.scrollWidth - d.clientWidth < 12) { d.classList.remove('knXs'); return; }
      d.classList.add('knXs');
      if (d.dataset.knXs === '1') return;
      d.dataset.knXs = '1';
      d.addEventListener('scroll', function(){
        d.classList.toggle('knXsEnd', d.scrollLeft + d.clientWidth >= d.scrollWidth - 4);
      }, {passive:true});
    });
  }

  /* ---------- 8. Kéo xuống để tải lại ---------- */
  function buildPtr(){
    if (document.getElementById('knPtr')) return;
    var ind = document.createElement('div');
    ind.id = 'knPtr';
    ind.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
                  + 'stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M6 13l6 6 6-6"/></svg>';
    document.body.appendChild(ind);

    var y0 = null, active = false, MAX = 80, TRIG = 62;
    function top(){ return window.pageYOffset || document.documentElement.scrollTop || 0; }
    addEventListener('touchstart', function(e){
      if (top() > 0 || e.touches.length !== 1){ y0 = null; return; }
      y0 = e.touches[0].clientY; active = false;
    }, {passive:true});
    addEventListener('touchmove', function(e){
      if (y0 === null) return;
      var dy = e.touches[0].clientY - y0;
      if (dy <= 0){ if (active){ ind.style.height = '0px'; active = false; } return; }
      if (top() > 0){ y0 = null; return; }
      active = true;
      var h = Math.min(MAX, dy * .55);
      ind.style.height = h + 'px';
      ind.classList.toggle('ready', dy >= TRIG);
    }, {passive:true});
    addEventListener('touchend', function(){
      if (!active){ y0 = null; return; }
      var fire = ind.classList.contains('ready');
      ind.classList.remove('ready');
      if (fire){
        ind.classList.add('load');
        ind.style.height = '36px';
        setTimeout(function(){ location.reload(); }, 260);
      } else {
        ind.style.height = '0px';
      }
      y0 = null; active = false;
    }, {passive:true});
  }

  /* ---------- 9. Khởi động ---------- */
  onReady(function(){
    build();
    buildHeader();
    hook();
    buildPtr();
    var cur = curView() || 'market';
    setActive(cur);
    reshapeScreener();
    softenTitles(); markScrollers();
    var t;
    new MutationObserver(function(){
      clearTimeout(t);
      t = setTimeout(function(){ reshapeScreener(); softenTitles(); markScrollers(); }, 60);
    }).observe(document.body, {childList:true, subtree:true});
    addEventListener('resize', markScrollers);
    addEventListener('scroll', function(){
      clearTimeout(rememberScroll._t);
      rememberScroll._t = setTimeout(rememberScroll, 120);
    }, {passive:true});
  });
})();
