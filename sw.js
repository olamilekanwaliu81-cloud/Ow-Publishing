/* ==================================================================
   OW Publishing CMS — service worker
   Makes the admin area (login + dashboard) installable and usable
   offline-first for the app shell. It ONLY touches the CMS pages and
   their assets; the public website is left entirely to the network,
   so nothing about visitor-facing pages changes. Only the owner, who
   actually opens /admin or /dashboard, ever registers this worker.
================================================================== */
var CACHE = 'ow-cms-v1';
var SHELL = [
  '/dashboard',
  '/admin',
  '/cms.webmanifest',
  '/assets/cms-icon-192.png',
  '/assets/cms-icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { /* a missing shell file must not block install */ })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;                 // never intercept writes/logins
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;       // Supabase, fonts, flags → straight to network
  var p = url.pathname;
  var isCms = p === '/admin' || p === '/dashboard' ||
              p.indexOf('/css/') === 0 || p.indexOf('/js/') === 0 ||
              p.indexOf('/assets/') === 0 || p === '/cms.webmanifest' ||
              p === '/favicon.ico' || p === '/apple-touch-icon.png';
  if (!isCms) return;                               // public pages: default browser behavior, SW stays out

  // Network-first so content is always fresh; fall back to cache when offline.
  e.respondWith(
    fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
      return res;
    }).catch(function () {
      return caches.match(req).then(function (m) {
        return m || (req.mode === 'navigate' ? caches.match('/dashboard') : undefined);
      });
    })
  );
});
