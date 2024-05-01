import { Container, Box, StyledEngineProvider, Typography, Divider, Stack, IconButton } from '@mui/material';
import React from 'react';
import SelectStallion from 'src/forms/SelectStallion';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { getQueryParameterByName } from 'src/utils/customFunctions';
import HypoMatingPedigree from 'src/components/HypomatingPedigree';
import useAuth from 'src/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { toPascalCase } from 'src/utils/customFunctions';
import RaceHorsePedigree from 'src/components/RacehorsePedigree';

function HypoMating() {   
   const { pathname } = useLocation(); 
   const currentPage = pathname.split("/");
   const horseName = decodeURIComponent(currentPage[2]);
   const horseId = currentPage[3];
   const isHorseParam = (horseId === '') ? false : true;
   const { authentication } = useAuth()
   

    return (
      <>
      <StyledEngineProvider injectFirst>
      <Container> 
       {/* If either stallion or mare is searched, then populate the Race Horse Pedigree component */}
         <>
            <Box className='common-search-hypomate Search-Mare-HypoMate'>
               {/* If mare not clicked, then display Mare Search box */}
               {  
                  (isHorseParam === false) ? 
                  <Stack direction={ { xs: 'column', lg: 'row' } } className='StallionButton'>    
                     <Typography variant='h6'>No race horse pedigree found!</Typography>
                  </Stack>
                  :
                  <RaceHorsePedigree horseId={horseId} isHorseParam={isHorseParam} />
               }
            </Box>
         </>      
      </Container>
    </StyledEngineProvider>  
      </>
    );
}
export default HypoMating;