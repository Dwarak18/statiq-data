import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

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
    <section className="bg-[#F7F6F2] border-b border-[#DEDDD7] py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Reveal delay={0.1} yOffset={16}>
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#20201E] leading-[1.1]">
                Search filings, market data, and economic series in one{' '}
                <span className="font-serif italic font-normal text-[#B9684E]">
                  editorial workspace
                </span>
                .
              </h1>
            </Reveal>

            <Reveal delay={0.2} yOffset={16}>
              <p className="text-base sm:text-lg text-[#4F4E49] font-normal leading-relaxed max-w-2xl">
                StatIQ One unifies company filings, sovereign macroeconomic indicators, and quantitative datasets with transparent primary source citations.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.3} yOffset={16}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="font-semibold"
                >
                  Talk to our team
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
                <a href="#product" className="text-sm font-medium text-[#20201E] underline decoration-[#B9684E]/50 underline-offset-4 hover:text-[#B9684E]">
                  Explore interactive canvas →
                </a>
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
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="font-semibold px-5 h-9 shrink-0"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Quick Search Suggestions */}
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-[#77756E]">
                  <span className="text-[#9A9890] text-[11px]">Trending queries:</span>
                  {['AAPL Fundamentals', 'FEDFUNDS Rate', 'India GDP vs Peers', 'Cloud CapEx'].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleTagClick(q)}
                      className="px-2 py-0.5 rounded-[4px] bg-white border border-[#DEDDD7] text-[#4F4E49] hover:text-[#B9684E] hover:border-[#B9684E]/50 transition-colors text-[11px] cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </form>
            </Reveal>
          </div>

          {/* Right Column: Live Market Pulse & Direct Citations Panel */}
          <div className="lg:col-span-4 border-l border-[#DEDDD7] pl-6 lg:pl-8 pt-2">
            <Reveal delay={0.3} yOffset={20}>
              <div className="space-y-4">
                <div className="border-b border-[#E9E7E1] pb-3">
                  <span className="text-xs font-semibold text-[#20201E] block">
                    Primary Data Citations
                  </span>
                  <p className="text-xs text-[#77756E] mt-0.5">
                    Live regulatory feeds synced into the research workspace
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {[
                    { ticker: 'FEDFUNDS', val: '4.83%', label: 'Federal Reserve Bank of St. Louis', delta: '-50 bps' },
                    { ticker: 'US10Y', val: '4.21%', label: 'Treasury Constant Maturity Yield', delta: '+12 bps' },
                    { ticker: 'AAPL 10-K', val: '$391.0B', label: 'SEC EDGAR CIK 0000320193', delta: 'FY2024' },
                    { ticker: 'IMF WEO', val: '150+ Markets', label: 'World Economic Outlook Database', delta: 'Updated' },
                  ].map((item) => (
                    <div
                      key={item.ticker}
                      onClick={() => handleTagClick(item.ticker)}
                      className="p-3 rounded-[6px] bg-white border border-[#DEDDD7] hover:border-[#B9684E]/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#20201E] group-hover:text-[#B9684E] transition-colors">
                          {item.ticker}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#B9684E] tabular-nums">
                          {item.val}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#77756E] mt-1">
                        <span className="truncate pr-2">{item.label}</span>
                        <span className="shrink-0 font-mono text-[10px] text-[#657B6C]">{item.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
