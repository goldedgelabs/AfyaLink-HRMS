import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

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
        "Patient"
      ],
      required: true
    },

    hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },

    countryId: { type: String },

    metadata: { type: Object, default: {} },

    refreshTokens: { type: [String], default: [] },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 🔐 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// 🔐 Compare password
userSchema.methods.matchPassword = async function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

// 🔁 Prevent multiple model compilation in hot reload
const User = mongoose.models.User || model("User", userSchema);

export default User;
