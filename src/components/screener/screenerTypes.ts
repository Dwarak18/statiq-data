export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NASDAQ' | 'NSE';
  sector: string;
  industry?: string;
  currency: 'USD' | 'INR';
  country: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume?: number;
  marketCap: number;
  peRatio: number | null;
  high52w: number;
  low52w: number;
  dividendYield?: number;
  lastUpdated?: string;
}

export interface StockDetail extends StockQuote {
  sparkline?: { time: string; price: number }[];
  rangePosition?: number;
  valuationCategory?: string;
  marketCapCategory?: string;
}

export interface ScreenerFiltersState {
  exchange: 'all' | 'NASDAQ' | 'NSE';
  sector: string;
  search: string;
  marketCapRange: 'all' | 'mega' | 'large' | 'mid' | 'small';
  peRange: 'all' | 'value' | 'garp' | 'growth' | 'negative';
  changeRange: 'all' | 'gainers_strong' | 'gainers_modest' | 'losers_modest' | 'losers_strong';
  minVolume: number | null;
  sortBy: 'marketCap' | 'changePercent' | 'peRatio' | 'price' | 'volume' | 'symbol' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface MarketMoversData {
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  mostActive: StockQuote[];
  lastUpdated: string;
}

export interface MarketStatus {
  nasdaq: string;
  nse: string;
  lastSyncTime: string;
  isCached: boolean;
  cacheAgeSeconds: number;
  refreshIntervalSeconds: number;
}
