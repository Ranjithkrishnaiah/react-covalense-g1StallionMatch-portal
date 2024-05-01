import React, { useState, useEffect } from 'react';
import Home from './homePage/HomePageController';
import { Box } from '@mui/material';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import Login from 'src/forms/Login';
import ForgotPassword from 'src/forms/ForgotPassword';
import { useVerifyEmailMutation } from '../redux/splitEndpoints/verifyEmail';
import { useLocation, useParams } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import InviteExpireLink from 'src/forms/InviteExpireLink';

function VerifyEmail() {
    const [openLogin, setopenLogin] = useState(false);
    const [verifyEmail, response] = useVerifyEmailMutation();
    const [forgotPassword, setForgotPassword] = useState(false);
    const [openInviteExpireLink, setOpenInviteExpireLink] = useState(false);
    const [inviteExpireLinkError, setInviteExpireLinkError] = useState<any>(null);
    const { hash } = useParams();
    const { pathname } = useLocation();
    const { setLogout } = useAuth();
    const confirmEmail = pathname.includes('/confirm-email') && !!hash;
    useEffect(() => {
        if (hash)
            verifyEmail({ hash })
    }, [])
    useEffect(() => {
        if (response.isSuccess && response.status === 'fulfilled') {
            setopenLogin(true);
        }
        // if(response.isError) {
        //     console.log(response,'response123')
        //     let resp:any = response;
        //     setOpenInviteExpireLink(true);
        //     setInviteExpireLinkError(`Invalid Link`);
        // }
    }, [response])

    React.useEffect(() => {
        if (confirmEmail) {
            setLogout(true);
            sessionStorage.clear();
            window.localStorage.clear();
        }
    }, [confirmEmail])

    return (
        <Box>
            {/* <InviteExpireLink
                open={openInviteExpireLink}
                title={'Confirm Email'}
                onClose={() => setOpenInviteExpireLink(false)}
                inviteExpireLinkError={inviteExpireLinkError}
            /> */}
            <WrapperDialog
                open={openLogin}
                title="Verification Complete"
                // title={'Welcome to Stallion Match'}
                onClose={() => setopenLogin(false)}
                openOther={() => setForgotPassword(true)} //Dummy code as Opening signUp doesn't make sense.
                OFP={() => setForgotPassword(true)}
                body={Login}
                firstLogin={false}
                farmAdminFirstLogin={false}
            />
            <WrapperDialog
                open={forgotPassword}
                title="Forgot Password"
                onClose={() => setForgotPassword(false)}
                body={ForgotPassword}
            />
            <Home />
        </Box>
    )
}

export default VerifyEmail