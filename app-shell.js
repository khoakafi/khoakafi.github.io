/* ============================================================
   KN App Shell v3 — vỏ app thuần cho điện thoại
   Nếp thiết kế: FinBox (header, chart, bảng lệnh) + My VIB (tab bar,
   thẻ trên nền xám) + Apple Stocks (dòng watchlist có sparkline + viên %).

   4 tab Hiệu suất · Watchlist · So sánh · Leader được DỰNG RIÊNG cho
   điện thoại từ dữ liệu trong bộ nhớ (window.KN của dashboard_app.js),
   không phải bảng web ép nhỏ. Tab Chi tiết dùng lại khối chart TradingView
   của bản web (đã là 2 khung giá/khối lượng) và chỉ sắp lại đầu trang.

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
  window.__knLite = 1;     /* báo cho dashboard_app.js: tab web nằm ẩn, bỏ phần dựng nặng */
  function onReady(fn){ if(document.body) fn(); else addEventListener('DOMContentLoaded', fn); }

  try {
    var vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.setAttribute('content',
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  } catch(e){}
  try {
    if (window.Chart && Chart.defaults){
      Chart.defaults.animation = {duration: 0};   // chart web nằm ẩn trong app, không cần hiệu ứng
      Chart.defaults.devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
    }
  } catch(e){}
  /* Font Be Vietnam Pro: dấu tiếng Việt đẹp hơn Inter; SW cache lại sau lần đầu */
  try {
    var fl = document.createElement('link'); fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fl);
  } catch(e){}

  /* ---------- 2. Tiện ích ---------- */
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var vn = function(v, d){ if (v == null || isNaN(v)) return '—'; d = d == null ? 2 : d; return Number(v).toLocaleString('vi-VN', {minimumFractionDigits:d, maximumFractionDigits:d}); };
  var pct = function(v, d){ if (v == null || isNaN(v)) return '—'; return (v > 0 ? '+' : '') + vn(v, d == null ? 1 : d) + '%'; };
  var cls = function(v){ return v > 0 ? 'up' : v < 0 ? 'down' : 'flat'; };
  var klFmt = function(v){ if (v == null || isNaN(v)) return '—'; return v >= 1e6 ? vn(v/1e6, 2) + 'tr' : v >= 1e3 ? vn(v/1e3, 0) + 'k' : String(Math.round(v)); };
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  var FONT = "'Be Vietnam Pro',Inter,system-ui,-apple-system,sans-serif";
  var raf2 = function(fn){ requestAnimationFrame(function(){ requestAnimationFrame(fn); }); };
  var KN = function(){ return window.KN; };

  /* ---------- 3. Icon ---------- */
  function svg(inner, w){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||1.8)+'" '
         + 'stroke-linecap="round" stroke-linejoin="round" width="23" height="23">'+inner+'</svg>';
  }
  function svgf(inner){
    return '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="24" height="24">'+inner+'</svg>';
  }
  var IC = {
    market: svg('<path d="M3.6 16.4l5.2-5.2 3.4 3.4 8.2-8.2"/><path d="M15.3 6.4h5.1v5.1"/>'),
    watch:  svg('<path d="M12 3.4l2.65 5.37 5.93.86-4.29 4.18 1.01 5.9L12 16.9l-5.3 2.79 1.01-5.9-4.29-4.18 5.93-.86z"/>'),
    detail: svg('<path d="M3.6 20.4h16.8"/><rect x="6" y="9.5" width="4" height="7.2" rx="1.2"/>'
              + '<path d="M8 6.7v2.8M8 16.7v1.9"/><rect x="14" y="5.5" width="4" height="8.3" rx="1.2"/>'
              + '<path d="M16 3.6v1.9M16 13.8v2.5"/>'),
    compare: svg('<path d="M4 8h16M4 16h16"/><circle cx="9" cy="8" r="2.4" fill="#fff"/><circle cx="15" cy="16" r="2.4" fill="#fff"/>'),
    leader: svg('<rect x="9.4" y="7.6" width="5.2" height="12.4" rx="1.4"/>'
              + '<rect x="3" y="12.2" width="5.2" height="7.8" rx="1.4"/>'
              + '<rect x="15.8" y="10" width="5.2" height="10" rx="1.4"/>'),
    back:   svg('<path d="M15 5l-7 7 7 7"/>', 2.2),
    filter: svg('<path d="M4 5h16l-6.2 7.2V19l-3.6 1.8v-8.6z"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 2),
    bell:   svg('<path d="M18 9a6 6 0 1 0-12 0c0 6-2.2 7-2.2 7h16.4S18 15 18 9z"/><path d="M10.2 20a2 2 0 0 0 3.6 0"/>'),
    chev:   '<svg class="knChev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>'
  };
  var ICF = {
    market: svgf('<path d="M3.6 20.4h16.8V5.4l-8.2 8.2-3.4-3.4-5.2 5.2z"/>'),
    watch:  svgf('<path d="M12 2.9l2.78 5.63 6.22.9-4.5 4.39 1.06 6.19L12 17.09l-5.56 2.92 1.06-6.19-4.5-4.39 6.22-.9z"/>'),
    detail: svgf('<rect x="3.6" y="19.5" width="16.8" height="1.8" rx=".9"/>'
               + '<rect x="6" y="9.5" width="4" height="7.2" rx="1.2"/><rect x="7.3" y="6.7" width="1.4" height="11.9" rx=".7"/>'
               + '<rect x="14" y="5.5" width="4" height="8.3" rx="1.2"/><rect x="15.3" y="3.6" width="1.4" height="12.7" rx=".7"/>'),
    compare: svgf('<rect x="3" y="6.9" width="18" height="2.2" rx="1.1"/><rect x="3" y="14.9" width="18" height="2.2" rx="1.1"/><circle cx="9" cy="8" r="3.2"/><circle cx="15" cy="16" r="3.2"/>'),
    leader: svgf('<rect x="9.4" y="7.6" width="5.2" height="12.4" rx="1.4"/>'
               + '<rect x="3" y="12.2" width="5.2" height="7.8" rx="1.4"/>'
               + '<rect x="15.8" y="10" width="5.2" height="10" rx="1.4"/>')
  };

  /* ---------- 4. Tab ----------
     Thứ tự theo yêu cầu: Hiệu suất mở đầu, rồi Watchlist, Chi tiết, So sánh, Leader.
     4 tab đầu/cuối là pane dựng riêng (NATIVE); Chi tiết + Bộ lọc là view của web. */
  var TABS = [
    { v:'market',  label:'Hiệu suất', icon:IC.market,  ico2:ICF.market  },
    { v:'watch',   label:'Watchlist', icon:IC.watch,   ico2:ICF.watch   },
    { v:'detail',  label:'Chi tiết',  icon:IC.detail,  ico2:ICF.detail  },
    { v:'compare', label:'So sánh',   icon:IC.compare, ico2:ICF.compare },
    { v:'leader',  label:'Leader',    icon:IC.leader,  ico2:ICF.leader  }
  ];
  var NATIVE = {market:1, watch:1, compare:1, leader:1};
  var PRIMARY = {market:1, watch:1, detail:1, compare:1, leader:1};
  var SEC_TITLE = {screener:'Bộ lọc cổ phiếu', news:'Bài viết', fund:'Fund Insight'};

  /* ---------- 5. CSS ---------- */
  var css = document.createElement('style'); css.id = 'knAppCss';
  css.textContent =
    ':root{--kc:#EEF1EF;--kcard:#fff;--khair:#E4EAE6;--ksunk:#F2F5F3;--ksunk2:#E9EEEB;--kink:#0F1B15;--kink2:#5A6963;--kink3:#8E9B95;'
  +   '--kb:#128A3E;--kbd:#0B6B30;--kbs:#E4F4EA;--kup:#12A150;--kdn:#E5484D;--kfl:#B45309;--kfls:#FCF2E3;'
  +   '--ksh:0 1px 2px rgba(15,27,21,.05),0 5px 14px rgba(15,27,21,.045)}'
  + 'html.kn-app{-webkit-text-size-adjust:100%}'
  + '.kn-app body{overscroll-behavior-y:contain;touch-action:manipulation;-webkit-tap-highlight-color:transparent;'
  +   'background:var(--kc)!important;font-family:'+FONT+';font-variant-numeric:tabular-nums;'
  +   'padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))!important}'
  + '.kn-app .wrap{padding:0 0 12px 0}'
  + '.kn-app .wrap>div:first-child{display:none}'      /* dòng "Giá cập nhật lúc…" của web */
  /* view web không dùng trong app -> ẩn; #view-detail và #view-screener vẫn do web bật/tắt */
  + '.kn-app #view-market,.kn-app #view-watch,.kn-app #view-compare,.kn-app #view-leader,.kn-app #view-fund,.kn-app #view-news,.kn-app #view-hh{display:none!important}'
  + '.kn-app footer{display:none}'
  /* ===== header: logo + tên (FinBox), tìm kiếm dạng icon, chuông ===== */
  + '.kn-app .topbar{padding-top:env(safe-area-inset-top,0px);border-bottom:0;background:#fff;box-shadow:0 .5px 0 var(--khair)}'
  + '.kn-app .topbar-in nav{display:none!important}'
  + '.kn-app #btnOpenKafi,.kn-app #btnRefresh{display:none!important}'
  + '.kn-app .topbar-in{height:54px;padding:0 8px 0 14px;gap:4px;flex-wrap:nowrap}'
  + '.kn-app .logo{order:0;flex:1;min-width:0;font-size:15.5px;font-weight:800;letter-spacing:-.02em;color:var(--kbd);gap:9px}'
  + '.kn-app .logo .logo-mark{flex:none;width:32px;height:32px;border-radius:9px;font-size:0;box-shadow:none;'
  +   'background:#fff url(logo.png) center/cover no-repeat}'
  + '.kn-app .logo .sub{display:none}'
  + '.kn-app .searchbox{display:none;order:1;flex:1;min-width:0;padding:7px 12px;border:0;background:var(--ksunk2);border-radius:11px;margin:0 2px}'
  + '.kn-app .searchbox input{font-size:15px;min-width:0}'
  + '.kn-app.kn-search .searchbox{display:flex}'
  + '.kn-app.kn-search .logo,.kn-app.kn-search #knSearch,.kn-app.kn-search #knBell,.kn-app.kn-search #knFilter{display:none!important}'
  + '.kn-app #knSearchX{display:none;order:2;flex:none;font:600 14px '+FONT+';color:var(--kbd);padding:8px 6px;background:none;border:0}'
  + '.kn-app.kn-search #knSearchX{display:block}'
  + '.kn-app #navSugg{top:44px;left:0;right:0;min-width:0;border-radius:12px}'
  + '.kn-app .knIcoBtn{flex:none;width:38px;height:38px;border-radius:50%;border:0;background:transparent;display:flex;align-items:center;'
  +   'justify-content:center;color:var(--kink);cursor:pointer;padding:0;position:relative;transition:transform .12s,background .12s}'
  + '.kn-app .knIcoBtn:active{transform:scale(.88);background:rgba(16,24,40,.06)}'
  + '.kn-app .knIcoBtn svg{width:22px;height:22px}'
  + '.kn-app #knBell.on::after{content:"";position:absolute;top:8px;right:9px;width:8px;height:8px;border-radius:50%;background:var(--kup);box-shadow:0 0 0 2px #fff}'
  + '.kn-app #knSearch{order:3}.kn-app #knFilter{order:4}.kn-app #knBell{order:5}'
  + '.kn-app #knBack{order:-2;display:none}.kn-app.kn-sec #knBack{display:flex}'
  + '.kn-app #knSecTitle{order:-1;display:none;flex:1;font-size:16.5px;font-weight:800;color:var(--kink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  + '.kn-app.kn-sec #knSecTitle{display:block}'
  + '.kn-app.kn-sec .logo,.kn-app.kn-sec .searchbox,.kn-app.kn-sec #knSearch,.kn-app.kn-sec #knBell,.kn-app.kn-sec #knFilter{display:none!important}'
  /* ===== pane dựng riêng ===== */
  + '#knApp{color:var(--kink);font-family:'+FONT+';line-height:1.35;font-size:14px}'
  + '#knApp *{box-sizing:border-box}'
  + ':where(#knApp) button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}'   /* :where = độ ưu tiên 0, không đè lên .knChip/.knDeal */
  + '.knPane{display:none}.knPane.on{display:block}'
  + '@keyframes knViewIn{from{opacity:.72;transform:translateY(4px)}to{opacity:1;transform:none}}'
  + '@media (prefers-reduced-motion:reduce){.knAnim{animation:none!important}}'
  + '.up{color:var(--kup)}.down{color:var(--kdn)}.flat{color:var(--kfl)}'
  + ':where(#knApp) .up,:where(#knApp) .down{font-weight:inherit}'
  /* thẻ + nhãn nhóm */
  + '.knCard{background:var(--kcard);border-radius:15px;margin:0 14px 12px;box-shadow:var(--ksh);overflow:hidden}'
  + '.knCap{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:2px 16px 8px;margin-top:4px}'
  + '.knCap b{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--kink3);flex:none}'
  + '.knCap span{font-size:11.5px;font-weight:500;color:var(--kink3);text-align:right;min-width:0}'
  + '.knNote{margin:2px 16px 8px;font-size:11.5px;font-weight:500;color:var(--kink3);line-height:1.5;font-style:italic}'
  + '.knKpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:12px 14px;background:var(--kcard);border-radius:15px;box-shadow:var(--ksh);overflow:hidden}'
  + '.knKpi{padding:12px 11px 11px;position:relative;min-width:0}'
  + '.knKpi+.knKpi::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:1px;background:var(--khair)}'
  + '.knKpi .l{font-size:10.5px;font-weight:600;color:var(--kink3);letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  + '.knKpi .v{font-size:19px;font-weight:800;letter-spacing:-.02em;margin-top:2px;line-height:1.1;white-space:nowrap}'
  + '.knKpi .v small{font-size:12px;font-weight:700;color:var(--kink3)}'
  + '.knKpi .s{font-size:11px;font-weight:500;color:var(--kink2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  /* điều khiển */
  + '.knSegW{padding:10px 14px 4px}'
  + '.knSeg{display:flex;background:var(--ksunk2);border-radius:11px;padding:3px;gap:2px}'
  + '.knSeg button{flex:1;border:0;background:none;font:inherit;padding:7px 4px;border-radius:9px;font-size:12.5px;font-weight:600;color:var(--kink2);white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .14s,color .14s}'
  + '.knSeg button.on{background:#fff;color:var(--kink);font-weight:700;box-shadow:0 1px 3px rgba(15,27,21,.14)}'
  + '.knChips{display:flex;gap:8px;overflow-x:auto;padding:10px 14px 6px;scrollbar-width:none;-ms-overflow-style:none}'
  + '.knChips::-webkit-scrollbar{display:none}'
  + '.knChip{flex:none;border-radius:999px;padding:7px 13px;background:#fff;box-shadow:inset 0 0 0 1px var(--khair);color:var(--kink2);font-size:12.5px;font-weight:600;white-space:nowrap;transition:background .14s,color .14s}'
  + '.knChip.on{background:var(--kink);color:#fff;box-shadow:none}'
  + '.knPill{display:inline-block;min-width:66px;text-align:center;padding:4px 7px;border-radius:7px;font-size:12.5px;font-weight:700;color:#fff!important;background:var(--kfl)}'
  + '.knPill.up{background:var(--kup)}.knPill.down{background:var(--kdn)}'
  + '.knChev{width:16px;height:16px;flex:none;fill:none;stroke:var(--kink3);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .18s}'
  + '.knSkel{background:linear-gradient(90deg,var(--ksunk2) 25%,#F7F9F8 50%,var(--ksunk2) 75%);background-size:200% 100%;animation:knSk 1.2s linear infinite;border-radius:8px}'
  + '@keyframes knSk{to{background-position:-200% 0}}'
  /* ===== Hiệu suất ===== */
  + '.knLegend{display:flex;justify-content:center;gap:22px;padding:14px 16px 0}'
  + '.knLegend span{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:var(--kink2)}'
  + '.knLegend i{width:12px;height:12px;border-radius:50%;flex:none}'
  + '.knPerf{position:relative;padding:6px 0 4px}'
  + '.knPerf svg{display:block;width:100%;height:auto;touch-action:pan-y}'
  + '.knTip{position:absolute;top:8px;left:16px;font-size:11px;font-weight:600;color:var(--kink2);background:#fff;padding:4px 8px;border-radius:7px;box-shadow:0 1px 4px rgba(15,27,21,.16);pointer-events:none;display:none;white-space:nowrap;z-index:2}'
  + '.knTip b{color:var(--kink)}'
  + '.knDealHd,.knDeal{display:grid;grid-template-columns:1.2fr 1fr 1.1fr auto;gap:6px;padding:9px 14px 7px;align-items:center}'
  + '.knDealHd{font-size:10.5px;font-weight:600;color:var(--kink3);border-bottom:1px solid var(--khair)}'
  + '.knDealHd span:not(:first-child){text-align:right}.knDealHd span:last-child{min-width:66px}'
  + '.knDeal{padding:10px 14px;border-top:1px solid var(--khair);width:100%;text-align:left}'
  + '.knDeal:first-of-type{border-top:0}.knDeal:active{background:var(--ksunk)}'
  + '.knDeal>div:not(:first-child){text-align:right}'
  + '.knDeal .t{font-size:14.5px;font-weight:700}.knDeal .s{font-size:11px;font-weight:500;color:var(--kink2);margin-top:1px}.knDeal .n{font-size:13px;font-weight:600}'
  + '.knYear{padding:10px 14px 4px;font-size:10.5px;font-weight:700;letter-spacing:.06em;color:var(--kink3);border-top:1px solid var(--khair)}'
  /* ===== Watchlist ===== */
  + '.knColHd{display:flex;justify-content:space-between;align-items:center;padding:8px 16px 7px;font-size:10.5px;font-weight:600;color:var(--kink3);letter-spacing:.02em;border-bottom:1px solid var(--khair)}'
  + '.knColHd .knSort{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;background:var(--ksunk);color:var(--kink2);font-size:10.5px;font-weight:700}'
  + '.knRow{display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px 10px 16px;text-align:left;border-top:1px solid var(--khair);transition:background .12s}'
  + '.knRow:first-of-type{border-top:0}.knRow:active{background:var(--ksunk)}'
  + '.knRowL{flex:1;min-width:0}'
  + '.knTick{font-size:15px;font-weight:700;letter-spacing:-.01em;display:flex;align-items:center;gap:5px}'
  + '.knStar{color:var(--kfl);font-size:12px;line-height:1}.knBuy{display:inline-block;margin-left:5px;font-size:9.5px;font-weight:800;padding:0 5px;border-radius:4px;background:#E9F7EF;color:#127A3B;vertical-align:1px;white-space:nowrap}.knMong{display:inline-block;margin-left:5px;font-size:9.5px;font-weight:700;padding:0 5px;border-radius:4px;background:#FFF4E5;color:#B45309;vertical-align:1px}'
  + '.knHot{display:inline-block;font-size:10px;font-weight:700;padding:1px 5px;border-radius:5px;background:var(--kbs);color:var(--kbd);vertical-align:1px;margin-left:4px}'
  + '.knSub{font-size:11.5px;font-weight:500;color:var(--kink2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  + '.knSpark{flex:none;width:64px;height:26px}.knSpark svg{display:block;width:64px;height:26px;overflow:visible}'
  + '.knSpark .knSkel{width:64px;height:26px;border-radius:6px}'
  + '.knRowR{flex:none;text-align:right;width:76px}'
  + '.knPx{font-size:15px;font-weight:700;letter-spacing:-.01em;margin-bottom:3px}'
  + '.knRow.dim .knTick,.knRow.dim .knPx{color:var(--kink2)}'
  /* ===== So sánh ===== */
  + '.knScat{display:block;width:100%;height:auto}'
  + '.knVr{display:flex;align-items:center;gap:10px;padding:9px 14px 9px 16px;border-top:1px solid var(--khair);width:100%;text-align:left}'
  + '.knVr:first-of-type{border-top:0}.knVr:active,.knVr.hl{background:var(--ksunk)}'
  + '.knVrL{flex:none;width:62px}.knVrL b{font-size:14.5px;font-weight:700;display:block}'
  + '.knVrL span{font-size:10.5px;font-weight:600;color:var(--kink2);display:block;margin-top:1px;white-space:nowrap}'
  + '.knVrT{flex:1;position:relative;height:34px}'
  + '.knVrT .tr{position:absolute;left:0;right:0;top:9px;height:8px;border-radius:4px;background:linear-gradient(90deg,var(--kb) 0%,var(--kbs) 45%,var(--kfls) 60%,var(--kdn) 100%);opacity:.55}'
  + '.knVrT .mid{position:absolute;left:50%;top:6px;width:1px;height:14px;background:var(--kink3);opacity:.5}'
  + '.knVrT .cu{position:absolute;top:5px;width:16px;height:16px;border-radius:50%;background:var(--kink);box-shadow:0 0 0 2.5px #fff,0 1px 3px rgba(0,0,0,.25);transform:translateX(-8px)}'
  + '.knVrT .lab{position:absolute;top:22px;font-size:9.5px;font-weight:600;color:var(--kink3)}.knVrT .lab.hi{right:0}'
  + '.knVrR{flex:none;width:62px;text-align:right}.knVrR b{font-size:14.5px;font-weight:800;display:block;letter-spacing:-.01em}'
  + '.knVrR span{font-size:10.5px;font-weight:700;display:block;margin-top:1px;white-space:nowrap}'
  /* ===== Leader ===== */
  + '.knFocus{padding:14px 16px 12px;margin-top:12px}'
  + '.knFxL{font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--kink3)}'
  + '.knFxTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}'
  + '.knFxT{font-size:22px;font-weight:800;letter-spacing:-.025em;line-height:1.1;margin-top:3px}'
  + '.knFxS{font-size:12px;font-weight:500;color:var(--kink2);margin-top:4px;line-height:1.45}'
  + '.knFxN{flex:none;text-align:right}.knFxN b{display:block;font-size:26px;font-weight:800;letter-spacing:-.03em;line-height:1}'
  + '.knFxN b small{font-size:13px;font-weight:700;color:var(--kink3)}.knFxN span{font-size:10.5px;font-weight:600;color:var(--kink3);white-space:nowrap}'
  + '.knDist{display:flex;height:10px;border-radius:5px;overflow:hidden;margin-top:12px;gap:1.5px;background:var(--ksunk2)}.knDist i{display:block;height:100%}'
  + '.knFxLg{display:flex;justify-content:space-between;font-size:10.5px;font-weight:600;color:var(--kink3);margin-top:6px}'
  + '.knFxRow{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--khair)}'
  + '.knFxRow .knFxL{flex:none;width:64px}'
  + '.knFxChips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}.knFxChips::-webkit-scrollbar{display:none}'
  + '.knLchip{flex:none;display:inline-flex;align-items:baseline;gap:4px;border-radius:8px;padding:6px 9px;font-size:12.5px;font-weight:800}'
  + '.knLchip i{font-style:normal;font-size:10.5px;font-weight:600;opacity:.85}.knLchip em{font-style:normal;font-size:9.5px;font-weight:600;opacity:.7;margin-left:2px}'
  + '.knFxFocus{font-size:13px;font-weight:600;line-height:1.45;min-width:0}.knFxFocus b{color:var(--kbd)}'
  + '.knSrScale{position:relative;height:22px;margin:10px 14px 0 114px;font-size:9.5px;font-weight:700;color:var(--kink3)}'
  + '.knSrScale span{position:absolute;top:4px;transform:translateX(-50%);white-space:nowrap}.knSrScale span:last-child{transform:translateX(-100%);font-size:8.5px}'
  + '.knSr{display:flex;align-items:center;gap:8px;width:100%;padding:7px 14px 7px 16px;border-top:1px solid var(--khair);text-align:left}'
  + '.knSr:first-of-type{border-top:0}.knSr:active{background:var(--ksunk)}'
  + '.knSrL{flex:none;width:90px;min-width:0}'
  + '.knSrL b{display:block;font-size:10.5px;font-weight:800;letter-spacing:.02em;line-height:1.15;text-transform:uppercase;text-wrap:balance}'
  + '.knSrL span{display:block;font-size:10px;font-weight:600;color:var(--kink3);margin-top:2px;white-space:nowrap}'
  + '.knSrT{flex:1;position:relative;height:34px;border-radius:5px;'
  +   'background:linear-gradient(90deg,var(--ksunk) 0 var(--z1),transparent var(--z1) var(--z2),rgba(217,239,217,.6) var(--z2) var(--z3),rgba(0,165,80,.22) var(--z3) var(--z4),rgba(199,125,214,.22) var(--z4) 100%)}'
  + '.knSrT .dot{position:absolute;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 1.5px #fff}'
  + '.knSrT .avg{position:absolute;top:2px;bottom:2px;width:2px;background:var(--kink);opacity:.55;transform:translateX(-1px);border-radius:1px}'
  + '.knSrT .lead{position:absolute;top:50%;transform:translateY(-50%);font-size:10px;font-weight:800;color:var(--kink);white-space:nowrap;background:rgba(255,255,255,.82);padding:0 3px;border-radius:3px}'
  + '.knSrT .lead.r{right:calc(100% - var(--x))}.knSrT .lead.l{left:var(--x)}'
  + '.knSrR{flex:none;width:34px;text-align:right;font-size:13px;font-weight:800}'
  + '.knSrAll{display:none;flex-wrap:wrap;gap:6px;padding:4px 14px 12px 16px}.knSr.open+.knSrAll{display:flex}'
  + '.knMchip{display:inline-flex;align-items:baseline;gap:4px;border-radius:7px;padding:5px 8px;font-size:12px;font-weight:700}.knMchip i{font-style:normal;font-size:10.5px;font-weight:600;opacity:.8}'
  + '.knBands{display:flex;gap:10px;flex-wrap:wrap;padding:12px 16px 12px;font-size:10.5px;font-weight:600;color:var(--kink2);border-top:1px solid var(--khair)}'
  + '.knBands i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:-1px}'
  /* ===== Chi tiết mã (view web, sắp lại) ===== */
  + '.kn-app #view-detail{display:block;height:auto!important;overflow:visible!important;font-family:'+FONT+'}'
  + '.kn-app #dBody{display:block}'
  + '.kn-app #view-detail>.card,.kn-app #dBody>.card{display:block;overflow:visible!important;padding:0 0 4px!important;'
  +   'background:transparent;border:0;border-radius:0;margin:0;box-shadow:none}'
  + '.kn-app #dFlex{display:block;min-height:0!important}'
  + '.kn-app #dFlex>div:first-child{display:block;min-height:0!important;background:#fff;margin-bottom:12px;box-shadow:0 .5px 0 var(--khair)}'
  + '.kn-app #view-detail .search-wrap,.kn-app #dTitle,.kn-app #dRanges,.kn-app #dHead{display:none!important}'
  + '.kn-app #dTpn{margin:0!important}'
  /* đầu trang kiểu FinBox: mã + tên trên, logo tròn + giá to + KL dưới */
  /* Dau trang ma: logo len cung hang voi ma, gia va khoi luong nam chung mot
     hang -> tiet kiem ~45px chieu cao, chart duoc keo dai them. */
  + '#knDHead{order:-3;background:#fff;padding:10px 14px 0}'
  + '#knDHead .r1{display:flex;align-items:center;gap:9px}'
  + '#knDHead .nm{flex:1;min-width:0}#knDHead .nm b{font-size:18px;font-weight:800;letter-spacing:-.02em}'
  + '#knDHead .nm b span{font-size:11.5px;font-weight:600;color:var(--kink2);margin-left:6px;letter-spacing:0}'
  + '#knDHead .nm .knSub{max-width:none}'
  + '#knDHead .r1{padding-bottom:8px}#knDHead .pr{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:3px;text-align:right}'
  + '#knDHead .av{width:34px;height:34px;flex:none;border-radius:50%;background:var(--kbs);color:var(--kbd);display:grid;place-items:center;font-weight:800;font-size:10px;overflow:hidden;border:1px solid var(--khair)}'
  + '#knDHead .av img{width:100%;height:100%;object-fit:contain;background:#fff;display:block}'
  + '#knDHead .big{font-size:23px;font-weight:800;letter-spacing:-.03em;line-height:1.05;white-space:nowrap}'
  + '#knDHead .big span{font-size:16px;font-weight:700;letter-spacing:-.01em}'
  + '#knDHead .vol{font-size:12.5px;font-weight:600;color:var(--kink2);text-align:right;white-space:nowrap}#knDHead .vol b{color:var(--kbd)}'
  + '#knRange{order:-2;background:#fff;padding:4px 14px 10px}'
  /* dải mã watchlist ở đầu (web tự dựng) -> thành dải chip */
  + '.kn-app #watchStrip{order:-4;border:0!important;border-radius:0!important;margin:0!important;padding:8px 14px 4px!important;'
  +   'background:#fff;box-shadow:none!important;-ms-overflow-style:none;scrollbar-width:none}'
  + '.kn-app #watchStrip::-webkit-scrollbar{display:none}'
  /* chart: 2 khung giá / khối lượng, tràn 2 mép */
  + '.kn-app #chartProWrap{display:block;height:auto!important;margin:0}'
  + '.kn-app #proK{display:block;height:auto!important;flex:none!important}'
  + '.kn-app #proPx{height:330px!important;flex:none!important;min-height:0!important}'
  + '.kn-app #proVolPane{height:104px!important;flex:none!important;min-height:0!important;border-top:1px solid var(--khair)!important}'
  + '.kn-app #proLegend{top:6px!important;font-size:10.5px!important;line-height:1.5!important;padding:2px 8px!important;max-width:calc(100% - 64px)!important;font-family:'+FONT+'!important}'
  + '.kn-app #proVolLegend{top:336px!important;bottom:auto!important;font-size:10.5px!important;padding:2px 8px!important;font-family:'+FONT+'!important}'
  + '.kn-app #proFsBtn{display:none!important}'
  + '.kn-app #chartSigWrap{margin:9px 0 0}'
  /* tab con dưới chart: gạch chân, chia đều */
  + '.kn-app #dPanel{width:auto!important;flex:none!important;overflow:visible!important;max-height:none!important;border:0!important;'
  +   'border-radius:0!important;padding:0!important;margin:0;background:var(--kc)!important}'
  + '.kn-app #dTabs{display:flex;gap:0;border-bottom:0!important;margin:0 0 12px!important;padding:0;background:#fff;box-shadow:0 .5px 0 var(--khair)}'
  + '.kn-app #dTabs .dtab{flex:1;white-space:nowrap;margin:0!important;padding:11px 4px 10px;font-size:13px;font-weight:600;color:var(--kink2);border:0;position:relative;font-family:'+FONT+'}'
  + '.kn-app #dTabs .dtab.active{color:var(--kbd);font-weight:700}'
  + '.kn-app #dTabs .dtab.active::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:2.5px;border-radius:3px 3px 0 0;background:var(--kb)}'
  + '.kn-app #tab-ov,.kn-app #tab-sig,.kn-app #tab-rec,.kn-app #tab-news{margin:0 14px 12px}'
  + '.kn-app #tab-ov>*,.kn-app #tab-sig>*,.kn-app #tab-rec>*,.kn-app #tab-news>*{background:#fff;border-radius:15px;box-shadow:var(--ksh);padding:4px 16px;margin-bottom:12px}'
  + '.kn-app #dSide>div:first-child{font-size:11.5px!important;font-weight:700!important;letter-spacing:.06em;text-transform:uppercase;color:var(--kink3);padding:8px 0 4px;margin:0!important}'
  + '.kn-app #dSide>div{font-size:13.5px!important;padding:10.5px 0!important;border-color:var(--khair)!important}'
  + '.kn-app #dSide>div:nth-child(7){display:none!important}'   /* RS: bỏ theo yêu cầu */
  + '.kn-app #dSide>div:last-child{border-bottom:0!important}'
  + '.kn-app #finFull{border:0!important;border-radius:15px!important;padding:14px 16px!important;margin:0 14px 12px!important;background:#fff;box-shadow:var(--ksh)}'
  + '.kn-app #view-detail table{font-size:12.5px}'
  + '.kn-app #view-detail .card>table{display:block;overflow-x:auto}'
  /* ===== Bộ lọc (trang phụ) — giữ như v2 ===== */
  + '.kn-app .card{background:#fff;border:0;border-radius:15px;margin:0 11px 10px;padding:14px 13px;box-shadow:var(--ksh)}'
  + '.kn-app #view-screener .card > div[style*="max-height"]{max-height:none!important;overflow:visible!important;min-height:0!important}'
  + '.kn-app .filters{gap:10px 12px}'
  + '.kn-app #scTable th:nth-child(2),.kn-app #scTable td:nth-child(2){display:none}'
  + '.kn-app #view-screener table th:first-child,.kn-app #view-screener table td:first-child{position:sticky;left:0;background:#fff;z-index:3;box-shadow:1px 0 0 #EDEFF2}'
  + '.kn-app #view-screener table{min-width:640px}.kn-app #view-screener .card>table{display:block;overflow-x:auto}'
  + '.kn-app #knScrToggle{display:flex;align-items:center;justify-content:space-between;width:100%;border:1px solid var(--khair);background:#fff;border-radius:11px;padding:11px 14px;font:inherit;font-size:13.5px;font-weight:700;color:var(--kink);cursor:pointer;margin:10px 0 0}'
  + '.kn-app #knScrToggle .cnt{font-size:11.5px;font-weight:700;color:#fff;background:var(--kb);border-radius:999px;padding:2px 8px;margin-left:8px}'
  + '.kn-app #knScrToggle .car{color:var(--kink3);transition:transform .18s}.kn-app.knScrOpen #knScrToggle .car{transform:rotate(180deg)}'
  + '.kn-app .filters.knHidden{display:none}'
  + '.kn-app #knPresets{display:flex;gap:8px;overflow-x:auto;padding:2px 0 2px;-ms-overflow-style:none;scrollbar-width:none}.kn-app #knPresets::-webkit-scrollbar{display:none}'
  + '.kn-app #knPresets .pill{flex:none;white-space:nowrap}'
  + '.kn-app #notifBtn{position:fixed;left:-9999px;top:-9999px}'
  + '.kn-app #nameBar{position:static!important;border-top:0!important;border-radius:15px;margin:2px 14px 10px!important;padding:14px 13px!important;box-shadow:var(--ksh)!important}'
  /* ===== tab bar ===== */
  + '#knTabbar{position:fixed;left:0;right:0;bottom:0;z-index:9000;display:grid;grid-template-columns:repeat(5,1fr);background:rgba(255,255,255,.94);'
  +   '-webkit-backdrop-filter:saturate(180%) blur(18px);backdrop-filter:saturate(180%) blur(18px);box-shadow:0 -.5px 0 var(--khair);'
  +   'padding-bottom:env(safe-area-inset-bottom,0px);font-family:'+FONT+'}'
  + '#knTabbar .knTab{position:relative;background:none;border:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;'
  +   'gap:4px;padding:9px 2px 8px;color:var(--kink3);font-size:10px;font-weight:600;line-height:1;-webkit-tap-highlight-color:transparent;transition:color .16s;user-select:none;-webkit-user-select:none}'
  + '#knTabbar .knTab::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%) scaleX(0);width:22px;height:3px;border-radius:0 0 3px 3px;background:var(--kb);transition:transform .18s}'
  + '#knTabbar .knTab.active::before{transform:translateX(-50%) scaleX(1)}'
  + '#knTabbar .knTab .knIco{display:block;height:24px}#knTabbar .knTab svg{display:block;width:24px;height:24px}'
  + '#knTabbar .knTab .knIcoB{display:none}'
  + '#knTabbar .knTab:active .knIco{transform:scale(.88);transition:transform .1s}'
  + '#knTabbar .knTab.active{color:var(--kbd);font-weight:700}'
  + '#knTabbar .knTab.active .knIcoA{display:none}'
  + '#knTabbar .knTab.active .knIcoB{display:block;animation:knPop .22s cubic-bezier(.34,1.5,.5,1)}'
  + '@keyframes knPop{from{transform:scale(.78)}to{transform:none}}'
  + '@media (prefers-reduced-motion:reduce){#knTabbar .knTab.active .knIcoB{animation:none}}'
  /* ===== kéo xuống để tải lại ===== */
  + '#knPtr{position:fixed;left:0;right:0;top:0;height:0;overflow:hidden;z-index:8000;display:flex;align-items:flex-end;justify-content:center;padding-bottom:7px;color:var(--kb);pointer-events:none}'
  + '#knPtr svg{width:21px;height:21px;transition:transform .15s}#knPtr.ready svg{transform:rotate(180deg)}'
  + '#knPtr.load svg{animation:knspin .9s linear infinite}@keyframes knspin{to{transform:rotate(360deg)}}';
  document.head.appendChild(css);

  /* ---------- 6. Khung pane ---------- */
  var PANE_HTML = {
    market: '<div class="knSegW"><div class="knSeg" id="knPSeg">'
      + '<button class="on" data-r="all">Tất cả</button><button data-r="1y">1 năm</button><button data-r="6m">6 tháng</button><button data-r="y1"></button><button data-r="y0"></button></div></div>'
      + '<div class="knCard" style="margin-top:8px"><div class="knLegend"><span><i style="background:var(--kb)"></i>Khoa Nguyen Signal</span><span><i style="background:var(--kdn)"></i>VN-Index</span></div>'
      + '<div class="knPerf" id="knPerf"><div class="knTip" id="knPTip"></div></div></div>'
      + '<p class="knNote" style="margin-top:-4px">Lợi nhuận cộng dồn của tín hiệu B★ so với VN-Index từ 01/2019, đã gồm phí. Rê ngón tay trên biểu đồ để xem từng thời điểm.</p>'
      + '<div class="knCap"><b id="knDealCap">Tín hiệu B★</b><span id="knDealSum"></span></div>'
      + '<div class="knCard"><div class="knDealHd"><span>MÃ · MUA</span><span>GIÁ MUA</span><span>GIÁ BÁN</span><span>LỢI SUẤT</span></div><div id="knDeals"></div></div>',
    watch: '<div class="knKpis" id="knWKpi"></div>'
      + '<div class="knChips" id="knWChips" style="padding-top:0"><button class="knChip on" data-f="all">Tất cả</button><button class="knChip" data-f="star">Buy 50%</button><button class="knChip" data-f="up">Tăng giá</button><button class="knChip" data-f="vol">KL đột biến</button></div>'
      + '<div class="knCard"><div class="knColHd"><span>MÃ · KL SO TB20</span><span>1 THÁNG</span><button class="knSort" id="knWSort">% ngày ▾</button></div><div id="knWList"></div></div>'
      + '<p class="knNote" id="knWNote">Chỉ còn mã B★ (nền thắt chặt, cơ bản đạt). Buy 50% / 25% / 12.5% = tỷ trọng nếu nổ phiên tới, tính trên vốn cuối năm trước.</p>',
    compare: '<div class="knSegW"><div class="knSeg" id="knVSeg"><button class="on" data-g="bank">Ngân hàng</button><button data-g="sec">Chứng khoán</button></div></div>'
      + '<div class="knCap" style="margin-top:8px"><b>ROE so với P/B hiện tại</b><span>trên-trái: rẻ mà tốt</span></div>'
      + '<div class="knCard" id="knVScat"></div>'
      + '<div class="knCap"><b>Khoảng P/B 6 năm</b><span id="knVSum"></span></div>'
      + '<div class="knChips" id="knVSort" style="padding-top:0"><button class="knChip on" data-s="roe">Theo ROE</button><button class="knChip" data-s="cheap">Rẻ nhất trước</button><button class="knChip" data-s="exp">Đắt nhất trước</button></div>'
      + '<div class="knCard"><div id="knVList"></div></div>'
      + '<p class="knNote">Mỗi thanh chạy từ P/B thấp nhất đến cao nhất của chính mã đó trong 6 năm; vạch giữa là trung điểm. Chấm đen là P/B hiện tại, quy theo giá phiên mới nhất.</p>',
    leader: '<div class="knCard knFocus" id="knLbFocus"></div>'
      + '<div class="knCap"><b>Sức mạnh từng ngành</b><span>mỗi chấm một mã · vạch = điểm TB ngành</span></div>'
      + '<div class="knCard"><div class="knSrScale" id="knLbScale"></div><div id="knLbStrip"></div><div class="knBands" id="knLbBands"></div></div>'
      + '<p class="knNote" id="knLbNote">Điểm = vị trí giá trong biên độ + dòng tiền, cộng trên 4 khung 20/50/100/200 phiên, tối đa 800. Ngành xếp từ mạnh xuống yếu; chạm một ngành để xem hết mã.</p>'
  };
  function buildPanes(){
    if (document.getElementById('knApp')) return;
    var wrap = document.querySelector('.wrap'); if (!wrap) return;
    var root = document.createElement('div'); root.id = 'knApp';
    Object.keys(PANE_HTML).forEach(function(k){
      var p = document.createElement('section'); p.className = 'knPane'; p.id = 'kn-' + k; p.innerHTML = PANE_HTML[k];
      root.appendChild(p);
    });
    var vm = document.getElementById('view-market');
    if (vm) wrap.insertBefore(root, vm); else wrap.appendChild(root);
  }

  /* ---------- 7. Điều hướng ---------- */
  var cur = null, scrollMem = {}, lastPrimary = 'market', phienTab = 0;
  var ENGINE_VIEWS = ['watch','detail','market','screener','leader','compare','news','fund'];
  function engineView(){
    for (var i = 0; i < ENGINE_VIEWS.length; i++){
      var el = document.getElementById('view-'+ENGINE_VIEWS[i]);
      if (el && el.style.display !== 'none') return ENGINE_VIEWS[i];
    }
    return null;
  }
  function rememberScroll(){ if (cur) scrollMem[cur] = window.pageYOffset || 0; }
  function setActive(view){
    var bar = document.getElementById('knTabbar'); if(!bar) return;
    Array.prototype.forEach.call(bar.children, function(b){ b.classList.toggle('active', b.dataset.view === view); });
    var sec = !PRIMARY[view];
    document.documentElement.classList.toggle('kn-sec', sec);
    var tEl = document.getElementById('knSecTitle');
    if (tEl && sec) tEl.textContent = SEC_TITLE[view] || '';
    if (PRIMARY[view]) lastPrimary = view;
  }
  function animateIn(el){
    if (!el || typeof el.animate !== 'function') return;
    try {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      el.animate([{opacity:.72, transform:'translateY(4px)'}, {opacity:1, transform:'none'}], {duration:150, easing:'ease-out'});
    } catch(e){}
  }
  /* gọi showView của web nhưng không để Analytics đếm */
  function engineShow(v, skip){
    var g = window.gtag; window.gtag = null;
    try { window.showView(v, skip); } catch(e){}
    window.gtag = g;
  }
  /* Chi tiết / Bộ lọc: chuyển HAI PHA như v2 (đổi hiển thị trước, dựng lại nội dung sau khi đã vẽ) */
  function hienEngine(view, xong){
    var phien = ++phienTab;
    var el = document.getElementById('view-'+view);
    var coNoiDung = !!(el && el.firstElementChild);
    if (!coNoiDung){ try { window.showView(view); } catch(e){} if (xong) xong(); return; }
    engineShow(view, true);
    raf2(function(){
      if (phien !== phienTab) return;
      if (engineView() !== view) return;
      engineShow(view);
      if (xong) xong();
    });
  }
  function showPane(view){
    $$('.knPane').forEach(function(p){ p.classList.toggle('on', p.id === 'kn-' + view); });
  }
  var paneInit = {};
  function go(view){
    var same = cur === view;
    if (!same) rememberScroll();
    var y = same ? 0 : (scrollMem[view] || 0);
    if (NATIVE[view]){
      /* ẩn view web đang mở (Chi tiết / Bộ lọc): đưa web về 'market' (đã ẩn bằng CSS) */
      if (engineView() !== 'market') engineShow('market', true);
      showPane(view);
      if (!paneInit[view]) { paneInit[view] = 1; try { PANE_ON[view] && PANE_ON[view](); } catch(e){} }
      try { PANE_RE[view] && PANE_RE[view](); } catch(e){}
      var el = document.getElementById('kn-' + view);
      if (!same) animateIn(el);
    } else {
      showPane('none');
      if (view === 'detail' && !KN().curT){
        /* lần đầu mở Chi tiết: mở mã ★ đầu watchlist thay vì FPT */
        var first = watchRows().strong[0];
        if (first) { try { window.openDetail(first.t); } catch(e){} }
        else hienEngine(view);
      } else hienEngine(view);
      var ev = document.getElementById('view-' + view);
      if (!same) animateIn(ev);
    }
    cur = view;
    setActive(view);
    if (same){ try { window.scrollTo({top:0, behavior:'smooth'}); } catch(e){ window.scrollTo(0,0); } }
    else { window.scrollTo(0, y); requestAnimationFrame(function(){ window.scrollTo(0, y); }); }
  }
  function goBack(){ go(lastPrimary || 'market'); }
  /* Bấm vào thông báo đẩy -> dashboard_app gọi ra đây để mở đúng tab trong app */
  window.knGoTab = function(v){ try { go(PRIMARY[v] ? v : 'watch'); } catch(e){} };

  /* ---------- 8. Dữ liệu chung ---------- */
  function watchRows(){
    var K = KN(); if (!K) return {strong:[], weak:[]};
    var all = K.ROWS().filter(function(r){ return r.watch; });
    var enrich = function(r){ return {
      t:r.t, n:r.n || '', b:r.b, p:r.p, chg:r.chg, star:r.wstar === 1, mong:r.wmong === 1, buy:(r.wstar === 1 && r.wbuy) ? r.wbuy : null,
      pkl: r.vx != null ? Math.round(r.vx * 100) : null,
      kl: (r.v20 != null && r.vx != null) ? Math.round(r.v20 * r.vx) : (r.v20 || null),
      val20:r.val20, weak: r.wgrade === 'weak' }; };
    var rows = all.map(enrich);
    var byStar = function(a, b){ return (b.star?1:0) - (a.star?1:0) || (b.chg||-99) - (a.chg||-99); };
    return { strong: rows.filter(function(r){ return !r.weak; }).sort(byStar), weak: rows.filter(function(r){ return r.weak; }).sort(byStar) };
  }
  var BANDS = [
    {max:400,  label:'Yếu',        bg:'#BFE6F7', fg:'#0F3D56'},
    {max:500,  label:'Trung bình', bg:'#FFFFFF', fg:'#1F2937', bd:1},
    {max:550,  label:'Khá',        bg:'#D9EFD9', fg:'#14532D'},
    {max:600,  label:'Khỏe',       bg:'#00A550', fg:'#FFFFFF'},
    {max:1e9,  label:'Rất khỏe',   bg:'#C77DD6', fg:'#FFFFFF'}
  ];
  var band = function(v){ for (var i = 0; i < BANDS.length; i++) if (v < BANDS[i].max) return BANDS[i]; return BANDS[4]; };
  var bandStyle = function(v){ var b = band(v); return 'background:' + b.bg + ';color:' + b.fg + (b.bd ? ';box-shadow:inset 0 0 0 1px #D5DCD8' : ''); };

  /* ---------- 9. HIỆU SUẤT ---------- */
  var perfPts = null, perfRange = 'all', PP = null;
  function perfCurve(){
    var K = KN(); if (!K) return null;
    var cv = null;
    try { cv = K.bstarCurve(); } catch(e){}
    if (!cv || !cv.length) cv = (K.SUM && K.SUM.tpn && K.SUM.tpn.curve) || null;
    return cv;
  }
  function drawPerf(rk){
    var cv = perfCurve(); var wrap = document.getElementById('knPerf'); if (!cv || !wrap) return;
    perfRange = rk;
    var i0 = 0, i1 = cv.length - 1;
    if (/^20\d\d$/.test(rk)){ var a = -1, b = -1; for (var i = 0; i < cv.length; i++){ if (a < 0 && cv[i][0].indexOf(rk) === 0) a = i; if (b < 0 && cv[i][0] > rk + '-12-31') b = i; }
      if (a < 0) return; i0 = Math.max(0, a - 1); i1 = b < 0 ? cv.length - 1 : b - 1; }
    else if (rk === '1y') i0 = Math.max(0, cv.length - 52);
    else if (rk === '6m') i0 = Math.max(0, cv.length - 26);
    var rb = function(k){ var b0 = 1 + cv[i0][k]/100; var o = []; for (var i = i0; i <= i1; i++) o.push(((1 + cv[i][k]/100) / b0 - 1) * 100); return o; };
    var kn = rb(1), vnI = rb(2), n = kn.length; if (n < 2) return;
    var W = 390, H = 226, padL = 12, padR = 70, padT = 30, padB = 22;
    var lo = Math.min(0, Math.min.apply(null, kn), Math.min.apply(null, vnI)), hi = Math.max(Math.max.apply(null, kn), Math.max.apply(null, vnI)), span = (hi - lo) || 1;
    var x = function(i){ return padL + i * (W - padL - padR) / (n - 1); }, y = function(v){ return padT + (hi - v) / span * (H - padT - padB); };
    var path = function(a){ var d = ''; for (var i = 0; i < a.length; i++) d += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(a[i]).toFixed(1); return d; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Lợi nhuận cộng dồn so với VN-Index"><defs><linearGradient id="knGk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#128A3E" stop-opacity=".2"/><stop offset="1" stop-color="#128A3E" stop-opacity="0"/></linearGradient></defs>';
    s += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y(0).toFixed(1) + '" y2="' + y(0).toFixed(1) + '" stroke="#E4EAE6"' + (lo < 0 ? ' stroke-dasharray="3 3"' : '') + '/>';
    s += '<path d="' + path(kn) + 'L' + x(n-1).toFixed(1) + ' ' + (H - padB).toFixed(1) + 'L' + x(0).toFixed(1) + ' ' + (H - padB).toFixed(1) + 'Z" fill="url(#knGk)"/>';
    s += '<path d="' + path(vnI) + '" fill="none" stroke="#E5484D" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>';
    s += '<path d="' + path(kn) + '" fill="none" stroke="#128A3E" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
    var yk = y(kn[n-1]), yv = y(vnI[n-1]);
    if (Math.abs(yk - yv) < 22){ var m = (yk + yv) / 2; if (yk <= yv){ yk = m - 11; yv = m + 11; } else { yk = m + 11; yv = m - 11; } }
    var badge = function(yy, v, col){ return '<rect x="' + (W - padR + 6) + '" y="' + (yy - 10).toFixed(1) + '" width="' + (padR - 12) + '" height="20" rx="6" fill="' + col + '"/><text x="' + (W - padR + 6 + (padR - 12)/2) + '" y="' + (yy + 3.8).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="' + FONT.replace(/"/g,'') + '">' + pct(v) + '</text>'; };
    s += '<circle cx="' + x(n-1).toFixed(1) + '" cy="' + y(kn[n-1]).toFixed(1) + '" r="3.5" fill="#128A3E" stroke="#fff" stroke-width="2"/>';
    s += badge(yk, kn[n-1], '#128A3E') + badge(yv, vnI[n-1], '#E5484D');
    /* nhãn thời gian: năm đặt giữa khoảng của năm; kỳ ngắn -> đầu/cuối */
    var labs = [];
    if (n > 40){ var ys = []; for (var j = i0; j <= i1; j++){ var yr = cv[j][0].slice(0,4); if (!ys.length || ys[ys.length-1][1] !== yr) ys.push([j, yr]); }
      for (var k = 0; k < ys.length; k++){ var nx = k + 1 < ys.length ? ys[k+1][0] : i1 + 1; labs.push([(ys[k][0] + nx) / 2 - i0, ys[k][1], 'middle']); } }
    else { var lb = function(j){ return cv[j][0].slice(5,7) + '/' + cv[j][0].slice(2,4); }; labs = [[0, lb(i0), 'start'], [n-1, lb(i1), 'end']]; }
    labs.forEach(function(l){ s += '<text x="' + x(l[0]).toFixed(1) + '" y="' + (H - 5) + '" font-size="10.5" font-weight="600" fill="#8E9B95" text-anchor="' + l[2] + '" font-family="' + FONT.replace(/"/g,'') + '">' + l[1] + '</text>'; });
    s += '<g id="knPHover" style="display:none"><line id="knPhL" y1="' + padT + '" y2="' + (H - padB) + '" stroke="#8E9B95" stroke-width="1" stroke-dasharray="2 3"/><circle id="knPhK" r="4.5" fill="#128A3E" stroke="#fff" stroke-width="2"/><circle id="knPhV" r="4.5" fill="#E5484D" stroke="#fff" stroke-width="2"/></g></svg>';
    $$('svg', wrap).forEach(function(e){ e.remove(); });
    wrap.insertAdjacentHTML('beforeend', s);
    PP = {kn:kn, vnI:vnI, x:x, y:y, i0:i0, n:n, W:W, cv:cv};
  }
  function perfHover(ev){
    var wrap = document.getElementById('knPerf'); var svg = wrap && wrap.querySelector('svg'); if (!svg || !PP) return;
    var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width * PP.W;
    var best = 0, bd = 1e9; for (var i = 0; i < PP.n; i++){ var d = Math.abs(PP.x(i) - px); if (d < bd){ bd = d; best = i; } }
    var g = svg.querySelector('#knPHover'); g.style.display = ''; var xx = PP.x(best);
    g.querySelector('#knPhL').setAttribute('x1', xx); g.querySelector('#knPhL').setAttribute('x2', xx);
    g.querySelector('#knPhK').setAttribute('cx', xx); g.querySelector('#knPhK').setAttribute('cy', PP.y(PP.kn[best]));
    g.querySelector('#knPhV').setAttribute('cx', xx); g.querySelector('#knPhV').setAttribute('cy', PP.y(PP.vnI[best]));
    var tip = document.getElementById('knPTip'); var d0 = PP.cv[PP.i0 + best][0];
    tip.style.display = 'block';
    tip.innerHTML = d0.slice(8,10) + '/' + d0.slice(5,7) + '/' + d0.slice(2,4) + ' · KN <b class="' + cls(PP.kn[best]) + '">' + pct(PP.kn[best]) + '</b> · VNI <b>' + pct(PP.vnI[best]) + '</b>';
    tip.style.left = Math.min(Math.max(8, ev.clientX - r.left - 80), r.width - 210) + 'px';
  }
  function perfLeave(){ var wrap = document.getElementById('knPerf'); var g = wrap && wrap.querySelector('#knPHover'); if (g) g.style.display = 'none'; var t = document.getElementById('knPTip'); if (t) t.style.display = 'none'; }
  /* Bảng lệnh B★: đóng rồi thì cố định -> cache theo phiên để mở app là có ngay */
  var dealsDone = false;
  function dealRows(){
    var K = KN(); if (!K) return null;
    var khoa = K.knKhoaPhien(K.KN_MOC_SEC);
    if (K.BSTAR && K.BSTAR.ready){ try { var rows = K.bstarRecent(); if (rows && rows.length){
      /* Chi ghi cache khi da du gia moi ma; con thieu thi van hien (tot nhat co the) nhung khong ghi,
         de nhip 2 phut tai bu xong thi bang duoc dung lai day du. */
      var du = !(K.BSTAR.thieu && K.BSTAR.thieu.length);
      if (du) K.knGhiCache('kn_deals', khoa, rows);
      dealsDone = du; return rows; } } catch(e){} }
    var c = K.knDocCache('kn_deals', khoa); if (c && c.length){ dealsDone = true; return c; }
    /* chưa có giá: dựng khung từ dấu X (deal năm nay chờ giá, năm cũ đã chốt) */
    try {
      var y0 = String(new Date().getFullYear()) + '-01-01'; var f = function(d){ return d.slice(8,10) + '/' + d.slice(5,7) + '/' + d.slice(2,4); };
      var now = K.bstarDeals().filter(function(d){ return d.bdate >= y0; }).map(function(d){ return {t:d.t, bd:f(d.bdate), bdate:d.bdate, bp:null, sp:null, sd:d.sdate ? f(d.sdate) : '—', ret:null, open:!d.sdate}; });
      var old = (window.BSTAR_DEALS || []).filter(function(d){ return d.b < y0; }).map(function(d){ return {t:d.t, bd:f(d.b), bdate:d.b, bp:d.bp, sp:d.sp, sd:f(d.s), ret:+(((d.sp/d.bp-1)*100)-0.4).toFixed(1), open:false}; });
      return now.concat(old);
    } catch(e){ return null; }
  }
  function renderDeals(){
    var rows = dealRows(); var el = document.getElementById('knDeals'); if (!el) return;
    if (!rows || !rows.length){ el.innerHTML = '<p class="knNote" style="padding:14px 0">Chưa có dữ liệu lệnh.</p>'; return; }
    var yNow = String(new Date().getFullYear()); var lastY = null, h = ''; var K2 = KN();
    var nNow = 0, wins = 0, sum = 0;
    rows.forEach(function(d){ if (d.bdate.slice(0,4) === yNow){ nNow++; if (d.ret != null){ sum += d.ret; if (d.ret > 0) wins++; } } });
    rows.forEach(function(d){
      var yr = d.bdate.slice(0,4);
      if (yr !== lastY && yr !== yNow) h += '<div class="knYear">NĂM ' + yr + '</div>';
      lastY = yr;
      var ret = d.ret == null ? null : (typeof d.ret === 'number' ? d.ret : parseFloat(String(d.ret).replace('%','').replace(',', '.')));
      var buy = d.buy || (K2 && K2.knBuyOf ? K2.knBuyOf(d.t, d.bdate) : null);
      h += '<button class="knDeal" data-t="' + d.t + '"><div><div class="t">' + d.t + '</div><div class="s">' + d.bd + (buy ? '<span class="knBuy">Buy ' + buy + '%</span>' : '') + '</div></div>'
         + '<div><div class="n">' + (d.bp == null || d.bp === '…' ? '<span class="knSkel" style="display:inline-block;width:44px;height:14px"></span>' : vn(+d.bp, 2)) + '</div></div>'
         + '<div><div class="n">' + (d.open ? (d.sp == null || d.sp === '…' ? '…' : vn(+d.sp, 2)) : (d.sp == null || d.sp === '…' ? '<span class="knSkel" style="display:inline-block;width:44px;height:14px"></span>' : vn(+d.sp, 2))) + '</div><div class="s">' + (d.open ? 'đang mở' : d.sd) + '</div></div>'
         + '<div>' + (ret == null || isNaN(ret) ? '<span class="knSkel" style="display:inline-block;width:66px;height:24px"></span>' : '<span class="knPill ' + cls(ret) + '">' + pct(ret) + '</span>') + '</div></button>';
    });
    el.innerHTML = h;
    var cap = document.getElementById('knDealCap'); if (cap) cap.textContent = 'Tín hiệu B★ năm ' + yNow;
    var sm = document.getElementById('knDealSum'); if (sm) sm.textContent = nNow + ' deal' + (nNow ? ' · ' + wins + ' lãi · TB ' + pct(nNow ? sum / nNow : 0) : '');
  }
  function initMarket(){
    var pane = document.getElementById('kn-market'); if (!pane) return;
    var seg = document.getElementById('knPSeg');
    var yNow = new Date().getFullYear();
    var b1 = seg.querySelector('[data-r="y1"]'), b0 = seg.querySelector('[data-r="y0"]');
    b1.dataset.r = String(yNow - 1); b1.textContent = String(yNow - 1); b0.dataset.r = String(yNow); b0.textContent = String(yNow);
    seg.addEventListener('click', function(e){ var b = e.target.closest('button'); if (!b) return;
      $$('button', seg).forEach(function(x){ x.classList.toggle('on', x === b); }); drawPerf(b.dataset.r); perfLeave(); });
    var wrap = document.getElementById('knPerf');
    wrap.addEventListener('pointermove', perfHover, {passive:true});
    wrap.addEventListener('pointerleave', perfLeave);
    wrap.addEventListener('touchend', function(){ setTimeout(perfLeave, 1200); }, {passive:true});
    document.getElementById('knDeals').addEventListener('click', function(e){ var b = e.target.closest('.knDeal'); if (b && window.openDetail) window.openDetail(b.dataset.t); });
    drawPerf('all'); renderDeals();
    /* giá về (BSTAR.ready) -> vẽ lại bảng lệnh + đường cong năm nay, tối đa 60 lần */
    var n = 0; var iv = setInterval(function(){ n++; var K = KN(); if ((K && K.BSTAR && K.BSTAR.ready) || n > 60){ clearInterval(iv); renderDeals(); drawPerf(perfRange); } }, 1000);
    /* Trong phiên: mỗi lần bảng giá về (15 giây/lần) engine gọi ra đây -> vẽ lại
       đường hiệu suất bằng giá sống. Chỉ vẽ khi đang đứng ở tab Hiệu suất. */
    window.__knVePerf = function(){
      if (cur !== 'market') return;
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - (window.__knPerfLuc || 0) < 5000) return;
      window.__knPerfLuc = Date.now();
      try { drawPerf(perfRange); } catch(e){}
    };
  }

  /* ---------- 10. WATCHLIST ---------- */
  var wF = 'all', wS = 'chg', SPARK = null, sparkKey = null, sparkBusy = false;
  var SORTS = { chg:['% ngày', function(a,b){ return (b.chg||-99) - (a.chg||-99); }], pkl:['KL / TB20', function(a,b){ return (b.pkl||0) - (a.pkl||0); }], t:['Mã A→Z', function(a,b){ return a.t.localeCompare(b.t); }] };
  function sparkSvg(a){
    if (!a || a.length < 2) return '<div class="knSkel"></div>';
    var W = 64, H = 26, lo = Math.min.apply(null, a), hi = Math.max.apply(null, a), sp = (hi - lo) || 1;
    var x = function(i){ return i * W / (a.length - 1); }, y = function(v){ return 2 + (hi - v) / sp * (H - 4); };
    var d = ''; for (var i = 0; i < a.length; i++) d += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(a[i]).toFixed(1);
    var col = a[a.length-1] >= a[0] ? '#12A150' : '#E5484D';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '"><path d="' + d + 'L' + W + ' ' + H + 'L0 ' + H + 'Z" fill="' + col + '" opacity=".1"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="1.6" stroke-linejoin="round"/><circle cx="' + W + '" cy="' + y(a[a.length-1]).toFixed(1) + '" r="2.2" fill="' + col + '"/></svg>';
  }
  function rowHtml(r, dim){
    return '<button class="knRow' + (dim ? ' dim' : '') + '" data-t="' + r.t + '">'
      + '<div class="knRowL"><div class="knTick">' + r.t + (r.star ? '<span class="knStar" title="Nền thắt chặt">★</span>' : '') + (r.buy ? '<span class="knBuy" title="Nếu nổ: tỷ trọng ' + r.buy + '% tài khoản">Buy ' + r.buy + '%</span>' : '') + (r.mong ? '<span class="knMong" title="Thanh khoản mỏng: TB20 10–15 tỷ">mỏng</span>' : '') + (r.pkl != null && r.pkl >= 150 ? '<span class="knHot">KL ' + r.pkl + '%</span>' : '') + '</div>'
      + '<div class="knSub">' + esc(shortName(r.n)) + '</div></div>'
      + '<div class="knSpark" data-t="' + r.t + '">' + sparkSvg(SPARK && SPARK[r.t]) + '</div>'
      + '<div class="knRowR"><div class="knPx">' + (r.p == null ? '—' : vn(r.p, r.p >= 100 ? 1 : 2)) + '</div><span class="knPill ' + cls(r.chg) + '">' + pct(r.chg) + '</span></div></button>';
  }
  function shortName(n){ return String(n || '').replace(/^(Tổng Công ty Cổ phần|Công ty Cổ phần|Tổng Công ty|Ngân hàng TMCP|Ngân hàng Thương mại Cổ phần|Công ty TNHH|Tập đoàn|Công ty)\s+/i, '').replace(/\s+[–-]\s+Công ty.*$/i, '').trim(); }
  function renderWatch(){
    var W = watchRows(); var S = W.strong;
    var list = S.filter(function(r){ return wF === 'all' || (wF === 'star' && r.buy === 50) || (wF === 'up' && r.chg > 0) || (wF === 'vol' && r.pkl >= 150); }).sort(SORTS[wS][1]);
    var el = document.getElementById('knWList'); if (!el) return;
    el.innerHTML = list.length ? list.map(function(r){ return rowHtml(r); }).join('') : '<p class="knNote" style="padding:14px 0">Không có mã nào trong nhóm này hôm nay.</p>';
    document.getElementById('knWSort').textContent = SORTS[wS][0] + ' ▾';
    var nStar = S.filter(function(r){ return r.buy === 50; }).length, nVol = S.filter(function(r){ return r.pkl >= 150; }).length;
    var K = KN(); var up = (K && K.SUM && K.SUM.updated || '').slice(0,10); var lab = up ? up.slice(8,10) + '/' + up.slice(5,7) : '';
    document.getElementById('knWKpi').innerHTML = '<div class="knKpi"><div class="l">MUA ĐƯỢC</div><div class="v">' + S.length + '</div><div class="s">đạt nền' + (lab ? ' ' + lab : '') + '</div></div>'
      + '<div class="knKpi"><div class="l">BUY 50%</div><div class="v">' + nStar + '</div><div class="s">siêu chặt + KL cạn</div></div>'
      + '<div class="knKpi"><div class="l">KL ĐỘT BIẾN</div><div class="v">' + nVol + '</div><div class="s">≥150% TB20</div></div>';
    var note = document.getElementById('knWNote'); if (note && lab) note.textContent = 'Chỉ còn mã B★ (nền thắt chặt, cơ bản đạt). Buy 50% / 25% / 12.5% = tỷ trọng nếu nổ phiên tới, tính trên vốn cuối năm trước. Số liệu phiên ' + lab + '.';
  }
  /* Sparkline 1 tháng: 22 phiên đóng cửa mỗi mã, tải 6 mã một lượt, cache theo phiên */
  function loadSparks(){
    var K = KN(); if (!K || sparkBusy) return;
    var khoa = K.knKhoaPhien(K.KN_MOC_SEC);
    if (sparkKey !== khoa){ SPARK = K.knDocCache('kn_spark', khoa) || {}; sparkKey = khoa; }
    var need = watchRows().strong.concat(watchRows().weak).map(function(r){ return r.t; }).filter(function(t){ return !SPARK[t]; });
    paintSparks();
    if (!need.length) return;
    sparkBusy = true;
    var i = 0;
    var one = function(t){ return K.api.ohlc(t, 46).then(function(o){ if (o && o.c && o.c.length > 2) SPARK[t] = o.c.slice(-22).map(function(x){ return +x; }); }).catch(function(){}); };
    var step = function(){
      if (i >= need.length){ sparkBusy = false; try { K.knGhiCache('kn_spark', khoa, SPARK); } catch(e){} paintSparks(); return; }
      var batch = need.slice(i, i + 6); i += 6;
      Promise.all(batch.map(one)).then(function(){ paintSparks(); setTimeout(step, 30); });
    };
    step();
  }
  function paintSparks(){
    if (!SPARK) return;
    $$('#kn-watch .knSpark').forEach(function(el){ var t = el.dataset.t; if (SPARK[t] && !el.dataset.done){ el.innerHTML = sparkSvg(SPARK[t]); el.dataset.done = '1'; } });
  }
  function initWatch(){
    document.getElementById('knWChips').addEventListener('click', function(e){ var c = e.target.closest('.knChip'); if (!c) return;
      $$('#knWChips .knChip').forEach(function(x){ x.classList.toggle('on', x === c); }); wF = c.dataset.f; renderWatch(); paintSparksReset(); });
    document.getElementById('knWSort').addEventListener('click', function(){ var ks = Object.keys(SORTS); wS = ks[(ks.indexOf(wS) + 1) % ks.length]; renderWatch(); paintSparksReset(); });
    document.getElementById('kn-watch').addEventListener('click', function(e){ var r = e.target.closest('.knRow'); if (r && window.openDetail) window.openDetail(r.dataset.t); });
    renderWatch(); loadSparks();
  }
  function paintSparksReset(){ $$('#kn-watch .knSpark').forEach(function(el){ delete el.dataset.done; }); paintSparks(); }
  var lastLiveDate = null;
  function refreshWatch(){ renderWatch(); paintSparksReset(); }

  /* ---------- 11. SO SÁNH ---------- */
  var vG = 'bank', vS = 'roe';
  var posOf = function(r){ return (r.cur - r.lo) / ((r.hi - r.lo) || 1); };
  var posLabel = function(p){ return p <= .1 ? 'đáy 6 năm' : p < .35 ? 'gần đáy' : p < .65 ? 'giữa khoảng' : p < .9 ? 'gần đỉnh' : 'đỉnh 6 năm'; };
  var posCol = function(p){ return p < .35 ? '#12A150' : p < .65 ? '#B45309' : '#E5484D'; };
  function valRows(g){
    var K = KN(); if (!K) return null;
    var D = K.secCache[g]; if (!D || !D._k) return null;
    return K.SEC_GROUPS[g].filter(function(t){ var d = D[t]; return d && d.pbLo != null && isFinite(d.pbLo) && d.curPb != null && d.curRoe != null; })
      .map(function(t){ var d = D[t]; return {t:t, lo:+(+d.pbLo).toFixed(2), hi:+(+d.pbHi).toFixed(2), cur:+(+d.curPb).toFixed(2), roe:+(+d.curRoe).toFixed(1)}; });
  }
  function drawScatter(L){
    var W = 390, H = 232, padL = 34, padR = 16, padT = 16, padB = 26, F = FONT.replace(/"/g,'');
    var xs = L.map(function(r){ return r.cur; }), ys = L.map(function(r){ return r.roe; });
    var xmax = Math.max.apply(null, xs) * 1.12, ymax = Math.max.apply(null, ys) * 1.15, ymin = Math.min(0, Math.min.apply(null, ys));
    var x = function(v){ return padL + v / xmax * (W - padL - padR); }, y = function(v){ return padT + (ymax - v) / (ymax - ymin) * (H - padT - padB); };
    var med = function(a){ var s = a.slice().sort(function(p, q){ return p - q; }); return s[Math.floor(s.length/2)]; };
    var mx = med(xs), my = med(ys);
    var s = '<svg class="knScat" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="ROE so với P/B">';
    s += '<rect x="' + padL + '" y="' + padT + '" width="' + (x(mx) - padL).toFixed(1) + '" height="' + (y(my) - padT).toFixed(1) + '" fill="#128A3E" opacity=".07" rx="6"/>';
    s += '<text x="' + (padL + 8) + '" y="' + (padT + 14) + '" font-size="10" font-weight="700" fill="#0B6B30" font-family="' + F + '">RẺ · SINH LỜI TỐT</text>';
    s += '<line x1="' + x(mx).toFixed(1) + '" x2="' + x(mx).toFixed(1) + '" y1="' + padT + '" y2="' + (H - padB) + '" stroke="#8E9B95" stroke-dasharray="3 3" opacity=".6"/>';
    s += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y(my).toFixed(1) + '" y2="' + y(my).toFixed(1) + '" stroke="#8E9B95" stroke-dasharray="3 3" opacity=".6"/>';
    s += '<text x="' + (x(mx) + 4).toFixed(1) + '" y="' + (H - padB - 5) + '" font-size="9.5" font-weight="600" fill="#8E9B95" font-family="' + F + '">P/B trung vị ' + vn(mx, 2) + '</text>';
    s += '<text x="' + (W - padR) + '" y="' + (y(my) + 12).toFixed(1) + '" text-anchor="end" font-size="9.5" font-weight="600" fill="#8E9B95" font-family="' + F + '">ROE trung vị ' + vn(my, 1) + '%</text>';
    [0, .5, 1].forEach(function(f){ var v = xmax * f * .9; s += '<text x="' + x(v).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10" font-weight="600" fill="#8E9B95" font-family="' + F + '">' + vn(v, 1) + '</text>'; });
    s += '<text x="' + (W - padR) + '" y="' + (H - 6) + '" text-anchor="end" font-size="10" font-weight="700" fill="#5A6963" font-family="' + F + '">P/B</text>';
    [0, .5, 1].forEach(function(f){ var v = ymin + (ymax - ymin) * f * .9; s += '<text x="' + (padL - 6) + '" y="' + (y(v) + 3.5).toFixed(1) + '" text-anchor="end" font-size="10" font-weight="600" fill="#8E9B95" font-family="' + F + '">' + Math.round(v) + '%</text>'; });
    s += '<text x="' + (padL - 6) + '" y="' + (padT + 4) + '" text-anchor="end" font-size="10" font-weight="700" fill="#5A6963" font-family="' + F + '">ROE</text>';
    var pts = L.map(function(r){ return {r:r, px:x(r.cur), py:y(r.roe)}; }).sort(function(a, b){ return a.px - b.px; });
    var boxes = pts.map(function(p){ return {x:p.px - 6, y:p.py - 6, w:12, h:12}; });
    var hit = function(a, b){ return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; };
    var CAND = [[0,-9,'middle'], [0,16,'middle'], [9,4,'start'], [-9,4,'end'], [8,-7,'start'], [-8,-7,'end'], [8,14,'start'], [-8,14,'end']];
    pts.forEach(function(p){ var w = 6.2 * p.r.t.length + 2, h = 10, pick = CAND[0], best = 1e9;
      for (var c = 0; c < CAND.length; c++){ var cc = CAND[c]; var bx = {x: cc[2] === 'middle' ? p.px + cc[0] - w/2 : cc[2] === 'start' ? p.px + cc[0] : p.px + cc[0] - w, y: p.py + cc[1] - h + 2, w:w, h:h};
        if (bx.x < padL - 2 || bx.x + w > W - 2 || bx.y < padT - 2 || bx.y + h > H - padB) continue;
        var n = boxes.filter(function(b){ return hit(bx, b); }).length; if (n < best){ best = n; pick = cc; p.box = bx; } if (n === 0) break; }
      if (!p.box) p.box = {x:p.px - w/2, y:p.py - 17, w:w, h:h}; boxes.push(p.box); p.pick = pick; });
    pts.forEach(function(p){ var good = p.r.cur <= mx && p.r.roe >= my, c = p.pick;
      s += '<g class="knPt" data-t="' + p.r.t + '" style="cursor:pointer"><circle cx="' + p.px.toFixed(1) + '" cy="' + p.py.toFixed(1) + '" r="5" fill="' + (good ? '#128A3E' : '#5A6963') + '" stroke="#fff" stroke-width="2"/>'
        + '<text x="' + (p.px + c[0]).toFixed(1) + '" y="' + (p.py + c[1]).toFixed(1) + '" text-anchor="' + c[2] + '" font-size="10" font-weight="700" fill="' + (good ? '#0B6B30' : '#5A6963') + '" font-family="' + F + '">' + p.r.t + '</text></g>'; });
    s += '</svg>';
    document.getElementById('knVScat').innerHTML = s;
  }
  function renderVal(){
    var L = valRows(vG); var list = document.getElementById('knVList'); if (!list) return;
    if (!L){ document.getElementById('knVScat').innerHTML = '<div class="knSkel" style="height:232px;border-radius:0"></div>';
      list.innerHTML = [1,2,3,4,5,6].map(function(){ return '<div class="knVr"><div class="knSkel" style="width:48px;height:16px"></div><div class="knVrT"><div class="knSkel" style="position:absolute;left:0;right:0;top:9px;height:8px"></div></div><div class="knSkel" style="width:48px;height:16px"></div></div>'; }).join('');
      document.getElementById('knVSum').textContent = 'đang tính…'; return; }
    if (!L.length){ document.getElementById('knVScat').innerHTML = '<p class="knNote" style="padding:20px 0;text-align:center">Chưa có dữ liệu.</p>'; list.innerHTML = ''; return; }
    drawScatter(L);
    if (vS === 'roe') L = L.slice().sort(function(a, b){ return b.roe - a.roe; }); else if (vS === 'cheap') L = L.slice().sort(function(a, b){ return posOf(a) - posOf(b); }); else L = L.slice().sort(function(a, b){ return posOf(b) - posOf(a); });
    list.innerHTML = L.map(function(r){ var p = posOf(r); return '<button class="knVr" data-t="' + r.t + '">'
      + '<div class="knVrL"><b>' + r.t + '</b><span>ROE ' + vn(r.roe, 1) + '%</span></div>'
      + '<div class="knVrT"><div class="tr"></div><div class="mid"></div><div class="cu" style="left:' + (Math.min(1, Math.max(0, p))*100).toFixed(1) + '%"></div><div class="lab">' + vn(r.lo, 2) + '</div><div class="lab hi">' + vn(r.hi, 2) + '</div></div>'
      + '<div class="knVrR"><b>' + vn(r.cur, 2) + '</b><span style="color:' + posCol(p) + '">' + posLabel(p) + '</span></div></button>'; }).join('');
    var below = L.filter(function(r){ return posOf(r) < .5; }).length;
    document.getElementById('knVSum').textContent = below + '/' + L.length + ' mã ở nửa dưới';
  }
  var valPoll = null, valDrawn = '';
  function ensureVal(){
    var K = KN(); if (!K) return;
    var D = K.secCache[vG]; var key = vG + '|' + (D && D._k || '') + '|' + vS;
    if (D && D._k && valDrawn === key) return;          // đã vẽ rồi, không dựng lại
    renderVal(); if (D && D._k) valDrawn = key;
    if (valRows(vG)) return;
    /* chưa có trong bộ nhớ: nhờ web tính (nó tự đọc cache localStorage theo phiên trước) rồi đợi */
    try { K.secGrp = vG; if (!K.inits.compare._knDone){ K.inits.compare._knDone = 1; K.inits.compare(); } else K.drawSec(); } catch(e){}
    clearInterval(valPoll); var n = 0;
    valPoll = setInterval(function(){ n++; if (valRows(vG) || n > 120){ clearInterval(valPoll); renderVal(); var D2 = K.secCache[vG]; if (D2 && D2._k) valDrawn = vG + '|' + D2._k + '|' + vS; } }, 250);
  }
  function initCompare(){
    document.getElementById('knVSeg').addEventListener('click', function(e){ var b = e.target.closest('button'); if (!b) return;
      $$('#knVSeg button').forEach(function(x){ x.classList.toggle('on', x === b); }); vG = b.dataset.g; ensureVal(); });
    document.getElementById('knVSort').addEventListener('click', function(e){ var c = e.target.closest('.knChip'); if (!c) return;
      $$('#knVSort .knChip').forEach(function(x){ x.classList.toggle('on', x === c); }); vS = c.dataset.s; renderVal(); });
    document.getElementById('knVScat').addEventListener('click', function(e){ var g = e.target.closest('.knPt'); if (!g) return;
      $$('.knVr').forEach(function(v){ v.classList.toggle('hl', v.dataset.t === g.dataset.t); });
      var row = document.querySelector('.knVr[data-t="' + g.dataset.t + '"]'); if (row) row.scrollIntoView({behavior:'smooth', block:'center'}); });
    document.getElementById('knVList').addEventListener('click', function(e){ var b = e.target.closest('.knVr'); if (b && b.dataset.t && window.openDetail) window.openDetail(b.dataset.t); });
    renderVal();
  }

  /* ---------- 12. LEADER ---------- */
  function lbData(){
    var K = KN(); if (!K) return null;
    var sc = K.lbScores;
    if (!sc){ var c = K.knDocCache('kn_lb', K.knKhoaPhien(K.KN_MOC_LB)); if (c && c.d) sc = c.d; }
    if (!sc) return null;
    var out = Object.keys(K.LB_SECTORS).map(function(n){
      var rows = K.LB_SECTORS[n].map(function(t){ return [t, sc[t]]; }).filter(function(x){ return x[1] != null; }).sort(function(a, b){ return b[1] - a[1]; });
      var avg = rows.length ? rows.reduce(function(a, b){ return a + b[1]; }, 0) / rows.length : 0;
      return {n:n, cnt:rows.length, avg:Math.round(avg), rows:rows};
    }).filter(function(s){ return s.cnt; });
    return out;
  }
  var X0 = 100, X1 = 700, xp = function(v){ return Math.max(0, Math.min(100, (v - X0) / (X1 - X0) * 100)); };
  var tuVe = function(s){ return String(s || '').split(' ').map(function(w){ return w ? w[0] + w.slice(1).toLowerCase() : w; }).join(' '); };
  function renderLeader(){
    var LB = lbData(); var fx = document.getElementById('knLbFocus'), strip = document.getElementById('knLbStrip'); if (!fx || !strip) return;
    if (!LB){
      fx.innerHTML = '<div class="knFxL">Tiêu điểm hôm nay</div><div class="knSkel" style="height:26px;width:60%;margin-top:8px"></div><div class="knSkel" style="height:14px;width:90%;margin-top:8px"></div><div class="knSkel" style="height:10px;margin-top:14px"></div>';
      strip.innerHTML = [1,2,3,4,5,6,7,8].map(function(){ return '<div class="knSr"><div class="knSkel" style="width:80px;height:14px"></div><div class="knSrT" style="background:none"><div class="knSkel" style="position:absolute;left:0;right:0;top:12px;height:10px"></div></div><div class="knSkel" style="width:30px;height:14px"></div></div>'; }).join('');
      var note = document.getElementById('knLbNote');
      if (note) {
        /* Web tai hong (mang/API) thi noi that + cho bam tai lai, dung treo "dang tinh" mai */
        var stW = document.getElementById('lbStatus'); var tx = stW ? (stW.textContent || '') : '';
        if (/Chỉ tải được|Lỗi tải/.test(tx)) { note.innerHTML = tx.replace(/Thử lại\s*$/, '') + ' <a href="#" id="knLbLai">Thử lại</a>';
          var a = document.getElementById('knLbLai'); if (a) a.onclick = function(ev){ ev.preventDefault(); try { var K = KN(); K.lbLoad(); note.textContent = 'Đang tải lại…'; } catch(e){} }; }
        else note.textContent = 'Đang tính điểm 133 mã (lần đầu trong phiên, khoảng 20–40 giây)…';
      }
      return;
    }
    var uniq = {}, secOf = {}; LB.forEach(function(s){ s.rows.forEach(function(r){ uniq[r[0]] = r[1]; if (!secOf[r[0]] || !/VN30|MID/.test(s.n)) secOf[r[0]] = s.n; }); });
    var ALL = Object.keys(uniq).map(function(t){ return [t, uniq[t]]; }).sort(function(a, b){ return b[1] - a[1]; });
    var mkt = BANDS.map(function(b){ return ALL.filter(function(x){ return band(x[1]) === b; }).length; });
    var khaLen = mkt[2] + mkt[3] + mkt[4], khoeLen = mkt[3] + mkt[4], share = khaLen / (ALL.length || 1);
    var trangThai = share < .1 ? 'Thị trường yếu' : share < .25 ? 'Thị trường phân hóa' : share < .5 ? 'Thị trường khá' : 'Thị trường mạnh';
    var LBD = LB.slice().sort(function(a, b){ return b.avg - a.avg; });
    var tapTrung = LBD.filter(function(s){ return s.avg >= 380; }).slice(0, 2);
    var K = KN(); var stamp = (K && K.lbStamp) || ''; var ngay = (stamp.match(/Kết phiên (\S+)/) || [])[1] || '';
    fx.innerHTML = '<div class="knFxTop"><div><div class="knFxL">Tiêu điểm hôm nay' + (ngay ? ' · ' + ngay : '') + '</div><div class="knFxT">' + trangThai + '</div>'
      + '<div class="knFxS">' + khaLen + '/' + ALL.length + ' mã từ Khá trở lên · ' + mkt[0] + ' mã Yếu. Lãnh đạo dòng tiền ' + (khoeLen ? 'chỉ còn ' + khoeLen + ' mã.' : 'hiện chưa có.') + '</div></div>'
      + '<div class="knFxN"><b>' + khoeLen + '<small>/' + ALL.length + '</small></b><span>mã Khỏe trở lên</span></div></div>'
      + '<div class="knDist">' + [4,3,2,1,0].map(function(j){ return mkt[j] ? '<i style="flex:' + mkt[j] + ';background:' + BANDS[j].bg + (BANDS[j].bd ? ';box-shadow:inset 0 0 0 1px #D5DCD8' : '') + '"></i>' : ''; }).join('') + '</div>'
      + '<div class="knFxLg"><span>' + mkt[4] + ' rất khỏe · ' + mkt[3] + ' khỏe · ' + mkt[2] + ' khá</span><span>' + mkt[1] + ' trung bình · ' + mkt[0] + ' yếu</span></div>'
      + '<div class="knFxRow"><div class="knFxL">Leader</div><div class="knFxChips">' + ALL.slice(0, 8).map(function(x){ return '<button class="knLchip" data-t="' + x[0] + '" style="' + bandStyle(x[1]) + '">' + x[0] + ' <i>' + x[1] + '</i><em>' + tuVe(secOf[x[0]]) + '</em></button>'; }).join('') + '</div></div>'
      + '<div class="knFxRow"><div class="knFxL">Tập trung</div><div class="knFxFocus">' + (tapTrung.length ? tapTrung.map(function(s){ return '<b>' + tuVe(s.n) + '</b> (TB ' + s.avg + ', ' + s.rows.filter(function(r){ return r[1] >= 400; }).length + '/' + s.cnt + ' mã từ TB trở lên)'; }).join(' và ') + '. Các ngành còn lại chưa có dòng tiền dẫn dắt.' : 'Chưa có ngành nào đủ khỏe — ưu tiên giữ tiền mặt.') + '</div></div>';
    var Z = [400, 500, 550, 600].map(xp);
    ['--z1','--z2','--z3','--z4'].forEach(function(k, i){ document.documentElement.style.setProperty(k, Z[i] + '%'); });
    document.getElementById('knLbScale').innerHTML = [[250,'YẾU'],[400,'400'],[500,'500'],[600,'600'],[680,'RẤT KHỎE →']].map(function(a){ return '<span style="left:' + xp(a[0]) + '%">' + a[1] + '</span>'; }).join('');
    strip.innerHTML = LBD.map(function(s){
      var rows = s.rows.slice().sort(function(a, b){ return a[1] - b[1]; });
      var lanes = [-1e9, -1e9, -1e9, -1e9], TOP = [17, 7, 27, 12];
      var dots = rows.map(function(r){ var x = xp(r[1]); var li = 0; for (var k = 0; k < 4; k++){ if (x - lanes[k] >= 3.6){ li = k; break; } else if (lanes[k] < lanes[li]) li = k; } lanes[li] = x;
        var b = band(r[1]); return '<i class="dot" style="left:' + x.toFixed(1) + '%;top:' + TOP[li] + 'px;background:' + b.bg + (b.bd ? ';box-shadow:0 0 0 1.5px #fff,inset 0 0 0 1px #D5DCD8' : '') + '" title="' + r[0] + ' ' + r[1] + '"></i>'; }).join('');
      var top = s.rows[0], lx = xp(top[1]);
      var lead = '<span class="lead ' + (lx > 78 ? 'r' : 'l') + '" style="--x:' + (lx + (lx > 78 ? -2.2 : 2.2)).toFixed(1) + '%">' + top[0] + '</span>';
      return '<button class="knSr"><div class="knSrL"><b>' + s.n + '</b><span>' + s.cnt + ' mã · ' + s.rows.filter(function(r){ return r[1] >= 500; }).length + ' khá+</span></div>'
        + '<div class="knSrT">' + dots + '<i class="avg" style="left:' + xp(s.avg).toFixed(1) + '%"></i>' + lead + '</div>'
        + '<div class="knSrR" style="color:' + (s.avg >= 400 ? 'var(--kink)' : 'var(--kink3)') + '">' + s.avg + '</div></button>'
        + '<div class="knSrAll">' + s.rows.map(function(r){ return '<button class="knMchip" data-t="' + r[0] + '" style="' + bandStyle(r[1]) + '">' + r[0] + ' <i>' + r[1] + '</i></button>'; }).join('') + '</div>';
    }).join('');
    document.getElementById('knLbBands').innerHTML = BANDS.map(function(b){ return '<span><i style="background:' + b.bg + (b.bd ? ';box-shadow:inset 0 0 0 1px #D5DCD8' : '') + '"></i>' + b.label + ' ' + (b.max === 400 ? '&lt;400' : b.max === 1e9 ? '&gt;600' : (b.max - (b.max === 500 ? 100 : 50)) + '–' + b.max) + '</span>'; }).join('');
    var note2 = document.getElementById('knLbNote'); if (note2) note2.textContent = 'Điểm = vị trí giá trong biên độ + dòng tiền, cộng trên 4 khung 20/50/100/200 phiên, tối đa 800. Ngành xếp từ mạnh xuống yếu; chạm một ngành để xem hết mã.' + (stamp ? ' ' + stamp + '.' : '');
  }
  var lbPoll = null, lbKhoaVe = null, lbDrawn = '';
  function ensureLeader(){
    var K = KN(); if (!K) return;
    var khoa = K.knKhoaPhien(K.KN_MOC_LB);
    var have = !!lbData();
    if (have && lbKhoaVe === khoa && lbDrawn === khoa) return;   // đã vẽ đúng phiên, không dựng lại
    renderLeader(); if (have) lbDrawn = khoa;
    if (have && lbKhoaVe === khoa) return;
    lbKhoaVe = khoa;
    /* nhờ web tải/tính (nó tự đọc cache theo phiên, tự canh mốc 11h30 / sau phiên) */
    try { K.inits.leader(); } catch(e){}
    clearInterval(lbPoll); var n = 0;
    lbPoll = setInterval(function(){ n++; var d = lbData(); if ((d && K.lbScores) || n > 240){ clearInterval(lbPoll); renderLeader(); if (d) lbDrawn = khoa; } }, 500);
  }
  function initLeader(){
    var pane = document.getElementById('kn-leader');
    pane.addEventListener('click', function(e){
      var chip = e.target.closest('.knLchip,.knMchip'); if (chip && chip.dataset.t && window.openDetail){ window.openDetail(chip.dataset.t); return; }
      var b = e.target.closest('.knSr'); if (b) b.classList.toggle('open');
    });
    renderLeader();
  }

  var PANE_ON = { market:initMarket, watch:initWatch, compare:initCompare, leader:initLeader };
  var PANE_RE = { watch:function(){ loadSparks(); }, compare:function(){ ensureVal(); }, leader:function(){ ensureLeader(); }, market:function(){} };

  /* ---------- 13. CHI TIẾT MÃ: đầu trang FinBox + dải kỳ + nhịp đồng bộ ---------- */
  var dhFor = null, dhPx = null, rangeFor = null, rangeN = 65, proSeen = null;
  function buildDetailBits(){
    var vd = document.getElementById('view-detail'); if (!vd) return;
    var card = vd.querySelector('.card'); if (!card) return;
    if (!document.getElementById('knDHead')){
      var h = document.createElement('div'); h.id = 'knDHead';
      card.insertBefore(h, card.firstChild);
      var r = document.createElement('div'); r.id = 'knRange';
      r.innerHTML = '<div class="knSeg"><button data-n="9999">Tất cả</button><button class="on" data-n="65">3 tháng</button><button data-n="130">6 tháng</button><button data-n="250">1 năm</button></div>';
      r.addEventListener('click', function(e){ var b = e.target.closest('button'); if (!b) return;
        $$('button', r).forEach(function(x){ x.classList.toggle('on', x === b); }); rangeN = +b.dataset.n; applyRange(); });
      card.insertBefore(r, h.nextSibling);
    }
    /* thứ tự trong thẻ: watchStrip (nếu có) -> đầu trang -> dải kỳ -> chart */
    var ws = document.getElementById('watchStrip');
    if (ws && ws.parentElement !== card) card.insertBefore(ws, card.firstChild);
    var rg = document.getElementById('dRanges');
    if (rg){ var row = rg.parentElement; if (row && row !== card && row.parentElement === card) row.style.display = 'none'; }
    if (vd.style.height) vd.style.height = '';
  }
  function renderDHead(){
    var K = KN(); var h = document.getElementById('knDHead'); if (!K || !h) return;
    var t = K.curT; if (!t) return;
    var r = K.XROW(t) || {t:t}; var oh = K.curOhlc;
    var n = oh && oh.c ? oh.c.length : 0;
    var p = r.p != null ? r.p : (n ? oh.c[n-1] : null);
    var chg = r.chg != null ? r.chg : (n > 1 ? (oh.c[n-1]/oh.c[n-2]-1)*100 : null);
    var vol = null, vx = null;
    if (r.vx != null && r.v20) { vol = Math.round(r.vx * r.v20); vx = Math.round(r.vx * 100); }
    else if (n) { vol = oh.v[n-1]; var sm = 0, c = 0; for (var k = Math.max(0, n-20); k < n; k++){ sm += oh.v[k] || 0; c++; } if (c && sm) vx = Math.round((oh.v[n-1]||0) / (sm/c) * 100); }
    var key = t + '|' + p + '|' + chg + '|' + vol;
    if (dhFor === t && dhPx === key) return;
    var first = dhFor !== t; dhFor = t; dhPx = key;
    var av = h.querySelector('.av');
    if (first || !av){
      h.innerHTML = '<div class="r1"><div class="av"><span>' + esc(t) + '</span></div>'
        + '<div class="nm"><b>' + esc(t) + '<span>' + esc(K.BRD(r.b)) + '</span></b><div class="knSub">' + esc(shortName(r.n || '')) + '</div></div>'
        + '<div class="pr"><div class="big"></div><div class="vol"></div></div></div>';
      var img = new Image();
      img.onload = function(){ var d = h.querySelector('.av'); if (d && dhFor === t){ d.innerHTML = ''; d.appendChild(img); } };
      img.src = 'https://cdn.simplize.vn/simplizevn/logo/' + t + '.jpeg';
    }
    var big = h.querySelector('.big'), volEl = h.querySelector('.vol');
    big.className = 'big ' + cls(chg);
    big.innerHTML = (p == null ? '—' : vn(p, 2)) + ' <span>(' + pct(chg) + ')</span>';
    volEl.innerHTML = 'KL: ' + (vol == null ? '—' : Math.round(vol).toLocaleString('vi-VN')) + (vx != null ? ' <b>(' + vx + '% TB20)</b>' : '');
  }
  /* Mặc định nhìn vào là thấy 3 tháng gần nhất nến to rõ (như FinBox); kéo sang trái là về quá khứ.
     Web đặt 130 nến ở 0/150/600ms sau khi dựng chart -> mình đặt lại sau đó. */
  function applyRange(){
    var K = KN(); var ch = K && K.proChart; if (!ch || !K.curOhlc) return;
    try {
      var n = K.curOhlc.t.length;
      /* chừa ~8 nến trống bên trái để nhãn Mua/B★ không bị logo TradingView che */
      if (rangeN >= 9999) ch.timeScale().setVisibleLogicalRange({ from: -8, to: n + 2 });
      else ch.timeScale().setVisibleLogicalRange({ from: n - rangeN - 8, to: n + 2 });
    } catch(e){}
  }
  function detailTick(){
    var K = KN(); if (!K) return;
    var vd = document.getElementById('view-detail');
    if (!vd || vd.style.display === 'none') return;
    buildDetailBits();
    renderDHead();
    var ch = K.proChart;
    if (ch && ch !== proSeen){ proSeen = ch; rangeFor = K.curT;
      $$('#knRange button').forEach(function(x){ x.classList.toggle('on', +x.dataset.n === rangeN); });
      setTimeout(applyRange, 60); setTimeout(applyRange, 700); setTimeout(applyRange, 1300); }
  }
  function hookEngine(){
    if (typeof window.showView !== 'function'){ setTimeout(hookEngine, 120); return; }
    if (window.__knHooked) return; window.__knHooked = true;
    var orig = window.showView;
    window.showView = function(v, skip){
      var r; try { r = orig.apply(this, arguments); } catch(e){}
      /* web tự gọi showView('detail'/'screener') (mở mã, mở bộ lọc) -> vỏ app theo */
      if (v && !NATIVE[v] && cur !== v){ showPane('none'); cur = v; setActive(v); }
      return r;
    };
    if (typeof window.openDetail === 'function' && !window.__knOdHooked){
      window.__knOdHooked = true;
      var od = window.openDetail;
      window.openDetail = function(t){
        if (cur !== 'detail') rememberScroll();
        showPane('none');
        var r; try { r = od.apply(this, arguments); } catch(e){}
        cur = 'detail'; setActive('detail'); scrollMem.detail = 0;
        try { window.scrollTo(0, 0); } catch(e){}
        buildDetailBits(); renderDHead();
        requestAnimationFrame(function(){ window.scrollTo(0, 0); buildDetailBits(); renderDHead(); });
        setTimeout(function(){ window.scrollTo(0, 0); buildDetailBits(); renderDHead(); }, 260);
        return r;
      };
    }
  }

  /* ---------- 14. Header / tab bar / kéo tải lại ---------- */
  function build(){
    if (document.getElementById('knTabbar')) return;
    var bar = document.createElement('nav'); bar.id = 'knTabbar'; bar.setAttribute('aria-label','Điều hướng ứng dụng');
    TABS.forEach(function(t){
      var b = document.createElement('button'); b.className = 'knTab'; b.dataset.view = t.v;
      b.innerHTML = '<span class="knIco knIcoA">'+t.icon+'</span><span class="knIco knIcoB">'+t.ico2+'</span><span class="knLbl">'+t.label+'</span>';
      b.addEventListener('click', function(){ go(t.v); });
      bar.appendChild(b);
    });
    document.body.appendChild(bar);
  }
  function buildHeader(){
    var tb = document.querySelector('.topbar-in');
    if (!tb || document.getElementById('knBack')) return;
    var back = document.createElement('button'); back.id = 'knBack'; back.className = 'knIcoBtn'; back.setAttribute('aria-label','Quay lại'); back.innerHTML = IC.back;
    back.addEventListener('click', goBack); tb.insertBefore(back, tb.firstChild);
    var title = document.createElement('div'); title.id = 'knSecTitle'; tb.insertBefore(title, back.nextSibling);
    /* tìm kiếm: icon -> bung ô nhập của web (có gợi ý sẵn) */
    var sb = document.createElement('button'); sb.id = 'knSearch'; sb.className = 'knIcoBtn'; sb.setAttribute('aria-label','Tìm mã'); sb.innerHTML = IC.search;
    sb.addEventListener('click', function(){ document.documentElement.classList.add('kn-search'); var q = document.getElementById('navQ'); if (q){ setTimeout(function(){ q.focus(); }, 30); } });
    tb.appendChild(sb);
    var sx = document.createElement('button'); sx.id = 'knSearchX'; sx.textContent = 'Hủy';
    sx.addEventListener('click', function(){ document.documentElement.classList.remove('kn-search'); var q = document.getElementById('navQ'); if (q){ q.value = ''; q.blur(); } var s = document.getElementById('navSugg'); if (s) s.style.display = 'none'; });
    var box = tb.querySelector('.searchbox'); if (box && box.nextSibling) tb.insertBefore(sx, box.nextSibling); else tb.appendChild(sx);
    document.addEventListener('click', function(e){ if (e.target.closest('#navSugg div')) setTimeout(function(){ sx.click(); }, 50); });
    var filt = document.createElement('button'); filt.id = 'knFilter'; filt.className = 'knIcoBtn'; filt.setAttribute('aria-label','Bộ lọc cổ phiếu'); filt.innerHTML = IC.filter;
    filt.addEventListener('click', function(){ go('screener'); }); tb.appendChild(filt);
    var bell = document.createElement('button'); bell.id = 'knBell'; bell.className = 'knIcoBtn'; bell.innerHTML = IC.bell;
    function bellState(){
      var daDK = (typeof window.knDaDangKy === 'function') && window.knDaDangKy();
      bell.classList.toggle('on', daDK);
      bell.setAttribute('aria-label', daDK ? 'Gửi thử thông báo' : 'Đăng ký nhận tín hiệu');
    }
    var hold = null, daGiu = false;
    bell.addEventListener('touchstart', function(){ daGiu = false; hold = setTimeout(function(){ daGiu = true; if (typeof window.knLayMaThietBi === 'function') window.knLayMaThietBi(); }, 700); }, {passive:true});
    bell.addEventListener('touchend', function(){ clearTimeout(hold); }, {passive:true});
    bell.addEventListener('touchmove', function(){ clearTimeout(hold); daGiu = true; }, {passive:true});
    bell.addEventListener('click', function(e){
      if (daGiu){ daGiu = false; return; }
      if (e.altKey && typeof window.knLayMaThietBi === 'function'){ window.knLayMaThietBi(); return; }
      var daDK = (typeof window.knDaDangKy === 'function') && window.knDaDangKy();
      if (!daDK && typeof window.knDangKyNhanTinHieu === 'function'){ window.knDangKyNhanTinHieu(); setTimeout(bellState, 1500); return; }
      if (('Notification' in window) && Notification.permission === 'granted' && typeof window.knTestNotify === 'function'){ window.knTestNotify(); return; }
      var b = document.getElementById('notifBtn'); if (b) b.click();
      setTimeout(bellState, 800);
    });
    tb.appendChild(bell); bellState(); setInterval(bellState, 2000);
  }
  function reshapeScreener(){
    var view = document.getElementById('view-screener'); if (!view) return;
    var filters = view.querySelector('.filters'); if (!filters || filters.dataset.knDone === '1') return;
    var pills = view.querySelector('div[style*="flex-wrap:wrap"]'); if (!pills || !pills.querySelector('.pill')) return;
    filters.dataset.knDone = '1';
    pills.id = 'knPresets'; pills.removeAttribute('style'); filters.parentNode.insertBefore(pills, filters);
    var btn = document.createElement('button'); btn.type = 'button'; btn.id = 'knScrToggle';
    btn.innerHTML = '<span><span class="lbl">Bộ lọc nâng cao</span></span><span class="car">⌄</span>';
    filters.parentNode.insertBefore(btn, filters); filters.classList.add('knHidden');
    btn.addEventListener('click', function(){ var open = filters.classList.toggle('knHidden') === false; document.documentElement.classList.toggle('knScrOpen', open); });
    function count(){ var n = 0; filters.querySelectorAll('input,select').forEach(function(f){ if (f.value) n++; });
      var old = btn.querySelector('.cnt'); if (old) old.remove();
      if (n){ var s = document.createElement('span'); s.className = 'cnt'; s.textContent = n; btn.querySelector('span').appendChild(s); } }
    filters.addEventListener('input', count); filters.addEventListener('change', count);
    var clear = filters.querySelector('#fClear'); if (clear) clear.addEventListener('click', function(){ setTimeout(count, 0); });
    count();
  }
  function buildPtr(){
    if (document.getElementById('knPtr')) return;
    var ind = document.createElement('div'); ind.id = 'knPtr';
    ind.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M6 13l6 6 6-6"/></svg>';
    document.body.appendChild(ind);
    var y0 = null, active = false, MAX = 96, TRIG = 92;
    function top(){ return window.pageYOffset || document.documentElement.scrollTop || 0; }
    addEventListener('touchstart', function(e){ if (top() > 0 || e.touches.length !== 1){ y0 = null; return; } y0 = e.touches[0].clientY; active = false; }, {passive:true});
    addEventListener('touchmove', function(e){ if (y0 === null) return; var dy = e.touches[0].clientY - y0;
      if (dy <= 0){ if (active){ ind.style.height = '0px'; active = false; } return; }
      if (top() > 0){ y0 = null; return; } active = true; var h = Math.min(MAX, dy * .55); ind.style.height = h + 'px'; ind.classList.toggle('ready', dy >= TRIG); }, {passive:true});
    addEventListener('touchend', function(){ if (!active){ y0 = null; return; } var fire = ind.classList.contains('ready'); ind.classList.remove('ready');
      if (fire){ ind.classList.add('load'); ind.style.height = '36px'; setTimeout(function(){ location.reload(); }, 260); } else ind.style.height = '0px';
      y0 = null; active = false; }, {passive:true});
  }

  /* ---------- 15. Khởi động ---------- */
  function waitKN(fn, n){ n = n || 0; if (window.KN && window.KN.ROWS) return fn(); if (n > 100) return; setTimeout(function(){ waitKN(fn, n + 1); }, 50); }
  onReady(function(){
    build(); buildHeader(); buildPtr(); buildPanes(); hookEngine();
    waitKN(function(){
      /* Web dựng tab Hiệu suất của nó (Chart.js + bảng tháng, ~200ms trên máy chậm) ngay khi
         giá về. Trong app khối đó nằm ẩn -> đẩy sang lúc rảnh để không khựng khi đang cuộn/bấm. */
      try {
        var K = window.KN, origM = K.inits.market;
        if (origM && !origM._knIdle){
          var w = function(){ var self = this, args = arguments;
            return new Promise(function(res){ var run = function(){ try { res(origM.apply(self, args)); } catch(e){ res(); } };
              if (window.requestIdleCallback) requestIdleCallback(run, {timeout: 2500}); else setTimeout(run, 600); }); };
          w._knIdle = 1; K.inits.market = w;
        }
      } catch(e){}
      /* mở app: Hiệu suất hiện ngay từ dữ liệu có sẵn, không đợi mạng */
      go('market');
      /* các pane còn lại dựng ngầm khi rảnh -> chuyển tab không phải dựng gì nữa */
      var idle = window.requestIdleCallback || function(f){ setTimeout(f, 200); };
      idle(function(){ ['watch','leader','compare'].forEach(function(v){ if (!paneInit[v]){ paneInit[v] = 1; try { PANE_ON[v](); } catch(e){} } }); });
    });
    reshapeScreener();
    var t;
    new MutationObserver(function(){ clearTimeout(t); t = setTimeout(reshapeScreener, 80); }).observe(document.body, {childList:true, subtree:true});
    /* nhịp 500ms: đồng bộ đầu trang Chi tiết + giá mới sau liveQuote (rẻ: chỉ đọc biến) */
    setInterval(function(){
      try { detailTick(); } catch(e){}
      try { var ld = window.LIVE_DATE || null; if (ld && ld !== lastLiveDate){ lastLiveDate = ld; if (paneInit.watch) refreshWatch(); } } catch(e){}
    }, 500);
    addEventListener('scroll', function(){ clearTimeout(rememberScroll._t); rememberScroll._t = setTimeout(rememberScroll, 120); }, {passive:true});
  });
})();
