/* OW Publishing CMS — register the service worker (admin pages only). */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (err) {
      if (window.console) console.warn('CMS service worker failed to register:', err);
    });
  });
})();
