// Twilio placeholder - install twilio and set env vars
module.exports = {
  sendSMS: async (to, message) => {
    console.log("Twilio sendSMS placeholder:", to, message);
    return { ok: true, to, message };
  }
};
