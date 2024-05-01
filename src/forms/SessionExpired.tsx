
import React from 'react'
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    StyledEngineProvider,
    Typography,
    Button
} from '@mui/material';
import { VoidFunctionType } from "../@types/typeUtils";
import { CustomDialogTitle } from 'src/components/WrappedDialog/WrapperDialog';
// hooks
import useAuth from '../hooks/useAuth';
import HomePageController from '../pages/homePage/HomePageController';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function SessionExpired(props: any) {  
    const { authentication, setAuthentication, guestAuth, setLogout } = useAuth(); 
    const [cookies, setCookie] = useCookies(['expired_login']); 
    const navigate = useNavigate();
    const { open, onClose } = props;
    const closeAndResetLoginInfo = () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('user');
        window.localStorage.clear();
        window.sessionStorage.clear();
        setAuthentication(false);
        setCookie('expired_login', 1, { path: '/', sameSite: 'none', secure: true });
        setLogout(true);
        onClose();
        navigate('/');
        return <HomePageController />;
    }
    return (
        <StyledEngineProvider injectFirst>
            <Dialog
                open={open}
                className="dialogPopup session-expire"
                maxWidth={props.maxWidth || 'sm'}
                sx={props.sx}
            >
                <CustomDialogTitle>
                    {props.title}

                    <IconButton
                        onClick={closeAndResetLoginInfo}
                        sx={{
                            position: 'absolute',
                            right: 12,
                            width: 36,
                            height: 36,
                            top: 18,
                            color: (theme) => '#1D472E',
                        }}
                    >
                        <i className="icon-Cross" />
                    </IconButton>
                </CustomDialogTitle>
                <DialogContent className="popup-cnt" sx={{ p: '2rem' }}>
                    <Box>
                        <Typography component='p' pt={2}>{props?.sessionExpireError}</Typography>
                        <Button variant='outlined' className='lr-btn session-btn' onClick = {() => closeAndResetLoginInfo()}> Log in </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </StyledEngineProvider>

    )
}

export default SessionExpired
