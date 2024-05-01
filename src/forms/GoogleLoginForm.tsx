import React from 'react';
import { StyledEngineProvider, Box, Typography } from '@mui/material';
import { Images } from 'src/assets/images';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from 'src/redux/splitEndpoints/GogleloginSplit';
import { cartItems } from 'src/constants/CartItems';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router';
import { ROUTES } from 'src/routes/paths';
import { VoidFunctionType } from 'src/@types/typeUtils';

interface GoogleLoginProps {
  title: string;
  closeAndReset: VoidFunctionType;
  setSubmissionError: React.Dispatch<React.SetStateAction<string>>;
  forwardLinkObj?: any;
}
function GoogleLoginForm(props: GoogleLoginProps) {
  const { title, closeAndReset, setSubmissionError, forwardLinkObj } = props;
  const { authentication, setAuthentication, setUser } = useAuth();
  // navigation
  const navigate = useNavigate();
  // states
  const [googleAccessToken, setGoogleAccessToken] = React.useState('');

  // googleLogin Handler
  const googleLoginHandler = useGoogleLogin({
    onSuccess: (credentialResponse: any) => setGoogleAccessToken(credentialResponse?.access_token),
    onError: (error: any) => console.log('Login Failed', error),
  });

  // API call for Google Login
  const [googleLogin, response] = useGoogleLoginMutation();
  React.useEffect(() => {
    if (googleAccessToken) {
      let dataPayload = { token: googleAccessToken };
      googleLogin(dataPayload);
    }
  }, [googleAccessToken]);

  // On successfull login set user details in local storage
  React.useEffect(() => {
    if (response.isSuccess) {
      const userData = {
        ...response?.data?.member,
        myFarms: response?.data?.myFarms,
        stallionShortlistCount: response?.data?.stallionShortlistCount,
      };

      window.localStorage.setItem('accessToken', response?.data?.accessToken);
      window.localStorage.setItem('user', JSON.stringify(userData));
      window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
      window.localStorage.setItem('isTokenExpired', 'No');
      window.localStorage.setItem(
        'tokenExpiresTime',
        JSON.stringify(new Date().getTime() + 60 * 60 * 24 * 1000)
      );
      if (response?.data?.stallionShortlistCount > 0) {
        window.localStorage.setItem('isStallionShortListPage', 'active');
      }

      setUser(response?.data?.member);
      setAuthentication(true);
      // reset();

      // Redirect to forward link if it is present
      if (forwardLinkObj) {
        navigate(forwardLinkObj?.url);
      } else {
        if (
          window.location.pathname === '/' ||
          window.location.pathname.search('reset-password') > 0 ||
          window.location.pathname.search('confirm-email') > 0
        ) {
          navigate(ROUTES.DASHBOARD);
        } else {
          navigate(window.location.pathname);
        }
      }

      closeAndReset();
    } else if (response.isError && response.error) {
      const error: any = response.error;
      if (error.status > 399 && error.status < 500) var obj = error?.data?.errors;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          setSubmissionError(element);
          setTimeout(function () {
            setSubmissionError(element);
          }, 5000);
        }
      }
      // setSubmissionError("Invalid Credentials")
      if (error.status >= 500) setSubmissionError('Network issue or Server is down.');
      setTimeout(function () {
        setSubmissionError('');
      }, 5000);
    }
  }, [response]);

  return (
    <StyledEngineProvider injectFirst>
      <Box className="loginGoogle" onClick={() => googleLoginHandler()}>
        <img src={Images.GoogleLarge} />
        <Typography variant="h6">{title}</Typography>
      </Box>
    </StyledEngineProvider>
  );
}

export default GoogleLoginForm;
