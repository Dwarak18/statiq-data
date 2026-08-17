import React, { useEffect, useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Building,
  Globe,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { StockQuote, StockDetail } from './screenerTypes';
import { fetchStockDetail } from './screenerService';
import { Button } from '@/components/ui/Button';

interface StockDetailModalProps {
  stock: StockQuote | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StockDetailModal({ stock, isOpen, onClose }: StockDetailModalProps) {
  const [detail, setDetail] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && stock) {
      setLoading(true);
      fetchStockDetail(stock.symbol)
        .then((res) => {
          setDetail(res || (stock as StockDetail));
        })
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [isOpen, stock]);

  if (!isOpen || !stock) return null;

  const current = detail || (stock as StockDetail);
  const isPositive = current.changePercent >= 0;
  const currencySymbol = current.currency === 'USD' ? '$' : '₹';

  // Format chart data
  const sparklineData = current.sparkline || [];
  const chartTimes = sparklineData.map((p) => p.time);
  const chartPrices = sparklineData.map((p) => p.price);

  const minPrice = chartPrices.length > 0 ? Math.min(...chartPrices) * 0.998 : current.price * 0.98;
  const maxPrice = chartPrices.length > 0 ? Math.max(...chartPrices) * 1.002 : current.price * 1.02;

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!params || !params[0]) return '';
        const item = params[0];
        return `<div style="font-family: monospace; font-size: 11px;">
          <div>Time: <strong>${item.name}</strong></div>
          <div>Price: <strong>${currencySymbol}${Number(item.value).toFixed(2)}</strong></div>
        </div>`;
      },
    },
    grid: { left: '3%', right: '3%', top: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: chartTimes.length > 0 ? chartTimes : ['09:30', '11:00', '13:00', '15:30'],
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: minPrice,
      max: maxPrice,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 10,
        formatter: (val: number) => `${currencySymbol}${val.toFixed(0)}`,
      },
    },
    series: [
      {
        name: current.symbol,
        type: 'line',
        data: chartPrices.length > 0 ? chartPrices : [current.price],
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: isPositive ? '#10B981' : '#EF4444',
          width: 2.5,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: isPositive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
              },
              {
                offset: 1,
                color: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)',
              },
            ],
          },
        },
      },
    ],
  };

  const formatMarketCap = (cap: number, curr: 'USD' | 'INR') => {
    if (curr === 'USD') {
      if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)} Trillion`;
      if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)} Billion`;
      return `$${cap.toLocaleString()}`;
    }
    if (cap >= 100000) return `₹${(cap / 100000).toFixed(2)} Lakh Crore`;
    return `₹${cap.toLocaleString()} Crore`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-background/50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-primary/30 text-primary font-bold font-mono text-sm shadow-inner">
              {current.symbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-text-main">{current.name}</h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    current.exchange === 'NASDAQ'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}
                >
                  {current.exchange} • {current.country}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {current.sector} {current.industry ? `• ${current.industry}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface border border-transparent hover:border-border transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Price & Delta Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border">
            <div>
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider block mb-1">
                Real-Time Spot Price
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-mono text-text-main">
                  {currencySymbol}
                  {current.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`inline-flex items-center text-sm font-mono font-bold px-2 py-0.5 rounded-lg ${
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="h-4 w-4 mr-0.5" /> : <ArrowDownRight className="h-4 w-4 mr-0.5" />}
                  {isPositive ? '+' : ''}
                  {current.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {current.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="h-3.5 w-3.5" /> STATIQONE Verified Feed
              </span>
            </div>
          </div>

          {/* Intraday Sparkline Chart */}
          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" /> Intraday Price Trajectory
              </span>
              <span className="text-[10px] font-mono text-text-muted">15-min Intervals</span>
            </div>
            <div className="h-[200px] w-full">
              <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          {/* 52-Week Range Slider */}
          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-text-muted uppercase tracking-wider">52-Week Range</span>
              <span className="font-mono text-text-main font-bold">
                Position: {current.rangePosition ?? 50}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border relative">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full"
                style={{ width: `${Math.max(5, Math.min(98, current.rangePosition ?? 50))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-text-muted">
              <span>Low: {currencySymbol}{current.low52w.toFixed(2)}</span>
              <span>High: {currencySymbol}{current.high52w.toFixed(2)}</span>
            </div>
          </div>

          {/* Key Quantitative Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">Market Cap</span>
              <span className="font-mono font-bold text-text-main text-xs sm:text-sm mt-0.5 block truncate">
                {formatMarketCap(current.marketCap, current.currency)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">P/E Ratio</span>
              <span className="font-mono font-bold text-text-main text-xs sm:text-sm mt-0.5 block">
                {current.peRatio ? `${current.peRatio.toFixed(1)}x` : 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">24h Traded Volume</span>
              <span className="font-mono font-bold text-text-main text-xs sm:text-sm mt-0.5 block">
                {(current.volume / 1000000).toFixed(2)}M
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">Div Yield</span>
              <span className="font-mono font-bold text-text-main text-xs sm:text-sm mt-0.5 block">
                {current.dividendYield ? `${current.dividendYield.toFixed(2)}%` : '0.00%'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">Valuation Tag</span>
              <span className="font-semibold text-primary text-xs mt-0.5 block truncate">
                {current.valuationCategory || 'Standard'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">Cap Tier</span>
              <span className="font-semibold text-text-main text-xs mt-0.5 block truncate">
                {current.marketCapCategory || 'Large Cap'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">Country</span>
              <span className="font-semibold text-text-main text-xs mt-0.5 block">
                {current.country}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border">
              <span className="text-[11px] text-text-muted block">Data Feed</span>
              <span className="font-semibold text-emerald-400 text-xs mt-0.5 block">
                Real-Time Cached
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-background/50 flex items-center justify-between text-xs text-text-muted">
          <span>STATIQONE Market Gateway ID: #{current.symbol}-{current.exchange}</span>
          <Button variant="default" size="sm" onClick={onClose} className="h-8 px-4 text-xs font-semibold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
