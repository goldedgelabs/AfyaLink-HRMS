import Transaction from "../models/Transaction.js";
import Encounter from "../models/Encounter.js";
import Report from "../models/Report.js";
import PDFDocument from "pdfkit";
import { transitionEncounter } from "../services/workflowService.js";
import { WORKFLOW } from "../constants/workflowStates.js";

/* ======================================================
   BILLING DASHBOARD (HOSPITAL-SCOPED)
====================================================== */
export async function index(req, res) {
  const hospital = req.user.hospital;

  const total = await Transaction.countDocuments({ hospital });
  const success = await Transaction.countDocuments({ hospital, status: "success" });
  const fail = await Transaction.countDocuments({ hospital, status: "failed" });

  const revenue = await Transaction.aggregate([
    { $match: { hospital, status: "success" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({
    totalTransactions: total,
    successful: success,
    failed: fail,
    revenue: revenue[0]?.total || 0,
  });
}

/* ======================================================
   LIST TRANSACTIONS (TENANT SAFE)
====================================================== */
export async function list(req, res) {
  const tx = await Transaction.find({ hospital: req.user.hospital })
    .sort({ createdAt: -1 })
    .populate("patient encounter");

  res.json(tx);
}

/* ======================================================
   GET SINGLE TRANSACTION
====================================================== */
export async function getOne(req, res) {
  const tx = await Transaction.findOne({
    _id: req.params.id,
    hospital: req.user.hospital,
  });

  if (!tx) return res.status(404).json({ error: "Not found" });
  res.json(tx);
}

/* ======================================================
   MARK PAYMENT SUCCESS → WORKFLOW + RECEIPT + REPORT
====================================================== */
export async function markPaymentSuccess(req, res) {
  const { transactionId } = req.body;

  const tx = await Transaction.findOne({
    _id: transactionId,
    hospital: req.user.hospital,
  });

  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  tx.status = "success";
  await tx.save();

  // 🔁 Workflow transition
  const encounter = await transitionEncounter(
    tx.encounter,
    WORKFLOW.PAID
  );

  // 🧾 Auto-generate financial report
  await Report.create({
    type: "PAYMENT_RECEIPT",
    patient: tx.patient,
    hospital: tx.hospital,
    encounter: tx.encounter,
    amount: tx.amount,
    reference: tx.reference,
    createdBy: req.user.id,
  });

  res.json({
    message: "Payment confirmed",
    transaction: tx,
    encounter,
  });
}

/* ======================================================
   GENERATE INVOICE PDF (PRODUCTION GRADE)
====================================================== */
export async function invoicePdf(req, res) {
  const tx = await Transaction.findOne({
    _id: req.params.id,
    hospital: req.user.hospital,
  }).populate("patient encounter");

  if (!tx) return res.status(404).send("Invoice not found");

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${tx.reference}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(22).text("AfyaLink Medical Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Invoice Ref: ${tx.reference}`);
  doc.text(`Patient: ${tx.patient?.name || "N/A"}`);
  doc.text(`Encounter ID: ${tx.encounter?._id}`);
  doc.text(`Date: ${tx.createdAt.toDateString()}`);
  doc.moveDown();

  doc.fontSize(14).text("Payment Details", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Amount: ${tx.amount} ${tx.currency}`);
  doc.text(`Gateway: ${tx.gateway}`);
  doc.text(`Status: ${tx.status.toUpperCase()}`);

  doc.moveDown(2);
  doc.text("Thank you for choosing AfyaLink.", { align: "center" });

  doc.end();
}
