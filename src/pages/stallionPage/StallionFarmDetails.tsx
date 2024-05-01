import {
  Container,
  Divider,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  StyledEngineProvider,
  Typography,
  styled,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Images } from 'src/assets/images';
import StallionDetailsCard from 'src/components/cards/StallionDetailsCard';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import Registration from 'src/forms/Registration';
import UnRegisteredMessageSent from 'src/forms/UnRegisteredMessageSent';
import UnRegisteredUserContactForm from 'src/forms/UnRegisteredUserContactForm';
import { useGetFarmByIdQuery } from 'src/redux/splitEndpoints/getFarmsByIdSplit';
import NominationOfferForm from 'src/forms/NominationOfferForm';
import '../stallionDirectory/StallionDirectory.css';
import { useNavigate } from 'react-router-dom';
import { usePostGetChannelIdMutation } from 'src/redux/splitEndpoints/postGetChannelId';
import { useGetFarmMembersQuery } from 'src/redux/splitEndpoints/getFarmMembers';
import useAuth from 'src/hooks/useAuth';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

type stallionFarmDetailsProps = {
  farmId: string;
  stallionId: string;
  horseName: string;
  isNominated: number;
  farmName: string;
};

function StallionFarmDetails(props: stallionFarmDetailsProps) {
  window.sessionStorage.removeItem('SessionMessageFrom');
  window.sessionStorage.removeItem('CurrentPage');
  const { farmId, stallionId, horseName, isNominated, farmName } = props;

  const navigate = useNavigate();
  const { data: stallionFarmDetails, isSuccess: isStallionFarmDetailsSuccess } =
    useGetFarmByIdQuery(farmId);
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  const isLoggedIn = accessToken ? true : false;

  const [titleForm, setTitleForm] = useState('Contact Form');
  const [contactForm, setContactForm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openNominationPopup, setOpenNominationPopup] = useState(false);

  const [openLogin, setopenLogin] = useState(false);
  const [openRegisteration, setOpenRegistration] = useState(false);
  const [registrationTitle, setRegistrationTitle] = useState('Create Account');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [farmNameSuccess, setFarmNameSuccess] = useState<string>('');
  const [userRole, setUserRole] = useState<any>({});
  const { authentication } = useAuth();
  const [loaderInProgress, setLoaderInProgress] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserRole(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  const { data: farmMembersList, isSuccess } = useGetFarmMembersQuery(farmId, { skip: !farmId });

  const checkNomination =
    isSuccess && farmMembersList?.some((farm: any) => farm?.memberId === userRole?.id);

  //post mutation to get channelId
  const [postGetChannelId, response] = usePostGetChannelIdMutation();

  //post mutation to get new chat
  const [postUserMessageList, responseMessageList] = usePostUserMessageMutation();

  const openRegistrationPopup = () => setOpenRegistration(true);

  const closeLogin = () => setopenLogin(false);

  const openForgotPasswordPopup = () => setForgotPassword(true);

  const closeForgotPassword = () => setForgotPassword(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);

  const handleSuccess = () => {
    setContactForm(false);
    setOpenSuccess(true);
  };

  const sendToMessages = () => {
    let postData = {
      rxId: farmId,
    };
    const farmApiData: any = {
      message: ' ',
      farmId: farmId,
      stallionId: stallionId,
      subject: 'Stallion Enquiry',
      channelId: '',
      fromMemberUuid: userRole?.id,
    };
    postGetChannelId(postData).then((res: any) => {
      const stallionMessageData = {        
        pageType: 'stallions',
        name: horseName,
        id: stallionId
      }
      if (res?.data?.channelId) {
        window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
        window.sessionStorage.setItem('SessionFilteredFarm', '');
        window.sessionStorage.setItem("SessionMessageFrom", JSON.stringify(stallionMessageData));
        navigate(`/messages/thread/${res?.data?.channelId}`);
      } else {
        postUserMessageList(farmApiData).then((res: any) => {
          if (res?.data?.channelId) {
            window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
            window.sessionStorage.setItem('SessionFilteredFarm', '');
            window.sessionStorage.setItem("SessionMessageFrom", JSON.stringify(stallionMessageData));
            navigate(`/messages/thread/${res?.data?.channelId}`);
          }
        });
      }
    });
  };

  const getFarmName = (farmName: string) => {
    setFarmNameSuccess(farmName);
  };
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }: any) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  return (
    <>
      <Box className={`${checkNomination ? 'ownFarmMember' : ''}`}>
        <WrapperDialog
          open={openNominationPopup}
          title={'Make a Nomination Offer'}
          onClose={() => setOpenNominationPopup(false)}
          farmId={farmId}
          openNominationWrapper={openNominationPopup}
          selectedFarmHeader={''}
          setLoaderInProgress={setLoaderInProgress}
          body={NominationOfferForm}
        />
        <StallionDetailsCard {...stallionFarmDetails} />
        <Divider sx={{ borderColor: '#ffffff', borderWidth: '1px' }} flexItem />
        <Stack
          direction="row"
          className={`${isNominated === 1 ? 'MRclmn' : 'MRclmn MRclmn-NoRadius'}`}
        >
          <Grid lg={6} xs={6}>
            <MenuList
              sx={{ padding: '0px' }}
              className={`${
                !authentication || checkNomination === false || checkNomination === undefined
                  ? 'enableClick'
                  : 'disableClick'
              }`}
              onClick={
                isLoggedIn
                  ? () => {
                      sendToMessages();
                    }
                  : () => setContactForm(true)
              }
            >
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Stack py={2}>
                  <img
                    src={Images.Message}
                    alt="Message"
                    style={{ width: '30px', height: '30px', margin: '2px auto' }}
                  />
                  <Typography variant="h5">Message Farm</Typography>
                </Stack>
              </MenuItem>
            </MenuList>
          </Grid>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: '#ffffff', borderWidth: '1px' }}
          />
          <Grid lg={6} xs={6}>
            <MenuList
              sx={{ padding: '0px' }}
              className={`${
                (checkNomination === false || checkNomination === undefined) && isNominated === 1
                  ? 'enableClick'
                  : 'disableClick'
              }`}
              onClick={
                isLoggedIn
                  ? () => {
                      setOpenNominationPopup(true);
                    }
                  : () => setOpenRegistration(true)
              }
            >
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Stack py={2}>
                  <img
                    src={Images.Sparkles}
                    alt="Sparkles"
                    style={{ width: '30px', height: '30px', margin: '2px auto' }}
                  />
                  <Typography variant="h5">Request Nomination</Typography>
                </Stack>
              </MenuItem>
            </MenuList>
            <Box>
              <Box>
                <WrapperDialog
                  open={contactForm}
                  title={titleForm}
                  onClose={() => setContactForm(false)}
                  openSuccessForm={handleSuccess}
                  changeTheTitle={setTitleForm}
                  getFarmName={getFarmName}
                  stallionId={stallionId}
                  horseName={horseName}
                  farmId={farmId}
                  contactForm={contactForm}
                  body={UnRegisteredUserContactForm}
                  
                />
              </Box>
              <Box>
                <WrapperDialog
                  open={openSuccess}
                  title={'Message Sent'}
                  onClose={() => setOpenSuccess(false)}
                  openRegister={() => setOpenRegistration(true)}
                  unregisteredSuccess={farmNameSuccess}
                  farmNameSelected={farmName}
                  body={UnRegisteredMessageSent}
                />
              </Box>

              <WrapperDialog
                open={forgotPassword}
                title="Forgot Password"
                onClose={closeForgotPassword}
                body={ForgotPassword}
              />

              <WrapperDialog
                open={openLogin}
                title={isFirstLogin ? 'Welcome to Stallion Match' : 'Log in'}
                onClose={closeLogin}
                openOther={openRegistrationPopup}
                OFP={openForgotPasswordPopup}
                body={Login}
                firstLogin={isFirstLogin}
                farmAdminFirstLogin={isFarmAdminFirstLogin}
              />
              <WrapperDialog
                open={openRegisteration}
                title={registrationTitle}
                onClose={() => setOpenRegistration(false)}
                openOther={() => setopenLogin(true)}
                changeTitleTo={setRegistrationTitle}
                body={Registration}
                setIsFirstLogin={setIsFirstLogin}
                setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
              />
            </Box>
            {checkNomination === true || isNominated === 1 ? (
              ''
            ) : (
              <Box className="Disabled-RequestNomination-Wrp">
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: '#ffffff', borderWidth: '1px' }}
                />
                

                <Box className="Disabled-RequestNomination">
                  <Typography variant="h6">
                  <HtmlTooltip
              enterTouchDelay={0}
              leaveTouchDelay={6000}
                className="CommonTooltip"
                placement="bottom-end"
                sx={{ width: '280px !important' }}
                title={
                  <React.Fragment>
                    <Typography>Farms have the option to activate the "Request Nomination" feature, enabling breeders to submit stud fee offers.</Typography>
                  </React.Fragment>
                }
              ><i className="icon-Info-circle"></i>
              </HtmlTooltip>  Currently not accepting Nomination offers.
                  </Typography>
                </Box>
                
              </Box>
            )}
          </Grid>
        </Stack>
      </Box>
    </>
  );
}

export default StallionFarmDetails;
