import React, { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { ValidationConstants } from '../constants/ValidationConstants';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useStallionsCreateMutation } from 'src/redux/splitEndpoints/createAStallionSplit';
import { useGetYearToStudQuery } from 'src/redux/splitEndpoints/getYearToStudSplit';
import { useSubmitANewMareMutation } from 'src/redux/splitEndpoints/submitANewMareSplit';

export interface AddStallionSchemaType {
  horseName?: string;
  countryId?: number;
  yearSelected?: number;
}

function CreateAStallion(
  title: string,
  onClose: VoidFunctionType,
  createStallion: string,
  isSubmitStallion: boolean,
  isSubmitMare: boolean,
  closeAddMare: any,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {
  const ITEM_HEIGHT = 32;
  const ITEM_PADDING_TOP = 8;
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        marginRight: '2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        marginTop: '-2px',
        borderRadius: '0px 0px 6px 6px',
        boxSizing: 'border-box',
      },
    },
  };
  // menuprops
  const CBMenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        marginRight: '2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        marginTop: '2px',
        borderRadius: '6px 6px 0px 0px',
        boxSizing: 'border-box',
      },
    },
  };
  const close = onClose;

  // API calls for countries list
  const { data: countriesList } = useCountriesQuery();
  // API calls for YearToStud list
  const { data: YearToStud, isSuccess: isYearOfStudSuccess } = useGetYearToStudQuery();

  const [yearSelected, setYearSelected] = useState();

  // mutations
  const [createStallionApi, response] = useStallionsCreateMutation();
  const [submitANewMareApi, responseMare] = useSubmitANewMareMutation();

  // Form schema
  const AddFarmSchema = Yup.object().shape({
    horseName: Yup.string().required(ValidationConstants.stallionName),
    countryId: Yup.string().required(ValidationConstants.countryValidation),
  });

  // Close popup and reset form
  const closeModal = () => {
    close();
    reset();
  };

  // Success message
  const notifySuccess = () => {
    if (isSubmitStallion) {
      toast.success('Stallion Submitted Successfully', {
        autoClose: 2000,
      });
    } else if (isSubmitMare) {
      toast.success('Mare Submitted Successfully', {
        autoClose: 2000,
      });
    }
  };

  // Attach the form schema with form element 
  const methods = useForm<AddStallionSchemaType>({
    resolver: yupResolver(AddFarmSchema),
    mode: 'onTouched',
  });

  // Parameters for create stallion form element
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const watchFarmCountry = watch('countryId');

  // validate form
  const validateFarm = () => {
    if (errors.horseName || errors.countryId || !watch('horseName') || !watchFarmCountry)
      return false;
    return true;
  };

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
  }

  // Geo country call, if geoCountryName is not available in local storage
  const geoCountry = localStorage.getItem('geoCountryName');

  React.useEffect(() => {
    if (geoCountry === null) {
      navigator?.geolocation?.getCurrentPosition(
        function (position) {
          var Geonames = require('geonames.js');
          const geonames = new Geonames({
            username: 'cvlsm',
            lan: 'en',
            encoding: 'JSON',
          });
          let gmtOffset: any;
          let lng: any;
          let lat: any;
          geonames
            .timezone({ lng, lat })
            .then((res: any) => {
              gmtOffset = res.gmtOffset;
              lat = position.coords.latitude;
              lng = position.coords.longitude;
              return geonames.findNearby({ lng, lat });
            })
            .then((loc: any) => {
              localStorage.setItem('geoCountryName', loc.geonames[0].countryName);
            })
            .catch(function (err: any) {
              return err.message;
            });
        },
        function (error) {
          console.error('Error Code = ' + error.code + ' - ' + error.message);
        }
      );
    }
  }, [geoCountry]);

  // Submit form
  const SubmitRegisteration = (data: any) => {
    const { horseName, countryId, yearSelected } = data;
    const stallionData = {
      horseName: horseName,
      countryId: Number(countryId),
      yob: Number(yearSelected),
      countryName: geoCountry || 'Australia',
    };
    const mareData = {
      horseName: horseName,
      countryId: Number(countryId),
      yob: Number(yearSelected),
    };
    try {
      if (isSubmitStallion) {
        createStallionApi(stallionData);
        notifySuccess();
        closeModal();
      }

      if (isSubmitMare) {
        submitANewMareApi(mareData);
        notifySuccess();
        closeModal();
        closeAddMare();
      }
    } catch (e) {
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      {/* Create stallion form */}
      <form
        onSubmit={handleSubmit(SubmitRegisteration)}
        autoComplete="false"
        className="add-stallion-pop-wrapper"
      >
        <Box className={'show'}>
          {/* {response?.isSuccess && <BasicAlerts />} */}

          <Box pt={2}>
            <InputLabel>{isSubmitStallion ? 'Stallion Name' : 'Horse Name'} </InputLabel>
            <TextField
              error={errors.horseName?.message ? true : false}
              fullWidth
              type="text"
              autoComplete="new-password"
              {...register('horseName', { required: true })}
              placeholder="Enter Horse Name"
            />
            <p>{errors.horseName?.message}</p>
          </Box>
          <Box pt={0}>
            <InputLabel>Year of birth</InputLabel>
            <CustomSelect
              fullWidth
              className="selectDropDownBox select-dropdown"
              IconComponent={KeyboardArrowDownRoundedIcon}
              sx={{ height: '54px', mb: '1rem' }}
              error={(watch('yearSelected') || 'k').toString().match('none') ? true : false}
              {...register('yearSelected', { required: true })}
              defaultValue={'none'}

              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                ...MenuPropss,
              }}
            >
              <MenuItem className="selectDropDownList" value="none" disabled>
                <em>Select Year</em>
              </MenuItem>
              {YearToStud?.map((res: any) => (
                <MenuItem className="selectDropDownList" value={res.id} key={res.id}>
                  {res.label}
                </MenuItem>
              ))}
            </CustomSelect>
            <p>
              {(watch('yearSelected') || 'k').toString().match('none')
                ? 'Year of birth is a required field'
                : ''}
            </p>
          </Box>
          <Box pt={2}>
            <InputLabel>Country of birth</InputLabel>
            <CustomSelect
              className="selectDropDownBox CBselect"
              fullWidth
              sx={{ height: '54px', mb: '1rem' }}
              IconComponent={KeyboardArrowDownRoundedIcon}
              error={(watch('countryId') || 'k').toString().match('none') ? true : false}
              defaultValue={'none'}
              {...register('countryId', { required: true })}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                ...CBMenuProps,
              }}
            >
              <MenuItem className="selectDropDownList" value="none" disabled>
                <em>Select Country</em>
              </MenuItem>
              {countriesList?.map(({ id, countryName }: any) => (
                <MenuItem className="selectDropDownList" value={id} key={id}>
                  <Box className="mobile-dropdown-title">{countryName}</Box>
                </MenuItem>
              ))}
            </CustomSelect>
            <p>
              {(watch('countryId') || 'k').toString().match('none')
                ? 'This is a required field.'
                : ''}
            </p>
          </Box>
          <Box py={1.5} pb={0} className="Itnormally">
            <Typography variant="h6">
              It normally takes up to 24 hours for our team to review new requests. You will be
              notified via email when confirmed.
            </Typography>
          </Box>

          <CustomButton
            sx={{ marginTop: '5px!important' }}
            disabled={!validateFarm()}
            type="submit"
            fullWidth
            className="lr-btn"
          >
            {isSubmitStallion ? 'Submit' : 'Submit'}{' '}
          </CustomButton>
        </Box>
      </form>
      {/* End Create stallion form */}
    </StyledEngineProvider>
  );
}

export default CreateAStallion;
