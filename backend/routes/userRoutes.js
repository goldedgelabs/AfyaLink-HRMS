import express from 'express';
import { getMe, listUsers, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { permit } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.get('/me', protect, getMe);
router.get('/', protect, permit('SuperAdmin','HospitalAdmin'), listUsers);
router.patch('/:id', protect, permit('SuperAdmin','HospitalAdmin'), updateUser);

export default router;
