import { useState, useEffect, useCallback } from 'react';
import { updateServiceWorker } from '../../registerServiceWorker';

export type InstallPromptType = 'native_prompt' | 'ios_instructions' | 'none';

export interface InstallPromptState {
  canInstall: boolean;
  isInstalled: boolean;
  promptType: InstallPromptType;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Pure state calculation function for installability
 */
export function determineInstallPromptState({
  userAgent,
  isStandalone,
  hasDeferredPrompt,
}: {
  userAgent: string;
  isStandalone: boolean;
  hasDeferredPrompt: boolean;
}): InstallPromptState {
  if (isStandalone) {
    return { canInstall: false, isInstalled: true, promptType: 'none' };
  }

  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  if (isIOS) {
    return { canInstall: true, isInstalled: false, promptType: 'ios_instructions' };
  }

  if (hasDeferredPrompt) {
    return { canInstall: true, isInstalled: false, promptType: 'native_prompt' };
  }

  return { canInstall: false, isInstalled: false, promptType: 'none' };
}

export function usePWA() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandaloneDisplay = window.matchMedia?.('(display-mode: standalone)').matches;
    const isIOSStandalone = (navigator as any).standalone === true;
    return Boolean(isStandaloneDisplay || isIOSStandalone);
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const dismissedUntil = localStorage.getItem('statiqone_pwa_dismissed_until');
    if (!dismissedUntil) return false;
    return Date.now() < parseInt(dismissedUntil, 10);
  });

  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [lastCachedAt, setLastCachedAt] = useState<string | null>(null);

  // Monitor online / offline network state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor standalone display mode changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayChange);
      return () => mediaQuery.removeEventListener('change', handleDisplayChange);
    }
  }, []);

  // Capture beforeinstallprompt event (Android Chrome & Desktop Chromium)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log('[PWA] STATIQONE was successfully installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  const { canInstall, isInstalled, promptType } = determineInstallPromptState({
    userAgent,
    isStandalone,
    hasDeferredPrompt: Boolean(deferredPrompt),
  });

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('[PWA] User dismissed the install prompt');
        return false;
      }
    } catch (err) {
      console.error('[PWA] Error showing install prompt:', err);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback((days: number = 7) => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem('statiqone_pwa_dismissed_until', expiry.toString());
    }
  }, []);

  const updateApp = useCallback(() => {
    updateServiceWorker(true);
  }, []);

  return {
    isOnline,
    isStandalone,
    isInstalled,
    canInstall: canInstall && !isDismissed,
    promptType: isDismissed ? 'none' : promptType,
    isIOS,
    isSafari,
    isDismissed,
    isUpdateAvailable,
    lastCachedAt,
    setLastCachedAt,
    promptInstall,
    dismissPrompt,
    updateApp,
  };
}
