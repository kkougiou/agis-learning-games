const CACHE_NAME = 'bip-pwa-v131-desktop-mastery-20261008';
const CACHE_PREFIX = 'bip-pwa-';
const APP_PREFIX = '/agis-learning-games/bip/';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE))
      
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME && key !== 'bip-pwa-v121-endless-20261007' && key !== 'bip-pwa-v13-20261008-3dd5fd4')
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_PREFIX)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() =>
          caches.open(CACHE_NAME).then(cache =>
            cache.match('./index.html').then(hit => hit || cache.match('./'))
          )
        )
    );
    return;
  }

  if (
    url.pathname.endsWith('/manifest.webmanifest') ||
    url.pathname.endsWith('/icon-192.png') ||
    url.pathname.endsWith('/icon-512.png') ||
    url.pathname.endsWith('/icon-maskable-512.png')
  ) {
    event.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
  }
});
