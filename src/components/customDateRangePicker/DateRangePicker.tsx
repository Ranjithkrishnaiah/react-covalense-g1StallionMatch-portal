import { format } from 'date-fns';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  StyledEngineProvider,
  SxProps,
} from '@mui/material';
import {
  dateConvert,
  useDatePicker,
  getLastMonth,
  dateHypenConvert,
} from '../../utils/customFunctions';
import { Images } from 'src/assets/images';
import './Daterangepicker.css';
import useAuth from 'src/hooks/useAuth';
import { useEffect, useState } from 'react';
import CustomRangePicker from './CustomRangePicker';

type DisplayTimeProps = {
  startTime: number | string;
  endTime: number | string;
  onOpenPicker: VoidFunction;
  sx?: SxProps;
  dateSortSelected: string;
};

export default function CustomDateRangePicker(props: any) {
  const { dueDate, startTime, endTime, onChangeDueDate, openPicker, onOpenPicker, onClosePicker } =
    useDatePicker({
      date: [null, null],
    });
  const { handleDueDate, setDueDate } = props;

  const today = new Date();
  const lastMonth = getLastMonth();

  const initialDateRange = props?.isTrends ? [lastMonth, today] : [null,null];

  const [selectRange, setSelectedRange] = useState<any>('');
  const [dateRangeValue, setDateRangeValue] = useState(dueDate);

  const [maxDate, setMaxDate] = useState(props?.maxDate);

  const maxDateTemp = dateConvert(maxDate);

  useEffect(() => {
    if (props?.isTrends) {
      onChangeDueDate(props.dueDate || [lastMonth, today]);
      handleDueDate(props.dueDate || [lastMonth, today]);
    }

    if (props?.roster) {
      onChangeDueDate(props.dueDate);
      handleDueDate(props.dueDate);
      setDateRangeValue(props.dueDate);
      setSelectedRange(props.dueDate);
    }
  }, [props.dueDate]);

  //updates the date value
  const handleDueDateChange = (value: any) => {
    handleDueDate(value);
    onChangeDueDate(value);
    setDateRangeValue(value);
    setSelectedRange(value);
  };

  const disableIfbothdateSame = (date: any) => {
    if (props?.roster) {
      if (dateRangeValue.length) {
        if (String(dateRangeValue[0]) === String(date)) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }
    return false;
  };
  //convert the date formate into "startDate + ' - ' + endDate"
  const convertedDate = () => {
    const dateToConvert = selectRange || initialDateRange;
    const startDate = dateToConvert[0] ? dateHypenConvert(dateToConvert[0]) : '';
    const endDate = dateToConvert[1] ? dateHypenConvert(dateToConvert[1]) : '';
    return startDate + ' - ' + endDate;
  };

  return (
    <StyledEngineProvider injectFirst>
        <CustomRangePicker
          roster="roster"
          convertedDateRangeValue={convertedDate()}
          setConvertedYobDateValue={handleDueDateChange}
          setConvertedDateRangeValue={() => {}}
          placeholderText ={props.placeholder ? props.placeholder : "Enter Date Range"}
          />
    </StyledEngineProvider>
  );
}

export function DisplayTime({
  startTime,
  endTime,
  onOpenPicker,
  sx,
  dateSortSelected,
}: DisplayTimeProps) {
  const style = {
    typography: 'caption',
    cursor: 'pointer',
    '&:hover': { opacity: 0.72 },
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box sx={{ ...style, ...sx }}>
        <FormControl className="date-picker" variant="standard">
          <OutlinedInput
            onClick={onOpenPicker}
            id="outlined-adornment-password"
            placeholder="Enter date range"
            value={`${format(new Date(startTime), 'dd MMM')} - ${format(
              new Date(endTime),
              'dd MMM'
            )}`}
            className="DP-input"
            endAdornment={
              <InputAdornment position="end" sx={{ paddingLeft: '0px' }}>
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  sx={{ marginRight: '3px', padding: '0px' }}
                >
                  <img src={Images.Datepicker} alt="Date Picker" />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </StyledEngineProvider>
  );
}
