const CACHE = "english-coach-v1";

const PRECACHE = [
  "/english",
  "/icons/english-192.png",
  "/icons/english-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Solo interceptar requests del mismo origen
  if (url.origin !== self.location.origin) return;

  // Supabase y API calls: siempre red, nunca cache
  if (url.pathname.startsWith("/api") || url.hostname.includes("supabase")) return;

  // Estrategia: Network first, cache como fallback
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && e.request.method === "GET") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
