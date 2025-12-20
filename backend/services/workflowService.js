import Encounter from "../models/Encounter.js";
import { WORKFLOW } from "../constants/workflowStates.js";

export async function transitionEncounter(encounterId, nextState, payload = {}) {
  const encounter = await Encounter.findById(encounterId);
  if (!encounter) throw new Error("Encounter not found");

  encounter.state = nextState;

  if (payload.notes) encounter.consultationNotes = payload.notes;
  if (payload.diagnosis) encounter.diagnosis = payload.diagnosis;
  if (payload.labOrderId) encounter.labOrders.push(payload.labOrderId);
  if (payload.prescriptionId) encounter.prescriptions.push(payload.prescriptionId);
  if (payload.billId) encounter.bill = payload.billId;

  if (nextState === WORKFLOW.CLOSED) {
    encounter.closedAt = new Date();
  }

  await encounter.save();
  return encounter;
}
