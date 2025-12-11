import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const appointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User' },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
  scheduledAt: { type: Date, required: true },
  durationMins: { type: Number, default: 30 },
  status: { type: String, enum: ['Scheduled','Completed','Cancelled','NoShow'], default: 'Scheduled' },
  notes: String,
  metadata: Object,
}, { timestamps: true });

export default model('Appointment', appointmentSchema);
