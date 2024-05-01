import { Avatar, Divider, Paper, Stack, Typography, Popover } from '@mui/material';
import { Box, StyledEngineProvider } from '@mui/system';
import CustomAccordion from '../../../components/customAccordion/CustomAccordion';
import CustomAccordionSummary from '../../../components/customAccordion/CustomAccordionSummary';
import CustomAccordionDetails from '../../../components/customAccordion/CustomAccordionDetails';
import { Images } from 'src/assets/images';
import { CustomButton } from '../../../components/CustomButton';
import CustomizedProgressBars from '../../../components/ProgressBar';
import CustomizedSwitches from '../../../components/Switch';
import './StallionAnalytics.css';
import '../Roaster.css';
import { Navigate, useLocation, useNavigate } from 'react-router';
import AnalyticsDetails from './AnalyticsDetails';
import React, { useEffect, useState } from 'react';
import { WrapperDialog } from '../../../components/WrappedDialog/WrapperDialog';
import PromoteStallion from '../../../forms/PromoteStallion';
import ConfirmStopPromotion from 'src/forms/ConfirmStopPromotion';
import ConfirmRemoveStallion from 'src/forms/ConfirmRemoveStallion';
import { addDays } from 'date-fns';

import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import ActivateNominations from 'src/forms/ActivateNominations';
import UpdateServiceFee from 'src/forms/UpdateServiceFee';

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useGetStallionAnalyticsQuery, useGetStallionCloseStatsQuery, useGetStallionKeyStatsQuery, useGetStallionRoasterCloseStatsQuery, useGetStallionRoasterKeyStatsQuery } from 'src/redux/splitEndpoints/getStallionAnalyticsSplit';
import { dateConvert, dateConvertDisplay, parseDate } from 'src/utils/customFunctions';
import PromotionAlreadyAvailable from 'src/forms/PromotionAlreadyAvailable';
// import CustomSkeleton from '../../../components/Skeleton/CustomSkeleton';
import { Spinner } from '../../../components/Spinner';
import ConfirmStopNomination from 'src/forms/ConfirmStopNomination';
import { toPascalCase } from 'src/utils/customFunctions';
import Imgix from 'react-imgix';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function StallionView(props: any) {
  const [tooltipIsOpen, setTooltipIsOpen] = React.useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | (EventTarget & Element)>(
    null
  );

  const roasterFarmName = props?.farmName;
  const roasterFarmId = props?.farmID;
  const backToUrl = '/dashboard/' + `${roasterFarmName}/${roasterFarmId}`;

  const profileOptions = [
    'Copy Stallion URL',
    'Update Service Fee',
    'View Profile',
    'Manage Renewal',
    'Remove',
  ];

  const nonPromotedProfileOptions = [
    // 'Copy Stallion URL',
    'Update Service Fee',
    'Manage Renewal',
    'Remove',
  ];
  const { pathname } = useLocation();
  const isLocationFarmDashboard = pathname.split('/').includes('dashboard')
  const profileId = profileAnchorEl ? 'profile-popover' : undefined;
  const [isPromoted, setIsPromoted] = useState((props?.isPromoted === null) ? 0 : props?.isPromoted);
  const [nominationStatus, setNominationStatus] = useState((props?.isNominated === null) ? 0 : props?.isNominated);
  const [newlyNominated, setNewlyNominated] = useState(false);
  const [newlyPromoted, setNewlyPromoted] = useState(false);
  const [stopNomination, setStopNomination] = useState(false);
  const [openUpdateServiceFee, setOpenUpdateServiceFee] = useState(false);
  const [stopPromoted, setStopPromoted] = useState(false);
  const [removeStallion, setRemoveStallion] = useState(false);
  const [removeStallionTitle, setRemoveStallionTitle] = useState('Are you sure?');
  const [openPromotionAlreadyAvailable, setOpenPromotionAlreadyAvailable] = useState(false);
  const [sendApiForAnalytics, setSendApiForAnalytics] = useState<any>();
  const [openAccordian, setOpenAccordian] = useState<any>(false);
  const [stopDate, setStopDate] = useState<string>('');
  const options = isPromoted ? profileOptions : nonPromotedProfileOptions;

  const [copied, setCopied] = useState(false);
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);
  const navigate = useNavigate();
  const paths = {
    farmDashboard: '/dashboard/farm-dashboard/',
    farmPage: '/farm-directory/farm-page/',
    stallionRoaster: '/dashboard/stallion-roster/',
    notifications: '/dashboard/notifications/',
    memberProfile: '/user/profile/',
    myHorses: '/dashboard/my-horses/',
    messages: '/messages/',
    stallionReport: 'report/stallion',
    stallionProfile: '/stallions/',
  };
  const url = window.location.host + paths.farmDashboard;
  const horseId = props?.stallionId;

  const stallionPageURL: any = window.location.host + paths.stallionProfile + props?.horseName + '/' + horseId + '/View';

  // Change the nomination toggle based on API call
  useEffect(() => {
    setNominationStatus(props?.isNominated ? props?.isNominated : false)
  }, [props?.isNominated])

  // Change the Promotion toggle based on API call
  useEffect(() => {
    setIsPromoted(props?.isPromoted ? props?.isPromoted : false)
  }, [props?.isPromoted])

  // Close the promotion
  const closePromotionPopup = () => {
    setNewlyPromoted(false);
    setIsPromoted(false);
  };

  // Close the promotion popup on successsfully promotion
  const closePromotionPopupSuccess = () => {
    setNewlyPromoted(false);
    setIsPromoted(true);
  };

  // Select stop date
  const chosenStopDate: any = (date: string) => {
    setStopDate(date);
  };

  // Based on selected date change the promotion toggle value
  const closeConfirmPopupPromotion = () => {
    const today: string = dateConvert(new Date());

    if (stopDate === today && stopNomination) {
      setIsPromoted(false);
    } else {
      setIsPromoted(true);
    }
    if (props?.isPromoted) {
      setIsPromoted(true);
      setStopPromoted(false);
    } else {
      setIsPromoted(false);
      setStopPromoted(false);
    }
  };

  // Based on selected date change the nomination toggle value
  const closeConfirmPopupNomination = () => {
    const today: string = dateConvert(new Date());
    if (props?.isNominated) {
      setNominationStatus(true);
      setStopNomination(false);
    } else {
      setNominationStatus(false);
      setStopNomination(false);
    }
  };

  // Based on future selected date change the promotion toggle value
  const closeConfirmPopupFuturePromotion = () => {
    const today: string = dateConvert(new Date());

    if (stopDate === today) {
      setIsPromoted(false);
    } else {
      setIsPromoted(true);
    }

    setStopPromoted(false);
    setStopNomination(false);
  };

  // Based on future selected date change the nomination toggle value
  const closeConfirmPopupFutureNomination = () => {
    const today: string = dateConvert(new Date());
    // if (stopDate === today) {
    //   setNominationStatus(false);
    // } else {
    //   setNominationStatus(true);
    // }
    setNominationStatus(props?.isNominated);
    setStopNomination(false);
  };

  // Close the Nomination popup
  const closeNominationPopup = () => {
    const today: string = dateConvert(new Date());
    if (stopDate === today) {
      setNominationStatus(props?.isNominated);
    } else {
      setNominationStatus(props?.isNominated);
    }
    setNewlyNominated(false);
  };

  // Close the Nomination popup on successsfully promotion
  const closeNominationPopupSuccess = () => {
    const today: string = dateConvert(new Date());

    // if (stopDate === today) {
    //   setNominationStatus(true);
    // } else {
    //   setNominationStatus(false);
    // }
    setNominationStatus(props?.isNominated);
    setNewlyNominated(false);
  };

  let newState = {
    ...props.stateFilterForAnalytics,
    stallionId :sendApiForAnalytics
  };
  const {
    data: stallionAnalyticsKeyStatsData,
    isLoading,
  } = useGetStallionRoasterKeyStatsQuery(newState, { skip: !Boolean(sendApiForAnalytics),refetchOnMountOrArgChange:true });
  const {
    data: stallionAnalyticsCloseData,
  } = useGetStallionRoasterCloseStatsQuery(newState, { skip: !Boolean(sendApiForAnalytics),refetchOnMountOrArgChange:true });
  
  // Toggle popover
  const toggleProfilePopover = (event: React.SyntheticEvent) => {
    setProfileAnchorEl(event.currentTarget);
  };

  // For Copying url
  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // For navigation
  const goToPage = (url: string) => {
    if (currentFarmId) {
      const [id] = currentFarmId.split(',');
      navigate(`${url}${id}`);
    }
  };

  // For navigation
  const sendToPage = (url: string) => {
    if (props?.stallionId) {
      const id = props?.stallionId;
      const name = props?.horseName;
      navigate(`${url}${id}&${name}`);
    }
  };

  // Get farm dashboard url
  let stallionUrl: string = '';
  if (currentFarmId) {
    const [id, name] = currentFarmId.split(',');
    stallionUrl = `${url}${id}&${name}`;
  }

  // Remove stallion from roaster
  function removeStallionFromRoaster() {
    setRemoveStallion(true);
  }

  // Open Update the Service fee popup
  function updateServiceFee() {
    setOpenUpdateServiceFee(true);
  }

  // Navigate to stallion page 
  function goToProfile() {
    if (props?.stallionId) {
      navigate(`${paths.stallionProfile}${toPascalCase(props?.horseName)}/${props?.stallionId}/View`);
    }
  }

  // Navigate to renewal page
  function goToManageRenewal() {
    if (isLocationFarmDashboard) {
      navigate(`/stallions/${props?.farmName}/${pathname.split('/')[3]}`);
    }
    else if (props?.stallionId) {
      navigate(`/stallions/${props?.farmName}/${props?.farmID}`);
    }
  }

  // Popover on selection functionality
  const mapFunction = (evt: React.SyntheticEvent, element: string) => {
    let executeFunction: any = null;
    switch (element) {
      case 'Copy Stallion URL':
        executeFunction = onSuccessfulCopy;
        executeFunction();
        break;
      case 'Dashboard':
        executeFunction = () => goToPage(paths.farmDashboard);
        executeFunction();
        break;
      case 'Farm Page':
        executeFunction = () => goToPage(paths.farmPage);
        executeFunction();
        break;
      case 'Stallion Roaster':
        executeFunction = () => goToPage(paths.stallionRoaster);
        executeFunction();
        break;
      case 'Remove':
        executeFunction = removeStallionFromRoaster;
        executeFunction();
        break;

      case 'Update Service Fee':
        executeFunction = updateServiceFee;
        executeFunction();
        break;

      case 'View Profile':
        executeFunction = goToProfile;
        executeFunction();
        break;

      case 'Manage Renewal':
        executeFunction = goToManageRenewal;
        executeFunction();
        break;

      default:
        return executeFunction;
    }
  };


  // profile rating text as per percentage
  let profileRatingTempText;

  if (props?.profileRating <= 75) {
    profileRatingTempText = 'Intermediate';
  }
  if (props?.profileRating < 25) {
    profileRatingTempText = 'Poor';
  }
  if (props?.profileRating > 75) {
    profileRatingTempText = 'Good';
  }

  // Stallion roaster analytics value
  const RoasterAnalytics = [
    [
      {
        title: 'SM Searches',
        value: stallionAnalyticsCloseData && stallionAnalyticsCloseData[0]?.SMSearches,
      },
      {
        title: '20/20 Matches',
        value: stallionAnalyticsCloseData && stallionAnalyticsCloseData[0]?.TwentyTwentyMatches,
      },
      {
        title: 'Perfect Matches',
        value: stallionAnalyticsCloseData && stallionAnalyticsCloseData[0]?.PerfectMatches,
      },
    ],
    [
      {
        title: 'Page Views',
        value: stallionAnalyticsCloseData && stallionAnalyticsCloseData[0]?.PageViews,
      },
      {
        title: 'Messages',
        value: stallionAnalyticsCloseData && stallionAnalyticsCloseData[0]?.Messages,
      },
      {
        title: 'Nominations',
        value: stallionAnalyticsCloseData && stallionAnalyticsCloseData[0]?.Nominations,
      },
    ],
    [
      {
        title: '# of Runners',
        value: stallionAnalyticsKeyStatsData && stallionAnalyticsKeyStatsData[0]?.TotalRunners,
      },
      {
        title: '# of Winners',
        value: stallionAnalyticsKeyStatsData && stallionAnalyticsKeyStatsData[0]?.TotalWinners,
      },
      {
        title: 'Winners/Runners',
        value: `${stallionAnalyticsKeyStatsData && stallionAnalyticsKeyStatsData[0]?.WinnersRunnersPerc}%`,
      },
    ],
    [
      {
        title: 'M/F Runners',
        value: `${stallionAnalyticsKeyStatsData && stallionAnalyticsKeyStatsData[0]?.MaleRunners + '/' + stallionAnalyticsKeyStatsData && stallionAnalyticsKeyStatsData[0]?.FemaleRunners}`,
      },
      {
        title: '# of Stakes Winners',
        value: stallionAnalyticsKeyStatsData && stallionAnalyticsKeyStatsData[0]?.TotalStakeWinners,
      },
      {
        title: 'Stakes Winners/Rnrs',
        value: `${stallionAnalyticsKeyStatsData && stallionAnalyticsKeyStatsData[0]?.StakeWinnersRunnersPerc}%`,
      },
    ],
  ];

  const convertedDate = parseDate(props?.expiryDate);

  // Add a one day in current date
  const addOneDay = (d: any) => {
    let date = addDays(new Date(d), 1)
    let addedYear = dateConvertDisplay(date);
    return addedYear;
  }

  // Navigate to stallion report page
  const handleViewReport = () => {
    navigate(`/report/stallion/${horseId}/${roasterFarmName}/${roasterFarmId}`)
  }

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Paper className="Stallionview">
          <Stack direction="row">
            {/* Stallion info */}
            <Box sx={{ display: 'flex', flexGrow: '1' }}>
              {props?.profilePic && props?.profilePic ?
                <Imgix
                  src={props?.profilePic}
                  width={56} // This sets what resolution the component should load from the CDN and the size of the resulting image
                  height={56}
                  imgixParams={{ w: 56, h: 56, ar: '1:1', fit: 'crop', mask: 'ellipse' }}
                  // imgixParams={{mask:'ellipse'}}
                  htmlAttributes={{ alt: props?.horseName + ' Stallion Profile Picture' }}
                />
                :
                <Avatar
                  src={Images.HorseProfile}
                  alt={props?.horseName + ' Stallion Profile Picture'}
                  sx={{ width: '56px', height: '56px' }}
                />
              }
              <Stack px={2} sx={{ justifyContent: 'center' }}>
                <Typography variant="h5">{toPascalCase(props?.horseName)}</Typography>
                <Typography variant="h6">
                  Stud Fee: {props?.currencySymbol}
                  {props?.fee?.toLocaleString()} ({props?.feeYear})
                </Typography>
              </Stack>
            </Box>
             {/* List of option for stallion roaster */}
            <Box>
              <Box className="toggleProfileButton">
                <Box className="toggleProfileButtonLink">
                  <i
                    aria-describedby={profileId}
                    className={`icon-Circle-dots-horizontal ${props?.accessLevel ? props?.accessLevel === '3rd Party' ? 'disabled' : '' : ''}`}
                    onClick={toggleProfilePopover}
                    style={{ marginLeft: 'auto' }}
                    id={props?.horseName}
                  />
                </Box>
              </Box>
             
              <Popover
                sx={{ display: { lg: 'flex', xs: 'flex' } }}
                id={profileId}
                open={Boolean(profileAnchorEl)}
                anchorEl={profileAnchorEl}
                onClose={() => setProfileAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                className="sm-dropdown"
              >
                <Box className="dropdown-menu">
                  {options?.map((element: any, index: number) => (
                    <Box key={element + '-' + index} onClick={(evt) => mapFunction(evt, element)}>
                      {(index === 0 && element === 'Copy Stallion URL') ? (
                        <CopyToClipboard text={stallionPageURL} onCopy={onSuccessfulCopy}>
                          <Box sx={{ paddingX: 2, paddingY: '12px' }}>
                            <i className="icon-Link" />
                            {!copied ? 'Copy Stallion URL' : 'Copied!'}
                          </Box>
                        </CopyToClipboard>
                      ) : (
                        <Box id={props?.horseName} sx={{ paddingX: 2, paddingY: '12px' }}>
                          {element}
                        </Box>
                      )}
                      <Box>{index < options?.length - 1 ? <Divider /> : ''}</Box>
                    </Box>
                  ))}
                </Box>
              </Popover>
            </Box>
          </Stack>
          {/* Stallion promotion and nomination info */}
          <Stack
            className="roaster-lines-anlaytics"
            sx={{ alignItems: 'flex-start' }}
            py={3}
            alignItems={'center'}
            direction={{ xs: 'column', sm: 'row' }}
            divider={
              <Divider
                orientation="vertical"
                sx={{ borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' }}
                flexItem
              />
            }
            spacing={2}
          >
            <Stack
              className={`${props.isPromoted === 0 ? 'promoted-year' : ''} roaster-block`}
              direction={{ xs: 'row', sm: 'column' }}
              sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
            >
              <Box
                className="roaster-block-left"
                sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
              >
                <Typography variant="h6">Year to Stud</Typography>
              </Box>
              <Box
                className="roaster-block-right"
                sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
              >
                {props?.yearToStud ? (
                  <Typography variant="h4">{props?.yearToStud}</Typography>
                ) : (
                  <Typography variant="h4">&nbsp; &nbsp; - </Typography>
                )}
              </Box>
            </Stack>
            <Stack
              className="roaster-block"
              direction={{ xs: 'row', sm: 'column' }}
              sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
            >
              <Box
                className="roaster-block-left"
                sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
              >
                <Typography variant="h6" flexGrow={1}>
                  Promoted
                </Typography>
              </Box>
              <Box
                className="roaster-block-right"
                sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
              >
                <Stack
                  className="roaster-block-right-row"
                  py={1}
                  direction="row"
                  sx={{ alignItems: 'center' }}
                >
                  <CustomizedSwitches
                    defaultChecked={false}
                    setPromoted={setIsPromoted}
                    setNewlyPromoted={setNewlyPromoted}
                    setStopPromoted={setStopPromoted}
                    checked={props?.cartId ? (new Date(props?.startDate) > new Date()) ? false : true : isPromoted}
                    disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}
                  />
                  <Box>
                    <Typography variant="h6" className='activeoffclass' sx={{ fontFamily: 'Synthese-Regular !important' }}>
                      {props?.cartId ? (new Date(props?.startDate) > new Date()) ? 'Off' : 'Active' : isPromoted ? 'Active' : 'Off'}
                    </Typography>
                    {!isPromoted && (new Date() > new Date(props?.expiryDate)) &&
                      <Typography variant="h6" className='promotostallionunlock' sx={{ fontFamily: 'Synthese-Regular !important', whiteSpace: 'nowrap' }}>
                        Promote stallion to unlock all features
                      </Typography>}
                    {( isPromoted) ? (
                      props?.isAutoRenew
                        ? <Typography variant="h6">
                          (renew {props?.expiryDate ? addOneDay(props?.expiryDate) : ''})
                        </Typography> : <Typography variant="h6" className='promotostallionunlock'>
                          (exp {convertedDate ? convertedDate : ''})
                        </Typography>
                    ) : (
                      ''
                    )}
                    {props?.cartId &&
                      <Typography variant="h6" className='promotostallionunlock'>
                        Pending Payment
                      </Typography>
                    }
                  </Box>
                </Stack>

                <Typography variant="h6" className='schedule'>
                  {/* {!isPromoted && props?.startDate && 'Scheduled ' + parseDate(props?.startDate)} */}
                  {!isPromoted && (new Date(props?.startDate) > new Date()) && 'Scheduled ' + parseDate(props?.startDate)}
                </Typography>

              </Box>
            </Stack>
            {isPromoted ? (
              <Stack
                className="roaster-block"
                direction={{ xs: 'row', sm: 'column' }}
                sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
              >
                <Box
                  className="roaster-block-left"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Typography variant="h6" flexGrow={1}>
                    Nomination Status
                  </Typography>
                </Box>

                <Box
                  className="roaster-block-right"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Stack
                    className="roaster-block-right-row"
                    py={1}
                    direction="row"
                    sx={{ alignItems: 'center' }}
                  >
                    <CustomizedSwitches
                      defaultChecked={false}
                      setNominated={setNominationStatus}
                      setNewlyNominated={setNewlyNominated}
                      setStopNomination={setStopNomination}
                      checked={nominationStatus}
                      disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontFamily: 'Synthese-Regular !important' }}>
                        {nominationStatus ? 'Open' : 'Closed'}
                      </Typography>
                      <Typography variant="h6" className='remainingclass'>
                        (
                        {props?.isNominated
                          ? props?.nominationPendingCount > 0
                            ? `${props?.nominationPendingCount} remaining`
                            : 'Unlimited'
                          : '0 remaining'}
                        )
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="h6" className='schedule'>
                    {/* {!nominationStatus && props?.nominationStartDate && 'Scheduled ' + parseDate(props?.nominationStartDate)} */}
                    {!nominationStatus && !(new Date() > new Date(props?.nominationEndDate)) && 'Scheduled ' + parseDate(props?.nominationStartDate)}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              ''
            )}
          </Stack>
          {/* Stallion profile rating info */}
          <Stack className="profile-rating-wrapper">
            <Box mb={1} sx={{ display: 'flex' }}>
              <Typography variant="h6" flexGrow={1}>
                Profile Rating: <b>{profileRatingTempText}</b>
              </Typography>
              <HtmlTooltip
                placement="bottom-end"
                open={tooltipIsOpen}
                onOpen={() => setTooltipIsOpen(true)}
                onClose={() => setTooltipIsOpen(false)}
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                className="CommonTooltip studfee-tooltip"
                title={
                  <React.Fragment>
                    {<Typography>Your stallion’s profile rating is</Typography>}{' '}
                    {<Typography>determined by how much</Typography>}{' '}
                    {<Typography>information is complete. To increase</Typography>}{' '}
                    {<Typography>his profile rating, please update and</Typography>}{' '}
                    {<Typography>add information to your stallion’s</Typography>}{' '}
                    {<Typography>profile page.</Typography>}
                    {' '}
                  </React.Fragment>
                }
              >
                <i onClick={() => setTooltipIsOpen(!tooltipIsOpen)} className="icon-Info-circle" style={{ fontSize: '16px' }} />
              </HtmlTooltip>
            </Box>
            <CustomizedProgressBars profileRating={props?.profileRating} />
          </Stack>
        </Paper>
        {/* Stallion Analytics */}
        <Paper className="active-analytics">
          {isPromoted ? (
            <CustomAccordion
              className="stallion-analytics"
              defaultExpanded={isPromoted && sendApiForAnalytics}
              disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}
            >
              <CustomAccordionSummary
                className='stallion-analytics-acc-head'
                sx={{ padding: '0 1.25rem 0.5rem 1.25rem' }}
                onClick={() => {
                  setSendApiForAnalytics(props?.stallionId);
                  setOpenAccordian(!openAccordian);
                }}
              >
                {!openAccordian ? (
                  <>
                    <i className="icon-Circle-chevron-1" /> View analytics
                  </>
                ) : (
                  <>
                    <i className="icon-Circle-chevron" /> Close analytics
                  </>
                )}
              </CustomAccordionSummary>
              <CustomAccordionDetails sx={{ padding: '0 1.25rem' }}>
                {isLoading ? <Spinner /> : <AnalyticsDetails analytics={RoasterAnalytics} />}
              </CustomAccordionDetails>
              <Box
                className="analytics-bottom"
                mt={3}
                py={3}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <CustomButton className="GotoMsg" onClick={handleViewReport} disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}>View full report</CustomButton>
              </Box>
            </CustomAccordion>
          ) : (
            <Paper className="active-analytics">
              <CustomAccordion
                className="stallion-analytics"
                defaultExpanded={isPromoted}
                onClick={() => setNewlyPromoted(true)}
                disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}
              >
                <CustomAccordionSummary
                  sx={{
                    padding: '0 1.25rem 0.5rem 1.25rem',
                    background: '#005632',
                    borderRadius: '0 0 8px 8px',
                  }}
                >
                  <Typography className="roaster-promote">
                    <i className="icon-Circle-chevron-1" />{' '}
                    {`Promote ${toPascalCase(props?.horseName)} for Analytics`}
                  </Typography>
                </CustomAccordionSummary>
              </CustomAccordion>
            </Paper>
          )}
        </Paper>

        {/* Promote stallion popup */}
        <WrapperDialog
          open={newlyPromoted}
          title={'Promote Stallion'}
          onClose={closePromotionPopup}
          promoteStallionType={() => setOpenPromotionAlreadyAvailable(true)}
          selectedStallionIds={''}
          stallionId={props?.stallionId || ''}
          onCloseSuccess={closePromotionPopupSuccess}
          body={PromoteStallion}
        />

        {/* Stop promotion popup */}
        <WrapperDialog
          open={stopPromoted}
          title="Are you sure?"
          promoted={stopPromoted}
          nominated={false}
          onClose={closeConfirmPopupPromotion}
          stallionName={props?.horseName}
          stallionId={props?.stallionId}
          closeConfirmPopupFuture={closeConfirmPopupFuturePromotion}
          expiryDate={props?.expiryDate}
          chosenDate={chosenStopDate}
          body={ConfirmStopPromotion}
        />

        {/* Stop nomination popup */}
        <WrapperDialog
          open={stopNomination}
          title="Are you sure?"
          promoted={false}
          nominated={stopNomination}
          onClose={closeConfirmPopupNomination}
          stallionName={props?.horseName}
          stallionId={props?.stallionId}
          closeConfirmPopupFuture={closeConfirmPopupFutureNomination}
          expiryDate={props?.expiryDate}
          chosenDate={chosenStopDate}
          body={ConfirmStopNomination}
        />

        {/* Activate Nominations popup  */}
        <WrapperDialog
          open={newlyNominated}
          title="Activate Nominations"
          onClose={closeNominationPopup}
          stallionName={props?.horseName || ''}
          stallionId={props?.stallionId || ''}
          activateNomination={'activateNomination'}
          chosenDate={chosenStopDate}
          maxExpiryDate={props?.expiryDate}
          onCloseNominated={closeNominationPopupSuccess}
          body={ActivateNominations}
          className={'cookieClass'}
          sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
        />

        {/* Remove stallion popup */}
        <WrapperDialog
          open={removeStallion}
          title={removeStallionTitle}
          onClose={() => setRemoveStallion(false)}
          StallionName={props?.horseName || ''}
          ExpiryDate={''}
          ChangeTitleRemove={(value: any) => setRemoveStallionTitle(value)}
          stallionId={props?.stallionId || ''}
          body={ConfirmRemoveStallion}
        />

        {/* Update service fee popup */}
        <WrapperDialog
          open={openUpdateServiceFee}
          title="Update Service Fee"
          onClose={() => setOpenUpdateServiceFee(false)}
          stallionName={props?.horseName || ''}
          stallionId={props?.stallionId || ''}
          updateServiceFee={'updateServiceFee'}
          body={UpdateServiceFee}
          className={'cookieClass'}
          sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
        />

        {/* Show this popup after adding stallion to farm for promotion */}
        <WrapperDialog
          open={openPromotionAlreadyAvailable}
          title="Stallion already promoted"
          onClose={() => setOpenPromotionAlreadyAvailable(false)}
          alreadyAvailable={''}
          body={PromotionAlreadyAvailable}
        />
      </StyledEngineProvider>
    </>
  );
}

export default StallionView;
