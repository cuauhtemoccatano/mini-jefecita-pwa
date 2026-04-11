const CACHE_NAME = 'mini-jefecita-v3.6.1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/css/awakening.css',
  '/app.js',
  '/manifest.json',
  '/ai_worker.js',
  '/js/state.js',
  '/js/ai_engine.js',
  '/js/ui_engine.js',
  '/js/health_engine.js',
  '/js/santuario.js',
  '/js/system.js',
  '/js/components/HomeView.js',
  '/js/components/ChatView.js',
  '/js/components/ExerciseView.js',
  '/js/components/RemindersView.js',
  '/js/components/JournalView.js',
  '/js/components/ZenView.js',
  '/js/components/SettingsModal.js',
  '/js/components/OnboardingCeremony.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Devolver respuesta de caché inmediatamente (si existe)
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        
        // EXCLUSIÓN: No cachear modelos de AI aquí (ya lo hace Transformers.js localmente)
        if (event.request.url.includes('huggingface.co')) {
            return networkResponse;
        }

        // 2. Actualizar el caché en segundo plano con la nueva versión
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback si falla la red y no hay caché (offline extremo)
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
