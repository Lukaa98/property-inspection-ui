import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';
import InspectionForm from './components/InspectionForm';
import { generateInspectionPDF } from './utils/pdfUtils';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function App() {
  const [formData, setFormData] = useState({
    address: '',
    inspectionType: '',
    date: '',
    email: '',
  });

  const [mapCenter, setMapCenter] = useState(null); // for map + PDF
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const url = await generateInspectionPDF(formData, mapCenter);
    setPdfUrl(url);
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Property Inspection Request
        </Typography>

        <InspectionForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          setMapCenter={setMapCenter}
        />

        {mapCenter && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Location Preview
            </Typography>
            <iframe
              title="Google Map"
              width="100%"
              height="300"
              style={{ border: '1px solid #ccc' }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${mapCenter.lat},${mapCenter.lng}`}
            />
          </Box>
        )}

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
    </LoadScript>
  );
}

export default App;
