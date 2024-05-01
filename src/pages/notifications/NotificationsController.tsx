import { Container, Grid, Typography, StyledEngineProvider } from '@mui/material';
import { Box } from '@mui/system';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { NotificationsList } from 'src/@types/notification';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { useNotificationsQuery } from 'src/redux/splitEndpoints/getNotificationsSplit';
import BoostStallionProfile from '../../forms/BoostStallionProfile';
import Header from './Header';
import './notification.css';
import { usePatchNotificationsReadMutation } from 'src/redux/splitEndpoints/patchNotificationsReadSplit';
import Loader from 'src/components/Loader';
import { scrollToTop } from 'src/utils/customFunctions';
import NotificationsTemplate from './NotificationsTemplate';
import ResendEmail from 'src/forms/ResendEmail';
// MetaTags
import useMetaTags from 'react-metatags-hook';
import { CustomToasterMessage } from 'src/components/toasterMessage/customToasterMessage';
import useAuth from 'src/hooks/useAuth';
import { useGetProfileImageQuery } from 'src/redux/splitEndpoints/addUserProfileImage';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';

function NotificationsController() {
  const { authentication } = useAuth();
  const {data: getUserDetails, isFetching: isUserDetailsFetching, isSuccess: isUserDetailsSuccess} = useAuthMeQuery(null, { skip: !authentication });
  
  // MetaTags for notifications
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const notificationsUrl = `${BaseAPI}user/notifications`;
  const notificationImage = process.env.REACT_APP_NOTIFICATION_IMAGE;
  useMetaTags(
    {
      title: `${getUserDetails?.fullName}'s Notifications | Stallion Match`,
      description: `Stallion Match notifications. Discover the perfect breeding match - the data backed Stallion Match for the best pedigree.`,
      openGraph: {
        title: `Notifications | Stallion Match`,
        description: `Stallion Match notifications. Discover the perfect breeding match - the data backed Stallion Match for the best pedigree.`,
        site_name: 'Stallion Match',
        url: notificationsUrl,
        type: 'business.business',
        image: notificationImage,
      },
    },
    []
  );

  const [notificationsList, setNotificationsList] = useState<NotificationsList[]>();
  const [sortOptionSelected, setSortOptionSelected] = React.useState('Most Recent');
  const [boostStallionDialog, setBoostStallionDialog] = useState(false);
  const [boostStallionDialogTitle, setBoostStallionDialogTitle] =
    useState('Boost Stallion Profile');

  const [notificationPatchId, setNotificationPatchId] = useState('');

  const [openConfirmAccount, setOpenConfirmAccount] = useState(false);

  const [apiStatus, setApiStatus] = useState(false);
  const [apiStatusMsg, setApiStatusMsg] = useState({});

  const notificationsStartRef = useRef<any>(null);

  // method for scroll the div notificationsStartRef to top
  const scrollToTopDiv = () => {
    setTimeout(() => {
      notificationsStartRef.current.scrollTop = 0;
    }, 250);
  };

  // scroll to top on sort selected
  useEffect(() => {
    if (notificationsStartRef.current) {
      scrollToTopDiv();
    }
  }, [sortOptionSelected]);

  const notificationRef = useRef<NotificationsList[]>();

  // API call for getting notifications lists
  let notificationsParams = {
    sortBy: sortOptionSelected,
    order: 'DESC',
  };
  const { data: notificationsRes, isLoading } = useNotificationsQuery(notificationsParams);

  

  // API call to get user details
  const { data: userInfo } = useGetProfileImageQuery(null, {
    skip: !authentication,
    refetchOnMountOrArgChange: true,
  });

  // set notifications list
  useEffect(() => {
    setNotificationsList(notificationsRes?.data);
    notificationRef.current = notificationsRes?.data;
  }, [notificationsRes]);

  // API call for notifications mark to Read
  let notificationsPatchParams = {
    notificationUuid: notificationPatchId,
  };
  const [patchNotificationsRead, patchResponse] = usePatchNotificationsReadMutation();

  const patchNotificationsReadHandler = (e: any) => {
    setNotificationPatchId(e);
  };

  // onclose boost profile
  const onCloseHandler = () => {
    setBoostStallionDialog(false);
    setBoostStallionDialogTitle('Boost Stallion Profile');
  };

  // onload scroll to top
  useEffect(() => {
    scrollToTop();
  }, []);

  // call patch API to mark to read when noitficationID is selected
  useEffect(() => {
    if (notificationPatchId) {
      patchNotificationsRead(notificationsPatchParams);
    }
  }, [notificationPatchId]);

  // loader when data is fetching
  if (isLoading) {
    return <Loader />;
  }

  // props for notification template
  const notificationsTemplateProps = {
    patchNotificationsReadHandler,
    setBoostStallionDialog,
    openConfirmAccount,
    setOpenConfirmAccount,
    patchResponse,
    userInfo,
    apiStatus,
    setApiStatus,
    apiStatusMsg,
    setApiStatusMsg,
  };

  // filter read notifications
  const presentReadMessages = notificationsList?.some(
    (notification: any) => notification?.isRead === true
  );
  // filter unread notifications
  const presentUnreadMessages = notificationsList?.some(
    (notification: any) => notification?.isRead === false
  );

  return (
    <StyledEngineProvider injectFirst>
      <Box pb={5}>
        <Container>
          {/* toast message */}
          {apiStatus && (
            <CustomToasterMessage
              apiStatus={true}
              setApiStatus={setApiStatus}
              apiStatusMsg={apiStatusMsg}
              setApiStatusMsg={setApiStatusMsg}
            />
          )}
          <Grid container>
            <Grid item lg={8} sm={10} xs={12} sx={{ m: 'auto' }}>
              {/* header component */}
              <Header
                sortOptionSelected={sortOptionSelected}
                setSortOptionSelected={setSortOptionSelected}
                setNotificationsList={setNotificationsList}
                data={notificationRef.current}
              />
              {/* header component end */}

              <Box mt={2} ref={notificationsStartRef}>
                {notificationsList?.length !== 0 && notificationsList !== undefined ? (
                  <>
                    {/* New section starts */}

                    <Box py={1} className={`${sortOptionSelected === 'Read' ? 'hide' : 'show'}`}>
                      <Typography variant="h5">
                        <b>New</b>
                      </Typography>
                    </Box>
                    <Box className="notification-block">
                      <Box
                        className={`${
                          sortOptionSelected === 'Read' ? 'notification hide' : 'notification show'
                        }`}
                      >
                        {presentUnreadMessages ? (
                          <div>
                            {notificationsList?.map((notification, i) => (
                              <div key={i}>
                                {notification.isRead === false && (
                                  <NotificationsTemplate
                                    key={i}
                                    notification={notification}
                                    {...notificationsTemplateProps}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Typography variant="h5" pb={2}>
                            No New Notifications
                          </Typography>
                        )}
                      </Box>
                      {/* New section ends */}

                      {/* Read section starts */}
                      <Box mt={`${sortOptionSelected === 'Read' ? 1 : 5}`} py={1}>
                        <Typography variant="h5">
                          <b>Read</b>
                        </Typography>
                      </Box>

                      <Box className="notification">
                        {presentReadMessages ? (
                          <div>
                            {notificationsList?.map((notification, i) => (
                              <div key={i}>
                                {notification.isRead === true && (
                                  <NotificationsTemplate
                                    key={i}
                                    notification={notification}
                                    {...notificationsTemplateProps}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Typography variant="h5" pb={2}>
                            No Read Notifications
                          </Typography>
                        )}
                      </Box>
                      {/* Read section ends */}

                      {/* New section on selected Read filter starts */}
                      <Box py={1} className={`${sortOptionSelected === 'Read' ? 'show' : 'hide'}`}>
                        <Typography variant="h5">
                          <b>New</b>
                        </Typography>
                      </Box>

                      <Box
                        className={`${
                          sortOptionSelected === 'Read' ? 'notification show' : 'notification hide'
                        }`}
                      >
                        {presentUnreadMessages ? (
                          <div>
                            {notificationsList?.map((notification, i) => (
                              <div key={i}>
                                {notification.isRead === false && (
                                  <NotificationsTemplate
                                    key={i}
                                    notification={notification}
                                    {...notificationsTemplateProps}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Typography variant="h5">No New Notifications</Typography>
                        )}
                      </Box>
                    </Box>
                    {/* New section on selected Read filter ends */}
                  </>
                ) : (
                  'No Notifications'
                )}
              </Box>

              {/* WrapperDialog for Boost Stallion Profile */}
              <Box>
                <WrapperDialog
                  open={boostStallionDialog}
                  title={boostStallionDialogTitle}
                  onClose={onCloseHandler}
                  body={BoostStallionProfile}
                  setBoostStallionDialogTitle={setBoostStallionDialogTitle}
                  boostStallionDialogTitle={boostStallionDialogTitle}
                  boostStallionDialog={boostStallionDialog}
                  apiStatus={true}
                  setApiStatus={setApiStatus}
                  apiStatusMsg={apiStatusMsg}
                  setApiStatusMsg={setApiStatusMsg}
                  dialogClassName={'dialogPopup notification-popup'}
                />
              </Box>
              {/* WrapperDialog for Boost Stallion Profile end */}

              {/* WrapperDialog for Resend Email */}
              <Box>
                <WrapperDialog
                  open={openConfirmAccount}
                  title="Confirm Your Account"
                  onClose={() => setOpenConfirmAccount(false)}
                  body={ResendEmail}
                  confirmYourAcccount={''}
                  apiStatus={true}
                  setApiStatus={setApiStatus}
                  apiStatusMsg={apiStatusMsg}
                  setApiStatusMsg={setApiStatusMsg}
                />
              </Box>
              {/* WrapperDialog for Resend Email end */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </StyledEngineProvider>
  );
}

export default NotificationsController;
