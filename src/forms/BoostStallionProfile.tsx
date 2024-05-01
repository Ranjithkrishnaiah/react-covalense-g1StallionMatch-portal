import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Typography,
  StyledEngineProvider,
  InputLabel,
  MenuItem,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  Autocomplete,
  Checkbox,
  MenuList,
} from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VoidFunctionType } from 'src/@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import { styled } from '@mui/material/styles';
import 'src/pages/notifications/notification.css';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { ValidationConstants } from 'src/constants/ValidationConstants';
import { useGetAllStallionsSplitQuery } from 'src/redux/splitEndpoints/getAllStallionsSplit';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useGetProductsDetailsBasedOnLocationQuery, useGetProductsSplitQuery } from 'src/redux/splitEndpoints/getProductsSplit';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  useAutosearchStallionUsersQuery,
  useMyDamSireSearchedQuery,
} from 'src/redux/splitEndpoints/searchStallionNamesSplit';
import {
  usePostBoostExtendedProfileMutation,
  usePostBoostLocalProfileMutation,
  usePostExtendedPotentialAudienceMutation,
} from 'src/redux/splitEndpoints/postBoostProfileSplit';
import { Images } from 'src/assets/images';
import { toPascalCase } from 'src/utils/customFunctions';
import CloseIcon from '@mui/icons-material/Close';
import Editor from 'src/components/editor';
import { useAutosearchFarmStallionsQuery } from 'src/redux/splitEndpoints/getFarmsStallionSplit';
import { toast } from 'react-toastify';
import { useGetConvertedCurrencyListMutation } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';

export interface LocalExtendedBoostSchemaType {
  localFullName?: string;
  selectStallionLocal?: string;
  termsPolicy?: boolean;
  extendedFullName?: string;
  selectStallionBoost?: string;
  userLocation?: string;
  damSireSearched?: string;
  trackMyFarms?: boolean;
  searchedMyFarms?: boolean;
  messageLocal?: string;
  messageExtended?: string;
}

export interface LocalBoostMessageType {
  blocks: [
    {
      key: string;
      text: string;
      type: string;
      depth: number;
      inlineStyleRanges: [];
      entityRanges: [];
      data: {};
    }
  ];
  entityMap: {};
}

export interface Products {
  categoryId: number;
  currencyId: number;
  id: number;
  price: number;
  productCode: string;
  productName: string;
  currencySymbol: string;
}

type Option = {
  stallionId: string;
  horseName: string;
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function BoostStallionProfile(
  onClose: VoidFunctionType,
  setBoostStallionDialogTitle: Dispatch<SetStateAction<string>>,
  boostStallionDialogTitle: string,
  boostStallionDialog: boolean,
  apiStatus: boolean,
  setApiStatus: any,
  apiStatusMsg: any,
  setApiStatusMsg: any
) {
  const params = {
    order: 'ASC',
    page: 1,
    limit: 20,
  };

  const [countryLists, setCountryLists] = useState<any>();
  const [productsLists, setProductsLists] = useState<Products[]>([]);
  const [triggerSatllionListsApi, setTriggerSatllionListsApi] = useState(false);
  const [stallionSelected, setStallionSelected] = useState<any>();
  const [localBoostFullName, setLocalBoostFullName] = useState(null);
  const [localBoostMessage, setLocalBoostMessage] = useState();
  const [extendedBoostFullName, setExtendedBoostFullName] = useState(null);
  const [damSireSearched, setDamSireSearched] = useState(null);
  const [extendedBoostMessage, setExtendedBoostMessage] = useState();
  const [trackFarms, setTrackFarms] = useState(false);
  const [searchedFarms, setSearchedFarms] = useState(false);
  const [termsPolicy, setTermsPolicy] = useState();
  const [potentialAudienceCount, setPotentialAudienceCount] = useState(null);

  // reset form with initial values
  useEffect(() => {
    if (boostStallionDialog === false) {
      InitialValues();
    }
  }, [boostStallionDialog]);

  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  // API call for getting countries lists
  const { data: responseCountryList } = useCountriesQuery();
  // API call for getting products lists
  const { data: responseProducts } = useGetProductsSplitQuery(params, {
    skip: !boostStallionDialog,
  });
  // API call for getting stallion names lists
  const { data: stallionNamesList } = useAutosearchStallionUsersQuery(null, {
    skip: !boostStallionDialog,
  });
  // API call for submit local boost
  const [postBoostLocalProfile, isSuccessLocal] = usePostBoostLocalProfileMutation();
  // API call for submit extended boost
  const [postBoostExtendedProfile, isSuccessExtended] = usePostBoostExtendedProfileMutation();
  // API call for getting Potential Audience count
  const [postExtendedPotentialAudience, isSuccessPotentialAudience] =
    usePostExtendedPotentialAudienceMutation();

  const [myStallionSelected, setMyStallionSelected] = useState<any>();
  // API call for getting stallion names lists
  const { data: myStallionNamesList } = useAutosearchFarmStallionsQuery(null, {
    skip: !boostStallionDialog,
  });

  const [countrySelected, setCountrySelected] = useState<any>();

  const { data: countryData } = useCountriesQuery();
  // API call for getting DamSire Searched lists
  const { data: myDamSireSearchedList } = useMyDamSireSearchedQuery(null, {
    skip: !boostStallionDialog,
  });

  const [myDamSireSelected, setMyDamSireSelected] = useState<any>();

  const { data: boostLocalProductData } = useGetProductsDetailsBasedOnLocationQuery('BOOST_LOCAL');
  const { data: boostExtendedProductData } = useGetProductsDetailsBasedOnLocationQuery('BOOST_EXTENDED');

  const [getConvertedCurrencyList, getConvertedCurrencyListResponse] = useGetConvertedCurrencyListMutation();

  // set countries list
  useEffect(() => {
    setCountryLists(responseCountryList);
  }, [responseCountryList]);

  // set products list
  useEffect(() => {
    setProductsLists(responseProducts);
  }, [responseProducts]);

  const [confirmExtendedBoost, setConfirmExtendedBoost] = useState(false);
  const [localBoostClicked, setLocalBoostClicked] = useState(false);

  // handle click next button in local boost
  const localBoostClickHandler = () => {
    setBoostStallionDialogTitle('Local Boost Details');
    setTriggerSatllionListsApi(true);
    setLocalBoostClicked(true);
  };

  // handle click next button in extended boost
  const extendedBoostClickHandler = () => {
    setBoostStallionDialogTitle('Extended Boost Details');
    setTriggerSatllionListsApi(true);
  };

  // handle click back button in local boost
  const localBoostBackHandler = () => {
    setBoostStallionDialogTitle('Boost Stallion Profile');
    reset();
  };

  // handle click back button in extended boost
  const extendedBoostBackHandler = () => {
    setBoostStallionDialogTitle('Boost Stallion Profile');
    reset();
  };

  const navigate = useNavigate();

  // local boost form schema
  const LocalExtendedBoostSchema = localBoostClicked
    ? Yup.object().shape({
      localFullName: Yup.string().required(ValidationConstants.fullNameValidation),
      messageLocal: Yup.string().required('Message is a required field'),
      termsPolicy: Yup.string().required(ValidationConstants.acceptTerms),
    })
    : Yup.object().shape({
      termsPolicy: Yup.string().required(ValidationConstants.acceptTerms),
      extendedFullName: Yup.string().required(ValidationConstants.fullNameValidation),
      damSireSearched: Yup.string().required('Dam Sire is a required field'),
      trackMyFarms: Yup.string().required('Track My Farms is a required field'),
      searchedMyFarms: Yup.string().required('Searched My Farms is a required field'),
      messageExtended: Yup.string().required('Message is a required field'),
    });

  const methods = useForm<LocalExtendedBoostSchemaType>({
    resolver: yupResolver(LocalExtendedBoostSchema),
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

  // initial values
  const InitialValues = () => {
    setLocalBoostFullName(null);
    setLocalBoostMessage(undefined);
    setStallionSelected(undefined);
    setMyStallionSelected(undefined);
    setCountrySelected(undefined);
    setMyDamSireSelected(undefined);
    setTermsPolicy(undefined);
    setExtendedBoostFullName(null);
    setExtendedBoostMessage(undefined);
    setDamSireSearched(null);
    setTrackFarms(false);
    setSearchedFarms(false);
    setConfirmExtendedBoost(false);
  };

  //set message text box to initial state
  useEffect(() => {
    if (localBoostMessage === '<p><br></p>' && boostStallionDialog === false) {
      setLocalBoostMessage(undefined);
    }
    if (extendedBoostMessage === '<p><br></p>' && boostStallionDialog === false) {
      setExtendedBoostMessage(undefined);
    }
  }, [localBoostMessage, boostStallionDialog, extendedBoostMessage]);

  // validation for localboost
  const validateLocalBoost = () => {
    if (
      localBoostFullName === null ||
      localBoostFullName === '' ||
      localBoostMessage === undefined ||
      localBoostMessage === '' ||
      localBoostMessage === '<p><br></p>' ||
      stallionSelected === undefined ||
      stallionSelected?.length === 0
    )
      return false;
    return true;
  };

  // validation for Extendedboost
  const validateExtendedBoost = () => {
    if (
      extendedBoostFullName === null ||
      extendedBoostFullName === '' ||
      myStallionSelected === undefined ||
      myStallionSelected?.length === 0 ||
      countrySelected === undefined ||
      countrySelected?.length === 0 ||
      extendedBoostMessage === undefined ||
      extendedBoostMessage === '' ||
      extendedBoostMessage === '<p><br></p>' ||
      (trackFarms == false && searchedFarms == false)
    )
      return false;
    return true;
  };

  // validate terms policy
  const validateBoostConfirm = () => {
    if (termsPolicy === undefined) return false;
    return true;
  };

  let stallionIds = stallionSelected?.map((el: any) => el?.stallionId);
  let myStallionIds = myStallionSelected?.map((el: any) => el?.stallionId);
  let countrySelectedIds = countrySelected?.map((el: any) => el?.id);
  let myDamSireSelectedIds = myDamSireSelected?.map((el: any) => el?.damsireId);

  // next button handle for title change in local boost
  const localBoostNextHandler = (data: any, event?: React.BaseSyntheticEvent) => {
    setBoostStallionDialogTitle('Are You Sure?');
  };

  // next button handle for title change in extended boost
  const extendedBoostNextHandler = (data: any, event?: React.BaseSyntheticEvent) => {
    setBoostStallionDialogTitle('Are You Sure?');
    setConfirmExtendedBoost(true);

    const potentialAudienceData = {
      stallions: myStallionIds,
      locations: countrySelectedIds,
      damSireSearchedUsers: myDamSireSelectedIds || [],
      message: extendedBoostMessage,
      isTracked: trackFarms,
      isSearched: searchedFarms,
    };
    postExtendedPotentialAudience(potentialAudienceData).then((res: any) => {
      setPotentialAudienceCount(res?.data?.totalUsersCount);
    });
  };

  const callConversionCurrencyId = () => {
    const user = JSON.parse(window.localStorage.getItem("user") || '{}');
    let userCountryCode = user?.memberaddress[0]?.currencyCode;

    let userCurrencyId: any = null;
    for (let index = 0; index < currencies?.length; index++) {
      const element = currencies[index];
      if (element?.label === userCountryCode) {
        userCurrencyId = element?.id;
        break;
      }
    }
    return userCurrencyId;
  }

  // function for submit boost
  const submitBoost = async (data: any, event?: React.BaseSyntheticEvent) => {
    if (confirmExtendedBoost) {
      const postExtendedBoostData = {
        fullName: extendedBoostFullName,
        currencyId: boostExtendedProductData?.[0]?.currencyId,
        stallions: myStallionIds,
        locations: countrySelectedIds,
        damSireSearchedUsers: myDamSireSelectedIds || [],
        message: extendedBoostMessage,
        isTracked: trackFarms,
        isSearched: searchedFarms,
        cartId: '',
      };
      await postBoostExtendedProfile(postExtendedBoostData).then((res: any) => {
        
      });
    } else {
      const postLocalBoostData = {
        fullName: localBoostFullName,
        currencyId: boostLocalProductData?.[0]?.currencyId,
        stallions: stallionIds,
        message: localBoostMessage,
        cartId: '',
      };
      await postBoostLocalProfile(postLocalBoostData).then((res: any) => {
        // console.log(res,'RESPONSE');
      });
    }
    onClose();
  };

  // Call currency conversion for local boost
  useEffect(() => {
    if (isSuccessLocal.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      // console.log(userCurrencyId, 'userCurrencyId');
      if (userCurrencyId) {
        if (boostLocalProductData?.[0]?.currencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': isSuccessLocal?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [isSuccessLocal.isSuccess])

  // Success message
  useEffect(() => {
    if (isSuccessLocal.isSuccess) {
      toast.success('Your Boost Campaign is Successfull.', {
        autoClose: 2000,
      });
    }
  }, [isSuccessLocal.isSuccess])

  // Error message
  useEffect(() => {
    if (isSuccessLocal.isError) {
      toast.error('There Was a Problem With Your Boost Campaign.', {
        autoClose: 2000,
      });
    }
  }, [isSuccessLocal.isError])

  // Call currency conversion for extended boost
  useEffect(() => {
    if (isSuccessExtended.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      // console.log(userCurrencyId, 'userCurrencyId');
      if (userCurrencyId) {
        if (boostExtendedProductData?.[0]?.currencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': isSuccessExtended?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [isSuccessExtended.isSuccess])

  // Success message
  useEffect(() => {
    if (isSuccessExtended.isSuccess) {
      toast.success('Your Boost Campaign is Successfull.', {
        autoClose: 2000,
      });
    }
  }, [isSuccessExtended.isSuccess])

  // Error message
  useEffect(() => {
    if (isSuccessExtended.isError) {
      toast.error('There Was a Problem With Your Boost Campaign.', {
        autoClose: 2000,
      });
    }
  }, [isSuccessExtended.isError])

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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '2px',
        marginTop: '5px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  return (
    <StyledEngineProvider injectFirst>
      {/* first screen in popup */}
      <Box
        className={boostStallionDialogTitle === 'Boost Stallion Profile' ? 'show showBg' : 'hide'}
      >
        <Grid container className="boost-profile">
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-left ">
            <Box className="local-boost local-left">
              <Typography variant="h3">Local Boost</Typography>
              <Typography variant="h6">
                Blast out a group message to all breeders who have contacted your farm within the
                last 12 months. Perfect for stallion announcements, fee adjustments, etc at a
                competitive price.
              </Typography>
              {/* {productsLists?.map((product: Products) => {
                if (product.productCode === 'BOOST_LOCAL') {
                  return ( */}
              <Typography variant="h6" className="localBoostPrice">
                {boostLocalProductData ? boostLocalProductData?.[0]?.currencySymbol : ''}
                {boostLocalProductData ? Number(boostLocalProductData?.[0].price).toFixed(2) : ''}/stallion
              </Typography>
              {/* );
                }
              })} */}
              <CustomButton className="homeSignup" disableRipple onClick={localBoostClickHandler}>
                Boost Now
              </CustomButton>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-right">
            <Box className="local-boost">
              <Typography variant="h3">Extended Boost</Typography>
              <Typography variant="h6">
                Leverage our extended reach of registered users for your announcement and target
                warm leads based on location, search history, tracked horses and more.
              </Typography>
              {/* {productsLists?.map((product: Products) => {
                if (product.productCode === 'BOOST_EXTENDED') {
                  return ( */}
              <Typography variant="h6" className="localBoostPrice">
                {boostExtendedProductData ? boostExtendedProductData?.[0]?.currencySymbol : ''}
                {boostExtendedProductData ? Number(boostExtendedProductData?.[0].price).toFixed(2) : ''}/stallion
                {/* {product.currencySymbol}
                {Number(product.price).toFixed(2)}/stallion */}
              </Typography>
              {/* );
                }
              })} */}
              <CustomButton
                className="homeSignup"
                disableRipple
                onClick={extendedBoostClickHandler}
              >
                Boost Now
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* first screen in popup end */}

      {/* second screen for local boost in popup */}
      <Box className={boostStallionDialogTitle === 'Local Boost Details' ? 'show hideBg' : 'hide'}>
        <Grid container>
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-left">
            <Box className="local-boost-details">
              <Box mb={2} sx={{ pr: { lg: '3rem', sm: '3rem', xs: '0' } }}>
                <InputLabel>Full Name</InputLabel>
                <TextField
                  fullWidth
                  type="text"
                  placeholder="Enter Full Name"
                  value={localBoostFullName}
                  onChange={(e: any) => setLocalBoostFullName(e.target.value)}
                />
                <p className="error-text">
                  {localBoostFullName === '' ? 'Fullname is a required field' : ''}
                </p>
              </Box>
              <Box mb={2} sx={{ pr: { lg: '3rem', sm: '3rem', xs: '0' } }}>
                <InputLabel>Select Stallion(s)</InputLabel>
                <Autocomplete
                  ChipProps={{ deleteIcon: <CloseIcon /> }}
                  disablePortal
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  options={stallionNamesList || []}
                  multiple
                  disableCloseOnSelect
                  getOptionLabel={(option: any) =>
                    `${toPascalCase(option?.stallionName)?.toString()}`
                  }
                  renderOption={(props, option: any, { selected }) => (
                    <MenuList sx={{ boxShadow: 'none' }}>
                      <MenuItem {...props} disableRipple className="LocationFilter">
                        <span
                          style={{
                            width: '100%',
                            whiteSpace: 'break-spaces',
                          }}
                        >
                          {toPascalCase(option?.stallionName)}
                        </span>
                        <Checkbox
                          checkedIcon={<img src={Images.checked} alt="checkbox" />}
                          icon={<img src={Images.unchecked} alt="checkbox" />}
                          checked={selected}
                          disableRipple
                        />
                      </MenuItem>
                    </MenuList>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={stallionSelected?.length ? '' : `Select Stallion`}
                    />
                  )}
                  onChange={(e: any, selectedOptions: any) => setStallionSelected(selectedOptions)}
                  className="mareBlockInput"
                />
                <p className="error-text">
                  {stallionSelected?.length === 0 ? 'Stallion is a required field' : ''}
                </p>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-right">
            <Box className="local-boost-details localMessageClass">
              <InputLabel>Message</InputLabel>
              <Editor
                className="Editor-Block"
                id="messageLocal"
                placeholder="Enter message"
                value={localBoostMessage}
                onChange={(e: any) => setLocalBoostMessage(e)}
              />
              <p className="error-text">
                {localBoostMessage === '' || localBoostMessage === '<p><br></p>'
                  ? 'Message is a required field'
                  : ''}
              </p>

              <Box className="local-boost-btns">
                <CustomButton
                  className="next"
                  onClick={localBoostNextHandler}
                  disabled={!validateLocalBoost()}
                >
                  Next
                </CustomButton>
                <CustomButton className="back" ml={3} onClick={localBoostBackHandler}>
                  Back
                </CustomButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* second screen for local boost in popup end */}

      {/* second screen for extended boost in popup */}
      <Box
        className={boostStallionDialogTitle === 'Extended Boost Details' ? 'show hideBg' : 'hide'}
      >
        <Grid container>
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-left">
            <Box className="local-boost-details">
              <Box mb={1} sx={{ pr: { lg: '3rem', sm: '3rem', xs: '0' } }}>
                <InputLabel>Full Name</InputLabel>
                <TextField
                  fullWidth
                  type="text"
                  placeholder="Enter Full Name"
                  value={extendedBoostFullName}
                  onChange={(e: any) => setExtendedBoostFullName(e.target.value)}
                />
                <p className="error-text">
                  {extendedBoostFullName === '' ? 'Fullname is a required field' : ''}
                </p>
              </Box>
              <Box mb={1} sx={{ pr: { lg: '3rem', sm: '3rem', xs: '0' } }}>
                <InputLabel>Select Stallion(s)</InputLabel>
                <Autocomplete
                  ChipProps={{ deleteIcon: <CloseIcon /> }}
                  disablePortal
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  options={myStallionNamesList || []}
                  multiple
                  disableCloseOnSelect
                  getOptionLabel={(option: any) =>
                    `${toPascalCase(option?.stallionName)?.toString()}`
                  }
                  renderOption={(props, option: any, { selected }) => (
                    <MenuList
                      className="LocationList"
                      sx={{ boxShadow: 'none' }}
                      key={option?.stallionId}
                    >
                      <MenuItem {...props} disableRipple className="LocationFilter">
                        <span
                          style={{
                            width: '100%',
                            whiteSpace: 'break-spaces',
                          }}
                        >
                          {toPascalCase(option?.stallionName)}
                        </span>
                        <Checkbox
                          checkedIcon={<img src={Images.checked} alt="checkbox" />}
                          icon={<img src={Images.unchecked} alt="checkbox" />}
                          checked={selected}
                          disableRipple
                        />
                      </MenuItem>
                    </MenuList>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={myStallionSelected?.length ? '' : `Select Stallion`}
                    />
                  )}
                  onChange={(e: any, selectedOptions: any) =>
                    setMyStallionSelected(selectedOptions)
                  }
                  className="mareBlockInput"
                />
                <p className="error-text">
                  {myStallionSelected?.length === 0 ? 'Stallion is a required field' : ''}
                </p>
              </Box>
              <Box mb={1} sx={{ pr: { lg: '3rem', sm: '3rem', xs: '0' } }}>
                <InputLabel>User Location(s)</InputLabel>
                <Autocomplete
                  ChipProps={{ deleteIcon: <CloseIcon /> }}
                  disablePortal
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  options={countryData || []}
                  multiple
                  disableCloseOnSelect
                  getOptionLabel={(option: any) => option?.countryName}
                  renderOption={(props, option: any, { selected }) => (
                    <MenuList
                      className="LocationList"
                      sx={{ boxShadow: 'none' }}
                      key={option?.countryId}
                    >
                      <MenuItem {...props} disableRipple className="LocationFilter">
                        <span
                          style={{
                            width: '100%',
                            whiteSpace: 'break-spaces',
                          }}
                        >
                          {toPascalCase(option?.countryName)}
                        </span>
                        <Checkbox
                          checkedIcon={<img src={Images.checked} alt="checkbox" />}
                          icon={<img src={Images.unchecked} alt="checkbox" />}
                          checked={selected}
                          disableRipple
                        />
                      </MenuItem>
                    </MenuList>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={countrySelected?.length ? '' : `Select Location`}
                    />
                  )}
                  onChange={(e: any, selectedOptions: any) => setCountrySelected(selectedOptions)}
                  className="mareBlockInput"
                />
                <p className="error-text">
                  {countrySelected?.length === 0 ? 'User Location is a required field' : ''}
                </p>
              </Box>
              <Box mb={1} sx={{ pr: { lg: '3rem', sm: '3rem', xs: '0' } }}>
                <InputLabel>
                  User’s Dam Sire searched
                  <HtmlTooltip
                    enterTouchDelay={0}
                    leaveTouchDelay={6000}
                    className="CommonTooltip studfee-tooltip"
                    PopperProps={{
                      placement: 'bottom-start',
                    }}
                    title={
                      <React.Fragment>
                        {
                          'Select the Dam Sire list from the drop-down based on the Mares that have been searched on Stallion Match'
                        }
                      </React.Fragment>
                    }
                  >
                    <i className="icon-Info-circle" />
                  </HtmlTooltip>
                </InputLabel>
                <Autocomplete
                  ChipProps={{ deleteIcon: <CloseIcon /> }}
                  disablePortal
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  options={myDamSireSearchedList || []}
                  multiple
                  disableCloseOnSelect
                  getOptionLabel={(option: any) =>
                    `${toPascalCase(option?.damsireName)?.toString()}`
                  }
                  renderOption={(props, option: any, { selected }) => (
                    <MenuList
                      className="LocationList"
                      sx={{ boxShadow: 'none' }}
                      key={option?.damsireId}
                    >
                      <MenuItem {...props} disableRipple className="LocationFilter">
                        <span
                          style={{
                            width: '100%',
                            whiteSpace: 'break-spaces',
                          }}
                        >
                          {toPascalCase(option?.damsireName)}
                        </span>
                        <Checkbox
                          checkedIcon={<img src={Images.checked} alt="checkbox" />}
                          icon={<img src={Images.unchecked} alt="checkbox" />}
                          checked={selected}
                          disableRipple
                        />
                      </MenuItem>
                    </MenuList>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={myDamSireSelected?.length ? '' : `Select Stallion`}
                    />
                  )}
                  onChange={(e: any, selectedOptions: any) => setMyDamSireSelected(selectedOptions)}
                  className="mareBlockInput"
                />
              </Box>
              <Box className="Boost-radio-btns">
                <FormControl>
                  <FormControlLabel
                    value={'true'}
                    control={
                      <Radio
                        checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                        icon={<img src={Images.RadiouncheckedDark} alt="checkbox" />}
                      />
                    }
                    title="Tracking my farms stallion(s)"
                    label={'Tracking my farms stallion(s)'}
                    key={'Tracking my farms stallion(s)'}
                    onChange={(e: any) => {
                      setTrackFarms(true);
                      setSearchedFarms(false);
                    }}
                    checked={trackFarms}
                  />
                </FormControl>

                <HtmlTooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={6000}
                  className="CommonTooltip studfee-tooltip notification-tooltip"
                  placement="bottom"
                  title={
                    <React.Fragment>
                      {
                        'Tracking means that the front-end user has added the Stallion to their Favorites'
                      }
                    </React.Fragment>
                  }
                >
                  <i className="icon-Info-circle" />
                </HtmlTooltip>
              </Box>
              <Box className="Boost-radio-btns">
                <FormControl>
                  <FormControlLabel
                    value={'true'}
                    control={
                      <Radio
                        checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                        icon={<img src={Images.RadiouncheckedDark} alt="checkbox" />}
                      />
                    }
                    title="Searched my farm’s stallion(s) within the past 12 months"
                    label={'Searched my farm’s stallion(s) within the past 12 months'}
                    key={'Searched my farm’s stallion(s) within the past 12 months'}
                    onChange={(e: any) => {
                      setSearchedFarms(true);
                      setTrackFarms(false);
                    }}
                    checked={searchedFarms}
                  />
                </FormControl>

                <HtmlTooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={6000}
                  className="CommonTooltip studfee-tooltip notification-tooltip"
                  placement="bottom"
                  title={
                    <React.Fragment>
                      {
                        'This is putting together a list of users that have searched that specific stallion'
                      }
                    </React.Fragment>
                  }
                >
                  <i className="icon-Info-circle" />
                </HtmlTooltip>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-right">
            <Box className="local-boost-details">
              <InputLabel>Message</InputLabel>

              <Editor
                className="Editor-Block"
                id="messageExtended"
                placeholder="Enter message"
                value={extendedBoostMessage}
                onChange={(e: any) => setExtendedBoostMessage(e)}
              />
              <p className="error-text">
                {extendedBoostMessage === '' || extendedBoostMessage === '<p><br></p>'
                  ? 'Message is a required field'
                  : ''}
              </p>

              <Box className="local-boost-btns">
                <CustomButton
                  className="next"
                  onClick={extendedBoostNextHandler}
                  disabled={!validateExtendedBoost()}
                >
                  Next
                </CustomButton>
                <CustomButton className="back" ml={3} onClick={extendedBoostBackHandler}>
                  Back
                </CustomButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* second screen for extended boost in popup end */}

      {/* last screen for popup */}
      <Box className={boostStallionDialogTitle === 'Are You Sure?' ? 'show showBg' : 'hide'}>
        <Grid container>
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-left">
            <Box className="local-boost">
              <Box mb={3}>
                <Typography variant="h3">
                  {confirmExtendedBoost === false ? 'Local Boost' : 'Extended Boost'}
                </Typography>
                <Typography variant="h6">
                  {confirmExtendedBoost === false
                    ? `You message and it’s attachments will be sent to every registered user who has
                    searched your selected stallions directly to their inbox. They will be notified
                    via email and the app when it arrives.`
                    : `You message and it’s attachments will be sent to your defined user group
                      directly to their inbox. They will be notified via email and the app when it
                      arrives.`}
                </Typography>
              </Box>
              <Box className="Boost-radio-btns">
                <FormControl>
                  <Box sx={{ display: '-webkit-box' }}>
                    <Box>
                      <FormControlLabel
                        value={'true'}
                        control={
                          <Radio
                            checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                            icon={<img src={Images.RadiouncheckedDark} alt="checkbox" />}
                          />
                        }
                        label={``}
                        className="SDradio"
                        sx={{ marginRight: '0px' }}
                        onChange={(e: any) => setTermsPolicy(e.target.value)}
                        checked={termsPolicy === 'true'}
                      />
                    </Box>
                    <Box className="terms">
                      You agree to our&nbsp;
                      <a href={`/about/terms`} target="_blank" className="terms-btn">
                        Terms of Service
                      </a>
                      &nbsp;and&nbsp;
                      <a href={`/about/privacy-policy`} target="_blank" className="terms-btn">
                        Privacy Policy
                      </a>
                    </Box>
                  </Box>
                </FormControl>
                <p className="error-text">{errors.termsPolicy?.message}</p>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} className="boost-profile-right">
            <Box className="local-boost extended-boost">
              {confirmExtendedBoost === true && (
                <Typography variant="h2" className="extended-boostPrice">
                  {potentialAudienceCount}
                </Typography>
              )}
              {confirmExtendedBoost === true && (
                <Typography variant="h6">Potential audience</Typography>
              )}

              {(confirmExtendedBoost === false) ?

                <Typography variant="h6" className="localBoostPrice">
                  {boostLocalProductData ? boostLocalProductData?.[0]?.currencySymbol : ''}
                  {boostLocalProductData ? Number(boostLocalProductData?.[0].price * stallionIds?.length).toFixed(2) : ''}
                  {/* {product.currencySymbol}
                  {Number(product.price * stallionIds?.length).toFixed(2)} */}
                </Typography>

                :
                <Typography variant="h5" className="localBoostPrice">
                  {boostExtendedProductData ? boostExtendedProductData?.[0]?.currencySymbol : ''}
                  {boostExtendedProductData ? Number(boostExtendedProductData?.[0].price * myStallionIds?.length).toFixed(2) : ''}
                  {/* {product.currencySymbol}
                  {Number(product.price * myStallionIds?.length).toFixed(2)} */}
                </Typography>
              }

              <CustomButton
                disableRipple
                className="homeSignup"
                disabled={!validateBoostConfirm()}
                onClick={submitBoost}
              >
                Boost Now
              </CustomButton>
            </Box>
            {/* last screen for popup end */}
          </Grid>
        </Grid>
      </Box>
    </StyledEngineProvider>
  );
}

export default BoostStallionProfile;
