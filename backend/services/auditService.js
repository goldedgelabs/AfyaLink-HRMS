import AuditLog from "../models/AuditLog.js";

export async function logAudit(entry) {
  try {
    await AuditLog.create(entry);
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}
