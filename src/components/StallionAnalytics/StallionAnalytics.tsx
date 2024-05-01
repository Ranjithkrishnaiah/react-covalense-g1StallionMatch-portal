import { Avatar, Divider, Paper, Stack, Typography, Popover } from '@mui/material';
import { Box, StyledEngineProvider } from '@mui/system';
import CustomAccordion from '../customAccordion/CustomAccordion';
import CustomAccordionSummary from '../customAccordion/CustomAccordionSummary';
import CustomAccordionDetails from '../customAccordion/CustomAccordionDetails';
import { Images } from 'src/assets/images';
import { CustomButton } from '../CustomButton';
import CustomizedProgressBars from '../ProgressBar';
import CustomizedSwitches from '../Switch';
import './StallionAnalytics.css';
import { StallionProfileProps } from 'src/@types/StallionAnalytics';
import { Navigate, useLocation, useNavigate } from 'react-router';
import AnalyticsDetails from './AnalyticsDetails';
import React, { useEffect, useState } from 'react';
import { WrapperDialog } from '../WrappedDialog/WrapperDialog';
import PromoteStallion from '../../forms/PromoteStallion';
import ConfirmStopPromotion from 'src/forms/ConfirmStopPromotion';
import ConfirmRemoveStallion from 'src/forms/ConfirmRemoveStallion';

import CopyToClipboard from 'react-copy-to-clipboard';
import { Constants } from '../../constants';
import { Link } from 'react-router-dom';
import ActivateNominations from 'src/forms/ActivateNominations';
import UpdateServiceFee from 'src/forms/UpdateServiceFee';

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useGetStallionAnalyticsQuery } from 'src/redux/splitEndpoints/getStallionAnalyticsSplit';
import { dateConvert, toPascalCase } from 'src/utils/customFunctions';
import PromotionAlreadyAvailable from 'src/forms/PromotionAlreadyAvailable';
import CustomSkeleton from '../Skeleton/CustomSkeleton';
import { Spinner } from '../Spinner';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={ { popper: className } } />
))(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 346,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function StallionView(props: any) {
  // const { tableIdentifier, displayColumns , hasAvatar, columns } = props

  const [farmAnchorEl, setFarmAnchorEl] = React.useState<null | (EventTarget & Element)>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | (EventTarget & Element)>(
    null
  );

  const profileOptions = [
    'Stallion Match Link',
    'Update Service Fee',
    'View Profile',
    'Manage Renewal',
    'Remove',
  ];
  const id = farmAnchorEl ? 'farm-popover' : undefined;
  const profileId = profileAnchorEl ? 'profile-popover' : undefined;
  const [isPromoted, setIsPromoted] = useState(props?.isPromoted);
  const [nominationStatus, setNominationStatus] = useState(props?.nominationStatus);
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
  const [ stopDate, setStopDate ] = useState<string>("")

  // console.log("StalionB",props?.analyticsDetails)
  const [copied, setCopied] = useState(false);
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const paths = {
    farmDashboard: '/dashboard/',
    farmPage: '/farm-directory/farm-page/',
    stallionRoaster: 'stallion-roster/',
    notifications: '/user/notifications/',
    memberProfile: '/user/profile/',
    myHorses: '/dashboard/my-horses/',
    messages: '/messages/',
    stallionReport: 'report/stallion',
    stallionProfile: '/stallions/',
  
  };
  const url = window.location.host + paths.farmDashboard;
  const horseId = props?.stallionId;

  const closePromotionPopup = () => {
    //setStopPromoted(true);
    setNewlyPromoted(false);
    setIsPromoted(false);
  };

  const closePromotionPopupSuccess = () => {
    //setStopPromoted(true);
    setNewlyPromoted(false);
    setIsPromoted(true);
  };

  const chosenStopDate = (date: string) => {
    setStopDate(date);
  }

  const closeConfirmPopup = () => {
    
    const today : string = dateConvert( new Date() );
    if(stopDate === today && nominationStatus){
      setIsPromoted(false)
    }else{
      setIsPromoted(true);
    }
    console.log("NS: ", isPromoted, nominationStatus, convertedDate, today, stopDate)
    setNominationStatus(nominationStatus);
    setStopPromoted(false);
    setStopNomination(false);
  };

  const closeConfirmPopupFuture = () => {
    setIsPromoted(true);
    //setNominationStatus(nominationStatus);
    setStopPromoted(false);
    setStopNomination(false);
  };

  const closeNominationPopup = () => {
    //setStopNomination(true);
    setNewlyNominated(false);
    setNominationStatus(false);
  };

  const closeNominationPopupSuccess = () => {
    //setStopNomination(true);
    setNewlyNominated(false);
    setNominationStatus(true);
  };

  //This is the api request
  const {
    data: stallionAnalyticsData,
    isSuccess,
    isLoading,
  } = useGetStallionAnalyticsQuery(sendApiForAnalytics, { skip: !Boolean(sendApiForAnalytics) });

  const toggleProfilePopover = (event: React.SyntheticEvent) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const goToPage = (url: string) => {
    if (currentFarmId) {
      const [id] = currentFarmId.split(',');
      navigate(`${url}${id}`);
    }
  };
  const sendToPage = (url: string) => {
    // console.log("URL: ", url)
    if (props?.stallionId) {
      const id = props?.stallionId;
      const name = props?.horseName;
      navigate(`${url}${id}&${name}`);
    }
  };
  let stallionUrl: string = '';
  if (currentFarmId) {
    const [id, name] = currentFarmId.split(',');
    stallionUrl = `${url}${id}&${name}`;
    console.log(stallionUrl);
  }

  function removeStallionFromRoaster() {
    setRemoveStallion(true);
  }
  function updateServiceFee() {
    // console.log(evt.target.id,"event name stallion");
    setOpenUpdateServiceFee(true);
  }

  function goToProfile() {
    if (props?.stallionId) {
      navigate(`${paths.stallionProfile}${toPascalCase(props?.horseName)}/${props?.stallionId}/View`);
     // navigate(`/${paths.stallionProfile}${props?.stallionId}`);
    }
  }
  function goToManageRenewal() {
    if (props?.stallionId) {
      navigate(`${paths.stallionProfile}${props?.horseName}/${props?.stallionId}/View`);
      navigate(`/dashboard/farm-dashboard/123&Coolmore/my-stallions-list`);
    }
  }

  const mapFunction = (evt: React.SyntheticEvent, element: string) => {
    let executeFunction: any = null;
    switch (element) {
      case 'Stallion Match Link':
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

  let profileRatingTempText;

  if (props?.profileRating === 50) {
    profileRatingTempText = 'Intermediate';
  }
  if (props?.profileRating < 50) {
    profileRatingTempText = 'Poor';
  }
  if (props?.profileRating > 50) {
    profileRatingTempText = 'Good';
  }

  const RoasterAnalytics = [
    [
      {
        title: 'SM Searches',
        value: stallionAnalyticsData?.smSearches,
      },
      {
        title: '20/20 Matches',
        value: stallionAnalyticsData?.twentyTwentyMatches,
      },
      {
        title: 'Perfect Matches',
        value: stallionAnalyticsData?.perfectMatches,
      },
    ],
    [
      {
        title: 'Page Views',
        value: stallionAnalyticsData?.pageViews,
      },
      {
        title: 'Messages',
        value: stallionAnalyticsData?.messages,
      },
      {
        title: 'Nominations',
        value: stallionAnalyticsData?.nominations,
      },
    ],
    [
      {
        title: '# of Runners',
        value: stallionAnalyticsData?.runners,
      },
      {
        title: '# of Winners',
        value: stallionAnalyticsData?.winners,
      },
      {
        title: 'Winners/Runners',
        value: `${stallionAnalyticsData?.winnersByRunners}%`,
      },
    ],
    [
      {
        title: 'M/F Runners',
        value: `${stallionAnalyticsData?.maleRunners + '/' + stallionAnalyticsData?.femaleRunners}`,
      },
      {
        title: '# of Stakes Winners',
        value: stallionAnalyticsData?.stakesWinners,
      },
      {
        title: 'Stakes Winners/Rnrs',
        value: `${stallionAnalyticsData?.stakesWinnersByRunners}%`,
      },
    ],
  ];

  const convertedDate = dateConvert(props?.expiryDate);

  // if(isLoading){
  //   return <Spinner/>
  // };
  return (
    <>
     hI STALLION ANALYTICS
    </>
  );
}

export default StallionView;
