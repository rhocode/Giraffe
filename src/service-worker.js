import { ExpirationPlugin } from "workbox-expiration";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";

// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST);

// eslint-disable-next-line no-restricted-globals
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
  }
});

registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 800,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 60 Days
      }),
    ],
  })
);

registerRoute(
  /.*\.(?:js|css|json)$/,
  new StaleWhileRevalidate({
    cacheName: "static-resources",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 20 * 24 * 60 * 60, // 20 Days
        maxEntries: 50,
      }),
    ],
  })
);

const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

// Your custom service worker code goes here.
