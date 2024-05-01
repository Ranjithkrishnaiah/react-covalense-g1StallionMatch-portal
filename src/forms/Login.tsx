import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoginSchema } from 'src/@types/login';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CustomButton } from 'src/components/CustomButton';
import {
  InputLabel,
  StyledEngineProvider,
  Typography,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import { ROUTES } from '../routes/paths';
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { VoidFunctionType } from '../@types/typeUtils';
import { cartItems } from '../constants/CartItems';
import useAuth from '../hooks/useAuth';
import './LRpopup.css';
import { useLoginMutation } from 'src/redux/splitEndpoints/loginSplit';
import { useGetCartItemsQuery } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { useLocation, useParams } from 'react-router-dom';
import { useGetVerifedEmailQuery } from 'src/redux/splitEndpoints/verifyEmail';
import { Images } from 'src/assets/images';
import GoogleLoginForm from './GoogleLoginForm';

function Login(
  onClose: VoidFunctionType,
  openOther: VoidFunctionType,
  OFP: VoidFunctionType,
  firstLogin: boolean,
  farmAdminFirstLogin: boolean,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  setRegistrationTitle?: VoidFunctionType,
  forwardLinkObj?: any
) {
  const { authentication, setAuthentication, setUser } = useAuth();
  const closeAndReset = onClose;
  const openRegistration = openOther;
  const {
    data: realCartItems,
    isLoading,
    isSuccess,
    isError,
  } = useGetCartItemsQuery(null, { skip: !authentication, refetchOnMountOrArgChange: true });
  const [login, response] = useLoginMutation();
  const [submissionError, setSubmissionError] = React.useState('');
  const navigate = useNavigate();
  const loading = response.isLoading;
  const { hash } = useParams();
  const { pathname } = useLocation();
  const confirmEmail = pathname.includes('/confirm-email') && !!hash;
  const inviteUser = pathname.includes('/invite-user') && !!hash;
  let isDashboard = pathname.includes('/dashboard');
  const currentPage = pathname.split('/');
  const {
    data: verifyEmailData,
    isFetching: isVerifyEmailFetching,
    isLoading: isVerifyEmailLoading,
    isSuccess: isVerifyEmailSuccess,
  } = useGetVerifedEmailQuery(hash, { skip: !confirmEmail });
  // Set cart item
  React.useEffect(() => {
    if (isSuccess) {
      window.localStorage.setItem('realCartItems', JSON.stringify(realCartItems));
    }
  }, [isSuccess]);

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
      reset();

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

  // Login schema for form
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Incorrect email address')
      .required(ValidationConstants.emailValidation),
    password: Yup.string().required(ValidationConstants.passwordValidation),
  });

  // Form element
  const methods = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  // Form parameters
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = methods;

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
    setSubmissionError('');
  }

  // Submit login form
  const SubmitLogin = async (loginData: any) => {
    let loginObj = Object.assign({}, loginData);
    if (inviteUser) {
      loginObj.invitationKey = hash;
    }
    try {
      let res: any = await login(loginObj);
    } catch (error) {
      console.error(error);
    }
  };

  // Open registration popup if user don't have account
  const notHaveAccount = () => {
    closeAndReset();
    openRegistration();
    if (setRegistrationTitle) setRegistrationTitle();
  };

  // Open Forgot Password popup
  const openForgotPasswordDialog = () => {
    closeAndReset();
    OFP();
  };

  return (
    <StyledEngineProvider injectFirst>
      {/* Login form  */}
      <form onSubmit={handleSubmit(SubmitLogin)} autoComplete="on">
        {confirmEmail && (
          <Box className="congratulation-box">
            <InputLabel>Thank you for verifying your account.</InputLabel>
            <InputLabel>Log in to your profile below to get started.</InputLabel>
            {/* <InputLabel>Congratulations! You are now a Stallion Match Member.</InputLabel>
            <InputLabel>Log in to your profile to get started.</InputLabel> */}
          </Box>
        )}
        {inviteUser && !firstLogin && (
          <Box className="congratulation-box">
            <InputLabel>Congratulations! You are now a Stallion Match Member.</InputLabel>
            <InputLabel>Log in to your profile to get started.</InputLabel>
          </Box>
        )}
        {!confirmEmail && firstLogin && !farmAdminFirstLogin ? (
          <Box className="congratulation-box invitaion-congrts-box">
            <InputLabel>Congratulations! You are now a Stallion Match Member.</InputLabel>
            <InputLabel>Please check your email to confirm your account within 24hrs.</InputLabel>
            <br />
            <InputLabel>Log in to your profile below to get started.</InputLabel>
          </Box>
        ) : !confirmEmail && firstLogin && farmAdminFirstLogin ? (
          <Box className="congratulation-box">
            <InputLabel>Congratulations! You are now a Stallion Match Member.</InputLabel>
            <InputLabel>Please check your email to see how to maximise your </InputLabel>
            <InputLabel>farm’s reach on Stallion Match.</InputLabel>
            <br />
            <InputLabel>Log in to your profile below to get started.</InputLabel>
          </Box>
        ) : (
          <Box>
            {/* <Box mt={3}>
                  <MenuList className='social' sx={ {display: {lg: 'flex', sm:'flex', xs: 'grid'}, justifyContent: 'center'} }>
                    <MenuItem disableGutters disableRipple>
                    <img src={Images.GoogleLarge} alt='Google'/>                    
                    </MenuItem>
                    <MenuItem disableGutters disableRipple sx={ {ml: 'auto'} }>
                    <img src={Images.AppleLarge} alt='Apple'/>                    
                    </MenuItem>
                    <MenuItem disableGutters disableRipple sx={ {ml: 'auto'} }>
                    <img src={Images.TwitterLarge} alt='Twitter'/>                    
                    </MenuItem>
                  </MenuList>
              </Box>
              <Divider sx={ {py: '2rem'} }>Or</Divider> */}
          </Box>
        )}
        <Box mt={5} className="loginBoxWrapper">
          <GoogleLoginForm
            title={'Sign In using your Google Account.'}
            closeAndReset={closeAndReset}
            setSubmissionError={setSubmissionError}
            forwardLinkObj={forwardLinkObj}
          />
          <Box mb={3}>
            <Divider>
              <Typography variant="h6">Or</Typography>
            </Divider>
          </Box>

          <InputLabel>Email Address</InputLabel>
          <TextField
            error={errors.email?.message ? true : false}
            type="text"
            fullWidth
            autoComplete="on"
            {...register('email', { required: true })}
            placeholder="Enter Email Address"
            defaultValue={confirmEmail ? verifyEmailData?.email : ''}
          />
          <p className="error-text">
            {errors.email?.message}
            {!errors.email ? (
              <p className={submissionError === 'Email Not Exist!' ? 'error-text-in' : 'hide'}>
                There doesn't seem to be an account with this email
              </p>
            ) : null}
          </p>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <InputLabel>Password</InputLabel>
          <Button className="popup-btn forgot-btn" disableRipple onClick={openForgotPasswordDialog}>
            Forgot password
          </Button>
        </Box>
        <TextField
          error={errors.password?.message ? true : false}
          fullWidth
          type="password"
          autoComplete="on"
          {...register('password', { required: true })}
          placeholder="Enter Password"
        />
        <p className="error-text">
          {errors.password?.message}
          {!errors.password ? (
            <p className={submissionError === 'Incorrect Password' ? 'error-text-in' : 'hide'}>
              Username and Email did not match. Please try again.
            </p>
          ) : null}
        </p>
        <CustomButton type="submit" fullWidth className="lr-btn" disabled={submissionError !== ''}>
          Login
        </CustomButton>
        <p
          className={
            submissionError === 'Incorrect Password' || submissionError === 'Email Not Exist!'
              ? 'hide'
              : 'error-text'
          }
        >
          {submissionError}
        </p>
        {!confirmEmail && !firstLogin && !inviteUser && (
          <Typography className="signupac logindonthave">
            Don’t have an account?
            <Button
              variant="text"
              sx={{ position: 'relative', top: '-4px', left: '5px' }}
              className="popup-btn"
              onClick={notHaveAccount}
            >
              {' '}
              Sign up now
            </Button>
          </Typography>
        )}
      </form>
      {/* End Login form  */}
    </StyledEngineProvider>
  );
}

export default Login;

Login.propTypes = {
  closeAndReset: PropTypes.func.isRequired,
  OFP: PropTypes.func.isRequired,
  openRegistration: PropTypes.func.isRequired,
  firstLogin: PropTypes.bool.isRequired,
};
