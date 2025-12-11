import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;

async function getAccessToken() {
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return data.access_token;
  } catch (err) {
    console.error("Error getting M-Pesa token:", err.response?.data || err);
    throw new Error("Failed to get M-Pesa access token");
  }
}

export default {
  initiateSTK: async (phone, amount) => {
    try {
      const token = await getAccessToken();

      // FORMAT TIMESTAMP YYYYMMDDHHMMSS
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);

      const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

      const payload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "AfyaLink",
        TransactionDesc: "Payment for Services",
      };

      const { data } = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (err) {
      console.error("STK ERROR:", err.response?.data || err);
      throw new Error("Failed to initiate STK push");
    }
  },

  handleCallback: async (data) => {
    console.log("📩 M-PESA CALLBACK RECEIVED:");
    console.log(JSON.stringify(data, null, 2));

    // You can add DB storage here
    // Example:
    // await PaymentModel.create({ status: data.Body.stkCallback.ResultCode })

    return { ok: true, data };
  }
};
