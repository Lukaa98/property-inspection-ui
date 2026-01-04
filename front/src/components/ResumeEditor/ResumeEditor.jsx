import { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import LosslessResumeViewer from './LosslessResumeViewer';
import {
  parseResumeFile,
  parseResumeText,
  analyzeResume,
  exportResumeToPDF,
} from '../../services/resumeService';

export default function ResumeEditor() {
  const [layout, setLayout] = useState(null);
  const [semantic, setSemantic] = useState(null);
  const [lineMap, setLineMap] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);

  const handleUpload = async (file) => {
    console.log('Uploading resume…');

    const layoutResult = await parseResumeFile(file);
    console.log('Layout parsed');
    setLayout(layoutResult);

    const textResult = await parseResumeText(layoutResult);
    console.log('Text extracted');

    const analysis = await analyzeResume(textResult);
    console.log('Semantic analysis complete');

    setSemantic(analysis.semantic);
    setLineMap(analysis.line_map);
  };

  const highlightSection = (index) => {
    if (!semantic) return;

    const section = semantic.sections[index];
    const ids = lineMap
      .slice(section.start_line, section.end_line + 1)
      .flat();

    setHighlightedIds(ids);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" component="label">
          Upload Resume
          <input
            hidden
            type="file"
            accept="application/pdf"
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </Button>

        <Button
          variant="contained"
          color="success"
          disabled={!layout}
          onClick={() => exportResumeToPDF(layout)}
        >
          Export PDF
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} mb={2}>
        {semantic?.sections.map((s, i) => (
          <Button
            key={`${s.type}-${i}`}
            size="small"
            onMouseEnter={() => highlightSection(i)}
            onMouseLeave={() => setHighlightedIds([])}
          >
            {s.type}
          </Button>
        ))}
      </Stack>

      {layout && (
        <LosslessResumeViewer
          layout={layout}
          highlightedIds={highlightedIds}
        />
      )}
    </Box>
  );
}
