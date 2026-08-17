/**
 * STATIQONE Service Worker Registration Manager
 * Handles PWA lifecycle, background updates, and offline caching.
 */

export interface SWRegistrationCallbacks {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

let activeRegistration: ServiceWorkerRegistration | null = null;

export function registerServiceWorker(callbacks: SWRegistrationCallbacks = {}): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    window.addEventListener('load', async () => {
      try {
        const swUrl = '/sw.js';
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
        });
        activeRegistration = registration;

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available and will be used when all tabs are closed or skipWaiting is called
                console.log('[PWA] New content is available; please refresh.');
                if (callbacks.onUpdate) {
                  callbacks.onUpdate(registration);
                }
              } else {
                // Content is cached for offline use.
                console.log('[PWA] Content is cached for offline use.');
                if (callbacks.onSuccess) {
                  callbacks.onSuccess(registration);
                }
              }
            }
          };
        };

        resolve(registration);
      } catch (error: any) {
        console.error('[PWA] Error during service worker registration:', error);
        if (callbacks.onError) {
          callbacks.onError(error);
        }
        resolve(null);
      }
    });
  });
}

export function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    return navigator.serviceWorker.ready
      .then((registration) => {
        return registration.unregister();
      })
      .catch((error) => {
        console.error('[PWA] Error unregistering service worker:', error);
        return false;
      });
  }
  return Promise.resolve(false);
}

export function updateServiceWorker(reloadPage: boolean = true): void {
  if (activeRegistration && activeRegistration.waiting) {
    activeRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  if (reloadPage && typeof window !== 'undefined') {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

// Auto-register service worker on script evaluation in browser
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  registerServiceWorker();
}
