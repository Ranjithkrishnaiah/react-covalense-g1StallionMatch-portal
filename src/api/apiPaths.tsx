const BaseAPI = process.env.REACT_APP_HOST_API_KEY;
const BaseAdminAPI = process.env.REACT_APP_HOST_ADMIN_API_KEY;
export const api = {
  baseUrl: BaseAPI + '/v1',
  baseAdminUrl: BaseAdminAPI + '/v1',
  mockBaseUrl: 'http://localhost:9999',

  //Auth URLs
  loginUrl: '/auth/email/login',
  googleLoginUrl: '/auth/google/login',
  breederRegisterationUrl: '/auth/email/register/breeder',
  farmOwnerRegistrationUrl: '/auth/email/register/farm-owner',
  forgotPasswordUrl: '/auth/forgot/password',
  resetPasswordUrl: '/auth/reset/password',
  resendLinkUrl: '/auth/forgot/password/resend-link',
  ValidateLinkStatusUrl: '/auth/forgot/password/validate-link',
  validateInviteUserLinkUrl: '/member-invitations/validate-link',
  acceptFarmInvitation: '/auth/me/accept-farm-invitation',
  VerifyEmailUrl: '/auth/email/confirm',
  inviteFarmUserUrl: '/auth/email/register/farm-member',
  inviteUserUrl: '/member-invitations',
  resendConfirmEmailUrl: '/auth/email/resend-confirm-email',
  checkConfirmEmailUrl: '/auth/me',
  emailExistsUrl:'/auth/is-email-exist',
  authUpdatePasswordUrl: '/auth/me/update-password',
  authStallionMareMatchUrl: '/stallions/auth/sm-search/',
  checkInvitationGetHash: '/auth/me/get-hash',
  acceptInvitationHash: '/auth/me/accept-invitation',
  authRefreshUrl: '/auth/refresh',

  //common APIs
  
  countriesUrl: '/countries',
  stallionMareMatchUrl: '/stallions/sm-search/',
  countriesStateslist: '/countries/with-states',
  statesByCountryIdUrl: '/states/by-country/',
  allStates: '/states',
  coloursUrl: '/colours',
  currenciesUrl: '/currencies',
  currencyRatesUrl: '/currency-rates',
  notificationsUrl: '/notifications',
  messagesUrl: '/message',
  messagesMediaUrl: '/message-media',

  getChannelIdUrl: '/get-channel',
  farmsInFilterUrl: '/farms/farm-names',
  testimonialsUrl: '/testimonials',
  stallionTestimonialsMediaUrl: '/testimonials-media',
  galleryImage: '/gallery-images',
  mediaUrl: '/medias',
  farmMediaUrl: '/media-files',
  farmMediaListUrl: '/media',
  unreadNotificationCountUrl:'/notifications/unread-count',
  unreadMessageCountUrl:'/message/unread-count',
  mediaUploadStatusUrl: '/media/status',
  recentStallionSearchesUrl: '/sm-search/recent',
  //serviceFeeByYear: "/service-fee-by-year/",

  //Order Reports
  addToCartUrl: '/cart',
  addToCartBroodMareSireUrl: '/cart/broodmare-sire', 
  addToCartBroodMareAffinityUrl: '/cart/broodmare-afinity',  
  addToCartMatchProUrl: '/cart/stallion-match-pro',
  addToCartMatchSalesUrl: '/cart/sales-catelogue', 
  addToCartStaliionAffinityUrl: '/cart/stallion-afinity',
  addToCartShortListUrl: '/cart/shortlist-stallion',
  updateEmailUrl: '/auth/me/email',
  maresUrl: '/all-mares',
  stallionsUrl: '/all-stallions',
  damsiresUrl: '/all-damsires',
  favoriteDamsiresUrl: '/favourite-broodmare-sires',
  favoriteFarmsUrl: '/favourite-farms',
  getDiscountUrl:'/promo-codes/',
  getLatestOrderUrl: '/order-transactions/latest-order',
  getAllOrdersUrl: '/order-transactions/new',
  orderInvoicePdf: '/order-transactions/invoice-details',

  //
  selectSale: '/sale/', 
  selectLot: '/sales-lot/by-sales',  


  //Stallion Directory
  stallions: '/stallions',
  stallionDetailsURL: '/stallions',
  YearToStudUrl: '/stallions/year-to-stud',
  searchDamSiresUrl: '/stallions/search-dam-name',
  searchSiresUrl: '/stallions/search-sire-name',
  stallionCurrenciesUrl:'/stallions/price-range',
  minMaxPrice:'/stallions/min-max-price',
  siresByNameUrl: '/stallions/search-sire-name',
  damSiresByNameUrl: '/stallions/search-dam-sire-name',
  grandSiresByNameUrl: '/stallions/search-grand-sire-name',
  stallionPageView: '/stallions/stallion-page-view/',
  stallionPageViewAuth: '/stallions/stallion-page-view-auth/',

  getSelectStallions: '/stallions',
  getProjectReportsData: '/products/report-list',
  getProjectReportsCurrencyInfoData: '/stallions/get-all-currency/by-location',

  // add to cart guest
  guestAddToCartShortListStallionUrl: '/cart/shortlist-stallion/guest',
  guestAddToCartMatchProUrl: '/cart/stallion-match-pro/guest', 
  guestAddToCartBroodMareAffinityUrl: '/cart/broodmare-afinity/guest',
  guestAddToCartMatchSalesUrl: '/cart/sales-catelogue/guest', 
  guestAddToCartStaliionAffinityUrl: '/cart/stallion-afinity/guest',
  addToCartStallionStockSalesUrl: '/cart/stallion-breeding-stock-sale',
  guestAddToCartStallionStockSalesUrl: '/cart/stallion-breeding-stock-sale/guest',
  guestAddToCartBroodMareSireUrl: '/cart/broodmare-sire/guest',

  //Stallion Page
   pedigreeUrl: '/pedigreeTree/',
   raceRecordsUrl: '/race-records',
   stakesProgenyUrl: '/stakes-progeny',

  //Image Upload URLS
  profileImageUpload: '/profile-image',
  memberProfileImageUpload: '/auth/me/profile-image',
  patchProfileImageUpload: '/auth/me/profile-image',

  //Farms
  farmsUrl: '/farms',
  farmDetailsByIdUrl: '/farms',
  farmStallionsUrl: '/farm-stallions',
  authFarmList: '/auth/me/farms',
  searchFarmStallions: '/farms/my-stallions',
  farmStallions: '/farm-stallions',

  //Messages media 
  messagesMedia: '/message-media',
  // Stallion Shortlist
  stallionShortlist: '/stallion-shortlist',
  stallionShortlistIds: '/stallion-shortlist/ids',
  // Guest Stallion Shortlist
  guestStallionShortlist: '/stallion-shortlist/guest',
  // Testimonials
  testimonials: '/home-testimonial',

  // stallionsAdd : "/stallionsadd",
  homepageStats: '/homepagestats',
  emailSubscription: '/register-interest/insights-report',
  getStallionsByCountry: '/horses/male',

  //Cart &&Checkout
  // getCartItemsUrl: '/cart',
  cartItemUrl: '/cart',
  cartCurrencyConversionUrl: '/currency/convert-currency',
  // deleteCartItemUrl: '/cart',
  products: '/products',
  postOrdersUrl: '/order-transactions/checkout',
  createPaymentIntentUrl: '/order-transactions/create-payment-intent',
  createPaypalPaymentIntentUrl: '/order-transactions/paypal/pay',
  paypalSuccessUrl: '/order-transactions/paypal/success',
  paypalCancelUrl: '/order-transactions/paypal/cancel',
  productsDetailsBasedOnLocation: '/get-currency/by-location',

  stallionsCreate: '/stallion-requests',

  // Favourite Stallion
  favouriteStallionsUrl: '/favourite-stallions',

  // Statllion Search pedigree url
  horsePedigreeUrl: '/stallions/',

  //registerinterest
  registerInterest: '/register-interest',
  registerInterestEmailValid: '/register-interest/is-register-intrest-email-valid',
  emailSubscriptionValid: '/register-interest/is-insights-report-email-valid',

  // Mare Search pedigree url
  marePedigreeUrl: '/horses/mare/',

  // Stakes Winners Comparison
  stakesWinnersComparisionUrl: '/stakes-winner-comparison',
  
  //Aptitude Profile 
  aptitudeProfileURL: '/smsearch-profile-details',

  // Favourite Mares
  favouriteMaresUrl: '/favourite-mares',

  //stallion nominations
  stallionNominationUrl: '/stallion-nominations',

  //stallion update service fee
  updateServiceFeeUrl: '/stallions/service-fee-update',

  //farm email subscription
  farmEmailSubscriptionUrl: '/register-interest/farm-subscribe',

  //farm email valid subscription
  farmEmailSubscriptionValidUrl: '/register-interest/is-farm-subscribe-email-valid',

  //stallion analytics
  stallionAnalytics: '/stallions/analytics-statistics',
  stallionKeyAnalytics: '/stallion-report/key-statistics',
  stallionCloseAnalytics: '/stallion-report/close-analytics',
  stallionMatchedActivity: '/stallion-report/stallion-match-activity',
  stallionCloseAnalyticsRoaster: '/stallion-report/stallion-roaster/close-analytics',
  stallionKeyAnalyticsRoaster: '/stallion-report/stallion-roaster/key-statistics',
  stallionDownloadReport: '/stallion-report/downloadPdf',

  //stallion promotion
  stallionPromotion: '/stallion-promotions',

  // Matched Mares
  matchedMares: 'stallion-report/matched-mares',
  progenyTracker: 'stallion-report/progeny-tracker',

  // Stallion Report Progeny Tracker
  progenyTrackerSR: 'progeny-tracker-sr',

  // Stallion Pafe Progeny Tracker
  progenyTrackerSP: 'progeny-tracker-sp',
  stallionRaceRecord: 'stallion-racerecords',
  //stallion reasons
  stallionReasonsUrl: '/stallion-reasons',

  //stallion reason submit:
  stallionReasonsSubmitUrl: '/submit-remove-reason',

  //stop stallion promotion
  stopStallionPromotion: '/stallion-promotions/stop-promotion',
  stopStallionPromotionManually: '/stallion-promotions/stop-promotion-manually',

  //stop stallion nomination
  stopStallionNomination: '/stallion-nominations/stop-nomination',

  // Alternate Mating Suggestions
  alternateMatingSuggestionsUrl: '/stallions/alternate-mating-suggestions',



  //Lists and Breeder-Dashboard
  maresTableUrl: '/member-mares',
  favouriteStallionsTableUrl: '/favourite-stallions/with-race-details',
  broodmareSiresTableUrl: '/favourite-stallions/with-race-details',
  recentSearchesUrl: '/activities/breeder-recent-searches',
  recentSearchesSliderUrl: '/sm-search/recent',
  popularStallionsUrl:'/stallions/popular-stallions',
  compatibleStallionsUrl: '/stallions/compatible-stallions',
  similarStallionsUrl: '/stallions/similar-stallions',
  latestUserMessagesUrl: '/message/member/latest',
  farmsTableUrl: '',
  farmsMediaUrl: '',

  searchStallionNames: '/stallions/search-stallion-names',
  searchMareNames: '/stallions/search-mare-names',
  searchBroodmareSireNamesUrl: '/stallions/search-dam-sire-name',
  searchFarmNamesUrl: '/farms/search-by-name',
  horseCountUrl: '/horses/all-counts',
  getMareListsUrl: '/mares-list',
  postMareListsUrl: '/mares-list',
  getMareListTemplateUrl: '/mares-list/template',
  searchStallionUsers: '/stallions/searched-by-users',
  myDamsiresSearched: '/stallions/my-damsires-searched',

  //add a new mare
  submitANewMare: '/mare-requests',

  //farm access levels
  farmAccessLevels: '/farm-access-levels',
  activities: '/activities',
  maresList: '/mare-lists',

  //User Profile API(s)
  editNameUrl: '/auth/me/fullName',
  editEmailUrl: '/auth/me/email',
  editAddressUrl: '/auth/me/update-address',
  editNotificationSettingsUrl: '/change-notification-settings',
  notificationTypesUrl: '/notification-types',
  notificationPreferencesUrl: '/prefered-notifications',
  signoutFromAllUrl: '/signout-from-all',
  closeAccountUrl: '/auth/close-account',
  getNameUrl: '/name',
  getEmailUrl: '/email',
  getAddressUrl: '/address',
  farmuserList: '/auth/me/farms',
  farmForAdmin: '/to-farm-user',
  messageUnReadCount: '/unread-count',
  //Nomination Availability
  nominationAvailabilityUrl: '/nomination-availability',
  quoteSuggestionUrl: '/quote-suggestion',

  //Contact Us
  interestsUrl: '/contactus/interests',
  sendRequestUrl: '/contactus',

  //Farm Dashboard
  messageNominationCounts: '/message/all-counts/',
  nominationRequestUrl: '/nomination-request',
  latestMessagesUrl: '/message/farm/',
  deleteFarmUserUrl:'/member-invitations',
  resendInvitationUrl: '/member-invitations/resend',
  changeAccessLevelUrl: '/member-invitations/',
  farmPageView:'farm-page-view/',
  farmPageViewAuth:'farm-page-view-auth/',
  
  //Marketing Page
  pageDateUrl: '/page-data',
  getStallionsByCountryAndName: '/horses',
  userFarmMediaUrl: '/farms/media',

  //Trends
  mostPopularStallionUrl: '/stallion-trends/popular-stallion',
  topPerformingStallionUrl: '/stallion-trends/top-performing-stallion',
  mostPopularDamsireUrl: '/stallion-trends/popular-dam-sire',
  mostSearchedStallionsUrl: '/sm-search/most-searched-stallions',
  mostMatchedDamsiresUrl: '/stallion-trends/most-matched-dam-sire',
  topMatchedSiresUrl: '/stallion-trends/top-matched-sires',
  topTenPerfectMatchedSiresUrl: '/stallion-trends/top-perfect-matched-sires',
  topMatchedBroodmareSiresUrl: '/stallion-trends/top-matched-broodmaresires',
  topTenPerfectMatchedBroodmareSiresUrl: '/stallion-trends/top-perfect-matched-broodmaresires',
  farmActivityUrl: '/farms/farm-activity',
  hottestCrossUrl: '/stallion-trends/hottest-cross',
  stallionMatchedActivityTrends: '/stallion-trends/stallion-match-activity',
  stallionMatchedActivityFarms: '/stallion-trends/farm/stallion-match-activity',
  topT_TwentyBroodmareSiresUrl: '',
  topT_TwentySiresUrl:'',

  //Perfect/T20 Match
  perfectMatch: '/stallions/hypo-mating/',
  authPerfectMatch: '/stallions/auth/hypo-mating/',

  //Pedigree Overlap
  pedigreeOverlap: '/stallions/pedigree-overlap/',
  // Stakes Win overlap
  stakeswinOverlap: '/horses/',

  //Breeder Report
  breederAnalytics:'/breeder-analytics',
  breederMatchedMares: 'breeder-report/matched-mares',
  downloadBreederReport: '/breeder-report/downloadPdf',
  breederMatchWorldMap: '/breeder-report/stallion-match-activity',
  breederKeyStatistics: '/breeder-report/key-statistics',
  searchDownload: '/report/stallion-search/',
  pedigreeOverlapDownload: '/report/pedigree-overlap/',
  farmPageAuthView:'farm-page-view-auth/',

  farmsInFilterByLocUrl: '/farms/farm-by-location/',
  mailPreview:'/mail-preview/',
  horseDetail: '/horses',
  unRegisteredHomePageCountPath : '/members/home-page-view',
  registeredHomePageCountPath : '/members/home-page-view-auth',
  unRegisteredReportPageCountPath : '/members/reports-overview-page-view',
  registeredReportPageCountPath : '/members/reports-overview-page-view-auth',
  orderPdfUrl: '/order-transactions/order-reports-link',
  messageAddChannelId: '/add-member-to-channel/',

  footerSearchUrl: '/stallions/footer-search',
  raceHorseUrl: '/race-horse',
  raceHorseDownloadPdfUrl: '/report/race-horse/',
  raceHorseOverlapDownloadPdfUrl: '/report/race-horse-pedigree-overlap/',  

  searchShareAuthUrl: '/sm-search/share-sm-search-result-auth',
  searchShareWithoutAuthUrl: '/sm-search/share-sm-search-result',
};
