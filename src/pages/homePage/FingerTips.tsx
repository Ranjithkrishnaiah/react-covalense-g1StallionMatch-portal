import { Container, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Images } from 'src/assets/images'
import './home.css'

function FingerTips(props: any) {
  const { banner1 } = props;
  return (
    <Box className='fingerBG'>
      <Container maxWidth='lg'>
        <Box>
          <Typography variant='h3' sx={{ lineHeight: { lg: '60px', xs: '52px' } }}>
            {banner1?.title ? banner1?.title : 'A global database at your fingertips.'}
          </Typography>
        </Box>
        <Grid container lg={12} spacing={0} mt={5}>
          <Grid item lg={4} sm={4}>
            <img src={Images.SearchCircle} alt='SearchCircle' />
            <Typography className='fingerCnt'>
              {banner1?.description1 ? banner1?.description1 : 'Over 10,000 Stallion Match searches across 12 countries every week.'}
            </Typography>
          </Grid>
          <Grid item lg={4} sm={4} >
            <img src={Images.Growth} alt='Growth' />
            <Typography className='fingerCnt'>
              {banner1?.description2 ? banner1?.description2 : 'Over 7 million horses with more than 20 data points each - updated daily from a leading global data provider.'}
            </Typography>
          </Grid>
          <Grid item lg={4} sm={4}>
            <img src={Images.Union} alt='Union' />
            <Typography className='fingerCnt'>
              {banner1?.description3 ? banner1?.description3 : 'Members across 26 different countries including the world’s elite breeders and farms.'}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default FingerTips