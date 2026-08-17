/**
 * STATIQONE Payment & Subscription API Routes
 * Endpoints for Tiered Subscriptions (Requirement R4):
 * - GET  /api/payments/config              : Public Gateway IDs & Tier Pricing
 * - POST /api/payments/razorpay/create-order: Creates INR Razorpay Order
 * - POST /api/payments/razorpay/verify     : Verifies HMAC signature & upgrades tier
 * - POST /api/payments/ccavenue/initiate   : Generates encrypted params for CCAvenue checkout
 * - POST /api/payments/ccavenue/callback   : Decrypts CCAvenue response & upgrades tier
 * - POST /api/payments/paypal/create-order : Creates USD PayPal v2 Order
 * - POST /api/payments/paypal/capture      : Captures PayPal payment & upgrades tier
 * - GET  /api/payments/subscription-status : Active subscription status & PDF quota
 * - POST /api/payments/webhook/*           : External Gateway Webhooks
 */

const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { verifyAccessToken, ACCESS_COOKIE } = require('../utils/tokens');

/**
 * Authentication extractor middleware that checks httpOnly cookie or Authorization Bearer header.
 */
function requirePaymentAuth(req, res, next) {
  let token = req.cookies ? req.cookies[ACCESS_COOKIE] : null;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      error: 'not_authenticated',
      message: 'Authentication is required to perform payment and subscription actions.',
    });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'token_expired',
        message: 'Session has expired. Please refresh your access token.',
      });
    }
    return res.status(401).json({
      error: 'invalid_token',
      message: 'Invalid authentication token provided.',
    });
  }
}

/**
 * Helper to determine frontend application origin for browser redirects.
 */
function getAppOrigin(req) {
  return process.env.APP_ORIGIN || (req ? `${req.protocol}://${req.get('host')}` : 'http://localhost:3000');
}

// ==============================================================================
// 1. Public Configuration & Pricing Info
// ==============================================================================

/**
 * GET /api/payments/config
 * Returns public gateway IDs (Razorpay key, CCAvenue access code, PayPal client ID) and pricing.
 */
router.get('/config', (req, res) => {
  const config = paymentService.getPublicConfig();
  return res.json(config);
});

// ==============================================================================
// 2. Subscription Status & Quota Details
// ==============================================================================

/**
 * GET /api/payments/subscription-status
 * Returns current user tier, active subscription, PDF quota status, and recent transactions.
 */
router.get('/subscription-status', requirePaymentAuth, async (req, res, next) => {
  try {
    const status = await paymentService.getUserSubscriptionStatus(req.user.id);
    return res.json(status);
  } catch (err) {
    return next(err);
  }
});

// ==============================================================================
// 3. Razorpay Endpoints (INR Primary)
// ==============================================================================

/**
 * POST /api/payments/razorpay/create-order
 * Creates an INR Razorpay order for 'monthly' or 'annual' tier.
 */
router.post('/razorpay/create-order', requirePaymentAuth, async (req, res, next) => {
  try {
    const { tier } = req.body || {};
    if (!tier || !['monthly', 'annual'].includes(tier)) {
      return res.status(400).json({
        error: 'invalid_tier',
        message: "Invalid subscription tier. Please choose 'monthly' or 'annual'.",
      });
    }

    const orderData = await paymentService.createRazorpayOrder({
      userId: req.user.id,
      tier,
    });

    return res.json(orderData);
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/payments/razorpay/verify
 * Validates HMAC-SHA256 signature and upgrades user to target subscription tier.
 */
router.post('/razorpay/verify', requirePaymentAuth, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'missing_parameters',
        message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
      });
    }

    const result = await paymentService.verifyRazorpayPayment({
      userId: req.user.id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tier,
    });

    return res.json(result);
  } catch (err) {
    if (err.message.includes('signature')) {
      return res.status(400).json({ error: 'invalid_signature', message: err.message });
    }
    return next(err);
  }
});

// ==============================================================================
// 4. CCAvenue Endpoints (INR Alternative)
// ==============================================================================

/**
 * POST /api/payments/ccavenue/initiate
 * Returns encrypted payload (encRequest) and action URL for CCAvenue redirect.
 */
router.post('/ccavenue/initiate', requirePaymentAuth, async (req, res, next) => {
  try {
    const { tier, redirectUrl, cancelUrl } = req.body || {};

    if (!tier || !['monthly', 'annual'].includes(tier)) {
      return res.status(400).json({
        error: 'invalid_tier',
        message: "Invalid subscription tier. Please choose 'monthly' or 'annual'.",
      });
    }

    const origin = getAppOrigin(req);
    const resolvedRedirectUrl = redirectUrl || `${origin}/api/payments/ccavenue/callback`;
    const resolvedCancelUrl = cancelUrl || `${origin}/pricing`;

    const checkoutData = await paymentService.initiateCcavenuePayment({
      userId: req.user.id,
      tier,
      redirectUrl: resolvedRedirectUrl,
      cancelUrl: resolvedCancelUrl,
    });

    return res.json(checkoutData);
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/payments/ccavenue/callback
 * External gateway return handler (POSTed by CCAvenue).
 * Decrypts encResp, updates database tier, and redirects or returns JSON.
 */
router.post('/ccavenue/callback', express.urlencoded({ extended: true }), async (req, res, next) => {
  try {
    const encResp = req.body?.encResp || req.query?.encResp;

    if (!encResp) {
      const origin = getAppOrigin(req);
      return res.redirect(`${origin}/pricing?error=missing_ccavenue_response`);
    }

    const result = await paymentService.processCcavenueCallback(encResp);
    const origin = getAppOrigin(req);

    // If request accepts HTML (standard browser redirect flow from CCAvenue)
    if (req.accepts('html') && !req.xhr && !req.headers['x-requested-with']) {
      if (result.success) {
        return res.redirect(`${origin}/dashboard?payment=success&gateway=ccavenue&tier=${result.tier}`);
      } else {
        return res.redirect(`${origin}/pricing?payment=failed&gateway=ccavenue&error=${encodeURIComponent(result.error || 'Payment failed')}`);
      }
    }

    // Otherwise return JSON response
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

// ==============================================================================
// 5. PayPal Endpoints (USD International)
// ==============================================================================

/**
 * POST /api/payments/paypal/create-order
 * Creates a USD PayPal v2 Checkout Order.
 */
router.post('/paypal/create-order', requirePaymentAuth, async (req, res, next) => {
  try {
    const { tier } = req.body || {};

    if (!tier || !['monthly', 'annual'].includes(tier)) {
      return res.status(400).json({
        error: 'invalid_tier',
        message: "Invalid subscription tier. Please choose 'monthly' or 'annual'.",
      });
    }

    const orderData = await paymentService.createPaypalOrder({
      userId: req.user.id,
      tier,
    });

    return res.json(orderData);
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/payments/paypal/capture & POST /api/payments/paypal/capture-order
 * Captures PayPal order and updates user subscription to 'monthly' or 'annual'.
 */
const handlePaypalCapture = async (req, res, next) => {
  try {
    const { orderId, orderID, tier } = req.body || {};
    const targetOrderId = orderId || orderID;

    if (!targetOrderId) {
      return res.status(400).json({
        error: 'missing_order_id',
        message: 'orderId is required to capture PayPal payment.',
      });
    }

    const result = await paymentService.capturePaypalOrder({
      userId: req.user.id,
      orderId: targetOrderId,
      tier,
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

router.post('/paypal/capture', requirePaymentAuth, handlePaypalCapture);
router.post('/paypal/capture-order', requirePaymentAuth, handlePaypalCapture);

// ==============================================================================
// 6. External Webhooks
// ==============================================================================

/**
 * POST /api/payments/razorpay/webhook
 */
router.post('/razorpay/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const event = req.body?.event;

    // Handle payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body?.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};
      const userId = notes.userId;
      const tier = notes.tier || 'monthly';

      if (userId) {
        await paymentService.upgradeUserSubscription({
          userId,
          tier,
          gateway: 'razorpay',
          gatewayOrderId: paymentEntity.order_id,
          gatewayPaymentId: paymentEntity.id,
          gatewaySignature: signature,
          amountCents: paymentEntity.amount,
          currency: paymentEntity.currency || 'INR',
          metadata: { webhookEvent: event },
        });
      }
    }

    return res.json({ status: 'ok', received: true });
  } catch (err) {
    console.error('Razorpay webhook processing error:', err.message);
    return res.status(500).json({ error: 'webhook_failed', message: err.message });
  }
});

/**
 * POST /api/payments/paypal/webhook
 */
router.post('/paypal/webhook', async (req, res) => {
  try {
    const eventType = req.body?.event_type;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = req.body?.resource;
      const customId = resource?.custom_id;

      if (customId) {
        try {
          const parsed = JSON.parse(customId);
          if (parsed.userId && parsed.tier) {
            await paymentService.upgradeUserSubscription({
              userId: parsed.userId,
              tier: parsed.tier,
              gateway: 'paypal',
              gatewayOrderId: resource.id,
              gatewayPaymentId: resource.id,
              amountCents: Math.round(parseFloat(resource.amount?.value || '0') * 100),
              currency: resource.amount?.currency_code || 'USD',
              metadata: { webhookEvent: eventType },
            });
          }
        } catch {}
      }
    }

    return res.json({ status: 'ok', received: true });
  } catch (err) {
    console.error('PayPal webhook processing error:', err.message);
    return res.status(500).json({ error: 'webhook_failed', message: err.message });
  }
});

module.exports = router;
