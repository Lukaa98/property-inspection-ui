import { API_ENDPOINTS } from '../config/api';

export const parseResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(API_ENDPOINTS.PARSE_RESUME, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Parse failed');

  return await res.json(); // { layout, blocks }
};

export const exportResumeToPDF = async (data) => {
  const res = await fetch(API_ENDPOINTS.EXPORT_RESUME, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
