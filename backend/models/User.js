import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

/* ======================================================
   USER SCHEMA
====================================================== */
const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String },

    role: {
      type: String,
      enum: [
        "SuperAdmin",
        "HospitalAdmin",
        "Doctor",
        "Nurse",
        "LabTech",
        "Patient",
      ],
      required: true,
    },

    hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },

    countryId: { type: String },

    metadata: { type: Object, default: {} },

    refreshTokens: { type: [String], default: [] },

    active: { type: Boolean, default: true },

    // ✅ Email verification
    emailVerified: {
      type: Boolean,
      default: false,
    },

    // 🔐 2FA (Email OTP)
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    /* ==================================================
       🔐 TRUSTED DEVICES (STEP 1)
       - deviceId is hashed
       - lastUsed used later for expiry (Step 2)
    =================================================== */
    trustedDevices: [
      {
        deviceId: { type: String, required: true }, // hashed
        userAgent: { type: String },
        lastUsed: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
        verifiedAt: Date, // 🔐 when OTP was last confirmed
      },
    ],
  },
  { timestamps: true }
);

/* ======================================================
   PASSWORD HASH
====================================================== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

/* ======================================================
   PASSWORD COMPARE
====================================================== */
userSchema.methods.matchPassword = async function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

/* ======================================================
   MODEL EXPORT (HOT-RELOAD SAFE)
====================================================== */
const User = mongoose.models.User || model("User", userSchema);

export default User;
