// Nora Hub Service Worker for PWA Offline support
//
// Bump CACHE_VERSION on any deploy where you need to force a hard reset of
// clients stuck on a broken cache. Under normal operation this isn't needed:
// the app shell (index.html, manifest, favicon) is served network-first, so
// each deploy is picked up automatically without a version bump. Vite's
// build hashes JS/CSS filenames, so those can safely stay cache-first
// forever - a content change always produces a new filename.
const CACHE_VERSION = 'v3';
const CACHE_NAME = `nora-hub-${CACHE_VERSION}`;

// Paths are prefixed with /hub/ to match vite.config.ts's `base` option.
const APP_SHELL = [
  '/hub/',
  '/hub/index.html',
  '/hub/manifest.json',
  '/hub/favicon.svg'
];

function isAppShellRequest(request) {
  if (request.mode === 'navigate') return true;
  const path = new URL(request.url).pathname;
  return APP_SHELL.includes(path);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Cross-origin requests (Google Fonts, the workshops.norafilmus.com PIN/
  // reservations backend, etc.) are left completely alone: don't cache them
  // forever like a hashed build asset, and don't re-issue them via fetch()
  // inside the SW's own realm, which enforces CSP oddly. Letting the browser
  // handle them natively also means live data (e.g. reservations) is never
  // stuck serving a stale first response.
  if (new URL(event.request.url).origin !== self.location.origin) return;

  // App shell: network-first, so a new deploy is visible on the very next
  // load instead of waiting on cache invalidation. Falls back to cache only
  // when offline.
  if (isAppShellRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/hub/index.html')))
    );
    return;
  }

  // Everything else (hashed build assets): cache-first is safe since a
  // content change always produces a new filename.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
