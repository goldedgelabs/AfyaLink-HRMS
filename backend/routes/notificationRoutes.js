import express from 'express';
import twilio from '../notifications/twilioClient.js';
import at from '../notifications/africastalkingClient.js';

const router = express.Router();

router.post('/sms', async (req, res) => {
  const { provider = 'twilio', to, message } = req.body;

  try {
    if (provider === 'at') {
      const out = await at.sendSMS(to, message);
      return res.json(out);
    }

    // default: twilio
    const out = await twilio.sendSMS(to, message);
    res.json(out);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notification failed' });
  }
});

export default router;
