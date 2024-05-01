import { Box, Grid, Typography } from '@mui/material';
import CheckoutLogin from '../../forms/CheckoutLogin';
import Design from './Design';

function UserAuth() {
    let fullName: any = window.localStorage.getItem('user') || null;
    if (typeof (fullName) === 'string') {
        fullName = JSON.parse(fullName).fullName;
    }
    return (

        <Grid item xs={12}>
            <Box className='checkout-box payment-checkout'>
                <Design />
                {fullName && <Box className='chekout-user'>
                    <Typography variant='h3'>Logged In,</Typography>
                    <Typography variant='h2'>{fullName}</Typography>
                </Box>}
                {!fullName &&
                    <Grid container sx={{ justifyContent: 'center' }}>
                        <Grid item lg={8} xs={10}>
                            {/* Show the form based on user logged in or not */}
                            {CheckoutLogin()}
                        </Grid>
                    </Grid>}
            </Box>
        </Grid>

    )
}

export default UserAuth