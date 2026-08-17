const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

let csrfToken = null;

/** Fetches a CSRF token (and the matching cookie) once per page load, before any mutating request. */
async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  const res = await fetch(`${API_BASE}/csrf-token`, { credentials: 'include' });
  if (!res.ok) throw new Error('Could not initialize session security token.');
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

let refreshInFlight = null;

async function tryRefresh() {
  // Coalesce concurrent refresh attempts (e.g. several requests 401 at once) into one call.
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-CSRF-Token': await ensureCsrfToken() },
    }).finally(() => {
      refreshInFlight = null;
    });
  }
  const res = await refreshInFlight;
  return res.ok;
}

/**
 * Core request helper. Automatically:
 *  - sends cookies (credentials: 'include')
 *  - attaches the CSRF header for mutating methods
 *  - on a single 401 (expired access token), tries a silent refresh and retries once
 */
async function request(path, { method = 'GET', body, skipRefreshRetry = false } = {}) {
  const isMutating = method !== 'GET' && method !== 'HEAD';
  const headers = { 'Content-Type': 'application/json' };
  if (isMutating) {
    headers['X-CSRF-Token'] = await ensureCsrfToken();
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipRefreshRetry && path !== '/auth/refresh' && path !== '/auth/login') {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request(path, { method, body, skipRefreshRetry: true });
    }
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const error = new Error((data && data.message) || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.code = data && data.error;
    throw error;
  }

  return data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  adminListUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users${qs ? `?${qs}` : ''}`);
  },
  adminSetRole: (userId, role) => request(`/admin/users/${userId}/role`, { method: 'PATCH', body: { role } }),
  adminRevokeSessions: (userId) => request(`/admin/users/${userId}/revoke-sessions`, { method: 'POST' }),
  googleLoginUrl: () => `${API_BASE}/auth/google`,
  microsoftLoginUrl: () => `${API_BASE}/auth/microsoft`,
};
