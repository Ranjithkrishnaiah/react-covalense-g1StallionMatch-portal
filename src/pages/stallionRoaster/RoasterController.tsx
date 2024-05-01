import { Container, Grid, StyledEngineProvider } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import useAuth from 'src/hooks/useAuth';
import { DateRange } from 'src/@types/dateRangePicker';
import * as _ from 'lodash';
import { api } from 'src/api/apiPaths';
import StallionView from 'src/pages/stallionRoaster/StallionAnalytics/StallionAnalytics';
import PaginationSettings from '../../utils/pagination/PaginationFunction';
import { useStallionRosterQuery } from 'src/redux/splitEndpoints/stallionRoasterSplit';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import Loader from 'src/components/Loader';
import Header from './Header';
import { dateConvert, scrollToTop, toPascalCase } from 'src/utils/customFunctions';
import NoDataRoaster from 'src/components/NoDataComponent/NoDataRoaster';

// MetaTags
import useMetaTags from 'react-metatags-hook';
import UnAuthorized from 'src/components/NoDataComponent/UnAuthorized';

export default function RoasterController() {
  const roasterPageUrl = `https://dev.stallionmatch.com${window.location.pathname}`;
  const roasterImage = process.env.REACT_APP_STALLION_ROASTER_IMAGE;  

  const { pathname } = useLocation();
  const { authentication } = useAuth();
  const [sortBy, setSortBy] = useState<any>('Alphabetical');
  const [dateSortSelected, setDateSortSelected] = useState('This Month');
  const [page, setPage] = useState<number>(1);
  const [dueDateValue, setDueDateValue] = React.useState<DateRange>([null, null]);
  const { data: userFarmListData, isFetching: isUserFarmListFetching, isSuccess: isUserFarmListSuccess } = useGetUsersFarmListQuery(null, { skip: !authentication });
  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm.length - 1];
  const rosterUrl: any = api.farmsUrl + '/' + farmID + api.stallions;
  const fromDateConverted = dateConvert(dueDateValue[0] || null);
  const toDateConverted = dateConvert(dueDateValue[1] || null);
  let newState = {
    // ...initialState,
    Url: rosterUrl,
    body: {
      order: 'ASC',
      sortBy: sortBy,
      page: page,
      limit: 10,
      // filterBy: dateSortSelected,
      // fromDate: dateSortSelected === 'Custom' ? fromDateConverted : '',
      // toDate: dateSortSelected === 'Custom' ? toDateConverted : '',
    },
  };

  let stateFilterForAnalytics = {
    filterBy: dateSortSelected,
    fromDate: dateSortSelected === 'Custom' ? fromDateConverted : '',
    toDate: dateSortSelected === 'Custom' ? toDateConverted : '',
  }

  // On every first render scroll the page to top
  useEffect(() => {
    scrollToTop();
  }, [newState]);

  // Get farm owner info and there access level
  let isFarmOwner = false;
  let accessLevel: any = null;
  const farmNameFromData: any = userFarmListData?.filter((data: any) => data?.farmId === farmID);
  if (farmNameFromData) {
    isFarmOwner = farmNameFromData[0]?.isFamOwner;
    accessLevel = farmNameFromData[0]?.accessLevel;
  }

  // Get Stallion roaster list
  const { data: stallionRosterApiData, isSuccess, isLoading, isFetching, status: RosterApiStatusForAuthUser } = useStallionRosterQuery(newState, { refetchOnMountOrArgChange: true });
  let stallionRosterList: any = stallionRosterApiData?.data ? stallionRosterApiData?.data : [];

  const paginationParams = {
    page,
    setPage,
    pagination: stallionRosterApiData?.meta,
    result: stallionRosterList,
    query: stallionRosterApiData,
    clear: false,
  };
  const [selectedStallionIds, setSelectedStallionIds] = useState<any>([]);

  // Select stallion ID
  const handleSelectedStallionID = (value: any) => {
    setSelectedStallionIds(value);
  };

  // Filter Parameters
  const filterProps = {
    setSortBy,
    sortBy,
    selectedStallionIds,
    handleSelectedStallionID,
    setPage,
    page,
    dateSortSelected,
    setDateSortSelected,
    dueDateValue,
    setDueDateValue,
    accessLevel,
    farmNameFromData
  };

  if (RosterApiStatusForAuthUser === 'rejected') {
    return <UnAuthorized />
  }

  const [metaFarmTitle, setMetaFarmTitle] = useState('Farm Dashboard');
  React.useEffect(() => {
    if (isUserFarmListSuccess) {
      // Find the farm object with the specified farmId
      const farmObject = userFarmListData.find((farm: any) => farm.farmId === farmID);
      if (farmObject) {
        const userSelectedFarmName = farmObject.farmName;
        setMetaFarmTitle(`${toPascalCase(userSelectedFarmName)}'s Farm Stallion Roster`);
      } 
    }
  }, [isUserFarmListFetching]) 

  //Meta tags for Stallion roaster 
  useMetaTags({
    title: `${metaFarmTitle} | Stallion Match`,
    description: `Your Farm Stallion Roster. Availability - the data backed stallion match for the best pedigree.`,
    openGraph: {
      title: `Farm Stallion Roster | Stallion Match`,
      description: `Your Farm Stallion Roster. Availability - the data backed stallion match for the best pedigree.`,
      site_name: 'Stallion Match',
      url: roasterPageUrl,
      type: 'business.business',
      image: roasterImage,
    },
  }, [metaFarmTitle])

  return (
    <StyledEngineProvider injectFirst>

      <Box pb={8}>
        <Header {...filterProps} />
        <Container maxWidth="lg">
          <Box className="stallion-roaster-wrapper">
            {/* No data component */}
            {isFetching === false && stallionRosterList.length === 0 && (
              <NoDataRoaster
                selectedStallionIds={selectedStallionIds}
                handleSelectedStallionID={handleSelectedStallionID}
              />
            )}
            {/* Stallion roaster list */}
            {isSuccess === true && isFetching === false && stallionRosterList.length > 0 && <Grid container spacing={3}>
              {stallionRosterList.map((data: any) => (
                <Grid key={data.id} item lg={6} md={6} sm={12} xs={12}>
                  <StallionView {...data} farmID={farmID} accessLevel={accessLevel} stateFilterForAnalytics={stateFilterForAnalytics} farmNameFromData={farmNameFromData} />
                </Grid>
              ))}
            </Grid>}
            {isFetching && <Loader />}
          </Box>
          {/* Pagination component */}
          {isSuccess === true && isFetching === false && stallionRosterList.length > 0 && <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <PaginationSettings data={paginationParams} />
          </Box>}
        </Container>
      </Box>
    </StyledEngineProvider>
  );
}