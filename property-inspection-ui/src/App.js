import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import InspectionForm from './components/InspectionForm';
import { generateInspectionPDF } from './utils/pdfUtils';

function App() {
  const [formData, setFormData] = useState({
    address: '',
    inspectionType: '',
    date: '',
    email: '',
  });

  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const url = await generateInspectionPDF(formData);
    setPdfUrl(url);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Property Inspection Request
      </Typography>

      <InspectionForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {pdfUrl && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            PDF Preview (This is what will be sent)
          </Typography>
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="PDF Preview"
            style={{ border: '1px solid #ccc' }}
          />
        </Box>
      )}
    </Container>
  );
}

export default App;
