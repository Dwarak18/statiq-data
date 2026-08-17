import React, { useState, useEffect } from 'react';
import { NewsSourceInfo } from './types';
import { RefreshCw, Radio, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface NewsSourceStatusProps {
  sources: NewsSourceInfo[];
  lastRefreshed: string;
  onManualRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

const REFRESH_INTERVAL_SECONDS = 15 * 60; // 15 minutes

export function NewsSourceStatus({
  sources = [],
  lastRefreshed,
  onManualRefresh,
  isRefreshing,
}: NewsSourceStatusProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(REFRESH_INTERVAL_SECONDS);

  // Countdown timer for 15-minute refresh interval
  useEffect(() => {
    // Reset timer when lastRefreshed changes
    setSecondsRemaining(REFRESH_INTERVAL_SECONDS);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          onManualRefresh().catch(() => {});
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRefreshed, onManualRefresh]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const defaultSources: NewsSourceInfo[] = [
    { id: 'ij', name: 'Insurance Journal', sourceCode: 'IJ', url: '', region: 'USA', status: 'healthy' },
    { id: 'rn', name: 'Reinsurance News', sourceCode: 'RN', url: '', region: 'Global', status: 'healthy' },
    { id: 'ti', name: 'The Insurer', sourceCode: 'TI', url: '', region: 'Europe', status: 'healthy' },
    { id: 'bi', name: 'Business Insurance', sourceCode: 'BI', url: '', region: 'USA', status: 'healthy' },
  ];

  const displaySources = sources.length > 0 ? sources : defaultSources;

  return (
    <div className="rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-sm shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Feed Sources Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-muted pr-2 border-r border-border">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Active Feeds:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {displaySources.map((source) => {
              const isDegraded = source.status === 'degraded' || source.status === 'error';
              return (
                <div
                  key={source.id || source.sourceCode}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border text-[11px] font-mono font-medium text-text-main"
                  title={`${source.name} (${source.region}) - Status: ${source.status || 'Active'}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isDegraded ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  <span>{source.name}</span>
                  {source.articleCount !== undefined && source.articleCount > 0 && (
                    <span className="text-[10px] text-text-muted">({source.articleCount})</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sync & Refresh Stats */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 text-xs font-mono text-text-muted pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50">
          <div className="flex items-center gap-1.5" title="Next scheduled RSS background sync">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Auto-sync:</span>
            <span className="font-bold text-text-main bg-card px-2 py-0.5 rounded border border-border">
              {formattedCountdown}
            </span>
          </div>

          <button
            onClick={() => onManualRefresh()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-text-main hover:border-primary/50 hover:text-primary transition-all disabled:opacity-50 cursor-pointer text-xs font-mono font-semibold"
            aria-label="Refresh news feeds manually"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
