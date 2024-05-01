import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StyledEngineProvider } from '@mui/material/styles';
import { Checkbox, ListItemText } from '@mui/material';
import 'src/pages/stallionDirectory/StallionDirectory.css';
import * as _ from 'lodash';
import { useGetColoursQuery } from 'src/redux/splitEndpoints/getColoursSplit';
import { useGetFarmsInFilterQuery } from 'src/redux/splitEndpoints/getFarmsInFilterSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useGetYearToStudQuery } from 'src/redux/splitEndpoints/getYearToStudSplit';
import { useGetStallionSelectionQuery } from 'src/redux/splitEndpoints/getStallionSelectionSplit';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps: any = {
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

export default function MultipleSelectChipNotification(props: any) {
  const { data: colours, isSuccess: isColoursSuccess } = useGetColoursQuery();
  const { data: YearToStud, isSuccess: isYearOfStudSuccess } = useGetYearToStudQuery()
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { data: farms, isSuccess: isFarmsSuccess } = useGetFarmsInFilterQuery();
  // API call to get stallions
  const paramsSatllionList = {
    order: 'ASC',
    page: 1,
    limit: 20,
  };
  const responseSatllionList = useGetStallionSelectionQuery(paramsSatllionList);

  const [name, setName] = React.useState<String[]>([]);
  // clear props set name empty
  React.useEffect(() => {
    if (props.clear) {
      setName([]);
    }
  }, [props.clear]);

  const list: any = {
    Location: ['India', 'Australia'],
    Farm: isFarmsSuccess
      ? farms
      : ['Woodside Park Stud', 'Coolmore Stud NSW', 'Darley', 'Coolmore', 'Rosemont Stud'],
    'Year of Stud': isYearOfStudSuccess ? YearToStud : ['2018', '2016', '2007', '2010', '2001'],
    Colour: isColoursSuccess ? colours : ['Black', 'white', 'red', 'Brown', 'green'],
    Currency: isCurrencySuccess ? currencies : ['INR', 'USD', 'AUS', 'NUZ'],
  };
  // handle change of chip
  const handleChange = (event: SelectChangeEvent<String[]>): void => {
    let chipValue: any = event.target.value;
    search(chipValue);
  };

  // delete handler
  const handleDelete = (e: any, value: any) => {
    e.stopPropagation();
    let afterRemove = name?.filter((res: any) => res != value);
    setName(afterRemove);
    setTimeout(() => {
      search(afterRemove);
    }, 500);
  };

  // search handler
  function search(chipValue: any) {
    const { placeholder } = props;
    setName(
      // On autofill we get a stringified value.
      typeof chipValue === 'string' ? chipValue.split(',') : chipValue
    );
    const chooseDefaultValue = (param: string) => param;

    let newChipValueArray = null;
    if (placeholder === 'Farm') {
      newChipValueArray = farms?.filter((farm: any) => chipValue.includes(farm.label));
      newChipValueArray = newChipValueArray?.map((farmObject: any) => farmObject.id);
      props.setFarmKey(newChipValueArray);
      props.setClear(false);
      props?.setPage(1);
      props.query.refetch();
    }
    if (placeholder === 'Year of Stud') {
      props.setYearOfStudKey(chipValue);
      props.setClear(false);
      props?.setPage(1);
      props.query.refetch();
    }
    if (placeholder === 'Colour') {
      newChipValueArray = colours?.filter((colour: any) => chipValue.includes(colour.label));
      newChipValueArray = newChipValueArray?.map((colourObject: any) => colourObject.id);
      props.setColour(newChipValueArray);
      props.setClear(false);
      props?.setPage(1);
      props.query.refetch();
    }
  }
  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box className="SDmultiselect">
          <FormControl sx={ { width: '100%' } }>
            <InputLabel id="demo-multiple-chip-label"> {props.placeholder}</InputLabel>
            <Select
              labelId="demo-multiple-chip-checkbox-label"
              id="demo-multiple-chip-checkbox"
              multiple
              value={name}
              onChange={handleChange}
              IconComponent={KeyboardArrowDownIcon}
              input={<OutlinedInput label={props.placeholder} />}
              renderValue={(selected: React.ReactNode[]) => (
                <Box
                  sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5, fontFamily: 'Synthese-Book' } }
                >
                  {selected.map((value: React.ReactNode, index: number) => (
                    <Chip
                      key={index}
                      label={value}
                      clickable
                      deleteIcon={
                        <i
                          className="icon-Cross"
                          onMouseDown={(e) => handleDelete(e, value)}
                          style={ { color: '#161716' } }
                        />
                      }
                      onDelete={(e: any) => handleDelete(e, value)}
                    />
                  ))}
                </Box>
              )}
              //
              MenuProps={MenuProps}
            >
              {list[props?.placeholder] &&
                list[props?.placeholder].map((res: any) => (
                  <MenuItem
                    disableRipple
                    key={res.id}
                    value={res.label}
                    className="multiselect-menu"
                  >
                    <ListItemText primary={res.label} className="multiselect-listitem" />
                    <Checkbox checked={name.indexOf(res.label) > -1} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </StyledEngineProvider>
    </>
  );
}
