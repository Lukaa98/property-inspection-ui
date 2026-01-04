const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

export const API_ENDPOINTS = {
  PARSE_RESUME: `${API_URL}/parse-resume`,
  PARSE_RESUME_TEXT: `${API_URL}/parse-resume-text`,
  ANALYZE_RESUME: `${API_URL}/analyze-resume`,
  EXPORT_RESUME: `${API_URL}/export-resume`,
};

export default API_URL;
