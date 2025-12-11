import Transaction from '../models/Transaction.js';
import PDFDocument from 'pdfkit';

/**
 * ------------------------------------------------------------
 * Billing Dashboard Overview
 * ------------------------------------------------------------
 */
export async function index(req, res) {
  const total = await Transaction.countDocuments();
  const success = await Transaction.countDocuments({ status: 'success' });
  const fail = await Transaction.countDocuments({ status: 'failed' });

  const revenue = await Transaction.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    totalTransactions: total,
    successful: success,
    failed: fail,
    revenue: revenue[0]?.total || 0
  });
}

/**
 * ------------------------------------------------------------
 * List All Transactions
 * ------------------------------------------------------------
 */
export async function list(req, res) {
  const tx = await Transaction.find().sort({ createdAt: -1 });
  res.json(tx);
}

/**
 * ------------------------------------------------------------
 * Get Single Transaction
 * ------------------------------------------------------------
 */
export async function getOne(req, res) {
  const { id } = req.params;
  const tx = await Transaction.findById(id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  res.json(tx);
}

/**
 * ------------------------------------------------------------
 * Generate Invoice PDF
 * ------------------------------------------------------------
 */
export async function invoicePdf(req, res) {
  const { id } = req.params;
  const tx = await Transaction.findById(id);
  if (!tx) return res.status(404).send('Invoice not found');

  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice_${tx.reference}.pdf`);

  doc.pipe(res);

  doc.fontSize(22).text('AfyaLink Invoice', { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(13).text(`Reference: ${tx.reference}`);
  doc.text(`Amount: ${tx.amount} ${tx.currency}`);
  doc.text(`Status: ${tx.status}`);
  doc.text(`Gateway: ${tx.gateway}`);
  doc.text(`Date: ${tx.createdAt.toISOString()}`);

  doc.end();
}
