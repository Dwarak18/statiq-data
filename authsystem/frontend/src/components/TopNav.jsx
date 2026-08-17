import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-medium">Vault</span>
          <nav className="flex gap-4 font-mono text-xs tracking-wide text-ink/50">
            <Link to="/dashboard" className="hover:text-ink">DASHBOARD</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-ink">ADMIN</Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink/60">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium transition hover:border-ink/30"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
