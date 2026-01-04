import { Box } from '@mui/material';

/**
 * Renders raw PDF layout exactly as extracted from backend.
 * Lossless, no semantics, no editing.
 */
export default function LosslessResumeViewer({ layout }) {
  if (!layout || !layout.pages?.length) return null;

  return (
    <Box sx={{ overflowX: 'auto' }}>
      {layout.pages.map((page) => (
        <Box
          key={page.page_number}
          sx={{
            position: 'relative',
            width: `${page.width}px`,
            height: `${page.height}px`,
            bgcolor: 'white',
            boxShadow: 3,
            mb: 4,
          }}
        >
          {page.elements.map((el) => (
            <Box
              key={el.id}
              component="span"
              sx={{
                position: 'absolute',
                left: `${el.x}px`,
                top: `${el.y}px`, // ✅ correct

                fontSize: `${el.font_size}px`,
                fontWeight: el.is_bold ? 700 : 400,
                fontStyle: el.is_italic ? 'italic' : 'normal',
                fontFamily: resolveFont(el.font_name),
                color: el.color || '#000',
                textDecoration: el.is_underlined ? 'underline' : 'none',

                whiteSpace: 'pre',
                cursor: el.link ? 'pointer' : 'default',
                zIndex: el.z_index ?? 1,
              }}
              onClick={() => {
                if (el.link) {
                  window.open(el.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {el.text}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

function resolveFont(fontName = '') {
  const name = fontName.toLowerCase();

  if (name.includes('times')) return '"Times New Roman", Times, serif';
  if (name.includes('calibri')) return 'Calibri, Arial, sans-serif';
  if (name.includes('helvetica')) return 'Helvetica, Arial, sans-serif';
  if (name.includes('courier')) return '"Courier New", monospace';

  return 'Arial, sans-serif';
}
