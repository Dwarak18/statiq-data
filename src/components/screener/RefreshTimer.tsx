import React from 'react';
import { RefreshCw, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RefreshTimerProps {
  secondsLeft: number;
  totalInterval: number;
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function RefreshTimer({
  secondsLeft,
  totalInterval = 60,
  lastUpdated,
  isRefreshing,
  onRefresh,
}: RefreshTimerProps) {
  const percentage = Math.max(0, Math.min(100, (secondsLeft / totalInterval) * 100));

  const formatLastUpdated = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-surface/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-border text-xs shadow-sm">
      {/* Live Pulsing Dot */}
      <div className="flex items-center gap-1.5 font-medium text-text-muted">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
          <Activity className="h-3 w-3" /> Live
        </span>
      </div>

      <div className="h-3 w-px bg-border hidden sm:block" />

      {/* Countdown Timer */}
      <div className="flex items-center gap-2 text-text-muted font-mono text-xs">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span>
          Sync in <strong className="text-text-main font-semibold">{secondsLeft}s</strong>
        </span>
        {/* Visual Progress Bar */}
        <div className="w-12 h-1.5 bg-background rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="h-3 w-px bg-border hidden md:block" />

      {/* Last Updated Timestamp */}
      <div className="hidden md:flex items-center gap-1.5 text-text-muted text-[11px] font-mono">
        <span>Updated:</span>
        <span className="text-text-main font-medium">{formatLastUpdated(lastUpdated)}</span>
      </div>

      {/* Manual Instantaneous Refresh */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="h-7 px-2 text-xs hover:text-primary hover:bg-primary/10 ml-auto transition-all"
        title="Force Refresh Data"
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
        <span className="text-[11px] font-semibold">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
      </Button>
    </div>
  );
}
