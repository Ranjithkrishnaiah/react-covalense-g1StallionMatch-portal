import { Avatar, Box, Stack, Typography, StyledEngineProvider } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Images } from 'src/assets/images';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CircleIcon from '@mui/icons-material/Circle';
import { toPascalCase } from 'src/utils/customFunctions';
import './Contact.css';
import { timeToDateConvert } from 'src/utils/customFunctions';
import {
  usePatchMessageReadFromUnreadMutation,
  usePatchMessageReadMutation,
} from 'src/redux/splitEndpoints/patchMessageReadSplit';
import { SwipeableListItem, SwipeAction, TrailingActions } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import NominationOfferForm from 'src/forms/NominationOfferForm';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import RemoveMessage from 'src/forms/RemoveMessage';

function ContactMobile(props: any) {
  const {
    swipeId,
    data,
    handleSelected,
    selected,
    setSelected,
    selectedFarm,
    selectedTile,
    setSelectedTile,
    messageViewOptions,
    setMessageViewOptions,
    setLoaderInProgress,
    apiStatus,
    setApiStatus,
    apiStatusMsg,
    setApiStatusMsg,
  } = props;

  const navigate = useNavigate();

  const date = timeToDateConvert(data?.timestamp);
  // API call for message to read
  const [sendMessageRead, response] = usePatchMessageReadMutation();
  const [sendMessageReadFromUnread, responseUnread] = usePatchMessageReadFromUnreadMutation();
  const [swipeStatus, setSwipeStatus] = React.useState<boolean>(false);
  const [openNominationWrapper, setOpenNominationWrapper] = React.useState(false);
  const [openRemoveMessage, setOpeRemoveMessage] = React.useState(false);
  const [userRole, setUserRole] = React.useState<any>({});
  const [locationParam, setLocationParam] = React.useState('');

  //set location from url params
  React.useEffect(() => {
    const res = window.location.pathname.split('/')[2];
    setLocationParam(res === (undefined || '') ? 'thread' : res);
  }, []);

  //get users details from url params
  React.useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserRole(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  let apiDataForRead = {
    channelId: data?.channelId,
  };

  // handleClick for contact thread to change
  const handleClickOnContact = () => {
    handleSelected(data?.channelId);
    let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
    if (resViewOptions === 'Unread') {
      sendMessageReadFromUnread(apiDataForRead).then((res) => {
        //if Unread, redirect to All Messages
        let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
        if (resViewOptions === 'Unread') {
          // window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
          // setMessageViewOptions('All Messages');
        } else {
          setMessageViewOptions(resViewOptions ? resViewOptions : messageViewOptions);
        }
        let locationParamRes =
          locationParam === undefined || 'undefined' ? 'thread' : locationParam;
        navigate(`/messages/${locationParamRes}/${data?.channelId}`);
      });
    } else {
      sendMessageRead(apiDataForRead).then((res) => {
        //if Unread, redirect to All Messages
        let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
        if (resViewOptions === 'Unread') {
          // window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
          // setMessageViewOptions('All Messages');
        } else {
          setMessageViewOptions(resViewOptions ? resViewOptions : messageViewOptions);
        }
        let locationParamRes =
          locationParam === undefined || 'undefined' ? 'thread' : locationParam;
        navigate(`/messages/${locationParamRes}/${data?.channelId}`);
      });
    }

    if (selected === data?.channelId) {
      setSelectedTile(true);
    } else {
      setSelectedTile(false);
      window.sessionStorage.setItem('CurrentPage', 'Messages');
    }
  };

  // on load mark read for selected channel
  React.useEffect(() => {
    if (selected === data?.channelId) {
      let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
      if (resViewOptions === 'Unread') {
        sendMessageReadFromUnread(apiDataForRead);
      } else {
        sendMessageRead(apiDataForRead);
      }
    }
  }, [selected]);

  // method for swipe functionality
  const trailingActions = () => (
    <TrailingActions>
      <>
        {data?.memberRoleToTheFarm === 'Breeder' ? (
          <SwipeAction
            destructive={false}
            onClick={() => {
              setOpenNominationWrapper(true);
              setSwipeStatus(false);
            }}
          >
            <Stack direction="column" className="rn-contact">
              <i className="icon-Sparkles" style={{ fontSize: '28px' }} />
              <Typography variant="h5">Request Nomination</Typography>
            </Stack>
          </SwipeAction>
        ) : (
          ''
        )}
      </>
      <>
        <SwipeAction
          destructive={false}
          onClick={() => {
            setOpeRemoveMessage(true);
            setSwipeStatus(false);
          }}
        >
          <Stack direction="column" className="dlt-contact">
            <i className="icon-delete" style={{ fontSize: '24px' }} />
            <Typography variant="h5">Delete</Typography>
          </Stack>
        </SwipeAction>
      </>
    </TrailingActions>
  );

  // method for swipe end
  const handleSwipeEnd = (e: any) => {
    if (e > 55) {
      setSwipeStatus(true);
    }
  };

  // class for inactive state
  const inactiveState = data?.isActive === false ? 'inactiveState' : 'activeState';

  return (
    <StyledEngineProvider injectFirst>
      <SwipeableListItem
        fullSwipe={false}
        threshold={0.5}
        trailingActions={data?.isActive === false ? '' : trailingActions()}
        blockSwipe={swipeStatus}
        onSwipeProgress={handleSwipeEnd}
        className={swipeStatus ? `hidePointerEvents ${inactiveState}` : `${inactiveState}`}
      >
        {/* profile details */}
        <List
          className={
            selected === data?.channelId
              ? `contact-selected ${inactiveState}`
              : `contact-unselected ${inactiveState}`
          }
          onClick={handleClickOnContact}
        >
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar
                alt={
                  data?.memberRoleToTheFarm === 'Breeder' && data?.isBroadcast === 0
                    ? data?.farmName
                    : data?.fromMemberName
                }
                src={
                  data?.memberRoleToTheFarm === 'Breeder' && data?.isBroadcast === 0
                    ? data?.farmImage
                      ? data?.farmImage + '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                      : Images.User
                    : data?.senderImage
                    ? data?.senderImage + '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                    : Images.User
                }
                style={{ width: '56px', height: '56px' }}
              />
            </ListItemAvatar>
            <ListItemText
              sx={{ marginLeft: '1rem' }}
              primary={
                <Stack direction={{ lg: 'row', sm: 'column', xs: 'row' }}>
                  <Box flexGrow={1} mr={1} sx={{ display: 'flex' }}>
                    {/* if memberRoleToTheFarm === 'breeder', display farmName
                    if memberRoleToTheFarm === 'farmowner' or 'farmMember', display farmMember */}
                    {data?.memberRoleToTheFarm === 'Breeder' ? (
                      <Typography variant="h4">
                        {data?.isBroadcast === 1
                          ? toPascalCase(data?.fromMemberName)
                          : toPascalCase(data?.farmName)}
                      </Typography>
                    ) : (
                      <Typography variant="h4">{toPascalCase(data?.fromMemberName)}</Typography>
                    )}
                    {data?.isActive && (
                      <Typography>
                        {data?.unreadCount >= 1 ? <CircleIcon className="unread" /> : ''}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h5">{date}</Typography>
                  </Box>
                </Stack>
              }
              secondary={
                <Stack>
                  <Box>
                    <Typography
                      variant="h5"
                      color="text.primary"
                      dangerouslySetInnerHTML={{ __html: data?.message }}
                    ></Typography>
                  </Box>
                  <Box sx={{ pt: '5px' }}>
                    <Typography variant="h6">
                      {data?.subject} - Sent {date}
                    </Typography>
                  </Box>
                </Stack>
              }
            />
          </ListItem>
        </List>
        {/* profile details end */}
        {/* WrapperDialog for Nomination Offer Form */}
        {openNominationWrapper && (
          <Box>
            <WrapperDialog
              open={openNominationWrapper}
              title={'Make a Nomination Offer'}
              onClose={() => setOpenNominationWrapper(false)}
              farmId={data?.farmId}
              openNominationWrapper={openNominationWrapper}
              selectedFarmHeader={data}
              setLoaderInProgress={setLoaderInProgress}
              body={NominationOfferForm}
            />
          </Box>
        )}
        {/* WrapperDialog for Remove Message Form */}
        <Box>
          <WrapperDialog
            open={openRemoveMessage}
            title={'Are You Sure?'}
            onClose={() => setOpeRemoveMessage(false)}
            body={RemoveMessage}
            deleteFarmId={data?.farmId}
            setSelected={setSelected}
            setSelectedTile={setSelectedTile}
            apiStatus={true}
            setApiStatus={setApiStatus}
            apiStatusMsg={apiStatusMsg}
            setApiStatusMsg={setApiStatusMsg}
          />
        </Box>
      </SwipeableListItem>
    </StyledEngineProvider>
  );
}

export default ContactMobile;