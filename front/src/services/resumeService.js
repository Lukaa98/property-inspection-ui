import { API_ENDPOINTS } from '../config/api';

export const parseResumeFile = async (file) => {
  console.log('parseResumeFile CALLED');
  console.log('API URL USED:', API_ENDPOINTS.PARSE_RESUME);

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_ENDPOINTS.PARSE_RESUME, {
    method: 'POST',
    body: formData,
  });


  if (!response.ok) {
    throw new Error('Failed to parse resume');
  }

  const data = await response.json();

  // Add unique IDs to all items
  return data.blocks.map((item, index) => ({
    ...item,
    id: item.id || `item-${Date.now()}-${index}`,
  }));
};

export const exportResumeToPDF = async (resumeData) => {
  const response = await fetch(API_ENDPOINTS.EXPORT_RESUME, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blocks: resumeData }),
  });

  if (!response.ok) {
    throw new Error('Failed to export resume');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};