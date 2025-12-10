import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['SuperAdmin','HospitalAdmin','Doctor','Nurse','LabTech','Patient'], required: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
  countryId: { type: String }, // SHA/NHIF identifier or similar
  metadata: { type: Object, default: {} },
  refreshTokens: { type: [String], default: [] },
  active: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  if (!this.password) return false;
  return await bcrypt.compare(entered, this.password);
};

export default model('User', userSchema);


// Compatibility export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = require('mongoose').models.User || require('mongoose').model('User');
}
