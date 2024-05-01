import { Container, Box, AppBar } from '@mui/material'
import { useState, useRef, useEffect, createRef } from 'react';
import Header from './Header';
import HypoMating from './tabs/HypoMating';
import StakesWinnersComparision from './tabs/StakesWinnersComparision';
import AptitudeProfile from './tabs/AptitudeProfile';
import AlternateMatingSuggestions from './tabs/AlternateMatingSuggestions';
import { getQueryParameterByName, scrollToTop } from "src/utils/customFunctions";
import './stallionsearch.css';
import '../stallionPage/StallionPage.css';
import Scrollspy from 'react-scrollspy';
import { useLocation } from 'react-router-dom';
// MetaTags
import useMetaTags from 'react-metatags-hook';

function StallionSearchController() {
  const { pathname } = useLocation();  
  const stallionId  = getQueryParameterByName('stallionId') || "";
  const mareId  = getQueryParameterByName('mareId') || "";
  const isStallionParam = (stallionId === '') ? false : true;
  const isMareParam = (mareId === '') ? false : true;
  const isCSIParam = (isStallionParam && isMareParam) ? true : false;

  const tabDisabled = (isStallionParam && isMareParam) ? false : true;
  const sectionDisabled = (isStallionParam && isMareParam) ? true : false;
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;  
  const stallionSearchUrl = `${BaseAPI}stallion-search`;
  const stallionSearchImage = process.env.REACT_APP_STALLION_SEARCH_IMAGE;
  const [metaInfos, setMetaInfos] = useState({title: '', desc: ''});  
  
  // Meta Title based stallionId or mareId or both 
  useEffect(() => {  
    if(isStallionParam === true && isMareParam === false) {
      setMetaInfos({
        ...metaInfos,
        desc: `Search our mare pedigree database and choose from the best thoroughbred farms for your perfect breeding match.`
      });
    } else if(isStallionParam === false && isMareParam === true) {setMetaInfos({
        ...metaInfos,
        desc: `Search our stallion pedigree database and choose from the best thoroughbred farms for your perfect breeding match.`
      });
    } else if(isStallionParam === true && isMareParam === true ) {setMetaInfos({
        ...metaInfos,
        title: "Stallion Search",
        desc: `Search our stallion pedigree database and choose from the best horse breeding farms for your perfect breeding match based on our thoroughbred analysis.`
      });
    } else {setMetaInfos({
        ...metaInfos,
        title: "Perfect Breeding Match",
        desc: `Search our stallion pedigree database and choose from the best horse breeding farms for your perfect breeding match based on our thoroughbred analysis.`
      });
    }   
}, [isStallionParam, isMareParam])

// Generate meta information
useMetaTags({
  // title: metaInfos.title,
  description: metaInfos.desc,
  openGraph: {
    // title: metaInfos.title,
    description: metaInfos.desc,
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
  useEffect(() => {
    scrollToTop();
  }, []);
  
  return (
    <div>
      <Header sectionDisabled={sectionDisabled} metaInfos={metaInfos} setMetaInfos={setMetaInfos} />
      <Box py={3} my={5} className='stallion-search-graph' sx={ { position: 'relative' } }>  
      <Box  className='SPtabs'>
      <AppBar position='sticky' sx={ { top: '92px', background: '#FFFFFF', boxShadow: 'none' } }>      
      <Box sx={ { borderBottom: 1, borderColor: 'divider' } }>
        {/* Tab Section */}
         <Container>
            <Scrollspy  items={['HypoMating', 'StakesWinnersComparision','AptitudeProfile', 'AlternateMatingSuggestions']} offset={-120} className="nav__inner" currentClassName="is-current">
              <li className={`nav__item ${!sectionDisabled ? 'disabled-tabs': ''}`} onClick={() => handleScroll(hypoMatingRef)}><a >Hypo Mating</a></li>
              <li className={`nav__item ${!sectionDisabled ? 'disabled-tabs': ''}`} onClick={() => handleScroll(stakesWinnersComparisionRef)}><a className={`${tabDisabled ? 'disabled-a': ''}`} >Stakes Winners Comparison</a></li>
              <li className={`nav__item ${!sectionDisabled ? 'disabled-tabs': ''}`} onClick={() => handleScroll(aptitudeProfileRef)}><a className={`${tabDisabled ? 'disabled-a': ''}`}>Aptitude Profile</a></li>
              <li className={`nav__item ${!sectionDisabled ? 'disabled-tabs': ''}`} onClick={() => handleScroll(alternateMatingSuggestionsRef)}><a className={`${tabDisabled ? 'disabled-a': ''}`}>Alternate Mating Suggestions</a></li>
            </Scrollspy>
        </Container>
        {/* End Tab Section */}
      </Box>  
      </AppBar>      
      {/* Tab Section Component */}
      <section className='hypomating-tabs' id='HypoMating' ref={hypoMatingRef}><HypoMating metaInfos={metaInfos} setMetaInfos={setMetaInfos} /></section>
      { <section className={`hypomating-tabs ${!sectionDisabled ? 'disabled-section': ''}`} id='StakesWinnersComparision' ref={stakesWinnersComparisionRef}><StakesWinnersComparision /></section>}
      { <section className={`hypomating-tabs ${!sectionDisabled ? 'disabled-section': ''}`} id='AptitudeProfile' ref={aptitudeProfileRef}><AptitudeProfile /></section>}
      { <section className={`alternate-mating-tabs ${!sectionDisabled ? 'disabled-section': ''}`} id='AlternateMatingSuggestions' ref={alternateMatingSuggestionsRef}><AlternateMatingSuggestions /></section>}
      {/* End Tab Section Component */}
      </Box> 
      </Box>      
    </div>
  )
}
export default StallionSearchController