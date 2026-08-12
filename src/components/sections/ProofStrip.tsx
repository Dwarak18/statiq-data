import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { DataPoint } from '@/components/ui/DataPoint';
import { Reveal } from '@/components/ui/Reveal';

const VERIFIED_SOURCES = [
  { name: 'SEC EDGAR', desc: 'US Equities & 10-K Filings' },
  { name: 'International Monetary Fund', desc: 'Global Macro (WEO)' },
  { name: 'World Bank Open Data', desc: 'Sovereign Economic Series' },
  { name: 'Federal Reserve (FRED)', desc: 'Central Banking & Rates' },
  { name: 'Eurostat', desc: 'EU Market & Trade Data' },
  { name: 'OECD Financial Data', desc: 'Institutional Research' },
];

export function ProofStrip() {
  return (
    <section className="border-b border-[#DEDDD7] bg-white py-12 sm:py-16">
      <Container>
        {/* Section Header */}
        <Reveal yOffset={12}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#E9E7E1] pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#B9684E] uppercase tracking-wider mb-1">
                <ShieldCheck className="h-4 w-4" />
                INSTITUTIONAL TRUST &amp; SOURCE INTEGRITY
              </div>
              <p className="text-xs sm:text-sm text-[#77756E]">
                Directly ingested from primary regulatory filings and sovereign institutions
              </p>
            </div>
            <span className="font-mono text-[11px] text-[#77756E] bg-[#F7F6F2] px-3 py-1 rounded-[4px] border border-[#DEDDD7] self-start sm:self-auto">
              ISO-8601 UTC Sync
            </span>
          </div>
        </Reveal>

        {/* Source Chips Row */}
        <Reveal delay={0.1} yOffset={16}>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide touch-scroller touch-pan-x">
            {VERIFIED_SOURCES.map((source) => (
              <div
                key={source.name}
                className="shrink-0 flex flex-col p-3 rounded-[6px] bg-[#FBFAF7] border border-[#E9E7E1] min-w-[200px]"
              >
                <span className="font-mono text-xs font-semibold text-[#20201E]">
                  {source.name}
                </span>
                <span className="text-[11px] text-[#77756E] mt-0.5">
                  {source.desc}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Key Metrics Row using DataPoint UI Primitives */}
        <Reveal delay={0.2} yOffset={16}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DataPoint
              value="3.5M+"
              label="Audited Statistics (3,542,109 active series)"
              source="FRED / SEC"
              trend="Updated Live"
            />
            <DataPoint
              value="250+"
              label="Covered Industry & Macro Sectors"
              source="Taxonomy v4"
              trend="Global Scope"
            />
            <DataPoint
              value="150+"
              label="Global Sovereign Economies"
              source="IMF / World Bank"
              trend="1990–2026"
            />
            <DataPoint
              value="45K+"
              label="Institutional Report Pages Ingested"
              source="SEC EDGAR"
              trend="10-K & 10-Q"
            />
          </div>
        </Reveal>

        {/* Content Integrity Placeholder */}
        <Reveal delay={0.3} yOffset={10}>
          <div className="mt-8 pt-4 border-t border-[#E9E7E1] flex items-center justify-between text-[11px] text-[#9A9890] font-mono">
            <span>
              [CONTENT PLACEHOLDER: Institutional Client Logos &amp; Partner Organizations]
            </span>
            <span>Zero Fabricated Client Claims</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
