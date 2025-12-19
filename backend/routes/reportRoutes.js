// routes/reportRoutes.js
import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { getReports, getReportById } from '../controllers/reportController.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize(['hospitaladmin', 'doctor']), getReports);
router.get('/:id', authorize(['hospitaladmin', 'doctor']), getReportById);
router.get(
  "/revenue",
  auth,
  authorize("reports", "read"),
  revenueSummary
);


export default router;
