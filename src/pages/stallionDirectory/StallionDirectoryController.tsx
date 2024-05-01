import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

import StallionFilter from './StallionFilter';
import StallionList from './StallionList';
import Header from './Header';
import { StyledEngineProvider } from '@mui/material/styles';
import { Box, Container, Grid } from '@mui/material';
import { initialState } from './SDInitialState';
import { useLocation, useParams } from 'react-router-dom';
import StallionShortlist from './StallionShortlist';
import NoDataComponent from 'src/components/NoDataComponent/NoDataComponent';
import { scrollToTop } from '../../utils/customFunctions';
import ShortlistFilter from './ShortlistFilter';
import { useGuestStallionShortlistsQuery } from 'src/redux/splitEndpoints/guestStallionShortListSplit';
import {
  useStallionShortlistsIdsQuery,
  useStallionShortlistsQuery,
} from 'src/redux/splitEndpoints/stallionShortListSplit';
import { useStallionsQuery } from 'src/redux/splitEndpoints/stallionSplit';
import { useGetCurrenciesMinMaxvalueQuery, useGetMinMaxPricingSlidervalueQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import SkeletonCard from 'src/components/skeletonCard/skeletonCard';

import useMetaTags from 'react-metatags-hook';
import useCounter from 'src/hooks/useCounter';

function StallionDirectoryController() {
  const metaTitles = () => {
    const pageUrl = window.location.pathname;

    switch (pageUrl) {
      case '/stallion-directory':
        return 'Thoroughbred Stallion Directory | Stallion Match';
      case '/my-shortlist':
        return 'Stallion Shortlist Search Results | Stallion Match';
      default:
        return '';
    }
  };

  const metaDescriptions = () => {
    const pageUrl = window.location.pathname;

    switch (pageUrl) {
      case '/stallion-directory':
        return 'Browse our directory for stallions at stud from the worlds top thoroughbred horse farms. Select from race horse pedigrees using detailed information and data.';
      case '/my-shortlist':
        return 'Stallion Match Stallion Shortlist. Discover the perfect breeding match - refine your Search results.';
      default:
        return '';
    }
  };

  useMetaTags(
    {
      title: metaTitles(),
      description: metaDescriptions(),
      openGraph: {
        title: metaTitles(),
        description: metaDescriptions(),
        site_name: 'Stallion Match',
        url: process.env.REACT_APP_STALLION_DIRECTORY_URL+window.location.pathname,
        type: 'business.business',
        image:process.env.REACT_APP_STALLION_DIRECTORY_IMG
      },
    },
    []
  );

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [price, setPrice] = useState([]);
  const [feeRange, setFeeRange] = useState({});
  const [page, setPage] = useState(1);
  const [stallionName, setSearchKey] = useState<any>();
  const [isStallionNameExactSearch, setIsStallionNameExactSearch] = useState<any>(false);
  const [searchFarmKey, setFarmKey] = useState<any>([]);
  const [searchYearOfStudKey, setYearOfStudKey] = useState<any>([]);
  const [searchColour, setColour] = useState<any>([]);
  const [searchCurrency, setCurrency] = useState<any>(1);
  const [location, setLocation] = useState<any>('');
  const [sortBy, setSortBy] = useState<any>();
  const [emptyStallionList, setEmptyStallionList] = useState(true);
  const [isPrivateFee, setPrivateFee] = useState(initialState.isPrivateFee);
  const [isExcludeKeyAncestor, setIsExcludeKeyAncestor] = useState(
    initialState.isExcludeKeyAncestor
  );
  const [isColoursSelected, setIsColoursSelected] = useState<any>(0);
  const [isYearToStudsSelected, setIsYearToStudsSelected] = useState<any>(0);
  const [isFarmsSelected, setIsFarmsSelected] = useState<any>(0);
  const [isSortBySelected, setIsSortBySelected] = useState<any>(0);
  const [isCountrySelected, setIsCountrySelected] = useState<any>(0);
  const [isPrivateFeeSelected, setIsPrivateFeeSelected] = useState<any>(0);
  const [isExcludeKeyAncestorSelected, setIsExcludeKeyAncestorSelected] = useState<any>(0);
  const [sire, setSire] = useState<any>([]);
  const [damSire, setdamSire] = useState<any>([]);
  const [keyAncestor, setKeyAncestor] = useState<any>([]);
  const filterCounterhook = useCounter(0);
  const isShortlist = pathname.match('shortlist');
  const headerRef = useRef<any>(null);
  const [currencySlider, setCurrencySlider] = useState<any>({});
  const [isCurrencyChanged, setIsCurrencyChanged] = useState<boolean>(false);
  const { data: CurrenciesMinMaxvalue, isSuccess: isCurrenciesMinMaxvalueSuccess } =
    useGetMinMaxPricingSlidervalueQuery(currencySlider, { skip: (!isCurrencyChanged) });
  const [clear, setClear] = useState<any>(false);
  const [isSearchedClicked, setIsSearchedClicked] = useState<any>(false);
  useEffect(() => {
    if (emptyStallionList || page) scrollToTop();
  }, [emptyStallionList, page]);
  useEffect(() => {
    // @ts-ignore
    if (CurrenciesMinMaxvalue) {
      setFeeRange({ minPrice: CurrenciesMinMaxvalue?.priceRange?.min ? CurrenciesMinMaxvalue?.priceRange?.min : 0, maxPrice: CurrenciesMinMaxvalue?.priceRange?.max ? CurrenciesMinMaxvalue?.priceRange?.max : 1000000 });
    }
  }, [CurrenciesMinMaxvalue]);
  
  useEffect(() => {
    if ('myStallionShortListPage' in localStorage) {
      setPage(1);
      localStorage.removeItem('myStallionShortListPage');
    }
  });

  // Browser back functionality
  const isStallionDirectoryPage = localStorage.getItem('comeFromDirectory');
  // if(localStorage.getItem('isStallionDirectoryPage') === null || isStallionDirectoryPage === 'No' || isStallionDirectoryPage === 'Yes') {
  //   localStorage.setItem('isStallionDirectoryPage', 'No');
  // }
  
  // when ever location, searchCurrency,searchFarmKey,isPrivateFee are updated isCurrencyChange and CurrencySlider values updated
  useEffect(() => {
    setIsCurrencyChanged(true);
    setCurrencySlider(
      {
        location: location,
        farms: searchFarmKey,
        stallionName,
        ...(isStallionNameExactSearch === true && { isStallionNameExactSearch: isStallionNameExactSearch }),
        yearToStud: searchYearOfStudKey,
        colour: searchColour,
        currency: searchCurrency,
        isPrivateFee: isPrivateFee,
        isExcludeKeyAncestor: isExcludeKeyAncestor,
        ...(sire !== '' && { sireId: sire }),
        ...(damSire !== '' && { damSireId: damSire }),
        ...(keyAncestor !== '' && { keyAncestorId: keyAncestor }),
      }
    )
    //Store the filter info into local storage
    // if(localStorage.getItem('isStallionDirectoryPage') === null || isStallionDirectoryPage === 'No' || isStallionDirectoryPage === 'Yes') {
      
      // localStorage.setItem('myStallionDirectoryFilter', JSON.stringify(
      // {
      //   sortBy: sortBy,
      //   location: location,
      //   farms: searchFarmKey,
      //   yearToStud: searchYearOfStudKey,
      //   colour: searchColour,
      //   currency: searchCurrency,
      //   priceRange: price[1]===0 ? '0-10000000':price.join('-') ,
      //   isPrivateFee: isPrivateFee,
      //   isExcludeKeyAncestor: isExcludeKeyAncestor,
      //   sire: sire,
      //   damSire: damSire,
      //   keyAncestor: keyAncestor,
      //   page: page,
      //   limit: 12,
      // }
      // ));      
    // }    
  }, [location, searchCurrency,searchFarmKey, searchColour, isPrivateFee, isExcludeKeyAncestor, sire, damSire, keyAncestor, stallionName, searchYearOfStudKey]);
  let newState = {
    ...initialState,
    page: page,
    priceRange: (price[1]=== 0 || price[1]=== undefined) ? '0-10000000':price.join('-') ,
    stallionName,
    ...(isStallionNameExactSearch === true && { isStallionNameExactSearch: isStallionNameExactSearch }),
    sortBy: sortBy,
    farms: searchFarmKey,
    yearToStud: searchYearOfStudKey,
    colour: searchColour,
    currency: searchCurrency,
    location: location,
    isPrivateFee: isPrivateFee,
    isExcludeKeyAncestor: isExcludeKeyAncestor,
    ...(sire !== '' && { sireId: sire }),
    ...(damSire !== '' && { damSireId: damSire }),
    ...(keyAncestor !== '' && { keyAncestorId: keyAncestor }),
  };
  // console.log(price,'pricePPP')
  useEffect(() => {
    window.onbeforeunload = function () {
      window.localStorage.setItem('storedFiltered', '');
      window.localStorage.setItem('comeFromDirectory', 'false');
      window.localStorage.setItem('storedFilteredSire', '');
      window.localStorage.setItem('storedFilteredDamSire', '');
      window.localStorage.setItem('storedFilteredKeyAncestor', '');
      window.localStorage.setItem('storedFilteredGrandSire', '');

      return null;
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const [localStoargeFilter, setLocalStoargeFilter] = useState({})
  useEffect(() => {
    if (filterCounterhook.value) {
      window.localStorage.setItem('storedFiltered', JSON.stringify(newState))
    }
  }, [newState])

  const clearAll = () => {
    // @ts-ignore
    setPrice([price[0], price[1]]);
    setSortBy(initialState.sortBy);
    setColour(initialState.colour);
    setYearOfStudKey(initialState.yearToStud);
    setFarmKey(initialState.farms);
    setCurrency(initialState.currency);
    setSearchKey(initialState.stallionName);
    setIsStallionNameExactSearch(false);
    setLocation(initialState.location);
    setPrivateFee(true);
    setIsExcludeKeyAncestor(false);
    setSire([]);
    setdamSire([]);
    setKeyAncestor([]);
    setClear(true);
    headerRef?.current?.handleClearText();
    filterCounterhook.reset();
    setIsSortBySelected(0);
    setIsCountrySelected(0);
    setIsPrivateFeeSelected(0);
    setIsExcludeKeyAncestorSelected(0);
    document
      .getElementById('rdts1_trigger')
      ?.getElementsByTagName('input')[0]
      .setAttribute('placeholder', 'Location');
    document
      .getElementById('rdts3_trigger')
      ?.getElementsByTagName('input')[0]
      .setAttribute('style', 'display: block');
    document
      .getElementById('rdts3_trigger')
      ?.getElementsByTagName('input')[0]
      .setAttribute('placeholder', 'Location');
    document
      .getElementById('rdts1_trigger')
      ?.getElementsByTagName('input')[0]
      .setAttribute('style', 'display: block');
    document
      .getElementById('rdts7_trigger')
      ?.getElementsByTagName('input')[0]
      .setAttribute('placeholder', 'Location');
    document
      .getElementById('rdts7_trigger')
      ?.getElementsByTagName('input')[0]
      .setAttribute('style', 'display: block');
    setIsSearchedClicked(false);
    window.localStorage.setItem('storedFiltered', '');
    window.localStorage.setItem('comeFromDirectory', 'false');
    window.localStorage.setItem('storedFilteredSire', '');
    window.localStorage.setItem('storedFilteredDamSire', '');
    window.localStorage.setItem('storedFilteredKeyAncestor', '');
    window.localStorage.setItem('storedFarmFilteredSire', '');
    window.localStorage.setItem('storedFarmFilteredDamSire', '');
    window.localStorage.setItem('storedFarmFilteredKeyAncestor', '');
    window.localStorage.setItem('storedFarmFilteredGrandSire', '');
    navigate('/stallion-directory');
  };
  
  useEffect(() => {
    if (isStallionDirectoryPage) {
      // const filterSavedData = JSON.parse(localStorage.getItem('myStallionDirectoryFilter') || '{}');
      // // setPrice([0, 5000000]);
      // setSortBy(filterSavedData?.sortBy);
      // setColour(filterSavedData?.colour);
      // setYearOfStudKey(filterSavedData?.yearToStud);
      // setFarmKey(filterSavedData?.farms);
      // setCurrency(filterSavedData?.currency);
      // setSearchKey(filterSavedData?.stallionName);
      // setIsStallionNameExactSearch(filterSavedData?.isStallionNameExactSearch);
      // setLocation(filterSavedData?.location);
      // setPrivateFee(filterSavedData?.isPrivateFee);
      // setIsExcludeKeyAncestor(filterSavedData?.isExcludeKeyAncestor);
      // setSire(filterSavedData?.sire);
      // setdamSire(filterSavedData?.damSire);
      // setKeyAncestor(filterSavedData?.keyAncestor);
      setLocalStoargeFilter(JSON.parse(localStorage.getItem('storedFiltered') || '{}'));
    }
  }, [isStallionDirectoryPage]);  

  const response = useStallionsQuery({...newState} , { refetchOnMountOrArgChange: true });

  let stallionList = response?.data?.data ? response?.data?.data : [];

  if (response.isSuccess && stallionList.length && emptyStallionList) {
    setEmptyStallionList(false);
  } else if (stallionList.length === 0 && !emptyStallionList) setEmptyStallionList(true);

  let newShortlistState = {
    ...initialState,
    page: page,
    priceRange: (price[1]=== 0 || price[1]=== undefined) ?"0-1000000":price.join('-'),
    stallionName,
    sortBy: sortBy,
    farms: searchFarmKey,
    yearToStud: searchYearOfStudKey,
    colour: searchColour,
    currency: searchCurrency,
    location: location,
    isPrivateFee: isPrivateFee,
    isExcludeKeyAncestor: isExcludeKeyAncestor,
    ...(sire !== '' && { sireId: sire }),
    ...(damSire !== '' && { damSireId: damSire }),
    ...(keyAncestor !== '' && { keyAncestorId: keyAncestor }),
  };

  let newGuestShortlistState = {
    ...initialState,
    page: page,
    priceRange: price.join('-'),
    stallionName,
    sortBy: sortBy,
    farms: searchFarmKey,
    yearToStud: searchYearOfStudKey,
    colour: searchColour,
    currency: searchCurrency,
    location: location,
    isPrivateFee: isPrivateFee,
    isExcludeKeyAncestor: isExcludeKeyAncestor,
    stallionIds: window.sessionStorage.getItem('stallionIds'),
    ...(sire !== '' && { sireId: sire }),
    ...(damSire !== '' && { damSireId: damSire }),
    ...(keyAncestor !== '' && { keyAncestorId: keyAncestor }),
  };
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;

  const shortlistResponse_loggedin = useStallionShortlistsQuery(newShortlistState, {
    skip: !isLoggedIn,refetchOnMountOrArgChange: true
  });
  const shortlistResponse_Ids = useStallionShortlistsIdsQuery(
    {},
    {
      skip: !isLoggedIn,
    }
  );
  const shortlistResponse_guest = useGuestStallionShortlistsQuery(newGuestShortlistState, {
    skip: newGuestShortlistState.stallionIds === null || isLoggedIn,
    refetchOnMountOrArgChange: true
  });
  const shortlistResponse = isLoggedIn ? shortlistResponse_loggedin : shortlistResponse_guest;
  let shortList = shortlistResponse?.data?.data ? shortlistResponse?.data?.data : [];
  let bookmarkresults = isLoggedIn
    ? shortlistResponse_Ids?.data
      ? shortlistResponse_Ids?.data
      : []
    : window.sessionStorage.getItem('stallionIds')
      ? window.sessionStorage.getItem('stallionIds')?.split('|')
      : [];

  let bookmarkStallionIds: any = [];
  bookmarkresults.map((data: any) => {
    if (isLoggedIn) {
      bookmarkStallionIds.push(data.stallionId);
    } else {
      bookmarkStallionIds.push(data);
    }
  });
  const shortListProps = {
    page,
    setPage,
    result:shortList,
    pagination: shortlistResponse?.data?.meta,
    query: shortlistResponse,
    clear,
    setClear,
    selectedBookmarks: bookmarkStallionIds,
  };

  const stallionListProps = {
    page: page,
    setPage,
    result: stallionList,
    pagination: response?.data?.meta,
    query: response,
    clear,
    setClear,
    selectedBookmarks:
      !isLoggedIn && window.sessionStorage.getItem('stallionIds') === null
        ? []
        : bookmarkStallionIds,
  };

  const listCount = isShortlist
    ? shortListProps?.result?.length
    : stallionListProps?.result?.length;
  const filterListData = isShortlist ? shortList : stallionList;
  const filterResponse = isShortlist ? shortlistResponse : response;
  const filterCount = isShortlist
    ? !isLoggedIn && window.sessionStorage.getItem('stallionIds') === null
      ? 0
      : bookmarkStallionIds.length
    : response?.data?.meta?.itemCount;
  const filterProps = {
    price,
    setPrice,
    stallionName,
    setSearchKey,
    isStallionNameExactSearch,
    setIsStallionNameExactSearch,
    sortBy,
    setSortBy,
    searchFarmKey,
    setFarmKey,
    searchYearOfStudKey,
    setYearOfStudKey,
    searchColour,
    setColour,
    searchCurrency,
    setCurrency,
    setLocation,
    location,
    setPrivateFee,
    isPrivateFee: isPrivateFee,
    setIsExcludeKeyAncestor,
    isExcludeKeyAncestor: isExcludeKeyAncestor,
    filterListData,
    query: filterResponse,
    stallioncount: filterCount,
    isStallionPage: true,
    clearAll,
    clear,
    setClear,
    setPage,
    sire,
    setSire,
    damSire,
    setdamSire,
    keyAncestor,
    setKeyAncestor,
    filterCounterhook,
    isFarmsSelected,
    setIsFarmsSelected,
    isYearToStudsSelected,
    setIsYearToStudsSelected,
    isColoursSelected,
    setIsColoursSelected,
    isSortBySelected,
    setIsSortBySelected,
    isCountrySelected,
    setIsCountrySelected,
    isPrivateFeeSelected,
    setIsPrivateFeeSelected,
    isExcludeKeyAncestorSelected,
    setIsExcludeKeyAncestorSelected,
    stallionData: stallionListProps.query.data,
    isSearchedClicked,
    setIsSearchedClicked,
    feeRange,
  };
  
  // console.log('filterProps>>>', filterProps, 'newState>>>', newState);
  return (
    <>
      
      <StyledEngineProvider injectFirst>
        <Header {...filterProps} ref={headerRef} />
        <Container className="stalliondirectory-container" maxWidth="lg">
          <Grid container spacing={2}>
            <Grid
              item
              lg={3}
              xs={12}
              sx={{ pr: { xs: '0', lg: '2.5rem' } }}
              className="stalliondirectory-left"
            >
              {isShortlist ? (
                <ShortlistFilter {...filterProps} />
              ) : (
                <StallionFilter {...filterProps} />
              )}
            </Grid>
            <Grid item lg={9} xs={12} className="stalliondirectory-right">
              {isShortlist &&
                !isLoggedIn &&
                window.sessionStorage.getItem('stallionIds') === null ? (
                <NoDataComponent {...filterProps} />
              ) : response.isLoading ? (
                <SkeletonCard />
              ) : isShortlist ? (
                <StallionShortlist shortListProps={shortListProps} />
              ) : (
                <StallionList stallionListProps={stallionListProps} />
              )}
              {isLoggedIn && listCount < 1 && !response.isLoading ? <NoDataComponent {...filterProps} /> : ''}
            </Grid>
          </Grid>
        </Container>
      </StyledEngineProvider>
    </>
  );
}

export default StallionDirectoryController;
