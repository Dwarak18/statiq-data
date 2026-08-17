import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { TierInfo } from './PricingTierCard';
import { Currency } from './CurrencyToggle';
import { GatewaySelector, PaymentGateway } from './GatewaySelector';
import { RazorpayCheckout } from './RazorpayCheckout';
import { CCAvenueCheckout } from './CCAvenueCheckout';
import { PayPalCheckout } from './PayPalCheckout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  X,
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: TierInfo | null;
  currency: Currency;
  onPaymentSuccess?: (tier: string, invoiceNumber: string) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  tier,
  currency,
  onPaymentSuccess,
}: CheckoutModalProps) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(
    currency === 'USD' ? 'paypal' : 'razorpay'
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ tier: string; invoiceNumber: string } | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync gateway default when currency changes
  React.useEffect(() => {
    if (currency === 'USD') {
      setSelectedGateway('paypal');
    } else if (selectedGateway === 'paypal') {
      setSelectedGateway('razorpay');
    }
  }, [currency]);

  if (!isOpen || !tier) return null;

  const price = currency === 'INR' ? tier.inrPrice : tier.usdPrice;
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const handleSuccess = async (result: { tier: string; invoiceNumber: string }) => {
    setIsSuccess(true);
    setSuccessData(result);
    showToast(`Successfully upgraded to ${tier.name}!`, 'success');
    await refreshUser().catch(() => {});
    if (onPaymentSuccess) {
      onPaymentSuccess(result.tier, result.invoiceNumber);
    }
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    showToast(error, 'error');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-surface/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                {tier.id === 'annual' ? (
                  <Crown className="h-5 w-5 text-primary" />
                ) : (
                  <Zap className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-text-main">
                  {isSuccess ? 'Payment Confirmed' : `Upgrade to ${tier.name}`}
                </h3>
                <p className="text-xs text-text-muted">
                  {isSuccess
                    ? 'Your subscription is now active'
                    : 'Institutional Market Research & Screener Access'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close Checkout"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {isSuccess ? (
              /* Success State */
              <div className="text-center py-6 space-y-4">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-text-main">
                    Welcome to {tier.name}!
                  </h4>
                  <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                    Your account has been upgraded with unrestricted access to live screener data,
                    global intelligence feeds, and AI PDF reports.
                  </p>
                </div>

                {successData?.invoiceNumber && (
                  <div className="inline-block px-3 py-1 rounded-md bg-surface border border-border font-mono text-xs text-text-muted">
                    Invoice: <span className="text-primary font-bold">{successData.invoiceNumber}</span>
                  </div>
                )}

                <div className="pt-4 flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      onClose();
                      navigate('/screener');
                    }}
                    className="bg-primary text-black font-bold text-xs hover:bg-hover px-6"
                  >
                    Open Live Screener
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClose();
                      navigate('/dashboard');
                    }}
                    className="text-xs border-border"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : !isAuthenticated ? (
              /* Authentication Required State */
              <div className="text-center py-6 space-y-4">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-text-main">
                    Please log in to upgrade
                  </h4>
                  <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                    You need an active STATIQONE account to associate your subscription and manage
                    PDF reports.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      onClose();
                      navigate('/login');
                    }}
                    className="bg-primary text-black font-bold text-xs hover:bg-hover"
                  >
                    Log In to Existing Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClose();
                      navigate('/signup');
                    }}
                    className="text-xs border-border"
                  >
                    Create New Account
                  </Button>
                </div>
              </div>
            ) : (
              /* Checkout Form State */
              <>
                {/* Order Summary Box */}
                <div className="rounded-xl border border-border bg-surface/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-text-main">{tier.name}</div>
                      <div className="text-[11px] text-text-muted">{tier.pdfQuotaText}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-primary">
                        {currencySymbol}
                        {price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-text-muted font-mono">
                        {tier.id === 'annual' ? 'Billed Annually' : 'Billed Monthly'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-2 flex items-center justify-between text-xs font-semibold text-text-main">
                    <span>Total Due Today</span>
                    <span className="font-mono text-base text-text-main">
                      {currencySymbol}
                      {price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 flex items-center gap-2 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Gateway Selector */}
                <GatewaySelector
                  currency={currency}
                  selectedGateway={selectedGateway}
                  onSelectGateway={setSelectedGateway}
                />

                {/* Gateway Checkout Actions */}
                <div className="pt-2">
                  {selectedGateway === 'razorpay' && (
                    <RazorpayCheckout
                      tier={tier.id as 'monthly' | 'annual'}
                      user={user}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  )}

                  {selectedGateway === 'ccavenue' && (
                    <CCAvenueCheckout
                      tier={tier.id as 'monthly' | 'annual'}
                      user={user}
                      onError={handleError}
                    />
                  )}

                  {selectedGateway === 'paypal' && (
                    <PayPalCheckout
                      tier={tier.id as 'monthly' | 'annual'}
                      user={user}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  )}
                </div>

                {/* Security Trust Badges */}
                <div className="border-t border-border pt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-text-muted">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span>256-Bit SSL</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    <span>PCI-DSS Tier 1</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Instant Activation</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
