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
  var VIEW2TAB = { watch:0, detail:1, market:2, screener:3, leader:3, compare:3, fund:3, news:4 };
  var SUBNAV = [['screener','Bộ lọc'],['leader','Leader Board'],['fund','Fund Insight'],['compare','So sánh'],['news','Bài viết']];

  /* ---------- 4. CSS ---------- */
  var css = document.createElement('style'); css.id = 'knAppCss';
  css.textContent =
    '.kn-app .topbar-in nav{display:none!important}'
  + '.kn-app #btnOpenKafi{display:none!important}'
  + '.kn-app .topbar-in{height:auto;padding:9px 13px;gap:11px}'
  + '.kn-app .searchbox{flex:1}'
  + '.kn-app #nameBar{position:static!important;box-shadow:none!important;border-top:1px solid #E8EAEF}'
  + '.kn-app .wrap{padding:8px 0 14px 0}'
  + '.kn-app .card{border-radius:0;border-left:0;border-right:0;box-shadow:none;margin:0 0 8px 0;padding:14px 13px}'
  + '.kn-app .card h2{font-size:16px}'
  + '.kn-app table{font-size:13px}'
  + '.kn-app th,.kn-app td{padding:10px 8px}'
  + '.kn-app #view-watch table th:first-child,.kn-app #view-watch table td:first-child,'
  + '.kn-app #view-screener table th:first-child,.kn-app #view-screener table td:first-child,'
  + '.kn-app #view-leader table th:first-child,.kn-app #view-leader table td:first-child,'
  + '.kn-app #view-fund table th:first-child,.kn-app #view-fund table td:first-child'
  + '{position:sticky;left:0;background:#fff;z-index:3;box-shadow:1px 0 0 #EDEFF2}'
  + '.kn-app #view-screener table,.kn-app #view-leader table{min-width:640px}'
  + '.kn-app .card>table,.kn-app #view-screener .card>table{display:block;overflow-x:auto}'
  + '#knSub{display:none;gap:6px;padding:8px 12px 2px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}'
  + '#knSub::-webkit-scrollbar{display:none}'
  + '#knSub.on{display:flex}'
  + '#knSub button{flex:0 0 auto;border:1px solid #E8EAEF;background:#fff;border-radius:999px;padding:6px 14px;font:700 12.5px Inter,system-ui,sans-serif;color:#7A828E;cursor:pointer;white-space:nowrap;-webkit-tap-highlight-color:transparent}'
  + '#knSub button.on{background:#128A3E;border-color:#128A3E;color:#fff}'
  + '.kn-app body,body.kn-app{padding-bottom:calc(76px + env(safe-area-inset-bottom,0px))!important}'
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
  +   'line-height:1;-webkit-tap-highlight-color:transparent;transition:color .15s}'
  + '#knTabbar .knTab svg{display:block}'
  + '#knTabbar .knTab.active{color:#128A3E}'
  + '#knTabbar .knTab.center{justify-content:flex-end}'
  + '#knTabbar .knTab.center .knBadge{position:absolute;top:-20px;left:50%;transform:translateX(-50%);'
  +   'width:52px;height:52px;border-radius:50%;background:#18A34B;color:#fff;'
  +   'display:flex;align-items:center;justify-content:center;'
  +   'box-shadow:0 5px 14px rgba(18,138,62,.30);border:3px solid #fff;transition:background .15s}'
  + '#knTabbar .knTab.center .knLbl{margin-top:34px}'
  + '#knTabbar .knTab.center.active .knBadge{background:#0E7A38;box-shadow:0 6px 18px rgba(14,122,56,.42)}'
  + '#knTabbar .knTab.center.active{color:#128A3E}';
  document.head.appendChild(css);

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
    if (!document.getElementById('knSub')){
      var sub = document.createElement('div'); sub.id = 'knSub';
      SUBNAV.forEach(function(s){
        var x = document.createElement('button');
        x.type = 'button'; x.dataset.view = s[0]; x.textContent = s[1];
        x.addEventListener('click', function(){ go(s[0]); });
        sub.appendChild(x);
      });
      var tb = document.querySelector('.topbar');
      if (tb && tb.parentElement) tb.parentElement.insertBefore(sub, tb.nextSibling);
      else document.body.insertBefore(sub, document.body.firstChild);
    }
  }

  function setActive(view){
    var idx = VIEW2TAB[view];
    var bar = document.getElementById('knTabbar'); if(!bar) return;
    Array.prototype.forEach.call(bar.children, function(b){
      b.classList.toggle('active', String(idx) === b.dataset.tab);
    });
    try {
      var sub = document.getElementById('knSub');
      if (sub){
        var inSub = SUBNAV.some(function(s){ return s[0] === view; });
        sub.classList.toggle('on', inSub);
        Array.prototype.forEach.call(sub.children, function(b){ b.classList.toggle('on', b.dataset.view === view); });
      }
    } catch(e){}
  }

  function go(view){
    var same = curView() === view;
    if (!same) rememberScroll();
    try { if (typeof window.showView === 'function') window.showView(view); } catch(e){}
    setActive(view);
    /* Bam lai dung tab dang mo -> len dau trang (giong app iOS).
       Doi sang tab khac -> tra ve dung cho dang xem do cua tab do. */
    try { window.scrollTo({top:0, behavior: same ? 'smooth' : 'auto'}); } catch(e){ window.scrollTo(0,0); }
    requestAnimationFrame(function(){ window.scrollTo(0,0); });
    setTimeout(function(){ window.scrollTo(0,0); }, 60);
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

  /* ---------- 5. CSS bo sung: sua nhung cho con "mui web" ---------- */
  var css2 = document.createElement('style'); css2.id = 'knAppCss2';
  css2.textContent =
    /* chua du cho nut tron o giua (no nho len 26px) -> khong che mat noi dung */
    'body.kn-app,.kn-app body{padding-bottom:calc(104px + env(safe-area-inset-bottom,0px))!important}'
  + '.kn-app footer{padding-bottom:6px}'
    /* thanh tren: bo chu thuong hieu dai, nhuong cho o tim kiem */
  + '.kn-app .logo{font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
  + '.kn-app .logo .logo-mark{flex:none;font-size:14px;width:29px;height:29px}'
  + '.kn-app .logo .sub{display:none}'
  + '.kn-app .searchbox{flex:1;min-width:118px;padding:7px 12px}'
  + '.kn-app .searchbox input{font-size:15px;min-width:0}'
  + '@media (max-width:379px){.kn-app .logo{font-size:0;gap:0}}'
    /* bo loc: bang ket qua bo cot Nganh (chu dai, day cac so ra ngoai man hinh) */
  + '.kn-app #scTable th:nth-child(2),.kn-app #scTable td:nth-child(2){display:none}'
    /* nut bat thong bao: thanh chip gon, khong chiem ca mot hang */
  + '.kn-app #notifBtn{font-size:12.5px;padding:6px 12px;border-radius:999px}'
    /* dai chon khoang thoi gian: cuon ngang, khong bao gio xuong dong */
  + '.kn-app .seg{display:flex;flex-wrap:nowrap;overflow-x:auto;max-width:100%;'
  +   '-ms-overflow-style:none;scrollbar-width:none}'
  + '.kn-app .seg::-webkit-scrollbar{display:none}'
  + '.kn-app .seg button{flex:none;white-space:nowrap;padding:7px 14px}'
    /* tieu de: chu thuong, can trai — kieu app, khong phai bao cao web */
  + '.kn-app .card h2{text-align:left!important;letter-spacing:0!important;'
  +   'text-transform:none!important;font-size:16px}'
    /* hang trong bang: co phan hoi khi cham */
  + '.kn-app table tr.row{-webkit-tap-highlight-color:transparent;transition:background .12s}'
  + '.kn-app table tr.row:active{background:#EEF6F0}'
    /* nut tab: nhun nhe khi cham */
  + '#knTabbar .knTab:active{transform:scale(.92)}'
  + '#knTabbar .knTab{transition:color .15s,transform .12s}'
    /* bo loc: khong long khung cuon trong khung cuon */
  + '.kn-app #view-screener .card > div[style*="max-height"]{max-height:none!important;'
  +   'overflow:visible!important;min-height:0!important}'
  + '.kn-app .filters{gap:10px 12px}'
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
    /* bang lai suat theo thang: khong bop 14 cot vao 1 man hinh -> cho cuon ngang */
  + '.kn-app #moTable table{width:auto!important;min-width:100%;table-layout:auto}'
  + '.kn-app #moTable th,.kn-app #moTable td{min-width:46px;white-space:nowrap;padding-left:3px;padding-right:3px}'
  + '.kn-app #moTable th:first-child,.kn-app #moTable td:first-child{position:sticky;left:0;z-index:2;'
  +   'background:#fff;min-width:52px;box-shadow:1px 0 0 #EDEFF2;text-align:left;padding-left:2px}'
    /* bang rong hon man hinh: co bong mo o mep de biet con cot ben phai */
  + '.kn-app .knXs{box-shadow:inset -20px 0 15px -15px rgba(16,24,40,.22)}'
  + '.kn-app .knXs.knXsEnd{box-shadow:none}'
    /* keo xuong de tai lai */
  + '#knPtr{position:fixed;left:0;right:0;top:0;height:0;overflow:hidden;z-index:8000;'
  +   'display:flex;align-items:flex-end;justify-content:center;padding-bottom:7px;'
  +   'color:#18A34B;pointer-events:none}'
  + '#knPtr svg{width:21px;height:21px;transition:transform .15s}'
  + '#knPtr.ready svg{transform:rotate(180deg)}'
  + '#knPtr.load svg{animation:knspin .9s linear infinite}'
  + '@keyframes knspin{to{transform:rotate(360deg)}}';
  document.head.appendChild(css2);

  /* ---------- 6. Bo loc: chip nhanh len tren, o nhap gom vao mot muc ---------- */
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
    filters.parentNode.insertBefore(pills, filters);      // chip nhanh len dau

    var btn = document.createElement('button');
    btn.type = 'button'; btn.id = 'knScrToggle';
    btn.innerHTML = '<span><span class="lbl">Bộ lọc nâng cao</span></span><span class="car">⌄</span>';
    filters.parentNode.insertBefore(btn, filters);
    filters.classList.add('knHidden');

    btn.addEventListener('click', function(){
      var open = filters.classList.toggle('knHidden') === false;
      document.documentElement.classList.toggle('knScrOpen', open);
    });

    /* dem so dieu kien dang bat de biet co dang loc hay khong */
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
  }

  /* ---------- 6b. Chu HOA to -> chu thuong cho de doc kieu app ---------- */
  function softenTitles(){
    document.querySelectorAll('.kn-app .card h2, .card h2').forEach(function(h){
      if (h.dataset.knCase === '1') return;
      var t = (h.firstChild && h.firstChild.nodeType === 3) ? h.firstChild.nodeValue : '';
      if (!t || !/[A-ZÀ-Ỹ]/.test(t)) return;
      var letters = t.replace(/[^A-Za-zÀ-ỹ]/g, '');
      if (!letters || letters !== letters.toUpperCase()) return;   // chi doi khi VIET HOA HET
      h.dataset.knCase = '1';
      h.firstChild.nodeValue = t.charAt(0) + t.slice(1).toLowerCase();
    });
  }

  /* ---------- 6c. Bang cuon ngang: bao hieu con cot ben phai ---------- */
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

  /* ---------- 7. Keo xuong de tai lai du lieu ---------- */
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

  /* ---------- 8. Nho vi tri dang xem cua tung tab ---------- */
  var scrollMem = {};
  function rememberScroll(){
    var v = curView();
    if (v) scrollMem[v] = window.pageYOffset || 0;
  }
  function curView(){
    var found = null;
    ['watch','detail','market','screener','leader','compare','news'].forEach(function(v){
      var el = document.getElementById('view-'+v);
      if (el && el.style.display !== 'none' && el.offsetParent !== null) found = v;
    });
    return found;
  }

  onReady(function(){
    build();
    hook();
    buildPtr();
    var cur = curView() || 'market';
    setActive(cur);
    reshapeScreener();
    /* view-screener duoc dung lai luc bam tab -> theo doi de chinh lai mot lan */
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
