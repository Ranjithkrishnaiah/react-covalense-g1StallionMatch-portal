import { Box, Typography } from '@mui/material'
import { VoidFunctionType } from 'src/@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';

function InvitationSuccess(onClose: VoidFunctionType, emailID: string) {
  return (
    <Box className='success-list invitesucces'>
        <Typography variant='h4'>Your invitation has been sent.</Typography>
        <Typography variant='h5'>
        An invitation has been sent to <span>{emailID}</span> and you will be notified when they accept and finalise their invitation.
        Once accepted, they will have access to your farm and stallion roster.
        </Typography>
        <CustomButton className='lr-btn'onClick = {onClose}>Continue</CustomButton>
    </Box>

  )
}

export default InvitationSuccess