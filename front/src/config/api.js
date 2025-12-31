const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

export const API_ENDPOINTS = {
  PARSE_RESUME: `${API_URL}/parse-resume`,
  EXPORT_RESUME: `${API_URL}/export-resume`,
  HEALTH: `${API_URL}/`,
};

export default API_URL;