import { Box, Button, Container, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { Images } from 'src/assets/images'
import { CustomButton } from 'src/components/CustomButton'
import './home.css'
import { ROUTES } from "../../routes/paths";
import RegisterInterest from 'src/forms/RegisterInterest'
import { useState } from 'react'
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog'
import RegisterInterestSuccess from 'src/forms/RegisterInterestSuccess'
import Signup from 'src/components/Signup'
import { Interweave } from 'interweave'

function ValuedAsset(props: any) {
  const navigate = useNavigate();
  const { heroImage, carasouls } = props;
  const [openRegisterInterest, setOpenRegisterInterest] = useState(false);
  const [openRegisterInterestSuccess, setOpenRegisterInterestSuccess] = useState(false);

  const carasoulsList = carasouls?.list?.filter((v: any) => v?.isActive);
  // console.log(carasoulsList, 'carasoulsList');

  const handleOpenRegisterInterestSuccess = () => {
    setOpenRegisterInterestSuccess(true);
  }

  return (
    <Box className='homeCntBg'>
      <Box py={5} >
        <Container maxWidth='lg'>
          <Grid container sx={{ justifyContent: 'center' }}>
            <Grid item lg={8} md={11} sm={11} xs={12} py={5}>
              <Typography variant='h1' align='center' sx={{ lineHeight: { lg: '72px', xs: '56px' }, color: '#1D472E' }}>
                {heroImage?.title ? heroImage?.title : `The most valued asset for Stallion Farms and Breeders, here’s why.`}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container maxWidth='lg'>
        <Grid container spacing={2}>
          {carasoulsList?.map((element: any) => {
            return (
              <Grid item lg={element?.orientation === 'right' ? 11 : 12} xs={12} sx={element?.orientation === 'right' ? { margin: 'auto' } : { my: { lg: '6rem', xs: '3rem' } }} key={element?.id}>
                <Box
                  className='ComemonHomeGrid SMCGrid'
                  sx={{
                    display: 'grid',
                    gap: 8,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  {element?.orientation === 'right' &&
                    <>
                      <Box sx={{ margin: 'auto 0' }} className='SMCGridLeft'>
                        <Typography variant="h3">
                          {element?.title}
                        </Typography>
                        <Typography className='STMhomeCnt backed'>
                          <Interweave className="interweave" content={element?.description} />
                        </Typography>
                        <Box mt={4}>
                          {element?.buttonUrl !== '' && <Button href={element?.buttonUrl} target={'_blank'} className='regisBtn getstart'>{element?.buttonText}</Button>}
                          {element?.buttonUrl === '' && <Signup btnName={element?.buttonText} btnClass={'regisBtn'} />}
                          {/* <Signup btnName={element?.buttonText} btnClass="regisBtn" /> */}
                        </Box>
                      </Box>
                      <Box className='SMCGridRight' sx={{ margin: 'auto 0' }}>
                        <img src={element?.mediaThumbnailUrl || element?.imageUrl || Images.Stallionsearch} alt='Make informed stallion breeding decisions backed by data' style={{ borderRadius: '10px', boxShadow: "5px 5px 15px #999999" }} />
                      </Box>
                    </>
                  }
                  {element?.orientation === 'left' &&
                    <>
                      <Box sx={{ margin: 'auto 0' }} className='SMCGridLeft communication'>
                        <img src={element?.mediaThumbnailUrl || element?.imageUrl || Images.Mashupdevice} alt='Communication is key' style={{ borderRadius: '10px', boxShadow: "5px 5px 15px #999999" }} />
                      </Box>
                      <Box sx={{ margin: 'auto 0' }} className='SMCGridRight'>
                        <Typography variant="h3">
                          {element?.title}
                        </Typography>
                        <Typography className='STMhomeCnt'>
                          <Interweave className="interweave" content={element?.description} />
                        </Typography>
                        <Box mt={4}>
                          {element?.buttonUrl !== '' && <Button href={element?.buttonUrl} target={'_blank'} className='regisBtn getstart'>{element?.buttonText}</Button>}
                          {element?.buttonUrl === '' && <Signup btnName={element?.buttonText} btnClass={'regisBtn'} />}
                        </Box>
                      </Box>
                    </>
                  }

                </Box>
              </Grid>
            )
          })}
          {/* <Grid item lg={11} xs={12} sx={{ margin: 'auto' }}>
            <Box
              className='ComemonHomeGrid SMCGrid'
              sx={{
                display: 'grid',
                gap: 6,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
              }}
            >
              <Box sx={{ margin: 'auto' }} className='SMCGridLeft'>
                <Typography variant="h3">
                  Make informed stallion breeding decisions backed by data
                </Typography>
                <Typography className='STMhomeCnt backed' pt={2}>
                  Replicate proven thoroughbred pedigrees and identify your next Perfect Match or 20/20 Match by combining rich data, research and deep analytics - FREE.
                </Typography>
                <Box mt={4}>
                  <Signup btnName="Get Started" btnClass="regisBtn" />
                </Box>
              </Box>
              <Box className='SMCGridRight' sx={{ margin: 'auto 0' }}>
                <img src={Images.Stallionsearch} alt='Make informed stallion breeding decisions backed by data' style={{ borderRadius: '10px', boxShadow: "5px 5px 15px #999999" }} />
              </Box>

            </Box>
          </Grid>
          <Grid item lg={12} xs={12} sx={{ my: { lg: '6rem', xs: '3rem' } }}>
            <Box
              className='ComemonHomeGrid'
              sx={{
                display: 'grid',
                gap: 6,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
              }}
            >
              <Box sx={{ margin: 'auto 0' }} className='SMCGridLeft communication'>
                <img src={Images.Mashupdevice} alt='Communication is key' style={{ borderRadius: '10px' }} />
              </Box>
              <Box sx={{ margin: 'auto' }} className='SMCGridRight'>
                <Typography variant="h3">
                  Communication is key
                </Typography>
                <Typography className='STMhomeCnt' pt={2}>
                  A purpose-built cross-platform messaging service that allows you to have secure one-to-one conversations about your stallion search. Contact horse breeding farms with confidence your message will be delivered to the right person.
                </Typography>
                <Box mt={4}>
                  <Signup btnName="Get Started" btnClass="regisBtn" />
                </Box>
              </Box>


            </Box>
          </Grid>
          <Grid item lg={11} xs={12} mt={1} sx={{ margin: 'auto' }}>
            <Box
              className='ComemonHomeGrid SMCGrid '
              sx={{
                display: 'grid',
                gap: 6,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
              }}
            >
              <Box sx={{ margin: 'auto' }} className='SMCGridLeft '>
                <Typography variant="h3">
                  We help farms connect<br /> with confidence
                </Typography>
                <Typography className='STMhomeCnt backed' pt={2} >
                  Once registered, you can add your stud farm and stallions free to ensure their details are current. By promoting your stallions for a small fee, you then unlock robust marketing metrics. Find out how Stallion Match can assist farms promote their stallions in our directory.
                </Typography>
                <CustomButton className='regisBtn' sx={{ marginTop: '2rem' }} onClick={() => navigate(ROUTES.STALLION_MATCH)} >
                  <span className='font-text'>Learn more</span>
                </CustomButton>
              </Box>
              <Box sx={{ margin: 'auto 0' }} className='SMCGridRight'>
                <img src={Images.Stallionreport} alt='We help farms connect with confidence' style={{ borderRadius: '10px', boxShadow: "5px 5px 15px #999999" }} />
              </Box>
            </Box>
          </Grid> */}
        </Grid>
      </Container>
      <Box >
        <WrapperDialog
          dialogClassName='dialogPopup registerYourIntrestPopup'
          open={openRegisterInterest}
          title={"Register your interest"}
          onClose={() => setOpenRegisterInterest(false)}
          body={RegisterInterest}
          className={"cookieClass"}
          openSuccess={handleOpenRegisterInterestSuccess}
          sx={{ backgroundColor: '#1D472E', color: "#2EFFB4 !important" }}
        />
      </Box>
      <Box >
        <WrapperDialog
          open={openRegisterInterestSuccess}
          title={"Success!"}
          dialogClassName='dialogPopup succesclass-modal'
          onClose={() => setOpenRegisterInterestSuccess(false)}
          body={RegisterInterestSuccess}
          className={"cookieClass"}
          titleSx={{ backgroundColor: '#1D472E', color: "#2EFFB4 !important" }}
          iconSx={{
            position: 'absolute',
            right: 12,
            width: 36,
            height: 36,
            top: 18,
            color: "#2EFFB4 !important"
          }}
        />
      </Box>
    </Box>
  )
}

export default ValuedAsset