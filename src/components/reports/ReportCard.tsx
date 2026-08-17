import React from 'react';
import { FileText, Download, Sparkles, ArrowRight, Layers, Shield, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ReportTemplate {
  id: 'full_market' | 'insurance_focus' | 'stock_focus';
  title: string;
  subtitle: string;
  description: string;
  category: string;
  pageCount: number;
  icon: typeof Layers;
  features: string[];
  recommended?: boolean;
}

interface ReportCardProps {
  template: ReportTemplate;
  onDownload: (templateId: 'full_market' | 'insurance_focus' | 'stock_focus') => void;
  onCustomize: (templateId: 'full_market' | 'insurance_focus' | 'stock_focus') => void;
  isDownloading?: boolean;
  canGenerate?: boolean;
}

export function ReportCard({
  template,
  onDownload,
  onCustomize,
  isDownloading = false,
  canGenerate = true,
}: ReportCardProps) {
  const Icon = template.icon;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between p-6 bg-card relative ${
        template.recommended
          ? 'border-primary/50 shadow-xl ring-1 ring-primary/30'
          : 'border-border hover:border-primary/30 shadow-md'
      }`}
    >
      {template.recommended && (
        <div className="absolute -top-3 right-6 bg-primary text-black font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Flagship Report
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface border border-primary/20 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface border border-border text-text-muted font-mono">
            {template.pageCount} Pages • Vector PDF
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-text-main font-heading tracking-tight">
            {template.title}
          </h3>
          <p className="text-xs text-primary font-medium">{template.subtitle}</p>
          <p className="text-xs text-text-muted leading-relaxed">{template.description}</p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          {template.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] text-text-main">
              <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 mt-4 border-t border-border flex items-center gap-3">
        <Button
          onClick={() => onDownload(template.id)}
          disabled={isDownloading}
          className="flex-1 bg-primary text-black font-bold text-xs hover:bg-hover shadow-md flex items-center justify-center gap-1.5 h-9"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Compiling...
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" /> Download PDF
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => onCustomize(template.id)}
          disabled={isDownloading}
          className="h-9 px-3 text-xs font-semibold border-border hover:border-primary/40 text-text-muted hover:text-text-main"
          title="Customize Report Options"
        >
          Options
        </Button>
      </div>
    </div>
  );
}
