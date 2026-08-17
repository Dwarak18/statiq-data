import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Zap, Crown, FileText, CheckCircle2 } from 'lucide-react';

interface SubscriptionBadgeProps {
  tier?: 'free' | 'monthly' | 'annual';
  status?: string;
  monthlyPdfCount?: number;
  pdfQuota?: number;
  pdfReportsRemaining?: number | string;
  showQuota?: boolean;
  className?: string;
}

export function SubscriptionBadge({
  tier = 'free',
  status = 'active',
  monthlyPdfCount = 0,
  pdfQuota = 0,
  pdfReportsRemaining,
  showQuota = false,
  className = '',
}: SubscriptionBadgeProps) {
  const getBadgeConfig = () => {
    switch (tier) {
      case 'annual':
        return {
          label: 'Annual Member',
          variant: 'bg-primary/20 text-primary border-primary/40 font-bold',
          icon: <Crown className="h-3.5 w-3.5 mr-1 text-primary" />,
          quotaText: 'Unlimited PDF Reports',
        };
      case 'monthly':
        return {
          label: 'Monthly Subscriber',
          variant: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold',
          icon: <Zap className="h-3.5 w-3.5 mr-1 text-emerald-400" />,
          quotaText: `${pdfReportsRemaining ?? Math.max(0, 5 - monthlyPdfCount)}/5 Reports Remaining`,
        };
      case 'free':
      default:
        return {
          label: 'Free Explorer',
          variant: 'bg-surface text-text-muted border-border font-medium',
          icon: <ShieldCheck className="h-3.5 w-3.5 mr-1 text-text-muted" />,
          quotaText: '0 PDF Reports (Upgrade for access)',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      <Badge className={`font-mono text-xs px-2.5 py-1 flex items-center border ${config.variant}`}>
        {config.icon}
        <span>{config.label}</span>
      </Badge>

      {showQuota && (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-text-muted bg-surface border border-border px-2.5 py-0.5 rounded">
          <FileText className="h-3 w-3 text-primary" />
          <span>{config.quotaText}</span>
        </span>
      )}
    </div>
  );
}
