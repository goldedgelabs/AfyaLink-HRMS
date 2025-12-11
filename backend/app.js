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

export default app;
