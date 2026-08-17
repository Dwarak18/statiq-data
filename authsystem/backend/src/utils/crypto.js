/**
 * PII-at-rest protection.
 *
 * Two independent primitives, deliberately using two different keys:
 *
 *  1. encryptPII / decryptPII  -> AES-256-GCM, reversible. Used to store the real
 *     email/display name so the app can decrypt and use them (e.g. to send an email).
 *     A random 96-bit IV is generated per call, so encrypting the same value twice
 *     yields different ciphertext (prevents equality/frequency analysis on a DB leak).
 *
 *  2. hmacLookup -> HMAC-SHA256, one-way, deterministic. Used ONLY to build an index
 *     for "does this email already exist / log this user in" queries. It cannot be
 *     reversed to recover the email, and without PII_HMAC_KEY an attacker with just
 *     the DB dump cannot brute-force it offline any faster than guessing full emails
 *     (there's no salt-per-row because determinism is required for lookups; the secret
 *     key is what stands in for a salt here).
 *
 * Keys are loaded once at startup and validated to be exactly 32 bytes (AES-256 / HMAC-SHA256).
 */
const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV is the NIST-recommended size for GCM
const AUTH_TAG_LENGTH = 16;

function loadKey(envVar) {
  const hex = process.env[envVar];
  if (!hex) {
    throw new Error(`${envVar} is not set. Generate one with: openssl rand -hex 32`);
  }
  const key = Buffer.from(hex, 'hex');
  if (key.length !== 32) {
    throw new Error(`${envVar} must decode to exactly 32 bytes (64 hex chars). Got ${key.length} bytes.`);
  }
  return key;
}

// Lazily loaded so tests / tooling that don't need crypto don't require every env var.
let _encKey = null;
let _hmacKey = null;
function encKey() {
  if (!_encKey) _encKey = loadKey('PII_ENCRYPTION_KEY');
  return _encKey;
}
function hmacKey() {
  if (!_hmacKey) _hmacKey = loadKey('PII_HMAC_KEY');
  return _hmacKey;
}

/**
 * Encrypts a UTF-8 string. Returns a single base64url-safe string encoding
 * iv || authTag || ciphertext, so it fits in one TEXT column.
 */
function encryptPII(plaintext) {
  if (typeof plaintext !== 'string' || plaintext.length === 0) {
    throw new TypeError('encryptPII expects a non-empty string');
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, encKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
}

/**
 * Reverses encryptPII. Throws if the auth tag doesn't verify (tampered/corrupted data
 * or wrong key) rather than silently returning garbage.
 */
function decryptPII(payloadBase64) {
  const raw = Buffer.from(payloadBase64, 'base64');
  const iv = raw.subarray(0, IV_LENGTH);
  const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGO, encKey(), iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

/** Normalizes an email for consistent hashing/lookup (case + whitespace shouldn't matter). */
function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

/** Deterministic, keyed hash used as the DB lookup index. Never reversed. */
function hmacLookup(value) {
  return crypto.createHmac('sha256', hmacKey()).update(value).digest('hex');
}

/** SHA-256 hex digest, used for refresh-token-at-rest hashing (not a secret-keyed HMAC,
 *  because the raw token itself is already high-entropy and only lives in an httpOnly cookie). */
function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Generates a high-entropy random token, e.g. for refresh tokens. */
function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('base64url');
}

module.exports = {
  encryptPII,
  decryptPII,
  normalizeEmail,
  hmacLookup,
  sha256Hex,
  randomToken,
};
