import { Box, CircularProgress } from '@mui/material';

export function Spinner() {
  return <Box className='circular-progress-wrapper'><CircularProgress className='circular-progress'/></Box>;

}