import Twilio from 'twilio';
import fetch from 'node-fetch';

const TW_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TW_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const AT_KEY = process.env.AFRICASTALKING_API_KEY || '';
const AT_USER = process.env.AFRICASTALKING_USERNAME || '';

let twClient = null;
if(TW_SID && TW_TOKEN) twClient = Twilio(TW_SID, TW_TOKEN);

export async function sendSMS({ provider='twilio', to, message }){
  if(provider === 'twilio' && twClient){
    const from = process.env.TWILIO_NUMBER;
    const msg = await twClient.messages.create({ body: message, from, to });
    return { provider:'twilio', sid: msg.sid };
  }
  if(provider === 'africastalking' && AT_KEY && AT_USER){
    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method:'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded', 'apiKey': AT_KEY },
      body: new URLSearchParams({ username: AT_USER, to, message })
    });
    const js = await res.json();
    return { provider:'africastalking', result: js };
  }
  // fallback: log
  console.log('SMS fallback send', provider, to, message);
  return { provider:'log', to };
}

export async function sendWhatsApp({ provider='twilio', to, message }){
  if(provider === 'twilio' && twClient){
    const from = 'whatsapp:' + process.env.TWILIO_WHATSAPP_FROM;
    const msg = await twClient.messages.create({ body: message, from, to: 'whatsapp:' + to });
    return { provider:'twilio', sid: msg.sid };
  }
  console.log('WhatsApp fallback', provider, to, message);
  return { provider:'log' };
}

export default { sendSMS, sendWhatsApp };
