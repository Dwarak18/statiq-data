import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';

const WORKFLOW_EXAMPLES = [
  {
    title: 'Sovereign Rate Curve & Inflation Correlation',
    sector: 'Macroeconomic Policy & Fixed Income',
    challenge:
      'Tracking fragmented interest rate projections across US Fed (FRED), ECB, and Bank of Japan datasets with mismatched time-series intervals.',
    workflow:
      'Engineers configured unified time-series queries across FRED and World Bank datasets with point-in-time currency alignment.',
    outcome:
      'Automated cross-market rate curve alignment delivered via WebSocket API v4 updated hourly with zero manual spreadsheet reconciliation.',
    tickers: ['US 10Y Yield', 'FEDFUNDS', 'ECB Rate', 'BOJ Policy'],
  },
  {
    title: 'Enterprise AI Infrastructure CapEx Allocation',
    sector: 'Technology & Semiconductor Supply Chains',
    challenge:
      'Evaluating multi-billion dollar capital expenditure commitments and revenue conversion rates across top hardware vendors.',
    workflow:
      'Segment revenue tracking and 10-K balance sheet line-item extraction across Apple (AAPL), Microsoft (MSFT), and NVIDIA (NVDA) filings.',
    outcome:
      'Cap-ex to segment revenue ratio benchmarks generated automatically with primary SEC EDGAR accession number citations.',
    tickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'],
  },
];

export function Evidence() {
  return (
    <section className="border-b border-[#DEDDD7] bg-white py-16 sm:py-24" data-editorial-row="evidence-workflows">
      <Container>
        {/* Editorial Workflow Header */}
        <Reveal yOffset={12}>
          <div className="mb-12 max-w-3xl">
            <SectionLabel text="Research workflows" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              How quantitative teams deploy{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                StatIQ One
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              Real institutional workflows demonstrating primary source ingestion, automated series alignment, and decision-grade output delivery.
            </p>
          </div>
        </Reveal>

        {/* 2-Column Split Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WORKFLOW_EXAMPLES.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.1} yOffset={16}>
              <div className="p-6 sm:p-8 rounded-[8px] bg-[#FBFAF7] border border-[#DEDDD7] hover:border-[#B9684E]/40 transition-all flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-[#E9E7E1] pb-3 mb-4">
                    <span className="text-xs font-semibold text-[#B9684E]">
                      {item.sector}
                    </span>
                    <span className="text-[11px] font-mono text-[#77756E]">
                      Case {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#20201E] mb-5">
                    {item.title}
                  </h3>

                  {/* Editorial Stepped Timeline Flow */}
                  <div className="space-y-4 border-l-2 border-[#E9E7E1] pl-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#77756E] block">
                        Challenge
                      </span>
                      <p className="text-xs sm:text-sm text-[#4F4E49] leading-relaxed">{item.challenge}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#B9684E] block">
                        Platform Workflow
                      </span>
                      <p className="text-xs sm:text-sm text-[#4F4E49] leading-relaxed">{item.workflow}</p>
                    </div>

                    <div className="space-y-1 bg-white p-3.5 rounded-[6px] border border-[#E9E7E1]">
                      <span className="text-[11px] font-semibold text-[#657B6C] block">
                        Quantified Outcome
                      </span>
                      <p className="text-xs sm:text-sm text-[#20201E] font-medium leading-relaxed">{item.outcome}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E9E7E1] pt-4 flex items-center justify-between text-[11px] font-mono text-[#77756E]">
                  <span>Active series:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tickers.map((t) => (
                      <span key={t} className="bg-white px-2 py-0.5 rounded-[4px] border border-[#DEDDD7]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </Container>
    </section>
  );
}
