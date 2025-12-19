import Billing from "../../models/Billing.js";
import AuditLog from "../../models/AuditLog.js";

export async function completeConsultation(ctx) {
  const { consultationId, patientId, doctorId, hospitalId } = ctx;

  // 1️⃣ Create billing entry
  const bill = await Billing.create({
    patient: patientId,
    hospital: hospitalId,
    items: [{ name: "Consultation", amount: 50 }],
    status: "Pending",
  });

  // 2️⃣ Audit
  await AuditLog.create({
    actorId: doctorId,
    action: "CONSULTATION_COMPLETED",
    resource: "consultation",
    resourceId: consultationId,
    after: { billingId: bill._id },
  });

  return bill;
}
