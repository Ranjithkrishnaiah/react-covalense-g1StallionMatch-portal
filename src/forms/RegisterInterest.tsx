import React, { useState,useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputLabel, Box, Typography, TextField, MenuItem, StyledEngineProvider } from '@mui/material';
import { VoidFunctionType } from "../@types/typeUtils";
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import {  useForm } from 'react-hook-form';

import { ValidationConstants } from '../constants/ValidationConstants';

import { toast } from 'react-toastify';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useRegisterInterestMutation } from 'src/redux/splitEndpoints/registerInterestSplit';
import { useRegisterInterestEmailQuery } from 'src/redux/splitEndpoints/registerInterestEmailSplit';


export interface RegisterInterestSchemaType {
    name?: string,
    countryId?: number,
    email?: string
}


function RegisterInterest(title: string, onClose: VoidFunctionType, 
    openSuccess: VoidFunctionType, Reset: boolean,  setReset: React.Dispatch<React.SetStateAction<boolean>>) {

    const openSuccessModal = openSuccess;
    const close = onClose;
    // const [ farmCountryId, setFarmCountryId ] = useState<any>();
    const { data: countriesList } = useCountriesQuery();
    const [emailError,setEmailError] = useState("");
    // const [countryError,setCountryError] = useState(false);

    // const [emailValue,setEmail] = useState<string>("");
    const [emailData, setEmailData] = useState({email: ""});

    const notifySuccess = () => toast.success("Your registration is successfull!",{
        autoClose: 2000,
        });

    const [ addRegisterInterest, response ] = useRegisterInterestMutation();
    const { isSuccess, isError, error } =  useRegisterInterestEmailQuery(emailData, {skip: !emailData.email});
  
    const checkEmailValidity = (e: any) => {
        // console.log("ETV: ", e.target.value)
        if(e.target.value.length === 0)
        setEmailError("This is a required field.")
        else{
            setEmailData({email: e.target.value});
            setEmailError("");
        }
    }
    // const removeErrorOnChange = (e: any) => {
    //     if(e.target.value.length !== 0) setEmailError("")
    // }
        
     useEffect(() => {
        if(isSuccess) {
            setEmailError("");
        }
        if (!!error && 'data' in error) {
            // TypeScript will handle it as `FetchBaseQueryError` from now on.
            if (error?.status === 409) {
              setEmailError('Email already exists.');
            }
      
            if (error?.status === 422 && emailData.email.length >= 3) {
              setEmailError('Incorrect email address.');
            }
            setTimeout(() => {
              setEmailError('');
              setEmailData({email:''});
            }, 2000);
          }
     }, [error,isError])

     useEffect(() => {
        if(response?.isSuccess){
        notifySuccess()
        }
    }, [response?.isSuccess])
    
     

    const RegisterInterestSchema = Yup.object().shape({
        name:  Yup.string().required(ValidationConstants.fullNameValidation).min(3,'Name must be at least 3 characters'),
        countryId:Yup.string().required(ValidationConstants.countryValidation),
        email:Yup.string().email('Invalid email address.'),
    })


    const methods = useForm<RegisterInterestSchemaType>({
        resolver: yupResolver(RegisterInterestSchema),
        mode: "onTouched"
    })

    const {
        register,
        reset,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors,isDirty}
      } = methods;

      //Reset the form on closing of the popup
      if(Reset){
        reset();
        setEmailError("");
        setReset(false);
       };
      const watchRegisterCountry = watch('countryId')
    //   const watchEmailId = watch('email');

    
      const validateFarm : any = () => {
        if(errors.name || errors.countryId 
           || !watch('name') || !watchRegisterCountry || !isSuccess  )
          return false;
        
      return true
    }


    const handleSuccess =() =>{
        openSuccessModal(); 
     close(); 
    }
    
    const SubmitRegisteration =async(data :any)=>{
        const { name,email,countryId } = data;
        // if(isError){
        //     setError('email', { type: 'custom', message: 'Email is Not valid' });
        // }
        const stallionData = {
            name: name,
            email: email,
            countryId: Number(countryId)
        }
          const res = await addRegisterInterest(stallionData);
          const response : any = res;
          handleSuccess();
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps: any = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          borderTop: 0,
          border: 'solid 1px #161716',
          borderRadius: '0 0 6px 6px',
          marginTop: '-2px',
          boxSizing: 'border-box',
          boxShadow:'none',
        },
      },
    };
  return (
    <StyledEngineProvider injectFirst>
    <form onSubmit={handleSubmit(SubmitRegisteration)} autoComplete="false">
   <Box className={'show'}>
    <Box className='register-intrest-modal'>
        <Box mt={3}>
            <Typography variant='h6'>
            Be the first to know when Stallion Match goes live. We’ll be in touch as soon as it’s ready, giving you priority access to find your perfect match.
            </Typography>
        </Box>
    <Box pt={3}>
    <InputLabel>Name*</InputLabel>
    <TextField 
    error = {errors.name?.message? true: false}
        fullWidth
        type='text' 
        autoComplete='new-password'
        {...register('name', { required:true })}
        placeholder='Enter name'
    />
<p className='error-text'>{errors.name?.message}</p>
</Box>
<Box pt={0}>
<InputLabel>Email address*</InputLabel>
 <TextField
 error = {errors.email?.message || emailError ? true:  false}
 fullWidth type="email"  {...register('email')} 
 onBlur={checkEmailValidity}  
//  onChange = {removeErrorOnChange}
  placeholder="Enter email address" />

<p className='error-text'>
{errors.email?.message}
{emailError}
</p>
 </Box>
 <Box pt={0} className='top-dropdown-style'>
<InputLabel>Country*</InputLabel>
<CustomSelect fullWidth sx={ { height: '54px', mb: '1rem' } }
   className='selectDropDownBox'
    IconComponent ={KeyboardArrowDownRoundedIcon}
    defaultValue={"none"}
    // MenuProps={MenuProps}
    menuPosition="fixed"
    MenuProps={ {
      keepMounted: true,
      hideBackdrop:false,
      disablePortal: true,
      disableScrollLock: false,
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      transformOrigin: {
        vertical: "bottom",
        horizontal: "center"
      },
        ...MenuProps
      } }
    error = {(watch('countryId') || 'k').toString().match('none')? true: false }
    {...register('countryId', { required: true })}
    // onClick={handleCountryError}
    //onClick={handleCountryError}
> 
    <MenuItem className='selectDropDownList' value="none" disabled>
        <em>Select country</em>
    </MenuItem>
    {
    countriesList?.map(({ id, countryName } : any) => <MenuItem className='selectDropDownList' value={id} key= {id}>
     <Box className='mobile-dropdown-title'>{countryName}</Box>
      </MenuItem>)
}
</CustomSelect>
<p>{(watch('countryId') || 'k').toString().match('none')? "This is a required field.": "" }</p>
</Box>
{/* <Box py={3}>
    <Typography variant='h6'>It normally takes up to 24 hours for our team to review new requests. You will be notified via email when confirmed.</Typography>
    </Box> */}

    <CustomButton
     disabled={!validateFarm()} 
     type="submit"
      fullWidth
      className = "lr-btn"
      > Register </CustomButton>
</Box>
</Box>
</form>
        </StyledEngineProvider>
  )
}

export default RegisterInterest;