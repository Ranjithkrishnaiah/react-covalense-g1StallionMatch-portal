import { useEffect } from 'react'
import { Box, Grid, Stack, StyledEngineProvider, Typography, Container, InputLabel } from '@mui/material'
import { Images } from '../assets/images';
import { scrollToTop } from 'src/utils/customFunctions';
import './ContactUs.css';
import ContactUsForm from 'src/forms/ContactUs';
// MetaTags
import useMetaTags from 'react-metatags-hook';

function ContactUs() {
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;  
  const contactusUrl = `${BaseAPI}contact-us`;
  const twitterUrl = process.env.REACT_APP_TWITTER_URL;
  const facebookUrl = process.env.REACT_APP_FACEBOOK_URL;
  const supportEmail = process.env.REACT_APP_SUPPORT_EMAIL;
  const salesEmail = process.env.REACT_APP_SALES_EMAIL;
  const farmsStallionsEmail = process.env.REACT_APP_FARMS_STALLIONS_EMAIL;

  // Generate meta information
  useMetaTags({
    title: `Contact information`,
    description: `Contact information of Technical support, Sales, social platforms and an option to submit a form`,
    openGraph: {
      title: `Contact information`,
      description: `Contact information of Technical support, Sales, social platforms and an option to submit a form`,
      site_name: 'Stallion Match',
      url: contactusUrl,
      type: 'business.business',
    },
  }, [])


  useEffect(() => {
    scrollToTop()
  }, [])
  return (
    <StyledEngineProvider injectFirst>
      <Box className='contact-section-block'>
        <Box className='contact-wrapper'>
          <Container>
            <Grid container>
              <Grid item lg={6} md={6} sm={12} xs={12} className='contact-left'>
                <Box className='contact-left-inner'>
                  <Typography variant='h3' sx={{ color: '#FAF8F7' }}>Contact Information</Typography>
                  <Typography component='p' sx={{ color: '#FAF8F7' }} mt={3} pr={{ sm: '0px', md: '0px', lg: '25px' }}>
                    Complete the form and our team will get back to
                    you within 24 hours.</Typography>

                  <Stack className='contact-details-block' mt={7}>
                    <Typography variant='h6'>Farms/Stallions</Typography>
                    <Typography component='p' sx={{ color: '#FAF8F7' }}><a href={`mailto:${farmsStallionsEmail}`} target='_blank'>{farmsStallionsEmail}</a></Typography>
                  </Stack>

                  <Stack className='contact-details-block' mt={7}>
                    <Typography variant='h6'>Technical Support</Typography>
                    <Typography component='p' sx={{ color: '#FAF8F7' }}><a href={`mailto:${supportEmail}`} target='_blank'>{supportEmail}</a></Typography>
                  </Stack>


                  <Stack className='contact-social-block' mt={15}>
                    <a target='_blank' href={twitterUrl}><img src={Images.twitter} alt='Twitter' className='footerIcons' /></a>
                    <a target='_blank' href={facebookUrl}><img src={Images.facebook} alt='Facebook' className='footerIcons' /></a>
                  </Stack>

                </Box>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12} className='contact-right'>
                <Box className='contact-right-inner' pl={{ sm: '0px', md: '80px', lg: '80px' }}>
                  <InputLabel className="intrested-label" sx={{ color: '#FAF8F7' }}>I’m interested in...</InputLabel>
                  {/* Component to show right side contact us form */}
                  <ContactUsForm />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </StyledEngineProvider>
  )
}

export default ContactUs