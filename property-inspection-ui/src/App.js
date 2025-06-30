import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function App() {
  const [formData, setFormData] = useState({
    address: '',
    inspectionType: '',
    date: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const { address, inspectionType, date, email } = formData;

    const subject = 'Property Inspection Request';
    const body = `Address: ${address}\nInspection Type: ${inspectionType}\nDate Needed: ${date}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Property Inspection Request
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Property Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Inspection Type"
          name="inspectionType"
          value={formData.inspectionType}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Date Needed"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Requestor Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default App;
