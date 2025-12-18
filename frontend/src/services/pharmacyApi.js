// Placeholder to redirect pharmacyApi imports to apiFetch
export * from '../utils/apiFetch';

// Dummy functions for named exports that some components may expect
export const addStock = async () => {
  throw new Error("Placeholder: addStock not implemented");
};

export const dispenseStock = async () => {
  throw new Error("Placeholder: dispenseStock not implemented");
};

// Optional default export
import * as api from '../utils/apiFetch';
export default api;
