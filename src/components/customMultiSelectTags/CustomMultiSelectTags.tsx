import { Box } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import './MultiSelectTags.css';
import { useGetYearToStudQuery } from 'src/redux/splitEndpoints/getYearToStudSplit';
import { useGetColoursQuery, useGetDominancyColoursQuery } from 'src/redux/splitEndpoints/getColoursSplit';
import { useGetFarmsInFilterByLocationQuery } from 'src/redux/splitEndpoints/getFarmsInFilterSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import { useLocation } from 'react-router-dom';

function CustomMultiSelectTags(props: any) {
  const { pathname } = useLocation();
  const [locationList, setLocationList] = useState<boolean>(false)
  const { data: farms, isSuccess: isFarmsSuccess, isFetching: isFarmFetching } = useGetFarmsInFilterByLocationQuery(props?.location, { skip: props?.location?.length === 0 });
  const { data: YearToStud, isSuccess: isYearOfStudSuccess, isFetching: isYearOfStudFetching } = useGetYearToStudQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: colours, isSuccess: isColoursSuccess, isFetching: isColoursFetching } = useGetDominancyColoursQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [name, setName] = useState([]);
  const [sortByLocalFarmsList, setSortByLocalFarmsList] = useState<any>(null);
  const [sortByLocalYOSList, setSortByLocalYOSList] = useState<any>(null);
  const [sortByLocalColoursList, setSortByLocalColoursList] = useState<any>(null);
  const treeDropdownRef = useRef<any>();

  React.useEffect(() => {
    if (props.clear) {
      treeDropdownRef.current.searchInput.setAttribute("placeholder", props?.placeholder);
      treeDropdownRef.current.searchInput.setAttribute("class", "search");
    }
    !locationList ? treeDropdownRef.current.searchInput.setAttribute('style', 'display:block') : treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
  }, [props.clear, locationList])


  useEffect(() => {
    const isStallionDirectoryPage = pathname.includes('/stallion-directory');
    const isFarmDirectoryPage = pathname.includes('/farm-directory');
    let filteredData = (isStallionDirectoryPage) ? window.localStorage.getItem('storedFiltered') : (isFarmDirectoryPage) ? (window.localStorage.getItem('storedFarmFiltered')) : null
    let value: any = filteredData || null;
    if (value) {
      let localValue = JSON.parse(value);
      // console.log(localValue,'localValue');
      setSortByLocalFarmsList(localValue?.farms);
      setSortByLocalYOSList((isFarmDirectoryPage) ? localValue?.YearToStud : localValue?.yearToStud);
      setSortByLocalColoursList(localValue?.colour);
      if (localValue?.farms?.length) {
        setTimeout(() => {
          if (document?.getElementById("farm-selector_trigger")) {
            document?.getElementById("farm-selector_trigger")?.getElementsByTagName("input")[0]?.setAttribute('placeholder', '');
          }
        }, 1000);
      }
      if ((isFarmDirectoryPage) ? localValue?.YearToStud?.length : localValue?.yearToStud?.length) {
        setTimeout(() => {
          if (document?.getElementById("yearTostud-selector_trigger")) {
            document?.getElementById("yearTostud-selector_trigger")?.getElementsByTagName("input")[0]?.setAttribute('placeholder', '');
          }
        }, 1000);
      }
      if (localValue?.colour?.length) {
        setTimeout(() => {
          if (document?.getElementById("colour-selector_trigger")) {
            document?.getElementById("colour-selector_trigger")?.getElementsByTagName("input")[0]?.setAttribute('placeholder', '');
          }
        }, 1000);
      }
      // console.log(localValue?.yearToStud, 'isFarmDirectoryPage>>>', isFarmDirectoryPage, 'isStallionDirectoryPage>>>', isStallionDirectoryPage, 'value>>>', value)
    }
  }, [])

  React.useEffect(() => {
    if (isFarmsSuccess && props?.placeholder === 'Farm' && props?.location?.length > 0) {
      let data: any = [];
      farms?.map((record: any) => {
        data.push({
          id: record.id,
          label: toPascalCase(record.label),
          checked: sortByLocalFarmsList?.length ? sortByLocalFarmsList.includes(record.id) ? true : false : false,
        });
        setName(data);
      });
    }
    if (props?.location?.length === 0) {
      setName([]);
    }
    if (sortByLocalFarmsList?.length) {
      if (sortByLocalFarmsList?.length?.length > 0) props.setIsFarmsSelected(1)
      else if (sortByLocalFarmsList?.length === 0 && props.isFarmsSelected === 1) props.setIsFarmsSelected(0)
      props.setFarmKey(sortByLocalFarmsList);
      props.setClear(false);
      props?.setPage(1);
      props.query.refetch();
      // treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
    }
  }, [farms]);

  React.useEffect(() => {
    if (isYearOfStudSuccess && props?.placeholder === 'Year of Stud') {
      let data: any = [];
      YearToStud?.map((record: any) => {
        data.push({
          id: record.id,
          label: record.label,
          checked: sortByLocalYOSList?.length ? sortByLocalYOSList.includes(record.id) ? true : false : false,
        });
        setName(data);
      });
      if (sortByLocalYOSList?.length) {
        if (sortByLocalYOSList?.length > 0 && props.isYearToStudsSelected !== 1) props.setIsYearToStudsSelected(1)
        else if (sortByLocalYOSList?.length === 0 && props.isYearToStudsSelected === 1) props.setIsYearToStudsSelected(0)
        props.setYearOfStudKey(typeof (sortByLocalYOSList) === 'string' ? sortByLocalYOSList : sortByLocalYOSList?.join(','));
        // props.setClear(false);
        props?.setPage(1);
        props.query.refetch();
        // treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
      }
    }
  }, [isYearOfStudFetching]);

  React.useEffect(() => {
    if (isColoursSuccess && props?.placeholder === 'Colour') {
      let data: any = [];
      colours?.map((record: any) => {
        data.push({
          id: record.id,
          label: record.label,
          checked: sortByLocalColoursList?.length ? sortByLocalColoursList.includes(record.id) ? true : false : false,
        });
        setName(data);
      });

      if (sortByLocalColoursList?.length) {
        if (sortByLocalColoursList?.length > 0 && props.isColoursSelected !== 1) props.setIsColoursSelected(1)
        else if (sortByLocalColoursList?.length === 0 && props.isColoursSelected === 1) props.setIsColoursSelected(0)
        props.setColour(sortByLocalColoursList);
        props.setClear(false);
        props?.setPage(1);
        props.query.refetch();
        // treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
      }
    }
  }, [isColoursFetching]);

  const onFocus = async () => {
    treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
  }
  const onChange = async (currentNode: any, selectedNodes: any) => {
    const selectedData: any = await selectedNodes.map((res: any) => res.id);

    if (selectedData?.length === 1) {
      props.filterCounterhook.increment();
    }

    if (props?.placeholder === 'Farm') {
      if (selectedData?.length > 0) props.setIsFarmsSelected(1)
      else if (selectedData?.length === 0 && props.isFarmsSelected === 1) props.setIsFarmsSelected(0)
      props.setFarmKey(selectedData);
      props.setClear(false);
      props?.setPage(1);
      props.query.refetch();
    }
    if (props?.placeholder === 'Year of Stud') {
      if (selectedData?.length > 0 && props.isYearToStudsSelected !== 1) props.setIsYearToStudsSelected(1)
      else if (selectedData?.length === 0 && props.isYearToStudsSelected === 1) props.setIsYearToStudsSelected(0)
      props.setYearOfStudKey(selectedData);
      props.setClear(false);
      props?.setPage(1);
      props.query.refetch();
    }
    if (props?.placeholder === 'Colour') {

      if (selectedData?.length > 0 && props.isColoursSelected !== 1) props.setIsColoursSelected(1)
      else if (selectedData?.length === 0 && props.isColoursSelected === 1) props.setIsColoursSelected(0)
      props.setColour(selectedData);
      props.setClear(false);
      props?.setPage(1);
      props.query.refetch();
    }

    if (selectedData.length > 0) {
      treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
      if (props?.placeholder == 'Farm' && props.isFarmsSelected == 0) props.setIsFarmsSelected(1);
      if (props?.placeholder == 'Colour' && props.isFarmsSelected == 0) props.setIsColoursSelected(1);
      if (props?.placeholder == 'Year of Stud' && props.isFarmsSelected == 0) props.setIsYearToStudsSelected(1);
    }
    else {
      treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
      treeDropdownRef.current.searchInput.setAttribute("placeholder", props?.placeholder);
      treeDropdownRef.current.searchInput.setAttribute("class", "search");

      if (props?.placeholder === 'Farm' && props.isFarmsSelected === 1) props.setIsFarmsSelected(0);
      if (props?.placeholder === 'Colour' && props.isFarmsSelected === 1) props.setIsColoursSelected(0);
      if (props?.placeholder === 'Year of Stud' && props.isFarmsSelected === 1) props.setIsYearToStudsSelected(0);
      if (props.filterCounterhook.value > 0) {
        props.filterCounterhook.decrement();
      }
    }

  };


  const hasfarms: boolean = props.searchFarmKey?.length ? true : false;

  useEffect(() => {
    if (props?.placeholder === 'Farm') {
      setName([]);
    }
  }, [props?.location?.length === 0]);

  const hasYearOfStud: boolean = props.searchYearOfStudKey?.length ? true : false;
  useEffect(() => {
    if (props?.searchYearOfStudKey?.length === 0 && props?.placeholder === 'Year of Stud') {
      let data: any = [];
      name?.map((record: any) => {
        data.push({
          id: record.id,
          label: record.label,
          checked: false,
        });
        setName(data);
      });
    }
    if (hasfarms) {
      setTimeout(() => {
        if (document.getElementById("rdts3_trigger")) {
          document.getElementById("rdts3_trigger")?.getElementsByTagName("input")[0].setAttribute('placeholder', '');
        }
      }, 500);
    }
  }, [props?.searchYearOfStudKey, hasYearOfStud]);

  const hasColors: boolean = props.searchColour?.length ? true : false;
  useEffect(() => {
    if (props?.searchColour?.length === 0 && props?.placeholder === 'Colour') {
      let data: any = [];
      name?.map((record: any) => {
        data.push({
          id: record.id,
          label: record.label,
          checked: false,
        });
        setName(data);
      });
    }
    if (hasColors) {
      setTimeout(() => {
        if (document.getElementById("rdts4_trigger")) {
          document.getElementById("rdts4_trigger")?.getElementsByTagName("input")[0].setAttribute('placeholder', '');
        }
      }, 500);
    }
  }, [props?.searchColour, hasColors]);

  const DropDownTreeSelect = useMemo(() => {
    return (
      <DropdownTreeSelect
        aria-hidden="true"
        data={name || []}
        onChange={onChange}
        onFocus={onFocus}
        className="mdl-demo"
        texts={{ placeholder: props?.placeholder }}
        ref={treeDropdownRef}
        id={props?.placeholder == 'Farm' ? 'farm-selector' :
          props?.placeholder === 'Colour' ? 'colour-selector' :
            props?.placeholder === 'Year of Stud' ? 'yearTostud-selector' : ''}
      />
    );
  }, [name]);

  return <Box className="SDmultiselect">{DropDownTreeSelect}</Box>;
}

export default CustomMultiSelectTags;
