import React, { useState, useEffect, useMemo, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InputLabel,
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  SelectChangeEvent,
  StyledEngineProvider,
  FormControlLabel,
  Autocomplete,
  Checkbox,
  Stack,
  Button,
} from '@mui/material';
import * as Yup from 'yup';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { ValidationConstants } from '../constants/ValidationConstants';
import YearSelector from 'src/components/YearSelector';
import { VoidFunctionType } from '../@types/typeUtils';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'src/pages/stallionDirectory/StallionDirectory.css';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useGetStallionByCountryQuery } from 'src/redux/splitEndpoints/getStallionByCountrySplit';
import { useStallionsAddMutation } from 'src/redux/splitEndpoints/stallionsAddSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import useAuth from 'src/hooks/useAuth';
import { Images } from 'src/assets/images';
import './LRpopup.css';
import CreateAStallion from './CreateAStallion';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { LoadingButton } from '@mui/lab';

// Tooltip 
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

// Add stallion Schema and parameter types
export interface AddStallionSchemaType {
  farmCountryId?: number;
  feeYear?: number;
  isPrivateFee?: boolean;
  fee?: number;
  currencyId?: number;
  horseId: string;
  farmId: string;
}

function AddStallion(
  title: string,
  onClose: VoidFunctionType,
  openOther: VoidFunctionType,
  changeTitleTest: React.Dispatch<React.SetStateAction<string>>,
  setDialogClassName: React.Dispatch<React.SetStateAction<string>>,
  handleSelectedStallions: (value: any) => void,
  openPromoteStallion: VoidFunctionType,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        //   width: 166,
        //   minWidth: 166,
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
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '0',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        marginTop: '-2px',
        borderRadius: '0px 0px 6px 6px',
        boxSizing: 'border-box',
      },
    },
  };

  const openCreateStallion = openOther;
  const close = onClose;
  const { authentication } = useAuth();

  const { data: countriesList } = useCountriesQuery();
  const [currency, setCurrency] = React.useState('none');
  const [farmLength, setFarmLength] = useState(false);
  const [showSelectFarm, setShowSelectFarm] = useState(false);
  const [items, setItems] = useState<any>({});
  const [farmList, setFarmList] = useState<any>([]);
  const [stallionError, setStallionError] = useState('');
  const [studFee, setStudFee] = useState('');
  const [radioSelectedValue, setRadioSelectedValue] = useState(false);
  const [farmLists, setFarmLists] = useState<any>();
  const [stallionname, setStallionName] = useState<any>('');
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  let { data: userFarmListData = [], isSuccess: isFarmsListSuccess } = useGetUsersFarmListQuery(
    null,
    { skip: !authentication }
  );

  // Open create stallion popup
  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  // Close create stallion popup
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
  };

  // Get the list of farm to add stallion into one farm
  useEffect(() => {
    if (isFarmsListSuccess) {
      userFarmListData = userFarmListData?.filter((v: any, i: number) => v.isActive === true && v.accessLevel !== '3rd Party');
      setFarmLists(userFarmListData);
    }
  }, [userFarmListData]);

  // Success message
  const notifySuccess = () =>
    toast.success('Stallion Added Successfully', {
      autoClose: 2000,
    });

  // Error message
  const notifyError = () =>
    toast.error('Stallion Already Exists.', {
      autoClose: 2000,
    });

  // Open Create new stallion popup
  const handleCreateStallion = () => {
    changeTitleTest('Submit a new Stallion');
    setDialogClassName('dialogPopup showBackIcon');
    if (openCreateStallion) openCreateStallion();
  };

  // On Closing popup reset form element
  const modalClose = () => {
    close();
    reset();
    reset2();
  };

  // On closing set the farm state
  useEffect(() => {
    setShowSelectFarm(false);
    setStudFee('');
  }, [close])

  const [addStallion, response] = useStallionsAddMutation();

  // Show the error response form api
  useEffect(() => {
    if (!!response.error && 'data' in response.error) {
      // TypeScript will handle it as `FetchBaseQueryError` from now on.
      if (response.error?.status === 406) {
        setStallionError('Stallion Already Exists.');
        notifyError();
      }
      if (response.error?.status === 404) {
        setStallionError('Stallion Already Exists.');
        notifyError();
      }
      if (response.error?.status === 422) {
        setStallionError('Stallion Not Exists');
        notifyError();
        openPromoteStallion();
      }
    }
  }, [response.error, response.isError]);

  // Add stallion form schema
  const AddStallionSchema = Yup.object().shape({
    //stallionName:  Yup.string().required(ValidationConstants.stallionName),
    // farmCountryId: Yup.string().required(ValidationConstants.countryValidation),
    feeYear: Yup.string().required(ValidationConstants.year),
    fee: Yup.string().required(ValidationConstants.fee),
    farmId: Yup.string(),
  });

  // Attach the form schema with form element 
  const methods = useForm<AddStallionSchemaType>({
    resolver: yupResolver(AddStallionSchema),
    mode: 'onTouched',
  });

  const [isCurrency, setIsCurrency] = React.useState(false);

  // Select the currency from list
  const handleCurrencyChange = (event: SelectChangeEvent<any>) => {
    setCurrency(event.target.value);
    setIsCurrency(true);
  };

  const [feeYear, setFeeYear] = React.useState('none');
  const [isfeeYear, setIsFeeYear] = React.useState(false);

  // Select the fee year from list
  const handleFeeYearChange = (event: SelectChangeEvent<any>) => {
    setFeeYear(event.target.value);
    setIsFeeYear(true);
  };

  const [farmId, setFarmId] = React.useState('none');
  const [isfarmId, setIsFarmId] = React.useState(false);

  // Select the farm form list
  const handleFarmChange = (event: SelectChangeEvent<any>) => {
    setFarmId(event.target.value);
    setIsFarmId(true);
  };

  // Api call to get currency list
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();

  // Parameters for add stallion form element
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isDirty },
  } = methods;

  // Schema for slect farm form
  const SelectFarmSchema = Yup.object().shape({
    farmId: Yup.string().required(ValidationConstants.farmId),
  });

  // Parameters for select farm form element
  const {
    register: register2,
    reset: reset2,
    watch: watch2,
    formState: { errors: errors2, isSubmitting },
    handleSubmit: handleSubmit2,
  } = useForm({
    resolver: yupResolver(SelectFarmSchema),
    mode: 'onTouched',
  });

  const watchFarmCountry: any = watch('farmCountryId');
  const watchFeeYear: any = watch('feeYear');
  const watchFee: any = watch('fee');
  // let value1 = watch();

  // Validate form
  const validateFarm = () => {
    // if (!watchFarmCountry || !watchFeeYear ||!watchFee || !stallionListSelected) return false;
    if (!isCurrency || !watchFeeYear || studFee === '' || horseId === '')
      return false;
    return true;
  };

  const [selectedData, setSelectedData] = useState<any>([]);
  const [isCountryAndHorseEntered, setIsCountryAndHorseEntered] = useState(false);

  const [countryID, setCountryID] = React.useState(0);
  const [horseId, setHorseId] = React.useState('');
  const [isClearStallion, setIsClearStallion] = useState(0);

  // On search show stallion list using debounce method
  const handleStallionInput = (e: any) => {
    setIsClearStallion(0);
    if (e.target.value && isClearStallion === 0) {
      debouncedStallionName(e.target.value);
    }
  };

  // Debounce method to show list of stallion 
  const debouncedStallionName = useRef(
    debounce(async (stallionName) => {
      if (stallionName.length >= 3 && isClearStallion === 0) {
        const horseFilterParams =
          '?order=ASC&horseName=' + stallionName + '&sex=M';
        await setSelectedData(horseFilterParams);
        await setIsCountryAndHorseEntered(true);
        await setStallionName(stallionName);
        refetch();
      } else {
        setIsCountryAndHorseEntered(false);
      }
    }, 1000)
  ).current;

  // Api call for stallion list
  const { data: stallionList, isSuccess, isFetching, refetch, requestId, isLoading } = useGetStallionByCountryQuery(selectedData, {
    skip: !isCountryAndHorseEntered,
  });
  let stallionNameOptionsList =
    isCountryAndHorseEntered && isClearStallion === 0 && !isFetching ? stallionList : [];

  // Get user info
  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setItems(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  // Get farm info
  useEffect(() => {
    setFarmList(items?.myFarms);
    setFarmLength(items?.myFarms?.length > 1);
    // setFarmList(farmListDummy)
  }, [items]);

  // Show on success message
  useEffect(() => {
    if (response?.isSuccess) {
      notifySuccess();
      openPromoteStallion();
      handleSelectedStallions(response?.data?.data?.stallionId);
      setShowSelectFarm(false);
      modalClose();
      reset();
      reset2();
      setValue('fee', undefined);
      setStudFee('');
      setFarmId('none');
      setHorseId('');
    }
  }, [response?.isSuccess]);

  //Reset the form on closing of the popup
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
  }

  // validate form
  const validateFarmOnly = () => {
    if (farmId === 'none') return false;
    return true;
  };

  // Submit Stallion form
  const SubmitRegisteration = async (data: any) => {
    const { currencyId, fee, feeYear, farmCountryId } = data;
    const stallionData = {
      // farmCountryId: countryID, //farmCountryId,
      feeYear: Number(feeYear),
      farmId: '',
      horseId: horseId, //stallionListSelected?.horseId,
      currencyId: currencyId,
      fee: Number(fee),
      isPrivateFee: radioSelectedValue,
    };

    if (farmLists.length) {
      if (farmLists.length === 1) {
        setShowSelectFarm(false);
        stallionData.farmId = farmLists[0].farmId;
        await addStallion(stallionData);
      } else {
        setShowSelectFarm(true);
      }
    } else {
      toast.error('Please Add Farm to add Stallion', {
        autoClose: 2000,
      });
    }
  };

  // Submit stallion form and attach farm to it
  const finalSubmitRegisteration = async (data: any) => {
    const { farmId } = data;
    const { currencyId, fee, feeYear, farmCountryId } = watch();
    const stallionData = {
      // farmCountryId: countryID, //farmCountryId,
      feeYear: Number(feeYear),
      farmId: farmId,
      horseId: horseId, //stallionListSelected?.horseId,
      currencyId: currencyId,
      fee: Number(fee),
      isPrivateFee: radioSelectedValue,
    };

    try {
      await addStallion(stallionData);

    } catch (error) {

    }

  };

  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  // Check stud fee private checkbox
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setRadioSelectedValue(event.target.checked);
  };

  // Select country from list
  const handlecountryChange = (event: any) => {
    setCountryID(event.target.value);
  };

  // Select horse id form the list
  const handleHorseSelect = (selectedOptions: any) => {
    setHorseId(selectedOptions.horseId);
  };

  // Reset the form element on popup close
  useEffect(() => {
    if (Reset === false) {
      setStudFee('');
      setCountryID(0);
      setIsCountryAndHorseEntered(false);
    }
  }, [Reset]);

  // Reset the horse search element on popup close
  const handleStallionOptionsReset = () => {
    setSelectedData('[]');
    setIsCountryAndHorseEntered(false);
    setIsClearStallion(1);
    setStallionName('');
  };

  return (
    <StyledEngineProvider injectFirst>
      {/* Add Stallion form */}
      <form
        onSubmit={handleSubmit(SubmitRegisteration)}
        autoComplete="false"
        className="add-stallion-pop-wrapper"
      >
        <Box className={showSelectFarm ? 'hide' : 'show'}>
          {/* <Box pt={2} className="add-stallion-pop-inner">
            <InputLabel className="search-for-stallion-text">Search for a Stallion</InputLabel>
            <CustomSelect
              error={isDirty && countryID === 0 ? true : false}
              className="selectDropDownBox"
              fullWidth
              sx={{ mb: '1rem' }}
              IconComponent={KeyboardArrowDownRoundedIcon}
              MenuProps={MenuProps}
              defaultValue={'none'}
              {...register('farmCountryId', { required: true })}
              onChange={handlecountryChange}
            >
              <MenuItem className="selectDropDownList" value="none" disabled>
                <em>Select Country</em>
              </MenuItem>
              {countriesList?.map(({ id, countryName }: any) => {
                return (
                  <MenuItem className="selectDropDownList" value={id} key={id}>
                    <Box className="mobile-dropdown-title">{countryName}</Box>
                  </MenuItem>
                );
              })}
            </CustomSelect>
            <p>{isDirty && countryID === 0 ? 'This is a required field.' : ''}</p>
          </Box> */}
          <Box pt={0} className="search-stallion-pop-box">
            <Box className="SDmultiselect">
              <Box className="search-stallion-pop-box-inner">
                <Autocomplete
                  disablePortal
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  noOptionsText={
                    // isStallionSearch &&
                    stallionname != '' &&
                    isClearStallion === 0 && (
                      <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                        <span className="fw-bold sorry-message">
                          {isFetching ? 'Loading...' : `Sorry, we couldn't find any matches for "${stallionname}"`}
                        </span>
                        <Box className="submit-new-bg">
                          <Button
                            variant="text"
                            className="lr-btn lr-btn-outline"
                            color="primary"
                            type="button"
                            onClick={handleOpenCreateStallionModal}
                          >
                            Submit a new Stallion
                          </Button>
                        </Box>
                      </Box>
                    )
                  }
                  options={stallionNameOptionsList || []}
                  onInputChange={handleStallionInput}
                  getOptionLabel={(option: any) => `${toPascalCase(option?.horseName)?.toString()}`}
                  renderOption={(props, option: any) => (
                    <li className="searchstallionListBox" {...props}>
                      <Stack className="stallionListBoxHead">
                        {toPascalCase(option.horseName)} ({option.yob},{' '}
                        <span>{option.countryCode}</span>){' '}
                      </Stack>
                      <Stack className="stallionListBoxpara">
                        <strong>X</strong>
                        <p>
                          {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                          <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                          {option.damYob}, <span>{option.damCountryCode}</span>)
                        </p>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={`Enter Stallion Name`} />
                  )}
                  onChange={(e: any, selectedOptions: any) => handleHorseSelect(selectedOptions)}
                  onBlur={() => handleStallionOptionsReset()}
                  className="mareBlockInput"
                />
              </Box>
            </Box>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} className="add-stallion-col" pt={0}>
            <Grid item xs={12} sm={3} md={3} className="year-add-stallion">
              <YearSelector
                {...register('feeYear', { required: true })}
                onChange={handleFeeYearChange}
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
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} className="currency-add-stallion">
              <CustomSelect
                fullWidth
                IconComponent={KeyboardArrowDownRoundedIcon}
                {...register('currencyId', { required: true })}
                className="select-dropdown selectDropDownBox"
                // value={currency}
                defaultValue="none"
                onChange={handleCurrencyChange}
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
                  <em>Currency</em>
                </MenuItem>
                {currencies?.map((option: any) => (
                  <MenuItem className="selectDropDownList" value={option.id} key={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={5} md={5} className="fee-value-add">
              <TextField
                {...register('fee')}
                placeholder="Enter Fee"
                type="number"
                autoComplete="off"
                value={studFee}
                onChange={(e: any) => setStudFee(e.target.value)}
              />
              <p>{errors.fee?.message}</p>
            </Grid>
          </Grid>

          <Box className="MakeStudFeeLines">
            <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  className="isPrivateFee"
                  name={'isPrivateFee'}
                  value={radioSelectedValue}
                  onChange={handleCheckboxChange}
                  checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                  icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                />
              }
              label={'Make Stud Fee Private'}
            />
            <p className="error-text">{errors.isPrivateFee?.message}</p>
            <HtmlTooltip
              enterTouchDelay={0}
              leaveTouchDelay={6000}
              className="CommonTooltip studfee-tooltip addStallionTooltip"
              placement="right-start"
              sx={{width: '274px !imporant'}}
              title={
                <React.Fragment>
                  {'Stud fee is essential within Stallion Match.'}{' '}
                  {' If you make your service fee private, then his '}{' '}
                  {
                    'fee will remain confidential within our platform it’s users and will only be used internally for reporting.'
                  }
                  {' '}
                </React.Fragment>
              }
            >
              <i className="icon-Info-circle"></i>
            </HtmlTooltip>
          </Box>

          <Box>
            {farmLength ? (
              <CustomButton
                disabled={!validateFarm()}
                fullWidth
                onClick={() => setShowSelectFarm(true)}
                className="lr-btn"
              >
                {' '}
                Submit{' '}
              </CustomButton>
            ) : (
              <CustomButton disabled={!validateFarm()} type="submit" fullWidth className="lr-btn">
                {' '}
                Submit{' '}
              </CustomButton>
            )}
          </Box>
          <Box py={0} className="cant-find-box">
            <Typography variant="h4">Can’t find what you’re looking for? </Typography>
            <p>
              If a horse is not currently listed in our database, you can submit it for review. This
              process can take up to 24 hours.
            </p>
            <CustomButton
              onClick={handleCreateStallion}
              className="lr-btn"
            >
              {' '}
              Submit a new Stallion
            </CustomButton>
          </Box>
          <Box></Box>
        </Box>
      </form>
      {/* End Add Stallion form */}

      {/* Add Farm form */}
      <form onSubmit={handleSubmit2(finalSubmitRegisteration)} autoComplete="false">
        <Box className={showSelectFarm ? 'show' : 'hide'}>
          <Box py={2} className="confirmFirmBlock">
            <Typography variant="h5">Confirm Farm</Typography>
            <Typography variant="h6" pb={4}>
              You currently have multiple farms associated with your account. Please confirm which
              farm this stallion will be standing at.
            </Typography>

            <CustomSelect
              className="selectDropDownBox"
              fullWidth
              IconComponent={KeyboardArrowDownRoundedIcon}
              error={(watch2('farmId') || 'k').toString().match('none') ? true : false}
              {...register2('farmId', { required: true })}
              value={farmId}
              onChange={handleFarmChange}
              MenuProps={MenuProps}
            >
              <MenuItem className="selectDropDownList" value="none" disabled>
                <em>Select Farm</em>
              </MenuItem>
              {farmLists?.map(({ farmId, farmName }: { farmId: string; farmName: string }) => {
                return (
                  <MenuItem className="selectDropDownList" value={farmId} key={farmId}>
                    {toPascalCase(farmName)}
                  </MenuItem>
                );
              })}
            </CustomSelect>
          </Box>
          <Box mb={2}>
            <LoadingButton disabled={!validateFarmOnly()} loading={isSubmitting} fullWidth type="submit" className="lr-btn">
              {' '}
              Confirm{' '}
            </LoadingButton>
          </Box>
        </Box>
      </form>
      {/* End Add Farm form */}

      {/* Create stallion popup */}
      <WrapperDialog
        open={openCreateStallionModal}
        title={'Submit a new Stallion'}
        dialogClassName={'dialogPopup showBackIcon'}
        onClose={handleCloseCreateStallion}
        isSubmitStallion={true}
        isSubmitMare={false}
        closeAddMare={''}
        body={CreateAStallion}
        className={'cookieClass'}
        createStallion="createStallion"
        sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
      />
    </StyledEngineProvider>
  );
}

export default AddStallion;
