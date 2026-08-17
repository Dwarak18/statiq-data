const RULES = [
  { label: '10+ characters', test: (p) => p.length >= 10 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Number', test: (p) => /[0-9]/.test(p) },
  { label: 'Symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordStrength({ password }) {
  const passed = RULES.filter((r) => r.test(password)).length;
  const pct = (passed / RULES.length) * 100;
  const barColor = pct < 40 ? 'bg-danger' : pct < 100 ? 'bg-amber-500' : 'bg-emerald-600';

  return (
    <div className="mt-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
        <div className={`h-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-ink/50">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.label} className={ok ? 'text-emerald-700' : ''}>
              {ok ? '✓' : '·'} {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
