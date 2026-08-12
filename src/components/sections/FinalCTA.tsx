import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="border-b border-[#DEDDD7] bg-white py-16 sm:py-24 relative overflow-hidden">
      {/* Extremely subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(32,32,30,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <Container className="relative z-10">
        <Reveal yOffset={16}>
          <div className="p-8 sm:p-12 lg:p-16 rounded-[8px] bg-[#FBFAF7] border border-[#DEDDD7] text-center space-y-6 max-w-4xl mx-auto shadow-[0_8px_30px_rgba(20,20,18,0.06)]">
            {/* Accent rule at top */}
            <div className="flex justify-center">
              <SectionLabel number="09" text="INSTITUTIONAL ACCESS" />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#20201E]">
              Accelerate Your Quantitative Research Workflow.
            </h2>

            <p className="text-sm sm:text-base text-[#4F4E49] max-w-2xl mx-auto leading-relaxed">
              Gain unrestricted access to 3.5 million+ audited series, SEC EDGAR parsers, macroeconomic forecasts, and developer-grade API endpoints.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                className="font-bold"
              >
                Request Institutional Access
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/search')}
                className="font-semibold border-[#DEDDD7] text-[#20201E] hover:border-[#B9684E]/50"
              >
                Explore Public Datasets
                <ArrowUpRight className="h-4 w-4 ml-1.5 text-[#B9684E]" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/pricing')}
                className="text-xs text-[#77756E] hover:text-[#20201E]"
              >
                Talk to Data Desk &rarr;
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 border-t border-[#E9E7E1] flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-[#77756E]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#B9684E]" />
                SEC EDGAR Audited Lineage
              </span>
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[#B9684E]" />
                Instant API v4 Key Generation
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B9684E]" />
                24/7 Data Desk Support
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
