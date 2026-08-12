import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Command,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';

const MARKET_INDICATORS = [
  { name: 'S&P 500 Index', val: '5,842.10', chg: '+0.42%', trend: 'up' },
  { name: 'US 10Y Treasury', val: '4.21%', chg: '-0.03', trend: 'down' },
  { name: 'Brent Crude Oil', val: '$74.50/bbl', chg: '+1.10%', trend: 'up' },
  { name: 'Global Inflation Avg', val: '3.1%', chg: '-0.4%', trend: 'down' },
];

const TRENDING_TAGS = [
  'US Fed Rates',
  'NVIDIA Margin',
  'Global AI Spend',
  'EV Supply Chain',
  'India GDP',
];

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#F7F6F2] border-b border-[#DEDDD7] py-16 sm:py-20 lg:py-24">
      {/* Extremely subtle 1px grid — opacity intentionally low so it's felt not seen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(32,32,30,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(32,32,30,0.035) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal yOffset={12}>
              <SectionLabel number="01" text="ENTERPRISE INTELLIGENCE LAYER" />
            </Reveal>

            <Reveal delay={0.1} yOffset={16}>
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#20201E] leading-[1.1]">
                Enterprise Market Intelligence &{' '}
                <span className="text-[#B9684E]">
                  Financial Research Platform
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2} yOffset={16}>
              <p className="text-base sm:text-lg text-[#4F4E49] font-normal leading-relaxed max-w-2xl">
                Access 3.5 million+ audited statistics, SEC EDGAR filings, macroeconomic forecasts, and industry benchmarks across 150+ global markets with real-time primary source lineage.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.3} yOffset={16}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="font-bold"
                >
                  Request a demo
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('product');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/statistics');
                    }
                  }}
                  className="font-semibold text-[#20201E] border-[#DEDDD7] hover:border-[#B9684E]/50"
                >
                  Explore platform
                  <ArrowUpRight className="h-4 w-4 ml-1 text-[#B9684E]" />
                </Button>
              </div>
            </Reveal>

            {/* Search Input Bar */}
            <Reveal delay={0.4} yOffset={16}>
              <form onSubmit={handleSearchSubmit} className="pt-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-[8px] border border-[#DEDDD7] bg-white p-1.5 shadow-[0_1px_2px_rgba(20,20,18,0.04)] focus-within:border-[#B9684E]/60 transition-all gap-2 max-w-xl">
                  <div className="flex items-center flex-1 px-3 py-1">
                    <Search className="h-4 w-4 text-[#B9684E] shrink-0 mr-2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search company, ticker, or macro dataset..."
                      aria-label="Search financial datasets"
                      className="w-full bg-transparent text-[#20201E] outline-none placeholder:text-[#9A9890] text-sm font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-[#77756E] bg-[#F7F6F2] px-2 py-1 rounded border border-[#DEDDD7]">
                      <Command className="h-3 w-3" /> K
                    </span>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="font-bold px-5 h-9 shrink-0"
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </form>

              {/* Trending Queries */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#77756E] pt-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#77756E]">
                  Trending:
                </span>
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="rounded-[4px] border border-[#DEDDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#4F4E49] hover:border-[#B9684E]/40 hover:text-[#20201E] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Macro Snapshot Visual Card */}
          <div className="lg:col-span-5">
            <Reveal delay={0.3} yOffset={20}>
              <div className="rounded-[8px] border border-[#DEDDD7] bg-white p-5 shadow-[0_8px_30px_rgba(20,20,18,0.06)] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E9E7E1] pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#B9684E]" />
                    <span className="font-heading font-bold text-sm text-[#20201E] uppercase tracking-wider">
                      Live Macro Snapshot
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#B9684E] bg-[#EAD8D0] border border-[#B9684E]/20 px-2 py-0.5 rounded-[4px]">
                    REAL-TIME
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {MARKET_INDICATORS.map((ind) => (
                    <div
                      key={ind.name}
                      className="p-3 rounded-[6px] border border-[#E9E7E1] bg-[#FBFAF7] hover:border-[#B9684E]/30 transition-all"
                    >
                      <div className="text-[11px] text-[#77756E] font-medium truncate">
                        {ind.name}
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-[#20201E] mt-0.5">
                        {ind.val}
                      </div>
                      <div
                        className={`text-xs font-semibold mt-0.5 flex items-center ${
                          ind.trend === 'up' ? 'text-[#657B6C]' : 'text-[#9A5B55]'
                        }`}
                      >
                        {ind.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {ind.chg}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E9E7E1] pt-3 flex items-center justify-between text-xs">
                  <span className="text-[#77756E] font-mono">Database Status</span>
                  <span className="font-mono text-[#20201E] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#657B6C] animate-pulse" />
                    3,542,109 Series Active
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
