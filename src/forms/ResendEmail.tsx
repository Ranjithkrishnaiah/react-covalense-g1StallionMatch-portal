import React, { useEffect } from 'react';
import { CustomButton } from 'src/components/CustomButton';
import { StyledEngineProvider, Typography, Button, TextField, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { VoidFunctionType } from '../@types/typeUtils';
import './LRpopup.css';
import { useResendConfirmEmailMutation } from 'src/redux/splitEndpoints/resendConfirmEmailSplit';
import useAuth from 'src/hooks/useAuth';
import { toast } from 'react-toastify';

function ResendEmail(
  onClose: VoidFunctionType,
  confirmYourAcccount: any,
  apiStatus: boolean,
  setApiStatus: any,
  apiStatusMsg: any,
  setApiStatusMsg: any
) {
  const close = onClose;
  const { user } = useAuth();
  const [resendEmail, response] = useResendConfirmEmailMutation();
  const [submissionStatus, setSubmissionStatus] = React.useState('');
  let USER: any = user;
  
  // on success
  const notifySuccess = () => {
    toast.success('Your verification email has been sent successfully!', {
      autoClose: 2000,
    });
  };
  // on error
  const notifyError = () => {
    toast.error('We were unable to send verification email. Please try again.', {
      autoClose: 2000,
    });
  };

  // on API response handle success or error
  useEffect(() => {
    if (response.isSuccess) {
      setSubmissionStatus('Your verification email has been sent successfully!');
      close();
      notifySuccess();
    }
    if (response.isError) {
      setSubmissionStatus('We were unable to send verification email. Please try again.');
      close();
      notifyError();
    }
  }, [response]);

  // on submit resend email handler
  const onSubmitHandler = () => {
    resendEmail('email');
  };

  return (
    <StyledEngineProvider injectFirst>
      <Grid container>
        <Grid item>
          <Box className="resendEmail-box">
            <Typography variant="h6">
              An email will be sent to {JSON.parse(localStorage.user).email} when you confirm below.
              Simply click the link within this email to confirm your account.
            </Typography>
            <CustomButton fullWidth className="lr-btn resendEmail-Btn" onClick={onSubmitHandler}>
              Resend Email
            </CustomButton>
            <p>{submissionStatus}</p>
          </Box>
        </Grid>
      </Grid>
    </StyledEngineProvider>
  );
}

export default ResendEmail;
