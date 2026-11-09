/**
 * APP FACTORY — Service Worker (Offline Resilience & PWA Shell)
 * Author: Staff PWA Engineer (Ex-Flipkart Lite)
 */

const CACHE_NAME = 'app-factory-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/engine/appCore.js',
  '/src/engine/schemaParser.js',
  '/src/engine/trackerEngine.js',
  '/src/utils/whatsapp.js',
  '/src/utils/storage.js',
  '/templates/autocare.json',
  '/templates/retail.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static PWA app shell');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Offline pre-cache partial warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation or static asset requests: Cache first, fallback to network
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If offline and request is an HTML navigation, return cached index.html
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
    );
  }
});

