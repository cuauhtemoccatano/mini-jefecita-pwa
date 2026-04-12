import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Inyección automática del manifiesto de build de Vite
precacheAndRoute(self.__WB_MANIFEST);

// 1. Estrategia Network First para archivos críticos
registerRoute(
  ({ request, url }) => 
    request.mode === 'navigate' || 
    url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('main.js') ||
    url.pathname.endsWith('manifest.json'),
  new NetworkFirst({
    cacheName: 'critical-assets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] })
    ]
  })
);

// 2. Estrategia Cache First para assets estáticos (CSS, Imágenes)
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'image' || 
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] })
    ]
  })
);

// 3. EXCLUSIÓN CRÍTICA: Transformers.js / HuggingFace
// No debemos cachear los pesos de los modelos aquí, Transformers.js tiene su propio motor.
registerRoute(
  ({ url }) => url.host === 'huggingface.co' || url.host === 'cdn.jsdelivr.net',
  new NetworkFirst({
     cacheName: 'external-cdn-bypass',
  })
);

// 4. Background Sync o Fallback
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
