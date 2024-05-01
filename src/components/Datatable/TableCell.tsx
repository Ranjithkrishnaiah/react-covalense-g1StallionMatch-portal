import { useState } from 'react';
import { MenuItem, StyledEngineProvider, Typography } from '@mui/material'
import { CustomSelect } from '../CustomSelect';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CustomizedSwitches from '../Switch'
import './DataList.css';
import { WrapperDialog } from '../WrappedDialog/WrapperDialog';
import UserAccess from 'src/forms/UserAccess';
import { MenuProps } from 'src/constants/MenuProps';

interface SwitchProps {
    disabled: boolean;
    checked: boolean;
    defaultChecked?: boolean;
}

interface TableCellProps {
    tableIdentifier: string;
    index: number;
    value: string | number | SwitchProps | boolean |undefined;
    rowValues: any
}

function TableCell(props: TableCellProps) {
    const { tableIdentifier, index, value, rowValues } = props;
    {tableIdentifier === "MY-STALLIONS" && console.log("TAM: ", tableIdentifier, index, value)}
    

    // const [openUserAccess,setOpenUserAccess] = useState(false);

    const handleUserAccess = (e : any)=>{
        // if(e.target.value === "3rd Party"){
        //     setOpenUserAccess(true);
        // }
    }

    if( tableIdentifier === "FD-USERLIST" && index === 2 || tableIdentifier === "LIST-USERLIST" && index === 3){
        // console.log("USER DETAILS: ", rowValues.id, rowValues.name, rowValues.src);
        return(
            <StyledEngineProvider injectFirst>
            <CustomSelect                    
                IconComponent ={KeyboardArrowDownIcon}
                sx={ { height: '40px' } }
                className='selectDropDownBox sort-recent'
                defaultValue={value}
                onChange={handleUserAccess}
                MenuProps={MenuProps}
                >
                <MenuItem className='selectDropDownList' value={"Full Access"}>Full Access</MenuItem>
                <MenuItem className='selectDropDownList' value={"View Only"}>View Only</MenuItem>
                <MenuItem className='selectDropDownList' value={"3rd Party"}>3rd Party</MenuItem>
            </CustomSelect>
            {/* <WrapperDialog
            open = { openUserAccess}
            title = "User Access"
            onClose = { () => setOpenUserAccess(false) }
            body = { UserAccess }
            userId = {props.rowValues.id}
            userImage = { props.rowValues.src }
            userName = { props.rowValues.name }
            /> */}
            </StyledEngineProvider>
        )
    }
    
    if(tableIdentifier === "MY-STALLIONS" && index === 4){
        if(value !== undefined && typeof value === 'object'){
            return(
                <CustomizedSwitches defaultChecked = {true} { ...value }/>
            )
        }
    }
    if(tableIdentifier === "EMPTY-COLUMN-NAMES-DASHBOARD-MARELISTS" && index === 0){
        return <Typography component='span' sx={ { textAlign: 'center' } } className="marelist-table-head"> {value}</Typography>
    }
    else if(tableIdentifier === "EMPTY-COLUMN-NAMES-DASHBOARD-REPORTS-ORDERED" && index === 0){
        return <Typography component='span' sx={ { textAlign: 'center' } } className="marelist-table-head"> {value}</Typography>
    }
    else if(tableIdentifier === "EMPTY-COLUMN-NAMES-MARE-LIST" && index === 0){
        return <Typography component='span' sx={ { textAlign: 'center' } } className="marelist-table-head"> {value}</Typography>
    }
    
  return (
    <Typography component='span' sx={ { textAlign: 'center' } }> {value}</Typography>
  )
}

export default TableCell