import { Container, Grid, Skeleton, Stack, StyledEngineProvider, Typography } from '@mui/material';
import Slider from '../../../components/customCarousel/Slider';
import { Images } from '../../../assets/images';
import { Box } from '@mui/system';
import format from 'date-fns/format';

export default function Media(data: any) {
  // console.log(data,'PROPS MEDIA')
  if(!data.farmMediaDetailsData){
    return(
      <Box sx={ { paddingTop: '0rem' } }>
            <Container>
            <Typography variant='h3' sx={ { color: '#1D472E', paddingBottom: '2rem' } }>Media</Typography>
            <Grid container spacing={{lg:'24', sm:'24', xs:'0'}}>
      <Grid item lg={4} sm={4} xs={12}>
        <Stack mb={2}>
            <Skeleton variant='rectangular' animation="wave" height={240} sx={ {borderRadius: '4px 4px 0 0'} }></Skeleton>
        </Stack>
        <Stack>
            <Skeleton variant="text" animation="wave" width={214} sx={{ fontSize: '2rem' }} />
            <Skeleton variant="text" animation="wave" width={214} sx={{ fontSize: '2rem' }} />
        </Stack>
        <Stack mt={3} spacing={2}>
            <Skeleton variant="rectangular" animation="wave" width={142} height={24} sx={ {borderRadius: '4px'} }/>
            <Skeleton variant="rectangular" animation="wave" width={142} height={24} sx={ {borderRadius: '4px'} }/>
        </Stack>
      </Grid>
       <Grid item lg={4} sm={4} xs={12}>
        <Stack mb={2}>
            <Skeleton variant='rectangular' animation="wave" height={240} sx={ {borderRadius: '4px 4px 0 0'} }></Skeleton>
        </Stack>
        <Stack>
            <Skeleton variant="text" animation="wave" width={214} sx={{ fontSize: '2rem' }} />
            <Skeleton variant="text" animation="wave" width={214} sx={{ fontSize: '2rem' }} />
        </Stack>
        <Stack mt={3} spacing={2}>
            <Skeleton variant="rectangular" animation="wave" width={142} height={24} sx={ {borderRadius: '4px'} }/>
            <Skeleton variant="rectangular" animation="wave" width={142} height={24} sx={ {borderRadius: '4px'} }/>
        </Stack>
      </Grid>
       <Grid item lg={4} sm={4} xs={12}>
        <Stack mb={2}>
            <Skeleton variant='rectangular' animation="wave" height={240} sx={ {borderRadius: '4px 4px 0 0'} }></Skeleton>
        </Stack>
        <Stack>
            <Skeleton variant="text" animation="wave" width={214} sx={{ fontSize: '2rem' }} />
            <Skeleton variant="text" animation="wave" width={214} sx={{ fontSize: '2rem' }} />
        </Stack>
        <Stack mt={3} spacing={2}>
            <Skeleton variant="rectangular" animation="wave" width={142} height={24} sx={ {borderRadius: '4px'} }/>
            <Skeleton variant="rectangular" animation="wave" width={142} height={24} sx={ {borderRadius: '4px'} }/>
        </Stack>
      </Grid>
      </Grid>
      </Container>
      </Box>
    )
  }
  const { farmplaceholder } = Images;
  const inputPartArr: any = data.farmMediaDetailsData && data.farmMediaDetailsData.length > 0 ? data.farmMediaDetailsData?.map((res: any, index: number) => {
    const type = res?.mediaInfoFiles[0]?.mediaFileType.split('/')[0] == 'video' ? 'video' : 'img';
    return { id: res.mediaInfoId, type , date: format(new Date(res.createdOn), 'do MMMM yyyy'), src: res?.mediaInfoFiles?.length ? res?.mediaInfoFiles[0]?.mediaUrl :farmplaceholder, name: res?.title, description: res?.description }
  }) : null;

  const caroselProps = {
    items: inputPartArr,
    slider: true,
    dots: false,
    arrows: true,
    mediaClassName: "media-image",
    noOfVisibleItems: window.innerWidth < 600 ? 1 : window.innerWidth>600 && window.innerWidth < 820? 2: 3,
    autoScroll: false,
    sliderOnItemClick: true,
    styles: {
      item: {},
      arrows: {
        top: "50%",
        width: "100%",
        display: "flex"
      },
      arrowLeft: {
        left: 0,
        marginLeft: '-4%'

      },
      arrowRight: {
        right: '0',
        marginLeft: 'auto'

      },
      cardContent: {}
    },
    dimension:'?w=368&h=244&fit=crop&ar=3:2',
    farmDetailsProps:{...data},
    media:true,
  }
  return (
    <>
     
        <StyledEngineProvider injectFirst>
        {(inputPartArr?.length > 0) ? (
          <Box sx={ { paddingTop: '0rem' } }>
            <Container>
              <Typography variant='h3' sx={ { color: '#1D472E' } }>Media</Typography>
            </Container>
            <Container maxWidth="lg" sx={ { position: 'relative', marginTop: '2rem' } }> 

              <Slider
                {...caroselProps}
              /> 
            </Container>
          </Box>
          ) : (
            <Box sx={ { paddingTop: '0rem' } }>
            <Container>
              <Typography variant='h3' sx={ { color: '#1D472E' } }>Media</Typography>
            </Container>
            <Container maxWidth="lg"> 
            <Box className='smp-no-data no-data-media'>
                <Typography variant='h6'>No media found!</Typography>
              </Box>
            </Container>
          </Box>
      )}
        </StyledEngineProvider>
    
    </>
  );
}
