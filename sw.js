// ══════════════════════════════════════════════════════════════
// APEX Motorsport Media — Service Worker
// Strategy: Cache-first for static assets, network-first for pages
// ══════════════════════════════════════════════════════════════

const CACHE_NAME    = 'apex-v1';
const OFFLINE_PAGE  = '/offline.html';

// Assets to pre-cache on install (shell of the app)
const PRECACHE_URLS = [
    '/',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Barlow:wght@300;400;500;600;700;900&display=swap',
];


// ── Install: pre-cache shell ────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});


// ── Activate: clean old caches ──────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});


// ── Fetch: smart caching strategy ───────────────────────────
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and non-http(s) requests
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;

    // Fonts: cache-first (rarely change)
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Same-origin static assets (images, icons, css, js): cache-first
    if (url.origin === self.location.origin &&
        (request.destination === 'image' ||
         request.destination === 'style'  ||
         request.destination === 'script' ||
         request.destination === 'font')) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // HTML pages: network-first (keep content fresh)
    if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Everything else: network-first
    event.respondWith(networkFirst(request));
});


// ── Cache-first strategy ────────────────────────────────────
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Offline', { status: 503 });
    }
}


// ── Network-first strategy ──────────────────────────────────
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        // Return cached homepage as fallback for any navigation
        const home = await caches.match('/');
        if (home) return home;
        return new Response('<h1>You are offline</h1>', {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}
