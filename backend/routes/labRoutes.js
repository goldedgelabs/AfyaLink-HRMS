import express from 'express';
import { orderTest, uploadResult, listLabs, getLab, updateLab, deleteLab } from '../controllers/labController.js';
import { protect } from '../middleware/authMiddleware.js';
import { permit } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.post('/', protect, permit('Doctor','HospitalAdmin'), orderTest);
router.get('/', protect, permit('LabTech','Doctor','HospitalAdmin'), listLabs);
router.get('/:id', protect, getLab);
router.post('/:id/result', protect, permit('LabTech','Doctor'), uploadResult);
router.patch('/:id', protect, permit('LabTech','Doctor'), updateLab);
router.delete('/:id', protect, permit('HospitalAdmin','SuperAdmin'), deleteLab);

export default router;
