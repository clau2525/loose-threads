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

  // Navigations — including ?add=… and #add=… — try the network FIRST, then fall
  // back to the cached copy. Cache-first was a mistake: a bad copy could never be
  // replaced from the page, so one broken deploy stranded the device permanently.
  // The 2.5s ceiling keeps the offline case instant.
  if (req.mode === "navigate") {
    e.respondWith(new Promise(function (resolve) {
      var settled = false;
      function settle(r) { if (!settled && r) { settled = true; resolve(r); } }
      function fromCache(fallback) {
        caches.match("index.html").then(function (hit) {
          settle(hit || fallback || Response.error());
        }).catch(function () { settle(fallback || Response.error()); });
      }

      fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put("index.html", copy); });
          settle(res);
        } else {
          fromCache(res);
        }
      }).catch(function () { fromCache(null); });

      setTimeout(function () { if (!settled) fromCache(null); }, 2500);
    }));
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
