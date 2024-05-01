import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  StyledEngineProvider,
  InputLabel,
  MenuItem,
  TextareaAutosize,
  Select,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VoidFunctionType } from 'src/@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import 'src/pages/notifications/notification.css';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useSearchFarmNameQuery } from 'src/redux/splitEndpoints/searchFarmNameSplit';
import { debounce } from 'lodash';
import CustomAutocomplete from 'src/components/CustomAutocomplete';
import { useGetStallionNamesQuery } from 'src/redux/splitEndpoints/getStallionNamesSplit';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import { usePostGetChannelIdMutation } from 'src/redux/splitEndpoints/postGetChannelId';
import { useGetFarmMembersQuery } from 'src/redux/splitEndpoints/getFarmMembers';
import { toPascalCase } from 'src/utils/customFunctions';

export interface NewMessageSchemaType {
  farmSearch?: string;
  selectStallion?: string;
  newMessage?: string;
}

function NewMessageForm(
  onClose: VoidFunctionType,
  subjectForMessage: string,
  newMessageForm: any,
  handleSelected: (a: any) => void,
  setMessageViewOptions: (a: any) => void,
  setMessageViewOptionsFiltered: (a: any) => void,
  setNewMessageCreated: (a: any) => void,
  setLoaderInProgress: (a: any) => void,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();
  const close = onClose;
  const [farmNameSearch, setFarmNameSearch] = useState<any>('');
  const [farmSelected, setFarmSelected] = useState<any>();
  const [stallionSelected, setStallionSelected] = useState<any>();
  const [messageEntered, setMessageEntered] = useState<any>();
  const [locationSubject, setLocationSubject] = useState('');

  const [userObj, setUserObj] = React.useState<any>({});
  const [isClearFarm, setIsClearFarm] = useState(0);

  // get local storage user details
  React.useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserObj(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  const farmParam: any = {
    farmName: farmNameSearch,
  };
  // API call for getting farms lists
  const { data: farmListApiData, isFetching } = useSearchFarmNameQuery(farmParam, {
    skip: !farmNameSearch,
  });

  const pascalFarmList = farmListApiData?.map((farmObj: any) => ({
    ...farmObj,
    farmName: toPascalCase(farmObj.farmName),
  }));

  const pascalFarmListUpdated = farmNameSearch && isClearFarm === 0 ? pascalFarmList : [];

  const stallionListParms = {
    id: farmSelected?.farmId,
  };
  // API call for getting Stallions lists
  const stallionsSelected = useGetStallionNamesQuery(stallionListParms, {
    skip: !farmSelected,
  });

  //post mutation to get channelId
  const [postGetChannelId, response] = usePostGetChannelIdMutation();

  //post mutation to get new chat
  const [postUserMessageFarmList, responseMessageFarmList] = usePostUserMessageMutation();

  const MessageSendSchema = Yup.object().shape({
    newMessage: Yup.string().required('Message is a required field'),
  });

  const methods = useForm<NewMessageSchemaType>({
    resolver: yupResolver(MessageSendSchema),
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
    control,
  } = methods;

  // method for validations
  const validateNewMessage = () => {
    if (
      farmSelected === null ||
      farmSelected === undefined ||
      messageEntered === '' ||
      messageEntered === undefined ||
      messageEntered?.trim().length === 0 ||
      checkNomination
    )
      return false;
    return true;
  };

  const debouncedFarmName = React.useRef(
    debounce(async (farmNameEntered) => {
      if (farmNameEntered.length >= 3 && isClearFarm === 0) {
        await setFarmNameSearch(farmNameEntered);
      }
    }, 1000)
  ).current;

  // handle farm input text
  const handleFarmInput = (e: any) => {
    setIsClearFarm(0);
    if (e.target.value && isClearFarm === 0) {
      debouncedFarmName(e.target.value);
    }
  };

  // on reset farm option
  const handleFarmOptionsReset = () => {
    setFarmNameSearch('');
    setIsClearFarm(1);
  };

  // get url param
  useEffect(() => {
    const res = window.location.pathname.split('/')[2];
    setLocationSubject(res === (undefined || '') ? 'thread' : res);
  }, []);

  const subjectRes =
    locationSubject === 'farm'
      ? 'Farm enquiry'
      : locationSubject === 'stallion'
      ? 'Stallion enquiry'
      : 'General enquiry';

  // function to submit new message
  const submitNewMessage = () => {
    setLoaderInProgress(true);
    let postData = {
      rxId: farmSelected?.farmId,
    };
    const farmApiData: any = {
      message: messageEntered,
      farmId: farmSelected?.farmId,
      stallionId: stallionSelected,
      subject: 'General Enquiry',
      channelId: '',
      fromMemberUuid: userObj?.id,
    };

    let locationSubjectRes =
      locationSubject === undefined || 'undefined' ? 'thread' : locationSubject;

    postGetChannelId(postData).then((res: any) => {
      if (res?.data?.channelId) {
        handleSelected(res?.data?.channelId);
        const postExistingFarm: any = {
          message: messageEntered,
          farmId: farmSelected?.farmId,
          stallionId: stallionSelected,
          subject: res?.data?.initialSubject,
          channelId: res?.data?.channelId,
          fromMemberUuid: userObj?.id,
        };
        postUserMessageFarmList(postExistingFarm).then((res: any) => {
          navigate(`/messages/${locationSubjectRes}/${res?.data?.channelId}`);
        });
      } else {
        postUserMessageFarmList(farmApiData).then((res: any) => {
          if (res?.data?.channelId) {
            handleSelected(res?.data?.channelId);
            navigate(`/messages/${locationSubjectRes}/${res?.data?.channelId}`);
          }
        });
      }
    });
    close();
  };

  //hitting PATCH API after POST message
  useEffect(() => {
    if (responseMessageFarmList?.isSuccess) {
      setNewMessageCreated(true);
      window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
      window.sessionStorage.setItem('SessionFilteredFarm', '');
      setMessageViewOptionsFiltered('');
      const resChannelId = window.location.pathname.split('/')[3];
    } else if (newMessageForm === false) {
      setNewMessageCreated(false);
    }
  }, [responseMessageFarmList?.isSuccess]);

  // onclose popup reset to initial state
  useEffect(() => {
    if (newMessageForm === false) {
      setFarmSelected(undefined);
      setStallionSelected(undefined);
      setMessageEntered(undefined);
    }
  }, [newMessageForm]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '0',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  const farmIDSelected = farmSelected?.farmId;
  // API call to get farm members list
  const { data: farmMembersList, isSuccess } = useGetFarmMembersQuery(farmIDSelected, {
    skip: !farmIDSelected,
  });

  const checkNomination =
    isSuccess && farmMembersList?.some((farm: any) => farm?.memberId === userObj?.id);

  return (
    <StyledEngineProvider injectFirst>
      <Box className="nominationOffer-formBox" mt={2}>
        {/* new message form */}
        <Grid>
          <Box className="nominationOffer-details">
            <Box mb={3}>
              <InputLabel>Select Farm</InputLabel>
              <CustomAutocomplete
                options={pascalFarmListUpdated || []}
                noOptionsText={
                  farmNameSearch != '' &&
                  isClearFarm === 0 && (
                    <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                      <span className="fw-bold sorry-message">
                        {isFetching
                          ? 'Loading...'
                          : `Sorry, we couldn't find any matches for "${farmNameSearch}"`}
                      </span>
                    </Box>
                  )
                }
                onInputChange={handleFarmInput}
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                getOptionLabel={(option: any) => option?.farmName}
                onChange={(e: any, selectedOptions: any) => setFarmSelected(selectedOptions)}
                placeholder={`Enter Farm`}
                className="directory-arrow"
                onBlur={() => handleFarmOptionsReset()}
              />
              <p>{farmSelected === null ? 'Farm Search is a required field' : ''}</p>
              <p>{checkNomination ? 'You cannot message your own farm as a breeder' : ''}</p>
            </Box>

            <Box mb={3}>
              <InputLabel>Select Stallion</InputLabel>
              <Select
                fullWidth
                className="selectDropDownBox"
                IconComponent={KeyboardArrowDownRoundedIcon}
                MenuProps={MenuProps}
                {...register('selectStallion')}
                defaultValue={'none'}
                value={stallionSelected ? stallionSelected : 'none'}
                onChange={(e: any) => setStallionSelected(e.target.value)}
                disabled={
                  farmSelected === null || farmSelected === undefined || checkNomination
                    ? true
                    : false
                }
              >
                <MenuItem className="selectDropDownList" value="none" disabled>
                  <em>Select Stallion</em>
                </MenuItem>
                {stallionSelected && farmSelected && (
                  <MenuItem className="selectDropDownList" value={stallionSelected} disabled>
                    <em>Select Stallion</em>
                  </MenuItem>
                )}
                {stallionSelected && (farmSelected === null || checkNomination) && (
                  <MenuItem className="selectDropDownList" value={stallionSelected} disabled>
                    <em>Select Stallion</em>
                  </MenuItem>
                )}
                {farmSelected != null &&
                  stallionsSelected?.data?.map(({ stallionId, stallionName }: any) => (
                    <MenuItem className="selectDropDownList" value={stallionId} key={stallionId}>
                      {toPascalCase(stallionName)}
                    </MenuItem>
                  ))}
              </Select>
            </Box>

            <Box mb={2} className="localMessageClass">
              <InputLabel>Message</InputLabel>
              <TextareaAutosize
                className="nomination-messageBox"
                // className={`nomination-messageBox ${
                //   messageEntered?.trim().length === 0 && messageEntered === '' ? 'errorBorder' : ''
                // }`}
                minRows={5}
                value={messageEntered}
                placeholder="Enter message"
                onChange={(e: any) => setMessageEntered(e.target.value)}
              />
              <p>
                {messageEntered?.trim().length === 0 && messageEntered === ''
                  ? 'Message is a required field'
                  : ''}
              </p>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <CustomButton
              fullWidth
              className="lr-btn"
              disabled={!validateNewMessage()}
              onClick={submitNewMessage}
            >
              Send
            </CustomButton>
            <Box className="terms termsModal" mt={2}>
              By clicking Send you agree to our
              <a href={`/about/terms`} target="_blank" className="terms-btn">
                Terms and Conditions
              </a>
              .
            </Box>
          </Box>
        </Grid>
        {/* new message form end */}
      </Box>
    </StyledEngineProvider>
  );
}

export default NewMessageForm;
