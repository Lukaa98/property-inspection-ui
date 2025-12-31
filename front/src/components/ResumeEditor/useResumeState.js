export function useResumeState(items, setItems, setReplaceDialog) {
  const updateItem = (id, field, value, index) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        switch (item.type) {
          case 'contact_info':
            if (field === 'name') return { ...item, name: value };
            if (field === 'line') {
              const lines = [...item.lines];
              lines[index] = value;
              return { ...item, lines };
            }
            return item;

          case 'experience_group':
            if (field === 'title') return { ...item, title: value };
            if (field === 'header') return { ...item, header: value };
            if (field === 'bullet') {
              const bullets = [...item.bullets];
              bullets[index] = value;
              return { ...item, bullets };
            }
            if (field === 'addBullet') return { ...item, bullets: [...item.bullets, ''] };
            if (field === 'deleteBullet') return { ...item, bullets: item.bullets.filter((_, i) => i !== index) };
            return item;

          case 'skills_group':
            if (field === 'addSkill') return { ...item, skills: [...item.skills, value] };
            if (field === 'deleteSkill') return { ...item, skills: item.skills.filter((_, i) => i !== index) };
            return item;

          case 'education_group':
            if (field === 'degree') return { ...item, degree: value };
            return item;

          case 'certificates_group':
            if (field === 'deleteCert') return { ...item, certificates: item.certificates.filter((_, i) => i !== index) };
            return item;

          default:
            return item;
        }
      })
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const insertTemplate = (template) => {
    setItems((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        type: 'experience_group',
        title: template.title,
        header: `${template.company} | ${template.location} | ${template.dates}`,
        bullets: [...template.bullets],
      },
    ]);
  };

  const openReplaceDialog = (id) => {
    setReplaceDialog({ open: true, experienceId: id });
  };

  const replaceExperience = (template) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === setReplaceDialog.experienceId
          ? {
              ...item,
              title: template.title,
              header: `${template.company} | ${template.location} | ${template.dates}`,
              bullets: [...template.bullets],
            }
          : item
      )
    );
    setReplaceDialog({ open: false, experienceId: null });
  };

  return {
    updateItem,
    deleteItem,
    insertTemplate,
    replaceExperience,
    openReplaceDialog,
  };
}