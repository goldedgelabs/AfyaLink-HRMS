import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: String,

    action: { type: String, required: true },
    resource: String,
    resourceId: mongoose.Schema.Types.ObjectId,

    before: Object,
    after: Object,

    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditSchema);
