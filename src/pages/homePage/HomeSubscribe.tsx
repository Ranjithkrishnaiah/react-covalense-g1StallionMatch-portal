import {
  Box,
  Container,
  Grid,
  Stack,
  StyledEngineProvider,
  TextField,
  Typography,
} from '@mui/material';
import { reset } from 'numeral';
import { useEffect, useState } from 'react';
import { useAddEmailSubscriptionMutation } from 'src/redux/splitEndpoints/addEmailSubscriptionSplit';
import { useReportEmailValidationQuery } from 'src/redux/splitEndpoints/reportEmailValidationSplit';
import './home.css';

function HomeSubscribe() {
  const [emailSubscription, setEmailSubscription] = useState('');
  // Post email subscription api call
  const [addEmailSubscription, response] = useAddEmailSubscriptionMutation();
  const [emailValidValue, setEmailValidValue] = useState('');
  const [isSubscriptionSuccess, setIsSubscriptionSuccess] = useState(false);
  const [errorEmail, setEmailError] = useState('');
  const [isEmailApi, setIsEmailApi] = useState(false);
  let emailData: any = {
    email: emailValidValue,
  };  
  
  const handleEmailSubscription = (e: any) => {    
    setEmailSubscription(e.target.value);
    if( e.which == 9 ) {
      setIsEmailApi(true); 
    }  
  };

  // Email validation api call
  const {
    data: emailDataApi,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useReportEmailValidationQuery(emailData, {skip: (!isEmailApi)});
  
  useEffect(() => {
    if (response?.isSuccess) {
      setIsSubscriptionSuccess(true);
    }
    setTimeout(() => {
      setEmailSubscription('');
      setEmailError('');
      setIsSubscriptionSuccess(false);
    }, 3000);
  }, [response?.isSuccess]);

  useEffect(() => {
    if (!!error && 'data' in error) {
      if (error?.status === 409) {
        // console.log("Triggered... ", error)
        setEmailError('Email already exists');
      }
      if (error?.status === 422) {
        setEmailError('Please check your email and try again.');
      }
    } else {
      if(response?.isError) {
        setEmailError('Email already exists');
      }
    }
  }, [error, isError, response]);

  const handleSubmit = async() => {
      if(emailSubscription === ""){
        setIsEmailApi(false);
      } else {
        setIsEmailApi(true);
      }
      const data = {
        email: emailSubscription,
      };
      try {
        if(isEmailApi) {
          addEmailSubscription(data);
        }      
      } catch (e) {
        console.log(e);
      }    
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box className="HomeSubscribe">
          <Container>
            <Grid lg={10} xs={12}>
              <Box sx={ { pl: { lg: '5rem', xs: '0' } } }>
                <Typography variant="h4" sx={ { color: '#FFFFFF' } }>
                  Subscribe to get the latest Stallion Match insights direct to your inbox.
                </Typography>
              </Box>
            </Grid>
            <Grid lg={11} xs={12}>
              <Box sx={ { ml: { lg: '5rem', xs: '0' } } } className="Subscribe">
                <TextField
                  fullWidth
                  type="text"
                  value={emailSubscription}
                  placeholder="Enter email address"
                  onChange={handleEmailSubscription}
                  onBlur={(e: any) => setEmailValidValue(e.target.value)}
                  onFocus = {(e) => {if(errorEmail !== ''){setEmailSubscription(emailSubscription);setEmailError('');setIsEmailApi(false)} }}
                />
                <i
                  className="icon-Arrow-circle-right"
                  onClick={ emailSubscription.length <=0? ()=>{}: handleSubmit}
                  style={ { fontSize: '40px' } }
                 />
              </Box>
              {isSubscriptionSuccess && (
                <Typography
                  component="p"
                  sx={ { ml: { lg: '5rem', xs: '0' } } }
                  mt={2}
                  className="subSuccess"
                >
                  Thank you. Your insight report has been emailed to the registered address.
                </Typography>
              )}
              {errorEmail !== '' && (
                <Typography
                  component="p"
                  sx={ { ml: { lg: '5rem', xs: '0' } } }
                  mt={2}
                  className="subSuccess subError"
                >
                  {errorEmail}
                </Typography>
              )}
            </Grid>
          </Container>
        </Box>
      </StyledEngineProvider>
    </>
  );
}

export default HomeSubscribe;
