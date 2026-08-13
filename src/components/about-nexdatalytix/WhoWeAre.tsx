import React from 'react';

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="border-b border-[#DEDDD7] bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (4 cols): Section Label & Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xs font-mono text-[#77756E] uppercase tracking-wider">
              01 / Who we are
            </h2>

            <div className="pt-6 border-t border-[#E9E7E1] space-y-4 font-sans text-xs text-[#4F4E49]">
              <div>
                <span className="text-[#77756E] block font-mono">Company</span>
                <span className="font-medium text-[#20201E]">NexDatalytix Private Limited</span>
              </div>
              <div>
                <span className="text-[#77756E] block font-mono">Incorporated</span>
                <span className="font-medium text-[#20201E]">2026</span>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Clean Company Narrative */}
          <div className="lg:col-span-8 space-y-6 text-[#4F4E49] text-base sm:text-lg leading-relaxed max-w-2xl">
            <p className="text-xl sm:text-2xl text-[#20201E] font-heading font-medium leading-snug">
              NexDatalytix was established to bridge the gap between statistical research and software engineering.
            </p>

            <p>
              Incorporated in 2026, NexDatalytix operates as a research and technology firm serving global institutions and enterprises. We combine mathematical modelling with modern cloud infrastructure, artificial intelligence, and domain-specific software systems.
            </p>

            <p>
              Our multidisciplinary team brings together data scientists, software engineers, mathematical researchers, and domain consultants. Whether publishing statistical frameworks, building financial data engines, or delivering enterprise cloud platforms, we focus on mathematical accuracy, architectural reliability, and verifiable outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
