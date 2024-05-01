import { VoidFunctionType } from 'src/@types/typeUtils';
import { CustomButton } from './CustomButton';
import { Typography } from '@mui/material';

function PageConfirmationForStallion(onClose: VoidFunctionType, pageTitle: any, 
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>) {
    const close = onClose;
    const headerText = pageTitle?.firstHeading
    const text = `Please confirm if you would like to ${ pageTitle?.confirmHeading }`;
    const handleConfirm = () => {
      close();
      setConfirm(true)
    }
  return (
    <div className='remove-from-list'>
        <Typography variant='h4'>{headerText}</Typography>
        <Typography variant='h5'>{text}</Typography>
        <CustomButton className='lr-btn' onClick={handleConfirm}>Confirm</CustomButton>
    </div>
  )
}

export default PageConfirmationForStallion