import Workflow from "../models/Workflow.js";
import Prescription from "../models/Prescription.js";
import { assertWorkflowState } from "../services/clinicalWorkflowGuard.js";

export async function createPrescription(req, res) {
  const { encounterId, meds } = req.body;

  const workflow = await Workflow.findOne({ encounter: encounterId });

  assertWorkflowState(workflow, ["LAB_COMPLETED"]);

  const rx = await Prescription.create({
    encounter: encounterId,
    meds,
    prescribedBy: req.user._id,
    hospital: req.user.hospital,
    $locals: { viaWorkflow: true },
  });

  await workflow.transition("PRESCRIPTION_CREATED", req.user);

  res.json(rx);
}
