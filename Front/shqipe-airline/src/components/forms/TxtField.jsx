import * as React from 'react';
import TextField from '@mui/material/TextField';
import '../../App.css';

function TxtField({ label, value, onChange }) {
  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      className="form-field"
      value={value}          // Pass value prop here
      onChange={onChange}    // Pass onChange prop here
    />
  );
}

export default TxtField;
