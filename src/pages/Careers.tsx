import { Box, Container, Grid, Typography } from '@mui/material'
import { throttle } from 'lodash';
import React, { useEffect } from 'react'
import { CustomButton } from 'src/components/CustomButton'
import { useCommunicate } from 'src/hooks/useComponentCommunication';
import { scrollToTop } from 'src/utils/customFunctions'
import { Link, useNavigate } from 'react-router-dom';

function Careers() {
  const headingRef = React.useRef<HTMLElement | null>(null);
  const { headerBackground, setHeaderBackground } = useCommunicate();

  React.useEffect(() => {
    const fn = () => {
      if(headingRef?.current){
        if(headingRef.current.getBoundingClientRect().top < 110){
          setHeaderBackground(true);
        }
        else if(headerBackground){
          setHeaderBackground(false);
        }
      }
    }
    window.addEventListener("scroll", throttle(fn ,200))
  })

  // Manage window scroll behavior on method call
  const handleScroll = (ref:React.MutableRefObject<HTMLElement | null>) => {    
    if(ref?.current?.offsetTop){
      window.scrollTo({ top: ref?.current?.offsetTop-140, behavior:"smooth" })
    }
  };
  
  useEffect(() => {
    scrollToTop()
  }, [])
  return (
    <>
      <Box className='careerBackground'>
      <Typography variant='h2' ref = {headingRef} onClick={() => handleScroll(headingRef)}>Become a part of <span>our family</span></Typography>
      <Typography variant='h5'>Unlock Your Potential and join Our Team of Innovators.</Typography>
        <Box className='careerWhiteTiles' />
      </Box>
      <Container maxWidth="lg" className='careerTopcnt'>
      <Grid container className='careerCnt'>
      <Grid item lg={10} sm={12}>
        <Typography variant='h4'>Careers</Typography>
        <Typography variant='h5'>Welcome to our Careers page at Stallion Match, where innovation meets a passion for the horse racing and breeding industry. We are constantly on the lookout for exceptional professionals in data science, full stack development, and marketing who share our enthusiasm for this unique field. If you're ready to join a dynamic team and drive forward-thinking solutions in the world of SAAS, explore our career opportunities below.</Typography>
      </Grid>
      </Grid>
      </Container>
      <Container maxWidth="lg" className='careerMarketing'>
      <Typography variant='h3'>Marketing</Typography>
      <Grid container className='careerMarktCnt'>
      <Grid item lg={9} sm={9} xs={12}>
        <Typography variant='h4'>Social Media Manger (Intermediate)</Typography>
        <Typography variant='h5'>Remote, Global   |  <span>Part Time</span></Typography>
        <Typography variant='h6'>As the Social Media Manager, you will be responsible for developing and executing social media strategies that engage our audience, increase brand awareness, and drive business growth. If you have a knack for storytelling, an eye for design, and a deep understanding of social media platforms, we want to hear from you. Join us in shaping our online presence and making a meaningful impact in the digital world.</Typography>
      </Grid>
      <Grid item lg={3} sm={3} xs={12} className='learnBtn'>
      <Link className='footer-links' to='/contact-us?type=other'><CustomButton className='ListBtn'>Contact Us </CustomButton></Link>
      </Grid>
      </Grid>
      <Grid container className='careerMarktCnt'>
      <Grid item lg={9} md={9} sm={9} xs={12}>
        <Typography variant='h4'>Sales Manger (Intermediate)</Typography>
        <Typography variant='h5'>North America   |  <span>Part Time</span></Typography>
        <Typography variant='h6'>You will be responsible for driving SAAS revenue growth, building and nurturing client relationships, and expanding our market presence across North America. If you excel in sales strategy development, team management, and thrive in a fast-paced SAAS environment, we invite you to be part of our exciting journey. Help us transform people’s lives with our innovative solutions and be a driving force behind our North American success story.</Typography>
      </Grid>
      <Grid item lg={3} md={3} sm={3} xs={12} className='learnBtn'>
      <Link className='footer-links' to='/contact-us?type=other'><CustomButton className='ListBtn'>Contact Us </CustomButton></Link>
      </Grid>
      </Grid>
      </Container>
      <Container maxWidth="lg" className='careerMarketing bottomMark'>
      <Typography variant='h3'>Development</Typography>
      <Grid container className='careerMarktCnt'>
      <Grid item lg={9} sm={9} xs={12}>
        <Typography variant='h4'>Full Stack Developer</Typography>
        <Typography variant='h5'>Remote, Global | <span>Full & Part Time</span></Typography>
        <Typography variant='h6'>Play a pivotal role in shaping our innovative web applications. As a Full Stack Developer, you'll leverage your expertise in ASP.NET, Microsoft SQL, Angular, HTML/CSS, NodeJS (Nest), and React to drive the development of robust and user-friendly solutions. You'll work collaboratively with other experts, participate in architecture design, and contribute to optimising performance and user experiences. If you're passionate about web development, eager to learn, and thrive in a dynamic environment, we want you on our team. Join us in creating cutting-edge digital experiences that make a difference.</Typography>
      </Grid>
      <Grid item lg={3} sm={3} xs={12} className='learnBtn'>
      <Link className='footer-links' to='/contact-us?type=other'><CustomButton className='ListBtn'>Contact Us </CustomButton></Link>
      </Grid>
      </Grid>
      <Grid container className='careerMarktCnt'>
      <Grid item lg={9} sm={9} xs={12}>
        <Typography variant='h4'>Data Science Engineer</Typography>
        <Typography variant='h5'>Remote, Global | <span>Full & Part Time</span></Typography>
        <Typography variant='h6'>Are you a data-driven problem solver with a knack for creating AI-powered solutions? Join Stallion Match as a Data Science Engineer and be at the forefront of innovation. In this role, you'll apply your expertise in data modelling and AI creation to develop intelligent systems that drive our company's success. Collaborating with a dynamic team, you'll design and implement sophisticated algorithms, conduct deep analysis, and transform data into actionable insights. If you're passionate about the intersection of data science and AI, and ready to make an impact, we welcome you to join our team. Shape the future of our technology landscape and help us harness the power of data and AI for meaningful advancements.</Typography>
      </Grid>
      <Grid item lg={3} sm={3} xs={12} className='learnBtn'>
      <Link className='footer-links' to='/contact-us?type=other'><CustomButton className='ListBtn'>Contact Us </CustomButton></Link>
      </Grid>
      </Grid>
      </Container>
    <Box sx={{position:'relative', height:'100px'}}>
      <Box className='Bottomgreentile'></Box>
      </Box>
      
      {/* <Box className="TestimonialBGStallionMatch" sx={{ position: 'relative' }}>
        <Box className="Btmgreentile" />
      </Box> */}
    </>
  )
}

export default Careers
