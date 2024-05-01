import {
  FormControlLabel,
  MenuItem,
  Radio,
  Box,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { CustomRangeSlider } from 'src/components/CustomRangeslider';
import { CustomSelect } from 'src/components/CustomSelect';
import * as common from '../../../locales/en.json';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
// @ts-ignore

import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { Checkbox } from '@mui/material';

import { Images } from 'src/assets/images';

const FeeRangeStallionMemorized = (props: any) => {
  type filtersType = typeof common;
  const placeholderType: filtersType = common;

  const min = 0;
  const [selectedMaxPrice, setMaxPrice] = React.useState(props.price[1]);
  const [currency, setCurrency] = React.useState(1);
  const [minValue, setMinValue] = React.useState(0);
  const [maxValue, setMaxValue] = React.useState(0);
  const [initialMinValue, setInitialMinValue] = React.useState(0);
  const [initialMaxValue, setInitialMaxValue] = React.useState(0);
  const [isChange, setIsChange] = React.useState(false);
  const [fromCurrency, setFromCurrency] = React.useState(1);
  const [toggleHandleChange, setToggleHandleChange] = React.useState(false);
  const [currencySymbol, setCurrencySymbol] = React.useState('$');
  const [selectedPriceRange, setSelectedPriceRage] = React.useState([0, 0]);
  const [minValueError, setMinValueError] = React.useState(false);
  const [maxValueError, setMaxValueError] = React.useState(false);
  const [mainMaxValueError, setMainMaxValueError] = React.useState(false);
  const [mainMinValueError, setMainMinValueError] = React.useState(false);
  const [minStringValue, setMinStringValue] = React.useState('');
  const [maxStringValue, setMaxStringValue] = React.useState('');
  const [finalMarksList, setFinalMarksList] = React.useState<any>([]);

  const params = {
    fromCurrency: fromCurrency,
    toCurrency: currency,
    priceRange: selectedPriceRange.join('-'),
  };
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();

  const minPrice = props?.feeRange?.minPrice ? props.feeRange.minPrice : 0;
  const maxPrice = props?.feeRange?.maxPrice ? props.feeRange.maxPrice : 0;

  useEffect(() => {
    let value: any = (window.localStorage.getItem('storedFiltered')) || null;
    let comeFromDirectory: any = window.localStorage.getItem('comeFromDirectory');
    if (value) {
      let localValue = JSON.parse(value);
      if (localValue?.currency) {
        if (JSON.parse(comeFromDirectory) == true) {
          setCurrency(localValue?.currency);
          props.setCurrency(localValue?.currency);
          setToggleHandleChange(true);
          props.setClear(false);
          props?.setPage(1);

          if (props.isCountrySelected === 0) {
            props.setIsCountrySelected(1);
            props.filterCounterhook.increment();
          }
          const currencySymbolValue: any = currencies.find((res: any) => res.id === localValue?.currency);
          if (currencySymbolValue) setCurrencySymbol(currencySymbolValue?.currencySymbol);

          setIsChecked(localValue?.isPrivateFee);
          props.setClear(false);
          props.setPrivateFee(localValue?.isPrivateFee);
          props.query.refetch();

          if (props.isPrivateFeeSelected === 0) {
            props.setIsPrivateFeeSelected(1);
            props.filterCounterhook.increment();
          }
        }
      }
    }
  }, [])

  const addCommaInInput = (val: string) => {
    // console.log(val,'VALUE')
    if (!val) return '';
    return val?.replace(/\D/g, "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const createFormatMarkList = () => {
    setFinalMarksList([]);
    let arr = minValue === 0 ? Array.from(Array(11).keys()) : Array.from({ length: 11 }, (_, i) => i + 1);
    let finalArr: any = [];
    // console.log(arr, 'MYARRRR')
    for (let index = 0; index < arr.length; index++) {
      let ii = arr[index];
      if (index >= 0 && index <= 5) {
        if (index == 0) {
          finalArr.push((ii));
        } else {
          if (minValue === 0) {
            finalArr.push((finalArr[index - 1] + 6));
          } else {
            finalArr.push((index * 6));
          }
        }
      }

      if (minValue === 0) {
        if (index >= 6 && index <= 10) {
          finalArr.push((finalArr[index - 1] + 14));
        }
      }
      if (!(minValue === 0)) {
        if (index >= 6 && index < 10) {
          finalArr.push((finalArr[index - 1] + 14));
        }
      }

      if (ii === 11) {
        finalArr.push(100);
      }
    }
    let percTageArray: any = finalArr?.map((v: any, index: number) => (
      (!(minValue === 0) && index === 0)) ? { value: Number(((1) * Number(minValue.toFixed())).toFixed()) } : { value: Number(((v / 100) * Number(maxValue.toFixed())).toFixed()) }
    );
    setFinalMarksList(percTageArray);
    // console.log(percTageArray, finalArr, 'finalArr');
  }
  // console.log(selectedPriceRange, 'selectedPriceRange');

  // useEffect(() => {
  //   // console.log(minValue, maxValue, 'maxValue')
  //   createFormatMarkList();
  // }, [minValue, maxValue])

  useEffect(() => {
    if (props.clear) {
      setSelectedPriceRage([Number(minPrice.toFixed()), Number(maxPrice.toFixed())]);
      setMinValue(minPrice);
      setMaxValue(maxPrice);
      setIsChecked(true);
      setCurrency(1);
      setMinValueError(false);
      setMaxValueError(false);
      setMinStringValue(addCommaInInput(minPrice ? String(minPrice.toFixed(0)) : '0'));
      setMaxStringValue(addCommaInInput(maxPrice ? String(maxPrice.toFixed(0)) : '0'));
    }
    if (props.feeRange) {
      setSelectedPriceRage([Number(((minPrice / maxPrice) * 100).toFixed()), Number(((maxPrice / maxPrice) * 100).toFixed())]);
      setMinValue(minPrice);
      setMaxValue(maxPrice);
      setMinValueError(false);
      setMaxValueError(false);
      setMinStringValue(addCommaInInput(minPrice ? String(minPrice.toFixed(0)) : '0'));
      setMaxStringValue(addCommaInInput(maxPrice ? String(maxPrice.toFixed(0)) : '0'));
    }
  }, [props.clear, props.feeRange]);

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

  const marks1 = [
    {
      value: 0
      // label: "0°C"
    },
    {
      value: 6
      // label: "6°C"
    },
    {
      value: 12
      // label: "12°C"
    },
    {
      value: 18
      // label: "18°C"
    },
    {
      value: 30
      // label: "24°C"
    },
    {
      value: 50
      // label: "30°C"
    },
    {
      value: 70
      // label: "44°C"
    },
    {
      value: 80
      // label: "58°C"
    },
    {
      value: 90
      // label: "72°C"
    },
    {
      value: 95
      // label: "86°C"
    },
    {
      value: 100
      // label: "100°C"
    }
  ];

  const conversion: any = {
    "0": 0,
    "6": 6,
    "12": 12,
    "18": 18,
    "30": 24,
    "50": 30,
    "70": 44,
    "80": 58,
    "90": 72,
    "95": 86,
    "100": 100
  };

  const reverseConversion: any = {
    "0": 0,
    "6": 6,
    "12": 12,
    "18": 18,
    "24": 30,
    "30": 50,
    "44": 70,
    "58": 80,
    "72": 90,
    "86": 95,
    "100": 100
  };

  const handleChange = (event: Event, value: any, activeThumb: number) => {

    let value1: string = String(value[0]);
    let value2: string = String(value[1]);
    let converPerct1: number = conversion[value1];
    let converPerct2: number = conversion[value2];
    let selectedMinValue = Number((Number(maxValue) * Number(converPerct1 / 100)).toFixed());
    let selectedMaxValue = Number((Number(maxValue) * Number(converPerct2 / 100)).toFixed());
    let finalArr = [Number(selectedMinValue), Number(selectedMaxValue)]
    console.log(selectedMinValue, selectedMaxValue, 'VVV');
    // if (!maxValue) return;
    //BOF Logic to avoid min max at same point
    //If Any bug - comment this

    // const allEqual = (inputArray: any) => inputArray.every((v: any) => v === inputArray?.[0]);
    // if (allEqual(value)) {
    //   if (marks.some((mark) => mark?.value === value?.[0])) {
    //     let markIndex = marks.findIndex((mark) => mark?.value == value?.[0]);
    //     if (marks.length === markIndex + 1) {
    //       if (markIndex) {
    //         value = [marks[markIndex - 1]?.value, value?.[0]];
    //       }
    //     } else {
    //       value = [value?.[0], marks[markIndex + 1]?.value];
    //     }
    //   }
    // }
    // console.log(value, 'selectedPriceRange')
    //EOF Logic to avoid min max at same point
    props.setPrice(finalArr);
    props.setClear(false);
    setSelectedPriceRage(value);
    setMinStringValue(addCommaInInput(value[0] ? String(selectedMinValue) : '0'));
    setMaxStringValue(addCommaInInput(value[1] ? String(selectedMaxValue) : '0'));
    if (Number(selectedMinValue) < minValue) {
      setMainMinValueError(true);
      setMainMaxValueError(false);
    } else {
      setMainMinValueError(false);
      setMainMaxValueError(false);
    }
    if (Number(selectedMinValue) >= selectedMaxValue) {
      setMinValueError(true);
      setMaxValueError(false);
    } else {
      setMinValueError(false);
      setMaxValueError(false);
    }

    if (Number(selectedMaxValue) > maxValue) {
      setMainMaxValueError(true);
      setMainMinValueError(false);
    } else {
      setMainMaxValueError(false);
      setMainMinValueError(false);
    }
    if (Number(selectedMaxValue) <= selectedMinValue) {
      setMaxValueError(true);
      setMinValueError(false);
    } else {
      setMaxValueError(false);
      setMinValueError(false);
    }
    props?.setPage(1);
  };

  const marks = [
    {
      value: 0,
      label: 'Min',
    },

    {
      value: 50000,
    },
    {
      value: 100000,
    },
    {
      value: 200000,
    },
    {
      value: 300000,
    },
    {
      value: 400000,
    },
    {
      value: 500000,
    },
    {
      value: 750000,
    },
    {
      value: 1000000,
      label: 'Max',
    },
  ];

  const handleCurrencyChange = (event: SelectChangeEvent<any>) => {
    setFromCurrency(currency ? currency : 1);
    setCurrency(event.target.value);
    props.setCurrency(event.target.value);
    setToggleHandleChange(true);
    props.setClear(false);
    props?.setPage(1);

    if (props.isCountrySelected === 0) {
      props.setIsCountrySelected(1);
      props.filterCounterhook.increment();
    }
    const currencySymbolValue: any = currencies.find((res: any) => res.id === event.target.value);
    if (currencySymbolValue) setCurrencySymbol(currencySymbolValue?.currencySymbol);
  };

  const [isChecked, setIsChecked] = React.useState<boolean>(props.isPrivateFee);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    props.setClear(false);
    props.setPrivateFee(event.target.checked);
    props.query.refetch();

    if (props.isPrivateFeeSelected === 0) {
      props.setIsPrivateFeeSelected(1);
      props.filterCounterhook.increment();
    }
  };

  function numFormatter(num: any) {
    let value1: string = String(num);
    let converPerct1: number = conversion[value1];
    let selectedNumValue = Number(maxValue) * Number(converPerct1 / 100);
    // console.log(selectedNumValue, 'selectedNumValue')
    if (selectedNumValue > 999 && selectedNumValue < 1000000) {
      return (selectedNumValue / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (selectedNumValue >= 1000000) {
      return (selectedNumValue / 1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million
    } else if (selectedNumValue < 900) {
      return selectedNumValue; // if value < 1000, nothing to do
    }
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        //   width: 166,
        //   minWidth: 166,
        marginLeft: '-0.5px',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  let handleInputPriceChange = (e: any) => {
    props.setClear(false);
    setIsChange(true);
    let { value, name } = e.target;
    let commaRemovedNumber: any = Number(value.replace(/\,/g, ''));
    // console.log(value, selectedPriceRange, 'selectedPriceRange')
    if (name == 'min_value') {
      if (Number(commaRemovedNumber) < minValue) {
        setMainMinValueError(true);
        setMainMaxValueError(false);
      } else {
        setMainMinValueError(false);
        setMainMaxValueError(false);
      }
      if (Number(commaRemovedNumber) > Math.ceil(Number(maxStringValue.replace(/\,/g, '')))) {
        setMinValueError(true);
        setMaxValueError(false);
      } else {
        setMinValueError(false);
        setMaxValueError(false);
      }
      // if (Number(value) <= Math.ceil(selectedPriceRange[1])) {
      // setSelectedPriceRage([parseInt(commaRemovedNumber), selectedPriceRange[1]]);
      setTimeout(() => {
        if (!minValueError) {
          let maxOgvalue = Math.ceil(Number(maxStringValue.replace(/\,/g, '')));
          console.log([Number(((commaRemovedNumber / maxPrice) * 100).toFixed()), Number(((maxOgvalue / maxPrice) * 100).toFixed())], 'maxOgvalue')
          props.setPrice([parseInt(commaRemovedNumber), Number(maxStringValue.replace(/\,/g, ''))]);
          let enteredMinValue = Number(((commaRemovedNumber / maxPrice) * 100).toFixed());
          let enteredMinConvertedValue = reverseConversion[enteredMinValue];
          setSelectedPriceRage([enteredMinConvertedValue ? enteredMinConvertedValue : enteredMinValue, Number(((maxOgvalue / maxPrice) * 100).toFixed())]);
        }
      }, 250);
      // }
      setMinStringValue(addCommaInInput(value ? value : ''));

    } else {
      if (Number(commaRemovedNumber) > maxValue) {
        setMainMaxValueError(true);
        setMainMinValueError(false);
      } else {
        setMainMaxValueError(false);
        setMainMinValueError(false);
      }
      if (Number(commaRemovedNumber) < Math.ceil(Number(minStringValue.replace(/\,/g, '')))) {
        setMaxValueError(true);
        setMinValueError(false);
      } else {
        setMaxValueError(false);
        setMinValueError(false);
      }
      // if(Number(value) >= Math.ceil(selectedPriceRange?.[0])){
      // setSelectedPriceRage([selectedPriceRange?.[0], parseInt(commaRemovedNumber)]);
      setTimeout(() => {
        if (!maxValueError) {
          let minOgvalue = Math.ceil(Number(minStringValue.replace(/\,/g, '')));
          console.log([Number(((minOgvalue / maxPrice) * 100).toFixed()), Number(((commaRemovedNumber / maxPrice) * 100).toFixed())], 'minOgvalue')
          props.setPrice([Number(minStringValue.replace(/\,/g, '')), parseInt(commaRemovedNumber)]);
          let enteredMaxValue = Number(((commaRemovedNumber / maxPrice) * 100).toFixed());
          let enteredMaxConvertedValue = reverseConversion[enteredMaxValue];
          setSelectedPriceRage([Number(((minOgvalue / maxPrice) * 100).toFixed()), enteredMaxConvertedValue ? enteredMaxConvertedValue : enteredMaxValue]);
        }
      }, 250);
      // }
      setMaxStringValue(addCommaInInput(value ? value : ''));
    }
  };

  const debouncedValue = useDebouncedValue(selectedPriceRange, 1500); // this value will pick real time value, but will change it's result only when it's seattled for 500ms

  useEffect(() => {
    if (minValueError || maxValueError) return;
    if (isNaN(selectedPriceRange?.[0]) || isNaN(selectedPriceRange[1])) return;

    // props.setPrice([selectedPriceRange?.[0], selectedPriceRange[1]]);
  }, [debouncedValue]);

  return (
    <Box>
      <CustomSelect
        fullWidth
        IconComponent={KeyboardArrowDownRoundedIcon}
        className="select-dropdown selectDropDownBox feerange-dropdown"
        value={currency}
        onChange={handleCurrencyChange}
        MenuProps={MenuProps}
      >
        <MenuItem className="selectDropDownList" value="none" disabled>
          Currency
        </MenuItem>
        {currencies?.map((option: any) => (
          <MenuItem className="selectDropDownList" value={option.id} key={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </CustomSelect>
      <Box className="feerange"></Box>
      <CustomRangeSlider
        className="rangeSliderFilter"
        getAriaLabel={() => 'Fee range'}
        value={selectedPriceRange}
        valueLabelFormat={numFormatter}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        // step={(10 / 100) * maxValue}
        step={null}
        marks={marks1}
      />
      <Box className="min-max">
        <Typography variant="h6"> Min </Typography>
        <Typography variant="h6"> Max </Typography>
      </Box>
      <Box className="feerange-values">
        <Box>
          <TextField
            type="text"
            name="min_value"
            onChange={handleInputPriceChange}
            onBlur={() => setIsChange(false)}
            placeholder="Min value"
            value={minStringValue}
            InputProps={{ inputProps: { min: 0 } }}
            // @ts-ignore
            className={maxValue && minValueError ? 'errorTextField' : ''}
          />
        </Box>
        <Box>
          <Typography variant="h6"> to</Typography>
        </Box>
        <Box className='maxValue'>
          <TextField
            type="text"
            onChange={handleInputPriceChange}
            onBlur={() => setIsChange(false)}
            name="max_value"
            placeholder="Max value"
            value={maxStringValue}
            InputProps={{ inputProps: { min: 0 } }}
            // @ts-ignore
            className={minValue && maxValueError ? 'errorTextField' : ''}
          />
        </Box>
      </Box>
      {minValueError ? (
        <Typography fontSize={'12px'} marginBottom={'8px'} color={'#C75227'}>
          Min value must be smaller then max value
        </Typography>
      ) : (
        ''
      )}

      {maxValueError ? (
        <Typography fontSize={'12px'} marginBottom={'8px'} color={'#C75227'}>
          Max value must be greater then min value
        </Typography>
      ) : (
        ''
      )}
      {mainMinValueError ? (
        <Typography fontSize={'12px'} marginBottom={'8px'} color={'#C75227'}>
          Min value must be smaller then slider min value
        </Typography>
      ) : (
        ''
      )}
      {/* {mainMaxValueError ? (
        <Typography fontSize={'12px'} marginBottom={'8px'} color={'#C75227'}>
          Max value must not be greater then Slider max value
        </Typography>
      ) : (
        ''
      )} */}
      <Box className="includedPrivateFee">
        <FormControlLabel
          control={
            <Checkbox
              disableRipple
              className="isPrivateFee"
              name={'isPrivateFee'}
              checked={isChecked}
              onChange={handleCheckboxChange}
              key={placeholderType.common.includePrivateFees}
              checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
              icon={<img src={Images.Radiounchecked} alt="checkbox" />}
            />
          }
          label={placeholderType.common.includePrivateFees}
        />
      </Box>
    </Box>
  );
};
export default FeeRangeStallionMemorized;
