import React from 'react';
import { Box, Typography, StyledEngineProvider } from '@mui/material';
import { VoidFunctionType } from "../@types/typeUtils";
import { CustomButton } from 'src/components/CustomButton';

function PromotionAlreadyAvailable(title: string, onClose: VoidFunctionType, alreadyAvailable: string, Reset: boolean) {
  const close = onClose;

  // Submit Form
  const SubmitRegisteration = (event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    close();
  }

  return (
    <StyledEngineProvider injectFirst>
      <form onSubmit={SubmitRegisteration} autoComplete="false" className='add-stallion-pop-wrapper'>
        <Box className={'show'}>
          <Box py={2} pb={0}>
            <Typography variant='h6' sx={{ fontSize: '18px !important', lineHeight: '28px !important' }}>Message to notify that this Stallion is already promoted with a farm.</Typography>
          </Box>

          <CustomButton
            type="submit"
            fullWidth
            className="lr-btn"
          > OK </CustomButton>
        </Box>
      </form>
    </StyledEngineProvider>
  )
}

export default PromotionAlreadyAvailable;