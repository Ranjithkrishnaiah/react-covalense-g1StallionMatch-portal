import React, { useState, useRef, useEffect } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CustomButton } from 'src/components/CustomButton';
import {
  InputLabel,
  StyledEngineProvider,
  Button,
  Checkbox,
  Autocomplete,
  TextField,
  Stack,
} from '@mui/material';
import { Images } from 'src/assets/images';
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import { VoidFunctionType } from '../@types/typeUtils';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { toPascalCase } from 'src/utils/customFunctions';
import CreateAStallion from 'src/forms/CreateAStallion';
import FavouriteStallionList from 'src/components/FavouriteStallionList';
// Redux services

import './LRpopup.css';
import {
  useAddFavouriteMareMutation,
} from 'src/redux/splitEndpoints/favMaresSplit';
import {
  useAddFavouriteStallionMutation,
  useFavouriteStallionsQuery,
} from 'src/redux/splitEndpoints/favStallionsSplit';
import { useAutosearchStallionNamesQuery } from 'src/redux/splitEndpoints/searchStallionNamesSplit';
import { useSearchMareNamesQuery } from 'src/redux/splitEndpoints/searchMareNamesSplit';
import { getQueryParameterByName } from 'src/utils/customFunctions';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import useAuth from 'src/hooks/useAuth';
import { useAddToMyMaresMutation } from 'src/redux/splitEndpoints/addToMyMaresSplit';
import { useGetMaresTableQuery } from 'src/redux/splitEndpoints/getMyMaresTableSplit';

type ListSchema = {
  id: string;
};

type Option = {
  id: string;
  name: string;
};

export const initialState: State = {
  page: 1,
  order: 'ASC',
  limit: 4,
};

type State = {
  page: number;
  order: any;
  limit: number;
};

function SelectStallion(onClose: VoidFunctionType, param: string, Reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>) {
  //, param1: string, param2: string
  const close = onClose;
  let paramType: any = param;
  const [page, setPage] = React.useState(1);
  const [order, setOrder] = React.useState('ASC');
  const [limit, setLimit] = React.useState(4);
  const [isShowMore, setIsShowMore] = React.useState(false);
  const [isFavourite, setIsFavourite] = React.useState(false);
  const [addToFavouriteStallion] = useAddFavouriteStallionMutation();
  const [addToFavouriteMare] = useAddFavouriteMareMutation();
  const { authentication } = useAuth();
  const [showNewState, setShowNewState] = React.useState<any>({});
  let newState = {
    ...initialState,
    page: page,
  };
  
  const showMore = () => {
    setLimit(limit + 4);
    setIsShowMore(true);  
    setShowNewState(
      {
      ...initialState,
      page: page,
      limit: limit + 4}
      )  
  };
  
  //const [isStallion, setIsStallion] = React.useState(false);
  //const [isMare, setIsMare] = React.useState(false);

  //add to mare api added and commented fav api
  const [ addToMares ] = useAddToMyMaresMutation();
 

  const isStallion = param === 'Stallion' ? true : false;
  const isMare = param === 'Mare' ? true : false;
  //Query
  const responseFavStallions = useFavouriteStallionsQuery(isShowMore ? showNewState : newState, {
    skip: !isStallion || !authentication,
  });
  // const responseFavMares = useFavouriteMaresQuery(isShowMore ? showNewState : newState, {
  //   skip: !isMare || !authentication,
  // });

  const responseMyMares = useGetMaresTableQuery(isShowMore ? showNewState : newState, {
    skip: !isMare || !authentication
  });

  const response = isStallion ? responseFavStallions : responseMyMares;
  let favList = response?.data?.data ? response?.data?.data : [];
  let favStallionMeta = response?.data?.meta ? response?.data?.meta : [];
  
  const hasNextPage = response?.data?.meta?.hasNextPage;
  
  //Mutation
  const searchedFieldName =
    param == 'Mare' ? ValidationConstants.mareRequired : ValidationConstants.stallionName;
  const loginSchema = Yup.object().shape({
    id: Yup.string().required(searchedFieldName),
  });

  const methods = useForm<ListSchema>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const SubmitName = async (id: ListSchema) => {
    try {
      // console.log('param', param);
      //  if (param === 'Mare') await addToMares(id);
      //  if (param === 'Stallion') await useAddFavouriteStallionMutation({"stallionId": id});
    } catch (error) {
      console.error(error);
    }
  };
  const submitNewMare = () => {
    // console.log('Clicked new mare');
  };
  let options = ''; //mares || stallions || damsires || farms;

  const [horseId, setHorseId] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [isDisabledAddFavourite, setDisabledAddFavourite] = useState(true);
  const isDisabled = () => (horseId === '' ? true : false);
  
  const handleSetId = (value: any, type: any = '') => {
    setHorseId(value);
    setDisabledAddFavourite(type === 'auto' && value ? false : true);
    setIsFavourite(false);
    setIsDisable(false);
  };

  const checkStallion = () => {
    window.localStorage.setItem("stallionIsSearchFromViewDetailsModal", "no");
  }
  const checkMare = () => {
    window.localStorage.setItem("mareIsSearchFromViewDetailsModal", "no");
  }

  const navigate = useNavigate();

  // Once user searched a Stallion or Mare, it generate a search routing and close the search modal   
  const handleSearchUrl = () => {
    const stallionId = getQueryParameterByName('stallionId') || '';
    const mareId = getQueryParameterByName('mareId') || '';
    const isStallionParam = stallionId === '' ? false : true;
    const isMareParam = mareId === '' ? false : true;
    const prevSearchUrl = window.location.search;
    let searchUrl = '';
    (param === 'Stallion') ? checkStallion() : checkMare();
    
    if(isStallionParam && isMareParam) {
      if (isStallionParam && param === 'Stallion') {
        searchUrl = '?stallionId=' + horseId + '&mareId=' + mareId;
      } else if (isMareParam &&  param === 'Mare') {
        searchUrl = '?stallionId=' + stallionId + '&mareId=' + horseId;
      } 
    } else if(isStallionParam && !isMareParam) {
      if(isStallionParam && param === 'Stallion') {
        searchUrl = '?stallionId=' + horseId;
      } else if(isStallionParam && param === 'Mare') {
        searchUrl = '?stallionId=' + stallionId + '&mareId=' + horseId;;
      }
    } else if(!isStallionParam && isMareParam) {
      if(isMareParam && param === 'Mare') {
        searchUrl = '?mareId=' + horseId;
      } else if(isMareParam && param === 'Stallion') {
        searchUrl = '?stallionId=' + horseId + '&mareId=' + mareId;;
      }
    } 
    else {      
      searchUrl = param === 'Stallion' ? '?stallionId=' + horseId : '?mareId=' + horseId;
    }
    navigate('/stallion-search' + searchUrl); 
    onClose();   
  };

  // Search Autocomplete
  const [stallionname, setStallionName] = useState<any>('');
  const [mareName, setMareName] = useState<any>('');
  const [isStallionSearch, setIsStallionSearch] = useState(false);
  const [isMareSearch, setIsMareSearch] = useState(false);
  const [isClearMare, setIsClearMare] = useState(0);
  const [isClearStallion, setIsClearStallion] = useState(0);
  const [isStallionFakeLoading, setIsStallionFakeLoading] = useState(false);
  const [isMareFakeLoading, setIsMareFakeLoading] = useState(false);

  // Once user input some keyword against stallion search modal, handleStallionInput will call
  const handleStallionInput = (e: any) => {
    setIsClearStallion(0);
    if (e.target.value && isClearStallion === 0) {
      debouncedStallionName(e.target.value);
    }
    if (e?.target?.value === "") {
      setIsStallionSearch(false);
      setIsStallionFakeLoading(false);
      setStallionName("");
      setIsClearStallion(1);
    }
  };

  // Once user input some keyword against mare search modal, handleMareInput will call
  const handleMareInput = (e: any) => {
    setIsClearMare(0);
    if (e.target.value && isClearMare === 0) {
      debouncedMareName(e.target.value);
    }
    if (e?.target?.value === "") {
      setIsMareSearch(false);
      setIsMareFakeLoading(false);
      setMareName("");
      setIsClearMare(1);
    }
  };

  // Create payload variable for Stallion Search autocomplete
  const stallionNameData: any = {
    stallionName: stallionname,
  };

  // Create payload variable for Mare Search autocomplete
  const mareNameData: any = {
    mareName: mareName,
  };

  // Once user choose a stallion or mare  from the options, perform favourite list related task, 
  const handleHorseSelect = (selectedOptions: any) => {
    const horseId = param === 'Stallion' ? selectedOptions?.stallionId : selectedOptions.mareId;
    handleSetId(horseId, 'auto');
    param === 'Stallion' ? setIsClearStallion(0) : setIsClearMare(0);
    param === 'Stallion' ? handleStallionOptionsReset(0) : handleMareOptionsReset(0);
  };

  // Stallion autocomplete API call 
  const { data: stallionNamesList, isSuccess, isFetching, refetch, requestId, isLoading } = useAutosearchStallionNamesQuery(stallionNameData, {
    skip: !isStallionSearch,
  });

  // Mare autocomplete API call 
  const { data: mareNamesList, isSuccess: isSuccessMare, isFetching: isFetchingMare, refetch: refetchMare, requestId: requestIdMare, isLoading: isLoadingMare } = useSearchMareNamesQuery(mareNameData, { skip: !isMareSearch });
  
  const stallionNameOptionsList =
    (isStallionSearch && isClearStallion === 0  && !isFetching) ? stallionNamesList : [];
  const mareNameOptionsList = (isMareSearch && isClearMare === 0 && !isFetchingMare) ? mareNamesList : [];
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;

  const [stallionTitle, setStallionTitle] = useState('Submit a new Stallion');
  const [mareTitle, setMareTitle] = useState('Submit a new Mare');
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);

  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
  };

  const [openCreateMareModal, setOpenCreateMareModal] = useState(false);
  const handleOpenCreateMareModal = () => {
    setOpenCreateMareModal(true);
  };
  const handleCloseCreateMareModal = () => {
    setOpenCreateMareModal(false);
  };

  // loaddash debounce Stallion to restrict api call for each character
  const debouncedStallionName = useRef(
    debounce(async (stallionName) => {
      if (stallionName.length >= 3 && isClearStallion === 0) {
        await setStallionName(stallionName);
        await setIsStallionSearch(true);
        refetch();
      }  else if (stallionName?.length === 0 && isClearStallion === 0) {
        setIsStallionSearch(false);
        setIsStallionFakeLoading(false);
        await setStallionName("");
      } else {
        setIsStallionSearch(false);
        setIsStallionFakeLoading(true);
        await setStallionName(stallionName);
      }
    }, 250)
  ).current;

  // loaddash debounce Mare to restrict api call for each character
  const debouncedMareName = useRef(
    debounce(async (mareName) => {
      if (mareName.length >= 3 && isClearMare === 0) {
        await setMareName(mareName);
        await setIsMareSearch(true);
        refetchMare();
      } else if (mareName?.length === 0 && isClearStallion === 0) {
        setIsMareSearch(false);
        setIsMareFakeLoading(false);
        setMareName("");
      } else {
        setIsMareSearch(false);
        setIsMareFakeLoading(true);
        setMareName(mareName);
      }
    }, 250)
  ).current;

  // Mare reset method to remove option list
  const handleMareOptionsReset = (blurVal: number) => {
    setMareName('');
    setIsMareSearch(false);
    setIsClearMare(blurVal);
    setIsMareFakeLoading(false);
  };

  // Stallion reset method to remove option list
  const handleStallionOptionsReset = (blurVal: number, ) => {
    setStallionName('');
    setIsStallionSearch(false);
    setIsClearStallion(blurVal);
    setIsStallionFakeLoading(false);
  };

  // Toast error message
  const notifyError = (error: any) =>
    toast.error(error.data.message, {
      autoClose: 2000,
    });

  // Once user choose any stallion or mare to be added in his/her favourite list   
  const addFavourite = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFavourite(!isFavourite); 
    if (param === 'Stallion' && e.target.checked && e.target.value === 'false') {
      let res: any = await addToFavouriteStallion({ stallionId: horseId }); 
      if (res.error) {
        notifyError(res.error);
      }
    }
    if (param === 'Mare' && e.target.checked  && e.target.value === 'false') {
      // add to fav mare list
      let res: any = await addToMares({ horseId: horseId });
      if (res.error) {
        notifyError(res.error);
      }
    }
    setDisabledAddFavourite(false);
    setIsDisable(false);
  };

  if(Reset){   
    setIsFavourite(false); 
    setReset(false);
    setIsDisable(true);
  }

  useEffect(() => {
    if (isSuccessMare) {
      setIsMareFakeLoading(false);
    }
  }, [isFetchingMare]);

  useEffect(() => {
    if (isSuccess) {
      setIsStallionFakeLoading(false);
    }
  }, [isFetching]);
  
  return (
    <StyledEngineProvider injectFirst>
      {/* If user is logged in and it has favourite list */}
      {isLoggedIn && favList.length > 0 && (
        <Box className="select-favourite-pop-box" mt={4}>
          <InputLabel>Select from Your Favourite {param}s</InputLabel>
          <Box className="select-favourite-pop-inner">
            <List component="nav" aria-label="" className="select-favourite-list">
              {favList.length > 0 &&
                favList.map((fsData: any) => (
                  <FavouriteStallionList
                    key={fsData.stallionId}
                    data={fsData}
                    meta={favStallionMeta}
                    horseType={param}
                    handleSetId={handleSetId}
                    isDisable={isDisable}
                    setIsDisable={setIsDisable}
                  />
                ))}
            </List>

            {hasNextPage && <Box className="show-more-button">
              <CustomButton type="button" className="ShowMore" onClick={showMore}>
                Show more{' '}
              </CustomButton>
            </Box>
            }
          </Box>
        </Box>
      )}
      {/* End of - If user is logged in and it has favourite list */}

      <Box className="search-stallion-pop-box">
        <InputLabel>Search for a new {param}</InputLabel>
        <p className="search-stallion-error">{errors.id?.message}</p>
        {/* Stallion Search Autocomplete */}
        {isStallion && (
          <Box className="search-stallion-pop-box-inner searchPopupBox">
            <Autocomplete
              disablePortal
              popupIcon={<KeyboardArrowDownRoundedIcon />}
              options={stallionNameOptionsList}
              noOptionsText={
                stallionname != '' &&
                isClearStallion === 0 && (
                  <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                    <span className="fw-bold sorry-message">
                    {isFetching || isStallionFakeLoading ? 'Loading...' : `Sorry, we couldn't find any matches for "${stallionname}"`}
                    </span>
                    {!isStallionFakeLoading && <Box className="submit-new-bg">
                      <Button
                        variant="text"
                        className="lr-btn lr-btn-outline"
                        color="primary"
                        type="button"
                        onClick={() => setOpenCreateStallionModal(true)}
                      >
                        Submit a new Stallion
                      </Button>
                    </Box>}
                  </Box>
                )
              }
              onInputChange={handleStallionInput}
              getOptionLabel={(option: any) => `${toPascalCase(option?.stallionName)?.toString()} (${option?.yob}, ${option?.countryCode})`}
              renderOption={(props, option: any) => (
                <li className="searchstallionListBox" {...props}>
                  <Stack className="stallionListBoxHead">
                    {toPascalCase(option.stallionName)} ({option.yob},{' '}
                    <span>{option.countryCode}</span>)<span> - {toPascalCase(option?.farmName)}</span>{' '}
                  </Stack>
                  <Stack className="stallionListBoxpara">
                    <strong>X</strong>
                    <p>
                      {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                      <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                      {option.damYob}, <span>{option.damCountryCode}</span>)
                    </p>
                  </Stack>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} placeholder={`Enter ${param} Name`} />
              )}
              onChange={(e: any, selectedOptions: any) => handleHorseSelect(selectedOptions)}
              onBlur={() => handleStallionOptionsReset(1)}
              className="mareBlockInput"
            />
          </Box>
        )}
        {/* Mare Search Autocomplete */}
        {isMare && (
          <Box className="search-stallion-pop-box-inner searchPopupBox">
            <Autocomplete
              disablePortal
              popupIcon={<KeyboardArrowDownRoundedIcon />}
              options={mareNameOptionsList || []}
              noOptionsText={
                mareName != '' &&
                isClearMare === 0 && (
                  <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                    <span className="fw-bold sorry-message">
                    {isFetchingMare || isMareFakeLoading ? 'Loading...' : `Sorry, we couldn't find any matches for "${mareName}"`}
                    </span>
                    {!isMareFakeLoading && <Box className="submit-new-bg">
                      <Button
                        variant="text"
                        className="lr-btn lr-btn-outline"
                        color="primary"
                        type="button"
                        onClick={() => setOpenCreateStallionModal(true)}
                      >
                        Submit a new Mare
                      </Button>
                    </Box>}
                  </Box>
                )
              }
              onInputChange={handleMareInput}
              getOptionLabel={(option: any) => `${toPascalCase(option?.mareName)?.toString()} (${option?.yob}, ${option?.countryCode})`}
              renderOption={(props, option: any) => (
                <li className="searchstallionListBox" {...props}>
                  <Stack className="stallionListBoxHead">
                    {toPascalCase(option.mareName)} ({option.yob},{' '}
                    <span>{option.countryCode}</span>)
                  </Stack>
                  <Stack className="stallionListBoxpara">
                  <strong>X</strong>
                    <p>
                      {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                      <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                      {option.damYob}, <span>{option.damCountryCode}</span>)
                    </p>
                  </Stack>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} placeholder={`Enter ${param} Name`} />
              )}
              onChange={(e: any, selectedOptions: any) => handleHorseSelect(selectedOptions)}
              onBlur={() => handleMareOptionsReset(1)}
              className="mareBlockInput"
            />
          </Box>
        )}

        {/* Add to favourite checkbox element */}
        {isLoggedIn && (
          <FormControlLabel
            className="add-favourite"
            control={
              <Checkbox
                checkedIcon={<img src={Images.checked} alt="checkbox" />}
                checked={isFavourite}
                onChange={addFavourite}
                value={isFavourite}
                icon={<img src={Images.unchecked} alt="checkbox" />}
                name={`Add to Your Favourite  ${param}`}
                disabled={isDisabledAddFavourite}
              />
            }
            label={`Add to Your Favourite  ${param}`}
          />
        )}
      </Box>
      {isDisable ? (
        <CustomButton type="submit" fullWidth className="lr-btn" disabled>
          {' '}
          Search{' '}
        </CustomButton>
      ) : (
        <CustomButton type="submit" fullWidth className="lr-btn" onClick={handleSearchUrl}>
          {' '}
          Search{' '}
        </CustomButton>
      )}

      {/* Popup modal for add either Stallion or Mare */}
      <WrapperDialog
        open={openCreateStallionModal}
        title={isStallion ? stallionTitle : mareTitle}
        dialogClassName={'dialogPopup showBackIcon'}
        onClose={handleCloseCreateStallion}
        isSubmitStallion={isStallion ? true : false}
        isSubmitMare={isMare ? true : false}
        closeAddMare={''}
        body={CreateAStallion}
        className={'cookieClass'}
        createStallion="createStallion"
        sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
      />
    </StyledEngineProvider>
  );
}

export default SelectStallion;

SelectStallion.propTypes = {
  close: PropTypes.func.isRequired,
};
