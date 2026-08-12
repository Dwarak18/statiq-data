import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Database, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

interface CapabilityItem {
  number: string;
  title: string;
  summary: string;
  details: string;
  proofTag: string;
  icon: React.ElementType;
  metadata: string[];
}

const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    title: 'Primary Source Lineage & SEC Audit Trail',
    summary: 'Every statistic links directly to its underlying SEC EDGAR filing, Fed release, or World Bank dataset.',
    details:
      'Eliminate unverified third-party estimates. StatIQ One preserves full cryptographic lineage for every time series point, enabling quantitative teams to inspect the exact line-item table, page number, and regulatory accession ID.',
    proofTag: 'SEC 10-K & 10-Q Raw Table Citation Parser',
    icon: ShieldCheck,
    metadata: ['SEC EDGAR Form 10-K/10-Q', 'FRED St. Louis Series', 'World Bank WDI Datasets'],
  },
  {
    number: '02',
    title: 'Multi-Format Data Export & Pipeline Sync',
    summary: 'Export clean datasets into Excel, CSV, JSON, Parquet, or connect directly via REST & WebSocket APIs.',
    details:
      'Seamlessly feed structured data into Python, R, Tableau, or proprietary portfolio management systems. High-throughput WebSocket feeds provide real-time updates as soon as regulatory filings hit EDGAR.',
    proofTag: 'Parquet / Excel / REST API v4 Sync',
    icon: Database,
    metadata: ['Apache Parquet (.parquet)', 'Excel (.xlsx) / CSV / JSON', 'REST & WebSocket v4 API'],
  },
  {
    number: '03',
    title: 'Cross-Sector Macro & Equity Correlation',
    summary: 'Simultaneously analyze sovereign GDP trajectories alongside enterprise financial statements.',
    details:
      'Unify macro-economic indicators (inflation, central bank policy rates, sovereign debt) with company-level segment revenues and operating margins across 250+ sector taxonomies.',
    proofTag: '250+ Sector Taxonomy & Cross-Series Alignment',
    icon: Layers,
    metadata: ['250+ Industry Sectors', '150+ Sovereign Economies', 'Point-in-Time Historical Alignment'],
  },
  {
    number: '04',
    title: 'AI-Powered Quantitative Synthesis',
    summary: 'Generate structured executive summaries and risk factor extractions from complex report filings.',
    details:
      'Extract critical signal from hundreds of pages of institutional research, earnings call transcripts, and regulatory footnotes using custom financial domain LLM synthesis.',
    proofTag: 'Automated Risk Extraction & Executive Briefings',
    icon: Sparkles,
    metadata: ['10-K Item 1A Risk Extraction', 'Automated Executive Digests', 'Natural Language SQL Query'],
  },
];

export function Capabilities() {
  const [expandedIdx, setExpandedIdx] = useState<number>(0);

  const toggleItem = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? -1 : idx);
  };

  return (
    <section id="capabilities" className="border-b border-[#DEDDD7] bg-[#F7F6F2] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal yOffset={12}>
          <div className="mb-12 max-w-3xl">
            <SectionLabel number="04" text="CORE CAPABILITIES" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              Engineered for Rigorous Quantitative Research
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              Designed for institutional analysts who demand verified primary sources, zero visual noise, and developer-grade throughput.
            </p>
          </div>
        </Reveal>

        {/* Asymmetric Editorial Accordion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Editorial Description */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <Reveal delay={0.1} yOffset={16}>
              <div className="p-6 rounded-[8px] bg-white border border-[#DEDDD7] space-y-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#B9684E] font-bold">
                  Platform Standard
                </span>
                <h3 className="font-heading text-lg font-bold text-[#20201E]">
                  Editorial Numbered Architecture
                </h3>
                <p className="text-xs text-[#77756E] leading-relaxed">
                  Click any capability to inspect underlying data pipelines, verified proof tags, and output formats. No generic feature cards.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold border-[#DEDDD7] hover:border-[#B9684E]/50 text-[#20201E]"
                    onClick={() => window.location.href = '/statistics'}
                  >
                    Browse Capabilities
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-[#B9684E]" />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Numbered Editorial List with Active Reveal */}
          <div className="lg:col-span-8 space-y-0">
            {CAPABILITIES.map((cap, idx) => {
              const isExpanded = expandedIdx === idx;
              const Icon = cap.icon;

              return (
                <Reveal key={cap.number} delay={idx * 0.08} yOffset={16}>
                  <div
                    className={`border-b transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-white border-[#DEDDD7]'
                        : 'bg-transparent border-[#E9E7E1]'
                    } ${idx === 0 ? 'border-t' : ''}`}
                  >
                    {/* Header trigger button */}
                    <button
                      type="button"
                      onClick={() => toggleItem(idx)}
                      aria-expanded={isExpanded}
                      aria-controls={`capability-panel-${idx}`}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E] group"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-mono text-base sm:text-lg font-bold text-[#B9684E] shrink-0 mt-0.5">
                          {cap.number} —
                        </span>
                        <div>
                          <h3 className="font-heading text-base sm:text-lg font-bold text-[#20201E] group-hover:text-[#B9684E] transition-colors">
                            {cap.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#77756E] mt-1 font-normal leading-relaxed">
                            {cap.summary}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 pt-1">
                        <ChevronDown
                          className={`h-5 w-5 text-[#9A9890] transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-[#B9684E]' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expanded panel content */}
                    {isExpanded && (
                      <div
                        id={`capability-panel-${idx}`}
                        className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-[#E9E7E1] animate-in fade-in duration-200"
                      >
                        <div className="pt-4 space-y-4">
                          <p className="text-xs sm:text-sm text-[#4F4E49] leading-relaxed">
                            {cap.details}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E9E7E1]">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-[4px] text-[10px] font-mono tracking-wider uppercase bg-[#EAD8D0] text-[#B9684E] border border-[#B9684E]/20 font-bold">
                              <Icon className="h-3 w-3 mr-1.5" />
                              {cap.proofTag}
                            </span>

                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#77756E]">
                              {cap.metadata.map((m) => (
                                <span key={m} className="bg-[#F7F6F2] px-2 py-0.5 rounded-[4px] border border-[#DEDDD7]">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
