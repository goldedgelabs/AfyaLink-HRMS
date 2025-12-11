import express from "express";
const router = express.Router();

import mpesa from "../payments/mpesa.js";
import stripe from "../payments/stripe.js";
import flutter from "../payments/flutterwave.js";

// Helper: unified response handler
const safe = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json({ ok: true, data: result });
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({
      ok: false,
      error: err.message || "Payment processing failed"
    });
  }
};

/**
 * ------------------------------
 *     M-PESA (Kenya)
 * ------------------------------
 */
router.post(
  "/mpesa/stk",
  safe(async (req) => {
    const { phone, amount } = req.body;
    return await mpesa.initiateSTK(phone, amount);
  })
);

/**
 * ------------------------------
 *     STRIPE (Global)
 * ------------------------------
 */
router.post(
  "/stripe/create-intent",
  safe(async (req) => {
    const { amount, currency = "usd" } = req.body;
    return await stripe.createPaymentIntent(amount, currency);
  })
);

/**
 * ------------------------------
 *     FLUTTERWAVE (Africa/Global)
 * ------------------------------
 */
router.post(
  "/flutter/init",
  safe(async (req) => {
    return await flutter.initiatePayment(req.body);
  })
);

export default router;
