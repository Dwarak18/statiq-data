import React from 'react';
import { Lock, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GatedArticleCardProps {
  regionName?: string;
}

export function GatedArticleCard({ regionName = 'Global' }: GatedArticleCardProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-b from-card/90 to-surface p-6 shadow-md backdrop-blur-md">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-primary/10 border border-primary/30 text-primary">
            <Lock className="h-3 w-3 text-primary" />
            <span>Tier Restricted</span>
          </span>
          <span className="text-[11px] font-mono text-text-muted">{regionName} Intelligence</span>
        </div>

        {/* Blurred Silhouette Content */}
        <div className="space-y-2.5 filter blur-[2px] opacity-40 select-none pointer-events-none mb-6">
          <div className="h-4 bg-text-muted/30 rounded w-3/4" />
          <div className="h-3 bg-text-muted/20 rounded w-full" />
          <div className="h-3 bg-text-muted/20 rounded w-5/6" />
        </div>

        <div className="relative z-10 text-center -mt-8 mb-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border border-primary/40 text-primary mb-3 shadow-inner">
            <Sparkles className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold font-heading text-text-main mb-1.5">
            Unlock Full {regionName} Intelligence Feed
          </h4>
          <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
            Free accounts receive 3 intelligence briefs per region. Upgrade to Monthly or Annual for unlimited real-time feeds and downloadable executive PDF dossiers.
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-2">
        <button
          onClick={() => navigate('/pricing')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-hover text-background text-xs font-bold font-heading shadow-md transition-all cursor-pointer group"
        >
          <span>Upgrade to Professional</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
