import { useState } from 'react';
import { Box, Button, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import CreatePassword from 'src/forms/CreatePassword';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import ConfirmCloseAccount from 'src/forms/ConfirmCloseAccount';

function LoginSecurity() {
  const [openCreatePassword, setOpenCreatePassword] = useState(false);
  const [openCloseAccountPopup, setOpenCloseAccountPopup] = useState(false);

  let user: any = localStorage.getItem('user');
  const token: any = localStorage.getItem('accessToken');
  user = user ? JSON.parse(user) : null;

  const handleOnClose = () => {
    setOpenCloseAccountPopup(true);
  }

  return (
    <>
      {/* Create new password popup */}
      {user !== undefined && token !== undefined &&
        <WrapperDialog
          open={openCreatePassword}
          title="Create Password"
          onClose={() => setOpenCreatePassword(false)}
          body={CreatePassword}
          name={user?.fullName}
          email={user?.email}
          securityKey={token}
        />}
      {/* Create password form */}
      <Box mt={5}>
        <Typography variant='h3'>Login & Security</Typography>
      </Box>
      <Grid container lg={12} xs={12}>
        <Grid item lg={9} xs={12}>
          <Box mt={4} pb={2}>
            <Stack direction='row'>
              <Box flexGrow={1}>
                <Typography variant='h6'>Password</Typography>
              </Box>
              <Box>
                <Button className='edit' onClick={() => setOpenCreatePassword(true)}>Change</Button>
              </Box>
            </Stack>
            <Stack>
              <Box className='security'>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-normal"
                  type="password"
                  defaultValue="password"
                  disabled
                />
              </Box>
            </Stack>
          </Box>
          <Divider orientation="horizontal" flexItem sx={{ borderColor: '#B0B6AF' }} />
        </Grid>
      </Grid>
      <Box py={3}>
      </Box>
      {/* Close account button  */}
      <Box>
        <Button className='signout' disableRipple onClick={handleOnClose}>Close Account</Button>
      </Box>
      
      {/* Close account confirmation popup */}
      <WrapperDialog
        open={openCloseAccountPopup}
        title={'Are you sure?'}
        onClose={() => setOpenCloseAccountPopup(false)}
        userEmail={''}
        body={ConfirmCloseAccount}
      />
    </>
  )
}

export default LoginSecurity