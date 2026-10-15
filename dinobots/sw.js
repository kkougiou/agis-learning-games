// DINOBOTS offline cache. A new release changes CACHE_NAME; older dinobots caches are removed.
const CACHE_NAME = 'dinobots-pwa-v0.2-2ec2fc1ad0';
const CACHE_PREFIX = 'dinobots-pwa-';
const APP_URL = new URL('./', self.location.href);
const FILES = ['./', 'index.html', 'three.min.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png']
  .map(p => new URL(p, APP_URL).href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES.map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(APP_URL.href)) return;
  if (req.mode === 'navigate') {
    // network first, so a new release shows up as soon as the tablet is online; cached copy when offline
    event.respondWith(fetch(req, { cache: 'no-store' }).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(new URL('index.html', APP_URL).href, copy)); }
      return res;
    }).catch(() => caches.open(CACHE_NAME).then(c => c.match(new URL('index.html', APP_URL).href).then(hit => hit || c.match(APP_URL.href)))));
    return;
  }
  event.respondWith(caches.open(CACHE_NAME).then(c => c.match(req).then(hit => hit || fetch(req))));
});
