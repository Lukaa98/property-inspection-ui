import { useState, useEffect } from 'react';
import { Box, Button, Stack, Paper, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { parseResumeFile, exportResumeToPDF } from '../../services/resumeService';
import { getTemplates, saveTemplate as saveTemplateService, deleteTemplate as deleteTemplateService } from '../../services/templateService';
import { ResumeViewer } from './ResumeViewer';
import { TemplatePanel } from './TemplatePanel';
import { useResumeState } from './useResumeState';

export default function ResumeEditor() {
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [replaceDialog, setReplaceDialog] = useState({ open: false, experienceId: null });

  const {
    updateItem,
    deleteItem,
    insertTemplate,
    replaceExperience,
    openReplaceDialog,
  } = useResumeState(items, setItems, setReplaceDialog);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleUpload = async (file) => {
    try {
      const parsedItems = await parseResumeFile(file);
      setItems(parsedItems);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to parse resume.');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportResumeToPDF(items);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF.');
    }
  };

  const saveTemplate = (template) => {
    const saved = saveTemplateService(template);
    setTemplates((prev) => [...prev, saved]);
    setShowTemplateForm(false);
  };

  const deleteTemplate = (id) => {
    deleteTemplateService(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', gap: 3, p: 3, bgcolor: '#f9f9f9' }}>
      {/* Left - Resume */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" component="label">
            Upload Resume
            <input hidden type="file" accept="application/pdf" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </Button>
          <Button variant="contained" color="success" onClick={handleExportPDF} disabled={items.length === 0}>
            Export PDF
          </Button>
        </Stack>

        <ResumeViewer
          items={items}
          updateItem={updateItem}
          deleteItem={deleteItem}
          openReplaceDialog={openReplaceDialog}
        />
      </Box>

      {/* Right - Templates */}
      <TemplatePanel
        templates={templates}
        showTemplateForm={showTemplateForm}
        setShowTemplateForm={setShowTemplateForm}
        saveTemplate={saveTemplate}
        deleteTemplate={deleteTemplate}
        insertTemplate={insertTemplate}
        replaceDialog={replaceDialog}
        setReplaceDialog={setReplaceDialog}
        replaceExperience={replaceExperience}
      />
    </Box>
  );
}