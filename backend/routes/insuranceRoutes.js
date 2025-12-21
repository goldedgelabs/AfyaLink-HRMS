import express from "express";
import { shaPreauthorize } from "../controllers/insuranceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * INSURANCE ROUTES — READ/WRITE
 */

router.post(
  "/sha/preauth",
  requireAuth,
  shaPreauthorize
);

export default router;
