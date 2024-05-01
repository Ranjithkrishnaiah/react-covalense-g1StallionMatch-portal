import React, { useRef } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  InputLabel,
  MenuItem,
  StyledEngineProvider,
  Typography,
  TextField,
  Theme,
  useTheme,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { VoidFunctionType } from '../@types/typeUtils';
import { useInviteUserMutation } from 'src/redux/splitEndpoints/inviteUserSplit';
import './LRpopup.css';
import '../pages/stallionDirectory/StallionDirectory.css'
import { CustomSelect } from 'src/components/CustomSelect';
import { useGetFarmAccessLevelsQuery } from 'src/redux/splitEndpoints/getFarmAccessLevelsSplit';
import { useLocation } from 'react-router';
import { useGetStallionNamesQuery } from 'src/redux/splitEndpoints/getStallionNamesSplit';
import { toast } from 'react-toastify';
import TypedMultiSelect from 'src/components/typedMultiSelect/TypedMultiselect';
import { LoadingButton } from '@mui/lab';

// Invite User Schema
export type InviteUserSchema = {
  fullName: string;
  email: string;
  accessLevelId: number;
};

// method to getStyles
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function InviteUser(onClose: VoidFunctionType, Reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>) {
  const close = onClose;
  const theme = useTheme();
  // mutation
  const [sendInvite, response] = useInviteUserMutation();
  const [submissionError, setSubmissionError] = React.useState('');
  const success = response.isSuccess;
  const loading = response.isLoading;
  const [stallionIdData, setStallionIdData] = React.useState<any>([]);

  const [personName, setPersonName] = React.useState<string[]>([]);
  const { pathname } = useLocation();
  const typedMultiselectRef = useRef<any>()

  // path from url params
  const pathSplitForFarm = pathname.split('/');
  let farmID: any = null;
  if (pathname.includes('users-list' || "stallions")) {
    farmID = pathSplitForFarm[pathSplitForFarm?.length - 2];
  } else {
    farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginTop: '-2px',
        marginRight: '2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },

  }

  // menuProps
  const MenuPropss: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        boxShadow: 'none',
        border: 'solid 1px #333333',
        borderTopLeftRadius: 0,
        maxWidth: 0,
        borderTopRightRadius: 0,
        marginTop: '-1px',
        boxSizing: 'border-box',
      },
    },
  };

  // onSuccess handler
  const notifySuccess = () =>
    toast.success('User invited successfully', {
      autoClose: 2000,
    });

  // API call to get stallion roaster data
  const {
    data: stallionRosterApiData,
  } = useGetStallionNamesQuery({ id: farmID }, { skip: !farmID });

  const stallionData = stallionRosterApiData;

  let stallionDataFarms: any = [];

  stallionData?.forEach((stallions: any) => {
    stallionDataFarms?.push({
      stallionId: stallions?.stallionId,
      stallionName: stallions?.stallionName,
    });
  });

  // API call to get farm access levels
  const { data: farmAccessLevels } = useGetFarmAccessLevelsQuery();

  // on success handler
  const showSuccess = () => {
    reset();
    close();
  };
  React.useEffect(() => {
    if (response.isSuccess) {
      reset();
      close();
    }
  }, [success]);

  // user schema
  const userSchema = Yup.object().shape({
    fullName: Yup.string().required(ValidationConstants.fullNameValidation),
    email: Yup.string().email("Email is not a valid email").required(ValidationConstants.emailValidation),
    accessLevelId: Yup.number().required(ValidationConstants.accessLevelValidation),
  });

  // methods for invite user farm
  const methods = useForm<InviteUserSchema>({
    resolver: yupResolver(userSchema),
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = methods;

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
    setSubmissionError("");
  };

  const accessLevel = watch('accessLevelId');
  const fullName = watch('fullName');

  // method to send invitation
  const sendInvitation = async (invitationData: InviteUserSchema) => {
    const dataApi = {
      ...invitationData,
      farmId: farmID,
      stallionIds: stallionIdData,
    }
    const res = await sendInvite(dataApi);
    const response: any = res;
    if (response.error) {
      if (response.error.status > 399 && response.error.status <= 499) {
        if (response?.error?.data?.errors === undefined) {
          setSubmissionError(
            `${response?.error?.data?.message}`
          );
        }else {
          setSubmissionError(
            `${Object.values(response?.error?.data?.errors)}`
          );
        }
      } else if (response.error.status > 499) {
        setSubmissionError(
          `Issue with Server...It responed with error code: ${response.error.status}`
        );
      }
    } else {
      localStorage.setItem('invitationEmail', invitationData.email)
      showSuccess();
      notifySuccess();
    }
  };

  // validate form
  const validate = () => {
    if (loading || !watch('fullName') || !watch('email') || !watch('accessLevelId')
      || errors?.fullName?.message || errors?.email?.message || errors.accessLevelId?.message)
      return true;
    return false;
  }

  // delete handler
  const handleDelete = (e: any, value: any) => {
    e.stopPropagation();
    let afterRemove = personName?.filter((res: any) => res != value);
    setPersonName(afterRemove);
  };

  return (
    <StyledEngineProvider injectFirst>
      {/* form for invite user */}
      <form onSubmit={handleSubmit(sendInvitation)} autoComplete="off">
        <Box className='invite-user'>
          <Box mb={2}>
            <InputLabel>Full Name</InputLabel>
            <TextField
              error={errors.fullName?.message ? true : false}
              fullWidth
              autoComplete="new-password"
              type="text"
              {...register('fullName', { required: true })}
              placeholder="Enter Full Name"
            />
            <p>{errors.fullName?.message}</p>
          </Box>
          <Box mb={2}>
            <InputLabel>Email Address</InputLabel>
            <TextField
              error={errors.email?.message ? true : false}
              fullWidth
              autoComplete="new-password"
              type="text"
              {...register('email', { required: true })}
              placeholder="Enter Email Address"
            />
            <p>{errors.email?.message}</p>
          </Box>
          <Box>
            <InputLabel>Access Level</InputLabel>

            <CustomSelect
              error={errors.accessLevelId?.message ? true : false}
              fullWidth
              IconComponent={KeyboardArrowDownRoundedIcon}
              {...register('accessLevelId', { required: true })}
              defaultValue={'none'}
              className='selectDropDownBox select-dropdown'
              sx={{ position: 'relative' }}
              MenuProps={MenuProps}
              onClick={() => { validate() }}
            >
              <MenuItem disabled className='selectDropDownList' value="none">
                <em>{' '}
                  Select Access Level{' '}</em>
              </MenuItem>
              {farmAccessLevels?.map(({ id, accessName }: any) => {
                return (
                  <MenuItem className="selectDropDownList" value={id} key={id}>
                    {accessName}
                  </MenuItem>
                );
              })}
            </CustomSelect>
            {typeof (errors?.accessLevelId?.message) === "string" ? <p>{ValidationConstants.accessLevelValidation}</p> : ''}
          </Box>
          {accessLevel === 3 && (
            <Box className='StallionsforthisUser' mt={2}>
              <Typography variant="h5">Select Stallions for this User</Typography>
              <Typography variant="h6">
                Please select the stallion(s) that <strong>{fullName || 'this user'}</strong> will have access to view
                only.
              </Typography>
              <Box className="SDmultiselect IUSelectStallion" sx={{ mb: '0 !important' }}>
                {stallionDataFarms?.length > 0 &&
                  <TypedMultiSelect
                    placeholder={'Select Stallions'}
                    data={stallionDataFarms}
                    from={'USER-ACCESS'}
                    values={stallionIdData}
                    returnFunction={setStallionIdData}
                    ref={typedMultiselectRef}
                  />
                }
              </Box>
            </Box>
          )}
          <Typography variant="h6">You will be notified when user accepts invitation and
            completes their profile.
          </Typography>
          <Box>
            <LoadingButton type="submit" fullWidth className="lr-btn"
              disabled={loading || validate()} loading={isSubmitting}>
              {' '}
              Send
            </LoadingButton>
          </Box>
          <p>{submissionError}</p>
        </Box>
      </form>
    </StyledEngineProvider>
  );
}

export default InviteUser;

InviteUser.propTypes = {
  close: PropTypes.func.isRequired,
};
