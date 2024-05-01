import {
  Avatar,
  Box,
  Divider,
  Popover,
  Stack,
  StyledEngineProvider,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Images } from 'src/assets/images';
import { CustomButton } from 'src/components/CustomButton';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import NominationOfferForm from 'src/forms/NominationOfferForm';
import RemoveMessage from 'src/forms/RemoveMessage';
import './Messages.css';
import React from 'react';
import { toPascalCase } from 'src/utils/customFunctions';
import RestoreMessage from 'src/forms/RestoreMessage';

function MessageSectionHeader(props: any) {
  const {
    selected,
    setSelected,
    selectedFarmHeader,
    selectedTile,
    setSelectedTile,
    loaderInProgress,
    setLoaderInProgress,
    apiStatus,
    setApiStatus,
    apiStatusMsg,
    setApiStatusMsg,
  } = props;
  const [openRemoveMessage, setOpeRemoveMessage] = useState(false);
  const [openRestoreMessage, setOpenRestoreMessage] = useState(false);
  const [openNominationWrapper, setOpenNominationWrapper] = useState(false);
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);
  const [farmAnchorEl, setFarmAnchorEl] = useState<null | (EventTarget & Element)>(null);
  const [time, setTime] = useState<any>('');
  const [userRole, setUserRole] = React.useState<any>({});
  const id = farmAnchorEl ? 'farm-popover' : undefined;

  // get user details from local storage
  React.useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserRole(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  // get time from API
  useEffect(() => {
    if (
      selectedFarmHeader?.[0]?.timestamp !== null &&
      selectedFarmHeader?.[0]?.timestamp !== undefined
    ) {
      const timeData = new Date(selectedFarmHeader?.[0]?.timestamp)
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
      setTime(timeData.toLocaleString());
    }
  }, [selectedFarmHeader?.[0]?.timestamp]);

  // open nomination form
  const handleOpenNominationWrapper = () => {
    setOpenNominationWrapper(true);
  };

  // delete message handler
  const handleRemoveMessage = () => {
    setOpeRemoveMessage(true);
  };

  // delete message handler
  const handleRestoreMessage = () => {
    setOpenRestoreMessage(true);
  };

  if (selectedFarmHeader?.length === 0) {
    return <></>;
  }

  // view options
  let messageOptions;
  {
    selectedFarmHeader?.[0]?.memberRoleToTheFarm === 'Breeder'
      ? (messageOptions = ['Request Nomination', 'Delete'])
      : (messageOptions = ['Delete']);

    selectedFarmHeader?.[0]?.isActive === false && (messageOptions = ['Restore']);
  }

  const toggleFarmPopover = (event: React.SyntheticEvent) => {
    setCurrentFarmId(event.currentTarget.id);
    setFarmAnchorEl(event.currentTarget);
  };

  // function to handle request nomination and delete
  const mapFunction = (evt: React.SyntheticEvent, element: string) => {
    let executeFunction: any = null;
    switch (element) {
      case 'Request Nomination':
        executeFunction = handleOpenNominationWrapper;
        executeFunction();
        break;

      case 'Delete':
        executeFunction = handleRemoveMessage;
        executeFunction();
        break;

      case 'Restore':
        executeFunction = handleRestoreMessage;
        executeFunction();
        break;
    }
  };

  // onclick back handler
  const backClickHandler = () => {
    setSelectedTile(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      {/* header farm details */}
      <Box className="top-header">
        <Stack direction="row" className="section-head">
          <Box
            sx={{
              display: { lg: 'none', sm: 'none', xs: 'flex' },
              alignItems: 'center',
              minWidth: '34px',
            }}
            className="backIcon-Mobile"
          >
            <i
              className={`icon-Chevron-left ${loaderInProgress ? 'disableState' : ''}`}
              onClick={backClickHandler}
            ></i>
          </Box>
          <Box>
            <Avatar
              alt={
                selectedFarmHeader?.[0]?.isBroadcast === 1
                  ? selectedFarmHeader?.[0]?.fromMemberName
                  : selectedFarmHeader?.[0]?.farmName
              }
              src={
                selectedFarmHeader?.[0]?.isBroadcast === 1
                  ? selectedFarmHeader?.[0]?.senderImage
                    ? selectedFarmHeader?.[0]?.senderImage +
                      '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                    : Images.User
                  : selectedFarmHeader?.[0]?.farmImage
                  ? selectedFarmHeader?.[0]?.farmImage +
                    '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                  : Images.User
              }
              style={{ width: '40px', height: '40px' }}
            />
          </Box>
          <Box flexGrow={1} pl={1} pr={1}>
            <Typography variant="subtitle1">
              {selectedFarmHeader?.[0]?.isBroadcast === 1
                ? toPascalCase(selectedFarmHeader?.[0]?.fromMemberName)
                : toPascalCase(selectedFarmHeader?.[0]?.farmName)}
            </Typography>
            <Typography component="span">
              {selectedFarmHeader?.[0]?.farmStateName || ''}
              {selectedFarmHeader?.[0]?.farmStateName && ','}{' '}
              {selectedFarmHeader?.[0]?.farmCountryName || ''}{' '}
              {selectedFarmHeader?.[0]?.farmCountryName && '—'} Local time {time}
            </Typography>
          </Box>
          <Box
            className="request"
            sx={{ display: { lg: 'none', sm: 'flex', xs: 'flex' }, alignItems: 'center' }}
          >
            <i
              className={`icon-Dots-horizontal ${loaderInProgress ? 'disableState' : ''}`}
              onClick={toggleFarmPopover}
            />
          </Box>

          {selectedFarmHeader?.[0]?.memberRoleToTheFarm === 'Breeder' ? (
            <Box sx={{ display: { lg: 'block', sm: 'none', xs: 'none' } }}>
              <CustomButton
                className={`ListBtn requestNominationBtn ${loaderInProgress ? 'disableState' : ''}`}
                onClick={handleOpenNominationWrapper}
              >
                <i className="icon-Sparkles" /> Request nomination
              </CustomButton>
            </Box>
          ) : (
            ''
          )}

          <Box
            pl={2}
            sx={{ display: { lg: 'flex', sm: 'none', xs: 'none' }, alignItems: 'center' }}
          >
            {selectedFarmHeader?.[0]?.isActive && selectedFarmHeader?.[0]?.isBroadcast === 0 ? (
              <i
                className={`icon-delete ${loaderInProgress ? 'disableState' : ''}`}
                onClick={handleRemoveMessage}
                style={{ fontSize: '24px' }}
              />
            ) : (
              <img
                className={`icon-restore ${loaderInProgress ? 'disableState' : ''}`}
                src={Images.trash}
                alt="delete"
                onClick={handleRestoreMessage}
              />
            )}
          </Box>
          {/* WrapperDialog for Remove Message  */}
          <Box>
            <WrapperDialog
              open={openRemoveMessage}
              title={'Are You Sure?'}
              onClose={() => setOpeRemoveMessage(false)}
              body={RemoveMessage}
              deleteFarmId={selected}
              setSelected={setSelected}
              setSelectedTile={setSelectedTile}
              apiStatus={true}
              setApiStatus={setApiStatus}
              apiStatusMsg={apiStatusMsg}
              setApiStatusMsg={setApiStatusMsg}
            />
          </Box>
          {/* WrapperDialog for Restore Message  */}
          <Box>
            <WrapperDialog
              open={openRestoreMessage}
              title={'Are You Sure?'}
              onClose={() => setOpenRestoreMessage(false)}
              body={RestoreMessage}
              deleteRestoreId={selected}
              setSelected={setSelected}
              setSelectedTile={setSelectedTile}
            />
          </Box>
          {/* WrapperDialog for Remove Message end  */}
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
              {messageOptions?.map((element: any, index: number) => (
                <Box key={element + '-' + index} onClick={(evt) => mapFunction(evt, element)}>
                  {
                    <Box sx={{ paddingX: 2, paddingY: '12px' }} className={'pointerOnHover'}>
                      {element}
                    </Box>
                  }
                  <Box>{index < messageOptions.length - 1 ? <Divider /> : ''}</Box>
                </Box>
              ))}
            </Box>
          </Popover>
        </Stack>
      </Box>
      {/* WrapperDialog for Nomination Offer Form  */}
      <Box>
        <WrapperDialog
          open={openNominationWrapper}
          title={'Make a Nomination Offer'}
          onClose={() => setOpenNominationWrapper(false)}
          farmId={selectedFarmHeader?.[0]?.farmId}
          openNominationWrapper={openNominationWrapper}
          selectedFarmHeader={selectedFarmHeader}
          setLoaderInProgress={setLoaderInProgress}
          body={NominationOfferForm}
        />
      </Box>
      {/* WrapperDialog for Nomination Offer Form end */}
    </StyledEngineProvider>
  );
}

export default MessageSectionHeader;
