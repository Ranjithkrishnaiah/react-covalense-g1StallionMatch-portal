import SendMessage from 'src/forms/SendMessage';
import MessageSectionHeader from './MessageSectionHeader';
import Message from './Message';
import { StyledEngineProvider, Box, Typography } from '@mui/material';
import './Messages.css';
import { usePatchTOSMessageMutation } from 'src/redux/splitEndpoints/patchMessageReadSplit';

function MessageSection(props: any) {
  const {
    selected,
    setSelected,
    selectedFarm,
    setSelectedFarm,
    getSelectedFarm,
    tempFarmContact,
    selectedFarmHeader,
    newMessageForm,
    setNewMessageForm,
    selectedTile,
    setSelectedTile,
    headerSelectedData,
    loaderInProgress,
    setLoaderInProgress,
    isFileUpload,
    setIsFileUpload,
    apiStatus,
    setApiStatus,
    apiStatusMsg,
    setApiStatusMsg,
  } = props;

  // API call for triggering TOS warning
  const [sendTOSMessage, responseTOSMessage] = usePatchTOSMessageMutation();
  const TosHandler = () => {
    let data = {
      channelId: headerSelectedData?.[0]?.channelId,
      status: 3,
    };
    sendTOSMessage(data);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box
        className={`${
          headerSelectedData?.[0]?.isActive === false
            ? 'messages-right inactiveMessageBody'
            : 'messages-right'
        } ${headerSelectedData?.[0]?.isBroadcast === 1 ? 'broadcastMessageBlock' : ''}`}
      >
        {/* message header section */}
        <Box className="message-section">
          {selected && (
            <MessageSectionHeader
              data={tempFarmContact}
              selectedFarmHeader={headerSelectedData}
              selectedTile={selectedTile}
              setSelectedTile={setSelectedTile}
              selected={selected}
              setSelected={setSelected}
              loaderInProgress={loaderInProgress}
              setLoaderInProgress={setLoaderInProgress}
              apiStatus={true}
              setApiStatus={setApiStatus}
              apiStatusMsg={apiStatusMsg}
              setApiStatusMsg={setApiStatusMsg}
            />
          )}
        </Box>
        {/* message header end */}
        {/* message section */}
        <Box>
          <Message
            tempFarmContact={tempFarmContact}
            selected={selected}
            selectedFarm={selectedFarm}
            selectedFarmDetails={headerSelectedData}
            setSelectedFarm={setSelectedFarm}
            getSelectedFarm={getSelectedFarm}
            newMessageForm={newMessageForm}
            setNewMessageForm={setNewMessageForm}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
            loaderInProgress={loaderInProgress}
            setLoaderInProgress={setLoaderInProgress}
            isFileUpload={isFileUpload}
            setIsFileUpload={setIsFileUpload}
          />
        </Box>
        {/* message section end */}
        {/* send message section */}
        <Box className="Type-msg">
          {headerSelectedData?.[0]?.isFlagged && (
            <Box className="privacyEmail-toast">
              <Typography variant="h5">
                <strong>Your privacy is important to us!</strong> As per{' '}
                <a href={`/about/terms`} target="_blank" className="terms-btn">
                  Terms of Service
                </a>
                , please do not share personal information.
              </Typography>
              &nbsp;&nbsp;&nbsp;
              <i className="icon-Cross" onClick={TosHandler} />
            </Box>
          )}
          <SendMessage
            selected={selected}
            selectedFarmDetails={headerSelectedData}
            loaderInProgress={loaderInProgress}
            setLoaderInProgress={setLoaderInProgress}
            isFileUpload={isFileUpload}
            setIsFileUpload={setIsFileUpload}
          />
        </Box>
        {/* send message section end */}
      </Box>
    </StyledEngineProvider>
  );
}

export default MessageSection;
