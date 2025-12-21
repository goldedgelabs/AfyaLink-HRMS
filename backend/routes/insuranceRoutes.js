import express from "express";
import { requestNhifAuthorization } from "../controllers/insuranceController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/nhif/preauth",
  requireAuth,
  requireRole("billing"),
  requestNhifAuthorization
);

export default router;
