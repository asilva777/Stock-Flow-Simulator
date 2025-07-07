&lt;immersive type=&quot;code&quot; title=&quot;service-worker.js&quot;&gt;
```javascript
const CACHE_NAME = &#39;stock-flow-simulator-v1&#39;;
const urlsToCache = [
  &#39;.&#39;,
  &#39;index.html&#39;,
  &#39;style.css&#39;,
  &#39;script.js&#39;,
  &#39;icon-192.png&#39;,
  &#39;icon-512.png&#39;
];

// Install the service worker and cache the app shell
self.addEventListener('install', event =\> {
event.waitUntil(
caches.open(CACHE\_NAME)
.then(cache =\> {
console.log('Opened cache');
return cache.addAll(urlsToCache);
})
);
});

// Fetch assets from cache or network
self.addEventListener('fetch', event =\> {
event.respondWith(
caches.match(event.request)
.then(response =\> {
// Cache hit - return response
if (response) {
return response;
}
// Not in cache - fetch from network
return fetch(event.request);
}
)
);
});

// Clean up old caches
self.addEventListener('activate', event =\> {
const cacheWhitelist = [CACHE\_NAME];
event.waitUntil(
caches.keys().then(cacheNames =\> {
return Promise.all(
cacheNames.map(cacheName =\> {
if (cacheWhitelist.indexOf(cacheName) === -1) {
return caches.delete(cacheName);
}
})
);
})
);
});
