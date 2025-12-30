import { useState } from 'react';
import {
  Box, TextField, Button, Stack, Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem
} from '@mui/material';
import { parseResumeFile } from '../utils/parseResumeFile';
import { Add, Delete, Edit, SwapHoriz } from '@mui/icons-material';

/* ---------------- Contact Info Section ---------------- */
function ContactInfoSection({ info, onChange, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        mb: 2,
        p: 2,
        borderRadius: '4px',
        border: isHovered ? '2px solid #1976d2' : '2px solid transparent',
        backgroundColor: isHovered ? '#f0f7ff' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      {/* Hover Actions */}
      {isHovered && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => setIsEditing(!isEditing)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Name */}
      {isEditing ? (
        <TextField
          fullWidth
          variant="standard"
          value={info.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          sx={{
            fontSize: '18pt',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 1
          }}
        />
      ) : (
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '18pt',
            mb: 1
          }}
        >
          {info.name || 'YOUR NAME'}
        </Typography>
      )}

      {/* Contact Lines */}
      <Typography
        variant="body2"
        sx={{ textAlign: 'center', color: 'text.secondary' }}
      >
        {info.lines?.join(' ● ') || ''}
      </Typography>
    </Box>
  );
}

/* ---------------- Section Header ---------------- */
function SectionHeader({ text, onRename }) {
  return (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        textTransform: 'uppercase',
        borderBottom: '2px solid #000',
        pb: 0.5,
        mb: 2,
        mt: 3,
        fontSize: '12pt'
      }}
    >
      {text}
    </Typography>
  );
}

/* ---------------- Experience Section ---------------- */
function ExperienceSection({ experience, onChange, onDelete, onReplace }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        mb: 2,
        p: 2,
        borderRadius: '4px',
        border: isHovered ? '2px solid #1976d2' : '2px solid transparent',
        backgroundColor: isHovered ? '#fffef7' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      {/* Hover Actions */}
      {isHovered && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => setIsEditing(!isEditing)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onReplace} color="secondary">
            <SwapHoriz fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Job Title */}
      {isEditing ? (
        <TextField
          fullWidth
          variant="standard"
          value={experience.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          sx={{ fontWeight: 600, fontSize: '11pt', mb: 0.5 }}
        />
      ) : (
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '11pt' }}>
          {experience.title || 'Job Title'}
        </Typography>
      )}

      {/* Company / Location / Dates */}
      {isEditing ? (
        <TextField
          fullWidth
          variant="standard"
          value={experience.header}
          onChange={(e) => onChange('header', e.target.value)}
          sx={{ fontSize: '10pt', mb: 1 }}
        />
      ) : (
        <Typography variant="body2" sx={{ fontSize: '10pt', mb: 1 }}>
          {experience.header}
        </Typography>
      )}

      {/* Bullet Points */}
      <Box>
        {experience.bullets?.map((bullet, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 0.5, alignItems: 'flex-start' }}>
            <Typography sx={{ mr: 1 }}>•</Typography>
            {isEditing ? (
              <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  variant="standard"
                  value={bullet}
                  onChange={(e) => onChange('bullet', e.target.value, idx)}
                  sx={{ fontSize: '10pt' }}
                />
                <IconButton size="small" onClick={() => onChange('deleteBullet', idx)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ flex: 1, fontSize: '10pt', lineHeight: 1.5 }}>
                {bullet}
              </Typography>
            )}
          </Box>
        ))}

        {isEditing && (
          <Button size="small" onClick={() => onChange('addBullet')} startIcon={<Add />} sx={{ mt: 1 }}>
            Add Bullet
          </Button>
        )}
      </Box>
    </Box>
  );
}

/* ---------------- Skills Section ---------------- */
function SkillsSection({ skills, onChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        mb: 2,
        p: 2,
        borderRadius: '4px',
        border: isHovered ? '2px solid #1976d2' : '2px solid transparent',
        backgroundColor: isHovered ? '#f0f7ff' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      {isHovered && (
        <IconButton
          size="small"
          onClick={() => setIsEditing(!isEditing)}
          color="primary"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Edit fontSize="small" />
        </IconButton>
      )}

      {/* Skills as inline text with bullets */}
      <Typography variant="body2" sx={{ fontSize: '10pt' }}>
        {skills.skills?.map((skill, idx) => (
          <span key={idx}>
            {isEditing && (
              <IconButton
                size="small"
                onClick={() => onChange('deleteSkill', idx)}
                sx={{ p: 0, mr: 0.5 }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
            ● {skill}
            {idx < skills.skills.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Typography>

      {isEditing && (
        <TextField
          fullWidth
          size="small"
          placeholder="Add skill (press Enter)"
          sx={{ mt: 1 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              onChange('addSkill', e.target.value.trim());
              e.target.value = '';
            }
          }}
        />
      )}
    </Box>
  );
}

/* ---------------- Education Section ---------------- */
function EducationSection({ education, onChange, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        mb: 2,
        p: 2,
        borderRadius: '4px',
        border: isHovered ? '2px solid #1976d2' : '2px solid transparent',
        backgroundColor: isHovered ? '#f0f7ff' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      {isHovered && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => setIsEditing(!isEditing)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )}

      {isEditing ? (
        <TextField
          fullWidth
          variant="standard"
          value={education.degree}
          onChange={(e) => onChange('degree', e.target.value)}
          sx={{ fontWeight: 600, fontSize: '10pt', mb: 0.5 }}
        />
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '10pt' }}>
          {education.degree}
        </Typography>
      )}

      {education.details?.map((detail, idx) => (
        <Typography key={idx} variant="body2" sx={{ fontSize: '10pt', color: 'text.secondary' }}>
          {detail}
        </Typography>
      ))}
    </Box>
  );
}

/* ---------------- Certificates Section ---------------- */
function CertificatesSection({ certificates, onChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        mb: 2,
        p: 2,
        borderRadius: '4px',
        border: isHovered ? '2px solid #1976d2' : '2px solid transparent',
        backgroundColor: isHovered ? '#f0f7ff' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      {isHovered && (
        <IconButton
          size="small"
          onClick={() => setIsEditing(!isEditing)}
          color="primary"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Edit fontSize="small" />
        </IconButton>
      )}

      <List dense sx={{ p: 0 }}>
        {certificates.certificates?.map((cert, idx) => (
          <ListItem key={idx} sx={{ p: 0, display: 'flex', alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ fontSize: '10pt' }}>
              ● {cert}
            </Typography>
            {isEditing && (
              <IconButton size="small" onClick={() => onChange('deleteCert', idx)} sx={{ ml: 1 }}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

/* ---------------- Replace Dialog ---------------- */
function ReplaceDialog({ open, onClose, templates, onSelect }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Replace with Template</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select a template to replace this experience:
        </Typography>

        <Stack spacing={2}>
          {templates.map((template) => (
            <Paper
              key={template.id}
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
              onClick={() => onSelect(template)}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {template.company} - {template.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                {template.location} | {template.dates}
              </Typography>
              <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                {template.bullets.slice(0, 2).map((bullet, idx) => (
                  <Box key={idx}>• {bullet.substring(0, 60)}...</Box>
                ))}
                {template.bullets.length > 2 && (
                  <Typography variant="caption">+{template.bullets.length - 2} more</Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>

        {templates.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No templates available. Create one first!
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

/* ---------------- Template Item ---------------- */
function TemplateItem({ template, onInsert, onDelete }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {template.company} - {template.title}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        {template.location} | {template.dates}
      </Typography>
      <Box sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 1 }}>
        {template.bullets.slice(0, 2).map((bullet, idx) => (
          <Box key={idx}>• {bullet.length > 60 ? bullet.slice(0, 60) + '...' : bullet}</Box>
        ))}
        {template.bullets.length > 2 && (
          <Typography variant="caption">+{template.bullets.length - 2} more</Typography>
        )}
      </Box>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={() => onInsert(template)}>
          Add to Resume
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(template.id)}>
          Delete
        </Button>
      </Stack>
    </Paper>
  );
}

/* ---------------- Template Editor Form ---------------- */
function TemplateEditor({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    dates: '',
    bullets: [''],
  });

  const updateBullet = (index, value) => {
    const newBullets = [...formData.bullets];
    newBullets[index] = value;
    setFormData({ ...formData, bullets: newBullets });
  };

  const addBullet = () => {
    setFormData({ ...formData, bullets: [...formData.bullets, ''] });
  };

  const removeBullet = (index) => {
    const newBullets = formData.bullets.filter((_, i) => i !== index);
    setFormData({ ...formData, bullets: newBullets });
  };

  return (
    <Paper sx={{ p: 2, mb: 2, border: '2px solid', borderColor: 'primary.main' }}>
      <Typography variant="h6" gutterBottom>
        New Template
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          fullWidth
          size="small"
        />
        <TextField
          label="Job Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          fullWidth
          size="small"
        />
        <TextField
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          fullWidth
          size="small"
        />
        <TextField
          label="Dates"
          value={formData.dates}
          onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
          fullWidth
          size="small"
        />

        <Typography variant="subtitle2">Bullet Points</Typography>

        {formData.bullets.map((bullet, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              multiline
              fullWidth
              value={bullet}
              onChange={(e) => updateBullet(idx, e.target.value)}
              placeholder={`Bullet point ${idx + 1}`}
              size="small"
            />
            <IconButton onClick={() => removeBullet(idx)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Button startIcon={<Add />} onClick={addBullet} variant="outlined">
          Add Bullet
        </Button>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => onSave(formData)}>
            Save Template
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

/* ---------------- Main Editor ---------------- */
export default function ResumeEditor() {
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [replaceDialog, setReplaceDialog] = useState({ open: false, experienceId: null });

  const handleUpload = async (file) => {
    const parsedItems = await parseResumeFile(file);
    setItems(parsedItems);
  };

  const updateItem = (id, field, value, index) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        switch (item.type) {
          case 'contact_info': {
            if (field === 'name') return { ...item, name: value };
            if (field === 'line') {
              const lines = [...item.lines];
              lines[index] = value;
              return { ...item, lines };
            }
            return item;
          }

          case 'experience_group': {
            if (field === 'title') return { ...item, title: value };
            if (field === 'header') return { ...item, header: value };
            if (field === 'bullet') {
              const bullets = [...item.bullets];
              bullets[index] = value;
              return { ...item, bullets };
            }
            if (field === 'addBullet') {
              return { ...item, bullets: [...item.bullets, ''] };
            }
            if (field === 'deleteBullet') {
              return { ...item, bullets: item.bullets.filter((_, i) => i !== index) };
            }
            return item;
          }

          case 'skills_group': {
            if (field === 'addSkill') {
              return { ...item, skills: [...item.skills, value] };
            }
            if (field === 'deleteSkill') {
              return { ...item, skills: item.skills.filter((_, i) => i !== index) };
            }
            return item;
          }

          case 'education_group': {
            if (field === 'degree') return { ...item, degree: value };
            return item;
          }

          case 'certificates_group': {
            if (field === 'deleteCert') {
              return {
                ...item,
                certificates: item.certificates.filter((_, i) => i !== index),
              };
            }
            return item;
          }

          default:
            return item;
        }
      })
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openReplaceDialog = (id) => {
    setReplaceDialog({ open: true, experienceId: id });
  };

  const replaceExperience = (template) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === replaceDialog.experienceId
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

  const saveTemplate = (template) => {
    setTemplates((prev) => [...prev, { ...template, id: Date.now().toString() }]);
    setShowTemplateForm(false);
  };

  const deleteTemplate = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
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

  const handleExportPDF = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8081/export-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blocks: items }),
      });

      if (!response.ok) {
        throw new Error('Failed to export resume');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', gap: 3, p: 3, bgcolor: '#f9f9f9' }}>
      {/* Left - Resume Preview */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>


        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" component="label">
            Upload Resume (PDF)
            <input hidden type="file" accept="application/pdf" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleExportPDF}
            disabled={items.length === 0}
          >
            Export PDF
          </Button>
        </Stack>

        {/* Resume Paper */}
        <Paper
          elevation={3}
          sx={{
            width: '8.5in',
            minHeight: '11in',
            p: '0.75in',
            mx: 'auto',
            bgcolor: 'white',
            fontFamily: '"Times New Roman", serif',
            fontSize: '11pt'
          }}
        >
          {items.map((item) => {
            switch (item.type) {
              case 'contact_info':
                return (
                  <ContactInfoSection
                    key={item.id}
                    info={item}
                    onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
                    onDelete={() => deleteItem(item.id)}
                  />
                );

              case 'section_title':
                return <SectionHeader key={item.id} text={item.text} />;

              case 'experience_group':
                return (
                  <ExperienceSection
                    key={item.id}
                    experience={item}
                    onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
                    onDelete={() => deleteItem(item.id)}
                    onReplace={() => openReplaceDialog(item.id)}
                  />
                );

              case 'skills_group':
                return (
                  <SkillsSection
                    key={item.id}
                    skills={item}
                    onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
                  />
                );

              case 'education_group':
                return (
                  <EducationSection
                    key={item.id}
                    education={item}
                    onChange={(field, value) => updateItem(item.id, field, value)}
                    onDelete={() => deleteItem(item.id)}
                  />
                );

              case 'certificates_group':
                return (
                  <CertificatesSection
                    key={item.id}
                    certificates={item}
                    onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
                  />
                );

              default:
                return null;
            }
          })}
        </Paper>
      </Box>

      {/* Right - Templates */}
      <Box sx={{ width: '400px', overflowY: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Experience Templates
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => setShowTemplateForm(true)}
        >
          New Template
        </Button>

        {showTemplateForm && (
          <TemplateEditor onSave={saveTemplate} onCancel={() => setShowTemplateForm(false)} />
        )}

        <Box sx={{ mt: 2 }}>
          {templates.map((t) => (
            <TemplateItem
              key={t.id}
              template={t}
              onInsert={insertTemplate}
              onDelete={deleteTemplate}
            />
          ))}
        </Box>
      </Box>

      {/* Replace Dialog */}
      <ReplaceDialog
        open={replaceDialog.open}
        onClose={() => setReplaceDialog({ open: false, experienceId: null })}
        templates={templates}
        onSelect={replaceExperience}
      />
    </Box>
  );
}