
import React from 'react'
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    StyledEngineProvider,
    Typography,
} from '@mui/material';
import { VoidFunctionType } from "../@types/typeUtils";
import { CustomDialogTitle } from 'src/components/WrappedDialog/WrapperDialog';


function InviteExpireLink(props: any) {
    // onClose: VoidFunctionType, inviteExpireLinkError: string,open:boolean
    //   const close = onClose;
    // console.log(props, 'PROPS>>')
    const { open, onClose } = props;

    return (
        <StyledEngineProvider injectFirst>
            <Dialog
                open={open}
                className="dialogPopup"
                maxWidth={props.maxWidth || 'sm'}
                sx={props.sx}
            >
                <CustomDialogTitle>
                    {props.title}

                    <IconButton
                        onClick={onClose}
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
                        <Typography component='p' pt={2}>{props?.inviteExpireLinkError}</Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </StyledEngineProvider>

    )
}

export default InviteExpireLink
