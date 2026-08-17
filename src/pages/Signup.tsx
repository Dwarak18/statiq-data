import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { SignupForm } from '@/components/auth/SignupForm';

export function Signup() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container mx-auto grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Left Column: Value Proposition */}
          <section className="lg:col-span-5">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Institutional Onboarding
            </Badge>
            <h1 className="font-heading text-3xl font-bold text-text-main sm:text-4xl">
              Create Your Research Account
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
              Get immediate access to verified datasets, financial models, insurance metrics, customized stock screeners, and AI market synthesis.
            </p>

            <div className="mt-8 grid gap-3.5">
              {[
                'Free tier includes live screener access and regional news previews',
                'Seamless upgrade to Monthly (₹999 / $12) or Annual (₹7999 / $95)',
                'Automated PDF report downloads with Gemini AI executive analysis',
                'Enterprise SSO integration with Google Workspace & Microsoft 365',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-text-main">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-border bg-surface p-4 text-xs text-text-muted">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-text-main uppercase">
                <Zap className="h-4 w-4 text-primary" />
                Instant Setup & Zero Lock-in
              </div>
              <p className="mt-1">
                Start immediately with our free research tier. No credit card required until you choose to unlock premium AI reports.
              </p>
            </div>
          </section>

          {/* Right Column: Signup Card */}
          <section className="lg:col-span-7">
            <Card className="mx-auto max-w-xl overflow-hidden shadow-sm">
              <div className="border-b border-border bg-surface p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black">
                        <BarChart2 className="h-4 w-4" />
                      </div>
                      <span className="font-heading text-lg font-bold text-text-main">
                        STATIQ<span className="text-primary">ONE</span>
                      </span>
                    </div>
                    <h2 className="font-heading text-xl font-bold text-text-main">Create Institutional Account</h2>
                    <p className="mt-1 text-xs text-text-muted">
                      Takes less than a minute. Choose email registration or your enterprise provider.
                    </p>
                  </div>
                  <ResearchGlyph kind="verified" className="h-12 w-12 shrink-0" />
                </div>
              </div>

              <CardContent className="p-6">
                {/* Switcher Navigation */}
                <div className="mb-6 grid grid-cols-2 rounded-lg border border-border bg-background p-1">
                  <Link
                    to="/login"
                    className="rounded-md py-2 text-center text-xs font-semibold text-text-muted transition-colors hover:text-text-main"
                  >
                    Log In
                  </Link>
                  <div className="rounded-md bg-primary py-2 text-center text-xs font-semibold text-black shadow-sm">
                    Create Account
                  </div>
                </div>

                <SignupForm redirectTo="/dashboard" />

                <p className="mt-6 text-center text-xs text-text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Log in to your terminal
                  </Link>
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default Signup;
