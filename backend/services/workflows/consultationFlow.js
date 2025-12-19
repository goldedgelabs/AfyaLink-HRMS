import Diagnosis from "../../models/Diagnosis.js";
import LabOrder from "../../models/LabOrder.js";
import Prescription from "../../models/Prescription.js";
import Invoice from "../../models/Invoice.js";
import { notify } from "../notifications.js";
import { logAudit } from "../auditService.js";

/**
 * COMPLETE CONSULTATION
 * One function = full clinical closure
 */
export async function completeConsultation(ctx) {
  const {
    appointmentId,
    doctorId,
    patientId,
    hospitalId,
    diagnosis,
    labTests = [],
    medications = [],
    billingItems = [],
  } = ctx;

  // 1️⃣ Diagnosis
  const dx = await Diagnosis.create({
    appointment: appointmentId,
    doctor: doctorId,
    patient: patientId,
    hospital: hospitalId,
    diagnosis,
  });

  // 2️⃣ Lab Orders
  const labOrders = await Promise.all(
    labTests.map((t) =>
      LabOrder.create({
        test: t,
        patient: patientId,
        hospital: hospitalId,
        orderedBy: doctorId,
        status: "Pending",
      })
    )
  );

  // 3️⃣ Prescription
  const prescription = await Prescription.create({
    patient: patientId,
    doctor: doctorId,
    hospital: hospitalId,
    medications,
    status: "Pending",
  });

  // 4️⃣ Billing
  const invoice = await Invoice.create({
    patient: patientId,
    hospital: hospitalId,
    items: billingItems,
    source: "Consultation",
    status: "Unpaid",
  });

  // 5️⃣ Notifications
  await notify(patientId, "Consultation completed");

  // 6️⃣ Audit
  await logAudit({
    actorId: doctorId,
    action: "CONSULTATION_COMPLETE",
    resource: "consultation",
    resourceId: appointmentId,
    hospital: hospitalId,
  });

  return {
    diagnosis: dx,
    labOrders,
    prescription,
    invoice,
  };
}
