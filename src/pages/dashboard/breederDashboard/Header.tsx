import { Container, Grid, Typography, StyledEngineProvider, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import ResendEmail from 'src/forms/ResendEmail';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';
import { CustomToasterMessage } from 'src/components/toasterMessage/customToasterMessage';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

function Header() {
  const { authentication,setAuthentication } = useAuth();
  const [isConfirmAccount, setIsConfirmAccount] = useState(true);
  const [openConfirmAccount, setOpenConfirmAccount] = useState(false);
  const [loading, setLoading] = useState(true);

  window.sessionStorage.removeItem('MyFavouriteListFrom');
  // API call to get user details
  const {data: responseAuthMe,isFetching} = useAuthMeQuery(null, {
    skip: !authentication,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if(authentication && loading){
      setLoading(false);
    }
  },[authentication,loading])

  // resend mail handler
  const resendClickHandler = () => {
    setOpenConfirmAccount(true);
  };

  const [apiStatus, setApiStatus] = useState(false);
  const [apiStatusMsg, setApiStatusMsg] = useState({});

    return (
    <>
      <StyledEngineProvider injectFirst>
        <Container maxWidth="lg">
          {(responseAuthMe?.isVerified === true || isFetching === true) ? (
            ''
          ) : (
            <Grid className={`account-confirm ${isConfirmAccount ? 'show' : 'hide'}`}>              
              {/* toast message */}
              {apiStatus && (
                <CustomToasterMessage
                  apiStatus={true}
                  setApiStatus={setApiStatus}
                  apiStatusMsg={apiStatusMsg}
                  setApiStatusMsg={setApiStatusMsg}
                />
              )}
              <Box className="resendEmail-toast" my={4}>
                <Typography variant="h5">
                  <strong>Please confirm your account!</strong>&nbsp;Check your email to confirm
                  your account. Click&nbsp;
                  <strong className="resendConfirm" onClick={resendClickHandler}>
                    Resend
                  </strong>
                  &nbsp;to resend the confirmation email & verify within 24hrs.
                </Typography>
                <i className="icon-Cross" onClick={() => setIsConfirmAccount(false)} />
              </Box>
              {/* WrapperDialog for ResendEmail */}
              <Box>
                <WrapperDialog
                  open={openConfirmAccount}
                  title="Confirm Your Account"
                  onClose={() => setOpenConfirmAccount(false)}
                  body={ResendEmail}
                  confirmYourAcccount={''}
                  apiStatus={true}
                  setApiStatus={setApiStatus}
                  apiStatusMsg={apiStatusMsg}
                  setApiStatusMsg={setApiStatusMsg}
                />
              </Box>
            </Grid>
          )}
          <Grid container mt={5} mb={2} className="dashboard-header">
            <Grid item lg={8} xs={12}>
              <HeaderBreadcrumbs
                heading="Profile"
                links={[
                  { name: 'Home', href: '/' },
                  { name: 'My Dashboard' },
                ]}
              />
            </Grid>
            <Grid item lg={8} xs={12} mt={2}>
              <Typography variant="h2">My Dashboard</Typography>
            </Grid>
          </Grid>
        </Container>
      </StyledEngineProvider>
    </>
  );
}

export default Header;
