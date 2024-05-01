import { debounce } from 'lodash';
import React, { useState, useRef, forwardRef } from 'react';
import CustomAutocomplete from './CustomAutocomplete';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useGetGrandsiresByNameQuery } from 'src/redux/splitEndpoints/getGrandSiresByName';
import { useGetdamsiresByNameQuery } from 'src/redux/splitEndpoints/getDamSiresByName';
import { useGetSiresByNameQuery } from 'src/redux/splitEndpoints/getSireByName';
import { useGetKeyAncestorsQuery } from 'src/redux/splitEndpoints/getStallionByCountrySplit';
import { toPascalCase } from 'src/utils/customFunctions';
import { Box, StyledEngineProvider } from '@mui/material';
import '../pages/stallionDirectory/StallionDirectory.css';
type Option = Record<string, any>;

const PedigreeAutocomplete = forwardRef<any, any>((props, pedigreeRef) => {
  const [selection, setSelection] = React.useState<any>([]);
  const [label, setLabel] = React.useState<string>('');
  const [isKeywordEntered, setIsKeywordEntered] = useState(false);
  const [error, setError] = useState('');
  const [isClearStallion, setIsClearStallion] = useState(0);
  const [isGrandSireSearch, setGrandSireSearch] = useState(false);
  const [isKeyAncestorSearch, setKeyAncestorSearch] = useState(false);
  const [isDamSireSearch, setDamSireSearch] = useState(false);
  const [isSireSearch, setSireSearch] = useState(false);
  const [storedSirePedigreeFiltered, setStoredSirePedigreeFiltered] = useState<any>([]);
  const [storedDamSirePedigreeFiltered, setStoredDamSirePedigreeFiltered] = useState<any>([]);
  const [storedKeyAncestorPedigreeFiltered, setStoredKeyAncestorPedigreeFiltered] = useState<any>([]);

  // Grand sire search api call
  const {
    data: grandSires,
    isSuccess: isGrandSireSuccess,
    isFetching: isGrandSireFetching,
    refetch: refetchGrandSire,
  } = useGetGrandsiresByNameQuery(
    { order: 'ASC', grandSireName: label?.length >= 3 ? label : '' || selection.name },
    { skip: !isGrandSireSearch }
  );

  // Key ancestors search api call
  const {
    data: keyAncestors,
    isSuccess: isKeyAncestorSuccess,
    isFetching: isKeyAncestorFetching,
    refetch: refetchKeyAncestor,
  } = useGetKeyAncestorsQuery(
    { order: 'ASC', sex: 'M', horseName: label?.length >= 3 ? label : '' || selection.name },
    { skip: !isKeyAncestorSearch }
  );

  // Dam sire search api call
  const {
    data: damSires,
    isSuccess: isDamSireSuccess,
    isFetching: isDamSireFetching,
    refetch: refetchDamSire,
  } = useGetdamsiresByNameQuery(
    { order: 'ASC', damSireName: label?.length >= 3 ? label : '' || selection.name },
    { skip: !isDamSireSearch }
  );

  // Sire search api call
  const {
    data: Sires,
    isSuccess: isSireSuccess,
    isFetching: isSireFetching,
    refetch: refetchSire,
  } = useGetSiresByNameQuery(
    { order: 'ASC', sireName: label?.length >= 3 ? label : '' || selection.name },
    { skip: !isSireSearch }
  );

  // Populate the autocomplete search result 
  const options: any =
    (isGrandSireSearch || isKeyAncestorSearch || isDamSireSearch || isSireSearch) &&
      isClearStallion === 0
      ? grandSires || damSires || Sires || keyAncestors
      : [];


  const anyRef: any = pedigreeRef;


  React.useEffect(() => {
    let storedFilteredSire: any = window.localStorage.getItem('storedFilteredSire');
    let storedFilteredDamSire: any = window.localStorage.getItem('storedFilteredDamSire');
    let storedFilteredKeyAncestor: any = window.localStorage.getItem('storedFilteredKeyAncestor');

    let storedFarmFilteredSire: any = window.localStorage.getItem('storedFarmFilteredSire');
    let storedFarmFilteredDamSire: any = window.localStorage.getItem('storedFarmFilteredDamSire');
    let storedFarmFilteredKeyAncestor: any = window.localStorage.getItem('storedFarmFilteredKeyAncestor');

    if (storedFilteredSire?.length) {
      setStoredSirePedigreeFiltered(JSON.parse(storedFilteredSire));
      props.setSire(JSON.parse(storedFilteredSire)?.map((v: any) => v.horseId).join(','));
    }
    if (storedFilteredDamSire?.length) {
      setStoredDamSirePedigreeFiltered(JSON.parse(storedFilteredDamSire));
      props.setdamSire(JSON.parse(storedFilteredDamSire)?.map((v: any) => v.horseId).join(','));
    }
    if (storedFilteredKeyAncestor?.length) {
      setStoredKeyAncestorPedigreeFiltered(JSON.parse(storedFilteredKeyAncestor));
      props.setKeyAncestor(JSON.parse(storedFilteredKeyAncestor)?.map((v: any) => v.horseId).join(','));
    }

    if (storedFarmFilteredSire?.length) {
      setStoredSirePedigreeFiltered(JSON.parse(storedFarmFilteredSire));
      props.setSire(JSON.parse(storedFarmFilteredSire)?.map((v: any) => v.horseId).join(','));
    }
    if (storedFarmFilteredDamSire?.length) {
      setStoredDamSirePedigreeFiltered(JSON.parse(storedFarmFilteredDamSire));
      props.setdamSire(JSON.parse(storedFilteredDamSire)?.map((v: any) => v.horseId).join(','));
    }
    if (storedFarmFilteredKeyAncestor?.length) {
      setStoredKeyAncestorPedigreeFiltered(JSON.parse(storedFarmFilteredKeyAncestor));
      props.setKeyAncestor(JSON.parse(storedFilteredKeyAncestor)?.map((v: any) => v.horseId).join(','));
    }

  }, [])

  // Clear functionality
  React.useEffect(() => {
    if (props.clear && anyRef) {
      anyRef.current.searchInput?.setAttribute('placeholder', props?.placeholder);
      anyRef.current.searchInput?.setAttribute('class', 'search');
      const ele = anyRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
      if (ele) ele.click();
      setTimeout(() => {
        let inputArr: any = anyRef.current.getElementsByTagName('input');
        if (inputArr) {
          inputArr[0].blur();
        }
      }, 500);
      setSelection([]);
      setLabel('');
      setIsClearStallion(1);
      setGrandSireSearch(false);
      setKeyAncestorSearch(false);
      setDamSireSearch(false);
      setSireSearch(false);
      setStoredKeyAncestorPedigreeFiltered(null);
      window.localStorage.setItem('comeFromDirectory', 'false');
      window.localStorage.setItem('storedFilteredSire', '');
      window.localStorage.setItem('storedFilteredDamSire', '');
      window.localStorage.setItem('storedFilteredKeyAncestor', '');
      window.localStorage.setItem('storedFarmFilteredSire', '');
      window.localStorage.setItem('storedFilteredGrandSire', '');
      window.localStorage.setItem('storedFarmFilteredKeyAncestor', '');
    }
  }, [props.clear]);

  // Debounced mechanism to restrict cuncurrent API call on input change
  const debouncedLabel = React.useRef(
    debounce(async (name) => {
      if (name.length >= 3 && isClearStallion === 0) {
        await setLabel(name);
        await setIsKeywordEntered(true);
        setError('');
        if (props?.placeholder === 'Grand Sire') {
          await setGrandSireSearch(true);
          refetchGrandSire();
        } else if (props?.placeholder === 'Key Ancestor') {
          await setKeyAncestorSearch(true);
          refetchKeyAncestor();
        } else if (props?.placeholder === 'Dam Sire') {
          await setDamSireSearch(true);
          refetchDamSire();
        } else if (props?.placeholder === 'Sire') {
          await setSireSearch(true);
          refetchSire();
        }
      } else {
        await setIsKeywordEntered(false);
        if (props?.placeholder === 'Grand Sire') {
          await setGrandSireSearch(false);
          refetchGrandSire();
        } else if (props?.placeholder === 'Key Ancestor') {
          await setKeyAncestorSearch(false);
          refetchKeyAncestor();
        } else if (props?.placeholder === 'Dam Sire') {
          await setDamSireSearch(false);
          refetchDamSire();
        } else if (props?.placeholder === 'Sire') {
          await setSireSearch(false);
          refetchSire();
        }
      }
    }, 1000)
  ).current;

  // On search keyword, check the debounce and hit the respective API call 
  const handleInputChange = (e: any) => {
    setIsClearStallion(0);
    // console.log(typeof (e?.target.value), isClearStallion, 'isClearStallion')
    if (e?.target.value && isClearStallion === 0) {
      debouncedLabel(e?.target?.value);
    }
    if (props?.placeholder === 'Key Ancestor') {
      if (e?.target.value?.length === 0 && isClearStallion === 0) {
        setKeyAncestorSearch(false);
        setStoredKeyAncestorPedigreeFiltered(null);
        window.localStorage.setItem('storedFilteredKeyAncestor', '');
        window.localStorage.setItem('storedFarmFilteredKeyAncestor', '');
        props.setKeyAncestor('');
      }
    }
  };

  // Reset functionality
  const handleAutoCompleteOptionsReset = () => {
    setLabel('');
    setIsClearStallion(0);
    if (props?.placeholder === 'Grand Sire') {
      setGrandSireSearch(false);
    } else if (props?.placeholder === 'Key Ancestor') {
      setKeyAncestorSearch(false);
    } else if (props?.placeholder === 'Dam Sire') {
      setDamSireSearch(false);
    } else if (props?.placeholder === 'Sire') {
      setSireSearch(false);
    }
  };

  // Select any option from the autocomplete response
  const handleOptionSelect = async (e: any, option: Option) => {
    // console.log(option,'callleddd')
    setLabel(option.horseName);
    // setSelection(option);
    const setSelection: any =
      props.placeholder === 'Key Ancestor' ? '' : await option.map((res: any) => res.horseId);
    // console.log(option, 'setSelection')
    if (props.placeholder === 'Sire') {
      props.setSire(setSelection);
      window.localStorage.setItem('storedFilteredSire', option?.length ? JSON.stringify(option) : '');
      setStoredSirePedigreeFiltered(option);
    }
    if (props.placeholder === 'Dam Sire') {
      props.setdamSire(setSelection);
      window.localStorage.setItem('storedFilteredDamSire', option?.length ? JSON.stringify(option) : '');
      setStoredDamSirePedigreeFiltered(option);
    }
    if (props.placeholder === 'Key Ancestor') {
      props.setKeyAncestor(option ? option?.horseId : '');
      window.localStorage.setItem('storedFilteredKeyAncestor', JSON.stringify([option]));
      setStoredKeyAncestorPedigreeFiltered([option]);
    }
    if (props.placeholder === 'Grand Sire') {
      props.setgrandSire(setSelection);
      window.localStorage.setItem('storedFilteredGrandSire', option?.length ? JSON.stringify(option) : '');
    }
    let idWithPlaceholder = `customAutocomplete ${props.placeholder}`;
    if (
      option.length > 0 &&
      document.getElementById(idWithPlaceholder)?.getAttribute('placeholder')?.length
    ) {
      document.getElementById(idWithPlaceholder)?.setAttribute('placeholder', '');
    } else if (
      option.length === 0 &&
      document.getElementById(idWithPlaceholder)?.getAttribute('placeholder')?.length === 0
    ) {
      document.getElementById(idWithPlaceholder)?.setAttribute('placeholder', props.placeholder);
    }
    if (option?.length === 1) {
      props.filterCounterhook.increment();
    }
    if (option?.length === 0) {
      props.filterCounterhook.decrement();
    }

    props.setClear(false);
    props?.setPage(1);
    props.query.refetch();
    setIsClearStallion(0);
  };

  // Display the loader based on respective api call
  const searchKeyForLoader = () => {
    if (props.placeholder === 'Sire') {
      return isSireFetching;
    }
    if (props.placeholder === 'Dam Sire') {
      return isDamSireFetching;
    }
    if (props.placeholder === 'Key Ancestor') {
      return isKeyAncestorFetching;
    }
  };

  // Display the loader based on respective api call
  const displayDefaultValue = () => {
    if (props.placeholder === 'Sire') {
      return storedSirePedigreeFiltered ? storedSirePedigreeFiltered : [];
    }
    if (props.placeholder === 'Dam Sire') {
      return storedDamSirePedigreeFiltered ? storedDamSirePedigreeFiltered : [];
    }
    if (props.placeholder === 'Key Ancestor') {
      return storedKeyAncestorPedigreeFiltered?.length ? storedKeyAncestorPedigreeFiltered[0] : null;
    }
  };

  const showPlaceholder = () => {
    let storedFilteredSire: any = window.localStorage.getItem('storedFilteredSire');
    let storedFilteredDamSire: any = window.localStorage.getItem('storedFilteredDamSire');
    let storedFilteredKeyAncestor: any = window.localStorage.getItem('storedFilteredKeyAncestor');

    let storedFarmFilteredSire: any = window.localStorage.getItem('storedFarmFilteredSire');
    let storedFarmFilteredDamSire: any = window.localStorage.getItem('storedFilteredGrandSire');
    let storedFarmFilteredKeyAncestor: any = window.localStorage.getItem('storedFarmFilteredKeyAncestor');
    // console.log(storedFarmFilteredDamSire,'storedFarmFilteredDamSire')

    if (props.placeholder === 'Sire') {
      return (storedFilteredSire || storedFarmFilteredSire) ? '' : props.placeholder;
    }
    if (props.placeholder === 'Dam Sire' || props.placeholder === "Grand Sire") {
      return (storedFilteredDamSire || storedFarmFilteredDamSire) ? '' : props.placeholder;
    }
    if (props.placeholder === 'Key Ancestor') {
      return (storedFilteredKeyAncestor || storedFarmFilteredKeyAncestor) ? '' : props.placeholder;
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box mb={2} className="pedegree-filter-box">
        <CustomAutocomplete
          className="filterMenu"
          multiple={props.placeholder === 'Key Ancestor' ? false : true}
          popupIcon={
            props.placeholder !== 'Key Ancestor' ? (
              <KeyboardArrowDownRoundedIcon />
            ) : (
              <i className="icon-Info-circle" />
            )
          }
          options={options || []}
          value={displayDefaultValue()}
          // options={(label && label?.length > 3) || options.length > 0 ? options :[]}
          onInputChange={handleInputChange}
          noOptionsText={
            label != '' ? (
              <Box className="d-flex align-items-center justify-content-between">
                <span className="fw-bold sorry-message">
                  {searchKeyForLoader()
                    ? 'Loading...'
                    : label && label?.length < 3
                      ? 'Please Enter minimum 3 words'
                      : `No records found`}
                </span>
              </Box>
            ) : null
          }
          getOptionLabel={(option: any) =>
            props.clear === true ? '' : option && `${toPascalCase(option?.horseName)?.toString()} `
          }
          renderOption={(props: any, option: any) => (
            <li
              className="searchstallionListBox"
              {...props}
              key={`${option?.horseId}${option?.horseName}`}
            >
              {`${toPascalCase(option?.horseName)?.toString()} (${(option?.countryCode === null || option?.countryCode === 0) ? '-' : option?.countryCode}) ${(option?.yob === null || option?.yob === 0) ? '-' : option?.yob} `}
            </li>
          )}
          onChange={(e: any, option: any) => handleOptionSelect(e, option)}
          placeholder={showPlaceholder()}
          onBlur={() => handleAutoCompleteOptionsReset()}
          ref={pedigreeRef}
        />
      </Box>
    </StyledEngineProvider>
  );
});

export default PedigreeAutocomplete;