import React from 'react'
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoginSchema } from 'src/@types/login';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from '../assets/images'
import {
  Divider, InputLabel, MenuItem, MenuList, StyledEngineProvider,
  Typography, Button, TextField
} from '@mui/material';
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { VoidFunctionType } from "../@types/typeUtils";
import useAuth from '../hooks/useAuth';
import './LRpopup.css'
import { useResendLinkMutation } from 'src/redux/splitEndpoints/resendLinkSplit';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import ForgotPassword from './ForgotPassword';
import { useValidateLinkMutation } from 'src/redux/splitEndpoints/validateLinkStatusSplit';


export type ResendLinkSchema = {
  hash: string;
}

function LinkExpired(onClose: VoidFunctionType, link: string) {
  const close = onClose;
  const [submissionError, setSubmissionError] = React.useState("");
  const [resendLink, response] = useResendLinkMutation();
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const [errorCode, setErrorCode] = React.useState(null);
  const resendLinkSchema = Yup.object().shape({
    hash: Yup.string().required()
  })
  const [validate, hashResponse] = useValidateLinkMutation();

  React.useEffect(() => {
    if (link) {
      callToValidateLink();
    }
  }, [])

  const callToValidateLink = async () => {
    let res: any = await validate({ hash: link });
    // console.log(res, 'RESPNSE : in link')
    if (res.error) {
      setErrorCode(res?.error?.status);
    } else if (res.isSuccess) {
      setErrorCode(null);
    }
  }

  const methods = useForm<ResendLinkSchema>({
    resolver: yupResolver(resendLinkSchema),
    mode: "onTouched",
    criteriaMode: "all"
  })

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = methods;

  const ResendLink = async ({ hash }: ResendLinkSchema) => {
    if (errorCode !== 422) {
      try {
        // { console.log("LINK: ", hash) }
        const res = await resendLink({ hash });
        const response: any = res;
        if (response.isSuccess) {
          setSubmissionError("New Reset password link has been sent to your registered email.")
        }
        else if (response.error) {
          setErrorCode(response?.error?.status);
          if (response.error.status > 399 && response.error.status <= 499) {
            setSubmissionError(`Credentials provided didn't match records. Please check and try again, Error code: ${response.error.status}`);
          }
          else if (response.error.status > 499) {
            setSubmissionError(`Server responed with error code: ${response.error.status}`)
          }
        } else {
          // console.log("RES: ", response);
        }
        // console.log("RES: ", res);
      } catch (error) {
        console.error(error);
      }
    } else {
      if (errorCode === 422) {
        // close();
        setForgotPassword(true);
      }
    }
  };

  return (
    <StyledEngineProvider injectFirst>

      <form onSubmit={handleSubmit(ResendLink)} autoComplete='off'>

        <Box mt={4} className='forgot-password-box'>


          {errorCode !== 422 && <Typography variant='h6'>Your link has expired, because you haven't used it. Reset password link expires in every 24 hours and can be used only once. You can create one by clicking the button below.
          </Typography>}
          {errorCode === 422 && <Typography variant='h6'>Your link is no longer active as it has already been used to reset your password once before. You can request a new forgot email link by clicking the button below.
          </Typography>}


          {/* {console.log("LINK: ", link)} */}
          <TextField
            fullWidth
            autoComplete='new-password'
            className='hide'
            defaultValue={link}
            type='text'
            {...register('hash', { required: true })}
            placeholder='Enter Email Address'
          />
          <Box mt={3}>
            <CustomButton type="submit"
              fullWidth className="lr-btn"
              disabled={false}
            > Resend a New Email Link</CustomButton>
            <p>{submissionError}</p>
          </Box>
        </Box>
      </form>
      <WrapperDialog
        open={forgotPassword}
        title="Forgot Password"
        onClose={() => setForgotPassword(false)}
        body={ForgotPassword}
      />
    </StyledEngineProvider>
  )
}

export default LinkExpired

LinkExpired.propTypes = {
  close: PropTypes.func.isRequired,
}