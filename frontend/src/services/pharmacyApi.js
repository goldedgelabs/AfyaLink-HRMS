// Redirect old pharmacyApi imports to apiFetch
export * from '../utils/apiFetch';
import api from '../utils/apiFetch';

// Optional placeholders for named exports previously used
export const addStock = async () => {
  console.warn("Placeholder addStock called");
  return Promise.resolve({ placeholder: true });
};

export const dispenseStock = async () => {
  console.warn("Placeholder dispenseStock called");
  return Promise.resolve({ placeholder: true });
};

export default api;
