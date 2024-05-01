import { Box, Container, Grid, StyledEngineProvider, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { BubbleChart } from 'src/components/chart/BubbleChart';
import { RadarChart } from 'src/components/chart/RadarChart';
import '../stallionsearch.css';
import { CustomButton } from 'src/components/CustomButton';
import { useGetAptitudeProfileQuery } from 'src/redux/splitEndpoints/getAptitudeProfile';
import Loader from 'src/components/Loader';
import { isObjectEmpty } from 'src/utils/customFunctions';
import { Images } from 'src/assets/images';
import FullScreenDialog from 'src/components/fullscreenDialog/FullScreenWrapperDialog';
import { getQueryParameterByName } from 'src/utils/customFunctions';


function AptitudeProfile() {
  const [open, setOpen] = React.useState(false);

  const stallionId  = getQueryParameterByName('stallionId') || "";
  const mareId  = getQueryParameterByName('mareId') || "";
  const isStallionParam = (stallionId === '') ? false : true;
  const isMareParam = (mareId === '') ? false : true;   
  const isBothParam = (isStallionParam && isMareParam) ? true : false;

  const params = {
    stallionId,
    mareId,
  };
  
  // Aptitude profile API call
  const {
    data: aptitudeProfileData,
    isSuccess,
    isLoading,
  } = useGetAptitudeProfileQuery(params, { skip: !isBothParam });

  // If API is loading, then display a loader
  if (isLoading) {
    return <Loader />;
  }
  
  // If full screen is clicked
  const handleClickOpen = () => {
    setOpen(true);
  };

  // If exit full screen is clicked
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {aptitudeProfileData && !isObjectEmpty(aptitudeProfileData?.aptitudeProfile) ? (
        <StyledEngineProvider injectFirst>
          <Box className="SPaptitudeprofile">
            <Container maxWidth="lg">
              <Grid container>
                <Grid lg={12} xs={12}>
                  <Typography variant="h3" className="APTitle">
                    Aptitude Profile
                  </Typography>
                </Grid>
                <FullScreenDialog className={`fullscreen aptitude-fullscreen ${open ? 'fullscreen-enabled' : ''}`} open={open} setOpen={setOpen}>
                  <Grid item lg={12} xs={12} className="aptitude-profile-chart-box">
                  {!open ? (
                      <CustomButton className="ListBtn" onClick={handleClickOpen}>
                        <i className="icon-Arrows-expand" /> Full Screen
                      </CustomButton>
                    ) : (
                      <CustomButton className="ListBtn fullscreenBtn" onClick={handleClose}>
                        <img
                          src={Images.collapseicon}
                          alt="close"
                          className="collapse-icon"
                          onClick={handleClose}
                        />{' '}
                        Exit Full Screen
                      </CustomButton>
                     )}
                    <BubbleChart {...aptitudeProfileData?.aptitudeProfile} />
                  </Grid>
                </FullScreenDialog>
              </Grid>

              <Grid
                py={3}
                my={5}
                container
                lg={12}
                xs={12}
                className="graph-search"
                sx={{ alignItems: 'center' }}
              >
                <Grid item lg={6} md={6} sm={6} xs={12} className="graph-search-left">
                  <RadarChart chartType="age" data={aptitudeProfileData?.ageProfile} />
                </Grid>
                
                <Grid item lg={6} md={6} sm={6} xs={12} className="graph-search-right">
                  <RadarChart chartType="distance" data={aptitudeProfileData?.distanceProfile} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </StyledEngineProvider>
      ) : (
        <StyledEngineProvider injectFirst>
          <Box className="SPaptitudeprofile">
            <Container maxWidth="lg">
              <Grid container>
                <Grid lg={12} xs={12}>
                  <Typography variant="h3" className="APTitle">
                    Aptitude Profile
                  </Typography>
                </Grid>
              </Grid>
            </Container>
            <Stack mt={3}>
              <Box className='smp-no-data'>
                <Typography variant='h6'>No records found!</Typography>
              </Box>
            </Stack>
          </Box>
        </StyledEngineProvider>
      )}
    </>
  );
}

export default AptitudeProfile;