import React from 'react';
import { BarChart3, Building2, Database, Globe2, Landmark, LineChart, Network, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';

type GlyphKind = 'statistics' | 'industry' | 'company' | 'country' | 'dashboard' | 'workspace' | 'report' | 'verified';

interface ResearchGlyphProps {
  kind: GlyphKind;
  label?: string;
  className?: string;
}

const glyphConfig = {
  statistics: { Icon: BarChart3, accent: 'bg-primary/10 text-primary border-primary/20' },
  industry: { Icon: Network, accent: 'bg-accent/10 text-accent border-accent/20' },
  company: { Icon: Building2, accent: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  country: { Icon: Landmark, accent: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  dashboard: { Icon: LineChart, accent: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
  workspace: { Icon: Database, accent: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  report: { Icon: Globe2, accent: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  verified: { Icon: ShieldCheck, accent: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
} satisfies Record<GlyphKind, { Icon: React.ElementType; accent: string }>;

export function ResearchGlyph({ kind, label, className }: ResearchGlyphProps) {
  const { Icon, accent } = glyphConfig[kind];

  return (
    <div className={cn('relative flex items-center justify-center rounded-xl border overflow-hidden', accent, className)}>
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-2 top-2 h-1.5 w-10 rounded-full bg-current/20" />
        <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full border border-current/20" />
        <div className="absolute bottom-3 left-3 h-10 w-1 rounded bg-current/10" />
        <div className="absolute bottom-3 left-6 h-6 w-1 rounded bg-current/20" />
        <div className="absolute bottom-3 left-9 h-12 w-1 rounded bg-current/10" />
      </div>
      <Icon className="relative h-6 w-6" />
      {label && (
        <span className="absolute right-2 top-2 rounded-md bg-surface/80 px-1.5 py-0.5 text-[10px] font-bold font-mono text-text-main">
          {label}
        </span>
      )}
    </div>
  );
}
