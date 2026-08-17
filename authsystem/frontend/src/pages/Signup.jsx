import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import OAuthButtons from '../components/OAuthButtons';
import PasswordStrength from '../components/PasswordStrength';

function isPasswordStrongEnough(p) {
  return (
    p.length >= 10 &&
    /[a-z]/.test(p) &&
    /[A-Z]/.test(p) &&
    /[0-9]/.test(p) &&
    /[^A-Za-z0-9]/.test(p)
  );
}

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (displayName.length > 100) next.displayName = 'Keep it under 100 characters.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!isPasswordStrongEnough(password)) next.password = 'Password does not meet the requirements below.';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup(email.trim(), password, displayName.trim() || undefined);
      navigate('/dashboard');
    } catch (err) {
      if (err.status === 409) setServerError('Could not create an account with those details.');
      else setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="GET STARTED"
      title="Create your account"
      subtitle="Takes less than a minute"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {serverError && (
        <div role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-ink/80">
            Name <span className="text-ink/40">(optional)</span>
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-md border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent ${
              errors.email ? 'border-danger' : 'border-ink/15'
            }`}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink/80">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent ${
              errors.password ? 'border-danger' : 'border-ink/15'
            }`}
            aria-invalid={!!errors.password}
          />
          <PasswordStrength password={password} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-ink/80">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent ${
              errors.confirmPassword ? 'border-danger' : 'border-ink/15'
            }`}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-ink py-2.5 text-sm font-medium text-paper transition hover:bg-accentDeep disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="font-mono text-[11px] text-ink/40">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <OAuthButtons />
    </AuthLayout>
  );
}
