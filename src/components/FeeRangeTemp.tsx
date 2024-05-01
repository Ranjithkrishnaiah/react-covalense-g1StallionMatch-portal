import { FormControlLabel, MenuItem, Box, SelectChangeEvent, Checkbox } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomRangeSlider } from 'src/components/CustomRangeslider';
import { CustomSelect } from 'src/components/CustomSelect';
import * as common from '../locales/en.json';
import { MenuProps } from '../constants/MenuProps';
import { useGetCurrenciesQuery, useGetMinMaxPricingSlidervalueQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { Images } from 'src/assets/images';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export default function FeeRangeTemp(props: any) {
  const [currencySlider, setCurrencySlider] = React.useState<any>({});
  const [isCurrencyChanged, setIsCurrencyChanged] = React.useState<boolean>(false);
  const { data: CurrenciesMinMaxvalue, isSuccess: isCurrenciesMinMaxvalueSuccess, isFetching } =
    useGetMinMaxPricingSlidervalueQuery(currencySlider, { skip: (!isCurrencyChanged) });
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(456789);
  const [currency, setCurrency] = React.useState(props?.currency ? props?.currency : 'none');
  const [currencyRange, setCurrencyRange] = React.useState<any>();
  let min = 0;
  let max = 456789;
  let [priceFilter, setpriceFilter] = useState([0, 456789]);

  // Set Currency range value
  useEffect(() => {
    if (isCurrenciesMinMaxvalueSuccess === true) {
      setCurrencyRange(CurrenciesMinMaxvalue?.priceRange)
    }
  }, [isFetching])

  // console.log(props.location,'props.location')

  // Set price range to default
  useEffect(() => {
    if (props.cartInfo) {
      setCurrencySlider({
        currency: currency,
        location: props.location ? props.location?.length > 1 ? props.location?.map((v: any) => v + '_0')?.join('|') : props.location + '_0' : '',
        isPrivateFee: props?.radioValue
      })
      if (props.filterCounterhook.value === 0) {
        setIsCurrencyChanged(true);
      } else {
        setpriceFilter([(props.price[0]), (props.price[1])]);
      }
    } else {
      if (props.filterCounterhook.value > 0) {
        setpriceFilter([(props.price[0]), (props.price[1])]);
      } else {
        setIsCurrencyChanged(true);
      }
    }
    if (!props.cartInfo) {
      props.filterCounterhook.increment();
    }
    // console.log(props.filterCounterhook.value,'called for')
  }, [props.cartInfo])

  // On location change call price slider value
  useEffect(() => {
    if (currency !== 'none' && props.location !== undefined) {
      setCurrencySlider({
        currency: currency,
        location: props.location ? props.location?.length > 1 ? props.location?.map((v: any) => v + '_0')?.join('|') : props.location + '_0' : '',
        isPrivateFee: props?.radioValue
      })
      if (props.filterCounterhook.value > 0) {
        if (props.filterEditCounterhook.value === 0) {
          setIsCurrencyChanged(true);
        }
        props.filterCounterhook.increment();
      }
    }
  }, [props.location, props?.radioValue])

  // Set price range value from api and while edit set from cart api for default values
  useEffect(() => {
    // @ts-ignore
    if (CurrenciesMinMaxvalue && isCurrenciesMinMaxvalueSuccess) {
      // console.log(props.filterCounterhook.value,'called for minmax')
      if (props.cartInfo && props.filterCounterhook.value <= 1) {
        let splitPrice = props.cartInfo[0].selectedpriceRange.split('-');
        setpriceFilter([Number(splitPrice[0]), Number(splitPrice[1])])
      } else {
        setpriceFilter([CurrenciesMinMaxvalue?.priceRange?.min ? CurrenciesMinMaxvalue?.priceRange?.min : 0, CurrenciesMinMaxvalue?.priceRange?.max ? CurrenciesMinMaxvalue?.priceRange?.max : 456789])
      }
      setMinValue(CurrenciesMinMaxvalue?.priceRange?.min ? CurrenciesMinMaxvalue?.priceRange?.min : 0);
      setMaxValue(CurrenciesMinMaxvalue?.priceRange?.max ? CurrenciesMinMaxvalue?.priceRange?.max : 456789);
    }
  }, [CurrenciesMinMaxvalue, props.cartInfo]);

  type filtersType = typeof common;
  const placeholderType: filtersType = common;

  const marks = [
    {
      value: 0,
      label: "Min"
    },

    {
      value: 50000
    },
    {
      value: 100000
    },
    {
      value: 200000
    },
    {
      value: 300000
    },
    {
      value: 400000
    },
    {
      value: 500000
    },
    {
      value: 750000
    },
    {
      value: 1000000,
      label: "Max"
    }
  ];

  // Change slider value
  const handleChange = (event: Event, value: any, activeThumb: number) => {
    if (!max) return
    const allEqual = (inputArray: any) => inputArray.every((v: any) => v === inputArray?.[0])
    if (allEqual(value)) {
      if (marks.some(mark => mark?.value === value?.[0])) {
        let markIndex = marks.findIndex(mark => mark?.value == value?.[0]);
        if (marks.length === (markIndex + 1)) {
          if (markIndex) {
            value = [marks[markIndex - 1]?.value, value?.[0]]
          }
        } else {
          value = [value?.[0], marks[markIndex + 1]?.value]
        }
      }
    }
    let rangeValue = JSON.parse(JSON.stringify(value));
    //EOF Logic to avoid min max at same point
    props.setPrice([Math.ceil(rangeValue[0]), Math.ceil(rangeValue[1])]);
    props.setIsViewEditStallionClicked(false);
    props.setCurrency(currency);
    props.setIsProReportPriceSliderChanged(true);
    setpriceFilter([Math.ceil(rangeValue[0]), Math.ceil(rangeValue[1])]);
  };
  // console.log(props.currency,currency,'currency123 in feee')
  // change currency form list and call api based on selection
  const handleCurrencyChange = (event: SelectChangeEvent<any>) => {
    // console.log('currency called')
    setCurrency(event.target.value);
    props.setCurrency(event.target.value);
    setCurrencySlider({
      currency: event.target.value,
      location: props.location ? props.location?.length > 1 ? props.location?.map((v: any) => v + '_0')?.join('|') : props.location + '_0' : '',
      isPrivateFee: props?.radioValue
    })
    setIsCurrencyChanged(true);
    props.setIsViewEditStallionClicked(false);
  };

  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();

  // Convert the currency id to symbol
  const getCurrencyById = (currid: any) => {
    let id = '$';
    if (isCurrencySuccess) {
      if (currid) {
        currencies.forEach((element: any) => {
          if (element.id === currid) {
            if (element.currencySymbol) {
              id = element.currencySymbol;
            } else {
              id = `${element.label}`;
            }
          }
        });
      }
    }
    return id;
  };

  // reset slider and currency values
  useEffect(() => {
    if (!props.open) {
      props.setCurrency('none');
      props.setPrice([min, max]);
      setpriceFilter([0, 1000000]);
      // console.log('called for close')
    }
  }, [props.open])

  // Format the selected price in slider to 'K'
  function numFormatter(num: any) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  }

  // Use debounce to call api based on slider change
  function useDebouncedValue<T>(input: T, time = 500) {
    const [debouncedValue, setDebouncedValue] = React.useState(input);

    // every time input value has changed - set interval before it's actually commited
    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedValue(input);
      }, time);

      return () => {
        clearTimeout(timeout);
      };
    }, [input, time]);

    return debouncedValue;
  }

  const debouncedValue = useDebouncedValue(priceFilter, 1000); // this value will pick real time value, but will change it's result only when it's seattled for 500ms

  // set the price value based on selection
  useEffect(() => {
    if (isNaN(priceFilter?.[0]) || isNaN(priceFilter[1])) return
    props.setPrice([priceFilter?.[0], priceFilter[1]])
  }, [debouncedValue])
  // console.log(props.price,'called for price')
  // console.log(priceFilter,'called for priceFilter')

  return (
    <Box>
      {/* Currency selector */}
      <CustomSelect
        fullWidth
        IconComponent={KeyboardArrowDownRoundedIcon}
        className="select-dropdown selectDropDownBox feerange-dropdown"
        value={currency}
        defaultValue='none'
        onChange={handleCurrencyChange}
        MenuProps={MenuProps}
      >
        <MenuItem className='selectDropDownList' value="none" disabled>
          <em>Select Currency</em>
        </MenuItem>
        {currencies?.map((option: any) => (
          <MenuItem className="selectDropDownList" value={option.id} key={option.label}>
            {option.label}
          </MenuItem>
        ))}
        {/* <MenuItem className='selectDropDownList' value={1} key={'AUD'}>
          {'AUD'}
        </MenuItem> */}
      </CustomSelect>
      <Box className='feerange'>
        <label>
          {' '}

          {
            `${getCurrencyById(props.currency)}${Math.ceil(priceFilter[0])?.toLocaleString()} - ${getCurrencyById(props.currency)}${Math.ceil(priceFilter[1])?.toLocaleString()}+`}

        </label>
      </Box>
      {/* Price range slider */}
      <CustomRangeSlider
        className='rangeSliderFilter'
        getAriaLabel={() => 'Fee range'}
        value={priceFilter}
        valueLabelFormat={numFormatter}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={minValue}
        max={maxValue}
        step={(10 / 100) * maxValue}
      />
      {/* Include private fee checkbox */}
      <FormControlLabel
        className='RadioButtonIcon'
        control={
          <Checkbox
            disableRipple

            value={props?.radioValue}
            checked={props?.radioValue === true ? true : false}
            onChange={props?.radioOnChange}
            key={"Include Private/Unkown Fees"}
            checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
            icon={<img src={Images.Radiounchecked} alt="checkbox" />}
          />
        }
        label={"Include Private/Unknown Fees"}
      />
    </Box>
  );
}
