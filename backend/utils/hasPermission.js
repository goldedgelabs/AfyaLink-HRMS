import { PERMISSIONS } from "../config/permissions.js";

export function hasPermission(user, resource, action, req) {
  if (!user) return false;

  // Super powers
  if (user.role === "SuperAdmin") return true;

  const rolePerms = PERMISSIONS[user.role];
  if (!rolePerms) return false;

  const allowedActions =
    rolePerms[resource] || rolePerms["*"];

  if (!allowedActions) return false;

  if (
    allowedActions.includes("*") ||
    allowedActions.includes(action)
  ) {
    return enforceABAC(user, req.resource);
  }

  return false;
}

/* ================= ABAC RULES ================= */
function enforceABAC(user, resource) {
  if (!resource) return true; // list endpoints

  // Owner-only
  if (resource.ownerId && String(resource.ownerId) !== String(user.id)) {
    return false;
  }

  // Hospital isolation
  if (
    resource.hospital &&
    user.hospital &&
    String(resource.hospital) !== String(user.hospital)
  ) {
    return false;
  }

  // Doctor-specific access
  if (
    resource.doctor &&
    user.role === "Doctor" &&
    String(resource.doctor) !== String(user.id)
  ) {
    return false;
  }

  return true;
}
