
import africastalking from 'africastalking';

const at = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = at.SMS;

export const sendATSMS = async ({ to, message }) => {
  return await sms.send({
    to,
    message,
    from: process.env.AT_SHORTCODE || "",
  });
};
