import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { sendEmail } from "../utils/mailer.js";

/* ======================================================
   HELPERS — TRUSTED DEVICE
====================================================== */
function getDeviceId(req) {
  const raw =
    req.headers["x-device-id"] ||
    req.headers["user-agent"] ||
    "unknown-device";

  return crypto.createHash("sha256").update(raw).digest("hex");
}

/* ======================================================
   LOGIN (2FA + TRUSTED DEVICE AWARE)
====================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.emailVerified) {
      return res.status(403).json({
        msg: "Please verify your email before logging in",
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    /* -----------------------------------------------
       🔐 TRUSTED DEVICE CHECK
    ------------------------------------------------ */
    const deviceId = getDeviceId(req);
    const trusted = user.trustedDevices?.find(
      (d) => d.deviceId === deviceId
    );

    if (trusted) {
      trusted.lastUsed = new Date();
      await user.save();

      // ✅ SKIP OTP
      const accessToken = signAccessToken({
        id: user._id,
        role: user.role,
        twoFactorVerified: true,
      });

      const refreshToken = signRefreshToken({ id: user._id });
      user.refreshTokens.push(refreshToken);
      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    /* -----------------------------------------------
       🔐 2FA REQUIRED (UNTRUSTED DEVICE)
    ------------------------------------------------ */
    if (user.twoFactorEnabled) {
      const otp = crypto.randomInt(100000, 999999).toString();

      await redis.set(`2fa:${user._id}`, otp, { ex: 300 });

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

      return res.json({
        requires2FA: true,
        userId: user._id,
        message: "OTP sent to your email",
      });
    }

    /* -----------------------------------------------
       ✅ NORMAL LOGIN (2FA OFF)
    ------------------------------------------------ */
    const accessToken = signAccessToken({
      id: user._id,
      role: user.role,
      twoFactorVerified: true,
    });

    const refreshToken = signRefreshToken({ id: user._id });
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
};

/* ======================================================
   VERIFY 2FA OTP → TRUST DEVICE + ISSUE TOKEN
====================================================== */
export const verify2FAOtp = async (req, res) => {
  try {
    const { userId, otp, rememberDevice } = req.body;

    const storedOtp = await redis.get(`2fa:${userId}`);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    await redis.del(`2fa:${userId}`);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    /* -----------------------------------------------
       🔐 REGISTER TRUSTED DEVICE
    ------------------------------------------------ */
    if (rememberDevice) {
      const deviceId = getDeviceId(req);

      const exists = user.trustedDevices.some(
        (d) => d.deviceId === deviceId
      );

      if (!exists) {
        user.trustedDevices.push({
          deviceId,
          userAgent: req.headers["user-agent"],
          lastUsed: new Date(),
        });

        await user.save();
      }
    }

    const accessToken = signAccessToken({
      id: user._id,
      role: user.role,
      twoFactorVerified: true,
    });

    res.json({
      accessToken,
      msg: "2FA verification successful",
    });
  } catch (err) {
    console.error("Verify 2FA error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
