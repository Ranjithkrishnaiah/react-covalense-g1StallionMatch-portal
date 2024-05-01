import React from 'react';
import { Grid, Box, StyledEngineProvider, Typography, Divider, Stack, Avatar, Link } from '@mui/material';
import { Images } from 'src/assets/images';
import { toPascalCase } from 'src/utils/customFunctions';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
// common-css
import './HypomatingPedigree.css';

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
   profilePic: string;
   FirstInfo?: string;
   FirstInfoinFull?: string;
   isRaceHorse?: number;
   raceHorseUrl?: string;
 }

 type Props = {
   type: string;
   hypomatingOverlapData: any;
   pedigreeTreeLevel: number;
   data: any;
   stallionFarmLogo: string;
   horseNameProp: string;
   profilePic: string;
   isStallionParam: boolean;
   stallionFarmName?:string;
 };

 const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={ { popper: className } } />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Synthese-Regular !important',
  },
}));

 function HypoMatingOverlapPedigree({
   type,
   hypomatingOverlapData,
   pedigreeTreeLevel,
   data,
   stallionFarmLogo,
   horseNameProp,
   isStallionParam,
   profilePic,
   stallionFarmName
 }: Props) {

   // pedigree logic
   const generationsArray = hypomatingOverlapData;
   const isMareParam = true; 
      
   let pedigreeLevelCntr: any = [];
   const counts:any = {};
   generationsArray?.map((genArr: PedigreeProps[], index: number)=>{
      genArr?.map((pedigree: PedigreeProps, subindex: number) => {
        pedigreeLevelCntr.push(index);
      });      
   });
   for (const num of pedigreeLevelCntr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;    
   }
   
   // method to remove Duplicates
   function removeDuplicates(arr: any) {
      return arr.filter((item: any, index: number) => arr.indexOf(item) === index);
   }
   let allIndexArray = removeDuplicates(pedigreeLevelCntr);
   let highestPedigreeLevel = Math.max(...allIndexArray);
   
    return (
      <>
      <StyledEngineProvider injectFirst>      
      <Box className={"SPtreechat PredegreeWrapperBox StallionPedigree " + (isMareParam ?  'pedegree-overlap-lft-colmn' : '')} py={3} >
      <Box sx={ { flexGrow: 1, width: '100%', margin: '0 auto' } } className='SPtreechatBody'>    
         <Stack direction='row'>
         { isStallionParam && <Box flexGrow={1} className='pedegreeLogo'>
         <Box className='pedegreeLogoImg'><img src={stallionFarmLogo} alt={stallionFarmName ? stallionFarmName +' Logo' : ''}/></Box></Box> }
         
         </Stack>
         {((typeof(data) == 'object' && pedigreeTreeLevel >0)) &&  
         <Stack className={"treeBox "
            + (highestPedigreeLevel === 1 ? 'firstGenerationPedegree' : '')
            + (highestPedigreeLevel === 2 ? 'secondGenerationPedegree' : '')
            + (highestPedigreeLevel === 3 ? 'thirdGenerationPedegree' : '')
            + (highestPedigreeLevel === 4 ? 'fourthGenerationPedegree' : '')
            + (highestPedigreeLevel === 5 ? 'fifthGenerationPedegree' : '')
            + (highestPedigreeLevel === 6 ? 'sixthGenerationPedegree' : '')
            + (highestPedigreeLevel === 7 ? 'seventhGenerationPedegree' : '')
            + (highestPedigreeLevel === 8 ? 'eighthGenerationPedegree' : '')
            }
         >     
         <Grid 
            className={"PredegreeWrapperBoxInner "
            + (counts[1] === 1 ? 'OneColumnBoxWrapper' : '')
            + (counts[2] === 3 ? 'ThreeColumnBoxWrapper' : '')
            + (counts[3] === 7 ? 'SevenColumnBoxWrapper' : '')
            + (counts[4] === 15 ? 'FifteenColumnBoxWrapper' : '')
            + (counts[5] === 31 ? 'thirtyoneColumnBoxWrapper' : '')
            + (counts[6] === 63 ? 'sixtythreeColumnBoxWrapper' : '')
            + (counts[7] === 127 ? 'onetwosevenColumnBoxWrapper' : '')
            } 
            container columns={12} sx={ { height: '50rem', position:'relative' } }>
            <Divider className='treeLine' data-num="1"/>
            <Divider className='treeLine' data-num="2"/>
            <Divider className='treeLine' data-num="3"/>
            <Divider className='treeLine' data-num="4"/> 
            <Divider className='treeLine' data-num="5"/> 
            <Divider className='treeLine' data-num="6"/>
            <Divider className='treeLine' data-num="7"/> 
         {generationsArray?.map((genArr: PedigreeProps[], index: number) => (
            
            <Grid item xs={2} key={index} 
            className={"treeCol " 
               + (index === 0 ? 'zeroColumnblock' : '')
               + (index === 1 ? 'firstColumnblock ' : '')
               + (index === 2 ? 'secondColumnblock' : '')
               + (index === 3 ? 'thirdColumnblock' : '')
               + (index === 4 ? 'fourthColumnblock' : '')
               + (index === 5 ? 'fifthColumnblock' : '')
               + (index === 6 ? 'sixthColumnblock' : '')
               + (index === 7 ? 'seventhColumnblock' : '')
               + (index === 8 ? 'eigthColumnblock' : '')
               }
            >
            <Box sx={ { height: '100%' } } className='Pedigree'>
                  {genArr?.map((pedigree: PedigreeProps, subindex: number) => (
                     <Box style={ { width: '100%' } } key={subindex} className='treeCell'>
                        <Box className={"HorseName " 
                        + (index === 0 ? 'PredegreeWhiteBox' : '')
                        + (index === 1 ? 'PredegreesecondcolText' : '')
                        + (index === 2 ? 'PredegreethirdcolText' : '')
                        + (index === 3 ? 'PredegreefourthcolText' : '')
                        + (index === 4 ? 'PredegreefifthcolText' : '')
                        + (index === 5 ? 'PredegreesixthcolText' : '')
                        }
                        >                              
                        {index === 0 && <Avatar alt={pedigree.horseName} src={profilePic || Images.HorseProfile } />}
                        <Box className='PredegreeWhiteBoxText'>
                        <HtmlTooltip
                        enterTouchDelay={0}
                        leaveTouchDelay={6000} 
                           className="CommonTooltip pedegreeTooltip"
                           sx={ {width: 'auto !important' } }
                           placement="top-start"
                           arrow
                           title={
                              <React.Fragment>
                                 <Typography color="inherit">{toPascalCase(pedigree.horseName)}</Typography>
                                 <em>({pedigree.yob}&nbsp;&nbsp;{pedigree.cob})</em>.{' '}                                       
                              </React.Fragment>
                           }
                           >
                           <Typography variant='h5' className={pedigree.ColorCoding} aria-describedby={pedigree.horseId} id={pedigree.horseId}>
                              {pedigree?.isRaceHorse === 1 && 
                                 <Link href={pedigree?.isRaceHorse === 1 ? `/race-horse${pedigree?.raceHorseUrl}` : '#'} target="_blank" rel="noopener" variant="body2">
                                    {toPascalCase(pedigree.horseName)}
                                 </Link>
                              }
                              {pedigree?.isRaceHorse === 0 && (toPascalCase(pedigree.horseName))}
                           </Typography>
                        </HtmlTooltip>
                        {index < 3 && pedigree.FirstInfo !== null ?
                                    <HtmlTooltip
                                    enterTouchDelay={0}
                                    leaveTouchDelay={6000}
                                    className="CommonTooltip pedegreeTooltip"
                                    sx={{ width: 'auto !important' }}
                                    placement="bottom-start"
                                    arrow
                                    title={
                                      <React.Fragment>
                                        <Typography color="inherit">{pedigree?.FirstInfoinFull}</Typography>
                                        
                                      </React.Fragment>
                                    }
                                  >   
                                    <Typography component='span' className='g1pro-text'>{pedigree?.FirstInfo}</Typography>
                                    </HtmlTooltip>
                                     : ""}
                        </Box> 
                        </Box>
                  </Box>
                  ))}
               </Box>
         </Grid>
         ))}
         </Grid> 
         </Stack>
         }   
      </Box>
      </Box>
      </StyledEngineProvider> 
      </>
    )
 };

 export default HypoMatingOverlapPedigree;