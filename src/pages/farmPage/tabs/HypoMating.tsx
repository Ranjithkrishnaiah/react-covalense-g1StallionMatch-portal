import { Box, Container, Grid, StyledEngineProvider, Typography } from '@mui/material';
import StallionMareSearch from 'src/forms/stallionMare';
import StallionListAndMareSearch from 'src/forms/StallionListAndMare';
import '../../stallionPage/StallionPage.css';
export default function HypoMating(props: any) {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box className="SPhypomating FPhypomating">
          <Container maxWidth="lg">
            <Grid container sx={{ justifyContent: 'center' }}>
              <Grid item lg={9} sm={12} xs={12}>
                <Typography variant="h3" sx={{ color: '#1D472E' }}>
                  Hypo Mating Search
                </Typography>
                <Typography pt={2} variant="body2" sx={{ color: '#161716' }}>
                  Conduct a worldwide search pairing any stallion with your broodmare to assess the
                  pedigree's success by generating a list of stakes winners with similar breeding.
                </Typography>
              </Grid>
              <Grid item lg={9} sm={12} xs={12} mt={3} className="HomeSearchBlock">
                <Box
                  className="Homesearch hypo-search"
                  sx={{
                    background: 'white',
                    borderRadius: '10px',
                    minHeight: '100px',
                    px: '16px',
                    alignItems: 'center',
                    display: 'grid',
                  }}
                >
                  {props?.pageType === 'breederDashboard' ? 
                  <StallionMareSearch />
                  :
                  <StallionListAndMareSearch farmId={props.farmId} />
                  }
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </StyledEngineProvider>
    </>
  );
}
