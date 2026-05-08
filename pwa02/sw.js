const myCache = 'pwa-v1';
const myAssets = ['index.html', 'pwa.js', 'manifest.json'];

self.addEventListener('install', (myEvent) => {
    myEvent.waitUntil(
        caches.open(myCache).then(c => c.addAll(myAssets))
    );
});

self.addEventListener('fetch', (myEvent) => {
    myEvent.respondWith(
        caches.match(myEvent.request).then(r => r || fetch(myEvent.request))
    );
});