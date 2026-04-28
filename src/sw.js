import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

// Inyección automática del manifiesto de build de Vite (Precaching estricto)
// Workbox se encargará del 'cache first' y la actualización de estos assets automáticamente.
precacheAndRoute(self.__WB_MANIFEST);

// 1. EXCLUSIÓN CRÍTICA: Transformers.js / HuggingFace
// No debemos cachear los pesos de los modelos aquí, Transformers.js tiene su propio motor de indexedDB cache.
registerRoute(
  ({ url }) => url.host === 'huggingface.co' || url.host === 'cdn.jsdelivr.net',
  new NetworkFirst({
     cacheName: 'external-cdn-bypass',
  })
);

// 2. Control de Ciclo de Vida: Evita bloqueos en iOS Safari al actualizar
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => {
  // Evitamos self.skipWaiting() automático para cumplir con the Freeze List. Se invoca vía UI toast (SKIP_WAITING).
  console.log('[ServiceWorker] Instalacion detectada. Esperando skipWaiting comando.');
});

self.addEventListener('activate', (event) => {
  // Asegurar que el nuevo Service Worker tome control de toda la web app y páginas abiertas en iOS
  event.waitUntil(self.clients.claim());
});
