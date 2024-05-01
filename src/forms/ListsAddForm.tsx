import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { InputLabel, StyledEngineProvider, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { VoidFunctionType } from "../@types/typeUtils";
import { Autocomplete, Stack, TextField } from '@mui/material'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { toPascalCase } from 'src/utils/customFunctions';
//Queries
import { useSearchMareNamesQuery } from 'src/redux/splitEndpoints/searchMareNamesSplit';
import { useSearchStallionNamesQuery } from 'src/redux/splitEndpoints/searchStallionNamesSplit';
import { useSearchBroodmareSireNamesQuery } from 'src/redux/splitEndpoints/searchDamsiresNameSplit';
import { useSearchFarmNameQuery } from 'src/redux/splitEndpoints/searchFarmNameSplit';
// Mutations
import './LRpopup.css';
import '../pages/stallionSearch/stallionsearch.css'
import '../pages/homePage/home.css'
import { useAddToDamsiresMutation } from 'src/redux/splitEndpoints/addToDamSiresSplit';
import { useAddToFarmsMutation } from 'src/redux/splitEndpoints/addToFavFarmsSplit';
import { useAddToStallionsMutation } from 'src/redux/splitEndpoints/addToFavStallionSplit';
import { useAddToMyMaresMutation } from 'src/redux/splitEndpoints/addToMyMaresSplit';

import CreateAStallion from './CreateAStallion';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { LoadingButton } from '@mui/lab';

type Option = Record<string, any>
function ListsAddForm(onClose: VoidFunctionType, param: string, Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>) {
    const close = onClose;
    let paramType: any = param;
    const [ selection, setSelection ] = React.useState<any>('none');
    const [ label, setLabel ] = React.useState<string>('');
    const [ name, setName ] = React.useState<string>("");
    const [ id, setId ] = React.useState<string>("");
    const [isKeywordEntered, setIsKeywordEntered] = useState(false);
    const [ error, setError ] = useState("");
    const [isClear, setIsClear] = useState(0);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isFakeLoading, setIsFakeLoading] = useState(false);
    //Query
    const { data: mares, isSuccess: isSuccessMare, isFetching: isFetchingMare, refetch: refetchMare, requestId: requestIdMare, isLoading: isLoadingMare } = useSearchMareNamesQuery({order: 'ASC', mareName: label?.length >= 3? label:"" || selection && selection[name]}, { skip: param !== 'Mare' || label?.length < 3 });
    const { data: stallions, isSuccess: isSuccessStallion, isFetching: isFetchingStallion, refetch: refetchStallion, requestId: requestIdStallion, isLoading: isLoadingStallion } = useSearchStallionNamesQuery({order: 'ASC', stallionName: label?.length >= 3? label:"" || selection && selection.name}, { skip: param !== 'Stallion' || label?.length < 3 });
    const { data: damsires, isSuccess: isSuccessSire, isFetching: isFetchingSire, refetch: refetchSire, requestId: requestIdSire, isLoading: isLoadingSire } = useSearchBroodmareSireNamesQuery({order: 'ASC', damSireName: label?.length >= 3? label:"" || selection && selection.name}, {skip: param !== 'Broodmare Sire' || label?.length < 3 })
    const { data: farms, isSuccess: isSuccessFarm, isFetching: isFetchingFarm, refetch: refetchFarm, requestId: requestIdFarm, isLoading: isLoadingFarm } = useSearchFarmNameQuery({order: 'ASC', farmName: label?.length >= 3? label:"" || selection && selection.name}, { skip: paramType !== 'Farm' || label?.length < 3 });
    //Mutation
    const [ addToMares, mareResponse ] = useAddToMyMaresMutation();
    const [ addToFavoriteStallions, stallionResponse ] = useAddToStallionsMutation();
    const [ addToFavoriteDamsires, damsireResponse ] = useAddToDamsiresMutation();
    const [ addToFavoriteFarms, farmResponse ] = useAddToFarmsMutation();

    const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);

    // open add stallion popup
    const handleCloseCreateStallion = () => {
      setOpenCreateStallionModal(false);
    };

    // handler on success or error 
    React.useEffect(() => {
      if(mareResponse.isSuccess || stallionResponse.isSuccess || damsireResponse.isSuccess || farmResponse.isSuccess){
        setError("");
        close();
        setIsFakeLoading(false);
      }
      if(mareResponse.isError || stallionResponse.isError  || damsireResponse.isError  || farmResponse.isError ){
        const error  : any = mareResponse?.error || stallionResponse?.error || damsireResponse?.error 
        || farmResponse?.error;
        setError(error?.data?.response);
        setIsFakeLoading(false);
      }
    },[mareResponse, stallionResponse, damsireResponse, farmResponse])

    // on submit handler
    const SubmitID = async () => {
      setIsSubmitLoading(true);
      try {
        if (param === 'Mare') await addToMares({horseId: selection[id]});
        if (param === 'Stallion') await addToFavoriteStallions({stallionId: selection.id});
        if (param === 'Broodmare Sire') await addToFavoriteDamsires({horseId: selection.id});
        if (param === 'Farm') await addToFavoriteFarms({farmId: selection[id]});
        setIsSubmitLoading(false);
      } catch (error) {
        setIsSubmitLoading(false);
      }
    };
    let isFetchingCustom = false;
    switch (param) {
        case 'Stallion':
          isFetchingCustom = isFetchingStallion;
          break;
        case 'Mare':
          isFetchingCustom = isFetchingMare;
          break;
        case 'Farm':
          isFetchingCustom = isFetchingFarm;
          break;
        case 'Broodmare Sire':
          isFetchingCustom = isFetchingSire;
          break;     
    }
    let options : any[] = 
    ((isKeywordEntered === true && Reset === false && isClear === 0 && !isFetchingCustom)) ? mares || stallions || damsires || farms : [];
    if(param === 'Mare' && name !== 'mareName') {
      setName('mareName');
      setId('mareId');
    }
    else if(param === 'Stallion'&& name !== 'stallionName') {
      setName('stallionName');
      setId('id');
    }
    else if(param === 'Broodmare Sire'&& name !== 'horseName') {
      setName('horseName');
      setId('id');
    }
    else if(param === 'Farm'&& name !== 'farmName') {
      setName('farmName');
      setId('farmId');
    }
    const debouncedLabel = React.useRef(
      debounce(async (name, param) => {
        if (name.length >= 3 && isClear === 0) {
          await setLabel(name);
          await setIsKeywordEntered(true); 
          setError("")
          setReset(false);
          if(param === 'Stallion'){
            refetchStallion();
          } else if(param === 'Mare'){
            refetchMare();
          } else if(param === 'Farm'){
            refetchFarm();
          } else if(param === 'Broodmare Sire'){
            refetchSire();
          }
        } else if (name?.length === 0 && isClear === 0) {
          await setIsKeywordEntered(false);
          setIsFakeLoading(false);
          setLabel("");
        } else {
          await setIsKeywordEntered(true);
          setIsFakeLoading(true);
          setLabel(name);
        } 
      }, 250)
    ).current;
    // onchange handler
    const handleInputChange = (e: any, param: any) => {
      setIsClear(0);
      if (e.target.value && isClear === 0) { 
        debouncedLabel(e?.target?.value, param);        
      } 
      if (e?.target?.value === "") {
        setSelection("none");
        setLabel("");
        setIsFakeLoading(false);
        setName("");
        setIsClear(1);
      }
    }
    // handle option
    const handleOptionSelect = (e: any, option: Option) => {
      setLabel(option?.name);
      setSelection(option);
      handleOptionsReset(0, '');
    }

    // reset on close popup 
    useEffect(() => {
      if (Reset === true) {
        debouncedLabel("", param);
        setError("");
        setSelection("none");
      }
    }, [Reset]); 

    // handle option reset
    const handleOptionsReset = (blurVal: number, name: any) => {
      setLabel("");
      setIsKeywordEntered(false);
      setIsClear(blurVal);
      setIsFakeLoading(false);
    }

    // handle on fetching data
    const handleFetching = () => {
      if(param === 'Stallion'){
        return isFetchingStallion;
      } else if(param === 'Mare'){
        return isFetchingMare;
      } else if(param === 'Farm'){
        return isFetchingFarm;
      } else if(param === 'Broodmare Sire'){
        return isFetchingSire;
      }
      return false;
    }

    React.useEffect(() => {
      if(isSuccessStallion || isSuccessMare || isSuccessSire || isSuccessFarm){
        setIsFakeLoading(false);
      }
    },[isFetchingStallion, isFetchingMare, isFetchingFarm, isFetchingSire])

  return (
    <StyledEngineProvider injectFirst>
      {/* add a form  */}
      <Box className='search-stallion-pop-box'>
          <InputLabel sx={ { marginTop: '5%' } }>Search for a { param }</InputLabel>
          <Box className='search-stallion-pop-box-inner farmAdd-pop-box'>
          <Autocomplete 
            disablePortal
            popupIcon={<KeyboardArrowDownRoundedIcon/>}
            options = {options || []}
            onInputChange={(e: any) => handleInputChange(e, param)}
            noOptionsText={
              isKeywordEntered &&
              label != '' &&
              isClear === 0 && (
                <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                  <span className="fw-bold sorry-message">
                  {(handleFetching() || isFakeLoading ) ? 'Loading...' : `Sorry, we couldn't find any matches for "${label}"`}
                  </span>
                </Box>
              )
            }
            getOptionLabel = {(option: Option) => param === 'Mare'? 
            `${toPascalCase(option.mareName) + ' ' + '(' + option.yob + ',' + option.countryCode + ')'}`.toString() 
            : param === 'Stallion'? `${toPascalCase(option.name) + ' ' + '(' + option.yob + ',' + option.countryCode + ')'}`.toString() 
            : param === 'Broodmare Sire'? `${toPascalCase(option.name) + ' ' + '(' + option.yob + ',' + option.countryCode + ')'}`.toString() 
            : param === 'Farm'? `${toPascalCase(option.farmName)}`.toString() : `${toPascalCase(option.mareName)}`.toString() }
            renderOption={(props, option: any) => (
              param === 'Mare'?
              <li className='searchstallionListBox' {...props}>
                <Stack className='stallionListBoxHead'>{toPascalCase(option.mareName)}{' '}
                  ({option.yob}, <span>{option.countryCode}</span>)
                </Stack>
                <Stack className='stallionListBoxpara'>
                  <strong>X</strong>
                  <p>
                    {toPascalCase(option.sireName)}{' '}
                    (<span>{option.sireCountryCode}</span>, {option.sireYob}),{' '}{toPascalCase(option.damName)}{' '}
                    (<span>{option.damCountryCode}</span>, {option.damYob})
                  </p>
                </Stack>
              </li>:
              param === 'Stallion'?(
                <li className='searchstallionListBox' {...props}>
                <Stack className='stallionListBoxHead'>{toPascalCase(option.name)}{' '}
                  ({option.yob}, <span>{option.countryCode}</span>)<span> - {toPascalCase(option?.stallionFarmName)}</span>
                </Stack>
                <Stack className='stallionListBoxpara'>
                  <strong>X</strong>
                  <p>
                    {toPascalCase(option.sireName)}{' '}
                    (<span>{option.sireCountryCode}</span>, {option.sireYob}),{' '}{toPascalCase(option.damName)}{' '}
                    (<span>{option.damCountryCode}</span>, {option.damYob}) 
                  </p>
                </Stack>
              </li>):
              param === 'Broodmare Sire'?
              (<li className='searchstallionListBox' {...props}>
                <Stack className='stallionListBoxHead'>{toPascalCase(option.name)} ({option.yob}, <span>{option.countryCode}</span>)
                </Stack>
                <Stack className='stallionListBoxpara'>
                  <strong>X</strong>
                  <p>
                    {toPascalCase(option.sireName)}{' '}
                    (<span>{option.sireCountryCode}</span>, {option.sireYob}),{' '}{toPascalCase(option.damName)}{' '}
                    (<span>{option.damCountryCode}</span>, {option.damYob})
                  </p>
                </Stack>
              </li>):
              param === 'Farm'?
              (<li className='searchstallionListBox' {...props} style={{minHeight:'40px'}}>
              <Stack className='stallionListBoxHead'>{toPascalCase(option.farmName)}{' '}
                (<span>{option.countryName}</span>)
              </Stack>
            </li>):
            (<li className='searchstallionListBox' {...props}>
            <Stack className='stallionListBoxHead'>{toPascalCase(option.farmName)}{' '}
              ({option.yob}, <span>{option.countryCode}</span>)
            </Stack>
            <Stack className='stallionListBoxpara'>
              <strong>X</strong>
              <p>
                {toPascalCase(option.sireName)}{' '}
                (<span>{option.sireCountryCode}</span>, {option.sireYob}),{' '}{toPascalCase(option.damName)}{' '}
                (<span>{option.damCountryCode}</span>, {option.damYob})
              </p>
            </Stack>
          </li>)
            )}
            onChange={(e:any, option: any) => handleOptionSelect(e, option)}
            onBlur = {() => handleOptionsReset(1, '')} 
            renderInput={(params) => <TextField {...params} placeholder={`Enter ${ param } Name`} />}
          />
          </Box>
            <p className='error-text'>{error}</p>
          <LoadingButton fullWidth className = "lr-btn" disabled = {selection && !selection[id]} loading={isSubmitLoading} onClick = { SubmitID }> Submit </LoadingButton>
          </Box>
          {param === "Mare" &&
          <Box className='cant-find-box Mare-cantfind'>
              <h4>Can't find what you're looking for?</h4>
              <p>
                  If a horse is not currently listed in our database, you can submit
                  it for review. This process can take upto 24 hours.
              </p>
              <Button variant='outlined' onClick = {() => setOpenCreateStallionModal(true)}>Submit a new Mare</Button>
          </Box>}

        {/* WrapperDialog for Create A Stallion */}
        {openCreateStallionModal && <Box>
          <WrapperDialog
            open={openCreateStallionModal}
            title={'Submit a new Stallion'}
            dialogClassName = { 'dialogPopup showBackIcon' }
            onClose={handleCloseCreateStallion}
            createStallion="createStallion"
            isSubmitStallion={false}
            isSubmitMare={true}
            closeAddMare={onClose}
            body={CreateAStallion}
            className={'cookieClass'}
            sx={ { backgroundColor: '#1D472E', color: '#2EFFB4 !important' } }
          />
        </Box>}
        </StyledEngineProvider>
  )
}

export default ListsAddForm

ListsAddForm.propTypes = {
  close: PropTypes.func.isRequired,

}