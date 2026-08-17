import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { LoginForm } from '@/components/auth/LoginForm';

export function Login() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container mx-auto grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Left Column: Platform Value Props */}
          <section className="lg:col-span-5">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Institutional Terminal
            </Badge>
            <h1 className="font-heading text-3xl font-bold text-text-main sm:text-4xl">
              Access Institutional Intelligence
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
              Sign in to your STATIQONE terminal to access verified financial datasets, live NASDAQ & NSE screeners, reinsurance feeds, and AI-synthesized research dossiers.
            </p>

            <div className="mt-8 grid gap-3.5">
              {[
                'Stateless JWT session security with AES-256-GCM encrypted PII',
                'Live NASDAQ and NSE India real-time screener filters',
                'Global insurance & reinsurance intelligence news feeds',
                'One-click Google and Microsoft Single Sign-On (SSO)',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-text-main">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-border bg-surface p-4 text-xs text-text-muted">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-text-main uppercase">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Enterprise Security Standards
              </div>
              <p className="mt-1">
                Protected by Argon2id key derivation, HMAC blind indexing, rotated refresh tokens, and strict double-submit CSRF validation.
              </p>
            </div>
          </section>

          {/* Right Column: Login Card */}
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
                    <h2 className="font-heading text-xl font-bold text-text-main">Terminal Log In</h2>
                    <p className="mt-1 text-xs text-text-muted">
                      Enter your institutional credentials or sign in with your enterprise provider.
                    </p>
                  </div>
                  <ResearchGlyph kind="verified" className="h-12 w-12 shrink-0" />
                </div>
              </div>

              <CardContent className="p-6">
                {/* Switcher Navigation */}
                <div className="mb-6 grid grid-cols-2 rounded-lg border border-border bg-background p-1">
                  <div className="rounded-md bg-primary py-2 text-center text-xs font-semibold text-black shadow-sm">
                    Log In
                  </div>
                  <Link
                    to="/signup"
                    className="rounded-md py-2 text-center text-xs font-semibold text-text-muted transition-colors hover:text-text-main"
                  >
                    Create Account
                  </Link>
                </div>

                <LoginForm redirectTo="/dashboard" />

                <p className="mt-6 text-center text-xs text-text-muted">
                  New to STATIQONE?{' '}
                  <Link to="/signup" className="font-semibold text-primary hover:underline">
                    Create an institutional account
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

export default Login;
