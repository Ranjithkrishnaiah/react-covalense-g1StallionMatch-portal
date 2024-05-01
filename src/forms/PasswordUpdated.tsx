import { Box, InputLabel, Typography } from '@mui/material'
import React from 'react'
import { CustomButton } from 'src/components/CustomButton';
import Login from './Login';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { VoidFunctionType } from 'src/@types/typeUtils';
function PasswordUpdated(onClose: VoidFunctionType) {
  const [openLogin, setOpenLogin] = React.useState<boolean>(false);
  // console.log(onClose,'pp')
  const close = onClose;
  const handleSignIn = () => {
    // close();
    setOpenLogin(true);
  }
  return (
    <Box>
      <WrapperDialog
        open={openLogin}
        title={'Log in'}
        onClose={() => setOpenLogin(false)}
        openOther={() => { }}
        OFP={() => { }}
        body={Login}
        firstLogin={false}
        farmAdminFirstLogin={false}
      />
      <Box mt={4} className='forgot-password-box'>

        <Typography variant='h6'>
          Your password has been successfully updated. Please sign into your account by clicking the link below.
        </Typography>


        <Box mt={3}>
          <CustomButton onClick={handleSignIn} fullWidth
            className="lr-btn"> Sign In</CustomButton>
        </Box>


      </Box>
    </Box>
  )
}

export default PasswordUpdated