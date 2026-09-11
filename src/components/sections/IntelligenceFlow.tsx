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
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <section className="border-b border-[#DEDDD7] bg-[#F7F6F2] py-16 sm:py-24" data-editorial-row="intelligence-flow">
      <Container>
        {/* Header */}
        <Reveal yOffset={12}>
          <div className="mb-12 max-w-3xl">
            <SectionLabel text="How the data flows" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              Transforming raw filings into{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                decision-grade intelligence
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              A 4-stage deterministic pipeline engineered for institutional quantitative research with verified regulatory lineage.
            </p>
          </div>
        </Reveal>

        {/* Connected Horizontal Pipeline Architecture */}
        <Reveal delay={0.1} yOffset={16}>
          <div className="rounded-[8px] bg-white border border-[#DEDDD7] overflow-hidden shadow-[0_1px_2px_rgba(20,20,18,0.04)]">
            {/* Step Navigation Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[#E9E7E1] divide-x divide-[#E9E7E1] bg-[#FBFAF7]">
              {FLOW_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 sm:p-5 text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white text-[#20201E]'
                        : 'hover:bg-white/60 text-[#77756E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-[#B9684E]">
                        Step {stage.step}
                      </span>
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-[#B9684E]' : 'text-[#9A9890]'}`} />
                    </div>
                    <div className="text-sm font-semibold text-[#20201E] truncate">
                      {stage.title}
                    </div>
                    {isSelected && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B9684E]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Step Showcase Panel */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#EAD8D0] text-[#B9684E] font-mono text-xs font-bold">
                    Stage {FLOW_STAGES[activeStep].step}
                  </span>
                  <span className="text-xs font-medium text-[#77756E]">
                    Deterministic Pipeline Execution
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#20201E]">
                  {FLOW_STAGES[activeStep].title}
                </h3>

                <p className="text-sm sm:text-base text-[#4F4E49] leading-relaxed max-w-xl">
                  {FLOW_STAGES[activeStep].description}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {FLOW_STAGES[activeStep].metadata.map((meta) => (
                    <span
                      key={meta}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#F7F6F2] border border-[#DEDDD7] text-xs font-mono text-[#4F4E49]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B9684E]" />
                      {meta}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Pipeline Schematic Card */}
              <div className="lg:col-span-5">
                <div className="p-5 rounded-[6px] bg-[#FBFAF7] border border-[#E9E7E1] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#77756E] border-b border-[#E9E7E1] pb-2 text-[11px]">
                    <span>PIPELINE TELEMETRY</span>
                    <span className="text-[#657B6C]">ACTIVE VERIFIED</span>
                  </div>

                  <div className="space-y-2 text-[#4F4E49] pt-1">
                    <div className="flex justify-between">
                      <span className="text-[#77756E]">Input Format:</span>
                      <span>SEC 10-K / FRED XML / IMF JSON</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#77756E]">Normalization:</span>
                      <span>ISO-8601 UTC / 250+ Sectors</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#77756E]">Variance Filter:</span>
                      <span>35-Year Baseline Variance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#77756E]">Output Feed:</span>
                      <span className="text-[#B9684E]">Parquet / WebSocket / REST</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
