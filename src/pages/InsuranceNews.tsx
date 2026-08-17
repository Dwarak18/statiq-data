import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlobalInsuranceNewsFeed } from '@/components/news/GlobalInsuranceNewsFeed';
import { Globe, Radio, ShieldCheck, Newspaper, Sparkles, TrendingUp, Layers } from 'lucide-react';

export function InsuranceNews() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      <Navbar />

      <main className="flex-1">
        {/* Hero Header Section */}
        <section className="relative border-b border-border bg-gradient-to-b from-surface via-background to-background py-10 sm:py-14">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-semibold mb-4">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>REAL-TIME MULTI-FEED INTELLIGENCE</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-text-main tracking-tight leading-tight mb-4">
                Global Insurance Intelligence
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-8 max-w-3xl">
                Aggregating real-time regulatory filings, catastrophe reinsurance renewals, commercial underwriting updates, and solvency directives from <strong>Insurance Journal</strong>, <strong>Reinsurance News</strong>, <strong>The Insurer</strong>, and <strong>Business Insurance</strong>.
              </p>

              {/* Metrics Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-border/60 pt-6">
                <div className="p-3 rounded-lg bg-card/60 border border-border">
                  <div className="flex items-center gap-2 text-primary text-xs font-mono font-semibold mb-1">
                    <Radio className="h-3.5 w-3.5" />
                    <span>Active Feeds</span>
                  </div>
                  <div className="text-lg font-bold font-heading text-text-main">4 Publications</div>
                  <div className="text-[10px] text-text-muted font-mono">IJ, RN, TI, BI</div>
                </div>

                <div className="p-3 rounded-lg bg-card/60 border border-border">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold mb-1">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Regional Scope</span>
                  </div>
                  <div className="text-lg font-bold font-heading text-text-main">USA, EU, Asia</div>
                  <div className="text-[10px] text-text-muted font-mono">+ Global ILS/Treaty</div>
                </div>

                <div className="p-3 rounded-lg bg-card/60 border border-border">
                  <div className="flex items-center gap-2 text-primary text-xs font-mono font-semibold mb-1">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Sync Interval</span>
                  </div>
                  <div className="text-lg font-bold font-heading text-text-main">15 Minutes</div>
                  <div className="text-[10px] text-text-muted font-mono">Automated DB Cron</div>
                </div>

                <div className="p-3 rounded-lg bg-card/60 border border-border">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold mb-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verification</span>
                  </div>
                  <div className="text-lg font-bold font-heading text-text-main">Audited</div>
                  <div className="text-[10px] text-text-muted font-mono">SHA-256 Deduplicated</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Feed Section */}
        <section className="py-8 sm:py-10">
          <div className="container mx-auto px-4 md:px-6">
            <GlobalInsuranceNewsFeed />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default InsuranceNews;
