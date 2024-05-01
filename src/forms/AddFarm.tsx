import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InputLabel,
  Box,
  Typography,
  TextField,
  MenuItem,
  StyledEngineProvider,
} from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useForm } from 'react-hook-form';
import { ValidationConstants } from '../constants/ValidationConstants';
import { toast } from 'react-toastify';
import { useFarmsAddMutation } from 'src/redux/splitEndpoints/addFarmsSplit';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useStatesQuery } from 'src/redux/splitEndpoints/statesSplit';

// Form schema type
export interface AddFarmSchemaType {
  farmName?: string;
  farmCountryId?: number;
  farmStateId?: number;
  farmWebsiteUrl?: string;
}

function AddFarm(onClose: VoidFunctionType, Reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>) {

  // drop down CSS
  const ITEM_HEIGHT = 32;
  const ITEM_PADDING_TOP = 8;
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        marginRight: '0px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        marginTop: '-2px',
        borderRadius: '0px 0px 6px 6px',
        boxSizing: 'border-box',
      },
    },
  }

  const close = onClose;
  const [states, setStates] = useState<any>();
  const [farmCountryId, setFarmCountryId] = useState<any>();
  const { data: countriesList } = useCountriesQuery();
  const { data: statesListbyId, isSuccess: isStatesByIdSuccess } = useStatesQuery(farmCountryId, {
    skip: !Boolean(farmCountryId),
  });
  const [farmData, setFarmData] = useState<any>();

  const [addToFarm, response] = useFarmsAddMutation();

  const containsSpecialChars = (str: any) => {
    const specialChars = /[`@#%^&\=\[\]{};:"\\|<>\/?~]/;
    return specialChars.test(str);
  }

  // Add farm schema
  const AddFarmSchema = Yup.object().shape({
    farmName: Yup.string().required(ValidationConstants.farmNameValidation),
    farmCountryId: Yup.string().required(ValidationConstants.countryValidation),
    farmStateId: Yup.string().notRequired(),
    farmWebsiteUrl: Yup.string().notRequired(),//required(ValidationConstants.farmWebsiteValidation),
  });

  // Open states drop based on country selection
  React.useEffect(() => {
    setStates(statesListbyId);
  }, [statesListbyId, isStatesByIdSuccess]);

  // Add Farm form element
  const methods = useForm<AddFarmSchemaType>({
    resolver: yupResolver(AddFarmSchema),
    mode: 'onChange',
  });

  // Success notification
  const notifySuccess = () =>
    toast.success('Farm Added Successfully', {
      autoClose: 2000,
    });

  // Form element
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = methods;

  const watchFarmCountry = watch('farmCountryId');
  const watchFarm = watch('farmName');

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
  };

  // Set country id
  useEffect(() => {
    if (watchFarmCountry !== undefined) {
      if (!isNaN(watchFarmCountry)) {
        setFarmCountryId(watchFarmCountry);
      }
    }
  }, [watchFarmCountry]);
  const watchFarmWebsiteUrl = watch('farmWebsiteUrl');

  // Validate the add farm form
  const validateFarm = () => {
    if (
      errors.farmName ||
      errors.farmCountryId ||
      errors.farmStateId ||
      !watch('farmName') ||
      !watchFarmCountry
    )
      return false;
    return true;
  };

  // Show success message based on api call
  useEffect(() => {
    if (response?.isSuccess) {
      notifySuccess();
    }
  }, [response?.isSuccess]);

  // Submit form
  const SubmitRegisteration = (data: any, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    const { farmName, farmCountryId, farmStateId, farmWebsiteUrl } = data;

    let farmsdata: {};
    if (states?.length > 0) {
      farmsdata = {
        farmName: farmName,
        countryId: Number(farmCountryId),
        stateId: Number(farmStateId),
        website: farmWebsiteUrl,
      };
    } else if (farmWebsiteUrl === "") {
      farmsdata = {
        farmName: farmName,
        countryId: Number(farmCountryId),
      };
    }
    else {
      farmsdata = {
        farmName: farmName,
        countryId: Number(farmCountryId),
        website: farmWebsiteUrl,
      };
    }

    addToFarm(farmsdata);
    close();
  };

  // Validate the farm website url
  const isValidHttpUrl = (str: any) => {
    let test = /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{2,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(str);
    return test;
  }

  return (
    <StyledEngineProvider injectFirst>
      {/* Add farm form */}
      <form
        onSubmit={handleSubmit(SubmitRegisteration)}
        autoComplete="false"
        className="add-stallion-pop-wrapper"
      >
        <Box className={'show'}>
          <Box py={2} pb={0} className='add-stallion-pop-inner'>
            <Typography variant="h6">
              Send us the below information regarding your farm and we will link your farm to your
              account. You will receive confirmation when this is complete shortly.
            </Typography>
          </Box>

          <InputLabel>Farm Name</InputLabel>
          <TextField
            error={errors.farmName?.message ? true : false}
            fullWidth
            type="text"
            autoComplete="new-password"
            {...register('farmName', { required: true })}
            onChange={e => {
              const value = e.target.value;
              if (containsSpecialChars(value)) {
                setError('farmName', { type: 'custom', message: `Only $-_.+!*'(), special characters allowed` })
              } else {
                clearErrors('farmName')
              }
            }}
            placeholder="Enter Farm Name"
          />
          <p className='error-text'>{errors.farmName?.message}</p>

          <InputLabel>Farm Country</InputLabel>
          <CustomSelect
            className="selectDropDownBox"
            fullWidth
            sx={{ height: '54px', mb: '1rem' }}
            IconComponent={KeyboardArrowDownRoundedIcon}
            defaultValue={'none'}
            {...register('farmCountryId', { required: true })}

            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left"
              },
              ...MenuPropss
            }}
          >
            <MenuItem className="selectDropDownList" value="none" disabled>
              <em>Select Country</em>
            </MenuItem>
            {countriesList?.map(({ id, countryName }: any) => (
              <MenuItem className="selectDropDownList" value={id} key={id}>
                <Box className='mobile-dropdown-title'>{countryName}</Box>
              </MenuItem>
            ))}
          </CustomSelect>

          {farmCountryId && states?.length > 0 && (
            <Box mt={2}>
              <InputLabel>Farm State</InputLabel>
              <CustomSelect
                className="selectDropDownBox"
                fullWidth
                sx={{ height: '58px', mb: '1.5rem' }}
                IconComponent={KeyboardArrowDownRoundedIcon}
                defaultValue={'none'}
                {...register('farmStateId', { required: true })}

                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  },
                  ...MenuPropss
                }}
              >
                <MenuItem className="selectDropDownList" value="none" disabled>
                  <em>Select State</em>
                </MenuItem>
                {states?.map(({ id, stateName }: { id: any; stateName: any }) => (
                  <MenuItem className="selectDropDownList" value={id} key={id}>
                    {stateName}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>
          )}
          <Box mt={2}>
            <InputLabel>Website URL</InputLabel>
            <TextField
              error={errors.farmWebsiteUrl?.message ? true : false}
              fullWidth
              type="text"
              autoComplete="new-password"
              {...register('farmWebsiteUrl')}
              placeholder="Enter URL"
            />
            <p className='error-text'>{watchFarmWebsiteUrl && !isValidHttpUrl(watchFarmWebsiteUrl) ? 'Please enter valid url!'
              : (errors.farmWebsiteUrl?.message && errors.farmWebsiteUrl?.message)}</p>
          </Box>
          <CustomButton type="submit" disabled={!validateFarm()} fullWidth className="lr-btn">
            {' '}
            Add Farm{' '}
          </CustomButton>
        </Box>
      </form>
      {/* End Add farm form */}
    </StyledEngineProvider>
  );
}

export default AddFarm;
