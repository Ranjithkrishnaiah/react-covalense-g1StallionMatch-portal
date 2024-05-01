import Skeleton from '@mui/material/Skeleton';
import { Container, Grid, Box, Stack } from '@mui/material';

export default function CustomSkeleton() {
  return (
   
       <Skeleton variant='rectangular' height={500} sx={ {borderRadius: '8px'} }>
        </Skeleton>

  );
}