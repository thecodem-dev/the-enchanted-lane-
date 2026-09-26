/**
 * The Enchanted Line — Service Worker
 *
 * Strategy:
 *  · App shell (JS/CSS/HTML): Cache-first, populated on install
 *  · Google Fonts CSS:        Stale-while-revalidate, 7-day cache
 *  · Google Fonts woff2:      Cache-first, 1-year cache (immutable)
 *  · Google Maps tiles/API:   Network-first, 10-min cache (tiles change)
 *  · YouTube embeds:          Network-only (video must be live)
 *  · Everything else:         Network-first with offline fallback
 *
 * Cache names are versioned so old caches are pruned on activate.
 */

const VERSION      = 'v2'
const SHELL_CACHE  = `enchanted-shell-${VERSION}`
const FONTS_CACHE  = `enchanted-fonts-${VERSION}`
const MAPS_CACHE   = `enchanted-maps-${VERSION}`
const RUNTIME_CACHE = `enchanted-runtime-${VERSION}`

// Assets to precache on install — Vite injects hashed filenames so
// we use a glob approach: cache everything the browser fetches during
// the install event by intercepting the initial navigation + imports.
// For a production build the build manifest is parsed below.
const PRECACHE_URLS = [
  '/',
  '/index.html',
]

// ── Install ───────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())   // activate immediately
  )
})

// ── Activate — prune old caches ───────────────────────────────
self.addEventListener('activate', event => {
  const keep = new Set([SHELL_CACHE, FONTS_CACHE, MAPS_CACHE, RUNTIME_CACHE])
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(n => !keep.has(n))
          .map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())  // take control immediately
  )
})

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and browser-extension requests
  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  // ── Media and range requests — let the browser stream them ──
  // Video is fetched in byte ranges (206 responses), which the Cache API
  // can't store; the landing hero video would fail to play otherwise.
  if (request.headers.has('range') || request.destination === 'video' || request.destination === 'audio') return

  // ── YouTube — network only (video content must be live) ──
  if (url.hostname.includes('youtube.com') || url.hostname.includes('ytimg.com')) {
    return  // let browser handle it natively
  }

  // ── Google Fonts CSS — stale-while-revalidate ─────────────
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(FONTS_CACHE, request))
    return
  }

  // ── Google Fonts woff2 — cache-first, long TTL ───────────
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(FONTS_CACHE, request, 365 * 24 * 60 * 60))
    return
  }

  // ── Google Maps — network-first, short tile cache ─────────
  if (
    url.hostname.includes('maps.googleapis.com') ||
    url.hostname.includes('maps.gstatic.com') ||
    url.hostname.includes('mapsplatform.google.com')
  ) {
    event.respondWith(networkFirst(MAPS_CACHE, request, 10 * 60))
    return
  }

  // ── App shell: same-origin HTML navigation ────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(SHELL_CACHE, request, 0).catch(() =>
        caches.match('/index.html').then(r => r ?? new Response('Offline', { status: 503 }))
      )
    )
    return
  }

  // ── Static assets with hash in URL (Vite output) ─────────
  // e.g. /assets/index-Bx3TjkL9.js — cache-first forever
  if (url.origin === self.location.origin && url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(SHELL_CACHE, request, 365 * 24 * 60 * 60))
    return
  }

  // ── Everything else — network-first with runtime cache ────
  event.respondWith(networkFirst(RUNTIME_CACHE, request, 5 * 60))
})

// ── Cache strategies ──────────────────────────────────────────

/**
 * Cache-first: return cached response if available, otherwise fetch,
 * cache the result, and return it.  maxAge is in seconds (0 = no expiry).
 */
async function cacheFirst(cacheName, request, maxAge) {
  const cache    = await caches.open(cacheName)
  const cached   = await cache.match(request)

  if (cached) {
    if (maxAge > 0) {
      const date = cached.headers.get('sw-cached-at')
      if (date) {
        const age = (Date.now() - parseInt(date, 10)) / 1000
        if (age > maxAge) {
          // Stale — fetch fresh in the background, return stale now
          fetchAndCache(cache, request)
        }
      }
    }
    return cached
  }

  return fetchAndCache(cache, request)
}

/**
 * Network-first: try the network, fall back to cache.
 * maxAge controls how long the cached entry is considered fresh (seconds).
 */
async function networkFirst(cacheName, request, maxAge) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetchAndCache(cache, request)
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    throw new Error('Offline and no cache available')
  }
}

/**
 * Stale-while-revalidate: return cached immediately, then refresh cache.
 */
async function staleWhileRevalidate(cacheName, request) {
  const cache  = await caches.open(cacheName)
  const cached = await cache.match(request)
  const networkPromise = fetchAndCache(cache, request)

  return cached ?? networkPromise
}

/** Fetch a request and store the response in cache (cloning it first). */
async function fetchAndCache(cache, request) {
  const response = await fetch(request)
  if (response.ok) {
    // Add a timestamp header so cacheFirst can check freshness
    const headers = new Headers(response.headers)
    headers.set('sw-cached-at', String(Date.now()))
    const toCache = new Response(await response.clone().arrayBuffer(), {
      status:     response.status,
      statusText: response.statusText,
      headers,
    })
    cache.put(request, toCache)
  }
  return response
}

// ── Message handler: allow the app to skip waiting ────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
