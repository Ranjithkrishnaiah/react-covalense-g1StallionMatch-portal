import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import * as Yup from 'yup';
import {
  RegisterSchema,
  RegisterObject,
  RegisterDetails,
  InvitedUserObject,
} from 'src/@types/registration';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import {
  InputLabel,
  MenuItem,
  FormControlLabel,
  FormControl,
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Autocomplete,
  // InputAdornment,
  StyledEngineProvider,
  Checkbox,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from '../components/CustomSelect';
import { ValidationConstants } from '../constants/ValidationConstants';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { api } from '../api/apiPaths';
import { States } from 'src/@types/states';
import { VoidFunctionType } from '../@types/typeUtils';
import { Icon } from '@iconify/react';

import './LRpopup.css';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useRegistrationMutation } from 'src/redux/splitEndpoints/registrationSplit';
import { useStatesQuery } from 'src/redux/splitEndpoints/statesSplit';
import { useCheckIfEmailAddressExistsQuery } from 'src/redux/splitEndpoints/getIfEmailAddressExists';
import { Images } from 'src/assets/images';
import useAuth from 'src/hooks/useAuth';
import { useVerifyUserInviteMutation } from 'src/redux/splitEndpoints/VerifyUserInviteSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import GoogleLoginForm from './GoogleLoginForm';

function Registration(
  title: string,
  onClose: VoidFunctionType,
  openOther: VoidFunctionType,
  changeTitleTo: React.Dispatch<React.SetStateAction<string>>,
  setIsFirstLogin: React.Dispatch<React.SetStateAction<boolean>>,
  setFarmAdminFirstLogin: React.Dispatch<React.SetStateAction<boolean>>,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  hash?: string,
  emailValue?: string,
  setEmailValue?: Dispatch<SetStateAction<string>>,
  isAgreed?: boolean,
  fullName?: string,
  InvitedEmail?: string
) {
  const ITEM_HEIGHT = 32;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        //   width: 166,
        //   minWidth: 166,
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

  const MenuPropss = {
    PaperProps: {
      style: {
        // maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
        // outerWidth:'236px',
        // width:'236px',
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        marginTop: '1px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  const openLogin = openOther;
  const close = onClose;
  const { pathname } = useLocation();
  const [farmCountryId, setFarmCountryId] = useState<any>();
  const [countryData, setCountryData] = useState<any>(null);
  const [farmCountry, setFarmCountry] = useState<any>(null);
  const { data: countriesList } = useCountriesQuery();
  const [emailData, setEmailData] = useState({ email: '' });
  const { data: statesListbyId, isSuccess: isStatesByIdSuccess } = useStatesQuery(farmCountryId, {
    skip: !Boolean(farmCountryId),
  });
  const [registration, registrationResponse] = useRegistrationMutation();

  let isInviteUser = pathname.includes('/invite-user') && !!hash;
  const { isSuccess, isError, error } = useCheckIfEmailAddressExistsQuery(emailData, {
    skip: !emailData.email,
  });

  const [change, setChange] = useState('none');
  const [verifyUserInvite, verifyUserInviteResponse] = useVerifyUserInviteMutation();
  const [passwordLengthError, setPasswordLengthError] = useState<boolean | null>(null);
  const [passwordAlphabetError, setPasswordAlphabetError] = useState<boolean | null>(null);
  const [passwordNumberError, setPasswordNumberError] = useState<boolean | null>(null);
  const [passwordMatchingError, setPasswordMatchingError] = useState<boolean | null>(null);
  const [states, setStates] = useState<States[] | undefined>([]);
  const [submissionError, setSubmissionError] = useState<any>();
  const [invitedUserEmail, setInvitedUserEmail] = useState(InvitedEmail || '');
  const [invitedUserName, setInvitedUserName] = useState(fullName || '');
  const [accountFullName, setAccountFullName] = useState('');
  const { authentication, setLogout } = useAuth();
  const [isAgreedFarms, setAgreedFarms] = React.useState<boolean>(false);

  // Open states drop based on country selection
  React.useEffect(() => {
    if (isStatesByIdSuccess) setStates(statesListbyId);
  }, [statesListbyId, isStatesByIdSuccess]);

  // Call the invite user api based on hash
  if (
    hash &&
    !verifyUserInviteResponse.data &&
    !verifyUserInviteResponse.isLoading &&
    !verifyUserInviteResponse.isError
  ) {
    verifyUserInvite({ hash });
  }

  // Based on invite user success save the fullname and email
  useEffect(() => {
    if (verifyUserInviteResponse.isSuccess) {
      setInvitedUserName(verifyUserInviteResponse.data?.fullName);
      setInvitedUserEmail(verifyUserInviteResponse.data?.email);
    }
  }, [verifyUserInviteResponse.isSuccess]);

  // Set the default email value
  useEffect(() => {
    if (isAgreed && emailValue) {
      reset({
        email: emailValue,
        addFarm: true,
      });
      setAgreedFarms(isAgreed);
    }
  }, [isAgreed, emailValue]);

  // Reset the form values
  useEffect(() => {
    return () => {
      setFarmCountryId('');
      setCountryData(null);
      setFarmCountry(null);
      reset();
    };
  }, [Reset]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');

  // Toggle passowrd field
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm passowrd field
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Registration form schema
  const registrationSchema = isInviteUser
    ? Yup.object().shape({
      countryId: Yup.string().required(ValidationConstants.countryValidation),
      // postal_code: Yup.string().required(ValidationConstants.countryValidation),
      // acceptTerms: Yup.string().required(ValidationConstants.acceptTerms),
      password: Yup.string().required(ValidationConstants.passwordValidation),
      confirmPassword: Yup.string()
        .required(ValidationConstants.confirmPasswordValidation)
        .oneOf([Yup.ref('password'), null], ValidationConstants.confirmPasswordMismatch),
    })
    : !isAgreedFarms
      ? Yup.object().shape({
        email: Yup.string().required(ValidationConstants.emailValidation),
        fullName: Yup.string()
          .required(ValidationConstants.fullNameValidation)
          .min(3, 'Name must be at least 3 characters.'),
        countryId: Yup.string().required(ValidationConstants.countryValidation),
        // postal_code: Yup.string().required(ValidationConstants.countryValidation),
        addFarm: Yup.bool().nullable(),
        password: Yup.string().required(ValidationConstants.passwordValidation),
        confirmPassword: Yup.string()
          .required(ValidationConstants.confirmPasswordValidation)
          .oneOf([Yup.ref('password'), null], ValidationConstants.confirmPasswordMismatch),
      })
      : Yup.object().shape({
        email: Yup.string().required(ValidationConstants.emailValidation),
        fullName: Yup.string()
          .required(ValidationConstants.fullNameValidation)
          .min(3, 'Name must be at least 3 characters.'),
        countryId: Yup.string().required(ValidationConstants.countryValidation),
        // postal_code: Yup.string().required(ValidationConstants.countryValidation),
        addFarm: Yup.bool().nullable(),
        farmName: Yup.string().when('addFarm', {
          is: true,
          then: Yup.string().required(ValidationConstants.farmNameValidation),
        }),
        farmCountryId: Yup.string().required(ValidationConstants.countryValidation),
        // Yup.string().when('addFarm', {
        //   is: true,
        //   then: Yup.string().required(ValidationConstants.countryValidation),
        // }),
        // farmStateId: Yup.string().when("addFarm",{ is:false, then: Yup.string().required(ValidationConstants.stateValidation) }),
        farmWebsiteUrl: Yup.string().when('addFarm', {
          is: true,
          then: Yup.string().notRequired(),
        }),
        // acceptTerms: Yup.string().required(ValidationConstants.acceptTerms),
        password: Yup.string().required(ValidationConstants.passwordValidation),
        confirmPassword: Yup.string()
          .required(ValidationConstants.confirmPasswordValidation)
          .oneOf([Yup.ref('password'), null], ValidationConstants.confirmPasswordMismatch),
      });

  // Form element
  const methods = useForm<RegisterSchema>({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      farmName: '',
      // postal_code: '',
      email: '',
      password: '',
      confirmPassword: '',
      farmWebsiteUrl: '',
      acceptTerms: false,
      addFarm: false,
    },
  });

  // Form parameters
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = methods;

  //Reset the form on closing of the popup
  if (Reset && setEmailValue) {
    setEmailValue('');
    setReset(false);
  }

  // Reset the form on success
  if (Reset === true) {
    reset();
    changeTitleTo('Create Account');
    setReset(false);
    setSubmissionError('');
    setPasswordLengthError(null);
    setPasswordAlphabetError(null);
    setPasswordNumberError(null);
    setPasswordMatchingError(null);
    setEmailData({ email: '' });
    setEmailError('');
    setAgreedFarms(authentication && emailValue !== undefined ? true : false);
  }
  const watchFarmCountry = watch('farmCountryId');
  const watchFarmWebsiteUrl = watch('farmWebsiteUrl');

  // Validate the form
  const validateuserDetails = () => {
    if (
      errors.fullName ||
      errors.countryId ||
      errors.email ||
      // errors.acceptTerms ||
      // (authentication && !isAgreedFarms) ||
      !isTermsAndPolicyChecked ||
      !watch('fullName') ||
      !watch('countryId') ||
      !watch('email') 
      // !watch('postal_code')
      // !watch('acceptTerms')
    )
      return false;

    return true;
  };

  // Validate Farm UserDetails
  const validateFarmUserDetails = () => {
    if (errors.countryId || !watch('countryId') || !isTermsAndPolicyChecked)
      // errors.acceptTerms || !watch('acceptTerms'
      return false;

    return true;
  };

  // validate Farm Form
  const validateFarm = () => {
    if (
      errors.farmName ||
      errors.farmCountryId ||
      // errors.farmWebsiteUrl ||
      !watch('farmName') ||
      !watchFarmCountry ||
      // !watch('farmWebsiteUrl') ||
      !isValidHttpUrl(watchFarmWebsiteUrl)
    )
      return false;
    if (states) {
      if (states.length > 0 && errors.farmStateId) return false;
    }

    return true;
  };

  // Validate url
  const isValidHttpUrl = (str: any) => {
    if (!str) {
      return true;
    }
    let test =
      /^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{2,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(str);
    return test;
  };

  // Show the success and error notification
  React.useEffect(() => {
    if (isSuccess) {
      setEmailError('');
    }
    if (!!error && 'data' in error) {
      // TypeScript will handle it as `FetchBaseQueryError` from now on.
      if (error?.status === 409) {
        setEmailError('Email already exists.');
      }

      if (error?.status === 422 && emailData.email.length >= 3) {
        setEmailError('Incorrect email address.');
      }
      setTimeout(() => {
        // setEmailError('');
        setEmailData({ email: '' });
      }, 2000);
    }
  }, [error, isError, isSuccess]);

  // Validate the passowrd and confirm passowrd
  const validatePassword = () => {
    const password = watch('password');
    const pLength = password?.length;
    setPasswordLengthError(false);
    setPasswordAlphabetError(false);
    setPasswordNumberError(false);
    setPasswordMatchingError(false);
    clearErrors('confirmPassword');
    if (pLength > 0) {
      const confirmPassword = watch('confirmPassword');
      const name = invitedUserName?.length > 0 ? invitedUserName : watch('fullName');
      const email = invitedUserEmail?.length > 0 ? invitedUserEmail : watch('email');
      const nameInArray = name?.split(' ');
      if (password?.length < 6) setPasswordLengthError(true);
      if (!password?.match(/[a-z]/gi)) setPasswordAlphabetError(true);
      if (!password?.match(/[0-9]/)) setPasswordNumberError(true);
      if (
        password?.toLowerCase().indexOf(nameInArray[0]?.toLowerCase()) >= 0 ||
        (nameInArray[1] && nameInArray[1]?.length > 1
          ? password?.toLowerCase().indexOf(nameInArray[1]?.toLowerCase()) >= 0
          : false) ||
        password?.toLowerCase().indexOf(email) >= 0
      )
        setPasswordMatchingError(true);
      if (password !== confirmPassword)
        watch('confirmPassword') !== '' &&
          setError('confirmPassword', { type: 'custom', message: "Password doesn't match" });
      if (
        errors.password ||
        errors.confirmPassword ||
        !watch('password') ||
        !watch('confirmPassword')
      )
        return false;
      return true;
    } else {
      setPasswordLengthError(true);
      setPasswordAlphabetError(true);
      setPasswordNumberError(true);
      setPasswordMatchingError(true);
    }
  };

  // change country state
  const handleChangeCountry = (e: any) => {
    setChange(e.target.value);
  };

  // check email validity
  const checkEmailValidity = (e: any) => {
    if (e.target.value.length === 0) setEmailError('This is a required field.');
    else setEmailData({ email: e.target.value });
  };

  // validate password and confirm passowrd
  const validateCreatePassword = () => {
    let pswd = watch('password');
    let cPswd = watch('confirmPassword');
    if (
      errors.password ||
      errors.confirmPassword ||
      !watch('password') ||
      !watch('confirmPassword') ||
      passwordLengthError ||
      passwordNumberError ||
      passwordAlphabetError ||
      passwordMatchingError ||
      !(pswd === cPswd)
    ) {
      return false;
    }
    return true;
  };

  // Open login popup
  const onHaveAccount = () => {
    close();
    reset();
    if (openLogin) openLogin();
  };

  if (watch('addFarm')) {
    setFarmAdminFirstLogin(true);
  } else {
    setFarmAdminFirstLogin(false);
  }

  // Submit Registration form
  const SubmitRegisteration: SubmitHandler<RegisterSchema> = async (
    data: RegisterSchema,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();

    let {
      fullName,
      countryId,
      email,
      password,
      addFarm,
      farmName,
      farmCountryId,
      farmStateId,
      farmWebsiteUrl,
      // postal_code
    } = data;

    if (!states || states.length === 0) {
      farmStateId = undefined;
    }

    const breederObj: RegisterObject = { fullName, countryId: Number(countryId), email, password,
      //  postcode: postal_code 
      };

    const farmOwnerObj: RegisterObject = {
      ...breederObj,
      farmName,
      farmCountryId: Number(farmCountryId),
      farmStateId: Number(farmStateId),
      farmWebsiteUrl,
    };

    const invitedUserObj: InvitedUserObject = {
      countryId: Number(countryId),
      password,
      // postcode: postal_code,
      hashKey: hash ? hash : '',
    };
    const finalBody = isInviteUser
      ? invitedUserObj
      : !isInviteUser && addFarm === true
        ? farmOwnerObj
        : breederObj;

    const postUrl = isInviteUser
      ? api.inviteFarmUserUrl
      : !isInviteUser && addFarm === true
        ? api.farmOwnerRegistrationUrl
        : api.breederRegisterationUrl;

    const inputParam: RegisterDetails = { finalBody, postUrl };
    try {
      const res = await registration(inputParam);
      const response: any = res;
      if (response.error) {
        if (response.error.status == 422) {
          setSubmissionError(Object.values(response?.error?.data?.errors));
        } else if (response.error.status > 499) {
          setSubmissionError(
            'Please check your internet connection, if its working fine, then its our server issue'
          );
        }
      } else {
        Success();
        reset();
      }
    } catch (error) {
      setSubmissionError(error);
    }
  };

  // Set farm country id
  useEffect(() => {
    if (watchFarmCountry !== undefined) {
      if (!isNaN(watchFarmCountry)) {
        setFarmCountryId(watchFarmCountry);
      }
    }
  }, [watchFarmCountry]);

  // Ope different popup based on conditions
  const PasswordSetup = () => {
    if (!isInviteUser && validateuserDetails()) {
      if (!!watch('addFarm')) {
        changeTitleTo('Add Farm');
      } else if (watch('addFarm') && watch('farmName') === null) {
        changeTitleTo('Create Password');
      } else {
        changeTitleTo('Create Password');
      }
    }
    if (isInviteUser && validateFarmUserDetails()) {
      changeTitleTo('Create Password');
    }
  };

  // Open create password popup
  const PasswordSetupFromFarm = () => {
    if (validateFarm()) {
      // AddFarmToActiveCampaign()
      changeTitleTo('Create Password');
    }
  };

  // On success reset the form element
  const Success = () => {
    setFarmAdminFirstLogin(isAgreedFarms);
    changeTitleTo('Create Account');
    setIsFirstLogin(true);
    close();
    openLogin();
    setFarmCountryId('');
    setCountryData(null);
    setFarmCountry(null);
    reset();
  };

  // Reset the full name
  useEffect(() => {
    if (Reset === false) {
      setAccountFullName('');
    }
  }, [Reset]);

  const [isTermsAndPolicyChecked, setIsTermsAndPolicyChecked] = React.useState<boolean>(false);

  // change TermsAndPolicy checkbox
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsAndPolicyChecked(event.target.checked);
  };

  // change IsAgreed checkbox
  const handleIsAgreedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if(setIsAgreed)setIsAgreed(event.target.checked);
    setAgreedFarms(event.target.checked);
  };

  // return the country and state value
  const returnCountryOrStateById = (type: string, id: any) => {
    let str: any;
    if (type === 'country') {
      if (countriesList?.length) {
        for (let index = 0; index < countriesList?.length; index++) {
          const element = countriesList[index];
          if (element?.id === id) {
            str = element?.countryName;
            break;
          }
        }
      } else {
        str = '';
      }
    }
    if (type === 'state') {
      if (statesListbyId?.length) {
        for (let index = 0; index < statesListbyId?.length; index++) {
          const element = statesListbyId[index];
          if (element?.id === id) {
            str = element?.stateName;
            break;
          }
        }
      } else {
        str = '';
      }
    }
    return str;
  };

  // under construction...
  const AddFarmToActiveCampaign = () => {
    const farmObj = {
      name: watch('farmName'),
      accountUrl: watch('farmWebsiteUrl'),
      owner: 1,
      fields: [
        {
          customFieldId: 7,
          fieldValue: returnCountryOrStateById('country', watch('farmCountryId')),
        },
        {
          customFieldId: 5,
          fieldValue: returnCountryOrStateById('state', watch('farmStateId')),
        },
      ],
    };
    let url = 'https://covalenseglobal12799.api-us1.com/api/3/accounts';
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        'Content-Length': '<calculated when request is sent>',
        Host: 'http://localhost:8080',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Api-Token': '198fdb222acf571b0e585c84baf96ea7d606e1913a925253542e8d48914e04a77e32d3a4',
      },
      body: JSON.stringify({ account: farmObj }),
    })
      .then((response) => console.log(response, 'RES BY CAMP'))
      .catch((err) => console.error(err, 'ERR RES BY CAMP'));
  };

  const containsSpecialChars = (str: any) => {
    const specialChars = /[`@#%^&\=\[\]{};:"\\|<>\/?~]/;
    return specialChars.test(str);
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        {/* Registration form */}
        <form
          onSubmit={handleSubmit(SubmitRegisteration)}
          autoComplete="false"
          className="inite-user-modal"
        >
          <Box className={title === 'Invitation Accepted' && isInviteUser ? 'show' : 'hide'}>
            <InputLabel className="inviteuser-para secondline-invite" sx={{ py: 5 }}>
              In order to complete your invitation you must complete your Stallion Match profile.
            </InputLabel>

            <Box pt={4}>
              <InputLabel>Country</InputLabel>
              <CustomSelect
                className="selectDropDownBox"
                fullWidth
                MenuProps={MenuProps}
                IconComponent={KeyboardArrowDownRoundedIcon}
                error={(watch('countryId') || 'k').toString().match('none') ? true : false}
                sx={{ height: '54px', mb: '1rem' }}
                defaultValue={'none'}
                {...register('countryId', { required: true })}
              >
                <MenuItem className="selectDropDownList disabled-state" value={'none'} disabled>
                  Select Country
                </MenuItem>
                {countriesList?.map(({ id, countryName }: { id: any; countryName: any }) => (
                  <MenuItem className="selectDropDownList" value={id} key={id}>
                    <Box className="mobile-dropdown-title">{countryName}</Box>
                  </MenuItem>
                ))}
              </CustomSelect>
              <p className="error-text">
                {(watch('countryId') || 'k').toString().match('none')
                  ? 'This is a required field.'
                  : ''}
              </p>
            </Box>
            {/* <Box pt={1}>
              <InputLabel>Zip Code</InputLabel>
              <TextField
                error={errors.postal_code?.message ? true : false}
                className={errors.postal_code?.message ? '' : ''}
                fullWidth
                type="text"
                autoComplete="new-password"
                {...register('postal_code', { required: true })}
                placeholder="Enter ZipCode"
              />
              <p className="error-text">
                {(watch('postal_code') || 'k').toString().match('none')
                  ? 'This is a required field.'
                  : ''}
              </p>
            </Box> */}

            <Box pb={3}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      disableRipple
                      className="isPrivateFee"
                      value={false}
                      {...register('acceptTerms')}
                      icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                      checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                      sx={{ marginRight: '0px' }}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={
                    <Box className="terms">
                      You agree to our&nbsp;
                      <a href={`/about/terms`} target="_blank" className="terms-btn">
                        Terms of Service
                      </a>
                      &nbsp;and&nbsp;
                      <a href={`/about/privacy-policy`} target="_blank" className="terms-btn">
                        Privacy Policy.
                      </a>
                    </Box>
                  }
                />
              </FormControl>
            </Box>
            <CustomButton
              sx={{ height: '48px', mt: '1rem' }}
              onClick={PasswordSetup}
              disabled={!validateFarmUserDetails()}
              fullWidth
              className="lr-btn"
            >
              {' '}
              Create Password
            </CustomButton>
          </Box>
          {title === 'Create Account' && (
            <Box className={title === 'Create Account' ? 'show' : 'hide'}>
              <Box mt={3} className="RegBoxWrapper">
                <Typography variant='h6'>
                  {/* A free membership is required to Request Nominations. Registration is quick and includes many additional benefits. */}
                </Typography>
                <GoogleLoginForm
                  title={'Sign Up using your Google Account.'}
                  closeAndReset={close}
                  setSubmissionError={setSubmissionError}
                />
                <p className="error-text">{submissionError}</p>
                <Box mb={3}>
                  <Divider>
                    <Typography variant="h6">Or</Typography>
                  </Divider>
                </Box>



                <InputLabel>Full Name</InputLabel>
                <TextField
                  error={errors.fullName?.message ? true : false}
                  className={errors.fullName?.message ? '' : ''}
                  fullWidth
                  type="text"
                  autoComplete="new-password"
                  defaultValue={isInviteUser ? fullName : undefined}
                  {...register('fullName', { required: true })}
                  placeholder="Enter Full Name"
                  value={accountFullName}
                  onChange={(e: any) => setAccountFullName(e.target.value)}
                />
                <p className="error-text">{errors.fullName?.message}</p>
              </Box>
              <Box>
                <InputLabel>Country</InputLabel>
                <Controller
                  name="countryId"
                  control={control}
                  // @ts-ignore
                  defaultValue={[]}
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    // @ts-ignore
                    <Autocomplete
                      {...field}
                      className={error?.message ? 'has-errors' : ''}
                      popupIcon={<KeyboardArrowDownRoundedIcon />}
                      disablePortal
                      sx={{ margin: '0px', padding: '0px' }}
                      getOptionLabel={(option: any) =>
                        `${!(option?.countryName?.split(' ')[0]?.length <= 2) &&
                          option?.countryName?.length > 3
                          ? toPascalCase(option?.countryName)?.toString()
                          : option?.countryName?.toString()
                        }`
                      }
                      id="controlled-demo"
                      onChange={(event: any, value: any) => {
                        setCountryData(value);
                        field.onChange(value?.id);
                      }}
                      value={countryData}
                      options={countriesList || []}
                      renderInput={(params: any) => (
                        <TextField
                          required
                          error={
                            (watch('countryId') || 'k').toString().match('none') ? true : false
                          }
                          helperText={error?.message}
                          placeholder={'Select Country'}
                          name="countryId"
                          inputRef={ref}
                          {...params}
                        />
                      )}
                      filterOptions={(option: any, state: any) => {
                        let optionList: any = [];
                        optionList = option?.filter((v: any) => {
                          let countryFullname = v?.countryName?.toLowerCase();
                          let searchCountryName = state?.inputValue?.toLowerCase();
                          if (countryFullname?.startsWith(searchCountryName)) {
                            return true;
                          }
                          return false;
                        });
                        return optionList;
                      }}
                    />
                  )}
                />
                <p className="error-text">
                  {(watch('countryId') || 'k').toString().match('none')
                    ? 'This is a required field.'
                    : ''}
                </p>
              </Box>
              {/* <Box>
                <InputLabel>Zip Code</InputLabel>
                <TextField
                  error={errors.postal_code?.message ? true : false}
                  className={errors.postal_code?.message ? '' : ''}
                  fullWidth
                  type="text"
                  autoComplete="new-password"
                  // defaultValue={isInviteUser ? postal_code : undefined}
                  {...register('postal_code', { required: true })}
                  placeholder="Enter ZipCode"
                // value={accountFullName}
                // onChange={(e: any) => setAccountFullName(e.target.value)}
                />
                <p className="error-text">{errors.postal_code?.message}</p>
              </Box> */}

              <Box mt={2} className="loginBoxWrapper">
                <InputLabel>Email Address</InputLabel>
                <TextField
                  error={errors.email?.message || emailError ? true : false}
                  className={errors.email?.message || emailError ? '' : ''}
                  fullWidth
                  type="text"
                  defaultValue={isInviteUser ? InvitedEmail : undefined}
                  autoComplete="new-password"
                  {...register('email', { required: true })}
                  placeholder="Enter Email Address"
                  onBlur={checkEmailValidity}
                />
                <p className="error-text">{emailError}</p>
              </Box>

              <Box className="reg-checkbox-wrpr" py={1}>
                <FormControl className="reg-checkbox">
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        className="isPrivateFee"
                        checked={isAgreedFarms}
                        value={true}
                        {...register('addFarm')}
                        onChange={handleIsAgreedChange}
                        checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                        icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                        sx={{ marginRight: '0px' }}
                      />
                    }
                    label={'I would like to add a farm/stallions to Stallion Match'}
                  />
                </FormControl>

                <FormControl className="reg-checkbox">
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        className="isPrivateFee"
                        value={false}
                        {...register('acceptTerms')}
                        checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                        icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                        sx={{ marginRight: '0px' }}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={
                      <Box className="terms">
                        You agree to our&nbsp;
                        <a href={`/about/terms`} target="_blank" className="terms-btn">
                          Terms of Service
                        </a>
                        &nbsp;and&nbsp;
                        <a href={`/about/privacy-policy`} target="_blank" className="terms-btn">
                          Privacy Policy.
                        </a>
                      </Box>
                    }
                  />
                </FormControl>
              </Box>
              <CustomButton
                sx={{ height: '48px', mt: '1rem' }}
                onClick={PasswordSetup}
                disabled={!validateuserDetails()}
                fullWidth
                className="lr-btn"
              >
                {' '}
                Create Account
              </CustomButton>

              <Typography className="signupac">
                Already have an account?
                <Button
                  variant="text"
                  sx={{ position: 'relative', top: '-4px', left: '0px' }}
                  className="terms-btn login-button-cr"
                  onClick={onHaveAccount}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          )}
          {title === 'Add Farm' && (
            <Box className={title === 'Add Farm' ? 'show' : 'hide'}>
              <Box py={3} className="createFarmPara">
                <Typography variant="h6">
                  Send us the below information regarding your farm and we will link your farm to
                  your account. You will receive confirmation when this is complete shortly.
                </Typography>
              </Box>

              <InputLabel>Farm</InputLabel>
              <TextField
                error={errors.farmName?.message ? true : false}
                fullWidth
                type="text"
                autoComplete="new-password"
                {...register('farmName', {
                  required: true,
                })}
                onChange={(e) => {
                  const value = e.target.value;
                  if (containsSpecialChars(value)) {
                    setError('farmName', {
                      type: 'custom',
                      message: `Only $-_.+!*'(), special characters allowed`,
                    });
                  } else {
                    clearErrors('farmName');
                  }
                }}
                placeholder="Enter Farm Name"
              />
              <p className="error-text">{errors.farmName?.message}</p>

              <InputLabel>Country</InputLabel>
              <Controller
                name="farmCountryId"
                control={control}
                // @ts-ignore
                defaultValue={''}
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  // @ts-ignore
                  <Autocomplete
                    {...field}
                    className={error?.message ? 'has-errors' : ''}
                    popupIcon={<KeyboardArrowDownRoundedIcon />}
                    disablePortal
                    sx={{ margin: '0px', padding: '0px' }}
                    getOptionLabel={(option: any) =>
                      `${!(option?.countryName?.split(' ')[0]?.length <= 2) &&
                        option?.countryName?.length > 3
                        ? toPascalCase(option?.countryName)?.toString()
                        : option?.countryName?.toString()
                      }`
                    }
                    id="controlled-demo"
                    onChange={(event: any, value: any) => {
                      setFarmCountry(value);
                      field.onChange(value?.id);
                    }}
                    value={farmCountry}
                    options={countriesList || []}
                    renderInput={(params: any) => (
                      <TextField
                        required
                        error={
                          (watch('farmCountryId') || 'k').toString().match('none') ? true : false
                        }
                        helperText={error?.message}
                        placeholder={'Select Country'}
                        name="farmCountryId"
                        inputRef={ref}
                        {...params}
                      />
                    )}
                    filterOptions={(option: any, state: any) => {
                      let optionList: any = [];
                      optionList = option?.filter((v: any) => {
                        let countryFullname = v?.countryName?.toLowerCase();
                        let searchCountryName = state?.inputValue?.toLowerCase();
                        if (countryFullname?.startsWith(searchCountryName)) {
                          return true;
                        }
                        return false;
                      });
                      return optionList;
                    }}
                  />
                )}
              />
              {farmCountryId && states && states.length > 0 && (
                <Box mt={2}>
                  <InputLabel>State</InputLabel>
                  <CustomSelect
                    fullWidth
                    sx={{ height: '58px', mb: '1.5rem' }}
                    error={(watch('farmStateId') || 'k').toString().match('none') ? true : false}
                    className="selectDropDownBox"
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    defaultValue={'none'}
                    {...register('farmStateId', { required: true })}
                    menuPosition="fixed"
                    MenuProps={{
                      keepMounted: true,
                      hideBackdrop: false,
                      disablePortal: true,
                      disableScrollLock: false,
                      getContentAnchorEl: null,
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                      },
                      ...MenuProps,
                    }}
                  >
                    <MenuItem className="selectDropDownList" value="none" disabled>
                      <em>Select State</em>
                    </MenuItem>
                    {states.length === 0 ? (
                      <MenuItem className="selectDropDownList" value={'none'} key={'none'}>
                        {null}
                      </MenuItem>
                    ) : (
                      states?.map(({ id, stateName, countryId }) => (
                        <MenuItem className="selectDropDownList" value={id} key={id}>
                          {stateName}
                        </MenuItem>
                      ))
                    )}
                  </CustomSelect>
                  <p className="error-text">
                    {(watch('farmStateId') || 'k').toString().match('none')
                      ? 'Farm State is a required field'
                      : ''}
                  </p>
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
                <p className="error-text">
                  {watchFarmWebsiteUrl && !isValidHttpUrl(watchFarmWebsiteUrl)
                    ? 'Please enter valid url!'
                    : errors.farmWebsiteUrl?.message && errors.farmWebsiteUrl?.message}
                </p>{' '}
              </Box>
              <CustomButton
                onClick={PasswordSetupFromFarm}
                disabled={!validateFarm()}
                fullWidth
                className="lr-btn"
              >
                {' '}
                Next{' '}
              </CustomButton>
            </Box>
          )}
          <Box className={title === 'Create Password' ? 'show' : 'hide'}>
            <Box className="pwdhints" py={4}>
              <Box sx={{ display: 'flex' }}>
                {passwordLengthError === true ? (
                  <i className="icon-Incorrect show" />
                ) : passwordLengthError === false ? (
                  <i className="icon-Confirmed-24px" />
                ) : (
                  ''
                )}
                Password must be at least 6 characters long.
              </Box>
              <Box sx={{ display: 'flex' }}>
                {passwordAlphabetError === true ? (
                  <i className="icon-Incorrect show" />
                ) : passwordAlphabetError === false ? (
                  <i className="icon-Confirmed-24px" />
                ) : (
                  ''
                )}
                Password must contain at least one letter.
              </Box>
              <Box sx={{ display: 'flex' }}>
                {passwordNumberError === true ? (
                  <i className="icon-Incorrect show" />
                ) : passwordNumberError === false ? (
                  <i className="icon-Confirmed-24px" />
                ) : (
                  ''
                )}
                Password must contain at least one number.
              </Box>
              <Box className="mustnotcontaine" sx={{ display: 'flex' }}>
                {passwordMatchingError === true ? (
                  <i className="icon-Incorrect show" />
                ) : passwordMatchingError === false ? (
                  <i className="icon-Confirmed-24px" />
                ) : (
                  ''
                )}
                Password must not contain your email, first name or last name.
              </Box>
            </Box>
            <InputLabel>Password</InputLabel>
            <TextField
              error={errors.password?.message ? true : false}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: '#1D472E', fontSize: '18px' }}
                  >
                    {' '}
                    {showPassword ? (
                      <Icon icon="ant-design:eye-outlined" />
                    ) : (
                      <Icon icon="ant-design:eye-invisible-outlined" />
                    )}
                  </IconButton>
                ),
              }}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password', {
                required: true,
                onChange(event) {
                  validatePassword();
                },
              })}
              placeholder="Enter Password"
            />
            <p className="error-text">{errors.password?.message}</p>
            <InputLabel>Confirm Password</InputLabel>
            <TextField
              error={errors.confirmPassword?.message ? true : false}
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: true,
                onChange(event) {
                  validatePassword();
                },
              })}
              placeholder="Enter Password"
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                    sx={{ color: '#1D472E', fontSize: '18px' }}
                  >
                    {' '}
                    {showConfirmPassword ? (
                      <Icon icon="ant-design:eye-outlined" />
                    ) : (
                      <Icon icon="ant-design:eye-invisible-outlined" />
                    )}
                  </IconButton>
                ),
              }}
            />
            <p className="error-text">{errors.confirmPassword?.message}</p>
            <CustomButton
              type="submit"
              disabled={!validateCreatePassword()}
              fullWidth
              className="lr-btn"
            >
              {' '}
              Create Account
            </CustomButton>
            <p className="error-text">{submissionError}</p>
          </Box>
        </form>
        {/* End Registration form */}
      </StyledEngineProvider>
    </>
  );
}

export default Registration;
