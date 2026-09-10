import React from 'react';

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
            <div>
              <div className="text-sm font-medium text-[#20201E]">Data sources</div>
              <div className="text-sm font-medium text-text-main">Public institutional sources used in research workflows</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {SOURCES.map((source) => (
              <div key={source.name} className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-[#20201E]">{source.name}</span>
                <span className="text-[#9A9890]">/ {source.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
