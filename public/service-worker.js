/**
 * EdgeReader Service Worker
 * Handles app shell caching and offline serving.
 */

const CACHE_NAME = 'edgereader-v1';

// Resources to cache on install
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    // Dev assets
    '/src/main.jsx',
    '/src/App.jsx',
    '/src/index.css',
    '/src/App.css'
];

// Install event: Cache the app shell
self.addEventListener('install', (event) => {
    console.log('✅ Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Service Worker: Caching App Shell');
            return cache.addAll(APP_SHELL);
        })
    );
    self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Clearing Old Cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: Serve according to strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Strategy: Network-First for HTML and API calls
    if (event.request.mode === 'navigate' || url.pathname.startsWith('/api')) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Strategy: Cache-First for static assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request).then((networkResponse) => {
                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2)$/)
                ) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch((error) => {
                console.error('❌ Service Worker: Fetch failed', error);
            });
        })
    );
});
