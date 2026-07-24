import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const TICKER_DATA: TickerItem[] = [
  { symbol: 'SPX', name: 'S&P 500', value: '5,842.10', change: '+0.42%', isPositive: true },
  { symbol: 'NDX', name: 'Nasdaq 100', value: '18,485.30', change: '+0.65%', isPositive: true },
  { symbol: 'DJI', name: 'Dow Jones', value: '42,514.80', change: '-0.12%', isPositive: false },
  { symbol: 'US10Y', name: 'US 10Y Yield', value: '4.21%', change: '-0.03', isPositive: false },
  { symbol: 'BRENT', name: 'Brent Crude', value: '$74.50', change: '+1.10%', isPositive: true },
  { symbol: 'XAUUSD', name: 'Spot Gold', value: '$2,735.40', change: '+0.85%', isPositive: true },
  { symbol: 'EURUSD', name: 'EUR/USD', value: '1.0852', change: '+0.15%', isPositive: true },
  { symbol: 'BTC', name: 'Bitcoin', value: '$67,420.00', change: '+2.80%', isPositive: true },
];

export function MarketTicker() {
  return (
    <div className="w-full border-b border-border bg-surface/90 backdrop-blur-md px-4 py-2 text-xs font-mono">
      <div className="container mx-auto flex items-center justify-between gap-6 overflow-hidden">
        {/* Real-time Indicator */}
        <div className="flex items-center gap-2 shrink-0 border-r border-border pr-4 text-text-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-semibold text-text-main tracking-tight uppercase text-[10px]">Real-Time Feed</span>
        </div>

        {/* Ticker Items Marquee */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-0.5">
          {TICKER_DATA.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity cursor-pointer">
              <span className="font-bold text-text-main">{item.symbol}</span>
              <span className="text-text-muted">{item.value}</span>
              <span className={`flex items-center font-medium ${item.isPositive ? 'text-success' : 'text-danger'}`}>
                {item.isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>

        {/* Market Status */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 border-l border-border pl-4 text-[11px] text-text-muted">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span>Markets Open • SEC & Fed Sync Active</span>
        </div>
      </div>
    </div>
  );
}
