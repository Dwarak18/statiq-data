import React, { useState } from 'react';
import { NewsArticle } from './types';
import { ExternalLink, Clock, ShieldCheck, Tag, Globe, Building2, User } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

function getSourceTheme(sourceCode: string, sourceName: string) {
  const code = (sourceCode || '').toUpperCase();
  const name = (sourceName || '').toLowerCase();

  if (code === 'IJ' || name.includes('insurance journal')) {
    return {
      bg: 'bg-blue-950/40 border-blue-800/60 text-blue-400',
      dot: 'bg-blue-500',
      label: 'Insurance Journal',
    };
  }
  if (code === 'RN' || name.includes('reinsurance news')) {
    return {
      bg: 'bg-rose-950/40 border-rose-800/60 text-rose-400',
      dot: 'bg-rose-500',
      label: 'Reinsurance News',
    };
  }
  if (code === 'TI' || name.includes('the insurer')) {
    return {
      bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400',
      dot: 'bg-emerald-500',
      label: 'The Insurer',
    };
  }
  if (code === 'BI' || name.includes('business insurance')) {
    return {
      bg: 'bg-amber-950/40 border-amber-800/60 text-amber-400',
      dot: 'bg-amber-500',
      label: 'Business Insurance',
    };
  }
  return {
    bg: 'bg-primary/10 border-primary/30 text-primary',
    dot: 'bg-primary',
    label: sourceName || 'Intelligence Feed',
  };
}

function getRegionBadge(region: string) {
  const r = (region || '').toLowerCase();
  if (r === 'usa') return { flag: '🇺🇸', label: 'USA', color: 'text-blue-400 border-blue-800/40 bg-blue-950/30' };
  if (r === 'europe') return { flag: '🇪🇺', label: 'Europe', color: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30' };
  if (r === 'asia') return { flag: '🌏', label: 'Asia', color: 'text-amber-400 border-amber-800/40 bg-amber-950/30' };
  return { flag: '🌐', label: 'Global', color: 'text-primary border-primary/30 bg-primary/10' };
}

export function NewsCard({ article }: NewsCardProps) {
  const [imgLoaded, setImgLoaded] = useState(true);
  const sourceTheme = getSourceTheme(article.sourceCode, article.source);
  const regionInfo = getRegionBadge(article.region);
  const relativeTime = formatRelativeTime(article.pubDate);

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-border bg-card/90 p-5 shadow-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
      <div>
        {/* Top Badges Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Source Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${sourceTheme.bg}`}
              title={`Source: ${article.source}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${sourceTheme.dot} animate-pulse`} />
              {article.source}
            </span>

            {/* Region Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${regionInfo.color}`}
            >
              <span>{regionInfo.flag}</span>
              <span>{regionInfo.label}</span>
            </span>
          </div>

          {/* Time Ago */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted shrink-0">
            <Clock className="h-3 w-3 text-text-muted" />
            <span>{relativeTime}</span>
          </div>
        </div>

        {/* Thumbnail Image (Optional) */}
        {article.imageUrl && imgLoaded && (
          <div className="relative mb-3.5 h-40 w-full overflow-hidden rounded-lg border border-border/60 bg-surface">
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              onError={() => setImgLoaded(false)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {article.category && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background/80 backdrop-blur-md border border-border/80 text-[10px] font-mono font-semibold text-text-main">
                  <Tag className="h-2.5 w-2.5 text-primary" />
                  {article.category}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Headline */}
        <h3 className="text-base font-bold font-heading text-text-main leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2.5">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:underline"
          >
            {article.title}
          </a>
        </h3>

        {/* Excerpt / Summary */}
        <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-4">
          {article.description}
        </p>
      </div>

      {/* Footer Meta & Action */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted truncate">
          <User className="h-3 w-3 text-text-muted shrink-0" />
          <span className="truncate">{article.author || article.source}</span>
        </div>

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-xs text-primary hover:text-hover transition-colors shrink-0 group/link"
          aria-label={`Read full article on ${article.source}: ${article.title}`}
        >
          <span>Read more</span>
          <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      </div>
    </article>
  );
}
