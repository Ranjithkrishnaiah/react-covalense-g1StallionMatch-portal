import { Box } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import './CountryState.css';
import { useGetAllFarmLocationsQuery } from 'src/redux/splitEndpoints/getAllFarmLocationsSplit';
import { useGetAllStallionLocationsQuery } from 'src/redux/splitEndpoints/getAllStallionLocationsSplit';
import useQuery from 'src/hooks/useQuery';
import { useLocation } from 'react-router-dom';

interface State {
  countryId: number;
  stateId: number;
  label: string;
  expanded: boolean;
}

interface Country {
  countryId: number;
  label: string;
  countryCode: string;
  countryA2Code: string;
  children: State[];
}

function CustomCountryStateDropdown(props: any) {
  const { pathname } = useLocation();
  let location: any = props?.location;
  const isStallionPage = props?.isStallionPage;
  const [countryList, setCountryList] = useState<any>();
  const [hasSelectedList, setHasSelectedList] = useState<boolean>(false)
  const [locationList, setLocationList] = useState<boolean>(false)
  const stallionStateList = useGetAllStallionLocationsQuery({ skip: !isStallionPage });
  const farmStateList = useGetAllFarmLocationsQuery({ skip: isStallionPage });
  const stateList = (!isStallionPage) ? farmStateList : stallionStateList;
  const [sortByLocal, setSortByLocal] = useState<any>(null);
  const [sortByLocation, setSortByLocation] = useState<any>(null);
  const [sortByState, setSortByState] = useState<any>(null);

  const treeDropdownRef = useRef<any>();
  const locations: any = location && location.split("|") || [];
  const hasLocation: boolean = locations?.length ? true : false;

  const query = useQuery();

  // console.log(props, 'PROPSs')

  React.useEffect(() => {
    if (props.clear) {
      treeDropdownRef.current.searchInput.setAttribute("placeholder", hasLocation ? '' : 'Location');
      treeDropdownRef.current.searchInput.setAttribute("class", "search");
    }
    !hasLocation ? treeDropdownRef.current.searchInput.setAttribute('style', 'display:block') : treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
  }, [locationList])

  React.useEffect(() => {
    treeDropdownRef.current.searchInput.setAttribute("placeholder", "Location");
    treeDropdownRef.current.searchInput.setAttribute("class", "search");
    treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
  }, [!hasLocation])

  useEffect(() => {
    const isStallionDirectoryPage = pathname.includes('/stallion-directory');
    const isFarmDirectoryPage = pathname.includes('/farm-directory');
    let filteredData = (isStallionDirectoryPage) ? (window.localStorage.getItem('storedFiltered')) : (isFarmDirectoryPage) ? (window.localStorage.getItem('storedFarmFiltered')) : null
    let value: any = filteredData || null;
    // console.log('locations>>>', locations, 'hasLocations>>>', hasLocation, 'filteredData>>>', filteredData);
    if (value) {
      const reLast = /_\d+$/;
      const reFirst = /(\d+)_/;

      let localValue = JSON.parse(value);
      let LocationArray = localValue?.location.split('|');
      props.setLocation(localValue?.location);
      // Check if only country is checked before
      const segments: string[] = localValue?.location.split('|');
      const extractedValues: number[] = segments
        .map(segment => segment.split('_'))
        .filter(parts => parts[1] === '0')
        .map(parts => parseInt(parts[0], 10));

      // Check if specific state only is checked before  
      const extractedStateValues: number[] = segments
        .map(segment => segment.split('_'))
        .filter(parts => parts[1] !== '0')
        .map(parts => parseInt(parts[1], 10));

      // console.log('extractedValues>>>', extractedValues, 'extractedStateValues>>>', extractedStateValues);

      let filteredArray = LocationArray.map((v: any) => Number(v.replace(reLast, '')));
      let filteredStateArray = LocationArray.map((v: any) => Number(v.replace(reFirst, '')));
      setSortByLocal(extractedValues);
      setSortByLocation(localValue);
      setSortByState(extractedStateValues);
      setTimeout(() => {
        if (document?.getElementById("country-state-selector_trigger")) {
          document?.getElementById("country-state-selector_trigger")?.getElementsByTagName("input")[0]?.setAttribute('placeholder', '');
        }
      }, 1000);
    }

  }, [])



  useEffect(() => {

    let countrydata: any = [];

    stateList?.data?.map((record: any, key: number) => {

      const children = record.children?.map((child: any) => ({
        ...child,
        checked: sortByState ? sortByState?.includes(child.stateId) ? true : sortByLocal ? sortByLocal?.includes(child.countryId) ? true : false : false : false,
      }));

      countrydata.push({
        countryId: record.countryId,
        label: record.label,
        countryCode: record.countryCode,
        checked: Number(query.get('location')) === record.countryId ? true : sortByLocal ? sortByLocal?.includes(record.countryId) ? true : false : false,
        children: sortByState ? children : record?.children,
      });
    });
    // treeDropdownRef.current.searchInput.setAttribute("placeholder", '');
    setCountryList(countrydata);

    if (query.get('location') || sortByLocal?.length) {
      props.setLocation(query.get('location') + '_0');
      if (sortByLocal?.length) {
        props.setLocation(sortByLocation?.location);
      }
      props.setPage(1);
      props.query.refetch();
      if (query.get('location') || sortByLocal?.length) {
        props.filterCounterhook.reset();
        props.filterCounterhook.increment();
      }
    }
    setTimeout(() => {
      if (query.get('location') || sortByLocal?.length) {
        setHasSelectedList(true);
        treeDropdownRef.current.searchInput.setAttribute("placeholder", query.get('location') ? '' : 'Location');
        treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
      } else {
        treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
        treeDropdownRef.current.searchInput.setAttribute("placeholder", query.get('location') ? '' : 'Location');
        if (props.filterCounterhook.value > 0) {
          props.filterCounterhook.decrement();
        }
      }
    }, 250);

  }, [stateList?.data, query, sortByLocal]);

  useEffect(() => {
    let countrydata: any = [];
    const isStallionDirectoryPage = localStorage.getItem('comeFromDirectory');

    // console.log((JSON.parse(isStallionDirectoryPage || '') === false) || (JSON.parse(isComeFromFarmDirectory || '') === false),'isStallionDirectoryPage123 clear')
    if (window.location.pathname === "/stallion-directory") {
      // setTimeout(() => {
      if ((JSON.parse(isStallionDirectoryPage || '{}') === false)) {
        stateList?.data?.map((record: any, key: number) => {

          countrydata.push({
            countryId: record.countryId,
            label: record.label,
            countryCode: record.countryCode,
            checked: false,
            children: record?.children,
          });
        });

        setCountryList(countrydata);
        treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
        treeDropdownRef.current.searchInput.setAttribute("placeholder", query.get('location') ? '' : 'Location');
        if (props.filterCounterhook.value > 0) {
          props.filterCounterhook.decrement();
        }
      }
      // }, 100);
    }
  }, [props.clear])

  useEffect(() => {
    let countrydata: any = [];
    const isComeFromFarmDirectory = localStorage.getItem('comeFromFarmDirectory');
    // console.log((JSON.parse(isStallionDirectoryPage || '') === false) || (JSON.parse(isComeFromFarmDirectory || '') === false),'isStallionDirectoryPage123 clear')
    if (window.location.pathname === "/farm-directory") {
      setTimeout(() => {
        if ((JSON.parse(isComeFromFarmDirectory || '') === false)) {
          stateList?.data?.map((record: any, key: number) => {

            countrydata.push({
              countryId: record.countryId,
              label: record.label,
              countryCode: record.countryCode,
              checked: false,
              children: record?.children,
            });
          });

          setCountryList(countrydata);
          treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
          treeDropdownRef.current.searchInput.setAttribute("placeholder", query.get('location') ? '' : 'Location');
          if (props.filterCounterhook.value > 0) {
            props.filterCounterhook.decrement();
          }
        }
      }, 1);
    }
  }, [props.clear])

  const onFocus = async () => {
    treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
  }

  const onChange = async (currentNode: any, selectedNodes: any) => {
    const selectedLocation = await selectedNodes.map((res: any) =>
      res.stateId ? `${res.countryId}_${res.stateId}` : `${res.countryId}_0`

    );
    // console.log('selectedNodes>>>', selectedLocation.join('|'))
    setLocationList(selectedNodes.length);
    props.setLocation(selectedLocation.join('|'));
    props.setPage(1);
    props.query.refetch();
    if (selectedLocation?.length === 1) {
      props.filterCounterhook.increment();
    }
    if (selectedLocation.length > 0) {
      setHasSelectedList(true);
      treeDropdownRef.current.searchInput.setAttribute("placeholder", selectedNodes.length > 0 ? '' : 'Location');
      treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
    } else {
      treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
      treeDropdownRef.current.searchInput.setAttribute("placeholder", selectedNodes.length > 0 ? '' : 'Location');
      if (props.filterCounterhook.value > 0) {
        props.filterCounterhook.decrement();
      }
    }
  };

  useEffect(() => {
    if (location === '' || undefined) {
      let data: any = [];
      countryList?.map((record: any) => {
        data.push({
          countryId: record.countryId,
          label: record.label,
          countryCode: record.countryCode,
          checked: false,
          children: record.children,
        });
        setCountryList(data);
      });
    }
  }, [location]);

  useEffect(() => {
    if (hasLocation) {
      // @ts-ignore
      setTimeout(() => {
        if (document.getElementById("rdts1_trigger")) {
          document.getElementById("rdts1_trigger")?.getElementsByTagName("input")[0].setAttribute('placeholder', '');
        }
      }, 500);
    }
  }, [hasLocation])

  const searchPredicate = (node: any, searchTerm: any) => {

    return node.label && node.label.toLowerCase().startsWith(searchTerm)

  }


  const DropDownTreeSelect = useMemo(() => {
    return (
      <DropdownTreeSelect
        data={countryList || []}
        className={'mdl-demo ' + (hasLocation ? ' search-hidden' : '')}
        onChange={onChange}
        onFocus={onFocus}
        texts={{ placeholder: 'Location' }}
        ref={treeDropdownRef}
        searchPredicate={searchPredicate}
        id={'country-state-selector'}
      />
    );
  }, [countryList]);

  return <Box className="SDmultiselect CountrySDmultiselect">{DropDownTreeSelect}</Box>;
}

export default CustomCountryStateDropdown;
