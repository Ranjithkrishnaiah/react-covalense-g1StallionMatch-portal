import {
  StyledEngineProvider, Container, Box,
  Typography, MenuItem, Table,
  TableHead, TableRow, TableCell, TableBody, Divider, Popover, Avatar, Stack, TableContainer, Paper
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useLocation, useParams } from 'react-router-dom';
import { api } from 'src/api/apiPaths';
import ListHeader from 'src/components/ListHeader';
import { scrollToTop } from '../../utils/customFunctions';
import { usersListHeaderProps, usersListTableProps } from 'src/constants/ListConstants';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import { useGetInviteUsersListQuery } from 'src/redux/splitEndpoints/getInviteUsersListSplit';
import { transformResponse } from 'src/utils/FunctionHeap';
import { Meta } from '../../@types/lists';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import UserAccess from 'src/forms/UserAccess';
import UserFullOrViewOnlyAccess from 'src/forms/UserFullOrViewOnlyAccess';
import { CustomSelect } from 'src/components/CustomSelect';
import { dataGridTableStyles } from '../../utils/customFunctions';
import { Row } from '../../@types/table';
import { useNav } from '../../hooks/useNav';
import Confirm from 'src/components/Confirm';
import { Images } from 'src/assets/images';
import './list.css'
import { useGetFarmAccessLevelsQuery } from 'src/redux/splitEndpoints/getFarmAccessLevelsSplit';
import { useResendInviteMutation } from 'src/redux/splitEndpoints/postResendInvitation';
import { useAccessLevelMutation } from 'src/redux/splitEndpoints/postChangeInAccessLevel';
import { toast } from 'react-toastify';
import useMetaTags from 'react-metatags-hook';
import { toPascalCase } from 'src/utils/customFunctions';
import { Spinner } from 'src/components/Spinner';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import useAuth from 'src/hooks/useAuth';

function FarmUsersList() {
  const { farmName, farmId } = useParams();
  const { pathname } = useLocation();
  // initial state
  const InitialState = {
    order: 'ASC',
    page: 1,
    limit: pathname.includes('users-list') ? 10 : 5,
    sortBy: 'Active',
  };
  let Url: any = null;
  const pathSplitForFarm = pathname.split('/');
  const { authentication } = useAuth();
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];
  Url = api.inviteUserUrl + '/' + farmId;
  let userListInitialparams = { body: { ...InitialState }, Url }
  const [sortBy, setSortBy] = useState<any>('Active');
  const [page, setPage] = useState<number>(1);
  const [transformedUserList, setTransformedUserList] = useState<any>([]);
  const [userListParams, setUserListParams] = useState<any>(userListInitialparams);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const headerProps = { ...usersListHeaderProps, setSortBy };
  const tableProps = { ...usersListTableProps }
  // API call to get users farm list
  const { data: userFarmListData } = useGetUsersFarmListQuery(null, { skip: !authentication });
  const userListData =
    useGetInviteUsersListQuery(userListParams);

  const farmNameFromData: any = userFarmListData?.filter((data: any) => data?.farmId === farmID);
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');

  // MetaTags
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const farmUsersListUrl = `${BaseAPI}${window.location.pathname}`;
  const farmUsersListImage = process.env.REACT_APP_FARMUSERS_LIST_IMAGE;
  useMetaTags({
    title: `Users List | Stallion Match`,
    description: "Stallion Match Farm Dashboard. Your user list - the data backed Stallion Match for the best pedigree.",
    openGraph: {
      title: `Users List | Stallion Match`,
      description: "Stallion Match Farm Dashboard. Your user list - the data backed Stallion Match for the best pedigree.",
      site_name: 'Stallion Match',
      url: farmUsersListUrl,
      type: 'business.business',
      image: farmUsersListImage,
    },
  }, [])

  // scroll to top
  useEffect(() => {
    scrollToTop();
  }, [page, sortBy]);

  // set userList Data from API response
  useEffect(() => {
    if (typeof (userListData?.data?.data.length) !== 'undefined') {
      if (userListData?.data?.data.length > 0) {
        let arr = transformResponse(userListData?.data?.data, 'USER LIST')
          setTransformedUserList({
            ...usersListTableProps,
            data: [...arr],
          });
        setMeta(userListData?.data?.meta);
      }
      else {
        setTransformedUserList([]);
      }
    }
  }, [userListData?.data, userListParams]);
  useEffect(() => {
    if (userListParams?.body?.page !== page || sortBy !== userListParams?.body?.sortBy) {
      setUserListParams({
        body: { ...userListInitialparams.body, sortBy, page }, Url
      });
    }
  }, [page, sortBy])
  let pageData: any = null;
  if (userListData) {
    pageData = {
      page,
      setPage,
      query: userListData,
      pagination: {
        itemCount: meta?.itemCount || 0,
        limit: meta?.limit || 10,
      },
      limit: 10,
    };
  }

  return (
    <StyledEngineProvider injectFirst>
      <Container>
        {/* list header section */}
        <ListHeader farmName={farmName} farmId={farmId} {...headerProps} />
        {/* user lists data section */}
        <Box mb={3} className="ListBodyWrapper">
          {userListData?.isFetching === false && transformedUserList && !Array.isArray(transformedUserList) &&
            <UserCustomTable {...transformedUserList} farmId={farmId} farmName={farmName} userListData={userListData} />}
          {userListData?.isFetching === true && <Spinner />}
          {userListData?.isFetching === false && transformedUserList.length === 0 &&
            <Stack className="StakesProgenyTable" mt={2}>
              <Box className='smp-no-data'>
                <Typography variant='h6'>No Records Found</Typography>
              </Box>
            </Stack>
          }
        </Box>
        {/* pagination section */}
        <Box mb={12} className="ListBodyPagination">
          <PaginationSettings data={pageData} />
        </Box>
      </Container>
    </StyledEngineProvider>
  );
}

export default FarmUsersList

function DisplayDropdown(props: any) {
  const { id, name, setOpenUserAccess, value, accessLevels, setInvitationId, changeAccessLevel, setUserName, farmId, setOpenUserFullAccessOrViewOnly, setUpdatedAccessId }
    = props;
  // handler for user Access
  const handleUserAccess = (e: any) => {
    if (e.target.value === 3) {
      setInvitationId(id)
      setOpenUserAccess(true);
      setUserName(name);
      setUpdatedAccessId(e.target.value);
    }
    else {
      setInvitationId(id)
      setOpenUserFullAccessOrViewOnly(true);
      setUserName(name);
      setUpdatedAccessId(e.target.value);
    }
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginLeft: '0px',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },

  }
  return (
    <StyledEngineProvider injectFirst>
      <CustomSelect
        disablePortal
        IconComponent={KeyboardArrowDownRoundedIcon}
        sx={{ height: '40px' }}
        className='selectDropDownBox sort-recent'
        value={value}
        onChange={handleUserAccess}
        MenuProps={MenuProps}
      >
        {accessLevels?.map((accessLevel: any) => (
          <MenuItem className='selectDropDownList'
            value={accessLevel.id} key={accessLevel.id}>{accessLevel.accessName}</MenuItem>
        ))}
      </CustomSelect>
    </StyledEngineProvider>
  )
}

export function UserCustomTable(props: any) {
  const { pathname } = useLocation();
  const { tableIdentifier, displayColumns, hasAvatar, columns, name, email, farmId, farmName } = props;
  const notInUsersListPage: boolean = !!pathname.includes('users');
  const [anchorEl, setAnchorEl] = React.useState<null | (EventTarget & Element)>(null);
  const [openPopover, setOpenPopover] = React.useState(false);
  const [invitationId, setInvitationId] = React.useState<any>();
  const [itemName, setItemName] = React.useState('');
  const [userEmail, setUserEmail] = React.useState("");
  const [userImageSrc, setUserImageSrc] = useState("");
  const [openUserAccess, setOpenUserAccess] = useState(false);
  const [openUserFullAccessOrViewOnly, setOpenUserFullAccessOrViewOnly] = useState(false);
  const [updatedAccessId, setUpdatedAccessId] = useState(0);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
  const { data: farmAccessLevels } = useGetFarmAccessLevelsQuery();
  const [resendInvite, resendResponse] = useResendInviteMutation();
  const [changeAccessLevel, accessLevelChangeResponse] = useAccessLevelMutation();
  const farmUser = JSON.parse(localStorage.getItem('user') || '{}');
  const Remove = () => {
    setOpenDeleteConfirmation(true);
    setOpenPopover(false);
    setAnchorEl(null);
  };
  const columnCount = columns?.length;
  const id = openPopover ? 'popover' : undefined;
  // toggleOptions
  const toggleOptions = (evt: any) => {
    setUserEmail(evt.currentTarget['aria-describedby']);
    setUserImageSrc(evt.currentTarget.accessKey.split('-')[1])
    setInvitationId(evt.currentTarget.id);
    setItemName(evt.currentTarget.accessKey.split('-')[0]);
    setAnchorEl(evt.currentTarget);
    setOpenPopover(true);
  };
  const {
    goToSearch,
    goToStallionPage,
    goToFarmPage,
    editMareList,
    downloadMareList,
    sendMessageToBreeder,
    goToStallionReport,
    edit,
  } = useNav();

  // on success toast message
  const notifySuccess = (message: string) => {
    toast.success(message, {
      autoClose: 2000
    })
  }
  // on error toast message
  const notifyError = (message: string) => {
    toast.error(message, {
      autoClose: 2000
    })
  }

  // send invitation handler
  const sendInvitation = () => {
    setAnchorEl(null);
    setOpenPopover(false);
    resendInvite({ invitationId: parseInt(invitationId), farmId: farmId }).then((res: any) => {
      if (res?.error?.originalStatus === 200)
        notifySuccess(res?.error?.data);
      else if (res?.error?.status === 422)
        notifyError(res?.error?.data?.message);

    })
      .catch(() => {
        notifyError('Invitation Failed');
        setAnchorEl(null);
        setOpenPopover(false);
      })
    setAnchorEl(null);
  }

  useEffect(() => {
    if (props?.handleDropDownState) props?.handleDropDownState({ openUserAccess, openUserFullAccessOrViewOnly })
  }, [openUserAccess, openUserFullAccessOrViewOnly])

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
    goToStallionReport,
    sendInvitation,
    edit,
  ];
  // ===============Always add function items to the END of the optionFunctions Array=======
  // ===================================!!!IMPORTANT!!!=====================================
  const createCustomMessage = (userName: string,) => {
    return `Please confirm if you would like to remove ${toPascalCase(userName)} from ${toPascalCase(farmName)}. They will no longer have access to view any farm/stallion information.`
  }

  const handleResendButtonHideShow = () => {
    let arr = [];
    arr = props?.data;
    let flag = false;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (parseInt(invitationId) === element?.id) {
        if (element?.status === 'Pending') {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box>
          <WrapperDialog
            open={openUserAccess}
            title="User Access"
            onClose={() => setOpenUserAccess(false)}
            body={UserAccess}
            invitationId={{ farmId: farmId, accessLevel: updatedAccessId, invitationId: invitationId }}
            userImage={userImageSrc}
            userName={itemName}
            email={userEmail}
          />
          <WrapperDialog
            title="User Access"
            open={openUserFullAccessOrViewOnly}
            onClose={() => setOpenUserFullAccessOrViewOnly(false)}
            body={UserFullOrViewOnlyAccess}
            invitationId={{ farmId: farmId, accessLevel: updatedAccessId, invitationId: invitationId }}
            userImage={userImageSrc}
            userName={itemName}
            email={userEmail}
          />
          {name && openDeleteConfirmation && (
            <WrapperDialog
              dialogClassName='dialogPopup title-capitalize'
              open={openDeleteConfirmation}
              title="Are you sure?"
              onClose={() => setOpenDeleteConfirmation(false)}
              body={Confirm}
              tableId={name}
              itemName={itemName}
              itemId={invitationId}
              farmId={farmId}
              customMessage={createCustomMessage(itemName)}
            />
          )}
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
                ? props?.options.map((option: string, index: number) => (
                  <Box key={option + index} className={`dropdown-menu ${option !== 'Resend' || handleResendButtonHideShow() === true ? '' : 'hide'}`}>
                    {props?.optionFunctionIndex ? (
                      <Box>
                        <Box
                          sx={{ paddingX: 2, paddingY: '12px' }}
                          id={invitationId}
                          accessKey={props.name}
                          className={`pointerOnHover`}
                          onClick={optionFunctions[props?.optionFunctionIndex[index]]}
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
          {/* table data */}
          <TableContainer component={Paper} className='DataList list-clumns'>
            <Table className='DataListTable'>
              <TableHead>
                <TableRow>
                  {columns.map((column: string, index: number) => (
                    <TableCell key={column + index}
                      className={
                        dataGridTableStyles(tableIdentifier, undefined, columnCount)
                          ?.columnRowClassName
                      }>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props?.userListData?.isFetching === false && props?.data?.map((row: Row, rowIndex: number) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell className='UserlistName'>
                        <Stack direction='row' sx={{ alignItems: 'center' }}>
                          {hasAvatar &&
                            <Avatar alt={row?.name} src={row.src ? `${row.src}?h=24&w=24` : Images.User} style={{ marginRight: '8px' }} />
                          }<em>{toPascalCase(row.name ? row.name : "")}</em>
                        </Stack>
                      </TableCell>
                      {notInUsersListPage && <TableCell>{row.email}</TableCell>}
                      <TableCell className='ActiveClassUser'>{row.status}</TableCell>
                      <TableCell className={`AcceslevelClassUser ${(row?.id === null || farmUser?.email === row?.email) ? 'disabled-row' : ''}`} id={row.id}>
                        {DisplayDropdown({
                          id: row.id, name: row.name, value: row.accessLevel,
                          setOpenUserAccess, accessLevels: farmAccessLevels,
                          setInvitationId, changeAccessLevel, setUserName: setItemName,
                          farmId: farmId, setOpenUserFullAccessOrViewOnly, setUpdatedAccessId
                        })}
                      </TableCell>
                      <TableCell align='right' className={`${(row?.id === null || farmUser?.email === row?.email) ? 'disabled-row' : ''}`}>
                        <i
                          aria-describedby={row.email}
                          className={'icon-Dots-horizontal'}
                          onClick={toggleOptions}
                          accessKey={row.name + '-' + row.src}
                          id={row.id}
                        /></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </StyledEngineProvider>
    </>
  )
}