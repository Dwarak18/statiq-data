import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OfflineFallbackBannerProps {
  isDegraded: boolean;
  errorMessage?: string | null;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function OfflineFallbackBanner({
  isDegraded,
  errorMessage,
  onRetry,
  isRetrying = false,
}: OfflineFallbackBannerProps) {
  if (!isDegraded && !errorMessage) return null;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md p-3 sm:p-4 text-amber-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            {errorMessage ? <WifiOff className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-amber-300">
              <span>
                {errorMessage ? 'Upstream Live Gateway Latency' : 'Stale-While-Revalidate Cache Active'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <ShieldCheck className="h-2.5 w-2.5" /> High Resiliency Mode
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 leading-relaxed">
              {errorMessage ||
                'Displaying cached institutional quotes with zero downtime. Automated background pollers are reconciling live market exchange ticks.'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="h-8 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 text-xs shrink-0 self-end sm:self-center font-medium"
        >
          <RefreshCw className={`h-3 w-3 mr-1.5 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Reconnecting...' : 'Retry Connection'}
        </Button>
      </div>
    </div>
  );
}
