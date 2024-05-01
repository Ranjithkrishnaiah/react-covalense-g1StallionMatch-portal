import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  background: '#FFFFFF',
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1D472E' : '#1D472E',
  },
}));

const BorderLinearProgressRed = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  background: '#FFFFFF',
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#C75227' : '#C75227',
  },
}));

// Inspired by the former Facebook spinners.

export default function CustomizedProgressBars(props : any) {
  return (
    <Box sx={ { flexGrow: 1 } }>
      {props?.profileRating > 25 && <BorderLinearProgress variant="determinate" value={props?.profileRating} />}
      {props?.profileRating <= 25 && <BorderLinearProgressRed variant="determinate" value={props?.profileRating} />}
    </Box>
  );
}
