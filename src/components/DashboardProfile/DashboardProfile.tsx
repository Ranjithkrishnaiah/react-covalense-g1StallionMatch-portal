import {
  Avatar,
  Divider,
  Grid,
  Paper,
  Popover,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';
import { Box, StyledEngineProvider } from '@mui/system';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Images } from 'src/assets/images';
import { CustomButton } from '../CustomButton';
import './DashboardProfile.css';
import { ProfileProps, Farm, Message } from '../../@types/breederProps';
import useAuth from 'src/hooks/useAuth';
import { useDeleteFromMyFarmsMutation } from 'src/redux/splitEndpoints/deleteFarm';
import { useGetMessageNominationCountsQuery } from 'src/redux/splitEndpoints/getMessageNominationCount';
import { useGetProfileImageQuery } from 'src/redux/splitEndpoints/addUserProfileImage';
import { useGetFarmByIdQuery } from 'src/redux/splitEndpoints/getFarmsByIdSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import {
  useFarmNotificationsQuery,
  useNotificationsQuery,
} from 'src/redux/splitEndpoints/getNotificationsSplit';
import useWindowSize from 'src/hooks/useWindowSize';
import { Spinner } from '../Spinner';

function DashboardProfile(props: ProfileProps) {
  /**
   * TO DO: Keep All the User Details including all the details of the Farm(s) he has in useAuth
   * as we must get that response after successful login.
   *
   * Use that information in User and Farm dashboard or in any other location that needs such information
   */
  var parsedUser = { fullName: '' };
  const { user, authentication } = useAuth();
  if (user) {
    let newUser = JSON.stringify(user);
    parsedUser = JSON.parse(newUser);
  }
  const [farmAnchorEl, setFarmAnchorEl] = React.useState<null | (EventTarget & Element)>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | (EventTarget & Element)>(
    null
  );
  const [farmProfileAnchorEl, setFarmProfileAnchorEl] = React.useState<
    null | (EventTarget & Element)
  >(null);
  const [currentFarmId, setCurrentFarmId] = React.useState<string | null>(null);
  const [currentFarmName, setCurrentFarmName] = React.useState<string | null>('');
  const [picture, setPicture] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [latestMessages, setLatestMessages] = React.useState<any>([]);
  const [time, setTime] = React.useState<any>('');
  const { farmId, farmName } = useParams();
  const size = useWindowSize();

  // API call to get messages count
  const { data: messageCounts, isSuccess: isMessageCountSuccess } =
    useGetMessageNominationCountsQuery(farmId, { skip: !farmId });

  const farmOptions = ['Copy Farm URL', 'Farm Dashboard', 'Farm Page', 'Stallion Roster', 'Remove'];
  const profileOptions = ['My Horses', 'Profile', 'Messages', 'Notifications'];
  const farmProfileOptions =
    props.accessLevel && props?.accessLevel === '3rd Party'
      ? ['Copy Farm URL', 'Farm Page', 'Stallion Roster']
      : ['Copy Farm URL', 'Farm Page', 'Stallion Roster', 'Manage Stallions'];

  // API call to get user profile details
  const { data: userProfileData, isSuccess: getProfileSuccess } = useGetProfileImageQuery(null, {
    skip: !authentication,
    refetchOnMountOrArgChange: true,
  });
  let typeErrorResolvedFarmId: any = farmId;
  const { data: farmDetailsById } = useGetFarmByIdQuery(typeErrorResolvedFarmId);
  let farmUrl: string = '';

  // set profile picture on profile API success
  React.useEffect(() => {
    if (getProfileSuccess) {
      setPicture(userProfileData?.memberprofileimages);
    }
  }, [userProfileData]);

  // paths
  const paths = {
    farmDashboard: '/dashboard/',
    farmPage: '/stud-farm/',
    stallionroster: '/stallion-roster/',
    managestallion: '/stallions/',
    notifications: '/user/notifications',
    memberProfile: '/user/profile',
    myHorses: '/dashboard/my-horses/',
    messages: '/messages',
  };
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const FarmDashboard = pathname.match(paths.farmDashboard);
  const id = Boolean(farmProfileAnchorEl) ? 'profile-popover' : undefined;
  const profileId = Boolean(profileAnchorEl) ? 'profile-popover' : undefined;
  const url = window.location.host + paths.farmPage;

  // API call for delete farm
  const [deleteFarm, response] = useDeleteFromMyFarmsMutation();
  if (currentFarmId && currentFarmName) {
    farmUrl = `${url}${currentFarmName}/${currentFarmId}`;
  }
  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];
  const farmIDCheck = pathSplitForFarm[3];

  const farmNameFromData: any = props?.farms?.filter((data: any) => data?.farmId === farmID);

  //notifications payload
  let notificationsParams = {
    sortBy: 'Unread',
    order: 'DESC',
    page: 1,
    limit: 2,
  };
  // API call to get notifications response
  const {
    data: notificationsRes,
    isSuccess: isNotificationsSuccess,
    isFetching: isNotificationsFetching,
  } = useNotificationsQuery(notificationsParams, {
    skip: !authentication,
    refetchOnMountOrArgChange: true,
  });
  let notificationsData = notificationsRes?.data ? notificationsRes?.data.slice(0, 2) : [];

  //farmNotifications payload
  let farmNotificationsParams = {
    sortBy: 'Unread',
    order: 'DESC',
    page: 1,
    limit: 2,
    farmId: farmIDCheck,
  };
  // API call to get farm related notifications response
  const {
    data: farmNotificationsRes,
    isSuccess: isFarmNotificationsSuccess,
    isFetching: isFarmNotificationsFetching,
  } = useFarmNotificationsQuery(farmNotificationsParams, { skip: !farmIDCheck });
  let farmNotificationsData = farmNotificationsRes?.data
    ? farmNotificationsRes?.data.slice(0, 2)
    : [];

  // to set latest messages on notifications API success
  React.useEffect(() => {
    if (farmIDCheck) {
      if (isFarmNotificationsSuccess) {
        setLatestMessages(farmNotificationsData);
      }
    } else {
      if (isNotificationsSuccess) {
        setLatestMessages(notificationsData);
      }
    }
  }, [isNotificationsFetching, isFarmNotificationsFetching]);

  // goto redirection
  const goToPage = (url: string) => {
    if (currentFarmId) {
      const [id, name] = currentFarmId.split(',');
      navigate(`${url}${id}`);
    }

    if (url.includes('roster') && currentFarmId) {
      const [id] = currentFarmId.split(',');
      navigate(`${url}${id}`);
    }
  };

  // navigate to messages page
  function sendToMessages() {
    window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
    window.sessionStorage.setItem('SessionFilteredFarm', '');
    navigate(`/messages`);
  }

  // method to delete farm
  function removeFarm() {
    deleteFarm({ farmId: currentFarmId });
    if (true) setFarmAnchorEl(null); // The "IF" condition is Just to avoid unnecessary Typescript error
  }

  // method for profile popover
  const toggleProfilePopover = (event: React.SyntheticEvent) => {
    FarmDashboard
      ? setFarmProfileAnchorEl(event.currentTarget)
      : setProfileAnchorEl(event.currentTarget);
  };
  const toggleFarmPopover = (event: React.SyntheticEvent, currentData: any) => {
    setCurrentFarmName(currentData?.farmName);
    setCurrentFarmId(event.currentTarget.id);
    setFarmAnchorEl(event.currentTarget);
  };

  // onClick copy
  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // method to execute logics based on switch clicked
  const mapFunction = (evt: React.SyntheticEvent, element: string) => {
    let executeFunction: any = null;
    switch (element) {
      case 'Copy Farm URL':
        executeFunction = onSuccessfulCopy;
        executeFunction();
        break;
      case 'Farm Dashboard':
        executeFunction = () => goToPage(paths.farmDashboard + `${currentFarmName}/`);
        executeFunction();
        break;
      case 'Farm Page':
        executeFunction = () =>
          FarmDashboard
            ? navigate(paths.farmPage + `${farmName}/${farmId}`)
            : goToPage(paths.farmPage + `${currentFarmName}/`);
        executeFunction();
        break;
      case 'Stallion Roster':
        executeFunction = () =>
          FarmDashboard
            ? navigate(paths.stallionroster + `${farmName}/${farmId}`)
            : goToPage(paths.stallionroster + `${currentFarmName}/`);
        executeFunction();
        break;
      case 'Manage Stallions':
        executeFunction = () => navigate(paths.managestallion + `${farmName}/${farmId}`);
        executeFunction();
        break;
      case 'Remove':
        executeFunction = removeFarm;
        executeFunction();
        break;
      case 'My Horses':
        executeFunction = () => navigate(paths.myHorses);
        executeFunction();
        break;
      case 'Notifications':
        executeFunction = () => navigate(paths.notifications);
        executeFunction();
        break;
      case 'Profile':
        executeFunction = () => navigate(paths.memberProfile);
        executeFunction();
        break;
      case 'Messages':
        executeFunction = () => sendToMessages();
        executeFunction();
        break;
      default:
        return executeFunction;
    }
  };

  // time conversion
  const showTime = (timestamp: any) => {
    if (timestamp !== null && timestamp !== undefined) {
      const timeData = new Date(timestamp)
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
      return timeData.toLocaleString();
    }
  };

  // Light tooltip for info
  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0.87)',
      // boxShadow: theme.shadows[1],
      fontSize: 16,
      fontFamily: 'Synthese-Book',
      padding: '24px',
      border: '1px solid #E2E7E1',
      borderRadius: '8px',
      boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
      lineHeight: '24px'
    },
  }));

  return (
    <StyledEngineProvider injectFirst>
      <Paper className="DBprofile FDprofileBox">
        <Stack direction="row">
          {/* profile details */}
          <Box sx={{ display: 'flex' }} flexGrow={1} className="profile-pic">
            <Avatar
              src={
                FarmDashboard === null
                  ? picture
                    ? `${picture}?h=96&w=96&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100`
                    : Images.User
                  : farmDetailsById?.image
                  ? `${farmDetailsById?.image}?h=96&w=96&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100`
                  : Images.farmplaceholder
              }
              alt={FarmDashboard === null ? parsedUser.fullName || props.user.name : farmName}
            />
            <Stack px={2} sx={{ justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontFamily: 'Synthese-Regular' }}>
                {toPascalCase(
                  FarmDashboard === null ? parsedUser.fullName || props.user.name : farmName
                )}
              </Typography>
              <Typography variant="h6">
                {FarmDashboard === null && userProfileData?.memberaddress?.[0]?.stateName}
                {FarmDashboard === null && userProfileData?.memberaddress?.[0]?.stateName && ', '}
                {FarmDashboard === null && userProfileData?.memberaddress?.[0]?.countryName}
                {FarmDashboard && farmNameFromData?.[0]?.stateName}
                {FarmDashboard && farmNameFromData?.[0]?.stateName && ', '}
                {FarmDashboard && farmNameFromData?.[0]?.countryName}
              </Typography>
            </Stack>
          </Box>
          {/* popover for profile details */}
          <Box className="toggleProfileButton">
            <Box className="toggleProfileButtonLink">
              <i
                aria-describedby={profileId || id}
                className="icon-Circle-dots-horizontal"
                onClick={toggleProfilePopover}
              />
            </Box>
          </Box>
          {/* popover for profile details end */}

          {/* popover for farm options */}
          <Popover
            sx={{ display: { lg: 'flex', xs: 'flex' } }}
            id={id}
            open={Boolean(farmAnchorEl)}
            anchorEl={farmAnchorEl}
            onClose={() => setFarmAnchorEl(null)}
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
              {farmOptions?.map((element: any, index: number) => (
                <Box key={element + '-' + index} onClick={(evt) => mapFunction(evt, element)}>
                  {index === 0 ? (
                    <CopyToClipboard text={farmUrl} onCopy={onSuccessfulCopy}>
                      <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'pointerOnHover'}>
                        <i className="icon-Link" /> {!copied ? 'Copy Farm URL' : 'Copied!'}
                      </Box>
                    </CopyToClipboard>
                  ) : (
                    <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'pointerOnHover'}>
                      {element}
                    </Box>
                  )}
                  <Box>{index < farmOptions.length - 1 ? <Divider /> : ''}</Box>
                </Box>
              ))}
            </Box>
          </Popover>
          {/* popover for farm options end */}

          {/* popover for profile options */}
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
              {profileOptions?.map((element: any, index: number) => (
                <Box key={element + '-' + index} onClick={(evt) => mapFunction(evt, element)}>
                  {index === 0 && FarmDashboard ? (
                    <CopyToClipboard text={farmUrl} onCopy={onSuccessfulCopy}>
                      <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'pointerOnHover'}>
                        <i className="icon-Link" /> {!copied ? 'Copy Farm URL' : 'Copied!'}
                      </Box>
                    </CopyToClipboard>
                  ) : (
                    <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'pointerOnHover'}>
                      {element}
                    </Box>
                  )}
                  <Box>{index < profileOptions?.length - 1 ? <Divider /> : ''}</Box>
                </Box>
              ))}
            </Box>
          </Popover>
          {/* popover for profile options end */}

          {/* popover for farm Profile Options */}
          <Popover
            sx={{ display: { lg: 'flex', xs: 'flex' } }}
            id={profileId}
            open={Boolean(farmProfileAnchorEl)}
            anchorEl={farmProfileAnchorEl}
            onClose={() => setFarmProfileAnchorEl(null)}
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
              {farmProfileOptions?.map((element: any, index: number) => (
                <Box key={element + '-' + index} onClick={(evt) => mapFunction(evt, element)}>
                  {index === 0 && FarmDashboard ? (
                    <CopyToClipboard text={url + farmName + '/' + farmId} onCopy={onSuccessfulCopy}>
                      <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'pointerOnHover'}>
                        <i className="icon-Link" /> {!copied ? 'Copy Farm URL' : 'Copied!'}
                      </Box>
                    </CopyToClipboard>
                  ) : (
                    <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'pointerOnHover'}>
                      {element}
                    </Box>
                  )}
                  <Box>{index < profileOptions?.length - 1 ? <Divider /> : ''}</Box>
                </Box>
              ))}
            </Box>
          </Popover>
          {/* popover for farm Profile Options end */}
        </Stack>

        {/* farms lists */}
        <Stack mt={3} className="dashboardProfile">
          <Typography variant="h6" sx={{ fontFamily: 'Synthese-Regular' }} pb={1}>
            {FarmDashboard === null ? (props?.farms?.length > 0 ? 'Your Farms' : '') : 'Messages'}
          </Typography>
          {!FarmDashboard &&
            props?.farms?.map((farm: Farm) => (
              <Grid
                container
                lg={12}
                xs={12}
                my={1}
                py={1}
                className="List-content"
                key={farm.farmId}
              >
                <Grid
                  item
                  lg={11}
                  xs={11}
                  pl={3}
                  className="List-content-left"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Avatar
                    src={
                      farm?.profilePic
                        ? `${farm.profilePic}?h=48&w=48&fit=crop&ar=1:1&mask=ellipse&nr=-100&nrs=100`
                        : Images.farmlogo
                    }
                    alt={farm?.farmName + ' Logo'}
                    style={{ marginRight: '10px' }}
                  />
                  <Typography variant="h5">{toPascalCase(farm.farmName)}</Typography>
                  {!farm.isActive && (
                    <Typography variant="h6" sx={{ color: '#626E60' }} pl={1}>
                      ({'Pending'})
                    </Typography>
                  )}
                </Grid>
                <Grid item lg={1} xs={1} className="List-content-right">
                  {farm.isActive ? (
                    <i
                      aria-describedby={farm.farmId}
                      id={farm.farmId}
                      className="icon-Dots-horizontal"
                      onClick={(event) => toggleFarmPopover(event, farm)}
                    />
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            ))}
          {/* farms lists ends */}

          {/* farms details */}
          {FarmDashboard && (
            <Stack
              className="farmdashboardProfile"
              direction={{ xs: 'column', sm: 'row' }}
              divider={
                <Divider
                  orientation="vertical"
                  sx={{
                    borderBottom: 'solid 1px #B0B6AF',
                    borderColor: '#B0B6AF',
                  }}
                  flexItem
                />
              }
              spacing={2}
            >
              <Stack
                className="farmdashboardPrItem"
                direction={{ xs: 'row', sm: 'column' }}
                sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
              >
                <Box
                  className="farmdashboardPrItemLeft"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Typography variant="h5">Received</Typography>
                </Box>
                <Box
                  className="farmdashboardPrItemRight"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Typography variant="h3">{messageCounts?.received}</Typography>
                </Box>
              </Stack>

              <Stack
                className="farmdashboardPrItem sent"
                direction={{ xs: 'row', sm: 'column' }}
                sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
              >
                <Box
                  className="farmdashboardPrItemLeft"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Typography variant="h5">Sent</Typography>
                </Box>
                <Box
                  className="farmdashboardPrItemRight"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Typography variant="h3">{messageCounts?.sent}</Typography>
                </Box>
              </Stack>

              <Stack
                className="farmdashboardPrItem sent"
                direction={{ xs: 'row', sm: 'column' }}
                sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
              >
                <Box
                  className="farmdashboardPrItemLeft"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Typography variant="h5">Nominations</Typography>
                </Box>
                <Box
                  className="farmdashboardPrItemRight"
                  sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}
                >
                  <Typography variant="h3">{messageCounts?.nomination}</Typography>
                </Box>
              </Stack>
            </Stack>
          )}
          {/* farms details ends */}
        </Stack>
      </Paper>

      {/* latest section */}
      <Paper className="DBmessage">
        <Typography variant="h6" sx={{ fontFamily: 'Synthese-Regular' }} pb={1}>
          Latest
          {size?.width <= 767 && (
            <LightTooltip
            enterTouchDelay={0}
            leaveTouchDelay={2000}
              title={
                'This section will showcase your most recent notifications, including messages from farms, account updates, and AI search analytics.'
              }
            >
              <i className="icon-Info-circle"></i>
            </LightTooltip>
          )}
          {size?.width > 767 && (
            <LightTooltip
              title={
                'This section will showcase your most recent notifications, including messages from farms, account updates, and AI search analytics.'
              }
              placement="right-start"
            >
              <i className="icon-Info-circle"></i>
            </LightTooltip>
          )}
        </Typography>

        {(isNotificationsFetching || isFarmNotificationsFetching) && <Spinner />}

        {!isNotificationsFetching && !isFarmNotificationsFetching && (
          <>
            {latestMessages.length > 0 &&
              latestMessages?.map((message: Message, index: number) =>
                message?.message == ' ' ? (
                  ''
                ) : (
                  <Grid
                    container
                    lg={12}
                    xs={12}
                    my={1}
                    py={1}
                    className={`${
                      message.featureName === 'Messaging'
                        ? 'List-content'
                        : 'List-content system-notification'
                    } ${
                      message.messageTitle.toLowerCase().includes('message received') && 'noBorder'
                    }`}
                    key={message?.timeStamp + '-' + message?.senderName}
                  >
                    <Grid item lg={11} xs={11} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Stack>
                        <Typography
                          variant="h5"
                          sx={{ fontFamily: 'Synthese-Book', color: '#161716' }}
                          dangerouslySetInnerHTML={{ __html: message?.messageText }}
                        ></Typography>
                        <Typography component="span" sx={{ color: '#626E60' }} pt={1}>
                          {showTime(message?.timeStamp)}
                        </Typography>
                      </Stack>
                    </Grid>
                    {!message.isRead && (
                      <Grid
                        item
                        lg={1}
                        justifyContent="flex-end"
                        xs={1}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Typography className="redDot" />
                      </Grid>
                    )}
                  </Grid>
                )
              )}
          </>
        )}

        {!isNotificationsFetching && !isFarmNotificationsFetching && (
          <Box sx={{ display: 'flex' }} mt={3}>
            {latestMessages?.length > 0 ? (
              <CustomButton className="GotoMsg" onClick={sendToMessages}>
                Go to Messages
              </CustomButton>
            ) : (
              <Typography
                className="farmNoLatestMsg"
                variant="h6"
                sx={{ fontFamily: 'Synthese-Regular' }}
                pb={1}
              >
                Currently, there are no notifications.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
      {/* latest section end */}
    </StyledEngineProvider>
  );
}

export default DashboardProfile;
