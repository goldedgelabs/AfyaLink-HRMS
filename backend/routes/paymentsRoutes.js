import express from 'express';
import { createStripePaymentIntent, mpesaStkPush, flutterwaveCharge, listTransactions, generateInvoice } from '../controllers/paymentsController.js';
const router = express.Router();

router.post('/stripe/create-payment-intent', createStripePaymentIntent);
router.post('/mpesa/stk', mpesaStkPush);
router.post('/flutterwave/charge', flutterwaveCharge);
router.get('/transactions', listTransactions);
router.post('/invoice', generateInvoice);

export default router;
