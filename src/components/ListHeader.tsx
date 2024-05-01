import React, { useState } from 'react';
import { Typography, MenuItem, StyledEngineProvider, Stack, Popover, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { ListHeaderProps } from '../@types/listHeader';
import { CustomButton } from './CustomButton';
import { CustomSelect } from './CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { WrapperDialog } from './WrappedDialog/WrapperDialog';
import AddForm from '../forms/ListsAddForm';
import OrderReport from '../forms/OrderReports';
import UpdateEmail from 'src/forms/UpdateEmail';
import UploadMareLists from 'src/forms/UploadMareLists';
import './Datatable/DataList.css';
import 'src/pages/dashboard/breederDashboard/BreederDashboard.css';
import { MenuProps } from '../constants/MenuProps';
import AddStallion from 'src/forms/AddStallion';
import CreateAStallion from 'src/forms/CreateAStallion';
import InviteUser from 'src/forms/InviteUser';
import { useLocation } from 'react-router-dom';
import { TitleArray } from 'src/constants/ReportsTitleArray';
import { toPascalCase } from 'src/utils/customFunctions';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import { ROUTES } from 'src/routes/paths';
import {
  Button,
} from '@mui/material';
import { useGetProjectReportsCurrencyInfoQuery } from 'src/redux/splitEndpoints/getProjectReport';
import useAuth from 'src/hooks/useAuth';
import useMetaTags from 'react-metatags-hook';

function ListHeader(props: ListHeaderProps) {
  const { authentication } = useAuth();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openUpdateEmail, setOpenUpdateEmail] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [param, setParam] = useState('');
  const [reportId, setReportId] = useState('');
  const [openUploadMareList, setOpenUploadMareList] = useState(false);
  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [openInviteUser, setOpenInviteUser] = useState(false);
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');
  const [viewStallionsAnalysed, setViewStallionsAnalysed] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [selectedReport, setSelectedReport] = React.useState<any>({});

  const countryName = window.localStorage.getItem("geoCountryName");
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');
  const { data: projectReportCurrencyInfoList, isSuccess: isProjectReportCurrencyInfoListSuccess } = useGetProjectReportsCurrencyInfoQuery(authentication ?
    { member: user?.id, country: user?.memberaddress[0]?.countryName ? user?.memberaddress[0]?.countryName : "Australia" } : { country: countryName ? countryName : "Australia" });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  // open stallion popup
  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  // close stallion popup
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
    setStallionTitle('Add a Stallion');
  };

  // sort functionality handler
  const requestInterceptor = (val: string) => {
    switch (val) {
      case 'Date Uploaded':
        return 'Date';
      case 'Mares':
        return 'Number of Mares';
      default:
        return val;
    }
  };
  const handleChangeSort = (e: any) => {
    const val = requestInterceptor(e.target.value);
    if (props.setSortBy) {
      props.setSortBy(val);
    }
  };

  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);

  // method for add mare
  const addMare = () => {
    setParam('Mare');
    setOpenAddForm(true);
  };
  // method for add stallion
  const addStallion = () => {
    setParam('Stallion');
    setOpenAddForm(true);
    setReportId('1');
  };
  // method for add damsire
  const addDamsire = () => {
    setParam('Broodmare Sire');
    setOpenAddForm(true);
    setReportId('5');
  };
  // method for add farm
  const addFarm = () => {
    setParam('Farm');
    setOpenAddForm(true);
  };
  // method for open pro report
  const orderProReport = () => {
    setReportId('1');
    setOpenReport(true);
  };
  // method for open Affinity Report
  const orderAffinityReport = () => {
    setReportId('4');
    setOpenReport(true);
  };
  // method for open Broodmare Report
  const orderBroodmareReport = () => {
    setReportId('5');
    setOpenReport(true);
  };
  const addMareList = () => setOpenUploadMareList(true);

  // method for open add stallion popup
  const openStallion: any = () => {
    setOpenStallionModal(true);
  };

  // method for open invite user
  const handleOpenInviteUser: any = () => {
    setOpenInviteUser(true);
  };
  const download: any = () => {
    return 'Download';
  };

  // dynamic button function
  const FunctionArray = [
    addMare,
    addStallion,
    addDamsire,
    addFarm,
    orderProReport,
    orderAffinityReport,
    orderBroodmareReport,
    addMareList,
    openStallion,
    handleOpenInviteUser,
    download,
  ];

  const paths = {
    farmDashboard: '/dashboard/',
    managestallion: '/stallions',
    myHorses: '/dashboard/my-horses/',
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '2px',
        marginTop: '-6px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  // pathname from url params
  const { pathname } = useLocation();
  const isFarmDashboardList =
    !pathname.includes('dashboard') &&
    (pathname.includes('stallions') ||
      pathname.includes('users') ||
      pathname.includes('mares-list') ||
      pathname.includes('my-mares-list')
    );
  const isBreederDashboardList =
    pathname.includes('dashboard') &&
    pathname.includes('mares-list') ||
    (pathname.includes('favourite-stallions-list') ||
      pathname.includes('favourite-damsires-list') ||
      pathname.includes('favourite-farms-list') ||
      pathname.includes('my-horses')
    );

  const FarmDashboardBreadcrumbLastLabel =
    (isFarmDashboardList && pathname.includes('stallions')) ? toPascalCase(props?.farmName)?.toString() + "'s Stallions" :
      (isFarmDashboardList && pathname.includes('users')) ? 'Users List' :
        (isFarmDashboardList && pathname.includes('mares-list')) ? 'Mare Lists' : '';
  // (isFarmDashboardList && pathname.includes('favourite-farms-list')) ? 'Favourite Farms' : 
  // (isFarmDashboardList && pathname.includes('my-horses')) ? 'My Horses' : '';  

  const bredderBreadcrumbLastLabel =
    (isBreederDashboardList && pathname.includes('mares-list')) ? 'My Mares' :
      (isBreederDashboardList && pathname.includes('favourite-stallions-list')) ? 'Favourite Stallions' :
        (isBreederDashboardList && pathname.includes('favourite-damsires-list')) ? 'Favourite Broodmare Sires' :
          (isBreederDashboardList && pathname.includes('favourite-farms-list')) ? 'Favourite Farms' :
            (isBreederDashboardList && pathname.includes('my-horses')) ? 'My Horses' : '';

  const currentPage = pathname.split('/');
  const backToUrl =
    isFarmDashboardList === true
      ? paths.farmDashboard + `${props?.farmName}/${props?.farmId}`
      : '/dashboard';
  const breadcrumbText =
    isFarmDashboardList === true ? 'Back to Farm Dashboard' : 'Back to Breeder Dashboard';

  const formIds = (type: any) => {
    switch (type) {
      case 0:
        return "shortlist_report_1";
      case 1:
        return "stallion_match_pro_2";
      case 2:
        return "broodmare_affinity_report_3";
      case 3:
        return "stallion_match_sales_report_4";
      case 4:
        return "stallion_affinity_report_5";
      case 5:
        return "stallion_dam_sire_report_6";
      default:
        return "";
    }
  }

  const {
    DASHBOARD,
    STALLION_MATCH,
    STALLION_SEARCH,
    DIRECTORY,
    TRENDS,
    REPORTS,
    NOTIFICATIONS,
    MESSAGES,
    USERPROFILE,
    FARMPROFILE,
    FARMDASHBOARDPROFILE,
    MYHORSES,
    SHORTLIST,
    CONTACT_US,
  } = ROUTES;

  // Define your condition here
  const shouldShowMyHorseLink = window.sessionStorage.getItem('MyFavouriteListFrom');

  const links = [
    { name: 'Home', href: '/' },
    { name: 'My Dashboard', href: DASHBOARD },
  ];
  if (shouldShowMyHorseLink) {
    links.push({ name: 'My Horses', href: MYHORSES });
  }

  links.push({
    name: bredderBreadcrumbLastLabel,
    href: ''
  });

  const handleOpenReport = (type: string, reportType: string) => {
    let num: any = Number(type);
    setReportId(type);
    setOpenReport(true);
    projectReportCurrencyInfoList?.forEach((v: any) => {
      if (reportType === v.productCode) {
        setSelectedReport(v);
      }
    })
  };
   
  const  [dashboardListMetaTitle, setDashboardListMetaTitle] = React.useState('');
  const  [dashboardListMetaDesc, setDashboardListMetaDesc] = React.useState('');

  React.useEffect(() => {
    setDashboardListMetaTitle(
      (isFarmDashboardList && pathname.includes('stallions')) ? `${toPascalCase(props?.farmName)?.toString()}'s Farm Stallion List`:
      (isFarmDashboardList && pathname.includes('users')) ? `${toPascalCase(props?.farmName)?.toString()}'s Farm User List` :
      (isFarmDashboardList && pathname.includes('mares-list')) ? 'My Breeding Mares List' : 
      (isBreederDashboardList && pathname.includes('mares-list')) ? 'My Mares' : 
      (isBreederDashboardList && pathname.includes('favourite-stallions-list')) ? 'Favorite Stallions' : 
      (isBreederDashboardList && pathname.includes('favourite-damsires-list')) ? 'My Favourtite Broodmare Sires' : 
      (isBreederDashboardList && pathname.includes('favourite-farms-list')) ? 'My Favourite Horse Farms' : 
      (isBreederDashboardList && pathname.includes('my-horses')) ? 'My Horses Dashboard' : ''
    );
    setDashboardListMetaDesc(
      (isFarmDashboardList && pathname.includes('stallions')) ? `Stallion Match Farm Dashboard. Your farm administration - the data backed Stallion Match for the best pedigree.`:
      (isFarmDashboardList && pathname.includes('users')) ? `Stallion Match Farm Dashboard. Your user list - the data backed Stallion Match for the best pedigree.` :
      (isFarmDashboardList && pathname.includes('mares-list')) ? 'Stallion Match Mares List. My list of mares, data and info - the data backed Stallion Match for the best pedigree.' :   
      (isBreederDashboardList && pathname.includes('mares-list')) ? `Stallion Match Mares List. My list of mares, data and info - the data backed stallion match for the best pedigree.` : 
      (isBreederDashboardList && pathname.includes('favourite-stallions-list')) ? `View/Add Stallions as favorite and also order a Stallion affinity report` : 
      (isBreederDashboardList && pathname.includes('favourite-damsires-list')) ? `Favourite Broodmares Dashboard. My list of horses, data and info - the data backed Stallion Match for the best pedigree.` : 
      (isBreederDashboardList && pathname.includes('favourite-farms-list')) ? `Favourite Farms Dashboard. My list of farms, data and info - the data backed stallion match for the best pedigree.` : 
      (isBreederDashboardList && pathname.includes('my-horses')) ? `All of your horses and stats in one place. Customise your lists and show all of your mares and stallions stats on your dashboard.` : ''
    )
  }, [isFarmDashboardList, isBreederDashboardList]);

  useMetaTags({
    title: `${dashboardListMetaTitle} | Stallion Match`,
    description: `${dashboardListMetaDesc}`
  }, [dashboardListMetaTitle, dashboardListMetaDesc])
  
  return (
    <StyledEngineProvider injectFirst>
      {/* WrapperDialog for Order Report */}
      <WrapperDialog
        reportId={reportId}
        open={openReport}
        title={TitleArray[parseInt(reportId)]}
        onClose={() => {
          if (viewStallionsAnalysed) {
            setViewStallionsAnalysed(false)
          } else {
            setOpenReport(false);
            setViewStallionsAnalysed(false);
          }
        }}
        openOther={() => setOpenUpdateEmail(true)}
        formId={formIds(parseInt(reportId))}
        currencyCode={selectedReport?.currencyCode}
        reportPrice={selectedReport?.price}
        reportCurrencyId={selectedReport?.currencyId}
        reportCurrencySymbol={selectedReport?.currencySymbol}
        cartInfo={undefined}
        body={OrderReport}
        viewStallionsAnalysed={viewStallionsAnalysed}
        setViewStallionsAnalysed={setViewStallionsAnalysed}
      />
      {/* WrapperDialog for Add Form */}
      <WrapperDialog
        open={openAddForm}
        title={`Add a ${param}`}
        onClose={() => setOpenAddForm(false)}
        body={AddForm}
        param={param}
      />
      {/* WrapperDialog for Update Email */}
      <WrapperDialog
        open={openUpdateEmail}
        title="Update Email"
        onClose={() => setOpenUpdateEmail(false)}
        body={UpdateEmail}
      />
      {/* WrapperDialog for Upload Mare Lists */}
      <WrapperDialog
        open={openUploadMareList}
        title={'Add a new Mare List'}
        dialogClassName="dialogPopup addnewmareList"
        onClose={() => setOpenUploadMareList(false)}
        body={UploadMareLists}
        farmID={props.farmId}
      />
      <Box>
        {/* WrapperDialog for Add Stallion */}
        <WrapperDialog
          open={openStallionModal}
          title={stallionTitle}
          setDialogClassName={setDialogClassName}
          onClose={() => setOpenStallionModal(false)}
          body={AddStallion}
          className={'cookieClass'}
          changeTitleTest={setStallionTitle}
          openOther={handleOpenCreateStallionModal}
          handleSelectedStallions={() => { }}
          openPromoteStallion={() => { }}
          sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
        />
      </Box>
      <Box>
        {/* WrapperDialog for Create Stallion */}
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
      {/* WrapperDialog for Invite User */}
      <WrapperDialog
        open={openInviteUser}
        title="Invite New User"
        onClose={() => setOpenInviteUser(false)}
        addAFarm={'add a farm'}
        body={InviteUser}
      />
      <Box mb={4}>
        <Box className='dashboard-header'>
          {
            (isFarmDashboardList ?
              <HeaderBreadcrumbs
                heading="Profile"
                links={[
                  { name: 'Home', href: '/' },
                  { name: 'My Dashboard', href: DASHBOARD },
                  { name: toPascalCase(props?.farmName)?.toString() + ' Dashboard', href: backToUrl },
                  { name: FarmDashboardBreadcrumbLastLabel },
                ]}
              />
              :
              <HeaderBreadcrumbs
                heading="Profile"
                links={links}
              />
            )
          }

        </Box>
        <Box mt={3}>
          <Typography variant="h2">
            {currentPage[1] === 'stallions' && props?.farmName && props?.farmId
              ? toPascalCase(props?.farmName) + "'s Stallions"
              : props.title}
          </Typography>
        </Box>
        <Stack
          className="common-list-header-row"
          mt={3}
          direction={{ lg: 'row', sm: 'row', xs: 'column' }}
        >
          {/* dynamic button */}
          <Box className="mare-header">
          {props.title === 'My Mares' &&
            <Box className="reportDropdown">
              <Button aria-describedby={id} className="ListBtn" variant="contained" onClick={handleClick}>
                Order Report
              </Button>
              <Popover
                id={id}
                disablePortal
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box className="Demo__container order-report-menu">
                  <Box className="Demo__some-network report-menu-hover" onClick={() => handleOpenReport('0', "REPORT_SHORTLIST_STALLION")}>
                    {'Stallion Shortlist report'}
                  </Box>
                  <Divider />
                  <Box className="Demo__some-network report-menu-hover" onClick={() => handleOpenReport('1', "REPORT_STALLION_MATCH_PRO")}>
                    {'Stallion Match PRO report'}
                  </Box>
                  <Divider />
                  <Box className="Demo__some-network report-menu-hover" onClick={() => handleOpenReport('5', "REPORT_BROODMARE_SIRE")}>
                    {'Broodmare Sire report'}
                  </Box>
                </Box>
              </Popover>
            </Box>
          }
          <Box flexGrow={1} className="list-header">
            {props.buttons.map(
              (
                { buttonText, buttonStyles, className, type, downloadBtnLink, downloadClassName },
                index: number
              ) => (
                <Box key={buttonText} mr={1}>
                  {type !== 'download' ? (
                    (props.title === 'My Mares' && className === 'icon-Document-text') ? '' :
                      <CustomButton
                        className="ListBtn"
                        sx={{ ...buttonStyles }}
                        onClick={FunctionArray[props.buttonFunctionId[index]]}
                      >
                        <i className={className} /> {buttonText}
                      </CustomButton>
                  ) : (
                    <a href={downloadBtnLink ? downloadBtnLink : ''} download>
                      <CustomButton className="ListBtn">
                        {<i className={className} />}
                        {buttonText}
                      </CustomButton>
                    </a>
                  )}
                </Box>
              )
            )}
          </Box>
          </Box>

          {/* dynamic button end */}
          {/* Sort section */}
          {props.dropdownList && (
            <Box
              className="listheadsortby"
              sx={{ display: 'flex', mt: { lg: '0px', sm: '0px', xs: '1rem' } }}
            >
              <Typography variant="h5" className="sortby">
                Sort by
              </Typography>
              <CustomSelect
                IconComponent={KeyboardArrowDownRoundedIcon}
                sx={{ height: '40px' }}
                className="selectDropDownBox sort-recent"
                defaultValue={'Name'}
                MenuProps={{
                  keepMounted: true,
                  hideBackdrop: false,
                  disablePortal: true,
                  getContentAnchorEl: null,
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  ...MenuProps,
                }}
                onChange={handleChangeSort}
              >
                {props.dropdownList.map((value: string, index: number) => (
                  <MenuItem className="selectDropDownList" value={value} key={value + index}>
                    {value}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>
          )}
          {/* Sort section end */}
        </Stack>
      </Box>
    </StyledEngineProvider>
  );
}

export default ListHeader;
