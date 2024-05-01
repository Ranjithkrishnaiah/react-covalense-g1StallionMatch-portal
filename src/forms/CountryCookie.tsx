import { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Stack } from '@mui/material';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import { useCookies } from 'react-cookie';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import useAuth from 'src/hooks/useAuth';

const defaultCountryOption = {
  id: 11,
  countryName: "Australia",
  countryCode: "AUS",
  countryA2Code: "AU",
  regionId: 1,
  preferredCurrencyId: 1,
  isDisplay: true
}

function CountryCookie() {

  const [cookies, setCookie] = useCookies(['country']);
  const { authentication } = useAuth();
  const [countryName, setCountryName] = useState(defaultCountryOption.countryName);
  const [latitude, setLatitude] = useState<any>();
  const [longitude, setLongitude] = useState<any>();
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [countryDefaultValue, setCountryDefaultValue] = useState<any>(defaultCountryOption);
  const [value, setValue] = useState<any>(countryDefaultValue?.id);

  // Country list API call
  const { data: countriesList } = useCountriesQuery();

  // Set the country name based on IP or upon choosing from list
  const handleCountry = (value: any) => {
    setValue(value);
    setCountryName(countriesList?.filter((country: any) => country.id === value)[0]?.countryName || "");
  }

  //set the country upon choosing country from option list
  const handleContinue = () => {
    setCookie('country', value || countryDefaultValue?.id, { path: '/', sameSite: 'none', secure: true });
    setIsContinue(true);
    localStorage.setItem('geoCountryName', countryName);
  }

  useEffect(() => {
    navigator?.geolocation?.getCurrentPosition(
      function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        var Geonames = require('geonames.js');
        const geonames = new Geonames({
          username: 'cvlsm',
          lan: 'en',
          encoding: 'JSON'
        });
        let gmtOffset: any;
        let lng: any;
        let lat: any;
        geonames.timezone({ lng, lat }).then((res: any) => {
          gmtOffset = res.gmtOffset;
          lat = position.coords.latitude
          lng = position.coords.longitude
          return geonames.findNearby({ lng, lat });
        }).then((loc: any) => {
          setCountryName(loc.geonames[0].countryName || "");
          let district = loc.geonames[0].adminName1 || null;
          let defaultCountry: any = countriesList?.filter((country: any) => country.countryName === loc.geonames[0].countryName)[0]
          handleCountry(defaultCountry.id)
          setCountryDefaultValue(defaultCountry)
          localStorage.setItem('geoCountryName', loc.geonames[0].countryName);
          if (!countryName || !district) {
            return null;
          }
        }).catch(function (err: any) {
          return err.message;
        });
        if (!authentication) {
          geonames.timezone({ lng, lat }).then((res: any) => {
            gmtOffset = res.gmtOffset;
            lat = position.coords.latitude
            lng = position.coords.longitude
            return geonames.findNearbyPostalCodes({ lng, lat });
          }).then((loc: any) => {
            localStorage.setItem('geoPostalCode', loc.postalCodes[0].postalCode);
          }).catch(function (err: any) {
            return err.message;
          });
        }
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, [countriesList])

  if (isContinue && cookies?.country === undefined) {
    setCookie('country', countryDefaultValue?.id, { path: '/', sameSite: 'none', secure: true });
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.9 + ITEM_PADDING_TOP,
        marginTop: '1px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  }

  return (
    <Box className='cookies-box-inner'>
      <Box pt={{ xs: '0', sm: '32px', md: '32px', lg: '32px' }} className='cookies-box-inner-body'>
        <Typography variant='h5'>
          We have set your location as {countryName}.
        </Typography>
        <Typography variant='h6'>
          We will tailor your Stallion Match experience based on this location. Your selection can always be changed at the bottom of each page.
        </Typography>
        <Box>
          <CustomButton type="submit" onClick={handleContinue}
            fullWidth className='lr-btn'>
            <span className='font-text'>
              Continue to Stallion Match
            </span>
          </CustomButton>
        </Box>
      </Box>
      {(countryName || countryDefaultValue?.countryName) && <Box my={3} className='country-cookies'>
        <Stack>Change my location to:</Stack>
        <CustomSelect fullWidth
          className='selectDropDownBox'
          id={'cookiesSelectDropDownBox'}
          IconComponent={KeyboardArrowDownRoundedIcon}
          onChange={(e: any) => handleCountry(e.target.value)}
          name={countryName}
          value={value || countryDefaultValue?.id || 'none'}
          sx={{ height: '54px', mb: '1rem' }}
          menuPosition="fixed"
          MenuProps={{
            keepMounted: true,
            hideBackdrop: false,
            disablePortal: true,
            disableScrollLock: false,
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            transformOrigin: {
              vertical: "bottom",
              horizontal: "center"
            },
            ...MenuPropss
          }}

        >
          <MenuItem className='selectDropDownList selectCountryCookiesList' value="none" disabled>
            Select Country
          </MenuItem>
          {
            countriesList?.map(({ id, countryName }) =>
              <MenuItem className='selectDropDownList selectCountryCookiesList'
                value={id}
                key={id}>
                {countryName}
              </MenuItem>)}
        </CustomSelect>
      </Box>
      }
    </Box>
  )
}
export default CountryCookie;