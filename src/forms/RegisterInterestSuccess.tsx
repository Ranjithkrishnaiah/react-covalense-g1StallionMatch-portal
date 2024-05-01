import { InputLabel, Box, Typography, StyledEngineProvider } from '@mui/material';
import { VoidFunctionType } from "../@types/typeUtils";
import { CustomButton } from 'src/components/CustomButton';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import './LRpopup.css'

function RegisterInterestSuccess(onClose: VoidFunctionType) {
const  close = onClose;

const handleClose=()=>{
    close();
}

  return (
    <StyledEngineProvider injectFirst>
    <Box className={'show regis-success register-intrest-pop'}>
        <Box pt={3} className='mt0'>
        <Typography variant='h4'>Thanks for registering your interest in Stallion Match.</Typography> 
        </Box>
        <Box pt={2} pb={4}>
            <Typography variant='h6'>
            You will be notified via email as soon as Stallion Match goes live. In the meantime, be sure to follow us on <a target={"_blank"}  href='https://www.facebook.com/stallionmatch'>Facebook</a> and <a target={'_blank'} href='https://twitter.com/stallionmatch'>Twitter</a> to stay up-to-date with all the latest news and updates.
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

export default RegisterInterestSuccess;