/**
 * Yakthung Pan Service Worker (Offline PWA)
 * Enables 100% offline access, caching modular scripts, curriculum, audio, and UI shell.
 */

const CACHE_NAME = 'yakthung-pan-v23';

const CORE_ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './data/curriculum.json',
    './manifest.json',
    './icons/icon.svg',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png',
    './img/chuk_sak_book_upright.jpg',
    './audio/ka.mp3',
    './js/tailwind.js',
    './js/i18n.js?v=22',
    './js/custom-audio.js?v=22',
    './js/auth.js?v=22',
    './js/credits.js?v=22',
    './js/audio.js?v=22',
    './js/curriculum.js?v=22',
    './js/storage.js?v=22',
    './js/map.js?v=22',
    './js/chart.js?v=22',
    './js/tracing.js?v=22',
    './js/quiz.js?v=22',
    './js/saknam.js?v=22',
    './js/tiles.js?v=22',
    './js/app.js?v=22'
];

// Pre-cache core application shell during installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching modular application assets...');
            return cache.addAll(CORE_ASSETS).catch((err) => {
                console.warn('[SW] Some assets could not be pre-cached directly:', err);
                return Promise.all(
                    CORE_ASSETS.map((url) =>
                        cache.add(url).catch((e) => console.warn(`[SW] Failed to cache ${url}:`, e))
                    )
                );
            });
        }).then(() => self.skipWaiting())
    );
});

// Clean up previous caches upon activation
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Deleting legacy cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Intercept network requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // 1. Navigation requests (HTML document)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedIndex = await caches.match('./index.html') || await caches.match('./');
                    return cachedIndex || new Response('Offline: Yakthung Pan', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
        );
        return;
    }

    // 2. Curriculum Data (Network-first with cache fallback so edits reflect immediately)
    if (url.pathname.endsWith('/curriculum.json') || url.pathname.includes('/data/')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // 3. Audio files (Cache-first, cache new audio on demand)
    if (url.pathname.includes('/audio/') || url.pathname.endsWith('.mp3')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                });
            })
        );
        return;
    }

    // 4. External CDN assets (Tailwind CDN, Google Fonts CSS & Woff2, Firebase SDKs)
    if (url.origin.includes('tailwindcss.com') || url.origin.includes('fonts.googleapis.com') || url.origin.includes('gstatic.com')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const fetchPromise = fetch(request).then((networkResponse) => {
                    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                }).catch(() => null);

                return cached || fetchPromise;
            })
        );
        return;
    }

    // 5. Scripts, Styles & JSON: Network-first with cache fallback so live updates apply instantly
    if (url.pathname.endsWith('.js') || url.pathname.endsWith('.json') || url.pathname.endsWith('.css')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // 6. Default Cache-first strategy for remaining assets (images, icons)
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return networkResponse;
            });
        })
    );
});

// Support manual cache refresh message
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
