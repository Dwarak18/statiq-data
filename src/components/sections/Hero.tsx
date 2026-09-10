import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Command } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
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
            <Reveal yOffset={12}>
              <SectionLabel text="FINANCIAL RESEARCH" />
            </Reveal>

            <Reveal delay={0.1} yOffset={16}>
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#20201E] leading-[1.1]">
                Search company filings, market data, and economic series in one workspace.
              </h1>
            </Reveal>

            <Reveal delay={0.2} yOffset={16}>
              <p className="text-base sm:text-lg text-[#4F4E49] font-normal leading-relaxed max-w-2xl">
                StatIQ One brings searchable financial and economic data together with source context, charts, and exportable results.
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
                <a href="#product" className="text-sm font-medium text-[#20201E] underline decoration-[#B9684E]/50 underline-offset-4 hover:text-[#B9684E]">
                  See the workspace
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
                    <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#77756E] bg-[#F7F6F2] px-2 py-1 rounded-sm border border-[#DEDDD7]">
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

            </Reveal>
          </div>

          <div className="lg:col-span-4 border-l border-[#DEDDD7] pl-6 lg:pl-8 pt-2">
            <Reveal delay={0.3} yOffset={20}>
              <div className="space-y-4">
                <p className="text-xs font-mono uppercase tracking-wider text-[#77756E]">Start with a question</p>
                <p className="text-base leading-relaxed text-[#4F4E49]">
                  Search a company, ticker, filing, or macro series. Results open in the existing research workspace.
                </p>
                <p className="text-xs text-[#77756E]">The search below is connected to the platform search route.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
