import { Container, Grid, StyledEngineProvider } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import FarmFilter from './FarmFilter';
import FarmList from './FarmList';
import Header from './Header';
import { scrollToTop } from '../../utils/customFunctions';
import { initialState } from './FarmInitialState';
import NoDataComponent from 'src/components/NoDataComponent/NoDataComponent';
import * as _ from 'lodash';
import { useFarmsQuery } from 'src/redux/splitEndpoints/farmsSplit';
import { useGetMinMaxPricingSlidervalueQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import SkeletonCard from 'src/components/skeletonCard/skeletonCard';
import { useLocation, useNavigate } from 'react-router-dom';

// MetaTags
import useMetaTags from 'react-metatags-hook';
import useCounter from 'src/hooks/useCounter';

function FarmDirectoryController() {
  const { pathname } = useLocation();

  useMetaTags({
    title: pathname === "/farm-directory" ? `Top Thoroughbred Breeding Farms | Stallion Match` : "",
    description: pathname === "/farm-directory" ? `Browse our directory of the world's top racehorse breeding farms and choose from available stallions at stud for your best ever breeding match.` : "",
    openGraph: {
      title: pathname === "/farm-directory" ? `Top Thoroughbred Breeding Farms | Stallion Match` : "",
      description: pathname === "/farm-directory" ? `Browse our directory of the world's top racehorse breeding farms and choose from available stallions at stud for your best ever breeding match.` : "",
      site_name: 'Stallion Match',
      url: process.env.REACT_APP_FARM_DIRECTORY_URL,
      type: 'business.business',
      image: process.env.REACT_APP_FARM_DIRECTORY_IMG,
    },
  }, [])
  const navigate = useNavigate();
  const [price, setPrice] = useState([]);
  const [page, setPage] = useState(1);
  const [feeRange, setFeeRange] = useState({});
  const [farmName, setSearchKey] = useState<any>('');
  const [isFarmNameExactSearch, setIsFarmNameExactSearch] = useState<any>(false);
  const [searchFarmKey, setFarmKey] = useState<any>([]);
  const [searchYearOfStudKey, setYearOfStudKey] = useState<any>([]);
  const [searchColour, setColour] = useState<any>([]);
  const [searchCurrency, setCurrency] = useState<any>([]);
  const [searchCountries, setCountries] = useState<any>([]);
  const [emptyFarmsList, setEmptyFarmsList] = useState(true);
  const [sortBy, setSortBy] = useState<any>('Promoted');
  const [isPrivateFee, setPrivateFee] = useState(initialState.isPrivateFee);
  const [clear, setClear] = useState<any>(false);
  const [location, setLocation] = useState<any>('');
  const [isFarmsSelected, setIsFarmsSelected] = useState<any>(0);
  const [isSortBySelected, setIsSortBySelected] = useState<any>(0);
  const [isColoursSelected, setIsColoursSelected] = useState<any>(0);
  const [isYearToStudsSelected, setIsYearToStudsSelected] = useState<any>(0);
  const [sire, setSire] = useState<any>('');
  const [damSire, setdamSire] = useState<any>('');
  const [grandSire, setgrandSire] = useState<any>('');
  const [isExcludeKeyAncestor, setIsExcludeKeyAncestor] = useState(initialState.isExcludeKeyAncestor);
  const [keyAncestor, setKeyAncestor] = useState<any>('');
  const [isPrivateFeeSelected, setIsPrivateFeeSelected] = useState<any>(0);
  const [isExcludeKeyAncestorSelected, setIsExcludeKeyAncestorSelected] = useState<any>(0);
  const [isSearchedClicked, setIsSearchedClicked] = useState<any>(false);
  const [currencySlider, setCurrencySlider] = useState<any>({});
  const [isCurrencyChanged, setIsCurrencyChanged] = useState<boolean>(false);
  const filterCounterhook = useCounter(0);
  const headerRef = useRef<any>(null);
  const { data: currenciesMinMaxvalue, isSuccess: isCurrenciesMinMaxvalueSuccess } = useGetMinMaxPricingSlidervalueQuery(currencySlider, { skip: (!isCurrencyChanged) });

  //when ever emptyFarmsList,pagevalue is updated this function is called to scroll the pageto top
  useEffect(() => {
    if (emptyFarmsList || page) scrollToTop();
  }, [emptyFarmsList, page]);

  //when ever the currenciesMinMaxvalue changes the fee range is updated
  useEffect(() => {
    // @ts-ignore
    if (currenciesMinMaxvalue) {
      setFeeRange({ minPrice: currenciesMinMaxvalue?.priceRange?.min ? currenciesMinMaxvalue?.priceRange?.min : 0, maxPrice: currenciesMinMaxvalue?.priceRange?.max ? currenciesMinMaxvalue?.priceRange?.max : 1000000 });
    }
  }, [currenciesMinMaxvalue]);

  //when ever the location, searchCurrency,isPrivateFee isCurrencyChanged and currencySlider values are updated
  useEffect(() => {
    setIsCurrencyChanged(true);
    setCurrencySlider(
      {
        location: location,
        currency: searchCurrency,
        ...(isPrivateFee === true && { isPrivateFee: isPrivateFee })
      }
    )
  }, [location, searchCurrency, isPrivateFee]);

  let newState = {
    ...initialState,
    page: page,
    priceRange: (price[0] != null && price[1] != null) ? price.join('-') : '',
    farmName,
    ...(isFarmNameExactSearch === true && { isFarmNameExactSearch: isFarmNameExactSearch }),
    sortBy,
    YearToStud: searchYearOfStudKey,
    colour: searchColour,
    currency: searchCurrency,
    isPrivateFee: isPrivateFee,
    isExcludeKeyAncestor: isExcludeKeyAncestor,
    location: location,
    ...(sire !== '' && { sireId: sire }),
    ...(damSire !== '' && { damSireId: damSire }),
    ...(grandSire !== '' && { grandSireId: grandSire }),
    ...(keyAncestor !== '' && { keyAncestorId: keyAncestor }),
  };

  useEffect(() => {
    window.onbeforeunload = function () {
      window.localStorage.setItem('storedFarmFiltered', '');
      window.localStorage.setItem('comeFromFarmDirectory', 'false');
      window.localStorage.setItem('storedFarmFilteredSire', '');
      window.localStorage.setItem('storedFarmFilteredDamSire', '');
      window.localStorage.setItem('storedFarmFilteredKeyAncestor', '');
      window.localStorage.setItem('storedFarmFilteredGrandSire', '');

      return null;
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);


  useEffect(() => {
    if (filterCounterhook.value) {
      window.localStorage.setItem('storedFarmFiltered', JSON.stringify(newState))
    }
  }, [newState])

  const response = useFarmsQuery({ ...newState }, { refetchOnMountOrArgChange: true });
  let farmsList = response?.data?.data ? response?.data?.data : [];

  if (response.isSuccess && farmsList.length && emptyFarmsList) {
    setEmptyFarmsList(false);
  } else if (farmsList.length === 0 && !emptyFarmsList) {
    setEmptyFarmsList(true);
  }



  // this method when called will set all the filter values to default values
  const clearAll = () => {
    setSortBy(initialState.sortBy);
    setColour(initialState.colour);
    setYearOfStudKey(initialState.YearToStud);
    setCurrency(initialState.currency);
    setSearchKey(initialState.farmName);
    setIsFarmNameExactSearch(false);
    setPrivateFee(true);
    setIsExcludeKeyAncestor(false);
    setLocation(initialState.location);
    setSire('');
    setdamSire('');
    setgrandSire('');
    setKeyAncestor('');
    setClear(true);
    headerRef?.current?.handleClearText();
    filterCounterhook.reset();
    setIsPrivateFeeSelected(0);
    setIsExcludeKeyAncestorSelected(0);
    setIsSortBySelected(0);
    document.getElementById("rdts1_trigger")?.getElementsByTagName("input")[0].setAttribute('placeholder', 'Location');
    document.getElementById("rdts1_trigger")?.getElementsByTagName("input")[0].setAttribute('style', 'display: block');
    document.getElementById("rdts4_trigger")?.getElementsByTagName("input")[0].setAttribute('placeholder', 'Location');
    document.getElementById("rdts4_trigger")?.getElementsByTagName("input")[0].setAttribute('style', 'display: block');
    document.getElementById("rdts7_trigger")?.getElementsByTagName("input")[0].setAttribute('placeholder', 'Location');
    document.getElementById("rdts7_trigger")?.getElementsByTagName("input")[0].setAttribute('style', 'display: block');
    document.getElementById("rdts15_trigger")?.getElementsByTagName("input")[0].setAttribute('placeholder', 'Location');
    document.getElementById("rdts15_trigger")?.getElementsByTagName("input")[0].setAttribute('style', 'display: block');
    setIsSearchedClicked(false);
    navigate('/farm-directory');
    window.localStorage.setItem('storedFarmFiltered', '');
    window.localStorage.setItem('comeFromFarmDirectory', 'false');
    window.localStorage.setItem('storedFarmFilteredSire', '');
    window.localStorage.setItem('storedFarmFilteredDamSire', '');
    window.localStorage.setItem('storedFarmFilteredKeyAncestor', '');
    window.localStorage.setItem('storedFarmFilteredGrandSire', '');
    navigate('/farm-directory');
  };

  const filterProps = {
    price,
    setPrice,
    setSearchKey,
    isFarmNameExactSearch,
    setIsFarmNameExactSearch,
    setSortBy,
    setFarmKey,
    setYearOfStudKey,
    setColour,
    setCurrency,
    setCountries,
    setPrivateFee,
    isPrivateFee: isPrivateFee,
    setIsExcludeKeyAncestor,
    isExcludeKeyAncestor: isExcludeKeyAncestor,
    setLocation,
    location,
    searchYearOfStudKey,
    searchColour,
    farmsList,
    query: response,
    farmcount: response?.data?.meta?.itemCount,
    isStallionPage: false,
    clearAll,
    clear,
    setClear,
    setPage,
    sire,
    setSire,
    damSire,
    setdamSire,
    filterCounterhook,
    isFarmsSelected,
    setIsFarmsSelected,
    isYearToStudsSelected,
    setIsYearToStudsSelected,
    isColoursSelected,
    setIsColoursSelected,
    isSortBySelected,
    setIsSortBySelected,
    grandSire,
    setgrandSire,
    isPrivateFeeSelected,
    setIsPrivateFeeSelected,
    isExcludeKeyAncestorSelected,
    setIsExcludeKeyAncestorSelected,
    keyAncestor,
    setKeyAncestor,
    isSearchedClicked,
    setIsSearchedClicked,
    feeRange,
  };

  const farmsListProps = {
    page,
    setPage,
    result: farmsList,
    pagination: response?.data?.meta,
    query: response,
    clear,
    setClear,
    isLoading: response.isLoading,
  };
  // console.log('filterProps>>>', filterProps, 'newState>>>', newState);
  return (
    <>
      <StyledEngineProvider injectFirst>
        <Header {...filterProps} ref={headerRef} />
        <Container className='farmdirectory-container' maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item lg={3} xs={12} sx={{ pr: { xs: '0', lg: '2.5rem' } }}>
              <FarmFilter {...filterProps} />
            </Grid>
            <Grid item lg={9} xs={12}>
              {response.isLoading ? <SkeletonCard /> : <FarmList farmsListProps={farmsListProps} />}
              {farmsListProps?.result?.length < 1 && !response.isLoading ? (
                <NoDataComponent {...filterProps} />
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        </Container>
      </StyledEngineProvider>
    </>
  );
}

export default FarmDirectoryController;