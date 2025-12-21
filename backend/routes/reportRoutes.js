import express from "express";
import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  getReports,
  getReportById,
  exportMedicalReport,
  revenueSummary,
} from "../controllers/reportController.js";

const router = express.Router();

/**
 * 🔐 All report routes require authentication
 */
router.use(authenticate);

/**
 * 📊 General reports
 */
router.get(
  "/",
  authorize(["hospitaladmin", "doctor"]),
  getReports
);

router.get(
  "/:id",
  authorize(["hospitaladmin", "doctor"]),
  getReportById
);

/**
 * 🧾 Medical-Legal / Clinical Report Export (PDF)
 */
router.get(
  "/medical/:encounterId",
  authorize(["hospitaladmin", "doctor"]),
  exportMedicalReport
);

/**
 * 💰 Revenue Summary
 */
router.get(
  "/revenue",
  authorize(["hospitaladmin"]),
  revenueSummary
);

export default router;
