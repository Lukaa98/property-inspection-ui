import { useState } from 'react';
import {
  Box, TextField, Button, Stack, Paper, IconButton, Typography,
  Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemButton, ListItemText
} from '@mui/material';
import { parseResumeFile } from '../utils/parseResumeFile';
import { Add, Delete, Edit, CheckCircle, SwapHoriz, Email, Phone, Person } from '@mui/icons-material';

/* ---------------- Contact Info Card ---------------- */
function ContactInfoCard({ info, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Person sx={{ mr: 1, fontSize: 32 }} />
        {isEditing ? (
          <TextField
            fullWidth
            variant="standard"
            value={info.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            sx={{
              input: { color: 'white', fontSize: '24pt', fontWeight: 'bold' }
            }}
          />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {info.name || 'Your Name'}
          </Typography>
        )}
      </Box>

      <Stack spacing={1}>
        {info.lines?.map((line, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
            {line.includes('@') ? <Email sx={{ mr: 1, fontSize: 18 }} /> : <Phone sx={{ mr: 1, fontSize: 18 }} />}
            {isEditing ? (
              <TextField
                fullWidth
                variant="standard"
                value={line}
                onChange={(e) => onChange('line', e.target.value, idx)}
                sx={{ input: { color: 'white' } }}
              />
            ) : (
              <Typography>{line}</Typography>
            )}
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Button
          size="small"
          onClick={() => setIsEditing(!isEditing)}
          sx={{ color: 'white', borderColor: 'white' }}
          variant="outlined"
        >
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </Box>
    </Paper>
  );
}

/* ---------------- Skills Card ---------------- */
function SkillsCard({ skills, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Skills
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills.skills?.map((skill, idx) => (
          <Chip
            key={idx}
            label={skill}
            onDelete={isEditing ? () => onChange('deleteSkill', idx) : undefined}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      {isEditing && (
        <TextField
          fullWidth
          size="small"
          placeholder="Add new skill (press Enter)"
          sx={{ mt: 2 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              onChange('addSkill', e.target.value.trim());
              e.target.value = '';
            }
          }}
        />
      )}

      <Box sx={{ mt: 2 }}>
        <Button size="small" variant="outlined" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </Box>
    </Paper>
  );
}

/* ---------------- Education Card ---------------- */
function EducationCard({ education, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          {isEditing ? (
            <TextField
              fullWidth
              variant="standard"
              value={education.degree}
              onChange={(e) => onChange('degree', e.target.value)}
              sx={{ mb: 1, fontWeight: 600 }}
            />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {education.degree}
            </Typography>
          )}

          {education.details?.map((detail, idx) => (
            <Typography key={idx} variant="body2" color="text.secondary">
              {detail}
            </Typography>
          ))}
        </Box>

        <IconButton size="small" onClick={onDelete} color="error">
          <Delete fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button size="small" variant="outlined" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </Box>
    </Paper>
  );
}

/* ---------------- Certificates Card ---------------- */
function CertificatesCard({ certificates, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Certificates
      </Typography>

      <List dense>
        {certificates.certificates?.map((cert, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemText primary={`• ${cert}`} />
            {isEditing && (
              <IconButton size="small" onClick={() => onChange('deleteCert', idx)}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 2 }}>
        <Button size="small" variant="outlined" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </Box>
    </Paper>
  );
}

/* ---------------- Experience Card ---------------- */
function ExperienceCard({ experience, onChange, onDelete, onReplace }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        position: 'relative',
        '&:hover .action-buttons': { opacity: 1 },
      }}
    >
      {/* Action Buttons */}
      <Box
        className="action-buttons"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 1,
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        {/* <Chip 
          icon={<CheckCircle />} 
          label="Looks good" 
          size="small" 
          color="success" 
          variant="outlined"
        />
        <IconButton size="small" onClick={() => setIsEditing(!isEditing)} color="primary">
          <Edit fontSize="small" />
        </IconButton> */}
        <IconButton size="small" onClick={onReplace} color="secondary">
          <SwapHoriz fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={onDelete} color="error">
          <Delete fontSize="small" />
        </IconButton>
      </Box>

      {/* Job Title */}
      <Box sx={{ mb: 2 }}>
        {isEditing ? (
          <TextField
            fullWidth
            variant="standard"
            value={experience.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            sx={{ fontWeight: 600, fontSize: '14pt' }}
          />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {experience.title || 'Job Title'}
          </Typography>
        )}
      </Box>

      {/* Company + Location + Dates */}
      {isEditing ? (
        <TextField
          fullWidth
          variant="standard"
          value={experience.header}
          onChange={(e) => onChange('header', e.target.value)}
          sx={{ mb: 2 }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {experience.header}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Bullet Points */}
      <Box>
        {experience.bullets?.map((bullet, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 1, alignItems: 'flex-start' }}>
            <Typography sx={{ mr: 1, mt: '2px' }}>•</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                variant="standard"
                value={bullet}
                onChange={(e) => onChange('bullet', e.target.value, idx)}
                sx={{ fontSize: '13pt' }}
              />
            ) : (
              <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.6 }}>
                {bullet}
              </Typography>
            )}
            {isEditing && (
              <IconButton size="small" onClick={() => onChange('deleteBullet', idx)}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
        {isEditing && (
          <Button size="small" onClick={() => onChange('addBullet')} startIcon={<Add />}>
            Add Bullet
          </Button>
        )}
      </Box>

      {/* Footer Actions */}
      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
        <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </Button>
        <Button size="small" variant="outlined" color="secondary" startIcon={<SwapHoriz />} onClick={onReplace}>
          Replace
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={onDelete}>
          Delete
        </Button>
      </Box>
    </Paper>
  );
}

/* ---------------- Replace Dialog ---------------- */
function ReplaceDialog({ open, onClose, templates, onSelect }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Replace with Template</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select a template to replace this experience with:
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

/* ---------------- Section Title ---------------- */
function SectionTitle({ text }) {
  return (
    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        color: '#1976d2',
        borderBottom: '3px solid #1976d2',
        pb: 1,
        mb: 3,
        mt: 4
      }}
    >
      {text}
    </Typography>
  );
}
/* ---------------- Main Editor ---------------- */
export default function ResumeEditor() {
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [replaceDialog, setReplaceDialog] = useState({ open: false, experienceId: null });

  /* ---------- Upload ---------- */
  const handleUpload = async (file) => {
    const parsedItems = await parseResumeFile(file);
    setItems(parsedItems);
  };

  /* ---------- Update Item ---------- */
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

  /* ---------- Delete Item ---------- */
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* ---------- Replace Experience ---------- */
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

  /* ---------- Templates ---------- */
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

  /* ---------- Render ---------- */
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <SectionTitle text="Resume Editor" />
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" component="label">
          Upload Resume (PDF)
          <input hidden type="file" accept="application/pdf" onChange={(e) => handleUpload(e.target.files[0])} />
        </Button>

        <Button variant="contained" color="success" onClick={() => window.print()}>
          Export Resume (PDF)
        </Button>
      </Box>

      <Box className="print-container">
        {items.map((item) => {
          switch (item.type) {
            case 'contact_info':
              return (
                <ContactInfoCard
                  key={item.id}
                  info={item}
                  onChange={(field, value, idx) =>
                    updateItem(item.id, field, value, idx)
                  }
                  onDelete={() => deleteItem(item.id)}
                />
              );

            case 'section_title':
              return <SectionTitle key={item.id} text={item.text} />;

            case 'experience_group':
              return (
                <ExperienceCard
                  key={item.id}
                  experience={item}
                  onChange={(field, value, idx) =>
                    updateItem(item.id, field, value, idx)
                  }
                  onDelete={() => deleteItem(item.id)}
                  onReplace={() => openReplaceDialog(item.id)}
                />
              );

            case 'skills_group':
              return (
                <SkillsCard
                  key={item.id}
                  skills={item}
                  onChange={(field, value, idx) =>
                    updateItem(item.id, field, value, idx)
                  }
                />
              );

            case 'education_group':
              return (
                <EducationCard
                  key={item.id}
                  education={item}
                  onChange={(field, value) =>
                    updateItem(item.id, field, value)
                  }
                  onDelete={() => deleteItem(item.id)}
                />
              );

            case 'certificates_group':
              return (
                <CertificatesCard
                  key={item.id}
                  certificates={item}
                  onChange={(field, value, idx) =>
                    updateItem(item.id, field, value, idx)
                  }
                />
              );

            default:
              return null;
          }
        })}
      </Box>


      {/* Templates */}
      <Box className="no-print">
        <SectionTitle text="Experience Templates" />

        {showTemplateForm ? (
          <TemplateEditor onSave={saveTemplate} onCancel={() => setShowTemplateForm(false)} />
        ) : (
          <Button variant="outlined" onClick={() => setShowTemplateForm(true)}>
            Create New Template
          </Button>
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
