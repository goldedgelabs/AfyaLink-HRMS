import { finalizePayment } from "../services/paymentFinalizeService.js";

// After payment confirmation
const receipt = await finalizePayment({
  payment,
  invoice,
});

// OPTIONAL: notify patient
