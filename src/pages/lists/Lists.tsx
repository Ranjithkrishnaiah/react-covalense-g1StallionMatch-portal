import { useState, useEffect } from 'react';
import ListHeader from '../../components/ListHeader';
import { Constants } from '../../constants';
import Slider from '../../components/customCarousel/Slider';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import { multiCardCaroselProps } from '../../constants/CaroselConstants';
import { Container, StyledEngineProvider, Typography, Box, MenuItem, Select, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/customFunctions';
import { useGetMaresTableQuery } from 'src/redux/splitEndpoints/getMyMaresTableSplit';
import { useGetFavoriteFarmsQuery } from 'src/redux/splitEndpoints/getFavFarmsSplit';
import { useGetFavStallionsTableQuery } from 'src/redux/splitEndpoints/getFavStallionsTableSplit';
import { useGetFavoriteDamsiresQuery } from 'src/redux/splitEndpoints/getFavDamSiresSplit';
import './list.css';
import { transformResponse } from 'src/utils/FunctionHeap';
import { Meta } from '../../@types/lists';
import { useGetMareListSplitQuery } from 'src/redux/splitEndpoints/getMareListSplit';
import { useStallionRosterQuery } from 'src/redux/splitEndpoints/stallionRoasterSplit';
import { UserCustomTable } from './MyFarmStallions';
import CustomTable from 'src/components/Table/CustomTable';
import { useGetRecentSearchesSliderQuery } from 'src/redux/splitEndpoints/getRecentSearchesSlider';
import { toPascalCase } from '../../utils/customFunctions';
import { useGetPopularStallionsQuery } from 'src/redux/splitEndpoints/getPopularStallions';
import { useGetSimilarStallionsQuery } from 'src/redux/splitEndpoints/getSimilarStallions';
import { useGetCompatibleStallionsQuery } from 'src/redux/splitEndpoints/getCompatibleStallions';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Spinner } from 'src/components/Spinner';
//MetaTags
import useMetaTags from 'react-metatags-hook';

const ITEM_HEIGHT = 35;
const ITEM_PADDING_TOP = 8;
const MenuProps : any = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      marginTop: '-6px',
      boxShadow: 'none',
      border: 'solid 1px #161716',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      boxSizing: 'border-box',
    },
  },
}

function Lists() {
  const { pathname } = useLocation();
  const InitialState = {
    order: 'ASC',
    page: 1,
    limit: 10,
    sortBy: 'Alphabetical',
  };
  let Url: any = null;
  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 2];
  // states
  const [transformedMyMareProps, setTransformedMyMareProps] = useState<any>([]);
  const [transformedFavStallionProps, setTransformedFavStallionProps] = useState<any>([]);
  const [transformedFavSireProps, setTransformedFavSireProps] = useState<any>([]);
  const [transformedFavFarmProps, setTransformedFavFarmProps] = useState<any>([]);
  const [transformedMaresList, setTransformedMaresList] = useState<any>([]);
  const [transformedMyStallionsList, setTransformedMyStallionsList] = useState<any>([]);
  const [transformedRecentSearches, setTransformedRecentSearches] = useState<any[]>([]);
  const [transformedSimilarStallions, setTransformedSimilarStallions] = useState<any[]>([]);
  const [transformedPopularStallions, setTransformedPopularStallions] = useState<any[]>([]);
  const [transformedCompatibleStallions, setTransformedCompatibleStallions] = useState<any[]>([]);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [page, setPage] = useState<any>(1);
  const [sortBy, setSortBy] = useState<any>('Name');
  const [state, setState] = useState<any>(InitialState);
  const [title, setTitle] = useState<any>('');
  const [sliderProps, setSliderProps] = useState<any>({ ...multiCardCaroselProps })

  // props
  const {
    maresListHeaderProps,
    stallionsListHeaderProps,
    damsiresListHeaderProps,
    farmsListHeaderProps,
    yourMareListTableProps,
    favStallionTableProps,
    favFarmTableProps,
    favDamsireTableProps,
    mareListsHeaderProps,
    myStallionsListHeaderProps,
    mareListsTableProps,
    myStallionsTableProps,
    usersListHeaderProps,
    usersListTableProps,
  } = Constants.ListConstants;

  let headerProps = { ...maresListHeaderProps, setSortBy };
  let tableProps: any = transformedMyMareProps;
  // set sliderTitle
  let sliderTitle: string = 'Recent searches';
  if (!pathname.match('farm-dashboard')) {
    if (pathname.match('mare')) {
      headerProps = { ...maresListHeaderProps, setSortBy };
      tableProps = transformedMyMareProps;
      sliderTitle = sliderTitle;
    } else if (pathname.match('stallions')) {
      headerProps = { ...stallionsListHeaderProps, setSortBy };
      tableProps = transformedFavStallionProps;
      sliderTitle = 'Similar Stallions';
    } else if (pathname.match('damsires')) {
      headerProps = { ...damsiresListHeaderProps, setSortBy };
      tableProps = transformedFavSireProps;
      sliderTitle = 'Compatible Stallions';
    } else if (pathname.match('farms')) {
      headerProps = { ...farmsListHeaderProps, setSortBy };
      tableProps = transformedFavFarmProps;
      sliderTitle = 'Popular Stallions';
    }
  }

  let listInitialparams = { body: { ...InitialState }, Url }
  const [listParams, setListParams] = useState<any>(listInitialparams);

  // API call for fav Farms
  const { data: favFarms, isSuccess: isFavFarmsSuccess, isLoading: isFavFarmsLoading,isFetching:isFavFarmsFetching } = useGetFavoriteFarmsQuery(state, {
    skip: !pathname.match('farms')
  });
  // API call for popular Stallions
  const { data: popularStallionsSlider, isSuccess: isPopularStallionsSuccess } = useGetPopularStallionsQuery(state, {
    skip: !pathname.match('farms')
  });
  // API call for myMares lists
  const { data: myMares, isSuccess: isMyMaresSuccess, isLoading: isMyMaresLoading,isFetching:isMyMaresFetching } = useGetMaresTableQuery(state, {
    skip: !pathname.match('mare')
  });
  // API call for recent Searches Slider
  const { data: recentSearchesSlider, isSuccess: isRecentSearchesSuccess } = useGetRecentSearchesSliderQuery(state, {
    skip: !pathname.match('mare')
  })
  // API call for favStallions list
  const { data: favStallions, isSuccess: isFavStallionsSuccess, isLoading: isFavStallionsLoading,isFetching:isFavStallionsFetching } = useGetFavStallionsTableQuery(
    state, { skip: !pathname.match('favourite-stallions-list') });
  // API call for similar Stallions Slider
  const { data: similarStallionsSlider, isSuccess: isSimilarStallionsSuccess } = useGetSimilarStallionsQuery(state, {
    skip: !pathname.match('favourite-stallions-list')
  });
  // API call for fav Damsires
  const { data: favDamsires, isSuccess: isFavDamSiresSuccess, isLoading: isFavListLoading,isFetching:isFavListFetching } = useGetFavoriteDamsiresQuery(
    state, { skip: !pathname.match('damsires') });
  
  const [favStallionId, setFavStallionId] = useState(""); 
  // API call for compatible Stallions 
  const { data: compatibleStallionsSlider, isSuccess: isCompatibleStallionsSuccess, isLoading: isCompatibleStallionsLoading } = useGetCompatibleStallionsQuery({horseId:favStallionId},
    { skip: ( !pathname.match('damsires') && favStallionId === "" ) });
  // API call for mares List Data
  const { data: maresListData } = useGetMareListSplitQuery(state, { skip: !pathname.match('my-mares-list') });
  // API call for myStallions Data
  const { data: myStallionsData } =
    useStallionRosterQuery(listParams, { skip: !pathname.match('my-stallions-list') });

  // metaTitles for lists
  const metaTitles = () => {
    switch (pathname) {
      case "/dashboard/mares-list":
        return "My Mares";
      case "/dashboard/favourite-stallions-list":
        return "Favorite Stallions";
      case "/dashboard/favourite-damsires-list":
        return "My Favourtite Broodmare Sires | Stallion Match";
      case "/dashboard/favourite-farms-list":
        return "My Favourite Horse Farms | Stallion Match";
      case `/dashboard/farm-dashboard/${farmID}/my-stallions-list`:
        return "My Stallion List";
      default:
        return "";
    }
  }

  // metaDescriptions for lists
  const metaDescriptions = () => {
    switch (pathname) {
      case "/dashboard/mares-list":
        return "Stallion Match Mares List. My list of mares, data and info - the data backed stallion match for the best pedigree.";
      case "/dashboard/favourite-stallions-list":
        return "View/Add Stallions as favorite and also order a Stallion affinity report";
      case "/dashboard/favourite-damsires-list":
        return "Favourite Broodmares Dashboard. My list of horses, data and info - the data backed Stallion Match for the best pedigree.";
      case "/dashboard/favourite-farms-list":
        return "Favourite Farms Dashboard. My list of farms, data and info - the data backed stallion match for the best pedigree.";
      case `/dashboard/farm-dashboard/${farmID}/my-stallions-list`:
        return "Stallion Match Farm Dashboard. Your farm administration - the data backed Stallion Match for the best pedigree.";
      default:
        return "";
    }
  }

  // MetaTags for lists
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const listsUrl = `${BaseAPI}${pathname}`;
  const listsUrlImage = process.env.REACT_APP_LISTSURL_IMAGE;
  useMetaTags({
    title: metaTitles(),
    description: metaDescriptions(),
    openGraph: {
      title: metaTitles(),
      description: metaDescriptions(),
      site_name: 'Stallion Match',
      url: listsUrl,
      type: 'business.business',
      image: listsUrlImage,
    },
  }, [])

  // scroll to top
  useEffect(() => {
    scrollToTop();
  }, [page, sortBy]);

  // set data for myStallions from API
  useEffect(() => {
    if (myStallionsData?.data?.length) {
      if (myStallionsData?.data?.length > 0) {
        setTransformedMyStallionsList({
          ...myStallionsTableProps,
          data: transformResponse(myStallionsData?.data, 'MY STALLIONS LIST'),
        });
        setTitle(myStallionsData?.data[0]?.farmName)
        setMeta(myStallionsData.meta);
      }

    }
  }, [myStallionsData?.data, listParams]);

  // set data for mares List from API
  useEffect(() => {
    if (maresListData?.data?.length) {
      if (maresListData.data.length > 0)
        setTransformedMaresList({
          ...mareListsTableProps,
          data: transformResponse(maresListData.data, 'MARES LIST'),
        });
      setMeta(maresListData.meta);
    }
  }, [myMares?.data, state]);

  // set data for myMares Data from API
  useEffect(() => {
    if (myMares?.data) {
        setTransformedMyMareProps({
          ...yourMareListTableProps,
          data: transformResponse(myMares.data, 'MY MARES'),
        });
      if (myMares?.meta) {
        setMeta(myMares.meta);
      }
    }
  }, [myMares?.data, state]);

  // set data for fav Stallions from API
  useEffect(() => {
    if (favStallions?.data?.length) {
      if (favStallions.data.length > 0)
        setTransformedFavStallionProps({
          ...favStallionTableProps,
          data: transformResponse(favStallions.data, 'FAV STALLIONS'),
        });
      setMeta(favStallions.meta);
    }else if(favStallions?.data?.length === 0) {
      setTransformedFavStallionProps({
        ...favStallionTableProps,
        data: [],
      });
    }
  }, [favStallions?.data, state]);

  // set data for fav Damsires from API
  useEffect(() => {
    if (typeof(favDamsires?.data?.length) !== 'undefined') {
      if (favDamsires.data.length > -1)
        setTransformedFavSireProps({
          ...favDamsireTableProps,
          data: transformResponse(favDamsires.data, 'FAV BROODMARE SIRES'),
        });
      setMeta(favDamsires.meta);
      setFavStallionId(favDamsires?.data[0]?.horseId);
    }
  }, [favDamsires?.data, state]);

  // set data for fav Farms from API
  useEffect(() => {
    if (favFarms?.data?.length) {
      if (favFarms.data.length > 0)
        setTransformedFavFarmProps({
          ...favFarmTableProps,
          data: transformResponse(favFarms.data, 'FAV FARMS'),
        });
      setMeta(favFarms.meta);
    }else if(favFarms?.data?.length === 0) {
      setTransformedFavFarmProps({
        ...favFarmTableProps,
        data: [],
      });
    }
  }, [favFarms?.data, state]);

  // set data for list params from API
  useEffect(() => {
    if (listParams?.body?.page !== page || sortBy !== listParams?.body?.sortBy) {
      setListParams({
        body: { ...listInitialparams.body, sortBy, page }, Url
      });
    }
  }, [myStallionsData, page, sortBy])

  // set SliderProps data for recent Searches Slider
  useEffect(() => {
    if (recentSearchesSlider) {
      if (isRecentSearchesSuccess && recentSearchesSlider?.length > 0) {
        const transformedResponse = transformResponse(recentSearchesSlider, 'RECENT-SEARCHES')
        setSliderProps({ ...sliderProps, isRecentSearches: true, items: transformedResponse })
        setTransformedRecentSearches(transformedResponse)
      }
    }
  }, [isRecentSearchesSuccess, recentSearchesSlider])

  // set SliderProps data for similar Stallions Slider
  useEffect(() => {
    if (similarStallionsSlider?.data) {
      if (isSimilarStallionsSuccess && similarStallionsSlider?.data?.length > 0) {
        const transformedResponse = transformResponse(similarStallionsSlider.data, 'SIMILAR-STALLIONS')
        setSliderProps({ ...sliderProps, isSimilarStallions: true, items: transformedResponse })
        setTransformedSimilarStallions(transformedResponse)
      }
    }
  }, [isSimilarStallionsSuccess, similarStallionsSlider])

  // set SliderProps data for popular Stallions Slider
  useEffect(() => {
    if (popularStallionsSlider?.data) {
      if (isPopularStallionsSuccess && popularStallionsSlider?.data?.length > 0) {
        const transformedResponse = transformResponse(popularStallionsSlider.data, 'POPULAR-STALLIONS')
        setSliderProps({ ...sliderProps, isPopularStallions: true, items: transformedResponse })
        setTransformedPopularStallions(transformedResponse)
      }
    }
  }, [isPopularStallionsSuccess, popularStallionsSlider])

  // set SliderProps data for compatible Stallions Slider
  useEffect(() => {
    if (compatibleStallionsSlider) {
      if (isCompatibleStallionsSuccess && compatibleStallionsSlider?.length > 0) {
        const transformedResponse = transformResponse(compatibleStallionsSlider, 'COMPATIBLE-STALLIONS');
        setSliderProps({ ...sliderProps, isCompatibleStallions: true, items: transformedResponse })
        setTransformedCompatibleStallions(transformedResponse)
      }
    }
  }, [isCompatibleStallionsSuccess, compatibleStallionsSlider])

  //set state based on sort
  if (sortBy !== state.sortBy || state.page !== page) {
    setState({ ...InitialState, sortBy, page });
  }
  let pageData: any = null;
  if (myMares || favStallions || favDamsires || favFarms || maresListData || myStallionsData) {
    pageData = {
      page,
      setPage,
      query: myMares || favStallions || favDamsires || favFarms || maresListData || myStallionsData,
      pagination: {
        itemCount: meta?.itemCount || 0,
        limit: meta?.limit || 10,
      },
      limit: 10,
    };
  }
  const handleChangeStallion = (e: any) => {
    setFavStallionId(e.target.value);     
  }

  // setting dynamic text button based on name of the list page
  let dynamicTextBtn = '';
  if(tableProps?.name?.toLowerCase().includes('favourite mares')) {
    dynamicTextBtn = 'mares'
  }
  else if(tableProps?.name?.toLowerCase().includes('favourite stallions')) {
    dynamicTextBtn = 'stallions'
  }
  else if(tableProps?.name?.toLowerCase().includes('favourite damsires')) {
    dynamicTextBtn = 'damsires'
  }
  else if(tableProps?.name?.toLowerCase().includes('favourite farms')) {
    dynamicTextBtn = 'farms'
  }

  return (
    <StyledEngineProvider injectFirst>
      <Container className={`${tableProps?.data?.length ? 'listsPresent' : 'listsEmpty'}`}>
        <ListHeader {...headerProps} />
      </Container>
      <Container>
        {/* lists datatable */}
        <Box mb={7} className="ListBodyWrapper">
        {isMyMaresFetching || isFavFarmsFetching || isFavStallionsFetching || isFavListFetching ? (
            <Spinner />
        ) : <>
        {tableProps?.data?.length ? 
        <>
          {tableProps && tableProps.isBreederDashboardTable && !Array.isArray(tableProps) && <CustomTable {...tableProps} />}
          {tableProps && !Array.isArray(tableProps) && pathname.match('my-stallions-list') && <UserCustomTable {...tableProps} />}
          <PaginationSettings data={pageData} />
          </>
          :
          <Stack className="StakesProgenyTable" mt={2}>
              <Box className='smp-no-data'>
                <Typography variant='h6'>Add {dynamicTextBtn} for even faster searching.</Typography>
              </Box>
            </Stack>}
            </>}
        </Box> 
        {/* lists datatable end */}

        {/* lists slider section */}
        {!pathname.match('farm-dashboard') && (transformedRecentSearches.length > 0
          || transformedSimilarStallions.length > 0 || transformedPopularStallions.length > 0 || typeof(favDamsires?.data?.length) !== 'undefined') && 
          
          isCompatibleStallionsLoading || isFavListLoading ?
          <Spinner /> :
          (
            <Box className="recent-searches-wrapper">

              <Stack className='common-list-header-row common-list-slider' mt={3} sx={{alignItems:'center' }} direction={{ lg: 'row', sm:'row', xs: 'column' }}>
                <Box flexGrow={1} className='list-header'>
                  <Typography variant="h3" title="">{sliderTitle}</Typography>
                </Box>
              

              <Box className='listheadsortby' sx={{ display: 'flex', mt: { lg: '0px', sm:'0px', xs: '1rem' } }}>
              {favDamsires &&
                <Typography variant="h5" className="sortby">
                  Select Broodmare Sire
                </Typography>
                }
                {favDamsires && <Select
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{ height: '40px' }}
                className="selectDropDownBox sort-recent"
                value={favStallionId}                
                onChange={handleChangeStallion}
                MenuProps={ {
                  keepMounted: true,
                  hideBackdrop:false,
                  disablePortal: true,
                  getContentAnchorEl: null,
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "right"
                  },
                  ...MenuProps
                } }
              >
                {tableProps?.data?.map((favList: any, index: number) => (
                  <MenuItem className="selectDropDownList" value={favList?.id} key={favList?.id}>
                    {toPascalCase(favList?.name)}
                  </MenuItem>
                ))}
              </Select>
              }
              </Box>

              </Stack>
              
              <Box className='list-slider'>
                <Slider {...sliderProps} />
              </Box>
            </Box>
          )}
          {/* lists slider section end */}
      </Container>
    </StyledEngineProvider>
  );
}

export default Lists;