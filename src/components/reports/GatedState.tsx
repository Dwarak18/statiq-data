import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, Shield, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GatedStateProps {
  onPreviewSample?: () => void;
  isLoadingSample?: boolean;
}

export function GatedState({ onPreviewSample, isLoadingSample }: GatedStateProps) {
  const navigate = useNavigate();

  const benefits = [
    'Complete 4-Page Vector PDF Market Syntheses with STATIQONE Institutional Branding',
    'Google Gemini AI Multimodal Executive Reasoning & Market Sentiment Scoring',
    'Live Cross-Border Equity Screener Snapshots (NASDAQ Tech & NSE Bluechips)',
    'Audited IRDAI Indian Insurance Disclosures (Gross Premium, SAHI Growth, League Table)',
    'Financial Underwriting Ratios (Claims, Commission, Expense & Operating Profit)',
    'Watermarked Institutional Documentation for Board & Investment Committee Briefings',
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto my-8">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Lock Shield Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-primary/40 text-primary shadow-inner mb-6 relative">
        <Lock className="h-8 w-8 text-primary" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
        </span>
      </div>

      {/* Headline */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Institutional Subscription Required
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main font-heading">
          Unlock AI-Analysed PDF Market Intelligence Reports
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          Comprehensive, server-side vector PDF reports combining real-time NASDAQ & NSE data feeds,
          official IRDAI non-life underwriting statistics, and Gemini AI executive summaries.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left my-8 max-w-3xl mx-auto bg-surface/80 p-5 rounded-xl border border-border">
        {benefits.map((b, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-text-main">
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{b}</span>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Button
          onClick={() => navigate('/pricing')}
          className="w-full sm:w-auto h-11 px-8 bg-primary text-black font-bold text-sm hover:bg-hover shadow-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4" /> View Institutional Plans & Pricing <ArrowRight className="h-4 w-4" />
        </Button>

        {onPreviewSample && (
          <Button
            variant="outline"
            onClick={onPreviewSample}
            disabled={isLoadingSample}
            className="w-full sm:w-auto h-11 px-6 text-xs font-semibold border-border hover:border-primary/50 flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4 text-primary" />
            {isLoadingSample ? 'Loading Sample...' : 'Download Sample Watermarked PDF'}
          </Button>
        )}
      </div>

      <p className="text-[11px] text-text-muted mt-5">
        Monthly Plan includes 5 reports/mo. Annual Plan includes Unlimited generation. Instant automated activation.
      </p>
    </div>
  );
}
