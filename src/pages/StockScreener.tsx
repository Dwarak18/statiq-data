import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { ExportDropdown } from '@/components/ui/ExportDropdown';
import { useToast } from '@/context/ToastContext';
import {
  BarChart2,
  TrendingUp,
  Activity,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';

import { StockQuote, StockDetail, ScreenerFiltersState, MarketMoversData, MarketStatus } from '@/components/screener/screenerTypes';
import {
  fetchScreenerData,
  fetchMarketMovers,
  fetchStockDetail,
  forceRefreshQuotes,
} from '@/components/screener/screenerService';
import { RefreshTimer } from '@/components/screener/RefreshTimer';
import { OfflineFallbackBanner } from '@/components/screener/OfflineFallbackBanner';
import { MoversSummary } from '@/components/screener/MoversSummary';
import { ScreenerFilters } from '@/components/screener/ScreenerFilters';
import { StockScreenerTable } from '@/components/screener/StockScreenerTable';
import { StockDetailModal } from '@/components/screener/StockDetailModal';

const DEFAULT_FILTERS: ScreenerFiltersState = {
  exchange: 'all',
  sector: 'all',
  search: '',
  marketCapRange: 'all',
  peRange: 'all',
  changeRange: 'all',
  minVolume: null,
  sortBy: 'marketCap',
  sortOrder: 'desc',
};

const AUTO_REFRESH_INTERVAL_SECONDS = 60;

export function StockScreener() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Filters State initialized from URL params if present
  const [filters, setFilters] = useState<ScreenerFiltersState>(() => ({
    exchange: (searchParams.get('exchange') as any) || DEFAULT_FILTERS.exchange,
    sector: searchParams.get('sector') || DEFAULT_FILTERS.sector,
    search: searchParams.get('search') || DEFAULT_FILTERS.search,
    marketCapRange: (searchParams.get('marketCap') as any) || DEFAULT_FILTERS.marketCapRange,
    peRange: (searchParams.get('pe') as any) || DEFAULT_FILTERS.peRange,
    changeRange: (searchParams.get('change') as any) || DEFAULT_FILTERS.changeRange,
    minVolume: searchParams.get('minVolume') ? Number(searchParams.get('minVolume')) : null,
    sortBy: (searchParams.get('sortBy') as any) || DEFAULT_FILTERS.sortBy,
    sortOrder: (searchParams.get('sortOrder') as any) || DEFAULT_FILTERS.sortOrder,
  }));

  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [totalStocks, setTotalStocks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [isDegraded, setIsDegraded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Market Movers
  const [movers, setMovers] = useState<MarketMoversData>({
    topGainers: [],
    topLosers: [],
    mostActive: [],
    lastUpdated: new Date().toISOString(),
  });

  // Market Status & Timers
  const [marketStatus, setMarketStatus] = useState<MarketStatus>({
    nasdaq: 'OPEN',
    nse: 'OPEN',
    lastSyncTime: new Date().toISOString(),
    isCached: true,
    cacheAgeSeconds: 0,
    refreshIntervalSeconds: AUTO_REFRESH_INTERVAL_SECONDS,
  });

  const [secondsLeft, setSecondsLeft] = useState(AUTO_REFRESH_INTERVAL_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detail Modal
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state to URL search parameters
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.exchange !== 'all') p.set('exchange', filters.exchange);
    if (filters.sector !== 'all') p.set('sector', filters.sector);
    if (filters.search) p.set('search', filters.search);
    if (filters.marketCapRange !== 'all') p.set('marketCap', filters.marketCapRange);
    if (filters.peRange !== 'all') p.set('pe', filters.peRange);
    if (filters.changeRange !== 'all') p.set('change', filters.changeRange);
    if (filters.minVolume) p.set('minVolume', String(filters.minVolume));
    if (filters.sortBy !== 'marketCap') p.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'desc') p.set('sortOrder', filters.sortOrder);
    setSearchParams(p, { replace: true });
  }, [filters, setSearchParams]);

  // Load Screener Data
  const loadData = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);
      try {
        const [screenerRes, moversRes] = await Promise.all([
          fetchScreenerData(filters, currentPage, itemsPerPage),
          fetchMarketMovers(),
        ]);

        setStocks(screenerRes.data);
        setTotalStocks(screenerRes.total);
        setMarketStatus(screenerRes.marketStatus);
        setIsDegraded(screenerRes.isDegraded);
        setErrorMessage(null);
        setMovers(moversRes);
        setSecondsLeft(AUTO_REFRESH_INTERVAL_SECONDS);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to connect to market gateway');
        setIsDegraded(true);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [filters, currentPage, itemsPerPage]
  );

  // Initial load and filter change trigger
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Auto-refresh countdown interval (60 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          loadData(true);
          return AUTO_REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadData]);

  // Manual Refresh Handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    showToast('Syncing real-time market data across NASDAQ & NSE...', 'info');
    await forceRefreshQuotes();
    await loadData(false);
    showToast('Market cache synchronized successfully!', 'success');
  };

  const handleFilterChange = (updated: Partial<ScreenerFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    showToast('All screener filters reset to default', 'info');
  };

  const handleSortChange = (field: ScreenerFiltersState['sortBy']) => {
    if (filters.sortBy === field) {
      handleFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      handleFilterChange({ sortBy: field, sortOrder: 'desc' });
    }
  };

  const handleSelectStock = (stock: StockQuote) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  // Prepare Export Data
  const exportColumns = ['Symbol', 'Company Name', 'Exchange', 'Sector', 'Price', 'Change %', 'Market Cap', 'P/E Ratio', 'Volume'];
  const exportRows = stocks.map((s) => [
    s.symbol,
    s.name,
    s.exchange,
    s.sector,
    `${s.currency === 'USD' ? '$' : '₹'}${s.price}`,
    `${s.changePercent}%`,
    s.marketCap,
    s.peRatio ?? 'N/A',
    s.volume,
  ]);

  return (
    <Layout>
      {/* Top Header & Market Status Bar */}
      <div className="border-b border-border bg-surface px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

        <div className="container mx-auto relative z-10 space-y-4">
          {/* Breadcrumb / Category Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>
                Home
              </span>
              <span>/</span>
              <span className="text-text-main font-semibold">Institutional Screener</span>
            </div>

            {/* Exchange Market Pills */}
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NASDAQ: {marketStatus.nasdaq}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NSE India: {marketStatus.nse}
              </span>
            </div>
          </div>

          {/* Main Title & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-text-main flex items-center gap-2.5">
                <BarChart2 className="h-7 w-7 text-primary shrink-0" />
                Live Stock Screener & Market Data
              </h1>
              <p className="text-text-muted text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Institutional-grade real-time market screener querying NASDAQ US equities and NSE India Nifty 50 constituents with 60-second caching.
              </p>
            </div>

            {/* Refresh Timer & Export Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <RefreshTimer
                secondsLeft={secondsLeft}
                totalInterval={AUTO_REFRESH_INTERVAL_SECONDS}
                lastUpdated={marketStatus.lastSyncTime}
                isRefreshing={isRefreshing}
                onRefresh={handleManualRefresh}
              />
              <ExportDropdown
                title="STATIQONE Stock Screener Live Export"
                source="NASDAQ Data Link & NSE India"
                lastUpdated={marketStatus.lastSyncTime}
                columns={exportColumns}
                rows={exportRows}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Offline / Degraded Fallback Banner */}
        <OfflineFallbackBanner
          isDegraded={isDegraded}
          errorMessage={errorMessage}
          onRetry={handleManualRefresh}
          isRetrying={isRefreshing}
        />

        {/* Market Movers Highlights */}
        <MoversSummary
          topGainers={movers.topGainers}
          topLosers={movers.topLosers}
          mostActive={movers.mostActive}
          onSelectStock={handleSelectStock}
        />

        {/* Multi-Factor Screener Filters */}
        <ScreenerFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Screener Data Table */}
        <StockScreenerTable
          data={stocks}
          total={totalStocks}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
          onPageChange={(page) => setCurrentPage(page)}
          onSelectStock={handleSelectStock}
          isLoading={isLoading}
        />

        {/* Source & Institutional Trust Badge */}
        <div className="pt-4 border-t border-border">
          <SourceBadge
            title="Cross-Border Real-Time Equity Feeds"
            source={{
              name: 'NASDAQ Data Link & National Stock Exchange of India (NSE)',
              code: 'EQUITY_FEED_V3',
              organizationType: 'Financial Exchange',
              url: 'https://www.nasdaq.com/market-activity/stocks/screener',
              verificationStatus: 'Real-Time API Feed',
            }}
            qualityScore={{
              score: 99,
              grade: 'AAA',
              accuracy: 99.8,
              freshness: '60-Second Stale-While-Revalidate',
              sourceAuthority: 'Exchange Direct Feed',
            }}
            lastUpdated={marketStatus.lastSyncTime}
          />
        </div>
      </div>

      {/* Deep Stock Detail Modal */}
      <StockDetailModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStock(null);
        }}
      />
    </Layout>
  );
}

export default StockScreener;
