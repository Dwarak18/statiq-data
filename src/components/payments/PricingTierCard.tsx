import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, ArrowRight, Sparkles, Shield, Zap, Crown, Lock } from 'lucide-react';
import { Currency } from './CurrencyToggle';

export interface TierInfo {
  id: 'free' | 'monthly' | 'annual';
  name: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  inrPrice: number;
  usdPrice: number;
  billingPeriod: string;
  pdfQuotaText: string;
  features: string[];
  ctaText: string;
  ctaVariant: 'outline' | 'default' | 'primary';
}

export const TIERS_DATA: TierInfo[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    description: 'Essential market research for individual analysts, investors, and academics.',
    inrPrice: 0,
    usdPrice: 0,
    billingPeriod: 'Free forever',
    pdfQuotaText: '0 PDF Reports',
    features: [
      'Basic live stock screener (top 20 tickers)',
      '3 news headlines per region (USA, Europe, Asia)',
      'Historical macro charts & company summaries',
      'Standard web search & interactive views',
      'Community methodology documentation',
      'No AI-analysed PDF report generation',
    ],
    ctaText: 'Start Free Access',
    ctaVariant: 'outline',
  },
  {
    id: 'monthly',
    name: 'Monthly Pro',
    badge: 'MOST POPULAR',
    isPopular: true,
    description: 'Full institutional intelligence suite for active researchers, traders, and analysts.',
    inrPrice: 999,
    usdPrice: 12,
    billingPeriod: 'per month',
    pdfQuotaText: '5 AI PDF Reports / month',
    features: [
      'Full unrestricted live screener (NASDAQ + NSE India)',
      '60-second real-time auto-refreshing stock feeds',
      'All Global Insurance & Reinsurance news feeds (15m sync)',
      '5 AI-Analysed Downloadable PDF Reports per month',
      'Sector breakdowns & IRDAI insurance premium analytics',
      'Priority technical support & CSV export',
    ],
    ctaText: 'Upgrade to Monthly',
    ctaVariant: 'primary',
  },
  {
    id: 'annual',
    name: 'Annual Institutional',
    badge: 'BEST VALUE (SAVE ~33%)',
    isPopular: false,
    description: 'Unlimited capacity, enterprise-grade throughput, and dedicated intelligence for institutions.',
    inrPrice: 7999,
    usdPrice: 95,
    billingPeriod: 'per year',
    pdfQuotaText: 'Unlimited AI PDF Reports',
    features: [
      'Unlimited live NASDAQ & NSE India stock screener',
      'Unlimited AI-Analysed PDF Report downloads with Gemini AI',
      'Full Global Insurance Intelligence feeds (USA, Europe, Asia)',
      'Deep IRDAI insurance metric snapshots & executive summaries',
      'Custom watchlist dashboard & real-time mover alerts',
      '24/7 dedicated institutional desk support & SLA',
    ],
    ctaText: 'Upgrade to Annual',
    ctaVariant: 'primary',
  },
];

interface PricingTierCardProps {
  tier: TierInfo;
  currency: Currency;
  currentTier?: 'free' | 'monthly' | 'annual';
  onSelectTier: (tier: TierInfo) => void;
  isLoading?: boolean;
}

export function PricingTierCard({
  tier,
  currency,
  currentTier = 'free',
  onSelectTier,
  isLoading = false,
}: PricingTierCardProps) {
  const isCurrentPlan = currentTier === tier.id;
  const price = currency === 'INR' ? tier.inrPrice : tier.usdPrice;
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const getTierIcon = () => {
    switch (tier.id) {
      case 'annual':
        return <Crown className="h-6 w-6 text-primary" />;
      case 'monthly':
        return <Zap className="h-6 w-6 text-primary" />;
      default:
        return <Shield className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <motion.div whileHover={{ y: -6 }} className="flex h-full">
      <Card
        className={`relative w-full flex flex-col justify-between transition-all bg-card border ${
          tier.isPopular
            ? 'border-primary/70 shadow-2xl shadow-primary/10 ring-1 ring-primary/40'
            : isCurrentPlan
            ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30'
            : 'border-border hover:border-primary/40'
        }`}
      >
        {/* Popular / Best Value Badge */}
        {tier.badge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="px-3.5 py-1 rounded-full bg-primary text-black font-mono font-bold text-[10px] uppercase tracking-wider shadow-md whitespace-nowrap">
              {tier.badge}
            </span>
          </div>
        )}

        {isCurrentPlan && (
          <div className="absolute -top-3.5 right-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-black font-mono font-bold text-[10px] uppercase tracking-wider shadow-md">
              Current Plan
            </span>
          </div>
        )}

        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-surface border border-border">
              {getTierIcon()}
            </div>
            <span className="text-[11px] font-mono text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 font-semibold">
              {tier.pdfQuotaText}
            </span>
          </div>

          <h3 className="font-heading text-xl font-bold text-text-main">{tier.name}</h3>
          <p className="mt-2 text-xs text-text-muted leading-relaxed min-h-[36px]">
            {tier.description}
          </p>

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-extrabold text-text-main">
                {currencySymbol}
                {price.toLocaleString()}
              </span>
              {price > 0 && (
                <span className="text-xs text-text-muted font-mono">
                  {tier.billingPeriod === 'per month' ? '/ month' : '/ year'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-text-muted font-mono mt-1">
              {price === 0
                ? 'No credit card required'
                : tier.id === 'annual'
                ? `Billed annually (${currencySymbol}${price.toLocaleString()} / yr)`
                : `Billed monthly (${currencySymbol}${price.toLocaleString()} / mo)`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
          <div className="space-y-3 mb-8">
            <div className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
              Included Features
            </div>
            {tier.features.map((feat, idx) => {
              const isLocked = feat.toLowerCase().includes('no ai-analysed');
              return (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-text-muted">
                  {isLocked ? (
                    <Lock className="h-4 w-4 text-text-muted/60 shrink-0 mt-0.5" />
                  ) : (
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`leading-tight ${
                      isLocked ? 'text-text-muted/70 italic' : 'text-text-main font-medium'
                    }`}
                  >
                    {feat}
                  </span>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            disabled={isLoading || isCurrentPlan}
            onClick={() => onSelectTier(tier)}
            className={`w-full h-11 text-xs font-bold transition-all ${
              isCurrentPlan
                ? 'bg-surface text-text-muted border border-border cursor-default'
                : tier.isPopular || tier.id === 'annual'
                ? 'bg-primary text-black hover:bg-hover shadow-lg cursor-pointer'
                : 'border-border bg-surface text-text-main hover:border-primary/50 cursor-pointer'
            }`}
          >
            {isCurrentPlan ? (
              'Active Subscription'
            ) : (
              <>
                {tier.ctaText} <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
