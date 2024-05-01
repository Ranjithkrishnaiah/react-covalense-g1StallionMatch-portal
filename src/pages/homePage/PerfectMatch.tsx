import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material'
import StallionMareSearch from 'src/forms/stallionMare';
import { throttle } from 'lodash';
import { useCommunicate } from '../../hooks/useComponentCommunication'
import './home.css';
import bgImg from '../../assets/Images/HomePageHeader.webp';

function PerfectMatch(props: any) {
  const { mainHeader } = props;
  const headingRef = React.useRef<HTMLElement | null>(null);
  const { headerBackground, setHeaderBackground } = useCommunicate();

  // Manage window scroll behavior on load
  React.useEffect(() => {
    const fn = () => {
      if (headingRef?.current) {
        if (headingRef.current.getBoundingClientRect().top < 90) {
          setHeaderBackground(true);
        }
        else if (headerBackground) {
          setHeaderBackground(false);
        }
      }
    }
    window.addEventListener("scroll", throttle(fn, 200))
  })

  // Manage window scroll behavior on method call
  const handleScroll = (ref: React.MutableRefObject<HTMLElement | null>) => {
    if (ref?.current?.offsetTop) {
      window.scrollTo({ top: ref?.current?.offsetTop - 140, behavior: "smooth" })
    }
  };

  return (
    <Box className='homeBackground' style={mainHeader?.bgImage ? {backgroundImage: `url(${(mainHeader?.bgImage && mainHeader?.bgImage)})`} : {background:`url(${bgImg})`}} sx={{ display: 'flex', alignItems: { lg: 'flex-start', xs: 'center' } }}>
      <Box className='TopgreyTiles' />
      <Container maxWidth='lg' sx={{ marginTop: { lg: '15rem' } }}>
        <Grid container spacing={{ xs: 0, sm: 0, lg: 1 }} sx={{ justifyContent: 'center' }} className='homeBackgroundHeader'>
          <Grid lg={8}>
            <Typography variant="h2" className='homeBackgroundHeading' align='center' ref={headingRef} onClick={() => handleScroll(headingRef)}>
              {mainHeader?.title ? mainHeader?.title : 'Find your perfect Stallion Match.'}
            </Typography>
          </Grid>
          <Grid pt={1} pb={2} lg={8}>
            <Typography className='STMbannertext'>
              {mainHeader?.description ? mainHeader?.description : 'Make the most informed decision possible to breed your next race winner with a simple and powerful platform, combining analysis and communication for the next generation of farms and breeders.'}
            </Typography>
          </Grid>
          <Grid lg={10} className="HomeSearchBlock" px={2}>
            <Box className='Homesearch' sx={{ px: '15px' }}>
              <StallionMareSearch />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default PerfectMatch