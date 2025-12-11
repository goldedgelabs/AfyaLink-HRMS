import PDFDocument from 'pdfkit';
import Transaction from '../models/Transaction.js';

export async function invoicePdf(req, res) {
  const { id } = req.params;
  const tx = await Transaction.findById(id);
  if (!tx) return res.status(404).send('Not found');
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice_${tx.reference}.pdf`);
  doc.fontSize(20).text('AfyaLink Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Reference: ${tx.reference}`);
  doc.text(`Amount: ${tx.amount} ${tx.currency}`);
  doc.text(`Status: ${tx.status}`);
  doc.text(`Date: ${tx.createdAt.toISOString()}`);
  doc.end();
  doc.pipe(res);
}
