import { transitionEncounter } from "../services/workflowService.js";
import { WORKFLOW } from "../constants/workflowStates.js";

export const closeEncounter = async (req, res) => {
  const encounter = await transitionEncounter(
    req.params.id,
    WORKFLOW.CLOSED
  );

  res.json(encounter);
};
