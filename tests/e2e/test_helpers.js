/**
 * STATIQONE E2E Test Suite Helpers & Verification Utilities
 * 
 * Provides assertions, cryptographic primitives, test fixtures,
 * and test harness helpers for opaque-box integration verification.
 */
import crypto from 'node:crypto';
import assert from 'node:assert';

// Set up consistent test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test_jwt_access_secret_statiqone_32bytes_sec!';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_statiqone_32bytes_sec!';
process.env.PII_ENCRYPTION_KEY = process.env.PII_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
process.env.PII_HMAC_KEY = process.env.PII_HMAC_KEY || 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test_session_secret_for_transient_oauth_handshake';
process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_StatiqOne2026';
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'razorpay_secret_key_statiqone_secure';
process.env.CCAVENUE_WORKING_KEY = process.env.CCAVENUE_WORKING_KEY || 'ccavenue_working_key_128bit_statiq';
process.env.CCAVENUE_ACCESS_CODE = process.env.CCAVENUE_ACCESS_CODE || 'AVST123456STATIQ';
process.env.CCAVENUE_MERCHANT_ID = process.env.CCAVENUE_MERCHANT_ID || '312456';
process.env.PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'paypal_client_id_statiqone_test';
process.env.PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'paypal_secret_statiqone_test';
process.env.APP_ORIGIN = process.env.APP_ORIGIN || 'https://www.statiqone.com';

/* ------------------------------------------------------------------ */
/* Assertions                                                         */
/* ------------------------------------------------------------------ */

export function assertEqual(actual, expected, message) {
  assert.strictEqual(actual, expected, message || `Expected ${actual} to equal ${expected}`);
}

export function assertNotEqual(actual, expected, message) {
  assert.notStrictEqual(actual, expected, message || `Expected ${actual} not to equal ${expected}`);
}

export function assertDeepEqual(actual, expected, message) {
  assert.deepStrictEqual(actual, expected, message);
}

export function assertTrue(val, message) {
  assert.strictEqual(Boolean(val), true, message || `Expected truthy, got ${val}`);
}

export function assertFalse(val, message) {
  assert.strictEqual(Boolean(val), false, message || `Expected falsy, got ${val}`);
}

export function assertIncludes(haystack, needle, message) {
  if (typeof haystack === 'string') {
    assert(haystack.includes(needle), message || `Expected "${haystack}" to include "${needle}"`);
  } else if (Array.isArray(haystack)) {
    assert(haystack.includes(needle), message || `Expected array to include element`);
  } else {
    throw new Error(`assertIncludes unsupported haystack type: ${typeof haystack}`);
  }
}

export function assertMatch(str, regex, message) {
  assert(regex.test(str), message || `Expected "${str}" to match ${regex}`);
}

export function assertThrows(fn, expected, message) {
  assert.throws(fn, expected, message);
}

export async function assertThrowsAsync(fn, expected, message) {
  await assert.rejects(fn, expected, message);
}

export function assertValidPDF(buffer) {
  assertTrue(Buffer.isBuffer(buffer), 'PDF output must be a valid Buffer');
  assertTrue(buffer.length > 100, `PDF buffer too small: ${buffer.length} bytes`);
  const header = buffer.subarray(0, 5).toString('ascii');
  assertEqual(header, '%PDF-', `PDF must start with %PDF- header, got ${header}`);
}

/* ------------------------------------------------------------------ */
/* Cryptography & JWT Utilities                                       */
/* ------------------------------------------------------------------ */

const PII_ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const AUTH_TAG_LEN = 16;

export function encryptPII(plaintext, keyHex = process.env.PII_ENCRYPTION_KEY) {
  if (typeof plaintext !== 'string' || plaintext.length === 0) {
    throw new TypeError('encryptPII expects a non-empty string');
  }
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(PII_ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
}

export function decryptPII(payloadBase64, keyHex = process.env.PII_ENCRYPTION_KEY) {
  const key = Buffer.from(keyHex, 'hex');
  const raw = Buffer.from(payloadBase64, 'base64');
  const iv = raw.subarray(0, IV_LEN);
  const authTag = raw.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN);
  const ciphertext = raw.subarray(IV_LEN + AUTH_TAG_LEN);

  const decipher = crypto.createDecipheriv(PII_ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

export function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

export function hmacLookup(email, keyHex = process.env.PII_HMAC_KEY) {
  const key = Buffer.from(keyHex, 'hex');
  return crypto.createHmac('sha256', key).update(normalizeEmail(email)).digest('hex');
}

export function sha256Hex(val) {
  return crypto.createHash('sha256').update(val).digest('hex');
}

export function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('base64url');
}

/** Pure Node/Bun JWT Implementation */
export function signJwt(payload, secret = process.env.JWT_ACCESS_SECRET, expiresInSec = 900) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const fullPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSec,
  };
  const body = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token, secret = process.env.JWT_ACCESS_SECRET) {
  const parts = String(token).split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSig) throw new Error('Invalid JWT signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('JWT token expired');
  }
  return payload;
}

/** Razorpay HMAC-SHA256 Signature Verification */
export function createRazorpaySignature(orderId, paymentId, secret = process.env.RAZORPAY_KEY_SECRET) {
  const payload = `${orderId}|${paymentId}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyRazorpaySignature(orderId, paymentId, signature, secret = process.env.RAZORPAY_KEY_SECRET) {
  const expected = createRazorpaySignature(orderId, paymentId, secret);
  const expBuf = Buffer.from(expected);
  const sigBuf = Buffer.from(String(signature));
  if (expBuf.byteLength !== sigBuf.byteLength) return false;
  return crypto.timingSafeEqual(expBuf, sigBuf);
}

/** CCAvenue AES-128-CBC Encryption & Decryption */
export function encryptCCAvenue(plainText, workingKey = process.env.CCAVENUE_WORKING_KEY) {
  const m = crypto.createHash('md5');
  m.update(workingKey);
  const key = m.digest();
  const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encoded = cipher.update(plainText, 'utf8', 'hex');
  encoded += cipher.final('hex');
  return encoded;
}

export function decryptCCAvenue(encTextHex, workingKey = process.env.CCAVENUE_WORKING_KEY) {
  const m = crypto.createHash('md5');
  m.update(workingKey);
  const key = m.digest();
  const iv = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decoded = decipher.update(encTextHex, 'hex', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
}

/* ------------------------------------------------------------------ */
/* Test Data Fixtures                                                 */
/* ------------------------------------------------------------------ */

export const FIXTURE_NASDAQ_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 224.23, change: 3.12, changePercent: 1.41, marketCap: 3450200000000, peRatio: 33.4, volume: 48291020, currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', sector: 'Technology', price: 428.50, change: -1.25, changePercent: -0.29, marketCap: 3180000000000, peRatio: 36.2, volume: 22401800, currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', sector: 'Technology', price: 128.15, change: 4.10, changePercent: 3.30, marketCap: 3150000000000, peRatio: 64.5, volume: 78910230, currency: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Communication Services', price: 164.50, change: 0.80, changePercent: 0.49, marketCap: 2040000000000, peRatio: 24.1, volume: 18450120, currency: 'USD' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', price: 178.20, change: -2.10, changePercent: -1.16, marketCap: 1860000000000, peRatio: 41.8, volume: 31200450, currency: 'USD' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', sector: 'Communication Services', price: 512.40, change: 7.30, changePercent: 1.45, marketCap: 1300000000000, peRatio: 26.7, volume: 14230100, currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', sector: 'Consumer Cyclical', price: 214.50, change: -5.40, changePercent: -2.46, marketCap: 685000000000, peRatio: 58.2, volume: 55400190, currency: 'USD' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 154.60, change: 3.80, changePercent: 2.52, marketCap: 720000000000, peRatio: 45.1, volume: 9812000, currency: 'USD' },
  { symbol: 'COST', name: 'Costco Wholesale Corp', exchange: 'NASDAQ', sector: 'Consumer Defensive', price: 845.20, change: 2.10, changePercent: 0.25, marketCap: 375000000000, peRatio: 51.3, volume: 2100450, currency: 'USD' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', exchange: 'NASDAQ', sector: 'Consumer Defensive', price: 172.40, change: -0.40, changePercent: -0.23, marketCap: 237000000000, peRatio: 25.8, volume: 4501230, currency: 'USD' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 49.80, change: 0.15, changePercent: 0.30, marketCap: 201000000000, peRatio: 16.4, volume: 15400200, currency: 'USD' },
  { symbol: 'ADBE', name: 'Adobe Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 540.30, change: -4.20, changePercent: -0.77, marketCap: 242000000000, peRatio: 44.2, volume: 3201400, currency: 'USD' },
  { symbol: 'TXN', name: 'Texas Instruments Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 198.50, change: 1.10, changePercent: 0.56, marketCap: 181000000000, peRatio: 31.0, volume: 4120500, currency: 'USD' },
  { symbol: 'QCOM', name: 'QUALCOMM Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 168.90, change: -1.80, changePercent: -1.05, marketCap: 188000000000, peRatio: 22.4, volume: 7650300, currency: 'USD' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', exchange: 'NASDAQ', sector: 'Technology', price: 145.20, change: 4.80, changePercent: 3.42, marketCap: 235000000000, peRatio: 110.5, volume: 42100800, currency: 'USD' },
  { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', sector: 'Technology', price: 21.40, change: -0.80, changePercent: -3.60, marketCap: 91000000000, peRatio: null, volume: 68900400, currency: 'USD' },
  { symbol: 'INTU', name: 'Intuit Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 650.10, change: 5.20, changePercent: 0.81, marketCap: 182000000000, peRatio: 61.2, volume: 1890200, currency: 'USD' },
  { symbol: 'AMGN', name: 'Amgen Inc.', exchange: 'NASDAQ', sector: 'Healthcare', price: 312.40, change: 1.50, changePercent: 0.48, marketCap: 167000000000, peRatio: 42.6, volume: 2300150, currency: 'USD' },
  { symbol: 'HON', name: 'Honeywell International', exchange: 'NASDAQ', sector: 'Industrials', price: 204.80, change: -0.90, changePercent: -0.44, marketCap: 133000000000, peRatio: 24.5, volume: 2890100, currency: 'USD' },
  { symbol: 'SBUX', name: 'Starbucks Corporation', exchange: 'NASDAQ', sector: 'Consumer Cyclical', price: 94.50, change: 2.30, changePercent: 2.50, marketCap: 107000000000, peRatio: 26.1, volume: 11400200, currency: 'USD' },
];

export const FIXTURE_NSE_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', sector: 'Energy & Conglomerate', price: 2980.50, change: -14.20, changePercent: -0.47, marketCap: 2016500.0, peRatio: 28.1, volume: 6420190, currency: 'INR' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', sector: 'Technology', price: 4210.80, change: 35.40, changePercent: 0.85, marketCap: 1523400.0, peRatio: 31.4, volume: 2180450, currency: 'INR' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', exchange: 'NSE', sector: 'Financial Services', price: 1640.20, change: 8.50, changePercent: 0.52, marketCap: 1248000.0, peRatio: 19.2, volume: 14200800, currency: 'INR' },
  { symbol: 'INFY', name: 'Infosys Limited', exchange: 'NSE', sector: 'Technology', price: 1860.10, change: 22.10, changePercent: 1.20, marketCap: 772000.0, peRatio: 29.5, volume: 5410200, currency: 'INR' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', exchange: 'NSE', sector: 'Financial Services', price: 1180.40, change: 14.30, changePercent: 1.23, marketCap: 829000.0, peRatio: 18.1, volume: 9812400, currency: 'INR' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', exchange: 'NSE', sector: 'Telecommunications', price: 1480.90, change: -6.20, changePercent: -0.42, marketCap: 841000.0, peRatio: 64.2, volume: 4120300, currency: 'INR' },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', sector: 'Financial Services', price: 815.30, change: -4.10, changePercent: -0.50, marketCap: 727000.0, peRatio: 11.2, volume: 12400500, currency: 'INR' },
  { symbol: 'LICI', name: 'Life Insurance Corp of India', exchange: 'NSE', sector: 'Financial Services', price: 1040.50, change: 12.00, changePercent: 1.17, marketCap: 658000.0, peRatio: 16.4, volume: 3120400, currency: 'INR' },
  { symbol: 'ITC', name: 'ITC Limited', exchange: 'NSE', sector: 'Consumer Defensive', price: 495.20, change: 1.80, changePercent: 0.36, marketCap: 618000.0, peRatio: 29.8, volume: 8940100, currency: 'INR' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE', sector: 'Consumer Defensive', price: 2680.00, change: -18.50, changePercent: -0.69, marketCap: 629000.0, peRatio: 58.4, volume: 1450200, currency: 'INR' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE', sector: 'Industrials', price: 3620.40, change: 41.20, changePercent: 1.15, marketCap: 497000.0, peRatio: 37.1, volume: 1890300, currency: 'INR' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', exchange: 'NSE', sector: 'Financial Services', price: 6850.10, change: -45.00, changePercent: -0.65, marketCap: 423000.0, peRatio: 27.6, volume: 980400, currency: 'INR' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE', sector: 'Consumer Cyclical', price: 12400.00, change: 150.00, changePercent: 1.22, marketCap: 389000.0, peRatio: 28.9, volume: 412000, currency: 'INR' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Ind', exchange: 'NSE', sector: 'Healthcare', price: 1720.50, change: 8.90, changePercent: 0.52, marketCap: 412000.0, peRatio: 39.4, volume: 1650300, currency: 'INR' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', exchange: 'NSE', sector: 'Financial Services', price: 1780.00, change: -12.40, changePercent: -0.69, marketCap: 354000.0, peRatio: 22.8, volume: 2410800, currency: 'INR' },
  { symbol: 'AXISBANK', name: 'Axis Bank Limited', exchange: 'NSE', sector: 'Financial Services', price: 1190.30, change: 5.60, changePercent: 0.47, marketCap: 368000.0, peRatio: 14.6, volume: 4890200, currency: 'INR' },
  { symbol: 'TITAN', name: 'Titan Company Limited', exchange: 'NSE', sector: 'Consumer Cyclical', price: 3450.00, change: -28.00, changePercent: -0.81, marketCap: 306000.0, peRatio: 84.5, volume: 1120400, currency: 'INR' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', exchange: 'NSE', sector: 'Technology', price: 1680.20, change: 18.40, changePercent: 1.11, marketCap: 456000.0, peRatio: 28.2, volume: 2190300, currency: 'INR' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', exchange: 'NSE', sector: 'Consumer Cyclical', price: 1045.60, change: 28.50, changePercent: 2.80, marketCap: 384000.0, peRatio: 12.4, volume: 14500900, currency: 'INR' },
  { symbol: 'NTPC', name: 'NTPC Limited', exchange: 'NSE', sector: 'Utilities', price: 412.30, change: 6.10, changePercent: 1.50, marketCap: 399000.0, peRatio: 18.7, volume: 8910400, currency: 'INR' },
];

export const FIXTURE_INSURANCE_ARTICLES = [
  {
    id: 'news-us-1',
    guid_hash: sha256Hex('https://www.insurancejournal.com/news/national/2026/08/15/789123.htm'),
    source: 'Insurance Journal',
    source_code: 'IJ',
    title: 'US Commercial Property Rates Stabilize as Reinsurance Capacity Returns',
    description: 'Commercial property insurance rates in the United States showed moderate deceleration in Q2 2026 following favorable mid-year reinsurance renewals.',
    link: 'https://www.insurancejournal.com/news/national/2026/08/15/789123.htm',
    pub_date: new Date('2026-08-16T14:30:00Z'),
    region: 'USA',
    category: 'Commercial Lines',
  },
  {
    id: 'news-us-2',
    guid_hash: sha256Hex('https://www.businessinsurance.com/article/20260816/NEWS06/912345'),
    source: 'Business Insurance',
    source_code: 'BI',
    title: 'Florida Property Insurance Market Sees Inflow of New Capital',
    description: 'Legislative reforms in Florida continue to attract new underwriting capacity to the residential and commercial property markets.',
    link: 'https://www.businessinsurance.com/article/20260816/NEWS06/912345',
    pub_date: new Date('2026-08-16T12:15:00Z'),
    region: 'USA',
    category: 'Property & Casualty',
  },
  {
    id: 'news-us-3',
    guid_hash: sha256Hex('https://www.insurancejournal.com/news/west/2026/08/15/789125.htm'),
    source: 'Insurance Journal',
    source_code: 'IJ',
    title: 'California Wildfire Mitigation Framework Approved by Insurance Commissioner',
    description: 'New catastrophe modeling regulations allow insurers to factor forward-looking climate risk models into California rate filings.',
    link: 'https://www.insurancejournal.com/news/west/2026/08/15/789125.htm',
    pub_date: new Date('2026-08-15T18:00:00Z'),
    region: 'USA',
    category: 'Regulatory',
  },
  {
    id: 'news-us-4',
    guid_hash: sha256Hex('https://www.businessinsurance.com/article/20260815/NEWS06/912348'),
    source: 'Business Insurance',
    source_code: 'BI',
    title: 'Cyber Insurance Pricing Flattens Amid Higher Ransomware Resilience',
    description: 'US corporate cyber insurance renewals remained flat to down 2% in the second quarter as underwriting standards proved effective.',
    link: 'https://www.businessinsurance.com/article/20260815/NEWS06/912348',
    pub_date: new Date('2026-08-15T10:00:00Z'),
    region: 'USA',
    category: 'Cyber Risk',
  },
  {
    id: 'news-eu-1',
    guid_hash: sha256Hex('https://www.theinsurer.com/news/lloyds-h1-results-2026/12345'),
    source: 'The Insurer',
    source_code: 'TI',
    title: "Lloyd's Market Posts Strong H1 Underwriting Profit with Combined Ratio of 84.2%",
    description: "The Lloyd's of London marketplace delivered sustained profitability driven by disciplined underwriting in specialty and casualty lines.",
    link: 'https://www.theinsurer.com/news/lloyds-h1-results-2026/12345',
    pub_date: new Date('2026-08-16T09:00:00Z'),
    region: 'Europe',
    category: 'Financial Results',
  },
  {
    id: 'news-eu-2',
    guid_hash: sha256Hex('https://www.theinsurer.com/news/munich-re-q2-earnings/12346'),
    source: 'The Insurer',
    source_code: 'TI',
    title: 'Munich Re and Swiss Re Expand European Renewable Energy Treaty Solutions',
    description: 'European reinsurers introduce parametric treaty structures covering offshore wind and solar storage projects across Northern Europe.',
    link: 'https://www.theinsurer.com/news/munich-re-q2-earnings/12346',
    pub_date: new Date('2026-08-15T15:30:00Z'),
    region: 'Europe',
    category: 'Reinsurance',
  },
  {
    id: 'news-eu-3',
    guid_hash: sha256Hex('https://www.theinsurer.com/news/eiopa-solvency-ii-update/12347'),
    source: 'The Insurer',
    source_code: 'TI',
    title: 'EIOPA Finalizes Solvency II Review Directives for Cross-Border EU Groups',
    description: 'European Insurance and Occupational Pensions Authority releases technical implementation guidelines for capital adequacy.',
    link: 'https://www.theinsurer.com/news/eiopa-solvency-ii-update/12347',
    pub_date: new Date('2026-08-14T11:00:00Z'),
    region: 'Europe',
    category: 'Regulatory',
  },
  {
    id: 'news-asia-1',
    guid_hash: sha256Hex('https://www.reinsurancene.ws/irdai-health-growth-june-2026/'),
    source: 'Reinsurance News',
    source_code: 'RN',
    title: 'IRDAI Reports 32.9% YoY Premium Surge for Standalone Health Insurers in India',
    description: 'Official GI Council disclosures reveal Indian standalone health insurers underwrote ₹12,161 Crore in Q1, outpacing multi-line general insurers.',
    link: 'https://www.reinsurancene.ws/irdai-health-growth-june-2026/',
    pub_date: new Date('2026-08-16T06:00:00Z'),
    region: 'Asia',
    category: 'Market Intelligence',
  },
  {
    id: 'news-asia-2',
    guid_hash: sha256Hex('https://www.theinsurer.com/news/singapore-ils-hub-2026/12349'),
    source: 'The Insurer',
    source_code: 'TI',
    title: 'Monetary Authority of Singapore Extends Insurance-Linked Securities Grant Scheme',
    description: 'Singapore reinforces its position as the premier APAC hub for catastrophe bond issuance with renewed tax incentives.',
    link: 'https://www.theinsurer.com/news/singapore-ils-hub-2026/12349',
    pub_date: new Date('2026-08-15T08:30:00Z'),
    region: 'Asia',
    category: 'Capital Markets',
  },
  {
    id: 'news-asia-3',
    guid_hash: sha256Hex('https://www.reinsurancene.ws/tokio-marine-japan-cat-renewals/'),
    source: 'Reinsurance News',
    source_code: 'RN',
    title: 'Tokio Marine and MS&AD Note Favorable Typhoon Loss Emergence in Japan',
    description: 'Japanese non-life carriers report strong capital buffers ahead of the autumn typhoon season following strategic risk transfer adjustments.',
    link: 'https://www.reinsurancene.ws/tokio-marine-japan-cat-renewals/',
    pub_date: new Date('2026-08-14T07:15:00Z'),
    region: 'Asia',
    category: 'Reinsurance',
  },
  {
    id: 'news-global-1',
    guid_hash: sha256Hex('https://www.reinsurancene.ws/global-property-cat-steady-midyear/'),
    source: 'Reinsurance News',
    source_code: 'RN',
    title: 'Global Property Catastrophe Reinsurance Pricing Moderates at June-July Renewals',
    description: 'Disciplined treaty renewals reflect adequate reinsurance capitalization, with risk-adjusted rate changes hovering between 0% and +5%.',
    link: 'https://www.reinsurancene.ws/global-property-cat-steady-midyear/',
    pub_date: new Date('2026-08-16T16:00:00Z'),
    region: 'Global',
    category: 'Global Reinsurance',
  },
];

export const FIXTURE_IRDAI_DATA = {
  totalGrossDirectPremiumCr: 87917.63,
  yoyGrowthPercent: 10.91,
  accretionCr: 8645.93,
  averageSolvencyRatio: 2.10,
  regulatorySolvencyMin: 1.50,
  sectors: [
    { name: 'Private General Insurers', premiumCr: 49454.96, marketSharePercent: 56.25, growthPercent: 11.45 },
    { name: 'Public Sector Insurers', premiumCr: 26031.08, marketSharePercent: 29.61, growthPercent: 2.65 },
    { name: 'Standalone Health (SAHI)', premiumCr: 12161.27, marketSharePercent: 13.83, growthPercent: 32.89 },
    { name: 'Specialized (AIC/ECGC)', premiumCr: 270.32, marketSharePercent: 0.31, growthPercent: 7.09 }
  ],
  topInsurers: [
    { rank: 1, name: 'New India Assurance Co. Ltd.', type: 'PSU', premiumCr: 12700.74, marketSharePercent: 14.45, growthPercent: 3.12 },
    { rank: 2, name: 'ICICI Lombard General Insurance Co.', type: 'Private', premiumCr: 8317.89, marketSharePercent: 9.46, growthPercent: 12.80 },
    { rank: 3, name: 'Tata AIG General Insurance Co. Ltd.', type: 'Private', premiumCr: 6558.63, marketSharePercent: 7.46, growthPercent: 34.22 },
    { rank: 4, name: 'Bajaj Allianz General Insurance Co.', type: 'Private', premiumCr: 6120.40, marketSharePercent: 6.96, growthPercent: 8.50 },
    { rank: 5, name: 'Star Health & Allied Insurance Co.', type: 'SAHI', premiumCr: 4320.10, marketSharePercent: 4.91, growthPercent: 22.40 }
  ]
};
