/**
 * Passport is used purely for the OAuth *handshake* (redirect to provider,
 * handle callback, verify signature/state). We do NOT use passport sessions
 * (`session: false` everywhere) because session state is our own JWT/refresh
 * cookie system, not Express sessions.
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const userRepository = require('../models/userRepository');
const { CookieStateStore } = require('../utils/oauthStateStore');


/**
 * Shared "find or create" logic for any OAuth provider.
 * If a local (email/password) account already exists with the same verified
 * email, we link the OAuth identity to it rather than creating a duplicate
 * account — but only because the provider has already verified the email
 * itself (Google/Microsoft only return verified emails via OIDC profile).
 */
async function findOrCreateOAuthUser({ provider, providerAccountId, email, displayName }) {
  if (!email) {
    throw new Error(`${provider} did not return an email address for this account.`);
  }

  let user = await userRepository.findByProviderAccount(provider, providerAccountId);
  if (user) return user;

  const existingByEmail = await userRepository.findByEmail(email);
  if (existingByEmail) {
    // Email already registered (locally or via another provider). We intentionally do NOT
    // silently auto-link here in this reference implementation to avoid account-takeover
    // edge cases (e.g. attacker controls an OAuth account with a victim's email alias).
    // A production system would typically prompt the user to confirm via their existing
    // login method before linking. We surface a clear error instead.
    const err = new Error('An account with this email already exists. Log in with your original method to link providers.');
    err.code = 'EMAIL_ALREADY_REGISTERED';
    throw err;
  }

  user = await userRepository.createOAuthUser({ email, displayName, provider, providerAccountId });
  return user;
}

function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
        store: new CookieStateStore(), // stateless HMAC-signed cookie; no express-session needed
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          const user = await findOrCreateOAuthUser({
            provider: 'google',
            providerAccountId: profile.id,
            email,
            displayName: profile.displayName,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID || 'mock-microsoft-client-id',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'mock-microsoft-client-secret',
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:4000/api/auth/microsoft/callback',
        tenant: process.env.MICROSOFT_TENANT || 'common',
        scope: ['user.read'],
        store: new CookieStateStore(), // stateless HMAC-signed cookie; no express-session needed
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0] && profile.emails[0].value
              ? profile.emails[0].value
              : profile._json && (profile._json.mail || profile._json.userPrincipalName);
          const user = await findOrCreateOAuthUser({
            provider: 'microsoft',
            providerAccountId: profile.id,
            email,
            displayName: profile.displayName,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userRepository.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
}

module.exports = { configurePassport, findOrCreateOAuthUser };
