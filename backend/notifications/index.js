
import { sendTwilioSMS } from './twilioClient.js';
import { sendATSMS } from './africastalkingClient.js';

export const sendSMS = async ({ to, message }) => {
  const results = {};

  try {
    results.twilio = await sendTwilioSMS({ to, message });
  } catch (err) {
    results.twilio = { error: err.message };
  }

  try {
    results.africastalking = await sendATSMS({ to, message });
  } catch (err) {
    results.africastalking = { error: err.message };
  }

  return results;
};
