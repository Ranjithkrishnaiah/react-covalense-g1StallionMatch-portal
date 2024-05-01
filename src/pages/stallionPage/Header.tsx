import {
  Container,
  Grid,
  Icon,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  StyledEngineProvider,
} from '@mui/material';
import { Box } from '@mui/system';
import './StallionPage.css';
import { CustomButton } from 'src/components/CustomButton';
import StallionProfileUpdatePage from 'src/forms/editStallionForms/StallionProfileUpdatePage';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { useEffect, useState } from 'react';
import {
  useAddFavouriteStallionMutation,
  useFavouriteStallionsQuery,
  useRemoveFavouriteStallionMutation,
} from 'src/redux/splitEndpoints/favStallionsSplit';
import { useLocation, useParams } from 'react-router';
import { useGetStallionInfoQuery } from 'src/redux/splitEndpoints/getStallionInfoSplit';
import PromoteStallion from 'src/forms/PromoteStallion';
import CopyLinkStallionPage from 'src/forms/CopyLinkStallionPageSplit';
import SocialShare from 'src/components/SocialShare';
import Registration from 'src/forms/Registration';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import Page from 'src/components/Page';
import { toPascalCase } from '../../utils/customFunctions';
import useAuth from 'src/hooks/useAuth';
import { Images } from 'src/assets/images';
import { useAuthUserDetailsQuery } from 'src/redux/splitEndpoints/getAuthUserDetails';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

type HeaderProps = {
  horseName: string;
  sireName: string;
  sireYob: Number;
  countryName: string;
  damName: string;
  damYob: Number;
  damCountryCode: string;
  fee: Number;
  feeYear: Number;
  isPromoted: boolean;
  farmId: string;
  isFarmOwner: boolean;
  accessLevel: string;
  roleId: Number;
  currencyCode: string;
};

function Header(dataProps: any) {
  
  const {
    horseName,
    sireName,
    sireYob,
    countryName,
    damName,
    damYob,
    damCountryCode,
    fee,
    feeYear,
    isPromoted,
    farmId,
    currencyCode,
    currencySymbol,
    customTitle,
    gallaryImage,
  } = dataProps.stallionDetails;

  let isFarmOwner = false;
  let accessLevel = null;
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [isEditPopupClose, setEditPopupClose] = useState(false);
  const [isPageClosed, setPageClosed] = useState<boolean>(false);

  dataProps = {
    ...dataProps,
    setProfileUpdate,
    isEditPopupClose,
    setEditPopupClose,
    isPageClosed,
    setPageClosed,
  };
  const closeEditPopup = () => {    
    if (!dataProps.isChanges) {
      setProfileUpdate(false);
      setEditPopupClose(false);
      dataProps.setPageClosed(false);
      dataProps.setSetChanges(false);
    } else {
      dataProps.setPageClosed(true);
    }
  };
  const { pathname } = useLocation();
  const { authentication, setLogout } = useAuth();
  const pathSplitForStallion = pathname.split('/');
  const stallionID: any = pathSplitForStallion[pathSplitForStallion?.length - 2];
  const action: string = pathSplitForStallion[pathSplitForStallion?.length - 1];  
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  // local storage
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [newlyPromoted, setNewlyPromoted] = useState(false);
  const [openCopyLink, setOpenCopyLink] = useState(false);
  const [isStallionPromoted, setIsStallionPromoted] = useState(false);
  const [myFarmId, setMyFarmId] = useState('');
  const {
    data: stallionInfoData,
    isSuccess: isStallionInfoSuccess,
    isLoading,
    isFetching
  } = useGetStallionInfoQuery(stallionID);
  const { data: userStallionListData, isSuccess: isFarmsListSuccess } = useGetUsersFarmListQuery("", { skip: !authentication,refetchOnMountOrArgChange: true });
  let isUserAccessStallion = userStallionListData?.find((stallionList: any) => stallionList?.stallions?.includes(stallionID));

  useEffect(() => {
    if (isStallionInfoSuccess) {
      setMyFarmId(stallionInfoData?.farmId);
      setIsStallionPromoted(stallionInfoData?.isPromoted);
    }
    if (isEditPopupClose) {
      setProfileUpdate(false);
    }
  }, [isStallionInfoSuccess, isEditPopupClose]);

  const stallionPromotionStatus = stallionInfoData?.isPromoted;
  const imgUrl = process.env.REACT_APP_STALLIONS_DEFAULT_IMAGE;

  const isFarmUserReal = authentication ? userStallionListData?.find((res: any) => res.farmId === myFarmId) : farmUser?.myFarms?.find((res: any) => res.farmId === myFarmId);
  
  const favParams: any = {
    stallionId: stallionID,
  };
  const [addToFavouriteStallion] = useAddFavouriteStallionMutation();
  const { data: favStallionData } = useFavouriteStallionsQuery(favParams, {
    skip: !authentication,
  });
  const [removeFavourites] = useRemoveFavouriteStallionMutation();
  const [openRegisteration, setOpenRegistration] = useState(false);
  const [registrationTitle, setRegistrationTitle] = useState('Create Account');
  const [openLogin, setOpenLogin] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [openedOnEditURL, setOpenedOnEditURL] = useState(false);
  const [loaderInProgress, setLoaderInProgress] = useState(false);

  
  
  const alreadFavourited: any = favStallionData?.data?.filter(
    (fav: any) => fav?.stallionId === stallionID
  );

  const handleFavourites = () => {
   
    if (alreadFavourited?.length > 0) {
      removeFavourites(favParams);
    } else {
      addToFavouriteStallion(favParams);
    }
  };

  const closePromotionPopup = () => {
    setNewlyPromoted(false);
  };
  const closeCopyLink = () => {
    setOpenCopyLink(false);
  };

  const closePromotionPopupSuccess = () => {
    setNewlyPromoted(false);
  };

  if (isFarmUserReal) {
    isFarmOwner = isFarmUserReal?.isFamOwner;
    accessLevel = isFarmUserReal?.accessLevel;
  }
  // console.log(isFarmUserReal,isFarmOwner,accessLevel,'isFarmUserReal')
  
  useEffect(() => {
    setProfileUpdate(false);
  }, [dataProps.close]);
  dataProps = {
    ...dataProps,
  };
  const pageUrl = window.location.href;
  if (
    isLoggedIn &&
    (accessLevel === 'Full Access') &&
    action === 'Edit' &&
    profileUpdate === false &&
    openedOnEditURL === false
  ) {
    setProfileUpdate(true);
    setOpenedOnEditURL(true);
    setEditPopupClose(false);
  }  

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Page
          title={`${toPascalCase(horseName)}`}
          meta={`${toPascalCase(horseName)}`}
          customTitle={customTitle}
          urlpath={window.location.pathname}
          gallaryImage={gallaryImage}
          sx={{ display: 'flex' }}
        >
          <Container maxWidth="lg">
            <Grid container className="title-container">
              <Grid item lg={12} xs={12} className="title-container-head">
                <Grid item lg={8} xs={12}>
                  <HeaderBreadcrumbs
                    heading="Profile"
                    links={[
                      { name: 'Stallion Directory', href: '/stallion-directory'},
                      { name: toPascalCase(horseName)?.toString() || '' },
                    ]}
                  />
                </Grid>
                <Typography variant="h2" title="">
                  {toPascalCase(horseName)}
                </Typography>
              </Grid>
              <Grid item lg={7} sm={7} xs={12} mt={2}>
                <Stack
                  direction={{ xs: 'column', sm: 'column', lg: 'row' }}
                  spacing={{ lg: '1', sm: '0' }}
                >
                  <Box className="stallion-subtitle">
                    <Typography variant="subtitle2">Sire:</Typography>
                    <Typography variant="body2" pl={1}>
                      {toPascalCase(sireName)} ({sireYob}, {countryName}
                      )<span>,</span>
                    </Typography>
                  </Box>
                  <Box className="stallion-subtitle" pl="4px">
                    <Typography variant="subtitle2">Dam:</Typography>
                    <Typography variant="body2" pl={1}>
                      {toPascalCase(damName)} ({damYob}, {damCountryCode})
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'column', lg: 'row' }} spacing={1}>
                  <Box className="stallion-subtitle">
                    <Typography variant="subtitle2">Stud Fee:</Typography>
                    <Typography variant="body2" pl={1} pr={1}>
                      {currencyCode?.substring(0, 2)}
                      {currencySymbol}
                      {fee?.toLocaleString()}
                    </Typography>

                    <Typography variant="subtitle2">Fee Year:</Typography>
                    <Typography variant="body2" pl={1}>
                      {feeYear}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid className="stallion-page-header-button" item lg={5} sm={5} xs={12}>
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 1, lg: 2 }}
                  sx={{
                    justifyContent: { lg: 'end', sm: 'end', xs: 'left' },
                    alignItems: 'center',
                  }}
                >
                  {isLoading ? (
                    ''
                  ) : (isLoggedIn && isFarmOwner) ||
                    (isLoggedIn &&
                      (accessLevel === 'Full Access')) ? (
                    <>
                      {!isStallionPromoted ? (
                        <Box>
                          <CustomButton onClick={() => setNewlyPromoted(true)} className="ListBtn">
                            Promote Stallion
                          </CustomButton>
                        </Box>
                      ) : (
                        ''
                      )}
                      <Box>
                        <CustomButton onClick={() => setOpenCopyLink(true)} className="ListBtn">
                          <i className="icon-Link" /> Copy link
                        </CustomButton>
                      </Box>
                      <Box>
                        <CustomButton
                          className="ListBtn"
                          onClick={() => {
                            setProfileUpdate(true);
                            setEditPopupClose(false);
                            dataProps.setPageClosed(false);
                            dataProps.setSetChanges(false);
                          }}
                        >
                          Edit Profile
                        </CustomButton>
                      </Box>
                    </>
                  ) : (
                    <>
                      <MenuList className="SPfavMenu share-button-stallion">
                        <MenuItem disableGutters>
                          <SocialShare shareUrl={pageUrl} title={toPascalCase(horseName)+""} mediaUrl={imgUrl} pageId={stallionID} pageType={'stallions'} />
                        </MenuItem>
                      </MenuList>
                      <MenuList
                        onClick={isLoggedIn ? handleFavourites : () => setOpenLogin(true)}
                        className={`SPfavMenu ${alreadFavourited?.length > 0 ? 'fav-active' : ''}`}
                      >
                        <MenuItem disableGutters>
                          {alreadFavourited?.length > 0
                            ? authentication && (
                                <em className="add-fav-extracol">
                                  <img
                                    src={Images.StarFilled}
                                    alt="StarFilled"
                                    className="icon-star-filled"
                                  />
                                </em>
                              )
                            : authentication &&
                            (typeof(isUserAccessStallion) == 'undefined') && (
                                <em className="add-fav-extracol">
                                  <i className="icon-Star" />
                                </em>
                              )}
                          <span>
                            {alreadFavourited?.length > 0
                              ? 'Favourite'
                              : authentication && (typeof(isUserAccessStallion) == 'undefined') && 'Add to Stallion List'}
                          </span>
                        </MenuItem>
                      </MenuList>
                    </>
                  )}
                </Stack>
              </Grid>
              <WrapperDialog
                open={openRegisteration}
                title={registrationTitle}
                onClose={() => setOpenRegistration(false)}
                openOther={() => setOpenLogin(true)}
                changeTitleTo={setRegistrationTitle}
                body={Registration}
                setIsFirstLogin={setIsFirstLogin}
                setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
                emailValue={''}
                isAgreed={isAgreed}
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
                open={newlyPromoted}
                title={'Promote Stallion'}
                onClose={closePromotionPopup}
                promoteStallionType={() => {}}
                selectedStallionIds={''}
                stallionId={stallionID || ''}
                onCloseSuccess={closePromotionPopupSuccess}
                body={PromoteStallion}
              />
              <WrapperDialog
                open={openCopyLink}
                title={'Unique Stallion URL'}
                onClose={closeCopyLink}
                farmId={farmId}
                openNominationWrapper={openCopyLink}
                selectedFarmHeader={''}
                setLoaderInProgress={setLoaderInProgress}
                body={CopyLinkStallionPage}
              />
            </Grid>
          </Container>
          {farmId ? (
            <WrapperDialog
              dialogClassName={'dialogPopup updateFormPopup editStallionProfileModal'}
              className=""
              open={profileUpdate}
              title="Edit Stallion Profile"
              onClose={closeEditPopup}
              body={StallionProfileUpdatePage}
              propDetails={dataProps}
            />
          ) : (
            ''
          )}
        </Page>
      </StyledEngineProvider>
    </>
  );
}

export default Header;
