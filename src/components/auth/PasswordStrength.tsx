import React from 'react';
import { Check, Dot } from 'lucide-react';

export interface PasswordRule {
  label: string;
  test: (p: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: '10+ characters', test: (p: string) => p.length >= 10 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number (0-9)', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special symbol', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function isPasswordStrongEnough(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const passedCount = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  const pct = (passedCount / PASSWORD_RULES.length) * 100;

  const barColor =
    pct === 0
      ? 'bg-border'
      : pct < 40
      ? 'bg-danger'
      : pct < 100
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  const strengthLabel =
    pct === 0
      ? ''
      : pct < 40
      ? 'Weak'
      : pct < 100
      ? 'Medium'
      : 'Strong (Institutional Grade)';

  return (
    <div className={`mt-2 space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
        <span>Password Strength</span>
        {strengthLabel && (
          <span
            className={
              pct === 100
                ? 'font-bold text-emerald-500'
                : pct >= 40
                ? 'text-amber-500'
                : 'text-danger'
            }
          >
            {strengthLabel}
          </span>
        )}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px] text-text-muted">
        {PASSWORD_RULES.map((rule) => {
          const isPassed = rule.test(password);
          return (
            <li
              key={rule.label}
              className={`flex items-center gap-1.5 transition-colors ${
                isPassed ? 'text-emerald-500 font-medium' : 'text-text-muted/70'
              }`}
            >
              {isPassed ? (
                <Check className="h-3 w-3 shrink-0 text-emerald-500" />
              ) : (
                <Dot className="h-3 w-3 shrink-0" />
              )}
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PasswordStrength;
