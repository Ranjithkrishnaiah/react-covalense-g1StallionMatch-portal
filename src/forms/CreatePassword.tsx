import React, { useEffect } from 'react'
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CustomButton } from 'src/components/CustomButton';
import {
  InputLabel, StyledEngineProvider,
  IconButton, TextField
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { VoidFunctionType } from "../@types/typeUtils";
import useAuth from '../hooks/useAuth';
import './LRpopup.css'
import { useResetPasswordMutation } from 'src/redux/splitEndpoints/resetPasswordSplit';
import { useUpdatePasswordMutation } from 'src/redux/splitEndpoints/postUpdatedPassword';

type CreatePasswordSchema = {
  password: string;
  confirmNewPassword: string;
  hash?: string;
}

export type newPasswordType = {
  password: string;
}

function CreatePassword(onClose: VoidFunctionType,
  name: string, email: string, securityKey: string,
  Reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>,
  openSuccessUpdate?: boolean,
  setOpenSuccessUpdate?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const close = onClose;
  const { authentication } = useAuth();
  const [resetPassword, response] = useResetPasswordMutation();
  const [updatePassword, updatePasswordResponse] = useUpdatePasswordMutation();
  const [passwordLengthError, setPasswordLengthError] = React.useState<boolean | null>(null);
  const [passwordAlphabetError, setPasswordAlphabetError] = React.useState<boolean | null>(null);
  const [passwordNumberError, setPasswordNumberError] = React.useState<boolean | null>(null);
  const [passwordMatchingError, setPasswordMatchingError] = React.useState<boolean | null>(null);
  const [submissionError, setSubmissionError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // On success close the popup
  useEffect(() => {
    if (response.isSuccess && setOpenSuccessUpdate) {
      setOpenSuccessUpdate(true);
      close();
    }
  }, [response.isSuccess])

  // show password
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  // show confirm password
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  // Create Password Schema validation
  const createPasswordSchema = Yup.object().shape({
    password: Yup.string().required(ValidationConstants.passwordValidation),
    confirmNewPassword: Yup.string().required(ValidationConstants.confirmPasswordValidation)
      .oneOf([Yup.ref('password'), null], ValidationConstants.confirmPasswordMismatch)
  })

  // Create Password Schema
  const methods = useForm<CreatePasswordSchema>({
    resolver: yupResolver(createPasswordSchema),
    mode: "onTouched",
    criteriaMode: "all",
    reValidateMode: "onChange"
  })

  // Create Password form
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isDirty }
  } = methods;

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset()
    setReset(false)
  };

  // Submit form
  const SubmitNewPassword = async ({ password }: newPasswordType) => {
    try {

      if (!authentication)
        await resetPassword({ hash: securityKey, password: password });
      else
        await updatePassword({ password })
      reset();
      close();
    } catch (error) {
      console.error(error);
    }
  };

  // Validate passowrd with all conditions
  const validatePassword = () => {
    const password = watch('password');
    const pLength = password?.length
    setPasswordLengthError(false);
    setPasswordAlphabetError(false);
    setPasswordNumberError(false);
    setPasswordMatchingError(false);
    clearErrors('confirmNewPassword');
    if (pLength > 0) {
      const confirmNewPassword = watch('confirmNewPassword');
      const nameInArray = name.split(' ');
      if (password?.length < 6) setPasswordLengthError(true)
      if (!password?.match(/[a-z]/ig)) setPasswordAlphabetError(true);
      if (!password?.match(/[0-9]/)) setPasswordNumberError(true);
      if (password?.toLowerCase().indexOf(nameInArray[0]?.toLowerCase()) >= 0 || ((nameInArray[1] && nameInArray[1]?.length > 1) ? (password?.toLowerCase().indexOf(nameInArray[1]?.toLowerCase()) >= 0) : false) || password?.toLowerCase().indexOf(email) >= 0) setPasswordMatchingError(true);
      if (password?.match(name) || password?.match(email)) setPasswordMatchingError(true)
      if (password !== confirmNewPassword) watch('confirmNewPassword') !== '' && setError('confirmNewPassword', { type: 'custom', message: "Password doesn't match" })
      if (errors.password || errors.confirmNewPassword || !watch('password') || !watch('confirmNewPassword'))
        return false;
      return true;
    } else {
      setPasswordLengthError(true);
      setPasswordAlphabetError(true);
      setPasswordNumberError(true);
      setPasswordMatchingError(true);
    }
  }

  // Validate password
  const validateCreatePassword = () => {
    if (errors.password || errors.confirmNewPassword || !watch('password') || !watch('confirmNewPassword')
      || passwordLengthError || passwordNumberError || passwordAlphabetError || passwordMatchingError) {
      return false
    }
    return true
  }

  return (
    <StyledEngineProvider injectFirst>
      {/* Submit password form */}
      <form onSubmit={handleSubmit(SubmitNewPassword)} autoComplete='off'>
        <Box>
          <Box className='pwdhints' py={4}>
            <Box sx={{ display: 'flex' }}>
              {passwordLengthError === true ?
                (<i className='icon-Incorrect show' />) : passwordLengthError === false ?
                  (<i className='icon-Confirmed-24px' />) : ""}
              Password must be at least 6 characters long.</Box>
            <Box sx={{ display: 'flex' }}>
              {passwordAlphabetError === true ?
                (<i className='icon-Incorrect show' />) : passwordAlphabetError === false ?
                  (<i className='icon-Confirmed-24px' />) : ""}
              Password must contain at least one letter.</Box>
            <Box sx={{ display: 'flex' }}>
              {passwordNumberError === true ?
                (<i className='icon-Incorrect show' />) : passwordNumberError === false ?
                  (<i className='icon-Confirmed-24px' />) : ""}
              Password must contain at least one number.</Box>
            <Box className='mustnotcontaine' sx={{ display: 'flex' }}>
              {passwordMatchingError === true ?
                (<i className='icon-Incorrect show' />) : passwordMatchingError === false ?
                  (<i className='icon-Confirmed-24px' />) : ""}
              Password must not contain your email, first name or last name.
            </Box>
          </Box>
          <InputLabel>New Password</InputLabel>
          <TextField
            error={passwordLengthError || passwordAlphabetError || passwordNumberError || passwordMatchingError ? true : false}
            className={passwordLengthError || passwordAlphabetError || passwordNumberError || passwordMatchingError ? "" : ""}
            fullWidth
            InputProps={{
              endAdornment: <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
                sx={{ color: '#1D472E', fontSize: '18px' }}
              > {showPassword ? (<Icon icon="ant-design:eye-outlined" />) : <Icon icon="ant-design:eye-invisible-outlined" />}
              </IconButton>,
            }}


            type={showPassword ? 'text' : 'password'}
            autoComplete='new-password'
            {...register('password', {
              required: true, onChange(event) {
                validatePassword()
              },
            })}
            placeholder='Enter Password'
          />
          <p>{errors.password?.message}</p>
          <InputLabel>Confirm Password</InputLabel>
          <TextField
            error={errors.confirmNewPassword?.message ? true : false}
            className={errors.confirmNewPassword?.message ? "" : ""}
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete='new-password'
            {...register('confirmNewPassword', {
              required: true, onChange(event) {
                validatePassword()
              }
            })}
            placeholder='Enter Password'
            InputProps={{
              endAdornment: <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
                sx={{ color: '#1D472E', fontSize: '18px' }}
              > {showConfirmPassword ? (<Icon icon="ant-design:eye-outlined" />) : <Icon icon="ant-design:eye-invisible-outlined" />}
              </IconButton>,
            }}
          />
          <p>{errors.confirmNewPassword?.message}</p>
          <CustomButton
            type="submit"
            disabled={!validateCreatePassword()}
            fullWidth
            className="lr-btn"
          > Submit</CustomButton>
          <p>{submissionError}</p>
        </Box>
      </form>
      {/* End Submit password form */}
    </StyledEngineProvider>
  )
}

export default CreatePassword

CreatePassword.propTypes = {
  close: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  Reset: PropTypes.bool.isRequired

}