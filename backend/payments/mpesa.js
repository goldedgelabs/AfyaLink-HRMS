
// M-Pesa placeholder adapter
module.exports = {
  initiateSTK: async (phone, amount) => {
    return { placeholder: true, message: 'STK push simulated', phone, amount };
  },
  handleCallback: async (data) => {
    // process callback from M-Pesa
    return { ok: true, data };
  }
};
