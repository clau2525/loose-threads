/* Offline shell. Bump CACHE to ship an update. */
var CACHE = "lt-a4617be8";
var SHELL = [
  "./",
  "index.html"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  // Anything off this origin (the sync server) goes straight to the network.
  if (url.origin !== self.location.origin) return;

  // Every navigation — including ?add=… and #add=… — is answered by the cached shell,
  // so the page opens with no signal at all.
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("index.html").then(function (hit) {
        return hit || fetch(req);
      })
    );
    return;
  }

  // Assets: serve from cache immediately, refresh in the background.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var live = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || live;
    })
  );
});
