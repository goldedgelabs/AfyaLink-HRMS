import Workflow from "../models/Workflow.js";
import AuditLog from "../models/AuditLog.js";

/**
 * GET WORKFLOW TIMELINE
 * 🔒 READ-ONLY
 *
 * Used by:
 * - Doctor encounter view
 * - Admin audit view
 *
 * NEVER mutates state.
 */
export async function getWorkflowTimeline(req, res) {
  try {
    const { encounterId } = req.params;

    if (!encounterId) {
      return res.status(400).json({ error: "encounterId is required" });
    }

    /* ================= WORKFLOW ================= */
    const workflow = await Workflow.findOne({ encounter: encounterId })
      .lean();

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    /* ================= AUDIT LOGS ================= */
    const audits = await AuditLog.find({
      resource: "workflow",
      resourceId: workflow._id,
    })
      .sort({ createdAt: 1 })
      .lean();

    /* ================= RESPONSE ================= */
    return res.json({
      workflow: {
        id: workflow._id,
        state: workflow.state,
        allowedTransitions: workflow.allowedTransitions || [],
        history: workflow.history || [],
        createdAt: workflow.createdAt,
      },
      audit: audits.map((a) => ({
        id: a._id,
        action: a.action,
        actorId: a.actorId,
        actorRole: a.actorRole,
        at: a.createdAt,
        before: a.before,
        after: a.after,
      })),
    });
  } catch (err) {
    console.error("Workflow timeline error:", err);
    res.status(500).json({ error: "Failed to load workflow timeline" });
  }
}
