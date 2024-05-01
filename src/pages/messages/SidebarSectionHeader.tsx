import * as React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Popover,
  SelectChangeEvent,
  Stack,
  StyledEngineProvider,
  Typography,
} from '@mui/material';
import './Messages.css';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import MessageFarmSearch from 'src/forms/MessageFarmSearch';
import { useGetMessageUnReadCountQuery } from 'src/redux/splitEndpoints/getMessageUnReadCountSplit';
import NewMessageForm from 'src/forms/NewMessageForm';
import { useGetEnquiredFarmsSplitQuery } from 'src/redux/splitEndpoints/getEnquiredFarmsSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import _ from 'lodash';
import { useEffect } from 'react';

//props type
type propsType = {
  sortOptionSelected: string;
  setSortOptionSelected: (a: string) => void;
  messageFarmListData: any;
  setMessageFarmListData: (a: any) => void;
  getSelectedFarm: any;
  messageViewOptions: any;
  setMessageViewOptions: (a: any) => void;
  setMessageSearchParam: (a: any) => void;
  newMessageForm: any;
  setNewMessageForm: (a: any) => void;
  setMessageFilteredFarm: (a: any) => void;
  setSelected: (a: any) => void;
  handleSelected: (a: any) => void;
  headerSelectedData: any;
  setNewMessageCreated: (a: any) => void;
  loaderInProgress: any;
  setLoaderInProgress: (a: any) => void;
  menuLoaderInProgress: any;
  setMenuLoaderInProgress: (a: any) => void;
};

function SidebarSectionHeader(props: propsType) {
  // props
  const {
    sortOptionSelected,
    setSortOptionSelected,
    messageFarmListData,
    setMessageFarmListData,
    getSelectedFarm,
    messageViewOptions,
    setMessageViewOptions,
    setMessageSearchParam,
    newMessageForm,
    setNewMessageForm,
    setMessageFilteredFarm,
    setSelected,
    handleSelected,
    headerSelectedData,
    setNewMessageCreated,
    loaderInProgress,
    setLoaderInProgress,
    menuLoaderInProgress,
    setMenuLoaderInProgress,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [searchValue, setSearchValue] = React.useState<any>();
  const [contactForm, setContactForm] = React.useState(false);
  const [titleForm, setTitleForm] = React.useState('Select Farm to Contact');
  const [messageViewOptionsFiltered, setMessageViewOptionsFiltered] = React.useState('');

  // API call for getting enquired farms list
  const { data: getEnquiredFarms } = useGetEnquiredFarmsSplitQuery();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // on close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // onchange sort
  const handleChange = (event: SelectChangeEvent) => {
    setSortOptionSelected(event.target.value as string);
  };
  const [userObj, setUserObj] = React.useState<any>({});

  // get user details from local storage
  React.useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserObj(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  // on search messages
  const onSearchMessages = (value: any) => {
    value.preventDefault();
    setMenuLoaderInProgress(true);
    setMessageSearchParam(searchValue);
  };
  const viewOptions1 = [
    {
      farmUuid: 'All Messages',
      farmName: 'All Messages',
    },
    {
      farmUuid: 'Unread',
      farmName: 'Unread',
    },
    {
      farmUuid: 'Read',
      farmName: 'Read',
    },
    {
      farmUuid: 'Deleted',
      farmName: 'Deleted',
    },
  ];

  const viewOptions2 = getEnquiredFarms;
  const sortRes = _.sortBy(viewOptions2, (item) => item.farmName.toLowerCase());

  function merge(a: any, b: any, i = 0) {
    return a.slice(0, i).concat(b, a.slice(i));
  }
  var result = merge(viewOptions1, sortRes, 3);
  const viewOptions = result;

  // function to handle view dropdown
  const mapFunction = (evt: React.SyntheticEvent, element: any) => {
    if (messageViewOptions !== element?.farmName) {
      setMenuLoaderInProgress(true);
    }

    let executeFunction: any = null;

    switch (element?.farmUuid) {
      case 'All Messages':
        executeFunction = handleAllMessages;
        executeFunction();
        break;

      case 'Unread':
        executeFunction = handleUnread;
        executeFunction();
        break;

      case 'Read':
        executeFunction = handleRead;
        executeFunction();
        break;

      case 'Deleted':
        executeFunction = handleDelete;
        executeFunction();
        break;

      default:
        executeFunction = handleDefault;
        executeFunction(element);
    }
  };

  // onclick All messages
  const handleAllMessages = () => {
    window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
    let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
    setMessageViewOptions(resViewOptions);
    window.sessionStorage.setItem('SessionFilteredFarm', '');
    setMessageFilteredFarm('');
    setMessageViewOptionsFiltered('');
    setAnchorEl(null);
    setMessageSearchParam('');
  };

  // onclick Unread
  const handleUnread = () => {
    window.sessionStorage.setItem('SessionViewOptions', 'Unread');
    let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
    setMessageViewOptions(resViewOptions);
    window.sessionStorage.setItem('SessionFilteredFarm', '');
    setMessageFilteredFarm('');
    setMessageViewOptionsFiltered('');
    setAnchorEl(null);
    setMessageSearchParam('');
  };

  // onclick Read
  const handleRead = () => {
    window.sessionStorage.setItem('SessionViewOptions', 'Read');
    let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
    setMessageViewOptions(resViewOptions);
    window.sessionStorage.setItem('SessionFilteredFarm', '');
    setMessageFilteredFarm('');
    setMessageViewOptionsFiltered('');
    setAnchorEl(null);
    setMessageSearchParam('');
  };

  // onclick Delete
  const handleDelete = () => {
    window.sessionStorage.setItem('SessionViewOptions', 'Deleted');
    let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
    setMessageViewOptions(resViewOptions);
    window.sessionStorage.setItem('SessionFilteredFarm', '');
    setMessageFilteredFarm('');
    setMessageViewOptionsFiltered('');
    setAnchorEl(null);
    setMessageSearchParam('');
  };

  // default view option
  const handleDefault = (farmElement: any) => {
    setMessageViewOptionsFiltered(farmElement?.farmName);
    window.sessionStorage.setItem('SessionViewOptions', farmElement?.farmName);
    let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
    setMessageViewOptions(resViewOptions);
    window.sessionStorage.setItem('SessionFilteredFarm', farmElement?.farmUuid);
    let resFilteredFarm: any = window.sessionStorage.getItem('SessionFilteredFarm');
    setMessageFilteredFarm(resFilteredFarm);
    setAnchorEl(null);
    setSelected('');
  };

  useEffect(() => {
    if (searchValue?.length === 0) {
      setMessageSearchParam('');
    }
  }, [searchValue]);

  const id = anchorEl ? 'simple-popover' : undefined;

  return (
    <StyledEngineProvider injectFirst>
      <Box>
        <Stack direction="row" className="msg-head-box">
          <Box flexGrow={1}>
            <Typography variant="h3">
              {messageViewOptionsFiltered === ''
                ? toPascalCase(messageViewOptions)
                : toPascalCase(messageViewOptionsFiltered)}{' '}
              ({messageFarmListData?.length})
            </Typography>
          </Box>
          <Box className="msg-head-btn">
            <Box>
              <Button
                onClick={() => setNewMessageForm(true)}
                className={`msg-btn ${
                  loaderInProgress || menuLoaderInProgress ? 'disableState' : ''
                }`}
                sx={{ marginRight: '8px' }}
              >
                New
              </Button>
            </Box>
            <Box>
              {/* WrapperDialog for New Message Form */}
              <Box>
                <WrapperDialog
                  open={newMessageForm}
                  title={'New Message'}
                  onClose={() => setNewMessageForm(false)}
                  subjectForMessage={'subject'}
                  newMessageForm={newMessageForm}
                  handleSelected={handleSelected}
                  setMessageViewOptions={setMessageViewOptions}
                  setMessageViewOptionsFiltered={setMessageViewOptionsFiltered}
                  setNewMessageCreated={setNewMessageCreated}
                  setLoaderInProgress={setLoaderInProgress}
                  body={NewMessageForm}
                />
              </Box>
              {/* WrapperDialog for New Message Form end */}
              <Button
                className={`msg-btn ${
                  loaderInProgress || menuLoaderInProgress ? 'disableState' : ''
                }`}
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
              >
                View <i className="icon-Chevron-down" />
              </Button>
              <Popover
                sx={{
                  display: { lg: 'flex', sm: 'flex', xs: 'flex' },
                  mt: '6px',
                  height: '350px',
                  zIndex: '4',
                }}
                id={id}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
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
                <Box className="view-menu">
                  {viewOptions?.map((element: any, index: number) => (
                    <Box
                      key={element + '-' + index}
                      onClick={(evt) => mapFunction(evt, element)}
                      className={`${
                        messageViewOptionsFiltered === ''
                          ? messageViewOptions === element?.farmUuid
                            ? 'view-menu-active'
                            : 'view-menu-inActive'
                          : messageViewOptionsFiltered === element?.farmName
                          ? 'view-menu-active'
                          : 'view-menu-inActive'
                      } ${element?.isFarmMember ? 'farmMember' : ''}`}
                    >
                      <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'popOverFilter'}>
                        {toPascalCase(element?.farmName)}
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </Box>
              </Popover>
            </Box>
          </Box>
        </Stack>
        <Box>
          <WrapperDialog
            open={contactForm}
            title={titleForm}
            onClose={() => setContactForm(false)}
            getSelectedFarm={getSelectedFarm}
            messageFarmSearch={'messageFarmSearch'}
            body={MessageFarmSearch}
          />
        </Box>
        <Box mt={3}>
          <Paper
            component="form"
            className={`msg-Search ${
              loaderInProgress || menuLoaderInProgress ? 'disableState' : ''
            }`}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              className="search"
              placeholder="Search messages"
              inputProps={{ 'aria-label': '' }}
              value={searchValue}
              onChange={(e: any) => {
                setSearchValue(e.target.value);
              }}
            />
            <IconButton
              type="submit"
              sx={{ p: '10px' }}
              aria-label="search"
              onClick={onSearchMessages}
            >
              <i className="icon-Search" />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}

export default SidebarSectionHeader;
