import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/* ======================================================
   TOKEN HELPERS
====================================================== */

function createAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: process.env.JWT_EXP || "15m" }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET || "refresh_secret",
    { expiresIn: process.env.REFRESH_EXP || "7d" }
  );
}

/* ======================================================
   REGISTER
====================================================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
      role: role || "Patient",
    });

    await user.save();

    const safe = user.toObject();
    delete safe.password;

    res.json({ user: safe });
  } catch (err) {
    console.error(err);
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

    const token = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    // HttpOnly refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safe = user.toObject();
    delete safe.password;

    // 🔑 FRONTEND EXPECTS THIS SHAPE
    res.json({
      token,
      user: {
        id: safe._id,
        name: safe.name,
        email: safe.email,
        role: safe.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   REFRESH TOKEN
====================================================== */
router.post("/refresh", async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ msg: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.REFRESH_SECRET || "refresh_secret"
      );
    } catch {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens?.includes(token)) {
      return res.status(401).json({ msg: "Refresh token revoked" });
    }

    // rotate refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t !== token);
    const newRefresh = createRefreshToken(user);
    user.refreshTokens.push(newRefresh);
    await user.save();

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const newAccessToken = createAccessToken(user);

    res.json({ token: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ======================================================
   LOGOUT
====================================================== */
router.post("/logout", async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);
      if (decoded) {
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshTokens = (user.refreshTokens || []).filter(
            t => t !== token
          );
          await user.save();
        }
      }
    }

    res.clearCookie("refreshToken", {
      path: "/api/auth/refresh",
    });

    res.json({ msg: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
