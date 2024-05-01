import {
  Container,
  Grid,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  StyledEngineProvider,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Images } from 'src/assets/images';
import { CustomButton } from 'src/components/CustomButton';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import FarmProfileUpdate from 'src/forms/editFarmForms/FarmProfileUpdatePage';
import SocialShare from 'src/components/SocialShare';
import { toPascalCase } from 'src/utils/customFunctions';
import Page from 'src/components/Page';
import { useAddToFarmsMutation } from 'src/redux/splitEndpoints/addToFavFarmsSplit';
import { useDeleteFromFavFarmsMutation } from 'src/redux/splitEndpoints/deleteFromFavFarmsSplit';
import { useGetFavoriteFarmsQuery } from 'src/redux/splitEndpoints/getFavFarmsSplit';
import '../stallionPage/StallionPage.css';
import '../stallionSearch/stallionsearch.css';
import useAuth from 'src/hooks/useAuth';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

function    Header(data: any) {
  const props = data?.farmDetails;
  const [confirmCloseEdit, setConfirmCloseEdit] = useState<boolean>(false);
  const { farmName, gallaryImage } = props;
  const { authentication } = useAuth();
  const { data: userFarmListData, isSuccess: isFarmsListSuccess } = useGetUsersFarmListQuery("", { skip: !authentication });
  let isFarmOwner = false;
  let accessLevel = null;
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { pathname } = useLocation();
  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];  
  const isFarmUser: any = data?.farmList?.find((res: any) => res.farmId == props?.farmId);
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [isEditPopupClose, setEditPopupClose] = useState(false);
  const [isPageClosed, setPageClosed] = useState<boolean>(false);
  let userFarm = userFarmListData?.find((farmList: any) => farmList.farmId === farmID);
  const farmData: any = {
    farmId: farmID,
  };
  data = {
    ...data,
    confirmClose: confirmCloseEdit,
    setConfirm: setConfirmCloseEdit,
    setProfileUpdate,
    isEditPopupClose,
    setEditPopupClose,
    isPageClosed,
    setPageClosed,
  };
  const closeEditPopup = () => {
    
    if (!data.isChanges) {
      setProfileUpdate(false);
      setEditPopupClose(false);
      data.setPageClosed(false);
      data.setSetChanges(false);
    } else {
      data.setPageClosed(true);
    }
  };
  useEffect(() => {
    if (isEditPopupClose) setProfileUpdate(false);
  }, [isEditPopupClose]);

  const [addToFavFarms] = useAddToFarmsMutation();
  const [removeFavFarms] = useDeleteFromFavFarmsMutation();
  const { data: favouriteFarmsData } = useGetFavoriteFarmsQuery(farmData);

  const alreadFavourited: any = favouriteFarmsData?.data?.filter(
    (fav: any) => fav?.farmId === farmID
  );
  const handleFavourites = () => {
    if (alreadFavourited?.length > 0) {
      removeFavFarms(farmData);
    } else {
      addToFavFarms(farmData);
    }
  };

  if (isFarmUser) {
    isFarmOwner = isFarmUser.isFamOwner;
    accessLevel = isFarmUser.accessLevel;
  }
  useEffect(() => {
    setProfileUpdate(false);
    data.setClose(false);
  }, [data.close]);

  const navigate = useNavigate();
  const goToStallionRoster = (event: any) => {
    navigate('/dashboard/stallion-roster/' + props?.farmId);
  };
  const pageUrl = window.location.href;
  const imgUrl = process.env.REACT_APP_STALLIONS_DEFAULT_IMAGE;
  return (
    <>
      <StyledEngineProvider injectFirst>
        <Page
          title={`${toPascalCase(farmName)}`}
          meta={`${toPascalCase(farmName)}`}
          sx={{ display: 'flex' }}
          urlpath={window.location.pathname}
          gallaryImage={gallaryImage}
          className="farm-page-header"
        >
          <Container maxWidth="lg">
            <Grid container mt={7} mb={4}>
              <Grid item lg={8} xs={12}>
                <HeaderBreadcrumbs
                  heading="Profile"
                  links={[
                    { name: 'Farm Directory', href: '/farm-directory' },
                    { name: toPascalCase(farmName)?.toString() || '' },
                  ]}
                />
              </Grid>
              <Grid item lg={8} sm={7} xs={12} className="title-container-head">
                <Typography variant="h2">{toPascalCase(farmName)}</Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={5}
                xs={12}
                sx={{ margin: 'auto 0' }}
                className="stallion-page-header-button farms-page-header-button"
              >
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 1, lg: 2 }}
                  className="farm-header-btns"
                >
                  {(isLoggedIn && isFarmOwner) ||
                  accessLevel === 'Full Access' ||
                  accessLevel === 'View Only' ? (
                    <>
                      <Box>
                        <CustomButton className="ListBtn" onClick={goToStallionRoster}>
                          Manage Stallions
                        </CustomButton>
                      </Box>
                      <Box>
                        <CustomButton
                          className="ListBtn"
                          onClick={() => {
                            setProfileUpdate(true);
                            setEditPopupClose(false);
                            data.setPageClosed(false);
                            data.setSetChanges(false);
                          }}
                        >
                          Edit Farm Page
                        </CustomButton>
                      </Box>
                    </>
                  ) : (
                    <>
                      <MenuList className="SPfavMenu share-button-stallion">
                        <MenuItem disableGutters>
                          <SocialShare shareUrl={pageUrl} title={toPascalCase(farmName)+""} mediaUrl={imgUrl} pageId={props?.farmId} pageType={'farms'}/>
                        </MenuItem>
                      </MenuList>

                      <MenuList
                        onClick={handleFavourites}
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
                                (typeof(userFarm) == 'undefined') && (
                                <em className="add-fav-extracol">
                                  <i className="icon-Star" />
                                </em>
                              )}
                          <span>
                            {alreadFavourited?.length > 0
                              ? 'Farm List'
                              : authentication &&
                                (typeof(userFarm) == 'undefined') &&
                                ' Add to Farm List'}
                          </span>
                        </MenuItem>
                      </MenuList>
                    </>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Container>
          <WrapperDialog
            dialogClassName={
              'dialogPopup updateFormPopup editStallionProfileModal editFarmProfileModal'
            }
            className=""
            open={profileUpdate}
            title="Edit Farm Profile"
            onClose={closeEditPopup}
            body={FarmProfileUpdate}
            propDetails={data}
          />
        </Page>
      </StyledEngineProvider>
    </>
  );
}

export default Header;
