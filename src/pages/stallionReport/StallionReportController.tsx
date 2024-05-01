import React, { useCallback, useEffect } from 'react';
import Header from './Header';
import StallionActivityChart from './StallionActivityChart';
import { Container, Typography, Stack, MenuItem, Divider } from '@mui/material';
import { Box } from '@mui/system';

import { CustomSelect } from 'src/components/CustomSelect';
import { CustomButton } from 'src/components/CustomButton';
import CustomDateRangePicker from 'src/components/customDateRangePicker/DateRangePicker';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import '../trends/trends.css';
import '../stallionRoaster/StallionAnalytics/StallionAnalytics.css';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import MatchedMares from 'src/components/MatchedMares';
import ProgenyTracker from 'src/components/ProgenyTracker';
import { DateRange } from 'src/@types/dateRangePicker';
import { MenuProps } from '../../constants/MenuProps';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import { useGetStallionInfoQuery } from 'src/redux/splitEndpoints/getStallionInfoSplit';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom'
import { useGetStallionAnalyticsQuery, useGetStallionCloseStatsQuery, useGetStallionKeyStatsQuery, useGetStallionMatchedActivityQuery } from 'src/redux/splitEndpoints/getStallionAnalyticsSplit';
import { Spinner } from 'src/components/Spinner';
import AnalyticsDetails from '../stallionRoaster/StallionAnalytics/AnalyticsDetails';
import useMetaTags from 'react-metatags-hook';
import useAuth from 'src/hooks/useAuth';
import HomePageController from '../homePage/HomePageController';
import { isValidToken } from 'src/utils/JWT'
import { dateConvert, getLastMonth, scrollToTop, toPascalCase, startOfMonth, startOfYear, startOfWeek } from 'src/utils/customFunctions';
import { Images } from 'src/assets/images';
import FullScreenDialog from 'src/components/fullscreenDialog/FullScreenWrapperDialog';

function StallionReportController() {
  let TOKEN = localStorage.getItem('accessToken');
  const { authentication } = useAuth()
  const navigate = useNavigate()

  const today = new Date();
  const lastMonth = getLastMonth()
  let initialDateRange = [lastMonth, today];
  const [dueDateValue, setDueDateValue] = React.useState<any>(initialDateRange);
  const [dateRangeValue, setDateRangeValue] = React.useState('This Month')
  const [open, setOpen] = React.useState(false);

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

  const { pathname } = useLocation();
  const viewArray = ["Today", "This Week", "This Month", "This Year", "Custom"];
  const pathSplitForStallion = pathname.split('/');
  const stallionID = pathSplitForStallion[3];
  const farmName = decodeURIComponent(pathSplitForStallion[4]);
  const farmID = pathSplitForStallion[5];
  let stallionId: any = stallionID;
  
  React.useEffect(() => {
    scrollToTop();
  }, []);

  let stateFilterForAnalytics = {
    filterBy: dateRangeValue,
    fromDate: dateRangeValue === 'Custom' ? dateConvert(dueDateValue[0] || null) : '',
    toDate: dateRangeValue === 'Custom' ? dateConvert(dueDateValue[1] || null) : '',
    stallionId
  }

  const { data: stallionsData } = useGetStallionInfoQuery(stallionId, { skip: !authentication, refetchOnMountOrArgChange: true });
  
  const {
    data: stallionAnalyticsKeyStatsData,
    isLoading,
  } = useGetStallionKeyStatsQuery(stateFilterForAnalytics, { skip: !authentication, refetchOnMountOrArgChange: true });
  const {
    data: stallionAnalyticsCloseData,
  } = useGetStallionCloseStatsQuery(stateFilterForAnalytics, { skip: !authentication, refetchOnMountOrArgChange: true });
  const {
    data: stallionMatchedActivityData,
    isSuccess: stallionMatchedActivityDataSuccess
  } = useGetStallionMatchedActivityQuery(stateFilterForAnalytics, { skip: !authentication, refetchOnMountOrArgChange: true });
  const [lineGrapData,setLineGraphData] = React.useState([]);

  useEffect(() => {
    if (stallionMatchedActivityDataSuccess) {
      setLineGraphData(stallionMatchedActivityData);
    }
  }, [stallionMatchedActivityDataSuccess])

  const RoasterAnalytics = [
    [
      {
        title: 'SM Searches',
        value: stallionAnalyticsCloseData ? stallionAnalyticsCloseData[0]?.SMSearches : 'N/A',
      },
      {
        title: '20/20 Matches',
        value: stallionAnalyticsCloseData ? stallionAnalyticsCloseData[0]?.TwentyTwentyMatches : 'N/A',
      },
      {
        title: 'Perfect Matches',
        value: stallionAnalyticsCloseData ? stallionAnalyticsCloseData[0]?.PerfectMatches : 'N/A',
      },
    ],
    [
      {
        title: 'Stallion Page Views',
        value: stallionAnalyticsCloseData ? stallionAnalyticsCloseData[0]?.PageViews : 'N/A',
      },
      {
        title: '# of Messages',
        value: stallionAnalyticsCloseData ? stallionAnalyticsCloseData[0]?.Messages : 'N/A',
      },
      {
        title: '# of Nominations',
        value: stallionAnalyticsCloseData ? stallionAnalyticsCloseData[0]?.Nominations : 'N/A',
      },
    ],
    [
      {
        title: '# of Runners',
        value: stallionAnalyticsKeyStatsData ? stallionAnalyticsKeyStatsData[0]?.TotalRunners : 'N/A',
      },
      {
        title: '# of Winners',
        value: stallionAnalyticsKeyStatsData ? stallionAnalyticsKeyStatsData[0]?.TotalWinners : 'N/A',
      },
      {
        title: '# of Stakes Winners',
        value: `${stallionAnalyticsKeyStatsData ? stallionAnalyticsKeyStatsData[0]?.TotalStakeWinners : 'N/A'}`,
      },
    ],
    [
      {
        title: 'SW/RNRS Strike Rate',
        value: `${stallionAnalyticsKeyStatsData ? stallionAnalyticsKeyStatsData[0]?.StakeWinnersRunnersPerc : 'N/A'}${stallionAnalyticsKeyStatsData ? '%' : ''}`,
      },
      {
        title: 'M/F Runners',
        value: `${stallionAnalyticsKeyStatsData ? stallionAnalyticsKeyStatsData[0]?.MaleRunners : 'N/A'} / ${stallionAnalyticsKeyStatsData ? stallionAnalyticsKeyStatsData[0]?.FemaleRunners : 'N/A'}`,
      },
      {
        title: 'Winners/Runners',
        value: `${stallionAnalyticsKeyStatsData ? stallionAnalyticsKeyStatsData[0]?.WinnersRunnersPerc : 'N/A'}${stallionAnalyticsKeyStatsData ? '%' : ''}`,
      },
    ],
  ];

  useMetaTags({
    title: `${toPascalCase(stallionsData?.horseName)} ${farmName} | Stallion Match`,
    description: "Details of Stallion match activity, Key statistics, Matched mares in Stallion match and prgeny tracker",
  }, [stallionsData])
  
  const checkForNull = (arr: any) => {
    return arr.some((el: any) => el === null);
  }

  const handleDueDate = (value: DateRange) => {
    if (!checkForNull(value)) {
      setDueDateValue(value);
    }
  };

  const handle = useFullScreenHandle();
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const openFullscreen = () => {
    handle.enter();
    setIsFullScreen(true);
  };
  const closeFullscreen = () => {
    handle.exit();
    setIsFullScreen(false);
  };
  const reportChange = useCallback(
    (state, handle) => {
      setIsFullScreen(state);
    },
    [handle]
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!authentication || !isValidToken(TOKEN ? TOKEN : "")) {
    // navigate('/')
    return <HomePageController />
  }

  return (
    <Container>
      <Header data={stallionsData && stallionsData} id={stallionID} dateRangeValue={dateRangeValue}  fromDate={dateConvert(dueDateValue[0])} toDate={dateConvert(dueDateValue[1])} farmName={farmName} farmID={farmID}/>
      <Box py={3} my={5} mb={0} pb={0} className="stallion-match-activity stallion-report-controller" sx={{ position: 'relative' }}>
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

        <FullScreenDialog className={`fullscreen report-chart ${open ? 'fullscreen-enabled' : ''}`} open={open} setOpen={setOpen}> 
          <Box className="SPtreechat StallionMatchActivityGraph">
            <Stack direction="row" className="StallionMatchActivityFS">
              {!open ? (
                <CustomButton className="ListBtn" disabled={stallionMatchedActivityData && stallionMatchedActivityData[0]?.data?.length === 0 || stallionMatchedActivityData === undefined} onClick={handleClickOpen}>
                  <i className="icon-Arrows-expand" /> Full Screen
                </CustomButton>
              ) : (
                <CustomButton className="ListBtn fullscreenBtn" onClick={handleClose}>
                  <img
                    src={Images.collapseicon}
                    alt="close"
                    className="collapse-icon"
                    onClick={handleClose}
                  />{' '}
                  Exit Full Screen
                </CustomButton>
              )}
            </Stack>
            <Box className="Linechart-StMatchActvty" sx={{ padding: '24px 40px 40px' }}>
              <StallionActivityChart stallionMatchedActivityData={stallionMatchedActivityData} stateFilterForAnalytics={stateFilterForAnalytics}/>
            </Box>
            <Box className="StMatchActvtyInfo" sx={{ padding: '24px 40px 30px' }}>
              <Stack
              className='graph-list-block-wrapper'
                pb={3}
                direction={{ xs: 'column', sm: 'row' }}
                divider={
                  <Divider
                    orientation="vertical"
                    sx={{ borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' }}
                    flexItem
                  />
                }
                spacing={2}
              >
                <Stack
                 className='graph-list-block'
                  direction={{ xs: 'row', sm: 'column' }}
                  sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                >
                  <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                    <Typography variant="h6">
                      <span className="circle-gr-trends" /> SM Searches
                    </Typography>
                  </Box>
                  <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                    <Typography variant="h4">{stallionMatchedActivityData ? stallionMatchedActivityData[0]?.totalSmSearches || 0 : 'N/A'}</Typography>
                  </Box>

                </Stack>
                <Stack
                className='graph-list-block'
                  direction={{ xs: 'row', sm: 'column' }}
                  sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                >
                  <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                    <Typography variant="h6">
                      <span className="circle-gr-trends green" /> 20/20 Matches
                    </Typography>
                  </Box>
                  <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                    <Typography variant="h4">{stallionMatchedActivityData ? stallionMatchedActivityData[0]?.totalTtMatches || 0 : 'N/A'}</Typography>
                  </Box>
                </Stack>

                <Stack
                 className='graph-list-block'
                  direction={{ xs: 'row', sm: 'column' }}
                  sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                >
                  <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                    <Typography variant="h6">
                      <span className="circle-gr-trends light-green" /> Perfect Matches
                    </Typography>
                  </Box>
                  <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                    <Typography variant="h4">{stallionMatchedActivityData ? stallionMatchedActivityData[0]?.totalPerfectMatches || 0 : 'N/A'}</Typography>
                  </Box>
                </Stack>
              </Stack>
              <Divider
                orientation="horizontal"
                sx={{
                  display: { md: 'none', sm: 'none', xs: 'block' },
                  borderBottom: 'solid 1px #B0B6AF',
                  mb: '1rem',
                }}
                flexItem
              />
            </Box>
          </Box>
        </FullScreenDialog>

        <Box className="KeyStatisticsWrapper stallion-keystatics-block" mt={10}>
          <Box className="KeyStatisticsHeader" mb={4}>
            <Typography variant="h3" sx={{ color: '#1D472E' }}>
              Key Statistics
            </Typography>
          </Box>
          {isLoading ? <Spinner /> : <AnalyticsDetails analytics={RoasterAnalytics} stallionAnalyticsCloseData={stallionAnalyticsCloseData} stallionAnalyticsKeyStatsData={stallionAnalyticsKeyStatsData} report={true} />}

        </Box>



        <Box className="matched-mare-table-wrapper" mt={10} mb={0}>
          <Typography variant="h3" sx={{ color: '#1D472E' }}>
            Matched Mares in Stallion Match
          </Typography>
          <Typography component="p" mt={2} className="matched-mare-table-para">
            View mares searched with your farm’s stallions and contact registered Stallion Match
            breeders.
          </Typography>
          <MatchedMares id={stallionID} filterBy={dateRangeValue} fromDate={dateConvert(dueDateValue[0])} toDate={dateConvert(dueDateValue[1])} />
          <ProgenyTracker id={stallionID} filterBy={dateRangeValue} fromDate={dateConvert(dueDateValue[0])} toDate={dateConvert(dueDateValue[1])} />
        </Box>
      </Box>
    </Container>
  );
}

export default StallionReportController;