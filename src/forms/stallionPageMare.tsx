import * as Yup from 'yup';
import { StallionMare } from 'src/@types/stallionMare';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Images } from '../assets/images';
import {
  Divider,
  IconButton,
  Stack,
  StyledEngineProvider,
  Autocomplete,
  TextField,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import { ROUTES } from '../routes/paths';
import { toPascalCase } from 'src/utils/customFunctions';
import './stallionMare.css';
import { useState, useRef, useEffect } from 'react';
import { useSearchMareNamesQuery } from 'src/redux/splitEndpoints/searchMareNamesSplit';
import { useAutosearchStallionNamesQuery } from 'src/redux/splitEndpoints/searchStallionNamesSplit';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { debounce } from 'lodash';
import { scrollToTop } from 'src/utils/customFunctions';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import CreateAStallion from 'src/forms/CreateAStallion';
import '../pages/homePage/home.css';

function StallionPageMareSearch(props: any) {

  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  const [mareListSelected, setMareListSelected] = useState<any>();
  const [stallionname, setStallionName] = useState<any>('');
  const [mareName, setMareName] = useState<any>('');
  const [isStallionSearch, setIsStallionSearch] = useState(props.horseName ? true : false);
  const [isMareSearch, setIsMareSearch] = useState(false);
  const [isClearMare, setIsClearMare] = useState(0);
  const [isClearStallion, setIsClearStallion] = useState(0);
  const [isStallionFakeLoading, setIsStallionFakeLoading] = useState(false);
  const [isMareFakeLoading, setIsMareFakeLoading] = useState(false);

  // Opon or close create stallion or mare modal
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
  };  

  // Once user inputs in stallion autocomplete, it checks and render the stallion search API
  const handleStallionInput = (e: any) => {
    setIsClearStallion(0);
    if (e?.target?.value && isClearStallion === 0) {
      debouncedStallionName(e?.target?.value);
    } 
    if (e?.target?.value === "") {
      setIsStallionSearch(false);
      setIsStallionFakeLoading(false);
      setStallionName("");
      setIsClearStallion(1);
    }
  };

  // Once user inputs in mare autocomplete, it checks and render the mare search API
  const handleMareInput = (e: any) => {
    setIsClearMare(0);
    if (e?.target?.value && isClearMare === 0) {
      debouncedMareName(e?.target?.value);
    }
    if (e?.target?.value === "") {
      setIsMareSearch(false);
      setIsMareFakeLoading(false);
      setMareName("");
      setIsClearMare(1);
    }
  };

  // assign payload variable for Stallion search 
  const stallionNameData: any = {
    stallionName: stallionname,
  };

  // assign payload variable for Mare search
  const mareNameData: any = {
    mareName: mareName,
  };  
  
  // Debounce mechanism to restrict cuncurrent Stallion search API call
  const debouncedStallionName = useRef(
    debounce(async (typedStallionName) => {
      if (typedStallionName?.length >= 3 && isClearStallion === 0) {
        await setStallionName(typedStallionName);
        await setIsStallionSearch(true);
        refetch();
      } else if (typedStallionName?.length === 0 && isClearStallion === 0) {
        setIsStallionSearch(false);
        setIsStallionFakeLoading(false);
        await setStallionName("");
      } else {
        setIsStallionSearch(false);
        setIsStallionFakeLoading(true);
        await setStallionName(typedStallionName);
      }
    }, 250)
  ).current;

  // Debounce mechanism to restrict cuncurrent Mare search API call
  const debouncedMareName = useRef(
    debounce(async (typedMareName) => {
      if (typedMareName.length >= 3 && isClearMare === 0) {
        await setMareName(typedMareName);
        await setIsMareSearch(true);
        refetchMare();
      } else if (typedMareName?.length === 0 && isClearStallion === 0) {
        setIsMareSearch(false);
        setIsMareFakeLoading(false);
        setMareName("");
      } else {
        setIsMareSearch(false);
        setIsMareFakeLoading(true);
        setMareName(typedMareName);
      }
    }, 250)
  ).current;

  // Stallion search API call
  const {
    data: stallionNamesList,
    isSuccess,
    isFetching,
    refetch,
    requestId,
    isLoading,
  } = useAutosearchStallionNamesQuery(stallionNameData, { skip: !isStallionSearch });

  // Mare search API call
  const {
    data: mareNamesList,
    isSuccess: isSuccessMare,
    isFetching: isFetchingMare,
    refetch: refetchMare,
    requestId: requestIdMare,
    isLoading: isLoadingMare,
  } = useSearchMareNamesQuery(mareNameData, { skip: !isMareSearch });

  // Assign Stallion search response
  let stallionNameOptionsList =
    isStallionSearch && isClearStallion === 0 && !isFetching ? stallionNamesList : [];

  // Assign Mare search response  
  let mareNameOptionsList =
    isMareSearch && isClearMare === 0 && !isFetchingMare ? mareNamesList : [];

  const [stallionListSelected, setStallionListSelected] = useState<any>();
  const [stallionNameSearch, setStallionNameSearch] = useState<any>(false);
  const [selctedHorse, setSelctedHorse] = useState<any>(null);
  const navigate = useNavigate();
  const { DASHBOARD } = ROUTES;
  const stallionMareSchema = Yup.object().shape({
    stallion: Yup.string().notRequired(),
    mare: Yup.string().notRequired(),
  });

  useEffect(() => {
    if (stallionNameOptionsList?.length > 0 && !stallionNameSearch) {
      setStallionListSelected(props);
    }
  }, [stallionNameOptionsList]);

  useEffect(() => {
    if (!isMareSearch) {
      setMareName('');
      setIsMareSearch(false);
      mareNameOptionsList = [];
    }
  }, [isMareSearch]);

  const methods = useForm<StallionMare>({
    resolver: yupResolver(stallionMareSchema),
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Genarate search link and navigate to search page
  const SubmitStallionMare = (data: any) => {
    if (stallionListSelected?.stallionId && mareListSelected?.mareId) {
      navigate(
        `/stallion-search?stallionId=${stallionListSelected?.stallionId}&mareId=${mareListSelected?.mareId}`
      );
    }
    if (stallionListSelected?.stallionId && !mareListSelected?.mareId) {
      navigate(`/stallion-search?stallionId=${stallionListSelected?.stallionId}`);
    }
    if (mareListSelected?.mareId && !stallionListSelected?.stallionId) {
      navigate(`/stallion-search?mareId=${mareListSelected?.mareId}`);
    }
    if (!stallionListSelected?.stallionId && !mareListSelected?.mareId) {
      navigate(`/stallion-search`);
    }
    scrollToTop();
  };

  useEffect(() => {
    if (props) {
      debouncedStallionName(props.horseName);
    }
  }, [props]);

  // Reset mare
  const handleMareOptionsReset = (blurVal: number, selectedOptions: any) => {
    setMareName('');
    setIsMareSearch(false);
    setIsClearMare(blurVal);
    setIsMareFakeLoading(false);
  };

  // Reset Stallion
  const handleStallionOptionsReset = (blurVal: number, selectedOptions: any) => {
    setStallionName('');
    setIsStallionSearch(false);
    setIsClearStallion(blurVal);
    setIsStallionFakeLoading(false);
  };

  // Choose a Mare from the Mare search result
  const handleMareSelect = (selectedOptions: any) => {
    setMareListSelected(selectedOptions);
    handleMareOptionsReset(0, selectedOptions);
  };

  // Choose a Stallion from the Stallion search result
  const handleStallionSelect = (selectedOptions: any) => {
    if (selectedOptions) setSelctedHorse({ stallionName: selectedOptions.stallionName });
    setStallionNameSearch(true);
    setStallionListSelected(selectedOptions);
    handleStallionOptionsReset(0, selectedOptions);
  };

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
    <>
      <StyledEngineProvider injectFirst>
        <form onSubmit={handleSubmit(SubmitStallionMare)} autoComplete="false">
          <Stack className="SMareWrapper">
            <Stack
              direction={{ xs: 'column', sm: 'row', lg: 'row' }}
              className="SMare search-stallion-pop-box-inner"
            >
              {/* Display the Stallion name for stallion page if it is */}
              {props.horseName && props.horseName ? (
                <Autocomplete
                  // freeSolo
                  value={
                    props?.horseName && isStallionSearch && !stallionNameSearch
                      ? { stallionName: props?.horseName }
                      : selctedHorse
                  }
                  disablePortal
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  options={stallionNameOptionsList || []}
                  noOptionsText={
                    stallionname != '' &&
                    isClearStallion === 0 && (
                      <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                        <span className="fw-bold sorry-message">
                        {isFetching || isStallionFakeLoading
                            ? 'Loading...'
                            : `Sorry, we couldn't find any matches for "${stallionname}"`}
                        </span>
                        {!isStallionFakeLoading && <Box className="submit-new-bg">
                          <Button
                            variant="text"
                            className="lr-btn lr-btn-outline home-submit"
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
                  getOptionLabel={(option: any) =>
                    `${toPascalCase(option?.stallionName)?.toString()}`
                  }
                  renderOption={(props, option: any) => (
                    <li
                      className="searchstallionListBox"
                      {...props}
                      key={`${option?.stallionId}${option?.stallionName}`}
                    >
                      <Stack className="stallionListBoxHead">
                        {toPascalCase(option.stallionName)} ({option.yob},{' '}
                        <span>{option.countryCode}</span>) <span> - {toPascalCase(option?.farmName)}</span>
                      </Stack>
                      <Stack className="stallionListBoxpara">
                        <strong>X</strong>
                        <p>
                          {toPascalCase(option.sireName)} (<span>{option.sireCountryCode}</span>){' '}
                          {option.sireYob} - {toPascalCase(option.damName)} (
                          <span>{option.damCountryCode}</span>) {option.damYob}
                        </p>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={`Enter Stallion`} />
                  )}
                  onChange={(e: any, selectedOptions: any) => handleStallionSelect(selectedOptions)}
                  onBlur = {() => handleStallionOptionsReset(1, '')}
                  className="directory-arrow stallionBlockInput"
                  sx={{ justifyContent: 'center', flexGrow: 1, minWidth: '100px' }}
                />
              ) : (
                <Autocomplete
                  // freeSolo
                  disablePortal
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  options={stallionNameOptionsList}
                  noOptionsText={
                    stallionname != '' &&
                    isClearStallion === 0 && (
                      <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                        <span className="fw-bold sorry-message">
                        {isFetching || isStallionFakeLoading
                            ? 'Loading...'
                            : `Sorry, we couldn't find any matches for "${stallionname}"`}
                        </span>
                        {!isStallionFakeLoading && <Box className="submit-new-bg">
                          <Button
                            variant="text"
                            className="lr-btn lr-btn-outline home-submit"
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
                  getOptionLabel={(option: any) =>
                    `${toPascalCase(option?.stallionName)?.toString()}`
                  }
                  renderOption={(props, option: any) => (
                    <li
                      className="searchstallionListBox"
                      {...props}
                      key={`${option?.stallionId}${option?.stallionName}`}
                    >
                      <Stack className="stallionListBoxHead">
                        {toPascalCase(option.stallionName)} ({option.yob},{' '}
                        <span>{option.countryCode}</span>) <span> - {toPascalCase(option?.farmName)}</span>
                      </Stack>
                      <Stack className="stallionListBoxpara">
                        <strong>X</strong>
                        <p>
                          {toPascalCase(option.sireName)} (<span>{option.sireCountryCode}</span>){' '}
                          {option.sireYob} - {toPascalCase(option.damName)} (
                          <span>{option.damCountryCode}</span>) {option.damYob}
                        </p>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={`Enter Stallion`} />
                  )}
                  onChange={(e: any, selectedOptions: any) => handleStallionSelect(selectedOptions)}
                  onBlur={() => handleStallionOptionsReset(1, '')}
                  className="directory-arrow stallionBlockInput"
                  sx={{ justifyContent: 'center', flexGrow: 1, minWidth: '100px' }}
                />
              )}
              <Divider orientation="vertical" variant="middle" flexItem />
              {/* Autocomplete component for Mare */}
              
              <Autocomplete
                // freeSolo
                disablePortal
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                options={mareNameOptionsList || []}
                noOptionsText={
                  mareName != '' &&
                  isClearMare === 0 && (
                    <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                      <span className="fw-bold sorry-message">
                      {isFetchingMare || isMareFakeLoading
                          ? 'Loading...'
                          : `Sorry, we couldn't find any matches for "${mareName}"`}
                      </span>
                      {!isMareFakeLoading && <Box className="submit-new-bg">
                          <Button
                            variant="text"
                            className="lr-btn lr-btn-outline home-submit"
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
                getOptionLabel={(option: any) => `${toPascalCase(option?.mareName)?.toString()}`}
                renderOption={(props, option: any) => (
                  <li
                    className="searchstallionListBox"
                    {...props}
                    key={`${option?.mareId}${option?.mareName}`}
                  >
                    <Stack className="stallionListBoxHead">
                      {toPascalCase(option.mareName)} (<span>{option.countryCode}</span>){' '}
                      {option.yob}
                    </Stack>
                    <Stack className="stallionListBoxpara">
                      <strong>X</strong>
                      <p>
                        {toPascalCase(option.sireName)} (<span>{option.sireCountryCode}</span>){' '}
                        {option.sireYob} - {toPascalCase(option.damName)} (
                        <span>{option.damCountryCode}</span>) {option.damYob}
                      </p>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => <TextField {...params} placeholder={`Enter Mare`} />}
                onChange={(e: any, selectedOptions: any) => handleMareSelect(selectedOptions)}
                onBlur={() => handleMareOptionsReset(1, '')}
                className="directory-arrow mareBlockInput"
                sx={{ justifyContent: 'center', flexGrow: 1, minWidth: '100px' }}
              />

              <IconButton type="submit" className="SearchBtnST">
                <img src={Images.Homesearch} alt="Search" />
              </IconButton>
            </Stack>
          </Stack>
        </form>
        {/* Popup modal for add either Stallion or Mare */}
        <WrapperDialog
          open={openCreateStallionModal}
          title={isStallionSearch ? 'Submit a new Stallion' : 'Submit a new Mare'}
          dialogClassName={'dialogPopup showBackIcon'}
          onClose={handleCloseCreateStallion}
          isSubmitStallion={isStallionSearch ? true : false}
          isSubmitMare={isMareSearch ? true : false}
          closeAddMare={''}
          body={CreateAStallion}
          className={'cookieClass'}
          createStallion="createStallion"
          sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
        />
      </StyledEngineProvider>
    </>
  );
}

export default StallionPageMareSearch;