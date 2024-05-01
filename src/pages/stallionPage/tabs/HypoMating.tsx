import { Box, Container, Grid, StyledEngineProvider, Typography } from '@mui/material';
import React from 'react';
import StallionPageMareSearch from 'src/forms/stallionPageMare';
import { toPascalCase } from 'src/utils/customFunctions';
import '../StallionPage.css'

function HypoMating(props: any) {
      return (
        <>
        <StyledEngineProvider injectFirst>
        <Box className='SPhypomating'>
          <Container maxWidth='lg'>
          <Grid container sx={ { justifyContent: 'center' } }>
          <Grid item lg={9} sm={10} xs={11}>
            <Typography variant='h3' sx={ { color: '#1D472E' } }>
            Hypo Mating Search
            </Typography>
            <Typography pt={2} variant='body2' sx={ { color: '#161716' } } className='STparaLength'>
            Run a search with {props.horseName ? toPascalCase(props.horseName) : ''} and your broodmare to find out how proven the pedigree is with a list of similarly bred stakes winners globally.
            </Typography>
            </Grid>
          <Grid item lg={10} sm={10} xs={11} mt={3} className="HomeSearchBlock">
            <Box  className="Homesearch hypo-search" sx={ { background: 'white', borderRadius: '10px', minHeight: '100px', px: '16px', alignItems: 'center', display: 'grid' } }>
            <StallionPageMareSearch {...props}/>
            </Box>
          </Grid>
          </Grid>
          </Container>
        </Box>
        </StyledEngineProvider>
      </>
    );
}

export default HypoMating;