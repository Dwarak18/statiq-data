import { StockQuote, StockDetail, ScreenerFiltersState, MarketMoversData, MarketStatus } from './screenerTypes';

const FALLBACK_STOCKS: StockQuote[] = [
  // NASDAQ
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Consumer Electronics', currency: 'USD', country: 'USA', price: 224.23, change: 3.12, changePercent: 1.41, volume: 48291020, marketCap: 3450200000000, peRatio: 33.4, high52w: 237.23, low52w: 164.08, dividendYield: 0.44 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', sector: 'Technology', industry: 'Software - Infrastructure', currency: 'USD', country: 'USA', price: 418.50, change: 4.80, changePercent: 1.16, volume: 21450000, marketCap: 3120000000000, peRatio: 35.8, high52w: 468.35, low52w: 309.45, dividendYield: 0.72 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors', currency: 'USD', country: 'USA', price: 122.40, change: 3.90, changePercent: 3.29, volume: 74320000, marketCap: 2980000000000, peRatio: 64.2, high52w: 140.76, low52w: 39.23, dividendYield: 0.03 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Communication Services', industry: 'Internet Content', currency: 'USD', country: 'USA', price: 172.80, change: -1.25, changePercent: -0.72, volume: 25600000, marketCap: 2150000000000, peRatio: 24.6, high52w: 191.75, low52w: 115.35, dividendYield: 0.46 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', industry: 'Internet Retail', currency: 'USD', country: 'USA', price: 180.50, change: 2.10, changePercent: 1.18, volume: 31450000, marketCap: 1880000000000, peRatio: 41.5, high52w: 201.20, low52w: 118.35, dividendYield: 0.0 },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', sector: 'Communication Services', industry: 'Internet Content', currency: 'USD', country: 'USA', price: 528.10, change: 9.40, changePercent: 1.81, volume: 14890000, marketCap: 1340000000000, peRatio: 26.8, high52w: 544.20, low52w: 279.40, dividendYield: 0.38 },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', currency: 'USD', country: 'USA', price: 214.50, change: -7.80, changePercent: -3.51, volume: 62100000, marketCap: 680000000000, peRatio: 68.4, high52w: 271.00, low52w: 138.80, dividendYield: 0.0 },
  { symbol: 'AVGO', name: 'Broadcom Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors', currency: 'USD', country: 'USA', price: 158.20, change: 4.10, changePercent: 2.66, volume: 18200000, marketCap: 740000000000, peRatio: 45.2, high52w: 185.16, low52w: 79.50, dividendYield: 1.34 },
  { symbol: 'COST', name: 'Costco Wholesale Corporation', exchange: 'NASDAQ', sector: 'Consumer Defensive', industry: 'Discount Stores', currency: 'USD', country: 'USA', price: 865.40, change: 5.20, changePercent: 0.60, volume: 2100000, marketCap: 385000000000, peRatio: 52.1, high52w: 896.67, low52w: 525.00, dividendYield: 0.54 },
  { symbol: 'PEP', name: 'PepsiCo Inc.', exchange: 'NASDAQ', sector: 'Consumer Defensive', industry: 'Beverages', currency: 'USD', country: 'USA', price: 170.80, change: -0.45, changePercent: -0.26, volume: 4800000, marketCap: 235000000000, peRatio: 24.8, high52w: 183.40, low52w: 155.83, dividendYield: 3.16 },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Communication Equipment', currency: 'USD', country: 'USA', price: 50.25, change: 0.35, changePercent: 0.70, volume: 16300000, marketCap: 202000000000, peRatio: 19.5, high52w: 58.19, low52w: 44.50, dividendYield: 3.18 },
  { symbol: 'ADBE', name: 'Adobe Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Software - Infrastructure', currency: 'USD', country: 'USA', price: 546.00, change: -6.20, changePercent: -1.12, volume: 2800000, marketCap: 245000000000, peRatio: 43.1, high52w: 638.25, low52w: 433.97, dividendYield: 0.0 },
  { symbol: 'TXN', name: 'Texas Instruments Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors', currency: 'USD', country: 'USA', price: 199.10, change: 1.80, changePercent: 0.91, volume: 5400000, marketCap: 182000000000, peRatio: 31.4, high52w: 212.80, low52w: 139.48, dividendYield: 2.61 },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors', currency: 'USD', country: 'USA', price: 169.50, change: -2.30, changePercent: -1.34, volume: 9100000, marketCap: 190000000000, peRatio: 21.3, high52w: 230.63, low52w: 104.33, dividendYield: 2.01 },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors', currency: 'USD', country: 'USA', price: 148.20, change: 5.60, changePercent: 3.93, volume: 42300000, marketCap: 240000000000, peRatio: 112.5, high52w: 227.30, low52w: 93.11, dividendYield: 0.0 },
  { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', sector: 'Technology', industry: 'Semiconductors', currency: 'USD', country: 'USA', price: 20.60, change: -0.95, changePercent: -4.41, volume: 55200000, marketCap: 88000000000, peRatio: -18.2, high52w: 51.28, low52w: 18.84, dividendYield: 2.43 },
  { symbol: 'INTU', name: 'Intuit Inc.', exchange: 'NASDAQ', sector: 'Technology', industry: 'Software - Application', currency: 'USD', country: 'USA', price: 642.50, change: 7.30, changePercent: 1.15, volume: 1600000, marketCap: 180000000000, peRatio: 61.2, high52w: 676.62, low52w: 470.00, dividendYield: 0.56 },
  { symbol: 'AMGN', name: 'Amgen Inc.', exchange: 'NASDAQ', sector: 'Healthcare', industry: 'Biotechnology', currency: 'USD', country: 'USA', price: 322.10, change: 1.40, changePercent: 0.44, volume: 2300000, marketCap: 172000000000, peRatio: 46.8, high52w: 346.85, low52w: 246.00, dividendYield: 2.80 },
  { symbol: 'HON', name: 'Honeywell International Inc.', exchange: 'NASDAQ', sector: 'Industrials', industry: 'Conglomerates', currency: 'USD', country: 'USA', price: 205.40, change: -1.10, changePercent: -0.53, volume: 2700000, marketCap: 134000000000, peRatio: 24.1, high52w: 218.26, low52w: 179.88, dividendYield: 2.10 },
  { symbol: 'SBUX', name: 'Starbucks Corporation', exchange: 'NASDAQ', sector: 'Consumer Cyclical', industry: 'Restaurants', currency: 'USD', country: 'USA', price: 95.80, change: 2.80, changePercent: 3.01, volume: 12400000, marketCap: 108000000000, peRatio: 26.2, high52w: 107.66, low52w: 71.55, dividendYield: 2.38 },

  // NSE INDIA
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', sector: 'Energy', industry: 'Oil & Gas', currency: 'INR', country: 'India', price: 2980.50, change: -14.20, changePercent: -0.47, volume: 6420190, marketCap: 2016500, peRatio: 28.1, high52w: 3217.90, low52w: 2220.30, dividendYield: 0.34 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services', currency: 'INR', country: 'India', price: 4250.00, change: 45.80, changePercent: 1.09, volume: 2150000, marketCap: 1540200, peRatio: 32.4, high52w: 4559.00, low52w: 3313.00, dividendYield: 1.25 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE', sector: 'Financial Services', industry: 'Banks - Diversified', currency: 'INR', country: 'India', price: 1640.25, change: 12.40, changePercent: 0.76, volume: 14800000, marketCap: 1245000, peRatio: 19.2, high52w: 1794.00, low52w: 1363.55, dividendYield: 1.19 },
  { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE', sector: 'Technology', industry: 'IT Services', currency: 'INR', country: 'India', price: 1865.40, change: 28.60, changePercent: 1.56, volume: 7800000, marketCap: 775000, peRatio: 29.8, high52w: 1950.00, low52w: 1358.35, dividendYield: 2.47 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE', sector: 'Financial Services', industry: 'Banks - Regional', currency: 'INR', country: 'India', price: 1190.80, change: 22.30, changePercent: 1.91, volume: 9200000, marketCap: 835000, peRatio: 18.5, high52w: 1257.80, low52w: 914.00, dividendYield: 0.84 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE', sector: 'Telecommunications', industry: 'Telecom Services', currency: 'INR', country: 'India', price: 1520.10, change: 18.50, changePercent: 1.23, volume: 5600000, marketCap: 880000, peRatio: 62.4, high52w: 1560.00, low52w: 846.50, dividendYield: 0.53 },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', sector: 'Financial Services', industry: 'Banks - Public', currency: 'INR', country: 'India', price: 818.50, change: -6.20, changePercent: -0.75, volume: 16400000, marketCap: 730000, peRatio: 11.2, high52w: 912.00, low52w: 555.25, dividendYield: 1.68 },
  { symbol: 'LICI', name: 'Life Insurance Corporation of India', exchange: 'NSE', sector: 'Financial Services', industry: 'Insurance - Life', currency: 'INR', country: 'India', price: 1060.00, change: 8.50, changePercent: 0.81, volume: 4300000, marketCap: 670000, peRatio: 16.4, high52w: 1222.00, low52w: 597.65, dividendYield: 0.94 },
  { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE', sector: 'Consumer Defensive', industry: 'FMCG', currency: 'INR', country: 'India', price: 501.20, change: 3.40, changePercent: 0.68, volume: 11200000, marketCap: 625000, peRatio: 30.5, high52w: 514.40, low52w: 399.30, dividendYield: 2.74 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE', sector: 'Consumer Defensive', industry: 'Household Products', currency: 'INR', country: 'India', price: 2720.00, change: -18.00, changePercent: -0.66, volume: 2400000, marketCap: 640000, peRatio: 61.8, high52w: 2800.00, low52w: 2172.05, dividendYield: 1.54 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE', sector: 'Industrials', industry: 'Engineering', currency: 'INR', country: 'India', price: 3675.00, change: 42.00, changePercent: 1.16, volume: 2900000, marketCap: 505000, peRatio: 36.7, high52w: 3919.90, low52w: 2650.00, dividendYield: 0.76 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', exchange: 'NSE', sector: 'Financial Services', industry: 'Credit Services', currency: 'INR', country: 'India', price: 6950.00, change: -85.00, changePercent: -1.21, volume: 1800000, marketCap: 430000, peRatio: 29.4, high52w: 8192.00, low52w: 6375.00, dividendYield: 0.52 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', currency: 'INR', country: 'India', price: 12240.00, change: 160.00, changePercent: 1.32, volume: 580000, marketCap: 385000, peRatio: 28.2, high52w: 13076.00, low52w: 9250.00, dividendYield: 1.02 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', exchange: 'NSE', sector: 'Healthcare', industry: 'Pharmaceuticals', currency: 'INR', country: 'India', price: 1710.00, change: 15.00, changePercent: 0.88, volume: 2200000, marketCap: 410000, peRatio: 39.5, high52w: 1760.00, low52w: 1090.00, dividendYield: 0.79 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', exchange: 'NSE', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', currency: 'INR', country: 'India', price: 1075.00, change: 29.50, changePercent: 2.82, volume: 8900000, marketCap: 395000, peRatio: 12.8, high52w: 1179.05, low52w: 593.50, dividendYield: 0.56 },
  { symbol: 'NTPC', name: 'NTPC Ltd', exchange: 'NSE', sector: 'Utilities', industry: 'Power Generation', currency: 'INR', country: 'India', price: 402.50, change: 4.80, changePercent: 1.21, volume: 12300000, marketCap: 390000, peRatio: 18.9, high52w: 425.00, low52w: 208.50, dividendYield: 1.86 },
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd', exchange: 'NSE', sector: 'Energy', industry: 'Oil & Gas E&P', currency: 'INR', country: 'India', price: 330.00, change: 5.20, changePercent: 1.60, volume: 21500000, marketCap: 415000, peRatio: 9.8, high52w: 344.75, low52w: 172.00, dividendYield: 3.71 },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd', exchange: 'NSE', sector: 'Utilities', industry: 'Power Transmission', currency: 'INR', country: 'India', price: 335.00, change: 2.10, changePercent: 0.63, volume: 14200000, marketCap: 310000, peRatio: 19.5, high52w: 366.50, low52w: 180.00, dividendYield: 3.36 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', exchange: 'NSE', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', currency: 'INR', country: 'India', price: 2740.00, change: 38.00, changePercent: 1.41, volume: 3800000, marketCap: 340000, peRatio: 31.2, high52w: 3014.00, low52w: 1450.00, dividendYield: 0.77 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', exchange: 'NSE', sector: 'Industrials', industry: 'Conglomerates', currency: 'INR', country: 'India', price: 3070.00, change: -42.00, changePercent: -1.35, volume: 2700000, marketCap: 350000, peRatio: 94.5, high52w: 3450.00, low52w: 2142.00, dividendYield: 0.04 },
];

export async function fetchScreenerData(
  filters: ScreenerFiltersState,
  page = 1,
  limit = 50
): Promise<{
  data: StockQuote[];
  total: number;
  marketStatus: MarketStatus;
  isDegraded: boolean;
}> {
  try {
    const params = new URLSearchParams();
    if (filters.exchange !== 'all') params.append('exchange', filters.exchange);
    if (filters.sector && filters.sector !== 'all') params.append('sector', filters.sector);
    if (filters.search) params.append('search', filters.search);
    if (filters.minVolume) params.append('minVolume', String(filters.minVolume));
    params.append('sortBy', filters.sortBy);
    params.append('sortOrder', filters.sortOrder);
    params.append('page', String(page));
    params.append('limit', String(limit));

    // Handle range filters
    if (filters.marketCapRange === 'mega') params.append('minMarketCap', '200000000000');
    else if (filters.marketCapRange === 'large') {
      params.append('minMarketCap', '10000000000');
      params.append('maxMarketCap', '200000000000');
    } else if (filters.marketCapRange === 'mid') {
      params.append('minMarketCap', '2000000000');
      params.append('maxMarketCap', '10000000000');
    } else if (filters.marketCapRange === 'small') {
      params.append('maxMarketCap', '2000000000');
    }

    if (filters.peRange === 'value') {
      params.append('minPE', '0.01');
      params.append('maxPE', '15');
    } else if (filters.peRange === 'garp') {
      params.append('minPE', '15');
      params.append('maxPE', '30');
    } else if (filters.peRange === 'growth') {
      params.append('minPE', '30');
    } else if (filters.peRange === 'negative') {
      params.append('maxPE', '0');
    }

    if (filters.changeRange === 'gainers_strong') params.append('minChange', '3');
    else if (filters.changeRange === 'gainers_modest') {
      params.append('minChange', '0');
      params.append('maxChange', '3');
    } else if (filters.changeRange === 'losers_modest') {
      params.append('minChange', '-3');
      params.append('maxChange', '0');
    } else if (filters.changeRange === 'losers_strong') {
      params.append('maxChange', '-3');
    }

    const res = await fetch(`/api/stocks/screener?${params.toString()}`, {
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return {
        data: json.data,
        total: json.pagination?.total ?? json.data.length,
        marketStatus: json.marketStatus ?? {
          nasdaq: 'OPEN',
          nse: 'OPEN',
          lastSyncTime: new Date().toISOString(),
          isCached: true,
          cacheAgeSeconds: 0,
          refreshIntervalSeconds: 60,
        },
        isDegraded: false,
      };
    }
  } catch (err) {
    // Graceful client-side fallback
  }

  // Client-side fallback computation
  let filtered = [...FALLBACK_STOCKS];

  if (filters.exchange !== 'all') {
    filtered = filtered.filter((s) => s.exchange === filters.exchange);
  }
  if (filters.sector && filters.sector !== 'all') {
    filtered = filtered.filter((s) => s.sector.toLowerCase() === filters.sector.toLowerCase());
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(
      (s) => s.symbol.toLowerCase().includes(term) || s.name.toLowerCase().includes(term)
    );
  }

  // Market Cap range
  if (filters.marketCapRange === 'mega') {
    filtered = filtered.filter((s) => s.marketCap >= (s.currency === 'USD' ? 200000000000 : 1500000));
  } else if (filters.marketCapRange === 'large') {
    filtered = filtered.filter(
      (s) =>
        s.marketCap >= (s.currency === 'USD' ? 10000000000 : 80000) &&
        s.marketCap < (s.currency === 'USD' ? 200000000000 : 1500000)
    );
  } else if (filters.marketCapRange === 'mid') {
    filtered = filtered.filter(
      (s) =>
        s.marketCap >= (s.currency === 'USD' ? 2000000000 : 16000) &&
        s.marketCap < (s.currency === 'USD' ? 10000000000 : 80000)
    );
  } else if (filters.marketCapRange === 'small') {
    filtered = filtered.filter((s) => s.marketCap < (s.currency === 'USD' ? 2000000000 : 16000));
  }

  // P/E ratio range
  if (filters.peRange === 'value') {
    filtered = filtered.filter((s) => s.peRatio !== null && s.peRatio > 0 && s.peRatio <= 15);
  } else if (filters.peRange === 'garp') {
    filtered = filtered.filter((s) => s.peRatio !== null && s.peRatio > 15 && s.peRatio <= 30);
  } else if (filters.peRange === 'growth') {
    filtered = filtered.filter((s) => s.peRatio !== null && s.peRatio > 30);
  } else if (filters.peRange === 'negative') {
    filtered = filtered.filter((s) => s.peRatio !== null && s.peRatio <= 0);
  }

  // Change range
  if (filters.changeRange === 'gainers_strong') {
    filtered = filtered.filter((s) => s.changePercent >= 3);
  } else if (filters.changeRange === 'gainers_modest') {
    filtered = filtered.filter((s) => s.changePercent >= 0 && s.changePercent < 3);
  } else if (filters.changeRange === 'losers_modest') {
    filtered = filtered.filter((s) => s.changePercent < 0 && s.changePercent >= -3);
  } else if (filters.changeRange === 'losers_strong') {
    filtered = filtered.filter((s) => s.changePercent < -3);
  }

  if (filters.minVolume) {
    filtered = filtered.filter((s) => s.volume >= filters.minVolume!);
  }

  // Sorting
  const dir = filters.sortOrder === 'asc' ? 1 : -1;
  filtered.sort((a, b) => {
    const valA = a[filters.sortBy] ?? 0;
    const valB = b[filters.sortBy] ?? 0;
    if (typeof valA === 'string') return dir * valA.localeCompare(String(valB));
    return dir * (Number(valA) - Number(valB));
  });

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return {
    data,
    total,
    marketStatus: {
      nasdaq: 'OPEN',
      nse: 'OPEN',
      lastSyncTime: new Date().toISOString(),
      isCached: true,
      cacheAgeSeconds: 15,
      refreshIntervalSeconds: 60,
    },
    isDegraded: true,
  };
}

export async function fetchMarketMovers(): Promise<MarketMoversData> {
  try {
    const res = await fetch('/api/stocks/movers', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        return {
          topGainers: json.topGainers,
          topLosers: json.topLosers,
          mostActive: json.mostActive,
          lastUpdated: json.lastUpdated || new Date().toISOString(),
        };
      }
    }
  } catch (e) {
    // Fallback
  }

  const all = [...FALLBACK_STOCKS];
  return {
    topGainers: [...all].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
    topLosers: [...all].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
    mostActive: [...all].sort((a, b) => b.volume - a.volume).slice(0, 5),
    lastUpdated: new Date().toISOString(),
  };
}

export async function fetchStockDetail(symbol: string): Promise<StockDetail | null> {
  try {
    const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    // Fallback
  }

  const found = FALLBACK_STOCKS.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
  if (!found) return null;

  const sparkline = [];
  const base = found.price - found.change;
  const step = found.change / 24;
  for (let i = 0; i <= 24; i++) {
    sparkline.push({
      time: `${String(9 + Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`,
      price: Number(Math.max(0.1, base + step * i + (Math.random() - 0.5) * (found.price * 0.003)).toFixed(2)),
    });
  }

  const span = found.high52w - found.low52w;
  const rangePos = span > 0 ? ((found.price - found.low52w) / span) * 100 : 50;

  return {
    ...found,
    sparkline,
    rangePosition: Number(rangePos.toFixed(1)),
    valuationCategory:
      (found.peRatio ?? 0) < 15
        ? 'Deep Value'
        : (found.peRatio ?? 0) <= 30
        ? 'Growth at Reasonable Price (GARP)'
        : (found.peRatio ?? 0) > 30
        ? 'High Multiple Growth'
        : 'Negative / Loss',
    marketCapCategory:
      found.marketCap >= (found.currency === 'USD' ? 200000000000 : 1500000)
        ? 'Mega Cap'
        : found.marketCap >= (found.currency === 'USD' ? 10000000000 : 80000)
        ? 'Large Cap'
        : found.marketCap >= (found.currency === 'USD' ? 2000000000 : 16000)
        ? 'Mid Cap'
        : 'Small Cap',
  };
}

export async function forceRefreshQuotes(): Promise<boolean> {
  try {
    const res = await fetch('/api/stocks/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
