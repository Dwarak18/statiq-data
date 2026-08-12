import React from 'react';
import { Database, Cpu, LineChart, FileOutput } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';

const FLOW_STAGES = [
  {
    step: '01',
    label: 'Primary Ingestion',
    title: 'Direct API & EDGAR Parsers',
    icon: Database,
    description:
      'Real-time ingestion of 10-K filings, FRED series, and macro data streams with cryptographic hash verification and TLS 1.3 protocol.',
    metadata: ['SEC EDGAR 10-K/10-Q', 'FRED Central Bank Feeds', '3.54M Active Series'],
  },
  {
    step: '02',
    label: 'Intelligence Layer',
    title: 'Normalization & Alignment',
    icon: Cpu,
    description:
      'Automated taxonomy classification across 250+ sectors, multi-currency conversion, seasonal adjustment, and point-in-time time-series alignment.',
    metadata: ['250+ Sector Taxonomy', 'ISO-8601 UTC Stamps', 'Fx Cross-Conversion'],
  },
  {
    step: '03',
    label: 'Analysis Engine',
    title: 'Quantitative Synthesis',
    icon: LineChart,
    description:
      'Multi-series cross-correlation, automated statistical outlier screening, time-series forecasting, and natural language executive briefings.',
    metadata: ['Statistical Anomaly Filter', 'Multi-Series Correlation', 'Automated Briefings'],
  },
  {
    step: '04',
    label: 'Decision Output',
    title: 'Dossiers, API & Canvas',
    icon: FileOutput,
    description:
      'Exportable institutional dossiers in Excel, CSV, Parquet, and direct REST/WebSocket API endpoints for portfolio management integration.',
    metadata: ['Parquet / Excel / CSV', 'REST & WebSocket API v4', 'Interactive Canvas'],
  },
];

export function IntelligenceFlow() {
  return (
    <section className="border-b border-[#DEDDD7] bg-[#F7F6F2] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal yOffset={12}>
          <div className="mb-12 max-w-3xl">
            <SectionLabel number="02" text="PLATFORM ARCHITECTURE" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              How StatIQ One Transforms Raw Data into Decision-Grade Intelligence
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              A 4-stage deterministic data pipeline designed for institutional quantitative research with complete regulatory source lineage.
            </p>
          </div>
        </Reveal>

        {/* 4-Stage Conceptual Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {FLOW_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <Reveal key={stage.step} delay={idx * 0.1} yOffset={16}>
                <div className="flex flex-col h-full p-6 rounded-[8px] bg-white border border-[#DEDDD7] hover:border-[#B9684E]/40 transition-all group relative shadow-[0_1px_2px_rgba(20,20,18,0.04)]">
                  {/* Step header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#B9684E] bg-[#EAD8D0] px-2.5 py-1 rounded-[4px]">
                      {stage.step}
                    </span>
                    <Icon className="h-5 w-5 text-[#9A9890] group-hover:text-[#B9684E] transition-colors" />
                  </div>

                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#77756E] mb-1">
                    {stage.label}
                  </span>
                  <h3 className="font-heading text-base font-bold text-[#20201E] mb-2 group-hover:text-[#B9684E] transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#4F4E49] leading-relaxed mb-6 flex-1">
                    {stage.description}
                  </p>

                  {/* Metadata tags */}
                  <div className="border-t border-[#E9E7E1] pt-4 space-y-1.5">
                    {stage.metadata.map((meta) => (
                      <div
                        key={meta}
                        className="flex items-center text-[10px] font-mono text-[#77756E]"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#B9684E] mr-2 shrink-0" />
                        {meta}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
