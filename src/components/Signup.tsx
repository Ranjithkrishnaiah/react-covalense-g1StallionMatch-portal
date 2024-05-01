import { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material'
import { useLocation, useParams } from 'react-router-dom';
import Registration from 'src/forms/Registration';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import Login from 'src/forms/Login';
import ForgotPassword from 'src/forms/ForgotPassword';
import { CustomButton } from './CustomButton';
import '../pages/homePage/home.css';
import { useAcceptFarmInvitationMutation, useVerifyUserInviteMutation } from 'src/redux/splitEndpoints/VerifyUserInviteSplit';
import useAuth from 'src/hooks/useAuth';

type SignUpProps = {
  btnName?: string;
  btnClass?: string;
  trends?: boolean;
  isArrowIcon?: boolean;
  headerBanner?: any
}
function Signup(props: SignUpProps) {
  const { pathname } = useLocation();
  const { hash } = useParams();
  const { authentication, setLogout } = useAuth();
  const [verifyUserInvite, verifyUserInviteResponse] = useVerifyUserInviteMutation();
  const [acceptFarmInvitation, acceptFarmInvitationResponse] = useAcceptFarmInvitationMutation();
  const isNewMember: boolean = pathname.includes('/invite-user') && !!hash && !!verifyUserInviteResponse.data?.isMember === true;
  const [openRegisteration, setOpenRegistration] = useState(false);
  const [registrationTitle, setRegistrationTitle] =
    useState(pathname.includes('/invite-user') && !isNewMember ? 'Invitation Accepted' : 'Create Account');
  const [openLogin, setOpenLogin] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
  const trends = props.trends || false;

  return (
    <Box>
      <WrapperDialog
        open={openRegisteration}
        title={registrationTitle}
        onClose={() => setOpenRegistration(false)}
        openOther={() => setOpenLogin(true)}
        changeTitleTo={setRegistrationTitle}
        body={Registration}
        setIsFirstLogin={setIsFirstLogin}
        setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        hash={hash}
        fullName={verifyUserInviteResponse.data?.fullName}
        InvitedEmail={verifyUserInviteResponse.data?.email}
        isLoginOpen={openLogin}
        closeLogin={() => setOpenLogin(false)}
      />
      <WrapperDialog
        open={forgotPassword}
        title="Forgot Password"
        onClose={() => setForgotPassword(false)}
        body={ForgotPassword}
      />
      <WrapperDialog
        open={openLogin}
        dialogClassName='dialogPopup createAccountPopup'
        title={isFirstLogin ? "Welcome to Stallion Match" : 'Log in'}
        onClose={() => setOpenLogin(false)}
        openOther={() => setOpenRegistration(true)}
        OFP={() => setForgotPassword(true)}
        firstLogin={isFirstLogin}
        body={Login}
        farmAdminFirstLogin={isFarmAdminFirstLogin}
        setRegistrationTitle={() => setRegistrationTitle('Create Account')}
      />
      {trends === true ?
        <Box className='trends-signup' sx={{ display: { lg: 'block', xs: 'block' } }}>
          <Box className='trends-tiles' />
          <Box>
            <Typography variant="h2">
              {/* Harness the Power of Stallion Match */}
              {props?.headerBanner?.title}
            </Typography>
          </Box>
          <Box pt={1}>
            <Grid lg={11} xs={12}>
              <Typography variant='h6'>
                {/* Experience all of the features Stallion Match has to offer by becoming a member<br />
              free. You will then have full access to find your Perfect Match and track key breeding <br />
              data through your unique Dashboard. */}
                {props?.headerBanner?.description}
              </Typography>
            </Grid>
          </Box>
          <Box pt={3}>
          <Button
            onClick={() => {
              if (props?.headerBanner?.buttonUrl) {
                window.open(props.headerBanner.buttonUrl, '_blank');
              } else {
                setOpenRegistration(true);
              }
            }}className='homeSignup'>{props?.headerBanner?.buttonText}</Button>

          </Box>
        </Box> :
        <Box>
          {<CustomButton disableRipple onClick={() => setOpenRegistration(true)}
            className={props.btnClass || 'homeSignup'}>
            {props.btnName || "Sign up"} {props?.isArrowIcon && <i className='icon-Arrow-right' />}
          </CustomButton>}
        </Box>
      }
    </Box>
  )
}

export default Signup