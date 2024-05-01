import React, { useCallback } from 'react';
import { Grid, Box, StyledEngineProvider, Typography, Divider, Stack, Avatar, Link } from '@mui/material';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from 'src/assets/images';
import { useMarePedigreeQuery } from 'src/redux/splitEndpoints/marePedigreeSplit';
import { usePedigreeWithLevelQuery, useGetFarmLogosByStallionIdQuery } from 'src/redux/splitEndpoints/pedigreeSplit';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import PedigreeModal from 'src/components/PedigreeModal';
import LegendModal from 'src/components/LegendModal';
import { getQueryParameterByName, toPascalCase } from 'src/utils/customFunctions';
import { Spinner } from './Spinner';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
// common-css
import './HypomatingPedigree.css';
import FullScreenDialog from './fullscreenDialog/FullScreenWrapperDialog';
import Imgix from 'react-imgix';

// PedigreeProps type
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
  profilePic?: string;
  FirstInfo?: string;
  FirstInfoinFull?: string;
  farmsCount: number;
  isRaceHorse?: number;
  raceHorseUrl?: string;
}

// Props type
type Props = {
  stallionId: string;
  isStallionParam: boolean;
  mareId: string;
  isMareParam: boolean;
  farmImg: string;
  horseNameProp: string;
  yob?: number;
  cob?: string;
  profilePic?: string;
  metaInfos: any; 
  setMetaInfos: React.Dispatch<React.SetStateAction<any>>  
};

// Farm interface
interface Farm {
  farmId: string;
  farmName: string;
  mediaUrl: any;
  isPromoted: number;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Synthese-Regular !important',
  },
}));

function HypoMatingPedigree({
  stallionId,
  isStallionParam,
  mareId,
  isMareParam,
  farmImg,
  horseNameProp,
  metaInfos,
  setMetaInfos
}: Props) {
  
  const overlapId = getQueryParameterByName('swHorseId') || "";
  const isOverlapIdParam = (overlapId === '') ? false : true;
  const stallionParams = { stallionId: stallionId, level: 5 };

  // Stallion pedigree API call
  const { data, isLoading, isFetching, isSuccess, refetch } = usePedigreeWithLevelQuery(stallionParams, { skip: (!isStallionParam), refetchOnMountOrArgChange: true });
  const stallionFarmCount = data?.farmsCount;

  const stallionFarmLogo = (data?.farmLogo === null) ? Images.farmplaceholder : `${data?.farmLogo}?w=120&h=80&fit=crop&ar=3:2`;

  // Farm logo API call
  // const { data: farmLogosData, isLoading: isFarmLogoLoading, isSuccess: isFarmLogoSuccess, refetch: farmLogoRefetch } = useGetFarmLogosByStallionIdQuery(stallionParams, { skip: (!isStallionParam), refetchOnMountOrArgChange: true });
  // const farmsLogo: Farm[] =  farmLogosData;

  // Mare pedigree API call
  const { data: mareData, isLoading: isLoadingMare, isFetching: isMareFetching, isSuccess: isMareSuccess, refetch: mareRefetch } = useMarePedigreeQuery(mareId, { skip: (!isMareParam), refetchOnMountOrArgChange: true });
  const [generationsArray, setGenerationsArray] = React.useState<PedigreeProps[][]>([])
  let profilePic = '';
  
  const [isHypomatingData, setIsHypomatingData] = React.useState(false);
  const [hypomatingHorsePic, setHypomatingHorsePic] = React.useState("");
  const [open, setOpen] = React.useState(false);
  
  // on isFetching || isHypomatingData call useEffect
  React.useEffect(() => {
    if (isSuccess || isHypomatingData) {      
      profilePic = data.stallionProfileImageData.profilePic ? data.stallionProfileImageData.profilePic : Images.HorseProfile;
      setGenerationsArray(data?.pedigree);
      setHypomatingHorsePic(profilePic);
      const searchedHorseName = toPascalCase(data?.pedigree[0][0]?.horseName)?.toString() || "";
      setMetaInfos({...metaInfos, title: searchedHorseName + ' Stallion Search'});
    }
  }, [isFetching || isHypomatingData])
  
  // on isMareFetching || isHypomatingData call useEffect
  React.useEffect(() => {
    if (isMareSuccess || isHypomatingData) {
      profilePic = mareData?.horseProfileImageData?.profilePic ? mareData?.horseProfileImageData?.profilePic : Images.HorseProfile;;
      setHypomatingHorsePic(profilePic);
      setGenerationsArray(mareData?.pedigree)
      setHypomatingHorsePic(profilePic);
      const searchedHorseName = toPascalCase(mareData?.pedigree[0][0]?.horseName)?.toString() || "";
      setMetaInfos({...metaInfos, title: searchedHorseName + ' Broodmare Search'});
    }
  }, [isMareFetching || isHypomatingData])
  
  const [openLegendModal, setOpenLegendModal] = React.useState(false);
  const [openPedigreeModal, setOpenPedigreeModal] = React.useState(false);

  const handleLegend = () => {
    setOpenLegendModal(true);
  }
  
  const [hId, setHId] = React.useState<any>({
    id: '',
    hType: '', 
  });

  // Open pedigree popup modal
  const handlePedigree = (horseId: any, horseType: any, farmsCount: number, isRaceHorse?: number, raceHorseUrl?: string) => {
    setHId(
      {
        ...hId,
        id: horseId, 
        hType: horseType,
        farmsCount: farmsCount,
        isRaceHorse: isRaceHorse,
        raceHorseUrl: raceHorseUrl
      });
    setOpenPedigreeModal(true);
  }  

  let pedigreeLevelCntr: any = [];
  const counts: any = {};
  const pedigreeLevelCls = '';
  generationsArray?.map((genArr: PedigreeProps[], index: number) => {
    genArr?.map((pedigree: PedigreeProps, subindex: number) => {
      pedigreeLevelCntr.push(index);
    });
  });
  for (const num of pedigreeLevelCntr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  // remove Duplicates handler
  function removeDuplicates(arr: any) {
    return arr.filter((item: any, index: number) => arr.indexOf(item) === index);
  }
  let allIndexArray = removeDuplicates(pedigreeLevelCntr);
  let highestPedigreeLevel = Math.max(...allIndexArray);

  // Load the stallion spinner is Stallion API is loading 
  if (isFetching) {
    return <Spinner />
  }

  // Load the stallion spinner is Mare API is loading
  if (isMareFetching) {
    return <Spinner />
  }

  // Open full screen
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Exit full screen
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <FullScreenDialog className={`fullscreen ${open ? 'fullscreen-enabled' : ''}`} open={open} setOpen={setOpen}>
          <Box className={"SPtreechat PredegreeWrapperBox StallionPedigree " + (isMareParam ? 'pedegree-overlap-lft-colmn' : '')} py={3} >
            <Box sx={{ flexGrow: 1, width: '100%', margin: '0 auto' }} className='SPtreechatBody'>
              <Stack direction='row'>
                {/* Render the farm logo */}
                {isStallionParam && <Box flexGrow={1} className='pedegreeLogo'> 
                  <Box key={data?.farmName} className='pedegreeLogoImg'>
                    {(data?.farmLogo === null) ?
                      <img key={data?.farmName} src={`${Images.farmplaceholder}?w=120&h=80&fit=crop&ar=3:2`} alt={data?.farmName} />
                    :
                    <Imgix
                      src={data?.farmLogo?.toString()}
                      imgixParams={{w:120,h:80,ar:'3:2',fit:'crop'}}
                      htmlAttributes={{ alt: data?.farmName+' Logo' }}
                    />}
                  </Box>                        
                  </Box>
                }
                {/* End Render the farm logo */}
                {/* Render the Full screen and legend */}
                {!open && isStallionParam && !isOverlapIdParam ? (
                  <Box>
                    <CustomButton className="ListBtn fullscreenBtn" onClick={handleClickOpen}>
                      <i className='icon-Arrows-expand' /> Full Screen
                    </CustomButton>
                    <CustomButton className="ListBtn legendBtn" sx={{ ml: '1rem' }} onClick={handleLegend}>
                      <i className='icon-Info-circle' /> Legend
                    </CustomButton>
                  </Box>) : (
                  isStallionParam &&
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
                {/* End Render the Full screen and legend */}
              </Stack>
              {/* Render the pedigree data */}
              {(typeof (mareData) == 'object' && (mareData.pedigreeTreeLevel > 0) || (typeof (data) == 'object' && data.pedigreeTreeLevel > 0)) &&
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
                    container columns={12} sx={{ height: '50rem', position: 'relative' }}>
                    <Divider className='treeLine' data-num="1" />
                    <Divider className='treeLine' data-num="2" />
                    <Divider className='treeLine' data-num="3" />
                    <Divider className='treeLine' data-num="4" />
                    <Divider className='treeLine' data-num="5" />
                    <Divider className='treeLine' data-num="6" />
                    <Divider className='treeLine' data-num="7" />
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
                        <Box sx={{ height: '100%' }} className='Pedigree'>
                          {genArr?.map((pedigree: PedigreeProps, subindex: number) => (
                            <Box style={{ width: '100%' }} key={subindex} className='treeCell'>
                              <Box className={"HorseName "
                                + (index === 0 ? 'PredegreeWhiteBox' : '')
                                + (index === 1 ? 'PredegreesecondcolText' : '')
                                + (index === 2 ? 'PredegreethirdcolText' : '')
                                + (index === 3 ? 'PredegreefourthcolText' : '')
                                + (index === 4 ? 'PredegreefifthcolText' : '')
                                + (index === 5 ? 'PredegreesixthcolText' : '')
                              }
                              onClick={() => {(index > 0) ? void(0) : handlePedigree((isStallionParam) ? stallionId : mareId, (isStallionParam) ? 'stallion' : 'mare', stallionFarmCount, pedigree?.isRaceHorse, pedigree?.raceHorseUrl)}}
                              >
                                {index === 0 && <Avatar alt={pedigree.horseName} src={hypomatingHorsePic} />}
                                <Box className='PredegreeWhiteBoxText'>
                                  {/* Tooltip for the pedigree horse name for displaying  horse name, YoB and CoB */}
                                  <HtmlTooltip
                                    enterTouchDelay={0}
                                    leaveTouchDelay={6000}
                                    className="CommonTooltip pedegreeTooltip"
                                    sx={{ width: 'auto !important' }}
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
                                  {/* End Tooltip for the pedigree horse name for displaying  horse name, YoB and CoB */}

                                  {/* Tooltip for the pedigree First Info for first 3 generation */}
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
                                  {/* End Tooltip for the pedigree First Info for first 3 generation */}   
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
              {/* End Render the pedigree data */}
            </Box>
          </Box>
        </FullScreenDialog>

        {/* Popup modal for horse name */}      
        <WrapperDialog
          dialogClassName={'dialogPopup pedegreeModal'}
          open={openPedigreeModal}
          title={''}
          onClose={() => setOpenPedigreeModal(false)}
          body={PedigreeModal}
          parameter={hId}
        />

        {/* Popup modal for legend */}  
        <WrapperDialog
          open={openLegendModal}
          title={'Legend'}
          onClose={() => setOpenLegendModal(false)}
          body={LegendModal}
        />

      </StyledEngineProvider>
    </>
  )
};

export default HypoMatingPedigree;