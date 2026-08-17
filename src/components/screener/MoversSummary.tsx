import React from 'react';
import { TrendingUp, TrendingDown, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StockQuote } from './screenerTypes';

interface MoversSummaryProps {
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  mostActive: StockQuote[];
  onSelectStock: (stock: StockQuote) => void;
}

export function MoversSummary({
  topGainers,
  topLosers,
  mostActive,
  onSelectStock,
}: MoversSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Top Gainers Card */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Top Gainers</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted bg-background/60 px-2 py-0.5 rounded border border-border">
            24h Delta
          </span>
        </div>
        <div className="space-y-2">
          {topGainers.slice(0, 4).map((stock) => (
            <div
              key={`${stock.exchange}:${stock.symbol}`}
              onClick={() => onSelectStock(stock)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/80 cursor-pointer transition-all border border-transparent hover:border-border group"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs font-mono text-text-main group-hover:text-primary transition-colors">
                  {stock.symbol}
                </span>
                <span className="text-[10px] text-text-muted px-1 py-0.2 rounded bg-surface border border-border">
                  {stock.exchange}
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-xs font-mono text-text-main">
                  {stock.currency === 'USD' ? '$' : '₹'}
                  {stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="inline-flex items-center text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  +{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Decliners Card */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <TrendingDown className="h-4 w-4 text-rose-400" />
            <span>Top Decliners</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted bg-background/60 px-2 py-0.5 rounded border border-border">
            24h Delta
          </span>
        </div>
        <div className="space-y-2">
          {topLosers.slice(0, 4).map((stock) => (
            <div
              key={`${stock.exchange}:${stock.symbol}`}
              onClick={() => onSelectStock(stock)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/80 cursor-pointer transition-all border border-transparent hover:border-border group"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs font-mono text-text-main group-hover:text-primary transition-colors">
                  {stock.symbol}
                </span>
                <span className="text-[10px] text-text-muted px-1 py-0.2 rounded bg-surface border border-border">
                  {stock.exchange}
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-xs font-mono text-text-main">
                  {stock.currency === 'USD' ? '$' : '₹'}
                  {stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="inline-flex items-center text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Active Volume Card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Zap className="h-4 w-4 text-primary" />
            <span>Most Active Volume</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted bg-background/60 px-2 py-0.5 rounded border border-border">
            Shares Traded
          </span>
        </div>
        <div className="space-y-2">
          {mostActive.slice(0, 4).map((stock) => (
            <div
              key={`${stock.exchange}:${stock.symbol}`}
              onClick={() => onSelectStock(stock)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/80 cursor-pointer transition-all border border-transparent hover:border-border group"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs font-mono text-text-main group-hover:text-primary transition-colors">
                  {stock.symbol}
                </span>
                <span className="text-[10px] text-text-muted px-1 py-0.2 rounded bg-surface border border-border">
                  {stock.exchange}
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-[11px] font-mono text-text-muted">
                  {(stock.volume / 1000000).toFixed(1)}M vol
                </span>
                <span
                  className={`inline-flex items-center text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    stock.changePercent >= 0
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {stock.changePercent >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
