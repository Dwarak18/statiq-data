import React from 'react';
import { Sparkles } from 'lucide-react';

export type Currency = 'INR' | 'USD';

interface CurrencyToggleProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  className?: string;
}

export function CurrencyToggle({ currency, onCurrencyChange, className = '' }: CurrencyToggleProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="inline-flex items-center rounded-xl border border-border bg-card p-1.5 shadow-xl">
        <button
          type="button"
          onClick={() => onCurrencyChange('INR')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currency === 'INR'
              ? 'bg-primary text-black font-bold shadow-md'
              : 'text-text-muted hover:text-text-main'
          }`}
          aria-pressed={currency === 'INR'}
        >
          <span>INR (₹)</span>
          <span className="text-[10px] font-mono opacity-80">India</span>
        </button>

        <button
          type="button"
          onClick={() => onCurrencyChange('USD')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currency === 'USD'
              ? 'bg-primary text-black font-bold shadow-md'
              : 'text-text-muted hover:text-text-main'
          }`}
          aria-pressed={currency === 'USD'}
        >
          <span>USD ($)</span>
          <span className="text-[10px] font-mono opacity-80">Global</span>
        </button>
      </div>

      <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
        <Sparkles className="h-3 w-3" />
        <span>Annual saves ~33%</span>
      </div>
    </div>
  );
}
