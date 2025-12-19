import express from "express";
import { index, list } from "../controllers/pharmacyController.js";
import protect from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

/* ======================================================
   PHARMACY ROUTES
====================================================== */

// Base pharmacy view
router.get(
  "/",
  protect,
  authorize("pharmacy", "read"),
  index
);

// List medicines / prescriptions
router.get(
  "/list",
  protect,
  authorize("pharmacy", "read"),
  list
);

// 📊 Pharmacy dashboard (KPIs)
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

export default router;
