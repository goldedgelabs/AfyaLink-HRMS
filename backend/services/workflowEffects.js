import { createLabOrder } from "./labService.js";
import { createPrescription } from "./pharmacyService.js";
import { createInvoice } from "./billingService.js";
import { notifyPatient } from "./notificationService.js";

export async function triggerSideEffects(state, wf, ctx) {
  switch (state) {
    case "LAB_ORDERED":
      await createLabOrder(wf.patient, ctx.tests);
      break;

    case "LAB_COMPLETED":
      await notifyPatient(wf.patient, "Lab results ready");
      break;

    case "PRESCRIPTION_CREATED":
      await createPrescription(wf.patient, ctx.meds);
      break;

    case "DISPENSED":
      await createInvoice(wf.patient, ctx.amount);
      break;

    case "PAID":
      await notifyPatient(wf.patient, "Payment received");
      break;
  }
}
