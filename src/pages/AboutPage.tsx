import { Box, Container, Grid, IconButton, Paper, TextField, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import './ContactUs.css';
import { scrollToTop } from 'src/utils/customFunctions';
import StallionSignup from './homePage/StallionSignup';
import { useCommunicate } from 'src/hooks/useComponentCommunication';
import { throttle } from 'lodash';
import Signup from 'src/components/Signup';


function AboutPage() {

  const headingRef = React.useRef<HTMLElement | null>(null);
  const { headerBackground, setHeaderBackground } = useCommunicate();

  React.useEffect(() => {
    const fn = () => {
      if (headingRef?.current) {
        if (headingRef.current.getBoundingClientRect().top < 110) {
          setHeaderBackground(true);
        } else if (headerBackground) {
          setHeaderBackground(false);
        }
      }
    };
    window.addEventListener('scroll', throttle(fn, 200));
  });

  // Manage window scroll behavior
  const handleScroll = (ref: React.MutableRefObject<HTMLElement | null>) => {
    if (ref?.current?.offsetTop) {
      window.scrollTo({ top: ref?.current?.offsetTop - 140, behavior: 'smooth' });
    }
  };

  
  useEffect(() => {
    scrollToTop()
  }, [])
  return (
    <>
    <Box sx={{background:'#F0F3F0'}}>
    <Box className='aboutBackground'>
      <Typography variant='h2' ref={headingRef} onClick={() => handleScroll(headingRef)}>Compare. Choose. Connect.<br/>
<span>With confidence.</span></Typography>
<Typography variant='h5'>Feel confident to make an informed decision on your investment.</Typography>
    <Box className="aboutGrayTiles"></Box>
      </Box>
      <Container maxWidth="lg" className='aboutTopcnt'>
      <Grid container>
      <Grid item lg={12} sm={12}>
        <Typography variant='h3'>About Us</Typography>
        <Typography variant='h5'>We are dedicated to analysing data and providing you with a one-stop, user-centred experience, ensuring that you have the most informed decision-making process when it comes to breeding your next champion. For farms, we offer an empowering and easy-to-use platform for sales growth, putting the power in your hands to promote your stallions to a global audience like never before. Discover how we can help you achieve your breeding and sales goals today.</Typography>
      </Grid>
      </Grid>
      </Container>
      <Container maxWidth="lg" className='aboutTopcnt'>
      <Grid container>
      <Grid item lg={12} sm={12} xs={12}>
        <Typography variant='h3'>Our Values</Typography>
        <Typography variant='h5'>At the core of our organisation, we are guided by a set of values anchored in the five 'i's: Integrity, Innovate, Intelligent, and Independent. These principles drive our commitment to excellence and shape our approach to every endeavour we undertake. </Typography>
      </Grid>
      </Grid>
      </Container>
      <Container maxWidth="lg" className='valuesBlock'>
        <Box className='VB-col'>
          <Box className='Box-1'> <Typography variant='h3'>Integrity</Typography>
        <Typography variant='h5'>With a solid history of reliability, we stand as an impartial and dependable presence in the industry.</Typography></Box>
          <Box className='Box-2'> <Typography variant='h3'>Innovate</Typography>
        <Typography variant='h5'>Utilising established data analysis methods to enhance efficiency.</Typography></Box>
          <Box className='Box-1'> <Typography variant='h3'>Intelligent</Typography>
        <Typography variant='h5'>We possess expertise, thrive in the digital realm, and have an unwavering passion for data.</Typography></Box>

          <Box className='Box-3'></Box>
          <Box className='Box-1'> <Typography variant='h3'>Independent</Typography>
        <Typography variant='h5'>We serve as the impartial experts for your future stallion pairing, dedicated to conducting independent analyses.</Typography></Box>
          <Box className='Box-3'></Box>
        </Box>
      </Container>
      <Container maxWidth="lg">
      <Grid container spacing={2} className="aboutBenifitCol">
      <Grid item lg={6} sm={6} xs={12}>
      <Box className='aboutBenifits'>
        <Typography variant='h3'>Benefits for Individuals</Typography>
        <Paper elevation={0}>
          <Typography variant='h5'>Breeder Platform</Typography>
          <hr/>
          <Typography variant='h6'>A platform which empowers breeders with the freedom to analyse potential breedings by offering access to a comprehensive global directory of stallions and farms. Explore endless possibilities and make informed decisions for your breeding program with ease.</Typography>
        </Paper>
        <Paper elevation={0}>
          <Typography variant='h5'>Broodmare Analysis </Typography>
          <hr/>
          <Typography variant='h6'>Registered users have the flexibility to include an unlimited number of broodmares for tracking and utilize them in searches and reports. By leveraging saved broodmares, users can identify the most suitable stallion match, considering all global stakes winners since 2011. The user-friendly dashboard simplifies the process of adding and managing their broodmare portfolio.</Typography>
        </Paper>
        <Paper elevation={0}>
          <Typography variant='h5'>Advanced Reports</Typography>
          <hr/>
          <Typography variant='h6'>We offer five reports designed specifically for the next-generation breeder. Each report provides easily digestible real-time facts and figures, empowering you to make informed decisions, whether you're planning your next breeding, purchasing at a sale, acquiring a share in a horse through a syndicate, or identifying successful breeding matches.</Typography>
        </Paper>
        <Paper elevation={0}>
          <Typography variant='h5'>Communicate With Farms</Typography>
          <hr/>
          <Typography variant='h6'>Engage in seamless conversations with farms presenting their stallions on Stallion Match with just a few clicks. Whether you need mating advice, want to discuss a nomination, or simply want to stay updated on a stallion's progress, the entire process is now effortlessly consolidated in one place. And the best part? You'll receive notifications when you receive a reply!</Typography>
        </Paper>
        <Paper elevation={0} className="aboutAPI">
          <Typography variant='h5'>Custom API Development</Typography>
          <hr/>
          <Typography variant='h6'>We are proud to have one of the largest privately owned thoroughbred databases globally. We offer custom build API’s developed specifically for your needs which can include pedigree charts, global nicking stats, advanced pedigree performance stats and so on. Some of our clients include bloodstock agents, online marketing platforms, stud farms, syndicators and punters.</Typography>
        </Paper>
        </Box>
        </Grid>
        <Grid item lg={6} sm={6} xs={12}>
        <Box className='aboutBenifits studBenifits'>
        <Typography variant='h3'>Benefits for Stud Farms</Typography>
        <Paper elevation={0}>
          <Typography variant='h5'>Stud Farm Marketing Platform</Typography>
          <hr/>
          <Typography variant='h6'>An innovative solution which enables stud farms to effortlessly manage their rosters while showcasing their prized stallions like never before. Each farm who promotes a stallion on the platform receives a dedicated stallion profile page, a farm page and unrivalled access to Stallion Match insights - all built to make selling nominations simpler.</Typography>
        </Paper>
        <Paper elevation={0}>
          <Typography variant='h5'>Performance Data </Typography>
          <hr/>
          <Typography variant='h6'>Track every aspect of your stallions including all progeny performances, search analytics (breeder locations, broodmare names, search log, etc) along with detailed insights relating to your Stallion Match profile.</Typography>
        </Paper>
        <Paper elevation={0}>
          <Typography variant='h5'>Unlimited Users</Typography>
          <hr/>
          <Typography variant='h6'>We recognise that running a stud farm often requires a collaborative effort. That's why we don't impose any restrictions on the number of users who can be assigned to assist in farm management. Whether it's your Marketing Manager, Sales and Nominations Manager, or even stallion shareholders, you have the flexibility to grant them access. You retain full control over user management through your farm dashboard, allowing you to make changes as needed.</Typography>
        </Paper>
        <Paper elevation={0}>
          <Typography variant='h5'>Advanced Stallion Reports</Typography>
          <hr/>
          <Typography variant='h6'>We recognise that running a stud farm often requires a collaborative effort. That's why we don't impose any restrictions on the number of users who can be assigned to assist in farm management. Whether it's your Marketing Manager, Sales and Nominations Manager, or even stallion shareholders, you have the flexibility to grant them access. You retain full control over user management through your farm dashboard, allowing you to make changes as needed.</Typography>
        </Paper>
        <Paper elevation={0}>
          <Typography variant='h5'>Promote Now and Generate Quality Leads</Typography>
          <hr/>
          <Typography variant='h6'>By promoting your stallions on Stallion Match, you'll never miss out on valuable leads. Our system ensures that all connected farm users receive email notifications when they receive a new message. Responsiveness leads to enhanced breeder engagement and, consequently, increased nomination sales."</Typography>
        </Paper>
        </Box>
        </Grid>
        </Grid>
      </Container>
      <Box className="aboutInterested" sx={{ position: 'relative' }}>
      <Container maxWidth="lg">
            <Grid container>
              <Grid item lg={12}>
                <Typography variant="h3" pb={2}>
                Interested to know more?
                </Typography>
                <Typography variant="h6">
                We offer a suite of APIs that numerous partners utilise to harness the wealth of our thoroughbred database. Whether you require a pedigree chart for your website, statistical insights on a racehorse, or an evaluation of a successful stallion or broodmare, we're here to assist you. Many breeders and punters alike currently request this information.
                </Typography>
                <Grid container lg={11} sm={12}  sx={{ marginTop: '16px' }}>
                  <Grid item lg={9} sm={12} xs={12} className="stallion-match-search-box">
                    <Stack direction="row" className="fonrfarms-search">
                      <Box className='SMregis'>
                        <TextField
                          fullWidth
                          placeholder="Enter Email Address"
                        />
                      </Box>
                      <Box className="SMregisIcon" px={2}>
                        <IconButton>
                          <i className="icon-Arrow-circle-right"></i>
                        </IconButton>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <Box className='Btmgreentile'></Box>
        <Box className='Btmgreentile'></Box>
      </Box>
      <Box className='SMsignup' sx={{ background: '#005632 !important' }}>
          <Container>
              <Grid lg={11} sm={11} xs={12}>
                  <Box sx={ { pl: { lg: '5rem', xs: '0' }, pr: {lg: '.5rem', sm:'0rem'} } }>
                      <Typography variant='h2' sx={ { color: '#FFFFFF' } }>
                      Sign up now for a free membership and start your analysis today.
                      </Typography>
                      <Box mt={5}>
                      {/* <a href=''className='HomeHarnessBtn'>Sign up now</a> */}
                      <Signup btnName='Sign up now' btnClass='signup'/>
                      </Box>
                  </Box>
              </Grid>
        </Container>
        </Box>
      {/* <StallionSignup sx={{ background: '#005632 !important' }} /> */}
      </Box>
      </>

  )
}

export default AboutPage
