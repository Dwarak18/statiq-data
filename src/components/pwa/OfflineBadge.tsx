import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import { usePWA } from './usePWA';

export interface OfflineBadgeProps {
  lastCachedAt?: string | null;
  isOnline?: boolean;
  compact?: boolean;
  className?: string;
  onRefresh?: () => void;
  showOnlineStatus?: boolean;
}

export function OfflineBadge({
  lastCachedAt: customLastCachedAt,
  isOnline: customIsOnline,
  compact = false,
  className = '',
  onRefresh,
  showOnlineStatus = false,
}: OfflineBadgeProps) {
  const { isOnline: hookIsOnline, lastCachedAt: hookLastCachedAt } = usePWA();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isOnline = customIsOnline !== undefined ? customIsOnline : hookIsOnline;
  const lastCachedAt = customLastCachedAt !== undefined ? customLastCachedAt : hookLastCachedAt;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (e) {
        console.warn('[OfflineBadge] Refresh action failed:', e);
      }
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const formatTimestamp = (ts?: string | null) => {
    if (!ts) return 'recently';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return ts;
    }
  };

  // Compact Pill mode (e.g. for header nav / data tables)
  if (compact) {
    if (isOnline) {
      if (!showOnlineStatus) return null;
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 ${className}`}
          title="Connected to live STATIQONE data feed"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Wifi className="h-3 w-3" />
          <span>Live Feed</span>
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-500/30 ${className}`}
        title={`Offline mode. Data cached at ${formatTimestamp(lastCachedAt)}`}
      >
        <WifiOff className="h-3 w-3 text-amber-400" />
        <span>Cached ({formatTimestamp(lastCachedAt)})</span>
      </span>
    );
  }

  // If online and not requesting to show online status, return null
  if (isOnline && !showOnlineStatus) {
    return null;
  }

  // Full-width floating banner mode for offline mode
  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`w-full border-b border-amber-500/30 bg-amber-950/90 px-4 py-2.5 text-amber-200 shadow-md backdrop-blur-md transition-all ${className}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-300">
              <WifiOff className="h-4 w-4" />
            </span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-semibold text-amber-100">Offline Mode</span>
              <span className="text-amber-300/80 hidden sm:inline">•</span>
              <span className="text-amber-200/90 flex items-center gap-1">
                <Clock className="h-3 w-3 inline text-amber-400" />
                Showing cached data from {formatTimestamp(lastCachedAt)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/30 hover:text-white border border-amber-500/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Reconnecting...' : 'Retry'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Online banner (when showOnlineStatus = true)
  return (
    <div
      role="status"
      className={`w-full border-b border-emerald-500/20 bg-emerald-950/60 px-4 py-2 text-emerald-300 text-xs sm:text-sm flex items-center justify-between ${className}`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <Wifi className="h-3.5 w-3.5" />
        <span>Connected to live market streams</span>
      </div>
    </div>
  );
}
