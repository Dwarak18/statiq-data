import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { OAuthButtons } from './OAuthButtons';

export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_auth_failed: 'Google sign-in was cancelled or failed. Please try again.',
  microsoft_auth_failed: 'Microsoft sign-in was cancelled or failed. Please try again.',
  email_already_registered:
    'That email is already registered with a different sign-in method. Use your original method to log in.',
  oauth_error: 'OAuth authentication could not be completed. Please try again.',
};

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oauthError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = 'Work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid work email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectTo);
      }
    } catch (err: any) {
      if (err.status === 423) {
        setServerError('Account temporarily locked due to excessive failed attempts. Please try again in 15 minutes.');
      } else if (err.status === 401) {
        setServerError('Invalid email or password. Please verify your credentials.');
      } else if (err.status === 403) {
        setServerError('This account is currently disabled. Please contact support.');
      } else {
        setServerError(err.message || 'Unable to connect to authentication server. Please check your network.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {oauthError && OAUTH_ERROR_MESSAGES[oauthError] && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Authentication Notice</p>
            <p className="mt-0.5 opacity-90">{OAUTH_ERROR_MESSAGES[oauthError]}</p>
          </div>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="font-medium">{serverError}</p>
        </div>
      )}

      <OAuthButtons />

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-border" />
        <span className="absolute bg-surface px-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Or continue with password
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="analyst@institutional.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.email ? 'border-danger' : 'border-border'
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
          </div>
          {errors.email && (
            <p id="login-email-error" className="mt-1 text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted"
            >
              Password
            </label>
            <Link
              to="/login"
              onClick={() => alert('Please contact institutional security administrators to reset password.')}
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg border bg-background py-2.5 pl-10 pr-10 text-sm text-text-main outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.password ? 'border-danger' : 'border-border'
              }`}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-3 text-text-muted hover:text-text-main transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" className="mt-1 text-xs text-danger">
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary py-3 font-semibold text-black shadow-sm hover:bg-hover disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Authenticating session…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Log In to Terminal
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
