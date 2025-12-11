import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import labRoutes from './routes/labRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import mlRoutes from './routes/mlRoutes.js';

// ✅ ADD M-PESA ROUTES
import mpesaRoutes from './routes/mpesa.routes.js';

import errorHandler from './middleware/errorHandler.js';

// Load and expand environment variables
const env = dotenv.config();
dotenvExpand.expand(env);

const app = express();
import './utils/logger.js'; // centralized logger (added by cleanup)

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ml', mlRoutes);

// ✅ M-PESA ROUTES
app.use('/api/payments/mpesa', mpesaRoutes);

// Root ping
app.get('/', (req, res) => res.send('AfyaLink HRMS Backend is running 🚀'));

// Error handler
app.use(errorHandler);

import analyticsRoutes from './routes/analyticsRoutes.js';
app.use('/api/analytics', analyticsRoutes);
import pharmacyRoutes from './routes/pharmacyRoutes.js';
app.use('/api/pharmacy', pharmacyRoutes);
import inventoryRoutes from './routes/inventoryRoutes.js';
app.use('/api/inventory', inventoryRoutes);
import appointments_adminRoutes from './routes/appointments_adminRoutes.js';
app.use('/api/appointments_admin', appointments_adminRoutes);
import billingRoutes from './routes/billingRoutes.js';
app.use('/api/billing', billingRoutes);
import reportsRoutes from './routes/reportsRoutes.js';
app.use('/api/reports', reportsRoutes);
import branchesRoutes from './routes/branchesRoutes.js';
app.use('/api/branches', branchesRoutes);
import ai_adminRoutes from './routes/ai_adminRoutes.js';
app.use('/api/ai_admin', ai_adminRoutes);


import paymentsRoutes from './routes/paymentsRoutes.js';
import aiRouter from './ai/aiRouter.js';

import './workers/notificationWorker.js';


import transactionsRoutes from './routes/transactionsRoutes.js';
app.use('/api/transactions', transactionsRoutes);
import stripeRoutes from './routes/stripeRoutes.js';
app.use('/api/payments/stripe', stripeRoutes);
import flutterwaveRoutes from './routes/flutterwaveRoutes.js';
app.use('/api/payments/flutterwave', flutterwaveRoutes);
import bedsRoutes from './routes/bedsRoutes.js';
app.use('/api/beds', bedsRoutes);
import triageRoutes from './routes/triageRoutes.js';
app.use('/api/triage', triageRoutes);

import connectorsRoutes from './routes/connectorsRoutes.js';
app.use('/api/connectors', connectorsRoutes);

export default app;
import paymentSettingsRoutes from './routes/paymentSettingsRoutes.js';
app.use('/api/payment-settings', paymentSettingsRoutes);

import webhookReceiverRoutes from './routes/webhookReceiverRoutes.js';
app.use('/api/webhooks', webhookReceiverRoutes);

import integrationWebhookRoutes from './routes/integrationWebhookRoutes.js';
app.use('/api/integrations/webhook', integrationWebhookRoutes);

import mappingRoutes from './routes/mappingRoutes.js';
app.use('/api/mappings', mappingRoutes);

import offlineRoutes from './routes/offlineRoutes.js';
app.use('/api/offline', offlineRoutes);
import dlqRoutes from './routes/dlqRoutes.js';
app.use('/api/integrations/dlq', dlqRoutes);

import dlqInspectRoutes from './routes/dlqInspectRoutes.js';
app.use('/api/integrations/dlq-inspect', dlqInspectRoutes);

import dlqAdminRoutes from './routes/dlqAdminRoutes.js';
app.use('/api/integrations/dlq-admin', dlqAdminRoutes);

import crdtRoutes from './routes/crdtRoutes.js';
app.use('/api/crdt', crdtRoutes);

import crdtApiRoutes from './routes/crdtApiRoutes.js';
app.use('/api/crdt-api', crdtApiRoutes);

import crdtChunkRoutes from './routes/crdtChunkRoutes.js';
app.use('/api/crdt', crdtChunkRoutes);

import signalingTokenRoutes from './routes/signalingTokenRoutes.js';
app.use('/api/signaling', signalingTokenRoutes);
