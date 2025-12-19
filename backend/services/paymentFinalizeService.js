import Receipt from "../models/Receipt.js";
import LedgerEntry from "../models/LedgerEntry.js";

export async function finalizePayment({ payment, invoice }) {
  // 1️⃣ Generate receipt number
  const receiptNo = `RCPT-${Date.now()}`;

  // 2️⃣ Create receipt
  const receipt = await Receipt.create({
    receiptNo,
    paymentId: payment._id,
    invoiceId: invoice?._id,
    patient: payment.patient,
    hospital: payment.hospital,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
  });

  // 3️⃣ Ledger entry (ACCOUNTING SOURCE OF TRUTH)
  await LedgerEntry.create({
    type: "PAYMENT",
    amount: payment.amount,
    hospital: payment.hospital,
    patient: payment.patient,
    reference: receiptNo,
    source: payment.method,
  });

  return receipt;
}
