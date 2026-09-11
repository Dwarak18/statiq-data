import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
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
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#20201E]">
              Financial data that traces{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                back to the source
              </span>
              .
            </h2>

            <p className="text-sm sm:text-base text-[#4F4E49] max-w-2xl mx-auto leading-relaxed">
              Gain access to verified series, SEC EDGAR parsers, macroeconomic forecasts, and API endpoints.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                className="font-bold"
              >
                Talk to our team
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/search')}
                className="font-semibold border-[#DEDDD7] text-[#20201E] hover:border-[#B9684E]/50"
              >
                Explore public datasets
                <ArrowUpRight className="h-4 w-4 ml-1.5 text-[#B9684E]" />
              </Button>

              <a href="/pricing" className="text-xs text-[#77756E] hover:text-[#20201E] hover:underline underline-offset-4">View pricing →</a>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 border-t border-[#E9E7E1] flex flex-wrap items-center justify-center gap-6 text-xs text-[#77756E]">
              <span className="flex items-center gap-1.5">
                Source: SEC EDGAR
              </span>
              <span className="flex items-center gap-1.5">
                REST API v4
              </span>
              <span className="flex items-center gap-1.5">
                Data desk by appointment
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
