import { StyledEngineProvider, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';

function OverlapLegendModal() {    
  return (
    <StyledEngineProvider injectFirst> 
         <Box className='legent-modal-pop-box' mt={4}>           
           <Box>
            <Typography variant='h4'>What is the Pedigree Overlap?</Typography>
            <Typography component="p">You can visualise the similarities of your hypothetical mating compared to a selected stakeswinner. In other words, identify all matching ancestors within 5 generations on both the sire and broodmare’s side.</Typography>
           </Box>         
           <Box mt={3}>
              <Stack className='legend-modal-list'>
                 <Box className='color-legend' sx={ { background: "#00DE8E" } } />
                 <Typography component="p">Light green areas indicate ancestors found in the same half of the pedigree but in a different position.</Typography>
              </Stack>
              <Stack className='legend-modal-list'>
                 <Box className='color-legend' sx={ { background: "#007142" } } />
                 <Typography component="p">Dark green areas indicate those sections of the pedigree which match exactly between the hypothetical mating and the stakeswinner.</Typography>
              </Stack>
           </Box>
        </Box>
    </StyledEngineProvider>
  )
}
export default OverlapLegendModal;