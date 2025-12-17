import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt.js";

const router = express.Router();

/* ======================================================
   REGISTER (🔒 ROLE LOCKED)
====================================================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body; // 🔒 role REMOVED

    if (!email || !password || !name) {
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
      role: "Patient", // 🔒 HARD LOCK
    });

    await user.save();

    const safe = user.toObject();
    delete safe.password;

    res.status(201).json({ user: safe });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   LOGIN
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const accessToken = signAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      id: user._id,
    });

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,          // REQUIRED (HTTPS)
      sameSite: "none",      // REQUIRED (Vercel ↔ Render)
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    const safe = user.toObject();
    delete safe.password;

    res.json({
      accessToken,
      user: {
        id: safe._id,
        name: safe.name,
        email: safe.email,
        role: safe.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   REFRESH TOKEN (🔁 ENV FIXED)
====================================================== */
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ msg: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET); // ✅ FIXED
    } catch {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens?.includes(token)) {
      return res.status(401).json({ msg: "Refresh token revoked" });
    }

    user.refreshTokens = user.refreshTokens.filter(
      (t) => t !== token
    );

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
          user.refreshTokens = (user.refreshTokens || []).filter(
            (t) => t !== token
          );
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
