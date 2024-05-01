import React, { useEffect, useRef } from 'react';
import {
  Avatar,
  Container,
  Grid,
  StyledEngineProvider,
  Popover,
  Box,
  Divider,
  Typography,
  Icon,
  TextField,
  Button,
} from '@mui/material';
import { Images } from 'src/assets/images';
import './DataList.css';
import '../../pages/stallionPage/StallionPage.css';
import { TableProps, Row } from '../../@types/gridWrapper';
import { dataGridTableStyles, scrollToTop } from '../../utils/customFunctions';
import { useNav } from '../../hooks/useNav';
import Confirm from '../Confirm';
import { WrapperDialog } from '../WrappedDialog/WrapperDialog';
import Registration from 'src/forms/Registration';
import Login from 'src/forms/Login';
import ForgotPassword from 'src/forms/ForgotPassword';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { toPascalCase } from 'src/utils/customFunctions';
import { capitalizeCountry } from 'src/utils/FunctionHeap';
import ConfirmRemoveStallion from 'src/forms/ConfirmRemoveStallion';
import { useDownLoadMareListQuery } from 'src/redux/splitEndpoints/downloadMareList';
import { usePatchNewMarelistNameMutation } from 'src/redux/splitEndpoints/patchNewMarelistName';
import useAuth from 'src/hooks/useAuth';
import { useVerifyUserInviteMutation } from 'src/redux/splitEndpoints/VerifyUserInviteSplit';
import { useAddToStallionsMutation } from 'src/redux/splitEndpoints/addToFavStallionSplit';
import { useAddToDamsiresMutation } from 'src/redux/splitEndpoints/addToDamSiresSplit';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

export default function DataTable(props: TableProps) {
  const {
    tableIdentifier,
    displayColumns,
    hasAvatar,
    columns,
    name,
    id: rowId,
    farmId: farmIdentifier,
  } = props;

  const { authentication } = useAuth();
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | (EventTarget & Element)>(null);
  const [openPopover, setOpenPopover] = React.useState(false);
  const [itemId, setItemId] = React.useState<any>('');
  const [mareListId, setMareListId] = React.useState<any>();
  const [itemName, setItemName] = React.useState('');
  const [tableRow, setTableRow] = React.useState<any>('');
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
  const [removeStallionTitle, setRemoveStallionTitle] = React.useState('Are You Sure?');
  const [openDeleteMyStallionConfirmation, setOpenDeleteMyStallionConfirmation] =
    React.useState(false);
  const id = openPopover ? 'popover' : undefined;
  const columnCount = props?.columns?.length;
  const [downloadOpened, setDownloadOpened] = React.useState(false);
  // API call for mare lists
  const { data: mareListData, isSuccess: isMareListDownloadSuccess } = useDownLoadMareListQuery(
    [mareListId, farmIdentifier],
    { skip: !mareListId || !farmIdentifier }
  );
  const [isStallionPromoted, setIsStallionPromoted] = React.useState(0);
  const [renameMarelist, renameMarelistResponse] = usePatchNewMarelistNameMutation();
  const [selectedListId, setSelectedListId] = React.useState('');
  const [newListName, setNewListName] = React.useState('');
  const [filteredOptions, setFilteredOptions] = React.useState(props.options ? props.options : []);
  const [filteredOptionFunctionIndex, setFilteredOptionFunctionIndex] = React.useState(
    props.optionFunctionIndex ? props.optionFunctionIndex : []
  );
  const editNameRef = useRef<any>();
  const SmallImageArray = [
    'Favourite Stallions',
    'Favourite Damsires',
    'Favourite Farms',
    'Breeder Activity',
    'My Stallions',
    'Most Searched Stallions',
    'Most Matched Damsire',
    'Top 10 20/20 Matched Sires',
    'Top 10 20/20 Matched Broodmare Sires',
  ];
  const tablesWithAuthGuard = [
    'Most Searched Stallions',
    'Most Matched Damsire',
    'Top 10 20/20 Matched Sires',
    'Top 10 20/20 Matched Broodmare Sires',
  ];

  //====================================Signup Requirements=======================================
  const { pathname } = useLocation();
  const { hash } = useParams();
  const [verifyUserInvite, verifyUserInviteResponse] = useVerifyUserInviteMutation();
  const isNewMember: boolean =
    pathname.includes('/invite-user') &&
    !!hash &&
    !!verifyUserInviteResponse.data?.isMember === true;
  const [openRegisteration, setOpenRegistration] = React.useState(false);
  const [registrationTitle, setRegistrationTitle] = React.useState(
    pathname.includes('/invite-user') && !isNewMember ? 'Invitation Accepted' : 'Create Account'
  );
  const [openLogin, setOpenLogin] = React.useState(false);
  const [isFirstLogin, setIsFirstLogin] = React.useState(false);
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const [isFarmAdminFirstLogin, setIsFarmAdminFirstLogin] = React.useState(false);
  const [addToFavoriteStallions, stallionResponse] = useAddToStallionsMutation<any>();
  const [addToFavoriteDamsires, damsireResponse] = useAddToDamsiresMutation<any>();
  //====================================Signup Requirements=======================================

  const NameCondition = () => {
    if (name) {
      if (name === 'Favourite Stallions' || tablesWithAuthGuard.includes(name)) return true;
    }
    return false;
  };
  const authGuard = () => {
    //This is basically for trends tables
    if (name && props?.options && props.optionFunctionIndex) {
      if (
        !authentication &&
        tablesWithAuthGuard.includes(name) &&
        props?.options?.length > 0 &&
        props.optionFunctionIndex?.length > 0
      ) {
        let optArr: any = props.options;
        let fnArr: any = props.optionFunctionIndex;
        setFilteredOptions(optArr.filter((option: any) => option !== optArr[optArr.length - 1]));
        setFilteredOptionFunctionIndex(
          fnArr.filter((option: any) => option !== fnArr[fnArr.length - 1])
        );
      }
    }
  };

  // Success notification
  const notifyStallionSuccess = () =>
    toast.success('Stallion added to your favourites list Successfully', {
      autoClose: 2000,
    });
  const notifyDamsireSuccess = () =>
    toast.success('Stallion added to your favourites list Successfully', {
      autoClose: 2000,
    });

  // Error notification
  const notifyStallionError = () =>
    toast.error(stallionResponse?.error?.data?.response, {
      autoClose: 2000,
    });
  const notifyDamsireError = () =>
    toast.error(damsireResponse?.error?.data?.response, {
      autoClose: 2000,
    });

  // Success message for stallion api response
  useEffect(() => {
    if (stallionResponse.isSuccess) {
      notifyStallionSuccess()
    }
    else if (stallionResponse.isError) {
      notifyStallionError()
    }
  }, [stallionResponse])

  // Success message for damsire api response
  useEffect(() => {
    if (damsireResponse.isSuccess) {
      notifyDamsireSuccess()
    }
    else if (damsireResponse.isError) {
      notifyDamsireError()
    }
  }, [damsireResponse])

  let trendsLocation: any = window.localStorage.getItem('trendsLocation');

  // Table popover options functionality
  const tablePopoverOptionInterceptor: any = (e: any, option: string, fn: (e: any) => void) => {
    // console.log(e, option, fn, name, 'FNN')
    switch (option) {
      case 'Search':
        if (!authentication) {
          setOpenRegistration(true);
          setAnchorEl(null);
          setOpenPopover(false);
        } else fn(e);
        break;
      case "View Profile":
        if (!authentication) {
          // setOpenRegistration(true);
          // setAnchorEl(null);
          // setOpenPopover(false);
          if (name === 'Most Searched Stallions' ||
            name === 'Top 10 20/20 Matched Sires' ||
            name === 'Top 10 Perfect Match Matched Sires' ||
            name === 'Top Performing Stallion' ||
            name === 'Most Popular Stallion'
          ) {
            let arr: any = props?.data;
            for (let index = 0; index < arr.length; index++) {
              const element = arr[index];
              if (itemId === element?.id) {
                if (element?.stallionCount > 1) {
                  navigate(`/stallion-directory/?search=${element?.name}&location=${trendsLocation ? trendsLocation : 11}`);
                }
                if (element?.stallionCount === 1) {
                  navigate(`/stallions/${element?.name}/${element?.id}/view`);
                }
              }
            }
          } else {
            fn(e);
          }
        }
        break;
      default:
        fn(e);
    }
  };

  // Table popover options functionality
  const interceptor: any = (e: any, option: string, fn: (e: any) => void) => {
    // console.log(e, option, fn, name, 'FNN')
    switch (option) {
      case "Add To My List":
        setAnchorEl(null);
        setOpenPopover(false);
        if (name === 'Most Matched Damsire' ||
          name === 'Top 10 Perfect Match Matched Broodmare Sires' ||
          name === 'Top 10 20/20 Matched Broodmare Sires'
        ) {
          addToFavoriteDamsires({ horseId: itemId })
        } else {
          addToFavoriteStallions({ stallionId: itemId })
        }
        break;
      case 'Search':
        if (!authentication) {
          setOpenRegistration(true);
          setAnchorEl(null);
          setOpenPopover(false);
        } else {
          let arr: any = props?.data;
          for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (itemId === element?.id) {
              if (element?.stallionCount > 1) {
                navigate(`/stallion-directory/?search=${element?.name}&location=${trendsLocation ? trendsLocation : 11}`);
              } else {
                fn(e)
              }
              // if (element?.stallionCount === 1) {
              //   navigate(`/stallions/${element?.name}/${element?.id}/view`);
              // }
            }
          }
        };
        break;
      case "View Profile":
        if (name === 'Most Searched Stallions' ||
          name === 'Top 10 20/20 Matched Sires' ||
          name === 'Top 10 Perfect Match Matched Sires' ||
          name === 'Top Performing Stallion' ||
          name === 'Most Popular Stallion'
        ) {
          let arr: any = props?.data;
          for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (itemId === element?.id) {
              // console.log(element, 'ELEMENT');
              if (element?.stallionCount > 1) {
                navigate(`/stallion-directory/?search=${element?.name}&location=${trendsLocation ? trendsLocation : 11}`);
              }
              if (element?.stallionCount === 1) {
                navigate(`/stallions/${element?.name}/${element?.id}/view`);
              }
            }
          }
        } else {
          fn(e)
        }
        break;
      default: fn(e)
    }
  }

  // Call authguard function based on authentication state
  useEffect(() => {
    authGuard();
  }, [authentication]);

  // Download mare list 
  useEffect(() => {
    if (mareListData?.downloadLinks) {
      setDownloadOpened(false);
    }
  }, [mareListData?.downloadLinks]);

  // Download marelist 
  useEffect(() => {
    if (isMareListDownloadSuccess && !downloadOpened) {
      window.open(mareListData?.downloadLinks);
      setDownloadOpened(true);
    }
  }, [isMareListDownloadSuccess, mareListData?.downloadLinks, downloadOpened]);

  // Show option based on table type
  const toggleOptions = (evt: any, row: any) => {
    if (name) {
      if (name === 'Favourite Stallions' || tablesWithAuthGuard.includes(name)) {
        setItemId(evt.currentTarget.id.split('|')[0]);
        setIsStallionPromoted(parseInt(evt.currentTarget.id.split('|')[1]));
        if (parseInt(evt.currentTarget.id.split('|')[1]) === 0) {
          setFilteredOptions(
            filteredOptions.filter(
              (option) => option !== 'Stallion Profile' && option !== 'View Profile'
            )
          );
          setFilteredOptionFunctionIndex(
            filteredOptionFunctionIndex.filter((option) => option !== 1)
          );
        } else {
          props?.options && setFilteredOptions(props?.options);
          props?.optionFunctionIndex && setFilteredOptionFunctionIndex(props.optionFunctionIndex);
          authGuard();
        }
      } else setItemId(evt.currentTarget.id.split('|')[0]);
    } else {
      setItemId(evt.currentTarget.id.split('|')[0]);
    }
    setItemId(name === 'Breeder Activity' ? evt.currentTarget.id + "|" + farmIdentifier : evt.currentTarget.id.split('|')[0]);
    setItemName(evt.currentTarget.accessKey);
    setAnchorEl(evt.currentTarget);
    setTableRow(row);
    filteredOptions.length > 0 && setOpenPopover(true);
  };

  // Close confirmation popover
  const Remove = () => {
    setOpenDeleteConfirmation(true);
    setAnchorEl(null);
    setOpenPopover(false);
  };

  // After delete close popover
  const DeleteMyStallion = () => {
    setAnchorEl(null);
    setOpenPopover(false);
    setOpenDeleteMyStallionConfirmation(true);
  };

  // Rename mare from list
  const handleRenameMarelist = (evt: any) => {
    setNewListName(evt.accessKey);
    renameMarelist([selectedListId, newListName, farmIdentifier]);
    setSelectedListId('');
    setAnchorEl(null);
    setOpenPopover(false);
  };

  // Navigation list
  const {
    goToSearch,
    goToStallionPage,
    goToFarmPage,
    sendMessageToBreeder,
    goToStallionReport,
    openEditStallionProfile,
    goToSearchFromTrends,
  } = useNav();

  // Close the download popover after download
  const downloadMareList = () => {
    setMareListId(itemId);
    setAnchorEl(null);
    setOpenPopover(false);
  };

  // Edit mare list 
  const editMareList = (e: any) => {
    setNewListName(e.target.accessKey);
    setSelectedListId(itemId);
    editNameRef.current.focus();
    setAnchorEl(null);
    setOpenPopover(false);
  };

  const goToStallionReportNewPath = () => {
    // console.log(itemId,itemName,tableRow,'itemName');
    navigate(`/report/stallion/${tableRow?.id}/${tableRow?.farmName}/${tableRow?.farmUuid}`);
  }

  // ===================================!!!IMPORTANT!!!=====================================

  const optionFunctions = [
    // ========Order Matters!! Always add function items to the END of the this Array=======
    goToSearch,
    goToStallionPage,
    goToFarmPage,
    editMareList,
    downloadMareList,
    Remove,
    sendMessageToBreeder,
    goToStallionReportNewPath,
    openEditStallionProfile,
    DeleteMyStallion,
    goToSearchFromTrends,
    addToFavoriteStallions,
    addToFavoriteDamsires,
  ];
  // ===============Always add function items to the END of the optionFunctions Array=======
  // ===================================!!!IMPORTANT!!!=====================================
  const mobileColumnIconsCondition = () => {
    if (
      (name === 'My Stallions' || name === 'Breeder Activity') &&
      tableIdentifier === 'DASHBOARD' &&
      window.innerWidth < 600
    )
      return true;
    return false;
  };

  // handle Resend Button Hide and Show
  const handleResendButtonHideShow = () => {
    let arr: any = [];
    arr = props?.data;
    let flag = false;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (itemId === element?.id) {
        if (element?.isPromoted !== undefined) {
          if (element?.isPromoted) {
            flag = true;
            break;
          }
        } else {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  const handleStallionSearch = (recentSearchId: any) => {
    const parts = recentSearchId.split('~');
    navigate(`/stallion-search?stallionId=${parts[0]}&mareId=${parts[1]}`);
    scrollToTop();
  }

  return (
    <StyledEngineProvider injectFirst>
      {/* WrapperDialog for signup */}
      <WrapperDialog
        open={openRegisteration}
        title={registrationTitle}
        onClose={() => setOpenRegistration(false)}
        openOther={() => setOpenLogin(true)}
        changeTitleTo={setRegistrationTitle}
        body={Registration}
        setIsFirstLogin={setIsFirstLogin}
        setFarmAdminFirstLogin={setIsFarmAdminFirstLogin}
        hash={hash}
        fullName={verifyUserInviteResponse.data?.fullName}
        InvitedEmail={verifyUserInviteResponse.data?.email}
        isLoginOpen={openLogin}
        closeLogin={() => setOpenLogin(false)}
      />
      {/* WrapperDialog for ForgotPassword */}
      <WrapperDialog
        open={forgotPassword}
        title="Forgot Password"
        onClose={() => setForgotPassword(false)}
        body={ForgotPassword}
      />
      {/* WrapperDialog for Login */}
      <WrapperDialog
        open={openLogin}
        dialogClassName="dialogPopup createAccountPopup"
        title={isFirstLogin ? 'Welcome to Stallion Match' : 'Log in'}
        onClose={() => setOpenLogin(false)}
        openOther={() => setOpenRegistration(true)}
        OFP={() => setForgotPassword(true)}
        firstLogin={isFirstLogin}
        body={Login}
        farmAdminFirstLogin={isFarmAdminFirstLogin}
        setRegistrationTitle={() => setRegistrationTitle('Create Account')}
      />
      <Container maxWidth="lg" sx={{ mt: '1rem' }}>
        {/* WrapperDialog for Confirm popup */}
        {name && openDeleteConfirmation && (
          <WrapperDialog
            dialogClassName="dialogPopup title-capitalize"
            open={openDeleteConfirmation}
            title="Are you sure?"
            onClose={() => setOpenDeleteConfirmation(false)}
            body={Confirm}
            tableId={name}
            itemName={itemName}
            itemId={itemId}
            farmId={farmIdentifier}
          />
        )}
        {/* WrapperDialog for Remove Stallion */}
        {name && openDeleteMyStallionConfirmation && (
          <WrapperDialog
            open={openDeleteMyStallionConfirmation}
            title={removeStallionTitle}
            onClose={() => setOpenDeleteMyStallionConfirmation(false)}
            StallionName={itemName}
            ExpiryDate={''}
            ChangeTitleRemove={(value: any) => setRemoveStallionTitle(value)}
            stallionId={itemId}
            body={ConfirmRemoveStallion}
            dialogClassName="dialogPopup title-capitalize"
          />
        )}
        {/* dynamic data table starts */}
        <Grid
          className="data-grid-header"
          container
          xs={12}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {columns?.map((columnName: string, index: number) => (
            <Grid
              item
              lg={dataGridTableStyles(tableIdentifier, index, columnCount)?.lg}
              xs={dataGridTableStyles(tableIdentifier, index, columnCount)?.xs}
              className={
                dataGridTableStyles(tableIdentifier, undefined, columnCount)?.columnRowClassName
              }
              key={columnName}
            >
              {mobileColumnIconsCondition() && columnName === 'Searches' ? (
                <i className="icon-Search" />
              ) : mobileColumnIconsCondition() &&
                (columnName === 'Page views' || columnName === 'Views') ? (
                <i className="icon-eyeclose" />
              ) : (
                <span>{columnName}</span>
              )}
            </Grid>
          ))}
        </Grid>
        {props?.hascolumnDivider ? <Divider sx={{ borderBottom: 'solid 1px #B0B6AF' }} /> : ''}
        {props?.data?.map((row: Row, rowIndex: number) => {
          const filteredArr = Object.keys(row).filter((key: string) => // Search, Time, Rating
            props?.displayColumns.includes(key)
          );

          return (
            <Grid
              container
              xs={12}
              my={1}
              py={1}
              className={
                dataGridTableStyles(props?.tableIdentifier, rowIndex, props?.data?.length || 0)
                  ?.className
              }
              key={new String(row.id).toString() + rowIndex} // .....
              sx={
                dataGridTableStyles(props?.tableIdentifier, rowIndex, props?.data?.length || 0)
                  ?.rowSx
              }
            >
              {filteredArr.map((key: any, index: number) => {
                const Key: keyof Row = key;
                return (
                  <Grid
                    className="datatable-list-item"
                    item
                    key={new String(row.id).toString() + index}
                    lg={dataGridTableStyles(tableIdentifier, index, displayColumns?.length)?.lg}
                    xs={dataGridTableStyles(tableIdentifier, index, displayColumns?.length)?.xs}
                    sx={dataGridTableStyles(tableIdentifier, index, displayColumns?.length)?.sx}
                  >
                    {hasAvatar && index === 0 && name ? (
                      <Avatar
                        alt={row.name}
                        src={
                          row.src
                            ? `${row.src}?h=40&w=40&fit=crop&ar=1:1&mask=ellipse&nr=-100&nrs=100`
                            : (name === 'Breeder Activity') ? Images.User
                              : name !== 'Favourite Farms'
                                ? Images.HorseProfile
                                : Images.farmplaceholder
                        }
                        style={{ marginRight: '10px' }}
                      />
                    ) : (
                      ''
                    )}
                    {dataGridTableStyles(tableIdentifier, index, displayColumns?.length)
                      ?.notLastColumn ? (
                      <Typography component="span" sx={{ textAlign: 'center' }} id={row.id}>
                        {' '}
                        {Key === 'list' && name === 'My MaresLists' && selectedListId == row.id ? (
                          <Box sx={{ display: 'flex' }} className="mare-edit-box">
                            <TextField
                              ref={editNameRef}
                              value={newListName}
                              onChange={(e: any) => {
                                setNewListName(e.target.value);
                              }}
                            />
                            <Button onClick={handleRenameMarelist}>Save</Button>
                          </Box>
                        ) : Key === 'searches' &&
                          (name === 'My Stallions') ? (
                          <Box sx={{ display: 'flex' }}>
                            <Box> {toPascalCase(row[Key])} </Box>
                          </Box>
                        ) : Key === 'searchName' &&
                          (name === 'Recent Searches') ? (
                          <Box sx={{ display: 'flex' }}>
                            <Box style={{ cursor: 'pointer' }} onClick={() => handleStallionSearch(row.id)}>{capitalizeCountry(toPascalCase(row[Key]))}</Box>
                          </Box>
                        ) :
                          (name === 'Recent Searches') ? row[Key] :
                            (
                              capitalizeCountry(toPascalCase(row[Key]))
                            )
                        }
                      </Typography>
                    ) : authentication && key === 'n' && name === 'Breeder Activity' ? (
                      (row.id !== null && row.isFarmUser === 0) ?
                        <i
                          aria-describedby={row.id + "|" + row?.memberEmail}
                          className={'icon-Dots-horizontal'}
                          onClick={(e: any) => toggleOptions(e, row)}
                          accessKey={row.name || row.list || row.horseName}
                          id={row.id + "|" + row?.memberEmail}
                        /> : undefined
                    )
                      : authentication && key === 'n' && name !== 'Ordered Reports' ? (
                        <i
                          aria-describedby={id}
                          className={'icon-Dots-horizontal'}
                          onClick={(e: any) => toggleOptions(e, row)}
                          accessKey={row.name || row.list || row.horseName}
                          id={NameCondition() ? row.id + `|${row.isPromoted}` : row.id}
                        />
                      ) :
                        authentication && key === 'n' && name === 'Ordered Reports' ? (
                          <i className="icon-Download" />
                        ) :
                          undefined}
                  </Grid>
                );
              })}
            </Grid>
          );
        })}
      </Container>

      {openPopover && (
        <Popover
          sx={{ display: { lg: 'flex', xs: 'flex' } }}
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={() => setOpenPopover(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          className="sm-dropdown"
        >
          {props?.optionFunctionIndex && props?.options
            ? filteredOptions.map((option: string, index: number) => (
              <Box key={option + index} className={`dropdown-menu ${option !== 'View Profile' || handleResendButtonHideShow() === true ? '' : 'hide'}`}>
                {props?.optionFunctionIndex ? (
                  <Box>
                    <Box
                      sx={{ paddingX: 2, paddingY: '12px' }}
                      id={itemId}
                      accessKey={option === 'Search' ? name : itemName}
                      className={'pointerOnHover'}
                      onClick={
                        authentication
                          ? (e: any) => interceptor(
                            e,
                            option,
                            optionFunctions[filteredOptionFunctionIndex[index]])
                          : (e: any) =>
                            tablePopoverOptionInterceptor(
                              e,
                              option,
                              optionFunctions[filteredOptionFunctionIndex[index]]
                            )
                      }
                    >
                      {option}
                    </Box>
                    <Box>
                      {props?.options ? (
                        index < props?.options?.length - 1 ? (
                          <Divider />
                        ) : (
                          ''
                        )
                      ) : (
                        ''
                      )}
                    </Box>
                  </Box>
                ) : (
                  ''
                )}
              </Box>
            ))
            : ''}
        </Popover>
      )}
    </StyledEngineProvider>
  );
}
