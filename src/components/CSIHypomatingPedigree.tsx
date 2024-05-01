import React from 'react';
import {
  Box,
  StyledEngineProvider,
  Stack,
} from '@mui/material';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from 'src/assets/images';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import PedigreeModal from 'src/components/PedigreeModal';
import LegendModal from 'src/components/LegendModal';
import { getQueryParameterByName, toPascalCase } from 'src/utils/customFunctions';
import { Spinner } from './Spinner';
// common-css
import './HypomatingPedigree.css';
import { useAuthPerfectMatchQuery, usePerfectMatchQuery } from 'src/redux/splitEndpoints/perfectmatchSplit';
import CSIHypoMatingStallion from './CSIHypomatingStallion';
import CSIHypoMatingMare from './CSIHypomatingMare';
import useAuth from 'src/hooks/useAuth';
import FullScreenDialog from './fullscreenDialog/FullScreenWrapperDialog';
import Imgix from 'react-imgix';

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
};

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
  hypomatingMatchResult: string;
  setHypomatingMatchResult: React.Dispatch<React.SetStateAction<any>>;
  hypomatingResult: string;
  setHypomatingResult: React.Dispatch<React.SetStateAction<any>>,
};

interface Farm {
  farmId: string;
  farmName: string;
  mediaUrl: any;
  isPromoted: number;
}

function CSIHypoMatingPedigree({
  stallionId,
  isStallionParam,
  mareId,
  isMareParam,
  farmImg,
  horseNameProp,
  hypomatingMatchResult,
  setHypomatingMatchResult,
  hypomatingResult,
  setHypomatingResult
}: Props) {

  // Geo country call, if geoCountryName is not available in local storage
  const geoCountry = localStorage.getItem('geoCountryName');

  React.useEffect(() => {
    if(geoCountry === null) {
      navigator?.geolocation?.getCurrentPosition(
        function(position) {            
            var Geonames = require('geonames.js');
            const geonames = new Geonames({
              username: 'cvlsm',
              lan: 'en',
              encoding: 'JSON'
            });
            let gmtOffset: any;
            let lng: any;
            let lat: any;
            geonames.timezone({ lng, lat }).then((res:any) => {
              gmtOffset = res.gmtOffset;
              lat=position.coords.latitude
              lng=position.coords.longitude
              return geonames.findNearby({ lng, lat });
            }).then((loc: any) => {              
              localStorage.setItem('geoCountryName', loc.geonames[0].countryName);
            }).catch(function(err: any) {
              return err.message;
            });
        },
        function(error) {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    }    
  }, [geoCountry])

  const isPerfectOrT20Param = isStallionParam && isMareParam ? true : false;
  const overlapId = getQueryParameterByName('swHorseId') || '';
  const isOverlapIdParam = overlapId === '' ? false : true;
  const perfectOrT20Params = { stallionId: stallionId, mareId: mareId, generation: 6 };
  const { authentication } = useAuth();
  // Not logged in API call
  const {
    data: authGuesthypomatingData,
    isLoading: isLoadingAuthGuestHypomating,
    isSuccess: isSuccessAuthGuestHypomating,
    isFetching: isFetchingAuthGuestHypomating
  } = usePerfectMatchQuery(perfectOrT20Params,{skip: authentication});

  // Logged in API call
  const {
    data: authHypomatingData,
    isLoading: isLoadingAuthHypomating,
    isSuccess: isSuccessAuthHypomating,
    isFetching: isFetchingAuthHypomating
  } = useAuthPerfectMatchQuery(perfectOrT20Params, {skip: !authentication});
  
  const hypomatingData = authentication ? authHypomatingData : authGuesthypomatingData;
  const isLoadingHypomating = authentication ? isLoadingAuthHypomating : isLoadingAuthGuestHypomating;
  const isSuccessHypomating = authentication ? isSuccessAuthHypomating : isSuccessAuthGuestHypomating;
  const isFetchingHypomating = authentication ? isFetchingAuthHypomating : isFetchingAuthGuestHypomating;
  const matchResult = hypomatingData?.MatchResult;
  
  // Farm Logo API call
  // const { data: farmLogosData, isLoading: isFarmLogoLoading, isSuccess: isFarmLogoSuccess } = useGetFarmLogosByStallionIdQuery(perfectOrT20Params, { skip: (!isStallionParam) });
  // const farmsLogo: Farm[] =  farmLogosData
  // const stallionFarmCount = farmLogosData?.length;
  const [generationsArray, setGenerationsArray] = React.useState<PedigreeProps[][]>([]);
  
  const [mareGenerationsArray, setMareGenerationsArray] = React.useState<PedigreeProps[][]>([]);
  let horseId = '';
  let horseName = '';
  let yob = 0;
  let cob = '';
  let profilePic = '';
  let horsePedigreeData = {};
  let horseMarePedigreeData = {};
  let maxGenerationLevel = 0;
  const [csiStallion, setCsiStallion] = React.useState(false);
  const [csiMare, setCsiMare] = React.useState(false); 
  const [hypomatingStallionHorsePic, setHypomatingStallionHorsePic] = React.useState("");
  const [hypomatingMareHorsePic, setHypomatingMareHorsePic] = React.useState("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isSuccessHypomating) {
      setHypomatingMatchResult(matchResult);
      setHypomatingResult(hypomatingData);
    }
  }, [isFetchingHypomating]); 
  React.useEffect(() => {
    if (isSuccessHypomating) {      
      profilePic = hypomatingData?.stallionProfileImageData?.profilePic ? hypomatingData?.stallionProfileImageData?.profilePic : Images.HorseProfile;
      maxGenerationLevel = hypomatingData?.Stallion?.pedigreeTreeLevel;
      setCsiStallion(true);
      setGenerationsArray(hypomatingData?.Stallion?.pedigree);
      setHypomatingStallionHorsePic(profilePic);
    }
  }, [isFetchingHypomating || hypomatingData]);

  React.useEffect(() => {
    if (isSuccessHypomating) {
      profilePic =hypomatingData?.Mare?.horseProfileImageData?.profilePic ? hypomatingData?.Mare?.horseProfileImageData?.profilePic : Images.HorseProfile;
      maxGenerationLevel = hypomatingData?.Mare?.pedigreeTreeLevel;
      setCsiMare(true);
      setMareGenerationsArray(hypomatingData?.Mare?.pedigree);
      setHypomatingMareHorsePic(profilePic);
    }
  }, [isFetchingHypomating || hypomatingData]);

  const [openLegendModal, setOpenLegendModal] = React.useState(false);
  const [openPedigreeModal, setOpenPedigreeModal] = React.useState(false);

  // Open Legend popup
  const handleLegend = () => {
    setOpenLegendModal(true);
  };
  const [hId, setHId] = React.useState('');
  
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

  function removeDuplicates(arr: any) {
    return arr.filter((item: any, index: number) => arr.indexOf(item) === index);
  }

  // Open full screen page
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close full screen page
  const handleClose = () => {
    setOpen(false);
  };

  let allIndexArray = removeDuplicates(pedigreeLevelCntr);
  let highestPedigreeLevel = Math.max(...allIndexArray);
  highestPedigreeLevel = highestPedigreeLevel - 1;

  // API is calling at this moment, then display a spinner 
  if (isFetchingHypomating) {
    return <Spinner />;
  }

  return (
    <>
      <StyledEngineProvider injectFirst>
      <FullScreenDialog className={`fullscreen ${open ? 'fullscreen-enabled' : ''}`} open={open} setOpen={setOpen}>
        <Box
            className={
              csiStallion
                ? 'common-search-hypomate Search-Stallion-HypoMate'
                : 'common-search-hypomate Search-Mare-HypoMate'
            }
          >
            <Box
              className={
                'SPtreechat PredegreeWrapperBox StallionPedigree ' +
                (isMareParam ? 'pedegree-overlap-lft-colmn' : '')
              }
              py={3}
            >
              <Box sx={{ flexGrow: 1, width: '100%', margin: '0 auto' }} className="SPtreechatBody">
                <Stack direction="row">
                {/* Render the farm logos*/}  
                {isStallionParam && <Box flexGrow={1} className='pedegreeLogo'> 
                  <Box key={hypomatingData?.stallionFarmLogo?.farmName} className='pedegreeLogoImg'>
                    {(hypomatingData?.stallionFarmLogo?.farmLogo === null) ?
                      <img key={hypomatingData?.stallionFarmLogo?.farmName} src={`${Images.farmplaceholder}?w=120&h=80&fit=crop&ar=3:2`} alt={hypomatingData?.stallionFarmLogo?.farmName} />
                    :
                    <Imgix
                      src={hypomatingData?.stallionFarmLogo?.farmLogo?.toString()}
                      imgixParams={{w:120,h:80,ar:'3:2',fit:'crop'}}
                      htmlAttributes={{ alt: hypomatingData?.stallionFarmLogo?.farmName+' Logo' }}
                    />}
                  </Box>                        
                  </Box>
                }
                  {/* Render the Full Screen and Legend label */}
                  {isStallionParam && !isOverlapIdParam && !open ? (
                    <Box>
                      <CustomButton className="ListBtn fullscreenBtn" onClick={handleClickOpen}>
                        <i className="icon-Arrows-expand" /> Full Screen
                      </CustomButton>
                      <CustomButton
                        className="ListBtn legendBtn"
                        sx={{ ml: '1rem' }}
                        onClick={handleLegend}
                      >
                        <i className="icon-Info-circle" /> Legend
                      </CustomButton>
                    </Box>
                  ) : (
                    <CustomButton className="ListBtn fullscreenBtn" onClick={handleClose}>
                      <img
                        src={Images.collapseicon}
                        alt="close"
                        className='collapse-icon'
                        onClick={handleClose}
                      />{' '}
                      Exit Full Screen
                    </CustomButton>
                  )}
                </Stack>
                {/* Render the CSIHypoMatingStallion component */}
                {isSuccessHypomating && (
                  <CSIHypoMatingStallion
                    horseId={hypomatingData?.Stallion?.pedigree[0][0].horseId}
                    horseName={hypomatingData?.Stallion?.pedigree[0][0].horseName}
                    profilePic= {hypomatingStallionHorsePic}
                    horsePedigreeData={hypomatingData?.Stallion?.pedigree}
                    maxGenerationLevel={hypomatingData?.Stallion?.pedigreeTreeLevel}
                    highestPedigreeLevel={highestPedigreeLevel}
                    counts={counts}
                    generationsArray={generationsArray}
                    stallionFarmCount={1}
                  />
                )}                
              </Box>
            </Box>
          </Box>

          <Box
            className={
              csiMare
                ? 'common-search-hypomate Search-Mare-HypoMate'
                : 'common-search-hypomate Search-Stallion-HypoMate'
            }
          >
            <Box
              className={
                'SPtreechat PredegreeWrapperBox StallionPedigree ' +
                (isMareParam ? 'pedegree-overlap-lft-colmn' : '')
              }
              py={3}
            >
              <Box sx={{ flexGrow: 1, width: '100%', margin: '0 auto' }} className="SPtreechatBody">
                {/* Render the CSIHypoMatingMare component */}
                {isSuccessHypomating && (
                  <CSIHypoMatingMare
                    horseId={hypomatingData?.Mare?.pedigree[0][0].horseId}
                    horseName={hypomatingData?.Mare?.pedigree[0][0].horseName}
                    profilePic= {hypomatingMareHorsePic}
                    horsePedigreeData={hypomatingData?.Mare?.horsePedigrees}
                    maxGenerationLevel={hypomatingData?.Mare?.pedigreeTreeLevel}
                    highestPedigreeLevel={highestPedigreeLevel}
                    counts={counts}
                    generationsArray={mareGenerationsArray}
                  />
                )}
              </Box>
            </Box>
          </Box>        
        </FullScreenDialog>
        {/* Popup modal for pedigree modal */}         
        <WrapperDialog
          dialogClassName={'dialogPopup pedegreeModal'}
          open={openPedigreeModal}
          title={''}
          onClose={() => setOpenPedigreeModal(false)}
          body={PedigreeModal}
          parameter={hId}
        />
        {/* Popup modal for legend modal */}   
        <WrapperDialog
          open={openLegendModal}
          title={'Legend'}
          onClose={() => setOpenLegendModal(false)}
          body={LegendModal}
        />
      </StyledEngineProvider>
    </>
  );
}

export default CSIHypoMatingPedigree;