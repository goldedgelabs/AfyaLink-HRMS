import mongoose from "mongoose";

const LedgerEntrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["PAYMENT", "REFUND"],
      required: true,
    },

    amount: { type: Number, required: true },

    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    reference: String, // receiptNo
    source: String, // mpesa, stripe

    occurredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("LedgerEntry", LedgerEntrySchema);
