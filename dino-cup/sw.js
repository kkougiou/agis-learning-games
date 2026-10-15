/* DINO CUP only. Never clear another game's cache. */
const PREFIX='agis-dinocup-',NAME=PREFIX+'0.1.0-903fd67ee217',BASE=new URL('./',self.location.href);
const FILES=['./','index.html','three.min.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',e=>e.waitUntil(caches.open(NAME).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==BASE.origin||!u.href.startsWith(BASE.href))return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{if(!r.ok)throw new Error('unavailable');const copy=r.clone();e.waitUntil(caches.open(NAME).then(c=>c.put(new URL('index.html',BASE).href,copy)));return r;}).catch(()=>caches.open(NAME).then(c=>c.match(new URL('index.html',BASE).href))));return;}
e.respondWith(caches.open(NAME).then(c=>c.match(e.request).then(r=>r||fetch(e.request))));});
