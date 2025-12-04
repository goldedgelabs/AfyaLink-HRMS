import express from 'express';
import { createHospital, listHospitals } from '../controllers/hospitalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { permit } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.post('/', protect, permit('SuperAdmin'), createHospital);
router.get('/', protect, permit('SuperAdmin','HospitalAdmin'), listHospitals);

export default router;
