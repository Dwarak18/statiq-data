import React from 'react';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Rigour',
    description: 'Statistical validity precedes computation. Every dataset and model output is validated against formal mathematical boundaries.',
  },
  {
    number: '02',
    title: 'Innovation',
    description: 'We apply artificial intelligence and natural language processing to solve actual operational bottlenecks rather than decorative features.',
  },
  {
    number: '03',
    title: 'Global Scope',
    description: 'Operating from Chennai with an international perspective, ingesting sovereign, macroeconomic, financial, and multi-regional data streams.',
  },
  {
    number: '04',
    title: 'Integrity',
    description: 'Strict adherence to data security standards, GDPR-aligned privacy frameworks, and clear lineage tracking.',
  },
  {
    number: '05',
    title: 'Scale',
    description: 'Modular architectures designed to scale from targeted research studies to enterprise-wide infrastructure.',
  },
];

export function PrinciplesList() {
  return (
    <section id="principles" className="border-b border-[#DEDDD7] bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Header */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-mono text-[#77756E] uppercase tracking-wider">
              03 / Operational principles
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#20201E] tracking-tight">
              Governing standards
            </h3>
            <p className="text-sm text-[#4F4E49] leading-relaxed">
              Core tenets that guide every study, algorithm, and software release at NexDatalytix.
            </p>
          </div>

          {/* Right Clean List */}
          <div className="lg:col-span-8 divide-y divide-[#E9E7E1]">
            {PRINCIPLES.map((p) => (
              <div key={p.number} className="py-6 flex flex-col sm:flex-row sm:items-start gap-4">
                <span className="font-mono text-sm font-semibold text-[#B9684E] w-12 shrink-0">
                  {p.number}
                </span>
                <div className="space-y-1">
                  <h4 className="font-sans text-base font-semibold text-[#20201E]">
                    {p.title}
                  </h4>
                  <p className="text-sm text-[#4F4E49] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
