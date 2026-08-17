require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const assert = require('assert');
const crypto = require('crypto');
const paymentService = require('../src/services/paymentService');

async function runPaymentTests() {
  console.log('--- Starting Payment Service & Cryptography Tests ---');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✔ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✖ ${name}:`, err.message);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✔ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✖ ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Pricing & Quota Structure
  test('PRICING contains exact INR paise and USD cents definitions', () => {
    assert.strictEqual(paymentService.PRICING.INR.monthly.amountCents, 99900);
    assert.strictEqual(paymentService.PRICING.INR.annual.amountCents, 799900);
    assert.strictEqual(paymentService.PRICING.USD.monthly.amountCents, 1200);
    assert.strictEqual(paymentService.PRICING.USD.annual.amountCents, 9500);

    assert.strictEqual(paymentService.PRICING.INR.free.pdfQuota, 0);
    assert.strictEqual(paymentService.PRICING.INR.monthly.pdfQuota, 5);
    assert.strictEqual(paymentService.PRICING.INR.annual.pdfQuota, -1);
  });

  // 2. Razorpay HMAC-SHA256 Signature Verification
  test('Razorpay HMAC-SHA256 signature verification authenticates genuine payloads', () => {
    const orderId = 'order_test_987654';
    const paymentId = 'pay_test_123456';
    const secret = paymentService.CONFIG.razorpay.keySecret;

    const signature = paymentService.computeRazorpaySignature(orderId, paymentId, secret);
    assert.strictEqual(typeof signature, 'string');
    assert.strictEqual(signature.length, 64);

    const expectedSig = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
    assert.strictEqual(signature, expectedSig);
  });

  test('Razorpay signature detects swapped or manipulated order/payment IDs', () => {
    const orderId = 'order_test_987654';
    const paymentId = 'pay_test_123456';
    const secret = paymentService.CONFIG.razorpay.keySecret;
    const genuineSig = paymentService.computeRazorpaySignature(orderId, paymentId, secret);

    const tamperedSig = paymentService.computeRazorpaySignature('order_tampered_000', paymentId, secret);
    assert.notStrictEqual(genuineSig, tamperedSig);

    const tamperedPaySig = paymentService.computeRazorpaySignature(orderId, 'pay_forged_999', secret);
    assert.notStrictEqual(genuineSig, tamperedPaySig);
  });

  // 3. CCAvenue AES-128-CBC Encryption & Decryption
  test('CCAvenue AES-128-CBC encrypts and decrypts with 100% fidelity', () => {
    const workingKey = paymentService.CONFIG.ccavenue.workingKey;
    const plainParams = 'merchant_id=2158490&order_id=CCA_123456_999&amount=999.00&currency=INR&order_status=Success&merchant_param1=usr-uuid-test&merchant_param2=monthly';

    const encHex = paymentService.encryptCcavenue(plainParams, workingKey);
    assert.strictEqual(typeof encHex, 'string');
    assert.ok(encHex.length > 0);

    const decrypted = paymentService.decryptCcavenue(encHex, workingKey);
    assert.strictEqual(decrypted, plainParams);
  });

  test('CCAvenue encryption rejects corrupted or invalid ciphertext hex', () => {
    const workingKey = paymentService.CONFIG.ccavenue.workingKey;
    assert.throws(() => {
      paymentService.decryptCcavenue('corrupted_not_hex_ciphertext', workingKey);
    });
  });

  // 4. Public Config Endpoint Contract
  test('getPublicConfig returns public keys for Razorpay, CCAvenue, and PayPal without secrets', () => {
    const config = paymentService.getPublicConfig();
    assert.ok(config.gateways.razorpay.keyId);
    assert.ok(config.gateways.ccavenue.accessCode);
    assert.ok(config.gateways.paypal.clientId);

    // Ensure secrets are NOT leaked in public configuration
    assert.strictEqual(config.gateways.razorpay.keySecret, undefined);
    assert.strictEqual(config.gateways.ccavenue.workingKey, undefined);
    assert.strictEqual(config.gateways.paypal.clientSecret, undefined);

    assert.strictEqual(config.pricing.INR.monthly, 999);
    assert.strictEqual(config.pricing.INR.annual, 7999);
    assert.strictEqual(config.pricing.USD.monthly, 12);
    assert.strictEqual(config.pricing.USD.annual, 95);
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPaymentTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
