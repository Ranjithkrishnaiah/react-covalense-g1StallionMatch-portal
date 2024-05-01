import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export default function SuccessAlert() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={ { width: '100%' } }>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
             
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Close me!
        </Alert>
      </Collapse>
    </Box>
  );
}
