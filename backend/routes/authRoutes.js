import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { sendEmail } from "../utils/mailer.js";

// ✅ ADD THESE TWO IMPORTS
import { changePassword } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ======================================================
   REGISTER (EMAIL VERIFICATION)
====================================================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const user = new User({
      name,
      email,
      password,
      role: "Patient",
      emailVerified: false,
    });

    await user.save();

    const token = crypto.randomBytes(32).toString("hex");
    await redis.set(`verify:${token}`, user._id.toString(), {
      ex: 60 * 60 * 24,
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your AfyaLink account",
      html: `
        <h2>Welcome to AfyaLink HRMS</h2>
        <p>Please verify your email:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    res.status(201).json({
      msg: "Registration successful. Check your email to verify your account.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   RESEND VERIFICATION EMAIL
====================================================== */
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.emailVerified) {
      return res.status(400).json({ msg: "Email already verified" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await redis.set(`verify:${token}`, user._id.toString(), {
      ex: 60 * 60 * 24,
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your AfyaLink account",
      html: `<a href="${verifyLink}">${verifyLink}</a>`,
    });

    res.json({ msg: "Verification email resent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   VERIFY EMAIL
====================================================== */
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Invalid link");

    const userId = await redis.get(`verify:${token}`);
    if (!userId) return res.status(400).send("Link expired");

    await User.findByIdAndUpdate(userId, { emailVerified: true });
    await redis.del(`verify:${token}`);

    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).send("Server error");
  }
});

/* ======================================================
   FORGOT PASSWORD
====================================================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        msg: "If the email exists, a reset link was sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await redis.set(`reset:${token}`, user._id.toString(), {
      ex: 60 * 15,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your AfyaLink password",
      html: `<a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ msg: "If the email exists, a reset link was sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   RESET PASSWORD
====================================================== */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ msg: "Invalid request" });
    }

    const userId = await redis.get(`reset:${token}`);
    if (!userId) return res.status(400).json({ msg: "Token expired" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: "User not found" });

    user.password = password;
    await user.save();
    await redis.del(`reset:${token}`);

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   🔐 CHANGE PASSWORD (AUTH REQUIRED)  ✅ NEW
====================================================== */
router.post("/change-password", auth, changePassword);

/* ======================================================
   LOGIN
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.emailVerified) {
      return res.status(403).json({ msg: "Verify your email first" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = signAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ id: user._id });

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   REFRESH TOKEN
====================================================== */
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ msg: "No refresh token" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(401).json({ msg: "Token revoked" });
    }

    user.refreshTokens = user.refreshTokens.filter(t => t !== token);

    const newRefresh = signRefreshToken({ id: user._id });
    user.refreshTokens.push(newRefresh);
    await user.save();

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    const newAccessToken = signAccessToken({
      id: user._id,
      role: user.role,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   LOGOUT
====================================================== */
router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(t => t !== token);
          await user.save();
        }
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ msg: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
