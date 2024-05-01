import React, { useEffect, useState } from 'react';
import SidebarSectionHeader from './SidebarSectionHeader';
import Contact from './Contact';
import { Box, StyledEngineProvider } from '@mui/material';
import { SwipeableList, Type as ListType } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import './Messages.css';
import ContactMobile from './ContactMobile';
import { Spinner } from 'src/components/Spinner';
function SidebarSection(props: any) {
  const {
    selected,
    setSelected,
    handleSelected,
    selectedFarm,
    contactData,
    tempFarmContact,
    getSelectedFarm,
    messageViewOptions,
    setMessageViewOptions,
    setMessageSearchParam,
    newMessageForm,
    setNewMessageForm,
    selectedTile,
    setSelectedTile,
    setMessageFilteredFarm,
    headerSelectedData,
    setNewMessageCreated,
    loaderInProgress,
    setLoaderInProgress,
    menuLoaderInProgress,
    setMenuLoaderInProgress,
    apiStatus,
    setApiStatus,
    apiStatusMsg,
    setApiStatusMsg,
  } = props;

  const [messageFarmListData, setMessageFarmListData] = useState<any>();
  const [sortOptionSelected, setSortOptionSelected] = React.useState('');

  // set messages list
  useEffect(() => {
    setMessageFarmListData(contactData);
  }, []);

  // set selcted conversation from channel
  useEffect(() => {
    const channelSelected = window.location.pathname.split('/')[3];
    const result = tempFarmContact?.filter((o: any) => o?.channelId == channelSelected);
    setSelected(result?.[0]?.channelId);
    if (window.innerWidth > 767 && !channelSelected) {
      setSelected(tempFarmContact?.[0]?.channelId);
    }
  }, [tempFarmContact, window.location.pathname.split('/')[3]]);

  return (
    <StyledEngineProvider injectFirst>
      <Box className="sidebarSection">
        {/* sidebar header section */}
        <Box className="msg-head">
          <SidebarSectionHeader
            sortOptionSelected={sortOptionSelected}
            setSortOptionSelected={setSortOptionSelected}
            messageFarmListData={tempFarmContact}
            setMessageFarmListData={setMessageFarmListData}
            getSelectedFarm={getSelectedFarm}
            messageViewOptions={messageViewOptions}
            setMessageViewOptions={setMessageViewOptions}
            setMessageSearchParam={setMessageSearchParam}
            newMessageForm={newMessageForm}
            setNewMessageForm={setNewMessageForm}
            setMessageFilteredFarm={setMessageFilteredFarm}
            setSelected={setSelected}
            handleSelected={handleSelected}
            headerSelectedData={headerSelectedData}
            setNewMessageCreated={setNewMessageCreated}
            loaderInProgress={loaderInProgress}
            setLoaderInProgress={setLoaderInProgress}
            menuLoaderInProgress={menuLoaderInProgress}
            setMenuLoaderInProgress={setMenuLoaderInProgress}
          />
        </Box>
        {/* sidebar header section end */}
        <Box className="contact-pr">
          {/* sidebar threads section */}

          <Box sx={{ position: 'relative' }}>
            {menuLoaderInProgress ? (
              <Box className="sidebarLoader">
                <Spinner />
              </Box>
            ) : (
              ''
            )}
            <Box className="contact-box desktop-view no-msg">
              {tempFarmContact?.length === 0 ? (
                '0 Messages'
              ) : (
                <div>
                  <SwipeableList type={ListType.IOS}>
                    {tempFarmContact?.map((contact: any) => (
                      <Contact
                        key={contact?.channelId}
                        selected={selected}
                        setSelected={setSelected}
                        handleSelected={handleSelected}
                        data={contact}
                        setSelectedTile={setSelectedTile}
                        messageViewOptions={messageViewOptions}
                        setMessageViewOptions={setMessageViewOptions}
                        loaderInProgress={loaderInProgress}
                        setLoaderInProgress={setLoaderInProgress}
                        menuLoaderInProgress={menuLoaderInProgress}
                        apiStatus={true}
                        setApiStatus={setApiStatus}
                        apiStatusMsg={apiStatusMsg}
                        setApiStatusMsg={setApiStatusMsg}
                      />
                    ))}
                  </SwipeableList>
                </div>
              )}
            </Box>
            <Box className="contact-box mobile-view">
              {tempFarmContact?.length === 0 ? (
                '0 Messages'
              ) : (
                <SwipeableList type={ListType.IOS}>
                  {tempFarmContact?.map((contact: any) => (
                    <ContactMobile
                      key={contact?.channelId}
                      swipeId={contact?.farmId}
                      selected={selected}
                      setSelected={setSelected}
                      handleSelected={handleSelected}
                      data={contact}
                      selectedTile={selectedTile}
                      setSelectedTile={setSelectedTile}
                      messageViewOptions={messageViewOptions}
                      setMessageViewOptions={setMessageViewOptions}
                      setLoaderInProgress={setLoaderInProgress}
                      apiStatus={true}
                      setApiStatus={setApiStatus}
                      apiStatusMsg={apiStatusMsg}
                      setApiStatusMsg={setApiStatusMsg}
                    />
                  ))}
                </SwipeableList>
              )}
            </Box>
          </Box>
          {/* sidebar threads section end */}
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}

export default SidebarSection;
