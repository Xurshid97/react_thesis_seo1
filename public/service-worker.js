self.addEventListener("fetch", (event) => {
  const validRoutes = ["/", "/about"];

  const url = new URL(event.request.url);

  // Skip intercepting requests for assets like CSS, JS, or images
  if (url.pathname.endsWith(".css") || url.pathname.endsWith(".js") || url.pathname.includes("assets")) {
    return;
  }

  console.log("Intercepting fetch request for: ", url.pathname);
  // Check if the requested URL pathname is in the list of valid routes
  if (validRoutes.includes(url.pathname)) {
    // Allow the request to continue to React (let it pass through)
    return;
  }

  // If the route is invalid, respond with a custom error message
  event.respondWith(
    new Response("This page does not exist", { status: 404 })
  );
});
