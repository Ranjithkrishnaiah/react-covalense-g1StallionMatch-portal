import React, { useState, useEffect, createRef } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Popover,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
  Stack,
} from '@mui/material';
import { Images } from '../../assets/images';
import { Box } from '@mui/system';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './layout.css';
import { StyledEngineProvider, styled } from '@mui/material/styles';
import { ROUTES } from '../../routes/paths';
import { WrapperDialog } from '../../components/WrappedDialog/WrapperDialog';
import Login from '../../forms/Login';
import ForgotPassword from 'src/forms/ForgotPassword';
import useAuth from '../../hooks/useAuth';
import { useCommunicate } from '../../hooks/useComponentCommunication';
import Checkout from 'src/components/checkout/Checkout';
import Signup from '../../components/Signup';
import { CustomButton } from 'src/components/CustomButton';
import AddFarm from 'src/forms/AddFarm';
import AddStallion from 'src/forms/AddStallion';
import CreateAStallion from 'src/forms/CreateAStallion';
import Badge from '@mui/material/Badge';
import Registration from 'src/forms/Registration';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { scrollToTop } from '../../utils/customFunctions';
import { useGetMessageCountQuery } from 'src/redux/splitEndpoints/getUnreadMessageCount';
import { useGetNotificationCountQuery } from 'src/redux/splitEndpoints/getUnreadNotificationCount';
import { useGetProfileImageQuery } from 'src/redux/splitEndpoints/addUserProfileImage';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import { useGetCartItemsQuery } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import {
  useStallionShortlistsIdsQuery,
  useStallionShortlistsQuery,
} from 'src/redux/splitEndpoints/stallionShortListSplit';
import { initialState } from 'src/pages/stallionDirectory/SDInitialState';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import PromoteStallion from 'src/forms/PromoteStallion';
import SessionExpired from 'src/forms/SessionExpired';

function MainHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { headerBackground } = useCommunicate();
  const [userName, setUserName] = useState<string | undefined>('');
  const [openLogin, setopenLogin] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openRegisteration, setOpenRegistration] = useState(false);
  const [registrationTitle, setRegistrationTitle] = useState('Create Account');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
  const { authentication, setLogout } = useAuth();
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');
  const [picture, setPicture] = useState('');
  const [farmDetails, setFarmDetails] = useState<any[]>([]);
  const [cartItemList, setCartItemList] = useState<any[] | undefined>([]);
  const [farmLength, setFarmLength] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState<any>({});
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [isActive, setIsActive] = useState<string | undefined>(pathname);

  const [openFarmModal, setOpenFarmModal] = useState(false);
  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [stallionId, setStallionId] = useState('');
  const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
  const [newllyPromoted, setNewlyPromoted] = useState(false);

  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);

  // Check the url for invite user, if link expired, open expired invite modal
  const [openSessionExpire, setOpenSessionExpire] = useState(false);
  const [sessionExpireError, setSessionExpireError] = useState<any>(null);
  const isTokenExpired = window.localStorage.getItem('isTokenExpired');  


  
  const isStallionPage = pathname.includes('View');
  const isStallionDirectoryPage = pathname.includes('/stallion-directory');
  const isFarmDirectoryPage = pathname.includes('/farm-directory');
  const isFarmPage = pathname.includes('stud-farm');
  
  useEffect(() => {
    if (!isStallionDirectoryPage && !isStallionPage) { 
      // console.log('Both conditions satisfied');  
      window.localStorage.setItem('storedFiltered', '');
      window.localStorage.setItem('comeFromDirectory', 'false');
      window.localStorage.setItem('storedFilteredSire', '');
      window.localStorage.setItem('storedFilteredDamSire', '');
      window.localStorage.setItem('storedFilteredKeyAncestor', '');
      window.localStorage.setItem('storedFilteredGrandSire', '');
    }
    if (!isFarmDirectoryPage && !isFarmPage) { 
      // console.log('Both farm conditions satisfied');  
      window.localStorage.setItem('storedFarmFiltered', '');
      window.localStorage.setItem('comeFromFarmDirectory', 'false');
      window.localStorage.setItem('storedFarmFilteredSire', '');
      window.localStorage.setItem('storedFarmFilteredDamSire', '');
      window.localStorage.setItem('storedFarmFilteredKeyAncestor', '');
      window.localStorage.setItem('storedFarmFilteredGrandSire', '');
    }
  }, [pathname])

  
  useEffect(() => {
    if (isTokenExpired === 'Yes') {   
      setOpenSessionExpire(true);   
      setSessionExpireError('Please log in again to continue using the app.');
    }
  }, [isTokenExpired])

  const navOptions = ['Dashboard', 'For Farms', 'Search', 'Directory', 'Trends', 'Reports'];

  // Get all message count api call
  const { data: MessageCount, isSuccess: isMessageCountSuccess } = useGetMessageCountQuery(null, {
    skip: !authentication,
  });

  // Get all notification count api call
  const { data: NotificationCount, isSuccess: isNotificationCountSuccess } =
    useGetNotificationCountQuery(null, { skip: !authentication });
  
  // Get all user farm list api call  
  const { data: userFarmListData, isSuccess: isFarmsListSuccess,isFetching:userFarmListDataFetching } = useGetUsersFarmListQuery('', {
    skip: !authentication,refetchOnMountOrArgChange: true
  });

  // Get all user cart list api call  
  const { data: cartItems, isSuccess: isCartItemsSuccess } = useGetCartItemsQuery(null, {
    skip: !authentication,refetchOnMountOrArgChange: true
  });

  // Get auth user list api call  
  const { data: MyDetails, isSuccess: isMyDetailsSuccess,isFetching:MyDetailsFetching } = useAuthMeQuery(null, {
    skip: !authentication,refetchOnMountOrArgChange: true
  });

  // Get auth user shortlist stallion Ids api call  
  const { data: shortlistStallionIds, isSuccess: isLoggedInShortlistStallionSuccess } =
    useStallionShortlistsIdsQuery({}, { skip: !authentication });
  
  let orders = cartItemList;
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;

  // Get auth user shortlist stallion list api call  
  const shortlistResponse_logged = useStallionShortlistsQuery(initialState, { skip: !isLoggedIn });

  // Once auth user data is fetched, set the full name in state variable 
  useEffect(() => {
    if (isMyDetailsSuccess) {
      setUserName(MyDetails?.fullName);
    }
  }, [isMyDetailsSuccess,MyDetailsFetching]);
  
  useEffect(() => {
    if (isCartItemsSuccess) {
      setCartItemList(cartItems);
    }
  }, [isCartItemsSuccess, cartItems]);
  
  useEffect(() => {
    let SampleData = {
      id: 12,
      name: 'Sample',
    };
    if (localStorage.getItem('user') !== null) {
      setUser(JSON.parse(localStorage.getItem('user') || '{}') || SampleData);
    }
  }, [userFarmListData,userFarmListDataFetching]);

  // Get auth user profile image api call  
  const { data: userProfileData, isSuccess: getProfileSuccess,isFetching: getProfileFetching } = useGetProfileImageQuery(null, {
    skip: !authentication,refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (isFarmsListSuccess) {
      const activeFarms = userFarmListData?.filter((farm: any) => farm?.isActive === true);
      setFarmDetails(activeFarms);
    }
  }, [isFarmsListSuccess,userFarmListDataFetching]);

  // Once auth user profile image data is fetched, set the picture in state variable
  useEffect(() => {
    if (getProfileSuccess) {
      setPicture(userProfileData?.memberprofileimages);
    }
  }, [getProfileSuccess,getProfileFetching]);

  // Close the stallion popup modal
  const handleCloseStallion = () => {
    setOpenStallionModal(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  
  let myFarmIds: any[] = [];
  if (farmDetails && user) {
    typeof user === 'string' && setUser(JSON.parse(user));
    myFarmIds = farmDetails?.filter((farm: any) => farm.farmId);
  }

  // Open the login popup modal
  const openLoginPopup = () => {
    setopenLogin(true);
  };

  // Open the login popup modal in mobile view
  const openLoginPopupMobile = (event: any) => {
    setopenLogin(true);
    handleClick(event);
  };

  // Open the signup popup modal in mobile view
  const openSignUpPopupMobile = (event: any) => {
    setOpenRegistration(true);
    handleClick(event);
  };

  // Open the signup popup modal 
  const openRegistrationPopup = () => setOpenRegistration(true);

  // Close the login popup modal 
  const closeLogin = () => setopenLogin(false);

  // Open the forgot password popup modal 
  const openForgotPasswordPopup = () => setForgotPassword(true);

  // Close the forgot password popup modal 
  const closeForgotPassword = () => setForgotPassword(false);

  // Close previous modal upon uponing new modal
  const handleClose = () => {
    setAnchorEl(null);
    setOpenDrawer(!openDrawer);
  };

  // Open the add farm popup modal 
  const handleAddFarm = () => {
    setOpenFarmModal(true);
    setAnchorEl(null);
  };

  // Open the add stallion popup modal 
  const handleAddStallion = () => {
    setOpenStallionModal(true);
    handleClose();
  };

  // Scroll to top while a page is loading
  const displayFromTop = () => scrollToTop();

  const {
    DASHBOARD,
    STALLION_MATCH,
    STALLION_SEARCH,
    DIRECTORY,
    TRENDS,
    REPORTS,
    NOTIFICATIONS,
    MESSAGES,
    USERPROFILE,
    FARMPROFILE,
    FARMDASHBOARDPROFILE,
    MYHORSES,
    SHORTLIST,
    CONTACT_US,
  } = ROUTES;

  const navRoutes = [DASHBOARD, STALLION_MATCH, STALLION_SEARCH, DIRECTORY, TRENDS, REPORTS];

  if (pathname === '/' && isActive !== undefined) setIsActive(undefined);
  
  switch (pathname) {
    case '/promote-your-stallion':
      if (isActive !== pathname) {
        setIsActive(pathname);
      }
  }

  // Hilight the menu item and scroll to top method call  
  const handleNavClick = (e: any) => {
    setIsActive(e.target.id);
    displayFromTop();
  };

  // Open the drawer for a popup modal
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpenDrawer(!openDrawer);
    if (openDrawer) {
      setAnchorEl(null);
    }
  };

  // Open the create stallion popup modal
  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  let notificationCount: any =
    isLoggedIn &&
    typeof NotificationCount?.unreadCount === 'number' &&
    typeof MessageCount?.unreadCount === 'number'
      ? NotificationCount?.unreadCount + MessageCount?.unreadCount
      : '';      
 
  // Logout functionality and redirect to home page    
  const logout = (event: any) => {
    setLogout(true);
    navigate('/');
    handleClick(event);
    sessionStorage.clear();
  };

  // Hilight the menu item for For Farms and redirect to for farms page   
  const goToStallionmatch = (event: any) => {
    navigate('/promote-your-stallion');
    handleClick(event);
  };

  // Hilight the menu item for Search and redirect to for search page
  const goToSearch = (event: any) => {
    navigate('/stallion-search');
    handleClick(event);
  };

  // Hilight the menu item for Stallion Directory and redirect to for stallion directory page
  const goToDirectory = (event: any) => {
    navigate('/stallion-directory');
    handleClick(event);
  };

  // Hilight the menu item for Trends and redirect to for Trends page
  const goToTrends = (event: any) => {
    navigate('/stallion-trends');
    handleClick(event);
  };

  // Hilight the menu item for Reports and redirect to for reports page
  const goToReports = (event: any) => {
    navigate('/reports');
    handleClick(event);
  };

  // Hilight the menu item for Contact Us and redirect to for contact us page
  const goToContactUs = (event: any) => {
    navigate(CONTACT_US);
    handleClick(event);
  };

  // Redirect to for member profile page
  const goToUserProfile = (event: any) => {
    navigate(USERPROFILE);
    handleClick(event);
  };

  

  // Redirect to for clicked farm profile page
  const goToFarmPage = (event: any, id: string) => {
    goToFarmProfile(event, id);
  };

  // Redirect to for Farm dashboard profile page
  const goToFarmProfile = (event: any, id: string) => {
    const selectedfarm = farmDetails?.length && farmDetails?.find((item) => item.farmId === id);
    navigate(FARMDASHBOARDPROFILE + selectedfarm?.farmName + '/' + id);
    handleClick(event);
  };
  
  // Redirect to for My Horse page
  const goToMyHorses = (event: any) => {
    navigate(MYHORSES);
    handleClick(event);
  };

  // Redirect to for Notifications page
  const goToNotifications = (event: any) => {
    navigate(NOTIFICATIONS);
    handleClick(event);
  };

  // Redirect to for Messages page
  const goToMessages = (event: any) => {
    window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
    window.sessionStorage.setItem('SessionFilteredFarm', '');
    navigate(`${MESSAGES}`);
    handleClick(event);
  };

  // Redirect to for ShortList page
  const goToShortList = (event: any) => {
    if (isLoggedIn) {
      window.sessionStorage.setItem(
        'ShortListStallion',
        JSON.stringify(shortlistResponse_logged?.data?.data)
      );
    }
    navigate(SHORTLIST);
    localStorage.setItem('myStallionShortListPage', '1');
    localStorage.removeItem('isStallionShortListPage');
    handleClick(event);
  };

  const goToDashboard = (event:any) => {
    navigate('/dashboard');
    handleClick(event);
  }

  const isHome = pathname === '/' || pathname === '/promote-your-stallion' || pathname === '/about' || pathname === '/careers';  
  const localShortList: any = sessionStorage?.getItem('stallionIds')?.split('|');
  const loggedinShortList: any = shortlistStallionIds?.length; 
  const farmTempId = process.env.REACT_APP_FARM_TEMP_ID;

  // Close the crete stallion popup
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
    setStallionTitle('Add a Stallion');
  };

  // Routing link for header menu item
  const getLink = (linkName: string, event: any, id: any, index: number) => {
    switch (linkName) {
      case USERPROFILE:
        return goToUserProfile(event);

      case FARMPROFILE:
        return goToFarmPage(event, id);

      case MYHORSES:
        return goToMyHorses(event);

      case NOTIFICATIONS:
        return goToNotifications(event);

      case MESSAGES:
        return goToMessages(event);

      case CONTACT_US:
        return goToContactUs(event);

      case 'SIGNOUT':
        return logout(event);
    }
  };

  // All the user meatball menu link details
  const menuList = [
    {
      linkName: 'Profile',
      isAvatar: false,
      Avatar: '',
      link: '',
      hasIcon: false,
      icon: '',
      isItemId: false,
      isFarmId: false,
      style: { cursor: 'default !important' },
    },
    {
      linkName: userName || 'User',
      isAvatar: true,
      Avatar: '',
      link: USERPROFILE,
      hasIcon: false,
      icon: '',
      isItemId: true,
      isFarmId: false,
    },
    {
      linkName: 'My Horses',
      isAvatar: false,
      link: MYHORSES,
      hasIcon: true,
      icon: 'icon-Chevron-right',
      isItemId: true,
      isFarmId: false,
    },
    {
      linkName: 'Notifications',
      isAvatar: false,
      link: NOTIFICATIONS,
      hasIcon: true,
      icon: '',
      isItemId: true,
      isFarmId: false,
    },
    {
      linkName: 'Messages',
      isAvatar: false,
      link: MESSAGES,
      hasIcon: true,
      icon: '',
      isItemId: true,
      isFarmId: false,
    },
    {
      linkName: 'Contact Us',
      isAvatar: false,
      link: CONTACT_US,
      hasIcon: false,
      icon: '',
      isItemId: false,
      isFarmId: false,
    },
    {
      linkName: 'Sign Out',
      isAvatar: false,
      link: 'SIGNOUT',
      hasIcon: false,
      icon: '',
      isItemId: false,
      isFarmId: false,
    },
  ];

  // Based on auth user farm list api response, generate farm name with link and profile picture 
  let Farms: any[] = farmDetails?.map((farm: any) => ({
    linkName: farm.farmName,
    isAvatar: true,
    Avatar: farm.profilePic || Images.farmlogo,
    link: FARMPROFILE,
    hasIcon: false,
    icon: '',
    isItemId: false,
    isFarmId: true,
    isActive: farm.isActive,
  }));

  // Filter the farm list info by isActive = true
  Farms = Farms.filter((farm: any) => farm.isActive === true);

  // Append the farm list in menu list
  if (Farms) {
    menuList?.splice(2, 0, ...Farms);
  }

  // Add the style in meatball menu profile pic
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 2,
      top: 3,
      color: '#ffffff',
      background: '#C75227',
      border: `3px solid #C75227`,
      padding: '1px 0px 2px',
      borderRadius: '100%',
      minWidth: 'inherit',
      fontFamily: 'Synthese-Bold',
      fontWeight: '700',
      fontSize: '6px',
      lineHeight: '11px',
      letterSpacing: '0.02em',
      width: '14px',
      height: '14px',
    },
  }));

  function dynamicFarmId(index: number) {
    return myFarmIds[index - 2].farmId;
  }

  function linkDisplay() {
    return menuList.map((page, index) => {
      let id: any = page?.isItemId
        ? user?.id
        : page?.isFarmId
        ? myFarmIds.length > 0
          ? dynamicFarmId(index)
          : farmTempId
        : 12;
      const iconName = page?.hasIcon ? page?.icon : '';
      const displayLinkNames = () => {
        return (
          <Typography
            variant="h6"
            sx={page.style}
            onClick={(event: any) => getLink(page?.link, event, id, index)}
          >
            {toPascalCase(page.linkName)}
          </Typography>
        );
        //}
      };

      return (
        <>          
          {index === 5 + myFarmIds?.length && <Divider />}{' '}
          <List>
            <ListItem>
              {page?.isAvatar && (
                <Avatar
                  alt={page?.linkName}
                  src={
                    authentication && index === 1
                      ? picture || Images.User
                      : authentication && index !== 1
                      ? page?.Avatar
                      : Images.farmlogo
                  }
                  style={{ width: '28px', height: '28px', marginRight: '5px' }}
                />
              )}
              <ListItemText>{displayLinkNames()}</ListItemText>
              {index !== 1 && index !== 2 && (
                <ListItemIcon>
                  {page.linkName === 'Messages' || page.linkName === 'Notifications' ? (
                    page.linkName === 'Messages' && MessageCount?.unreadCount ? (
                      <span>{MessageCount?.unreadCount}</span>
                    ) : page.linkName === 'Notifications' && NotificationCount?.unreadCount ? (
                      <span>{NotificationCount?.unreadCount}</span>
                    ) : (
                      ''
                    )
                  ) : (
                    <i className={`${iconName}`} />
                  )}
                </ListItemIcon>
              )}
            </ListItem>
          </List>
        </>
      );
    });
  }

  // Set stallion Id
  const handleSelectedStallions = (value: any) => {
    setStallionId(value);
  };

  // Open promote stallion modal
  const handleOpenPromoteStallion = () => {
    setAddStallionPromoteModal(true);
  };

  // Close promote stallion modal
  const handleClosePromoteStallion = () => {
    setAddStallionPromoteModal(false);
  };

  // Open new promote stallion modal
  const handleOpenPromoteNew = () => {
    setNewlyPromoted(true);
  };

  // Close new promote stallion modal
  const handleClosePromoteNew = () => {
    setNewlyPromoted(false);
  };
  
  let reportList = localStorage.getItem('orderReports');
  let reportListData = reportList && JSON.parse(reportList);
  const updatedOrders: any = isLoggedIn ? orders : reportListData?.length ? reportListData : [];

  return (
    <StyledEngineProvider injectFirst>
      <AppBar
        position={isHome ? 'sticky' : 'sticky'}
        className={
          isHome
            ? headerBackground
              ? 'ScrollHeader commonheader'
              : 'topHomeHeader commonheader'
            : 'topHeader commonheader'
        }
      >
        <Container maxWidth="lg" className="headerCnt">
          <Toolbar disableGutters>
            <Typography
              className="header-logo"
              sx={{ flexGrow: 1, mr: 2, display: { xs: 'flex', md: 'flex' } }}
            >
              <Link to="/">
                <img src={Images.logo} alt="Stallion Match Logo" />
              </Link>
            </Typography>
            <Box
              sx={{
                flexGrow: 0,
                display: {
                  xs: 'none',
                  lg: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                },
              }}
            >
              <Typography className="main-navigation-text">
                {authentication && (
                  <Link
                    className={pathname === '/dashboard' ? 'active nav' : 'nav'}
                    id="/dashboard"
                    to={DASHBOARD}
                    onClick={handleNavClick}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  className={pathname === '/promote-your-stallion' ? 'active nav' : 'nav'}
                  id="/ForFarms"
                  to={STALLION_MATCH}
                  onClick={handleNavClick}
                >
                  For Farms
                </Link>
                <Link
                  className={pathname?.includes('stallion-search') ? 'active nav' : 'nav'}
                  id="/stallion-search"
                  to={STALLION_SEARCH}
                  onClick={handleNavClick}
                >
                  Search
                </Link>
                <Link
                  className={
                    pathname === '/stallion-directory' || pathname === '/farm-directory'
                      ? 'active nav'
                      : 'nav'
                  }
                  id="/stallion-directory"
                  to={DIRECTORY}
                  onClick={handleNavClick}
                >
                  Directory
                </Link>
                <Link
                  className={pathname === '/stallion-trends' ? 'active nav' : 'nav'}
                  id="/stallion-trends"
                  to={TRENDS}
                  onClick={handleNavClick}
                >
                  Trends
                </Link>
                <Link
                  className={pathname === '/reports' ? 'active nav' : 'nav'}
                  id="/reports"
                  to={REPORTS}
                  onClick={handleNavClick}
                >
                  Reports
                </Link>
              </Typography>

              {/* <CustomizedDialogs/> */}
              {!authentication && (
                <Stack className="header-account" mx={1} direction="row">
                  {!authentication && (
                    <Button
                      disableRipple
                      onClick={openLoginPopup}
                      className="homeLogin"
                      style={{ marginRight: '16px' }}
                    >
                      Login
                    </Button>
                  )}
                  <WrapperDialog
                    open={forgotPassword}
                    title="Forgot Password"
                    onClose={closeForgotPassword}
                    body={ForgotPassword}
                  />

                  <WrapperDialog
                    dialogClassName="dialogPopup createAccountPopup"
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
                  <WrapperDialog
                    open={forgotPassword}
                    title="Forgot Password"
                    onClose={() => setForgotPassword(false)}
                    body={ForgotPassword}
                  />

                  {!authentication && <Signup />}
                </Stack>
              )}
            </Box>
            {/* ..........checkout......... */}            
            <Box className="cart" sx={{ display: { xs: 'flex', md: 'flex' } }}>
              <Checkout orders={updatedOrders} />
            </Box>
            <Box className="hamburger" sx={{ flexGrow: 0 }} onClick={handleClick}>
              <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }}>
                {notificationCount > 0 ? (
                  <StyledBadge badgeContent={notificationCount} color="secondary">
                    <Avatar
                      alt={userName}
                      src={!authentication ? Images.User : picture || Images.User}
                      sx={{ width: '30px', height: '30px' }}
                    />
                  </StyledBadge>
                ) : (
                  <Avatar
                    alt={userName}
                    src={authentication ? picture : Images.User}
                    sx={{ width: '30px', height: '30px' }}
                  />
                )}
              </IconButton>
              <Button disableRipple aria-describedby={id} variant="text" className="SMtoggleIcon">
                {!anchorEl && (
                  <IconButton
                    disableRipple
                    sx={{ display: { xs: 'flex', md: 'flex', lg: 'flex', color: '#1D472E' } }}
                  >
                    <img src={Images.toggle} alt="toggle" style={{ paddingLeft: '8px' }} />
                  </IconButton>
                )}
                {anchorEl && (
                  <IconButton
                    sx={{ display: { xs: 'flex', md: 'flex', lg: 'flex', color: '#1D472E' } }}
                  >
                    <img
                      src={Images.cross}
                      alt="cross"
                      style={{ width: '24px', height: '24px', paddingLeft: '8px' }}
                    />
                  </IconButton>
                )}
              </Button>
            </Box>

            <Popover
              sx={{ display: { lg: 'flex', xs: 'none' }, cursor: 'pointer' }}
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              className="home-dropdown"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {authentication && (
                <Box className="navigation-dropdown">
                  {linkDisplay()}                  
                  <List>
                    <ListItem>
                      <ListItemText className="shortlist-regis">
                        <Typography
                          variant="h5"
                          onClick={goToShortList}
                          className={
                            pathname?.includes('/my-shortlist')
                              ? 'greyout'
                              : loggedinShortList > 0
                              ? ''
                              : 'greyout'
                          }
                        >
                          Stallion Shortlist{' '}
                          <StarRoundedIcon
                            className="starIcon"
                          />
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      <CustomButton
                        disableRipple
                        className="viewButton"
                        sx={{ width: '100%' }}
                        onClick={() => {
                          setOpenFarmModal(true);
                          handleClose();
                        }}
                      >
                        Add a New Farm <i className="icon-Plus" />
                      </CustomButton>
                    </ListItem>
                  </List>
                  {farmDetails?.length > 0 && (
                    <List>
                      <ListItem>
                        <CustomButton
                          disableRipple
                          className="add-a-stallion"
                          onClick={handleAddStallion}
                        >
                          Add a Stallion <i className="icon-Plus" />
                        </CustomButton>
                      </ListItem>
                    </List>
                  )}
                </Box>
              )}
              {!authentication && (
                <Box className="navigation-dropdown">
                  <List>
                    <ListItem className="shorlist">
                      <ListItemText>
                        <Typography
                          variant="h6"
                          onClick={goToShortList}
                          className={
                            localShortList && localShortList?.length > 0
                              ? pathname?.includes('/my-shortlist')
                                ? 'greyout'
                                : ''
                              : 'greyout'
                          }
                        >
                          Stallion Shortlist{' '}
                          <StarRoundedIcon style={{ position: 'relative', top: '2px' }} />
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="h6" onClick={goToContactUs}>
                          Contact Us
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                </Box>
              )}
            </Popover>            
            <Drawer
              sx={{ display: { lg: 'none', xs: 'flex' }, zIndex: '0' }}
              open={openDrawer}
              anchor={'right'}
              variant="temporary"
              onClose={(_: any, reason: any) => {
                if (openDrawer) {
                  setAnchorEl(null);
                }
                return reason === 'backdropClick' && setOpenDrawer(!openDrawer);
              }}
              className="main-drawer-wrapper"
            >
              {authentication && (
                <Box sx={{ display: { xs: 'flex', lg: 'none' } }} className="nav-mobile-dropdown">
                  <Box
                    className="nav-mobile-header"
                    sx={{ height: '92px', background: '#1D472E', position: 'sticky', top: '0' }}
                  >
                    &nbsp;
                  </Box>
                  <Box className="mobile-nav">
                  <List>
                      <ListItem
                        className={`${
                          pathname === '/dashboard' ? 'disabled-menu' : ''
                        }`}
                      >
                        <ListItemText>
                          <Typography variant="h6" onClick={goToDashboard}>
                           My Dashboard
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <List>
                      <ListItem
                        className={`${pathname === '/user/profile' ? 'disabled-menu' : ''}`}
                      >
                      </ListItem>
                      <ListItem sx={{ mb: '6px' }}>
                        <Avatar
                          alt={userName}
                          src={!authentication ? Images.User : picture || Images.User}
                          style={{ width: '24px', height: '24px', marginRight: '5px' }}
                        />
                        <ListItemText>
                          <Typography variant="h6" onClick={goToUserProfile}>
                            {userName || 'User'}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      {authentication &&
                        Farms &&
                        Farms.map((farm: any, index: number) => {
                          let id = myFarmIds.length > 0 ? dynamicFarmId(index + 2) : farmTempId;
                          return (
                            <ListItem key={farm.linkName}>
                              <Avatar
                                alt={userName}
                                src={farm.Avatar}
                                style={{ width: '28px', height: '28px', marginRight: '5px' }}
                              />
                              <ListItemText>
                                <Typography
                                  variant="h6"
                                  onClick={(evt: any) => getLink(farm?.link, evt, id, index)}
                                >
                                  {toPascalCase(farm.linkName)}
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          );
                        })}
                    </List>
                    <List>
                      <ListItem
                        className={`${
                          pathname === '/promote-your-stallion' ? 'disabled-menu' : ''
                        }`}
                      >
                        <ListItemText>
                          <Typography variant="h6" onClick={goToStallionmatch}>
                            For Farms
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <List>
                      <ListItem
                        className={`${pathname === '/stallion-search' ? 'disabled-menu' : ''}`}
                      >
                        <ListItemText>
                          <Typography variant="h6" onClick={goToSearch}>
                            Search
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <List>
                      <ListItem
                        className={`${pathname === '/stallion-directory' ? 'disabled-menu' : ''}`}
                      >
                        <ListItemText>
                          <Typography variant="h6" onClick={goToDirectory}>
                            Directory
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <List>
                      <ListItem
                        className={`${pathname === '/stallion-trends' ? 'disabled-menu' : ''}`}
                      >
                        <ListItemText>
                          <Typography variant="h6" onClick={goToTrends}>
                            Trends
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <List>
                      <ListItem className={`${pathname === '/reports' ? 'disabled-menu' : ''}`}>
                        <ListItemText>
                          <Typography variant="h6" onClick={goToReports}>
                            Reports
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <Divider />
                    <List>
                      <ListItem
                        className={`${pathname === '/dashboard/my-horses' ? 'disabled-menu' : ''}`}
                      >
                        <ListItemText>
                          <Typography variant="h6" onClick={goToMyHorses}>
                            My Horses
                          </Typography>
                        </ListItemText>
                        <ListItemIcon>
                          <i className="icon-Chevron-right" />
                        </ListItemIcon>
                      </ListItem>
                    </List>
                    <List>
                      <ListItem
                        className={`${pathname === '/user/notifications' ? 'disabled-menu' : ''}`}
                      >
                        <ListItemText>
                          <Typography variant="h6" onClick={goToNotifications}>
                            Notifications
                          </Typography>
                        </ListItemText>
                        <ListItemIcon>
                          {NotificationCount?.unreadCount > 0 && (
                            <span className="mobile-badge">{NotificationCount?.unreadCount}</span>
                          )}
                        </ListItemIcon>
                      </ListItem>
                    </List>
                    <List>
                      <ListItem className={`${pathname === '/messages' ? 'disabled-menu' : ''}`}>
                        <ListItemText>
                          <Typography variant="h6" onClick={goToMessages}>
                            Messages
                          </Typography>
                        </ListItemText>
                        <ListItemIcon>
                          {MessageCount?.unreadCount > 0 && (
                            <span className="mobile-badge">{MessageCount?.unreadCount}</span>
                          )}
                        </ListItemIcon>
                      </ListItem>
                    </List>
                    <Divider />
                    <List>
                      <ListItem
                        className={`${pathname === '/my-shortlist' ? 'disabled-menu' : ''}`}
                      >
                        <ListItemText>
                          <Typography
                            variant="h6"
                            onClick={goToShortList}
                            className={
                              pathname?.includes('/my-shortlist')
                                ? 'greyout'
                                : loggedinShortList > 0
                                ? ''
                                : 'greyout'
                            }
                          >
                            Stallion Shortlist{' '}
                            <StarRoundedIcon
                              style={{ color: '#BD9A68', position: 'relative', top: '5px' }}
                            />
                          </Typography>
                        </ListItemText>
                        <ListItemIcon>
                          <i className="icon-Chevron-right" />
                        </ListItemIcon>
                      </ListItem>
                    </List>
                    <Divider />
                    <List>
                      <ListItem className={`${pathname === '/contact-us' ? 'disabled-menu' : ''}`}>
                        <ListItemText>
                          <Typography variant="h6" onClick={goToContactUs}>
                            Contact Us
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <List>
                      <ListItem>
                        <ListItemText>
                          <Typography variant="h6" onClick={logout}>
                            Sign Out
                          </Typography>
                        </ListItemText>
                        <ListItemIcon />
                      </ListItem>
                    </List>
                    <List>
                      <ListItem>
                        <CustomButton
                          disableRipple
                          className="viewButton"
                          sx={{ width: '100%' }}
                          onClick={handleAddFarm}
                        >
                          Add a New Farm <i className="icon-Plus" />
                        </CustomButton>
                      </ListItem>
                    </List>
                    <List>
                      <ListItem>
                        <CustomButton
                          disableRipple
                          className="add-a-stallion"
                          onClick={() => setOpenStallionModal(true)}
                        >
                          Add a Stallion <i className="icon-Plus" />
                        </CustomButton>
                      </ListItem>
                    </List>
                  </Box>
                </Box>
              )}
              {!authentication && (
                <Box sx={{ display: { xs: 'flex', lg: 'none' } }} className="nav-mobile-dropdown">
                  <Box className="nav-mobile-header" sx={{ height: '92px', background: '#1D472E' }}>
                    &nbsp;
                  </Box>
                  <List>
                    <ListItem
                      className={`${
                        pathname && pathname === '/promote-your-stallion' ? 'disabled-menu' : ''
                      }`}
                    >
                      <ListItemText>
                        <Typography variant="h6" onClick={goToStallionmatch}>
                          For Farms
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem
                      className={`${
                        pathname && pathname === '/stallion-search' ? 'disabled-menu' : ''
                      }`}
                    >
                      <ListItemText>
                        <Typography variant="h6" onClick={goToSearch}>
                          Search
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem
                      className={`${
                        pathname && pathname === '/stallion-directory' ? 'disabled-menu' : ''
                      }`}
                    >
                      <ListItemText>
                        <Typography variant="h6" onClick={goToDirectory}>
                          Directory
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem
                      className={`${
                        pathname && pathname === '/stallion-trends' ? 'disabled-menu' : ''
                      }`}
                    >
                      <ListItemText>
                        <Typography variant="h6" onClick={goToTrends}>
                          Trends
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem
                      className={`${pathname && pathname === '/reports' ? 'disabled-menu' : ''}`}
                    >
                      <ListItemText>
                        <Typography variant="h6" onClick={goToReports}>
                          Reports
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      <ListItemText>
                        <Typography
                          variant="h6"
                          onClick={goToShortList}
                          className={
                            localShortList && localShortList?.length > 0
                              ? pathname?.includes('/my-shortlist')
                                ? 'greyout'
                                : ''
                              : 'greyout'
                          }
                        >
                          Stallion Shortlist{' '}
                          <StarRoundedIcon
                            style={{ color: '#BD9A68', position: 'relative', top: '5px' }}
                          />
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem
                      className={`${pathname && pathname === '/contact-us' ? 'disabled-menu' : ''}`}
                    >
                      <ListItemText>
                        <Typography variant="h6" onClick={goToContactUs}>
                          Contact Us
                        </Typography>
                      </ListItemText>
                      <ListItemIcon />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      {!authentication && (
                        <Button
                          fullWidth
                          disableRipple
                          onClick={openLoginPopupMobile}
                          className="homeLogin-mobile"
                        >
                          Login
                        </Button>
                      )}
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      {!authentication && (
                        <Button
                          fullWidth
                          disableRipple
                          onClick={openSignUpPopupMobile}
                          className="homeSignup-mobile"
                        >
                          Sign up
                        </Button>
                      )}
                    </ListItem>
                  </List>
                </Box>
              )}
            </Drawer>
            {/* Add a farm popup modal */}
            <Box>
              <WrapperDialog
                open={openFarmModal}
                title={'Add a Farm'}
                onClose={() => setOpenFarmModal(false)}
                addAFarm={'add a farm'}
                body={AddFarm}
              />
            </Box>
            {/* Add a Stallion popup modal */}
            <Box>
              <WrapperDialog
                open={openStallionModal}
                title={'Add a Stallion'}
                onClose={() => handleCloseStallion()}
                setDialogClassName={setDialogClassName}
                body={AddStallion}
                className={'cookieClass'}
                changeTitleTest={setStallionTitle}
                openOther={handleOpenCreateStallionModal}
                handleSelectedStallions={handleSelectedStallions}
                openPromoteStallion={handleOpenPromoteStallion}
                sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
              />
            </Box>
            {/* Create a Stallion popup modal */}
            <Box>
              <WrapperDialog
                open={openCreateStallionModal}
                title={stallionTitle}
                dialogClassName={dialogClassName}
                onClose={handleCloseCreateStallion}
                createStallion="createStallion"
                isSubmitStallion={true}
                isSubmitMare={false}
                closeAddMare={''}
                body={CreateAStallion}
                className={'cookieClass'}
                sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
              />
            </Box>
            {/* Promote Your Stallion popup modal */}
            <Box>
              <WrapperDialog
                open={openAddStallionPromoteModal}
                title={'Promote Your Stallion'}
                onClose={handleClosePromoteStallion}
                openOther={handleOpenPromoteNew}
                OpenPromote={'OpenPromote'}
                selectedStallionIds={stallionId}
                body={AddStallionPromote}
                className={'cookieClass'}
                sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
              />
            </Box>
            {/* Promote Stallion popup modal */}
            <Box>
              <WrapperDialog
                open={newllyPromoted}
                title={'Promote Stallion'}
                onClose={handleClosePromoteNew}
                promoteStallionType={() => {}}
                selectedStallionIds={''}
                stallionId={stallionId}
                body={PromoteStallion}
              />
            </Box>
            {/* Expired invite popup modal  */}
            <Box>
              <SessionExpired
                open={openSessionExpire}
                title={'Your session has expired'}
                onClose={() => setOpenSessionExpire(false)}
                sessionExpireError={sessionExpireError}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </StyledEngineProvider>
  );
}

export default MainHeader;