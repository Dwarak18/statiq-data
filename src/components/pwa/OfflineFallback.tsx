import React from 'react';
import { WifiOff, RefreshCw, Home, BarChart2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface OfflineFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function OfflineFallback({
  title = 'You are currently offline',
  message = 'This financial intelligence view requires fresh market data or is not yet cached on your device. Please check your internet connection and try again.',
  onRetry,
}: OfflineFallbackProps) {
  const handleReload = () => {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 shadow-lg">
        <WifiOff className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400 leading-relaxed">{message}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleReload}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Connection</span>
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>

      <div className="mt-8 border-t border-slate-800 pt-6 max-w-sm w-full">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Cached Offline Features Available
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <Link
            to="/search"
            className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2 hover:border-slate-700 transition-colors"
          >
            <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Stock Screener</span>
          </Link>
          <Link
            to="/industry"
            className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2 hover:border-slate-700 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Insurance News</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
