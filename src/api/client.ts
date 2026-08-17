/// <reference types="vite/client" />

/**
 * STATIQONE API Client
 * Enterprise HTTP client with double-submit CSRF token support,
 * httpOnly cookie session authentication, and automatic token refresh retry.
 */

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  emailLast4?: string;
  role: 'user' | 'admin';
  provider: 'local' | 'google' | 'microsoft';
  isEmailVerified: boolean;
  subscriptionTier?: 'free' | 'monthly' | 'annual';
  monthlyPdfCount?: number;
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
}

export interface CsrfResponse {
  csrfToken: string;
}

export interface ApiErrorPayload {
  error: string;
  message?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

let csrfToken: string | null = null;
let csrfInFlight: Promise<string> | null = null;

/**
 * Fetches a CSRF token (and sets the matching non-httpOnly csrf_token cookie)
 * before executing mutating requests.
 */
export async function ensureCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;

  // Check if csrf_token cookie is already available in document.cookie
  const cookieMatch = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  if (cookieMatch && cookieMatch[1]) {
    csrfToken = decodeURIComponent(cookieMatch[1]);
    return csrfToken;
  }

  if (!csrfInFlight) {
    csrfInFlight = (async () => {
      try {
        const res = await fetch(`${API_BASE}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to initialize session security token.');
        }
        const data: CsrfResponse = await res.json();
        csrfToken = data.csrfToken;
        return csrfToken;
      } finally {
        csrfInFlight = null;
      }
    })();
  }

  return csrfInFlight;
}

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Coalesce concurrent token refresh attempts into a single network call.
 */
async function tryRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const token = await ensureCsrfToken().catch(() => '');
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'X-CSRF-Token': token } : {}),
          },
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  body?: unknown;
  headers?: Record<string, string>;
  skipRefreshRetry?: boolean;
}

/**
 * Universal request wrapper for STATIQONE backend.
 */
export async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const isMutating = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (isMutating) {
    try {
      const token = await ensureCsrfToken();
      if (token) {
        headers['X-CSRF-Token'] = token;
      }
    } catch {
      // Proceed if CSRF token fetch failed; server will return appropriate 403
    }
  }

  const endpoint = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(endpoint, {
    method,
    credentials: 'include',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  // Handle 401 session expiry with silent refresh retry
  if (
    res.status === 401 &&
    !options.skipRefreshRetry &&
    !path.includes('/auth/refresh') &&
    !path.includes('/auth/login') &&
    !path.includes('/auth/signup')
  ) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, { ...options, skipRefreshRetry: true });
    }
  }

  // Parse response
  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const errorMsg =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Request failed with status ${res.status}`;
    const errorCode = data && typeof data === 'object' ? data.error : undefined;
    throw new ApiError(errorMsg, res.status, errorCode);
  }

  return data as T;
}

export interface PaymentConfigResponse {
  gateways: {
    razorpay: { keyId: string; currency: string; enabled: boolean };
    ccavenue: { accessCode: string; merchantId: string; currency: string; enabled: boolean };
    paypal: { clientId: string; currency: string; enabled: boolean };
  };
  pricing: {
    INR: { free: number; monthly: number; annual: number };
    USD: { free: number; monthly: number; annual: number };
  };
  quotas: {
    free: { pdfReportsPerMonth: number; screenerLive: boolean; newsFeeds: number };
    monthly: { pdfReportsPerMonth: number; screenerLive: boolean; newsFeeds: string };
    annual: { pdfReportsPerMonth: string; screenerLive: boolean; newsFeeds: string };
  };
}

export interface SubscriptionStatusResponse {
  userId: string;
  role: 'user' | 'admin';
  tier: 'free' | 'monthly' | 'annual';
  status: 'active' | 'past_due' | 'canceled' | 'expired';
  expiresAt: string | null;
  monthlyPdfCount: number;
  pdfQuota: number;
  pdfReportsRemaining: number | string;
  activeSubscription?: any;
  recentInvoices: Array<{
    id: string;
    invoice_number: string;
    amount_cents: number;
    currency: string;
    tier: string;
    status: string;
    gateway: string;
    paid_at: string | null;
    created_at: string;
  }>;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  tier: 'monthly' | 'annual';
  receipt: string;
  invoiceNumber: string;
}

export interface CCAvenueInitiateResponse {
  accessCode: string;
  encRequest: string;
  actionUrl: string;
  orderId: string;
  amount: string;
  currency: string;
  tier: 'monthly' | 'annual';
  invoiceNumber: string;
}

export interface PayPalOrderResponse {
  orderId: string;
  amount: string;
  amountCents: number;
  currency: string;
  tier: 'monthly' | 'annual';
  clientId: string;
  invoiceNumber: string;
}

export interface ReportQuotaResponse {
  tier: 'free' | 'monthly' | 'annual';
  monthlyQuota: number;
  usedThisMonth: number;
  remaining: number | 'Unlimited';
  isUnlimited: boolean;
  canGenerate: boolean;
  reason?: string | null;
  upgradeUrl?: string;
  user?: {
    id: string;
    email: string;
    displayName: string;
  };
}

export interface ReportHistoryItem {
  id: string;
  user_id: string;
  report_type: string;
  report_title: string;
  ai_summary_used: boolean;
  file_size_bytes: number;
  generation_ms: number;
  generated_at: string;
}

export interface GenerateReportOptions {
  reportType?: 'full_market' | 'insurance_focus' | 'stock_focus';
  customTitle?: string;
  focus?: string;
}

export async function downloadReportFile(options: GenerateReportOptions = {}): Promise<{ blob: Blob; filename: string; documentId?: string }> {
  const token = await ensureCsrfToken().catch(() => '');
  const endpoint = `${API_BASE}/reports/generate`;

  const res = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-CSRF-Token': token } : {}),
    },
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    let errorData: any = {};
    try {
      errorData = await res.json();
    } catch {}
    const msg = errorData.message || errorData.error || `Report generation failed with status ${res.status}`;
    const err = new ApiError(msg, res.status, errorData.error);
    (err as any).quota = errorData.quota;
    (err as any).upgradeUrl = errorData.upgradeUrl;
    throw err;
  }

  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition') || '';
  let filename = `STATIQONE_Report_${options.reportType || 'full_market'}_${Date.now()}.pdf`;
  const match = disposition.match(/filename="?([^";]+)"?/i);
  if (match && match[1]) {
    filename = match[1];
  }
  const documentId = res.headers.get('X-Document-Id') || undefined;

  return { blob, filename, documentId };
}

export async function downloadSampleReportFile(): Promise<{ blob: Blob; filename: string }> {
  const endpoint = `${API_BASE}/reports/sample`;
  const res = await fetch(endpoint, { method: 'GET', credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to load sample report.');
  }
  const blob = await res.blob();
  return { blob, filename: 'STATIQONE_Sample_Market_Report.pdf' };
}

export const api = {
  // Auth API
  signup: (payload: { email: string; password: string; displayName?: string }) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: payload }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: payload }),

  logout: () => request<void>('/auth/logout', { method: 'POST' }),

  me: () => request<AuthResponse>('/auth/me', { method: 'GET' }),

  csrfToken: () => ensureCsrfToken(),

  // OAuth entrypoints
  googleLoginUrl: () => `${API_BASE}/auth/google`,
  microsoftLoginUrl: () => `${API_BASE}/auth/microsoft`,

  // Admin endpoints
  adminListUsers: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ users: User[]; total: number }>(`/admin/users${qs ? `?${qs}` : ''}`);
  },

  adminSetRole: (userId: string, role: 'user' | 'admin') =>
    request<{ user: User }>(`/admin/users/${userId}/role`, { method: 'PATCH', body: { role } }),

  adminRevokeSessions: (userId: string) =>
    request<{ success: boolean }>(`/admin/users/${userId}/revoke-sessions`, { method: 'POST' }),

  // Payment & Subscription endpoints
  getPaymentConfig: () =>
    request<PaymentConfigResponse>('/payments/config', { method: 'GET' }),

  getSubscriptionStatus: () =>
    request<SubscriptionStatusResponse>('/payments/subscription-status', { method: 'GET' }),

  createRazorpayOrder: (tier: 'monthly' | 'annual') =>
    request<RazorpayOrderResponse>('/payments/razorpay/create-order', { method: 'POST', body: { tier } }),

  verifyRazorpayPayment: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    tier?: string;
  }) =>
    request<{ success: boolean; tier: string; expiresAt: string; invoiceNumber: string }>(
      '/payments/razorpay/verify',
      { method: 'POST', body: payload }
    ),

  initiateCcavenuePayment: (payload: {
    tier: 'monthly' | 'annual';
    redirectUrl?: string;
    cancelUrl?: string;
  }) =>
    request<CCAvenueInitiateResponse>('/payments/ccavenue/initiate', { method: 'POST', body: payload }),

  createPaypalOrder: (tier: 'monthly' | 'annual') =>
    request<PayPalOrderResponse>('/payments/paypal/create-order', { method: 'POST', body: { tier } }),

  capturePaypalOrder: (payload: { orderId: string; tier?: string }) =>
    request<{ success: boolean; tier: string; expiresAt: string; invoiceNumber: string }>(
      '/payments/paypal/capture',
      { method: 'POST', body: payload }
    ),

  // Reports API
  getReportQuota: () =>
    request<ReportQuotaResponse>('/reports/quota', { method: 'GET' }),

  getReportHistory: () =>
    request<{ success: boolean; history: ReportHistoryItem[] }>('/reports/history', { method: 'GET' }),

  downloadReportFile,
  downloadSampleReportFile,

  request,
};
