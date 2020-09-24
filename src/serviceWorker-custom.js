/* eslint-disable no-undef */

if ("function" === typeof importScripts) {
  // eslint-disable-next-line no-undef
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
  );

  // Global workbox
  // eslint-disable-next-line no-undef
  if (workbox) {
    console.debug("Workbox is loaded");

    // Disable logging
    // eslint-disable-next-line no-undef
    workbox.setConfig({ debug: false });

    // //`generateSW` and `generateSWString` provide the option
    // // to force update an exiting service worker.
    // // Since we're using `injectManifest` to build SW,
    // // manually overriding the skipWaiting();
    // self.addEventListener("install", (event) => {
    //   self.skipWaiting();
    //   window.location.reload();
    // });

    const staticCacheName = 'fetched-images';

    // eslint-disable-next-line no-restricted-globals
    self.addEventListener('install', event => {
      console.debug('Attempting to install service worker and cache static assets');
      event.waitUntil(
        caches.open(staticCacheName)
          .then(cache => {
            return cache.addAll([]);
          })
      );
    });

    // eslint-disable-next-line no-restricted-globals
    self.addEventListener('fetch', event => {
      if (!(event.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol
      console.debug('Fetch event for ', event.request.url);
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            if (response && !event.request.url.endsWith('manifest.json')) {
              console.debug('Found ', event.request.url, ' in cache');
              return response;
            }
            console.debug('Network request for ', event.request.url);
            return fetch(event.request).then(response => {
              // TODO 5 - Respond with custom 404 page
              return caches.open(staticCacheName).then(cache => {
                try {
                  if (event.request.url.endsWith('png')) {
                    cache.put(event.request.url, response.clone());
                  }
                  return response;
                } catch(e) {
                  return response;
                }

              });
            });

          }).catch(error => {

          // TODO 6 - Respond with custom offline page

        })
      );
    });

    // eslint-disable-next-line no-undef
    console.log("Valid Cache names", workbox.core.cacheNames);

    // eslint-disable-next-line no-restricted-globals
    self.addEventListener('activate', event => {
      console.debug('Activating new service worker...');
      event.waitUntil(
        caches.keys().then(cacheNames => {
          // eslint-disable-next-line no-undef
          const validCacheSet = new Set(Object.values(workbox.core.cacheNames));
          return Promise.all(
            cacheNames
              .filter(cacheName => !validCacheSet.has(cacheName))
              .map(cacheName => {
                console.log('deleting cache', cacheName);
                return caches.delete(cacheName);
              })
          );
        })
      );
    });

    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    // eslint-disable-next-line no-undef
    workbox.precaching.precacheAndRoute([]);

    // Font caching
    // eslint-disable-next-line no-undef
    workbox.routing.registerRoute(
      new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"),
      // eslint-disable-next-line no-undef
      workbox.strategies.cacheFirst({
        cacheName: "googleapis",
        plugins: [
          // eslint-disable-next-line no-undef
          new workbox.expiration.Plugin({
            maxEntries: 30,
          }),
        ],
      })
    );

    // Image caching
    // eslint-disable-next-line no-undef
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      // eslint-disable-next-line no-undef
      workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
          // eslint-disable-next-line no-undef
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      })
    );

    // JS, CSS caching
    // eslint-disable-next-line no-undef
    workbox.routing.registerRoute(
      /\.(?:js|css)$/,
      // eslint-disable-next-line no-undef
      workbox.strategies.staleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [
          // eslint-disable-next-line no-undef
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 20 * 24 * 60 * 60, // 20 Days
          }),
        ],
      })
    );
  } else {
    console.error("Workbox could not be loaded. No offline support");
  }
}