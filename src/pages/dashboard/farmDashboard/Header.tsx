import { Box, Container, Grid, MenuItem, Stack, StyledEngineProvider, Typography } from '@mui/material'
import { useLocation } from 'react-router';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { MenuProps } from 'src/constants/MenuProps';
import CustomDateRangePicker from 'src/components/customDateRangePicker/DateRangePicker';
import { DateRange } from 'src/@types/dateRangePicker';
import { useEffect, useState } from 'react';
import '../../stallionRoaster/Roaster.css'
import { dateConvert, toPascalCase } from 'src/utils/customFunctions';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

type FarmHeaderProps = {
  farmName: string;
}
export default function Header(props : any) {  

  const {pathname} = useLocation();

  const pathSplitForFarm = pathname.split('/');
  const farmID = window.location.pathname.search('addStallion') === -1 ? pathSplitForFarm[pathSplitForFarm?.length - 1] : pathSplitForFarm[pathSplitForFarm?.length - 2];
  const currentFarm = props?.data?.filter((data : any)=> data?.farmId === farmID );
  const [filterValue, setFilterValue] = useState('This Month');
  const [dueDateValue, setDueDateValue] = useState<DateRange>([null, null]);
  const fromDateConverted = dateConvert(dueDateValue[0] || null);
  const toDateConverted = dateConvert(dueDateValue[1] || null);
  // const [isCustomDate, setIsCustomDate] = useState<any>(filterValue === 'Custom' ? true : false);
  // const [isNormalDate, setIsNormalDate] = useState<any>(filterValue === 'Custom' ? false : true);  
  // const mapReqest = (isCustomDate) ? { 'fromDate': fromDateConverted, 'toDate': toDateConverted, 'filterBy': filterValue} : { 'filterBy': filterValue}
  const [stateFilterForAnalytics,setstateFilterForAnalytics] = useState({
    filterBy: filterValue,
    fromDate: filterValue === 'Custom' ? fromDateConverted : '',
    toDate: filterValue === 'Custom' ? toDateConverted : '',
  })
  useEffect(() => {
    props.handleDatePicker({
      filterBy: filterValue,
      fromDate: filterValue === 'Custom' ? fromDateConverted : '',
      toDate: filterValue === 'Custom' ? toDateConverted : '',
    })
  },[])
  
  const handleDueDate = (value: DateRange) => {
    setDueDateValue(value);
    let obj = {
      ...stateFilterForAnalytics,
      fromDate:filterValue === 'Custom' ? dateConvert(value[0] || null) : '',
      toDate: filterValue === 'Custom' ? dateConvert(value[1] || null) :'',
    }
    setstateFilterForAnalytics(obj);
    props.setstateFilterForAnalytics(obj);
    props.handleDatePicker(obj);
  };
  const onFilterChange = (e : any) => {
    setFilterValue(e.target.value)
    let obj = {
      fromDate: e.target.value === 'Custom' ? fromDateConverted : '',
      toDate: e.target.value === 'Custom' ? toDateConverted : '',
      filterBy:e.target.value,
    }
    setstateFilterForAnalytics(obj);
    props.handleDatePicker(obj);
  }
  
  return (
    <>
    <StyledEngineProvider injectFirst>
        <Container maxWidth="lg">
            <Grid container  mt={5} mb={2} className='farmDashboardHeader'>
            <Grid item lg={12} sm={12} xs={12}>
                <HeaderBreadcrumbs
                  heading="Profile"
                  links={[
                    { name: 'Home', href: '/' },
                    { name: 'My Dashboard', href: '/dashboard' },
                    { name: currentFarm?.length && toPascalCase(currentFarm[0]?.farmName)?.toString() + ' Dashboard' || '' },
                  ]}
                />
                </Grid>
                <Grid item lg={8} sm={8} xs={12}>
                <Typography variant='h2'>
                   {currentFarm?.length && toPascalCase(currentFarm[0]?.farmName)} Dashboard
                    </Typography>
                </Grid>
                <Grid item lg={4} sm={4} xs={12}>
                <Stack
              className="stallionRoaster-innrhed"
              mt={2}
              direction="row"
              sx={ { justifyContent: { lg: 'flex-end', sm: 'flex-end', xs: 'left' }, display: 'flex' } }
            >
              <Box mr={1}>
                <CustomSelect
                disablePortal
                  className="selectDropDownBox NameBtn"
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  value = { filterValue }
                  onChange = { onFilterChange }
                  MenuProps={MenuProps}
                
                  defaultValue = {'Today'}
                >
                  {/* <MenuItem className="selectDropDownList" value={'none'} disabled>
                    Select
                  </MenuItem> */}
                  <MenuItem className="selectDropDownList" value="Today">
                    Today
                  </MenuItem>
                  {/* <MenuItem className="selectDropDownList" value="This Week">
                    This Week
                  </MenuItem> */}
                  <MenuItem className="selectDropDownList" value="This Month">
                    This Month
                  </MenuItem>
                  <MenuItem className="selectDropDownList" value="This Year">
                    This Year
                  </MenuItem>
                  <MenuItem className="selectDropDownList" value="Last Month">
                    Last Month
                  </MenuItem> 
                   <MenuItem className="selectDropDownList" value="Last Year">
                    Last year
                  </MenuItem>
                  <MenuItem className="selectDropDownList" value="Custom">
                    Custom
                  </MenuItem>
                  {/* <MenuItem className="selectDropDownList" value="name">
                    Name
                  </MenuItem> */}
                </CustomSelect>
              </Box>
              {filterValue === 'Custom' && <Box>
                <CustomDateRangePicker roster="roster" handleDueDate={handleDueDate} dueDate = {dueDateValue}/>
              </Box>}
            </Stack>
            </Grid>
        </Grid>
        </Container>
        </StyledEngineProvider>
    </>
  )
}
