import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { MenuItem, MenuList, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Images } from 'src/assets/images';

export default function CustomCountryStateMultiSelectChip() {
  const stateListData: any[] = [];
  const [value, setValue] = useState<any>();
  const [selectedStates, setSelectedStates] = useState<any>([]);
  return (
    <>
      <Box className="SDmultiselect">
        <Autocomplete
          value={stateListData.filter((option: any) => option.countryName === value)}
          multiple
          id="checkboxes-tags-demo"
          options={stateListData}
          popupIcon={<KeyboardArrowDownIcon />}
          sx={{ margin: '0px', padding: '0px' }}
          disableCloseOnSelect
          getOptionLabel={(option: any) => option.countryName}
          renderOption={(props, option, { selected }) => (
            <MenuList sx={{ boxShadow: 'none' }}>
              <MenuItem {...props} disableRipple className="LoactionFilter">
                <span style={{ width: '100%', paddingLeft: '14px', whiteSpace: 'break-spaces' }}>
                  {option?.countryName}
                </span>
                <Checkbox
                  checkedIcon={<img src={Images.checked} alt="checkbox" />}
                  icon={<img src={Images.unchecked} alt="checkbox" />}
                  checked={selected}
                  disableRipple
                  onChange={(e) => {
                  }}
                />
              </MenuItem>

              {option?.states.map((d: any) => (
                <MenuItem key={d.stateId} className="LoactionFilter">
                  <span style={{ width: '100%', paddingLeft: '10px', whiteSpace: 'break-spaces' }}>
                    {' '}
                    - {d.stateName}{' '}
                  </span>
                  <Checkbox
                    disableRipple
                    checkedIcon={<img src={Images.checked} alt="checkbox" />}
                    icon={<img src={Images.unchecked} alt="checkbox" />}
                    checked={selectedStates?.includes(`${option.countryId}_${d.stateId}`)}
                    onChange={(e) => {
                      let final = [...selectedStates, `${option.countryId}_${d.stateId}`];
                      final = final.filter(
                        (item: any, index: any) => final.indexOf(item) === index
                      );
                      setSelectedStates(final);
                      setValue(option?.countryName);
                    }}
                  />
                </MenuItem>
              ))}
            </MenuList>
          )}
          renderInput={(params: any) => <TextField {...params} placeholder="Location" />}
        />
      </Box>
    </>
  );
}
