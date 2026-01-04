import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import { Edit, Delete, SwapHoriz } from '@mui/icons-material';

export function ExperienceSection({
  experience,
  onChange,
  onDelete,
  onReplace,
}) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        mb: 2,
        p: 1,
        borderRadius: 1,
        border: hovered ? '2px solid #1976d2' : '2px solid transparent',
        transition: 'border 0.2s',
      }}
    >
      {/* Hover actions */}
      {hovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            display: 'flex',
            gap: 1,
            zIndex: 10,
          }}
        >
          <IconButton size="small" onClick={() => setEditing(!editing)}>
            <Edit fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={onReplace}>
            <SwapHoriz fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={onDelete}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Title */}
      {editing ? (
        <TextField
          variant="standard"
          fullWidth
          value={experience.title}
          onChange={(e) => onChange('title', e.target.value)}
          sx={{ fontWeight: 600 }}
        />
      ) : (
        <Typography fontWeight={600}>
          {experience.title}
        </Typography>
      )}

      {/* Header */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        {experience.header}
      </Typography>

      {/* Bullets */}
      {experience.bullets?.map((b, i) => (
        <Typography key={i} variant="body2" sx={{ ml: 2 }}>
          • {b}
        </Typography>
      ))}
    </Box>
  );
}
