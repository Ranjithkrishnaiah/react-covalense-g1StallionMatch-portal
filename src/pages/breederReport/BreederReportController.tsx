import React from 'react';
import Header from './Header';
import { Container, Typography, Stack, MenuItem } from '@mui/material';
import { Box } from '@mui/system';

import { CustomSelect } from 'src/components/CustomSelect';
import CustomDateRangePicker from 'src/components/customDateRangePicker/DateRangePicker';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import '../trends/trends.css';
import '../stallionRoaster/StallionAnalytics/StallionAnalytics.css';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { DateRange } from 'src/@types/dateRangePicker';
import { useFullScreenHandle } from 'react-full-screen';
import useMetaTags from 'react-metatags-hook';

import { useLocation } from 'react-router';
import DottedWorldMap from 'src/components/chart/DottedWorldMap';
import { dateConvert, getLastMonth, scrollToTop, startOfMonth, startOfYear, startOfWeek } from 'src/utils/customFunctions';
import BreederMatchedMares from 'src/components/BreederMatchedMares';
import { useGetFarmDetailsQuery } from 'src/redux/splitEndpoints/getFarmDetailsSplit';
import { useBreederReportKeyStatsQuery } from 'src/redux/splitEndpoints/getbreederreportKeyStats';
import { toPascalCase } from 'src/utils/customFunctions';
import UnAuthorized from 'src/components/NoDataComponent/UnAuthorized';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function BreederReportController() {

  const today = new Date();
  const lastMonth = startOfMonth();
  const initialDateRange = [lastMonth, today]; 

  const [dueDateValue, setDueDateValue] = React.useState<any>(initialDateRange);
  const [dateRangeValue, setDateRangeValue] = React.useState('This Month')
  const viewArray = ["Today", "This Week", "This Month", "This Year", "Custom"];
  const { pathname } = useLocation();

  // Handle datepicker
  const handleDatePicker = (val: any)=> {
    if(val === 'Today') {
      setDueDateValue([today, today]);
    } else if(val === 'This Week') {
      const thisWeek = startOfWeek();
      setDueDateValue([thisWeek, today]);
    } else if(val === 'This Month') {
      const thisMonth = startOfMonth();
      setDueDateValue([thisMonth, today]);
    } else if(val === 'This Year') {
      const thisYear = startOfYear();
      setDueDateValue([thisYear, today])
    }
    setDateRangeValue(val);
  };

  

  const pathSplitForStallion = pathname.split('/');
  const stallionID = pathSplitForStallion[pathSplitForStallion?.length - 1];
  let stallionId: any = stallionID;

  const { data: farmDetails, isFetching: isFarmDetailFetching, isSuccess: isFarmDetailSuccess} = useGetFarmDetailsQuery(stallionID);
  let obj = { farmId: stallionID, fromDate: dateConvert(dueDateValue[0]), toDate: dateConvert(dueDateValue[1]), filterBy: dateRangeValue }
  const { data: analyticsData,status:reportKeyStatusForAuthUser  } = useBreederReportKeyStatsQuery(obj);
  const [farmInfos, setFarmInfos] = React.useState({farmName: ''});
  React.useEffect(() => {
    if (isFarmDetailSuccess) {
      setFarmInfos({...farmInfos, farmName: farmDetails?.farmName});
    }
  }, [isFarmDetailFetching])

  useMetaTags({
    title: `${toPascalCase(farmDetails?.farmName)}'s Farm Breeder Report | Stallion Match`,
    description: "Stallion Match Breeders Reports - the data backed Stallion Match for the best pedigree.",
  }, [farmDetails, isFarmDetailFetching])


  React.useEffect(() => {
    scrollToTop();
  }, []);
  
  //updates the Due date value
  const handleDueDate = (value: DateRange) => {
    setDueDateValue(value);
  };
  const handle = useFullScreenHandle();
  let isFullScreen = false;

  const handleFullscreen = () => {
    handle.enter();
    isFullScreen = true;
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        marginLeft: '0',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  }

  if(reportKeyStatusForAuthUser === 'rejected') {
    return <UnAuthorized/>
  }

  return (
    <Container>
      <Header data={farmDetails && farmDetails} id={stallionID} dateRangeValue={dateRangeValue} fromDate={dateConvert(dueDateValue[0])} toDate={dateConvert(dueDateValue[1])} />
      <Box py={3} my={5} className="stallion-match-activity breeder-report-control" sx={{ position: 'relative' }}>
        <Box className="trends-header-wrapper" pt={1} pb={{ sm: '0', md: '26px', lg: '26px' }}>
          <Stack direction={{ lg: 'row', xs: 'column' }} className="trends-header-wrapper-inner">
            <Box flexGrow={1}>
              <Typography variant="h3" sx={{ color: '#1D472E' }}>
                Stallion Match Activity
              </Typography>
            </Box>
            <Box className="trends-header-wrapper-left">
              <Box className="trends-popover">
                <CustomSelect
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  defaultValue={dateRangeValue}
                  className="selectDropDownBox trends-select-box"
                  MenuProps={MenuProps}
                  onChange={(e: any) => handleDatePicker(e.target.value)}
                >
                  <MenuItem className="selectDropDownList" value="none" disabled>
                    View
                  </MenuItem>
                  {viewArray.map((option: string) => (
                    <MenuItem
                      className="selectDropDownList"
                      key={option}
                      value={option}>
                      {option}</MenuItem>
                  ))}
                </CustomSelect>
              </Box>
              {dateRangeValue === "Custom" &&
                <Box className="trends-activty-button">
                  <form className="" autoComplete="false">
                    <CustomDateRangePicker handleDueDate={handleDueDate} />
                  </form>
                </Box>}
            </Box>
          </Stack>
        </Box>
          <Box className='dotted-map'>
            <DottedWorldMap id={stallionID} fromDate={dateConvert(dueDateValue[0])} toDate={dateConvert(dueDateValue[1])} dateRangeType={dateRangeValue} />
          </Box>
        <Box className="KeyStatisticsWrapper" mt={9}>
          <Box className="KeyStatisticsHeader" mb={4}>
            <Typography variant="h3" sx={{ color: '#1D472E' }}>
              Key Statistics
            </Typography>
          </Box>
          <Box className="stallion-analytics">
            <Stack
              className="stallion-analytics-row stallion-analytics-grid-row"
              pb={3}
              spacing={1.5}
            >
              {analyticsData?.map((v: any, i: number) => {
                return (
                  <>
                    <Stack
                      className="key-statics-box"
                      direction={{ xs: 'row', sm: 'column' }}
                      sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                      key={i}
                    >
                      <Box className="key-statics-box-left" sx={{ width: { md: '100%', sm: '100%', xs: '50%' } }}>
                        <Typography variant="h6">
                          {v.KPI}
                          {i === 0 && <HtmlTooltip
                            enterTouchDelay={0}
                            leaveTouchDelay={6000}
                            className="CommonTooltip studfee-tooltip keybox-tooltip"
                            placement="bottom-start"
                            title={
                              <React.Fragment>
                                {'Info'} {'  '} .{' '}
                              </React.Fragment>
                            }
                          >
                            <i className="icon-Info-circle"></i>
                          </HtmlTooltip>}
                        </Typography>
                      </Box>
                      <Box
                      className="key-statics-box-right"
                        sx={{
                          width: { md: '100%', sm: '100%', xs: '50%' },
                          display: 'flex',
                          alignItems: 'end',
                        }}
                      >
                        <Typography variant="h4" className={`${v.KPI === 'Most Popular Location' || v.KPI === 'Most Popular Broodmare Sire' || v.KPI === 'Most Popular Mare' ? v?.CurrentName?.length > 12 ? 'text-increased-class' : '' : ''}`} >{(v.KPI === 'Breeder Email Rate') ?  v?.diffPercent+'%' : (v.KPI === 'Most Popular Location' || v.KPI === 'Most Popular Broodmare Sire' || v.KPI === 'Most Popular Mare') ? toPascalCase(v?.CurrentName) : v?.CurrentValue}</Typography>
                        <Typography component="span" className={`key-statics-arrow ${v.Diff === 0 ? 'arrowUpBlock' : v.Diff > 0 ? 'arrowUpBlock' : 'arrowDownBlock'}`}>
                          {v.KPI === 'Most Popular Location' || v.KPI === 'Most Popular Broodmare Sire' || v.KPI === 'Most Popular Mare' ? '' : v.Diff === 0 ? '' : v.Diff > 0 ? <i className='icon-Arrow-up' /> : <i className='icon-Arrow-down' />} {v.KPI === 'Most Popular Location' || v.KPI === 'Most Popular Broodmare Sire' || v.KPI === 'Most Popular Mare' ? '' : Math.abs(v.Diff) > 0 && Math.abs(v.Diff)}
                        </Typography>
                      </Box>
                    </Stack>
                  </>
                )
              })
              }
            </Stack>   
          </Box>
        </Box>
        <Box className="matched-mare-table-wrapper" mt={10} mb={10}>
          <Typography variant="h3" sx={{ color: '#1D472E' }}>
            Matched Mares in Stallion Match
          </Typography>
          <Typography component="p" mt={2} className="matched-mare-table-para">
            View mares searched with your farm’s stallions and contact registered Stallion Match
            breeders.
          </Typography>
          <BreederMatchedMares id={stallionID} filterBy={dateRangeValue} fromDate={dateConvert(dueDateValue[0])} toDate={dateConvert(dueDateValue[1])} />
        </Box>
      </Box>
    </Container>
  );
}

export default BreederReportController;