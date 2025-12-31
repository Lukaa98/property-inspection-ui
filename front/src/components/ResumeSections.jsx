import { useState } from 'react';
import { Box, TextField, Button, Stack, Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem } from '@mui/material';
import { Add, Delete, Edit, SwapHoriz } from '@mui/icons-material';

/* ---------------- Contact Info Section ---------------- */
export function ContactInfoSection({ info, onChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} sx={{ position: 'relative', mb: 2, p: 2, borderRadius: '4px', border: isHovered ? '2px solid #1976d2' : '2px solid transparent', backgroundColor: isHovered ? '#f0f7ff' : 'transparent', transition: 'all 0.2s' }}>
      {isHovered && (
        <IconButton size="small" onClick={() => setIsEditing(!isEditing)} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Edit fontSize="small" />
        </IconButton>
      )}
      {isEditing ? (
        <TextField fullWidth variant="standard" value={info.name || ''} onChange={(e) => onChange('name', e.target.value)} sx={{ fontSize: '18pt', fontWeight: 'bold', textAlign: 'center', mb: 1 }} />
      ) : (
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '18pt', mb: 1 }}>{info.name || 'YOUR NAME'}</Typography>
      )}
      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>{info.lines?.join(' ● ') || ''}</Typography>
    </Box>
  );
}

/* ---------------- Section Header ---------------- */
export function SectionHeader({ text }) {
  return <Typography variant="h6" sx={{ fontWeight: 700, textTransform: 'uppercase', borderBottom: '2px solid #000', pb: 0.5, mb: 2, mt: 3, fontSize: '12pt' }}>{text}</Typography>;
}

/* ---------------- Experience Section ---------------- */
export function ExperienceSection({ experience, onChange, onDelete, onReplace }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} sx={{ position: 'relative', mb: 2, p: 2, borderRadius: '4px', border: isHovered ? '2px solid #1976d2' : '2px solid transparent', backgroundColor: isHovered ? '#fffef7' : 'transparent', transition: 'all 0.2s' }}>
      {isHovered && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => setIsEditing(!isEditing)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" onClick={onReplace}><SwapHoriz fontSize="small" /></IconButton>
          <IconButton size="small" onClick={onDelete}><Delete fontSize="small" /></IconButton>
        </Box>
      )}
      {isEditing ? (
        <TextField fullWidth variant="standard" value={experience.title || ''} onChange={(e) => onChange('title', e.target.value)} sx={{ fontWeight: 600, fontSize: '11pt', mb: 0.5 }} />
      ) : (
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '11pt' }}>{experience.title || 'Job Title'}</Typography>
      )}
      {isEditing ? (
        <TextField fullWidth variant="standard" value={experience.header} onChange={(e) => onChange('header', e.target.value)} sx={{ fontSize: '10pt', mb: 1 }} />
      ) : (
        <Typography variant="body2" sx={{ fontSize: '10pt', mb: 1 }}>{experience.header}</Typography>
      )}
      <Box>
        {experience.bullets?.map((bullet, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 0.5, alignItems: 'flex-start' }}>
            <Typography sx={{ mr: 1 }}>•</Typography>
            {isEditing ? (
              <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                <TextField fullWidth multiline variant="standard" value={bullet} onChange={(e) => onChange('bullet', e.target.value, idx)} sx={{ fontSize: '10pt' }} />
                <IconButton size="small" onClick={() => onChange('deleteBullet', idx)}><Delete fontSize="small" /></IconButton>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ flex: 1, fontSize: '10pt', lineHeight: 1.5 }}>{bullet}</Typography>
            )}
          </Box>
        ))}
        {isEditing && <Button size="small" onClick={() => onChange('addBullet')} startIcon={<Add />} sx={{ mt: 1 }}>Add Bullet</Button>}
      </Box>
    </Box>
  );
}

/* ---------------- Skills Section ---------------- */
export function SkillsSection({ skills, onChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} sx={{ position: 'relative', mb: 2, p: 2, borderRadius: '4px', border: isHovered ? '2px solid #1976d2' : '2px solid transparent', backgroundColor: isHovered ? '#f0f7ff' : 'transparent', transition: 'all 0.2s' }}>
      {isHovered && <IconButton size="small" onClick={() => setIsEditing(!isEditing)} sx={{ position: 'absolute', top: 8, right: 8 }}><Edit fontSize="small" /></IconButton>}
      <Typography variant="body2" sx={{ fontSize: '10pt' }}>
        {skills.skills?.map((skill, idx) => (
          <span key={idx}>
            {isEditing && <IconButton size="small" onClick={() => onChange('deleteSkill', idx)} sx={{ p: 0, mr: 0.5 }}><Delete fontSize="small" /></IconButton>}
            ● {skill}{idx < skills.skills.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Typography>
      {isEditing && <TextField fullWidth size="small" placeholder="Add skill (press Enter)" sx={{ mt: 1 }} onKeyPress={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { onChange('addSkill', e.target.value.trim()); e.target.value = ''; }}} />}
    </Box>
  );
}

/* ---------------- Education Section ---------------- */
export function EducationSection({ education, onChange, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} sx={{ position: 'relative', mb: 2, p: 2, borderRadius: '4px', border: isHovered ? '2px solid #1976d2' : '2px solid transparent', backgroundColor: isHovered ? '#f0f7ff' : 'transparent', transition: 'all 0.2s' }}>
      {isHovered && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => setIsEditing(!isEditing)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" onClick={onDelete}><Delete fontSize="small" /></IconButton>
        </Box>
      )}
      {isEditing ? (
        <TextField fullWidth variant="standard" value={education.degree} onChange={(e) => onChange('degree', e.target.value)} sx={{ fontWeight: 600, fontSize: '10pt', mb: 0.5 }} />
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '10pt' }}>{education.degree}</Typography>
      )}
      {education.details?.map((detail, idx) => <Typography key={idx} variant="body2" sx={{ fontSize: '10pt', color: 'text.secondary' }}>{detail}</Typography>)}
    </Box>
  );
}

/* ---------------- Certificates Section ---------------- */
export function CertificatesSection({ certificates, onChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} sx={{ position: 'relative', mb: 2, p: 2, borderRadius: '4px', border: isHovered ? '2px solid #1976d2' : '2px solid transparent', backgroundColor: isHovered ? '#f0f7ff' : 'transparent', transition: 'all 0.2s' }}>
      {isHovered && <IconButton size="small" onClick={() => setIsEditing(!isEditing)} sx={{ position: 'absolute', top: 8, right: 8 }}><Edit fontSize="small" /></IconButton>}
      <List dense sx={{ p: 0 }}>
        {certificates.certificates?.map((cert, idx) => (
          <ListItem key={idx} sx={{ p: 0, display: 'flex', alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ fontSize: '10pt' }}>● {cert}</Typography>
            {isEditing && <IconButton size="small" onClick={() => onChange('deleteCert', idx)} sx={{ ml: 1 }}><Delete fontSize="small" /></IconButton>}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

/* ---------------- Replace Dialog ---------------- */
export function ReplaceDialog({ open, onClose, templates, onSelect }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Replace with Template</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Select a template:</Typography>
        <Stack spacing={2}>
          {templates.map((t) => (
            <Paper key={t.id} sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }} onClick={() => onSelect(t)}>
              <Typography variant="subtitle1" fontWeight="bold">{t.company} - {t.title}</Typography>
              <Typography variant="caption" color="text.secondary">{t.location} | {t.dates}</Typography>
            </Paper>
          ))}
        </Stack>
        {templates.length === 0 && <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No templates available.</Typography>}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cancel</Button></DialogActions>
    </Dialog>
  );
}

/* ---------------- Template Item ---------------- */
export function TemplateItem({ template, onInsert, onDelete }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold">{template.company} - {template.title}</Typography>
      <Typography variant="caption" color="text.secondary">{template.location} | {template.dates}</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button size="small" onClick={() => onInsert(template)}>Add</Button>
        <Button size="small" color="error" onClick={onDelete}>Delete</Button>
      </Stack>
    </Paper>
  );
}

/* ---------------- Template Editor ---------------- */
export function TemplateEditor({ onSave, onCancel }) {
  const [data, setData] = useState({ company: '', title: '', location: '', dates: '', bullets: [''] });

  const updateBullet = (i, val) => {
    const b = [...data.bullets];
    b[i] = val;
    setData({ ...data, bullets: b });
  };

  return (
    <Paper sx={{ p: 2, mb: 2, border: '2px solid', borderColor: 'primary.main' }}>
      <Typography variant="h6" gutterBottom>New Template</Typography>
      <Stack spacing={2}>
        <TextField label="Company" value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} fullWidth size="small" />
        <TextField label="Job Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} fullWidth size="small" />
        <TextField label="Location" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} fullWidth size="small" />
        <TextField label="Dates" value={data.dates} onChange={(e) => setData({ ...data, dates: e.target.value })} fullWidth size="small" />
        <Typography variant="subtitle2">Bullet Points</Typography>
        {data.bullets.map((b, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1 }}>
            <TextField multiline fullWidth value={b} onChange={(e) => updateBullet(i, e.target.value)} size="small" />
            <IconButton onClick={() => setData({ ...data, bullets: data.bullets.filter((_, idx) => idx !== i) })}><Delete /></IconButton>
          </Box>
        ))}
        <Button startIcon={<Add />} onClick={() => setData({ ...data, bullets: [...data.bullets, ''] })} variant="outlined">Add Bullet</Button>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => onSave(data)}>Save</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}