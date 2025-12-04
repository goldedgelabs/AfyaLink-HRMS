import express from 'express';
import { createNotification, listNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, createNotification);
router.get('/', protect, listNotifications);

export default router;
