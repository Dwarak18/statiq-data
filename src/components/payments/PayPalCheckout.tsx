import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api, User } from '@/api/client';
import { Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface PayPalCheckoutProps {
  tier: 'monthly' | 'annual';
  user: User | null;
  onSuccess: (result: { tier: string; invoiceNumber: string }) => void;
  onError: (error: string) => void;
  className?: string;
  buttonText?: string;
}

export function PayPalCheckout({
  tier,
  user,
  onSuccess,
  onError,
  className = '',
  buttonText,
}: PayPalCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayPalCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // 1. Create PayPal v2 order on backend
      const orderData = await api.createPaypalOrder(tier);
      if (!orderData || !orderData.orderId) {
        throw new Error('Failed to create PayPal order: invalid server response.');
      }

      // 2. In browser environment with PayPal SDK / REST flow, execute capture
      const captureData = await api.capturePaypalOrder({
        orderId: orderData.orderId,
        tier,
      });

      // Prevent false-positive success state: only trigger on confirmed res.data.success === true
      if (captureData && captureData.success === true) {
        onSuccess({
          tier: captureData.tier || tier,
          invoiceNumber: captureData.invoiceNumber || orderData.invoiceNumber,
        });
      } else {
        const errorMsg = 'PayPal payment verification failed. Subscription was not activated.';
        setErrorMessage(errorMsg);
        onError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'PayPal payment processing failed.';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultText =
    buttonText ||
    (tier === 'annual'
      ? 'Pay with PayPal ($95.00 / year)'
      : 'Pay with PayPal ($12.00 / month)');

  return (
    <div className="w-full space-y-2">
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 flex items-center gap-2 text-xs text-rose-400 font-medium"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      <Button
        type="button"
        onClick={handlePayPalCheckout}
        disabled={isLoading}
        className={`w-full h-11 text-xs font-bold bg-[#0070BA] text-white hover:bg-[#005ea6] shadow-md flex items-center justify-center gap-2 cursor-pointer ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Processing PayPal Checkout...</span>
          </>
        ) : (
          <>
            {/* PayPal P Logo */}
            <span className="font-extrabold font-heading text-sm italic tracking-tighter">
              <i>P</i>ay<i>P</i>al
            </span>
            <span className="ml-1 font-semibold">{defaultText}</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </>
        )}
      </Button>
    </div>
  );
}
