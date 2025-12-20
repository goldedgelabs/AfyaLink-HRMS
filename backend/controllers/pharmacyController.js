import { workflowService } from "../services/workflowService.js";

/* ======================================================
   DISPENSE MEDICATION (WORKFLOW ENFORCED)
====================================================== */
export const dispenseMedication = async (req, res, next) => {
  try {
    const {
      workflowId,       // PHARMACY workflow ID
      prescriptionId,
      encounterId,
      quantity,
      notes,
    } = req.body;

    if (!workflowId || !prescriptionId || !encounterId) {
      return res.status(400).json({
        msg: "workflowId, prescriptionId, and encounterId are required",
      });
    }

    /**
     * 🚨 ONLY LEGAL PHARMACY MUTATION
     */
    const wf = await workflowService.transition(
      "PHARMACY",
      workflowId,
      {
        prescriptionId,
        encounterId,
        quantity,
        dispensedBy: req.user.id,
        hospital: req.user.hospitalId,
        notes,
      }
    );

    /**
     * Effects (authoritative):
     * - Inventory decrement
     * - Billing line item
     * - Encounter update
     * - Audit log
     * - Receipt pending
     */
    res.json({
      status: "dispensed",
      prescription: wf.context.prescription,
      encounter: wf.context.encounter,
      billing: wf.context.billing,
    });
  } catch (err) {
    next(err);
  }
};
