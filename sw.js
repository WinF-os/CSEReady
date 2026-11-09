// Keep in sync with CSE_VERSION in app.js
const CACHE_NAME = 'cseready-v1.00.01';
const CORE_ASSETS = ['./', './index.html', './style.css', './bank.js', './app.js', './manifest.webmanifest', './icons/icon.svg'];

self.addEventListener('install', event => {
  // No skipWaiting() here: a new worker waits until the page asks it to activate.
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(CORE_ASSETS.map(url => fetch(url, { cache: 'reload' }).then(r => cache.put(url, r))))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.hostname.endsWith('googleapis.com')) return;   // never cache AI calls
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
      return res;
    }).catch(() => cached))
  );
});
