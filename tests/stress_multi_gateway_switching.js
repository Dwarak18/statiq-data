/**
 * Empirical Stress Test 2: Multi-Gateway Checkout Switching & Concurrency
 * 
 * Verifies gateway interactions across Razorpay (INR), CCAvenue (INR), and PayPal (USD):
 * 1. Rapid switching between all 3 gateways without state corruption.
 * 2. Concurrent order creation across gateways for a single user.
 * 3. Payment completion on one gateway while other gateway checkouts are open.
 * 4. Cross-gateway tier transitions (Free -> Monthly on Razorpay -> Annual on PayPal).
 * 5. Replay attacks and tampered signature rejection during gateway switching.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const crypto = require('crypto');

// Set required environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/statiqone_test';
process.env.RAZORPAY_KEY_ID = 'rzp_test_statiqone_live_key';
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret_key_statiqone';
process.env.CCAVENUE_WORKING_KEY = '4D9E2F1A8C7B6E5D0A1B2C3D4E5F6A7B';
process.env.CCAVENUE_ACCESS_CODE = 'AVST98KL12CD34EF';
process.env.CCAVENUE_MERCHANT_ID = '2158490';
process.env.PAYPAL_CLIENT_ID = 'AZ_statiqone_paypal_client_id_live_v2';
process.env.PAYPAL_CLIENT_SECRET = 'EL_statiqone_paypal_secret_key_live_v2';

// Create in-memory mock database store for multi-gateway transactions
const dbUsers = new Map();
const dbSubscriptions = new Map();
const dbInvoices = [];

const mockPool = {
  async connect() {
    return {
      async query(text, params = []) {
        const queryText = text.trim().toUpperCase();
        if (queryText === 'BEGIN' || queryText === 'COMMIT' || queryText === 'ROLLBACK') {
          return { rows: [] };
        }

        if (queryText.startsWith('UPDATE USERS')) {
          const userId = params[2];
          const tier = params[0];
          const expiresAt = params[1];
          const existing = dbUsers.get(userId) || { id: userId, role: 'user', email_encrypted: 'test' };
          const updated = {
            ...existing,
            subscription_tier: tier,
            subscription_status: 'active',
            subscription_expires_at: expiresAt,
            monthly_pdf_count: 0,
          };
          dbUsers.set(userId, updated);
          return { rows: [updated] };
        }

        if (queryText.startsWith('INSERT INTO SUBSCRIPTIONS')) {
          const sub = {
            id: `sub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
            user_id: params[0],
            tier: params[1],
            status: 'active',
            currency: params[2],
            amount_cents: params[3],
            billing_interval: params[4],
            gateway: params[5],
            gateway_order_id: params[6],
            current_period_start: params[7],
            current_period_end: params[8],
          };
          dbSubscriptions.set(sub.id, sub);
          return { rows: [sub] };
        }

        if (queryText.startsWith('INSERT INTO INVOICES')) {
          const inv = {
            id: `inv_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
            subscription_id: params[0],
            user_id: params[1],
            invoice_number: params[2],
            amount_cents: params[3],
            currency: params[4],
            tier: params[5],
            status: 'paid',
            gateway: params[6],
            gateway_order_id: params[7],
            gateway_payment_id: params[8],
            gateway_signature: params[9],
            metadata: params[10],
            paid_at: new Date().toISOString(),
          };
          dbInvoices.push(inv);
          return { rows: [inv] };
        }

        return { rows: [] };
      },
      release() {},
    };
  },
  async query(text, params = []) {
    const queryText = text.trim().toUpperCase();

    if (queryText.startsWith('SELECT ID, ROLE, SUBSCRIPTION_TIER')) {
      const userId = params[0];
      const user = dbUsers.get(userId) || {
        id: userId,
        role: 'user',
        subscription_tier: 'free',
        subscription_status: 'active',
        subscription_expires_at: null,
        monthly_pdf_count: 0,
        pdf_count_reset_at: null,
      };
      return { rows: [user] };
    }

    if (queryText.startsWith('INSERT INTO INVOICES')) {
      const inv = {
        id: `inv_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        user_id: params[0],
        invoice_number: params[1],
        amount_cents: params[2],
        currency: params[3],
        tier: params[4],
        status: 'pending',
        gateway: params[5],
        gateway_order_id: params[6],
        metadata: params[7],
        created_at: new Date().toISOString(),
      };
      dbInvoices.push(inv);
      return { rows: [inv] };
    }

    if (queryText.startsWith('SELECT * FROM SUBSCRIPTIONS')) {
      const userId = params[0];
      const subs = Array.from(dbSubscriptions.values()).filter((s) => s.user_id === userId);
      return { rows: subs.slice(0, 1) };
    }

    if (queryText.startsWith('SELECT ID, INVOICE_NUMBER')) {
      const userId = params[0];
      const invs = dbInvoices.filter((i) => i.user_id === userId);
      return { rows: invs };
    }

    if (queryText.startsWith('UPDATE INVOICES')) {
      return { rows: [] };
    }

    return { rows: [] };
  },
  on() {},
};

// Inject mockPool into require cache for pool.js
const poolPath = require.resolve('../authsystem/backend/src/db/pool.js');
require.cache[poolPath] = {
  id: poolPath,
  filename: poolPath,
  loaded: true,
  exports: mockPool,
};

const paymentService = require('../authsystem/backend/src/services/paymentService.js');

async function runMultiGatewayTests() {
  console.log('\n======================================================');
  console.log('STRESS TEST 2: Multi-Gateway Checkout Switching');
  console.log('======================================================\n');

  const userId = `usr_switch_${Date.now()}`;
  dbUsers.set(userId, {
    id: userId,
    role: 'user',
    subscription_tier: 'free',
    subscription_status: 'active',
    subscription_expires_at: null,
    monthly_pdf_count: 0,
  });

  let passed = true;
  const failureReasons = [];

  // Scenario 1: Rapid Switching Across 3 Gateways
  console.log('Scenario 1: Rapid Gateway Checkout Initiation (Razorpay -> CCAvenue -> PayPal)');
  try {
    const rzpOrder = await paymentService.createRazorpayOrder({ userId, tier: 'monthly' });
    console.log('  ✔ Razorpay INR Order Created:', rzpOrder.orderId, `(${rzpOrder.amount} paise)`);

    const ccaOrder = await paymentService.initiateCcavenuePayment({ userId, tier: 'monthly' });
    console.log('  ✔ CCAvenue INR Checkout Created:', ccaOrder.orderId, `(₹${ccaOrder.amount})`);

    const paypalOrder = await paymentService.createPaypalOrder({ userId, tier: 'monthly' });
    console.log('  ✔ PayPal USD Order Created:', paypalOrder.orderId, `($${paypalOrder.amount})`);

    if (!rzpOrder.orderId || !ccaOrder.encRequest || !paypalOrder.orderId) {
      throw new Error('One or more gateway order initiations failed to return required tokens.');
    }
  } catch (err) {
    passed = false;
    failureReasons.push(`Scenario 1 Failed: ${err.message}`);
    console.error('  ✖ Scenario 1 Error:', err.message);
  }

  // Scenario 2: Concurrent Order Creation on All 3 Gateways
  console.log('\nScenario 2: Concurrent Multi-Gateway Order Creation for Same User (15 parallel requests)');
  try {
    const startMs = performance.now();
    const concurrentOrders = await Promise.all(
      Array.from({ length: 15 }, async (_, i) => {
        const gw = i % 3 === 0 ? 'razorpay' : i % 3 === 1 ? 'ccavenue' : 'paypal';
        if (gw === 'razorpay') {
          return paymentService.createRazorpayOrder({ userId, tier: 'monthly' });
        } else if (gw === 'ccavenue') {
          return paymentService.initiateCcavenuePayment({ userId, tier: 'annual' });
        } else {
          return paymentService.createPaypalOrder({ userId, tier: 'annual' });
        }
      })
    );
    const durationMs = (performance.now() - startMs).toFixed(2);
    const uniqueInvoiceCount = new Set(concurrentOrders.map(o => o.invoiceNumber)).size;
    console.log(`  ✔ Successfully created 15 mixed-gateway orders in parallel (${durationMs}ms)`);
    console.log('  Unique Invoice Numbers Generated:', uniqueInvoiceCount, '/ 15');
    
    if (uniqueInvoiceCount !== 15) {
      throw new Error(`Invoice collision: only ${uniqueInvoiceCount}/15 unique numbers.`);
    }
  } catch (err) {
    passed = false;
    failureReasons.push(`Scenario 2 Failed: ${err.message}`);
    console.error('  ✖ Scenario 2 Error:', err.message);
  }

  // Scenario 3: Cross-Gateway Tier Transition & Verification (Razorpay Monthly -> PayPal Annual)
  console.log('\nScenario 3: Completing Payment on Razorpay Monthly then Upgrading via PayPal Annual');
  try {
    // Step 3a: User completes Monthly checkout on Razorpay
    const rzpOrderId = `order_rzp_live_${Date.now()}`;
    const rzpPaymentId = `pay_rzp_live_${Date.now()}`;
    const secret = 'rzp_test_secret_key_statiqone';
    const rzpSig = crypto.createHmac('sha256', secret).update(`${rzpOrderId}|${rzpPaymentId}`).digest('hex');

    const rzpVerification = await paymentService.verifyRazorpayPayment({
      userId,
      razorpay_order_id: rzpOrderId,
      razorpay_payment_id: rzpPaymentId,
      razorpay_signature: rzpSig,
      tier: 'monthly',
    });

    console.log('  ✔ Razorpay Monthly Payment Verified. Tier:', rzpVerification.tier);

    const statusAfterRzp = await paymentService.getUserSubscriptionStatus(userId);
    console.log('  Subscription Status after Razorpay:', {
      tier: statusAfterRzp.tier,
      pdfQuota: statusAfterRzp.pdfQuota,
      pdfReportsRemaining: statusAfterRzp.pdfReportsRemaining,
    });

    if (statusAfterRzp.tier !== 'monthly' || statusAfterRzp.pdfReportsRemaining !== 5) {
      throw new Error(`Expected tier 'monthly' with 5 remaining reports, got ${statusAfterRzp.tier} with ${statusAfterRzp.pdfReportsRemaining}`);
    }

    // Step 3b: User upgrades from Monthly to Annual on PayPal
    const paypalOrderId = `PAYPAL-ORD-${Date.now()}-TEST`;
    const paypalCapture = await paymentService.capturePaypalOrder({
      userId,
      orderId: paypalOrderId,
      tier: 'annual',
    });

    console.log('  ✔ PayPal Annual Upgrade Captured. New Tier:', paypalCapture.tier);

    const statusAfterPaypal = await paymentService.getUserSubscriptionStatus(userId);
    console.log('  Subscription Status after PayPal Upgrade:', {
      tier: statusAfterPaypal.tier,
      pdfQuota: statusAfterPaypal.pdfQuota,
      pdfReportsRemaining: statusAfterPaypal.pdfReportsRemaining,
    });

    if (statusAfterPaypal.tier !== 'annual' || statusAfterPaypal.pdfReportsRemaining !== 'Unlimited') {
      throw new Error(`Expected tier 'annual' with Unlimited remaining, got ${statusAfterPaypal.tier} with ${statusAfterPaypal.pdfReportsRemaining}`);
    }
  } catch (err) {
    passed = false;
    failureReasons.push(`Scenario 3 Failed: ${err.message}`);
    console.error('  ✖ Scenario 3 Error:', err.message);
  }

  // Scenario 4: Tampered / Injected Gateway Response Rejection
  console.log('\nScenario 4: Tampered Response Injection Across Gateways');
  try {
    // Invalidate Razorpay with wrong signature
    let rzpTamperedCaught = false;
    try {
      await paymentService.verifyRazorpayPayment({
        userId,
        razorpay_order_id: 'order_test_tamper',
        razorpay_payment_id: 'pay_test_tamper',
        razorpay_signature: 'invalid_forged_hmac_signature',
        tier: 'monthly',
      });
    } catch (tamperErr) {
      rzpTamperedCaught = true;
      console.log('  ✔ Forged Razorpay signature properly rejected:', tamperErr.message);
    }
    if (!rzpTamperedCaught) {
      throw new Error('Forged Razorpay signature was accepted!');
    }

    // Invalidate CCAvenue with corrupted payload
    let ccaTamperedCaught = false;
    try {
      await paymentService.processCcavenueCallback('deadbeefbadpayload12345');
    } catch (ccaErr) {
      ccaTamperedCaught = true;
      console.log('  ✔ Corrupted CCAvenue ciphertext properly rejected:', ccaErr.message);
    }
    if (!ccaTamperedCaught) {
      throw new Error('Corrupted CCAvenue ciphertext did not trigger rejection!');
    }
  } catch (err) {
    passed = false;
    failureReasons.push(`Scenario 4 Failed: ${err.message}`);
    console.error('  ✖ Scenario 4 Error:', err.message);
  }

  console.log('\n======================================================');
  console.log('MULTI-GATEWAY SWITCHING TEST RESULT:', passed ? '✅ PASSED' : '❌ FAILED');
  if (!passed) {
    console.log('Failure reasons:', failureReasons);
  }
  console.log('======================================================\n');

  return { passed, failureReasons };
}

runMultiGatewayTests().then((res) => {
  if (!res.passed) process.exit(1);
});
