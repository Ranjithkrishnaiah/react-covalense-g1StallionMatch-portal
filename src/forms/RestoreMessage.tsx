import { Box, Typography, StyledEngineProvider, Stack } from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import { useNavigate } from 'react-router-dom';
import './LRpopup.css';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { usePatchMessageRestoreMutation } from 'src/redux/splitEndpoints/patchMessageReadSplit';

function RestoreMessage(
  onClose: VoidFunctionType,
  deleteRestoreId: string,
  setSelected: Dispatch<SetStateAction<string>>,
  setSelectedTile: Dispatch<SetStateAction<boolean>>
) {
  const close = onClose;
  const navigate = useNavigate();

  // API call for delete message
  const [restoreMessage, response] = usePatchMessageRestoreMutation();

  // on close
  const handleClose = () => {
    close();
  };

  // method for restore message
  const handleRestore = () => {
    restoreMessage({ channelId: deleteRestoreId }).then((res: any) => {
      if (res?.error?.originalStatus == 200) {
        setSelected('');
        setSelectedTile(false);
        navigate(`/messages`);
        toast.success('Conversation Restored Successfully.', {
          autoClose: 2000,
        });
      } else {
      }
    });

    close();
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className={'show regis-success'}>
        <Box className="delete-msg">
          <Typography variant="h6">Your conversation will be restored.</Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <CustomButton fullWidth className="lr-btn yes-btn" onClick={handleRestore}>
            Yes
          </CustomButton>
          <CustomButton fullWidth className="no-btn" onClick={handleClose}>
            No
          </CustomButton>
        </Stack>
      </Box>
    </StyledEngineProvider>
  );
}

export default RestoreMessage;
