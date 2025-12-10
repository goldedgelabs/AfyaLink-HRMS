
// Stripe skeleton - install stripe package and set process.env.STRIPE_KEY
module.exports = {
  createPaymentIntent: async (amount, currency='usd') => {
    return { placeholder: true, amount, currency, client_secret: 'pi_client_secret_placeholder' };
  }
};
