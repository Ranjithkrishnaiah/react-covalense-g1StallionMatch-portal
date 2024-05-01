import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  Divider,
  InputLabel,
  MenuItem,
  MenuList,
  StyledEngineProvider,
  Typography,
  Button,
  TextField,
  Checkbox,
  OutlinedInput,
  Select,
  Chip,
  Theme,
  useTheme,
  SelectChangeEvent,
  FormControl,
  ListItemText,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/system';
import { ValidationConstants } from '../constants/ValidationConstants';
import '../pages/stallionDirectory/StallionDirectory.css';
import { useLocation } from 'react-router';
import { Images } from 'src/assets/images';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName?.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const names = [
  {
    name: 'Oliver Hansen',
    id: 1234,
  },
  {
    name: 'Van Henry',
    id: 1236,
  },
  {
    name: 'Ralph Hubbard',
    id: 1238,
  },
];

function MultiSelectDropDown(props: any) {
  const {
    personName,
    setPersonName,
    data,
    selectType,
    selectedData,
    setSelectedData,
    placeholder,
  } = props;
  const theme = useTheme();
  const { pathname } = useLocation();

  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        //   width: 166,
        //   minWidth: 166,
        marginTop: '4px',
        marginRight: '2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  const MenuPropss: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        boxShadow: 'none',
        border: 'solid 1px #333333',
        borderTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        marginTop: '-4px',
        boxSizing: 'border-box',
      },
    },
  };

  let dataConverted: any = [];

  switch (selectType) {
    case 'FARMS':
      if (data?.length > 0) {
        data?.forEach((farm: any) => {
          dataConverted?.push({
            farmId: farm?.farmId,
            farmName: farm?.farmName,
          });
        });
      }
      break;

    case 'SHORTLIST':
      if (data?.length > 0) {
        data?.forEach((shortlist: any) => {
          dataConverted?.push({
            stallionId: shortlist?.stallionId,
            horseName: shortlist?.horseName,
          });
        });
      }
      break;

    case 'BoostStallions':
      if (data?.length > 0) {
        data?.forEach((boostStallion: any) => {
          dataConverted?.push({
            stallionId: boostStallion?.stallionId,
            horseName: boostStallion?.horseName,
          });
        });
      }
      break;

    case 'CountryLists':
      if (data?.length > 0) {
        data?.forEach((country: any) => {
          dataConverted?.push({
            countryId: country?.id,
            countryName: country?.countryName,
          });
        });
      }
      break;

    default:
      break;
  }

  // useEffect(()=>{

  // },[])

  const handleChange: any = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    transformValues(value, selectType);
  };

  function transformValues(chipValue: any, selectType: any) {
    let newChipValueArray: any = [];
    if (selectType === 'FARMS') {
      newChipValueArray = dataConverted?.filter((farm: any) => chipValue.includes(farm.farmName));
      newChipValueArray = newChipValueArray?.map((farmObject: any) => farmObject.farmId);
      setSelectedData(newChipValueArray);
    }
    if (selectType === 'SHORTLIST') {
      newChipValueArray = dataConverted?.filter((shortList: any) =>
        chipValue.includes(shortList.horseName)
      );
      newChipValueArray = newChipValueArray?.map((farmObject: any) => farmObject.stallionId);
      setSelectedData(newChipValueArray);
    }
    if (selectType === 'BoostStallions') {
      newChipValueArray = dataConverted?.filter((boostStallion: any) =>
        chipValue.includes(boostStallion.horseName)
      );
      newChipValueArray = newChipValueArray?.map(
        (boostStallionObject: any) => boostStallionObject.stallionId
      );
      setSelectedData(newChipValueArray);
    }
    if (selectType === 'CountryLists') {
      newChipValueArray = dataConverted?.filter((country: any) =>
        chipValue.includes(country.countryName)
      );
      newChipValueArray = newChipValueArray?.map((countryObject: any) => countryObject.countryId);
      setSelectedData(newChipValueArray);
    }
  }

  const userSchema = Yup.object().shape({
    fullName: Yup.string().required(ValidationConstants.fullNameValidation),
    email: Yup.string().email().required(ValidationConstants.emailValidation),
    accessLevelId: Yup.number().required(),
  });

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = (e: any, value: any) => {
    e.stopPropagation();
    // console.log('clicked delete', value, name);
    let afterRemove = personName?.filter((res: any) => res != value);
    setPersonName(afterRemove);
    // setTimeout(() => {
    //   search(afterRemove);
    // }, 500);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box>
        <Box className="SDmultiselect" sx={ { mb: '0 !important' } }>
          {dataConverted?.length > 0 && (
            <FormControl sx={ { width: '100%' } }>
              {selectType === 'BoostStallions' || "SHORTLIST" ? (
                <InputLabel id="demo-multiple-checkbox-label">Select Stallions</InputLabel>
              ) : selectType === 'CountryLists' ? (
                <InputLabel id="demo-multiple-checkbox-label">Select Location</InputLabel>
              ) :selectType === 'FARMS'?(
                <InputLabel id="demo-multiple-checkbox-label"> Select Linked Farms</InputLabel>
              ) :<InputLabel id="demo-multiple-checkbox-label"> Select Farms</InputLabel>}

              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                placeholder={ placeholder }
                multiple
                fullWidth
                value={personName}
                onChange={handleChange}
                IconComponent={KeyboardArrowDownIcon}
                inputProps={ { shrink: false } }
                input={<OutlinedInput label={'Select Farms'} />}
                // input={<OutlinedInput id="demo-multiple-checkbox" label="Chip" />}
                renderValue={(selected) => {
                  return (
                    <Box
                      sx={ {
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        fontFamily: 'Synthese-Book',
                      } }
                    >
                      {selected.map((value: any) => (
                        <Chip
                          key={value}
                          label={value}
                          deleteIcon={
                            <i
                              className="icon-Cross"
                              onMouseDown={(e) => handleDelete(e, value)}
                              style={ { color: '#161716' } }
                            />
                          }
                          onDelete={(e: any) => handleDelete(e, value)}
                          //deleteIcon={<i className='icon-Cross' style={ {color:'#161716'} } />}
                          onClick={handleClick}
                          //onDelete={handleDelete}
                        />
                      ))}
                    </Box>
                  );
                } }
                MenuProps={MenuPropss}
              >
                {selectType === 'FARMS' &&
                  dataConverted?.map((res: any) => (
                    <MenuItem
                      className="multiselect-menu"
                      key={res?.farmName}
                      value={res?.farmName}
                      style={getStyles(res?.farmName, personName, theme)}
                    >
                      <ListItemText primary={res?.farmName} className="multiselect-listitem" />
                      <Checkbox checkedIcon={<img src={Images.checked} alt="checkbox"/>} icon={<img src={Images.unchecked} alt="checkbox"/>} checked={personName?.indexOf(res?.farmName) > -1} />
                    </MenuItem>
                  ))}
                {selectType === 'SHORTLIST' &&
                  dataConverted?.map((res: any) => (
                    <MenuItem
                      className="multiselect-menu"
                      key={res?.horseName}
                      value={res?.horseName}
                      style={getStyles(res?.horseName, personName, theme)}
                    >
                      <ListItemText primary={res?.horseName} className="multiselect-listitem" />
                      <Checkbox checkedIcon={<img src={Images.checked} alt="checkbox"/>} icon={<img src={Images.unchecked} alt="checkbox"/>} checked={personName?.indexOf(res?.horseName) > -1} />
                    </MenuItem>
                  ))}
                {selectType === 'BoostStallions' &&
                  dataConverted?.map((res: any) => (
                    <MenuItem
                      className="multiselect-menu"
                      key={res?.horseName}
                      value={res?.horseName}
                      style={getStyles(res?.horseName, personName, theme)}
                    >
                      <ListItemText primary={res?.horseName} className="multiselect-listitem" />
                      <Checkbox checkedIcon={<img src={Images.checked} alt="checkbox"/>} icon={<img src={Images.unchecked} alt="checkbox"/>} checked={personName?.indexOf(res?.horseName) > -1} />
                    </MenuItem>
                  ))}
                {selectType === 'CountryLists' &&
                  dataConverted?.map((res: any) => (
                    <MenuItem
                      className="multiselect-menu boostCountry"
                      key={res?.countryName}
                      value={res?.countryName}
                      style={getStyles(res?.countryName, personName, theme)}
                    >
                      <ListItemText primary={res?.countryName} className="multiselect-listitem" />
                      <Checkbox checkedIcon={<img src={Images.checked} alt="checkbox"/>} icon={<img src={Images.unchecked} alt="checkbox"/>} checked={personName?.indexOf(res?.countryName) > -1} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}

export default MultiSelectDropDown;
