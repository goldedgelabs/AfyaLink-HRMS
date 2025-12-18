// routes/profileRoutes.js
import express from "express";
import { 
  getProfile, 
  updateProfile, 
  enable2FA, 
  disable2FA, 
  changePassword, 
  updateSecuritySettings 
} from "../controllers/profileController.js";
import { auth } from "../middleware/auth.js"; // your existing auth middleware

const router = express.Router();

// ==========================
// PROFILE ROUTES
// ==========================

// Get current user profile
router.get("/", auth, getProfile);

// Update profile info (name, email)
router.put("/", auth, updateProfile);

// Enable 2FA
router.post("/2fa/enable", auth, enable2FA);

// Disable 2FA (requires password)
router.post("/2fa/disable", auth, disable2FA);

// Change password
router.post("/password", auth, changePassword);

// Update security settings (e.g., notifications)
router.put("/security", auth, updateSecuritySettings);

export default router;
