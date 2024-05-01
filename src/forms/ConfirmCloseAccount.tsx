import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    StyledEngineProvider,
} from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import { useCloseAccountQuery } from 'src/redux/splitEndpoints/closeAccount';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router';

function ConfirmCloseAccount(
    closeAndReset: VoidFunctionType,
    userEmail: string
) {
   
    const close = closeAndReset;
    const [callCloseAcctApi, setCallApi] = React.useState(true);
    const { authentication, setLogout } = useAuth();
    const navigate = useNavigate();
    const { data: closeAccount, isSuccess } = useCloseAccountQuery(null, { skip: callCloseAcctApi });

    const handleRemove = () => {
        setCallApi(false);
    };

    useEffect(() => {
        if (isSuccess) {
            setLogout(true);
            navigate('/');
            close();
        }
    }, [isSuccess])

    return (
        <StyledEngineProvider injectFirst>
            <Box>
                <Box className={'show'}>
                    <Box py={2} pb={0}>
                        <Typography variant="h6">
                            Are you sure, Do you want to close your Account ?
                        </Typography>
                    </Box>
                    <Box className="remove-modal-bottom">
                        <CustomButton fullWidth onClick={close} className="lr-btn">
                            Cancel
                        </CustomButton>
                        <CustomButton
                            fullWidth
                            onClick={handleRemove}
                            className="lr-btn lr-btn-outline"
                        >
                            Confirm
                        </CustomButton>
                    </Box>
                </Box>
            </Box>
        </StyledEngineProvider>
    );
}

export default ConfirmCloseAccount;
