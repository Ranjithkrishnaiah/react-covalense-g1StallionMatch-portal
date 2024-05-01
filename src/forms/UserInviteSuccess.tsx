import { InputLabel, Box, Typography, StyledEngineProvider } from '@mui/material';
import { VoidFunctionType } from "../@types/typeUtils";
import { CustomButton } from 'src/components/CustomButton';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import './LRpopup.css'

function UserInviteSuccess(onClose: VoidFunctionType) {
const  close = onClose;

const handleClose=()=>{
    close();
}

  return (
    <StyledEngineProvider injectFirst>
    <Box className={'show regis-success'}>
        <Box pt={3}>
        <Typography variant='h4'>Your invitation has been sent..</Typography> 
        </Box>
        <Box pt={2} pb={4}>
            <Typography variant='h6'>
            An invitation has been sent to <span>emailID</span> and you will be notified when they accept and finalise their invitation.Once accepted, they will have access to your farm and stallion roster.
            </Typography>
        </Box>
    <CustomButton
      fullWidth
      className = "lr-btn"
      onClick={handleClose}
      > Continue </CustomButton>
</Box>
        </StyledEngineProvider>
  )
}

export default UserInviteSuccess;