import { Container, Grid, Typography, Link } from '@mui/material'
import { Box } from '@mui/system';
import { scrollToTop } from 'src/utils/customFunctions';
import { useEffect } from 'react';
// MetaTags
import useMetaTags from 'react-metatags-hook';


function Help() {
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;  
  const cookiePolicysUrl = `${BaseAPI}about/cookie-policy`;

  // Generate meta information
  useMetaTags({
    title: `Stallion Match Cookie Policy`,
    description: ``,
    openGraph: {
      title: `Stallion Match Cookie Policy`,
      site_name: 'Stallion Match',
      url: cookiePolicysUrl,
      type: 'business.business',
    },
  }, [])

  // Load the page from top while loading
  useEffect(()=> {
    scrollToTop()
  },[]);

  return (
    <Container className='policy'>
        <Box my={5}>
          <Grid container>
            <Grid item lg={6} sm={6} xs={12}>
            <Typography variant='h2'>Cookie Policy</Typography>
              </Grid>
              <Grid item lg={6} sm={6} xs={12} className='policy-head'>
            <Typography variant='h5'>Last Updated on 30th August, 2022</Typography>
              </Grid>
          </Grid>
      </Box>
      <Box>
        <Box mb={3}>
          <Typography variant='h4'>1. Introduction</Typography>
          <Typography variant='h6'>(a)	This Cookies Policy applies between you and us, G1 Racesoft Pty Ltd ABN 93 110 444 007 trading as “Stallion Match” (“we”, “us”, or “our”).</Typography>
          <Typography variant='h6'>
(b)	This Cookies Policy applies when you use our website accessible at <Link>https://stallionmatch.com</Link> (“Website”), and describes the types of cookies we use on our Website, how we use them, and how you can control them.
</Typography>
<Typography variant='h6'>
(c)	A cookie is a small file that’s stored on your computer or device when  you visit a website that uses cookies. We may use several different cookies on our Website, for the purposes of website functionality, performance, advertising, and social media or content cookies. Cookies enhance your experience on our Website, as it allows us to recognise you, remember your details and preferences (for example, your log-in details), and provide us with information on when you’ve visited and how you’ve interacted with our Website.
</Typography>
        </Box>
        <Box mb={3}>
          <Typography variant='h4'>2. Types of Cookies We Use</Typography>
          <Typography variant='h6'>The below sets out the type of cookies we may collect on our Website.</Typography>
          <Typography variant='h6'>
          <strong>Strictly Necessary Cookies:</strong>	Certain cookies we use are essential for the proper functioning of our Website, without which our Website won’t work or certain features won’t be accessible to you. For example, we may need to remember data you’ve inputted from one page to the next in a single session. 
</Typography>
<Typography variant='h6'>
<strong>Performance Cookies:</strong>	Performance cookies collect information about your use of the Website to help enhance the services we provide to you. We collect information about how you interact with the Website, including the pages you visit and the frequency of your visits. This information helps us identify patterns of usage on the site, collect analytics data, identify issues you may have had on the Website, make changes to enhance your browsing experience, and analyse if our marketing is effective and relevant to you. 
</Typography>
<Typography variant='h6'>
<strong>Functional Cookies:</strong>	We use functional cookies to improve your experience on our Website and make things more convenient for you. These cookies personalise your experience on our Website based on your preferences, by remembering your details such as your login details or region.
</Typography>
<Typography variant='h6'>
Security cookies are a type of functional cookie, which assist with website and user account security. Load balancing session cookies are used for the duration of the session to distribute user requests across multiple servers to optimize website speed and capacity. We may also use user interface customization persistent cookies to store a user’s preferred version of our Website, such as font and language preferences.
</Typography>
<Typography variant='h6'>
<strong>Advertising Cookies:</strong>	Advertising cookies are used on our Website to provide you with targeted marketing materials in accordance with your interests and preferences. These cookies remember that you visited our Website, and we may provide this information to third-parties. These cookies usually cannot personally identify you, so your anonymity is typically secured. These cookies ensure that advertisements displayed to you are things that may be of interest to you.
</Typography>
<Typography variant='h6'>
<strong>Content Cookies:</strong>	Content cookies are placed by many social media plugins (like plugins that allow you to share content on Facebook), and other tools to enhance the content displayed on a website (for example, services that allow the playing of video files). We integrate these plugins into our Website to improve usability and customer experience. Some of these third party services may place cookies that are also used for the purposes of behavioural advertising or market analysis.
</Typography>
        </Box>
        <Box mb={3}>
          <Typography variant='h4'>3. How Long Will Cookies Remain On My Device?</Typography>
          <Typography variant='h6'>The amount of time that a cookie remains on your computer or device depends on the type of cookie – cookies are either “persistent” or “session” cookies. Persistent cookies last until they expire or are deleted, so they may remain on your device for as little as 10 minutes to several years. Session cookies last until you stop browsing, so just for the relevant session.</Typography>
        </Box>
        <Box mb={3}>
          <Typography variant='h4'>4. How Do Third Parties Use Cookies On The Website?</Typography>
          <Typography variant='h6'>We may use third party analytics cookies to collect information about your interaction with our Website. We also may use Google Analytics and other third-party analytics providers to help process data. To find out more, see How Google uses data when you use our partners’ sites or apps.</Typography>
        </Box>
        <Box mb={3}>
          <Typography variant='h4'>5. How Do I Control Cookies?</Typography>
          <Typography variant='h6'>(a)	Usually, you can control and manage cookies through your browser. You can control whether or not your browser accepts cookies, how to filter and manage cookies, and how to delete cookies at the end of a session.</Typography>
          <Typography variant='h6'>(b)	If you remove or block cookies, this may negatively impact your experience of our Website and you may not be able to access all parts of our Website.</Typography>
          <Typography variant='h6'>(c)	Many third party advertising services allow you to opt out of their tracking systems, by giving you the opportunity to opt out by way of a pop-up before downloading cookies to your device.</Typography>
        </Box>
        <Box mb={3}>
          <Typography variant='h4'>6. Updates To This Policy</Typography>
          <Typography variant='h6'>We may update this Cookies Policy from time to time. When we make changes, we’ll update the “Last updated” date at the top of the Cookies Policy and post it on our sites. We encourage you to check back periodically to review this Cookies Policy to ensure that you are aware of our current Cookies Policy.</Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default Help