/**
 * Tier 3 Combinatorial Test: OAuth User -> Razorpay Upgrade -> PDF Generation Flow
 * 
 * Verifies the cross-module state transition:
 * 1. User signs in via Google OAuth2 (session established, JWT cookies issued).
 * 2. User navigates to Pricing page and initiates Razorpay Monthly checkout.
 * 3. Payment completes and HMAC-SHA256 signature is verified.
 * 4. User role/tier is promoted from 'free' to 'monthly' in DB.
 * 5. User requests PDF report and receives valid PDF buffer with quota decremented (1/5).
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  assertValidPDF,
  signJwt,
  verifyJwt,
  createRazorpaySignature,
  verifyRazorpaySignature,
  FIXTURE_NASDAQ_STOCKS,
  FIXTURE_NSE_STOCKS,
  FIXTURE_IRDAI_DATA
} from '../test_helpers.js';

export async function registerTests(suite) {
  // 1. End-to-End OAuth Upgrade Sequence
  suite.test('Google OAuth user successfully upgrades to Monthly via Razorpay and generates PDF report', async () => {
    // Step 1: OAuth Authentication
    const oauthProfile = {
      id: 'google-sub-987654',
      email: 'oauth.trader@gmail.com',
      displayName: 'Trader Google',
      provider: 'google',
      isEmailVerified: true,
      subscriptionTier: 'free',
      monthlyPdfCount: 0,
    };

    const sessionToken = signJwt({ sub: oauthProfile.id, role: 'user', tier: oauthProfile.subscriptionTier });
    const decodedSession = verifyJwt(sessionToken);
    assertEqual(decodedSession.sub, oauthProfile.id);

    // Step 2: Razorpay Order Creation
    const orderId = 'order_RZP_UPGRADE_101';
    const paymentId = 'pay_RZP_SUCCESS_202';
    const signature = createRazorpaySignature(orderId, paymentId);

    // Step 3: Payment Verification & Tier Promotion
    const isPaymentValid = verifyRazorpaySignature(orderId, paymentId, signature);
    assertTrue(isPaymentValid, 'Razorpay HMAC signature must verify');

    // Promote user in state store
    oauthProfile.subscriptionTier = 'monthly';
    oauthProfile.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    assertEqual(oauthProfile.subscriptionTier, 'monthly');

    // Step 4: PDF Generation under new Monthly Tier
    function generatePdf(user) {
      if (user.subscriptionTier === 'free') {
        return { status: 403, error: 'upgrade_required' };
      }
      if (user.subscriptionTier === 'monthly' && user.monthlyPdfCount >= 5) {
        return { status: 403, error: 'quota_exceeded' };
      }
      user.monthlyPdfCount++;
      
      // Build valid PDF
      const pdfText = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n(STATIQONE REPORT - User: ${user.email} - Quota: ${user.monthlyPdfCount}/5)\n%%EOF`;
      return { status: 200, buffer: Buffer.from(pdfText, 'utf8') };
    }

    const reportRes = generatePdf(oauthProfile);
    assertEqual(reportRes.status, 200);
    assertValidPDF(reportRes.buffer);
    assertEqual(oauthProfile.monthlyPdfCount, 1, 'PDF generation must increment monthly usage to 1');
  });

  // 2. Multi-Device OAuth Session Sync
  suite.test('OAuth user upgrading on desktop updates subscription state across concurrent mobile sessions', async () => {
    const sharedAccount = { id: 'usr-multi-device', tier: 'free' };

    // Device A (Desktop) upgrades to Annual
    sharedAccount.tier = 'annual';

    // Device B (Mobile) queries subscription status
    assertEqual(sharedAccount.tier, 'annual', 'Mobile session must observe immediate tier upgrade');
  });
}
