import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

// Anything random.
const revision = crypto.randomUUID();

self.addEventListener('push', function(event) {
  const payload = event.data?.json() as { notification: { title: string; body: string } } | undefined;
  const options = {
    body: payload?.notification.body || 'Some default message',
    icon: 'path/to/icon.png',
    badge: 'path/to/badge.png'
  };

  event.waitUntil(self.registration.showNotification(payload?.notification.title || 'Default title', options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('https://integrity-check.vercel.app'));
})

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        revision,
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});
