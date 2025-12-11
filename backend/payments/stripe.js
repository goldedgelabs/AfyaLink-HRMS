import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

/*
|--------------------------------------------------------------------------
| STRIPE INIT
|--------------------------------------------------------------------------
*/
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ Missing STRIPE_SECRET_KEY in environment!");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT INTENT
|--------------------------------------------------------------------------
*/
async function createPaymentIntent(amount, currency = "usd", metadata = {}) {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount.");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert USD → cents
      currency,
      metadata: {
        ...metadata,
        service: "AfyaLink Global Payment",
      },
      automatic_payment_methods: { enabled: true },
    });

    return {
      status: "created",
      clientSecret: paymentIntent.client_secret,
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
    };
  } catch (err) {
    console.error("❌ Stripe PaymentIntent Error:", err);
    throw new Error(err.message || "Failed to create Stripe PaymentIntent");
  }
}

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/
export default {
  createPaymentIntent,
};
