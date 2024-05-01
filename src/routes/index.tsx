import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// guards
// import useAuth from '../hooks/useAuth';
// layouts
import MainLayout from '../layouts/main';
// import AdminLayout from '../layouts/admin';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
// import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import { ROUTES } from './paths';
import HomePageController from '../pages/homePage/HomePageController';
import MailPreview from 'src/components/MailPreview';
import Careers from 'src/pages/Careers';
import AboutPage from 'src/pages/AboutPage';

//import StallionEdit from 'src/pages/stallionDirectory/StallionEdit';


// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
// eslint-disable-next-line react-hooks/rules-of-hooks
// const { pathname } = useLocation();

// eslint-disable-next-line react-hooks/rules-of-hooks
// const { isAuthenticated } = useAuth();

//   const isDashboard = pathname.includes('/dashboard') && isAuthenticated;
(
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
)
  ;

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              {/* <Login /> */}
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              {/* <Register /> */}
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: 'temp-login',
      element: <TempLogin />
    },

    // Main Routes
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <GuestGuard><HomePage /></GuestGuard>, index: true },
        { path: 'contact-us', element: <GuestGuard><ContactUs /></GuestGuard> },
        { path: 'contact-us?type=other', element: <GuestGuard><ContactUs /></GuestGuard> },
        { path: 'careers', element: <Careers />},
        { path: 'about', element: <AboutPage />},
        { path: 'about/cookie-policy', element: <GuestGuard><Help /></GuestGuard> },
        { path: 'about/terms', element: <GuestGuard><TermsAndConditions /></GuestGuard> },
        { path: 'about/privacy-policy', element: <GuestGuard><PrivacyPolicy /></GuestGuard> },
        { path: 'ForFarms', element: <GuestGuard><StallionMatch/></GuestGuard> },
        { path: 'promote-your-stallion', element: <GuestGuard><StallionMatch /></GuestGuard> },
        { path: 'stallion-search', element: <GuestGuard><StallionSearch /></GuestGuard> },
        // { path: 'stallion-report/:horseId', element:<GuestGuard><StallionReport/></GuestGuard> },
        { path: 'report/stallion/:horseId/:farmName/:farmId', element: <GuestGuard><StallionReport /></GuestGuard> },
        { path: 'stallion-directory', element: <GuestGuard><StallionDirectory /></GuestGuard> },
        { path: 'stallion-directory?location=', element: <GuestGuard><StallionDirectory /></GuestGuard> },

        { path: 'farm-directory', element: <GuestGuard><FarmDirectory /></GuestGuard> },
        { path: 'farm-directory?location=', element: <GuestGuard><FarmDirectory /></GuestGuard> },
        { path: 'farm-directory',
        children: [
          { path: 'farm-page/:farmId', element: <GuestGuard><FarmPage/></GuestGuard> }
          ] 
        },
        {
          path: 'stud-farm',
          children: [
            { path: ':farmName/:farmId', element: <GuestGuard><FarmPage /></GuestGuard> }
          ]
        },
        { path: 'stallion-trends', element: <GuestGuard><Trends /></GuestGuard> },
        { path: 'reports', element: <GuestGuard><Reports /></GuestGuard> },
        { path: 'reports?reportId=', element: <GuestGuard><Reports /></GuestGuard> },
        { path: 'checkout', element: <GuestGuard><Checkout /></GuestGuard> },
        { path: 'dashboard', element: <AuthGuard><GuestGuard><Dashboard /></GuestGuard></AuthGuard> },
        // { path: 'dashboard/:userId', element: <GuestGuard><Dashboard /></GuestGuard> },
        {
          path: 'dashboard',
          children: [
            { path: ':farmName/:farmId', element: <AuthGuard><GuestGuard><FarmDashboard /></GuestGuard></AuthGuard> },
            { path: ':farmName/:farmId/addStallion', element: <AuthGuard><GuestGuard><FarmDashboard /></GuestGuard></AuthGuard> },
            { path: ':farmName/:farmId/inviteUser', element: <AuthGuard><GuestGuard><FarmDashboard /></GuestGuard></AuthGuard> },
            { path: 'mares-list', element: <AuthGuard><GuestGuard><Lists /></GuestGuard> </AuthGuard>},
            { path: 'favourite-stallions-list', element: <AuthGuard><GuestGuard><Lists /></GuestGuard></AuthGuard> },
            { path: 'favourite-damsires-list', element: <AuthGuard><GuestGuard><Lists /></GuestGuard></AuthGuard> },
            { path: 'favourite-farms-list', element: <AuthGuard><GuestGuard><Lists /></GuestGuard></AuthGuard> },
            { path: 'my-horses', element: <AuthGuard><GuestGuard><MyHorses /></GuestGuard></AuthGuard> },
            { path: 'stallion-roster/:farmId', element: <AuthGuard><GuestGuard><Roaster /></GuestGuard></AuthGuard> },
            // { path: 'stallion-directory/stallion-edit', element:<GuestGuard><StallionEdit/></GuestGuard> },

          ]
        },
        { path: 'report/breeder/:farmName/:farmId', element: <AuthGuard><GuestGuard><BreederReport /></GuestGuard></AuthGuard> },
        { path: 'stallion-roster/:farmName/:farmId', element: <AuthGuard><GuestGuard><Roaster /></GuestGuard></AuthGuard> },
        { path: 'mares-list/:farmName/:farmId', element: <AuthGuard><GuestGuard><MareLists /></GuestGuard></AuthGuard> },
        { path: 'stallions/:farmName/:farmId', element: <AuthGuard><GuestGuard><MyFarmStallions /></GuestGuard></AuthGuard> },
        { path: 'users/:farmName/:farmId', element: <AuthGuard><GuestGuard><FarmUsersList /></GuestGuard></AuthGuard> },
        {
          path: 'user',
          children: [
            { path: 'profile', element: <AuthGuard><GuestGuard><Profile /></GuestGuard></AuthGuard> },
            { path: 'notifications', element: <AuthGuard><GuestGuard><Notifications /></GuestGuard></AuthGuard> },
          ]
        },
        { path: 'messages', element: <AuthGuard><GuestGuard><Messages /></GuestGuard></AuthGuard> },

        {
          path: 'messages/:param',
          children: [
            { path: '', element: <AuthGuard><GuestGuard><Messages /></GuestGuard></AuthGuard> },
            { path: ':channelId', element: <AuthGuard><GuestGuard><Messages /></GuestGuard></AuthGuard> },
            { path: ':channelId/anonymousUser', element: <AuthGuard><GuestGuard><Messages /></GuestGuard></AuthGuard> },
          ]
        },
        
        {
          path: "breeder-email/:userId", element: <GuestGuard><BreederEmail /></GuestGuard>
        }, {
          path: "report-email/:userId", element: <GuestGuard><ReportEmail /></GuestGuard>
        },
        {
          path: "unsubscribe/:userId", element: <GuestGuard><UnsubscribeEmail /></GuestGuard>
        },
        //   { path: 'stallion-directory',
        //     children: [
        //       { path: 'stallion-page/:id/:action', element: <GuestGuard><StallionPage/></GuestGuard> },
        //     ]
        // }
        {
          path: 'stallions',
          children: [
            { path: ':horseName/:id/:action', element: <GuestGuard><StallionPage /></GuestGuard> },
          ]
        },
        { path: 'my-shortlist', element: <GuestGuard><StallionDirectory /></GuestGuard> },
        {
          path: 'stallion-search',
          children: [
            { path: 'stallion-search/:mareId&:stallionId', element: <GuestGuard><StallionSearch /></GuestGuard> },
            { path: 'stallion-search/:mareId', element: <GuestGuard><StallionSearch /></GuestGuard> },
            { path: 'stallion-search/:stallionId', element: <GuestGuard><StallionSearch /></GuestGuard> },
            { path: 'stallion-comparision', element: <GuestGuard><StallionComparision /></GuestGuard> },
          ]
        },
        { path: 'race-horse/:horseName/:horseId', element: <GuestGuard><RaceHorse /></GuestGuard> },
        { path: 'race-horse/pedigree-overlap/:horseId/:swId/:generation', element: <GuestGuard><RaceHorseComparision /></GuestGuard> },
        { path: "reset-password/:hash", element: <ResetPassword /> },
        { path: "invite-user/:hash", element: <HomePageController /> },
        { path: "payment", element: <Payment /> },
        { path: 'thankyou', element: <Thankyou /> },
        //Email Routes
        { path: 'confirm-order', element: <ConfirmOrder /> },
        { path: 'confirm-email/:hash', element: <VerifyEmail /> },
        { path: 'mail-preview/:dirIdentity/:fileIdentity', element: <MailPreview /> },

        { path: '*', element: <GuestGuard><PageNotFound /></GuestGuard> },

      ],
    },

  ]);
}


// MAIN
const HomePage = Loadable(lazy(() => import('../pages/homePage/HomePageController')));


//HEADER TABS

//DASHBOARD
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/breederDashboard/BreederDashboardController')));
//DASHBOARD-CHILDREN
const FarmDashboard = Loadable(lazy(() => import('../pages/dashboard/farmDashboard/FarmDashboardController')));
//FARM-DASHBOARD-CHILDREN
const Lists = Loadable(lazy(() => import('../pages/lists/Lists')));
const MareLists = Loadable(lazy(() => import('../pages/lists/MareLists')));
const FarmUsersList = Loadable(lazy(() => import('../pages/lists/FarmUsersList')));
const MyFarmStallions = Loadable(lazy(() => import('../pages/lists/MyFarmStallions')));
const BreederReport = Loadable(lazy(() => import('../pages/breederReport/BreederReportController')));

const Messages = Loadable(lazy(() => import('../pages/messages/MessagesController')));
const Notifications = Loadable(lazy(() => import('../pages/notifications/NotificationsController')));

const Roaster = Loadable(lazy(() => import('../pages/stallionRoaster/RoasterController')));
const MyHorses = Loadable(lazy(() => import('../pages/MyHorses')));
const Profile = Loadable(lazy(() => import('../pages/profile/ProfileController')))
const StallionReport = Loadable(lazy(() => import('../pages/stallionReport/StallionReportController')))

//STALLION MATCH
const StallionMatch = Loadable(lazy(() => import('../pages/stallionMatch/StallionMatchController')));

//TRENDS
const Trends = Loadable(lazy(() => import('../pages/trends/TrendsController')));

//DIRECTORY
const StallionDirectory = Loadable(lazy(() => import('../pages/stallionDirectory/StallionDirectoryController')));
//DIRECTORY-CHILDREN
const StallionPage = Loadable(lazy(() => import('../pages/stallionPage/StallionPageController')));

//FARMS
const FarmDirectory = Loadable(lazy(() => import('../pages/farmDirectory/FarmDirectoryController')));
//FARMS-CHILDREN
const FarmPage = Loadable(lazy(() => import('../pages/farmPage/FarmPageController')));

//REPORTS
const Reports = Loadable(lazy(() => import('../pages/reports/ReportsController')));

//STALLION SEARCH
const StallionSearch = Loadable(lazy(() => import('../pages/stallionSearch/StallionSearchController')))

//CHECKOUT PAGE
const Checkout = Loadable(lazy(() => import('../pages/checkout/CheckoutController')))

//FOOTER TABS
const ContactUs = Loadable(lazy(() => import('../pages/ContactUs')));
const PrivacyPolicy = Loadable(lazy(() => import('../pages/PrivacyPolicy')));
const Help = Loadable(lazy(() => import('../pages/Help')));
const TermsAndConditions = Loadable(lazy(() => import('../pages/TermsAndConditions')));

//OTHERS
const PageNotFound = Loadable(lazy(() => import('../pages/PageNotFound')));
const ResetPassword = Loadable(lazy(() => import('../pages/ResetPassword')));
const VerifyEmail = Loadable(lazy(() => import('../pages/VerifyEmail')));
//Temp Login

const TempLogin = Loadable(lazy(() => import('../pages/TempLogin')));

//STALLION COMPARISION
const StallionComparision = Loadable(lazy(() => import('../pages/stallionSearch/StallionComparisionController')));

//Email Templates
const ConfirmOrder = Loadable(lazy(() => import('../pages/emailTemplates/ConfirmOrder')))

//Breeder Email Templates
const BreederEmail = Loadable(lazy(() => import('../components/Templates/BreederEmail')))

//Report Email Templates
const ReportEmail = Loadable(lazy(() => import('../components/Templates/ReportEmail')))

//Unsubscribe Email Templates
const UnsubscribeEmail = Loadable(lazy(() => import('../components/Templates/UnsubscribeEmail')))

//Payment
const Payment = Loadable(lazy(() => import('../pages/checkout/CheckoutController')))

//Thankyou
const Thankyou = Loadable(lazy(() => import('../pages/checkout/Thankyou')))

//RACE HORSE
const RaceHorse = Loadable(lazy(() => import('../pages/raceHorse/RaceHorseController')))

//STALLION COMPARISION
const RaceHorseComparision = Loadable(lazy(() => import('../pages/raceHorse/RaceHorseComparisionController')));