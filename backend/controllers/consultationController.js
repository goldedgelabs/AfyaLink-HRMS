import Workflow from "../models/Workflow.js";
import { transitionWorkflow } from "../services/workflowEngine.js";

export const completeConsultation = async (req, res) => {
  const wf = await Workflow.create({
    patient: req.body.patient,
    appointment: req.body.appointment,
    hospital: req.user.hospital,
    state: "CONSULTATION",
    history: [{ state: "CONSULTATION", at: new Date(), by: req.user.id }],
  });

  const updated = await transitionWorkflow({
    workflowId: wf.id,
    to: "LAB_ORDERED",
    actor: req.user,
    ctx: { tests: req.body.tests },
  });

  res.json(updated);
};
