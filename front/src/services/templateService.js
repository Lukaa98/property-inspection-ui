// Future: Store templates in backend or local storage
export const saveTemplate = (template) => {
  const templates = getTemplates();
  const newTemplate = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  templates.push(newTemplate);
  localStorage.setItem('resume_templates', JSON.stringify(templates));
  
  return newTemplate;
};

export const getTemplates = () => {
  const stored = localStorage.getItem('resume_templates');
  return stored ? JSON.parse(stored) : [];
};

export const deleteTemplate = (id) => {
  const templates = getTemplates().filter(t => t.id !== id);
  localStorage.setItem('resume_templates', JSON.stringify(templates));
};