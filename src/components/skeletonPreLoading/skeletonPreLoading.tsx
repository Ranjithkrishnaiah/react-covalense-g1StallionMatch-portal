import {
  Container,
  Grid,
  Skeleton,
  Box,
  Stack,
  StyledEngineProvider,
  Divider,
} from '@mui/material';
import { Spinner } from '../Spinner';
import './stallionPreload.css';
import '../../pages/stallionPage/StallionPage.css';
import { Item } from 'framer-motion/types/components/Reorder/Item';

export default function SkeletonPreLoading() {
  const url = window.location.pathname;
  const location = url.replace('/', '');

  const getSkeleton = () => {
    if (location.match('stallions') && location.match('stallions')?.index === 0) {
      return (
        <>
          <StyledEngineProvider injectFirst>
            <Container maxWidth="lg" className="stallionDetailsGridContainer stallion-load">
              <Grid container className="title-container">
                <Grid item lg={12} xs={12} className="title-container-head">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{ width: '40%', fontSize: '4rem' }}
                  />
                </Grid>
                <Grid item lg={7} sm={7} xs={12} mt={2}>
                  <Stack direction="row" spacing={2}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ width: '30%' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ width: '50%' }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ width: '30%', fontSize: '2rem' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ width: '30%', fontSize: '2rem' }}
                    />
                  </Stack>
                </Grid>
                <Grid className="stallion-page-header-button" item lg={5} sm={5} xs={12}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{ width: '50%', fontSize: '2rem' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className="stallionDetailsGrid">
                <Grid item lg={8} sm={12} xs={12} className="StallionSlider">
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    className="stallion-skeleton-banner"
                  />
                </Grid>
                <Grid item lg={4} xs={12} className="StallionFarmDetails skeleton-details">
                  <Box className="stallion-right-box">
                    <Box sx={{ padding: '20px' }}>
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        className="stallion-skeleton-right"
                      />
                      <Box mt={2}>
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '50%', fontSize: '2rem' }}
                        />
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '50%', fontSize: '2rem' }}
                        />
                      </Box>
                      <Box mt={2}>
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '80%', fontSize: '2rem' }}
                        />
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '50%', fontSize: '2rem' }}
                        />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" animation="wave" className="skelt-border" />
                    <Stack
                      direction="row"
                      divider={<Divider orientation="vertical" flexItem />}
                      spacing={2}
                      className="skelt-msg"
                    >
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        className="stallion-skeleton-box"
                      />
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        className="stallion-skeleton-box"
                        sx={{ width: '142px !important' }}
                      />
                    </Stack>
                    <Skeleton variant="rectangular" animation="wave" className="skelt-border" />
                    <Box m={1} mx={2}>
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        className="whiteBG"
                        sx={{ width: '80%', height: '20px !important' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box mt={2} className="SPtabs skelt-tab">
                <Stack direction="row" spacing={3}>
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                </Stack>
              </Box>
              <Grid container mt={2}>
                <Grid lg={4} sm={4} xs={12}>
                  <Box>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ height: '250px !important' }}
                    />
                  </Box>
                </Grid>
                <Grid lg={8} sm={8} xs={12}>
                  <Box>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </StyledEngineProvider>
        </>
      );
    }
    if (location.match('stud-farm')?.index === 0) {
      return (
        <>
          <StyledEngineProvider injectFirst>
            <Container maxWidth="lg" className="farmpagesliderWrapper stallion-load">
              <Grid container mt={7} mb={4}>
                <Grid item lg={8} sm={7} xs={12} className="title-container-head">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{ width: '40%', fontSize: '4rem' }}
                  />
                </Grid>
                <Grid
                  item
                  lg={4}
                  sm={5}
                  xs={12}
                  sx={{ margin: 'auto 0' }}
                  className="stallion-page-header-button farms-page-header-button"
                >
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    className="greyBG"
                    sx={{ width: '30%' }}
                  />
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    className="greyBG"
                    sx={{ width: '50%' }}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item lg={12} sm={12} xs={12}>
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    className="farm-skeleton-banner"
                  />
                </Grid>
              </Grid>
              <Box mt={2} className="SPtabs skelt-tab">
                <Stack direction="row" spacing={3}>
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG" />
                </Stack>
              </Box>
              <Grid container mt={2}>
                <Grid lg={4} sm={4} xs={12} className="skeleton-details">
                  <Box className="stallion-right-box" sx={{ height: '360px !important' }}>
                    <Box sx={{ padding: '20px' }}>
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        className="stallion-skeleton-right"
                      />
                      <Box mt={2}>
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '50%', fontSize: '2rem' }}
                        />
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '50%', fontSize: '2rem' }}
                        />
                      </Box>
                      <Box mt={2}>
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '80%', fontSize: '2rem' }}
                        />
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          className="whiteBG"
                          sx={{ width: '50%', fontSize: '2rem' }}
                        />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" animation="wave" className="skelt-border" />
                    <Stack
                      direction="row"
                      divider={
                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#ffffff' }} />
                      }
                      spacing={2}
                      className="overview-skelt"
                    >
                      <Box>&nbsp;</Box>
                      <Box>&nbsp;</Box>
                      <Box>&nbsp;</Box>
                    </Stack>
                  </Box>
                </Grid>
                <Grid lg={8} sm={8} xs={12}>
                  <Box className="skeleton-over-details">
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      className="greyBG"
                      sx={{ fontSize: '2rem' }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ margin: '84px 0 40px 0' }}>
                <Skeleton variant="rectangular" animation="wave" className="our-title" />

                <Box
                  mt={5}
                  pb={0}
                  sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                  }}
                >
                  <Skeleton variant="rectangular" animation="wave" className="tabBG ourStallions" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG ourStallions" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG ourStallions" />
                  <Skeleton variant="rectangular" animation="wave" className="tabBG ourStallions" />
                </Box>
              </Box>
            </Container>
          </StyledEngineProvider>
        </>
      );
    }
    return (
      <Box
        style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Spinner />
      </Box>
    );
  };

  return <>{getSkeleton()}</>;
}
