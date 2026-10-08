const CACHE_NAME = 'lexis-pwa-v02-dbc65708ad91-hybrid';
const CACHE_PREFIX = 'lexis-pwa-';
const APP_URL = new URL('./', self.location.href);
const INDEX_URL = new URL('index.html', APP_URL).href;
const ASSETS = [
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png'
].map(path => new URL(path, APP_URL).href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([INDEX_URL, ...ASSETS].map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== APP_URL.origin ||
      !url.pathname.startsWith(APP_URL.pathname)) return;

  if (request.mode === 'navigate' || url.pathname === new URL(INDEX_URL).pathname) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response.ok) {
          try { await cache.put(INDEX_URL, response.clone()); }
          catch (error) { console.warn('LEXIS offline cache could not be refreshed.', error.name); }
          return response;
        }
        return await cache.match(INDEX_URL) || response;
      } catch (error) {
        const cached = await cache.match(INDEX_URL);
        if (cached) return cached;
        throw error;
      }
    })());
    return;
  }

  const assetURL = new URL(url.pathname, url.origin).href;
  if (ASSETS.includes(assetURL)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(assetURL);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) await cache.put(assetURL, response.clone());
      return response;
    })());
  }
});
