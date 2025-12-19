/* ======================================================
   PERMISSION MATRIX (RBAC)
   Single source of truth
====================================================== */

export const PERMISSIONS = {
  SUPER_ADMIN: {
    "*": ["*"],
  },

  HOSPITAL_ADMIN: {
    appointments: ["create", "read", "update", "delete"],
    patients: ["create", "read", "update"],
    users: ["create", "read", "update"],
    billing: ["read", "update"],
    reports: ["read"],
  },

  DOCTOR: {
    appointments: ["read", "update"],
    records: ["create", "read", "update"],
    prescriptions: ["create", "read"],
    lab_orders: ["create", "read"],
  },

  NURSE: {
    appointments: ["read"],
    records: ["read"],
  },

  LAB_TECH: {
    lab_orders: ["read", "update"],
    lab_results: ["create", "read"],
  },

  PHARMACIST: {
    prescriptions: ["read", "update"],
  },

  PATIENT: {
    appointments: ["create", "read_own"],
    records: ["read_own"],
    payments: ["create", "read_own"],
  },
};
