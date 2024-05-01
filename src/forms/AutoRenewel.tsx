import React from 'react';
import {
  Box,
  Typography,
  StyledEngineProvider,
} from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import { toast } from 'react-toastify';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { usePatchStallionPromotionsMutation } from 'src/redux/splitEndpoints/patchStallionPromotionsSplit';

export interface StopNominationSchema {
  removeReason: string;
}
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={ { popper: className } } />
))(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

type DateRange = [number | null, number | null];

function AutoRenewel(
  onClose: VoidFunctionType,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  promotionalId: string,
  stallionId: string
) {
  const close = onClose;
  const notifySuccess = () =>
    toast.success('Auto Renewal Status Changed Successfully.', {
      autoClose: 2000,
    });
  // mutation for stallion Auto Renew
  const [stallionAutoRenew, stallionAutoResponse] = usePatchStallionPromotionsMutation()

  // handler for Renewel
  const handleRenewel = async () => {
    let obj = {
      "promotionId": promotionalId,
      "stallionId": stallionId
    }
    try {
      let res: any = await stallionAutoRenew(obj);
      if (res?.data) {
        notifySuccess();
      }
      if (res?.error) {
        toast.error(res?.error?.data?.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {
    }
    close();
  }

  return (
    <StyledEngineProvider injectFirst>

      <Box>
        <Box>
          <Box className='auto-renew'>
            <Typography variant="h6">
              Are you sure want to Auto-Renewel your Stallions?
            </Typography>
          </Box>

          <Box className="remove-modal-bottom">
          
            <CustomButton fullWidth className="lr-btn " onClick={close}>
              Cancel
            </CustomButton>
            <CustomButton
              fullWidth
              onClick={handleRenewel}
              className="lr-btn lr-btn-outline"
            >
              Yes
            </CustomButton>
           
          </Box>
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}

export default AutoRenewel;
