import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Grid, TextField, Autocomplete, Stack } from '@mui/material';
import { toPascalCase, scrollToTop } from "src/utils/customFunctions";
import useAuth from 'src/hooks/useAuth';
import './trends.css';
import './home.css';
import { debounce } from 'lodash';
import { useRaceHorseAutosearchHorseNamesQuery } from 'src/redux/splitEndpoints/raceHorseSplit';
import { useNavigate } from 'react-router-dom';

function FooterForReg(props:any) {  
  const { authentication } = useAuth();
  const navigate = useNavigate();
  const [horseName, setHorseName] = useState<any>('');
  const [isHorseSearch, setIsHorseSearch] = useState(false);
  const [isClearHorse, setIsClearHorse] = useState(0);
  const [horseListSelected, setHorseListSelected] = useState<any>();
  const [isSearchedClicked, setIsSearchedClicked] = useState(false);
//   const close = onClose;
  // assign payload variable for race horse search 
  const horseNameData: any = {
    raceHorseName: horseName,
  };

  // race horse search API call
  const {
    data: footerNameList,
    isSuccess,
    isFetching,
    refetch,
    requestId,
    isLoading,
  } = useRaceHorseAutosearchHorseNamesQuery(horseNameData, { skip: !isHorseSearch });
  
  // Debounce mechanism to restrict cuncurrent race horse search API call
  const debouncedHorseName = useRef(
    debounce(async (typedStallionName) => {
      if (typedStallionName?.length >= 3 && isClearHorse === 0) {
        await setHorseName(typedStallionName);
        await setIsHorseSearch(true);
        refetch();
      } else {
        setIsHorseSearch(false);
      }
    }, 250)
  ).current;
  
  // Once user inputs in race horse autocomplete, it checks and render the race horse search API
  const handleHorseInput = (e: any) => {
    setIsClearHorse(0);
    if (e?.target?.value && isClearHorse === 0) {
      debouncedHorseName(e?.target?.value);
    } 
  };
  
  // Assign race horse search response
  let horseNameOptionsList =
    isHorseSearch && isClearHorse === 0 && !isFetching ? footerNameList : [];
	
	// Reset race horse
  const handleHorseOptionsReset = (blurVal: number, selectedOptions?: any) => {
    setIsHorseSearch(false);
    setIsClearHorse(blurVal);
  };
  
  // Choose a race horse from the race horse search result
  const handleHorseSelect = (selectedOptions: any) => {
    setHorseListSelected(selectedOptions);
    setHorseName(selectedOptions?.name);
    handleHorseOptionsReset(0, selectedOptions);
    setIsSearchedClicked(true);
  };

  const handleNewRaceHorseSearch = () => {
    if(horseListSelected) {
    //   close();
      scrollToTop();
      navigate(`/race-horse/${toPascalCase(horseListSelected?.raceHorseUrl)}/${horseListSelected?.horseId}`);
    }
  }

  return (
    <Box className='trends-signup searchRaceHorse'>
      <Box className='trends-tiles' />
        <Typography variant="h2">
          Have another horse in mind?
        </Typography>
        <Box mt={1}>
          <Grid lg={12} xs={12}>
          <Typography variant='h6'>
            Expand your knowledge by searching a huge database of global racehorses
          </Typography>
          </Grid>
        </Box>
        <Box mt={4} className='trends-btm do-you-stand'>
          <Grid lg={7} sm={8} xs={12}>
            <Box className="searchRHorse">
                <Box className='search-stallion-pop-box-inner'>
              <Autocomplete
                disablePortal
                options={horseNameOptionsList}
                noOptionsText={
                  horseName != '' &&
                  isClearHorse === 0 && (
                    <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                      <span className="fw-bold sorry-message">
                        {isFetching
                          ? 'Loading...'
                          : `Sorry, we couldn't find any matches for "${horseName}"`}
                      </span>                        
                    </Box>
                  )
                }
                onInputChange={handleHorseInput}
                getOptionLabel={(option: any) => `${toPascalCase(option?.horseName)?.toString()} (${option?.yob}, ${option?.countryCode})`}
                renderOption={(props, option: any) => (
                  <li className="searchstallionListBox" {...props}>
                    <Box className="stallionListBoxHead">
                      {toPascalCase(option?.horseName)} ({option?.yob},{' '}
                      <span>{option?.countryCode}</span>){' '}
                    </Box>
                    <Box className="stallionListBoxpara">
                      <strong>X</strong>
                      <p>
                        {toPascalCase(option?.sireName)} ({option?.sireYob},{' '}
                        <span>{option?.sireCountryCode}</span>),{' '}{toPascalCase(option?.damName)} (
                        {option?.damYob}, <span>{option?.damCountryCode}</span>)
                      </p>
                    </Box>
                  </li>
                )}
                onChange={(e: any, selectedOptions: any) => handleHorseSelect(selectedOptions)}
                onBlur={() => handleHorseOptionsReset(1)}
                renderInput={(params) => (
                  <TextField {...params} placeholder={`Search for a horse`} />
                )}                  
                className="directory-arrow stallionBlockInput"
                sx={{ justifyContent: 'center', flexGrow: 1, minWidth: '100px' }}
              />
              </Box>
              {/* <TextField
                fullWidth
                type="text"
                placeholder="Search for a horse"
              /> */}
              <i
                className="icon-Arrow-circle-right"
                style={ { fontSize: '40px' } }
                onClick={handleNewRaceHorseSearch}
                />
            </Box>
          </Grid>
        </Box>
      </Box>
  )
}

export default FooterForReg