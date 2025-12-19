import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, unique: true },

    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },

    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },

    amount: { type: Number, required: true },
    currency: { type: String, default: "KES" },
    method: { type: String }, // mpesa, stripe, cash

    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Receipt", ReceiptSchema);
