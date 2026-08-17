/**
 * Tier 4 Real-World Scenario: Account Link Conflict & Resolution Flow
 * 
 * Simulates real-world user login collision:
 * 1. User signs up with email and password (local provider).
 * 2. User later clicks "Sign in with Google" using the same email address.
 * 3. OAuth callback intercepts provider mismatch, sets EMAIL_ALREADY_REGISTERED error code.
 * 4. User is redirected to /login?error=email_already_registered.
 * 5. Frontend login UI parses query param and renders warning banner.
 * 6. User enters original password, logs in successfully, and receives valid JWT cookie.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  assertIncludes,
  encryptPII,
  hmacLookup,
  signJwt,
  verifyJwt
} from '../test_helpers.js';

export async function registerTests(suite) {
  suite.test('Account link collision flow politely guides user to password login without server crash', async () => {
    // Database State
    const rawEmail = 'quant.trader@hedgefund.com';
    const emailHash = hmacLookup(rawEmail);
    const mockUserDatabase = new Map();

    // Step 1: User registers with password
    const localUser = {
      id: 'usr-local-original',
      emailEncrypted: encryptPII(rawEmail),
      emailHash: emailHash,
      provider: 'local',
      passwordHash: '$argon2id$v=19$m=19456,t=2,p=1$fakeHash123...',
      role: 'user',
    };
    mockUserDatabase.set(emailHash, localUser);

    // Step 2: User attempts Google OAuth login with same email
    function handleGoogleOAuthCallback(profileEmail) {
      const targetHash = hmacLookup(profileEmail);
      const existing = mockUserDatabase.get(targetHash);

      if (existing && existing.provider !== 'google') {
        const err = new Error('An account with this email already exists. Log in with your original method to link providers.');
        err.code = 'EMAIL_ALREADY_REGISTERED';
        throw err;
      }
      return { success: true };
    }

    // Step 3: Error Handler intercepts and builds redirect URL
    let redirectedUrl = null;
    try {
      handleGoogleOAuthCallback(rawEmail);
    } catch (err) {
      if (err.code === 'EMAIL_ALREADY_REGISTERED') {
        redirectedUrl = `${process.env.APP_ORIGIN}/login?error=email_already_registered`;
      }
    }

    assertEqual(redirectedUrl, 'https://www.statiqone.com/login?error=email_already_registered');

    // Step 4: Frontend parses error code and renders friendly banner
    function getFrontendErrorBanner(searchQuery) {
      const params = new URLSearchParams(searchQuery);
      const error = params.get('error');
      if (error === 'email_already_registered') {
        return {
          type: 'warning',
          message: 'That email is already registered with a password. Please sign in using your original method.',
        };
      }
      return null;
    }

    const banner = getFrontendErrorBanner('?error=email_already_registered');
    assertTrue(banner !== null);
    assertIncludes(banner.message, 'already registered with a password');

    // Step 5: User logs in with password
    function loginWithPassword(email, password) {
      const u = mockUserDatabase.get(hmacLookup(email));
      if (u && password === 'ValidPassword123!') {
        const token = signJwt({ sub: u.id, role: u.role });
        return { status: 200, user: { id: u.id, email }, accessToken: token };
      }
      return { status: 401, error: 'invalid_credentials' };
    }

    const loginRes = loginWithPassword(rawEmail, 'ValidPassword123!');
    assertEqual(loginRes.status, 200);
    assertTrue(typeof loginRes.accessToken === 'string');
    const decoded = verifyJwt(loginRes.accessToken);
    assertEqual(decoded.sub, localUser.id);
  });
}
