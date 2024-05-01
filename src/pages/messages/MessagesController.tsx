import React, { useEffect, useState } from 'react';
import SidebarSection from './SidebarSection';
import MessageSection from './MessageSection';
import { Grid, Container, Box } from '@mui/material';
import { useGetMessageFarmListQuery } from 'src/redux/splitEndpoints/getMessageFarmListSplit';
import { scrollToTop, toPascalCase } from 'src/utils/customFunctions';
import '../../components/WrappedDialog/dialogPopup.css';
import { useLocation } from 'react-router';
// MetaTags
import useMetaTags from 'react-metatags-hook';
import { useGetChannelStateQuery } from 'src/redux/splitEndpoints/getChannelState';
import Loader from 'src/components/Loader';
import { CustomToasterMessage } from 'src/components/toasterMessage/customToasterMessage';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { usePatchMessageAddChannelIdMutation } from 'src/redux/splitEndpoints/patchMessageAddChannelIdSplit';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';
import useAuth from 'src/hooks/useAuth';

function MessagesController() {
  const { authentication } = useAuth();
  const {
    data: getUserDetails,
    isFetching: isUserDetailsFetching,
    isSuccess: isUserDetailsSuccess,
  } = useAuthMeQuery(null, { skip: !authentication });
  // meta tags for messages
  useMetaTags(
    {
      title: `${getUserDetails?.fullName}'s Messages | Stallion Match`,
      description: `Stallion Match Messages. Discover the perfect breeding match - the data backed Stallion Match for the best pedigree.`,
    },
    [getUserDetails, isUserDetailsFetching]
  );
  const { pathname } = useLocation();
  const pathSplitForFarm = pathname.split('/');

  if (pathSplitForFarm?.length <= 2) {
    window.sessionStorage.removeItem('SessionMessageFrom');
    window.sessionStorage.removeItem('CurrentPage');
  }

  const isMessageFromPage = window.sessionStorage.getItem('SessionMessageFrom');
  const [sessionMessageFrom, setSessionMessageFrom] = useState(
    JSON.parse(window.sessionStorage.getItem('SessionMessageFrom') || '{}')
  );
  const [messageBackFrom, setMessageBackFrom] = useState('');
  const sessionPageState = window.sessionStorage.getItem('CurrentPage');

  React.useEffect(() => {
    if (sessionMessageFrom?.pageType === 'stallions') {
      setMessageBackFrom(
        '/stallions/' +
          toPascalCase(sessionMessageFrom?.name)?.toString() +
          '/' +
          sessionMessageFrom?.id +
          '/view'
      );
    }
    if (sessionMessageFrom?.pageType === 'stud-farm') {
      setMessageBackFrom(
        '/stud-farm/' +
          toPascalCase(sessionMessageFrom?.name)?.toString() +
          '/' +
          sessionMessageFrom?.id
      );
    }
  }, [sessionMessageFrom]);

  // API call for message add member by ChannelId
  const [addMessageChannelId, responseaddMessageChannelId] = usePatchMessageAddChannelIdMutation();
  useEffect(() => {
    if (pathname.split('/')[4] == 'anonymousUser') {
      let payloadData = {
        channelId: pathname.split('/')[3],
      };
      addMessageChannelId(payloadData).then((res) => {
        if (res) {
          const finalUrl = pathname.slice(0, pathname.lastIndexOf('/'));
          window.location.assign(finalUrl);
        }
      });
    }
  }, [pathname]);

  const [selected, setSelected] = useState<any>();
  const [selectedFarm, setSelectedFarm] = useState<any>();
  const [userObj, setUserObj] = React.useState<any>({});
  const [messageViewOptions, setMessageViewOptions] = React.useState('All Messages');
  const [messageSearchParam, setMessageSearchParam] = React.useState('');
  const [messageFilteredFarm, setMessageFilteredFarm] = React.useState('');
  const [newMessageForm, setNewMessageForm] = useState(false);
  const [selectedTile, setSelectedTile] = useState(false);
  const [locationParam, setLocationParam] = useState('');
  const [newMessageCreated, setNewMessageCreated] = useState(false);
  const [loaderInProgress, setLoaderInProgress] = useState(false);
  const [menuLoaderInProgress, setMenuLoaderInProgress] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false);

  const [apiStatus, setApiStatus] = useState(false);
  const [apiStatusMsg, setApiStatusMsg] = useState({});

  // set location from url params
  React.useEffect(() => {
    const res = window.location.pathname.split('/')[3];
    setLocationParam(res);
  }, [locationParam]);

  let channelId = locationParam;
  const { data: channelState, isSuccess } = useGetChannelStateQuery(channelId, {
    skip: !locationParam,
  });

  //called once component loaded to check to redirect to All Messages or Deleted
  React.useEffect(() => {
    if (messageViewOptions === 'All Messages' || messageViewOptions === 'Deleted') {
      if (channelState?.isActive === true) {
        window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
        let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
        setMessageViewOptions(resViewOptions ? resViewOptions : messageViewOptions);
        window.sessionStorage.setItem('SessionFilteredFarm', '');
        let resFilteredFarm: any = window.sessionStorage.getItem('SessionFilteredFarm');
        setMessageFilteredFarm(resFilteredFarm ? resFilteredFarm : '');
      } else if (channelState?.isActive === false) {
        window.sessionStorage.setItem('SessionViewOptions', 'Deleted');
        let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
        setMessageViewOptions(resViewOptions ? resViewOptions : messageViewOptions);
        window.sessionStorage.setItem('SessionFilteredFarm', '');
        let resFilteredFarm: any = window.sessionStorage.getItem('SessionFilteredFarm');
        setMessageFilteredFarm(resFilteredFarm ? resFilteredFarm : '');
      }
    }
  }, [channelState]);

  const handleSelected = (value: any) => {
    setSelected(value);
  };

  const getSelectedFarm = (value: any) => {
    setSelectedFarm(value);
  };

  //called once component loaded
  React.useEffect(() => {
    let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
    setMessageViewOptions(resViewOptions ? resViewOptions : messageViewOptions);
    let resFilteredFarm: any = window.sessionStorage.getItem('SessionFilteredFarm');
    setMessageFilteredFarm(resFilteredFarm ? resFilteredFarm : '');
  }, []);

  //called once new messages is created
  React.useEffect(() => {
    if (newMessageCreated === true) {
      window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
      let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
      setMessageViewOptions(resViewOptions ? resViewOptions : messageViewOptions);
      let resFilteredFarm: any = window.sessionStorage.getItem('SessionFilteredFarm');
      setMessageFilteredFarm(resFilteredFarm ? resFilteredFarm : '');
    }
  }, [newMessageCreated === true]);

  // messages API payload
  let messageParams = {
    sortBy:
      messageViewOptions === 'All Messages' ||
      messageViewOptions === 'Unread' ||
      messageViewOptions === 'Read' ||
      messageViewOptions === 'Deleted'
        ? messageViewOptions
        : 'All Messages',
    search: messageSearchParam,
    filterByFarm: messageFilteredFarm,
  };

  // API call to get messages lists
  const { data: contactDataApi, isLoading, isFetching } = useGetMessageFarmListQuery(messageParams);

  // get users data from local storage
  React.useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserObj(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  // loader handler
  useEffect(() => {
    if (isFetching == false) {
      setMenuLoaderInProgress(false);
    }
  }, [isFetching == false]);

  // scroll to top
  useEffect(() => {
    scrollToTop();
  }, []);

  // loader if data is fetching
  if (isLoading) {
    return <Loader />;
  }

  // get data with selected channel
  const headerSelectedData = contactDataApi?.filter(
    (contact: any) => contact?.channelId === selected
  );

  return (
    <Box>
      <Container className="message-wrapper">
        {/* toasterMessage component */}
        {apiStatus && (
          <CustomToasterMessage
            apiStatus={true}
            setApiStatus={setApiStatus}
            apiStatusMsg={apiStatusMsg}
            setApiStatusMsg={setApiStatusMsg}
          />
        )}
        <Box mt={4}>
          {isMessageFromPage && sessionPageState !== 'Messages' && (
            <Grid item lg={8} xs={12}>
              <HeaderBreadcrumbs
                heading="Profile"
                links={[
                  {
                    name:
                      sessionMessageFrom?.pageType === 'stallions'
                        ? 'Stallion Directory'
                        : 'Farm Directory',
                    href:
                      sessionMessageFrom?.pageType === 'stallions'
                        ? '/stallion-directory'
                        : '/farm-directory',
                  },
                  {
                    name: toPascalCase(sessionMessageFrom?.name)?.toString() || '',
                    href: messageBackFrom,
                  },
                  {
                    name:
                      sessionMessageFrom?.pageType === 'stallions'
                        ? 'Stallion Enquiry'
                        : 'Farm Enquiry',
                  },
                ]}
              />
            </Grid>
          )}
          {isMessageFromPage && sessionPageState === 'Messages' && (
            <Grid item lg={8} xs={12}>
              <HeaderBreadcrumbs
                heading="Profile"
                links={[
                  {
                    name:
                      sessionMessageFrom?.pageType === 'stallions'
                        ? 'Stallion Directory'
                        : 'Farm Directory',
                    href:
                      sessionMessageFrom?.pageType === 'stallions'
                        ? '/stallion-directory'
                        : '/farm-directory',
                  },
                  { name: 'Messages' },
                ]}
              />
            </Grid>
          )}
          {!isMessageFromPage && (
            <Grid item lg={8} xs={12}>
              <HeaderBreadcrumbs
                heading="Profile"
                links={[{ name: 'My Dashboard', href: '/dashboard' }, { name: 'Messages' }]}
              />
            </Grid>
          )}
        </Box>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={5}
            md={5}
            lg={4}
            className={`${selectedTile ? 'sidebar-sec hide-mobile' : 'show-mobile'}`}
          >
            {/* sidebar section component */}
            <SidebarSection
              tempFarmContact={contactDataApi}
              contactData={contactDataApi}
              selected={selected}
              setSelected={setSelected}
              handleSelected={handleSelected}
              getSelectedFarm={getSelectedFarm}
              selectedFarm={selectedFarm}
              messageViewOptions={messageViewOptions}
              setMessageViewOptions={setMessageViewOptions}
              setMessageSearchParam={setMessageSearchParam}
              newMessageForm={newMessageForm}
              setNewMessageForm={setNewMessageForm}
              selectedTile={selectedTile}
              setSelectedTile={setSelectedTile}
              setMessageFilteredFarm={setMessageFilteredFarm}
              headerSelectedData={headerSelectedData}
              setNewMessageCreated={setNewMessageCreated}
              loaderInProgress={loaderInProgress}
              setLoaderInProgress={setLoaderInProgress}
              menuLoaderInProgress={menuLoaderInProgress}
              setMenuLoaderInProgress={setMenuLoaderInProgress}
              apiStatus={true}
              setApiStatus={setApiStatus}
              apiStatusMsg={apiStatusMsg}
              setApiStatusMsg={setApiStatusMsg}
            />
            {/* sidebar section component end */}
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            md={7}
            lg={8}
            className={`${selectedTile ? 'message-sec show-mobile' : 'hide-mobile'}`}
          >
            {/* message section component */}
            <MessageSection
              tempFarmContact={contactDataApi}
              selected={selected}
              setSelected={setSelected}
              getSelectedFarm={getSelectedFarm}
              selectedFarm={selectedFarm}
              setSelectedFarm={setSelectedFarm}
              newMessageForm={newMessageForm}
              setNewMessageForm={setNewMessageForm}
              selectedTile={selectedTile}
              setSelectedTile={setSelectedTile}
              headerSelectedData={headerSelectedData}
              loaderInProgress={loaderInProgress}
              setLoaderInProgress={setLoaderInProgress}
              isFileUpload={isFileUpload}
              setIsFileUpload={setIsFileUpload}
              apiStatus={true}
              setApiStatus={setApiStatus}
              apiStatusMsg={apiStatusMsg}
              setApiStatusMsg={setApiStatusMsg}
            />
            {/* message section component end */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default MessagesController;
