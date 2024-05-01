import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputLabel, Box, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { VoidFunctionType } from "../@types/typeUtils";
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { useForgotPasswordMutation } from 'src/redux/splitEndpoints/forgotPasswordSplit';


function ForgotPassword(close: VoidFunctionType, Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>) {

    const [sendPasswordTo, result] = useForgotPasswordMutation();
    const [submitResponse, setSubmitResponse] = React.useState("")
    const [resentEmail, setResentEmail] = React.useState(false);
    const [formPart1, setFormPart1] = React.useState(true);

    let loading = result.isLoading;
    const [fromResend, setFromResend] = React.useState(false);

    // Show the success or Erro message based on api response
    React.useEffect(() => {
        if (result.isSuccess) {
            if (!result.isError && !fromResend) {
                setFormPart1(false);
                setFromResend(true);
            }
        }
        else if (!result.isError && fromResend) {
            setResentEmail(true);
            setFormPart1(false);
            setSubmitResponse("")
        }
    }, [result])

    // Form schema
    const forgotPasswordSchema = Yup.object().shape({
        email: Yup.string().email('Incorrect email address').required("Incorrect email address")
    })

    // Form element and parameters
    const { handleSubmit, register, reset, watch, formState: { errors, isDirty } } = useForm<any>({
        resolver: yupResolver(forgotPasswordSchema),
        mode: "onTouched",
        criteriaMode: "all"
    })

    // Open change email popup
    const changeEmail = () => {
        setFormPart1(true);
        reset({ email: undefined });
        setFromResend(false);
        setResentEmail(false);
    }

    //Reset the form on closing of the popup
    if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
        reset()
        setReset(false);
        setResentEmail(false);
        setFormPart1(true);
        setSubmitResponse("");
        setFromResend(false);

    };

    // Submit form
    const ForgotPasswordSubmit: (email: string) => void = async (email: string) => {
        try {
            let response: any = await sendPasswordTo(email)
            if (response?.error) {
                setSubmitResponse('Email does not exists!');
            }
            setTimeout(() => {
                setSubmitResponse("");
            }, 5000);
        } catch (error) {
        }
    }

    return (
        <Box>
            {/* Forgot passowrd and change email form */}
            <form onSubmit={handleSubmit(ForgotPasswordSubmit)} autoComplete="false">
                <Box mt={4} className='forgot-password-box'>
                    {formPart1 &&
                        <Box>
                            <Typography variant='h6'>Provide your account's email for which you want to reset your password
                            </Typography>
                            <InputLabel>Email Address</InputLabel>
                            <TextField
                                error={isDirty && errors?.email?.message ? watch('email') !== '' ? true : false : false}
                                fullWidth
                                type="text"
                                placeholder='Enter Email Address'
                                {...register('email')}
                            />
                            {submitResponse && <p className='error-text'>{submitResponse}</p>}
                            {watch('email') !== '' && <p className='error-text'>{errors.email?.message}</p>}
                            <Box mt={3}>
                                <CustomButton type="submit" fullWidth className='lr-btn'
                                    disabled={loading}> <span className='font-text'>Submit</span></CustomButton>

                            </Box>
                        </Box>
                    }
                    {!formPart1 &&
                        <Box>
                            {!resentEmail &&
                                <Box>
                                    <Typography variant='h6'>An email has been sent to {watch('email')} with a link to reset your password. Please check your inbox.
                                    </Typography>

                                </Box>}
                            {resentEmail &&
                                <Box>
                                    <Typography variant='h6'>The email has been resent. You will receive an email<br />
                                        with a link to reset your password.
                                    </Typography>

                                </Box>}
                            <Box className='forgot-class-align' mt={6} sx={{ display: 'flex' }}>
                                <Button className='lr-btn' type="submit" disabled={loading}>Resend Email Link</Button>
                                <Button className='lr-btn lr-btn-outline' onClick={changeEmail}>Change Email Address</Button>
                            </Box>
                            {submitResponse && <p className='error-text'>{submitResponse}</p>}
                        </Box>}
                </Box>
            </form>
            {/* End Forgot passowrd and change email form */}
        </Box>
    )
}

export default ForgotPassword