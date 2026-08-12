import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
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
            <SectionLabel number="05" text="METHODOLOGY & INTEGRITY" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              Data Integrity Framework &amp; Quality Assurance
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              Why institutional research teams trust StatIQ One data: transparent ingestion, automated statistical screening, and audited regulatory lineage.
            </p>
          </div>
        </Reveal>

        {/* Technical Memorandum */}
        <Reveal delay={0.1} yOffset={16}>
          <div className="rounded-[8px] bg-[#FBFAF7] border border-[#DEDDD7] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_1px_2px_rgba(20,20,18,0.04)]">
            {/* Accent top rule */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#B9684E]" />

            {/* Memorandum Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DEDDD7] pb-6 mb-8 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[#B9684E] font-bold tracking-wider uppercase block">
                  MEMORANDUM: QUANTITATIVE DATA INTEGRITY SPECIFICATION
                </span>
                <span className="text-[#77756E] block text-[11px]">
                  REVISION DATE: JULY 2026 // PIPELINE VERSION 4.2.0
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white border border-[#DEDDD7] text-[#20201E] font-bold rounded-[4px]">
                  Grade AAA // 99.8% Accuracy
                </span>
                <span className="px-3 py-1 bg-[#EAD8D0] border border-[#B9684E]/20 text-[#B9684E] font-bold rounded-[4px]">
                  UTC ISO-8601
                </span>
              </div>
            </div>

            {/* 3 Pipeline Verification Stages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {[
                {
                  num: '01',
                  label: 'Ingestion Authentication',
                  title: 'Direct Regulatory TLS Streams',
                  body: 'Data is retrieved directly via authenticated TLS channels from primary sovereign issuers (SEC EDGAR, Federal Reserve FRED, IMF WEO, World Bank). Zero scraper proxies.',
                },
                {
                  num: '02',
                  label: 'Outlier & Anomaly Filter',
                  title: 'Automated Statistical Screening',
                  body: 'Every incoming metric is automatically tested against 35-year historical variance baselines. Discrepancies exceeding 3.5 standard deviations trigger manual data desk review.',
                },
                {
                  num: '03',
                  label: 'Cross-Filing Verification',
                  title: 'Footnote & Balance Sheet Alignment',
                  body: 'Enterprise financial numbers cross-reference 10-K annual notes with 10-Q quarterly balance sheets to ensure restatements and stock splits are point-in-time adjusted.',
                },
              ].map((item) => (
                <div key={item.num} className="space-y-3 p-5 rounded-[6px] bg-white border border-[#DEDDD7]">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#B9684E] font-bold uppercase">
                    <CheckCircle2 className="h-4 w-4" />
                    {item.num} / {item.label}
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#20201E]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4F4E49] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Quality Score & Technical Disclosures */}
            <div className="border-t border-[#DEDDD7] pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs text-[#77756E]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#B9684E]" />
                <span>Lineage Verification Standard: ISO-27001 Data Governance Protocol</span>
              </div>

              <div className="text-[11px] text-[#9A9890]">
                [CONTENT PLACEHOLDER: Specific Security Compliance Audit ID &amp; SOC2 Type II Certification Number]
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
