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

  /* Bản ĐẶC của 5 icon tab — bật khi tab đang mở (nếp iOS: active = icon đặc) */
  function svgf(inner){
    return '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="24" height="24">'+inner+'</svg>';
  }
  var ICF = {
    watch:  svgf('<path d="M12 2.6l2.82 5.72 6.31.92-4.57 4.45 1.08 6.29L12 16.93l-5.64 2.97 1.08-6.29-4.57-4.45 6.31-.92z"/>'),
    detail: svgf('<rect x="3" y="18.9" width="18" height="1.9" rx=".95"/>'
               + '<rect x="6.1" y="9.4" width="3.8" height="7.4" rx="1.1"/><rect x="7.6" y="6.6" width=".8" height="12.6" rx=".4"/>'
               + '<rect x="14.1" y="5.4" width="3.8" height="8.2" rx="1.1"/><rect x="15.6" y="3.2" width=".8" height="12.4" rx=".4"/>'),
    market: svgf('<path d="M3.2 20.8h17.6V5.6l-7.3 7.3-3.7-3.7-6.6 6.6z"/>'),
    fund:   svgf('<path d="M11 3.05A9 9 0 1 0 20.95 13H11z"/><path d="M13 2.2V11h8.8A9 9 0 0 0 13 2.2z" opacity=".5"/>'),
    leader: svgf('<rect x="9.4" y="8.4" width="5.2" height="11.6" rx="1.1"/>'
               + '<rect x="3" y="12.6" width="5.2" height="7.4" rx="1.1"/>'
               + '<rect x="15.8" y="10.8" width="5.2" height="9.2" rx="1.1"/>'
               + '<path d="M12 2.3l.87 1.77 1.95.28-1.41 1.37.33 1.94L12 6.72l-1.74.94.33-1.94-1.41-1.37 1.95-.28z"/>')
  };

  /* ---------- 3. Khai báo tab ----------
     5 tab chính theo yêu cầu: Hiệu suất (giữa, nổi) · Watchlist ·
     Chi tiết mã · Fund Insight · Leader Board.
     Bộ lọc + So sánh = trang phụ (push) mở từ icon phễu trên header.
     Bài viết: BỎ hẳn khỏi app. */
  var TABS = [
    { v:'watch',  label:'Watchlist', icon:IC.watch,  ico2:ICF.watch  },
    { v:'detail', label:'Chi tiết',  icon:IC.detail, ico2:ICF.detail },
    { v:'market', label:'Hiệu suất', icon:IC.market, ico2:ICF.market },
    { v:'fund',   label:'Fund',      icon:IC.fund,   ico2:ICF.fund   },
    { v:'leader', label:'Leader',    icon:IC.leader, ico2:ICF.leader }
  ];
  var PRIMARY = {watch:1, detail:1, market:1, fund:1, leader:1};
  var SEC_TITLE = {screener:'Bộ lọc cổ phiếu', compare:'So sánh mã', news:'Bài viết'};

  /* ---------- 4. CSS vỏ app ---------- */
  var css = document.createElement('style'); css.id = 'knAppCss';
  css.textContent =
  /* ===== nền tảng ===== */
    'html.kn-app{-webkit-text-size-adjust:100%}'
  /* Nền xám để các thẻ trắng nổi lên — đây là thứ làm app "ra app" nhất */
  + '.kn-app body{overscroll-behavior-y:contain;touch-action:manipulation;'
  +   '-webkit-tap-highlight-color:transparent;background:#EEF0F3!important;'
  +   'padding-bottom:calc(62px + env(safe-area-inset-bottom,0px))!important}'
  /* ===== topbar ===== */
  + '.kn-app .topbar{padding-top:env(safe-area-inset-top,0px);border-bottom:0;'
  +   'background:rgba(255,255,255,.92);'
  +   '-webkit-backdrop-filter:saturate(180%) blur(18px);backdrop-filter:saturate(180%) blur(18px);'
  +   'box-shadow:0 .5px 0 rgba(16,24,40,.12)}'
  + '.kn-app .topbar-in nav{display:none!important}'
  + '.kn-app #btnOpenKafi{display:none!important}'
  + '.kn-app .topbar-in{height:auto;padding:8px 10px;gap:7px}'
  + '.kn-app .logo{font-size:0;gap:0;user-select:none;-webkit-user-select:none}'
  + '.kn-app .logo .logo-mark{flex:none;font-size:15px;width:31px;height:31px;border-radius:9px}'
  + '.kn-app .logo .sub{display:none}'
  /* ô tìm kiếm kiểu iOS: nền xám đặc, không viền */
  + '.kn-app .searchbox{flex:1;min-width:0;padding:8px 12px;border:0;background:#EDEFF3;border-radius:11px}'
  + '.kn-app .searchbox:focus-within{background:#E6E9EE}'
  + '.kn-app .searchbox svg{width:16px;height:16px}'
  + '.kn-app .searchbox input{font-size:15px;min-width:0}'
  /* nút icon trên header: bỏ vòng tròn viền (dấu hiệu "web") */
  + '.kn-app .knIcoBtn{flex:none;width:34px;height:34px;border-radius:50%;border:0;'
  +   'background:transparent;display:flex;align-items:center;justify-content:center;color:#39414E;'
  +   'cursor:pointer;padding:0;transition:transform .12s,background .12s}'
  + '.kn-app .knIcoBtn:active{transform:scale(.88);background:rgba(16,24,40,.06)}'
  + '.kn-app .knIcoBtn svg{width:21px;height:21px}'
  + '.kn-app #knBell.on{color:#18A34B}'
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
  + '.kn-app .wrap{padding:10px 0 16px 0}'
  /* Thẻ trắng bo góc, nổi trên nền xám — thay cho kiểu tràn viền cũ */
  + '.kn-app .card{background:#fff;border:0;border-radius:15px;margin:0 11px 10px;padding:14px 13px;'
  +   'box-shadow:0 1px 2px rgba(16,24,40,.05),0 4px 14px rgba(16,24,40,.045)}'
  + '.kn-app .card h2{text-align:left!important;letter-spacing:-.01em!important;text-transform:none!important;'
  +   'font-size:15.5px;font-weight:800}'
  + '.kn-app table{font-size:13px}'
  + '.kn-app th,.kn-app td{padding:10px 8px}'
  + '.kn-app table tr.row{transition:background .12s}'
  + '.kn-app table tr.row:active{background:#EEF6F0}'
  /* chuyển tab: trượt nhẹ + mờ dần (chỉ transform/opacity -> chạy trên GPU) */
  /* nhẹ thôi: mờ 25% như trước nhìn giống tải lại trang */
  + '@keyframes knViewIn{from{opacity:.72;transform:translateY(4px)}to{opacity:1;transform:none}}'
  + '.kn-app .knAnim{animation:knViewIn .15s ease-out}'
  + '@media (prefers-reduced-motion:reduce){.kn-app .knAnim{animation:none}}'
  /* ===== Hiệu suất ===== */
  + '.kn-app #view-market div[style*="565"]{height:360px!important}'
  + '.kn-app #recentTbl td,.kn-app #recentWrap td{padding:11px 8px}'
  /* dải chọn khoảng thời gian: 1 hàng, cuộn ngang */
  + '.kn-app .seg{display:flex;flex-wrap:nowrap;overflow-x:auto;max-width:100%;'
  +   '-ms-overflow-style:none;scrollbar-width:none}'
  + '.kn-app .seg::-webkit-scrollbar{display:none}'
  + '.kn-app .seg{width:100%;border-radius:11px;padding:3px}'
  + '.kn-app .seg button{flex:1 0 auto;white-space:nowrap;padding:7px 9px;font-size:12px;border-radius:9px}'
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
  /* ===== Chi tiết mã: bố cục kiểu app (giống FinBox) =====
     Trước: #view-detail bị ép thành khung cao cố định, #dPanel có flex:none nên
     KHÔNG co lại -> nó đẩy cột chart teo dần, cuối cùng chỉ còn thấy khối lượng.
     Giờ: bỏ khung cố định, trang cuộn bình thường, thứ tự = giá -> chart to -> tab. */
  /* KHÔNG dùng !important cho display ở các khối app bật/tắt bằng style inline
     (#view-detail, #dBody, #chartProWrap) — nếu ép, tab Chi tiết sẽ dính lại
     trên mọi tab khác. Chỉ cần độ ưu tiên .kn-app #id là đã thắng #id của bản gốc. */
  + '.kn-app #view-detail{display:block;height:auto!important;overflow:visible!important}'
  + '.kn-app #dBody{display:block}'
  + '.kn-app #view-detail>.card,.kn-app #dBody>.card{display:block;overflow:visible!important;'
  +   'padding:0 0 4px!important}'
  + '.kn-app #dFlex{display:block;min-height:0!important}'
  + '.kn-app #dFlex>div:first-child{display:block;min-height:0!important}'
  /* ô tìm kiếm riêng của trang này: bỏ, vì thanh trên cùng đã có ô tìm kiếm */
  + '.kn-app #view-detail .search-wrap{display:none!important}'
  + '.kn-app #dTitle{display:none!important}'
  /* khối giá (logo tròn + mã + tên + giá lớn) được JS đưa lên đầu thẻ */
  + '.kn-app #dHead{order:-3;margin:0 0 2px!important;padding:13px 13px 0}'
  + '.kn-app #dHead #dPx{margin:9px 0 0!important}'
  /* dải chọn khung thời gian ngay trên chart */
  + '.kn-app #dRanges{order:-2;padding:0 13px;flex-wrap:nowrap;overflow-x:auto;'
  +   '-ms-overflow-style:none;scrollbar-width:none}'
  + '.kn-app #dRanges::-webkit-scrollbar{display:none}'
  + '.kn-app #dRanges>*{flex:none}'
  /* chart: cao, tràn sát 2 mép thẻ */
  + '.kn-app #chartProWrap{display:block;height:auto!important;margin:9px 0 0}'
  + '.kn-app #proK{display:block;height:auto!important;flex:none!important}'
  + '.kn-app #proPx{height:336px!important;flex:none!important;min-height:0!important}'
  + '.kn-app #proVolPane{height:116px!important;flex:none!important;min-height:0!important}'
  + '.kn-app #proVolLegend{top:342px!important;bottom:auto!important}'
  + '.kn-app #chartSigWrap{margin:9px 0 0}'
  /* dải mã watchlist ở đầu trang Chi tiết: đồng bộ với kiểu thẻ mới */
  + '.kn-app #watchStrip{border:0!important;border-radius:13px!important;margin:0 11px 9px!important;'
  +   'padding:7px 11px!important;box-shadow:0 1px 2px rgba(16,24,40,.05),0 4px 14px rgba(16,24,40,.045)!important;'
  +   '-ms-overflow-style:none}'
  + '.kn-app #watchStrip::-webkit-scrollbar{display:none}'
  /* khối tab con nằm dưới chart, cao tự nhiên, không tự cuộn bên trong nữa */
  + '.kn-app #dPanel{width:auto!important;flex:none!important;overflow:visible!important;'
  +   'max-height:none!important;border:0!important;border-radius:0!important;'
  +   'padding:14px 13px 0!important;margin-top:4px}'
  + '.kn-app #finFull{border:0!important;padding:0!important}'
  /* ===== dải tab con (Chi tiết mã): 1 hàng cuộn ngang, gạch chân bám chữ ===== */
  + '.kn-app #dTabs{display:flex;flex-wrap:nowrap;overflow-x:auto;gap:20px;'
  +   'border-bottom:1px solid #EDEFF2;margin:0 -13px 12px;padding:0 13px;'
  +   '-ms-overflow-style:none;scrollbar-width:none}'
  + '.kn-app #dTabs::-webkit-scrollbar{display:none}'
  + '.kn-app #dTabs .dtab{flex:none;white-space:nowrap;margin-right:0;padding:9px 0;'
  +   'font-size:13.5px;font-weight:700;border-bottom-width:2.5px}'
  + '.kn-app #dTabs .dtab.active{color:#1F2937}'
  /* ===== Fund Insight ===== */
  + '.kn-app #fiSplit{grid-template-columns:1fr!important}'
  + '.kn-app #view-fund .fiC,.kn-app #fiHero{border-left:0;border-right:0;border-radius:15px;'
  +   'margin-left:11px;margin-right:11px}'
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
  + '.kn-app #nameBar{position:static!important;border-top:0!important;border-radius:15px;'
  +   'margin:2px 11px 10px!important;padding:14px 13px!important;'
  +   'box-shadow:0 1px 2px rgba(16,24,40,.05),0 4px 14px rgba(16,24,40,.045)!important}'
  /* ===== tab bar ===== */
  /* 5 tab bằng nhau, không còn nút tròn nổi ở giữa.
     Tab đang mở: icon ĐẶC + chữ xanh (đúng nếp app iOS). */
  + '#knTabbar{position:fixed;left:0;right:0;bottom:0;z-index:9000;'
  +   'display:grid;grid-template-columns:repeat(5,1fr);'
  +   'background:rgba(255,255,255,.92);'
  +   '-webkit-backdrop-filter:saturate(180%) blur(18px);backdrop-filter:saturate(180%) blur(18px);'
  +   'border-top:.5px solid rgba(16,24,40,.13);'
  +   'padding-bottom:env(safe-area-inset-bottom,0px);'
  +   'font-family:Inter,system-ui,-apple-system,sans-serif}'
  + '#knTabbar .knTab{position:relative;background:none;border:0;cursor:pointer;'
  +   'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;'
  +   'gap:3px;padding:7px 2px 6px;color:#98A0AC;font-size:10px;font-weight:600;'
  +   'line-height:1;-webkit-tap-highlight-color:transparent;'
  +   'transition:color .16s;user-select:none;-webkit-user-select:none}'
  + '#knTabbar .knTab .knIco{display:block;height:24px}'
  + '#knTabbar .knTab svg{display:block;width:24px;height:24px}'
  + '#knTabbar .knTab .knIcoB{display:none}'
  + '#knTabbar .knTab:active .knIco{transform:scale(.88);transition:transform .1s}'
  + '#knTabbar .knTab.active{color:#18A34B;font-weight:700}'
  + '#knTabbar .knTab.active .knIcoA{display:none}'
  + '#knTabbar .knTab.active .knIcoB{display:block;animation:knPop .22s cubic-bezier(.34,1.5,.5,1)}'
  + '@keyframes knPop{from{transform:scale(.78)}to{transform:none}}'
  + '@media (prefers-reduced-motion:reduce){#knTabbar .knTab.active .knIcoB{animation:none}}'
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
  var VIEWS = ['watch','detail','market','screener','leader','compare','news','fund'];

  function curView(){
    var found = null;
    VIEWS.forEach(function(v){
      var el = document.getElementById('view-'+v);
      if (el && el.style.display !== 'none' && el.offsetParent !== null) found = v;
    });
    return found;
  }
  /* Bản nhanh: chỉ đọc style ghi thẳng trên thẻ (showView đặt display:none/'').
     Không đụng offsetParent nên KHÔNG ép trình duyệt tính lại layout —
     dùng cho những chỗ chạy lặp lại liên tục. */
  function curViewNhanh(){
    for (var i = 0; i < VIEWS.length; i++){
      var el = document.getElementById('view-'+VIEWS[i]);
      if (el && el.style.display !== 'none') return VIEWS[i];
    }
    return null;
  }
  function rememberScroll(){
    var v = curViewNhanh();
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
  /* Hiệu ứng vào tab.
     Cách cũ (bỏ class -> đọc offsetWidth -> thêm class) ép trình duyệt tính lại
     layout NGAY trong lúc ngón tay vừa nhấc — với tab Hiệu suất (1.612 phần tử)
     riêng động tác đó đã tốn ~80ms. Dùng Web Animations API thì không cần ép,
     và hiệu ứng chạy thẳng trên trình tổng hợp ảnh. */
  function animateIn(view){
    var el = document.getElementById('view-'+view);
    if (!el || typeof el.animate !== 'function') return;
    try {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      el.animate([{ opacity: .72, transform: 'translateY(4px)' },
                  { opacity: 1,   transform: 'none' }],
                 { duration: 150, easing: 'ease-out' });
    } catch(e){}
  }
  /* ---------- 5b. Chuyển tab HAI PHA ----------
     Đo trên CPU chậm 4x (gần với iPhone chạy PWA):
        showView(v)            -> 82-87ms  (vì nó chạy lại inits[v](), dựng lại
                                  toàn bộ nội dung tab, ra DOM y hệt: 461->461,
                                  1612->1612 phần tử — tức là dựng lại thứ đã có)
        showView(v, true)      ->  2ms     (chỉ đổi hiển thị)
     82ms chặn luồng chính ngay lúc ngón tay nhấc lên = cảm giác "khựng, như tải lại".

     Cách làm mới: PHA 1 đổi hiển thị rồi để trình duyệt vẽ ngay (2ms, tức thì);
     PHA 2 chạy inits[v]() SAU khi đã vẽ xong, nên người dùng không phải chờ.
     Dữ liệu vẫn được làm mới đầy đủ, không bỏ sót lần nào. */
  var phienTab = 0;
  function coNoiDung(view){
    var el = document.getElementById('view-'+view);
    return !!(el && el.firstElementChild);
  }
  function hienTab(view, xong){
    var phien = ++phienTab;
    /* Lần đầu vào tab: chưa có gì để hiện -> dựng ngay, không thì thấy trang trắng */
    if (!coNoiDung(view)) {
      try { window.showView(view); } catch(e){}
      if (xong) xong();
      return;
    }
    try { window.showView(view, true); } catch(e){}      // PHA 1
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){                   // đã vẽ xong màn hình mới
        if (phien !== phienTab) return;                   // người dùng đã sang tab khác
        if (curViewNhanh() !== view) return;
        /* tắt gtag trong đúng lời gọi này để Analytics không đếm 2 lần 1 lần chuyển tab */
        var g = window.gtag; window.gtag = null;
        try { window.showView(view); } catch(e){}         // PHA 2: làm mới nội dung
        window.gtag = g;
        if (xong) xong();
      });
    });
  }

  function go(view){
    /* curViewNhanh() chỉ đọc style ghi thẳng trên thẻ -> không ép tính layout.
       curView() cũ gọi offsetParent, mà go() gọi nó 2 lần = 2 lần ép tính. */
    var same = curViewNhanh() === view;
    if (!same) rememberScroll();
    var y = same ? 0 : (scrollMem[view] || 0);
    hienTab(view, function(){ if (!same) window.scrollTo(0, y); });
    setActive(view);
    if (same){
      /* bấm lại tab đang mở -> lên đầu trang (nếp iOS) */
      try { window.scrollTo({top:0, behavior:'smooth'}); } catch(e){ window.scrollTo(0,0); }
    } else {
      requestAnimationFrame(function(){ window.scrollTo(0, y); });
      animateIn(view);
    }
  }
  function goBack(){ go(lastPrimary || 'market'); }

  /* ---------- 4b. Chi tiết mã: đưa khối giá lên đầu, ngay trên chart ----------
     Bản gốc để #dHead (logo + mã + giá) nằm trong #dPanel, tức là DƯỚI chart.
     App thật thì giá phải nằm trên cùng. Ở đây chỉ di chuyển phần tử, không
     đụng gì tới nội dung do dashboard_app.js dựng ra. */
  function xepLaiChiTiet(){
    try {
      var vd = document.getElementById('view-detail');
      if (!vd || vd.style.display === 'none') return;
      var card = vd.querySelector('.card'); if (!card) return;

      var head = document.getElementById('dHead');
      if (head && head.parentElement !== card) card.insertBefore(head, card.firstChild);

      /* hàng chứa #dRanges (chọn khung thời gian) -> ngay dưới khối giá */
      var rg = document.getElementById('dRanges');
      if (rg){
        var row = rg.parentElement;
        if (row && row !== card && row.parentElement === card && head && row.previousElementSibling !== head)
          card.insertBefore(row, head.nextSibling);
      }
      /* gỡ chiều cao cố định mà khối __fbx đặt vào (nó chạy lại mỗi 1,2 giây) */
      if (vd.style.height) vd.style.height = '';
    } catch(e){}
  }
  /* dashboard_app.js gọi showView(...) TRỰC TIẾP ở nhiều chỗ (mở mã, Fund,
     Leader, So sánh...). Những lời gọi đó không đi qua window.showView nên
     lớp vỏ không biết -> tab bar sáng sai tab. Đồng bộ lại theo view đang hiện. */
  function dongBoTab(){
    try {
      var v = curViewNhanh();
      if (!v) return;
      var bar = document.getElementById('knTabbar'); if (!bar) return;
      var dang = null;
      Array.prototype.forEach.call(bar.children, function(b){
        if (b.classList.contains('active')) dang = b.dataset.view;
      });
      if (dang !== v) setActive(v);
    } catch(e){}
  }
  var nhipXep = 0;
  function batNhipXep(){
    if (nhipXep) return;
    nhipXep = setInterval(function(){ dongBoTab(); xepLaiChiTiet(); }, 500);
  }

  function build(){
    if (document.getElementById('knTabbar')) return;
    var bar = document.createElement('nav');
    bar.id = 'knTabbar';
    bar.setAttribute('aria-label','Điều hướng ứng dụng');
    TABS.forEach(function(t){
      var b = document.createElement('button');
      b.className = 'knTab';
      b.dataset.view = t.v;
      b.innerHTML = '<span class="knIco knIcoA">'+t.icon+'</span>'
                  + '<span class="knIco knIcoB">'+t.ico2+'</span>'
                  + '<span class="knLbl">'+t.label+'</span>';
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
    bell.innerHTML = IC.bell;
    /* Chuong LUON hien:
         - chua cap quyen  -> bam de xin quyen (qua #notifBtn)
         - da cap quyen    -> bam de GUI THU mot thong bao, tu kiem tra duoc
                              ngay tren may khong can cam vao Mac. */
    function bellState(){
      var daDK = (typeof window.knDaDangKy === 'function') && window.knDaDangKy();
      bell.classList.toggle('on', daDK);
      bell.setAttribute('aria-label', daDK ? 'Gửi thử thông báo' : 'Đăng ký nhận tín hiệu');
      bell.title = daDK ? 'Bấm để gửi thử một thông báo' : 'Đăng ký nhận tín hiệu';
    }
    /* Bam ngan  -> gui thu mot thong bao.
       Giu lau 700ms -> lay "ma thiet bi" de dang ky nhan push khi app dong. */
    var hold = null, daGiu = false;
    bell.addEventListener('touchstart', function(){
      daGiu = false;
      hold = setTimeout(function(){
        daGiu = true;
        if (typeof window.knLayMaThietBi === 'function') window.knLayMaThietBi();
      }, 700);
    }, {passive:true});
    bell.addEventListener('touchend', function(){ clearTimeout(hold); }, {passive:true});
    bell.addEventListener('touchmove', function(){ clearTimeout(hold); daGiu = true; }, {passive:true});
    bell.addEventListener('click', function(e){
      if (daGiu){ daGiu = false; return; }
      /* Giu Alt/Option + bam = lay ma thiet bi (danh cho viec chan doan) */
      if (e.altKey && typeof window.knLayMaThietBi === 'function'){ window.knLayMaThietBi(); return; }
      /* Chua dang ky voi may chu -> mo luong nhap ma moi.
         Da dang ky roi -> bam chuong la gui thu mot thong bao. */
      var daDK = (typeof window.knDaDangKy === 'function') && window.knDaDangKy();
      if (!daDK && typeof window.knDangKyNhanTinHieu === 'function'){
        window.knDangKyNhanTinHieu(); setTimeout(bellState, 1500); return;
      }
      if (('Notification' in window) && Notification.permission === 'granted'
          && typeof window.knTestNotify === 'function') { window.knTestNotify(); return; }
      var b = document.getElementById('notifBtn');
      if (b) b.click();
      setTimeout(bellState, 800);
    });
    tb.appendChild(bell);
    bellState();
    setInterval(bellState, 2000);
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
      if (v === 'detail') try { xepLaiChiTiet(); } catch(e){}
      return r;
    };
    /* Bấm một mã ở Watchlist/Leader -> mở Chi tiết thì phải nhảy về đầu trang,
       nếu không người dùng rơi giữa chart (chỉ thấy phần khối lượng). */
    if (typeof window.openDetail === 'function' && !window.__knOdHooked){
      window.__knOdHooked = true;
      var od = window.openDetail;
      window.openDetail = function(t){
        var r; try { r = od.apply(this, arguments); } catch(e){}
        try { window.scrollTo(0, 0); } catch(e){}
        scrollMem.detail = 0;
        setActive('detail');
        xepLaiChiTiet();
        requestAnimationFrame(function(){ window.scrollTo(0, 0); xepLaiChiTiet(); });
        setTimeout(function(){ window.scrollTo(0, 0); xepLaiChiTiet(); }, 260);
        return r;
      };
    }
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

    /* ngưỡng cao hơn để vuốt nhẹ ở đầu trang không vô tình tải lại */
    var y0 = null, active = false, MAX = 96, TRIG = 92;
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
    batNhipXep();
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
