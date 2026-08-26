// Service worker toi thieu — network-first, KHONG cache file du lieu (tranh cu/stale khi online)
const CACHE = 'kn-shell-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(res){
      try {
        var u = new URL(e.request.url);
        // cache de dung offline, TRU 2 file du lieu (luon lay moi khi online)
        if (u.origin === location.origin && !/dashboard_data\.js|signals_data\.js/.test(u.pathname)) {
          var cp = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, cp); });
        }
      } catch(_){}
      return res;
    }).catch(function(){ return caches.match(e.request); })
  );
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
