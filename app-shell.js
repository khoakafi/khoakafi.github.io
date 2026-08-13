/* ============================================================
   KN App Shell — vo app + thanh tab day (Muc 2)
   - Chi bat o che do APP (PWA da cai / mo bang ?app=1 / dien thoai cham).
   - Desktop web GIU NGUYEN, khong dong toi.
   - Phu len he thong view co san (showView) — khong sua logic cu.
   ============================================================ */
(function(){
  'use strict';

  /* ---------- 1. Nhan dien che do APP ---------- */
  var force = /[?&](app=1|src=pwa)/.test(location.search);
  var standalone = false;
  try {
    standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches)
              || window.navigator.standalone === true;
  } catch(e){}
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var narrow  = window.innerWidth <= 900;
  var APP = force || standalone || (isTouch && narrow);
  if (!APP) return;                       // <-- may tinh: khong doi gi ca

  document.documentElement.classList.add('kn-app');
  function onReady(fn){ if(document.body) fn(); else addEventListener('DOMContentLoaded', fn); }

  /* ---------- 2. Icon SVG (stroke = mau hien tai) ---------- */
  function svg(inner){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
         + 'stroke-linecap="round" stroke-linejoin="round" width="23" height="23">'+inner+'</svg>';
  }
  var IC = {
    watch:  svg('<path d="M12 3.2l2.6 5.3 5.9.5-4.5 3.9 1.4 5.7L12 15.9 6.6 18.6 8 12.9 3.5 9l5.9-.5z"/>'),
    detail: svg('<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="10" width="3" height="6" rx=".6"/><path d="M8.5 8v2M8.5 16v2"/><rect x="14" y="6" width="3" height="7" rx=".6"/><path d="M15.5 4v2M15.5 13v2"/>'),
    market: svg('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
    screener: svg('<path d="M4 5h16l-6.2 7.2V19l-3.6 1.8v-8.6z"/>'),
    news:   svg('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M7.5 9h6M7.5 12.5h9M7.5 16h9"/>')
  };

  /* ---------- 3. Khai bao 5 tab (Hieu suat o giua, noi bat) ---------- */
  var TABS = [
    { v:'watch',    label:'Watchlist', icon:IC.watch  },
    { v:'detail',   label:'Chi tiết',  icon:IC.detail },
    { v:'market',   label:'Hiệu suất', icon:IC.market, center:true },
    { v:'screener', label:'Bộ lọc',    icon:IC.screener },
    { v:'news',     label:'Bài viết',  icon:IC.news   }
  ];
  // nhieu view co the thuoc cung 1 tab (Bo loc gom screener + leader + so sanh)
  var VIEW2TAB = { watch:0, detail:1, market:2, screener:3, leader:3, compare:3, news:4 };

  /* ---------- 4. CSS ---------- */
  var css = document.createElement('style'); css.id = 'knAppCss';
  css.textContent =
    // an thanh nav chu tren cung + CTA -> thay bang tab day
    '.kn-app .topbar-in nav{display:none!important}'
  + '.kn-app #btnOpenKafi{display:none!important}'
  + '.kn-app .topbar-in{height:auto;padding:9px 13px;gap:11px}'
  + '.kn-app .searchbox{flex:1}'
  // footer ghim (#nameBar) -> tro ve luong thuong de khong dam vao tab day
  + '.kn-app #nameBar{position:static!important;box-shadow:none!important;border-top:1px solid #E8EAEF}'
  // chua bi tab day che
  + '.kn-app .wrap{padding-bottom:14px}'
  + '.kn-app body,body.kn-app{padding-bottom:calc(76px + env(safe-area-inset-bottom,0px))!important}'
  // thanh tab day
  + '#knTabbar{position:fixed;left:0;right:0;bottom:0;z-index:9000;'
  +   'background:transparent;pointer-events:none;'
  +   'display:grid;grid-template-columns:repeat(5,1fr);'
  +   'padding-top:26px;'
  +   'padding-bottom:calc(8px + env(safe-area-inset-bottom,0px));'
  +   'font-family:Inter,system-ui,-apple-system,sans-serif}'
  // dai trang chi phu phan duoi -> vong tron o giua nam gon trong khung, khong bi cat
  + '#knTabbar::before{content:"";position:absolute;left:0;right:0;top:26px;bottom:0;'
  +   'background:#fff;border-top:1px solid #E8EAEF;box-shadow:0 -6px 20px rgba(20,26,40,.06)}'
  + '#knTabbar .knTab{position:relative;pointer-events:auto;background:none;border:0;cursor:pointer;'
  +   'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;'
  +   'gap:3px;padding:8px 2px 7px;color:#8A919E;font-size:10.5px;font-weight:600;'
  +   'line-height:1;-webkit-tap-highlight-color:transparent;transition:color .15s}'
  + '#knTabbar .knTab svg{display:block}'
  + '#knTabbar .knTab.active{color:#128A3E}'
  // tab giua noi bat: vong tron xanh navi len
  + '#knTabbar .knTab.center{justify-content:flex-end}'
  + '#knTabbar .knTab.center .knBadge{position:absolute;top:-20px;left:50%;transform:translateX(-50%);'
  +   'width:52px;height:52px;border-radius:50%;background:#222634;color:#fff;'
  +   'display:flex;align-items:center;justify-content:center;'
  +   'box-shadow:0 6px 16px rgba(34,38,52,.34);border:3px solid #fff;transition:background .15s}'
  + '#knTabbar .knTab.center .knLbl{margin-top:34px}'
  + '#knTabbar .knTab.center.active .knBadge{background:#18A34B}'
  + '#knTabbar .knTab.center.active{color:#128A3E}';
  document.head.appendChild(css);

  /* ---------- 5. Dung thanh tab ---------- */
  function build(){
    if (document.getElementById('knTabbar')) return;
    var bar = document.createElement('nav');
    bar.id = 'knTabbar';
    bar.setAttribute('aria-label','Điều hướng ứng dụng');
    TABS.forEach(function(t, i){
      var b = document.createElement('button');
      b.className = 'knTab' + (t.center ? ' center' : '');
      b.dataset.tab = i;
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

  function setActive(view){
    var idx = VIEW2TAB[view];
    var bar = document.getElementById('knTabbar'); if(!bar) return;
    Array.prototype.forEach.call(bar.children, function(b){
      b.classList.toggle('active', String(idx) === b.dataset.tab);
    });
  }

  function go(view){
    try {
      if (typeof window.showView === 'function') window.showView(view);
    } catch(e){}
    setActive(view);
    try { window.scrollTo({top:0, behavior:'smooth'}); } catch(e){ window.scrollTo(0,0); }
  }

  /* ---------- 6. Dong bo tab active khi dieu huong tu noi khac ----------
     (bam vao ma o leaderboard / o tim kiem -> showView('detail')...)      */
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

  /* ---------- 7. Khoi tao ---------- */
  onReady(function(){
    build();
    hook();
    // xac dinh view dang hien de to sang tab dung ngay tu dau
    var cur = 'market';
    ['watch','detail','market','screener','leader','compare','news'].forEach(function(v){
      var el = document.getElementById('view-'+v);
      if (el && el.style.display !== 'none' && el.offsetParent !== null) cur = v;
    });
    setActive(cur);
  });
})();
