/**
 * STATIQONE Financial Platform - Progressive Web App Service Worker
 * 
 * Features:
 * - App Shell Precaching (Offline navigation & core UI)
 * - Stale-While-Revalidate (SWR) strategy for live stock, news, and insurance feeds
 * - Custom 'x-statiqone-cached-at' timestamp header injection for client-side stale detection
 * - Cache-First strategy for static bundles (JS, CSS, Web Fonts, SVG, PNG)
 * - Automatic background cache revalidation on network restore
 * - Zero-downtime cache invalidation and client claiming
 */

const CACHE_VERSION = 'statiqone-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  '/icons/apple-touch-icon-180x180.png'
];

// 1. Install Event: Precache Application Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      try {
        await cache.addAll(SHELL_ASSETS);
      } catch (err) {
        console.warn('[SW] Precaching shell assets completed with partial items:', err);
      }
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up outdated cache versions & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!key.startsWith(CACHE_VERSION)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Helper to determine if an API route matches financial live feeds
function isFinancialApiRoute(pathname) {
  return (
    pathname.startsWith('/api/stocks') ||
    pathname.startsWith('/api/news') ||
    pathname.startsWith('/api/insurance')
  );
}

// 3. Fetch Event: Intelligent multi-tier caching strategy
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests (e.g. POST /api/payments, POST /api/reports)
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Strategy A: Stale-While-Revalidate for Financial & News API Endpoints
  if (isFinancialApiRoute(url.pathname)) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);

        const networkFetchPromise = fetch(event.request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              const headers = new Headers(responseToCache.headers);
              const timestamp = new Date().toISOString();
              headers.set('x-statiqone-cached-at', timestamp);
              headers.set('x-statiqone-cache-status', 'STALE_REVALIDATED');

              try {
                const blobBody = await responseToCache.blob();
                const customResponse = new Response(blobBody, {
                  status: responseToCache.status,
                  statusText: responseToCache.statusText,
                  headers: headers,
                });
                await cache.put(event.request, customResponse);
              } catch (cacheErr) {
                console.warn('[SW] Error caching API response body:', cacheErr);
              }
            }
            return networkResponse;
          })
          .catch((networkErr) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return structured offline JSON response when network is down and no cache exists
            return new Response(
              JSON.stringify({
                error: 'offline_and_uncached',
                message: 'You are currently offline and this financial data has not been cached yet.',
                cached: false,
                timestamp: new Date().toISOString(),
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });

        // If cached response exists, return it immediately while fetching fresh data in the background
        return cachedResponse || networkFetchPromise;
      })
    );
    return;
  }

  // Strategy B: Navigation Requests (HTML / App Shell)
  if (
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') &&
      event.request.headers.get('accept').includes('text/html'))
  ) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) {
          return cachedIndex;
        }
        const cachedRoot = await caches.match('/');
        if (cachedRoot) {
          return cachedRoot;
        }
        return new Response(
          '<!DOCTYPE html><html><head><title>STATIQONE Offline</title></head><body style="background:#0B0F19;color:#fff;font-family:sans-serif;padding:2rem;text-align:center;"><h2>STATIQONE Financial Intelligence</h2><p>You are currently offline. Please reconnect to access live markets.</p></body></html>',
          {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          }
        );
      })
    );
    return;
  }

  // Strategy C: Static Assets (JS bundles, CSS, Images, Web Fonts) -> Cache First with Network Fallback
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|eot)$/i)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Optional fallback for missing images
            if (url.pathname.endsWith('.png') || url.pathname.endsWith('.svg')) {
              return caches.match('/favicon.svg');
            }
            return new Response('', { status: 408, statusText: 'Request Timeout' });
          });
      })
    );
    return;
  }

  // Strategy D: Default Network Pass-through
  event.respondWith(fetch(event.request));
});

// 4. Message Event: IPC between React App and Service Worker
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ version: CACHE_VERSION });
    }
  }

  if (event.data.type === 'CLEAR_API_CACHE') {
    caches.delete(DATA_CACHE).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true });
      }
    });
  }
});
