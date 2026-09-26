const CACHE_NAME = 'bloom-education-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache).catch(err => console.log('Cache:', err)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(n => n !== CACHE_NAME ? caches.delete(n) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Supabase API so'rovlarini keshlamaslik
  if (event.request.url.includes('supabase.co')) return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      });
    }).catch(() => caches.match('./index.html'))
  );
});