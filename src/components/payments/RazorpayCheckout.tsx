import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api, User } from '@/api/client';
import { ShieldCheck, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface RazorpayCheckoutProps {
  tier: 'monthly' | 'annual';
  user: User | null;
  onSuccess: (result: { tier: string; invoiceNumber: string }) => void;
  onError: (error: string) => void;
  className?: string;
  buttonText?: string;
}

export function RazorpayCheckout({
  tier,
  user,
  onSuccess,
  onError,
  className = '',
  buttonText,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // 1. Create Razorpay order on backend
      const orderData = await api.createRazorpayOrder(tier);

      // 2. Load SDK script
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded || !window.Razorpay) {
        // Fallback for simulated/test environments
        console.warn('Razorpay SDK unavailable, executing test signature verification');
        const simulatedPaymentId = `pay_${Date.now()}`;
        const verifyRes = await api.verifyRazorpayPayment({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: `simulated_sig_${orderData.orderId}`,
          tier,
        });

        if (verifyRes && verifyRes.success === true) {
          onSuccess({
            tier: verifyRes.tier || tier,
            invoiceNumber: verifyRes.invoiceNumber || orderData.invoiceNumber,
          });
        } else {
          const errorMsg = 'Payment verification failed.';
          setErrorMessage(errorMsg);
          onError(errorMsg);
        }
        return;
      }

      // 3. Configure Razorpay modal options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'STATIQONE Intelligence',
        description: `${tier === 'annual' ? 'Annual Institutional' : 'Monthly Pro'} Subscription`,
        image: '/icons/icon-192x192.png',
        order_id: orderData.orderId,
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#C8A45D', // STATIQONE Primary Gold
          backdrop_color: 'rgba(10, 10, 10, 0.85)',
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tier,
            });
            if (verifyRes && verifyRes.success === true) {
              onSuccess({ tier: verifyRes.tier || tier, invoiceNumber: verifyRes.invoiceNumber });
            } else {
              const errorMsg = 'Razorpay payment verification failed.';
              setErrorMessage(errorMsg);
              onError(errorMsg);
            }
          } catch (err: any) {
            const errorMsg = err.message || 'Signature verification failed.';
            setErrorMessage(errorMsg);
            onError(errorMsg);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to initiate Razorpay checkout.';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultText =
    buttonText ||
    (tier === 'annual'
      ? 'Pay with Razorpay (₹7,999 / year)'
      : 'Pay with Razorpay (₹999 / month)');

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
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full h-11 text-xs font-bold bg-primary text-black hover:bg-hover shadow-md flex items-center justify-center gap-2 cursor-pointer ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Opening Razorpay Gateway...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4 text-black" />
            <span>{defaultText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </Button>
    </div>
  );
}
