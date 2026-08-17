import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  X,
  TrendingUp,
  Shield,
  Layers,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GenerateReportOptions, ReportQuotaResponse } from '@/api/client';

interface ReportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: GenerateReportOptions) => Promise<void>;
  quota: ReportQuotaResponse | null;
  initialReportType?: 'full_market' | 'insurance_focus' | 'stock_focus';
}

export function ReportConfigModal({
  isOpen,
  onClose,
  onGenerate,
  quota,
  initialReportType = 'full_market',
}: ReportConfigModalProps) {
  const [reportType, setReportType] = useState<'full_market' | 'insurance_focus' | 'stock_focus'>(initialReportType);
  const [includeAiSynthesis, setIncludeAiSynthesis] = useState(true);
  const [includeNasdaqMovers, setIncludeNasdaqMovers] = useState(true);
  const [includeNseMovers, setIncludeNseMovers] = useState(true);
  const [includeIrdaiTables, setIncludeIrdaiTables] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);

    try {
      await onGenerate({
        reportType,
        customTitle: customTitle.trim() || undefined,
        focus: reportType,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Report generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reportOptions = [
    {
      id: 'full_market',
      title: 'Full Institutional Synthesis',
      description: 'Comprehensive 4-page report spanning NASDAQ tech equities, NSE India Nifty 50, IRDAI insurance disclosures, and Gemini AI macro reasoning.',
      icon: Layers,
      badge: 'Recommended',
    },
    {
      id: 'insurance_focus',
      title: 'Indian Non-Life & Health Focus',
      description: 'Deep dive into IRDAI Q1 FY2026-27 gross direct premium accretion, SAHI growth, top 10 insurer league table, and underwriting ratios.',
      icon: Shield,
      badge: 'Regulatory',
    },
    {
      id: 'stock_focus',
      title: 'Cross-Border Equity Screener',
      description: 'Cross-market valuation multiples, top gainers, losers, median sector P/E benchmarks, and NASDAQ/NSE volume rankings.',
      icon: TrendingUp,
      badge: 'Equities',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-main font-heading">
                Configure Institutional PDF Report
              </h2>
              <p className="text-xs text-text-muted">
                STATIQONE Server-Side Vector Generation Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-card transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Report Template Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Select Intelligence Focus
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {reportOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = reportType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setReportType(opt.id as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40'
                        : 'border-border bg-surface hover:border-text-muted/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? 'bg-primary text-black' : 'bg-card text-text-muted'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface border border-border text-text-muted">
                          {opt.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-text-main font-heading">
                        {opt.title}
                      </h4>
                      <p className="text-[11px] text-text-muted line-clamp-3 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-primary font-bold">
                        <Check className="h-3.5 w-3.5" /> Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Report Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Custom Report Subtitle (Optional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Q1 Cross-Asset Portfolio Review & Valuation Brief"
              className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs text-text-main focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Report Sections Customizer */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Included Modules & AI Synthesis
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface cursor-pointer hover:border-primary/40">
                <input
                  type="checkbox"
                  checked={includeAiSynthesis}
                  onChange={(e) => setIncludeAiSynthesis(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-0"
                />
                <span className="flex items-center gap-1 font-semibold text-text-main">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Gemini AI Synthesis
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface cursor-pointer hover:border-primary/40">
                <input
                  type="checkbox"
                  checked={includeIrdaiTables}
                  onChange={(e) => setIncludeIrdaiTables(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-0"
                />
                <span className="font-semibold text-text-main">
                  IRDAI League & Ratios
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface cursor-pointer hover:border-primary/40">
                <input
                  type="checkbox"
                  checked={includeNasdaqMovers}
                  onChange={(e) => setIncludeNasdaqMovers(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-0"
                />
                <span className="font-semibold text-text-main">
                  NASDAQ 100 Tickers
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface cursor-pointer hover:border-primary/40">
                <input
                  type="checkbox"
                  checked={includeNseMovers}
                  onChange={(e) => setIncludeNseMovers(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-0"
                />
                <span className="font-semibold text-text-main">
                  NSE India NIFTY 50
                </span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-[11px] text-text-muted font-mono">
              Format: <span className="text-text-main font-bold">Vector PDF 1.4 (A4)</span> | Branding:{' '}
              <span className="text-primary font-bold">STATIQONE Navy/Gold</span>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isGenerating}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isGenerating}
                className="bg-primary text-black font-bold hover:bg-hover shadow-md flex items-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Compiling Vector PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" /> Generate & Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
