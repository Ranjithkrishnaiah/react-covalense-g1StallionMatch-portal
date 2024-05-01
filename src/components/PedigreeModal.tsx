import React, { useState, useEffect } from 'react'
import { StyledEngineProvider, Typography, Avatar , Grid, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { CustomButton } from './CustomButton';
import { VoidFunctionType } from "src/@types/typeUtils";
import { useNavigate } from 'react-router-dom';
import { useAddToStallionsMutation } from 'src/redux/splitEndpoints/addToFavStallionSplit';
import { useAddToMyMaresMutation } from 'src/redux/splitEndpoints/addToMyMaresSplit';
import { useGetHorseInfoQuery } from 'src/redux/splitEndpoints/getHorseDetailsById';
import { useGetStallionDetailsQuery } from 'src/redux/splitEndpoints/getStallionDetailsSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import useAuth from 'src/hooks/useAuth';
import { getQueryParameterByName } from 'src/utils/customFunctions';
import { toast } from 'react-toastify';
import { ROUTES } from 'src/routes/paths';
import { Images } from 'src/assets/images';

function PedigreeModal(
  onClose: VoidFunctionType, 
  parameter: any, 
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>) {
  const {
    DASHBOARD,
    STALLION_MATCH,
    STALLION_SEARCH,
    DIRECTORY,
    TRENDS,
    REPORTS,
    NOTIFICATIONS,
    MESSAGES,
    USERPROFILE,
    FARMPROFILE,
    FARMDASHBOARDPROFILE,
    MYHORSES,
    SHORTLIST,
    CONTACT_US,
  } = ROUTES;

  const { authentication } = useAuth();
  const [stallionDetails, setStallionDetails]  = useState({
    horseId: '',
    horseName: '',
    yob: '',
    sex: '',
    profilePic: '',
    countryCode: '',
    stateName: '',
    currencyCode: '',
    currencySymbol: '',
    farmName: '',
    sireName: '',
    damName: '',
    fee: '',
    feeYear: '',
    isPromoted:0
  });
    
  const isStallionParam = (parameter?.hType === 'stallion') ? true : false;
  const isMareParam = (parameter?.hType === 'mare') ? true : false;
  
  // Mare details api call
  const { data: mareDetails, isSuccess: isMareDetailsSuccess, isFetching: isMareDetailsFetching } = useGetHorseInfoQuery(parameter?.id, { skip: (!isMareParam) });
  
  // Stallion details api call
  const { data: sireDetails, isSuccess: isSireDetailsSuccess, isFetching: isSireDetailsFetching } = useGetStallionDetailsQuery({stallionId:parameter?.id,country:''}, { skip: (!isStallionParam) });
  
  // Populate the set state for Mare
  React.useEffect(() => {
    if (isMareDetailsSuccess) {
      setStallionDetails({
        ...stallionDetails,
        horseId: mareDetails?.horseId,
        horseName: mareDetails?.horseName,
        yob: mareDetails?.yob,
        sex: 'F',
        profilePic: mareDetails?.profilePic,
        countryCode: mareDetails?.countryCode,
        stateName: '',
        currencyCode: '',
        currencySymbol: '',
        farmName: '',
        sireName: mareDetails?.sireName,
        damName: mareDetails?.damName,
        fee: '',
        feeYear: '',
        isPromoted:0
      });
    }
  }, [isMareDetailsFetching, mareDetails]);

  // Populate the set state for Stallion
  React.useEffect(() => {
    if (isSireDetailsSuccess) {
      setStallionDetails({
        ...stallionDetails,
        horseId: sireDetails?.horseId,
        horseName: sireDetails?.horseName,
        yob: sireDetails?.yob,
        sex: 'M',
        profilePic: sireDetails?.profilePic,
        countryCode: sireDetails?.countryCode,
        stateName: sireDetails?.stateName,
        currencyCode: sireDetails?.currencyCode,
        currencySymbol: sireDetails?.currencySymbol,
        farmName: sireDetails?.farmName,
        sireName: sireDetails?.sireName,
        damName: sireDetails?.damName,
        fee: sireDetails?.fee,
        feeYear: sireDetails?.feeYear,
        isPromoted:sireDetails?.isPromoted
      });
    }
  }, [isSireDetailsFetching, sireDetails]);
  
  const navigate = useNavigate();

  // Add to favourite stallion post API call 
  const [ createFavouriteStallion, stallionResponse ] = useAddToStallionsMutation<any>();

  // Add to favourite mare post API call 
  const [ addToMares, mareResponse ] = useAddToMyMaresMutation<any>();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Navigate to profile page
  const sendToProfile = () => {
    navigate(`/race-horse${parameter?.raceHorseUrl}`);
  }; 

  // Add to Favourite stallion or Mare API call if Add to List button is clicked
  const addFavouritStallionOrMare = async() => {
    setIsSubmitLoading(true);
    try {      
      const stallionId = (parameter?.hType === 'stallion') ? parameter?.id : '';
      const mareId = (parameter?.hType === 'mare') ? parameter?.id : '';
      const resposne = (parameter?.hType === 'stallion') ? await createFavouriteStallion({stallionId: stallionId}) : await addToMares({horseId: mareId});
      
      setIsSubmitLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitLoading(false);
    }    
  }

  // Stallion toast success message
  const notifyStallionSuccess = () =>
    toast.success('Stallion successfully added to your Favourite Stallions list.', {
      autoClose: 2000,
  });

  // Mare toast success message
  const notifyMareSuccess = () =>
    toast.success('Mare successfully added to your My Mares list.', {
      autoClose: 2000,
  });

  // Stallion toast error message
  const notifyStallionError = () =>
    toast.error(stallionResponse?.error?.data?.response, {
      autoClose: 2000,
  });

  // Mare toast error message
  const notifyMareError = () =>
    toast.error(mareResponse?.error?.data?.response, {
      autoClose: 2000,
    });

  // Based on post Favourite stallion response, call the toast meassge
  useEffect(() => {
    if (stallionResponse.isSuccess) {
      notifyStallionSuccess()
    }
    else if (stallionResponse.isError) {
      notifyStallionError()
    }
  }, [stallionResponse])
  
  // Based on post Favourite Mare response, call the toast meassge
  useEffect(() => {
    if (mareResponse.isSuccess) {
      notifyMareSuccess();
    }
    else if (mareResponse.isError) {
      notifyMareError()
    }
  }, [mareResponse]);

  // set the local storage for stallionIsSearchFromViewDetailsModal
  const searchStallion = () => {
    window.localStorage.setItem("stallionIsSearchFromViewDetailsModal", "yes");
  }

  // set the local storage for mareIsSearchFromViewDetailsModal
  const searchMare = () => {
    window.localStorage.setItem("mareIsSearchFromViewDetailsModal", "yes");
  }

  // If new search is clicked, populate the route and navigate to corresponding search page
  const handleNewSearch = () => {
    const stallionId = getQueryParameterByName('stallionId') || '';
    const mareId = getQueryParameterByName('mareId') || '';
    const isStallionParam = stallionId === '' ? false : true;
    const isMareParam = mareId === '' ? false : true;    
    let searchUrl = '';
    (parameter?.hType === 'stallion') ? searchStallion() : searchMare();
    if(isStallionParam && isMareParam) {
      if (isStallionParam && (parameter?.hType === 'stallion')) {
        searchUrl = '?stallionId=' + stallionId + '&mareId=' + mareId;
      } else if (isMareParam &&  (parameter?.hType === 'mare')) {
        searchUrl = '?stallionId=' + stallionId + '&mareId=' + mareId;
      } 
      navigate(STALLION_SEARCH + searchUrl);
    } else if(isStallionParam && !isMareParam) {
      searchUrl = '?stallionId=' + stallionId;
      navigate(STALLION_SEARCH + searchUrl);
    } else if(!isStallionParam && isMareParam) {
      searchUrl = '?mareId=' + mareId;
      navigate(STALLION_SEARCH + searchUrl);
    }     
    onClose();        
  }
      
  return (
    <StyledEngineProvider injectFirst> 
         <Box className='pedegree-modal-pop-box' mt={0}>
         <Grid item lg={12} xs={12} className='pedegree-picture-wrapper'>
            <Stack className='pedegree-picture'>
             <Avatar src={stallionDetails?.profilePic ? stallionDetails?.profilePic :Images.HorseProfile} alt={stallionDetails?.horseName} sx={ { width: '96px', height: '96px' } }/>
                <Box mt={1}>
                  <Typography variant='h3'>{toPascalCase(stallionDetails?.horseName)}</Typography>
                  <Typography variant='h6'>{stallionDetails?.yob}</Typography>

                  {(stallionDetails?.sex === "M") && <Typography variant='h5'>
                    {toPascalCase(stallionDetails?.farmName)} {stallionDetails?.stateName}<br />
                    {stallionDetails?.currencyCode?.substring(0, 2)} {stallionDetails?.currencySymbol}{stallionDetails?.fee} ({stallionDetails?.feeYear})
                    </Typography>}
                    {(stallionDetails?.sex === "M") && 
                    <Box className='pedegree-modal-buttn'>
                      <CustomButton type="button" className='lr-btn lr-btn-outline' onClick={addFavouritStallionOrMare} disabled={!authentication} loading={isSubmitLoading}>Add to List</CustomButton>
                      <CustomButton type="button" className='lr-btn lr-btn-outline' onClick={sendToProfile} disabled={(parameter?.isRaceHorse === 1) ? false : true}>View Profile</CustomButton>
                    </Box>
                    }  
                    {(stallionDetails?.sex === "F") && <Typography variant='h5'>
                    {toPascalCase(stallionDetails?.sireName)} X {toPascalCase(stallionDetails?.damName)}
                    </Typography>
                    }                      
                    {(stallionDetails?.sex === "F") && 
                    <Box className='pedegree-modal-buttn'>
                      <CustomButton type="button" className='lr-btn lr-btn-outline' onClick={addFavouritStallionOrMare} disabled={!authentication} loading={isSubmitLoading}>Add to List</CustomButton>
                      <CustomButton type="button" className='lr-btn lr-btn-outline' onClick={sendToProfile} disabled={(parameter?.isRaceHorse === 1) ? false : true}>View Profile</CustomButton>
                    </Box>
                    }
                </Box>
            </Stack>

            <Stack className='pedegree-modal-footer'>
              <CustomButton type="button" className='lr-btn' onClick={handleNewSearch}>{(stallionDetails?.sex === "F") ? 'Search for a New Broodmare' : 'Search for a New Stallion' }</CustomButton>
            </Stack>
        </Grid>
        </Box>
    </StyledEngineProvider>
  )
}

export default PedigreeModal;