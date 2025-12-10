
const express = require('express');
const router = express.Router();
const twilio = require('../notifications/twilioClient');
const at = require('../notifications/africastalkingClient');

router.post('/sms', async (req, res) => {
  const { provider='twilio', to, message } = req.body;
  try {
    if (provider === 'at') {
      const out = await at.sendSMS(to, message);
      return res.json(out);
    }
    const out = await twilio.sendSMS(to, message);
    res.json(out);
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'Notification failed' });
  }
});

module.exports = router;
