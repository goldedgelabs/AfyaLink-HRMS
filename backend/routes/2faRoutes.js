import express from "express";
import authMiddleware from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// 🔐 Get 2FA status
router.get("/status", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("twoFactorEnabled");
  res.json({ enabled: user.twoFactorEnabled });
});

// 🔁 Toggle 2FA
router.post("/toggle", authMiddleware, async (req, res) => {
  const { enabled } = req.body;

  const user = await User.findById(req.user.id);
  user.twoFactorEnabled = enabled;
  await user.save();

  res.json({ enabled });
});

export default router;
