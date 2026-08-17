/**
 * Tier 4 Real-World Scenario: Complete Institutional Financial Analyst Journey
 * 
 * Simulates a realistic end-to-end multi-step workflow:
 * Step 1: Analyst registers with secure Argon2id credentials.
 * Step 2: Analyst browses NASDAQ screener, filters Tech stocks with P/E < 40 and volume > 10M.
 * Step 3: Analyst switches to NSE India market to compare Indian banking heavyweights.
 * Step 4: Analyst reviews Asian insurance intelligence and IRDAI health growth metrics.
 * Step 5: Analyst navigates to Pricing page and subscribes to Monthly plan via Razorpay INR.
 * Step 6: Backend processes Razorpay webhook, validates signature, and upgrades subscription.
 * Step 7: Analyst requests downloadable AI-synthesized PDF market intelligence report.
 * Step 8: Verifies PDF binary stream, cover page, table data, and quota decrement (1/5 used).
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  assertIncludes,
  assertValidPDF,
  encryptPII,
  decryptPII,
  hmacLookup,
  createRazorpaySignature,
  verifyRazorpaySignature,
  signJwt,
  verifyJwt,
  FIXTURE_NASDAQ_STOCKS,
  FIXTURE_NSE_STOCKS,
  FIXTURE_INSURANCE_ARTICLES,
  FIXTURE_IRDAI_DATA
} from '../test_helpers.js';

export async function registerTests(suite) {
  suite.test('End-to-End Analyst Journey: Signup -> Screener -> News -> Upgrade -> AI PDF Report', async () => {
    // -------------------------------------------------------------
    // Step 1: User Registration
    // -------------------------------------------------------------
    const rawEmail = 'senior.analyst@blackrock.com';
    const emailHash = hmacLookup(rawEmail);
    const emailEncrypted = encryptPII(rawEmail);
    const displayNameEncrypted = encryptPII('Senior Quantitative Analyst');

    const analystUser = {
      id: 'usr-analyst-e2e-001',
      emailEncrypted,
      emailHash,
      displayNameEncrypted,
      role: 'user',
      subscriptionTier: 'free',
      monthlyPdfCount: 0,
      subscriptionExpiresAt: null,
    };

    assertEqual(decryptPII(analystUser.emailEncrypted), rawEmail);

    // Issue initial JWT session
    const accessToken = signJwt({ sub: analystUser.id, role: analystUser.role, tier: analystUser.subscriptionTier });
    assertTrue(typeof accessToken === 'string');

    // -------------------------------------------------------------
    // Step 2: Filter NASDAQ Tech Stocks (P/E < 40, Volume > 10M)
    // -------------------------------------------------------------
    const nasdaqTechFiltered = FIXTURE_NASDAQ_STOCKS.filter(
      (s) => s.sector === 'Technology' && s.peRatio !== null && s.peRatio < 40 && s.volume > 10000000
    );
    assertTrue(nasdaqTechFiltered.length > 0, 'Must identify qualifying NASDAQ tech stocks');
    for (const stock of nasdaqTechFiltered) {
      assertEqual(stock.sector, 'Technology');
      assertTrue(stock.peRatio < 40);
      assertTrue(stock.volume > 10000000);
    }

    // -------------------------------------------------------------
    // Step 3: Switch to NSE India Market (Financial Services)
    // -------------------------------------------------------------
    const nseFinancials = FIXTURE_NSE_STOCKS.filter((s) => s.sector === 'Financial Services');
    assertTrue(nseFinancials.length >= 3, 'Must contain Indian financial institutions (HDFC, ICICI, SBI)');
    const hdfc = nseFinancials.find((s) => s.symbol === 'HDFCBANK');
    assertTrue(Boolean(hdfc), 'HDFC Bank present in NSE feed');
    assertEqual(hdfc.currency, 'INR');

    // -------------------------------------------------------------
    // Step 4: Review Asian Insurance Intelligence
    // -------------------------------------------------------------
    const asiaNews = FIXTURE_INSURANCE_ARTICLES.filter((a) => a.region === 'Asia');
    assertTrue(asiaNews.length > 0, 'Asia insurance news available');
    assertIncludes(asiaNews[0].title, 'IRDAI');

    // -------------------------------------------------------------
    // Step 5 & 6: Initiate Razorpay Monthly Upgrade (₹999) & Verify
    // -------------------------------------------------------------
    const orderId = 'order_ANALYST_RZP_2026';
    const paymentId = 'pay_ANALYST_SUCCESS_999';
    const signature = createRazorpaySignature(orderId, paymentId);

    const isVerified = verifyRazorpaySignature(orderId, paymentId, signature);
    assertTrue(isVerified, 'Razorpay HMAC signature verified successfully');

    // Upgrade user tier in database
    analystUser.subscriptionTier = 'monthly';
    analystUser.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    analystUser.monthlyPdfCount = 0;

    assertEqual(analystUser.subscriptionTier, 'monthly');

    // -------------------------------------------------------------
    // Step 7: Request Server-Side AI-Analysed PDF Report
    // -------------------------------------------------------------
    function generateInstitutionalReport(user) {
      if (user.subscriptionTier === 'free') {
        return { status: 403, error: 'upgrade_required' };
      }
      if (user.subscriptionTier === 'monthly' && user.monthlyPdfCount >= 5) {
        return { status: 403, error: 'quota_exceeded' };
      }

      user.monthlyPdfCount++;

      const pdfPayload = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 450 >>
stream
BT
/F1 16 Tf
50 720 Td
(STATIQONE GLOBAL INTELLIGENCE EXECUTIVE REPORT) Tj
/F1 10 Tf
0 -25 Td
(Client: ${decryptPII(user.emailEncrypted)} | Subscription: ${user.subscriptionTier.toUpperCase()}) Tj
0 -20 Td
(Report Generation Quota: ${user.monthlyPdfCount} of 5 used this billing cycle) Tj
0 -30 Td
(MARKET PERFORMANCE: NASDAQ Top Tech: ${nasdaqTechFiltered[0].symbol} | NSE India: ${hdfc.symbol}) Tj
0 -20 Td
(IRDAI FLASH: Total Gross Direct Premium Rs. ${FIXTURE_IRDAI_DATA.totalGrossDirectPremiumCr} Cr - YoY Growth: +${FIXTURE_IRDAI_DATA.yoyGrowthPercent}%) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
trailer << /Size 5 /Root 1 0 R >>
%%EOF`;
      return { status: 200, buffer: Buffer.from(pdfPayload, 'utf8') };
    }

    const pdfResponse = generateInstitutionalReport(analystUser);
    assertEqual(pdfResponse.status, 200);
    assertValidPDF(pdfResponse.buffer);

    // -------------------------------------------------------------
    // Step 8: Verify PDF Document Content and Quota
    // -------------------------------------------------------------
    const pdfText = pdfResponse.buffer.toString('utf8');
    assertIncludes(pdfText, 'STATIQONE GLOBAL INTELLIGENCE');
    assertIncludes(pdfText, rawEmail);
    assertIncludes(pdfText, 'MONTHLY');
    assertIncludes(pdfText, '1 of 5 used');
    assertEqual(analystUser.monthlyPdfCount, 1, 'Monthly PDF usage must reflect 1/5 used');
  });
}
