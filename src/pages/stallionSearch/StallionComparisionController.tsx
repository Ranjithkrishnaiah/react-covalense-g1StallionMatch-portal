import { Container, Box, AppBar } from '@mui/material'
import React,{ useRef, createRef } from 'react';
import HeaderSP from './HeaderSP';
import PedigreeOverlap from './tabs/PedigreeOverlap';
import StakesWins from './tabs/StakesWins';
import Scrollspy from 'react-scrollspy';
import './stallionsearch.css';
import '../stallionPage/StallionPage.css';
// MetaTags
import useMetaTags from 'react-metatags-hook';
import { getQueryParameterByName, toPascalCase } from 'src/utils/customFunctions';
import { useGetHypomatingPedigreeOverlapQuery } from 'src/redux/splitEndpoints/getPedigreeOverlapSplit';
import { Spinner } from 'src/components/Spinner';

function StallionComparisionController() {
   const stallionId  = getQueryParameterByName('stallionId') || "";
   const mareId  = getQueryParameterByName('mareId') || "";
   const overlapType = getQueryParameterByName('type');
   const swHorseId = getQueryParameterByName('swHorseId') || "";
   const overlapParams = {stallionId: stallionId, mareId: mareId, swId: swHorseId, generation: 5}; 

   // Pedigree overlap API call
   const {data: hypomatingOverlapData, isLoading, isSuccess } = useGetHypomatingPedigreeOverlapQuery(overlapParams);
   const swHorseName = toPascalCase(hypomatingOverlapData?.stakeWinner?.horseName); 
   
  // Update the Meta title and Description 
  useMetaTags({
      title: `Pedigree Overlap & Stake wins`,
      description: `User can see the Pedigree overlap and Stake wins details`,
  }, [])
  
  const pedigreeOverlapRef = useRef<HTMLElement | null>(null);
  const stakesWinsRef = useRef<HTMLElement | null>(null);

  // Set window scroll behaviour
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Once user scrolls the page, respective section contents 
  const handleScroll = (ref:React.MutableRefObject<HTMLElement | null>) => {
    if(ref?.current?.offsetTop){
      if (ref?.current?.id === 'PedigreeOverlap') {
        window.scrollTo({ top: ref?.current?.offsetTop - 120, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: ref?.current?.offsetTop+150, behavior:"smooth" })
      }
    }
  };

  const bodyRef = createRef();
  return (
    <div>
      <HeaderSP swHorseName={swHorseName} stallionId={stallionId} mareId={mareId}/>    
      {(isLoading) ?
        <Box className='Spinner-Wrp'>  <Spinner /></Box> :
        <Box py={3} my={5} className='stallion-search-graph midday-wrapper' sx={ { position: 'relative' } }>  
      <Box  className='SPtabs'>
      <AppBar position='sticky' sx={ { top: '92px', background: '#FFFFFF', boxShadow: 'none' } }>      
      <Box sx={ { borderBottom: 1, borderColor: 'divider' } }>
        {/* Tab Section */}
         <Container>
            <Scrollspy  items={['PedigreeOverlap', 'StakesWins']} offset={-110} className="nav__inner" currentClassName="is-current">
              <li className='nav__item' onClick={() => handleScroll(pedigreeOverlapRef)}><a >Pedigree Overlap</a></li>
              <li className='nav__item' onClick={() => handleScroll(stakesWinsRef)}><a>Stakes Wins</a></li>
            </Scrollspy>
        </Container>
        {/* End Tab Section */}
      </Box>      
      </AppBar>
      {/* Tab Section Component */}
      <section className='hypomating-tabs' id='PedigreeOverlap' ref={pedigreeOverlapRef}><PedigreeOverlap hypomatingOverlapData={hypomatingOverlapData} /></section>
      <section className='hypomating-tabs' id='StakesWins'  ref={stakesWinsRef}><StakesWins /></section>
      {/* End Tab Section Component */}
      </Box> 
      </Box>
    }
    </div>
    
  )
}
export default StallionComparisionController