import { Box, StyledEngineProvider, Typography } from '@mui/material'
import './noData.css';
import { useState } from 'react';

export default function UnAuthorized(props: any) {
    const [apiStatus, setApiStatus] = useState(false);
    const [apiStatusMsg, setApiStatusMsg] = useState({});
    const [openHeader, setOpenHeader] = useState(false);

    return (
        <StyledEngineProvider injectFirst>
            <Box className='noResultWrapper'>
                <Box className='noResult'
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",

                    }}
                >
                    <Typography variant="h3">Unauthorized  Access</Typography>
                    <Typography> You do not have sufficient privileges to access this module</Typography>
                </Box>
            </Box>
        </StyledEngineProvider>
    );
}
