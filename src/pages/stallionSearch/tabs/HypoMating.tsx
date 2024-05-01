import { Container, Box, StyledEngineProvider, Typography, Divider, Stack, IconButton } from '@mui/material';
import React from 'react';
import SelectStallion from 'src/forms/SelectStallion';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { getQueryParameterByName, scrollToTop } from 'src/utils/customFunctions';
import HypoMatingPedigree from 'src/components/HypomatingPedigree';
import T20Match from 'src/components/T20Match';
import PerfectMatch from 'src/components/PerfectMatch';
import NormalMatch from 'src/components/NormalMatch';
import useAuth from 'src/hooks/useAuth';
import CSIHypoMatingPedigree from 'src/components/CSIHypomatingPedigree';

function HypoMating(props: any) { 
     
   const { authentication } = useAuth()
   const stallionId  = getQueryParameterByName('stallionId') || "";
   const mareId  = getQueryParameterByName('mareId') || "";
   const isStallionParam = (stallionId === '') ? false : true;
   const isMareParam = (mareId === '') ? false : true;   
   const isCSIHypomating = (isStallionParam && isMareParam) ? true : false;
   const [hypomatingMatchResult, setHypomatingMatchResult] = React.useState("");
   const [hypomatingResult, setHypomatingResult] = React.useState<any>({});
   const [ openSelectStallionForm, setOpenSelectStallionForm ] = React.useState(false);   
   const [ isStallion, setIsStallion ] = React.useState(false);
   const [ isMare, setIsMare ] = React.useState(false);
   
   const isStallionSearched = window.localStorage.getItem('stallionIsSearchFromViewDetailsModal');
   const isMareSearched = window.localStorage.getItem('mareIsSearchFromViewDetailsModal');

   // Checked the local storage and open corresponding search popup
   React.useEffect(() => {
      if(isStallionSearched === 'yes') {
         searchStallion();
      }
   }, [isStallionSearched]);

   React.useEffect(() => {
      if(isMareSearched === 'yes') {
         searchMare();
      }
   }, [isMareSearched]);

   React.useEffect(() => {
      if(isCSIHypomating) {
         scrollToTop();
      }
   }, [isCSIHypomating]);
   
   const searchStallion = () => {
      setIsStallion(true);
      setIsMare(false);
      setOpenSelectStallionForm(true);
      window.localStorage.setItem("stallionIsSearchFromViewDetailsModal", "no");
   }
   const searchMare = () => {
      setIsMare(true);
      setIsStallion(false);
      setOpenSelectStallionForm(true);
      window.localStorage.setItem("mareIsSearchFromViewDetailsModal", "no");
   }
   // End of Checked the local storage and open corresponding search popup

    return (
      <>
      <StyledEngineProvider injectFirst>
      <Container> 
       {/* Based on Search stallionId and mareId, populate the PerfectMatch or T20Match component */}
       {(isCSIHypomating && (hypomatingMatchResult === 'A PERFECT MATCH !' || hypomatingMatchResult === 'PERFECT MATCH')) && <PerfectMatch data={hypomatingResult}/>}
       {(isCSIHypomating && (hypomatingMatchResult === '20/20 MATCH !' || hypomatingMatchResult === '20/20 MATCH')) && <T20Match data={hypomatingResult}/>}
       {(isCSIHypomating && (hypomatingMatchResult === 'NORMAL MATCH !' || hypomatingMatchResult === 'NORMAL MATCH')) && <NormalMatch data={hypomatingResult}/>}
       {/* If both stallion and mare is searched, then populate the CSIHypoMatingPedigree component */}
       {
         isCSIHypomating && 
         <CSIHypoMatingPedigree 
            stallionId={stallionId} 
            isStallionParam={true} 
            mareId={mareId} 
            isMareParam={true} 
            farmImg = { stallionId } horseNameProp={''}
            hypomatingMatchResult = {hypomatingMatchResult}
            setHypomatingMatchResult = {setHypomatingMatchResult}
            hypomatingResult = {hypomatingResult}
            setHypomatingResult = {setHypomatingResult}
         />  
       } 
       {/* If either stallion or mare is searched, then populate the HypoMatingPedigree component */}
       {
         !isCSIHypomating &&  
         <>
         <Box className='common-search-hypomate Search-Stallion-HypoMate'>
            {/* If stallion not clicked, then display Stallion Search box */}
            {               
               (isStallionParam === false) ?  
               <Stack direction={ { xs: 'column', lg: 'row' } } className='StallionButton' onClick={searchStallion}>    
               <Typography variant='h6'>Select a Stallion</Typography>
                  <IconButton type="submit" className='SearchBtnStallion'>
                  <i className='icon-Search'/>
                  </IconButton>
               </Stack>
               : 
               <HypoMatingPedigree stallionId={stallionId} 
               isStallionParam={isStallionParam} mareId={''} 
               isMareParam={false} 
               farmImg = { stallionId } horseNameProp={''} 
               metaInfos={props.metaInfos} setMetaInfos={props.setMetaInfos}
               />
           }
         </Box>           

         <Box className='common-search-hypomate Search-Mare-HypoMate'>
            {/* If mare not clicked, then display Mare Search box */}
            {  
               (isMareParam === false) ? 
               <Stack direction={ { xs: 'column', lg: 'row' } } className='StallionButton' onClick={searchMare}>    
                  <Typography variant='h6'>Select a Mare</Typography>
                  <IconButton type="submit" className='SearchBtnStallion'>
                     <i className='icon-Search'/>
                  </IconButton>
               </Stack>
               :
               <HypoMatingPedigree 
                  stallionId={''} 
                  isStallionParam={false} 
                  mareId={mareId} 
                  isMareParam={true}
                  farmImg = { mareId } 
                  horseNameProp={''} 
                  metaInfos={props.metaInfos} setMetaInfos={props.setMetaInfos}
               />
            }
         </Box>
         </>
         }
       
         {/* Popup modal for selecting either Stallion or Mare */}
         <WrapperDialog
            dialogClassName="dialogPopup selectStallionModal"
            open = { openSelectStallionForm }
            title = {(isMare) ? 'Select a Mare' : 'Select a Stallion'}
            onClose = {() => setOpenSelectStallionForm(false)}
            body = {SelectStallion}
            param = {(isMare) ? 'Mare' : 'Stallion'}
         />
      </Container>
    </StyledEngineProvider>  
      </>
    );
}
export default HypoMating;