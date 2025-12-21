import express from "express";
import { replayWorkflow } from "../controllers/workflowReplayController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:encounterId/replay",
  requireAuth,
  requireRole("admin"),
  replayWorkflow
);

export default router;
