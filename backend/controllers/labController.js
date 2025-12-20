import { transitionEncounter } from "../services/workflowService.js";
import { WORKFLOW } from "../constants/workflowStates.js";

export const completeLab = async (req, res) => {
  const encounter = await transitionEncounter(
    req.body.encounterId,
    WORKFLOW.LAB_COMPLETED
  );

  res.json(encounter);
};
