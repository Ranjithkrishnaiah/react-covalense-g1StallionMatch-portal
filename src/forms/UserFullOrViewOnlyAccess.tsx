import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from '../assets/images';
import {
  StyledEngineProvider,
  Typography,
  Theme,
  Avatar,
  Stack,
} from '@mui/material';
import { Box } from '@mui/system';
import { VoidFunctionType } from '../@types/typeUtils';
import './LRpopup.css';
import { useAccessLevelMutation } from 'src/redux/splitEndpoints/postChangeInAccessLevel';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import InvitationSuccess from './InvitationSuccess';
import { toPascalCase } from 'src/utils/customFunctions';
import { toast } from 'react-toastify';
export type InviteUserSchema = {
  fullName: string;
  email: string;
  invitationId: any;
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function getStyles(name: string, stallionNamesArray: readonly string[], theme: Theme) {
  return {
    fontWeight:
      stallionNamesArray.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function UserFullOrViewOnlyAccess(onClose: VoidFunctionType,
  invitationId: any, userName: string,
  userImage: string, email: string, Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>) {
  const close = onClose;
  const [openSuccessPopup, setOpenSuccessPopup] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState('');
  const [stallionIdData, setStallionIdData] = React.useState<any[]>([]);
  const stallionSelectRef = useRef<any>()
  if (Reset) {
    setStallionIdData([]);
    setReset(false);
  }
  const [changeAccessLevel, accessLevelChangeResponse] = useAccessLevelMutation();
  const farmId = invitationId?.farmId;
  const accessLevelId = invitationId?.accessLevel;
  const accessLevelName = (invitationId?.accessLevel === 1) ? 'Full Access' : 'View Only';

  // send invitation handler
  const sendInvitation = async (e: any) => {
    e.preventDefault();
    const data = {
      memberInvitationId: invitationId?.invitationId,
      farmId: farmId,
      accessLevelId: accessLevelId,
      stallionIds: []
    }
    await changeAccessLevel(data);
    // close();
  };

  useEffect(() => {
    if (accessLevelChangeResponse?.isSuccess) {
      close();
      let response: any = accessLevelChangeResponse;
      toast.success(`${response?.data?.message}`);
      // console.log(accessLevelChangeResponse,'accessLevelChangeResponse')
    }
  }, [accessLevelChangeResponse.isSuccess])

  useEffect(() => {
    if (accessLevelChangeResponse?.isError) {
      let response: any = accessLevelChangeResponse;
      toast.error(`${response?.error?.data?.message}`);
    }
  }, [accessLevelChangeResponse.isError])

  return (
    <StyledEngineProvider injectFirst>
      <WrapperDialog
        open={openSuccessPopup}
        title="Success!"
        onClose={() => setOpenSuccessPopup(false)}
        body={InvitationSuccess}
        userEmail={email}
      />
      <form onSubmit={sendInvitation} autoComplete="off">
        <Box className='invite-user'>
          <Stack direction='row' className='user-access'>
            <Avatar
              src={userImage ? userImage : Images.UserSignedOut}
              alt={userName}
              sx={{ width: '44px', height: '44px', marginRight: '1rem' }}
            />
            <Typography variant="h4">{toPascalCase(userName)}</Typography>
          </Stack>
          <Typography variant="h5">Are you Sure?</Typography>
          <Typography variant="h6">
            Are you sure you want to change <strong>{toPascalCase(userName)}'s</strong> access to {accessLevelName}.
          </Typography>


          <CustomButton type="submit" fullWidth className="lr-btn">
            {' '}
            Save
          </CustomButton>
          <p>{submissionError}</p>
        </Box>
      </form>
    </StyledEngineProvider>
  );
}

export default UserFullOrViewOnlyAccess;

UserFullOrViewOnlyAccess.propTypes = {
  close: PropTypes.func.isRequired,
};
