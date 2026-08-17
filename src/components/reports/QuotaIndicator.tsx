import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Zap, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportQuotaResponse } from '@/api/client';

interface QuotaIndicatorProps {
  quota: ReportQuotaResponse | null;
  isLoading?: boolean;
}

export function QuotaIndicator({ quota, isLoading }: QuotaIndicatorProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 animate-pulse flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-card rounded" />
          <div className="h-3 w-48 bg-card rounded" />
        </div>
        <div className="h-8 w-24 bg-card rounded" />
      </div>
    );
  }

  if (!quota) return null;

  const isUnlimited = quota.isUnlimited || quota.tier === 'annual';
  const isFree = quota.tier === 'free';
  const used = quota.usedThisMonth || 0;
  const max = quota.monthlyQuota || 5;
  const remaining = quota.remaining;
  const percentage = isUnlimited ? 100 : Math.min(100, Math.round((used / max) * 100));

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-r from-surface via-card to-surface p-5 md:p-6 shadow-lg relative overflow-hidden">
      {/* Background Accent Glyph */}
      <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
        <FileText className="w-48 h-48 text-primary" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-text-main font-heading uppercase">
                  Institutional PDF Quota
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isUnlimited
                      ? 'bg-primary/20 text-primary border-primary/40'
                      : isFree
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {quota.tier} Plan
                </span>
              </div>
              <p className="text-xs text-text-muted">
                {isUnlimited
                  ? 'Unlimited AI-analysed institutional report downloads active'
                  : isFree
                  ? 'Free tier includes basic data views. Upgrade to generate PDF reports.'
                  : `${remaining} of ${max} reports remaining this billing cycle`}
              </p>
            </div>
          </div>

          {/* Usage Meter Bar for Monthly Users */}
          {!isUnlimited && !isFree && (
            <div className="pt-2 space-y-1.5 max-w-md">
              <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span>Monthly Usage ({used}/{max})</span>
                <span className={remaining === 0 ? 'text-rose-400 font-bold' : 'text-primary'}>
                  {remaining} remaining
                </span>
              </div>
              <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                <div
                  className={`h-full transition-all duration-500 ${
                    percentage >= 100 ? 'bg-rose-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {isFree ? (
            <Button
              onClick={() => navigate('/pricing')}
              className="bg-primary text-black font-bold text-xs hover:bg-hover shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Unlock PDF Reports <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : !isUnlimited && remaining === 0 ? (
            <Button
              onClick={() => navigate('/pricing')}
              className="bg-primary text-black font-bold text-xs hover:bg-hover flex items-center gap-1.5"
            >
              <ArrowRight className="h-3.5 w-3.5" /> Upgrade to Annual Unlimited
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-text-muted font-mono bg-surface px-3 py-1.5 rounded-lg border border-border">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Full Generation Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
