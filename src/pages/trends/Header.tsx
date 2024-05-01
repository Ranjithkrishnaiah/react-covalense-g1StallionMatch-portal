import { Box, MenuList, Stack, Typography, MenuItem, SelectChangeEvent } from '@mui/material'
import { CustomSelect } from 'src/components/CustomSelect'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';

type TrendsHeaderProps = {
  countriesList?: any;
  setCountry: React.Dispatch<React.SetStateAction<any>>;
  defaultValue: string;
  country: string;
}
function Header({ setCountry,country, countriesList, defaultValue }: TrendsHeaderProps) {
  const [cookie] = useCookies();

  useEffect(() => {
    if (cookie.country) {
      window.localStorage.setItem('trendsLocation', cookie.country ? cookie.country : 11);
    }
  }, [window.location]);

  const handleChange = (event: SelectChangeEvent<any>): void => {
    setCountry(event.target.value);
    window.localStorage.setItem('trendsLocation', JSON.stringify(event?.target?.value));
  };


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,

        // width:'190px',
        marginLeft: '0px',
        marginTop: '-1px',
        // marginLeft:'-.5px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
        boxSizing: 'border-box',
      },
    },
  }

  const giveCountryValue = (defaultValue:any) => {
    let ccId = null;
    if (countriesList) {
      for (let index = 0; index < countriesList?.length; index++) {
        const element = countriesList[index];
        if (defaultValue == element?.countryId) {
          ccId = element?.countryId;
          break;
        }

      }
    }
    return ccId ? ccId : 11;
  }
  // console.log(giveCountryValue(defaultValue), defaultValue,'ccId')

  return (
    <Box className='trends-header-wrapper' pt={5} pb={2}>
      <Stack direction={{ lg: 'row', sm: 'row', xs: 'column' }}>
        <Box flexGrow={1}><Typography variant='h1'>Stallion Trends</Typography></Box>
        <Box className='trends-popover'>
          <Typography className='trends-view-text' variant='caption'>View</Typography>
          <CustomSelect
            disablePortal
            className="selectDropDownBox trends-select-box"
            defaultValue={giveCountryValue(defaultValue)}
            value={country}
            onChange={handleChange}
            IconComponent={KeyboardArrowDownRoundedIcon}
            MenuProps={MenuPropss}

          >
            <MenuItem className='selectDropDownList trends-coutry-list' value={"none"} disabled>
              <em>Select Country</em>
            </MenuItem>
            {
              countriesList && countriesList?.map((v: any) =>
                <MenuItem className='selectDropDownList trends-coutry-list'
                  value={v.countryId} key={v.countryId}><span className='country-flag-box'><img width="24" height="24" className='country-flag' src={`https://flagcdn.com/w80/${v?.countryA2Code.toLowerCase()}.png`} /></span> {v?.label}</MenuItem>)
            }
          </CustomSelect>
        </Box>
      </Stack>
    </Box>
  )
}

export default Header