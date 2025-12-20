import { workflowService } from "../services/workflowService.js";

/* ======================================================
   COMPLETE LAB TEST (WORKFLOW TRANSITION)
====================================================== */
export const completeLab = async (req, res, next) => {
  try {
    const {
      workflowId,        // LAB workflow ID
      encounterId,
      testType,
      result,
      notes,
    } = req.body;

    if (!workflowId || !encounterId || !testType) {
      return res.status(400).json({
        msg: "workflowId, encounterId and testType are required",
      });
    }

    /**
     * 🚨 ONLY LEGAL LAB MUTATION
     */
    const wf = await workflowService.transition(
      "LAB",
      workflowId,
      {
        encounterId,
        testType,
        result,
        notes,
        technician: req.user.id,
        hospital: req.user.hospitalId,
      }
    );

    /**
     * Context is authoritative
     * Encounter updates happen via workflowEffects
     */
    res.json({
      status: "completed",
      labResult: wf.context.labResult,
      encounter: wf.context.encounter,
    });
  } catch (err) {
    next(err);
  }
};
