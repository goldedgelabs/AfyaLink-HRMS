// src/utils/api.js
// Redirect all old api imports to apiFetch.js

export * from './apiFetch';

// Optional default export for imports like `import API from '../utils/api'`
import * as api from './apiFetch';
export default api;
