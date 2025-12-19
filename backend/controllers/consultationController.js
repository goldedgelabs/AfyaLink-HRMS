import { completeConsultation } from "../services/workflows/consultationFlow.js";

export const finishConsultation = async (req, res, next) => {
  try {
    const result = await completeConsultation({
      appointmentId: req.body.appointmentId,
      doctorId: req.user.id,
      patientId: req.body.patientId,
      hospitalId: req.user.hospitalId,
      diagnosis: req.body.diagnosis,
      labTests: req.body.labTests,
      medications: req.body.medications,
      billingItems: req.body.billingItems,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
