import React from 'react';
import { Terminal, ShieldCheck, Layers, Quote } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Primary Source First',
    desc: 'Every statistic must carry a verified regulatory paper trail to SEC EDGAR, central bank releases, or sovereign international bodies.',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'Zero Visual Noise',
    desc: 'Prioritize information density, strong typography, and data clarity over decorative gradients, glassmorphism, or fake animations.',
    icon: Layers,
  },
  {
    number: '03',
    title: 'Developer-Grade Infrastructure',
    desc: 'Deliver predictable, low-latency REST and WebSocket v4 APIs with Apache Parquet and Excel export support.',
    icon: Terminal,
  },
];

export function About() {
  return (
    <section id="about" className="border-b border-[#DEDDD7] bg-[#F7F6F2] py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal yOffset={12}>
          <div className="mb-12 max-w-3xl">
            <SectionLabel number="08" text="ABOUT STATIQDATA" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              Built by Engineers and Financial Data Specialists
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              We built StatIQ One to solve the fragmentation, slow filings lookup, and unverified marketing metrics plaguing modern financial research.
            </p>
          </div>
        </Reveal>

        {/* 12-Column Layout: Mission & Principles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mission Quote Block (5 cols) */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1} yOffset={16}>
              <div className="p-6 sm:p-8 rounded-[8px] bg-white border border-[#DEDDD7] space-y-4 relative overflow-hidden shadow-[0_1px_2px_rgba(20,20,18,0.04)]">
                <Quote className="h-8 w-8 text-[#B9684E]/20" />
                <p className="text-sm sm:text-base text-[#20201E] italic font-normal leading-relaxed">
                  "Modern financial research is plagued by fragmented data sources, unverified marketing metrics, and slow manual filings lookup. Our mission is to build the cleanest, fastest, and most verifiable intelligence surface for institutional analysis."
                </p>
                <div className="pt-4 border-t border-[#E9E7E1] flex items-center justify-between font-mono text-xs text-[#77756E]">
                  <span>STATIQDATA Engineering Desk</span>
                  <span className="text-[#B9684E]">2026 Core Statement</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Guiding Principles — editorial numbered rows (7 cols) */}
          <div className="lg:col-span-7 space-y-0">
            {PRINCIPLES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.number} delay={idx * 0.1} yOffset={16}>
                  <div
                    className={`flex items-start gap-4 py-5 border-b border-[#E9E7E1] hover:bg-white/50 transition-colors px-2 -mx-2 rounded-sm ${
                      idx === 0 ? 'border-t' : ''
                    }`}
                  >
                    <span className="font-mono text-sm font-bold text-[#B9684E] shrink-0 mt-0.5 w-8">
                      {p.number} —
                    </span>
                    <div className="flex-1">
                      <h3 className="font-heading text-base font-bold text-[#20201E] flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#B9684E] shrink-0" />
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4F4E49] mt-1 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Content Integrity Placeholder */}
        <Reveal delay={0.3} yOffset={10}>
          <div className="mt-10 pt-4 border-t border-[#E9E7E1] flex items-center justify-between text-[11px] text-[#9A9890] font-mono">
            <span>
              [CONTENT PLACEHOLDER: Executive Leadership Team Bios &amp; High-Resolution Portraits]
            </span>
            <span>Zero Fabricated Employee Profiles</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
