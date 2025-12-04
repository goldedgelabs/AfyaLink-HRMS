import express from 'express';
import { createAppointment, listAppointments, getAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { permit } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.post('/', protect, permit('HospitalAdmin','Doctor','Patient'), createAppointment);
router.get('/', protect, permit('HospitalAdmin','Doctor','Nurse','SuperAdmin'), listAppointments);
router.get('/:id', protect, getAppointment);
router.patch('/:id', protect, permit('HospitalAdmin','Doctor'), updateAppointment);
router.delete('/:id', protect, permit('HospitalAdmin','Doctor'), deleteAppointment);

export default router;
