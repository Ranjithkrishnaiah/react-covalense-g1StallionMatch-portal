import { StyledEngineProvider, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';

function LegendModal() {    
  return (
    <StyledEngineProvider injectFirst> 
         <Box className='legent-modal-pop-box' mt={4}>
           {/* Legend component used in stallion search */}
           <Box>
            <Typography variant='h4'>What is Stallion Match?</Typography>
            <Typography component="p">Find the perfect match for your mare by identifying successful patterns found in superior race horses.</Typography>
           </Box>

           <Box mt={3}>
            <Typography variant='h4'>Simularity Score (S)</Typography>
            <Typography component="p" className='legend-para'>Is a measure of how close the pedigree of the Graded Stakes Winner matches the hypo-mating.</Typography>
           </Box>

           <Box mt={3}>
            <Typography variant='h4'>Exact Score (E)</Typography>
            <Typography component="p">Shows a count of the number of ancestors which appear in Exactly the same position of the pedigree.</Typography>
           </Box>

           <Box mt={3}>
            <Typography variant='h4'>What is inbreeding?</Typography>
            <Typography component="p">Is when there are duplicate horses within four generations of a pedigree.</Typography>
           </Box>

           <Box mt={3}>
              <Stack className='legend-modal-list'>
                 <Box className='color-legend' sx={ { background: "#C5D9F0" } } />
                 <Typography component="p">Light blue areas indicate male inbreeding occurring in the same half of a pedigree.</Typography>
              </Stack>

              <Stack className='legend-modal-list'>
                 <Box className='color-legend' sx={ { background: "#8BBAF0" } } />
                 <Typography component="p">Dark blue areas indicate male inbreeding occurring in different halves of a pedigree.</Typography>
              </Stack>

              <Stack className='legend-modal-list'>
                 <Box className='color-legend' sx={ { background: "#EFC6DF" } } />
                 <Typography component="p">Light pink indicates female inbreeding within the same half of a pedigree.</Typography>
              </Stack>

              <Stack className='legend-modal-list'>
                 <Box className='color-legend' sx={ { background: "#ED8AC5" } } />
                 <Typography component="p">Dark pink indicates female inbreeding within different halves of a pedigree.</Typography>
              </Stack>              
           </Box>          
           {/* End Legend component used in stallion search */}
        </Box>
    </StyledEngineProvider>
  )
}
export default LegendModal;