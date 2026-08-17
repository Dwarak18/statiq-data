import React from 'react';
import { Currency } from './CurrencyToggle';
import { ShieldCheck, CreditCard, Check, Zap } from 'lucide-react';

export type PaymentGateway = 'razorpay' | 'ccavenue' | 'paypal';

interface GatewaySelectorProps {
  currency: Currency;
  selectedGateway: PaymentGateway;
  onSelectGateway: (gateway: PaymentGateway) => void;
  className?: string;
}

export function GatewaySelector({
  currency,
  selectedGateway,
  onSelectGateway,
  className = '',
}: GatewaySelectorProps) {
  if (currency === 'USD') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold">
          Selected Payment Gateway
        </div>
        <div
          onClick={() => onSelectGateway('paypal')}
          className="p-3.5 rounded-xl border border-primary/50 bg-card flex items-center justify-between cursor-pointer transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0070BA]/10 text-[#0070BA] font-bold text-base italic">
              P
            </div>
            <div>
              <div className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <span>PayPal International</span>
                <span className="text-[10px] font-mono bg-primary/20 text-primary px-1.5 py-0.2 rounded font-semibold">
                  USD
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Pay with PayPal balance, Visa, Mastercard, or Amex
              </p>
            </div>
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black">
            <Check className="h-3 w-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold">
        Choose Payment Gateway (INR)
      </div>

      <div className="grid gap-3">
        {/* Razorpay Option */}
        <div
          onClick={() => onSelectGateway('razorpay')}
          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
            selectedGateway === 'razorpay'
              ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/30'
              : 'border-border bg-card hover:border-primary/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm font-mono">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-main">Razorpay (Recommended)</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                  FASTEST
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                UPI (GPay, PhonePe, Paytm), Cards, NetBanking, & Wallets
              </p>
            </div>
          </div>

          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full ${
              selectedGateway === 'razorpay' ? 'bg-primary text-black' : 'border border-border'
            }`}
          >
            {selectedGateway === 'razorpay' && <Check className="h-3 w-3" />}
          </div>
        </div>

        {/* CCAvenue Option */}
        <div
          onClick={() => onSelectGateway('ccavenue')}
          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
            selectedGateway === 'ccavenue'
              ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/30'
              : 'border-border bg-card hover:border-primary/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface border border-border text-text-muted">
              <CreditCard className="h-4 w-4 text-text-muted" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-main">CCAvenue</span>
                <span className="text-[10px] font-mono bg-surface text-text-muted px-1.5 py-0.2 rounded border border-border">
                  Alternative
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                50+ Indian NetBanking Banks, Corporate Cards, & Wallets
              </p>
            </div>
          </div>

          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full ${
              selectedGateway === 'ccavenue' ? 'bg-primary text-black' : 'border border-border'
            }`}
          >
            {selectedGateway === 'ccavenue' && <Check className="h-3 w-3" />}
          </div>
        </div>
      </div>
    </div>
  );
}
