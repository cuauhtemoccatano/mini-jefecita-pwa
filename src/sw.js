import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// 1. Limpieza y Precaching
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// 1.5. Estrategia NetworkFirst para el Root (Evitar pantallas negras por caché stale)
registerRoute(
  ({ url }) => url.pathname === '/' || url.pathname === '/index.html',
  new NetworkFirst({
    cacheName: 'root-page',
    plugins: [
      new ExpirationPlugin({ maxEntries: 1 }),
    ],
  })
);

// 2. Caché de Fuentes (Google Fonts)
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 }),
    ],
  })
);

// 3. Caché de Modelos y Pesos (HuggingFace / CDNs)
// Transformers.js usa indexedDB, pero cacheamos las peticiones para redundancia
registerRoute(
  ({ url }) => url.host === 'huggingface.co' || url.host === 'cdn.jsdelivr.net' || url.host === 'cdnjs.cloudflare.com',
  new CacheFirst({
    cacheName: 'neural-weights',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

// 4. Estrategia por defecto para Assets locales no precacheados
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// 5. Ciclo de Vida Safari Fix
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
