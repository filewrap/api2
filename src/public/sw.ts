/**
 * Streamify Service Worker
 * Handles offline caching for the application shell and audio streaming assets.
 * Implements a Stale-While-Revalidate strategy for UI and Cache-First for audio.
 */

const CACHE_NAME = 'streamify-cache-v1';
const AUDIO_CACHE = 'streamify-audio-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logo.svg',
  '/src/main.tsx',
  '/src/App.tsx'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url);

  // Special handling for audio files (Cache First)
  if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.flac') || url.pathname.includes('stream')) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Standard assets (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request).then((response) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return response || fetchPromise;
    })
  );
});
