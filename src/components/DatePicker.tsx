import TextField from "@mui/material/TextField";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from "@mui/lab";
import { DesktopDatePicker } from "@mui/lab";
import { SxProps } from "@mui/system";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IconButton } from "@mui/material";
import { Images } from "src/assets/images";

interface DateProps {
    value : Date | null,
    handleChange : (value : any) => void,
    maxDate?: any
}

export default function DatePicker(props : DateProps ) {
  const {value,handleChange,maxDate} = props;

  const paperSx: SxProps = {
 
    "& .MuiPaper-root": {
      paddingBottom: '10px !important',
      borderRadius: '8px !important',

    },

    "& .css-epd502": {
      minWidth: '382px',
      maxHeight: '431px',

    },

    "& .MuiCalendarPicker-root": {
      backgroundColor: "#ffffff",
      borderRadius: '8px !important',
      maxHeight: '431px',
      width: '100%',
      position:'relative',
    },
    
    "& .MuiCalendarPicker-root .css-1dozdou": {
      marginTop:'33px',
      paddingLeft: '39px',
      marginBottom: '24px',
    },

    "& .MuiCalendarPicker-root .css-l0iinn": {
      marginLeft: 'auto',
      color: '#005632',
      fontFamily: 'synthese-bold',
      fontWeight: '700',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '-0.01em',
      textTransform:'uppercase',
    },

    "& .MuiCalendarPicker-root .PrivatePickersSlideTransition-root": {
      overflow: 'hidden',
      paddingBottom: '10px',
      minHeight: '310px',

    },
    "& .MuiCalendarPicker-root .PrivatePickersSlideTransition-root .css-mvmu1r": {
      overflow: 'hidden',
      margin: '0px'

    },
    "& .MuiIconButton-edgeEnd": {
      position: 'absolute',
      top: '24px',
      left: '24px',
      width: '49px',
      height: '49px',
      border: 'solid 1px #F2F2F2',
      borderRadius: '4px',
      color: '#005632',
      background:'none',

    },

    "& .MuiIconButton-edgeStart": {
      position: 'absolute',
      top: '24px',
      right: '24px',
      width: '49px',
      height: '49px',
      border: 'solid 1px #F2F2F2',
      borderRadius: '4px',
      color: '#005632',
      background:'none',

    },

    "& .MuiIconButton-edgeStart.Mui-disabled,.MuiIconButton-edgeEnd.Mui-disabled ": {
      
      color: '#ccc',
     

    },


    "& .MuiIconButton-edgeStart svg,.MuiIconButton-edgeEnd svg": {
      fontSize: '16px',
    },

  
    "& .MuiCalendarPicker-root .css-195v8y8": {
      margin: 'auto',
      marginTop: '12px',
      fontFamily: 'synthese-bold',
      fontSize: '16px',
      textTransform: 'uppercase',
      color: '#005632'
    },

    "& .MuiCalendarPicker-viewTransitionContainer ": {
      overflowY: 'hidden'
    },

    "& .MuiTypography-root": {
      margin: '0 2px',
      padding: '0px 2px',
      fontWeight: '400',
      fontSize: '11px',
      lineHeight: '16px',
      color: '#979797',
      fontFamily: 'synthese-Regular',
      width: '45px',
      height: '30px',
    },

    "& .PrivatePickersMonth-root.MuiTypography-root": {
      margin: '0 2px',
      padding: '0px 2px',
      fontWeight: '400',
      fontSize: '14px',
      lineHeight: '16px',
      color: '#979797',
      fontFamily: 'synthese-Regular',
      width: '45px',
      height: '30px',
    },
    "& .PrivatePickersMonth-root.MuiTypography-root[disabled]": {
      
      color: '#ccc',
      
    },
    "& .MuiButtonBase-root svg.MuiSvgIcon-root.css-fd2y78-MuiSvgIcon-root,.MuiButtonBase-root svg.MuiSvgIcon-root.css-f4950f-MuiSvgIcon-root":{
      fill: '#007142',
    },
    "& .PrivatePickersMonth-root.MuiTypography-root.Mui-selected ": {
      color: '#fff',

    },
    "& .MuiMonthPicker-root": {
      margin: '0px auto 20px',
  },

    "&.MuiMonthPicker-root.css-n3vk4j-MuiMonthPicker-root": {
      margin: '0px auto 20px',
    },

    "& .MuiPickersDay-dayWithMargin": {
      fontFamily: 'synthese-bold',
      fontSize: '16px',
      margin: '2px',
      color: "#161716",
      backgroundColor: "#ffffff",
      padding: '10px 0px 12px',
      lineHeight: '23px',
      width: '45px',
      height: '45px'
    },

    "& .MuiPickersDay-dayWithMargin:hover": {
      backgroundColor: "#F4F1EF",
      borderRadius: '4px'
    },

    "& .MuiPickersDay-root.Mui-selected": {
      backgroundColor: "#007142",
      borderRadius: '4px',
      color: '#ffffff'
    },
    "& .PrivatePickersYear-yearButton.Mui-selected":{
      color: '#ffffff'
    },

    "& .MuiPickersDay-root.Mui-disabled": {
      color: '#CCCCCC'
    },
    "& .PrivatePickersYear-yearButton.Mui-disabled": {
      color: '#CCCCCC'
    },

    "& .MuiPickersDay-today": {
      border: '0 !important',
      backgroundColor: '#F4F1EF',
      borderRadius: '4px'
    },

    "& .MuiPickersDay-today:hover": {
      backgroundColor: '#d4d4d4',
    },
    "& .MuiTabs-root": { backgroundColor: "rgba(120, 120, 120, 0.4)" }
  };

   const Icon : any = () =>   <IconButton
   aria-label="toggle password visibility"
   edge="end"
   sx={ { marginRight: '3px', padding: '0px' } }>
  <img src={Images.Datepicker} alt='Date Picker'/>
 </IconButton>;

  return (

    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label=""
          inputFormat="dd.MM.yyyy"
          disablePast
          value={value}
          views={['year', 'day']}
          onChange={handleChange}
          PopperProps ={ { 
            placement:'auto-start',
            style: {...{left: '-400px'}},
            className:'date-box-wrapper'
          } }
          components={ {
            OpenPickerIcon: Icon ,
            LeftArrowIcon: ArrowBackIosNewRoundedIcon,
          RightArrowIcon: ArrowForwardIosRoundedIcon,
          } }
          PaperProps={ {
            sx: paperSx, 
          } }
         
          maxDate={maxDate && new Date(maxDate)}
          renderInput={(params : any) => <TextField  className="datepicker"  {...params}   inputProps={ {
            ...params.inputProps,
            placeholder: "Enter Date",
            readOnly:true

          } }
          />}
        />
      
    </LocalizationProvider>

 
  );
}
