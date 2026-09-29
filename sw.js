// Service worker v2 — mo app la ve ngay tu cache, cap nhat ngam.
//   * File co ?v= (dashboard_app, app-shell, market_v2...) + thu vien CDN + font:
//       CACHE TRUOC (doi phien ban = doi URL = tu tai moi) -> mo app tuc thi.
//   * index.html (dieu huong): MANG TRUOC nhung chi cho toi da 1,2 giay,
//       qua thi lay ban cache. Mang tot -> luon moi; mang cham -> van mo ngay.
//   * File du lieu (dashboard_data, signals_data, bstar_live, tongquan_data): MANG TRUOC (bo qua cache HTTP), cho toi da
//       4 giay roi tra cache — ban mang ve muon VAN DUOC LUU (khong ket o du lieu cu).
//   * Con lai: mang truoc, loi thi cache.
//   Web va app dung chung file nay; noi dung hien thi khong doi, chi nhanh hon.
const CACHE = 'kn-shell-v2';
const DATA_RE = /dashboard_data\.js|signals_data\.js|bstar_live\.js|tongquan_data\.js/;
const CDN_RE = /^https:\/\/(unpkg\.com|cdn\.jsdelivr\.net|fonts\.gstatic\.com|fonts\.googleapis\.com)\//;

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

function luu(req, res){
  try {
    if (!res || (res.status !== 200 && res.type !== 'opaque')) return res;
    var cp = res.clone();
    caches.open(CACHE).then(function(c){ c.put(req, cp); });
  } catch(_){}
  return res;
}
// Mang truoc, cho toi da `ms`; qua han thi tra cache NGAY nhung van tai tiep va LUU ban moi cho lan sau.
// (Ban cu bo ket qua ve muon -> mang cham hon han cho la ket o ban cache cu mai mai.)
function mangTruoc(e, req, ms, tai){
  var mang = (tai || fetch(req)).then(function(r){ return luu(req, r); });
  e.waitUntil(mang.catch(function(){}));
  return new Promise(function(ok, loi){
    var xong = false;
    var t = setTimeout(function(){ caches.match(req).then(function(c){ if (!xong && c){ xong = true; ok(c); } }); }, ms);
    mang.then(function(r){ if (!xong){ xong = true; clearTimeout(t); ok(r); } },
      function(err){ caches.match(req).then(function(c){ if (!xong){ xong = true; clearTimeout(t); c ? ok(c) : loi(err); } }); });
  });
}
// Du lieu: luon hoi may chu ban moi (cache:'no-cache' -> bo qua cache HTTP cua trinh duyet).
function duLieu(e, req, ms){ return mangTruoc(e, req, ms, fetch(req.url, {cache: 'no-cache', credentials: 'same-origin'})); }
// Cache truoc, nhung van tai ngam ban moi de lan mo SAU co ban moi
// (phong khi ai do sua file ma quen doi ?v=).
function cacheTruoc(req){
  return caches.match(req).then(function(c){
    var moi = fetch(req).then(function(r){ return luu(req, r); });
    if (c) { moi.catch(function(){}); return c; }
    return moi;
  });
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var u;
  try { u = new URL(req.url); } catch(_){ return; }

  // Mo app / tai lai trang
  if (req.mode === 'navigate') { e.respondWith(mangTruoc(e, req, 1200)); return; }

  // Thu vien + font ngoai: cache truoc
  if (CDN_RE.test(req.url)) { e.respondWith(cacheTruoc(req)); return; }

  if (u.origin !== location.origin) return; // API gia/BCTC... de trinh duyet tu lo

  // File du lieu: mang truoc (cho 4s). Mang cham hon 4s thi tra ban cache NHUNG van tai tiep va LUU ban moi
  // (truoc 29/09: ban tai muon bi bo -> iPhone 5G ket o du lieu 23/09 suot 6 ngay).
  if (DATA_RE.test(u.pathname)) { e.respondWith(duLieu(e, req, 4000)); return; }

  // File co ?v= : cache truoc
  if (/[?&]v=/.test(u.search)) { e.respondWith(cacheTruoc(req)); return; }

  // Con lai (icon, manifest, file khong co ?v=): mang truoc, loi thi cache
  e.respondWith(mangTruoc(e, req, 6000));
});

// Nhan Web Push tu may chu quet gia -> hien thong bao ke ca khi app da dong.
// Day la duong DUY NHAT bao duoc luc iPhone nam trong tui.
self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(_){ d = { title: 'Khoa Nguyen Signal', body: e.data ? e.data.text() : '' }; }
  var title = d.title || 'Khoa Nguyen Signal';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    tag: d.tag || 'kn-push',
    renotify: (d.tag || 'kn-push') === 'kn-multi',   // tin gop nhieu ma dung chung tag -> phai reo lai, khong thi tin sau thay tin truoc trong im lang
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: d.url || '/', ma: d.ma || '' }
  }));
});

// Bao cho app dang mo biet khach vua bam thong bao nao. App tra loi qua cong
// MessageChannel; im lang 700ms (ban cu / tab treo) thi dieu huong thang bang URL.
function knBaoApp(c, tin){
  return new Promise(function(xong){
    var da = false;
    try {
      var ch = new MessageChannel();
      ch.port1.onmessage = function(){ da = true; xong(true); };
      c.postMessage(tin, [ch.port2]);
    } catch(_) { return xong(false); }
    setTimeout(function(){ if (!da) xong(false); }, 700);
  });
}
// Bam vao thong bao -> MO DUNG THU CAN XEM (tab chi tiet ma / watchlist),
// khong phai chi focus cua so roi thoi.
// (Tren iOS thong bao BUOC phai ban qua registration.showNotification,
//  nen handler nay la duong duy nhat de xu ly cu bam.)
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(list){
      var tin = { kn: 'mo', ma: (e.notification.data && e.notification.data.ma) || '', url: url };
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(self.location.origin) !== 0) continue;
        return Promise.resolve(('focus' in c) ? c.focus() : c).then(function(cc){
          cc = cc || c;
          return knBaoApp(cc, tin).then(function(hieu){
            if (hieu) return cc;                      // app da tu mo dung cho
            try { if (cc.navigate) return cc.navigate(url); } catch(_){}
            return cc;
          });
        });
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
