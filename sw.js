const CACHE_NAME = 'mini-jefecita-v3.6.6';
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

// Archivos críticos que siempre deben ser frescos
const NETWORK_FIRST = ['/', '/index.html', '/app.js', '/manifest.json'];

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isNetworkFirst = NETWORK_FIRST.some(p => url.pathname === p || url.pathname.endsWith(p));

  // Excluir modelos AI — Transformers.js maneja su propio cache
  if (event.request.url.includes('huggingface.co') || event.request.url.includes('cdn.jsdelivr.net')) {
    return;
  }

  if (isNetworkFirst) {
    // Network-first: siempre intenta red, cae a caché solo si offline
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first para assets estáticos (CSS, iconos, fuentes)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
  }
});
