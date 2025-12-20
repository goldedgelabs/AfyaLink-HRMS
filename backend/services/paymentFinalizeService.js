import Receipt from "../models/Receipt.js";
import LedgerEntry from "../models/LedgerEntry.js";
import Invoice from "../models/Invoice.js";
import Workflow from "../models/Workflow.js";
import { logAudit } from "./auditService.js";

/**
 * FINALIZE PAYMENT
 * 🔒 THE ONLY PLACE allowed to:
 * - create Receipt
 * - create LedgerEntry
 * - mark Invoice paid
 */
export async function finalizePayment({
  workflowId,
  payment,
  actor,
}) {
  /* ================= SAFETY ================= */
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) throw new Error("Workflow not found");

  if (workflow.state === "COMPLETED") {
    throw new Error("Payment already finalized");
  }

  /* ================= RECEIPT ================= */
  const receiptNo = `RCPT-${Date.now()}`;

  const receipt = await Receipt.create({
    receiptNo,
    paymentId: payment._id,
    invoiceId: payment.invoice,
    patient: payment.patient,
    hospital: payment.hospital,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    $locals: { viaWorkflow: true },
  });

  /* ================= LEDGER (SOURCE OF TRUTH) ================= */
  await LedgerEntry.create({
    type: "PAYMENT",
    amount: payment.amount,
    hospital: payment.hospital,
    patient: payment.patient,
    reference: receiptNo,
    source: payment.method,
    $locals: { viaWorkflow: true },
  });

  /* ================= INVOICE ================= */
  if (payment.invoice) {
    await Invoice.findByIdAndUpdate(
      payment.invoice,
      {
        status: "Paid",
        paidAt: new Date(),
      },
      { $locals: { viaWorkflow: true } }
    );
  }

  /* ================= WORKFLOW ================= */
  workflow.state = "COMPLETED";
  workflow.history.push({
    state: "COMPLETED",
    at: new Date(),
    by: actor.id,
  });

  await workflow.save();

  /* ================= AUDIT ================= */
  await logAudit({
    actorId: actor.id,
    actorRole: actor.role,
    action: "PAYMENT_FINALIZED",
    resource: "payment",
    resourceId: payment._id,
    hospital: payment.hospital,
    after: {
      receipt: receipt._id,
      amount: payment.amount,
    },
  });

  return receipt;
}
