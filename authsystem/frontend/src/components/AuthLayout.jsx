export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-stretch bg-paper">
      {/* Signature left panel: a "ledger" of what protects the account, since that's
          this product's actual differentiator, not generic marketing copy. */}
      <aside className="relative hidden w-[38%] flex-col justify-between overflow-hidden bg-ink px-10 py-12 text-paper lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #F7F7F5 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }} />
        <div className="relative">
          <div className="font-mono text-xs tracking-widest text-accent">VAULT · SECURE ACCESS</div>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1]">
            Your account,<br />held under lock.
          </h1>
        </div>
        <dl className="relative space-y-5 font-mono text-[13px] text-paper/70">
          <div className="flex items-baseline justify-between border-t border-paper/15 pt-3">
            <dt>Passwords</dt>
            <dd className="text-paper">Argon2id hashed</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-paper/15 pt-3">
            <dt>Email at rest</dt>
            <dd className="text-paper">AES-256-GCM encrypted</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-paper/15 pt-3">
            <dt>Sessions</dt>
            <dd className="text-paper">httpOnly, rotated tokens</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-paper/15 pt-3 pb-1">
            <dt>Transport</dt>
            <dd className="text-paper">CSRF-checked, rate-limited</dd>
          </div>
        </dl>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="font-mono text-[11px] tracking-widest text-accent">{eyebrow}</div>
            <h2 className="mt-2 font-display text-3xl font-medium text-ink">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-ink/60">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
