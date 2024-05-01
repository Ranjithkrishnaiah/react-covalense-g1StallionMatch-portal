import { Container, Box, AppBar, TextField, Typography, Autocomplete, Stack } from '@mui/material';
import { useState, useRef, useEffect, createRef  } from 'react';
import Header from './Header';
import HypoMating from './tabs/HypoMating';
import StakesWinnersComparision from './tabs/StakesWinnersComparision';
import AptitudeProfile from './tabs/AptitudeProfile';
import { getQueryParameterByName, toPascalCase } from "src/utils/customFunctions";
import './stallionsearch.css';
import '../stallionPage/StallionPage.css';
import Scrollspy from 'react-scrollspy';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useValidateUrlMutation, useRaceHorseAutosearchHorseNamesQuery } from 'src/redux/splitEndpoints/raceHorseSplit';
// MetaTags
import useMetaTags from 'react-metatags-hook';
import useAuth from 'src/hooks/useAuth';
import FooterUnReg from './FooterUnReg';
import FooterReg from './FooterReg';
import PageNotFound from '../PageNotFound';
import { debounce } from 'lodash';
import FooterForReg from './FooterForReg';


function RaceHorseController() {
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const { user, authentication } = useAuth();
  const { pathname } = useLocation(); 
  const currentPage = pathname.split("/");
  const horseName = toPascalCase(decodeURIComponent(currentPage[2]))?.toString();
  const horseId = currentPage[3];
  const isHorseParam = (horseId === '') ? false : true;
  const tabDisabled = (isHorseParam) ? false : true;
  const sectionDisabled = (isHorseParam) ? true : false;
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;  
  const stallionSearchUrl = `${BaseAPI}stallion-search`;
  const stallionSearchImage = process.env.REACT_APP_STALLION_SEARCH_IMAGE;

  const [isValidateUrl, setIsValidateUrl] = useState(false);
  const [isValidateUrlError, setIsValidateError] = useState(false);
  const [validateUrl] = useValidateUrlMutation();

  useEffect(() => {
    if (!isValidateUrl) {
      // Should call validateUrl as an asynchronous function
      validateUrl({ slug: horseName, horseId: horseId })
        .unwrap()
        .then((result) => {
          // Handle the result here
          setIsValidateUrl(true);
        })
        .catch((error) => {
          setIsValidateUrl(true);
          setIsValidateError(true);
          console.error('validateUrl error:', error); // Handle errors
        });
    }    
  }, [isValidateUrl])
 
  // Meta Title based stallionId or mareId or both 
  const metaTitles = () => {    
    return `${horseName} Race Horse |  Stallion Match`;
  }
  
  // Meta Descrption based stallionId or mareId or both 
  const metaDescriptions = () => {
    return `Search our list of racehorses and identify what features and form make up these elite thoroughbreds.`;
  }

// Generate meta information
useMetaTags({
  title: metaTitles(),
  description: metaDescriptions(),
  openGraph: {
    title: metaTitles(),
    description: metaDescriptions(),
    site_name: 'Stallion Match',
    url: stallionSearchUrl,
    type: 'business.business',
    image: stallionSearchImage,
  },
}, [])  
  
  const [screenSize, setScreenSize] = useState<any>(window.innerWidth);
  const hypoMatingRef = useRef<HTMLElement | null>(null);
  const stakesWinnersComparisionRef = useRef<HTMLElement | null>(null);
  const aptitudeProfileRef = useRef<HTMLElement | null>(null);
  const alternateMatingSuggestionsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleResizeWindow = () => {
        setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, [])

  // Once user scrolls the page, respective section contents 
  const handleScroll : any = (ref:React.MutableRefObject<HTMLElement | null>) => {
    if(ref?.current?.offsetTop){
      if(ref?.current?.id === 'HypoMating'){
        window.scrollTo({ top:0, behavior:"smooth" })
      }else {
        if(screenSize > 767) {
          window.scrollTo({ top: ref?.current?.offsetTop+120, behavior:"smooth" })
        }else {
          window.scrollTo({ top: ref?.current?.offsetTop+122, behavior:"smooth" })
        }
      }
    }else {
      if(ref?.current?.offsetTop === 0) {
        if(ref?.current?.id === 'HypoMating'){
          window.scrollTo({ top:0, behavior:"smooth" })  
        }
      }
    }
  };

  const [searchedHorseName, setSearchedHorseName] = useState<any>('');
  const [isHorseSearch, setIsHorseSearch] = useState(false);
  const [isClearHorse, setIsClearHorse] = useState(0);
  const [horseListSelected, setHorseListSelected] = useState<any>();
  const [isSearchedClicked, setIsSearchedClicked] = useState(false);
  const [value, setValue] = useState(null);
  // assign payload variable for race horse search 
  const horseNameData: any = {
    raceHorseName: searchedHorseName,
  };

  // race horse search API call
  const {
    data: footerNameList,
    isSuccess,
    isFetching,
    refetch,
    requestId,
    isLoading,
  } = useRaceHorseAutosearchHorseNamesQuery(horseNameData, { skip: !isHorseSearch });
  
  // Debounce mechanism to restrict cuncurrent race horse search API call
  const debouncedHorseName = useRef(
    debounce(async (typedStallionName) => {
      if (typedStallionName?.length >= 3 && isClearHorse === 0) {
        await setSearchedHorseName(typedStallionName);
        await setIsHorseSearch(true);
        refetch();
      } else {
        setIsHorseSearch(false);
      }
    }, 250)
  ).current;
  
  // Once user inputs in race horse autocomplete, it checks and render the race horse search API
  const handleHorseInput = (e: any) => {
    setIsClearHorse(0);
    if (e?.target?.value && isClearHorse === 0) {
      debouncedHorseName(e?.target?.value);
    } 
  };
  
  // Assign race horse search response
  let horseNameOptionsList =
    isHorseSearch && isClearHorse === 0 && !isFetching ? footerNameList : [];
	
	// Reset race horse
  const handleHorseOptionsReset = (blurVal: number, selectedOptions?: any) => {
    setIsHorseSearch(false);
    setIsClearHorse(blurVal);
  };
  
  // Choose a race horse from the race horse search result
  const handleHorseSelect = (event: any, selectedOptions: any) => {
    setValue(selectedOptions?.name);
    setHorseListSelected(selectedOptions);
    setSearchedHorseName(selectedOptions?.name);
    handleHorseOptionsReset(0, selectedOptions);
    setIsSearchedClicked(true);
    if(selectedOptions) {
      handleNewRaceHorseSearch(selectedOptions);
    }      
  };

  const handleNewRaceHorseSearch = (selectedOptions: any) => {
    navigate(`/race-horse/${toPascalCase(selectedOptions?.raceHorseUrl)}/${selectedOptions?.horseId}`);
  }
  
  return (
    <div>
      {isValidateUrlError && isValidateUrl && <PageNotFound />}
      {!isValidateUrlError && isValidateUrl && 
      <><Header sectionDisabled={sectionDisabled}/>  
      <Box py={3} my={5} className='stallion-search-graph' sx={ { position: 'relative' } }>  
      <Box  className='SPtabs'>
      <AppBar position='sticky' sx={ { top: '92px', background: '#FFFFFF', boxShadow: 'none' } }>      
      <Box sx={ { borderBottom: 1, borderColor: 'divider' } }>
        {/* Tab Section */}
         <Container className='raceHorseContainer'>
            <Scrollspy  items={['HypoMating', 'StakesWinnersComparision','AptitudeProfile']} offset={-120} className="nav__inner" currentClassName="is-current">
              <li className={`nav__item ${!sectionDisabled ? 'disabled-tabs': ''}`} onClick={() => handleScroll(hypoMatingRef)}><a >Pedigree</a></li>
              <li className={`nav__item ${!sectionDisabled ? 'disabled-tabs': ''}`} onClick={() => handleScroll(stakesWinnersComparisionRef)}><a className={`${tabDisabled ? 'disabled-a': ''}`} >Stakes Winners Comparison</a></li>
              <li className={`nav__item ${!sectionDisabled ? 'disabled-tabs': ''}`} onClick={() => handleScroll(aptitudeProfileRef)}><a className={`${tabDisabled ? 'disabled-a': ''}`}>Aptitude Profile</a></li>
              <li className='raceHorseSearch'>
                <Typography variant='h5'>New Search</Typography>
                  {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                  <Box className='searchFooter'>
                  <Box className="search-stallion-pop-box-inner">
                  <Autocomplete
                    // freeSolo
                    disablePortal
                    popupIcon={<KeyboardArrowDownRoundedIcon />}
                    options={horseNameOptionsList}
                    noOptionsText={
                      horseName != '' &&
                      isClearHorse === 0 && (
                        <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                          <span className="fw-bold sorry-message">
                            {isFetching
                              ? 'Loading...'
                              : `Sorry, we couldn't find any matches for "${searchedHorseName}"`}
                          </span>                        
                        </Box>
                      )
                    }
                    onInputChange={handleHorseInput}
                    getOptionLabel={(option: any) => `${toPascalCase(option?.horseName)?.toString()} (${option?.yob}, ${option?.countryCode})`}
                    renderOption={(props, option: any) => (
                      <li className="searchstallionListBox" {...props}>
                        <Box className="stallionListBoxHead">
                          {toPascalCase(option?.horseName)} ({option?.yob},{' '}
                          <span>{option?.countryCode}</span>){' '}
                        </Box>
                        <Box className="stallionListBoxpara">
                          <strong>X</strong>
                          <p>
                            {toPascalCase(option?.sireName)} ({option?.sireYob},{' '}
                            <span>{option?.sireCountryCode}</span>),{' '}{toPascalCase(option?.damName)} (
                            {option?.damYob}, <span>{option?.damCountryCode}</span>)
                          </p>
                        </Box>
                      </li>
                    )}
                    onChange={(e: any, selectedOptions: any) => handleHorseSelect(e, selectedOptions)}
                    onBlur={() => handleHorseOptionsReset(1)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder={`Enter Name`} id="outlined-basic" variant="outlined" />
                    )}              
                    className="directory-arrow stallionBlockInput"
                    sx={{ justifyContent: 'center', flexGrow: 1, minWidth: '100px' }}
                  />
                  </Box>
                  </Box>
                </li>
            </Scrollspy>
        </Container>
        {/* End Tab Section */}
      </Box>  
      </AppBar>      
      {/* Tab Section Component */}
      <section className='hypomating-tabs' id='HypoMating' ref={hypoMatingRef}><HypoMating /></section>
      { <section className={`hypomating-tabs ${!sectionDisabled ? 'disabled-section': ''}`} id='StakesWinnersComparision' ref={stakesWinnersComparisionRef}><StakesWinnersComparision /></section>}
      { <section className={`hypomating-tabs ${!sectionDisabled ? 'disabled-section': ''}`} id='AptitudeProfile' ref={aptitudeProfileRef}><AptitudeProfile /></section>}
      {/* End Tab Section Component */}
      </Box> 
      <Container> 
      <Box className='raceSignup'>
      {/* Show this footer banner for Anonymous user only */}
      {authentication === false &&
          <FooterUnReg />
      }
      {authentication === true &&
          <FooterForReg />
      }
      {/* Show this footer banner for registered user only */}
      {/* {authentication === true &&
        // <FooterReg />
      } */}
      </Box>
      </Container>
      </Box></>
      }     
    </div>
  )
}
export default RaceHorseController