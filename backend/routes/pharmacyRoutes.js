import express from 'express';
import { index, list } from '../controllers/pharmacyController.js';
const router = express.Router();

router.get('/', index);
router.get('/list', list);
router.get(
  "/dashboard",
  protect,
  authorize("pharmacy", "read"),
  async (req, res) => {
    res.json({
      pendingPrescriptions: 12,
      dispensedToday: 7,
      lowStock: 3,
      totalMedicines: 142,
    });
  }
);


export default router;
