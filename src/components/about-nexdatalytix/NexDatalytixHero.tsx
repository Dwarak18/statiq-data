import React from 'react';

export function NexDatalytixHero() {
  return (
    <section id="about" className="border-b border-[#DEDDD7] bg-[#F7F6F2] py-20 sm:py-28 lg:py-36">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-8">
          {/* Simple section label */}
          <span className="text-xs font-mono uppercase tracking-widest text-[#77756E] block">
            About NexDatalytix
          </span>

          {/* Clean, restrained single sans-serif headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#20201E] font-heading leading-[1.05]">
            Data research, AI analytics, and technology for complex questions.
          </h1>

          {/* Supporting paragraph with controlled line length */}
          <p className="text-lg sm:text-xl text-[#4F4E49] font-sans font-normal leading-relaxed max-w-[680px]">
            NexDatalytix Private Limited is a Chennai-based organisation working across data science, mathematical research, artificial intelligence, and software engineering.
          </p>
        </div>
      </div>
    </section>
  );
}
