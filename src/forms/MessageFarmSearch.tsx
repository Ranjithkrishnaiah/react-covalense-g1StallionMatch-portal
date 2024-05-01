import { InputLabel, Box, Typography, StyledEngineProvider } from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import './LRpopup.css';
import CustomAutocomplete from 'src/components/CustomAutocomplete';
import { useSearchFarmNameQuery } from 'src/redux/splitEndpoints/searchFarmNameSplit';
import React, { useState } from 'react';
import { debounce } from 'lodash';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';

export interface AddFarmSchemaType {
  farmSearch?: string;
}

function MessageFarmSearch(
  onClose: VoidFunctionType,
  getSelectedFarm: (val: any) => void,
  messageFarmSearch: string,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {
  const close = onClose;
  const [farmNameSearch, setFarmNameSearch] = useState<any>('');
  const [farmSelected, setFarmSelected] = useState<any>();
  const farmParam: any = {
    farmName: farmNameSearch,
  };
  // API call for farms list
  const { data: farmListApiData } = useSearchFarmNameQuery(farmParam, {
    skip: !farmNameSearch,
  });

  const farmApiData: any = {
    message: 'Default Message',
    farmId: farmSelected?.farmId,
  };

  // API call for post message
  const [postUserMessageFarmList, response] = usePostUserMessageMutation();

  const AddFarmSchema = Yup.object().shape({});

  const methods = useForm<AddFarmSchemaType>({
    resolver: yupResolver(AddFarmSchema),
    mode: 'onTouched',
  });

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const debouncedFarmName = React.useRef(
    debounce(async (farmName) => {
      await setFarmNameSearch(farmName);
    }, 1000)
  ).current;

  const handleFarmInput = (e: any) => {
    if (e.target.value && e.target.value.length >= 3) {
      debouncedFarmName(e.target.value);
    }
  };

  // validation form
  const validateGoToContactFarm = () => {
    if (farmSelected !== null && farmSelected !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  // method to submit form
  const handleSubmitFarm = () => {
    getSelectedFarm(farmSelected);
    postUserMessageFarmList(farmApiData);
    close();
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box py={2} pb={0}>
        <Typography variant="h6">
          Enter the farm name you would like to contact directly. Only farms with promoted stallion
          can be contacted.
        </Typography>
      </Box>
      <Box>
        <InputLabel>Farm Name</InputLabel>
        <CustomAutocomplete
          options={farmListApiData || []}
          noOptionsText={farmNameSearch != '' && null}
          onInputChange={handleFarmInput}
          popupIcon={<KeyboardArrowDownRoundedIcon />}
          {...register('farmSearch', { required: true })}
          getOptionLabel={(option: any) => option?.farmName}
          onChange={(e: any, selectedOptions: any) => setFarmSelected(selectedOptions)}
          placeholder={`Enter Farm`}
          className="directory-arrow"
          sx={{ justifyContent: 'center', flexGrow: 1, minWidth: '100px' }}
        />
        <p>{errors.farmSearch?.message}</p>
      </Box>
      <Box>
        <CustomButton
          disabled={!validateGoToContactFarm()}
          fullWidth
          className="lr-btn"
          onClick={handleSubmitFarm}
        >
          Submit
        </CustomButton>
      </Box>
    </StyledEngineProvider>
  );
}

export default MessageFarmSearch;
