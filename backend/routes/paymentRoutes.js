
const express = require('express');
const router = express.Router();
const mpesa = require('../payments/mpesa');
const stripe = require('../payments/stripe');
const flutter = require('../payments/flutterwave');

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

module.exports = router;
