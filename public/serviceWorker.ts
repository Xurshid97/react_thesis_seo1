self.addEventListener("fetch", (event: any) => {
    const validRoutes = ["/", "/about"];
    
    const url = new URL(event.request.url);
    
    if (validRoutes.includes(url.pathname)) {
      // Allow the request to continue to React
      return;
    }
    
    // If the route is invalid, respond with a custom error message
    event.respondWith(
      new Response("This page does not exist", { status: 404 })
    );
  });
  