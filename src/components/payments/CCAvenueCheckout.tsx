import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api, User } from '@/api/client';
import { CreditCard, Loader2, ExternalLink } from 'lucide-react';

interface CCAvenueCheckoutProps {
  tier: 'monthly' | 'annual';
  user: User | null;
  onError: (error: string) => void;
  className?: string;
  buttonText?: string;
}

export function CCAvenueCheckout({
  tier,
  user,
  onError,
  className = '',
  buttonText,
}: CCAvenueCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // 1. Get encrypted payload from backend
      const initiateData = await api.initiateCcavenuePayment({
        tier,
      });

      // 2. Create dynamic HTML form and submit to CCAvenue gateway
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = initiateData.actionUrl;
      form.style.display = 'none';

      const encReqInput = document.createElement('input');
      encReqInput.type = 'hidden';
      encReqInput.name = 'encRequest';
      encReqInput.value = initiateData.encRequest;
      form.appendChild(encReqInput);

      const accessCodeInput = document.createElement('input');
      accessCodeInput.type = 'hidden';
      accessCodeInput.name = 'access_code';
      accessCodeInput.value = initiateData.accessCode;
      form.appendChild(accessCodeInput);

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setIsLoading(false);
      onError(err.message || 'Failed to initialize CCAvenue payment.');
    }
  };

  const defaultText =
    buttonText ||
    (tier === 'annual'
      ? 'Pay via CCAvenue (₹7,999 / year)'
      : 'Pay via CCAvenue (₹999 / month)');

  return (
    <Button
      type="button"
      onClick={handleCheckout}
      disabled={isLoading}
      variant="outline"
      className={`w-full h-11 text-xs font-bold border-border bg-surface text-text-main hover:border-primary/50 hover:bg-card shadow-sm flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Redirecting to CCAvenue Gateway...</span>
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 text-primary" />
          <span>{defaultText}</span>
          <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
        </>
      )}
    </Button>
  );
}
