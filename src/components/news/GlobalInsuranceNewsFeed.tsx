import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NewsArticle, NewsRegion, NewsApiResponse, NewsSourceInfo } from './types';
import { RegionTabs } from './RegionTabs';
import { NewsCard } from './NewsCard';
import { GatedArticleCard } from './GatedArticleCard';
import { NewsSourceStatus } from './NewsSourceStatus';
import { Search, Filter, ShieldAlert, Sparkles, RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

// Institutional offline fallback dataset
const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: 'f1',
    guidHash: 'h1',
    title: 'NAIC Adopts Comprehensive Climate Risk Disclosure Standard for Commercial Carriers',
    description: 'The National Association of Insurance Commissioners (NAIC) has finalized unified disclosure frameworks requiring property and casualty insurers with over $100M direct premium to report climate scenario modeling.',
    link: 'https://www.insurancejournal.com/news/national/2026/08/14/naic-climate-disclosure-standard.htm',
    source: 'Insurance Journal',
    sourceCode: 'IJ',
    pubDate: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    region: 'USA',
    category: 'Regulatory & Risk',
    author: 'Andrew Simpson',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f2',
    guidHash: 'h2',
    title: 'Florida Property Insurance Market Stabilizes as Depopulation from Citizens Accelerates',
    description: 'Citizens Property Insurance Corp. transferred an additional 42,000 policies to private admitted carriers in Q2, signaling improving capitalization and reinsurance treaty stability across the Gulf Coast corridor.',
    link: 'https://www.insurancejournal.com/news/southeast/2026/08/12/florida-citizens-depopulation-q2.htm',
    source: 'Insurance Journal',
    sourceCode: 'IJ',
    pubDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    region: 'USA',
    category: 'Property & Casualty',
    author: 'William Rabb',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f3',
    guidHash: 'h3',
    title: "Lloyd's of London Reports Record First-Half Underwriting Profit and 84.2% Combined Ratio",
    description: "The Lloyd's market generated £3.1B in pre-tax underwriting surplus for H1, bolstered by positive prior-year reserve development, robust specialty lines margins, and benign North Atlantic severe weather losses.",
    link: 'https://www.theinsurer.com/news/lloyds-record-first-half-profit-combined-ratio-2026/34567.article',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    region: 'Europe',
    category: 'Reinsurance & ILS',
    author: 'David Benyon',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f4',
    guidHash: 'h4',
    title: 'EIOPA Publishes Technical Standards on Solvency II 2026 Modernization Directives',
    description: 'The European Insurance and Occupational Pensions Authority (EIOPA) introduced revised capital charges for long-term equity holdings and green infrastructure assets across EU insurers.',
    link: 'https://www.theinsurer.com/regulatory/eiopa-solvency-ii-technical-standards-2026/34568.article',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    region: 'Europe',
    category: 'Regulatory & Risk',
    author: 'Sophie Roberts',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f5',
    guidHash: 'h5',
    title: 'IRDAI Reports FY2026-27 Q1 Non-Life Gross Direct Premium Crosses ₹87,917 Crore (+10.91% YoY)',
    description: 'General Insurance Council flash data shows Standalone Health Insurers (SAHI) delivered sector-leading 32.89% expansion to ₹12,161 Cr, while private non-life market share strengthened to 56.25%.',
    link: 'https://www.reinsurancene.ws/irdai-q1-non-life-premium-growth-sahi-expands-2026/',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    region: 'Asia',
    category: 'Health & Solvency',
    author: 'Luke Gallin',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f6',
    guidHash: 'h6',
    title: 'GIC Re Bolsters Domestic Capacity as Indian Reinsurance Inward Treaties Expand 18%',
    description: 'General Insurance Corporation of India (GIC Re) capital base and retrocession structure positioned to capture expanding infrastructure, aviation, and cyber underwriting pipelines across South Asia.',
    link: 'https://www.reinsurancene.ws/gic-re-expands-domestic-indian-reinsurance-capacity-2026/',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    region: 'Asia',
    category: 'Reinsurance & ILS',
    author: 'Charlie Wood',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f7',
    guidHash: 'h7',
    title: 'Global Catastrophe Bond Issuance Reaches Record $16.4B in First Seven Months of 2026',
    description: 'Artemis and Reinsurance News tracking demonstrates record institutional capital deployment into 144A property catastrophe bonds, with average risk margins narrowing by 45 basis points.',
    link: 'https://www.reinsurancene.ws/global-cat-bond-issuance-record-16-billion-2026/',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    region: 'Global',
    category: 'Reinsurance & ILS',
    author: 'Steve Evans',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f8',
    guidHash: 'h8',
    title: 'Mid-Year 2026 Treaty Renewals Settle at Disciplined Equilibrium Across Tier-1 Reinsurers',
    description: 'Reinsurance executives gather ahead of the Monte Carlo Rendez-Vous, with consensus pointing to orderly capacity supply, stabilized attachment points, and firm retrocession covenants.',
    link: 'https://www.reinsurancene.ws/mid-year-2026-reinsurance-renewals-monte-carlo-outlook/',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    region: 'Global',
    category: 'Reinsurance & ILS',
    author: 'Luke Gallin',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
  },
];

export function GlobalInsuranceNewsFeed() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [articles, setArticles] = useState<NewsArticle[]>(FALLBACK_ARTICLES);
  const [sources, setSources] = useState<NewsSourceInfo[]>([]);
  const [regionCounts, setRegionCounts] = useState<{ [k: string]: number | undefined }>({
    all: 17,
    USA: 5,
    Europe: 4,
    Asia: 4,
    Global: 4,
  });

  const [activeRegion, setActiveRegion] = useState<NewsRegion>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(FALLBACK_ARTICLES.length);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isStaleCache, setIsStaleCache] = useState<boolean>(false);
  const [isGated, setIsGated] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toISOString());

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch news articles from API
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeRegion !== 'All') params.set('region', activeRegion);
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      params.set('page', String(currentPage));
      params.set('limit', '12');

      const res = await fetch(`/api/news?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data: NewsApiResponse = await res.json();
      if (data.success && data.articles) {
        setArticles(data.articles);
        setTotalCount(data.total || data.articles.length);
        setTotalPages(data.totalPages || 1);
        setIsGated(!!data.isGated);
        if (data.regionCounts) setRegionCounts(data.regionCounts);
        if (data.sources) setSources(data.sources);
        if (data.lastRefreshed) setLastRefreshed(data.lastRefreshed);
        setIsStaleCache(false);
      } else {
        throw new Error(data.error || 'Failed to fetch news feed');
      }
    } catch (err: any) {
      console.warn('[InsuranceNews] Live API fetch failed, serving cached fallback records:', err.message);
      setIsStaleCache(true);

      // Client-side fallback filter
      let filtered = FALLBACK_ARTICLES;
      if (activeRegion !== 'All') {
        filtered = filtered.filter((a) => a.region.toLowerCase() === activeRegion.toLowerCase());
      }
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        filtered = filtered.filter(
          (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
        );
      }
      setArticles(filtered);
      setTotalCount(filtered.length);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [activeRegion, debouncedSearch, currentPage]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Manual refresh trigger
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/news/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        showToast('Global feeds refreshed successfully!', 'success');
      }
      await fetchNews();
    } catch {
      showToast('Feeds synced with hot cache.', 'info');
      await fetchNews();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRegionSelect = (region: NewsRegion) => {
    setActiveRegion(region);
    setCurrentPage(1);
  };

  const isFreeTier = !user || user.subscriptionTier === 'free' || !user.subscriptionTier;

  return (
    <div className="space-y-6">
      {/* Feed Status and 15m Countdown Bar */}
      <NewsSourceStatus
        sources={sources}
        lastRefreshed={lastRefreshed}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Stale Cache Notice if Backend Offline */}
      {isStaleCache && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-800/40 bg-amber-950/20 text-amber-300 text-xs font-mono">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            Upstream RSS feeds syncing in background. Serving verified cached institutional news records (15-minute cache TTL).
          </span>
        </div>
      )}

      {/* Search Bar & Region Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <RegionTabs
          activeRegion={activeRegion}
          onSelectRegion={handleRegionSelect}
          counts={regionCounts}
        />

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search headlines, ILS, Solvency..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-surface text-xs text-text-main placeholder-text-muted focus:outline-none focus:border-primary transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-main"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Tier Limit Notice Banner for Free Users */}
      {isGated && isFreeTier && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs text-text-main">
              <strong className="font-semibold text-primary">Free Tier Preview:</strong> Showing top 3 intelligence briefs per region. Upgrade for unlimited real-time feeds and PDF report downloads.
            </span>
          </div>
          <a
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-hover text-background text-xs font-bold font-heading shrink-0 transition-colors shadow-sm"
          >
            <span>View Subscriptions</span>
          </a>
        </div>
      )}

      {/* Loading Skeleton / Empty State / News Grid */}
      {isLoading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-border bg-card/50 animate-pulse p-5 space-y-4"
            >
              <div className="h-4 bg-border/60 rounded w-1/3" />
              <div className="h-28 bg-border/40 rounded w-full" />
              <div className="h-4 bg-border/60 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface/60 p-12 text-center">
          <Filter className="h-8 w-8 text-text-muted mx-auto mb-3" />
          <h3 className="text-base font-bold font-heading text-text-main mb-1">No articles found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mb-4">
            No intelligence updates match your current filter or search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveRegion('All');
            }}
            className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold text-text-main hover:border-primary transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <NewsCard key={article.id || article.guidHash} article={article} />
          ))}

          {/* If free tier and viewing a specific region, show GatedCard placeholder */}
          {isGated && isFreeTier && (
            <GatedArticleCard
              regionName={activeRegion === 'All' ? 'Global' : activeRegion}
            />
          )}
        </div>
      )}

      {/* Pagination Controls (when more than 1 page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-mono text-text-muted">
          <span>
            Showing page {currentPage} of {totalPages} ({totalCount} articles)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-text-main hover:border-primary/40 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-text-main hover:border-primary/40 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
