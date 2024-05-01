import { CircularProgress } from '@mui/material';
import { Container, Box } from '@mui/material';

export default function Loader() {
  return (
    <Container>
          <Box style={ { height: "100vh", display: 'flex', alignItems: 'center', justifyContent:'center' } }>
          {/* Green circular loader component */}
          <CircularProgress/>
      </Box>
    </Container>
  );
}