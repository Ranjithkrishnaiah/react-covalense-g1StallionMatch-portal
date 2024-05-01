import {
  Box,
  Container,
  Grid,
  Stack,
  StyledEngineProvider,
  Typography,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import { Images } from 'src/assets/images';
import '../homePage/home.css';
import { CustomButton } from 'src/components/CustomButton';
import { throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useCommunicate } from '../../hooks/useComponentCommunication';
import Signup from '../../components/Signup';
import StallionSignup from '../homePage/StallionSignup';
import { scrollToTop } from '../../utils/customFunctions';
import { useAddForFarmEmailSubscriptionMutation } from 'src/redux/splitEndpoints/addForFarmEmailSubscriptionSplit';
import { useAddForFarmEmailValidQuery } from 'src/redux/splitEndpoints/addForFarmEmailValidSplit';
import Registration from 'src/forms/Registration';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ValidationConstants } from 'src/constants/ValidationConstants';
import * as Yup from 'yup';
import Testimonials from '../homePage/Testimonials';
import Page from 'src/components/Page';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { HtmlTooltip } from 'src/components/HtmlTooltip';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import RegisterInterest from 'src/forms/RegisterInterest';
import RegisterInterestSuccess from 'src/forms/RegisterInterestSuccess';
import Select from 'react-dropdown-select';
// MetaTags
import useMetaTags from 'react-metatags-hook';
import useAuth from 'src/hooks/useAuth';
import AddStallion from 'src/forms/AddStallion';
import CreateAStallion from 'src/forms/CreateAStallion';
import { useCookies } from 'react-cookie';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import PromoteStallion from 'src/forms/PromoteStallion';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import AddFarm from 'src/forms/AddFarm';
import { usePageDataSplitQuery } from 'src/redux/splitEndpoints/pageDataSplit';
import Marquee from "react-fast-marquee";
import useWindowSize from 'src/hooks/useWindowSize';
import { Interweave } from 'interweave';
import bgImg from '../../assets/Images/WhiteRunning.webp';


export interface ForFarmsSchemaType {
  email: string;
}

function StallionMatchController() {
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const promoteStallionUrl = `${BaseAPI}promote-your-stallion`;
  const promoteStallionImage = process.env.REACT_APP_PROMOTE_STALLION_IMAGE;
  const promoteStallionPageId = process.env.REACT_APP_STALLION_MARKETING_PAGE_ID;

  // Generate meta info 
  useMetaTags({
    title: `Stallion Marketing Platform | Stallion Match`,
    description: `Promote your thoroughbred farm and stallions direct to breeders on our flexible, custom stallion marketing platform. Built for flexiblilty and ease of use. `,
    openGraph: {
      title: `Stallion Marketing Platform | Stallion Match`,
      description: `Promote your thoroughbred farm and stallions direct to breeders on our flexible, custom stallion marketing platform. Built for flexiblilty and ease of use. `,
      site_name: 'Stallion Match',
      url: promoteStallionUrl,
      type: 'business.business',
      image: promoteStallionImage,
    },
  }, [])

  // Get window size
  const size = useWindowSize();

  // Get all countries API
  const { data: countries, isSuccess: isCountriesSuccess } = useCountriesQuery();

  const [openRegisteration, setOpenRegistration] = useState(false);
  const [openRegisterInterest, setOpenRegisterInterest] = useState(false);
  const [openRegisterInterestSuccess, setOpenRegisterInterestSuccess] = useState(false);
  const [registrationTitle, setRegistrationTitle] = useState('Create Account');
  const [openLogin, setOpenLogin] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const headingRef = React.useRef<HTMLElement | null>(null);
  const { authentication } = useAuth();
  const { headerBackground, setHeaderBackground } = useCommunicate();
  const [email, setEmail] = React.useState('');

  const [cookies] = useCookies(['country']);
  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');

  const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
  const [newllyPromoted, setNewlyPromoted] = useState(false);
  const [selectedStallionId, setSelectedStallionId] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [OpenLogin, setopenLogin] = useState(false);
  const [openFarmModal, setOpenFarmModal] = useState(false);
  const [testimonialList, setTestimonialList] = useState<any>([]);
  const [clientLogoList, setClientLogoList] = useState<any>([]);
  const [carasoulsList, setCarasoulsList] = useState<any>([]);
  const [pauseOnHover, setpauseOnHover] = useState(true);
  const [pauseOnClick, setpauseOnClick] = useState(false);


  // Get the marketing page info from stallion for farms page API
  const { data: pageData, isFetching: pageDateIsFetching, isSuccess: pageDateIsSuccess } = usePageDataSplitQuery(promoteStallionPageId);

  // Assign Testimonial list from stallion for farms page API 
  useEffect(() => {
    if (pageDateIsSuccess) {
      let filteredArr: any = [];
      filteredArr = pageData?.testimonials?.list?.filter((v: any) => v?.isActive);
      setTestimonialList(filteredArr);
      let filteredClientLogoList: any = [];
      filteredClientLogoList = pageData?.clientLogos?.list?.filter((v: any) => v?.imageUrl);
      setClientLogoList(filteredClientLogoList);
      let filteredCarasoulsList: any = [];
      filteredCarasoulsList = pageData?.carasouls?.list?.filter((v: any) => v.isActive);
      setCarasoulsList(filteredCarasoulsList);
      // pageData?.carasouls?.list? console.log(filteredClientLogoList,'filteredClientLogoList')
    }
  }, [pageDateIsFetching]);

  // Get all users farm list info from API
  const { data: userFarmListData } = useGetUsersFarmListQuery(null, { skip: !authentication });

  React.useEffect(() => {
    const fn = () => {
      if (headingRef?.current) {
        if (headingRef.current.getBoundingClientRect().top < 110) {
          setHeaderBackground(true);
        } else if (headerBackground) {
          setHeaderBackground(false);
        }
      }
    };
    window.addEventListener('scroll', throttle(fn, 200));
  });

  // Manage window scroll behavior
  const handleScroll = (ref: React.MutableRefObject<HTMLElement | null>) => {
    if (ref?.current?.offsetTop) {
      window.scrollTo({ top: ref?.current?.offsetTop - 140, behavior: 'smooth' });
    }
  };

  const [emailSubscription, setEmailSubscription] = useState('');

  // Email subscription post API call
  const [addEmailSubscription, subscribeResponse] = useAddForFarmEmailSubscriptionMutation();

  const [emailValidValue, setEmailValidValue] = useState('');
  const [isSubscriptionSuccess, setIsSubscriptionSuccess] = useState(false);
  const [errorEmail, setEmailError] = useState('');
  const [errorEmailFooter, setEmailErrorFooter] = useState('');
  const ForFormsSchema = Yup.object().shape({
    email: Yup.string()
      .email(ValidationConstants.emailFormatValidation),
  });

  const methods = useForm<ForFarmsSchemaType>({
    resolver: yupResolver(ForFormsSchema),
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    // reset,
    // watch,
    // setError,
    formState: { errors },
  } = methods;

  const emailData: any = {
    email: emailValidValue,
  };

  // Check valid email from API
  const {
    isSuccess,
    isLoading: isVerifyEmailLoading,
    isError,
    status,
    error,
  } = useAddForFarmEmailValidQuery(emailData, { skip: !emailData.email });

  // Email subscription post response as success 
  useEffect(() => {
    if (subscribeResponse?.isSuccess) {
      setIsSubscriptionSuccess(true);
      setEmailError('');
      setTimeout(() => {
        setEmailSubscription('');
        setIsSubscriptionSuccess(false);
      }, 3000);
    }
  }, [subscribeResponse?.isSuccess]);

  // Email subscription post response as error 
  useEffect(() => {
    if (!!subscribeResponse?.error && 'data' in subscribeResponse?.error) {
      if (email.length > 1 && subscribeResponse?.error?.status === 409) {
        setEmailError('Email already exists');
      }
      if (emailSubscription.length > 1 && subscribeResponse?.error?.status === 409) {
        setEmailErrorFooter('Email already exists');
      }
      if (email.length > 1 && subscribeResponse?.error?.status === 422) {
        setEmailError('Invalid email address.');
      }
      if (emailSubscription.length > 1 && subscribeResponse?.error?.status === 422) {
        setEmailErrorFooter('Invalid email address.');
      }
    }
  }, [subscribeResponse?.error, subscribeResponse?.isError]);

  // Email subscription post response as error 
  useEffect(() => {
    if (!!error && 'data' in error) {
      if (email.length > 1 && error?.status === 409) {
        setEmailError('Email already exists');
      }
      if (emailSubscription.length > 1 && error?.status === 409) {
        setEmailErrorFooter('Email already exists');
      }
      if (email.length > 1 && error?.status === 422 && emailValidValue?.length >= 3) {
        setEmailError('Invalid email address.');
        setOpenRegistration(false);
      }
      if (emailSubscription.length > 1 && error?.status === 422 && emailValidValue?.length >= 3) {
        setEmailErrorFooter('Invalid email address.');
        setOpenRegistration(false);
      }
    }
  }, [error, isError]);

  // While page is loading, display the contents from top
  useEffect(() => {
    scrollToTop();
  }, []);

  // Once email subscription button is clicked
  const handleSubmitEmail = () => {
    try {
      addEmailSubscription({ email: emailSubscription });
    } catch (e) {
      console.log(e);
    }
  };

  // Register popup modal close 
  const onRegistrationPopupClose = () => {
    setEmail("");
    setOpenRegistration(false)
  }

  // Display error message from valid email from API response
  useEffect(() => {
    if (isSuccess && !error) {
      setIsAgreed(true);
      setEmailValidValue("")
      setEmail(email)
      setOpenRegistration(true);
      setEmailError('');
    }
    if (email.length > 1 && !!error && 'data' in error) {
      if (error.status === 422) {
        setEmailError('Please enter valid email address');
      }
    }
    if (emailSubscription.length > 1 && !!error && 'data' in error) {
      if (error.status === 422) {
        setEmailErrorFooter('Please enter valid email address');
      }
    }
  }, [isSuccess, isError, status, error])

  // Check the Cookie country selection and call handleChange method
  useEffect(() => {
    const defaultCountry: any = cookies?.country || 11;
    const selectedCountry: any = countryList?.length ? countryList.filter((item: any) => item.id === defaultCountry) : []
    if (selectedCountry?.length) {
      handleChange(selectedCountry)
    }
  }, [cookies?.country])

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        marginRight: '0px',
        marginTop: '-1px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  }

  // Display Add Stallion or Registration popup once user clicks on Add Stallion or Promote Stallion
  const handleOpenAction = (event: any) => {
    if (authentication) {
      let farmList: any = [];
      farmList = userFarmListData?.filter((v: any) => v.isActive && v.accessLevel !== "3rd Party");
      if (farmList?.length) {
        setOpenStallionModal(true);
      } else {
        setOpenFarmModal(true);
      }
    } else {
      setOpenRegistration(true);
      handleClick(event);
    }
  }

  // Close Stallion popup
  const handleCloseStallion = () => {
    setOpenStallionModal(false);
  };

  // Open Add Stallion popup
  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  // Close Add Stallion popup
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
    setStallionTitle('Add a Stallion');
  };

  // Manage dropdown scroll behaviour
  const handleChange = (value: any): void => {
    setCountry(value);
    setTimeout(() => {
      let parentDiv: any = document.getElementsByClassName('global-dropdown-style');
      if (parentDiv) {
        let childSelect: any = parentDiv[0]?.children[2];
        if (childSelect) {
          let checkforBottom = childSelect.classList.contains('react-dropdown-select-dropdown-position-bottom');
          let checkforTop = childSelect.classList.contains('react-dropdown-select-dropdown-position-top');
          parentDiv[0].classList.remove('bottom-dropdown');
          parentDiv[0].classList.remove('top-dropdown');
          if (checkforBottom) {
            parentDiv[0].classList.add('bottom-dropdown');
          } else {
            parentDiv[0].classList.remove('bottom-dropdown');
          }
          if (checkforTop) {
            parentDiv[0].classList.add('top-dropdown');
          } else {
            parentDiv[0].classList.remove('top-dropdown');
          }
        }
      }
    }, 250);
  };

  // Open promote stallion popup
  const handleOpenPromoteStallion = () => {
    setAddStallionPromoteModal(true);
  };

  // Close promote stallion popup
  const handleClosePromoteStallion = () => {
    setAddStallionPromoteModal(false);
  };

  // Open new promote stallion popup
  const handleOpenPromoteNew = () => {
    setNewlyPromoted(true);
  };

  // Close new promote stallion popup
  const handleClosePromoteNew = () => {
    setNewlyPromoted(false);
  };

  // Open popup for Add Stallion
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpenDrawer(!openDrawer);
    if (openDrawer) {
      setAnchorEl(null);
    }
  };

  // Open Register popup
  const openRegistrationPopup = () => setOpenRegistration(true);

  // Close login popup
  const closeLogin = () => setopenLogin(false);

  // Open Forgot password popup
  const openForgotPasswordPopup = () => setForgotPassword(true);

  const countryList: any = countries?.map((item: any) => {
    return {
      ...item,
      value: item.id
    }
  })
  const [country, setCountry] = React.useState<any | undefined>(countryList?.filter((v: any, i: number) => v.id == cookies?.country) || []);

  // select dropdown onscroll style
  useEffect(() => {
    const handleScroll = (event: any) => {
      let parentDiv: any = document.getElementsByClassName('global-dropdown-style');
      if (parentDiv) {
        let childSelect: any = parentDiv[0]?.children[2];
        if (childSelect) {
          setTimeout(() => {
            let checkforBottom = childSelect.classList.contains('react-dropdown-select-dropdown-position-bottom');
            let checkforTop = childSelect.classList.contains('react-dropdown-select-dropdown-position-top');
            parentDiv[0].classList.remove('bottom-dropdown');
            parentDiv[0].classList.remove('top-dropdown');
            if (checkforBottom) {
              parentDiv[0].classList.add('bottom-dropdown');
            } else {
              parentDiv[0].classList.remove('bottom-dropdown');
            }
            if (checkforTop) {
              parentDiv[0].classList.add('top-dropdown');
            } else {
              parentDiv[0].classList.remove('top-dropdown');
            }
          }, 250);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  //close for on scroll dropdown style

  return (
    <StyledEngineProvider injectFirst>
      <Page title={"Stallion Match Portal"} meta={"baal"}>
        <Box className="SMbackground" style={pageData?.mainHeading?.bgImage ? { backgroundImage: `url(${(pageData?.mainHeading?.bgImage && pageData?.mainHeading?.bgImage)})` } : { background: `url(${bgImg})` }} sx={{ display: 'flex', alignItems: { lg: 'flex-start', xs: 'center' } }}>
          <Box className="TopwhiteTiles"></Box>
        </Box>
        <Container maxWidth="lg" sx={{ marginTop: { lg: '7rem', xs: '5rem' } }} className='forfarmsheaderwrp'>
          <Grid container spacing={{ xs: 0, sm: 0, lg: 1 }} sx={{ justifyContent: 'center' }} className='forfarmsheader'>
            <Grid item lg={9} sm={11}>
              <Typography
                variant="h1"
                align="center"
                sx={{ color: '#ffffff' }}
                ref={headingRef}
                onClick={() => handleScroll(headingRef)}
              >
                {pageData?.mainHeading?.title}
                {/* The best stallion-based marketing and sales engagement platform */}
              </Typography>
            </Grid>
            <Grid item lg={9} sm={12}>
              <Typography pt={3} pb={1} sx={{ color: '#2EFFB4' }} className="SMbannertext">
                {/* Sign up, register your farm and add your stallions now! */}
                {pageData?.mainHeading?.description}
              </Typography>
            </Grid>
            <Grid item lg={8} md={9} sm={12} xs={11} className="stallion-match-search">
              <Stack direction="row">
                <Box className={`SMregis ${errorEmail && "error-border"}`}>
                  <TextField
                    fullWidth
                    placeholder={pageData?.mainHeading?.emailAddress}
                    // placeholder="Enter email address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e: any) => setEmailValidValue(e.target.value)}
                    onFocus={(e) => { if (errorEmail !== '') { setEmail(email); setEmailError('') } }}
                  />
                </Box>
                <Box className="SMregisIcon" px={1}>
                  {pageData?.mainHeading?.buttonTarget && <a href={pageData?.mainHeading?.buttonTarget} target="_blank"><i className="icon-Arrow-circle-right" /></a>}
                  {pageData?.mainHeading?.buttonTarget === '' && <Button disabled={!email || isVerifyEmailLoading}><i className="icon-Arrow-circle-right" /></Button>}
                </Box>
              </Stack>
              <Box className="SMregisError">
                {errorEmail && (
                  <Typography
                    component="p"
                    sx={{ ml: { lg: '0rem', xs: '0' } }}
                    mt={1}
                    className="subSuccess subError"
                  >
                    {errorEmail}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={12} sx={{ zIndex: '1', marginTop: '5rem' }}>
              {pageData?.heroImage?.imageName && <Box className="StallionreportexBox">
                <img src={pageData?.heroImage?.imageName} alt="Stallionreportex" />
              </Box>}
            </Grid>
          </Grid>
          <Box className="SMfarmtitle">
            <Typography variant="h4">Used by many elite breeders & farms across the world</Typography>
          </Box>
          <Box className="SMfarmlogos" pb={5}>
            <Grid container lg={10} sx={{ margin: 'auto' }}>
              {size?.width < 900 && <Marquee pauseOnHover={pauseOnHover} pauseOnClick={pauseOnClick} loop={0} play={true} speed={60} >
                <Box className='SMflogo'>
                  {clientLogoList?.map((v: any) => {
                    return (
                      <Box className='flogo' key={v?.id}>
                        <img src={v?.imageUrl} alt={v?.fileName} />
                        {/* <img src={Images.AQUIS} alt="AQUIS Logo" /> */}
                      </Box>
                    )
                  })}
                  {/* <Box className='flogo'>
                    <img src={Images.alshaqab} alt="Alshaqab Logo" />
                    <img src={Images.AQUIS} alt="AQUIS Logo" />
                  </Box>
                  <Box className='flogo'>
                    <img src={Images.IrishNationalStud} alt="IrishNationalStud Logo" />
                    <img src={Images.alshLanesEndaqab} alt="AlshLanesEndaqab Logo" />
                  </Box>
                  <Box className='flogo'>
                    <img src={Images.WSValleyChampions} alt="WSValleyChampions Logo" />
                    <img src={Images.Arrowfield} alt="Arrowfield Logo" />
                  </Box>
                  <Box className='flogo'>
                    <img src={Images.ballylinch} alt="ballylinch-stud Logo" />
                    <img src={Images.Juddmonte} alt="Juddmonte Logo" />
                  </Box>
                  <Box className='flogo'>
                    <img src={Images.Coolmore} alt="Coolmore Logo" className='coolmore' />
                    <img src={Images.Newgate} alt="Newgate Logo" className='newgate' />
                  </Box> */}
                </Box>
              </Marquee>}
              {size?.width >= 900 && <Grid container spacing={6} columns={10}>
                {clientLogoList?.map((v: any) => {
                  return (
                    <Grid item lg={2} sm={2} xs={5} key={v?.id}>
                      <img src={v?.imageUrl} alt={v?.fileName} />
                    </Grid>
                  )
                })}
                {/* <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.AQUIS} alt="AQUIS Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.IrishNationalStud} alt="IrishNationalStud Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.alshLanesEndaqab} alt="AlshLanesEndaqab Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.WSValleyChampions} alt="WSValleyChampions Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.Arrowfield} alt="Arrowfield Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.ballylinch} alt="ballylinch-stud Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.Juddmonte} alt="Juddmonte Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.Coolmore} alt="Coolmore Logo" />
                </Grid>
                <Grid item lg={2} sm={2} xs={5}>
                  <img src={Images.Newgate} alt="Newgate Logo" className='newgate' />
                </Grid> */}
              </Grid>}
            </Grid>
          </Box>
        </Container>

        <Box className="SM-Valueadded">
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              {carasoulsList?.map((v: any) => {
                return (
                  <Grid item lg={11} xs={12} sx={v?.orientation === 'right' ? { margin: 'auto' } : { my: { lg: '6rem', xs: '3rem' }, margin: 'auto' }} key={v?.id}>
                    <Box
                      className='ComemonHomeGrid SMCGrid'
                      sx={{
                        display: 'grid',
                        gap: 12,
                        gridTemplateColumns: {
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                          md: 'repeat(2, 1fr)',
                        },
                      }}
                    >
                      {v?.orientation === 'right' &&
                        <>
                          <Box sx={{ margin: 'auto' }} className='nativeStallionBox'>
                            <Typography variant="h3">{v?.title}</Typography>
                            <Typography className="STMhomeCnt" pt={2}>
                              <Interweave className="interweave" content={v?.description} />
                            </Typography>
                            <Box mt={4}>
                              <Signup btnName="Get Started" btnClass="regisBtn" />
                            </Box>
                          </Box>
                          <Box sx={{ margin: 'auto 0', boxShadow: '4', borderRadius: '10px' }} className='nativeStallionImage'>
                            <img
                              src={v?.imageUrl ? v?.imageUrl : Images.StallionPageEx}
                              alt="Promote your stallions on our purpose-built platform"
                              style={{ borderRadius: '10px' }}
                            />
                          </Box>
                        </>
                      }
                      {v?.orientation === 'left' &&
                        <>
                          <Box sx={{ margin: 'auto 0', boxShadow: '4', borderRadius: '10px' }} className='nativeStallionImage'>
                            <img
                              src={v?.imageUrl ? v?.imageUrl : Images.StallionRosterEx}
                              alt="Integrated Stallion Roster Dashboard"
                              style={{ borderRadius: '10px' }}
                            />
                          </Box>
                          <Box sx={{ margin: 'auto' }} className='nativeStallionBox'>
                            <Typography variant="h3">{v?.title}</Typography>
                            <Typography className="STMhomeCnt" pt={2}>
                              <Interweave className="interweave" content={v?.description} />
                            </Typography>
                            <Box mt={4}>
                              <Signup btnName="Get Started" btnClass="regisBtn" />
                            </Box>
                          </Box>
                        </>
                      }
                    </Box>
                  </Grid>
                )
              })}
              {/* <Grid item lg={11} xs={12} sx={{ margin: 'auto' }}>
                <Box
                  className='ComemonHomeGrid SMCGrid'
                  sx={{
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  <Box sx={{ margin: 'auto' }} className='nativeStallionBox'>
                    <Typography variant="h3">Promote your stallions on our purpose-built platform</Typography>
                    <Typography className="STMhomeCnt" pt={2}>
                      Increase the quantity and quality of your incoming leads by promoting your stallions at stud on Stallion Match. All promoted stallions receive a personalised web page, encouraging racehorse breeders to run a search directly from your website - resulting in more qualified leads.
                    </Typography>
                    <Box mt={4}>
                      <Signup btnName="Get Started" btnClass="regisBtn" />
                    </Box>
                  </Box>
                  <Box sx={{ margin: 'auto 0', boxShadow: '4', borderRadius: '10px' }} className='nativeStallionImage'>
                    <img
                      src={Images.StallionPageEx}
                      alt="Promote your stallions on our purpose-built platform"
                      style={{ borderRadius: '10px' }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={11} xs={12} sx={{ my: { lg: '6rem', xs: '3rem' }, margin: 'auto' }}>
                <Box
                  className='ComemonHomeGrid SMCGrid SMCGridOpposite'
                  sx={{
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  <Box sx={{ margin: 'auto 0', boxShadow: '4', borderRadius: '10px' }} className='nativeStallionImage'>
                    <img
                      src={Images.StallionRosterEx}
                      alt="Integrated Stallion Roster Dashboard"
                      style={{ borderRadius: '10px' }}
                    />
                  </Box>
                  <Box sx={{ margin: 'auto' }} className='nativeStallionBox'>
                    <Typography variant="h3">Integrated Stallion<br /> Roster Dashboard</Typography>
                    <Typography className="STMhomeCnt" pt={2}>
                      Managing and updating your stallion roster is now simple and can be adjusted at various times of the season to suit your marketing plan. Track the success of your stallions across Stallion Match with critical insights, including search results, race results, and much more.
                    </Typography>
                    <Box mt={4}>
                      <Signup btnName="Get Started" btnClass="regisBtn" />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={11} xs={12} mt={1} sx={{ margin: 'auto' }}>
                <Box
                  className='ComemonHomeGrid SMCGrid'
                  sx={{
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  <Box sx={{ margin: 'auto' }} className='nativeStallionBox'>
                    <Typography variant="h3">
                      Advanced Communications platform
                    </Typography>
                    <Typography className="STMhomeCnt" pt={2}>
                      Selling stallion nominations has traditionally relied on inbound calls and emails, often resulting in missed opportunities. Activating this feature online is simple, fast and affordable. Easily customise nomination sales by price, number of nominations and timeframe.
                    </Typography>
                    <Box mt={4}>
                      <Signup btnName="Get Started" btnClass="regisBtn" />
                    </Box>
                  </Box>
                  <Box sx={{ margin: 'auto 0', boxShadow: '4', borderRadius: '10px' }} className='nativeStallionImage'>
                    <img src={Images.ChatEx} alt="Advanced Communications platform" style={{ borderRadius: '10px' }} />
                  </Box>
                </Box>
              </Grid> */}
            </Grid>
          </Container>
        </Box>
        <Box className='promote-fee'>
          <Box py={5} >
            <Container maxWidth='lg'>
              <Grid container sx={{ justifyContent: 'center' }}>
                <Grid item lg={11} xs={11} py={5}>
                  <Typography variant='h2' align='center' sx={{ lineHeight: { lg: '72px', xs: '56px' } }}>
                    Promote stallions directly to breeders for one annual fee.
                  </Typography>
                </Grid>
              </Grid>
            </Container>
          </Box>
          <Box sx={{ pb: '5rem' }}>
            <Container maxWidth='lg'>
              <Box className='promote'>
                <Box className='free-clmn' sx={{ boxShadow: '3' }}>
                  <Box>
                    <Typography variant='h4'>Free
                      <HtmlTooltip
                        enterTouchDelay={0}
                        leaveTouchDelay={6000}
                        className="CommonTooltip farm-tooltip"
                        placement='bottom-start'
                        title={
                          <React.Fragment>
                            {'Anyone can add a farm and their stallions free. A free account gives you basic features.'}{' '}
                          </React.Fragment>
                        }
                      >
                        <i className="icon-Info-circle" />
                      </HtmlTooltip>
                    </Typography>
                  </Box>
                  <Box mt={3}>
                    <Typography variant='h3'>$0</Typography>
                    <Typography variant='h5'>AUD per stallion, per year</Typography>
                  </Box>
                  <Box className='promote-country'>
                    &nbsp;
                  </Box>
                  <Box>
                    <CustomButton className='free-btn' onClick={(e: any) => handleOpenAction(e)}>
                      <span className='font-text'>Add A Stallion</span>
                    </CustomButton>
                  </Box>
                  <Box className='fee-border'></Box>
                  <Box>
                    {pageData?.freePricingTile?.list?.map((v: any) => {
                      return (
                        <Typography variant='h6' key={v?.id}>{v?.title}</Typography>
                      )
                    })}
                    {/* <Typography variant='h6'>Listed on G1 Goldmine also</Typography>
                    <Typography variant='h6'>Access Basic Analytics</Typography>
                    <Typography variant='h6'>Manage Stallion Fee</Typography>
                    <Typography variant='h6'>Email Support</Typography> */}
                  </Box>
                </Box>

                <Box className='promoted-clmn' sx={{ boxShadow: '3' }}>
                  <Box>
                    <Typography variant='h4'>Promoted
                      <HtmlTooltip
                        enterTouchDelay={0}
                        leaveTouchDelay={6000}
                        className="CommonTooltip farm-tooltip"

                        placement='bottom-start'

                        title={
                          <React.Fragment>
                            {'For a small fee, you can unlock the power of Stallion Match and give you full control.'}{' '}
                          </React.Fragment>
                        }
                      >
                        <i className="icon-Info-circle" />
                      </HtmlTooltip>
                    </Typography>
                  </Box>
                  <Box mt={3}>
                    <Typography variant='h3'>$400</Typography>
                    <Typography variant='h5'>AUD per stallion, per year</Typography>
                  </Box>
                  <Box className='promote-country' title={countryList?.length && country[0]?.countryName}>

                    {countryList?.length &&
                      <Select
                        options={countryList}
                        dropdownPosition="auto"
                        searchBy="countryName"
                        searchable={false}
                        onChange={(values: any) => handleChange(values)}
                        values={countryList?.filter((v: any, i: number) => v.id == cookies?.country) || []}
                        labelField="countryName"
                        className='global-dropdown-style md'
                        placeholder='Select Country'
                        dropdownHeight="200px"
                        dropdownHandleRenderer={({ state }) => (
                          // if dropdown is open show "–" else show "+"                               
                          <span>{state.dropdown ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}</span>
                        )}
                        itemRenderer={(data: any) => (
                          <div title={data?.item?.countryName} className={`react-dropdown-select-item ${data?.item?.countryName === country[0]?.countryName ? 'react-dropdown-select-item-selected' : ''}`} onClick={() => data?.methods.addItem(data?.item)}>{data?.item?.countryName}
                          </div>
                        )}
                      />
                    }
                  </Box>
                  <Box>
                    <CustomButton className='promote-btn' onClick={(e: any) => handleOpenAction(e)}>
                      <span className='font-text'>Promote A Stallion</span>
                    </CustomButton>
                  </Box>
                  <Box className='fee-border'></Box>
                  <Box>
                    {pageData?.promotedPricingTile?.list?.map((v: any) => {
                      return (
                        <Typography variant='h6' key={v?.id}>{v?.title}</Typography>
                      )
                    })}
                    {/* <Typography variant='h6'>Personalised Farm Profile</Typography>
                    <Typography variant='h6'>Personalised Stallion Profile</Typography>
                    <Typography variant='h6'>In-depth Search Analytics</Typography>
                    <Typography variant='h6'>Add Unlimited Farm Users</Typography>
                    <Typography variant='h6'>1-1 Communication</Typography>
                    <Typography variant='h6'>Accept Nominations Offers</Typography>
                    <Typography variant='h6'>Increase Sales via Boost Feature</Typography>
                    <Typography variant='h6'>Contact Interested Breeders</Typography>
                    <Typography variant='h6'>Stallion Match button for your website</Typography>
                    <Typography variant='h6'>Listed on G1 Goldmine</Typography>
                    <Typography variant='h6'>VIP Support</Typography> */}
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>

        <Box className="SM-howitwork" style={pageData?.banner1?.bgImage ? { backgroundImage: `url(${(pageData?.banner1?.bgImage && pageData?.banner1?.bgImage)})`,backgroundRepeat:'no-repeat',backgroundSize:'cover' } : { background: '#1D472E' }}>
          <Container maxWidth="lg">
            <Grid container lg={12} sx={{ margin: 'auto' }}>
              <Grid item lg={12} className="stallion-match-search">
                <Typography variant="h3" pb={2}>
                  {pageData?.banner1?.title}
                  {/* See how it works for your farm. */}
                </Typography>
                <Typography variant="h6">
                  {pageData?.banner1?.description}
                  {/* Registration is free. Adding stallions is free. See how promoting your stallions for a small fee can increase your sales and customer engagement. Enter your email below and we’ll be in touch. */}
                </Typography>
                <Grid container lg={11} sm={12} sx={{ margin: '0' }}>
                  <Grid item lg={9} sm={12} xs={12} className="stallion-match-search-box">
                    <Stack direction="row" className="fonrfarms-search">
                      <Box className={`SMregis ${errorEmailFooter && "error-border"}`} sx={{ px: '15px' }}>
                        <TextField
                          fullWidth
                          value={emailSubscription}
                          placeholder="Enter Email Address"
                          {...register('email')}
                          onChange={(e: any) => setEmailSubscription(e.target.value)}
                          onFocus={(e) => { if (errorEmailFooter !== '') { setEmailSubscription(emailSubscription); setEmailErrorFooter('') } }}
                        />
                      </Box>
                      <Box className="SMregisIcon" px={2}>
                        <IconButton disabled={emailSubscription.length < 1} onClick={handleSubmitEmail}>
                          {' '}
                          <i className="icon-Arrow-circle-right"></i>{' '}
                        </IconButton>
                      </Box>
                    </Stack>
                    <Box className="SMregisError">
                      {isSubscriptionSuccess && (
                        <Typography
                          component="p"
                          sx={{ ml: { lg: '0rem', xs: '0' } }}
                          mt={1}
                          className="subSuccess"
                        >
                          Thank you. Your Email Registered Successfully.
                        </Typography>
                      )}
                      {errorEmailFooter && (
                        <Typography
                          component="p"
                          sx={{ ml: { lg: '0rem', xs: '0' } }}
                          mt={1}
                          className="subSuccess subError"
                        >
                          {errorEmailFooter}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box className="TestimonialBGStallionMatch" sx={{ position: 'relative' }}>
          <Box className="Btmgreentile" />
          {testimonialList.length && <Testimonials testimonialList={testimonialList} />}
        </Box>

        <Box className="SM-howitwork" style={pageData?.banner2?.bgImage ? { backgroundImage: `url(${(pageData?.banner2?.bgImage && pageData?.banner2?.bgImage)})`,backgroundRepeat:'no-repeat',backgroundSize:'cover' } : { background: '#1D472E' }}>
          <Container maxWidth="lg">
            <Grid container lg={10} sx={{margin: 'auto'}}>
              <Grid item lg={9} sm={12} className="stallion-match-search">
                <Typography variant="h3" pb={2}>
                  {pageData?.banner2?.title}
                  {/* See how it works for your farm. */}
                </Typography>
                </Grid>
                <Grid item lg={9} sm={12}>
                <Typography variant="h6">
                  {pageData?.banner2?.description}
                  {/* Registration is free. Adding stallions is free. See how promoting your stallions for a small fee can increase your sales and customer engagement. Enter your email below and we’ll be in touch. */}
                </Typography>
                </Grid>
                <Grid container lg={11} sm={12} sx={{ margin: '0' }}>
                  <Grid item lg={9} sm={12} xs={12} className="stallion-match-search-box">
                    {pageData?.banner2?.buttonTarget === "" && <Signup btnName={pageData?.banner2?.buttonText ? pageData?.banner2?.buttonText : "Sign up now"} btnClass={'signup'} />}
                    {pageData?.banner2?.buttonTarget !== "" && <Button onClick={() => { window.open(pageData?.banner2?.buttonTarget) }} className='homeSignup'>{pageData?.banner2?.buttonText}</Button>}
                  </Grid>
                </Grid>
              </Grid>
          </Container>
        </Box>
        {/* <StallionSignup sx={{ background: '#005632 !important' }} /> */}

        <WrapperDialog
          open={openRegisterInterestSuccess}
          title={"Success!"}
          onClose={() => setOpenRegisterInterestSuccess(false)}
          body={RegisterInterestSuccess}
          dialogClassName='dialogPopup succesclass-modal'
          className='{"cookieClass"}'
          titleSx={{ backgroundColor: '#1D472E', color: "#2EFFB4 !important" }}
          iconSx={{
            position: 'absolute',
            right: 12,
            width: 36,
            height: 36,
            top: 18,
            color: "#2EFFB4 !important"
          }}
        />

        <WrapperDialog
          dialogClassName='dialogPopup registerYourIntrestPopup'
          open={openRegisterInterest}
          title={"Register your interest"}
          onClose={() => setOpenRegisterInterest(false)}
          body={RegisterInterest}
          className={"cookieClass"}
          openSuccess={() => setOpenRegisterInterestSuccess(true)}
          sx={{ backgroundColor: '#1D472E', color: "#2EFFB4 !important" }}
        />

        <WrapperDialog
          open={openRegisteration}
          title={registrationTitle}
          onClose={onRegistrationPopupClose}
          openOther={() => setOpenLogin(true)}
          changeTitleTo={setRegistrationTitle}
          body={Registration}
          setIsFirstLogin={setIsFirstLogin}
          setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
          emailValue={email}
          setEmailValue={setEmail}
          isAgreed={isAgreed}
          setIsAgreed={setIsAgreed}
        />

        <Box>
          <WrapperDialog
            open={openStallionModal}
            title={'Add a Stallion'}
            onClose={() => handleCloseStallion()}
            setDialogClassName={setDialogClassName}
            body={AddStallion}
            className={'cookieClass'}
            changeTitleTest={setStallionTitle}
            openOther={handleOpenCreateStallionModal}
            handleSelectedStallions={(id) => { setSelectedStallionId(id) }}
            openPromoteStallion={handleOpenPromoteStallion}
            sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
          />
        </Box>
        <Box>
          <WrapperDialog
            open={openCreateStallionModal}
            title={stallionTitle}
            dialogClassName={dialogClassName}
            onClose={handleCloseCreateStallion}
            createStallion="createStallion"
            isSubmitStallion={true}
            isSubmitMare={false}
            closeAddMare={''}
            body={CreateAStallion}
            className={'cookieClass'}
            sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
          />
        </Box>
        <Box>
          <WrapperDialog
            open={openAddStallionPromoteModal}
            title={'Promote Your Stallion'}
            onClose={handleClosePromoteStallion}
            openOther={handleOpenPromoteNew}
            OpenPromote={'OpenPromote'}
            selectedStallionIds={selectedStallionId}
            body={AddStallionPromote}
            className={'cookieClass'}
            sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
          />
        </Box>

        {/* Promote Stallion popup modal */}
        <Box>
          <WrapperDialog
            open={newllyPromoted}
            title={'Promote Stallion'}
            onClose={handleClosePromoteNew}
            promoteStallionType={() => { }}
            selectedStallionIds={selectedStallionId}
            stallionId={selectedStallionId}
            body={PromoteStallion}
          />
        </Box>

        {/* Add Farm popup modal */}
        <Box>
          <WrapperDialog
            open={openFarmModal}
            title={'Add a Farm'}
            onClose={() => setOpenFarmModal(false)}
            addAFarm={"add a farm"}
            body={AddFarm}
          />
        </Box>

        {/* Login popup modal */}
        <WrapperDialog
          dialogClassName='dialogPopup createAccountPopup'
          open={OpenLogin}
          title={isFirstLogin ? 'Welcome to Stallion Match' : 'Log in'}
          onClose={closeLogin}
          openOther={openRegistrationPopup}
          OFP={openForgotPasswordPopup}
          body={Login}
          firstLogin={isFirstLogin}
          farmAdminFirstLogin={isFarmAdminFirstLogin}
        />

        {/* Register popup modal */}
        <WrapperDialog
          open={openRegisteration}
          title={registrationTitle}
          onClose={() => setOpenRegistration(false)}
          openOther={() => setopenLogin(true)}
          changeTitleTo={setRegistrationTitle}
          body={Registration}
          setIsFirstLogin={setIsFirstLogin}
          setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        />

        {/* Forgot password popup modal */}
        <WrapperDialog
          open={forgotPassword}
          title="Forgot Password"
          onClose={() => setForgotPassword(false)}
          body={ForgotPassword}
        />


      </Page>
    </StyledEngineProvider>
  );
}

export default StallionMatchController;
