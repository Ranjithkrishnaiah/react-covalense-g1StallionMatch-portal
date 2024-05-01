import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Typography,
  MenuItem,
  StyledEngineProvider
} from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { toPascalCase } from 'src/utils/customFunctions';
import { useGetStallionReasonsQuery } from 'src/redux/splitEndpoints/getStallionReasonsSplit';
import { useApiWithremoveStallionMutation } from 'src/redux/splitEndpoints/removeStallionSplit';
import { useAddRemoveReasonSubmitMutation } from 'src/redux/splitEndpoints/addRemoveReasonSubmitSplit';

export interface StopNominationSchema {
  removeReason: string;
}

function ConfirmRemoveStallion(
  closeAndReset: VoidFunctionType,
  stallionName: string,
  ExpiryDate: string,
  ChangeTitleRemove: (value: any) => void,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  stallionId?: string
) {
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        marginRight: '0',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };
  const close = closeAndReset;
  const [showReason, setShowReason] = useState(false);
  const [removeStallion, response] = useApiWithremoveStallionMutation();
  const [submitReason, reasonRes] = useAddRemoveReasonSubmitMutation();
  const { data: reasonsData, isSuccess, isError } = useGetStallionReasonsQuery();

  const ActivateNominationSchema = Yup.object().shape({
  });

  const methods = useForm<StopNominationSchema>({
    resolver: yupResolver(ActivateNominationSchema),
    mode: 'onTouched',
  });

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = methods;

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
  };

  // validate form
  const validateFarm = () => {
    return true;
  };

  // Call remove stallion api and open reason popup 
  const handleRemove = () => {
    setShowReason(true);
    const res = removeStallion({ stallionId: stallionId });
    ChangeTitleRemove('Successfully Removed');
  };

  // Submit form
  const SubmitRegisteration = (data: any, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    const { removeReason } = data;
    const apiData = {
      stallionId: stallionId,
      reasonId: removeReason,
    }
    const res: any = submitReason(apiData)
    close();
    setShowReason(false);
    window.location.reload();
  };

  // show success message
  useEffect(() => {
    if (reasonRes.isSuccess) {
      toast.success('Stallion Removed Successfully.', {
        autoClose: 2000,
      });
    }
    else if (reasonRes.isError){
      toast.error('Stallion Not Deleted', {
        autoClose: 2000,
      });
    }
  },[reasonRes])

  return (
    <StyledEngineProvider injectFirst>
      <form
        onSubmit={handleSubmit(SubmitRegisteration)}
        autoComplete="false"
        className="add-stallion-pop-wrapper remove-modal-roaster-wrapper"
      >
        <Box>
          <Box className={showReason ? 'hide' : 'show'}>
            <Box py={2} pb={0}>
              <Typography variant="h6">
                Are you sure you want to remove {toPascalCase(stallionName)} from your Stallion Roster?
              </Typography>
            </Box>

            <Box>
              <Typography component="p">
                This stallion will be removed from your farm and all users will lose access to
                viewing breeder information and stallion analytics.{' '}
              </Typography>
            </Box>

            <Box className="remove-modal-bottom">
              <CustomButton fullWidth onClick={close} className="lr-btn">
                Cancel
              </CustomButton>
              <CustomButton
                fullWidth
                disabled={!validateFarm()}
                onClick={handleRemove}
                className="lr-btn lr-btn-outline"
              >
                Remove
              </CustomButton>
            </Box>
          </Box>
          <Box className={showReason ? 'show' : 'hide'}>
            <Box py={2} pb={0}>
              <Typography variant="h6">Your stallion has been removed.</Typography>
            </Box>
            <Box>
              <Typography component="p">
                Please indicate below the reason for removing the stallion from your farm:
              </Typography>
            </Box>
            <Box mt={3} mb={4}>
              <CustomSelect
                className="selectDropDownBox"
                fullWidth
                sx={{ mb: '1rem' }}
                IconComponent={KeyboardArrowDownRoundedIcon}
                MenuProps={MenuProps}
                defaultValue={'none'}
                {...register('removeReason', { required: true })}
              >
                <MenuItem className="selectDropDownList" value="none" disabled>
                  Select Reason
                </MenuItem>
                {reasonsData?.map(({ id, reasonName }: any) => {
                  return (
                    <MenuItem className="selectDropDownList" value={id} key={id}>
                      {reasonName}
                    </MenuItem>
                  );
                })}
              </CustomSelect>
            </Box>
            <Box>
              <CustomButton type="submit" fullWidth disabled={!validateFarm()} className="lr-btn">
                OK
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </form>
    </StyledEngineProvider>
  );
}

export default ConfirmRemoveStallion;
