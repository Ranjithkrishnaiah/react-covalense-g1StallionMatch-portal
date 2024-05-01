import React from 'react';
import { Grid, Box, StyledEngineProvider, Typography, Divider, Stack, Avatar, Link } from '@mui/material';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import PedigreeModal from 'src/components/PedigreeModal';
import { getQueryParameterByName, toPascalCase } from 'src/utils/customFunctions';
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
    profilePic?: string;
    children?: [] | undefined;
    FirstInfo?: string;
    FirstInfoinFull?: string;
    isRaceHorse?: number;
    raceHorseUrl?: string;
 } 

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

 function CSIHypoMatingMare(props: any) { 
    const [openPedigreeModal, setOpenPedigreeModal] = React.useState(false);
    const mareId  = getQueryParameterByName('mareId') || "";
    const [hId, setHId] = React.useState<any>({
      id: '',
      hType: '', 
      farmsCount: 1,
      isRaceHorse: 0,
      raceHorseUrl: '' 
    });
    
    const handlePedigree = (horseId: any, horseType: any, farmsCount: number, isRaceHorse?: number, raceHorseUrl?: string ) => {
      setHId(
        {
          ...hId,
          id: horseId, 
          hType: horseType ,
          farmsCount: farmsCount,
          isRaceHorse: isRaceHorse,
          raceHorseUrl: raceHorseUrl  
        });
      setOpenPedigreeModal(true);
    }
  
    return (
      <>
      <StyledEngineProvider injectFirst>
        
          
         <Stack className={"treeBox "
            + (props.highestPedigreeLevel === 1 ? 'firstGenerationPedegree' : '')
            + (props.highestPedigreeLevel === 2 ? 'secondGenerationPedegree' : '')
            + (props.highestPedigreeLevel === 3 ? 'thirdGenerationPedegree' : '')
            + (props.highestPedigreeLevel === 4 ? 'fourthGenerationPedegree' : '')
            + (props.highestPedigreeLevel === 5 ? 'fifthGenerationPedegree' : '')
            + (props.highestPedigreeLevel === 6 ? 'sixthGenerationPedegree' : '')
            + (props.highestPedigreeLevel === 7 ? 'seventhGenerationPedegree' : '')
            + (props.highestPedigreeLevel === 8 ? 'eighthGenerationPedegree' : '')
            }
         >     
         <Grid 
            className={"PredegreeWrapperBoxInner "
            + (props.counts[1] === 1 ? 'OneColumnBoxWrapper' : '')
            + (props.counts[2] === 3 ? 'ThreeColumnBoxWrapper' : '')
            + (props.counts[3] === 7 ? 'SevenColumnBoxWrapper' : '')
            + (props.counts[4] === 15 ? 'FifteenColumnBoxWrapper' : '')
            + (props.counts[5] === 31 ? 'thirtyoneColumnBoxWrapper' : '')
            + (props.counts[6] === 63 ? 'sixtythreeColumnBoxWrapper' : '')
            + (props.counts[7] === 127 ? 'onetwosevenColumnBoxWrapper' : '')
            } 
            container columns={12} sx={ { height: '50rem', position:'relative' } }>
            <Divider className='treeLine' data-num="1"/>
            <Divider className='treeLine' data-num="2"/>
            <Divider className='treeLine' data-num="3"/>
            <Divider className='treeLine' data-num="4"/> 
            <Divider className='treeLine' data-num="5"/> 
            <Divider className='treeLine' data-num="6"/>
            <Divider className='treeLine' data-num="7"/> 
         {props.generationsArray?.map((genArr: PedigreeProps[], index: number) => (
            
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
                        onClick={() => {(index > 0) ? void(0) : handlePedigree(mareId, 'mare', 1, pedigree?.isRaceHorse, pedigree?.raceHorseUrl)}}
                        >                         
                        {index === 0 && <Avatar alt={pedigree.horseName} src={props.profilePic} />}
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
                           <Typography variant='h5' className={pedigree.ColorCoding} aria-describedby={pedigree.horseId} id={pedigree.horseId} >
                           {index > 0 && pedigree?.isRaceHorse === 1 && 
                              <Link href={pedigree?.isRaceHorse === 1 ? `/race-horse${pedigree?.raceHorseUrl}` : '#'} target="_blank" rel="noopener" variant="body2">
                                {toPascalCase(pedigree.horseName)}
                              </Link>
                            }
                            {index > 0 && pedigree?.isRaceHorse === 0 && (toPascalCase(pedigree.horseName))}
                            {index === 0 && (toPascalCase(pedigree.horseName))}
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

         <WrapperDialog
          dialogClassName={'dialogPopup pedegreeModal'}
          open={openPedigreeModal}
          title={''}
          onClose={() => setOpenPedigreeModal(false)}
          body={PedigreeModal}
          parameter={hId}
        />
        
      </StyledEngineProvider> 
      </>
    )
 };

 export default CSIHypoMatingMare;