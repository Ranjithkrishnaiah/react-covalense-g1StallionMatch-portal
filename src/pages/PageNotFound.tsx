import { Box, Container, Grid, Stack, StyledEngineProvider, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import './PageNotFound.css'

// MetaTags
import useMetaTags from 'react-metatags-hook'


function PageNotFound(){


    useMetaTags({
        title: `Oops! Page not found`,
        description: `Error code 404 page`,
      }, [])


    return(
        <>
        <StyledEngineProvider injectFirst>
    <Box className='errorBg'>
    <Box className="errorGreenTiles" />
        <Container maxWidth='lg'>
            <Grid container pt={2}>
                <Stack>
                    <Typography variant='h2' pt={5}>
                       Oops! Page not found.
                    </Typography>
                    <Typography component='span' pt={3}>
                       Error code 404 not found.
                    </Typography>
                    <Link to='/' className='Return'>Return to Homepage</Link>
                </Stack>
           </Grid>
       </Container>
   </Box>
   <Box className='greenBorder' />
   </StyledEngineProvider>
        </>
    )
}

export default PageNotFound