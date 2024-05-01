import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'

function CustomDropdown() {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
    return (
        <FormControl sx={ { m: 1, minWidth: 120 } } size="small">
        <InputLabel id="demo-select-small">Age</InputLabel>
        <Select
         className='selectDropDownBox'
          labelId="demo-select-small"
          id="demo-select-small"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem className='selectDropDownList' value="">
            <em>None</em>
          </MenuItem>
          <MenuItem className='selectDropDownList' value={10}>Ten</MenuItem>
          <MenuItem className='selectDropDownList' value={20}>Twenty</MenuItem>
          <MenuItem className='selectDropDownList' value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    );
}

export default CustomDropdown;