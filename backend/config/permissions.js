// backend/config/permissions.js
export const PERMISSIONS = {
  PATIENT: {
    appointments: ["create", "read"],
    records: ["read_own"],
    payments: ["create", "read_own"],
  },
  DOCTOR: {
    appointments: ["read", "update"],
    records: ["create", "read", "update"],
    prescriptions: ["create"],
  },
  HOSPITAL_ADMIN: {
    "*": ["*"],
  },
};
