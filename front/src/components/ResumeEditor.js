import { useState } from 'react';
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  Stack,
  Button,
} from '@mui/material';

import { parseResumeFile } from '../utils/parseResumeFile';

export default function ResumeEditor() {
  const [blocks, setBlocks] = useState([]);

  const handleUpload = async (file) => {
    const parsedBlocks = await parseResumeFile(file);
    setBlocks(parsedBlocks);
  };

  return (
    <Stack spacing={2}>
      <Button variant="contained" component="label">
        Upload Resume
        <input
          hidden
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      </Button>

      {blocks.map((block) => (
        <Paper key={block.id} variant="outlined" sx={{ p: 2 }}>
          <Select
            size="small"
            value={block.type}
            onChange={(e) =>
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === block.id
                    ? { ...b, type: e.target.value }
                    : b
                )
              )
            }
            sx={{ mb: 1 }}
          >
            <MenuItem value="unknown">Unknown</MenuItem>
            <MenuItem value="section_title">Section Title</MenuItem>
            <MenuItem value="experience_header">Experience Header</MenuItem>
            <MenuItem value="experience_bullet">Experience Bullet</MenuItem>
            <MenuItem value="skills">Skills</MenuItem>
            <MenuItem value="education">Education</MenuItem>
            <MenuItem value="misc">Misc</MenuItem>
          </Select>

          <TextField
            fullWidth
            multiline
            value={block.text}
            onChange={(e) =>
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === block.id
                    ? { ...b, text: e.target.value }
                    : b
                )
              )
            }
          />
        </Paper>
      ))}
    </Stack>
  );
}
