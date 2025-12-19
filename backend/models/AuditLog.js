import mongoose from "mongoose";

const { Schema, model } = mongoose;

const auditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorRole: String,

    action: { type: String, required: true },

    resource: String,
    resourceId: Schema.Types.ObjectId,

    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,

    hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },

    ip: String,
    userAgent: String,

    success: { type: Boolean, default: true },
    error: String,
  },
  { timestamps: true }
);

export default model("AuditLog", auditLogSchema);
