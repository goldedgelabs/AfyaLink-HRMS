import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { sendEmail } from "../utils/mailer.js";

/* ======================================================
   REGISTER (EMAIL VERIFICATION ENABLED)
====================================================== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "Patient",
      emailVerified: false,
    });

    // 🔐 Email verification token
    const token = crypto.randomBytes(32).toString("hex");

    await redis.set(`verify:${token}`, user._id.toString(), {
      ex: 60 * 60 * 24, // 24h
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your AfyaLink account",
      html: `
        <h2>Welcome to AfyaLink</h2>
        <p>Please verify your email:</p>
        <a href="${verifyLink}">${verifyLink}</a>
      `,
    });

    res.status(201).json({
      msg: "Registration successful. Check your email to verify your account.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ======================================================
   LOGIN
====================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        msg: "Please verify your email before logging in",
      });
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

    // 🍪 Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,          // REQUIRED on Render
      sameSite: "none",      // REQUIRED cross-site
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
};

/* ======================================================
   REFRESH TOKEN
====================================================== */
export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ msg: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens?.includes(token)) {
      return res.status(401).json({ msg: "Refresh token revoked" });
    }

    // 🔁 Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);

    const newRefreshToken = signRefreshToken({ id: user._id });
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
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
};

/* ======================================================
   LOGOUT
====================================================== */
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(
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
};
/* ======================================================
   🔐 CHANGE PASSWORD (AUTH REQUIRED)
   SAFE • ISOLATED • NO TOKEN TOUCH
====================================================== */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // 🔎 Explicitly select password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect" });
    }

    // 🔐 Re-hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ======================================================
   SEND 2FA OTP (EMAIL)
====================================================== */
export const send2FAOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ msg: "2FA is not enabled" });
    }

    // 🔐 Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // ⏱ Store OTP in Redis (5 minutes)
    await redis.set(`2fa:${userId}`, otp, {
      ex: 60 * 5,
    });

    // 📧 Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Your AfyaLink security code",
      html: `
        <h2>Security Verification</h2>
        <p>Your one-time code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error("Send 2FA OTP error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

