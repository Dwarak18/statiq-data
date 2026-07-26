import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, CheckCircle2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { useToast } from '@/context/ToastContext';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export function AuthPage({ mode }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isSignup = mode === 'signup';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && !name.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter your work email', 'warning');
      return;
    }
    if (!password.trim()) {
      showToast('Please enter your password', 'warning');
      return;
    }

    showToast(isSignup ? 'Account created successfully. Welcome to STATIQONE.' : 'Logged in successfully.', 'success');
    navigate('/workspace');
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container mx-auto grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
          <section className="lg:col-span-5">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {isSignup ? 'Start Research Workspace' : 'Premium Research Access'}
            </Badge>
            <h1 className="font-heading text-3xl font-bold text-text-main sm:text-4xl">
              {isSignup ? 'Create your STATIQONE account' : 'Log in to STATIQONE'}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
              Access verified datasets, premium previews, saved research, export-ready reports, and enterprise market intelligence from a dedicated account page.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                'Verified source trails with citations and confidence scores',
                'Workspace limits, saved reports, and premium dataset previews',
                'PDF, Excel, CSV, JSON, BI connector, and API unlock paths'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-text-main">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-7">
            <Card className="mx-auto max-w-xl overflow-hidden shadow-sm">
              <div className="border-b border-border bg-surface p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                        <BarChart2 className="h-4 w-4" />
                      </div>
                      <span className="font-heading text-lg font-bold text-primary">STATIQONE</span>
                    </div>
                    <h2 className="font-heading text-xl font-bold text-text-main">
                      {isSignup ? 'Create account' : 'Welcome back'}
                    </h2>
                    <p className="mt-1 text-xs text-text-muted">
                      {isSignup ? 'Preview first. Upgrade when your workflow needs full access.' : 'Continue to your saved research workspace.'}
                    </p>
                  </div>
                  <ResearchGlyph kind="verified" className="h-14 w-14 shrink-0" />
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-6 grid grid-cols-2 rounded-lg border border-border bg-background p-1">
                  <Link
                    to="/login"
                    className={`rounded-md py-2 text-center text-sm font-semibold transition-colors ${
                      !isSignup ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className={`rounded-md py-2 text-center text-sm font-semibold transition-colors ${
                      isSignup ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignup && (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                        <input
                          type="text"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                      <input
                        type="email"
                        placeholder="jane@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary py-3 font-semibold text-white shadow-sm hover:bg-primary/90">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {isSignup ? 'Create Free Account' : 'Sign In'}
                  </Button>
                </form>

                <p className="mt-5 text-center text-xs text-text-muted">
                  {isSignup ? 'Already have an account?' : 'New to STATIQONE?'}{' '}
                  <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-primary hover:underline">
                    {isSignup ? 'Log in' : 'Create an account'}
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
