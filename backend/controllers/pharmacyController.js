import { transitionEncounter } from "../services/workflowService.js";
import { WORKFLOW } from "../constants/workflowStates.js";

export const dispenseMedication = async (req, res) => {
  const { encounterId, prescriptionId } = req.body;

  const encounter = await transitionEncounter(
    encounterId,
    WORKFLOW.DISPENSED,
    { prescriptionId }
  );

  res.json(encounter);
};
