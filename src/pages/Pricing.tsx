import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { InstitutionalTrustBar } from '@/components/ui/InstitutionalTrustBar';
import { 
  InstitutionalEmblemIcon, QuantumSeriesIcon, SecAuditShieldIcon, 
  HedgeFundAnalyticsIcon, GlobalMacroSphereIcon, GoldTierCrownIcon 
} from '@/components/ui/CustomIcons';
import { 
  Check, HelpCircle, ChevronDown, ChevronUp, Zap, Building2, 
  ShieldCheck, ArrowRight, Download, Sliders, Database, Sparkles, Terminal 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  seats: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  ctaVariant: 'outline' | 'default' | 'primary';
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'explorer',
    name: 'Research Explorer',
    description: 'Essential access for independent analysts, academics, and individual market researchers.',
    monthlyPrice: 0,
    annualPrice: 0,
    seats: '1 Individual User',
    icon: <QuantumSeriesIcon className="h-6 w-6 text-primary" />,
    features: [
      'Access to 500,000+ public macro datasets',
      'High-level country & industry summary metrics',
      'Standard web search & interactive charts',
      'Community methodology documentation',
      'Standard web exports (CSV preview)',
      'Community support'
    ],
    ctaText: 'Start Free Access',
    ctaVariant: 'outline'
  },
  {
    id: 'professional',
    name: 'Professional Analyst',
    badge: 'MOST POPULAR',
    isPopular: true,
    description: 'Complete data suite for buy-side analysts, equity researchers, and corporate strategy teams.',
    monthlyPrice: 249,
    annualPrice: 199,
    seats: 'Up to 5 Team Seats',
    icon: <HedgeFundAnalyticsIcon className="h-6 w-6 text-primary" />,
    features: [
      'Unrestricted access to all 3.5M+ series',
      'Full SEC EDGAR, IMF, Fed, Eurostat audit trails',
      'Raycast-style Spotlight & AI natural language search',
      'Unlimited Excel, CSV, JSON, and PDF report exports',
      'Custom workspace dashboards & watchlist alerts',
      'Priority 24/7 technical support & data requests'
    ],
    ctaText: 'Upgrade to Professional',
    ctaVariant: 'primary'
  },
  {
    id: 'institutional',
    name: 'Institutional Enterprise',
    badge: 'UNLIMITED ACCESS',
    description: 'Dedicated infrastructure, custom API limits, and tailored data pipelines for funds & banks.',
    monthlyPrice: 899,
    annualPrice: 749,
    seats: 'Unlimited Enterprise Seats',
    icon: <GoldTierCrownIcon className="h-6 w-6 text-primary" />,
    features: [
      'Direct REST & WebSocket API access (100k req/min)',
      'Custom data pipeline integration (Parquet, Snowflake)',
      'Single Sign-On (SAML/Okta) & Audit Access Logs',
      'Dedicated Quant Researcher & Account Director',
      'Custom proprietary dataset ingestion',
      '99.99% Guaranteed SLA with SLA financial backing'
    ],
    ctaText: 'Contact Institutional Team',
    ctaVariant: 'outline'
  }
];

const COMPARISON_MATRIX = [
  { feature: 'Historical Series Coverage', explorer: '10 Years', professional: '35+ Years', institutional: 'Complete History' },
  { feature: 'Primary Source Audit Trails (SEC, Fed, IMF)', explorer: 'Basic', professional: 'Full Audit Trail', institutional: 'Full Audit Trail + Lineage' },
  { feature: 'Export Formats', explorer: 'CSV (Web)', professional: 'Excel, PDF, CSV, JSON', institutional: 'Excel, PDF, CSV, JSON, Parquet' },
  { feature: 'API Access', explorer: 'None', professional: '10,000 requests/mo', institutional: 'Unlimited (100k req/min)' },
  { feature: 'AI Research Assistant', explorer: 'Standard Queries', professional: 'Advanced AI Synthesis', institutional: 'Fine-tuned Enterprise Model' },
  { feature: 'SSO & Enterprise Governance', explorer: 'No', professional: 'Optional', institutional: 'SAML 2.0, Okta, Audit Logs' },
  { feature: 'Dedicated Quant Support', explorer: 'Self-Serve', professional: 'Priority Desk', institutional: 'Dedicated Lead Specialist' }
];

const FAQS = [
  {
    q: 'Can we switch between billing cycles or upgrade anytime?',
    a: 'Yes. You can switch between monthly and annual billing or upgrade your subscription tier at any time with immediate pro-rated credit.'
  },
  {
    q: 'What verified primary sources are included in the dataset feeds?',
    a: 'STATIQONE directly ingests feeds from SEC EDGAR filings, Federal Reserve Economic Data (FRED), IMF, World Bank, Eurostat, OECD, ECB, and major global stock exchanges.'
  },
  {
    q: 'How does the enterprise API rate limit work?',
    a: 'Professional Analyst accounts receive 10,000 monthly API credits. Institutional Enterprise plans feature high-throughput endpoints supporting up to 100,000 requests per minute.'
  },
  {
    q: 'Do you offer team billing and procurement invoice processing?',
    a: 'Yes. Institutional Enterprise plans support customized procurement invoices, net-30 payment terms, wire transfers, and corporate credit cards.'
  }
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [teamSeats, setTeamSeats] = useState(5);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSelectPlan = (plan: PricingTier) => {
    if (plan.id === 'explorer') {
      navigate('/search');
      showToast('You are currently on the free Research Explorer plan.', 'info');
    } else {
      navigate('/signup');
      showToast(`Initiating checkout for ${plan.name} (${isAnnual ? 'Annual' : 'Monthly'} Billing)...`, 'success');
    }
  };

  return (
    <Layout>
      {/* Header Section */}
      <section className="relative overflow-hidden bg-background border-b border-border px-4 py-16 sm:py-20 lg:px-8 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2A2A2A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-card text-xs font-mono text-primary font-semibold mb-6">
            <InstitutionalEmblemIcon className="h-4 w-4" />
            TRANSPARENT INSTITUTIONAL PRICING
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-main leading-tight mb-6">
            Institutional Data Plans for <span className="text-primary underline decoration-primary/40 underline-offset-8">Every Enterprise</span>.
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Select the research plan tailored for your firm. Upgrade, downgrade, or adjust seats with complete flexibility.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center rounded-xl border border-border bg-card p-1.5 shadow-xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !isAnnual ? 'bg-surface text-text-main border border-border shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isAnnual ? 'bg-primary text-black font-bold shadow-md' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/20 text-black">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      <InstitutionalTrustBar />

      {/* Pricing Cards Grid */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {PRICING_TIERS.map((tier) => {
              const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
              return (
                <motion.div
                  key={tier.id}
                  whileHover={{ y: -6 }}
                  className="flex"
                >
                  <Card className={`relative w-full flex flex-col justify-between transition-all bg-card border ${
                    tier.isPopular ? 'border-primary/60 shadow-2xl shadow-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/30'
                  }`}>
                    {tier.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-primary text-black font-mono font-bold text-[10px] uppercase tracking-wider shadow-md">
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-surface border border-border">
                          {tier.icon}
                        </div>
                        <span className="text-[11px] font-mono text-text-muted bg-surface px-2.5 py-1 rounded border border-border">
                          {tier.seats}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-text-main">{tier.name}</h3>
                      <p className="mt-2 text-xs text-text-muted leading-relaxed min-h-[36px]">{tier.description}</p>

                      <div className="mt-6 border-t border-border pt-6">
                        <div className="flex items-baseline gap-1">
                          <span className="font-mono text-4xl font-extrabold text-text-main">
                            ${price}
                          </span>
                          {price > 0 && <span className="text-xs text-text-muted font-mono">/ user / month</span>}
                        </div>
                        <div className="text-[11px] text-text-muted font-mono mt-1">
                          {price === 0 ? 'Free forever' : isAnnual ? 'Billed annually ($' + (price * 12) + '/yr)' : 'Billed monthly'}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-3 mb-8">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">Included Capabilities</div>
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-text-muted">
                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-text-main font-medium leading-tight">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleSelectPlan(tier)}
                        className={`w-full h-11 text-xs font-bold ${
                          tier.isPopular 
                            ? 'bg-primary text-black hover:bg-hover shadow-lg' 
                            : 'border-border bg-surface text-text-main hover:border-primary/50'
                        }`}
                      >
                        {tier.ctaText} <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs font-mono font-bold text-primary uppercase tracking-wider mb-2">DETAILED CAPABILITIES</div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-main">Institutional Feature Comparison</h2>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-background/50 font-mono text-text-muted">
                    <th className="p-4 font-semibold">Feature / Capability</th>
                    <th className="p-4 font-semibold">Explorer</th>
                    <th className="p-4 font-semibold text-primary">Professional</th>
                    <th className="p-4 font-semibold">Institutional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {COMPARISON_MATRIX.map((row, i) => (
                    <tr key={i} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4 font-semibold text-text-main">{row.feature}</td>
                      <td className="p-4 text-text-muted">{row.explorer}</td>
                      <td className="p-4 font-bold text-primary">{row.professional}</td>
                      <td className="p-4 text-text-main">{row.institutional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise ROI & Team Calculator */}
      <section className="bg-background border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/30 bg-card p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase tracking-wider mb-2">
                  <Sliders className="h-4 w-4" /> Enterprise Seat Estimator
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-main mb-3">
                  Calculate Annual Team Investment
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-6">
                  Adjust seat capacity for your equity research desk or investment committee.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-text-muted">Number of Analyst Seats:</span>
                    <span className="font-bold text-primary text-base">{teamSeats} Seats</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={teamSeats}
                    onChange={(e) => setTeamSeats(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-surface accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="w-full md:w-64 p-5 rounded-xl border border-border bg-surface text-center flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-text-muted uppercase">Estimated Annual Cost</div>
                  <div className="font-mono text-3xl font-extrabold text-primary mt-2">
                    ${(teamSeats * (isAnnual ? 199 : 249) * 12).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-text-muted font-mono mt-1">Includes 24/7 dedicated desk support</div>
                </div>
                <Button 
                  onClick={() => { navigate('/signup'); showToast(`Requesting quote for ${teamSeats} seats...`, 'info'); }}
                  className="mt-6 w-full text-xs font-bold bg-primary text-black hover:bg-hover"
                >
                  Request Enterprise Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-main">Frequently Asked Questions</h2>
            <p className="mt-2 text-xs text-text-muted">Clear answers for financial institutional subscription managers.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-semibold text-text-main hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />}
                </button>
                {expandedFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-text-muted leading-relaxed border-t border-border/50 bg-surface/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
