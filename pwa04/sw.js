const myCacheName = 'webmcu-v1';
const myAssets = [
    'index.html',
    'pwa/pwa.js',
    'pwa/manifest.json',
    'pwa/icon-192.png',
    'pwa/icon-512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(myCacheName).then(cache => cache.addAll(myAssets))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});