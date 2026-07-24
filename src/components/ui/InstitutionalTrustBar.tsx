import React from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, Database } from 'lucide-react';

const SOURCES = [
  { name: 'SEC EDGAR', type: 'US Equities' },
  { name: 'International Monetary Fund', type: 'Global Macro' },
  { name: 'World Bank Open Data', type: 'Economic Series' },
  { name: 'Federal Reserve (FRED)', type: 'Central Banking' },
  { name: 'Eurostat', type: 'EU Market Data' },
  { name: 'OECD Financial Data', type: 'Institutional' }
];

export function InstitutionalTrustBar() {
  return (
    <div className="w-full border-y border-border bg-surface/50 py-8 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-primary">Institutional Trust & Source Integrity</div>
              <div className="text-sm font-medium text-text-main">3.5M+ Series Directly Ingested & Audited Real-Time</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {SOURCES.map((source) => (
              <div key={source.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:border-primary/30 transition-all text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-semibold text-text-main">{source.name}</span>
                <span className="text-[10px] text-text-muted font-mono">({source.type})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
