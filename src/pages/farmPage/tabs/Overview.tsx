import {
  Container,
  Grid,
  StyledEngineProvider,
  Typography,
  Divider,
  MenuItem,
  MenuList,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import StallionDetailsCard from 'src/components/cards/StallionDetailsCard';
import NominationOfferForm from 'src/forms/NominationOfferForm';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { useNavigate } from 'react-router-dom';
import UnRegisteredMessageSent from 'src/forms/UnRegisteredMessageSent';
import UnRegisteredUserContactForm from 'src/forms/UnRegisteredUserContactForm';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import Registration from 'src/forms/Registration';
import '../../stallionDirectory/StallionDirectory.css';
import { Images } from 'src/assets/images';
import { useGetFarmMembersQuery } from 'src/redux/splitEndpoints/getFarmMembers';
import useAuth from 'src/hooks/useAuth';
import { usePostGetChannelIdMutation } from 'src/redux/splitEndpoints/postGetChannelId';
import { usePostUserMessageMutation } from 'src/redux/splitEndpoints/postUserMessageSplit';
import { toPascalCase, toTitleCase } from 'src/utils/customFunctions';
import { useFarmOverviewQuery } from 'src/redux/splitEndpoints/getFarmOverview';
import { Spinner } from 'src/components/Spinner';

export default function Overview(props: any) {
  const navigate = useNavigate();
  window.sessionStorage.removeItem('SessionMessageFrom');
  window.sessionStorage.removeItem('CurrentPage');
  const {
    farmName,
    countryCode,
    countryId,
    countryName,
    email,
    farmId,
    openNominationWrapper,
    image,
    overview,
    stateId,
    stateName,
    url,
    website,
    stallionListProps,
    dynamicOverview,
  } = props;

 
  const [openNominationPopup, setOpenNominationPopup] = useState(false);
  const [contactForm, setContactForm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [farmNameSuccess, setFarmNameSuccess] = useState<string>('');
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegisteration, setOpenRegistration] = useState(false);
  const [registrationTitle, setRegistrationTitle] = useState('Create Account');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
  const [titleForm, setTitleForm] = useState('Select Farm to Contact');
  const user = localStorage.getItem('user');
  const isLoggedIn = user ? true : false;
  const [userRole, setUserRole] = useState<any>({});
  const { authentication } = useAuth();
  const [loaderInProgress, setLoaderInProgress] = useState(false);
  const [dynamicText, setDynamicText] = useState('');
  const [dynamicText1, setDynamicText1] = useState('');
  const [dynamicText2, setDynamicText2] = useState('');
  const [dynamicText3, setDynamicText3] = useState('');
  const [dynamicTextNoData, setDynamicTextNoData] = useState('');

  const { data: farmMembersList, isSuccess } = useGetFarmMembersQuery(farmId, { skip: !farmId });

  //post mutation to get channelId
  const [postGetChannelId, response] = usePostGetChannelIdMutation();

  //post mutation to get new chat
  const [postUserMessageList, responseMessageList] = usePostUserMessageMutation();

  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUserRole(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  const checkNomination =
    isSuccess && farmMembersList?.some((farm: any) => farm?.memberId === userRole?.id);

  const sendToMessages = () => {
    let postData = {
      rxId: farmId,
    };
    const farmApiData: any = {
      message: ' ',
      farmId: farmId,
      stallionId: '',
      subject: 'Farm Enquiry',
      channelId: '',
      fromMemberUuid: userRole?.id,
    };
    const farmMessageData = {        
      pageType: 'stud-farm',
      name: farmName,
      id: farmId
    }
    postGetChannelId(postData).then((res: any) => {
      if (res?.data?.channelId) {
        window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
        window.sessionStorage.setItem('SessionFilteredFarm', '');
        window.sessionStorage.setItem("SessionMessageFrom", JSON.stringify(farmMessageData));
        navigate(`/messages/thread/${res?.data?.channelId}`);
      } else {
        postUserMessageList(farmApiData).then((res: any) => {
          if (res?.data?.channelId) {
            window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
            window.sessionStorage.setItem('SessionFilteredFarm', '');
            window.sessionStorage.setItem("SessionMessageFrom", JSON.stringify(farmMessageData));
            navigate(`/messages/thread/${res?.data?.channelId}`);
          }
        });
      }
    });
  };

  const handleSuccess = () => {
    setContactForm(false);
    setOpenSuccess(true);
  };

  const getFarmName = (farmName: string) => {
    setFarmNameSuccess(farmName);
  };

  const isNominatedCheck = stallionListProps?.stallionListData?.some(
    (stallion: any) => stallion?.isNominated === 1
  );

  const {
    data: dynamicOverviewData,
    isLoading,
    isSuccess: isOverviewDataSuccess,
    isFetching,
  } = useFarmOverviewQuery(farmId, { skip: overview });

  useEffect(() => {
    if (
      dynamicOverviewData?.farmName &&
      dynamicOverviewData?.farmState &&
      dynamicOverviewData?.farmCountry &&
      dynamicOverviewData?.StallionCount &&
      dynamicOverviewData?.StallionList
    ) {
      setDynamicText1('sentence1Exists');
    } else {
      setDynamicText1('sentence1NotExists');
    }
    if (
      dynamicOverviewData?.Top1Stallion &&
      dynamicOverviewData?.Top1StalliontotalWinnersCounts &&
      dynamicOverviewData?.TOP1StalliontotalStakeWinnersCounts &&
      dynamicOverviewData?.YoungestStallionName &&
      dynamicOverviewData?.YoungestStallionYearToStud &&
      dynamicOverviewData?.YoungestStallionOldestProgenyAge
    ) {
      setDynamicText2('sentence2Exists');
    } else {
      setDynamicText2('sentence2NotExists');
    }
    if (
      dynamicOverviewData?.AllStationTotalStakeWinnersSince2011 &&
      dynamicOverviewData?.AllStationTotalWinnersSince2011 &&
      dynamicOverviewData?.AllStationWinnersSmallestDistance &&
      dynamicOverviewData?.AllStationWinnersLongestDistance
    ) {
      setDynamicText3('sentence3Exists');
    } else {
      setDynamicText3('sentence3NotExists');
    }
    if (dynamicText1 != '' && dynamicText2 != '' && dynamicText3 != '') {
      setDynamicTextNoData('No data found.');
    }
  }, [dynamicOverviewData]);

  useEffect(() => {
    if (
      dynamicText1 === 'sentence1NotExists' &&
      dynamicText2 === 'sentence2NotExists' &&
      dynamicText3 === 'sentence3NotExists'
    ) {
      setDynamicTextNoData('No data found.');
    } else {
      setDynamicTextNoData('');
    }
  }, [
    dynamicText1,
    dynamicText2,
    dynamicText3,
    dynamicTextNoData,
    dynamicOverviewData,
    isFetching,
  ]);

  
  return (
    <>
      <Container maxWidth="lg">
        <WrapperDialog
          open={openNominationPopup}
          title={'Make a Nomination Offer'}
          onClose={() => setOpenNominationPopup(false)}
          farmId={farmId}
          openNominationWrapper={openNominationWrapper}
          selectedFarmHeader={''}
          setLoaderInProgress={setLoaderInProgress}
          body={NominationOfferForm}
        />
        <WrapperDialog
          open={openSuccess}
          title={'Message Sent'}
          onClose={() => setOpenSuccess(false)}
          openRegister={() => setOpenRegistration(true)}
          unregisteredSuccess={farmNameSuccess}
          farmNameSelected={farmName}
          body={UnRegisteredMessageSent}
          
        />
        <WrapperDialog
          open={forgotPassword}
          title="Forgot Password"
          onClose={() => setForgotPassword(false)}
          body={ForgotPassword}
        />

        <WrapperDialog
          open={openLogin}
          title={isFirstLogin ? 'Welcome to Stallion Match' : 'Log in'}
          onClose={() => setOpenLogin(false)}
          openOther={() => setOpenRegistration(true)}
          OFP={() => setForgotPassword(true)}
          body={Login}
          firstLogin={isFirstLogin}
          farmAdminFirstLogin={isFarmAdminFirstLogin}
        />
        <WrapperDialog
          open={openRegisteration}
          title={registrationTitle}
          onClose={() => setOpenRegistration(false)}
          openOther={() => setOpenLogin(true)}
          changeTitleTo={setRegistrationTitle}
          body={Registration}
          setIsFirstLogin={setIsFirstLogin}
          setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        />
        <WrapperDialog
          open={contactForm}
          title={titleForm}
          onClose={() => setContactForm(false)}
          openSuccessForm={handleSuccess}
          changeTheTitle={setTitleForm}
          getFarmName={getFarmName}
          stallionId={''}
          horseName={''}
          farmId={farmId}
          contactForm={contactForm}
          body={UnRegisteredUserContactForm}
         
        />
        <Grid container my={4}>
          <Grid lg={4} xs={12}>
            <Box className={`${checkNomination ? 'ownFarmMember' : ''}`}>
              <StallionDetailsCard {...props} />
              <Divider sx={{ borderColor: '#ffffff', borderWidth: '1px' }} flexItem />
              <Stack
                direction="row"
                className={`${isNominatedCheck ? 'MRclmn' : 'MRclmn MRclmn-NoRadius'}`}
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
                        <Typography variant="h5" className="farmBox">
                          Message Farm
                        </Typography>
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
                      (checkNomination === false || checkNomination === undefined) &&
                      isNominatedCheck
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
                        <Typography variant="h5" className="farmBox">
                          Request Nomination
                        </Typography>
                      </Stack>
                    </MenuItem>
                  </MenuList>

                  {checkNomination === true || isNominatedCheck ? (
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
                          <i className="icon-Info-circle"></i> Currently not accepting Nomination
                          offers.
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Stack>
            </Box>
          </Grid>
          <Grid lg={8} xs={12}>
            {isLoading ? (
              <Spinner />
            ) : (
              <Box className="farm-content" pl={4}>
                <Typography variant="body2">
                  {overview ? (
                    overview
                  ) : dynamicTextNoData !== 'No data found.' ? (
                    <>
                      {dynamicText1 == 'sentence1Exists' && (
                        <>
                          <Typography variant="body2">
                            {toTitleCase(dynamicOverviewData?.farmName)} is a thoroughbred breeding
                            farm located in{' '}
                            {`${
                              dynamicOverviewData?.farmState +
                              (dynamicOverviewData?.farmState && ', ') +
                              dynamicOverviewData?.farmCountry
                            }`}
                            . They currently stand {dynamicOverviewData?.StallionCount} stallions,
                            including {toTitleCase(dynamicOverviewData?.StallionList)}.
                          </Typography>
                          <br />
                        </>
                      )}

                      {dynamicText2 == 'sentence2Exists' && (
                        <>
                          <Typography variant="body2">
                            Their stallions have produced some great results, with{' '}
                            {toTitleCase(dynamicOverviewData?.Top1Stallion)} having sired{' '}
                            {dynamicOverviewData?.Top1StalliontotalWinnersCounts} winners and{' '}
                            {dynamicOverviewData?.TOP1StalliontotalStakeWinnersCounts} stakes
                            winners. Their youngest stallion,{' '}
                            {toTitleCase(dynamicOverviewData?.YoungestStallionName)}, entered stud
                            in {dynamicOverviewData?.YoungestStallionYearToStud}, and his oldest
                            progeny are {dynamicOverviewData?.YoungestStallionOldestProgenyAge}.
                          </Typography>
                          <br />
                        </>
                      )}

                      {dynamicText3 == 'sentence3Exists' && (
                        <Typography variant="body2">
                          Collectively, their stallions have amassed a total of{' '}
                          {dynamicOverviewData?.AllStationTotalStakeWinnersSince2011} stakes winners
                          and {dynamicOverviewData?.AllStationTotalWinnersSince2011} winners since
                          2011. Their stallions collectively generally produce winners ranging from{' '}
                          {dynamicOverviewData?.AllStationWinnersSmallestDistance} to{' '}
                          {dynamicOverviewData?.AllStationWinnersLongestDistance}.
                        </Typography>
                      )}
                    </>
                  ) : (
                    dynamicTextNoData
                  )}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
