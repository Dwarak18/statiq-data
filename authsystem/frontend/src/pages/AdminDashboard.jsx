import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import TopNav from '../components/TopNav';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingUserId, setPendingUserId] = useState(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.adminListUsers({ limit: 50, offset: 0 });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function toggleRole(targetUser) {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setPendingUserId(targetUser.id);
    try {
      await api.adminSetRole(targetUser.id, nextRole);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to update role.');
    } finally {
      setPendingUserId(null);
    }
  }

  async function revokeSessions(targetUser) {
    setPendingUserId(targetUser.id);
    try {
      await api.adminRevokeSessions(targetUser.id);
    } catch (err) {
      setError(err.message || 'Failed to revoke sessions.');
    } finally {
      setPendingUserId(null);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="font-mono text-[11px] tracking-widest text-accent">ADMIN ONLY</div>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink">User management</h1>
        <p className="mt-1 text-sm text-ink/60">{total} account{total === 1 ? '' : 's'} total</p>

        {error && (
          <div role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-lg border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-black/[0.02] font-mono text-[11px] tracking-widest text-ink/40">
              <tr>
                <th className="px-4 py-3 font-medium">EMAIL</th>
                <th className="px-4 py-3 font-medium">PROVIDER</th>
                <th className="px-4 py-3 font-medium">ROLE</th>
                <th className="px-4 py-3 font-medium">JOINED</th>
                <th className="px-4 py-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink/50">Loading…</td>
                </tr>
              )}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink/50">No users found.</td>
                </tr>
              )}
              {!isLoading &&
                users.map((u) => (
                  <tr key={u.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-ink/60">{u.provider}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                          u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-ink/5 text-ink/60'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={pendingUserId === u.id || (u.id === currentUser.id && u.role === 'admin')}
                          onClick={() => toggleRole(u)}
                          title={u.id === currentUser.id && u.role === 'admin' ? "You can't remove your own admin role" : undefined}
                          className="rounded-md border border-ink/15 px-2.5 py-1 text-xs font-medium transition hover:border-ink/30 disabled:opacity-40"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          disabled={pendingUserId === u.id}
                          onClick={() => revokeSessions(u)}
                          className="rounded-md border border-ink/15 px-2.5 py-1 text-xs font-medium transition hover:border-ink/30 disabled:opacity-40"
                        >
                          Log out everywhere
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
