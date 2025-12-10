// Africa's Talking placeholder - install africastalking and set env vars
const africasTalkingClient = {
  sendSMS: async (to, message) => {
    console.log("Africa's Talking sendSMS placeholder:", to, message);
    return { ok: true, to, message };
  }
};

export default africasTalkingClient;
