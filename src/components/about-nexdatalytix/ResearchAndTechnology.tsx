import React from 'react';

const STACK_GROUPS = [
  {
    title: 'Artificial Intelligence',
    items: 'Machine learning · Natural Language Processing · Computer vision',
    details: 'Custom deep learning architectures, predictive pipelines, and automated text mining.',
  },
  {
    title: 'Data Engineering',
    items: 'Big data · Cloud systems · Databases · Automated ETL',
    details: 'High-throughput stream processing, multi-cloud hosting, and real-time data ingestion.',
  },
  {
    title: 'Software Engineering',
    items: 'Web applications · Mobile · Enterprise SaaS · High-throughput APIs',
    details: 'Full-stack software development built for fault tolerance and long-term maintainability.',
  },
  {
    title: 'Mathematical Research',
    items: 'Optimisation · Stochastic modelling · Biostatistics · Financial mathematics',
    details: 'Quantitative regression models, empirical statistical analysis, and algorithmic optimization.',
  },
];

export function ResearchAndTechnology() {
  return (
    <section id="research" className="border-b border-[#DEDDD7] bg-[#FBFAF7] py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Header */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-mono text-[#77756E] uppercase tracking-wider">
              02 / Research &amp; technology
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#20201E] tracking-tight">
              Where research meets technology
            </h3>
            <p className="text-sm text-[#4F4E49] leading-relaxed">
              We work at the convergence of empirical data research, quantitative mathematics, artificial intelligence, and software engineering.
            </p>
          </div>

          {/* Right Clean Capability Stack */}
          <div className="lg:col-span-8 space-y-8 divide-y divide-[#E9E7E1]">
            {STACK_GROUPS.map((group, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-6 space-y-2' : 'space-y-2'}>
                <h4 className="font-mono text-base font-semibold text-[#20201E]">
                  {group.title}
                </h4>
                <p className="text-sm font-sans font-medium text-[#B9684E]">
                  {group.items}
                </p>
                <p className="text-xs text-[#77756E] font-sans">
                  {group.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
