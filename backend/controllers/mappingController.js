import Workflow from "../models/Workflow.js";
import LabOrder from "../models/LabOrder.js";
import { assertWorkflowState } from "../services/clinicalWorkflowGuard.js";

export async function orderLab(req, res) {
  const { encounterId, tests } = req.body;

  const workflow = await Workflow.findOne({ encounter: encounterId });

  assertWorkflowState(workflow, ["DIAGNOSED"]);

  const lab = await LabOrder.create({
    encounter: encounterId,
    tests,
    orderedBy: req.user._id,
    hospital: req.user.hospital,
    $locals: { viaWorkflow: true },
  });

  await workflow.transition("LAB_ORDERED", req.user);

  res.json(lab);
}
