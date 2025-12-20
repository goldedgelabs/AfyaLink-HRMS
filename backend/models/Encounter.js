import mongoose from "mongoose";
import { WORKFLOW } from "../constants/workflowStates.js";

const EncounterSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },

  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },

  state: {
    type: String,
    enum: Object.values(WORKFLOW),
    default: WORKFLOW.CREATED,
  },

  consultationNotes: String,
  diagnosis: String,

  labOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "LabOrder" }],
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],

  bill: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },

  closedAt: Date,
}, { timestamps: true });

export default mongoose.model("Encounter", EncounterSchema);
