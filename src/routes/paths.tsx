// ----------------------------------------------------------------------

function createPath(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOT = '/';

// ----------------------------------------------------------------------

  const LOGIN= 'login';
  const REGISTER= 'register';
  const RESET_PASSWORD = 'reset-password';
  const STALLION_MATCH='promote-your-stallion';
  const STALLION_SEARCH = 'stallion-search';
  const DASHBOARD= 'dashboard';
  const FARMS = 'farm-directory';
  const DIRECTORY = 'stallion-directory';
  const TRENDS= 'stallion-trends';
  const REPORTS= 'reports';
  const CONTACT_US= 'contact-us';
  const PAGE_NOT_FOUND= '404';
  const PRIVACY_POLICY = 'about/privacy-policy';
  const TERMS_AND_CONDITIONS = 'about/terms';
  const COOKIE_POLICY = 'about/cookie-policy';
  const NOTIFICATIONS = "user/notifications";
  const MESSAGES = "messages";
  const USERPROFILE= "user/profile";
  const FARMDASHBOARDPROFILE = "dashboard/";
  const FARMPROFILE = "farm-directory/farm-page";
  const STALLION_COMPARISION = 'stallion-comparision';
  const MYHORSES = 'dashboard/my-horses';
  const SHORTLIST = 'my-shortlist';
  const RACE_HORSE = 'race-horse';
  //const EDITSTALLION = 'stallion-directory/stallion-edit';


  const ForFarms= 'ForFarms';
  const root =  ROOT;
  const login =  createPath(ROOT, LOGIN);
  const register =  createPath(ROOT, REGISTER);
  const resetPassword =  createPath(ROOT, RESET_PASSWORD);

  const dashboard =  createPath(ROOT, DASHBOARD);
  const stallionMatch =  createPath(ROOT, STALLION_MATCH);
  const stallionSearch =  createPath(ROOT, STALLION_SEARCH);
  const farms =  createPath(ROOT, FARMS);
  const directory =  createPath(ROOT, DIRECTORY);
  const trends =  createPath(ROOT,TRENDS);
  const reports =  createPath(ROOT, REPORTS);
  const pageNotFound =  createPath(ROOT, PAGE_NOT_FOUND);
  const privacyPolicy = createPath(ROOT, PRIVACY_POLICY);
  const termsAndConditions = createPath(ROOT, TERMS_AND_CONDITIONS);
  const cookiePolicy = createPath(ROOT, COOKIE_POLICY);
  const contactUs = createPath(ROOT, CONTACT_US);
  // const stallionPage = createPath(directory)
  const notifications = createPath(ROOT,NOTIFICATIONS);
  const messages = createPath(ROOT,MESSAGES);
  const userProfile= createPath(ROOT,USERPROFILE);
  const farmDashboardProfile = createPath(ROOT, FARMDASHBOARDPROFILE)
  const farmProfile= createPath(ROOT,FARMPROFILE);
  const stallionComparision =  createPath(ROOT, STALLION_COMPARISION);
  const myhorses = createPath(ROOT, MYHORSES);
  const shortList = createPath(ROOT,SHORTLIST);
  const raceHorse =  createPath(ROOT, RACE_HORSE);
  //const editStallion = createPath(ROOT,EDITSTALLION);

export const ROUTES = {
  ROOT: root,
  LOGIN: login,
  REGISTER: register,
  RESET_PASSWORD: resetPassword,

  //Header Routes
  DASHBOARD: dashboard,
  FORFARMS: ForFarms,
  STALLION_MATCH: stallionMatch,
  STALLION_SEARCH: stallionSearch,
  FARMS: farms,
  DIRECTORY: directory,
  TRENDS: trends,
  REPORTS: reports,

  //Hamburger Menu Routes
  NOTIFICATIONS: notifications, 
  MESSAGES: messages,
  USERPROFILE: userProfile,
  FARMDASHBOARDPROFILE: farmDashboardProfile,
  FARMPROFILE: farmProfile,
  MYHORSES: myhorses,
  SHORTLIST: shortList,

  //Footer Routes
  PRIVACY_POLICY: privacyPolicy,
  TERMS_AND_CONDITIONS: termsAndConditions,
  COOKIE_POLICY: cookiePolicy,
  CONTACT_US: contactUs,

  //ERROR Routes
  PAGE_NOT_FOUND: pageNotFound,

  RACE_HORSE: raceHorse,
};
