import React from 'react'
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoginSchema } from 'src/@types/login';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from '../assets/images'
import { Divider, InputLabel, MenuItem, MenuList, StyledEngineProvider, 
  Typography, Button, TextField } from '@mui/material';
import { ROUTES } from '../routes/paths'
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { VoidFunctionType } from "../@types/typeUtils";
import useAuth from '../hooks/useAuth';
import './LRpopup.css'

type FarmInterestSchema = {
  name: string;
  email: string;
  farm: string;
  country: string;
}
function FarmInterest(onClose: VoidFunctionType, Reset: boolean) {
    const close = onClose;
    // const [ login, response ] = useLoginMutation();
    const navigate = useNavigate();
    // React.useEffect(() => {
    //   if(response.isSuccess){
    //     window.localStorage.setItem("accessToken", JSON.stringify(response?.data?.accessToken))
    //     window.localStorage.setItem("user", JSON.stringify(response?.data?.member))
    //     setUser(response?.data?.member)
    //     setAuthentication(true)
    //     reset();
    //     navigate(DASHBOARD);
    //     close()
    //   }
    // },[response])
    const { setAuthentication, setUser } = useAuth();

    const { DASHBOARD } = ROUTES;
    const loginSchema = Yup.object().shape({
      name: Yup.string().required().min(2).max(50),
      email: Yup.string().email().required(ValidationConstants.emailValidation),
      farm: Yup.string().required("Farm name is a required field").min(2).max(50),
      countries: Yup.string().required("This is a required field.")
    })


    const methods = useForm<FarmInterestSchema>({
      resolver: yupResolver(loginSchema),
      mode: "onTouched",
      criteriaMode: "all"  
    })

    const {
        register,
        reset,
        handleSubmit,
        formState: {  errors }
      } = methods;

    //Reset the form on closing of the popup
    if(Object.keys(errors).length > 0 && Reset){
      reset()
    };

      const SubmitLogin = async (loginData: FarmInterestSchema) => {

        try {
          // await login(loginData)
        } catch (error) {
          console.error(error);
        }
      };


  return (
    <StyledEngineProvider injectFirst>

        <form onSubmit={handleSubmit(SubmitLogin)} autoComplete='off'>
        Be the first to know when Stallion Match goes live. 
        We’ll be in touch as soon as it’s ready, 
        giving you priority to have your stallions ready for launch.
        <InputLabel>Name</InputLabel>
            <TextField 
                fullWidth
                autoComplete='new-password'
                type='text' 
                {...register('email', { required:true })}
                placeholder='Enter Email Address'
                
            />
            <p>{errors.email?.message}</p>
            <InputLabel>Email address</InputLabel>
            <TextField 
                fullWidth
                autoComplete='new-password'
                type='text' 
                {...register('email', { required:true })}
                placeholder='Enter Email Address'
                
            />
            <p>{errors.email?.message}</p>
            <InputLabel>Farm</InputLabel>
            <TextField 
                fullWidth
                autoComplete='new-password'
                type='text' 
                {...register('email', { required:true })}
                placeholder='Enter Email Address'
                
            />
            <p>{errors.email?.message}</p>
            <InputLabel>Farm Country</InputLabel>
            <TextField 
                fullWidth
                autoComplete='new-password'
                type='text' 
                {...register('email', { required:true })}
                placeholder='Enter Email Address'
                
            />
            <p>{errors.email?.message}</p>
            <CustomButton type="submit" fullWidth className = "lr-btn"> Register </CustomButton>
        </form>
        </StyledEngineProvider>
  )
}

export default FarmInterest

FarmInterest.propTypes = {
  close: PropTypes.func.isRequired,
  OFP: PropTypes.func.isRequired,
  openRegistration: PropTypes.func.isRequired,

}