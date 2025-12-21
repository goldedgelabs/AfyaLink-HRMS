import Encounter from "../models/Encounter.js";
import { requestShaPreauth } from "../services/shaService.js";
import workflowService from "../services/workflowService.js";

/**
 * POST /api/insurance/sha/preauth
 * 🔒 Workflow-gated
 */
export async function shaPreauthorize(req, res) {
  const { encounterId } = req.body;

  if (!encounterId) {
    return res.status(400).json({ error: "encounterId required" });
  }

  const encounter = await Encounter.findById(encounterId)
    .populate("patient")
    .populate("workflow");

  if (!encounter) {
    return res.status(404).json({ error: "Encounter not found" });
  }

  // 🔒 Workflow authority check
  const allowed =
    encounter.workflow?.allowedTransitions?.includes(
      "INSURANCE_PREAUTHORIZED"
    );

  if (!allowed) {
    return res.status(409).json({
      error: "Insurance pre-authorization not allowed at this stage",
    });
  }

  // Call SHA
  const result = await requestShaPreauth({
    encounter,
    patient: encounter.patient,
  });

  if (result.status !== "APPROVED") {
    // Optional: workflow transition for rejection
    await workflowService.transition({
      workflowId: encounter.workflow._id,
      to: "INSURANCE_REJECTED",
      actor: req.user,
      meta: result,
    });

    return res.status(402).json({
      error: "Insurance rejected",
      reason: result.reason,
    });
  }

  // ✅ APPROVED — advance workflow
  await workflowService.transition({
    workflowId: encounter.workflow._id,
    to: "INSURANCE_APPROVED",
    actor: req.user,
    meta: {
      provider: "SHA",
      authorizationCode: result.authorizationCode,
    },
  });

  res.json({
    success: true,
    provider: "SHA",
    authorizationCode: result.authorizationCode,
  });
}
