import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from '../assets/images';
import {
  StyledEngineProvider,
  Typography,
  Checkbox,
  Theme,
  FormGroup,
  FormControlLabel,
  Avatar,
  Stack,
} from '@mui/material';
import { Box } from '@mui/system';
import { VoidFunctionType } from '../@types/typeUtils';
import './LRpopup.css';
import { useLocation } from 'react-router';
import { useGetStallionNamesQuery } from 'src/redux/splitEndpoints/getStallionNamesSplit';
import { usePostUserAccessMutation } from 'src/redux/splitEndpoints/postUserAccessSplit';
import { useAccessLevelMutation } from 'src/redux/splitEndpoints/postChangeInAccessLevel';
import TypedMultiSelect from 'src/components/typedMultiSelect/TypedMultiselect';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import InvitationSuccess from './InvitationSuccess';
import { toPascalCase } from 'src/utils/customFunctions';
import { toast } from 'react-toastify';
export type InviteUserSchema = {
  fullName: string;
  email: string;
  accessLevel: number;
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

function UserAccess(onClose: VoidFunctionType, 
  invitationId: any, userName: string, 
  userImage: string, email: string, Reset: boolean, 
  setReset: React.Dispatch<React.SetStateAction<boolean>>) {
  const close = onClose;
  const [ openSuccessPopup, setOpenSuccessPopup ] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState('');
  const [stallionIdData, setStallionIdData] = React.useState<any[]>([]);
  const stallionSelectRef = useRef<any>()
 
  const { pathname } = useLocation();
  const farmId = invitationId?.farmId;
  const accessLevelId = invitationId?.accessLevel;
  const accessLevelName = (invitationId?.accessLevel === 1) ? 'Full Access' : 'View Only';

  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1] !== 'users-list'? 
  pathSplitForFarm[pathSplitForFarm?.length - 1]: pathSplitForFarm[pathSplitForFarm?.length - 2];
  if(Reset){
    setStallionIdData([]);
    setReset(false);
  }
  // API call for stallion Data
  const {
    data: stallionData,
  } = useGetStallionNamesQuery({ id: farmID }, {skip: !farmID});

  const [postUserAccess, response] =  usePostUserAccessMutation();
  const [changeAccessLevel, accessLevelChangeResponse] =  useAccessLevelMutation();
  let stallionDataFarms: any = [];
  stallionData?.forEach((stallions: any) => {
    stallionDataFarms?.push({
      stallionId: stallions?.stallionId,
      stallionName: stallions?.stallionName,
    });
  });

  // on API success
  React.useEffect(() => {
    if (response.isSuccess) {
      close();
      setOpenSuccessPopup(true)
    }
  }, [response.isSuccess]);

  // sendInvitation handler
  const sendInvitation = async (e:any) => {
    e.preventDefault(); 
    const data = {
      memberInvitationId: invitationId?.invitationId,
      farmId: farmId,
      accessLevelId: accessLevelId,
      stallionIds: stallionIdData
    }
    await changeAccessLevel(data);
    // setStallionIdData([]);
    // close();    
  };

  
  useEffect(() => {
    if (accessLevelChangeResponse?.isSuccess) {
      close();
      setStallionIdData([]);
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
      open = { openSuccessPopup}
      title = "Success!"
      onClose = {() => setOpenSuccessPopup(false)}
      body = {InvitationSuccess}
      userEmail = {email}
      />
      <form onSubmit={sendInvitation} autoComplete="off">
          <Box className='invite-user'>
            <Stack direction='row' className='user-access'>
            <Avatar
                src={ userImage ? userImage : Images.UserSignedOut}
                alt={userName}
                sx={ { width: '44px', height: '44px', marginRight: '1rem' } }
              /> 
              <Typography variant="h4">{toPascalCase(userName)}</Typography>
            </Stack>
            <Typography variant="h5">Select Stallions for this User</Typography>
            <Typography variant="h6">
              Please select the stallion(s) that <strong>{toPascalCase(userName)}</strong> will have access<br/>to view
              only.
              </Typography>
              <Box className="SDmultiselect stallion-select">
              { stallionDataFarms?.length > 0 && 
              <TypedMultiSelect 
              placeholder = { 'Select Stallion' }
              data = { stallionDataFarms }
              from = { 'USER-ACCESS' }
              values = { stallionIdData }
              returnFunction = { setStallionIdData }
              ref = { stallionSelectRef }
              />
              
}          
            </Box>
         
          <Box>
          <FormGroup className='useraccess-checkbox' sx={{mb:'18px'}}>
  <FormControlLabel control={<Checkbox checkedIcon={<img src={Images.checked} alt="checkbox"/>} 
  icon={<img src={Images.unchecked} alt="checkbox"/>} defaultChecked />} label="Send Notifications" />
</FormGroup>
          </Box>

        <CustomButton type="submit" fullWidth className="lr-btn" disabled={response.isLoading || stallionIdData.length === 0}>
          {' '}
          Save
        </CustomButton>
        <p>{submissionError}</p>
        </Box>
      </form>
    </StyledEngineProvider>
  );
}

export default UserAccess;

UserAccess.propTypes = {
  close: PropTypes.func.isRequired,
};
