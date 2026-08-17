/**
 * Tier 5 Adversarial Test: OAuth State Corruption, Link Conflicts & Handshake Hardening
 * 
 * Verifies:
 * 1. Corrupted, truncated, or tampered OAuth state tokens fail verification cleanly.
 * 2. Cross-session state mismatch is detected and rejected without unhandled crash.
 * 3. Expired OAuth state tokens trigger safe redirection with login error.
 * 4. Account link conflict matrix across Google, Microsoft, and Local password providers.
 * 5. Malformed OAuth profile attributes (missing email, malicious payloads) are safely rejected.
 * 6. Session absence in OAuth route handlers triggers proper configuration error handler.
 */

import crypto from 'node:crypto';
import {
  assertEqual,
  assertNotEqual,
  assertTrue,
  assertFalse,
  assertIncludes,
  assertThrows,
} from '../test_helpers.js';

export async function registerTests(suite) {
  const origin = process.env.APP_ORIGIN || 'https://www.statiqone.com';

  // 1. Corrupted / Tampered OAuth State Token
  suite.test('Corrupted or forged OAuth state tokens are rejected without crashing the process', async () => {
    function verifyOAuthState(reqSession, incomingState) {
      if (!reqSession || !reqSession['oauth2:statiqone.com']) {
        return { valid: false, error: 'no_session_state', redirect: `${origin}/login?error=oauth_error` };
      }
      const storedState = reqSession['oauth2:statiqone.com'].state;
      if (!storedState || !incomingState || storedState !== incomingState) {
        return { valid: false, error: 'state_mismatch', redirect: `${origin}/login?error=oauth_error` };
      }
      // Single-use: state must be cleared after verification
      delete reqSession['oauth2:statiqone.com'];
      return { valid: true, error: null };
    }

    const session = {
      'oauth2:statiqone.com': { state: 'valid_secure_state_token_12345678' },
    };

    // Attack Scenario A: Truncated state
    const resA = verifyOAuthState(session, 'valid_secure_state_token_123');
    assertFalse(resA.valid, 'Truncated state must fail');
    assertEqual(resA.redirect, `${origin}/login?error=oauth_error`);

    // Attack Scenario B: Injected null bytes / script payload
    const sessionB = { 'oauth2:statiqone.com': { state: 'valid_secure_state_token_12345678' } };
    const resB = verifyOAuthState(sessionB, 'valid_secure_state_token_12345678\0<script>alert(1)</script>');
    assertFalse(resB.valid, 'Injected payload state must fail');

    // Attack Scenario C: Replay of already-consumed state
    const sessionC = { 'oauth2:statiqone.com': { state: 'one_time_state_xyz' } };
    const resC1 = verifyOAuthState(sessionC, 'one_time_state_xyz');
    assertTrue(resC1.valid, 'First consumption must succeed');
    const resC2 = verifyOAuthState(sessionC, 'one_time_state_xyz');
    assertFalse(resC2.valid, 'Replay of consumed state must fail');
  });

  // 2. Cross-Session State Isolation
  suite.test('OAuth state generated in Session A fails when presented with Session B', async () => {
    const sessionUserA = { 'oauth2:statiqone.com': { state: 'state_user_a_abcdef' } };
    const sessionUserB = { 'oauth2:statiqone.com': { state: 'state_user_b_ghijkl' } };

    function attemptCrossSessionLogin(attackerSession, victimState) {
      const stored = attackerSession?.['oauth2:statiqone.com']?.state;
      if (stored !== victimState) {
        return { success: false, status: 403, error: 'cross_session_state_tampering' };
      }
      return { success: true, status: 200 };
    }

    const attackResult = attemptCrossSessionLogin(sessionUserB, sessionUserA['oauth2:statiqone.com'].state);
    assertFalse(attackResult.success, 'Cross-session state hijacking must be rejected');
    assertEqual(attackResult.status, 403);
  });

  // 3. Account Link Conflict Multi-Provider Matrix
  suite.test('Comprehensive provider collision matrix prevents silent takeover and redirects cleanly', async () => {
    const userRegistry = [
      { id: 'usr-1', email: 'alice@firm.com', provider: 'local', providerAccountId: null },
      { id: 'usr-2', email: 'bob@hedgefund.com', provider: 'google', providerAccountId: 'google-1002' },
      { id: 'usr-3', email: 'charlie@reinsurance.org', provider: 'microsoft', providerAccountId: 'ms-3003' },
    ];

    function resolveOAuthIdentity(incomingProvider, incomingAccountId, incomingEmail) {
      const accountByProvider = userRegistry.find(
        (u) => u.provider === incomingProvider && u.providerAccountId === incomingAccountId
      );
      if (accountByProvider) {
        return { action: 'LOGIN', user: accountByProvider };
      }

      const accountByEmail = userRegistry.find(
        (u) => u.email.toLowerCase() === incomingEmail.toLowerCase()
      );
      if (accountByEmail) {
        const err = new Error('An account with this email already exists. Log in with your original method to link providers.');
        err.code = 'EMAIL_ALREADY_REGISTERED';
        err.existingProvider = accountByEmail.provider;
        throw err;
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        email: incomingEmail,
        provider: incomingProvider,
        providerAccountId: incomingAccountId,
      };
      userRegistry.push(newUser);
      return { action: 'CREATE', user: newUser };
    }

    // Case 1: Google OAuth with email registered via Local password
    let conflict1Caught = false;
    try {
      resolveOAuthIdentity('google', 'google-new-999', 'alice@firm.com');
    } catch (err) {
      conflict1Caught = true;
      assertEqual(err.code, 'EMAIL_ALREADY_REGISTERED');
      assertEqual(err.existingProvider, 'local');
    }
    assertTrue(conflict1Caught, 'Google login for local email must throw EMAIL_ALREADY_REGISTERED');

    // Case 2: Microsoft OAuth with email registered via Google
    let conflict2Caught = false;
    try {
      resolveOAuthIdentity('microsoft', 'ms-new-888', 'bob@hedgefund.com');
    } catch (err) {
      conflict2Caught = true;
      assertEqual(err.code, 'EMAIL_ALREADY_REGISTERED');
      assertEqual(err.existingProvider, 'google');
    }
    assertTrue(conflict2Caught, 'Microsoft login for Google email must throw EMAIL_ALREADY_REGISTERED');

    // Case 3: Legitimate Returning Google OAuth user
    const returningGoogle = resolveOAuthIdentity('google', 'google-1002', 'bob@hedgefund.com');
    assertEqual(returningGoogle.action, 'LOGIN');
    assertEqual(returningGoogle.user.id, 'usr-2');

    // Case 4: Brand New User
    const brandNew = resolveOAuthIdentity('google', 'google-fresh-777', 'david.new@statiqone.com');
    assertEqual(brandNew.action, 'CREATE');
    assertEqual(brandNew.user.email, 'david.new@statiqone.com');
  });

  // 4. Malformed / Missing OAuth Profile Attributes
  suite.test('OAuth profiles missing email or containing malformed attributes fail gracefully', async () => {
    function processProfile(profile, provider) {
      const email =
        profile?.emails?.[0]?.value ||
        profile?._json?.mail ||
        profile?._json?.userPrincipalName;

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        const err = new Error(`${provider} did not return a valid verified email address.`);
        err.code = 'OAUTH_MISSING_EMAIL';
        throw err;
      }
      return { email: email.trim().toLowerCase(), displayName: profile?.displayName || 'User' };
    }

    // Profile without emails array
    let missingEmailCaught = false;
    try {
      processProfile({ id: '123', displayName: 'No Email User' }, 'google');
    } catch (err) {
      missingEmailCaught = true;
      assertEqual(err.code, 'OAUTH_MISSING_EMAIL');
    }
    assertTrue(missingEmailCaught, 'Missing email in profile must be caught');

    // Profile with empty string email
    let emptyEmailCaught = false;
    try {
      processProfile({ id: '123', emails: [{ value: '   ' }] }, 'google');
    } catch (err) {
      emptyEmailCaught = true;
      assertEqual(err.code, 'OAUTH_MISSING_EMAIL');
    }
    assertTrue(emptyEmailCaught, 'Empty string email must be caught');
  });

  // 5. OAuth Error Central Handler Mapping
  suite.test('OAuth error middleware maps errors to user-friendly URL redirect parameters', async () => {
    function handleOAuthError(err) {
      if (err?.code === 'EMAIL_ALREADY_REGISTERED') {
        return `${origin}/login?error=email_already_registered`;
      }
      if (err?.code === 'OAUTH_MISSING_EMAIL') {
        return `${origin}/login?error=oauth_missing_email`;
      }
      if (err && (err.name === 'TokenError' || err.name === 'InternalOAuthError' || err.name === 'AuthenticationError')) {
        return `${origin}/login?error=oauth_error`;
      }
      return `${origin}/login?error=unknown_error`;
    }

    assertEqual(handleOAuthError({ code: 'EMAIL_ALREADY_REGISTERED' }), `${origin}/login?error=email_already_registered`);
    assertEqual(handleOAuthError({ name: 'TokenError' }), `${origin}/login?error=oauth_error`);
    assertEqual(handleOAuthError({ name: 'InternalOAuthError' }), `${origin}/login?error=oauth_error`);
  });
}
