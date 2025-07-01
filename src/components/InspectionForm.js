import React, { useRef, useEffect, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function InspectionForm({ formData, onChange, onSubmit, setMapCenter }) {
  const autocompleteRef = useRef(null);
  const [zipError, setZipError] = useState(false);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ['address'] }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.formatted_address && place.geometry) {
        const components = place.address_components;

        const zip = components?.find(c => c.types.includes('postal_code'))?.long_name;
        const city = components?.find(c => c.types.includes('locality'))?.long_name;

        const allowedZips = [
          '13201', '13202', '13203', '13204', '13205',
          '13206', '13207', '13208', '13209', '13210',
          '13211', '13212', '13214', '13215', '13217',
          '13218', '13219', '13220', '13221', '13224',
          '13225', '13235', '13244', '13250', '13251',
          '13252', '13261', '13290'
        ];

        const isValid =
          city?.toLowerCase() === 'syracuse' &&
          zip &&
          allowedZips.includes(zip);

        if (!isValid) {
          setZipError(true);
          setMapCenter(null); // Clear preview map
          return;
        }

        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        setZipError(false); // valid
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
        error={zipError}
      />
      {zipError && (
        <Typography color="error" variant="body2">
          Only properties in Syracuse, NY ZIP codes are supported.
        </Typography>
      )}
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
      <Button variant="contained" onClick={onSubmit} disabled={zipError}>
        Submit
      </Button>
    </Box>
  );
}

export default InspectionForm;
