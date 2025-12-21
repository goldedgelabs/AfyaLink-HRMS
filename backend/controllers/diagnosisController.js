import Workflow from "../models/Workflow.js";
import Diagnosis from "../models/Diagnosis.js";
import { assertWorkflowState } from "../services/clinicalWorkflowGuard.js";

export async function createDiagnosis(req, res) {
  const { encounterId, diagnosis } = req.body;

  const workflow = await Workflow.findOne({ encounter: encounterId });

  assertWorkflowState(workflow, ["ENCOUNTER_STARTED"]);

  const diag = await Diagnosis.create({
    encounter: encounterId,
    diagnosis,
    doctor: req.user._id,
    hospital: req.user.hospital,
    $locals: { viaWorkflow: true },
  });

  await workflow.transition("DIAGNOSED", req.user);

  res.json(diag);
}
