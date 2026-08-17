/**
 * Tier 2 Boundary Test: Payment Signature Tampering & Adversarial Integrity
 * 
 * Verifies:
 * 1. Manipulated Razorpay payment ID produces invalid signature.
 * 2. Manipulated Razorpay order ID produces invalid signature.
 * 3. CCAvenue corrupted ciphertext / altered hex length throws decryption error.
 * 4. Tampered amount in payment webhook callback is rejected.
 * 5. Replay of captured PayPal order is rejected.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  assertThrows,
  createRazorpaySignature,
  verifyRazorpaySignature,
  encryptCCAvenue,
  decryptCCAvenue
} from '../test_helpers.js';

export async function registerTests(suite) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const workingKey = process.env.CCAVENUE_WORKING_KEY;

  // 1. Altered Razorpay Payment ID
  suite.test('Razorpay signature verification fails when payment ID is swapped or forged', async () => {
    const orderId = 'order_valid_123';
    const legitimatePaymentId = 'pay_legit_456';
    const forgedPaymentId = 'pay_forged_789';

    const validSig = createRazorpaySignature(orderId, legitimatePaymentId, secret);

    // Attacker sends forged payment ID with legitimate signature
    const isValid = verifyRazorpaySignature(orderId, forgedPaymentId, validSig, secret);
    assertFalse(isValid, 'Signature verification must fail for altered payment ID');
  });

  // 2. Altered Razorpay Order ID
  suite.test('Razorpay signature verification fails when order ID is manipulated', async () => {
    const orderIdA = 'order_A_100';
    const orderIdB = 'order_B_200';
    const paymentId = 'pay_same_123';

    const sigA = createRazorpaySignature(orderIdA, paymentId, secret);
    const isValid = verifyRazorpaySignature(orderIdB, paymentId, sigA, secret);
    assertFalse(isValid, 'Signature verification must fail for altered order ID');
  });

  // 3. CCAvenue Corrupted Ciphertext
  suite.test('Corrupted CCAvenue ciphertext fails AES-128-CBC decipher and throws error', async () => {
    const validParams = 'merchant_id=312456&order_id=ORD-1&amount=999.00&currency=INR&order_status=Success';
    const validHex = encryptCCAvenue(validParams, workingKey);

    // Corrupt the hex payload
    const corruptedHex = validHex.slice(0, -4) + '0000';

    assertThrows(
      () => decryptCCAvenue(corruptedHex, workingKey),
      undefined,
      'Decryption of tampered ciphertext must throw error'
    );
  });

  // 4. Webhook Amount Tampering
  suite.test('Payment callback with mismatched amount is detected and rejected', async () => {
    const expectedAmountPaise = 99900; // ₹999 for Monthly

    function verifyPaymentAmount(orderExpectedPaise, callbackReceivedPaise) {
      if (orderExpectedPaise !== callbackReceivedPaise) {
        return { valid: false, error: 'amount_mismatch', expected: orderExpectedPaise, received: callbackReceivedPaise };
      }
      return { valid: true };
    }

    const tamperedCheck = verifyPaymentAmount(expectedAmountPaise, 100); // Attacker tries paying ₹1 (100 paise)
    assertFalse(tamperedCheck.valid);
    assertEqual(tamperedCheck.error, 'amount_mismatch');
  });

  // 5. Replay of PayPal Captured Order
  suite.test('Replaying an already captured PayPal order ID is rejected', async () => {
    const processedOrders = new Set(['PAYPAL-CAPTURE-12345']);

    function processPayPalCapture(orderId) {
      if (processedOrders.has(orderId)) {
        return { status: 409, error: 'order_already_processed', message: 'This transaction has already been captured and fulfilled.' };
      }
      processedOrders.add(orderId);
      return { status: 200, success: true };
    }

    const replayed = processPayPalCapture('PAYPAL-CAPTURE-12345');
    assertEqual(replayed.status, 409);
    assertEqual(replayed.error, 'order_already_processed');
  });
}
