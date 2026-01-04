import { Box } from '@mui/material';

export default function LosslessResumeViewer({
  layout,
  highlightedIds = [],
}) {
  if (!layout?.pages) return null;

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
          {page.elements.map((el) => {
            const isHighlighted = highlightedIds.includes(el.id);

            return (
              <Box
                key={el.id}
                component="span"
                sx={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  fontSize: `${el.font_size}px`,
                  fontWeight: el.is_bold ? 700 : 400,
                  fontStyle: el.is_italic ? 'italic' : 'normal',
                  fontFamily: resolveFont(el.font_name),
                  whiteSpace: 'pre',

                  backgroundColor: isHighlighted
                    ? 'rgba(25,118,210,0.25)'
                    : 'transparent',

                  borderRadius: '2px',
                  transition: 'background-color 0.15s',
                  cursor: el.link ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (el.link) {
                    window.open(el.link, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                {el.text}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

function resolveFont(fontName = '') {
  const name = fontName.toLowerCase();
  if (name.includes('times')) return '"Times New Roman", serif';
  if (name.includes('calibri')) return 'Calibri, Arial, sans-serif';
  if (name.includes('helvetica')) return 'Helvetica, Arial, sans-serif';
  if (name.includes('courier')) return '"Courier New", monospace';
  return 'Arial, sans-serif';
}
