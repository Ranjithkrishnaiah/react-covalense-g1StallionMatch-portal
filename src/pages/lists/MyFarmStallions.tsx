import {
  StyledEngineProvider, Container, Box, Table,
  TableHead, TableRow, TableCell, TableBody, Divider, Popover, Avatar, Stack, TableContainer, Paper
} from '@mui/material';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { api } from 'src/api/apiPaths';
import ListHeader from 'src/components/ListHeader';
import { myStallionsListHeaderProps, myStallionsTableProps } from 'src/constants/ListConstants';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import { useStallionRosterQuery } from 'src/redux/splitEndpoints/stallionRoasterSplit';
import CustomizedSwitches from '../../components/Switch'
import { transformResponse } from 'src/utils/FunctionHeap';
import { Meta } from '../../@types/lists';
import { scrollToTop } from '../../utils/customFunctions';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { dataGridTableStyles } from '../../utils/customFunctions';
import { Row } from '../../@types/table';
import { useNav } from '../../hooks/useNav';
import Confirm from 'src/components/Confirm';
import { Images } from 'src/assets/images';
import { InsertCommas } from 'src/utils/FunctionHeap';
import './list.css'

import ConfirmRemoveStallion from 'src/forms/ConfirmRemoveStallion';
import AutoRenewelForm from 'src/forms/AutoRenewel';
import NoDataRoaster from 'src/components/NoDataComponent/NoDataRoaster';
import { Spinner } from 'src/components/Spinner';

function MyFarmStallions() {
  const { farmId, farmName } = useParams();
  const [page, setPage] = useState<any>(1);
  const [sortBy, setSortBy] = useState<any>('Alphabetical');
  const [transformedMyStallionsList, setTransformedMyStallionsList] = useState<any>([]);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  // InitialState
  const InitialState = {
    order: 'ASC',
    page: page,
    limit: 10,
    sortBy: sortBy,
  };
  let Url: any = null;
  const farmID = farmId;
  Url = api.farmsUrl + '/' + farmID + api.stallions;
  let ListInitialparams = { body: { ...InitialState }, Url }

  const [state, setState] = useState<any>(InitialState);
  const [listParams, setListParams] = useState<any>(ListInitialparams);
  const [selectedStallionIds, setSelectedStallionIds] = useState<any>([]);
  const headerProps = { ...myStallionsListHeaderProps, setSortBy };
  const { data: myStallionsData, isFetching } = useStallionRosterQuery(ListInitialparams);
  // scroll to top
  useEffect(() => {
    scrollToTop();
  }, [page, sortBy]);

  const handleSelectedStallionID = (value: any) => {
    setSelectedStallionIds(value);
  };

  // set myStallions Data from API response
  useEffect(() => {
    if (myStallionsData?.data?.length) {
      if (myStallionsData?.data?.length > 0) {
        setTransformedMyStallionsList({
          ...myStallionsTableProps,
          data: transformResponse(myStallionsData?.data, 'MY STALLIONS LIST'),
        });
        setMeta(myStallionsData.meta);
      }

    }
  }, [myStallionsData?.data, listParams]);
  useEffect(() => {
    if (listParams?.body?.page !== page || sortBy !== listParams?.body?.sortBy) {
      setListParams({
        body: { ...ListInitialparams.body, sortBy, page }, Url
      });
    }
  }, [page, sortBy])

  //set state based on sort
  if (sortBy !== state.sortBy || state.page !== page) {
    setState({ ...InitialState, sortBy, page });
  }
  let pageData: any = null;
  if (myStallionsData) {
    pageData = {
      page,
      setPage,
      query: myStallionsData,
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
        {/* ListHeader */}
        <ListHeader {...headerProps} farmName={farmName} farmId={farmID} />
        {/* MyStallions lists data section */}
        <Box mb={3} className="ListBodyWrapper">
          {isFetching === false && transformedMyStallionsList && !Array.isArray(transformedMyStallionsList) &&
            <UserCustomTable {...transformedMyStallionsList} />}
          {isFetching === true && <Spinner />}
          {isFetching === false && myStallionsData?.data?.length === 0 && <NoDataRoaster
            selectedStallionIds={selectedStallionIds}
            handleSelectedStallionID={handleSelectedStallionID}
          />}
        </Box>
        {/* pagination section */}
        <Box mb={12} className="ListBodyPagination">
          <PaginationSettings data={pageData} />
        </Box>
      </Container>
    </StyledEngineProvider>
  );
}
function DisplaySwitch(props: any) {
  const { id, value, checked, stallionPromotionId, autoRenewel, setAutoRenewel } = props;
  const handleClick = (e: any) => {
    props?.handleAutoRenewelPopup(autoRenewel, stallionPromotionId, id)
  }

  return (
    <StyledEngineProvider injectFirst>
      <CustomizedSwitches id={id} defaultChecked={false} onClick={handleClick} setAutoRenewel={setAutoRenewel}
        checked={props?.isAutoRenew ? props?.isAutoRenew : false} disabled={value?.disabled}
      />
    </StyledEngineProvider>
  )
}

export const UserCustomTable: any = (props: any) => {
  const { tableIdentifier, displayColumns, hasAvatar, columns, name } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | (EventTarget & Element)>(null);
  const [openPopover, setOpenPopover] = React.useState(false);
  const [checked, setChecked] = useState<boolean | undefined>();
  const [itemId, setItemId] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
  const [openDeleteMyStallionConfirmation, setOpenDeleteMyStallionConfirmation] = React.useState(false);
  const [autoRenewel, setAutoRenewel] = React.useState(props?.isAutoRenew ? props?.isAutoRenew : false);
  const Remove = () => {
    setOpenDeleteConfirmation(true);
    setOpenPopover(false);
    setAnchorEl(null);
  };
  const [AutoRenewelPopup, setAutoRenewelPopup] = React.useState(false);
  const [promotionalId, setPromotionalId] = React.useState('');
  const [removeStallionTitle, setRemoveStallionTitle] = useState('Are you sure?');
  const handleAutoRenewelPopup = (data: any, id: any, s_id: any) => {
    setItemId(s_id)
    setPromotionalId(id);
  }

  useEffect(() => {
    if (promotionalId) {
      setAutoRenewelPopup(true);
    }
  }, [promotionalId])

  const columnCount = columns?.length;
  const id = openPopover ? 'popover' : undefined;
  const toggleOptions = (evt: any) => {
    setItemId(evt.currentTarget.id);
    setItemName(evt.currentTarget.accessKey);
    setAnchorEl(evt.currentTarget);
    setOpenPopover(true);
  };

  // delete stallion
  const DeleteMyStallion = () => {
    setAnchorEl(null);
    setOpenPopover(false);
    setOpenDeleteMyStallionConfirmation(true)
  }

  const {
    goToSearch,
    goToStallionPage,
    goToFarmPage,
    editMareList,
    downloadMareList,
    sendMessageToBreeder,
    goToStallionReport,
    sendInvitation,
    edit,
    openEditStallionProfile,
  } = useNav();
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
    openEditStallionProfile,
    DeleteMyStallion
  ];
  // ===============Always add function items to the END of the optionFunctions Array=======
  // ===================================!!!IMPORTANT!!!=====================================

  const isOptionDisabled = (option: any) => {
    console.log(props,'props')
    if(props?.name === "My Stallions") {
      if (option === 'View Profile') {
        let data: any = props?.data;
        let obj: any = {};
  
        data?.forEach((v: any) => {
          if (itemId === v?.id) {
            obj = v;
          }
        })
  
        return obj?.autoRenew?.disabled ? 'disabled-opt' : '';
      }
    }
    return '';
  }


  return (
    <Box>
      {name && openDeleteConfirmation && (
        <WrapperDialog
          dialogClassName='dialogPopup title-capitalize'
          open={openDeleteConfirmation}
          title="Are you sure?"
          onClose={() => setOpenDeleteConfirmation(false)}
          body={Confirm}
          tableId={name}
          itemName={itemName}
          itemId={itemId}
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
              <Box key={option + index} className="dropdown-menu">
                {props?.optionFunctionIndex ? (
                  <Box className={`${isOptionDisabled(option)}`}>
                    <Box
                      sx={{ paddingX: 2, paddingY: '12px' }}
                      id={itemId}
                      accessKey={itemName}
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
                  }>{column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props?.data?.map((row: Row, rowIndex: number) => {
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <Stack direction='row' sx={{ alignItems: 'center' }}>
                    {hasAvatar &&
                        <Avatar alt={row?.name} src={row.src ? `${row.src}` : Images.HorseProfile} style={{ marginRight: '10px', width: '50px', height: '50px' }} />
                      }{row.name}
                    </Stack>
                  </TableCell>
                  <TableCell>{row.currencyCode?.substring(0, 2)} {InsertCommas(row.studFee)} ({row.feeYear})</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.expiry}</TableCell>
                  <TableCell id={row.id}>
                    {DisplaySwitch({
                      id: row.id, value: row.autoRenew,
                      checked, setChecked, isAutoRenew: row.isAutoRenew,
                      stallionPromotionId: row.stallionPromotionId,
                      autoRenewel, setAutoRenewel,
                      AutoRenewelPopup, setAutoRenewelPopup,
                      handleAutoRenewelPopup
                    })}
                  </TableCell>
                  <TableCell align='right'>
                    <i
                      aria-describedby={id}
                      className={'icon-Dots-horizontal'}
                      onClick={toggleOptions}
                      accessKey={row.name}
                      id={row.id}
                    /></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <WrapperDialog
        open={AutoRenewelPopup}
        title={removeStallionTitle}
        onClose={() => { setAutoRenewelPopup(false); setPromotionalId('') }}
        promotionalId={promotionalId || ''}
        stallionId={itemId || ''}
        body={AutoRenewelForm}
      />
      {<WrapperDialog
        open={openDeleteMyStallionConfirmation}
        title={removeStallionTitle}
        onClose={() => setOpenDeleteMyStallionConfirmation(false)}
        StallionName={itemName}
        ExpiryDate={''}
        ChangeTitleRemove={(value: any) => setRemoveStallionTitle(value)}
        stallionId={itemId}
        body={ConfirmRemoveStallion}
      />}
    </Box>
  )
}

export default MyFarmStallions