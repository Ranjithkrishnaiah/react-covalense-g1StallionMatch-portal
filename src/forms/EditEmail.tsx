import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useEditEmailMutation } from '../redux/splitEndpoints/editEmail';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';
import useAuth from 'src/hooks/useAuth';

function EditEmail() {
    const { authentication,setLogout } = useAuth()
    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [sendEditedEmail, response] = useEditEmailMutation();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user") || "{email : sally@g1goldmine.com.au}") : { 'email': 'sally@g1goldmine.com.au' };
    const checkEmailVerification = useAuthMeQuery(null, { skip: !authentication });
    
    // Submit form
    const handleEmailSubmit = async () => {
        try {
            let res: any = await sendEditedEmail({ email });
            if (res?.error) {
                toast.error(res?.error?.data?.message, {
                    autoClose: 2000,
                });
            }
            if (res?.data) {
                toast.success('Email edited successfully', {
                    autoClose: 2000,
                });
                setVerificationStatus("UNVERIFIED")
                setLogout(true);
                sessionStorage.clear();
                window.localStorage.clear();
            }
            setEditMode(false);
        } catch (err) {
        }

    }

    // Change email state
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    }

    // Validate email address
    const handleEmailValidation = (email: string) => {
        let regEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if (regEx.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    // Check verified status 
    useEffect(() => {
        if (checkEmailVerification.isSuccess)
            checkEmailVerification?.data?.isVerified ? setVerificationStatus("VERIFIED") : setVerificationStatus("UNVERIFIED");
    }, [checkEmailVerification])

    // Save the changed details to local storage on success and error notification if any error
    useEffect(() => {
        if (response.isSuccess) {
            localStorage.setItem("user", JSON.stringify({ ...user, email: response.data.email }))
        }
        if (response.isError) {
            setEmail(user.email)
        }
    }, [response])

    return (
        <Box mt={3} pb={1}>
            {/* Display email */}
            <Stack direction='row'>
                <Box flexGrow={1}>
                    <Typography variant='h6'>Email</Typography>
                </Box>
                {checkEmailVerification?.data?.provider !== 'google' &&
                <Box>
                    <Stack direction='row'>
                        <Button className={`cancel ${editMode ? 'show' : 'hide'}`} onClick={() => { setEditMode(false); setEmail("") }}>Cancel</Button>
                        <Button className={`edit ${editMode ? 'hide' : 'show'}`} onClick={() => setEditMode(true)}>Edit</Button>
                        <Button className={`edit ${editMode ? 'show' : 'hide'}`} disabled={!handleEmailValidation(email)} onClick={handleEmailSubmit}>Save</Button>
                    </Stack>
                </Box>}
            </Stack>
            {/* Edit email form */}
            <Stack direction='row'>
                <Box flexGrow={1}>
                    <TextField
                        hiddenLabel
                        id="filled-hidden-label-normal"
                        // placeholder={user ? user.email : "sally@g1goldmine.com.au"}
                        onChange={handleEmailChange}
                        value={email || user.email}
                        disabled={!editMode}
                    />
                    {email !== '' && editMode === true && handleEmailValidation(email) === false && <p className='profile-edit-error-msg'>Invalid Email Address</p>}
                </Box>
                <Box>
                    <p className='verified'>
                        {verificationStatus}
                    </p>
                </Box>
            </Stack>
            {checkEmailVerification?.data?.provider === 'google' &&
            <Box>
                <Typography variant='h6'>Managed by Google</Typography>
            </Box>}
            <Divider orientation="horizontal" flexItem sx={{ borderColor: '#B0B6AF' }} />
        </Box>
    )
}

export default EditEmail