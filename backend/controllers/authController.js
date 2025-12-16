import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validateEmail } from "../utils/validator.js";

dotenv.config();

/* =========================================
   JWT HELPERS
========================================= */
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

/* =========================================
   REGISTER
========================================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, hospital } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid email address" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "Patient",
      hospital,
    });

    const token = signToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* =========================================
   LOGIN
========================================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
