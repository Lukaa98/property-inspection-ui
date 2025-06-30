import React from 'react';
import { TextField, Button, Box } from '@mui/material';

function InspectionForm({ formData, onChange, onSubmit }) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Property Address"
        name="address"
        value={formData.address}
        onChange={onChange}
        fullWidth
      />

      <TextField
        label="Inspection Type"
        name="inspectionType"
        value={formData.inspectionType}
        onChange={onChange}
        fullWidth
      />

      <TextField
        label="Date Needed"
        name="date"
        type="date"
        value={formData.date}
        onChange={onChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <TextField
        label="Requestor Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        fullWidth
      />

      <Button variant="contained" onClick={onSubmit}>
        Submit
      </Button>
    </Box>
  );
}

export default InspectionForm;
