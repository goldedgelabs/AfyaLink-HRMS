import { PERMISSIONS } from "../config/permissions.js";

/* ======================================================
   RBAC + ABAC CORE
====================================================== */

export function hasPermission(user, resource, action, context = {}) {
  if (!user || !user.role) return false;

  const role = user.role.toUpperCase();

  // Super admin bypass
  if (role === "SUPER_ADMIN") return true;

  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;

  // Wildcard access
  if (rolePerms["*"]?.includes("*")) return true;

  const allowedActions = rolePerms[resource];
  if (!allowedActions) return false;

  // RBAC check
  if (
    !allowedActions.includes(action) &&
    !allowedActions.includes("*")
  ) {
    return false;
  }

  /* ===============================
     ABAC RULES (CONTEXTUAL)
  =============================== */

  // Own-resource rule
  if (action.includes("_own")) {
    if (!context.ownerId || context.ownerId !== user.id) {
      return false;
    }
  }

  // Hospital isolation
  if (
    context.hospitalId &&
    user.hospital &&
    String(context.hospitalId) !== String(user.hospital)
  ) {
    return false;
  }

  // Doctor ↔ patient assignment
  if (
    context.assignedDoctor &&
    role === "DOCTOR" &&
    String(context.assignedDoctor) !== String(user.id)
  ) {
    return false;
  }

  return true;
}

/* ======================================================
   EXPRESS MIDDLEWARE
====================================================== */
export const authorize = (resource, action) => {
  return (req, res, next) => {
    const context = {
      ownerId: req.resource?.ownerId,
      hospitalId: req.resource?.hospital,
      assignedDoctor: req.resource?.doctor,
    };

    const allowed = hasPermission(
      req.user,
      resource,
      action,
      context
    );

    if (!allowed) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    next();
  };
};
