import * as React from 'react';
// import { DateRange, DateRangePicker, Calendar } from 'react-date-range';
// import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css'; // theme css file
import './CustomDaterangepicker.css';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  StyledEngineProvider,
  SxProps,
  TextField,
  Tooltip,
  Popper,
  Popover,
  ClickAwayListener,
  Fade,
} from '@mui/material';
import { Images } from 'src/assets/images';
import { format } from 'date-fns';
import { dateHypenConvert, getLastMonth } from 'src/utils/customFunctions';
import { Calendar, DateObject } from 'react-multi-date-picker';

export default function CustomRangePicker(props: any) {
  const { handleDueDate } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectionRange, setSelectionRange] = React.useState<any>([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);
  // const [convertedDateRangeValue, setConvertedDateRangeValue] = React.useState("");

  const [openPopper, setOpenPopper] = React.useState(false);
  const handleDateRangeCalander = () => {
    setOpenPopper((openPopper) => !openPopper);
    // props.setConvertedDateRangeValue("");
    setSelectionRange([
      {
        startDate: new Date(),
        endDate: null,
        key: 'selection',
      },
    ]);
  };

  // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpenPopper((openPopper) => !openPopper);
    setIsOpen(true);
    // props.setConvertedDateRangeValue("");
    setSelectionRange([
      {
        startDate: new Date(),
        endDate: null,
        key: 'selection',
      },
    ]);
    // console.log(event.currentTarget, 'THIS > TARGET')
    // setTimeout(() => {
    //   let doc: HTMLCollection = document.getElementsByClassName('rdrMonthPicker');
    //   if (doc.length) {
    //     let select: any = doc[0].childNodes[0];
    //     // select.onfocus(function (this: any) {
    //     //   this.size = 20;
    //     // })
    //     // const eventFocus = new Event('focus');
    //     // select.dispatchEvent(eventFocus);
    //     // console.log(eventFocus,'THIS > focus called')
    //     select.addEventListener('focus', function (this: any) {
    //       console.log(this, 'THIS > focus')
    //       this.size = 6;
    //       select.classList.add('active-dropdown');
    //     })
    //     select.addEventListener('blur', function (this: any) {
    //       console.log(this, 'THIS > blur')
    //       this.size = 0;
    //       select.classList.remove('active-dropdown');
    //     })
    //     select.addEventListener('change', function (this: any) {
    //       console.log(this, 'THIS > change')
    //       this.size = 1;
    //       select.classList.remove('active-dropdown');
    //       const event = new Event('blur');
    //       select.dispatchEvent(event);
    //     })
    //     console.log(doc, select, 'DOC')
    //   }

    //   let doc1: HTMLCollection = document.getElementsByClassName('rdrYearPicker');
    //   if (doc1.length) {
    //     let select1: any = doc1[0].childNodes[0];
    //     // select1.onfocus(function (this: any) {
    //     //   this.size = 20;
    //     // })
    //     select1.addEventListener('focus', function (this: any) {
    //       console.log(this, 'THIS')
    //       this.size = 6;
    //       select1.classList.add('active-dropdown');
    //     })
    //     select1.addEventListener('blur', function (this: any) {
    //       console.log(this, 'THIS')
    //       this.size = 0;
    //       select1.classList.remove('active-dropdown');
    //     })
    //     select1.addEventListener('change', function (this: any) {
    //       console.log(this, 'THIS')
    //       this.size = 1;
    //       select1.classList.remove('active-dropdown');
    //       const event = new Event('blur');
    //       select1.dispatchEvent(event);
    //     })
    //     console.log(doc, select1, 'DOC')
    //   }
    // }, 1500);
  };

  const handleReset = () =>{
    props.setConvertedDateRangeValue('');
    props.setConvertedYobDateValue([null, null]);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const canBeOpen = openPopper && Boolean(anchorEl);
  const popperId = canBeOpen ? 'simple-popper' : undefined;

  const hidePopover = () => {
    setAnchorEl(null);
    setOpenPopper(false);
  };

  const today = new Date();
  const lastMonth = getLastMonth();
  let initialDateRange = [lastMonth, today];
  const [values, setValues]: any = React.useState([]);

  React.useEffect(() => {
    if (values[0] && values[1]) {
      const startDate = values[0] ? dateHypenConvert(values[0]) : '';
      const endDate = values[1] ? dateHypenConvert(values[1]) : '';
      props?.setConvertedDateRangeValue(startDate + ' - ' + endDate);
      props?.setConvertedYobDateValue([startDate, endDate])
      hidePopover();
      setIsOpen(false);
      // console.log(values, startDate, endDate, 'VAlues');
    }
  }, [values]);

  React.useEffect(() => {
    if (props.convertedDateRangeValue.length > 4) {
      const startDate = new DateObject(props.convertedDateRangeValue.substr(0, 11));
      const endDate = new DateObject(props.convertedDateRangeValue.substr(13));

      setValues([startDate,endDate]);
    } else {
      setValues([]);
    }
  }, [props.convertedDateRangeValue]);

  // React.useEffect(() => {
  //   if (props?.isTrends) {
  //     console.log('TRENDS: ', props?.convertedDateRangeValue);
  //     // onChangeDueDate(props.convertedDateRangeValue || [lastMonth, today]);
  //     handleDueDate(props?.convertedDateRangeValue);
  //   }

  //   if (props?.roster) {
  //     console.log('DDD: ', props?.convertedDateRangeValue);
  //     // onChangeDueDate(props.convertedDateRangeValue);
  //     handleDueDate(props?.convertedDateRangeValue);
  //     // setDateRangeValue(props.convertedDateRangeValue);
  //   }
  // }, [props?.convertedDateRangeValue]);

  const handleDueDateChange = (value: any) => {
    // console.log("DATE C: ",value)
    setValues(value);
    // handleDueDate(value);
  };

  // console.log('props.convertedDateRangeValue', props.convertedDateRangeValue);
  // console.log('setValues', values);

  return (
    <StyledEngineProvider injectFirst>
      <Box className="customDate">
        <FormControl className="datepicker" variant="filled">
          <OutlinedInput
            name="outlined-adornment-password"
            placeholder={props.placeholderText}
            // value={`${props.convertedDateRangeValue.length > 4 ? props.convertedDateRangeValue : ''}`}
            value={(values[0] && values[1]) ? `${values[0] && format(new Date(values[0]), 'dd MMM')} - ${values[1] && format(new Date(values[1]), 'dd MMM')}` : ''}
            className="DP-input"
            endAdornment={
              <InputAdornment position="end" sx={{ paddingLeft: '0px' }}>
               {(values[0] && values[1]) && <IconButton 
                  onClick={handleReset}
                  sx={{marginRight:'6px'}}> 
                  <img src={Images.regisclose} alt="Close" width="11px" height="11px"/>
                </IconButton>
            }

                <IconButton
                  aria-describedby={popperId}
                  onClick={handleClick}
                  aria-label="toggle password visibility"
                  edge="end"
                  sx={{ marginRight: '5px', padding: '0px' }}
                >
                  <img src={Images.Datepicker} alt="Date Picker" />
                </IconButton>
              </InputAdornment>
            }
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                // Backspace key is pressed, clear the date manually
                handleReset();
              }
            }}
          />

          {/* <DateRangePicker showOneCalendar /> */}

          {/* <DateRangePicker
                // editableDateInputs={false}
                // onChange={(item:any) => setSelectionRange([item.selection])}
                // moveRangeOnFirstSelection={true}
                // ranges={selectionRange}
                // direction="vertical"
                // retainEndDateOnFirstSelection={true}
                // dragSelectionEnabled={true}
                // rangeColors={['#007142', '#007142', '#007142']}
                // ariaLabels={{
                //   monthPicker: "month-picker",
                //   yearPicker: "year picker",
                // }}
                // preventSnapRefocus= {true}
              /> */}
              
        </FormControl>
      </Box>

      {isOpen && (
        <Popper
          id={popperId}
          open={openPopper}
          anchorEl={anchorEl}
          //  onClose={handleClose}
          className="customDateRangepicker"
          placement="auto"
          style={{ zIndex: 9 }}
          modifiers={[
            {
              name: 'offset',
              options: {
                enabled: true,
                offset: [0, 10],
              },
            },
          ]}
        >
          <ClickAwayListener onClickAway={(e: any) => hidePopover()}>
            <Box className="customDRpicker" sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
              <Calendar
                value={values}
                onChange={handleDueDateChange}
                // onChange={setValues}
                range
                rangeHover
                disabled={props.disabled ? props.disabled : false}
              />

              {/* <DateRangePicker
                // editableDateInputs={false}
                onChange={(item:any) => setSelectionRange([item.selection])}
                // moveRangeOnFirstSelection={true}
                ranges={selectionRange}
                // direction="vertical"
                // retainEndDateOnFirstSelection={true}
                // dragSelectionEnabled={true}
                // rangeColors={['#007142', '#007142', '#007142']}
                // ariaLabels={{
                //   monthPicker: "month-picker",
                //   yearPicker: "year picker",
                // }}
                // preventSnapRefocus= {true}
              /> */}
            </Box>
          </ClickAwayListener>
        </Popper>
      )}
    </StyledEngineProvider>
  );
}
