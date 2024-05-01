import { Box, Button, StyledEngineProvider, Typography } from '@mui/material'
import './noData.css'; 
export default function NoDataComponent(props:any) {

  return (
    
    <StyledEngineProvider injectFirst>
    <Box className='noResult'
      sx={ {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        
      } }
    >
      <Typography variant="h3">No results </Typography>
      <Typography> Try clearing the filters and searching again.</Typography>
      <Button
          className='clearStyleBtn' onClick = {props.clearAll}>
          Clear filter
        </Button>
    </Box>
    </StyledEngineProvider>
  );
}
