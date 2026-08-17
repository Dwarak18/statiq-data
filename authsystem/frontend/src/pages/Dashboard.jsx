import { useAuth } from '../context/AuthContext';
import TopNav from '../components/TopNav';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="font-mono text-[11px] tracking-widest text-accent">ACCOUNT</div>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="font-mono text-[11px] tracking-widest text-ink/40">EMAIL</div>
            <div className="mt-1 text-sm text-ink">{user?.email}</div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="font-mono text-[11px] tracking-widest text-ink/40">SIGN-IN METHOD</div>
            <div className="mt-1 text-sm capitalize text-ink">{user?.provider}</div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="font-mono text-[11px] tracking-widest text-ink/40">ROLE</div>
            <div className="mt-1 text-sm capitalize text-ink">{user?.role}</div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="font-mono text-[11px] tracking-widest text-ink/40">MEMBER SINCE</div>
            <div className="mt-1 text-sm text-ink">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
