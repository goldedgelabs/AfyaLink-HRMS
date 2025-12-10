// Twilio placeholder - install twilio and set env vars
const twilioClient = {
  sendSMS: async (to, message) => {
    console.log("Twilio sendSMS placeholder:", to, message);
    return { ok: true, to, message };
  }
};

export default twilioClient;
