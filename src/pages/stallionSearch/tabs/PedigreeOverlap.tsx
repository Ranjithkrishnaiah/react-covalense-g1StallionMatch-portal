import { Container, Grid, Box, StyledEngineProvider, Stack } from '@mui/material';
import React from 'react';
import { CustomButton } from 'src/components/CustomButton';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import OverlapLegendModal from 'src/components/OverlapLegendModal';
import HypoMatingOverlapPedigree from 'src/components/HypoMatingOverlapPedigree';
import { Images } from 'src/assets/images';
import FullScreenDialog from 'src/components/fullscreenDialog/FullScreenWrapperDialog';

type PedigreeProps = {
   horseId: string;
   horseName: string;
   ColorCoding?: string;
   tag?: string;
   countryId?: number;
   progenyId?: number;
   yob?: number;
   isLocked?: boolean;
   horseTypeId?: number;
   generation?: number;
   sex?: string;
   gelding?: boolean;
   colourId?: number;
   cob?: string;
   children?: [] | undefined;
   FirstInfo?: string;
   FirstInfoinFull?: string;
   isRaceHorse?: number;
   raceHorseUrl?: string;
}

function PedigreeOverlap(props: any) {   
   const [openLegendModal, setOpenLegendModal] = React.useState(false);

   // Open legend modal
   const handleOverlapLegend = () => {
      setOpenLegendModal(true);
   }  

   const [generationsArray, setGenerationsArray] = React.useState<PedigreeProps[][]>([]);
   const [generationsMareArray, setGenerationsMareArray] = React.useState<PedigreeProps[][]>([]);
   const [generationsSwArray, setGenerationsSwArray] = React.useState<PedigreeProps[][]>([]);
   let profilePic = "";
   const stallionFarmLogo = (props.hypomatingOverlapData?.stallionFarmLogo?.farmLogo === null) ? Images.farmplaceholder : props.hypomatingOverlapData?.stallionFarmLogo?.farmLogo;
   const stallionFarmName = (props.hypomatingOverlapData?.stallionFarmLogo?.farmName === null) ? '' : props.hypomatingOverlapData?.stallionFarmLogo?.farmName;
   const [hypomatingStallionHorsePic, setHypomatingStallionHorsePic] = React.useState("");
   const [hypomatingMareHorsePic, setHypomatingMareHorsePic] = React.useState("");
   const [open, setOpen] = React.useState(false);

   // Open full screen page
   const handleClickOpen = () => {
      setOpen(true);
   };

   // Close full screen page
   const handleClose = () => {
      setOpen(false);
   };

   // Set the generation array and profile picture
   React.useEffect(() => {
      profilePic = props.hypomatingOverlapData?.stallionProfileImageData?.profilePic ? props.hypomatingOverlapData?.stallionProfileImageData?.profilePic : Images.HorseProfile;
      setGenerationsArray(props.hypomatingOverlapData.Stallion.pedigree);
      setHypomatingStallionHorsePic(profilePic);    
   }, [props.hypomatingOverlapData.Stallion])

   React.useEffect(() => {profilePic = Images.HorseProfile;
      setGenerationsMareArray(props.hypomatingOverlapData.Mare.pedigree);
      setHypomatingMareHorsePic(profilePic);   
   }, [props.hypomatingOverlapData.Mare])
   
   React.useEffect(() => {
      setGenerationsSwArray(props.hypomatingOverlapData.stakeWinner.pedigree);    
   }, [props.hypomatingOverlapData.Mare])

   return (
      <>
         <StyledEngineProvider injectFirst>
            <FullScreenDialog  className={`fullscreen ${open ? 'fullscreen-enabled' : ''}`} open={open} setOpen={setOpen}>
               <Container>
                  <Grid container spacing={0} className='middayPredegreeWrp'>
                     <Grid item xs={12} md={6} lg={6}>
                        <Box className='pedegree-overlap-left-wrapper'>
                           {/* Render the Left side Stallion HypoMatingOverlapPedigree component */}   
                           {props.hypomatingOverlapData.Stallion && <HypoMatingOverlapPedigree
                              type="stallion"
                              hypomatingOverlapData={generationsArray}
                              pedigreeTreeLevel={props.hypomatingOverlapData.Stallion.pedigreeTreeLevel}
                              data={props.hypomatingOverlapData.Stallion}
                              stallionFarmLogo={stallionFarmLogo}
                              horseNameProp={''}
                              profilePic={hypomatingStallionHorsePic}
                              isStallionParam={true}
                              stallionFarmName={stallionFarmName}
                           />
                           }
                           <hr className='midday-hr' />
                           {/* Render the Left side Mare HypoMatingOverlapPedigree component */} 
                           {props.hypomatingOverlapData.Mare && <HypoMatingOverlapPedigree
                              type="mare"
                              hypomatingOverlapData={generationsMareArray}
                              pedigreeTreeLevel={props.hypomatingOverlapData.Mare.pedigreeTreeLevel}
                              data={props.hypomatingOverlapData.Mare}
                              stallionFarmLogo={''}
                              horseNameProp={''}
                              profilePic={hypomatingMareHorsePic}
                              isStallionParam={false}
                           />
                           }
                        </Box>
                     </Grid>

                     <Grid item xs={12} md={6} lg={6}>
                        <Box className='pedegree-overlap-right-wrapper'>
                           {/* Render the Right side Full Screen and Legend */} 
                           <Stack direction='row' className='pedegree-overlap-right-head'>
                              {!open ? (
                                 <Box>
                                    <CustomButton className="ListBtn fullscreenBtn" onClick={handleClickOpen}>
                                       <i className='icon-Arrows-expand' /> Full Screen
                                    </CustomButton>
                                    <CustomButton className="ListBtn legendBtn" sx={{ ml: '1rem' }} onClick={handleOverlapLegend}>
                                       <i className='icon-Info-circle' /> Legend
                                    </CustomButton>
                                 </Box>) : (
                                 <CustomButton className="ListBtn fullscreenBtn" onClick={handleClose}>
                                    <img
                                       src={Images.collapseicon}
                                       alt="close"
                                       className='collapse-icon'
                                       onClick={handleClose}
                                    />{' '}
                                    Exit Full Screen
                                 </CustomButton>
                              )
                              }
                           </Stack>
                           {/* Render the Right side HypoMatingOverlapPedigree component */}   
                           {props.hypomatingOverlapData.stakeWinner && <HypoMatingOverlapPedigree
                              type="swHorse"
                              hypomatingOverlapData={generationsSwArray}
                              pedigreeTreeLevel={props.hypomatingOverlapData.stakeWinner.pedigreeTreeLevel}
                              data={props.hypomatingOverlapData.stakeWinner}
                              stallionFarmLogo={''}
                              horseNameProp={''}
                              isStallionParam={false}
                              profilePic={''}
                           />
                           }

                        </Box>
                     </Grid>
                  </Grid>
               </Container>
            </FullScreenDialog>
            {/* Popup modal for legend modal */}   
            <WrapperDialog
               open={openLegendModal}
               title={'Legend'}
               onClose={() => setOpenLegendModal(false)}
               body={OverlapLegendModal}
            />
         </StyledEngineProvider>
      </>
   );
}

export default PedigreeOverlap;