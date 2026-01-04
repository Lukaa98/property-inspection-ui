import { useState, useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material';

import { parseResumeFile, exportResumeToPDF } from '../../services/resumeService';
import {
  getTemplates,
  saveTemplate as saveTemplateService,
  deleteTemplate as deleteTemplateService,
} from '../../services/templateService';

import LosslessResumeViewer from './LosslessResumeViewer';
import { ResumeViewer } from './ResumeViewer';
import { TemplatePanel } from './TemplatePanel';
import { useResumeState } from './useResumeState';

export default function ResumeEditor() {
  // 🔒 Raw PDF layout
  const [layout, setLayout] = useState(null);

  // ✏️ Semantic blocks (LLM / future)
  const [items, setItems] = useState([]);

  const [templates, setTemplates] = useState([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const [replaceDialog, setReplaceDialog] = useState({
    open: false,
    experienceId: null,
  });

  const {
    updateItem,
    deleteItem,
    insertTemplate,
    replaceExperience,
    openReplaceDialog,
  } = useResumeState(items, setItems, replaceDialog, setReplaceDialog);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    const loadedTemplates = getTemplates() || [];
    console.log('[ResumeEditor] Loaded templates:', loadedTemplates);
    setTemplates(loadedTemplates);
  }, []);

  /* ---------------- UPLOAD ---------------- */

  const handleUpload = async (file) => {
    console.log('[ResumeEditor] Uploading:', file?.name);

    try {
      const result = await parseResumeFile(file);
      console.log('[ResumeEditor] parseResumeFile result:', result);

      // Backend currently returns ONLY lossless layout
      const nextLayout =
        result?.layout ??
        (result?.pages ? result : null);

      const nextBlocks = Array.isArray(result?.blocks)
        ? result.blocks
        : [];

      console.log('[ResumeEditor] layout set:', !!nextLayout);
      console.log('[ResumeEditor] semantic blocks count:', nextBlocks.length);

      setLayout(nextLayout);
      setItems(nextBlocks);
    } catch (err) {
      console.error('[ResumeEditor] Upload failed:', err);
      alert('Failed to parse resume');
    }
  };

  /* ---------------- EXPORT ---------------- */

  const handleExportPDF = async () => {
    console.log('[ResumeEditor] Export PDF clicked');

    try {
      await exportResumeToPDF({ blocks: items });
    } catch (err) {
      console.error('[ResumeEditor] Export failed:', err);
      alert('Failed to export PDF');
    }
  };

  /* ---------------- TEMPLATE OPS ---------------- */

  const saveTemplate = (template) => {
    const saved = saveTemplateService(template);
    console.log('[ResumeEditor] Template saved:', saved);
    setTemplates((prev) => [...prev, saved]);
    setShowTemplateForm(false);
  };

  const deleteTemplate = (id) => {
    deleteTemplateService(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  /* ---------------- RENDER ---------------- */

  const hasSemanticBlocks =
    Array.isArray(items) && items.length > 0;

  console.log('[ResumeEditor] Render state:', {
    hasLayout: !!layout,
    hasSemanticBlocks,
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh', gap: 3, p: 3 }}>
      {/* LEFT SIDE */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" component="label">
            Upload Resume
            <input
              hidden
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                e.target.files && handleUpload(e.target.files[0])
              }
            />
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleExportPDF}
            disabled={!hasSemanticBlocks}
          >
            Export PDF
          </Button>
        </Stack>

        {/* VIEWER SWITCH */}
        {hasSemanticBlocks ? (
          <>
            {console.log('[ResumeEditor] Rendering ResumeViewer')}
            <ResumeViewer
              items={items}
              updateItem={updateItem}
              deleteItem={deleteItem}
              openReplaceDialog={openReplaceDialog}
            />
          </>
        ) : (
          <>
            {console.log('[ResumeEditor] Rendering LosslessResumeViewer')}
            {layout && <LosslessResumeViewer layout={layout} />}
          </>
        )}
      </Box>

      {/* RIGHT SIDE */}
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
        disabled={!hasSemanticBlocks}
      />
    </Box>
  );
}
