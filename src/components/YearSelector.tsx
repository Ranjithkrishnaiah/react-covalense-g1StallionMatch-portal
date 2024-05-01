import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { CustomSelect } from "./CustomSelect";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { MenuItem } from "@mui/material";
import { useGetYearToStudQuery } from "src/redux/splitEndpoints/getYearToStudSplit";
export default function YearSelector(props: any) {

  const { data: yearsList } = useGetYearToStudQuery()



  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {yearsList && <CustomSelect
         fullWidth
         IconComponent={KeyboardArrowDownRoundedIcon}
         className='select-dropdown selectDropDownBox'
         defaultValue={'none'}
      {...props}
      
        renderInput={(params : any) => <TextField {...params} helperText={null} />}
      >
          <MenuItem className='selectDropDownList' value="none" disabled>
      <em>Year</em>
    </MenuItem>
   {yearsList.map(( { id , label } : {id : number, label :number}) => (
          <MenuItem className='selectDropDownList' value={id} key={id}>{label}</MenuItem>
      ))}
         </CustomSelect>}
      
      </LocalizationProvider>
  );
}
