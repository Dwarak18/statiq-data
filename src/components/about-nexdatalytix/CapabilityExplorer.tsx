import React, { useState } from 'react';

const PRACTICES = [
  {
    title: 'Data Research & Statistical Publishing',
    summary: 'Empirical statistical frameworks, macroeconomic indices, and open-data indexing.',
  },
  {
    title: 'AI & Machine Learning Analytics',
    summary: 'Predictive models, NLP engines, computer vision, and deep learning pipelines.',
  },
  {
    title: 'IT Services, App Development & Cloud Solutions',
    summary: 'High-throughput web, mobile, and cloud software built for fault tolerance.',
  },
  {
    title: 'Market Research & Business Consultancy',
    summary: 'Addressable market sizing, competitive intelligence, and strategic advisory.',
  },
  {
    title: 'Digital Media, Content & Research Publishing',
    summary: 'Scientific publishing infrastructure and interactive data portals.',
  },
  {
    title: 'Financial & Insurance Data Services',
    summary: 'Quantitative risk modeling, SEC EDGAR filing extraction, and actuarial pipelines.',
  },
  {
    title: 'Health Data & Medical Informatics',
    summary: 'Biostatistical modeling, clinical trial data synthesis, and privacy-compliant health data.',
  },
  {
    title: 'Education Technology & Professional Training',
    summary: 'Adaptive learning management platforms and technical data science curriculum.',
  },
];

export function CapabilityExplorer() {
  return (
    <section id="capabilities" className="border-b border-[#DEDDD7] bg-[#FBFAF7] py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Header */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-mono text-[#77756E] uppercase tracking-wider">
              04 / Practice areas
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#20201E] tracking-tight">
              What we build
            </h3>
            <p className="text-sm text-[#4F4E49] leading-relaxed">
              Eight practice areas covering research, software engineering, financial modeling, and health informatics.
            </p>
          </div>

          {/* Right Plain Structured List */}
          <div className="lg:col-span-8 divide-y divide-[#E9E7E1]">
            {PRACTICES.map((item, idx) => (
              <div key={idx} className="py-5 space-y-1">
                <h4 className="font-sans text-base font-semibold text-[#20201E]">
                  {item.title}
                </h4>
                <p className="text-sm text-[#77756E] font-sans">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
