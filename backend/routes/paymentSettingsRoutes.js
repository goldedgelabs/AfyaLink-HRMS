import express from 'express';
import { saveSettings, getSettings, revealSecrets, enable2FA, verifyAndEnable2FA, changeAdminPassword } from '../controllers/paymentSettingsController.js';
import { revealLimiter } from '../middleware/rateLimiterSettings.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// only admin can save settings; auth ensures req.user exists and role check can be added
router.post('/save', auth, async (req,res)=>{
  if(!req.user) return res.status(401).json({ error:'not auth' });
  if(!['SuperAdmin','HospitalAdmin'].includes(req.user.role)) return res.status(403).json({ error:'forbidden' });
  return saveSettings(req,res);
});

router.get('/meta', auth, getSettings);
router.post('/2fa/enable', auth, enable2FA);
router.post('/2fa/verify', auth, verifyAndEnable2FA);
router.post('/change-password', auth, changeAdminPassword);
router.post('/reveal', auth, revealLimiter, revealSecrets);

export default router;
