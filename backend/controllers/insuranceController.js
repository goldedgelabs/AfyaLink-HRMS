import Encounter from "../models/Encounter.js";
import InsuranceAuthorization from "../models/InsuranceAuthorization.js";
import { requestShaPreauth } from "../services/shaService.js";
import workflowService from "../services/workflowService.js";
import { logAudit } from "../services/auditService.js";

/* ======================================================
   SHA PRE-AUTH (NORMAL FLOW)
   POST /api/insurance/sha/preauth
====================================================== */
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

  // 🔒 Workflow authority
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

  // Persist authorization record
  const auth = await InsuranceAuthorization.create({
    encounter: encounter._id,
    provider
