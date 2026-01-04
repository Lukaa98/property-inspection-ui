import { API_ENDPOINTS } from '../config/api';

export const parseResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(API_ENDPOINTS.PARSE_RESUME, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Parse failed');
  return res.json();
};

export const parseResumeText = async (layout) => {
  const res = await fetch(API_ENDPOINTS.PARSE_RESUME_TEXT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(layout),
  });

  if (!res.ok) throw new Error('Text parse failed');
  return res.json(); // { text, line_map }
};

export const analyzeResume = async (payload) => {
  const res = await fetch(API_ENDPOINTS.ANALYZE_RESUME, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Analyze failed');
  return res.json(); // { semantic, line_map }
};

export const exportResumeToPDF = async (layout) => {
  const res = await fetch(API_ENDPOINTS.EXPORT_RESUME, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(layout),
  });

  if (!res.ok) throw new Error('Export failed');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.pdf';
  a.click();

  URL.revokeObjectURL(url);
};
