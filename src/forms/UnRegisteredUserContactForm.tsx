import React, { useState, useEffect, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InputLabel,
  Box,
  Typography,
  TextField,
  MenuItem,
  StyledEngineProvider,
  TextareaAutosize,
  Stack,
  Autocomplete,
} from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useForm } from 'react-hook-form';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { Images } from 'src/assets/images';
import { useNavigate } from 'react-router';
import { useGetStallionNamesQuery } from 'src/redux/splitEndpoints/getStallionNamesSplit';
import { useGetYearToStudQuery } from 'src/redux/splitEndpoints/getYearToStudSplit';
import { useGetFarmByIdQuery } from 'src/redux/splitEndpoints/getFarmsByIdSplit';
import { useGetReportsOrderedQuery } from 'src/redux/splitEndpoints/getReportsOrderedSplit';
import { usePostUnRegisteredMessageMutation } from 'src/redux/splitEndpoints/postUnRegisteredMessage';
import { useSearchMareNamesQuery } from 'src/redux/splitEndpoints/searchMareNamesSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import { debounce } from 'lodash';

export interface UnregisteredMessageSchemaType {
  farmId: string;
  farmName: string;
  fullName?: string;
  email?: string;
  mareName?: any;
  mareNameSelected?: any;
  message?: string;
  stallionId?: string;
  country?: string;
  yob?: string;
  farmSearch?: string;
  farmCountryId?: number;
  farmStateId?: number;
  farmWebsiteUrl?: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
      marginRight: '2px',
      marginTop: '-2px',
      boxShadow: 'none',
      border: 'solid 1px #161716',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      boxSizing: 'border-box',
    },
  },
};

function UnRegisteredUserContactForm(
  onClose: VoidFunctionType,
  openSuccessForm: VoidFunctionType,
  changeTheTitle: React.Dispatch<React.SetStateAction<string>>,
  getFarmName: (val: string) => void,
  stallionId: string,
  horseName: string,
  farmId: string,
  contactForm: boolean,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  selectedMareName?: any
) {
  const close = onClose;

  const [showFullContact, setShowFullContact] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [horseNameSelected, setHorseNameSelected] = useState<any>(null);
  const [mareNameSelected, setMareNameSelected] = useState<any>(null);
  const [mareName, setMareName] = useState<any>();
  const [isMareSearch, setIsMareSearch] = useState(false);
  const [countryOfBirth, setCountryOfBirth] = useState(null);
  const [yearSelected, setYearSelected] = useState(null);
  const [message, setMessage] = useState<any>();
  const [showMore, setShowMore] = useState<boolean>(false);

  const [farmSelected, setFarmSelected] = useState<any>();
  const [farmNameSearch, setFarmNameSearch] = useState<any>('');
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [farmStallionList, setFarmStallionList] = useState<any>([]);
  const [locationSubject, setLocationSubject] = useState('');
  const [submissionError, setSubmissionError] = React.useState('');
  const [isClearMare, setIsClearMare] = useState(0);

  // email validation regular expression
  let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  const farmParam: any = {
    farmName: farmNameSearch,
  };

  // API call to get YearToStud list
  const { data: YearToStud, isSuccess: isYearOfStudSuccess } = useGetYearToStudQuery();

  const stallionListParms = {
    id: farmId,
  };
  // API call to get Farm details By farmID
  const { data: farmDetailsById } = useGetFarmByIdQuery(farmId);
  // API call to get Farm details By stallionID
  const { data: farmDetailsByStallion } = useGetReportsOrderedQuery(stallionId);
  // API call to post message
  const [postUnRegisteredMessageData, response] = usePostUnRegisteredMessageMutation();

  const mareNameData: any = {
    mareName: mareName,
  };
  // API call to get mares list
  const {
    data: mareNamesList,
    isFetching: isFetchingMare,
    refetch: refetchMare,
  } = useSearchMareNamesQuery(mareNameData, { skip: !isMareSearch });
  const pascalMareList =
    mareName &&
    isClearMare === 0 &&
    mareNamesList?.map((Obj: any) => ({
      ...Obj,
      mareName: toPascalCase(Obj.mareName),
    }));

  const handleMareInput = (e: any) => {
    setIsClearMare(0);
    if (e?.target?.value && isClearMare === 0) {
      debouncedMareName(e?.target?.value);
    }
    // setMareName(e.target.value);
    // setIsMareSearch(true);
  };

  const debouncedMareName = useRef(
    debounce(async (mareName: any) => {
      if (mareName.length >= 3 && isClearMare === 0) {
        await setMareName(mareName);
        await setIsMareSearch(true);
        refetchMare();
      } else {
        setIsMareSearch(false);
      }
    }, 1000)
  ).current;

  // Mare reset method to remove option list
  const handleMareOptionsReset = () => {
    // setMareName('');
    setIsMareSearch(false);
    setIsClearMare(1);
  };

  useEffect(() => {
    if (!mareName?.mareId) {
      setYearSelected(null);
    }
  }, [mareName?.mareId]);

  const countryData: any = {
    searchBy: countryOfBirth ? countryOfBirth : '',
  };
  // API call to get countries list
  const { data: countriesList } = useCountriesQuery(countryData);

  const handleCountryInput = (e: any) => {
    setCountryOfBirth(e.target.value);
  };

  useEffect(() => {
    if (farmSelected !== null && farmSelected !== undefined) {
      setSelectedFarmId(farmSelected?.farmId);
      getFarmName(farmSelected?.farmName);
    }
  }, [farmSelected?.farmId]);

  // API call to get stallions selected
  const { data: stallionsSelected, isSuccess: isStallionNamesSuccess } = useGetStallionNamesQuery(
    stallionListParms,
    {
      skip: !stallionListParms,
    }
  );

  // set stallions list
  useEffect(() => {
    if (isStallionNamesSuccess) {
      setFarmStallionList(stallionsSelected);
    }
  }, [isStallionNamesSuccess]);

  const navigate = useNavigate();

  // UnregisteredMessage Schema
  const UnregisteredMessageSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is a required field'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email Address is a required field'),
    // mareName: Yup.string().required('Mare Name is a required field'),
    message: Yup.string().required('Message is a required field'),
  });

  const methods = useForm<UnregisteredMessageSchemaType>({
    resolver: yupResolver(UnregisteredMessageSchema),
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
    setSubmissionError(' ');
  }

  // method to validate form
  const validateFarm = () => {
    if (
      fullName === undefined ||
      fullName === '' ||
      errors.email ||
      !watch('email') ||
      // emailReg.test(email) == false ||
      horseNameSelected === null ||
      horseNameSelected === '' ||
      mareName === null ||
      (mareName === undefined && mareNameSelected == null) ||
      mareName === '' ||
      message === undefined ||
      message === ''
    ) {
      return false;
    } else {
      return true;
    }
  };

  // initial values
  const InitialValues = () => {
    setFullName(undefined);
    setEmail(undefined);
    !horseName && setHorseNameSelected(null);
    setMareName(undefined);
    setShowMore(false);
    setMessage(undefined);
    if (!selectedMareName) {
      setCountryOfBirth(null);
      setYearSelected(null);
    }
  };

  // set initial state on popup close
  useEffect(() => {
    if (contactForm === false) {
      InitialValues();
    }
  }, [contactForm]);

  // set subject from url params
  useEffect(() => {
    const res = window.location.pathname.split('/')[1];
    setLocationSubject(res);
  }, []);

  const subjectRes =
    locationSubject === 'stud-farm'
      ? 'Farm Enquiry'
      : locationSubject === 'stallions'
      ? 'Stallion Enquiry'
      : 'General Enquiry';

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

  // useEffect to set horseName
  useEffect(() => {
    setHorseNameSelected(horseName);
  }, [horseName]);

  // useEffect to set mare details
  useEffect(() => {
    if (selectedMareName && !mareName?.mareId && !mareName) {
      setMareNameSelected({
        mareId: selectedMareName?.horseId,
        mareName: toPascalCase(selectedMareName?.horseName),
        yob: selectedMareName?.yob,
        cob: selectedMareName?.countryId,
        countryCode: selectedMareName?.cob,
      });
    } else {
      setMareNameSelected(null);
    }
  }, [selectedMareName, !mareName?.mareId]);

  // method for submit form
  const SubmitRegisteration = (data: any, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();

    const postData: any = {
      message: message,
      farmId: farmId,
      stallionId: stallionId ? stallionId : horseNameSelected?.stallionId,
      subject: subjectRes,
      channelId: '',
      fullName: fullName,
      fromName: fullName,
      fromEmail: data?.email,
      email: data?.email,
      cob: countryOfBirth || mareNameSelected?.countryId,
      yob: yearSelected || mareNameSelected?.yob,
      mareId: mareName?.mareId || mareNameSelected?.mareId,
      mareName: mareName?.mareName || mareName || mareNameSelected?.mareName,
      countryName: geoCountry || 'Australia',
    };
    postUnRegisteredMessageData(postData);

    close();
  };

  //opening success form after POST message
  useEffect(() => {
    if (response?.isSuccess) {
      openSuccessForm();
    }
  }, [response?.isSuccess]);

  return (
    <StyledEngineProvider injectFirst>
      {/* form for unregistered form */}
      <form
        onSubmit={handleSubmit(SubmitRegisteration)}
        autoComplete="false"
        className="add-stallion-pop-wrapper"
      >
        <Box>
          <Box className="stallion-msg-farm">
            <Stack direction="row" className="farm-culmn" sx={{ alignItems: 'end !important' }}>
              <Box className="msgs-farmlogo">
                <img
                  src={Images.farmplaceholder}
                  alt={stallionId ? farmDetailsByStallion?.farmName : farmDetailsById?.farmName}
                />
              </Box>
              <Stack direction="column" ml={2}>
                {stallionId ? (
                  <>
                    <Typography variant="subtitle1">
                      {toPascalCase(farmDetailsByStallion?.farmName) || ''}
                    </Typography>
                    <Typography component="span">
                      {farmDetailsByStallion?.stateName || ''}
                      {farmDetailsByStallion?.stateName ? ',' : ''}{' '}
                      {farmDetailsByStallion?.countryCode || ''}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle1">
                      {toPascalCase(farmDetailsById?.farmName) || ''}
                    </Typography>
                    <Typography component="span">
                      {farmDetailsById?.stateName || ''}
                      {farmDetailsById?.stateName ? ',' : ''} {farmDetailsById?.countryCode || ''}
                    </Typography>
                  </>
                )}
              </Stack>
            </Stack>
            <Box mb={3}>
              <InputLabel>Full Name</InputLabel>
              <TextField
                error={errors.fullName?.message ? true : false}
                {...register('fullName', { required: true })}
                fullWidth
                type="text"
                autoComplete="new-password"
                onChange={(e: any) => setFullName(e.target.value)}
                placeholder="Enter Full Name"
              />
              <p className="error-text">{errors.fullName?.message}</p>
            </Box>

            <Box mb={3}>
              <InputLabel>Email Address</InputLabel>
              <TextField
                error={errors.email?.message ? true : false}
                {...register('email', { required: true })}
                fullWidth
                type="email"
                placeholder="Enter email address"
              />
              <p className="error-text">{errors.email?.message}</p>
            </Box>
            <Box mb={3}>
              <InputLabel>Select Stallion</InputLabel>
              <CustomSelect
                className="selectDropDownBox"
                fullWidth
                sx={{ height: '54px' }}
                MenuProps={MenuProps}
                IconComponent={KeyboardArrowDownRoundedIcon}
                defaultValue={'none'}
                value={horseNameSelected ? horseNameSelected : 'none'}
                onChange={(e: any) => setHorseNameSelected(e.target.value)}
                disabled={horseName ? true : false}
              >
                {!horseName && (
                  <MenuItem className="selectDropDownList" value="none" disabled>
                    Select Stallion
                  </MenuItem>
                )}
                {farmStallionList &&
                  farmStallionList?.map((stallion: any) => (
                    <MenuItem
                      className="selectDropDownList"
                      value={stallion}
                      key={stallion?.stallionId}
                    >
                      {toPascalCase(stallion?.stallionName)}
                    </MenuItem>
                  ))}
                {horseName && (
                  <MenuItem
                    className="selectDropDownList"
                    value={horseNameSelected}
                    key={horseNameSelected}
                  >
                    {toPascalCase(horseNameSelected)}
                  </MenuItem>
                )}
              </CustomSelect>
              {/* <p>{horseNameSelected === '' ? 'Select Stallion is a required field' : ''}</p> */}
            </Box>

            <Box className="search-stallion-pop-box-inner searchPopupBox">
              <InputLabel>Mare Name</InputLabel>

              {selectedMareName ? (
                <>
                  <Autocomplete
                    disablePortal
                    popupIcon={<KeyboardArrowDownRoundedIcon />}
                    options={pascalMareList || []}
                    noOptionsText={
                      isMareSearch &&
                      mareName != '' &&
                      isClearMare === 0 && (
                        <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                          <span className="fw-bold sorry-message">
                            {isFetchingMare
                              ? 'Loading...'
                              : `Sorry, we couldn't find any matches for "${mareName}"`}
                          </span>
                        </Box>
                      )
                    }
                    onInputChange={handleMareInput}
                    getOptionLabel={(option: any) =>
                      `${toPascalCase(option?.mareName)?.toString()} (${option?.yob}, ${
                        option?.countryCode
                      })`
                    }
                    defaultValue={mareNameSelected && mareNameSelected}
                    renderInput={(params) => (
                      <TextField
                        error={mareName === null || mareName === '' ? true : false}
                        {...register('mareNameSelected', { required: true })}
                        {...params}
                        placeholder={`Enter Mare Name`}
                      />
                    )}
                    renderOption={(props, option: any) => (
                      <li
                        className="searchstallionListBox"
                        {...props}
                        key={`${option?.mareId}${option?.mareName}`}
                      >
                        <Stack className="stallionListBoxHead">
                          {toPascalCase(option.mareName)} ({option.yob},{' '}
                          <span>{option.countryCode}</span>)
                        </Stack>
                        <Stack className="stallionListBoxpara">
                          <strong>X</strong>
                          <p>
                            {toPascalCase(option.sireName)} (<span>{option.sireCountryCode}</span>){' '}
                            {option.sireYob} - {toPascalCase(option.damName)} (
                            <span>{option.damCountryCode}</span>) {option.damYob}
                          </p>
                        </Stack>
                      </li>
                    )}
                    onChange={(e: any, selectedOptions: any) => {
                      setMareName(selectedOptions);
                      setCountryOfBirth(selectedOptions?.cob ? selectedOptions?.cob : null);
                      setYearSelected(selectedOptions?.yob ? selectedOptions?.yob : null);
                    }}
                    onBlur={() => handleMareOptionsReset()}
                    className="mareBlockInput"
                  />
                  <p className="error-text">
                    {mareName === null || mareName === '' ? 'Mare Name is a required field' : ''}
                  </p>
                </>
              ) : (
                <>
                  <Autocomplete
                    disablePortal
                    popupIcon={<KeyboardArrowDownRoundedIcon />}
                    options={pascalMareList || []}
                    noOptionsText={
                      isMareSearch &&
                      mareName != '' &&
                      isClearMare === 0 && (
                        <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                          <span className="fw-bold sorry-message">
                            {isFetchingMare
                              ? 'Loading...'
                              : `Sorry, we couldn't find any matches for "${mareName}"`}
                          </span>
                        </Box>
                      )
                    }
                    onInputChange={handleMareInput}
                    getOptionLabel={(option: any) =>
                      `${toPascalCase(option?.mareName)?.toString()} (${option?.yob}, ${
                        option?.countryCode
                      })`
                    }
                    renderInput={(params) => (
                      <TextField
                        error={mareName === null || mareName === '' ? true : false}
                        {...register('mareName', { required: true })}
                        {...params}
                        placeholder={`Enter Mare Name`}
                      />
                    )}
                    renderOption={(props, option: any) => (
                      <li
                        className="searchstallionListBox"
                        {...props}
                        key={`${option?.mareId}${option?.mareName}`}
                      >
                        <Stack className="stallionListBoxHead">
                          {toPascalCase(option.mareName)} ({option.yob},{' '}
                          <span>{option.countryCode}</span>)
                        </Stack>
                        <Stack className="stallionListBoxpara">
                          <strong>X</strong>
                          <p>
                            {toPascalCase(option.sireName)} (<span>{option.sireCountryCode}</span>){' '}
                            {option.sireYob} - {toPascalCase(option.damName)} (
                            <span>{option.damCountryCode}</span>) {option.damYob}
                          </p>
                        </Stack>
                      </li>
                    )}
                    onChange={(e: any, selectedOptions: any) => {
                      setMareName(selectedOptions);
                      setCountryOfBirth(selectedOptions?.cob ? selectedOptions?.cob : 1);
                      setYearSelected(selectedOptions?.yob ? selectedOptions?.yob : 1990);
                    }}
                    onBlur={() => handleMareOptionsReset()}
                    className="mareBlockInput"
                  />
                  <p className="error-text">
                    {mareName === null || mareName === '' ? 'Mare Name is a required field' : ''}
                  </p>
                </>
              )}

              <Stack direction="row" mt={1}>
                <Box flexGrow={1}>
                  <p>{errors.farmName?.message}</p>
                </Box>
                <Box className="more">
                  <Typography onClick={() => setShowMore(!showMore)}>
                    {showMore ? 'Less' : 'More'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box className={showMore ? 'show' : 'hide'}>
              {!mareName?.mareId && (
                <Box mb={3}>
                  <InputLabel>Country of Birth</InputLabel>
                  <Autocomplete
                    disablePortal
                    popupIcon={<KeyboardArrowDownRoundedIcon />}
                    options={countriesList || []}
                    noOptionsText={countryOfBirth != '' && null}
                    onInputChange={handleCountryInput}
                    getOptionLabel={(option: any) => option?.countryName}
                    renderInput={(params) => (
                      <TextField {...params} placeholder={`Enter country of birth`} />
                    )}
                    onChange={(e: any, selectedOptions: any) => {
                      setCountryOfBirth(selectedOptions?.id);
                    }}
                    className="mareBlockInput"
                  />
                </Box>
              )}

              {mareName?.mareId && (
                <Box mb={3}>
                  <InputLabel>Country of Birth</InputLabel>
                  <CustomSelect
                    className="selectDropDownBox"
                    fullWidth
                    sx={{ mb: '1rem' }}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    MenuProps={MenuProps}
                    defaultValue={'none'}
                    value={mareName?.countryName ? mareName?.countryName : 'none'}
                    disabled={mareName?.mareId ? true : false}
                  >
                    <MenuItem
                      className="selectDropDownList"
                      value={mareName?.countryName}
                      key={mareName?.countryName}
                    >
                      {mareName?.countryName}
                    </MenuItem>
                  </CustomSelect>
                </Box>
              )}

              <Box mb={3}>
                <InputLabel>Year of Birth</InputLabel>
                <CustomSelect
                  fullWidth
                  className="selectDropDownBox select-dropdown"
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  sx={{ height: '54px' }}
                  MenuProps={MenuProps}
                  defaultValue={'none'}
                  value={yearSelected ? yearSelected : 'none'}
                  onChange={(e: any) => setYearSelected(e.target.value)}
                  disabled={mareName?.mareId ? true : false}
                >
                  {!mareName?.mareId && (
                    <MenuItem className="selectDropDownList" value="none" disabled>
                      Enter year of birth
                    </MenuItem>
                  )}
                  {!mareName?.mareId &&
                    YearToStud?.map((res: any) => (
                      <MenuItem className="selectDropDownList" value={res.id} key={res.id}>
                        {res.label}
                      </MenuItem>
                    ))}
                  {yearSelected && (
                    <MenuItem
                      className="selectDropDownList"
                      value={yearSelected}
                      key={yearSelected}
                    >
                      {yearSelected}
                    </MenuItem>
                  )}
                </CustomSelect>
              </Box>
            </Box>
            <Box mb={3}>
              <InputLabel>Message</InputLabel>
              <TextareaAutosize
                {...register('message', { required: true })}
                className={`nomination-messageBox ${errors.message ? 'errorBorder' : ''}`}
                autoComplete="new-password"
                onChange={(e: any) => setMessage(e.target.value)}
                placeholder="Enter message"
                style={{ width: '100%' }}
                minRows={'5'}
              />
              <p className="error-text">{errors.message?.message}</p>
            </Box>

            <CustomButton disabled={!validateFarm()} type="submit" fullWidth className="lr-btn">
              Send
            </CustomButton>
            <Box className="terms termsModal" mt={2}>
              By clicking Send, You agree to our{' '}
              <a href={`/about/terms`} target="_blank" className="terms-btn">
                Terms and Conditions
              </a>
            </Box>
          </Box>
        </Box>
      </form>
      {/* form for unregistered form end */}
    </StyledEngineProvider>
  );
}

export default UnRegisteredUserContactForm;
