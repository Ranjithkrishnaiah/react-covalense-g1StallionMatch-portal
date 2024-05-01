import React, { useState, useEffect, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InputLabel,
  Box,
  Typography,
  TextField,
  StyledEngineProvider,
  Stack,
  Avatar,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { VoidFunctionType } from 'src/@types/typeUtils';
import * as Yup from 'yup';
import { Images } from 'src/assets/images';
import { CustomButton } from 'src/components/CustomButton';
import 'src/pages/messages/Messages.css';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import './LRpopup.css';
import { useNavigate } from 'react-router';
import { ROUTES } from 'src/routes/paths';
import { NominationOfferProps } from 'src/@types/nominationOffer';
import { usePatchNominationOfferMutation } from 'src/redux/splitEndpoints/patchNominationOffer';
import { usePatchMessageReadMutation } from 'src/redux/splitEndpoints/patchMessageReadSplit';
import { usePostMessageAttachmentMutation } from 'src/redux/splitEndpoints/messageImageUpload';
import { useMessageMediaUploadStatusMutation } from 'src/redux/splitEndpoints/messageMediaUploadStatus';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import { toPascalCase } from 'src/utils/customFunctions';

function OfferReceivedForm(
  onClose: VoidFunctionType,
  openNominationMessage: string,
  openAcceptOfferFunction: VoidFunctionType,
  nominationOfferData: NominationOfferProps,
  receipentNameVar: any,
  setPatchParams: React.Dispatch<React.SetStateAction<any>>,
  openOfferReceived: boolean,
  respondedValueState: any,
  setRespondedValueState: any,
  subject: any,
  loaderInProgress: any,
  setLoaderInProgress: any,
  setIsFileUpload: any,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {
  const close = onClose;
  const fileuuid: any = uuid();
  const [respondedValue, setRespondedValue] = React.useState<string | null>(null);
  const [counterOfferValue, setCounterOfferValue] = useState<any>();
  const [offerMessage, setOfferMessage] = useState<any>();
  const [time, setTime] = useState<any>('');

  // API call for post nomination request
  const [patchNominationOfferMutation, patchNominationResponse] = usePatchNominationOfferMutation();
  // API call for message unread to read
  const [sendMessageRead, responseSendMessageRead] = usePatchMessageReadMutation();

  const navigate = useNavigate();
  const goToTerms = () => {
    navigate(ROUTES.TERMS_AND_CONDITIONS);
  };
  // media code added
  const [sendMessageAttachement, responSesendMessageAttachement] =
    usePostMessageAttachmentMutation();
  const [selectedFile, setFile] = useState<any>();
  const [preview, setPreview] = useState<any>('');
  const [selectedType, SetSelectedType] = useState<any>('');
  const [mediauuid, SetMediauuid] = useState<any>('');
  const [presignedProfilePath, setPresignedProfilePath] = useState<any>();
  const [mediaUploadSuccess, mediaUploadSuccessResponse] =
    useMessageMediaUploadStatusMutation<any>();
  const [uploadInProgress, setUploadInProgress] = useState<any>(false);
  const [allowFileTypes, setAllowFileTypes] = useState<any>('');
  const [imageFile, setImageFile] = useState<File>();

  const NominationSendSchema = Yup.object().shape({
    counterOfferValue: Yup.string().required('Counter Offer is a required field'),
    offerMessage: Yup.string().required('Message is a required field'),
  });
  const methods = useForm<any>({
    resolver: yupResolver(NominationSendSchema),
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = methods;

  // validation for nomination
  const validateNominatinSend = () => {
    if (
      (respondedValue === 'MakeCounteroffer' &&
        (counterOfferValue === undefined || counterOfferValue === '')) ||
      offerMessage === undefined ||
      offerMessage === '' ||
      offerMessage?.trim().length === 0
    )
      return false;
    return true;
  };

  let patchParamsData = {
    requestId: nominationOfferData?.nominationRequestId,
    message: offerMessage,
    subject: subject,
    counterOfferPrice: parseInt(counterOfferValue) || 0,
    isAccepted: respondedValue === 'Accept' ? true : false,
    isDeclined: respondedValue === 'Decline' ? true : false,
    isCounterOffer: respondedValue === 'MakeCounteroffer' ? true : false,
    channelId: nominationOfferData?.channelId,
    fromMembeId: nominationOfferData?.fromMemberId,
    mediauuid: mediauuid,
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
  const validateResolution = (file: any) => {
    //Read the contents of Image File.
    var reader = new FileReader();
    var flag = '';
    reader.readAsDataURL(file);
    setImageFile(file);
    callProfileAPI(file);
  };

  // method for onChangeFile
  const onChangeFile = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    if (file.size < 10000000) {
      validateResolution(file);
    } else {
      toast.error('File size is exceeded');
    }
  };

  // method for callProfileAPI
  const callProfileAPI = (file: any) => {
    try {
      setUploadInProgress(true);
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

  // method for imgeUpload
  const imgeUpload = async () => {
    if (presignedProfilePath) {
      setIsFileUpload(true);
      setTimeout(() => {
        const uploadOptions = { method: 'Put', body: selectedFile };
        const result = fetch(presignedProfilePath, uploadOptions);
      }, 5000);

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
            setUploadInProgress(false);
            setPresignedProfilePath('');
          }
        }
      }, 3000);
    } else {
    }
  };

  //hitting PATCH API after POST message
  useEffect(() => {
    if (patchNominationResponse?.isSuccess) {
      let paramForRead = {
        channelId: nominationOfferData?.channelId,
      };
      sendMessageRead(paramForRead);
    }
  }, [patchNominationResponse?.isSuccess]);

  //method for submit offer received form
  const submitOfferReceived = async () => {
    openAcceptOfferFunction();
    close();
    setPatchParams(patchParamsData);
    if (loaderInProgress) {
      await patchNominationOfferMutation(patchParamsData);
    }
    await imgeUpload();
  };

  //method for submit Counter offer received form
  const submitCounterOfferReceived = async () => {
    close();
    setLoaderInProgress(true);
    await patchNominationOfferMutation(patchParamsData);
    await imgeUpload();

    let paramForRead = {
      channelId: nominationOfferData?.channelId,
    };
    setTimeout(() => {
      sendMessageRead(paramForRead);
    }, 1000);
  };

  const handleRespondedValue = (
    event: React.MouseEvent<HTMLElement>,
    newRespondedValue: string | null
  ) => {
    setRespondedValue(newRespondedValue);
    setRespondedValueState(newRespondedValue);
  };

  // method for remove file
  const removeFile = () => {
    setFile('');
    SetMediauuid('');
    setPresignedProfilePath('');
    setPreview('');
    SetSelectedType('');
  };
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(16),
      border: '1px solid #dadde9',
      fontFamily: 'Synthese-Regular',
    },
  }));

  // set time
  useEffect(() => {
    if (nominationOfferData?.timestamp !== null && nominationOfferData?.timestamp !== undefined) {
      const timeData = new Date(nominationOfferData?.timestamp)
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
      setTime(timeData.toLocaleString());
    }
  }, [nominationOfferData?.timestamp]);

  // initial state on close popup
  useEffect(() => {
    if (!openOfferReceived) {
      setRespondedValue(null);
      setCounterOfferValue(undefined);
      setOfferMessage(undefined);
      SetSelectedType('');
    }
  }, [openOfferReceived]);

  // on media upload success
  useEffect(() => {
    if (mediaUploadSuccessResponse?.error?.data == 'SUCCESS') {
      setLoaderInProgress(false);
      setIsFileUpload(false);
    }
  }, [mediaUploadSuccessResponse?.error?.data]);

  return (
    <StyledEngineProvider injectFirst>
      {/* form for offer received */}
      <form
        onSubmit={handleSubmit(submitOfferReceived)}
        autoComplete="false"
        className="add-stallion-pop-wrapper msg-offer"
      >
        <Box className="nominationOffer-formBox">
          <Grid>
            <Box className="nominationOffer-details offerReceived-details">
              <Box className="farm-culmn" mt={2}>
                <Avatar
                  src={
                    nominationOfferData?.senderImage
                      ? nominationOfferData?.senderImage +
                        '?h=56&w=56&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                      : Images.User
                  }
                  alt={nominationOfferData?.senderName}
                />
                <Stack direction="column" ml={2}>
                  <Typography variant="h4">
                    From: {toPascalCase(nominationOfferData?.senderName)}
                  </Typography>

                  <Typography component="span">
                    {nominationOfferData?.senderStateName || ''}
                    {nominationOfferData?.senderStateName && ','}
                    {nominationOfferData?.senderCountryName || ''} — Local time {time}
                  </Typography>
                </Stack>
              </Box>
              <Box className="offer" mt={2}>
                <Box>
                  <Typography variant="h6">Offer Details:</Typography>
                  <Typography variant="h5">
                    Stallion: {toPascalCase(nominationOfferData?.horseName)}
                  </Typography>

                  <Typography variant="h5">
                    {nominationOfferData?.isAccepted === true ||
                    nominationOfferData?.isDeclined === true
                      ? ''
                      : nominationOfferData?.isCounterOffer === true &&
                        nominationOfferData?.counterOfferPrice !== 0 &&
                        'Previous'}{' '}
                    Nomination Offer: {nominationOfferData?.currencySymbol}
                    {nominationOfferData?.isCounterOffer === true &&
                    (nominationOfferData?.isAccepted === true ||
                      nominationOfferData?.isDeclined === true)
                      ? nominationOfferData?.counterOfferPrice?.toLocaleString()
                      : nominationOfferData?.offerPrice?.toLocaleString()}
                  </Typography>

                  {nominationOfferData?.isAccepted === true ||
                  nominationOfferData?.isDeclined === true
                    ? ''
                    : nominationOfferData?.isCounterOffer === true &&
                      nominationOfferData?.counterOfferPrice !== 0 && (
                        <Typography variant="h4">
                          Counteroffer: {nominationOfferData?.currencySymbol}
                          {nominationOfferData?.counterOfferPrice?.toLocaleString()}
                        </Typography>
                      )}
                </Box>

                <Box mt={2}>
                  <Typography variant="h6">Message:</Typography>
                  <Typography variant="h5">Hi {receipentNameVar},</Typography>
                  <Typography
                    variant="h5"
                    dangerouslySetInnerHTML={{ __html: nominationOfferData?.message }}
                  ></Typography>
                  <Typography variant="h5" mt={3}>
                    Thanks!
                  </Typography>
                  <Typography variant="h5">
                    {' '}
                    {toPascalCase(nominationOfferData?.senderName)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="nomination-respond" mb={2}>
              <InputLabel>
                How would you like to respond?
                <HtmlTooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={6000}
                  className="CommonTooltip studfee-tooltip"
                  placement="bottom-end"
                  title={
                    <React.Fragment>
                      <p>
                        <i className="icon-Cross" />
                        {'Additional fees apply to accept a'} {''}
                        {'nomination request. Please read'} {''}
                        <a className="terms-btn" href={`/terms-and-conditions`} target={'_blank'}>
                          Terms of Service.
                        </a>
                        {'for more information.'}
                      </p>
                    </React.Fragment>
                  }
                >
                  <i className="icon-Info-circle" />
                </HtmlTooltip>
              </InputLabel>
              <ToggleButtonGroup
                value={respondedValue}
                exclusive
                onChange={handleRespondedValue}
                aria-label="text alignment"
                className="offer-toggle"
              >
                <ToggleButton value="Accept" aria-label="left aligned">
                  Accept
                </ToggleButton>
                <ToggleButton value="Decline" aria-label="centered">
                  Decline
                </ToggleButton>
                <ToggleButton value="MakeCounteroffer" aria-label="right aligned">
                  Make Counteroffer
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box mb={2} className={`${respondedValue === 'MakeCounteroffer' ? 'show' : 'hide'}`}>
              <TextField
                fullWidth
                type="number"
                placeholder="Enter Counteroffer"
                value={counterOfferValue}
                onChange={(e: any) => setCounterOfferValue(e.target.value)}
              />
              <p>{counterOfferValue === '' ? 'Counter Offer is a required field' : ''}</p>
            </Box>

            <Box className="send-respond">
              <TextField
                multiline
                autoFocus
                value={offerMessage}
                onChange={(e: any) => setOfferMessage(e.target.value)}
                sx={{ width: '100%' }}
                id="input-with-icon-textfield"
                placeholder="Message..."
                disabled={respondedValue === null}
                InputProps={{
                  className: 'msg-type offer-type',
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
            <p>
              {offerMessage?.trim().length === 0 && offerMessage === ''
                ? 'Message is a required field'
                : ''}
            </p>
            <Box mb={2}>
              <Stack direction="row" className="send-offer">
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
                <Box
                  className={
                    respondedValue === null ? 'offerIcon disabledIcon' : 'offerIcon enabledIcon'
                  }
                >
                  <i className="icon-Photograph" onClick={imageUpload} />
                </Box>
                <Box
                  flexGrow={1}
                  px={1}
                  className={
                    respondedValue === null ? 'offerIcon disabledIcon' : 'offerIcon enabledIcon'
                  }
                >
                  <i className="icon-Paper-clip" onClick={fileUpload} />
                </Box>
                <Box className="sendBtn">
                  <CustomButton
                    className="buttonGlobal send-btn"
                    disabled={!validateNominatinSend()}
                    onClick={
                      respondedValue === 'MakeCounteroffer'
                        ? submitCounterOfferReceived
                        : submitOfferReceived
                    }
                  >
                    Send
                  </CustomButton>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Box>
      </form>
      {/* form for offer received end */}
    </StyledEngineProvider>
  );
}

export default OfferReceivedForm;
