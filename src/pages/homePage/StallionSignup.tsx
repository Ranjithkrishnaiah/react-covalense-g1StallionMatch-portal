import { Box, Button, Container, Grid, SxProps, Typography } from '@mui/material';
import Signup from 'src/components/Signup';
import './home.css';

type SignupProps = {
  sx?: SxProps,
  banner2?: any
}
function StallionSignup(props: SignupProps) {
  const { banner2 } = props;
  return (
    <>
      <Box className='SMsignup' style={banner2?.bgImage ? { backgroundImage: `url(${(banner2?.bgImage && banner2?.bgImage)})` } : { background: '#1D472E' }} sx={props.sx}>
        {!props.sx ? <Box className='Btmgreentile' /> : ""}
        <Container>
          <Grid lg={9} sm={11} xs={12}>
            <Box sx={{ pl: { lg: '5rem', xs: '0' }, pr: { lg: '.5rem', sm: '0rem' } }}>
              <Typography variant='h2' sx={{ color: '#FFFFFF' }}>
                {banner2?.title}
              </Typography>
              <Box mt={5}>
              {banner2?.buttonTarget !== '' && <a href={banner2?.buttonTarget} target={'_blank'} className='HomeHarnessBtn'>{banner2?.buttonText}</a>}
              {banner2?.buttonTarget === '' && <Signup btnName={banner2?.buttonText ? banner2?.buttonText : 'Sign up now'} btnClass={'signup'} />}
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
export default StallionSignup