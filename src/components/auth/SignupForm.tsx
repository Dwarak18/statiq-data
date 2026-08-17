import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { OAuthButtons } from './OAuthButtons';
import { PasswordStrength, isPasswordStrongEnough } from './PasswordStrength';

interface SignupFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function SignupForm({ onSuccess, redirectTo = '/dashboard' }: SignupFormProps) {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: typeof errors = {};
    const trimmedEmail = email.trim();

    if (displayName.length > 100) {
      nextErrors.displayName = 'Name must be under 100 characters.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid work email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (!isPasswordStrongEnough(password)) {
      nextErrors.password = 'Password does not satisfy institutional security requirements.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
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
      await signup(email.trim(), password, displayName.trim() || undefined);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectTo);
      }
    } catch (err: any) {
      if (err.status === 409) {
        setServerError('An account with this email address already exists. Please log in or use a different email.');
      } else {
        setServerError(err.message || 'Failed to create account. Please check your network connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
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
          Or register with email
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Full Name <span className="text-text-muted/60 normal-case">(optional)</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Dr. Eleanor Vance"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.displayName ? 'border-danger' : 'border-border'
              }`}
            />
          </div>
          {errors.displayName && (
            <p className="mt-1 text-xs text-danger">{errors.displayName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Institutional Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="eleanor@hedgefund.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.email ? 'border-danger' : 'border-border'
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />
          </div>
          {errors.email && (
            <p id="signup-email-error" className="mt-1 text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg border bg-background py-2.5 pl-10 pr-10 text-sm text-text-main outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.password ? 'border-danger' : 'border-border'
              }`}
              aria-invalid={!!errors.password}
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
          <PasswordStrength password={password} />
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-confirm-password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              id="signup-confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.confirmPassword ? 'border-danger' : 'border-border'
              }`}
              aria-invalid={!!errors.confirmPassword}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-danger">{errors.confirmPassword}</p>
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
              Creating institutional account…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Create Research Account
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}

export default SignupForm;
