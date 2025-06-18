const CACHE_NAME = 'focusflow-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/styles/timer.css',
  '/styles/todo.css',
  '/styles/notes.css',
  '/styles/home.css',
  '/styles/modal.css',
  '/styles/responsive.css',
  '/scripts/main.js',
  '/scripts/timer.js',
  '/scripts/todo.js',
  '/scripts/notes.js',
  '/scripts/theme.js',
  '/scripts/utils.js',
  '/notification.mp3',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto+Mono:wght@200;300;400&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching assets');
        return cache.addAll(ASSETS);
      })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then((response) => {
        return response || fetch(e.request);
      })
      .catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});