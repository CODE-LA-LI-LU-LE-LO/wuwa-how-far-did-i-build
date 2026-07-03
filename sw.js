const CACHE_NAME = "ww-farming-tracker-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/app-backdrop.png",
];
const NETWORK_FIRST_PATHS = [
  "/app-config.js",
  "/data/characters.json",
  "/data/goal-defaults.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (NETWORK_FIRST_PATHS.some((path) => url.pathname.endsWith(path))) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetchAndCache(event.request);
    }),
  );
});

function networkFirst(request) {
  return fetchAndCache(request).catch(() => caches.match(request));
}

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (!response || response.status !== 200) return response;
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    return response;
  });
}
