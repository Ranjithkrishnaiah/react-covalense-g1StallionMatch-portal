import React from 'react'
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoginSchema } from 'src/@types/login';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from '../assets/images'
import { Divider, InputLabel, MenuItem, MenuList, StyledEngineProvider, Typography, Button, TextField, Grid, Stack } from '@mui/material';
import { ROUTES } from '../routes/paths'
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { WrapperDialog } from '../components/WrappedDialog/WrapperDialog';
import { cartItems } from '../constants/CartItems';
import ForgotPassword from './ForgotPassword';
import Registration from './Registration';
import useAuth from '../hooks/useAuth';
import './LRpopup.css'
import { useLoginMutation } from 'src/redux/splitEndpoints/loginSplit';


function CheckoutLogin() {
  const [login, response] = useLoginMutation();
  const [submissionError, setSubmissionError] = React.useState("");
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const [registeration, setRegistration] = React.useState(false);
  const [registrationTitle, setRegistrationTitle] = React.useState('Create Account');
  const [openLogin, setOpenLogin] = React.useState(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = React.useState(false);
  const navigate = useNavigate();
  const loading = response.isLoading;

  React.useEffect(() => {
    if (response.isSuccess) {

      const userData = {
        ...response?.data?.member,
        myFarms: response?.data?.myFarms,
        stallionShortlistCount: response?.data?.stallionShortlistCount,
      }
      window.localStorage.setItem("accessToken", response?.data?.accessToken)
      window.localStorage.setItem("user", JSON.stringify(userData))
      window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setUser(response?.data?.member)
      setAuthentication(true)
      reset();
      navigate(ROUTES.DASHBOARD);
    }
  }, [response])

  const { setAuthentication, setUser } = useAuth();

  // login schema
  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required(ValidationConstants.emailValidation),
    password: Yup.string().required(ValidationConstants.passwordValidation)
  })

  // form element
  const methods = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
    criteriaMode: "all"
  })

  // form parameters
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = methods;

  // Submit login details
  const SubmitLogin = async (loginData: LoginSchema) => {
    try {
      await login(loginData);
    } catch (error) {
    }
  };

  // Open registration popup
  const notHaveAccount = () => {
    setRegistration(true);
  }

  // Open Forgot Password popup
  const openForgotPasswordDialog = () => {
    setForgotPassword(true)
  }

  return (
    <StyledEngineProvider injectFirst>
      {/* Login form */}
      <form className='logincheck-wrpr' onSubmit={handleSubmit(SubmitLogin)} autoComplete='off'>
        {/* Forgot Password popup  */}
        <WrapperDialog
          open={forgotPassword}
          title="Forgot Password"
          onClose={() => setForgotPassword(false)}
          body={ForgotPassword}
        />
        {/* registration popup */}
        <WrapperDialog
          open={registeration}
          title={registrationTitle}
          onClose={() => setRegistration(false)}
          openOther={() => setOpenLogin(true)}
          changeTitleTo={setRegistrationTitle}
          body={Registration}
          setIsFirstLogin={() => false}
          setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        />
        {/* Login form elements  */}
        <Box mt={2}>
          <InputLabel>Email Address</InputLabel>
          <TextField
            sx={{ marginTop: '6px' }}
            type='text'
            fullWidth
            autoComplete='new-password'
            {...register('email', { required: true })}
            placeholder='Enter Email Address'

          />
          <p className='checkout-error-msg'>{errors.email?.message}</p>
        </Box>
        <Box sx={{ display: 'flex' }} mt={3}>
          <InputLabel>Password</InputLabel>
          <Button className='FPbutton' disableRipple
            onClick={openForgotPasswordDialog}>Forgot password</Button>
        </Box>
        <TextField
          sx={{ marginTop: '6px' }}
          fullWidth
          type='password'
          autoComplete='new-password'
          {...register('password', { required: true })}
          placeholder='Enter Password'
        />
        <p className='checkout-error-msg'>{errors.password?.message}</p>
        <Grid container mt={5}>
          <Grid item lg={8} xs={12}>
            <Typography flexGrow={1} className='signupac'>Don’t have an account?
              <Button variant='text'
                className='FPbutton'
                sx={{ position: 'relative', top: '-3px', left: '5px' }}
                onClick={notHaveAccount}> Sign up now
              </Button>
            </Typography>
          </Grid>
          <Grid item lg={4} xs={12} className='logincheckout'>
            <CustomButton type="submit" fullWidth className="checkout-Button" disabled={loading}> Login</CustomButton>
            <p>{submissionError}</p>
          </Grid>
        </Grid>
        {/* End Login form elements  */}
        <Grid container mt={1} className='quest-checkout-box'>
          <Grid item lg={8} xs={12} className='quest-checkout-empty'>
            &nbsp;
          </Grid>
          <Grid item lg={4} xs={12} className='quest-checkout-button'>
            <CustomButton onClick={() => navigate('/payment')} fullWidth className="viewButton" sx={{ height: '46px !important', fontSize: '16px !important' }} disabled={loading}> Guest</CustomButton>
            <p>{submissionError}</p>
          </Grid>
        </Grid>
      </form>
      {/* End Login form */}
    </StyledEngineProvider>
  )
}

export default CheckoutLogin

CheckoutLogin.propTypes = {

}