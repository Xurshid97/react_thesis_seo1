self.addEventListener("fetch", (event) => {
  const validRoutes = ["/", "/about"];
  const url = new URL(event.request.url);

  // Skip asset requests like CSS, JS, or images
  if (url.pathname.endsWith(".css") || url.pathname.endsWith(".js") || url.pathname.includes("assets")) {
    return;
  }

  // If the route is valid, return the main index.html for React Router to take over
  if (validRoutes.includes(url.pathname)) {
    event.respondWith(
      caches.match("/index.html").then((cachedResponse) => {
        // Serve index.html from cache or fetch from network
        return cachedResponse || fetch("/index.html");
      })
    );
    return;
  }

  // If the route is invalid, respond with a custom error message
  event.respondWith(
    new Response("This page does not exist", { status: 404 })
  );
});
