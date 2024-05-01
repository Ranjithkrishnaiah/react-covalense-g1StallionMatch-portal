import React from 'react'
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CustomButton } from 'src/components/CustomButton';
import {  InputLabel, StyledEngineProvider, TextField } from '@mui/material';
import { ROUTES } from '../routes/paths'
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { VoidFunctionType } from "../@types/typeUtils";
import './LRpopup.css';
import { useEditEmailMutation } from 'src/redux/splitEndpoints/editEmail';
import { toast } from 'react-toastify';

export type UpdateEmailSchema  = { 
    email: string;
}
function UpdateEmail(onClose: VoidFunctionType) {
    const close = onClose;
    // states
    const [email, setEmail] = React.useState("");
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [ updateEmail, response ] = useEditEmailMutation();

    // onSuccess handler
    const notifySuccess = () =>
    toast.success('Email Updated Successfully.', {
      autoClose: 2000,
    });

    // on API response set data
    React.useEffect(() => {
      if (response.isSuccess) {
          localStorage.setItem("user", JSON.stringify({ ...user, email: response.data.email }));
          setUser({ ...user, email: response.data.email })
          reset();
          close()
          notifySuccess()
      }
      if(response.isError){
          setEmail(user.email)
      }
  }, [response])

    // schema
    const { DASHBOARD } = ROUTES;
    const updateEmailSchema = Yup.object().shape({
        email: Yup.string().email().required(ValidationConstants.emailValidation),
    })

    // methods for form
    const methods = useForm<UpdateEmailSchema>({
      resolver: yupResolver(updateEmailSchema),
      mode: "onTouched",
      criteriaMode: "all"  
    })

    const {
        register,
        reset,
        handleSubmit,
        formState: {  errors }
      } = methods;

      // onSubmit handler
      const SubmitNewEmail = async (newEmail: UpdateEmailSchema) => {

        try {
          await updateEmail(newEmail)
        } catch (error) {
        }
      };


  return (
    <StyledEngineProvider injectFirst>
       {/* form for update email */}
        <form onSubmit={handleSubmit(SubmitNewEmail)} className='update-email'>
            {user && <Box className='update-email-user'>
                <Box className='updateemailname'>{user.fullName}</Box>
                <Box className='updateemailfade'>{email || user.email}</Box>
            </Box>}
            <InputLabel>New Email Address</InputLabel>
            <TextField 
                fullWidth
                type='text' 
                autoComplete='new-password'
                {...register('email', { required:true })}
                placeholder='Enter Email Address'
                
            />
            <p>{errors.email?.message}</p>

            <Box mt={2} className='update-email-user-Button'><CustomButton type="submit" fullWidth className='lr-btn'> Update</CustomButton></Box>
        </form>
        </StyledEngineProvider>
  )
}

export default UpdateEmail

UpdateEmail.propTypes = {
  close: PropTypes.func.isRequired,

}