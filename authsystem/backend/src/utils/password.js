/**
 * Password hashing via Argon2id (winner of the Password Hashing Competition,
 * recommended over bcrypt by OWASP when available). Parameters follow the
 * OWASP 2023 minimum recommendation for Argon2id.
 */
const argon2 = require('argon2');

const HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

async function hashPassword(plainPassword) {
  return argon2.hash(plainPassword, HASH_OPTIONS);
}

async function verifyPassword(hash, plainPassword) {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    // Malformed hash, etc. Treat as "does not match" rather than throwing into the caller.
    return false;
  }
}

/**
 * Minimum-bar password policy. Keep this readable server-side and mirror it
 * client-side for UX, but ALWAYS re-check server-side since client checks are
 * trivially bypassed.
 */
function validatePasswordStrength(password) {
  const errors = [];
  if (typeof password !== 'string' || password.length < 10) {
    errors.push('Password must be at least 10 characters long.');
  }
  if (password.length > 128) {
    errors.push('Password must be under 128 characters long.');
  }
  if (!/[a-z]/.test(password)) errors.push('Password must include a lowercase letter.');
  if (!/[A-Z]/.test(password)) errors.push('Password must include an uppercase letter.');
  if (!/[0-9]/.test(password)) errors.push('Password must include a digit.');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must include a symbol.');
  return errors;
}

module.exports = { hashPassword, verifyPassword, validatePasswordStrength };
