import { Box, Typography, StyledEngineProvider, Stack } from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import { useNavigate } from 'react-router-dom';
import './LRpopup.css';
import { useDeleteMessageMutation } from 'src/redux/splitEndpoints/deleteMessage';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function RemoveMessage(
  onClose: VoidFunctionType,
  deleteFarmId: string,
  setSelected: Dispatch<SetStateAction<string>>,
  setSelectedTile: Dispatch<SetStateAction<boolean>>,
  apiStatus: boolean,
  setApiStatus: any,
  apiStatusMsg: any,
  setApiStatusMsg: any
) {
  const close = onClose;
  const navigate = useNavigate();
  const [locationSubject, setLocationSubject] = useState('');

  // API call for delete message
  const [deleteMessage, response] = useDeleteMessageMutation();

  // set subject from url params
  useEffect(() => {
    const res = window.location.pathname.split('/')[2];
    setLocationSubject(res);
  }, []);

  // on close
  const handleClose = () => {
    close();
  };

  // method for delete message
  const handleDelete = () => {
    deleteMessage({ channelId: deleteFarmId }).then((res: any) => {
      if (res?.error?.originalStatus == 200) {
        setSelected('');
        setSelectedTile(false);
        navigate(`/messages`);
        toast.success('Conversation removed successfully!', {
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
          <Typography variant="h6">
            Your conversation will be permenantly deleted after 30 days. In the meantime, you are
            able access it via the View filter.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <CustomButton fullWidth className="lr-btn yes-btn" onClick={handleDelete}>
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

export default RemoveMessage;
