import React, { useEffect, useCallback, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  StyledEngineProvider,
  Typography,
  Stack,
  MenuItem,
  Divider,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import GridWrapper from 'src/components/GridWrapper';
import DataTable from 'src/components/Datatable/DataTable';
import HorseWrapper from './HorseWrapper';
import Activity from './Activity';
import { ActivityProps } from 'src/@types/trends';
import * as Props from 'src/constants/TrendsConstants';
import Header from './Header';
import useAuth from 'src/hooks/useAuth';
import Signup from '../../components/Signup';
import HottestCross from './HottestCross';
import RegisterFarm from './RegisterFarm';
import './trends.css';
import { CustomSelect } from 'src/components/CustomSelect';
import { CustomButton } from 'src/components/CustomButton';
import CustomDateRangePicker from 'src/components/customDateRangePicker/DateRangePicker';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { getLastMonth, scrollToTop } from '../../utils/customFunctions';
import { DateRange } from 'src/@types/dateRangePicker';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { dateConvert } from 'src/utils/customFunctions';
import { useCookies } from 'react-cookie';
import { transformResponse } from 'src/utils/FunctionHeap';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { Images } from 'src/assets/images';
import FullScreenDialog from 'src/components/fullscreenDialog/FullScreenWrapperDialog';
import StallionActivityChart from '../stallionReport/StallionActivityChart';
import NoDataTrendsPage from './NoDataTrendsPage';
import CustomRangePicker from 'src/components/customDateRangePicker/CustomRangePicker';

//Queries APIs
import { useGetMostSearchedStallionsQuery } from 'src/redux/splitEndpoints/getMostSearchedStallions';
import { useGetTopPerformingStallionQuery } from 'src/redux/splitEndpoints/getTopPerformingStallion';
import { useGetMostPopularDamsireQuery } from 'src/redux/splitEndpoints/getMostPopularDamsire';
import { useGetMostPopularStallionQuery } from 'src/redux/splitEndpoints/getMostPopularStallion';
import { useGetFarmActivityQuery } from 'src/redux/splitEndpoints/getFarmActivity';
import { useGetMostMatchedDamsireQuery } from 'src/redux/splitEndpoints/getMostMatchedDamsires';
import { useGetTopT_TwentyBroodmareSiresQuery } from 'src/redux/splitEndpoints/getTopTen20_20BroodmareSires';
import { useGetTopT_TwentySiresQuery } from 'src/redux/splitEndpoints/getTopTen20_20Sires';
import { useGetHottestCrossQuery } from 'src/redux/splitEndpoints/getHottestCross';
import { useGetStallionMatchActivityTrendsQuery } from 'src/redux/splitEndpoints/getStallionMatchActivityTrends';
import { useGetTopTenPerfectMatchMatchedSireQuery } from 'src/redux/splitEndpoints/getTopTenPerfectMatchMatchedSire';
import { useGetTopTenPerfectMatchedBroodMareSireQuery } from 'src/redux/splitEndpoints/getTopTenPerfectMatchedBroodMareSire';
import { usePageDataSplitQuery } from 'src/redux/splitEndpoints/pageDataSplit';
import { useGetMostMatchedSireQuery } from 'src/redux/splitEndpoints/getMostMatchedSire';
import { useGetTopMatchedBroodMareSireQuery } from 'src/redux/splitEndpoints/getTopMatchedBroodMareSire';

// MetaTags
import useMetaTags from 'react-metatags-hook';
import { useGetAllStallionLocationsQuery } from 'src/redux/splitEndpoints/getAllStallionLocationsSplit';

function TrendsController() {
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const trendsPageUrl = `${BaseAPI}stallion-trends`;
  const tendsImage = process.env.REACT_APP_TRENDS_IMAGE;
  const trendsPageId = process.env.REACT_APP_TRENDS_PAGE_ID;

  // Meta tags for trends page
  useMetaTags(
    {
      title: `Race Horse Breeding Data | Stallion Match`,
      description: `All the latest matches, trends and data in one place. At a glance, view the top performing and most searched thoroughbred stallions and farm activity from around the world.`,
      openGraph: {
        title: `Race Horse Breeding Data | Stallion Match`,
        description: `All the latest matches, trends and data in one place. At a glance, view the top performing and most searched thoroughbred stallions and farm activity from around the world.`,
        site_name: 'Stallion Match',
        url: trendsPageUrl,
        type: 'business.business',
        image: tendsImage,
      },
    },
    []
  );

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps: any = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '2px',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };
  const DateOptionsArray = [
    'Today',
    'This Month',
    'This Year',
    'Last Month',
    'Last Year',
    'Custom',
  ];

  const [cookie] = useCookies();
  const { user, authentication } = useAuth();
  const userDetails = JSON.parse(window.localStorage.getItem("user") || '{}');

  const [country, setCountry] = useState<any | undefined>(authentication ? userDetails?.memberaddress[0]?.countryId || '11' : (cookie.country || '11'));

  const today = new Date();
  const lastMonth = getLastMonth();
  let initialDateRange = [lastMonth, today];
  const [dueDate, setDueDate] = useState<any>(initialDateRange);
  const [isDateSorted, setDateSort] = useState('This month');
  const [dateSortSelected, setDateSortSelected] = useState('This Month');
  const [open, setOpen] = React.useState(false);

  // Trends page tiles state
  const [topPerformingStallionDueDate, setTopPerformingStallionDueDate] =
    useState<any>(initialDateRange);
  const [mostPopularStallionDueDate, setMostPopularStallionDueDate] =
    useState<any>(initialDateRange);
  const [mostPopularDamsireDueDate, setMostPopularDamsireDueDate] = useState<any>(initialDateRange);
  const [mostMatchedDamsireDueDate, setMostMatchedDamsireDueDate] = useState<any>(initialDateRange);
  const [mostMatchedSireDueDate, setMostMatchedSireDueDate] = useState<any>(initialDateRange);
  const [top10PerfectMatchedSiresDueDate, setTop10PerfectMatchedSiresDueDate] =
    useState<any>(initialDateRange);
  const [topBroodMareSireDueDate, setTopBroodMareSireDueDate] = useState<any>(initialDateRange);
  const [topTenPerfectMatchedBroodMareSireDueDate, settopTenPerfectMatchedBroodMareSireDueDate] =
    useState<any>(initialDateRange);
  const [mostSearchedStallionDueDate, setMostSearchedStallionDueDate] =
    useState<any>(initialDateRange);
  const [farmActivityDueDate, setFarmActivityDueDate] = useState<any>(initialDateRange);
  const [stallionMatchedActivityTrendsDueDate, setStallionMatchedActivityTrendsDueDate] =
    useState<any>(initialDateRange);
  const [HottestCrossDueDate, setHottestCrossDueDate] =
    useState<any>(initialDateRange);
  const [defaultMatchedSireListsFilterOption, setDefaultMatchedSireListsFilterOption] =
    useState('Name');
  const [
    default10PerfectMatchedSireListsFilterOption,
    setDefault10PerfectMatchedSireListsFilterOption,
  ] = useState('Name');
  const [
    defaultMatchedBroodmareSireListsFilterOption,
    setDefaultMatchedBroodmareSireListsFilterOption,
  ] = useState('Name');
  const [
    defaultTop10PerfectMatchedBroodmareSireListsFilterOption,
    setDefaultTop10PerfectMatchedBroodmareSireListsFilterOption,
  ] = useState('Name');

  // Call api for page Data 
  const { data: pageData, isFetching: pageDateIsFetching } = usePageDataSplitQuery(
    trendsPageId
  );

  // Hide and show the trends page tiles based on permission form admin
  const showTileBasedOnPermission = (title: string) => {
    let flag = true;
    let obj: any = {};
    if (pageData?.tilePermissions?.list.length) {
      for (let index = 0; index < pageData?.tilePermissions?.list?.length; index++) {
        const element = pageData?.tilePermissions?.list[index];
        if (element?.title === title) {
          obj = JSON.parse(JSON.stringify(element));
          if (authentication) {
            flag = !element?.isRegistered;
          } else {
            flag = !element?.isAnonymous;
          }
          break;
        }
      }
    }
    // console.log(flag, obj, 'FLAG');
    return flag;
  };

  // Api parameters
  const mostSearchedStallionParams = {
    order: 'DESC',
    page: 1,
    limit: 10,
    fromDate: dateConvert(mostSearchedStallionDueDate[0]),
    toDate: dateConvert(mostSearchedStallionDueDate[1]),
    countryId: country,
  };
  const topPerformingStallionParams = {
    countryId: country,
    fromDate: dateConvert(topPerformingStallionDueDate[0]),
    toDate: dateConvert(topPerformingStallionDueDate[1]),
  };
  const popularStallionParams = {
    countryId: country,
    fromDate: dateConvert(mostPopularStallionDueDate[0]),
    toDate: dateConvert(mostPopularStallionDueDate[1]),
  };
  const popularDamsireParams = {
    countryId: country,
    fromDate: dateConvert(mostPopularDamsireDueDate[0]),
    toDate: dateConvert(mostPopularDamsireDueDate[1]),
  };
  const mostMatchedDamsireParams = {
    order: 'DESC',
    limit: 10,
    page: 1,
    countryId: country,
    fromDate: dateConvert(mostMatchedDamsireDueDate[0]),
    toDate: dateConvert(mostMatchedDamsireDueDate[1]),
  };
  const mostMatchedSireParams = {
    countryId: country,
    sortBy: defaultMatchedSireListsFilterOption,
  };
  const topTenPerfectMatchedSireParams = {
    countryId: country,
    sortBy: default10PerfectMatchedSireListsFilterOption,
  };
  const topMatchedBroodMareSireParams = {
    countryId: country,
    sortBy: defaultMatchedBroodmareSireListsFilterOption,
  };
  const top10PerfectMatchedBroodMareSireParams = {
    countryId: country,
    sortBy: defaultTop10PerfectMatchedBroodmareSireListsFilterOption,
  };

  const hottestCrossParams = {
    // order: 'DESC',
    // limit: 10,
    // page: 1,
    countryId: country,
    fromDate: dateConvert(HottestCrossDueDate[0]),
    toDate: dateConvert(HottestCrossDueDate[1]),
  };
  const farmActivityParams = {
    order: 'DESC',
    countryId: country,
    limit: 5,
    fromDate: dateConvert(farmActivityDueDate[0]),
    toDate: dateConvert(farmActivityDueDate[1]),
  };
  let stateFilterForAnalytics = {
    filterBy: dateSortSelected,
    fromDate:
      dateSortSelected === 'Custom'
        ? dateConvert(stallionMatchedActivityTrendsDueDate[0] || null)
        : '',
    toDate:
      dateSortSelected === 'Custom'
        ? dateConvert(stallionMatchedActivityTrendsDueDate[1] || null)
        : '',
    countryId: country,
  };

  // Api calls
  const { data: countriesList } = useCountriesQuery();
  const { data: stallionStateList } = useGetAllStallionLocationsQuery('');
  const {
    data: mostSearchedStallionData,
    isSuccess: isMostSearchedStallionsSuccess,
    isFetching: isMostSearchedStallionsFetching,
  } = useGetMostSearchedStallionsQuery(mostSearchedStallionParams, {
    skip:
      showTileBasedOnPermission('Most Searched Stallions') ||
      !country ||
      !mostSearchedStallionDueDate[0] ||
      !mostSearchedStallionDueDate[1],
  });

  const {
    data: topPerformingStallion,
    isSuccess: isTopPerformingStallionSuccess,
    isFetching: isTopPerformingStallionFetching,
  } = useGetTopPerformingStallionQuery(topPerformingStallionParams, {
    skip:
      showTileBasedOnPermission('Top Performing Stallion') ||
      !country ||
      !topPerformingStallionDueDate[0] ||
      !topPerformingStallionDueDate[1],
  });

  const {
    data: mostPopularStallion,
    isSuccess: isMostPopularStallionSuccess,
    isFetching: isMostPopularStallionFetching,
  } = useGetMostPopularStallionQuery(popularStallionParams, {
    skip:
      showTileBasedOnPermission('Most Popular Stallion') ||
      !country ||
      !mostPopularStallionDueDate[0] ||
      !mostPopularStallionDueDate[1],
  });

  const {
    data: mostPopularDamsire,
    isSuccess: isMostPopularDamsireSuccess,
    isFetching: isMostPopularDamsireFetching,
  } = useGetMostPopularDamsireQuery(popularDamsireParams, {
    skip:
      showTileBasedOnPermission('Most Popular Dam Sire') ||
      !country ||
      !mostPopularDamsireDueDate[0] ||
      !mostPopularDamsireDueDate[1],
  });

  const {
    data: mostMatchedDamsires,
    isSuccess: isMostMatchedDamsiresSuccess,
    isFetching: isMostMatchedDamsiresFetching,
  } = useGetMostMatchedDamsireQuery(mostMatchedDamsireParams, {
    skip:
      showTileBasedOnPermission('Most Matched Dam Sire') ||
      !country ||
      !mostMatchedDamsireDueDate[0] ||
      !mostMatchedDamsireDueDate[1],
  });

  const {
    data: mostMatchedSires,
    isSuccess: isMostMatchedSiresSuccess,
    isFetching: isMostMatchedSiresFetching,
  } = useGetMostMatchedSireQuery(mostMatchedSireParams, {
    skip:
      showTileBasedOnPermission('Top 10 20/20 Matched Sires') ||
      !country ||
      !mostMatchedSireDueDate[0] ||
      !mostMatchedSireDueDate[1],
  });

  const {
    data: top10PerfectMatchedSires,
    isSuccess: istop10PerfectMatchedSiresSuccess,
    isFetching: istop10PerfectMatchedSiresFetching,
  } = useGetTopTenPerfectMatchMatchedSireQuery(topTenPerfectMatchedSireParams, {
    skip:
      showTileBasedOnPermission('Top 10 Perfect Match Matched Sires') ||
      !country ||
      !top10PerfectMatchedSiresDueDate[0] ||
      !top10PerfectMatchedSiresDueDate[1],
  });

  const {
    data: topMatchedbroodmareSires,
    isSuccess: istopMatchedbroodmareSiresSuccess,
    isFetching: istopMatchedbroodmareSiresFetching,
  } = useGetTopMatchedBroodMareSireQuery(topMatchedBroodMareSireParams, {
    skip:
      showTileBasedOnPermission('Top 10 20/20 Matched Broodmare Sires') ||
      !country ||
      !topBroodMareSireDueDate[0] ||
      !topBroodMareSireDueDate[1],
  });

  const {
    data: top10PerfectMatchedbroodmareSires,
    isSuccess: istop10PerfectMatchedbroodmareSiresSuccess,
    isFetching: istop10PerfectMatchedbroodmareSiresFetching,
  } = useGetTopTenPerfectMatchedBroodMareSireQuery(top10PerfectMatchedBroodMareSireParams, {
    skip:
      showTileBasedOnPermission('Top 10 Perfect Match Matched Broodmare Sires') ||
      !country ||
      !topTenPerfectMatchedBroodMareSireDueDate[0] ||
      !topTenPerfectMatchedBroodMareSireDueDate[1],
  });

  const {
    data: hottestCrossData,
    isSuccess: ishottestCrosSuccess,
    isFetching: ishottestCrosFetching,
  } = useGetHottestCrossQuery(hottestCrossParams, {
    skip: showTileBasedOnPermission('Hottest Cross') || !country,
  });

  const {
    data: farmActivity,
    isSuccess: isFarmActivitySuccess,
    isFetching: isFarmActivityFetching,
  } = useGetFarmActivityQuery(farmActivityParams, {
    skip:
      showTileBasedOnPermission('Farm Activity') ||
      !country ||
      !farmActivityDueDate[0] ||
      !farmActivityDueDate[1],
  });

  const { data: stallionMatchedActivityData, isSuccess: stallionMatchedActivityDataSuccess } =
    useGetStallionMatchActivityTrendsQuery(stateFilterForAnalytics, {
      skip:
        showTileBasedOnPermission('Stallion Match Search Activity') ||
        !country ||
        !stallionMatchedActivityTrendsDueDate[0] ||
        !stallionMatchedActivityTrendsDueDate[1],
    });

  const hottestCrossDataProps = hottestCrossData?.length ? hottestCrossData[0] : {};

  const [transformedMostSearchedStallions, setTransformedMostSearchedStallions] = useState<any>([]);
  const [transformedTopPerformingStallion, setTransformedTopPerformingStallion] = useState<any>([]);
  const [transformedMostPopularStallion, setTransformedMostPopularStallion] = useState<any>([]);
  const [transformedMostPopularDamsire, setTransformedMostPopularDamsire] = useState<any>([]);
  const [transformedmostMatchedDamsires, setTransformedmostMatchedDamsires] = useState<any>([]);
  const [transformedmostMatchedSires, setTransformedmostMatchedSires] = useState<any>([]);
  const [transformed10PerfectMatchedSires, setTransformed10PerfectMatchedSires] = useState<any>([]);
  const [transformedtopMatchedBroodmareSires, setTransformedtopMatchedBroodmareSires] =
    useState<any>([]);
  const [
    transformedtop10PerfectMatchedBroodmareSires,
    setTransformedtop10PerfectMatchedBroodmareSires,
  ] = useState<any>([]);
  const [transformedFarmActivity, setTransformedFarmActivity] = useState<any>([]);


  // Transform the api response
  useEffect(() => {
    if (isMostSearchedStallionsSuccess && mostSearchedStallionData?.data) {
      setTransformedMostSearchedStallions(
        transformResponse(mostSearchedStallionData?.data, 'TRENDS-MOST-SEARCHED-STALLIONS')
      );
    } else {
      setTransformedMostSearchedStallions([]);
    }
  }, [isMostSearchedStallionsSuccess, mostSearchedStallionData]);

  useEffect(() => {
    if (isTopPerformingStallionSuccess && topPerformingStallion) {
      setTransformedTopPerformingStallion(
        transformResponse([topPerformingStallion], 'TRENDS-TOP-PERFORMING-STALLION')
      );
    } else {
      setTransformedTopPerformingStallion([]);
    }
  }, [isTopPerformingStallionSuccess, topPerformingStallion]);

  useEffect(() => {
    if (isMostPopularStallionSuccess && mostPopularStallion) {
      setTransformedMostPopularStallion(
        transformResponse([mostPopularStallion], 'TRENDS-MOST-POPULAR-STALLION')
      );
    } else {
      setTransformedMostPopularStallion([]);
    }
  }, [isMostPopularStallionSuccess, mostPopularStallion]);

  useEffect(() => {
    if (isMostPopularDamsireSuccess && mostPopularDamsire) {
      setTransformedMostPopularDamsire(
        transformResponse([mostPopularDamsire], 'TRENDS-MOST-POPULAR-DAMSIRE')
      );
    } else {
      setTransformedMostPopularDamsire([]);
    }
  }, [isMostPopularDamsireSuccess, mostPopularDamsire]);

  useEffect(() => {
    if (isMostMatchedDamsiresSuccess && mostMatchedDamsires) {
      setTransformedmostMatchedDamsires(
        transformResponse(mostMatchedDamsires, 'TRENDS-MOST-MATCHED-DAMSIRES')
      );
    } else {
      setTransformedmostMatchedDamsires([]);
    }
  }, [isMostMatchedDamsiresSuccess, mostMatchedDamsires]);

  useEffect(() => {
    if (istopMatchedbroodmareSiresSuccess && topMatchedbroodmareSires) {
      setTransformedtopMatchedBroodmareSires(
        transformResponse(topMatchedbroodmareSires, 'TRENDS-TOP-MATCHED-BROODMARESIRES')
      );
    } else {
      setTransformedtopMatchedBroodmareSires([]);
    }
  }, [istopMatchedbroodmareSiresSuccess, topMatchedbroodmareSires]);

  useEffect(() => {
    if (istop10PerfectMatchedbroodmareSiresSuccess && top10PerfectMatchedbroodmareSires) {
      setTransformedtop10PerfectMatchedBroodmareSires(
        transformResponse(
          top10PerfectMatchedbroodmareSires,
          'TOP-10-PERFECT-MATCH-BROODMARESIRES-SIRES'
        )
      );
    } else {
      setTransformedtop10PerfectMatchedBroodmareSires([]);
    }
  }, [istop10PerfectMatchedbroodmareSiresSuccess, top10PerfectMatchedbroodmareSires]);

  useEffect(() => {
    if (isMostMatchedSiresSuccess && mostMatchedSires) {
      setTransformedmostMatchedSires(
        transformResponse(mostMatchedSires, 'TRENDS-MOST-MATCHED-SIRES')
      );
    } else {
      setTransformedmostMatchedSires([]);
    }
  }, [isMostMatchedSiresSuccess, mostMatchedSires]);

  useEffect(() => {
    if (istop10PerfectMatchedSiresSuccess && top10PerfectMatchedSires) {
      setTransformed10PerfectMatchedSires(
        transformResponse(top10PerfectMatchedSires, 'TOP-10-PERFECT-MATCH-MATCHED-SIRES')
      );
    } else {
      setTransformed10PerfectMatchedSires([]);
    }
  }, [istop10PerfectMatchedSiresSuccess, top10PerfectMatchedSires]);

  useEffect(() => {
    if (isFarmActivitySuccess && farmActivity) {
      setTransformedFarmActivity(transformResponse(farmActivity, 'TRENDS-FARM-ACTIVITY'));
    } else {
      setTransformedFarmActivity([]);
    }
  }, [isFarmActivitySuccess, farmActivity]);

  // Set stallion match activity due date
  const handleStallionMatchDueDate = (value: DateRange) => {
    if (!checkForNull(value)) {
      setStallionMatchedActivityTrendsDueDate(value);
    }
  };

  // Check for null value
  const checkForNull = (arr: any) => {
    return arr?.some((el: any) => el === null);
  };

  // const handle = useFullScreenHandle();
  // const [isFullScreen, setIsFullScreen] = React.useState(false);
  // const openFullscreen = () => {
  //   handle.enter();
  //   setIsFullScreen(true);
  // };
  // const closeFullscreen = () => {
  //   handle.exit();
  //   setIsFullScreen(false);
  // };
  // const reportChange = useCallback(
  //   (state, handle) => {
  //     setIsFullScreen(state);
  //   },
  //   [handle]
  // );

  // Remove farm activity from timeline
  const handleRemoveActivity = (id: number) => {
    if (transformedFarmActivity.length) {
      let arr = transformedFarmActivity.filter((v: any, i: number) => id !== v.farmActivityId);
      setTransformedFarmActivity(arr);
    }
  };

  // on page render scroll to top
  useEffect(() => {
    scrollToTop();
  }, []);

  // select date from calendar
  const handleDatePicker = (event: SelectChangeEvent<any>): void => {
    setDateSortSelected(event.target.value);
    setDateSort(event.target.value);
  };

  // open fullscreen popup
  const handleClickOpen = () => {
    setOpen(true);
  };

  // close fullscreen popup
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Container>
        {/* Header component consist of country on changing country value data will change */}
        <Header
          countriesList={stallionStateList}
          setCountry={setCountry}
          country={country}
          defaultValue={authentication ? userDetails?.memberaddress[0]?.countryId || '11' : cookie.country}
        />

        {/* Show this header banner for registered user only */}
        {((pageDateIsFetching === false && authentication === true) && pageData?.headerBannerRegistered?.isRegistered) &&
          <Signup trends={true} headerBanner={pageData?.headerBannerRegistered} />
        }

        {/* Show this header banner for Anonymous user only */}
        {((pageDateIsFetching === false && authentication === false) && pageData?.headerBanner?.isAnonymous) &&
          <Signup trends={true} headerBanner={pageData?.headerBanner} />
        }

        {/* Show the particular tile based on permission form admin */}
        <Grid container spacing={3} className="trends-coloumn-wrapper">
          <Grid item lg={6} md={6} xs={12} className="trends-left-coloumn">
            <Grid container spacing={3}>
              {!showTileBasedOnPermission('Top Performing Stallion') && (
                <Grid item lg={12} xs={12} className="top-performing-stallion">
                  <GridWrapper
                    {...Props.topPerformingProps}
                    isTrends={true}
                    dueDate={topPerformingStallionDueDate}
                    setDueDate={setTopPerformingStallionDueDate}
                  >
                    {isTopPerformingStallionFetching === false &&
                      transformedTopPerformingStallion.length > 0 && (
                        <HorseWrapper
                          {...Props.topPerformingWrapperProps}
                          {...transformedTopPerformingStallion[0]}
                        />
                      )}
                    {isTopPerformingStallionFetching === false &&
                      transformedTopPerformingStallion.length === 0 && (
                        <NoDataTrendsPage small={false} />
                      )}
                    {isTopPerformingStallionFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
              {!showTileBasedOnPermission('Most Popular Stallion') && (
                <Grid item lg={12} md={12} xs={12} className="most-popular-stallion">
                  <GridWrapper
                    {...Props.popularStallionProps}
                    isTrends={true}
                    dueDate={mostPopularStallionDueDate}
                    setDueDate={setMostPopularStallionDueDate}
                  >
                    {isMostPopularStallionFetching === false &&
                      transformedMostPopularStallion.length > 0 && (
                        <HorseWrapper
                          {...Props.popularStallionWrapperProps}
                          {...transformedMostPopularStallion[0]}
                        />
                      )}
                    {isMostPopularStallionFetching === false &&
                      transformedMostPopularStallion.length === 0 && (
                        <NoDataTrendsPage small={false} />
                      )}
                    {isMostPopularStallionFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
              {!showTileBasedOnPermission('Most Popular Dam Sire') && (
                <Grid item lg={12} md={12} xs={12} className="most-popular-dam-sire">
                  <GridWrapper
                    {...Props.popularDamsireProps}
                    isTrends={true}
                    dueDate={mostPopularDamsireDueDate}
                    setDueDate={setMostPopularDamsireDueDate}
                  >
                    {isMostPopularDamsireFetching === false &&
                      transformedMostPopularDamsire.length > 0 && (
                        <HorseWrapper
                          {...Props.popularDamsireWrapperProps}
                          {...transformedMostPopularDamsire[0]}
                        />
                      )}
                    {isMostPopularDamsireFetching === false &&
                      transformedMostPopularDamsire.length === 0 && (
                        <NoDataTrendsPage small={false} />
                      )}
                    {isMostPopularDamsireFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
              {!showTileBasedOnPermission('Farm Activity') && (
                <Grid item lg={12} md={12} xs={12} className="trends-farm-activity">
                  <GridWrapper
                    {...Props.farmActivityProps}
                    isTrends={true}
                    dueDate={farmActivityDueDate}
                    setDueDate={setFarmActivityDueDate}
                  >
                    {isFarmActivityFetching === false &&
                      transformedFarmActivity.length > 0 &&
                      transformedFarmActivity?.map((activity: ActivityProps, index: number) => (
                        <Activity
                          {...activity}
                          key={activity.timeStamp + index}
                          handleRemoveActivity={handleRemoveActivity}
                        />
                      ))}
                    {isFarmActivityFetching === false && transformedFarmActivity.length === 0 && (
                      <NoDataTrendsPage small={false} farm={true} />
                    )}
                    {isFarmActivityFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
              {!showTileBasedOnPermission('Hottest Cross') && (
                <Grid item lg={12} md={12} xs={12} className="trends-hottest-cross">
                  <GridWrapper {...Props.hottestCrossWrapperProps} isTrends={true}>
                    {ishottestCrosFetching === false &&
                      hottestCrossData &&
                      hottestCrossData?.length > 0 && <HottestCross {...hottestCrossDataProps} />}
                    {/* {ishottestCrosFetching === false &&
                      hottestCrossData &&
                      hottestCrossData?.length === 0 && (
                        <Box className="smp-no-data hottest-no-data">
                          <Typography variant="h6">No Data Available</Typography>
                        </Box>
                      )} */}
                    
                    {ishottestCrosFetching === false &&
                      hottestCrossData &&
                      hottestCrossData?.length === 0 && (
                      <NoDataTrendsPage small={false} farm={false} hottestCross={true}/>
                    )}
                    {ishottestCrosFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item lg={6} md={6} xs={12} className="trends-right-coloumn">
            <Grid container spacing={3}>
              {!showTileBasedOnPermission('Most Searched Stallions') && (
                <Grid item lg={6} md={6} xs={12} className="most-searched-stallions">
                  <GridWrapper
                    {...Props.searchedStallions}
                    isTrends={true}
                    dueDate={mostSearchedStallionDueDate}
                    setDueDate={setMostSearchedStallionDueDate}
                  >
                    {isMostSearchedStallionsFetching === false &&
                      transformedMostSearchedStallions.length > 0 && (
                        <DataTable
                          {...Props.searchedStallionTableProps}
                          data={transformedMostSearchedStallions}
                        />
                      )}
                    {isMostSearchedStallionsFetching === false &&
                      transformedMostSearchedStallions.length === 0 && (
                        <NoDataTrendsPage small={true} />
                      )}
                    {isMostSearchedStallionsFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
              {!showTileBasedOnPermission('Most Matched Dam Sire') && (
                <Grid item lg={6} md={6} xs={12} className="most-Matched-dam-sire">
                  <GridWrapper
                    {...Props.matchedDamsire}
                    isTrends={true}
                    dueDate={mostMatchedDamsireDueDate}
                    setDueDate={setMostMatchedDamsireDueDate}
                  >
                    {isMostMatchedDamsiresFetching === false &&
                      transformedmostMatchedDamsires.length > 0 && (
                        <DataTable
                          {...Props.matchedDamsireTableProps}
                          data={transformedmostMatchedDamsires}
                        />
                      )}
                    {isMostMatchedDamsiresFetching === false &&
                      transformedmostMatchedDamsires.length === 0 && (
                        <NoDataTrendsPage small={true} />
                      )}
                    {isMostMatchedDamsiresFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}

              {!showTileBasedOnPermission('Top 10 20/20 Matched Sires') && (
                <Grid item lg={12} md={12} xs={12} className="top-twenty-matched-sires">
                  <GridWrapper
                    {...Props.top20By20Sires}
                    defaultSelected={defaultMatchedSireListsFilterOption}
                    setDefaultSelected={setDefaultMatchedSireListsFilterOption}
                    isTrends={true}
                  >
                    {isMostMatchedSiresFetching === false &&
                      transformedmostMatchedSires.length > 0 && (
                        <DataTable
                          {...Props.Top10SireTableProps}
                          data={transformedmostMatchedSires}
                        />
                      )}
                    {isMostMatchedSiresFetching === false &&
                      transformedmostMatchedSires.length === 0 && <NoDataTrendsPage small={true} />}
                    {isMostMatchedSiresFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}

              {!showTileBasedOnPermission('Top 10 20/20 Matched Broodmare Sires') && (
                <Grid item lg={12} md={12} xs={12} className="top-twenty-dam-sires">
                  <GridWrapper
                    {...Props.top20By20Damsires}
                    defaultSelected={defaultMatchedBroodmareSireListsFilterOption}
                    setDefaultSelected={setDefaultMatchedBroodmareSireListsFilterOption}
                    isTrends={true}
                  >
                    {istopMatchedbroodmareSiresFetching === false &&
                      transformedtopMatchedBroodmareSires.length > 0 && (
                        <DataTable
                          {...Props.Top10BroodmareSireTableProps}
                          data={transformedtopMatchedBroodmareSires}
                        />
                      )}
                    {istopMatchedbroodmareSiresFetching === false &&
                      transformedtopMatchedBroodmareSires.length === 0 && (
                        <NoDataTrendsPage small={true} />
                      )}
                    {istopMatchedbroodmareSiresFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
              {!showTileBasedOnPermission('Top 10 Perfect Match Matched Sires') && (
                <Grid item lg={12} md={12} xs={12} className="top-twenty-matched-sires">
                  <GridWrapper
                    {...Props.top10PerfectMatchSire}
                    defaultSelected={default10PerfectMatchedSireListsFilterOption}
                    setDefaultSelected={setDefault10PerfectMatchedSireListsFilterOption}
                    isTrends={true}
                  >
                    {istop10PerfectMatchedSiresFetching === false &&
                      transformed10PerfectMatchedSires.length > 0 && (
                        <DataTable
                          {...Props.Top10PerfectMatchedSireTableProps}
                          data={transformed10PerfectMatchedSires}
                        />
                      )}
                    {istop10PerfectMatchedSiresFetching === false &&
                      transformed10PerfectMatchedSires.length === 0 && (
                        <NoDataTrendsPage small={true} />
                      )}
                    {istop10PerfectMatchedSiresFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}

              {!showTileBasedOnPermission('Top 10 Perfect Match Matched Broodmare Sires') && (
                <Grid item lg={12} md={12} xs={12} className="top-ten-pf-broodmare-sires">
                  <GridWrapper
                    {...Props.top10PerfectMatchBroodmareSire}
                    defaultSelected={defaultTop10PerfectMatchedBroodmareSireListsFilterOption}
                    setDefaultSelected={setDefaultTop10PerfectMatchedBroodmareSireListsFilterOption}
                    isTrends={true}
                  >
                    {istop10PerfectMatchedbroodmareSiresFetching === false &&
                      transformedtop10PerfectMatchedBroodmareSires.length > 0 && (
                        <DataTable
                          {...Props.Top10PerfectMatchedBroodmareSireTableProps}
                          data={transformedtop10PerfectMatchedBroodmareSires}
                        />
                      )}
                    {istop10PerfectMatchedbroodmareSiresFetching === false &&
                      transformedtop10PerfectMatchedBroodmareSires.length === 0 && (
                        <NoDataTrendsPage small={true} />
                      )}
                    {istop10PerfectMatchedbroodmareSiresFetching === true && (
                      <div className="trends-loader">
                        <CircularProgress />
                      </div>
                    )}
                  </GridWrapper>
                </Grid>
              )}
            </Grid>
          </Grid>
          {!showTileBasedOnPermission('Stallion Match Search Activity') && user && authentication && (
            <Grid item lg={12} md={12} xs={12}>
              <Box
                className="trends-header-wrapper"
                pt={5}
                pb={{ sm: '0', md: '26px', lg: '26px' }}
              >
                <Stack
                  className="trends-header-wrapper-inner"
                  direction={{ lg: 'row', xs: 'column' }}
                >
                  <Box flexGrow={1}>
                    <Typography variant="h3" sx={{ color: '#1D472E' }}>
                      Stallion Match Activity
                    </Typography>
                  </Box>
                  <Box className="trends-header-wrapper-left">
                    <Box className="trends-popover">
                      <Typography className="trends-view-text" variant="caption">
                        View
                      </Typography>
                      <CustomSelect
                        disablePortal
                        className="selectDropDownBox NameBtn"
                        IconComponent={KeyboardArrowDownRoundedIcon}
                        defaultValue={'This Month'}
                        sx={{ marginTop: '8px', height: '40px' }}
                        MenuProps={MenuProps}
                        onChange={handleDatePicker}
                      >
                        <MenuItem className="selectDropDownList" value="Today">
                          Today
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="This Week">
                          This Week
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="This Month">
                          This Month
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="This Year">
                          This Year
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="Custom">
                          Custom
                        </MenuItem>
                      </CustomSelect>
                    </Box>

                    <Box className="trends-activty-button">
                      {isDateSorted === 'Custom' && (
                        <Box ml={2} className="roaster-date">
                          <CustomRangePicker
                            roster="roster"
                            handleDueDate={handleStallionMatchDueDate}
                            convertedDateRangeValue={dueDate}
                            setConvertedDateRangeValue={setDueDate}
                            setConvertedYobDateValue={() => { }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <FullScreenDialog
                className={`fullscreen ${open ? 'fullscreen-enabled' : ''}`}
                open={open}
                setOpen={setOpen}
              >
                <Box className="SPtreechat StallionMatchActivityGraph">
                  <Stack direction="row" className="StallionMatchActivityFS">
                    {!open ? (
                      <CustomButton
                        className="ListBtn"
                        disabled={
                          (stallionMatchedActivityData &&
                            stallionMatchedActivityData[0]?.data?.length === 0) ||
                          stallionMatchedActivityData === undefined
                        }
                        onClick={handleClickOpen}
                      >
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
                    {user && authentication && (
                      <StallionActivityChart
                        stallionMatchedActivityData={stallionMatchedActivityData}
                        stateFilterForAnalytics={stateFilterForAnalytics}
                      />
                    )}
                  </Box>
                  <Box className="StMatchActvtyInfo" sx={{ padding: '24px 40px 30px' }}>
                    <Stack
                      className="StMatchActvtyInfo-column"
                      direction={{ xs: 'column', sm: 'row' }}
                      divider={
                        <Divider
                          orientation="vertical"
                          sx={{ borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' }}
                          flexItem
                        />
                      }
                      spacing={{ lg: 2, sm: 2, xs: 0 }}
                    >
                      <Stack
                        direction={{ xs: 'row', sm: 'column' }}
                        sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                      >
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                          <Typography variant="h6">
                            <span className="circle-gr-trends" /> SM Searches
                          </Typography>
                        </Box>
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                          <Typography variant="h4">
                            {stallionMatchedActivityData &&
                              stallionMatchedActivityData[0].totalSmSearches}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack
                        direction={{ xs: 'row', sm: 'column' }}
                        sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                      >
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                          <Typography variant="h6">
                            <span className="circle-gr-trends green" /> 20/20 Matches
                          </Typography>
                        </Box>
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                          <Typography variant="h4">
                            {stallionMatchedActivityData &&
                              stallionMatchedActivityData[0].totalTtMatches}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack
                        direction={{ xs: 'row', sm: 'column' }}
                        sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                      >
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                          <Typography variant="h6">
                            <span className="circle-gr-trends light-green" /> Perfect Matches
                          </Typography>
                        </Box>
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                          <Typography variant="h4">
                            {stallionMatchedActivityData &&
                              stallionMatchedActivityData[0].totalPerfectMatches}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </FullScreenDialog>
            </Grid>
          )}
          {!showTileBasedOnPermission('Stallion Match Search Activity') && authentication === false && (
            <Grid item lg={12} md={12} xs={12}>
              <Box
                className="trends-header-wrapper"
                pt={5}
                pb={{ sm: '0', md: '26px', lg: '26px' }}
              >
                <Stack
                  className="trends-header-wrapper-inner"
                  direction={{ lg: 'row', xs: 'column' }}
                >
                  <Box flexGrow={1}>
                    <Typography variant="h3" sx={{ color: '#1D472E' }}>
                      Stallion Match Activity
                    </Typography>
                  </Box>
                  <Box className="trends-header-wrapper-left">
                    <Box className="trends-popover">
                      <Typography className="trends-view-text" variant="caption">
                        View
                      </Typography>
                      <CustomSelect
                        disablePortal
                        className="selectDropDownBox NameBtn"
                        IconComponent={KeyboardArrowDownRoundedIcon}
                        defaultValue={'This Month'}
                        sx={{ marginTop: '8px', height: '40px' }}
                        MenuProps={MenuProps}
                        onChange={handleDatePicker}
                      >
                        <MenuItem className="selectDropDownList" value="Today">
                          Today
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="This Week">
                          This Week
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="This Month">
                          This Month
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="This Year">
                          This Year
                        </MenuItem>
                        <MenuItem className="selectDropDownList" value="Custom">
                          Custom
                        </MenuItem>
                      </CustomSelect>
                    </Box>
                    <Box className="trends-activty-button">
                      {isDateSorted === 'Custom' && (
                        <Box ml={2} className="roaster-date">
                          <CustomRangePicker
                            roster="roster"
                            handleDueDate={handleStallionMatchDueDate}
                            convertedDateRangeValue={dueDate}
                            setConvertedDateRangeValue={setDueDate}
                            setConvertedYobDateValue={() => { }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <FullScreenDialog
                className={`fullscreen ${open ? 'fullscreen-enabled' : ''}`}
                open={open}
                setOpen={setOpen}
              >
                <Box className="SPtreechat StallionMatchActivityGraph">
                  <Stack direction="row" className="StallionMatchActivityFS">
                    {!open ? (
                      <CustomButton
                        className="ListBtn"
                        disabled={
                          (stallionMatchedActivityData &&
                            stallionMatchedActivityData[0]?.data?.length === 0) ||
                          stallionMatchedActivityData === undefined
                        }
                        onClick={handleClickOpen}
                      >
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
                    {/* {user && authentication && ( */}
                    <StallionActivityChart
                      stallionMatchedActivityData={stallionMatchedActivityData}
                      stateFilterForAnalytics={stateFilterForAnalytics}
                    />
                    {/* )} */}
                  </Box>
                  <Box className="StMatchActvtyInfo" sx={{ padding: '24px 40px 30px' }}>
                    <Stack
                      className="StMatchActvtyInfo-column"
                      direction={{ xs: 'column', sm: 'row' }}
                      divider={
                        <Divider
                          orientation="vertical"
                          sx={{ borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' }}
                          flexItem
                        />
                      }
                      spacing={{ lg: 2, sm: 2, xs: 0 }}
                    >
                      <Stack
                        direction={{ xs: 'row', sm: 'column' }}
                        sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                      >
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                          <Typography variant="h6">
                            <span className="circle-gr-trends" /> SM Searches
                          </Typography>
                        </Box>
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                          <Typography variant="h4">
                            {stallionMatchedActivityData &&
                              stallionMatchedActivityData[0].totalSmSearches}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack
                        direction={{ xs: 'row', sm: 'column' }}
                        sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                      >
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                          <Typography variant="h6">
                            <span className="circle-gr-trends green" /> 20/20 Matches
                          </Typography>
                        </Box>
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                          <Typography variant="h4">
                            {stallionMatchedActivityData &&
                              stallionMatchedActivityData[0].totalTtMatches}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack
                        direction={{ xs: 'row', sm: 'column' }}
                        sx={{ width: '100%', alignItems: { xs: 'center', md: 'flex-start' } }}
                      >
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '70%' } }}>
                          <Typography variant="h6">
                            <span className="circle-gr-trends light-green" /> Perfect Matches
                          </Typography>
                        </Box>
                        <Box sx={{ width: { md: '100%', sm: '100%', xs: '30%' } }}>
                          <Typography variant="h4">
                            {stallionMatchedActivityData &&
                              stallionMatchedActivityData[0].totalPerfectMatches}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </FullScreenDialog>
            </Grid>
          )}
        </Grid>

        {/* Show this footer banner for Anonymous user only */}
        {((pageDateIsFetching === false && authentication === false) && pageData?.footerBanner?.isAnonymous) &&
          <RegisterFarm footerBanner={pageData?.footerBanner} />
        }

        {/* Show this footer banner for registered user only */}
        {((pageDateIsFetching === false && authentication === true) && pageData?.footerBannerRegistered?.isRegistered) &&
          <RegisterFarm footerBanner={pageData?.footerBannerRegistered} />
        }

      </Container>
    </StyledEngineProvider>
  );
}

export default TrendsController;
