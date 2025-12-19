import express from "express";
import {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import auth from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { audit } from "../middleware/audit.js";

const router = express.Router();

/* ======================================================
   APPOINTMENTS — RBAC + ABAC + AUDIT
====================================================== */

/**
 * CREATE appointment
 * - Patient (own)
 * - Doctor / Hospital Admin (hospital-scoped)
 */
router.post(
  "/",
  auth,
  authorize("appointments", "create"),
  audit("APPOINTMENT_CREATE"),
  createAppointment
);

/**
 * LIST appointments
 * - Scoped by role automatically in controller
 */
router.get(
  "/",
  auth,
  authorize("appointments", "read"),
  listAppointments
);

/**
 * GET single appointment
 * - Ownership / hospital enforced
 */
router.get(
  "/:id",
  auth,
  authorize("appointments", "read"),
  getAppointment
);

/**
 * UPDATE appointment
 * - Doctor / Hospital Admin only
 */
router.patch(
  "/:id",
  auth,
  authorize("appointments", "update"),
  audit("APPOINTMENT_UPDATE"),
  updateAppointment
);

/**
 * DELETE appointment
 * - Strongly restricted
 */
router.delete(
  "/:id",
  auth,
  authorize("appointments", "delete"),
  audit("APPOINTMENT_DELETE"),
  deleteAppointment
);

export default router;
