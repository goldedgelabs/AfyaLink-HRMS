
import express from 'express';
const router = express.Router();
import mpesa from '../payments/mpesa.js';
import stripe from '../payments/stripe.js';
import flutter from '../payments/flutterwave.js';

router.post('/mpesa/stk', async (req, res) => {
  const { phone, amount } = req.body;
  const out = await mpesa.initiateSTK(phone, amount);
  res.json(out);
});

router.post('/stripe/create', async (req, res) => {
  const { amount } = req.body;
  const out = await stripe.createPaymentIntent(amount);
  res.json(out);
});

router.post('/flutter/init', async (req, res) => {
  const out = await flutter.initiatePayment(req.body);
  res.json(out);
});

export default router;
