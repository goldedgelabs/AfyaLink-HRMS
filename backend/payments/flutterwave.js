import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const FLW_SECRET = process.env.FLW_SECRET_KEY;

if (!FLW_SECRET) {
  console.warn("⚠️ Missing FLW_SECRET_KEY in .env");
}

export default {
  initiatePayment: async (payload) => {
    try {
      const { amount, currency = "USD", email, phone, name } = payload;

      if (!amount || amount <= 0) {
        throw new Error("Invalid amount for Flutterwave payment");
      }
      if (!email) {
        throw new Error("Customer email required");
      }

      const txRef = "Afyalink-" + Date.now(); // unique reference

      const requestBody = {
        tx_ref: txRef,
        amount,
        currency,
        redirect_url: process.env.FLW_REDIRECT_URL, // user returns here after payment
        customer: {
          email,
          phonenumber: phone || "",
          name: name || "",
        },
        customizations: {
          title: "AfyaLink Payment",
          description: "Healthcare service payment",
        },
      };

      const { data } = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${FLW_SECRET}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        paymentLink: data?.data?.link, // Frontend redirects user here
        txRef,
      };
    } catch (err) {
      console.error("❌ Flutterwave Error:", err.response?.data || err);
      throw new Error("Failed to initiate Flutterwave payment");
    }
  },
};
