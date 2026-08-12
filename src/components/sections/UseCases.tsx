import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';

interface PathwayContent {
  role: string;
  headline: string;
  description: string;
  benefits: string[];
  outputTypes: string[];
  metricPreview: {
    label: string;
    value: string;
    sub: string;
  };
}

const USE_CASE_TABS: TabItem[] = [
  { id: 'researchers', label: 'Researchers' },
  { id: 'businesses', label: 'Businesses' },
  { id: 'analysts', label: 'Analysts' },
  { id: 'executives', label: 'Decision Makers' },
];

const PATHWAYS: Record<string, PathwayContent> = {
  researchers: {
    role: 'Researchers & Academic Economists',
    headline: '35+ Years of Sovereign Macro & Econometric Data',
    description:
      'Access 3.5 million+ audited time-series datasets spanning sovereign GDP trajectories, central bank policy rates, and global trade flows from IMF, World Bank, and OECD.',
    benefits: [
      '35-year point-in-time historical econometric baselines',
      'Direct Python & R Parquet pipeline integration via API v4',
      'Automated seasonal adjustment & currency conversion',
    ],
    outputTypes: ['Econometric Parquet Files', 'IMF WEO Macro Dossiers', 'Cross-Sovereign Rate Models'],
    metricPreview: {
      label: 'Sovereign Macro Coverage',
      value: '150+ Markets',
      sub: '1990–2026 Historical Time Series',
    },
  },
  businesses: {
    role: 'Corporate Strategy & Business Leaders',
    headline: 'Sector Revenue Benchmarks & Supply Chain Pricing',
    description:
      'Monitor enterprise competitor revenues, sector market share distributions, and capital expenditure allocations in real time across 250+ covered industries.',
    benefits: [
      'Real-time segment revenue share tracking across top equities',
      'Semiconductor & EV supply chain capex allocation benchmarks',
      'Custom sector dashboard exports for strategic planning',
    ],
    outputTypes: ['250+ Sector Market Shares', 'CapEx Multiples Report', 'Supply Chain Index'],
    metricPreview: {
      label: 'Covered Sectors',
      value: '250+ Industries',
      sub: 'Audited Enterprise Financial Metrics',
    },
  },
  analysts: {
    role: 'Buy-Side & Sell-Side Equity Analysts',
    headline: 'Automated SEC 10-K Line Item Extraction',
    description:
      'Skip manual filing lookups. Instantly pull audited balance sheet items, income statements, operating margins, and earnings surprises with primary SEC CIK citations.',
    benefits: [
      'Direct SEC EDGAR 10-K & 10-Q line-item table extraction',
      'Earnings surprise metrics & valuation multiple trackers',
      'Excel (.xlsx) financial model auto-populators',
    ],
    outputTypes: ['SEC 10-K Financial Tables', 'Valuation Multiple Models', 'Excel Model Files'],
    metricPreview: {
      label: 'Top Equity Coverage',
      value: '$30T+ Market Cap',
      sub: 'AAPL, MSFT, NVDA, GOOGL, AMZN',
    },
  },
  executives: {
    role: 'C-Suite Executives & Investment Boards',
    headline: 'High-Level Executive Briefings & Country Risk Scores',
    description:
      'Consume concise quantitative executive summaries, country geopolitical risk ratings, and weekly macro intelligence digests designed for board-level evaluation.',
    benefits: [
      'Natural language executive summaries powered by domain AI',
      'Sovereign credit & country risk ratings updated continuously',
      'Weekly institutional digest in-box briefings',
    ],
    outputTypes: ['Executive Briefing PDFs', 'Country Risk Ratings', 'Board Intelligence Summaries'],
    metricPreview: {
      label: 'Executive Reports',
      value: '45K+ Pages',
      sub: 'Audited Research Briefings',
    },
  },
};

export function UseCases() {
  const [activeTab, setActiveTab] = useState('analysts');

  const currentPathway = PATHWAYS[activeTab] || PATHWAYS.analysts;

  return (
    <section id="use-cases" className="border-b border-[#DEDDD7] bg-[#F7F6F2] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal yOffset={12}>
          <div className="mb-10 max-w-3xl">
            <SectionLabel number="06" text="SECTOR PATHWAYS" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              Tailored Solutions Across the Investment Ecosystem
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              Select your role to view specialized workflows, data outputs, and institutional benefits.
            </p>
          </div>
        </Reveal>

        {/* Tab Selector */}
        <Reveal delay={0.1} yOffset={16}>
          <div className="mb-8">
            <Tabs
              tabs={USE_CASE_TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="underline"
              size="lg"
            />
          </div>
        </Reveal>

        {/* Dynamic Asymmetric Content Panel */}
        <Reveal delay={0.2} yOffset={16}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-[8px] bg-white border border-[#DEDDD7] shadow-[0_1px_2px_rgba(20,20,18,0.04)] items-center">
            {/* Left Column (7 cols): Role Details & Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="font-mono text-xs text-[#B9684E] font-bold uppercase tracking-wider block mb-1">
                  {currentPathway.role}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#20201E]">
                  {currentPathway.headline}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#4F4E49] leading-relaxed">
                {currentPathway.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentPathway.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 text-xs sm:text-sm text-[#20201E]">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAD8D0] text-[#B9684E] mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E9E7E1] flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => window.location.href = '/signup'}
                  className="font-bold text-xs"
                >
                  Explore Role Pathway
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Right Column (5 cols): Metric Card & Outputs Preview */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-[6px] bg-[#FBFAF7] border border-[#DEDDD7] space-y-5">
                <div className="border-b border-[#E9E7E1] pb-4">
                  <span className="text-[11px] font-mono text-[#77756E] uppercase tracking-wider block">
                    {currentPathway.metricPreview.label}
                  </span>
                  <div className="font-mono text-3xl font-bold text-[#B9684E] mt-1">
                    {currentPathway.metricPreview.value}
                  </div>
                  <span className="text-xs font-mono text-[#4F4E49] block mt-0.5">
                    {currentPathway.metricPreview.sub}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#77756E] uppercase tracking-wider block mb-2">
                    Delivered Output Formats:
                  </span>
                  <div className="space-y-1.5">
                    {currentPathway.outputTypes.map((out) => (
                      <div
                        key={out}
                        className="flex items-center text-xs font-mono text-[#20201E] p-2 bg-white rounded-[4px] border border-[#DEDDD7]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B9684E] mr-2 shrink-0" />
                        {out}
                      </div>
                    ))}
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
