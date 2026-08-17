import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StockQuote, ScreenerFiltersState } from './screenerTypes';
import { Button } from '@/components/ui/Button';

interface StockScreenerTableProps {
  data: StockQuote[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
  sortBy: ScreenerFiltersState['sortBy'];
  sortOrder: ScreenerFiltersState['sortOrder'];
  onSortChange: (field: ScreenerFiltersState['sortBy']) => void;
  onPageChange: (page: number) => void;
  onSelectStock: (stock: StockQuote) => void;
  isLoading?: boolean;
}

export function StockScreenerTable({
  data,
  total,
  currentPage,
  itemsPerPage,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  onSelectStock,
  isLoading = false,
}: StockScreenerTableProps) {
  const totalPages = Math.ceil(total / itemsPerPage) || 1;

  const formatCurrency = (val: number, currency: 'USD' | 'INR') => {
    const symbol = currency === 'USD' ? '$' : '₹';
    return `${symbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMarketCap = (cap: number, currency: 'USD' | 'INR') => {
    if (currency === 'USD') {
      if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
      if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
      if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
      return `$${cap.toLocaleString()}`;
    } else {
      // INR Market Caps are represented in Crores in the catalog
      if (cap >= 100000) return `₹${(cap / 100000).toFixed(2)}L Cr`;
      if (cap >= 1000) return `₹${(cap / 1000).toFixed(1)}k Cr`;
      return `₹${cap.toLocaleString()} Cr`;
    }
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}k`;
    return vol.toLocaleString();
  };

  const renderSortIcon = (field: ScreenerFiltersState['sortBy']) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3 w-3 text-text-muted/50 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-primary ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary ml-1 inline" />
    );
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm flex flex-col">
      {/* Table Top Metadata Bar */}
      <div className="px-4 py-3 bg-background/50 border-b border-border flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-text-main">{data.length}</strong> of{' '}
            <strong className="text-text-main">{total}</strong> live listings
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="hidden sm:inline">Click rows for full quantitative profile</span>
        </div>
      </div>

      {/* Table Responsive Scroll Container */}
      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface/90 text-[11px] font-bold uppercase tracking-wider text-text-muted sticky top-0 z-10 backdrop-blur-md">
              <th
                onClick={() => onSortChange('symbol')}
                className="py-3 px-4 cursor-pointer hover:text-text-main select-none"
              >
                Ticker {renderSortIcon('symbol')}
              </th>
              <th className="py-3 px-3">Exchange</th>
              <th className="py-3 px-3">Sector</th>
              <th
                onClick={() => onSortChange('price')}
                className="py-3 px-4 text-right cursor-pointer hover:text-text-main select-none"
              >
                Price {renderSortIcon('price')}
              </th>
              <th
                onClick={() => onSortChange('changePercent')}
                className="py-3 px-4 text-right cursor-pointer hover:text-text-main select-none"
              >
                24h Change {renderSortIcon('changePercent')}
              </th>
              <th
                onClick={() => onSortChange('marketCap')}
                className="py-3 px-4 text-right cursor-pointer hover:text-text-main select-none"
              >
                Market Cap {renderSortIcon('marketCap')}
              </th>
              <th
                onClick={() => onSortChange('peRatio')}
                className="py-3 px-3 text-right cursor-pointer hover:text-text-main select-none"
              >
                P/E {renderSortIcon('peRatio')}
              </th>
              <th
                onClick={() => onSortChange('volume')}
                className="py-3 px-4 text-right cursor-pointer hover:text-text-main select-none"
              >
                Volume {renderSortIcon('volume')}
              </th>
              <th className="py-3 px-4 text-center min-w-[140px]">52-Week Range</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono">
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-text-muted">
                  <p className="text-sm font-sans font-medium text-text-main">No stocks match your filter criteria.</p>
                  <p className="text-xs text-text-muted mt-1">Try relaxing sector or valuation thresholds.</p>
                </td>
              </tr>
            ) : (
              data.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                const rangeSpan = stock.high52w - stock.low52w;
                const rangePct = rangeSpan > 0 ? ((stock.price - stock.low52w) / rangeSpan) * 100 : 50;

                return (
                  <tr
                    key={`${stock.exchange}:${stock.symbol}`}
                    onClick={() => onSelectStock(stock)}
                    className="hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    {/* Ticker & Name */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-main text-xs group-hover:text-primary transition-colors flex items-center gap-1">
                          {stock.symbol}
                        </span>
                        <span className="font-sans text-[11px] text-text-muted truncate max-w-[140px] sm:max-w-[180px]">
                          {stock.name}
                        </span>
                      </div>
                    </td>

                    {/* Exchange Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold font-sans ${
                          stock.exchange === 'NASDAQ'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}
                      >
                        <span>{stock.exchange === 'NASDAQ' ? '🇺🇸' : '🇮🇳'}</span>
                        {stock.exchange}
                      </span>
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-3 font-sans text-xs text-text-muted max-w-[130px] truncate">
                      {stock.sector}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-semibold text-text-main">
                      {formatCurrency(stock.price, stock.currency)}
                    </td>

                    {/* 24h Change & % */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            isPositive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-0.5" />
                          )}
                          {isPositive ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                        <span className="text-[10px] text-text-muted mt-0.5">
                          {isPositive ? '+' : ''}
                          {stock.change.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-4 text-right font-medium text-text-main">
                      {formatMarketCap(stock.marketCap, stock.currency)}
                    </td>

                    {/* P/E Ratio */}
                    <td className="py-3 px-3 text-right text-text-muted">
                      {stock.peRatio !== null ? (
                        <span
                          className={
                            stock.peRatio > 0 && stock.peRatio < 20
                              ? 'text-emerald-400 font-semibold'
                              : stock.peRatio > 40
                              ? 'text-amber-400'
                              : 'text-text-main'
                          }
                        >
                          {stock.peRatio.toFixed(1)}x
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-4 text-right text-text-muted">
                      {formatVolume(stock.volume)}
                    </td>

                    {/* 52-Week Range Bar */}
                    <td className="py-3 px-4">
                      <div className="w-full flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] text-text-muted">
                          <span>{stock.low52w.toFixed(0)}</span>
                          <span className="font-semibold text-text-main">{rangePct.toFixed(0)}%</span>
                          <span>{stock.high52w.toFixed(0)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border relative">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full"
                            style={{ width: `${Math.max(5, Math.min(98, rangePct))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStock(stock);
                        }}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all text-text-muted"
                        title="View Detailed Quote & Sparkline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-background/50 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-text-muted">
          Page <strong className="text-text-main">{currentPage}</strong> of{' '}
          <strong className="text-text-main">{totalPages}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="h-8 px-2 text-xs border-border"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                  p === currentPage
                    ? 'bg-primary text-black font-bold shadow-sm'
                    : 'text-text-muted hover:text-text-main hover:bg-surface border border-transparent hover:border-border'
                }`}
              >
                {p}
              </button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="h-8 px-2 text-xs border-border"
          >
            Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
