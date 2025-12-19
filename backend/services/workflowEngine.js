import Workflow from "../models/Workflow.js";
import { WORKFLOW_TRANSITIONS } from "../config/workflows.js";
import { logAudit } from "./auditService.js";

export async function transitionWorkflow({
  workflowId,
  to,
  actor,
  ctx = {},
}) {
  const wf = await Workflow.findById(workflowId);
  if (!wf) throw new Error("Workflow not found");

  const allowed = WORKFLOW_TRANSITIONS[wf.state] || [];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid transition ${wf.state} → ${to}`);
  }

  wf.state = to;
  wf.history.push({ state: to, at: new Date(), by: actor.id });
  await wf.save();

  await logAudit({
    actorId: actor.id,
    actorRole: actor.role,
    action: "WORKFLOW_TRANSITION",
    resource: "workflow",
    resourceId: wf.id,
    after: { state: to },
    hospital: wf.hospital,
  });

  await triggerSideEffects(to, wf, ctx);

  return wf;
}
