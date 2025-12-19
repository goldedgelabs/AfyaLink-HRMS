import express from "express";
import auth from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import AuditLog from "../models/AuditLog.js";

const router = express.Router();

/**
 * GET /api/audit
 * Filters: actorId, action, resource, from, to
 */
router.get(
  "/",
  auth,
  authorize("audit", "read"),
  async (req, res) => {
    const {
      actorId,
      action,
      resource,
      from,
      to,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (actorId) filter.actorId = actorId;
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // 🔐 Hospital isolation
    if (req.user.role !== "SUPER_ADMIN") {
      filter.hospital = req.user.hospitalId;
    }

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("actorId", "name email");

    const total = await AuditLog.countDocuments(filter);

    res.json({
      data: logs,
      total,
      page: Number(page),
    });
  }
);

export default router;
