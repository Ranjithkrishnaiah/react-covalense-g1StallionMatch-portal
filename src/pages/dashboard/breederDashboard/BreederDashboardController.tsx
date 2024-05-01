import { useState, useEffect } from 'react';
import { Container, Grid, StyledEngineProvider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
import Header from './Header';
import GridWrapper from 'src/components/GridWrapper';
import DataTable from 'src/components/Datatable/DataTable';
import HypoMating from '../../farmPage/tabs/HypoMating';
import { Constants } from '../../../constants';
import Slider from '../../../components/customCarousel/Slider';
import './BreederDashboard.css';
import { scrollToTop } from '../../../utils/customFunctions';
import { useGetMaresTableQuery } from '../../../redux/splitEndpoints/getMyMaresTableSplit';
import { useGetFavoriteFarmsQuery } from '../../../redux/splitEndpoints/getFavFarmsSplit';
import { useGetFavStallionsTableQuery } from 'src/redux/splitEndpoints/getFavStallionsTableSplit';
import { useGetFavoriteDamsiresQuery } from 'src/redux/splitEndpoints/getFavDamSiresSplit';
import DashboardProfile from 'src/components/DashboardProfile/DashboardProfile';
import { transformResponse } from 'src/utils/FunctionHeap';
import { Spinner } from 'src/components/Spinner';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import { useGetRecentSearchesQuery } from 'src/redux/splitEndpoints/getRecentSearches';
import useAuth from 'src/hooks/useAuth';
import { useGetFarmsMediaQuery } from 'src/redux/splitEndpoints/getFarmsMediaSplit';
import { Images } from 'src/assets/images';
import { format } from 'date-fns';

// MetaTags
import useMetaTags from 'react-metatags-hook';

export default function BreederDashboardController() {
  // MetaTags for breeder dashboard
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const breederDashboardUrl = `${BaseAPI}dashboard`;
  const breederDashboardImage = process.env.REACT_APP_BREEDER_DASHBOARD_IMAGE;
  useMetaTags(
    {
      title: `Breeder Dashboard`,
      description: `A user can perfrom Hypomating search and view his/her shortlisted Stallion, mares, recent searches, favorite damsires, Farm media, favorite farms etc.`,
      openGraph: {
        title: `Breeder Dashboard | Stallion Match`,
        description: `A user can perfrom Hypomating search and view his/her shortlisted Stallion, mares, recent searches, favorite damsires, Farm media, favorite farms etc.`,
        site_name: 'Stallion Match',
        url: breederDashboardUrl,
        type: 'business.business',
        image: breederDashboardImage,
      },
    },
    []
  );

  // authentication check
  const { authentication } = useAuth();
  // navigate
  const navigate = useNavigate();
  const Props = Constants.DashboardConstants;
  // states
  const [items, setItems] = useState<any>([]);
  const [transformedMyMare, setTransformedMyMare] = useState<any[]>([]);
  const [transformedFavStallions, setTransformedFavStallions] = useState<any[]>([]);
  const [transformedFavSires, setTransformedFavSires] = useState<any[]>([]);
  const [transformedFavFarms, setTransformedFavFarms] = useState<any[]>([]);
  const [transformedRecentSearches, setTransformedRecentSearches] = useState<any[]>([]);
  // InitialState
  const InitialState = {
    order: 'ASC',
    page: 1,
    limit: 5,
    sortBy: 'Name',
  };
  const InitialMareState = { ...InitialState, limit: 5 };
  const InitialFavStallionState = { ...InitialState, limit: 9 };
  const InitialFavDamsireState = { ...InitialState, limit: 11 };
  // API call for breeder recent searches
  const {
    data: recentSearches,
    isLoading: isRecentSearchesLoading,
    isFetching: isRecentSearchesFetching,
  } = useGetRecentSearchesQuery(InitialState);
  // API call for favourite farms
  const {
    data: favFarms,
    isLoading: isFarmsLoading,
    isFetching: isFarmsFetching,
  } = useGetFavoriteFarmsQuery(InitialState);
  // API call for mares members
  const {
    data: myMares,
    isLoading: isMyMaresLoading,
    isFetching: isMyMaresFetching,
  } = useGetMaresTableQuery(InitialMareState);
  // API call for favourite stallions with race details
  const {
    data: favStallions,
    isLoading: isFavStallionsLoading,
    isFetching: isFavStallionsFetching,
  } = useGetFavStallionsTableQuery(InitialFavStallionState);
  // API call for Favorite Damsires with race details
  const {
    data: favDamsires,
    isLoading: isFavDamsiresLoading,
    isFetching: isFavDamsiresFetching,
  } = useGetFavoriteDamsiresQuery(InitialFavDamsireState);
  // API call for user Farm List
  const { data: userFarmListData } = useGetUsersFarmListQuery(null, {
    skip: !authentication,
    refetchOnMountOrArgChange: true,
  });
  // API call for user Farm Media
  const { data: userFarmsMedia, isLoading, isSuccess, isError } = useGetFarmsMediaQuery();

  const { Whiteruning, HomepageHeader, farmplaceholder } = Images;

  const inputArr: any =
    userFarmsMedia && userFarmsMedia?.length > 0
      ? userFarmsMedia?.map((res: any, index: number) => {
          const type =
            res?.mediaInfoFiles[0]?.mediaFileType.split('/')[0] == 'video' ? 'video' : 'img';
          return {
            id: res.mediaInfoId,
            type,
            date: format(new Date(res.createdOn), 'do MMMM yyyy'),
            src: res?.mediaInfoFiles?.length ? res?.mediaInfoFiles[0]?.mediaUrl : farmplaceholder,
            name: res?.title,
            description: res?.description,
          };
        })
      : null;

  //caroselProps
  const caroselProps = {
    items: inputArr,
    slider: true,
    dots: true,
    arrows: true,
    mediaClassName: 'show',
    noOfVisibleItems: 1,
    autoScroll: false,
    sliderOnItemClick: true,
    styles: {
      item: {},
      arrows: {
        top: '40%',
        width: '100%',
        display: 'flex',
      },
      arrowLeft: {
        left: 0,
      },
      arrowRight: {
        right: 0,
        marginLeft: 'auto',
      },
      cardContent: {},
    },
    dimension: '?w=370&h=240&fit=crop&ar=3:2',
  };

  // scroll tot top
  useEffect(() => {
    scrollToTop();
  }, []);

  // set my mares data
  useEffect(() => {
    if (myMares?.data.length) {
      if (myMares.data.length > 0)
        setTransformedMyMare(transformResponse(myMares.data, 'MY MARES'));
    } else if (myMares?.data.length === 0) setTransformedMyMare([]);
  }, [myMares?.data]);

  // set fav Stallions data
  useEffect(() => {
    if (favStallions?.data?.length) {
      if (favStallions.data.length > 0)
        setTransformedFavStallions(transformResponse(favStallions.data, 'FAV STALLIONS'));
    } else if (favStallions?.data.length === 0) setTransformedFavStallions([]);
  }, [favStallions?.data]);

  // set fav Damsires data
  useEffect(() => {
    if (favDamsires?.data?.length) {
      if (favDamsires.data.length > 0)
        setTransformedFavSires(transformResponse(favDamsires.data, 'FAV BROODMARE SIRES'));
    } else if (favDamsires?.data.length === 0) setTransformedFavSires([]);
  }, [favDamsires?.data]);

  // set fav Farms data
  useEffect(() => {
    if (favFarms?.data?.length) {
      if (favFarms.data.length > 0)
        setTransformedFavFarms(transformResponse(favFarms.data, 'FAV FARMS'));
    } else if (favFarms?.data.length === 0) setTransformedFavFarms([]);
  }, [favFarms?.data]);

  // set Recent Searches data
  useEffect(() => {
    if (recentSearches) {
      if (recentSearches?.length > 0) {
        setTransformedRecentSearches(transformResponse(recentSearches, 'RECENT SEARCHES'));
      }
    }
  }, [recentSearches]);

  useEffect(() => {
    const items: any = JSON.parse(localStorage.getItem('user') || '');
    if (items) {
      setItems(items);
    }
  }, []);

  // breederProps
  const breederProps = {
    farmOptions: ['Copy Farm Url', 'Dashboard', 'Farm Page', 'Stallion Roster', 'Remove'],
    profileOptions: ['Farm Dashboard', 'Farm Page', 'Delete'],
    user: {
      id: items?.id,
      name: items?.fullName,
      location: 'Sydney, Australia',
      src: '',
    },
    farms: JSON.parse(localStorage.getItem('user') || "{'user':'Siva'}")?.myFarms || [
      { id: '123', src: '', name: 'Coolmore', approvalStatus: 'pending' },
    ],
    messages: [
      {
        farmName: 'John Smith',
        timestamp: '123',
        timeStamp: '123',
        message: 'check',
        messageText: 'check',
        messageTitle: '',
        subject: 'General Inquiry',
        isRead: false,
        senderName: '',
        featureName: '',
      },
    ],
  };

  const userId = breederProps?.user?.id;
  const userName = breederProps?.user?.name;
  const mareProps = { navigate, userId, userName, ...Props.yourMareProps };
  const stallionProps = { navigate, userId, userName, ...Props.favStallionProps };
  const farmProps = { navigate, userId, userName, ...Props.favFarmProps };
  const damSireProps = { navigate, userId, userName, ...Props.favDamSireProps };

  // loader if data is fetching
  if (isFarmsLoading || isMyMaresLoading || isFavStallionsLoading || isFavDamsiresLoading) {
    <Spinner />;
  }

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box pb={5}>
          {/* Header section */}
          <Header />
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={5} md={5} xs={12} className="DPProfileBoxWrapper">
                {/* Dashboard Profile section */}
                <DashboardProfile
                  {...breederProps}
                  farms={userFarmListData || breederProps.farms}
                />
              </Grid>
              <Grid
                item
                lg={7}
                md={7}
                xs={12}
                className={`your-mare-block ${transformedMyMare.length === 0 ? 'no-data' : ''}`}
              >
                {/* Your Mares section */}
                <GridWrapper
                  {...mareProps}
                  showLinkBtn={transformedMyMare.length > 0}
                  tableName={'Your Mares'}
                >
                  {isMyMaresFetching === true && <Spinner />}
                  {isMyMaresFetching === false && transformedMyMare.length > 0 && (
                    <DataTable {...Props.yourMareTableProps} data={transformedMyMare} />
                  )}
                </GridWrapper>
              </Grid>
            </Grid>
          </Container>
          {/* HypoMating section */}
          <Box my={3} className="Dashboard-Hypomate">
            <HypoMating pageType={"breederDashboard"} />
          </Box>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={5} md={5} xs={12}>
                <Grid
                  item
                  xs={12}
                  pb={3}
                  className={`resent-search ${
                    transformedRecentSearches.length === 0 ? 'no-data' : ''
                  }`}
                >
                  {/* Your Recent Searches */}
                  <GridWrapper {...Props.recentSearchProps} showLinkBtn={false}>
                    {isRecentSearchesFetching === true && <Spinner />}
                    {isRecentSearchesFetching === false &&
                      transformedRecentSearches?.length > 0 && (
                        // <DataTable
                        //   {...Props.recentSearchesTableProps}
                        //   data={transformedRecentSearches}
                        // />
                        <DataTable {...Props.recentSearchesTableProps} data={transformedRecentSearches} />
                      )}
                    {isRecentSearchesFetching === false && transformedRecentSearches?.length === 0 && (
                      <Typography variant="h6" className="noform">
                        No Records Found
                      </Typography>
                    )}
                  </GridWrapper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  pb={3}
                  className={`fav-farms ${transformedFavFarms.length === 0 ? 'no-data' : ''}`}
                >
                  {/* Your Favourite Farms */}
                  <GridWrapper
                    {...farmProps}
                    showLinkBtn={transformedFavFarms.length > 0}
                    tableName={'Favourite Farms'}
                  >
                    {isFarmsFetching === true && <Spinner />}
                    {isFarmsFetching === false && transformedFavFarms.length > 0 && (
                      <DataTable {...Props.favFarmTableProps} data={transformedFavFarms} />
                    )}
                  </GridWrapper>
                </Grid>
                {/* Farm Media Feed */}
                <Grid item xs={12} className={`fav-Media-Box`}>
                  <Box sx={{ position: 'relative' }}>
                    <GridWrapper {...Props.caroselWrapperProps} showLinkBtn={false}>
                      {userFarmsMedia?.length > 0 ? (
                        <Slider {...caroselProps} />
                      ) : (
                        <Typography variant="h6" className="noform">
                          No Farm Media Feed Available
                        </Typography>
                      )}
                    </GridWrapper>
                  </Box>
                </Grid>
              </Grid>
              {/* Your Recent Searches end */}

              <Grid item lg={7} md={7} xs={12}>
                {/* Your Favourite Stallions */}
                <Grid
                  item
                  xs={12}
                  pb={3}
                  className={`Favorite-Stallions ${
                    transformedFavStallions.length === 0 ? 'no-data' : ''
                  }`}
                >
                  <GridWrapper
                    {...stallionProps}
                    showLinkBtn={transformedFavStallions.length > 0}
                    tableName={'Favourite Stallions'}
                  >
                    {isFavStallionsFetching === true && <Spinner />}
                    {isFavStallionsFetching === false && transformedFavStallions.length > 0 && (
                      <DataTable {...Props.favStallionTableProps} data={transformedFavStallions} />
                    )}
                  </GridWrapper>
                </Grid>
                {/* Your Favourite Damsires */}
                <Grid
                  item
                  xs={12}
                  pb={3}
                  className={`Favorite-Damsires ${
                    transformedFavSires.length === 0 ? 'no-data' : ''
                  }`}
                >
                  <GridWrapper
                    {...damSireProps}
                    showLinkBtn={transformedFavSires.length > 0}
                    tableName={'Favourite Damsires'}
                  >
                    {isFavDamsiresFetching === true && <Spinner />}
                    {isFavDamsiresFetching === false && transformedFavSires.length > 0 && (
                      <DataTable {...Props.favDamsireTableProps} data={transformedFavSires} />
                    )}
                  </GridWrapper>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </StyledEngineProvider>
    </>
  );
}
