import React, { useState } from 'react';
import { Database, Binary, Cpu, Layers } from 'lucide-react';

interface Pillar {
  id: 'data' | 'research' | 'ai' | 'technology';
  title: string;
  subtitle: string;
  icon: any;
  items: string[];
  description: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'data',
    title: 'DATA',
    subtitle: 'Collection · Analysis · Publishing',
    icon: Database,
    items: ['Structured & Unstructured Ingestion', 'Statistical Data Pipelines', 'Global Publishing Standards'],
    description: 'Ingesting, cleaning, and transforming multi-domain data into high-integrity statistical repositories.',
  },
  {
    id: 'research',
    title: 'RESEARCH',
    subtitle: 'Mathematics · Methodology · Evidence',
    icon: Binary,
    items: ['Stochastic Modelling', 'Optimization Algorithms', 'Evidence-based Analysis'],
    description: 'Applying fundamental mathematics and quantitative methodologies before writing a line of application code.',
  },
  {
    id: 'ai',
    title: 'AI',
    subtitle: 'Prediction · Language · Intelligent Systems',
    icon: Cpu,
    items: ['Natural Language Processing', 'Computer Vision & ML', 'Predictive Intelligence'],
    description: 'Embedding AI-first models and machine learning pipelines into domain-specific workflows.',
  },
  {
    id: 'technology',
    title: 'TECHNOLOGY',
    subtitle: 'Software · Cloud · APIs · Platforms',
    icon: Layers,
    items: ['Enterprise Cloud Architecture', 'High-throughput APIs', 'Scalable Mobile & Web Apps'],
    description: 'Architecting robust software infrastructure designed for enterprise uptime and reliability.',
  },
];

export function IntelligenceIntersection() {
  const [activePillar, setActivePillar] = useState<Pillar['id']>('research');
  const selected = PILLARS.find((p) => p.id === activePillar) || PILLARS[1];

  return (
    <section id="intersection" className="border-b border-[#DEDDD7] bg-[#FBFAF7] py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#E9E7E1] pb-6">
          <div>
            <span className="text-xs font-mono text-[#77756E] uppercase tracking-wider block mb-2">
              02 / The Intelligence Intersection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#20201E] font-heading tracking-tight">
              Where Four Disciplines Converge
            </h2>
          </div>
          <p className="text-sm text-[#77756E] font-sans max-w-md">
            NexDatalytix operates at the precise intersection of data science, mathematical research, AI analytics, and software engineering.
          </p>
        </div>

        {/* Signature Interactive Diagram Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Diagram Canvas (7 Cols) */}
          <div className="lg:col-span-7 bg-[#F7F6F2] border border-[#DEDDD7] p-6 sm:p-10 rounded-[8px] relative overflow-hidden">
            <div className="relative aspect-square max-w-[400px] mx-auto flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300" fill="none">
                <line x1="150" y1="30" x2="150" y2="270" stroke="#DEDDD7" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="30" y1="150" x2="270" y2="150" stroke="#DEDDD7" strokeWidth="1.5" strokeDasharray="4 4" />

                {activePillar === 'data' && <line x1="150" y1="150" x2="150" y2="40" stroke="#B9684E" strokeWidth="2.5" />}
                {activePillar === 'research' && <line x1="150" y1="150" x2="40" y2="150" stroke="#B9684E" strokeWidth="2.5" />}
                {activePillar === 'ai' && <line x1="150" y1="150" x2="150" y2="260" stroke="#B9684E" strokeWidth="2.5" />}
                {activePillar === 'technology' && <line x1="150" y1="150" x2="260" y2="150" stroke="#B9684E" strokeWidth="2.5" />}

                <circle cx="150" cy="150" r="100" stroke="#E9E7E1" strokeWidth="1" />
                <circle cx="150" cy="150" r="50" stroke="#DEDDD7" strokeWidth="1" strokeDasharray="2 2" />
              </svg>

              {/* Central Core Node */}
              <div className="z-10 bg-[#20201E] text-white p-4 rounded-[6px] shadow-md text-center border border-[#B9684E]">
                <span className="font-mono text-[9px] text-[#B9684E] tracking-widest block uppercase">CORE NODE</span>
                <span className="font-mono text-xs font-bold tracking-wider">NEXDATALYTIX</span>
              </div>

              {/* Node Buttons */}
              <button
                type="button"
                onClick={() => setActivePillar('data')}
                className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-[4px] border font-mono text-xs transition-all cursor-pointer ${
                  activePillar === 'data'
                    ? 'bg-[#B9684E] text-white border-[#B9684E] shadow scale-105'
                    : 'bg-white text-[#20201E] border-[#DEDDD7] hover:border-[#B9684E]'
                }`}
              >
                DATA
              </button>

              <button
                type="button"
                onClick={() => setActivePillar('research')}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 px-4 py-2 rounded-[4px] border font-mono text-xs transition-all cursor-pointer ${
                  activePillar === 'research'
                    ? 'bg-[#B9684E] text-white border-[#B9684E] shadow scale-105'
                    : 'bg-white text-[#20201E] border-[#DEDDD7] hover:border-[#B9684E]'
                }`}
              >
                RESEARCH
              </button>

              <button
                type="button"
                onClick={() => setActivePillar('technology')}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 px-4 py-2 rounded-[4px] border font-mono text-xs transition-all cursor-pointer ${
                  activePillar === 'technology'
                    ? 'bg-[#B9684E] text-white border-[#B9684E] shadow scale-105'
                    : 'bg-white text-[#20201E] border-[#DEDDD7] hover:border-[#B9684E]'
                }`}
              >
                TECHNOLOGY
              </button>

              <button
                type="button"
                onClick={() => setActivePillar('ai')}
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-[4px] border font-mono text-xs transition-all cursor-pointer ${
                  activePillar === 'ai'
                    ? 'bg-[#B9684E] text-white border-[#B9684E] shadow scale-105'
                    : 'bg-white text-[#20201E] border-[#DEDDD7] hover:border-[#B9684E]'
                }`}
              >
                AI
              </button>
            </div>
            <div className="text-center font-mono text-[11px] text-[#77756E] mt-3">
              [Click node to inspect pillar]
            </div>
          </div>

          {/* Right Selected Pillar Detail Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#DEDDD7] p-6 sm:p-8 rounded-[8px] space-y-6">
              <div className="flex items-center gap-3 border-b border-[#E9E7E1] pb-4">
                <div className="p-2.5 rounded-[4px] bg-[#F7F6F2] border border-[#DEDDD7] text-[#B9684E]">
                  <selected.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-mono text-xl font-bold text-[#20201E] tracking-tight">
                    {selected.title}
                  </h3>
                  <p className="font-mono text-xs text-[#77756E]">{selected.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-[#4F4E49] leading-relaxed font-sans">
                {selected.description}
              </p>

              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs text-[#77756E] uppercase tracking-wider block">
                  Key Methodological Focus:
                </span>
                <ul className="space-y-2">
                  {selected.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#20201E] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B9684E]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
