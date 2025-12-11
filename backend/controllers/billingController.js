import PDFDocument from 'pdfkit';
import Transaction from '../models/Transaction.js';

export async function invoicePdf(req, res) {
  const { id } = req.params;

  // Fetch transaction
  const tx = await Transaction.findById(id);
  if (!tx) return res.status(404).send('Not found');

  // Create PDF document
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Prepare headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice_${tx.reference}.pdf`
  );

  // Pipe first
  doc.pipe(res);

  // PDF content
  doc.fontSize(20).text('AfyaLink Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Reference: ${tx.reference}`);
  doc.text(`Amount: ${tx.amount} ${tx.currency}`);
  doc.text(`Status: ${tx.status}`);
  doc.text(`Date: ${tx.createdAt.toISOString()}`);

  // Finish PDF
  doc.end();
}
