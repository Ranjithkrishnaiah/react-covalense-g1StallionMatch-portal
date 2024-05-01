import { Box, Grid, Stack, StyledEngineProvider, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { usePostMessageAttachmentMutation } from 'src/redux/splitEndpoints/messageImageUpload';
import { usePostUnRegisteredMessageMutation } from 'src/redux/splitEndpoints/postUnRegisteredMessage';
import { usePatchUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import '../pages/messages/Messages.css';
import { v4 as uuid } from 'uuid';
import { useMessageMediaUploadStatusMutation } from 'src/redux/splitEndpoints/messageMediaUploadStatus';

function SendMessage(props: any) {
  const fileuuid: any = uuid();

  const {
    selected,
    selectedFarmDetails,
    loaderInProgress,
    setLoaderInProgress,
    isFileUpload,
    setIsFileUpload,
  } = props;
  const [enteredText, setEnteredText] = useState('');
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [locationSubject, setLocationSubject] = useState('');
  const [imageFile, setImageFile] = useState<File>();
  const [selectedFile, setFile] = useState<any>();
  const [preview, setPreview] = useState<any>('');
  const [allowFileTypes, setAllowFileTypes] = useState<any>('');

  const [userObj, setUserObj] = useState<any>({});
  // API call for post message media
  const [postUserMessageFarmList, response] = usePatchUserMessageMutation();
  const [postUnRegisteredMessageData, responseUnregistered] = usePostUnRegisteredMessageMutation();
  // API call for post messages with media
  const [sendMessageAttachement, responSesendMessageAttachement] =
    usePostMessageAttachmentMutation();
  const [selectedType, SetSelectedType] = useState<any>('');
  const [mediauuid, SetMediauuid] = useState<any>('');
  const [presignedProfilePath, setPresignedProfilePath] = useState<any>();
  // API call to get media upload status
  const [mediaUploadSuccess, mediaUploadSuccessResponse] =
    useMessageMediaUploadStatusMutation<any>();
  // get sessionStorage value for stallion
  const [sessionMessageFrom, setSessionMessageFrom] = useState(
    JSON.parse(window.sessionStorage.getItem('SessionMessageFrom') || '{}')
  );
  const sessionPageState = window.sessionStorage.getItem('CurrentPage');

  // set user details from local storage
  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserObj(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  // set subject from url params
  useEffect(() => {
    const res = window.location.pathname.split('/')[2];
    setLocationSubject(res);
  }, []);

  const subjectRes =
    locationSubject === 'farm'
      ? 'Farm enquiry'
      : locationSubject === 'stallion'
      ? 'Stallion enquiry'
      : 'General enquiry';

  // message media payload
  let messageApiData: any = {
    message: enteredText,
    farmId: selectedFarmDetails?.[0]?.farmId,
    stallionId:
      sessionMessageFrom?.pageType === 'stallions' && sessionPageState !== 'Messages'
        ? sessionMessageFrom?.id
        : selectedFarmDetails?.[0]?.stallionId || '',
    subject: selectedFarmDetails?.[0]?.subject,
    channelId: selectedFarmDetails?.[0]?.channelId,
    fromMemberUuid: selectedFarmDetails?.[0]?.fromMemberUuid,
    medias: [
      {
        mediauuid,
      },
    ],
  };

  // unregistered message payload
  const unregisteredMessageApiData: any = {
    message: enteredText,
    farmId: selectedFarmDetails?.[0]?.farmId,
    stallionId:
      sessionMessageFrom?.pageType === 'stallions' && sessionPageState !== 'Messages'
        ? sessionMessageFrom?.id
        : selectedFarmDetails?.[0]?.stallionId || '',
    subject: selectedFarmDetails?.[0]?.subject,
    channelId: selectedFarmDetails?.[0]?.channelId,
    fromName: selectedFarmDetails?.[0]?.fromMemberName,
    fullName: userObj?.fullName,
    email: userObj?.email,
    fromEmail: selectedFarmDetails?.[0]?.fromMemberEmail,
    countryName: userObj?.memberaddress?.[0]?.countryName
      ? userObj?.memberaddress?.[0]?.countryName
      : 'Australia',
  };

  // method to submit message to key enter
  const handleEnterkey = (e: any) => {
    if (e.keyCode == 13 && enteredText?.trim().length > 0) {
      setLoaderInProgress(true);
      if (selectedFarmDetails?.[0]?.isRegistered === 0) {
        postUnRegisteredMessageData(unregisteredMessageApiData);
      } else {
        postUserMessageFarmList(messageApiData);
      }
      setTimeout(() => {
        setEnteredText('');
        setErrorDisplay(true);
      }, 500);
    }
  };

  const inputFile = useRef<any>({});
  // method for fileUpload
  const fileUpload = async () => {
    SetSelectedType('files');
    setAllowFileTypes('.doc,.docx,application/pdf');
    setTimeout(() => {
      inputFile.current.click();
    }, 100);
  };
  // method for imageUpload
  const imageUpload = async () => {
    SetSelectedType('images');
    setAllowFileTypes('.jpg, .jpeg, .png');
    setTimeout(() => {
      inputFile.current.click();
    }, 100);
  };
  // method for onChangeFile
  const onChangeFile = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    if (file.size < 10000000) {
      validateResolution(file);
      setFileSizeError(false);
    } else {
      setFileSizeError(true);
      setTimeout(() => {
        setFileSizeError(false);
      }, 6000);
    }
  };
  const validateResolution = (file: any) => {
    //Read the contents of Image File.
    var reader = new FileReader();
    var flag = '';
    reader.readAsDataURL(file);
    setImageFile(file);
    callProfileAPI(file);
  };

  // send message with media
  const callProfileAPI = (file: any) => {
    try {
      sendMessageAttachement({
        fileName: file.name,
        fileuuid,
        fileSize: file.size,
      }).then(async (res: any) => {
        if (selectedType == 'images') {
          setPreview(URL.createObjectURL(file));
        } else {
          setPreview('file');
        }
        setFile(file);
        SetMediauuid(fileuuid);
        setPresignedProfilePath(res.data.url);
      });
    } catch (error) {}
  };

  // method for send message
  const handleClickedkey = (e: any) => {
    if (enteredText === '') {
      setErrorDisplay(true);
    } else if (enteredText?.trim().length > 0) {
      setLoaderInProgress(true);
      if (selectedFarmDetails?.[0]?.isRegistered === 0) {
        postUnRegisteredMessageData(unregisteredMessageApiData);
      } else {
        postUserMessageFarmList(messageApiData);
        if (presignedProfilePath) {
          setIsFileUpload(true);
          setTimeout(() => {
            const uploadOptions = { method: 'Put', body: selectedFile };
            const result = fetch(presignedProfilePath, uploadOptions);
          }, 5000);
          setPresignedProfilePath('');
          // Media Upload check until lamda success
          let count = 1;
          const interval = setInterval(async () => {
            if (count >= 1) {
              let data: any = await mediaUploadSuccess([mediauuid]);

              if (data.error.data != 'SUCCESS') {
                count++;
                if (count === 10) {
                  clearInterval(interval);
                }
              } else {
                count = 0;
              }
            }
          }, 3000);
        } else {
        }
      }
      setTimeout(() => {
        setEnteredText('');
        setErrorDisplay(false);
        setFile('');
        SetMediauuid('');
        setPreview('');
        SetSelectedType('');
      }, 500);
    }
  };

  // method for remove file
  const removeFile = () => {
    setFile('');
    SetMediauuid('');
    setPresignedProfilePath('');
    setPreview('');
    SetSelectedType('');
  };

  // on media success
  useEffect(() => {
    if (mediaUploadSuccessResponse?.error?.data == 'SUCCESS') {
      setLoaderInProgress(false);
      setIsFileUpload(false);
    }
  }, [mediaUploadSuccessResponse?.error?.data]);

  return (
    <StyledEngineProvider injectFirst>
      {/* send message section */}
      <Box className="send-message-wrapper">
        <Grid container>
          <Grid item lg={8} sm={10} xs={12} sx={{ margin: 'auto' }}>
            <Stack
              direction="row"
              className={`${
                selectedFarmDetails?.[0]?.isRegistered === 0
                  ? 'unregisteredBlock'
                  : 'registeredBlock'
              }`}
            >
              <Box className="attach">
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  style={{ display: 'none' }}
                  onChange={onChangeFile}
                  onClick={(event: any) => {
                    event.target.value = null;
                  }}
                  accept={allowFileTypes}
                />
                <i
                  onClick={imageUpload}
                  className={`icon-Photograph ${loaderInProgress ? 'disableState' : ''}`}
                />
              </Box>
              <Box className="attach" px={1}>
                <i
                  onClick={fileUpload}
                  className={`icon-Paper-clip ${loaderInProgress ? 'disableState' : ''}`}
                />
              </Box>
              <Box
                sx={{ width: '100%' }}
                className={`send-msg sendmessage-multi ${loaderInProgress ? 'disableState' : ''}`}
              >
                <Box sx={{ width: '100%' }}>
                  <TextField
                    multiline
                    // autoFocus={selectedFarmDetails?.[0]?.isBroadcast === 1 ? false : true}
                    // onKeyDown={handleEnterkey}
                    value={enteredText}
                    onChange={(e: any) => setEnteredText(e.target.value)}
                    sx={{ width: '100%' }}
                    id="input-with-icon-textfield"
                    placeholder="Type a message..."
                    InputProps={{
                      className: 'msg-type',
                    }}
                    variant="standard"
                  />
                  {preview && selectedType == 'images' ? (
                    <>
                      <Box className="previewsendImage">
                        <img src={preview} alt="preview image" />
                        <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                      </Box>
                    </>
                  ) : (
                    ''
                  )}

                  {preview && selectedType == 'files' ? (
                    <Box className="previewsendattach">
                      {selectedFile?.name}
                      <i className="icon-Incorrect" onClick={(e) => removeFile()} />
                    </Box>
                  ) : (
                    ''
                  )}
                </Box>

                <i
                  onClick={handleClickedkey}
                  className={`icon-Send-Message ${loaderInProgress ? 'disableState' : ''}`}
                />
              </Box>
            </Stack>
            {errorDisplay && enteredText === '' && (
              <Typography>Message is a required field</Typography>
            )}
            {fileSizeError && <Typography>File size is exceeded</Typography>}
          </Grid>
        </Grid>
      </Box>
      {/* send message section end */}
    </StyledEngineProvider>
  );
}

export default SendMessage;
