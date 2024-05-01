import { useEffect, useState } from 'react';
import './home.css';
import { useCookies } from 'react-cookie';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import Testimonials from './Testimonials';
import FingerTips from './FingerTips';
import ValuedAsset from './ValuedAsset';
import PerfectMatch from './PerfectMatch';
import StallionSignup from './StallionSignup';
import HomeSubscribe from './HomeSubscribe';
import CountryCookieModal from 'src/components/CountryCookieModal';
import { scrollToTop } from '../../utils/customFunctions';
import Page from 'src/components/Page';
import useAuth from '../../hooks/useAuth';
// MetaTags
import useMetaTags from 'react-metatags-hook';
import { usePageDataSplitQuery } from 'src/redux/splitEndpoints/pageDataSplit';
import { useAcceptFarmInvitationMutation, useVerifyUserInviteMutation } from 'src/redux/splitEndpoints/VerifyUserInviteSplit';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import InviteExpireLink from 'src/forms/InviteExpireLink';
import useCounter from 'src/hooks/useCounter';
import Registration from 'src/forms/Registration';
import ForgotPassword from 'src/forms/ForgotPassword';
import Login from 'src/forms/Login';
import { usePostUnRegisteredCountMutation, usePostRegisteredCountMutation } from 'src/redux/splitEndpoints/postHomePageCount';
// import { createBrowserHistory, parsePath } from 'history';


function HomePageController() {
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const homePageUrl = `${BaseAPI}`;
  const homePageImage = process.env.REACT_APP_HOME_DEFAULT_IMAGE;
  const homePageId = process.env.REACT_APP_STALLION_HOME_PAGE_ID;

  const { pathname } = useLocation();
  const { hash } = useParams();
  const navigate = useNavigate();
  const { setLogout,authentication } = useAuth();
  const isInviteUser = pathname.includes('/invite-user') && !!hash;
  const isBreederReport = pathname.includes('/report/breeder');
  const isStallionReport =  pathname.includes('/report/stallion');
  const [cookies, setCookie, removeCookie] = useCookies(['country', 'expired_login']);
  const [testimonialList, setTestimonialList] = useState<any>([]);
  const [openInviteExpireLink, setOpenInviteExpireLink] = useState(false);
  const [inviteExpireLinkError, setInviteExpireLinkError] = useState<any>(null);
  const [inviteExpireLinkErrorCounter, setInviteExpireLinkErrorCounter] = useState<any>(0);
  const [verifyUserInvite, verifyUserInviteResponse] = useVerifyUserInviteMutation();
  const [acceptFarmInvitation, acceptFarmInvitationResponse] = useAcceptFarmInvitationMutation();

  const geoCountry = localStorage.getItem('geoCountryName');
  // Not logged Home Page API call
  const [unRegisteredHomePageCount] = usePostUnRegisteredCountMutation();

  // Logged in Home Page API call
  const [registeredHomePageCount] = usePostRegisteredCountMutation();

  // Check if location based country is available or not then call api
  useEffect(() => {
    if (geoCountry !== "") {
      handlePostHomePageCount();
    }
  }, [geoCountry]);

  const handlePostHomePageCount = async () => { 
    if(authentication) {
      await registeredHomePageCount({countryName: geoCountry});
    } else {
      await unRegisteredHomePageCount({countryName: geoCountry});
    }
  }

  // Marketing Home page API call
  const { data: pageData, isFetching: pageDateIsFetching, isSuccess } = usePageDataSplitQuery(homePageId);

  const filterCounterhook = useCounter(0);
  const isNewMember: boolean = pathname.includes('/invite-user') && !!hash && !!verifyUserInviteResponse.data?.isMember === true;
  const [openRegisteration, setOpenRegistration] = useState(false);
  const [registrationTitle, setRegistrationTitle] =
    useState(pathname.includes('/invite-user') && !isNewMember ? 'Invitation Accepted' : 'Create Account');
  const [openLogin, setOpenLogin] = useState(false);
  const [invitedUserEmail, setInvitedUserEmail] = useState('');
  const [invitedUserName, setInvitedUserName] = useState('');
  const [invitedFarmName, setInvitedFarmName] = useState<any>({ url: '', type: '' });
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  // Scroll to top while page is loading
  useEffect(() => {
    scrollToTop();
  }, []);

  if (
    hash &&
    !verifyUserInviteResponse.data &&
    !verifyUserInviteResponse.isLoading &&
    !verifyUserInviteResponse.isError &&
    isInviteUser
  ) {
    verifyUserInvite({ hash });
  }

  // Genarate the testimonial data from marketing home page API call
  useEffect(() => {
    // scrollToTop();
    if (isSuccess) {
      let filteredArr: any = [];
      filteredArr = pageData?.testimonials?.list?.filter((v: any) => v?.isActive);
      setTestimonialList(filteredArr);
    }
  }, [pageDateIsFetching]);

  // Generate meta information
  useMetaTags({
    title: `Breed Your Next Winner | Stallion Match`,
    description: `We are your best asset for breeding thoroughbred horses. We connect breeders and stallion farms for the perfect data backed stallion match for the best pedigree. `,
    openGraph: {
      title: 'Breed Your Next Winner | Stallion Match',
      description: 'We are your best asset for breeding thoroughbred horses. We connect breeders and stallion farms for the perfect data backed stallion match for the best pedigree.',
      site_name: 'Stallion Match',
      url: homePageUrl,
      type: 'business.business',
      image: homePageImage,
    },
  }, [])

  // Check the url for invite user, if link expired, open expired invite modal
  useEffect(() => {
    if (filterCounterhook.value === 0 && verifyUserInviteResponse.isLoading === false && verifyUserInviteResponse.isError) {
      let response: any = verifyUserInviteResponse;
      filterCounterhook.increment();
      setOpenInviteExpireLink(true);
      setInviteExpireLinkError(`${Object.values(response?.error?.data?.errors)}`);
    }
  }, [verifyUserInviteResponse.isError])

  // Check the login expired, if expired, open login modal
  useEffect(() => {
    if (cookies.expired_login === "1") {
      setOpenLogin(true);
    }
  }, [cookies.hasOwnProperty('expired_login')])

  // Check the breeder report or stallion report url is clicked, open login modal
  useEffect(() => {
    if (isBreederReport) {
      setOpenLogin(true);
      setInvitedFarmName(
        {
          url: pathname,
          type: 'breeder_report'
        }
      );
    }
  }, [isBreederReport])

  useEffect(() => {
    if (isStallionReport) {
      setOpenLogin(true);
      setInvitedFarmName(
        {
          url: pathname,
          type: 'stallion_report'
        }
      );
    }
  }, [isStallionReport])

  // Check the url for invite user, if link not expired, open user invite modal with pre poulate name and email filled up
  useEffect(() => {
    if (verifyUserInviteResponse.isSuccess) {
      setOpenRegistration(!isNewMember && pathname.includes('/invite-user'));
      setOpenLogin(isNewMember && pathname.includes('/invite-user'));
      setInvitedUserName(verifyUserInviteResponse.data?.fullName);
      setInvitedUserEmail(verifyUserInviteResponse.data?.email);
      let obj = {
        url:`/dashboard/${verifyUserInviteResponse.data?.farmName}/${verifyUserInviteResponse.data?.farmUuid}`,
        type: 'invite_user'
      }
      setInvitedFarmName(obj);
      if (pathname.includes('/invite-user')) {
        if (farmUser?.email !== verifyUserInviteResponse.data?.email) {
          setLogout(true);
          sessionStorage.clear();
          window.localStorage.clear();
        } else {
          setOpenRegistration(false);
          setOpenLogin(false);
          acceptFarmInvitation({ invitationKey: hash });
        }
      }
    }else {
      if(!authentication) {
        if(window.location.pathname !== '/') {
          setOpenLogin(true);
        }
      }
    }
  }, [verifyUserInviteResponse.isSuccess])

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Page title={'Stallion Match Portal'} meta={'baal'}>
          <PerfectMatch mainHeader={pageData?.mainHeading}/>
          <ValuedAsset heroImage={pageData?.heroImage} carasouls={pageData?.carasouls}/>
          <FingerTips banner1={pageData?.banner1}/>
          {testimonialList.length && <Testimonials testimonialList={testimonialList} />}
          <StallionSignup banner2={pageData?.banner2}/>
          <HomeSubscribe />
          {!cookies.hasOwnProperty('country') && (!isInviteUser || !isBreederReport || isStallionReport) && <CountryCookieModal />}
        </Page>
        {/* Expired invite popup modal  */}
        <InviteExpireLink
          open={openInviteExpireLink}
          title={'Invite User'}
          onClose={() => setOpenInviteExpireLink(false)}
          inviteExpireLinkError={inviteExpireLinkError}
        />
        {/* Register popup modal  */}
        <WrapperDialog
          open={openRegisteration}
          title={registrationTitle}
          onClose={() => setOpenRegistration(false)}
          openOther={() => setOpenLogin(true)}
          changeTitleTo={setRegistrationTitle}
          body={Registration}
          setIsFirstLogin={setIsFirstLogin}
          setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
          hash={hash}
          fullName={verifyUserInviteResponse.data?.fullName}
          InvitedEmail={verifyUserInviteResponse.data?.email}
          isLoginOpen={openLogin}
          closeLogin={() => setOpenLogin(false)}
        />
        {/* Forgot password popup modal  */}
        <WrapperDialog
          open={forgotPassword}
          title="Forgot Password"
          onClose={() => setForgotPassword(false)}
          body={ForgotPassword}
        />
        {/* Login popup modal  */}
        <WrapperDialog
          open={openLogin}
          dialogClassName='dialogPopup createAccountPopup'
          title={isFirstLogin ? "Welcome to Stallion Match" : 'Log in'}
          onClose={() => { setOpenLogin(false); removeCookie('expired_login') }}
          openOther={() => setOpenRegistration(true)}
          OFP={() => setForgotPassword(true)}
          firstLogin={isFirstLogin}
          body={Login}
          farmAdminFirstLogin={isFarmAdminFirstLogin}
          setRegistrationTitle={() => setRegistrationTitle('Create Account')}
          forwardLinkObj={invitedFarmName}
        />
      </StyledEngineProvider>
    </>
  );
}

export default HomePageController;