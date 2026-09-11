import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';

export function Methodology() {
  return (
    <section id="methodology" className="border-b border-[#DEDDD7] bg-white py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal yOffset={12}>
          <div className="mb-12 max-w-3xl">
            <SectionLabel text="How we verify data" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              Data integrity framework &amp;{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                quality assurance
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              Why institutional research teams rely on StatIQ One: transparent ingestion, automated statistical screening, and primary regulatory lineage.
            </p>
          </div>
        </Reveal>

        {/* Technical Memorandum */}
        <Reveal delay={0.1} yOffset={16}>
          <div className="rounded-[8px] bg-[#FBFAF7] border border-[#DEDDD7] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_1px_2px_rgba(20,20,18,0.04)]" data-editorial-row="methodology">
            {/* Accent top rule */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#B9684E]" />

            {/* Verification Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DEDDD7] pb-6 mb-8 text-xs">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-[#20201E] block">
                  Verification specification
                </span>
                <span className="text-[#77756E] block text-xs">
                  Automated checks run on every dataset before publishing
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white border border-[#DEDDD7] text-[#20201E] rounded-[4px] text-xs font-mono">
                  Lineage: Primary
                </span>
                <span className="px-3 py-1 bg-[#EAD8D0] border border-[#B9684E]/20 text-[#B9684E] font-medium rounded-[4px] text-xs font-mono">
                  UTC ISO-8601
                </span>
              </div>
            </div>

            {/* 3 Pipeline Verification Ledger Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DEDDD7] bg-white rounded-[6px] border border-[#DEDDD7] mb-10 overflow-hidden">
              {[
                {
                  num: '01',
                  label: 'Ingestion authentication',
                  title: 'Direct Regulatory TLS Streams',
                  body: 'Data is retrieved directly via authenticated TLS channels from primary sovereign issuers (SEC EDGAR, Federal Reserve FRED, IMF WEO, World Bank). Zero scraper proxies.',
                },
                {
                  num: '02',
                  label: 'Outlier & anomaly filter',
                  title: 'Automated Statistical Screening',
                  body: 'Every incoming metric is automatically tested against 35-year historical variance baselines. Discrepancies exceeding 3.5 standard deviations trigger manual data desk review.',
                },
                {
                  num: '03',
                  label: 'Cross-filing verification',
                  title: 'Footnote & Balance Sheet Alignment',
                  body: 'Enterprise financial numbers cross-reference 10-K annual notes with 10-Q quarterly balance sheets to ensure restatements and stock splits are point-in-time adjusted.',
                },
              ].map((item) => (
                <div key={item.num} className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#B9684E] font-medium">
                    <span className="font-mono font-semibold">{item.num}</span>
                    <span>·</span>
                    <span>{item.label}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#20201E]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4E49] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Quality Score & Technical Disclosures */}
            <div className="border-t border-[#DEDDD7] pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[#77756E]">
              <div className="flex items-center gap-2">
                <span>Data lineage traced directly to primary regulatory sources.</span>
              </div>

              <div className="text-[11px] text-[#9A9890]">
              Compliance details are published when independently verified.
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
