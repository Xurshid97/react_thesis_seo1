self.addEventListener("install", (event: any) => {
    event.waitUntil(
      caches.open("pwa-cache").then((cache) => {
        return cache.addAll(["/", "/index.html"]);
      })
    );
  });
  
  self.addEventListener("fetch", (event: any) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  