import React from 'react';
import { Search, Filter, RotateCcw, Building, DollarSign, Percent, BarChart3, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScreenerFiltersState } from './screenerTypes';

interface ScreenerFiltersProps {
  filters: ScreenerFiltersState;
  onChange: (updated: Partial<ScreenerFiltersState>) => void;
  onReset: () => void;
  availableSectors?: string[];
}

const DEFAULT_SECTORS = [
  'Technology',
  'Financial Services',
  'Consumer Cyclical',
  'Consumer Defensive',
  'Healthcare',
  'Industrials',
  'Energy',
  'Utilities',
  'Telecommunications',
  'Materials',
];

export function ScreenerFilters({
  filters,
  onChange,
  onReset,
  availableSectors = DEFAULT_SECTORS,
}: ScreenerFiltersProps) {
  // Count how many non-default filters are active
  let activeCount = 0;
  if (filters.exchange !== 'all') activeCount++;
  if (filters.sector && filters.sector !== 'all') activeCount++;
  if (filters.search) activeCount++;
  if (filters.marketCapRange !== 'all') activeCount++;
  if (filters.peRange !== 'all') activeCount++;
  if (filters.changeRange !== 'all') activeCount++;
  if (filters.minVolume !== null) activeCount++;

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Row: Search & Market Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Exchange Toggle Buttons */}
        <div className="inline-flex rounded-lg bg-background p-1 border border-border self-start">
          <button
            type="button"
            onClick={() => onChange({ exchange: 'all' })}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filters.exchange === 'all'
                ? 'bg-primary text-black shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            All Markets (50+)
          </button>
          <button
            type="button"
            onClick={() => onChange({ exchange: 'NASDAQ' })}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.exchange === 'NASDAQ'
                ? 'bg-primary text-black shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <span>🇺🇸</span> NASDAQ (US)
          </button>
          <button
            type="button"
            onClick={() => onChange({ exchange: 'NSE' })}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.exchange === 'NSE'
                ? 'bg-primary text-black shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <span>🇮🇳</span> NSE India (IN)
          </button>
        </div>

        {/* Search Bar & Reset Trigger */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Search ticker (AAPL, RELIANCE) or company name..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-border text-xs text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary/60 transition-colors"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onChange({ search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-9 px-2.5 text-xs text-text-muted hover:text-rose-400 border-border hover:border-rose-400/40"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset ({activeCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-border/50 text-xs">
        {/* Sector Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Building className="h-3 w-3 text-primary" /> Sector
          </label>
          <select
            value={filters.sector}
            onChange={(e) => onChange({ sector: e.target.value })}
            className="w-full h-8 px-2 rounded-md bg-background border border-border text-text-main text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">All Sectors</option>
            {availableSectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Market Cap Range */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-primary" /> Market Cap
          </label>
          <select
            value={filters.marketCapRange}
            onChange={(e) => onChange({ marketCapRange: e.target.value as any })}
            className="w-full h-8 px-2 rounded-md bg-background border border-border text-text-main text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">All Market Caps</option>
            <option value="mega">Mega Cap (&gt; $200B / ₹15L Cr)</option>
            <option value="large">Large Cap ($10B - $200B)</option>
            <option value="mid">Mid Cap ($2B - $10B)</option>
            <option value="small">Small Cap (&lt; $2B)</option>
          </select>
        </div>

        {/* P/E Ratio Range */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Layers className="h-3 w-3 text-primary" /> P/E Ratio
          </label>
          <select
            value={filters.peRange}
            onChange={(e) => onChange({ peRange: e.target.value as any })}
            className="w-full h-8 px-2 rounded-md bg-background border border-border text-text-main text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">All Valuations</option>
            <option value="value">Deep Value (&lt; 15x)</option>
            <option value="garp">GARP (15x - 30x)</option>
            <option value="growth">High Multiple (&gt; 30x)</option>
            <option value="negative">Negative / Loss</option>
          </select>
        </div>

        {/* 24h Change % */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Percent className="h-3 w-3 text-primary" /> Price Change %
          </label>
          <select
            value={filters.changeRange}
            onChange={(e) => onChange({ changeRange: e.target.value as any })}
            className="w-full h-8 px-2 rounded-md bg-background border border-border text-text-main text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">All Price Moves</option>
            <option value="gainers_strong">High Gainers (&gt; +3%)</option>
            <option value="gainers_modest">Modest Gainers (0% to +3%)</option>
            <option value="losers_modest">Modest Decliners (0% to -3%)</option>
            <option value="losers_strong">Heavy Decliners (&lt; -3%)</option>
          </select>
        </div>

        {/* Volume Threshold */}
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-primary" /> Min Volume
          </label>
          <select
            value={filters.minVolume ?? 'all'}
            onChange={(e) =>
              onChange({ minVolume: e.target.value === 'all' ? null : Number(e.target.value) })
            }
            className="w-full h-8 px-2 rounded-md bg-background border border-border text-text-main text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">Any Volume</option>
            <option value="10000000">&gt; 10 Million</option>
            <option value="5000000">&gt; 5 Million</option>
            <option value="1000000">&gt; 1 Million</option>
            <option value="100000">&gt; 100,000</option>
          </select>
        </div>
      </div>
    </div>
  );
}
