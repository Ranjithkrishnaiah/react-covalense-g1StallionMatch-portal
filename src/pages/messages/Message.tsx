import { Box, Grid, StyledEngineProvider, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { CustomButton } from 'src/components/CustomButton';
import { useGetAllMessagesQuery } from 'src/redux/splitEndpoints/getAllMessageSplit';
import { ROUTES } from 'src/routes/paths';
import MessageTemplate from './MessageTemplate';
import './Messages.css';
import { Spinner } from 'src/components/Spinner';
import { usePatchMessageReadFromUnreadMutation, usePatchMessageReadMutation } from 'src/redux/splitEndpoints/patchMessageReadSplit';

function Message(props: any) {
  const navigate = useNavigate();

  const {
    getSelectedFarm,
    selected,
    selectedFarm,
    selectedFarmDetails,
    setSelectedFarm,
    tempFarmContact,
    newMessageForm,
    setNewMessageForm,
    selectedTile,
    setSelectedTile,
    loaderInProgress,
    setLoaderInProgress,
    isFileUpload,
    setIsFileUpload,
  } = props;

  const selectedChannelId = selectedFarmDetails?.[0]?.channelId;
  // API call to get all messages based on channelId
  const { data: messagesByFarm, isSuccess } = useGetAllMessagesQuery(selectedChannelId, {
    skip: !selectedChannelId,
  });

  // API call for message to read
  const [sendMessageRead, responseSendMessageRead] = usePatchMessageReadMutation();
  const [sendMessageReadFromUnread, responseUnread] = usePatchMessageReadFromUnreadMutation();

  useEffect(() => {
    if (isSuccess) {
      if (!isFileUpload) {
        setLoaderInProgress(false);
      }
      setSelectedTile(true);
      //make chat unread after API load
      let paramForRead = {
        channelId: selectedFarmDetails?.[0]?.channelId,
      };
      let resViewOptions: any = window.sessionStorage.getItem('SessionViewOptions');
      if (resViewOptions === 'Unread') {
        sendMessageReadFromUnread(paramForRead);
      } else {
        sendMessageRead(paramForRead);
      }
    }
  }, [messagesByFarm]);

  let prevMessage;

  const messagesEndRef = useRef<any>(null);

  // method for scroll to bottom in conversation chat
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }, 250);
  };

  // scroll to bottom in chat conversation
  useEffect(() => {
    if (messagesEndRef.current) {
      scrollToBottom();
    }
  }, [messagesByFarm]);

  // remove empty message
  const updatedMessagesList = messagesByFarm?.filter((message: any) => message?.message !== ' ');

  return (
    <StyledEngineProvider injectFirst>
      {/* loader */}
      {loaderInProgress ? (
        <Box className="message-loader">
          <Spinner />
        </Box>
      ) : (
        ''
      )}

      {/* message section */}
      <Box className={`messages ${loaderInProgress ? 'disableState' : ''}`} ref={messagesEndRef}>
        {tempFarmContact?.length === 0 ? (
          <Grid container>
            <Grid item lg={10} sm={11} xs={12} sx={{ margin: 'auto' }}>
              <Box className="welcome-msgs">
                <Box>
                  <Typography variant="h2">Welcome to Messages</Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="h6">
                    Within Messages, contact a farm with any questions regarding a potential mating.
                    Attaching additional information like photos, reports, pedigree page, etc.,
                    within a message will assist farms in analysing a mating.
                  </Typography>
                </Box>
                <Box mt={5}>
                  <CustomButton
                    type="search"
                    className="new-search-button"
                    onClick={() => navigate(ROUTES.STALLION_SEARCH)}
                  >
                    New Search
                  </CustomButton>
                  <CustomButton
                    type="search"
                    className="new-msg-button"
                    onClick={() => setNewMessageForm(true)}
                  >
                    New Message
                  </CustomButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container>
            {selected && (
              <Grid item lg={9} sm={11} xs={12} sx={{ margin: 'auto' }}>
                {updatedMessagesList?.map((message: any, index: number) => {
                  if (index === 0) {
                    prevMessage = {
                      index: index,
                      item: updatedMessagesList[index],
                    };
                  } else {
                    prevMessage = {
                      index: index,
                      item: updatedMessagesList[index - 1],
                    };
                  }

                  return (
                    <MessageTemplate
                      key={message?.messageId}
                      message={message}
                      prevMessage={prevMessage}
                      selected={selected}
                      selectedFarmDetails={selectedFarmDetails}
                      loaderInProgress={loaderInProgress}
                      setLoaderInProgress={setLoaderInProgress}
                      isFileUpload={isFileUpload}
                      setIsFileUpload={setIsFileUpload}
                    />
                  );
                })}
              </Grid>
            )}
          </Grid>
        )}
      </Box>
      {/* message section end */}
    </StyledEngineProvider>
  );
}

export default Message;
