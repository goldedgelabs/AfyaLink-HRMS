import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const hospitalSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  address: { type: String },
  contact: { type: String },
  metadata: { type: Object, default: {} },
  financialSettings: { type: Object, default: {} },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default model('Hospital', hospitalSchema);
