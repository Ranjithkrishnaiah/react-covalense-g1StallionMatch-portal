import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, MenuItem, Popover, Stack, StyledEngineProvider, Tooltip, TooltipProps, Typography, tooltipClasses } from '@mui/material';
import './Datatable/DataList.css';
import { CustomButton } from './CustomButton';
import { TableWrapperProps } from '../@types/gridWrapper';
import { CustomSelect } from './CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { scrollToTop } from 'src/utils/customFunctions';
import CustomDateRangePicker from './customDateRangePicker/DateRangePicker';
import { WrapperDialog } from "./WrappedDialog/WrapperDialog";
import AddForm from '../forms/ListsAddForm';
import OrderReport from '../forms/OrderReports';
import UpdateEmail from '../forms/UpdateEmail';
import { MenuProps } from '../constants/MenuProps';
import { DateRange } from 'src/@types/dateRangePicker';
import InviteUser from 'src/forms/InviteUser';
import { TitleArray } from 'src/constants/ReportsTitleArray';
import UploadMareLists from 'src/forms/UploadMareLists';
import { useFullScreenHandle } from "react-full-screen";
import { useDownLoadMareListTemplateQuery } from 'src/redux/splitEndpoints/downloadMareListTemplate';
import InvitationSuccess from 'src/forms/InvitationSuccess';
import FullScreenDialog from './fullscreenDialog/FullScreenWrapperDialog';
import { Images } from 'src/assets/images';
import styled from 'styled-components';
import useWindowSize from 'src/hooks/useWindowSize';
import { useGetProjectReportsCurrencyInfoQuery } from 'src/redux/splitEndpoints/getProjectReport';
import useAuth from 'src/hooks/useAuth';

export default function GridWrapper(props: TableWrapperProps) {
  const navigateRoute = useNavigate();
  const { authentication } = useAuth();
  const { path, navigate, linkBtnText, defaultSelected, downloadBtnText, InviteBtnIcon,
    InviteBtnText, userId, userName, setDefaultSelected, mareListsBtnText, showLinkBtn, isTrends,
    dueDate, viewAllMareListsBtnText, viewAllMarelistsBtnClassName, farmName = "", setDueDate, tableHeaderClass,
    tableName, tableTitleClass, farmId = "", customSendToMareLists,
    customSendToList, customSendToUserLists, isInviteUsers } = props;
  const countryName = window.localStorage.getItem("geoCountryName");
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');
  const { data: projectReportCurrencyInfoList, isSuccess: isProjectReportCurrencyInfoListSuccess } = useGetProjectReportsCurrencyInfoQuery(authentication ?
    { member: user?.id, country: user?.memberaddress[0]?.countryName ? user?.memberaddress[0]?.countryName : "Australia" } : { country: countryName ? countryName : "Australia" });
  const [openAddForm, setOpenAddForm] = React.useState(false);
  const [openUpdateEmail, setOpenUpdateEmail] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);
  const [param, setParam] = React.useState("");
  const [reportId, setReportId] = React.useState("");
  const [openInviteUser, setOpenInviteUser] = React.useState(false);
  const [openUploadMareList, setOpenUploadMareList] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(defaultSelected);
  const [fetchMareListTemplate, setFetchMareListTemplate] = React.useState(false);
  const [viewStallionsAnalysed, setViewStallionsAnalysed] = React.useState<boolean>(false);
  const ButtonFunctionIdArray = props.buttonFunctionId;
  const { data: sampleMareListTemplate, isSuccess: isMareListTemplateSuccess } = useDownLoadMareListTemplateQuery(null, { skip: !fetchMareListTemplate })
  let Children: any[] = React.Children.toArray(props.children);
  const [openSuccessPopup, setOpenSuccessPopup] = React.useState(false);
  const [notifyEmail, setNotifyEmail] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [selectedReport, setSelectedReport] = React.useState<any>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleReportClose = () => {
    setAnchorEl(null);
  };

  const openOrderReport = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  // On Success hide the loader
  React.useEffect(() => {
    if (isMareListTemplateSuccess) {
      setFetchMareListTemplate(false)
    }
    if (openInviteUser) localStorage.removeItem('invitationEmail');
  }, [isMareListTemplateSuccess, openInviteUser])

  // Parameters for fullscreen handling
  const handle = useFullScreenHandle();
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const size = useWindowSize();

  const openFullscreen = () => {
    handle.enter();
    setIsFullScreen(true);
  };
  const closeFullscreen = () => {
    handle.exit();
    setIsFullScreen(false);
  };

  const reportChange = useCallback((state, handle) => {
    setIsFullScreen(state);
  }, [handle]);

  // Show dropdown options
  if (props.dropdown && props.dropdownOptions && Children.length > 0) {
    Children = [React.cloneElement(Children[0], { selectedOption })]
  }

  // Set dropdown state
  const handleOptionSelect = (e: any) => {
    setSelectedOption(e.target.value)
    if (typeof (e.target.value === 'string') && setDefaultSelected) setDefaultSelected(e.target.value)
  }

  const [dueDateValue, setDueDateValue] = React.useState<DateRange>([null, null]);

  // Set date value
  const handleDueDate = (value: DateRange) => {
    if (`${dueDateValue[0]}` !== `${value[0]}` || `${dueDateValue[1]}` !== `${value[1]}`) {
      setDueDateValue(value);
    }
  }

  // Open upload popup for mare list
  const handleUploadMareList = () => setOpenUploadMareList(true)

  // Open add mare popup
  const addMare = () => {
    setParam("Mare");
    setOpenAddForm(true);
  }

  // Open add stallion popup
  const addStallion = () => {
    setParam("Stallion");
    setOpenAddForm(true);
    setReportId("1");
  }

  // Open add dam sire popup
  const addDamsire = () => {
    setParam("Broodmare Sire");
    setOpenAddForm(true);
    setReportId("5");
  }

  // Open add farm popup
  const addFarm = () => {
    setParam("Farm")
    setOpenAddForm(true)
  }

  // Open order report popup
  const orderProReport = () => {
    setReportId("1");
    setOpenReport(true)
  }

  // Open order report popup
  const orderAffinityReport = () => {
    setReportId("4");
    setOpenReport(true)
  }

  // Open order report popup
  const orderBroodmareReport = () => {
    setReportId("5");
    setOpenReport(true)
  }

  // Based on list type open the add popup
  const mapAddFunctionsToTables = () => {
    switch (tableName) {
      case "Your Mares":
        return addMare;
      case "Favourite Stallions":
        return addStallion;
      case "Favourite Damsires":
        return addDamsire;
      case "Favourite Farms":
        return addFarm;
    }
  }

  // Open the fullscreen popup
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the fullscreen popup
  const handleClose = () => {
    setOpen(false);
  };

  // Array of function will based on indexes
  const FunctionArray = [addMare, addStallion, addDamsire, addFarm,
    orderProReport, orderAffinityReport, orderBroodmareReport, handleClickOpen];

  // Navigate to provided path
  const sendToList = () => {
    if (navigate && path && linkBtnText) {
      navigate(path);
      scrollToTop();
    }
  };

  // Navigate to user list
  const sendToUserList = () => {
    if (path === "users-list") {
      navigateRoute("users/" + `${farmName}/${farmId}`)
    }
    if (navigate && path && props?.userBtnText) {
      navigate(path);
    }
  }

  // Navigate to mare list
  const sendToMareLists = () => {
    if (navigate && path && props?.mareListsBtnText) {
      navigate(path);
    }
  }

  if (props.childClassName === "stallionMatchActvityBox") {
  }

  // Open invite popup 
  React.useEffect(() => {
    if (isInviteUsers === true) {
      setOpenInviteUser(true);
    }
  }, [isInviteUsers])

  // Light tooltip for info
  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0.87)',
      // boxShadow: theme.shadows[1],
      fontSize: 16,
      fontFamily: 'Synthese-Book',
      padding: '24px',
      border: '1px solid #E2E7E1',
      borderRadius: '8px',
      boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
      lineHeight: '24px'
    },
  }));

  // list of reports
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


  const handleOpenReport = (type: string, reportType: string) => {
    setReportId(type);
    setOpenReport(true);
    projectReportCurrencyInfoList?.forEach((v: any) => {
      if (reportType === v.productCode) {
        setSelectedReport(v);
      }
    })
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className="dashboardList" pb={3} sx={{ flexGrow: 1 }}>
        {/* Order Report Popup */}
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
        {/* Add Form for mare, stallion and sire popup */}
        <WrapperDialog
          open={openAddForm}
          title={`Add a ${param}`}
          onClose={() => setOpenAddForm(false)}
          body={AddForm}
          param={param}
        />
        {/* Update email popup */}
        <WrapperDialog
          open={openUpdateEmail}
          title="Update Email"
          onClose={() => setOpenUpdateEmail(false)}
          body={UpdateEmail}
        />
        {/* Invite user popup */}
        <WrapperDialog
          open={openInviteUser}
          title="Invite New User"
          onClose={() => {
            setOpenInviteUser(false)
            if (localStorage.getItem("invitationEmail") !== null) setOpenSuccessPopup(true);
          }}
          addAFarm={"invite a user"}
          body={InviteUser}
          email={setNotifyEmail}
        />
        {/* Upload mare list popup */}
        <WrapperDialog
          open={openUploadMareList}
          title={'Add a new Mare List'}
          dialogClassName='dialogPopup addnewmareList'
          onClose={() => setOpenUploadMareList(false)}
          body={UploadMareLists}
          farmID={farmId}
        />
        {/* Show Invite success popup */}
        <WrapperDialog
          dialogClassName="dialogPopup Success-invitation"
          open={openSuccessPopup}
          title="Success!"
          onClose={() => {
            setOpenSuccessPopup(false);
            localStorage.removeItem('invitationEmail');
          }}
          body={InvitationSuccess}
          userEmail={localStorage.getItem('invitationEmail')}
          titleSx={{ backgroundColor: '#1D472E', color: "#2EFFB4 !important" }}
          iconSx={{
            position: 'absolute',
            right: 12,
            width: 36,
            height: 36,
            top: 18,
            color: "#2EFFB4 !important"
          }}
        />
        <Box
          className={tableHeaderClass ? tableHeaderClass : `boxes-header-wrapper`}
          px={3}
        >
          {/* Title of tiles */}
          <Box className='trends-broodmare'>
            <Typography className={typeof (tableTitleClass) === 'string' ? tableTitleClass : "title"} >{props.title}</Typography>
            {props?.infoIconText && <Box>
              {size?.width > 767 &&
                <LightTooltip
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                title={props?.infoIconText}
                  placement='right-start'
                >
                  <i className="icon-Info-circle"></i>
                </LightTooltip>
              }
              {size?.width <= 767 &&
                <LightTooltip
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                  title={props?.infoIconText}
                >
                  <i className="icon-Info-circle"></i>
                </LightTooltip>
              }
            </Box>}
          </Box>
          {/* End Title of tiles */}


          {/* Dropdown filter or Datepicker will show based on tile types */}
          <Box className='grid-btns'>
            {props.title === 'Your Mares' &&
              <Box>
                <Button className="ListBtn" aria-describedby={id} variant="contained" onClick={handleClick}>
                  Order Report
                </Button>
                <Popover
                  id={id}
                  disablePortal
                  open={openOrderReport}
                  anchorEl={anchorEl}
                  onClose={handleReportClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  sx={{ borderRadius: "8px !important" }}
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

            {!!ButtonFunctionIdArray && props.buttons?.map(({ buttonText, buttonStyles, className }, index: number) => (
              (props.title === 'Your Mares' && className === 'icon-Document-text') ? '' :
                <CustomButton
                  className="ListBtn"
                  key={buttonText}
                  sx={{ ...buttonStyles }}
                  onClick={ButtonFunctionIdArray ? FunctionArray[ButtonFunctionIdArray[index]] : () => null}
                >
                  <i className={className} /> {buttonText}
                </CustomButton>
            ))}
            {downloadBtnText ? (
              <a href={props?.downloadBtnLink ? props?.downloadBtnLink : ""} download style={{ marginRight: '4px' }} >
                <CustomButton className={props.downloadBtnClassName}>
                  {props.downloadBtnIcon ? <i className={props.downloadBtnIcon} /> : ""}{downloadBtnText}
                </CustomButton>
              </a>
            ) : (
              ""
            )}

            {props.dropdown ? (
              <CustomSelect
                fullWidth
                IconComponent={KeyboardArrowDownRoundedIcon}
                className='selectDropDownBox select-dropdown'
                defaultValue={defaultSelected || 'none'}
                sx={{ position: 'relative' }}
                value={selectedOption}
                onChange={handleOptionSelect}
                MenuProps={MenuProps}

              >
                {!props.dropdownOptions &&
                  <MenuItem className='selectDropDownList' value="none" disabled>
                    <em>Sort by</em>
                  </MenuItem>}
                {props.dropdownOptions?.map((option: string) => (
                  <MenuItem className='selectDropDownList' value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}

              </CustomSelect>
            ) : (
              ''
            )}
            {props.datePicker &&
              <CustomDateRangePicker
                isTrends={isTrends}
                handleDueDate={setDueDate || handleDueDate}
                dueDate={dueDate}
              />
            }
          </Box>
          {/* End Dropdown filter or Datepicker will show based on tile types */}
        </Box>
        {/* Description of tile types */}
        {props.description ? (
          <Box py={2}>
            <Typography className={props.descriptionClassName || "description"}
              sx={props.descriptionSx}>{props.description}</Typography>
          </Box>
        ) : (
          ''
        )}
        {/* End Description of tile types */}

        {/* Button type based on tiles like fullscreen, invite button, etc. */}
        <Box sx={{ ml: { lg: 'auto', xs: '0' } }} className={props.childClassName}>
          <FullScreenDialog className={`fullscreen ${open ? 'fullscreen-enabled' : ''}`} open={open} setOpen={setOpen}>
            {open &&
              <Stack className='FullscreenButtonWrp'>
                <CustomButton className="ListBtn fullscreenBtn" onClick={handleClose}>
                  <img
                    src={Images.collapseicon}
                    alt="close"
                    className='collapse-icon'
                    onClick={handleClose}
                  />{' '}
                  Exit Full Screen
                </CustomButton></Stack>}
            {Children}
          </FullScreenDialog>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }} className={props.bottomButtonClassName}>
            {props?.userBtnText ? (
              <Box sx={{ display: 'flex' }} mt={1}>
                <CustomButton className={props.userBtnClassName}
                  onClick={customSendToUserLists ? customSendToUserLists : sendToUserList}>
                  {/* {props.user? <i className={props.InviteBtnIcon}/>:""}*/}
                  {props?.userBtnText}
                </CustomButton>
              </Box>
            ) : (
              ''
            )}
            {InviteBtnText ? (
              <Box sx={{ display: 'flex' }} mt={1}>
                <CustomButton onClick={() => setOpenInviteUser(true)} className={props.InviteBtnClassName}>
                  {props.InviteBtnIcon ? <i className={props.InviteBtnIcon} /> : ""}{InviteBtnText}
                </CustomButton>
              </Box>
            ) : (
              ''
            )}
            {showLinkBtn && linkBtnText && navigate && path ? (
              <Box sx={{ display: 'flex' }} mt={1}>
                <CustomButton className="buttonGlobal"
                  onClick={customSendToList ? customSendToList : sendToList}>
                  {props.linkBtnIcon ? <i className={props.linkBtnIcon} /> : ""} {props.linkBtnText}
                </CustomButton>
              </Box>
            ) : (
              tableName && <CustomButton className="buttonGlobal" onClick={mapAddFunctionsToTables()}>Add to {tableName}</CustomButton>
            )}

            {viewAllMareListsBtnText ? (
              <CustomButton className={viewAllMarelistsBtnClassName}
                onClick={customSendToMareLists ? customSendToMareLists : sendToMareLists}>
                {viewAllMareListsBtnText}
              </CustomButton>
            ) : (
              ""
            )}
            {mareListsBtnText ? (
              <Box>
                <CustomButton id={farmId} sx={{ display: 'flex' }} className="buttonGlobal"
                  onClick={handleUploadMareList}>
                  {props.mareListsBtnIcon ? <i className={props.mareListsBtnIcon} /> : ""}
                  {mareListsBtnText}
                </CustomButton>
              </Box>
            ) : (
              ''
            )}
          </Box>
        </Box>
        {/* End Button type based on tiles like fullscreen, invite button, etc. */}
      </Box>
    </StyledEngineProvider>
  );
}
