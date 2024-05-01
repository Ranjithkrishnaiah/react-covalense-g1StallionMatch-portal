import React, { useEffect, useState } from 'react';
import { StyledEngineProvider, Box, Typography, Grid, Divider, Stack, Avatar } from '@mui/material';
import './Messages.css';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { Images } from 'src/assets/images';
import { CustomButton } from 'src/components/CustomButton';
import OfferReceivedForm from 'src/forms/OfferReceivedForm';
import MessageAcceptOffer from 'src/forms/MessageAcceptOffer';
import { getDateForMessage } from 'src/utils/customFunctions';
import { NominationOfferProps } from 'src/@types/nominationOffer';
import useAuth from 'src/hooks/useAuth';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import { useGetFarmMembersQuery } from 'src/redux/splitEndpoints/getFarmMembers';
import { toPascalCase } from 'src/utils/customFunctions';
import {
  useGetMessageMediaDocsQuery,
  useGetMessageMediaIdQuery,
} from 'src/redux/splitEndpoints/getMessageMediaId';
import { VoidFunctionType } from 'src/@types/typeUtils';
import MessageImageLoading from 'src/components/MessageImageLoader';
import CustomPdfViewer from 'src/components/CustomPdfViewer';
import CustomImageViewer from 'src/components/CustomImageViewer';
import { toast } from 'react-toastify';

function MessageTemplate(props: any) {
  const [openOfferReceived, setOpenOfferReceived] = useState(false);
  const [openAcceptOffer, setOpenAcceptOffer] = useState(false);
  const [contactForm, setContactForm] = useState(false);
  const [time, setTime] = useState<any>('');
  const [userRole, setUserRole] = React.useState<any>({});
  const [nominationOfferData, setNominationOfferData] = React.useState<
    NominationOfferProps | any
  >();
  const [patchParams, setPatchParams] = React.useState<any>({});
  const [respondButton, setRespondButton] = useState(false);
  const [messageTitle, setMessageTitle] = useState<any>();
  const [receipentNameVar, setReceipentNameVar] = useState<any>();
  const [respondedValueState, setRespondedValueState] = React.useState<any>();
  const [openReport, setOpenReport] = React.useState(false);
  const [openDocs, setOpenDocs] = React.useState(false);
  const [mediaUrl, setMediaUrl] = React.useState<any>();
  const [title, setTitle] = React.useState('');

  // props
  const {
    getSelectedFarm,
    selected,
    selectedFarm,
    setSelectedFarm,
    tempFarmContact,
    message,
    prevMessage,
    selectedFarmDetails,
    loaderInProgress,
    setLoaderInProgress,
    isFileUpload,
    setIsFileUpload,
  } = props;

  const messageDate = getDateForMessage(message?.timestamp);
  const prevMessageDate = getDateForMessage(prevMessage?.item.timestamp);

  const { authentication } = useAuth();
  // API call for getting farms list
  const { data: userFarmListData } = useGetUsersFarmListQuery(null, { skip: !authentication });

  const farmID = selectedFarmDetails?.[0]?.farmId;
  // API call for getting farm members list
  const { data: farmMembersList, isSuccess } = useGetFarmMembersQuery(farmID, { skip: !farmID });

  // API call for getting MessageMediaId
  const mediaIdPayload = {
    mediaId: message?.mediauuid,
    mediaDownloadType: message?.mediaFileType?.includes('image') ? 'inline' : 'attachment',
  };
  // API call for images
  const {
    data: messageMediaData,
    isSuccess: messageMediaDataSuccess,
    isFetching: messageMediaDataFetching,
  } = useGetMessageMediaIdQuery(mediaIdPayload, {
    skip: !message?.mediaFileType?.includes('image'),
  });
  // API call for pdfs
  const {
    data: messageMediaBlob,
    isSuccess: messageMediaBlobSuccess,
    isFetching: messageMediaBlobFetching,
  } = useGetMessageMediaIdQuery(mediaIdPayload, {
    skip: !openReport,
  });
  // API call for docs
  const mediaDocsPayload = {
    mediaId: message?.mediauuid,
    mediaDownloadType: message?.mediaFileType?.includes('image') ? 'inline' : 'attachment',
    mediaFileName: message?.mediaFileName,
  };
  const {
    data: messageMediaDocs,
    isSuccess: messageMediaDocsSuccess,
    isFetching: messageMediaDocsFetching,
    isError: messageMediaDocsError,
  } = useGetMessageMediaDocsQuery(mediaDocsPayload, {
    skip: !openDocs,
  });

  const checkNomination =
    isSuccess && farmMembersList?.some((farm: any) => farm?.memberId === message?.senderId);
  // Media Upload in Messages
  const allowFileTypes = '.doc,.docx,application/pdf';
  const allowImagesTypes = '.jpg, .jpeg, .png';
  const mediaLink = message?.mediaUrl || '';
  const media =
    mediaLink.length > 0 ? mediaLink.substring(mediaLink.lastIndexOf('/') + 1).split('.') : [];
  const mediaName = media ? media[0] + '.' + media[1] : null;
  const mediaType = media ? media[1] : null;

  // on offer received
  const handleOpenOfferReceived = (data: any) => {
    setOpenOfferReceived(true);
    setNominationOfferData(data);
  };

  // method on accept offer
  const handleAcceptOffer = () => {
    setOpenAcceptOffer(true);
    setOpenOfferReceived(false);
  };

  // method onClick pdf open
  const handleOpenPdf = (message: any) => {
    setOpenReport(true);
    setTitle(message?.mediaFileName);
  };
  // method onClick docs open
  const handleOpenDocs = (message: any) => {
    setOpenDocs(true);
    setTitle(message?.mediaFileName);
  };
  // success handler
  useEffect(() => {
    setOpenDocs(false);
  }, [messageMediaDocsSuccess]);

  // loader handler
  useEffect(() => {
    if (messageMediaDocsFetching) {
      setLoaderInProgress(true);
    } else {
      setLoaderInProgress(false);
    }
  }, [messageMediaDocsFetching]);

  // error handler
  useEffect(() => {
    if (messageMediaDocsError) {
      toast.error('There was a problem in downloading a file', {
        autoClose: 2000,
      });
    }
  }, [messageMediaDocsError]);

  useEffect(() => {
    setMediaUrl(messageMediaBlob);
  }, [messageMediaBlob]);

  // set time form API
  useEffect(() => {
    if (message?.timestamp !== null && message?.timestamp !== undefined) {
      const timeData = new Date(message?.timestamp)
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
      setTime(timeData.toLocaleString());
    }
  }, [message?.timeStamp]);

  // get user details from API
  React.useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserRole(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  // logics for setting message title, name and respond offer button
  useEffect(() => {
    if (selectedFarmDetails?.[0]?.memberRoleToTheFarm === 'Breeder') {
      if (
        message?.isAccepted === false &&
        message?.isCounterOffer === false &&
        message?.isDeclined === false
      ) {
        setMessageTitle('You have sent a Nomination Offer.');
        setReceipentNameVar(message?.farmName);
        setRespondButton(false);
      } else if (
        //'You have been received a Counteroffer.'
        message?.isAccepted === false &&
        message?.isCounterOffer === true &&
        message?.isDeclined === false &&
        message?.senderId !== userRole?.id
      ) {
        setMessageTitle('You have been received a Counteroffer.');
        setReceipentNameVar(message?.fromMemberName);
        setRespondButton(true);
      } else if (
        //'You have been sent a Counteroffer.'
        message?.isAccepted === false &&
        message?.isCounterOffer === true &&
        message?.isDeclined === false &&
        message?.senderId === userRole?.id
      ) {
        setMessageTitle('You have been sent a Counteroffer.');
        setReceipentNameVar(message?.farmName);
        setRespondButton(false);
      } else if (
        // 'You have been recieved offer.'
        (message?.isAccepted === true || message?.isDeclined === true) &&
        message?.senderId !== userRole?.id
      ) {
        setReceipentNameVar(message?.fromMemberName);
        setRespondButton(false);
      } else if (
        // 'You have been sent offer.'
        (message?.isAccepted === true || message?.isDeclined === true) &&
        message?.senderId === userRole?.id
      ) {
        setReceipentNameVar(message?.farmName);
        setRespondButton(false);
      }
    } else if (selectedFarmDetails?.[0]?.memberRoleToTheFarm !== 'Breeder') {
      if (
        message?.isAccepted === false &&
        message?.isCounterOffer === false &&
        message?.isDeclined === false &&
        checkNomination
      ) {
        setMessageTitle('You have sent a Nomination Offer.');
        setReceipentNameVar(message?.farmName);
        setRespondButton(false);
      } else if (
        message?.isAccepted === false &&
        message?.isCounterOffer === false &&
        message?.isDeclined === false &&
        !checkNomination
      ) {
        setMessageTitle(`${toPascalCase(message?.senderName)} has sent a Nomination Offer.`);
        setReceipentNameVar(message?.farmName);
        setRespondButton(true);
      } else if (
        //'You have been received a Counteroffer.'
        message?.isAccepted === false &&
        message?.isCounterOffer === true &&
        message?.isDeclined === false &&
        !checkNomination
      ) {
        setMessageTitle('You have been received a Counteroffer.');
        setReceipentNameVar(message?.farmName);
        setRespondButton(true);
      } else if (
        //'You have been sent a Counteroffer.'
        message?.isAccepted === false &&
        message?.isCounterOffer === true &&
        message?.isDeclined === false &&
        checkNomination
      ) {
        setMessageTitle('You have been sent a Counteroffer.');
        setReceipentNameVar(message?.fromMemberName);
        setRespondButton(false);
      } else if (
        // 'You have been recieved offer(accepted/declined).'
        (message?.isAccepted === true || message?.isDeclined === true) &&
        !checkNomination
      ) {
        setReceipentNameVar(message?.farmName);
        setRespondButton(false);
      } else if (
        // 'You have been sent offer(accepted/declined).'
        (message?.isAccepted === true || message?.isDeclined === true) &&
        checkNomination
      ) {
        setReceipentNameVar(message?.fromMemberName);
        setRespondButton(false);
      }
    }

    //accepted/declined message title
    if (message?.isAccepted === true) {
      if (message?.isAccepted === true && message?.isClosed === true && message?.orderId === null) {
        setMessageTitle(
          'Congratulations. Your Nominations Offer has been accepted. (Pending Payment)'
        );
      } else {
        setMessageTitle('Congratulations. Your Nominations Offer has been accepted.');
      }
    } else if (message?.isDeclined === true) {
      setMessageTitle('Your Nomination Offer has been declined.');
    }

    //respond to offer button conditions
    if (
      message?.nominationRequestId &&
      (message?.isAccepted === true || message?.isDeclined === true || message?.isClosed === true)
    ) {
      setRespondButton(false);
    }
  }, [userRole, message, receipentNameVar, checkNomination, messageTitle, respondButton]);

  return (
    <StyledEngineProvider injectFirst>
      {/* divider  */}
      {(prevMessage.index === 0 || prevMessageDate !== messageDate) && (
        <Box pt={5}>
          <Typography variant="h6">{messageDate}</Typography>
          <Divider flexItem />
        </Box>
      )}

      {/* WrapperDialog for popup component */}
      <Box>
        <WrapperDialog
          open={openReport}
          title={title}
          onClose={() => setOpenReport(false)}
          body={IframeComp}
          mediaUrl={mediaUrl}
          fileType={message?.mediaFileType}
          blobFetching={messageMediaBlobFetching}
          dialogClassName={'pdf-view-modal'}
        />
      </Box>
      {/* WrapperDialog for popup component end */}

      {/* message template section */}
      {!message?.nominationRequestId ? (
        <>
          {message?.message === ' ' ? (
            ''
          ) : (
            <Box
              pt={4}
              sx={{ position: 'relative' }}
              className={`${
                selectedFarmDetails?.[0]?.isActive === false ? 'inactiveMessageBody' : ''
              }`}
            >
              <Stack direction="row">
                <Box>
                  <Avatar
                    alt={
                      message?.senderName === null ? message?.unregisteredName : message?.senderName
                    }
                    src={
                      message?.senderName === null
                        ? Images.User
                        : message?.senderImage
                        ? message?.senderImage +
                          '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                        : Images.User
                    }
                    style={{ width: '56px', height: '56px' }}
                  />
                </Box>
                <Box pl={2}>
                  <Typography variant="h5">
                    <span className="sender-name">
                      {selectedFarmDetails?.[0]?.isBroadcast === 1 && message?.fromName
                        ? `${message?.fromName && message?.fromName} (Admin)`
                        : message?.senderName === null
                        ? toPascalCase(message?.unregisteredName)
                        : toPascalCase(message?.senderName)}
                    </span>
                    {time}
                  </Typography>
                  {message?.mediaFileType && (
                    <Box className="media-file-icon">
                      {message?.mediaFileType?.includes('image/') ? (
                        <i className="icon-Photograph" />
                      ) : (
                        <i className="icon-Paper-clip" />
                      )}
                    </Box>
                  )}

                  {/* media details */}
                  <Box py={1}>
                    {message?.stallionTitle && selectedFarmDetails?.[0]?.isBroadcast === 0 ? (
                      <Typography variant="h4">
                        Stallion:{' '}
                        {message?.stallionTitle ? toPascalCase(message?.stallionTitle) : '-'}
                      </Typography>
                    ) : (
                      ''
                    )}
                    {message?.mareNameMsg && (
                      <>
                        <Typography variant="h4">
                          Mare:{' '}
                          {`${toPascalCase(message?.mareNameMsg)} (${message?.mareYobMsg}, ${
                            message?.mareCountryCodeMsg
                          })`}
                        </Typography>
                        <Typography variant="h4">
                          Broodmare Sire:{' '}
                          {`${toPascalCase(message?.broodmareSireNameMsg)} (${
                            message?.broodmareSireYobMsg
                          }, ${message?.broodmareSireCountryCodeMsg})`}
                        </Typography>
                      </>
                    )}
                    <Typography
                      variant="h5"
                      dangerouslySetInnerHTML={{ __html: message?.message }}
                    ></Typography>

                    {message?.mediaFileType?.includes('image/') ? (
                      messageMediaDataFetching ? (
                        <Box mt={3}>
                          <MessageImageLoading />
                        </Box>
                      ) : (
                        <a
                          // href={messageMediaData}
                          // download
                          // target="_blank"
                          onClick={(e: any) => handleOpenPdf(message)}
                          className="messagesImage"
                        >
                          <img src={messageMediaData} style={{ width: '264px', height: '176px' }} />
                        </a>
                      )
                    ) : message?.mediaFileType?.includes('application/pdf') ? (
                      <a
                        // href={message?.mediaUrl}
                        // download
                        // target="_blank"
                        onClick={(e: any) => handleOpenPdf(message)}
                        className="messagesURL"
                      >
                        {message?.mediaFileName}
                      </a>
                    ) : (
                      <a
                        // href={messageMediaBlob}
                        // download={title}
                        // target="_blank"
                        onClick={(e: any) => handleOpenDocs(message)}
                        className="messagesURL"
                      >
                        {message?.mediaFileName}
                      </a>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
        </>
      ) : (
        <Box
          mt={3}
          sx={{ position: 'relative' }}
          className={`respond-offer ${message?.isAccepted ? 'acceptedRequest' : ''} ${
            message?.isDeclined ? 'declinedRequest' : ''
          }`}
        >
          <Stack
            direction="row"
            className={`${
              selectedFarmDetails?.[0]?.isActive === false ? 'inactiveMessageBody' : ''
            }`}
          >
            <Box>
              <Avatar
                alt={message?.senderName}
                src={
                  message?.senderImage
                    ? message?.senderImage +
                      '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                    : Images.User
                }
                style={{ width: '56px', height: '56px' }}
              />
            </Box>
            <Box px={2}>
              <Box className="message-time">
                <Box className="acceptedTitle">
                  <Typography variant="h5">
                    <span>{messageTitle}</span>
                  </Typography>
                </Box>
                <Box className="acceptedTime">
                  <Typography variant="h5">{time}</Typography>
                </Box>
              </Box>
              {message?.mediaFileType && (
                <Box className="nomin-media-file-icon">
                  {message?.mediaFileType?.includes('image/') ? (
                    <i className="icon-Photograph" />
                  ) : (
                    <i className="icon-Paper-clip" />
                  )}
                </Box>
              )}
              <Box mt={2}>
                {selectedFarmDetails?.[0]?.memberRoleToTheFarm !== 'Breeder' && (
                  <Typography variant="h4">Farm: {toPascalCase(message?.farmName)}</Typography>
                )}
                <Typography variant="h4">Stallion: {toPascalCase(message?.horseName)}</Typography>
                <Typography variant="h4">
                  Mare:{' '}
                  {`${toPascalCase(message?.mareName)} (${message?.mareYob}, ${
                    message?.mareCountryCode
                  })`}
                </Typography>
                <Typography variant="h4">
                  Broodmare Sire:{' '}
                  {`${toPascalCase(message?.broodmareSireName)} (${message?.broodmareSireYob}, ${
                    message?.broodmareSireCountryCode
                  })`}
                </Typography>

                <Box mt={2}>
                  <Typography variant="h4">
                    {message?.isAccepted === true || message?.isDeclined === true
                      ? ''
                      : message?.isCounterOffer === true &&
                        message?.counterOfferPrice !== 0 &&
                        'Previous'}{' '}
                    Offer: {message?.currencySymbol}
                    {message?.isCounterOffer === true &&
                    (message?.isAccepted === true || message?.isDeclined === true)
                      ? message?.counterOfferPrice?.toLocaleString()
                      : message?.offerPrice?.toLocaleString()}
                  </Typography>

                  {message?.isAccepted === true || message?.isDeclined === true
                    ? ''
                    : message?.isCounterOffer === true &&
                      message?.counterOfferPrice !== 0 && (
                        <Typography variant="h4">
                          Counteroffer: {message?.currencySymbol}
                          {message?.counterOfferPrice?.toLocaleString()}
                        </Typography>
                      )}
                </Box>
              </Box>
              {/* media details */}
              <Box mt={2}>
                <Typography variant="h5">Hi {toPascalCase(receipentNameVar)},</Typography>
                <Typography
                  variant="h5"
                  dangerouslySetInnerHTML={{ __html: message?.message }}
                ></Typography>

                {message?.mediaFileType?.includes('image/') ? (
                  messageMediaDataFetching ? (
                    <Box mt={3}>
                      <MessageImageLoading />
                    </Box>
                  ) : (
                    <a
                      // href={messageMediaData}
                      // download
                      // target="_blank"
                      onClick={(e: any) => handleOpenPdf(message)}
                      className="messagesImage"
                    >
                      <img src={messageMediaData} style={{ width: '264px', height: '176px' }} />
                    </a>
                  )
                ) : message?.mediaFileType?.includes('application/pdf') ? (
                  <a
                    // href={message?.mediaUrl}
                    // download
                    // target="_blank"
                    onClick={(e: any) => handleOpenPdf(message)}
                    className="messagesURL"
                  >
                    {message?.mediaFileName}
                  </a>
                ) : (
                  <a
                    // href={messageMediaBlob}
                    // download={title}
                    // target="_blank"
                    onClick={(e: any) => handleOpenDocs(message)}
                    className="messagesURL"
                  >
                    {message?.mediaFileName}
                  </a>
                )}
              </Box>
              <Box mt={2}>
                <Typography variant="h5">Thanks!</Typography>
                <Typography variant="h5">{toPascalCase(message?.senderName)}</Typography>
              </Box>
              <Box mt={3}>
                {respondButton && (
                  <CustomButton
                    className="respond-btn"
                    onClick={() => handleOpenOfferReceived(message)}
                  >
                    Respond to Offer
                  </CustomButton>
                )}
              </Box>

              {/* WrapperDialog for Offer Received Form */}
              <Box>
                <WrapperDialog
                  open={openOfferReceived}
                  title={'Offer Received!'}
                  onClose={() => setOpenOfferReceived(false)}
                  openNominationMessage={'openOfferReceived'}
                  openAcceptOfferFunction={handleAcceptOffer}
                  nominationOfferData={nominationOfferData}
                  receipentNameVar={receipentNameVar}
                  setPatchParams={setPatchParams}
                  openOfferReceived={openOfferReceived}
                  respondedValueState={respondedValueState}
                  setRespondedValueState={setRespondedValueState}
                  subject={selectedFarmDetails?.[0]?.subject}
                  loaderInProgress={loaderInProgress}
                  setLoaderInProgress={setLoaderInProgress}
                  setIsFileUpload={setIsFileUpload}
                  body={OfferReceivedForm}
                />
              </Box>
              {/* WrapperDialog for Offer Received Form end */}
              {/* WrapperDialog for Message Accept Offer */}
              <Box>
                <WrapperDialog
                  open={openAcceptOffer}
                  title={respondedValueState === 'Accept' ? 'Accept Offer' : 'Decline Offer'}
                  onClose={() => setOpenAcceptOffer(false)}
                  patchParams={patchParams}
                  offerPrice={message?.offerPrice}
                  respondedValueState={respondedValueState}
                  setRespondedValueState={setRespondedValueState}
                  setLoaderInProgress={setLoaderInProgress}
                  body={MessageAcceptOffer}
                />
              </Box>
              {/* WrapperDialog for Message Accept Offer end */}
            </Box>
          </Stack>
        </Box>
      )}
    </StyledEngineProvider>
  );
}

const IframeComp = (
  onClose: VoidFunctionType,
  title: string,
  mediaUrl: any,
  fileType: string,
  blobFetching: boolean
) => {
  return (
    <div>
      <header className="App-header">
        {
          fileType?.includes('image') ? (
            <CustomImageViewer onClose={onClose} title={title} blobUrl={mediaUrl} />
          ) : fileType?.includes('application/pdf') ? (
            <CustomPdfViewer onClose={onClose} title={title} blobUrl={mediaUrl} />
          ) : (
            ''
          )
          // <CustomIframeViewer onClose={onClose} title={title} blobUrl={mediaUrl} />
        }
      </header>
    </div>
  );
};

export default MessageTemplate;
