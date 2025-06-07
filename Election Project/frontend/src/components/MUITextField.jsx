import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import {getValueFromPath, setStateByPath} from "../services/data.js";

export default function MUITextField({label, path, fData, setFData}) {
  const [inputValue, setInputValue] = useState(getValueFromPath(fData, path));

  const handleChange = (e, fData, setFData, path) => {
    setInputValue(e.target.value);
    setStateByPath(setFData, path, e.target.value);
    // console.log(fData);
  }

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" 
      label={label}
       variant="outlined" value={inputValue}
      onChange={ () => {handleChange(event, fData, setFData, path)}}
      />
    </Box>
  );
}