import express from "express";
import {
  index,
  list,
  createPrescription,
  dispenseMedication,
} from "../controllers/pharmacyController.js";
import protect from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

/* ======================================================
   PHARMACY ROUTES (WORKFLOW ENFORCED)
====================================================== */

/**
 * Base pharmacy view
 * Read-only
 */
router.get(
  "/",
  protect,
  authorize("pharmacy", "read"),
  index
);

/**
 * List medicines / prescriptions
 * Read-only
 */
router.get(
  "/list",
  protect,
  authorize("pharmacy", "read"),
  list
);

/**
 * 📊 Pharmacy dashboard (KPIs)
 * Read-only
 */
router.get(
  "/dashboard",
  protect,
  authorize("pharmacy", "read"),
  async (req, res) => {
    res.json({
      pendingPrescriptions: 12,
      dispensedToday: 7,
      lowStock: 3,
      totalMedicines: 142,
    });
  }
);

/* ======================================================
   🔒 WORKFLOW MUTATIONS (STRICT)
====================================================== */

/**
 * CREATE PRESCRIPTION
 * State: LAB_COMPLETED → PRESCRIPTION_CREATED
 * Role: doctor
 */
router.post(
  "/prescriptions",
  protect,
  authorize("doctor", "write"),
  createPrescription
);

/**
 * DISPENSE MEDICATION
 * State: PRESCRIPTION_CREATED → DISPENSED
 * Role: pharmacy
 * Insurance: REQUIRED
 */
router.post(
  "/dispense",
  protect,
  authorize("pharmacy", "write"),
  dispenseMedication
);

export default router;
