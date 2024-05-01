import React, { useState, useEffect } from 'react';
import { Container, Grid, Stack, StyledEngineProvider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { CustomButton } from 'src/components/CustomButton';
import DashboardProfile from 'src/components/DashboardProfile/DashboardProfile';
import DataTable from 'src/components/Datatable/DataTable';
import GridWrapper from 'src/components/GridWrapper';
import { Constants } from 'src/constants';
import Analytics from './Analytics';
import Header from './Header';
import StallionMatchActivity from './StallionMatchActivity';
import StallionView from 'src/pages/stallionRoaster/StallionAnalytics/StallionAnalytics';
import { scrollToTop, toPascalCase } from '../../../utils/customFunctions';
import './Analytics.css';
import { initialState } from 'src/pages/stallionDirectory/StallionRosterInitialState';
import { useStallionRosterQuery } from 'src/redux/splitEndpoints/stallionRoasterSplit';
import CreateAStallion from 'src/forms/CreateAStallion';
import AddStallion from 'src/forms/AddStallion';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { useGetInviteUsersListQuery } from 'src/redux/splitEndpoints/getInviteUsersListSplit';
import { transformResponse } from 'src/utils/FunctionHeap';
import { Spinner } from 'src/components/Spinner';
import { useGetStallionActivityQuery } from 'src/redux/splitEndpoints/getStallionActivitySplit';
import { useGetBreederActivityQuery } from 'src/redux/splitEndpoints/getBreederActivitySplit';
import { useGetStallionMatchActivityQuery } from 'src/redux/splitEndpoints/getStallionMatchActivitySplit';
import { useGetMareListSplitQuery } from 'src/redux/splitEndpoints/getMareListSplit';

import { api } from '../../../api/apiPaths';
import { UserCustomTable } from '../../lists/FarmUsersList';

// MetaTags
import useMetaTags from 'react-metatags-hook';
import useAuth from 'src/hooks/useAuth';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import { useGetStallionMatchActivityFarmsQuery } from 'src/redux/splitEndpoints/getStallionMatchActivityFarms';
import UnAuthorized from 'src/components/NoDataComponent/UnAuthorized';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import PromoteStallion from 'src/forms/PromoteStallion';

export default function FarmDashboardController() {
  const { authentication } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { farmId, farmName } = useParams();
  const Props = Constants.FarmDashboardConstants;
  const UserListProps = { navigate, ...Props.userListProps };
  const BreederActivityProps = { navigate, ...Props.breederActivityProps };
  const StallionActivityProps = { navigate, ...Props.stallionActivityProps };
  const ReportsOrderedProps = { navigate, ...Props.reportsOrderedProps, farmId };
  const MareListProps = { navigate, ...Props.mareListProps, farmId };
  const [openFarmPopover, setOpenFarmPopover] = useState(false);
  const [openProfilePopover, setOpenProfilePopover] = useState(false);
  const [defaultUserListFilterOption, setDefaultUserListFilterOption] = useState('Active');
  const [defaultStallionActivityFilterOption, setDefaultStallionActivityFilterOption] =
    useState('Name');
  const [defaultBreederActivityFilterOption, setDefaultBreederActivityFilterOption] =
    useState('Date');
  const [defaultMareListsFilterOption, setDefaultMareListsFilterOption] = useState('Date');
  const [items, setItems] = useState<any>([]);
  const { data: userFarmListData, isFetching: isUserFarmListFetching, isSuccess: isUserFarmListSuccess } = useGetUsersFarmListQuery(null, { skip: !authentication });

  const [metaFarmTitle, setMetaFarmTitle] = useState('Farm Dashboard');
  React.useEffect(() => {
    if (isUserFarmListSuccess) {
      // Find the farm object with the specified farmId
      const farmObject = userFarmListData?.find((farm: any) => farm.farmId === farmId);
      if (farmObject) {
        const userSelectedFarmName = farmObject.farmName;
        setMetaFarmTitle(`${toPascalCase(userSelectedFarmName)}'s Farm Dashboard`);
      }
    }
  }, [isUserFarmListFetching])

  // Meta tags for Farm dashboard
  useMetaTags(
    {
      title: `${metaFarmTitle} | Stallion Match`,
      description: `Stallion Match Farm Dashboard. Your farm administration - the data backed Stallion Match for the best pedigree.`,
    },
    [metaFarmTitle]
  );

  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [transformedUserList, setTransformedUserList] = useState<any[]>([]);
  const [transformedStallionActivityList, setTransformedStallionActivityList] = useState<any[]>([]);
  const [transformedBreederActivityList, setTransformedBreederActivityList] = useState<any[]>([]);
  const [transformedMaresListData, setTransformedMaresListData] = useState<any[]>([]);
  const { data: stallionMatchData } = useGetStallionMatchActivityQuery();
  const [stateFilterForAnalytics, setstateFilterForAnalytics] = useState<any>({});
  const [isInviteUsers, setIsInviteUsers] = useState(false);
  const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
  const [newllyPromoted, setNewlyPromoted] = useState(false);
  const [stallionId, setStallionId] = useState('');

  let isFarmOwner = false;
  let accessLevel: any = null;
  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];
  const farmNameFromData: any = userFarmListData?.filter((data: any) => data?.farmId === farmID);
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');
  const stallionMatchGraphData = stallionMatchData?.data;

  // Mare list parameters for api
  const mareListParams: any = {
    farmId: farmId,
    order: 'ASC',
    page: '1',
    limit: '4',
    sortBy: defaultMareListsFilterOption,
  };

  const { data: maresListData, isFetching: maresListDataFetching, isSuccess: maresListDataSuccess, status: mareStatusForAuthUser } = useGetMareListSplitQuery(mareListParams, { refetchOnMountOrArgChange: true });

  // Labels for Stallion Match Activity graph
  const labels = stallionMatchGraphData?.map((graph: any) => {
    let dateLabel = new Date(graph.label).toLocaleDateString('en-us', {
      day: '2-digit',
      month: 'short',
    })
    return dateLabel.split(" ").reverse().join(" ")
  }
  );

  // Axis for Stallion Match Activity graph
  const fakeX = stallionMatchGraphData?.map((graph: any) => graph.fakeX);
  const fakeY = stallionMatchGraphData?.map((graph: any) => graph.fakeY);
  const fakeZ = stallionMatchGraphData?.map((graph: any) => graph.fakeZ);

  const {
    data: stallionMatchedActivityData,
    isSuccess: stallionMatchedActivityDataSuccess
  } = useGetStallionMatchActivityFarmsQuery({
    ...stateFilterForAnalytics,
    farmId: farmId
  },
    { refetchOnMountOrArgChange: true });

  let Url = api.inviteUserUrl + '/' + farmId;

  // Open create stallion modal
  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  // Close create stallion modal
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
  };

  // Stallion roaster api parameters
  let newState = {
    ...initialState,
    Url: api.farmsUrl + '/' + farmId + api.stallions,
    body: {
      order: 'ASC',
      limit: 2,
      mostSearched: 1
    }
  };

  // Common parameters for all api
  const InitialState = {
    order: 'ASC',
    page: 1,
    limit: 5,
    sortBy: defaultUserListFilterOption,
  };

  // User list parameters for api
  let userListParams = {
    Url,
    body: {
      ...InitialState,
    },
  };

  // Sort by filter general function
  const changeTheStallionFilterText = (sort: any) => {
    let changedText = sort;
    if (sort === 'Page Views') {
      changedText = 'Pageviews';
    }
    if (sort === '20/20 Matches') {
      changedText = 'Twentytwentymatches';
    }
    if (sort === 'Perfect Matches') {
      changedText = 'Perfectmatches';
    }
    return changedText;
  }

  // Stallion activity prarmeters
  const stallionActivityParams: any = {
    order: 'ASC',
    page: 1,
    limit: 5,
    farmId: farmId,
    sortBy: changeTheStallionFilterText(defaultStallionActivityFilterOption),
    ...stateFilterForAnalytics,
  };

  // Breeder activity prarmeters
  const breederActivityParams: any = {
    ...InitialState,
    farmId: farmId,
    filterBy: stateFilterForAnalytics?.filterBy || "This Month",
    fromDate: stateFilterForAnalytics?.fromDate,
    toDate: stateFilterForAnalytics?.toDate,
    sortBy: defaultBreederActivityFilterOption,
  };

  // Api calls
  const { data: stallionRosterApiData, isFetching: stallionRosterFetching, isSuccess: stallionRosterSuccess } = useStallionRosterQuery(newState, { refetchOnMountOrArgChange: true });
  const userListData =
    useGetInviteUsersListQuery(userListParams);
  const { data: stallionActivityData, isFetching: stallionActivityFetching, isSuccess: stallionActivitySuccess } = useGetStallionActivityQuery(stallionActivityParams, { refetchOnMountOrArgChange: true });
  const { data: breederActivityData, isFetching: breederActivityFetching, isSuccess: breederActivitySuccess } = useGetBreederActivityQuery(breederActivityParams, { refetchOnMountOrArgChange: true });

  // On first render scroll to top of the page
  useEffect(() => {
    scrollToTop();
  }, []);

  // Get the user info
  useEffect(() => {
    const items: any = JSON.parse(localStorage.getItem('user') || '{}');
    if (items) {
      setItems(items);
    }
  }, []);

  // Navigate to roaster page
  const goToRoster = () => {
    navigate(`/stallion-roster/${farmName}/${farmId}`);
    //navigate(`/dashboard/stallion-roster/${farmID}`);
  };

  // Navigate to my stallion page
  const goToMyStallions = () => {
    navigate(`/stallions/${toPascalCase(farmName)}/${farmId}`);
    //navigate(`/dashboard/farm-dashboard/${farmID}/my-stallions-list`);
  };

  // Navigate to mare list page
  const customSendToMareLists = () => {
    navigate(`/mares-list/${farmName}/${farmId}`);
  };

  // Navigate to user list page
  const customSendToUserLists = () => {
    navigate(`/users/${farmName}/${farmId}`);
  };

  // Navigate to breeder report
  const customGotoBreederActivity = () => {
    navigate(`/report/breeder/${farmName}/${farmId}`);
  };

  // Open new promote stallion modal
  const handleOpenPromoteNew = () => {
    setNewlyPromoted(true);
  };

  // Close new promote stallion modal
  const handleClosePromoteNew = () => {
    setNewlyPromoted(false);
  };

  // Close promote stallion modal
  const handleClosePromoteStallion = () => {
    setAddStallionPromoteModal(false);
  };

  // Set stallion Id
  const handleSelectedStallions = (value: any) => {
    setStallionId(value);
  };

  // Open promote stallion modal
  const handleOpenPromoteStallion = () => {
    setAddStallionPromoteModal(true);
  };

  // Transform the user list data
  useEffect(() => {
    if (userListData?.data?.data) {
      if (userListData?.data?.data?.length > 0) {
        let arr: any = transformResponse(userListData?.data?.data, 'USER LIST');
        setTransformedUserList([...arr]);
      } else {
        setTransformedUserList([])
      };
    }
  }, [userListData?.data?.data, userFarmListData]);

  // Transform the mare list data
  useEffect(() => {
    if (maresListData?.data) {
      if (maresListData?.data?.length > 0)
        setTransformedMaresListData(transformResponse(maresListData?.data, 'MARES LIST'));
      else setTransformedMaresListData([]);
    }
  }, [maresListData?.data]);

  // Transform the stallion activity data
  useEffect(() => {
    if (stallionActivityData) {
      if (stallionActivityData?.length > 0)
        setTransformedStallionActivityList(
          transformResponse(stallionActivityData, 'STALLION ACTIVITY')
        );
      else setTransformedStallionActivityList([]);
    }
  }, [stallionActivityData]);

  // Transform the breeder activity data
  useEffect(() => {
    if (breederActivityData?.data) {
      if (breederActivityData?.data?.length > 0) {
        setTransformedBreederActivityList(
          transformResponse(breederActivityData?.data, 'BREEDER ACTIVITY')
        );
      } else {
        setTransformedBreederActivityList([]);
      }
    }
  }, [breederActivityData?.data]);

  // Set the farm owner and there access level state
  if (farmNameFromData) {
    isFarmOwner = farmNameFromData[0]?.isFamOwner;
    accessLevel = farmNameFromData[0]?.accessLevel;
  }

  // Common breeder parameter
  const breederProps = {
    openFarmPopover,
    setOpenFarmPopover,
    openProfilePopover,
    setOpenProfilePopover,
    farmOptions: ['Copy Farm Url', 'Farm Dashboard', 'Farm Page', 'Stallion Roster', 'Remove'],
    profileOptions: ['Farm Dashboard', 'Farm Page', 'Delete'],
    user: {
      id: items?.id,
      name: items?.fullName,
      location: 'Sydney, Australia',
      src: '',
    },
    farms: userFarmListData || JSON.parse(localStorage.getItem('user') || '{}')?.myFarms,
    received: 152,
    sent: 34,
    nominations: 22,
    messages: [
      {
        farmName: 'John Smith',
        timestamp: '123',
        timeStamp: '123',
        message: 'Congratulations for new stallion victory',
        messageText: 'Congratulations for new stallion victory',
        messageTitle: '',
        subject: 'General',
        isRead: false,
        senderName: '',
        featureName: '',
      },
    ],
    isFarmOwner: isFarmOwner,
    accessLevel: accessLevel,
  };

  // Set the date state
  const handleDatePicker = (data: any) => {
    setstateFilterForAnalytics(data);
  }

  // Handle dropdown state for user list
  const handleDropDownState = (data: any) => {
    let { openUserAccess, openUserFullAccessOrViewOnly } = data;
    if (!openUserAccess && !openUserFullAccessOrViewOnly) {
      userListData?.refetch();
    }
  }

  // User list props
  const updatedUserListProps = { ...UserListProps, farmId, farmName };

  // Get path for name
  const getPathName = pathname.split('/')[4];

  // Get path name to open different modals
  useEffect(() => {
    if (getPathName === 'addStallion') {
      setOpenStallionModal(true);
    }
    else if (getPathName === 'inviteUser') {
      setIsInviteUsers(true);
    }
  }, [getPathName])

  if (mareStatusForAuthUser === 'rejected') {
    return <UnAuthorized />
  }

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box pb={5}>
          {/* Farm dashboard header */}
          <Header data={breederProps?.farms} handleDatePicker={handleDatePicker} stateFilterForAnalytics={stateFilterForAnalytics} setstateFilterForAnalytics={setstateFilterForAnalytics} />
          {/* End Farm dashboard header */}
          {/* Farm Dashboard Stats */}
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={6} md={6} xs={12}>
                {/* Farm Profile */}
                <Grid item className="farmDashboardProfile">
                  <DashboardProfile {...breederProps} />
                </Grid>
                {/* Farm user list */}
                <Grid
                  item
                  mt={3}
                  className={`user-list ${transformedUserList.length === 0 || userListData?.data?.data === 0 ? 'no-data' : ''
                    }`}
                >
                  {/* This component contains common header and filters for all */}
                  <GridWrapper
                    {...updatedUserListProps}
                    defaultSelected={defaultUserListFilterOption}
                    customSendToUserLists={customSendToUserLists}
                    setDefaultSelected={setDefaultUserListFilterOption}
                    isInviteUsers={isInviteUsers}
                  >
                    {/* Show user list */}
                    <UserCustomTable
                      className="userListTable"
                      {...Props.userListTableProps}
                      data={transformedUserList}
                      farmId={farmId}
                      farmName={farmName}
                      handleDropDownState={handleDropDownState}
                      userListData={userListData}
                    />
                  </GridWrapper>
                </Grid>
                {/* Breeder Activity list */}
                <Grid
                  item
                  mt={3}
                  className={`Stallion-Activity ${transformedBreederActivityList.length === 0 ? 'no-data' : ''
                    }`}
                >
                  {/* This component contains common header and filters for all */}
                  <GridWrapper
                    {...BreederActivityProps}
                    defaultSelected={defaultBreederActivityFilterOption === 'Date' ? 'Name' : defaultBreederActivityFilterOption}
                    customSendToList={customGotoBreederActivity}
                    setDefaultSelected={setDefaultBreederActivityFilterOption}
                    showLinkBtn={breederActivityFetching === true ? false : true}
                  >
                    {/* Loader  */}
                    {breederActivityFetching === true && <Spinner />}
                    {/* Common Component to show lists */}
                    {breederActivityFetching === false && breederActivitySuccess === true && transformedBreederActivityList.length > 0 &&
                      <DataTable
                        {...Props.breederActivityTableProps}
                        data={transformedBreederActivityList}
                        farmId={farmId}
                      />}
                  </GridWrapper>
                </Grid>
                {/* Report Regarding this farm list */}
                <Grid item mt={3} className="report-oreders-box-wrpr hide">
                  {/* This component contains common header and filters for all */}
                  <GridWrapper {...ReportsOrderedProps} showLinkBtn={true}>
                    {/* Common Component to show lists */}
                    <DataTable {...Props.reportsOrderedTableProps} farmId={farmId} />
                  </GridWrapper>
                </Grid>
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                {/* Farm Analytics */}
                <Grid item className="farmDashboardAnalystic">
                  <Analytics farmId={farmId} stateFilterForAnalytics={stateFilterForAnalytics} />
                </Grid>
                {/* Stallion match activity graph */}
                <Grid item mt={3} className="stallionMatchActivityFarm">
                  <Stack className='Farmdashboard-Linechart'>
                    <StallionMatchActivity stallionMatchedActivityData={stallionMatchedActivityData} stateFilterForAnalytics={stateFilterForAnalytics} />
                  </Stack>
                </Grid>
                {/* Stallion activity list */}
                <Grid
                  item
                  mt={3}
                  className={`Stallion-Activity ${transformedStallionActivityList.length === 0 ? 'no-data' : ''
                    }`}
                >
                  {/* This component contains common header and filters for all */}
                  <GridWrapper
                    {...StallionActivityProps}
                    defaultSelected={defaultStallionActivityFilterOption}
                    customSendToList={goToMyStallions}
                    setDefaultSelected={setDefaultStallionActivityFilterOption}
                    showLinkBtn={stallionActivityFetching === true ? false : true}
                  >
                    {/* Loader */}
                    {stallionActivityFetching && <Spinner />}
                    {/* Common Component to show lists */}
                    {stallionActivityFetching === false && stallionActivitySuccess === true && transformedStallionActivityList.length > 0 &&
                      <DataTable
                        {...Props.stallionActivityTableProps}
                        data={transformedStallionActivityList}
                      />}
                  </GridWrapper>
                </Grid>
                {/* Mare list for particular farm */}
                <Grid
                  item
                  mt={3}
                  className={`mare-list ${transformedMaresListData.length === 0 ? 'no-data' : ''}`}
                >
                  {/* This component contains common header and filters for all */}
                  <GridWrapper
                    {...MareListProps}
                    defaultSelected={defaultMareListsFilterOption}
                    customSendToMareLists={customSendToMareLists}
                    setDefaultSelected={setDefaultMareListsFilterOption}
                  >
                    {/* Loader */}
                    {maresListDataFetching && <Spinner />}
                    {/* Common Component to show lists */}
                    {maresListDataFetching === false && maresListDataSuccess === true && transformedMaresListData.length > 0 &&
                      <DataTable
                        {...Props.mareListTableProps}
                        data={transformedMaresListData}
                        farmId={farmId}
                      />}
                  </GridWrapper>
                </Grid>
              </Grid>
            </Grid>
          </Container>
          {/* End Farm Dashboard Stats */}

          {/* Stallion roaster for particular farm */}
          <Box className="stallionOverviewBox">
            <Container maxWidth="lg">
              <Grid container spacing={2} className="stallion-overview-wrapper">
                <Grid item lg={5} md={5} xs={12} className="stallion-overview-left">
                  <Typography variant="h3" sx={{ color: '#1D472E' }}>
                    Stallion Overview
                  </Typography>
                </Grid>
                <Grid item lg={7} md={7} xs={12} spacing={1.25} className="stallion-overview-right">
                  <CustomButton
                    fullwidth
                    className="add-stallion"
                    onClick={() => setOpenStallionModal(true)}
                    disabled={accessLevel ? accessLevel === '3rd Party' ? true : false : false}
                  >
                    <i className="icon-Plus" /> Add Stallion
                  </CustomButton>

                  <CustomButton fullwidth className="regisBtn" onClick={goToMyStallions}>
                    {' '}
                    View Stallion List
                  </CustomButton>
                  <CustomButton fullwidth className="regisBtn viewSR" onClick={goToRoster}>
                    {' '}
                    View Stallion Roster
                  </CustomButton>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                {/* List of stallion roasters */}
                {stallionRosterFetching === false && stallionRosterSuccess === true && stallionRosterApiData?.data?.slice(0, 2)?.map((data: any) => (
                  <Grid key={data.id} item lg={6} sm={6} xs={12}>
                    <StallionView {...data} farmID={farmID} accessLevel={accessLevel} stateFilterForAnalytics={stateFilterForAnalytics} />
                  </Grid>
                ))}
                {/* Loader and no data component */}
                <Grid item lg={12} sm={12} xs={12}>
                  <Box sx={{ width: '100%' }}>
                    {stallionRosterFetching === true && <Spinner />}
                  </Box>
                  {stallionRosterFetching === false && stallionRosterApiData?.data?.length === 0 && <Box className="smp-no-data">
                    <Typography variant="h6">No Stallions in your roster.</Typography> {/* //No data found! */}
                  </Box>}
                </Grid>
              </Grid>
            </Container>
          </Box>
          {/* End Stallion roaster for particular farm */}

          {/* Add stallion popup */}
          <Box>
            <WrapperDialog
              open={openStallionModal}
              title={'Add a Stallion'}
              setDialogClassName={setDialogClassName}
              onClose={() => setOpenStallionModal(false)}
              body={AddStallion}
              className={'cookieClass'}
              changeTitleTest={setStallionTitle}
              openOther={handleOpenCreateStallionModal}
              handleSelectedStallions={handleSelectedStallions}
              openPromoteStallion={handleOpenPromoteStallion}
              sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
            />
          </Box>

          {/* Craete stallion popup */}
          <Box>
            <WrapperDialog
              open={openCreateStallionModal}
              title={stallionTitle}
              setOpenStallionModal={setOpenStallionModal}
              dialogClassName={dialogClassName}
              onClose={handleCloseCreateStallion}
              createStallion="createStallion"
              isSubmitStallion={true}
              isSubmitMare={false}
              closeAddMare={''}
              body={CreateAStallion}
              className={'cookieClass'}
              sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
            />
          </Box>
          {/* Promote Your Stallion popup modal */}
          <Box>
            <WrapperDialog
              open={openAddStallionPromoteModal}
              title={'Promote Your Stallion'}
              onClose={handleClosePromoteStallion}
              openOther={handleOpenPromoteNew}
              OpenPromote={'OpenPromote'}
              selectedStallionIds={stallionId}
              body={AddStallionPromote}
              className={'cookieClass'}
              sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
            />
          </Box>
          {/* Promote Stallion popup modal */}
          <Box>
            <WrapperDialog
              open={newllyPromoted}
              title={'Promote Stallion'}
              onClose={handleClosePromoteNew}
              promoteStallionType={() => { }}
              selectedStallionIds={''}
              stallionId={stallionId}
              body={PromoteStallion}
            />
          </Box>
        </Box>
      </StyledEngineProvider>
    </>
  );
}
