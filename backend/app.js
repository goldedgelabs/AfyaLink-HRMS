import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

// Load env
const env = dotenv.config();
dotenvExpand.expand(env);

import "./utils/logger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import financialRoutes from "./routes/financialRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import mpesaRoutes from "./routes/mpesa.routes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import appointmentsAdminRoutes from "./routes/appointments_adminRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import branchesRoutes from "./routes/branchesRoutes.js";
import aiAdminRoutes from "./routes/ai_adminRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import flutterwaveRoutes from "./routes/flutterwaveRoutes.js";
import bedsRoutes from "./routes/bedsRoutes.js";
import triageRoutes from "./routes/triageRoutes.js";
import connectorsRoutes from "./routes/connectorsRoutes.js";
import paymentSettingsRoutes from "./routes/paymentSettingsRoutes.js";
import webhookReceiverRoutes from "./routes/webhookReceiverRoutes.js";
import integrationWebhookRoutes from "./routes/integrationWebhookRoutes.js";
import mappingRoutes from "./routes/mappingRoutes.js";
import offlineRoutes from "./routes/offlineRoutes.js";
import dlqRoutes from "./routes/dlqRoutes.js";
import dlqInspectRoutes from "./routes/dlqInspectRoutes.js";
import dlqAdminRoutes from "./routes/dlqAdminRoutes.js";
import crdtRoutes from "./routes/crdtRoutes.js";
import crdtApiRoutes from "./routes/crdtApiRoutes.js";
import crdtChunkRoutes from "./routes/crdtChunkRoutes.js";
import signalingTokenRoutes from "./routes/signalingTokenRoutes.js";

import errorHandler from "./middleware/errorHandler.js";

// Workers
import "./workers/notificationWorker.js";

const app = express();

// =======================================================
// ✅ FINAL PRODUCTION CORS (RENDER + VERCEL SAFE)
// =======================================================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      if (origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }

      // TEMP SAFE FALLBACK (do not lock yet)
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =======================================================
// Core Middlewares
// =======================================================
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// =======================================================
// 🔐 AUTO-AUDIT FLAG (ALL MUTATIONS)
// =======================================================
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    req._audit = true;
  }
  next();
});

// =======================================================
// Routes
// =======================================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/hospitals", hospitalRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/financials", financialRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ml", mlRoutes);

// Payments
app.use("/api/payments/mpesa", mpesaRoutes);
app.use("/api/payments/stripe", stripeRoutes);
app.use("/api/payments/flutterwave", flutterwaveRoutes);
app.use("/api/payment-settings", paymentSettingsRoutes);

// Admin / Core
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/appointments_admin", appointmentsAdminRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/ai_admin", aiAdminRoutes);
app.use("/api/transactions", transactionsRoutes);

// Clinical
app.use("/api/beds", bedsRoutes);
app.use("/api/triage", triageRoutes);

// Integrations
app.use("/api/connectors", connectorsRoutes);
app.use("/api/webhooks", webhookReceiverRoutes);
app.use("/api/integrations/webhook", integrationWebhookRoutes);
app.use("/api/integrations/dlq", dlqRoutes);
app.use("/api/integrations/dlq-inspect", dlqInspectRoutes);
app.use("/api/integrations/dlq-admin", dlqAdminRoutes);

// CRDT
app.use("/api/crdt", crdtRoutes);
app.use("/api/crdt-api", crdtApiRoutes);
app.use("/api/crdt/chunks", crdtChunkRoutes);

// Signaling
app.use("/api/signaling", signalingTokenRoutes);

// =======================================================
// Health Check
// =======================================================
app.get("/", (req, res) => {
  res.send("AfyaLink HRMS Backend is running 🚀");
});

// =======================================================
// Error Handler (LAST — DO NOT MOVE)
// =======================================================
app.use(errorHandler);

export default app;
