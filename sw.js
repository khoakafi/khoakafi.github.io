// Service worker v2 — mo app la ve ngay tu cache, cap nhat ngam.
//   * File co ?v= (dashboard_app, app-shell, market_v2...) + thu vien CDN + font:
//       CACHE TRUOC (doi phien ban = doi URL = tu tai moi) -> mo app tuc thi.
//   * index.html (dieu huong): MANG TRUOC nhung chi cho toi da 1,2 giay,
//       qua thi lay ban cache. Mang tot -> luon moi; mang cham -> van mo ngay.
//   * 2 file du lieu (dashboard_data, signals_data): MANG TRUOC, cho toi da 4 giay
//       roi moi lay cache (tranh xem tin hieu cu khi dang online).
//   * Con lai: mang truoc, loi thi cache.
//   Web va app dung chung file nay; noi dung hien thi khong doi, chi nhanh hon.
const CACHE = 'kn-shell-v2';
const DATA_RE = /dashboard_data\.js|signals_data\.js/;
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
function fetchCoHan(req, ms){
  return new Promise(function(ok, loi){
    var t = setTimeout(function(){ loi(new Error('timeout')); }, ms);
    fetch(req).then(function(r){ clearTimeout(t); ok(r); }, function(e){ clearTimeout(t); loi(e); });
  });
}
function mangTruoc(req, ms){
  return fetchCoHan(req, ms).then(function(r){ return luu(req, r); })
    .catch(function(){ return caches.match(req).then(function(c){ return c || fetch(req); }); });
}
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
  if (req.mode === 'navigate') { e.respondWith(mangTruoc(req, 1200)); return; }

  // Thu vien + font ngoai: cache truoc
  if (CDN_RE.test(req.url)) { e.respondWith(cacheTruoc(req)); return; }

  if (u.origin !== location.origin) return; // API gia/BCTC... de trinh duyet tu lo

  // 2 file du lieu: mang truoc (cho 4s)
  if (DATA_RE.test(u.pathname)) { e.respondWith(mangTruoc(req, 4000)); return; }

  // File co ?v= : cache truoc
  if (/[?&]v=/.test(u.search)) { e.respondWith(cacheTruoc(req)); return; }

  // Con lai (icon, manifest, file khong co ?v=): mang truoc, loi thi cache
  e.respondWith(mangTruoc(req, 6000));
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
    renotify: false,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: d.url || '/' }
  }));
});

// Bam vao thong bao -> dua ve app dang mo, khong mo them tab moi.
// (Tren iOS thong bao BUOC phai ban qua registration.showNotification,
//  nen handler nay la duong duy nhat de xu ly cu bam.)
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(list){
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(self.location.origin) === 0 && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
