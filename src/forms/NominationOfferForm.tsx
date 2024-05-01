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
  Avatar,
  Button,
  Grid,
  Autocomplete,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { CustomSelect } from 'src/components/CustomSelect';
import { useForm } from 'react-hook-form';
import { VoidFunctionType } from 'src/@types/typeUtils';
import * as Yup from 'yup';
import { ValidationConstants } from 'src/constants/ValidationConstants';
import { Images } from 'src/assets/images';
import { CustomButton } from 'src/components/CustomButton';
import { useNavigate } from 'react-router';
import { ROUTES } from 'src/routes/paths';
import 'src/pages/messages/Messages.css';
import { useGetStallionNamesQuery } from 'src/redux/splitEndpoints/getStallionNamesSplit';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useGetYearToStudQuery } from 'src/redux/splitEndpoints/getYearToStudSplit';
import { useSearchMareNamesQuery } from 'src/redux/splitEndpoints/searchMareNamesSplit';
import { usePostNominationRequestMutation } from 'src/redux/splitEndpoints/postNominationRequestSplit';
import { toast } from 'react-toastify';
import { usePostGetChannelIdMutation } from 'src/redux/splitEndpoints/postGetChannelId';
import { toPascalCase } from 'src/utils/customFunctions';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import { useGetProfileImageQuery } from 'src/redux/splitEndpoints/addUserProfileImage';
import { debounce } from 'lodash';
import './LRpopup.css';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import CreateAStallion from 'src/forms/CreateAStallion';

function NominationOfferForm(
  onClose: VoidFunctionType,
  farmId: string,
  openNominationWrapper: boolean,
  selectedFarmHeader: any,
  setLoaderInProgress: any,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {
  const stallionListParms = {
    id: farmId,
  };
  const isNull = (val: any) => {
    if (val === null) return true;
    return false;
  };

  const { data: userProfileData, isSuccess: getProfileSuccess } = useGetProfileImageQuery(null);
  const [selectedStallion, setSelectedStallion] = useState<any>(null);

  const [offerPrice, setOfferPrice] = useState<any>();
  const [mareName, setMareName] = useState<any>('');
  const [selectedMareName, setSelectedMareName] = useState<any>();
  const [countryOfBirth, setCountryOfBirth] = useState(null);
  const [yearBirth, setYearBirth] = useState(null);
  const [nominationMessage, setNominationMessage] = useState<any>();
  const [isMareSearch, setIsMareSearch] = useState(false);
  const [locationpath, setLocationpath] = useState('');
  const [locationSubject, setLocationSubject] = useState('');
  const [isClearMare, setIsClearMare] = useState(0);
  const [isMareFakeLoading, setIsMareFakeLoading] = useState(false);
  const [openCreateMareModal, setOpenCreateMareModal] = useState(false);
  const handleOpenCreateMareModal = () => {
    setOpenCreateMareModal(true);
  };
  const handleCloseCreateMareModal = () => {
    setOpenCreateMareModal(false);
  };


  // Once user input some keyword against mare search modal, handleMareInput will call
  const handleMareInput = (e: any) => {
    setIsClearMare(0);
    if (e.target.value && isClearMare === 0) {
      debouncedMareName(e.target.value);
    }
    if (e?.target?.value === "") {
      setIsMareSearch(false);
      setIsMareFakeLoading(false);
      setMareName("");
      setIsClearMare(1);
    }
  };

  // loaddash debounce Mare to restrict api call for each character
  const debouncedMareName = useRef(
    debounce(async (mareName) => {
      if (mareName.length >= 3 && isClearMare === 0) {
        await setMareName(mareName);
        await setIsMareSearch(true);
        await setIsMareFakeLoading(true);
        refetchMare();
      } else if (mareName?.length === 0 && isClearMare === 0) {
        setIsMareSearch(false);
        setIsMareFakeLoading(false);
        setMareName("");
      }else{
        setIsMareSearch(false);
        setIsMareFakeLoading(true);
        setMareName(mareName);
      }
    }, 250)
  ).current;

  // Mare reset method to remove option list
  const handleMareOptionsReset = (blurVal: number) => {
    setMareName('');
    setIsMareSearch(false);
    setIsClearMare(blurVal);
    setIsMareFakeLoading(false);
  };

  // API call for getting stallions
  const { data: stallionsSelected } = useGetStallionNamesQuery(stallionListParms);

  const mareNameData: any = {
    mareName: mareName,
  };
  // API call for getting mares
  const { data: mareNamesList, isSuccess: isSuccessMare, isFetching: isFetchingMare, refetch: refetchMare, isLoading: isLoadingMare } = useSearchMareNamesQuery(mareNameData, { skip: !isMareSearch });
  const pascalMareList = (isMareSearch && isClearMare === 0 && !isFetchingMare) ? mareNamesList?.map((Obj: any) => ({
    ...Obj,
    mareName: toPascalCase(Obj.mareName),
  })) : [];

  useEffect(() => {
    if (isSuccessMare) {
      setIsMareFakeLoading(false);
    }
  }, [isFetchingMare]);

  // Once user choose a mare  from the options, perform related task, 
  const handleMareSelect = (selectedOptions: any) => {
    setSelectedMareName(selectedOptions);
    setCountryOfBirth(selectedOptions?.cob === 0 ? null : selectedOptions?.cob);
    setYearBirth(selectedOptions?.yob === 0 ? 1986 : selectedOptions?.yob);
    setIsMareSearch(false);
    setIsClearMare(0);
    setIsMareFakeLoading(false);
    setMareName(selectedOptions);
  };

  // API call for post nomination offer
  const [postNominationRequest, response] = usePostNominationRequestMutation();

  //post mutation to get channelId
  const [postGetChannelId, responsePostGetChannelId] = usePostGetChannelIdMutation();

  //post mutation to get new chat
  const [postUserMessageFarmList, responseMessageFarmList] = usePostUserMessageMutation();

  // const handleMareInput = (e: any) => {
  //   setMareName(e.target.value);
  //   setIsMareSearch(true);
  // };

  const user: any = isNull(localStorage.getItem('user'))
    ? { fullName: '' }
    : JSON.parse(localStorage.getItem('user') || '{fullName: }');

  const countryData: any = {
    searchBy: countryOfBirth ? countryOfBirth : '',
  };
  // API call for countries list
  const { data: countriesList } = useCountriesQuery(countryData, {
    skip: !countryOfBirth,
  });

  const handleCountryInput = (e: any) => {
    setCountryOfBirth(e.target.value);
  };
  // API call for YearToStud list
  const { data: YearToStud, isSuccess: isYearOfStudSuccess } = useGetYearToStudQuery();

  const navigate = useNavigate();

  // schema for nomination form
  const NominationSendSchema = Yup.object().shape({
    selectStallion: Yup.string().required(ValidationConstants.stallionRequired),
    offerPrice: Yup.string().required('Offer Price is a required field'),
    mareName: Yup.string().required('Mare Name is a required field'),
    countryBirth: Yup.string().required('Country of Birth is a required field'),
    yearBirth: Yup.string().required('Year of Birth is a required field'),
    nominationOfferMessage: Yup.string().required('Message is a required field'),
  });

  const methods = useForm<any>({
    resolver: yupResolver(NominationSendSchema),
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
    control,
  } = methods;

  // validations for nomination form
  const validateRequestNomonation = () => {
    if (
      selectedStallion === undefined ||
      selectedStallion === null ||
      selectedStallion?.isPromoted === null ||
      selectedStallion?.isPromoted === 0 ||
      offerPrice === undefined ||
      offerPrice === '' ||
      // selectedMareName.mareName === null ||
      // selectedMareName.mareName === undefined ||
      selectedMareName?.mareName === '' ||
      countryOfBirth === null ||
      countryOfBirth === '' ||
      countryOfBirth === undefined ||
      yearBirth === null ||
      yearBirth === '' ||
      yearBirth === undefined ||
      nominationMessage === undefined ||
      nominationMessage === '' ||
      nominationMessage?.trim().length === 0
    )
      return false;
    return true;
  };

  // on close popup
  useEffect(() => {
    if (Reset === true) {
      InitialValues();
    }
  }, [Reset]);
  // console.log(selectedStallion,Reset,'selectedStallion')

  // initial values of form
  const InitialValues = () => {
    setSelectedStallion(null);
    setOfferPrice(undefined);
    setSelectedMareName(undefined);
    setCountryOfBirth(null);
    setYearBirth(null);
    setNominationMessage(undefined);
  };

  // get url param for location
  useEffect(() => {
    const res = window.location.pathname.split('/')[1];
    setLocationpath(res);
  }, []);

  // get url param for subject
  useEffect(() => {
    const res = window.location.pathname.split('/')[2];
    setLocationSubject(res === (undefined || '') ? 'thread' : res);
  }, []);

  //on success nomination
  useEffect(() => {
    const resLocationUrl = window.location.pathname.split('/')[1];
    if (resLocationUrl !== 'messages' && response?.isSuccess) {
      toast.success('Your Nomination Request has been sent successfully!', {
        autoClose: 2000,
      });
    }
  }, [response?.isSuccess]);

  const subjectRes =
    locationSubject === 'farm'
      ? 'Farm enquiry'
      : locationSubject === 'stallion'
        ? 'Stallion enquiry'
        : 'General enquiry';

  // console.log(mareName, 'studFee')
  // method for submit stallionNominationOffer
  const stallionNominationOffer = (data: any, event?: React.BaseSyntheticEvent) => {
    let postData = {
      rxId: farmId,
    };
    let tenPrecFee = selectedStallion?.studFee - (selectedStallion?.studFee * 0.10);
    // console.log(tenPrecFee,'tenPrecFee');
    if (Number(offerPrice.replace(/\,/g, '')) >= tenPrecFee) {
      postGetChannelId(postData).then((res: any) => {
        let nominationData = {
          stallionId: selectedStallion?.stallionId,
          farmId: farmId,
          mareId: selectedMareName?.mareId || '',
          mareName: selectedMareName?.mareName || mareName,
          offerPrice: Number(offerPrice.replace(/\,/g, '')),
          currencyId: selectedStallion?.currencyId,
          cob: countryOfBirth,
          yob: yearBirth,
          channelId: res?.data?.channelId ? res?.data?.channelId : '',
          fromMemberId: res?.data?.channelId ? res?.data?.memberId : user?.id,
          message: nominationMessage,
          fullName: user?.fullName || '',
          email: user?.email || '',
          subject: res?.data?.initialSubject || 'Nomination Enquiry',
        };
        postNominationRequest(nominationData);
        onClose();
      });
    } else {
      toast.error('Offer price should be close to asking price', {
        autoClose: 2000,
      });
    }
  };

  // method for submit messagesNominationOffer
  const messagesNominationOffer = (data: any, event?: React.BaseSyntheticEvent) => {
    setLoaderInProgress(true);
    let tenPrecFee = selectedStallion?.studFee - (selectedStallion?.studFee * 0.10);
    // console.log(tenPrecFee,'tenPrecFee');
    if (Number(offerPrice.replace(/\,/g, '')) >= tenPrecFee) {

      let postNominationData = {
        stallionId: selectedStallion?.stallionId,
        farmId: farmId,
        mareId: selectedMareName?.mareId || '',
        mareName: selectedMareName?.mareName || mareName,
        offerPrice: Number(offerPrice.replace(/\,/g, '')),
        currencyId: selectedStallion?.currencyId,
        cob: countryOfBirth,
        yob: yearBirth,
        channelId: selectedFarmHeader?.[0]?.channelId,
        fromMemberId: selectedFarmHeader?.[0]?.fromMemberUuid,
        message: nominationMessage,
        fullName: user?.fullName || '',
        email: user?.email || '',
        subject: selectedFarmHeader?.[0]?.subject,
      };
      postNominationRequest(postNominationData);
      onClose();
    } else {
      toast.error('Offer price should be close to asking price', {
        autoClose: 2000,
      });
    }
  };

  const goToTerms = () => {
    navigate(ROUTES.TERMS_AND_CONDITIONS);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
  }

  // get current local time
  const timeData = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');

  const addCommaInInput = (val: string) => {
    // console.log(val,'VALUE')
    if (!val) return '';
    return val?.replace(/\D/g, "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <StyledEngineProvider injectFirst>
      <Box className="nominationOffer-formBox" mt={2}>
        <Grid>
          <Box className="nominationOffer-details">
            {/* farm details */}
            <Stack>
              <Box className="msgs-farmlogo">
                <img
                  src={
                    selectedFarmHeader?.[0]?.farmImage
                      ? selectedFarmHeader?.[0]?.farmImage + '?h=96&w=144&fit=crop&ar=3:2'
                      : Images.farmplaceholder
                  }
                  alt={selectedFarmHeader?.[0]?.farmName}
                />
              </Box>
              <Box className="farm-culmn" my={3}>
                <Avatar
                  src={
                    userProfileData?.memberprofileimages
                      ? userProfileData?.memberprofileimages +
                      '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                      : Images.User
                  }
                  alt={user ? user?.fullName : ''}
                />
                <Stack direction="column" ml={2}>
                  <Typography variant="subtitle1">
                    From: {toPascalCase(user ? user?.fullName : '')}
                  </Typography>
                  <Typography component="span">
                    {user
                      ? (user?.memberaddress?.[0]?.stateName
                        ? user?.memberaddress?.[0]?.stateName
                        : '') +
                      (user?.memberaddress?.[0]?.stateName ? ',' : '') +
                      (user?.memberaddress?.[0]?.countryName
                        ? user?.memberaddress?.[0]?.countryName
                        : '')
                      : ''}
                    — Local time {timeData}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            {/* farm details end */}

            <Box mb={3}>
              <InputLabel>Select Stallion</InputLabel>
              <CustomSelect
                className="selectDropDownBox"
                fullWidth
                defaultValue={'none'}
                IconComponent={KeyboardArrowDownRoundedIcon}
                MenuProps={MenuProps}
                onChange={(e: any) => setSelectedStallion(e.target.value)}
              >
                <MenuItem className="selectDropDownList" value="none" disabled>
                  Select Stallion
                </MenuItem>
                {stallionsSelected?.map((stallion: any) => (
                  <MenuItem
                    className="selectDropDownList"
                    value={stallion}
                    key={stallion.stallionId}
                  >
                    {toPascalCase(stallion.stallionName)}
                  </MenuItem>
                ))}
              </CustomSelect>
              {selectedStallion === '' ||
                selectedStallion?.isPromoted === 0 ||
                selectedStallion?.isNominated === 0 ? (
                <Box className="sugges-text">
                  <Typography paragraph={true}>
                    The Farm is not currently accepting Nomination offers for this Stallion.
                  </Typography>
                </Box>
              ) : (
                ''
              )}
            </Box>

            <Box mb={3}>
              <InputLabel>Offer Price</InputLabel>
              <TextField
                fullWidth
                type="text"
                placeholder="Enter your offer price"
                value={addCommaInInput(offerPrice)}
                onChange={(e: any) => setOfferPrice(e.target.value)}
                disabled={
                  selectedStallion === null ||
                  selectedStallion?.isPromoted === 0 ||
                  selectedStallion?.isNominated === 0
                }
              />
              <p>{offerPrice === '' ? 'Offer Price is a required field' : ''}</p>
              {selectedStallion?.isPromoted === 1 ||
                (selectedStallion?.isNominated === 1 && (
                  <Box className="sugges-text">
                    <Typography paragraph={true}>
                      Offers for this Stallion should consider the asking price of {''}
                      {selectedStallion?.currencyCode?.substring(0, 2)} {selectedStallion?.currencySymbol}
                      {selectedStallion?.studFee.toLocaleString()} or they will not be considered.
                    </Typography>
                  </Box>
                ))}
            </Box>
            {selectedStallion?.studFee !== null && <Box className="sugges-text" mb={3}>
              <Typography paragraph={true}>
                Offers for this Stallion should consider the asking price of <br /> {selectedStallion?.currencyCode} {selectedStallion?.currencySymbol}{selectedStallion?.studFee.toLocaleString()} or they will not be considered.
              </Typography>
            </Box>}

            <Box mb={3} className='nominationMare'>
              <InputLabel>Mare Name</InputLabel>
              <Autocomplete
                // freeSolo
                disablePortal
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                options={pascalMareList || []}
                // noOptionsText={mareName != '' && null}
                noOptionsText={
                  mareName != '' &&
                  isClearMare === 0 && (
                    <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                      <span className="fw-bold sorry-message">
                        {isFetchingMare || isMareFakeLoading ? 'Loading...' : `Sorry, we couldn't find any matches for "${mareName}"`}
                      </span>
                      {!isMareFakeLoading && <Box className="submit-new-bg">
                        <Button
                          variant="text"
                          className="lr-btn lr-btn-outline"
                          color="primary"
                          type="button"
                          onClick={() => handleOpenCreateMareModal()}
                        >
                          Submit a new Mare
                        </Button>
                      </Box>}
                    </Box>
                  )
                }
                renderOption={(props, option: any) => (
                  // <React.Fragment key={option?.mareId}>
                  //   <li className={`${pascalMareList[pascalMareList?.length - 1]?.mareId === option?.mareId ? 'floting-btn' : 'hide'}`}>
                  //     <Box className="submit-new-bg">
                  //       <Button
                  //         variant="text"
                  //         className="lr-btn lr-btn-outline"
                  //         color="primary"
                  //         type="button"
                  //         onClick={() => handleOpenCreateMareModal()}
                  //       >
                  //         Submit a new Mare
                  //       </Button>
                  //     </Box>
                  //   </li>
                    <li className="searchstallionListBox" {...props}>
                      <Stack className="stallionListBoxHead">
                        {toPascalCase(option.mareName)} ({option.yob},{' '}
                        <span>{option.countryCode}</span>)
                      </Stack>
                      <Stack className="stallionListBoxpara">
                        <strong>X</strong>
                        <p style={{ marginBottom: '0px' }}>
                          {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                          <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                          {option.damYob}, <span>{option.damCountryCode}</span>)
                        </p>
                      </Stack>
                    </li>

                  // </React.Fragment>
                )}
                onInputChange={handleMareInput}
                getOptionLabel={(option: any) => option?.mareName}
                renderInput={(params) => <TextField {...params} placeholder={`Enter Mare Name`} />}
                // onChange={(e: any, selectedOptions: any) => {
                //   setMareName(selectedOptions);
                //   setCountryOfBirth(selectedOptions?.cob === 0 ? null : selectedOptions?.cob);
                //   setYearBirth(selectedOptions?.yob === 0 ? 1986 : selectedOptions?.yob);
                // }}
                onChange={(e: any, selectedOptions: any) => handleMareSelect(selectedOptions)}
                onBlur={() => handleMareOptionsReset(1)}
                className="mareBlockInput"
                disabled={
                  selectedStallion === null ||
                  selectedStallion?.isPromoted === 0 ||
                  selectedStallion?.isNominated === 0
                }
              />
              <p>{selectedMareName?.mareName === (null || '') ? 'Mare Name is a required field' : ''}</p>
            </Box>

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
                  disabled={
                    selectedStallion === null ||
                    selectedStallion?.isPromoted === 0 ||
                    selectedStallion?.isNominated === 0 ||
                    mareName?.mareId
                  }
                />
                <p>{countryOfBirth === '' ? 'Country of Birth is a required field' : ''}</p>
              </Box>
            )}

            {mareName?.mareId && (
              <Box mb={3}>
                <InputLabel>Country of Birth</InputLabel>
                <CustomSelect
                  className="selectDropDownBox"
                  fullWidth
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  MenuProps={MenuProps}
                  defaultValue={'none'}
                  value={mareName?.countryName ? mareName?.countryName : 'none'}
                  disabled={
                    selectedStallion === null ||
                    selectedStallion?.isPromoted === 0 ||
                    selectedStallion?.isNominated === 0 ||
                    mareName?.mareId
                  }
                >
                  <MenuItem
                    className="selectDropDownList"
                    value={mareName?.countryName}
                    key={mareName?.countryName}
                  >
                    {mareName?.countryName}
                  </MenuItem>
                </CustomSelect>
                <p>{countryOfBirth === '' ? 'Country of Birth is a required field' : ''}</p>
              </Box>
            )}

            <Box mb={3}>
              <InputLabel>Year of Birth</InputLabel>
              <CustomSelect
                className="selectDropDownBox"
                fullWidth
                IconComponent={KeyboardArrowDownRoundedIcon}
                MenuProps={MenuProps}
                defaultValue={'none'}
                value={yearBirth ? yearBirth : 'none'}
                onChange={(e: any) => setYearBirth(e.target.value)}
                disabled={
                  selectedStallion === null ||
                  selectedStallion?.isPromoted === 0 ||
                  selectedStallion?.isNominated === 0 ||
                  mareName?.mareId
                }
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
                {yearBirth && (
                  <MenuItem className="selectDropDownList" value={yearBirth} key={yearBirth}>
                    {yearBirth}
                  </MenuItem>
                )}
              </CustomSelect>
              <p>{yearBirth === '' ? 'Year of Birth is a required field' : ''}</p>
            </Box>

            <Box mb={2} className="localMessageClass">
              <InputLabel>Message</InputLabel>
              <TextareaAutosize
                className="nomination-messageBox"
                minRows={5}
                placeholder="Enter message"
                defaultValue={''}
                value={nominationMessage}
                onChange={(e: any) => setNominationMessage(e.target.value)}
                disabled={
                  selectedStallion === null ||
                  selectedStallion?.isPromoted === 0 ||
                  selectedStallion?.isNominated === 0
                }
              />
              <p>
                {nominationMessage?.trim().length === 0 && nominationMessage === ''
                  ? 'Message is a required field'
                  : ''}
              </p>
            </Box>

            <Box>
              <CustomButton
                onClick={
                  locationpath === 'messages' ? messagesNominationOffer : stallionNominationOffer
                }
                fullWidth
                className="lr-btn"
                disabled={!validateRequestNomonation()}
              >
                Send
              </CustomButton>
              <Box className="terms termsModal" mt={2}>
                By clicking Send you agree to our{' '}
                <a href={`/about/terms`} target="_blank" className="terms-btn">
                  Terms and Conditions
                </a>
                .
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
      {/* Popup modal for add either Stallion or Mare */}
      <WrapperDialog
        open={openCreateMareModal}
        title={'Submit a new Mare'}
        dialogClassName={'dialogPopup showBackIcon'}
        onClose={handleCloseCreateMareModal}
        isSubmitStallion={false}
        isSubmitMare={true}
        closeAddMare={''}
        body={CreateAStallion}
        className={'cookieClass'}
        createStallion="createStallion"
        sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
      />
    </StyledEngineProvider>
  );
}

export default NominationOfferForm;
