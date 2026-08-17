export type NewsRegion = 'All' | 'USA' | 'Europe' | 'Asia' | 'Global';

export interface NewsArticle {
  id: string;
  guidHash: string;
  source: string;
  sourceCode: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  region: 'USA' | 'Europe' | 'Asia' | 'Global' | string;
  category?: string;
  author?: string;
  imageUrl?: string;
  isLocked?: boolean;
}

export interface NewsSourceInfo {
  id: string;
  name: string;
  sourceCode: string;
  url: string;
  region: string;
  status: 'healthy' | 'degraded' | 'error' | 'active';
  lastFetchedAt?: string;
  articleCount?: number;
  lastError?: string | null;
}

export interface NewsApiResponse {
  success: boolean;
  articles: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  tier: 'free' | 'monthly' | 'annual' | string;
  isGated: boolean;
  allowedPerRegion: number;
  regionCounts: {
    all?: number;
    USA?: number;
    Europe?: number;
    Asia?: number;
    Global?: number;
    [key: string]: number | undefined;
  };
  lastRefreshed: string;
  sources: NewsSourceInfo[];
  error?: string;
}
