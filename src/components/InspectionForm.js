import React, { useRef, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

function InspectionForm({ formData, onChange, onSubmit, setMapCenter }) {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ['address'] }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address && place.geometry) {
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        onChange({
          target: {
            name: 'address',
            value: place.formatted_address,
          },
        });

        setMapCenter({ lat, lng });
      }
    });
  }, [onChange, setMapCenter]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Property Address"
        name="address"
        inputRef={autocompleteRef}
        defaultValue={formData.address}
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
