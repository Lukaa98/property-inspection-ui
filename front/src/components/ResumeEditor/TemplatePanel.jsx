import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { TemplateItem, TemplateEditor, ReplaceDialog } from '../ResumeSections';

export function TemplatePanel({
  templates,
  showTemplateForm,
  setShowTemplateForm,
  saveTemplate,
  deleteTemplate,
  insertTemplate,
  replaceDialog,
  setReplaceDialog,
  replaceExperience,
}) {
  return (
    <>
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
          <TemplateEditor
            onSave={saveTemplate}
            onCancel={() => setShowTemplateForm(false)}
          />
        )}

        <Box sx={{ mt: 2 }}>
          {templates.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No templates saved yet.
            </Typography>
          )}

          {templates.map((t) => (
            <TemplateItem
              key={t.id}
              template={t}
              onInsert={insertTemplate}
              onDelete={() => deleteTemplate(t.id)}
            />
          ))}
        </Box>
      </Box>

      <ReplaceDialog
        open={replaceDialog.open}
        onClose={() => setReplaceDialog({ open: false, experienceId: null })}
        templates={templates}
        onSelect={replaceExperience}
      />
    </>
  );
}
