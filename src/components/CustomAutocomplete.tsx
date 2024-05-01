import { Autocomplete, TextField, SxProps } from '@mui/material';
import { Box } from '@mui/system';
import React, { forwardRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface AutoCompleteProps {
  placeholder: string;
  value?: any;
  options: any;
  popupIcon?: any;
  sx?: SxProps;
  getOptionLabel?: any;
  className?: string;
  noOptionsText?: any;
  renderOption?: any;
  onInputChange? : (e:any) => void;
  onChange? : (e:any,selectedOptions: any) => void;
  multiple? : boolean;
  defaultValue? : any;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}
const CustomAutocomplete = forwardRef< React.MutableRefObject<any>, AutoCompleteProps>((props, ref) => {
    return (
        <Box>
        <Autocomplete
        ChipProps={{ deleteIcon: <CloseIcon /> }}
        multiple={props.multiple || false}
        fullWidth
        {...props}
        disablePortal
        autoComplete
        id={`customAutocomplete ${props.placeholder}`}
        renderInput={(params) => <TextField {...params} placeholder={props.placeholder}/>}
        ref = { ref }
      />
      </Box>
    );
  })

export default CustomAutocomplete;