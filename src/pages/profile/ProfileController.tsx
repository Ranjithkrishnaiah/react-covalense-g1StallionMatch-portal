import { useState, useRef, useEffect } from 'react';
import { Container, Grid, AppBar, StyledEngineProvider, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';
import Header from './Header';
import './Profile.css'
import '../../pages/stallionPage/StallionPage.css';
import PaymentMethods from './tabs/PaymentMethods';
import Notifications from './tabs/Notifications';
import OrderHistory from './tabs/OrderHistory';
import Profile from './tabs/Profile';
import ProfileImage from './ProfileImage';
import { scrollToTop } from '../../utils/customFunctions';
import { useGetOrderHistoryQuery } from 'src/redux/splitEndpoints/getOrderHistory';
import Scrollspy from 'react-scrollspy';

// MetaTags
import useMetaTags from 'react-metatags-hook';

function ProfileController() {

  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const profilePageUrl = `${BaseAPI}user/profile`;
  const profileImage = process.env.REACT_APP_PROFILE_IMAGE;

  // Page meta tags
  useMetaTags({
    title: `My Profile Dashboard | Stallion Match`,
    description: `Stallion Match profile dashboard. Update your details and more here.`,
    openGraph: {
      title: `My Profile Dashboard | Stallion Match`,
      description: `Stallion Match profile dashboard. Update your details and more here.`,
      site_name: 'Stallion Match',
      url: profilePageUrl,
      type: 'business.business',
      image: profileImage,
    },
  }, [])

  const [page, setPage] = useState(1);
  const [screenSize, setScreenSize] = useState<any>(window.innerWidth);
  const token: string | null = localStorage.getItem('accessToken');
  const { data: orderHistory, isSuccess: isOrderHistorySuccess } = useGetOrderHistoryQuery({ page, limit: 10, order: 'DESC' })

  // on first render scrollTo top
  useEffect(() => {
    var searchQuery = window.location.search
    let queryList = searchQuery.split("=")
    var tabValue = queryList[queryList.length - 1]
    if (tabValue?.toLowerCase() === "orderhistory") {
      handleScroll(orderHistoryRef)
    }
    else {
      scrollToTop();
    }
  }, [])

  const profileRef = useRef<HTMLElement | null>(null);
  const paymentMethodsRef = useRef<HTMLElement | null>(null);
  const notificationsRef = useRef<HTMLElement | null>(null);
  const orderHistoryRef = useRef<HTMLElement | null>(null);

  // On clicking tabs scroll to that location logic
  const handleScroll: any = (ref: React.MutableRefObject<HTMLElement | null>) => {
    if (ref?.current?.offsetTop) {
      if (ref?.current?.id === 'Details') {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        if (screenSize > 1200) {
          window.scrollTo({ top: ref?.current?.offsetTop + 260, behavior: "smooth" })
        } else {
          window.scrollTo({ top: ref?.current?.offsetTop + 780, behavior: "smooth" })
        }
      }
    } else {
      if (ref?.current?.offsetTop === 0) {
        if (ref?.current?.id === 'Details') {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className='SM-profile'>
        <Container>
          <Header />
        </Container>
        <Box className='SPtabs'>
          {token && <AppBar className='membersAppBar' position='sticky' sx={{ top: '92px', background: '#FFFFFF', boxShadow: 'none' }}>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Container>
                <Scrollspy items={['Details', 'Payment-Methods', 'Notifications', 'Order-History']} offset={-200} className="nav__inner" currentClassName="is-current">
                  <li className='nav__item' onClick={() => handleScroll(profileRef)}><a >Details</a></li>
                  <li className='nav__item' onClick={() => handleScroll(paymentMethodsRef)}><a >Payment Methods</a></li>
                  <li className='nav__item' onClick={() => handleScroll(notificationsRef)}><a>Notifications</a></li>
                  <li className='nav__item' onClick={() => handleScroll(orderHistoryRef)}><a>Order History</a></li>
                </Scrollspy>
              </Container>
            </Box>
            {/* End Tabs */}
          </AppBar>}

          <Container style={{ backgroundColor: "#ffffff" }}>
            <Grid container spacing={2} mt={3}>
              {/* User profile info */}
              {token && <ProfileImage />}
              {/* Tabs Section */}
              <Grid item lg={8} xs={12}>
                <Box className='profile-details' sx={{ paddingLeft: { lg: '1.5rem', xs: '0' } }}>
                  {<section className={`${!token ? 'disabled-section' : ''}`} id="Details" ref={profileRef} ><Profile /></section>}
                  {<section className={`${!token ? 'disabled-section' : ''}`} id="Payment-Methods" ref={paymentMethodsRef}><PaymentMethods /></section>}
                  {<section className={`${!token ? 'disabled-section' : ''}`} id="Notifications" ref={notificationsRef}><Notifications /></section>}
                  <section id="Order-History" ref={orderHistoryRef}>
                    {orderHistory?.data?.length > 0 ?
                      <OrderHistory
                        data={orderHistory?.data}
                        meta={orderHistory?.meta}
                        page={page}
                        setPage={setPage} />
                    :
                      <Box className='orderHistory-wrapper'>
                        <Box mt={5}>
                          <Typography variant='h3'>Order History</Typography>
                        </Box>
                        <Stack className="RaceRecordTable" mt={2}>
                          <Box className='smp-no-data'>
                            <Typography variant='h6'>No Previous Orders Found!</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    }
                  </section>
                </Box>
              </Grid>
              {/* End Tabs Section */}
            </Grid>
          </Container>
        </Box>
      </Box>
    </StyledEngineProvider>
  )
}

export default ProfileController