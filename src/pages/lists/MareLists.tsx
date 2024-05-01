import {
  StyledEngineProvider, Container, Box, Table,
  TableHead, TableRow, TableCell, TableBody, Divider, Popover, TableContainer, Paper, Stack, TextField, Button, Typography
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { api } from 'src/api/apiPaths';
import ListHeader from 'src/components/ListHeader';
import { mareListsHeaderProps, mareListsTableProps } from 'src/constants/ListConstants';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import { useGetMareListSplitQuery } from 'src/redux/splitEndpoints/getMareListSplit';
import { transformResponse } from 'src/utils/FunctionHeap';
import { Meta } from '../../@types/lists';
import { scrollToTop, dataGridTableStyles, toPascalCase } from '../../utils/customFunctions';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { Row } from '../../@types/table';
import { useNav } from '../../hooks/useNav';
import Confirm from 'src/components/Confirm';
import './list.css'
import { usePatchNewMarelistNameMutation } from 'src/redux/splitEndpoints/patchNewMarelistName';
import { useDownLoadMareListQuery } from 'src/redux/splitEndpoints/downloadMareList';
import { Spinner } from 'src/components/Spinner';
import useMetaTags from 'react-metatags-hook';

function MareLists() {
  const { pathname } = useLocation();
  const { farmName, farmId } = useParams();
  // InitialState
  const InitialState = {
    order: 'ASC',
    page: 1,
    limit: 5,
    sortBy: 'Name',
  };
  let Url: any = null;
  const pathSplitForFarm = pathname.split('/');
  const farmID = pathSplitForFarm[pathSplitForFarm?.length - 1];
  Url = api.farmsUrl + '/' + farmID;
  let ListInitialparams = { body: { ...InitialState }, Url }

  const [transformedMareLists, setTransformedMareLists] = useState<any>([]);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [page, setPage] = useState<any>(1);
  const [sortBy, setSortBy] = useState<any>('Name');
  const [state, setState] = useState<any>(InitialState);
  const [listParams, setListParams] = useState<any>(ListInitialparams);
  const headerProps = { ...mareListsHeaderProps, setSortBy };
  const { data: mareListsData,isFetching } = useGetMareListSplitQuery({ ...listParams.body, farmId: farmID });

  // MetaTags
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const mareListUrl = `${BaseAPI}${window.location.pathname}`;
  const mareListImage = process.env.REACT_APP_MARE_LIST_IMAGE;
  useMetaTags({
    title: `My Breeding Mares List | Stallion Match`,
    description: `Stallion Match Mares List. My list of mares, data and info - the data backed Stallion Match for the best pedigree.`,
    openGraph: {
      title: `My Breeding Mares List | Stallion Match`,
      description: `Stallion Match Mares List. My list of mares, data and info - the data backed Stallion Match for the best pedigree.`,
      site_name: 'Stallion Match',
      url: mareListUrl,
      type: 'business.business',
      image: mareListImage,
    },
  }, [])

  // scroll to top
  useEffect(() => {
    scrollToTop();
  }, [page, sortBy]);

  let pageData: any = null;
  if (mareListsData) {
    pageData = {
      page,
      setPage,
      query: mareListsData,
      pagination: {
        itemCount: meta?.itemCount || 0,
        limit: meta?.limit || 2,
      },
      limit: 2,
    };
  }

  // set mare List Data from API response
  useEffect(() => {
    if (mareListsData?.data) {
      if (mareListsData?.data?.length) {
        setTransformedMareLists({
          ...mareListsTableProps,
          data: transformResponse(mareListsData?.data, 'MARES LIST'),
        });
        setMeta(mareListsData.meta);
      }

    }
  }, [mareListsData?.data, listParams]);
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
  return (
    <StyledEngineProvider injectFirst>
      <Container>
        {/* ListHeader */}
        <ListHeader farmName={farmName} farmId={farmId} {...headerProps} />
        {/* mares lists data section */}
        <Box mb={7} className="ListBodyWrapper">
          {isFetching === false && transformedMareLists && !Array.isArray(transformedMareLists) &&
            <UserCustomTable {...transformedMareLists} farmId={farmId} />}
            {isFetching === true && <Spinner />}
            {isFetching === false && mareListsData?.data?.length === 0 && 
            <Stack className="StakesProgenyTable" mt={2}>
            <Box className='smp-no-data'>
              <Typography variant='h6'>Add Mare for even faster searching.</Typography>
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

function UserCustomTable(props: any) {
  const { tableIdentifier, columns, name, farmId } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | (EventTarget & Element)>(null);
  const [openPopover, setOpenPopover] = React.useState(false);
  const [itemId, setItemId] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
  const [selectedListId, setSelectedListId] = React.useState("");
  const [mareListId, setMareListId] = React.useState<any>();
  const [newListName, setNewListName] = React.useState("");
  const [downloadOpened, setDownloadOpened] = React.useState(false);
  // API call for mare List Data
  const {data: mareListData, isSuccess: isMareListDownloadSuccess} = 
  useDownLoadMareListQuery([mareListId, farmId], { skip: (!mareListId || ! farmId) });
  const Remove = () => {
    setOpenDeleteConfirmation(true);
    setOpenPopover(false);
    setAnchorEl(null)
  };
  useEffect(() => {
    if(mareListData?.downloadLinks){
      setDownloadOpened(false)
    }
  },[mareListData?.downloadLinks])

  useEffect(() => {
    if(isMareListDownloadSuccess && !downloadOpened){
      window.open(mareListData?.downloadLinks);
      setDownloadOpened(true)
    }
  },[isMareListDownloadSuccess, mareListData?.downloadLinks, downloadOpened])
  const columnCount = columns?.length;
  const id = openPopover ? 'popover' : undefined;
  const [renameMarelist] = usePatchNewMarelistNameMutation();
  const editNameRef = useRef<any>();

  // edit mare list handler
  const editMareList = (e: any) => {
    setNewListName(itemName);
    setSelectedListId(itemId);
    editNameRef.current.focus();
    setAnchorEl(null);
    setOpenPopover(false);
  }

  // Rename mare list handler
  const handleRenameMarelist = () => {
    renameMarelist([selectedListId, newListName, farmId])
    setSelectedListId("");
  }
  const toggleOptions = (evt: any) => {
      setItemId(evt.currentTarget.id);
      setItemName(evt.currentTarget.accessKey);
      setAnchorEl(evt.currentTarget);
      setOpenPopover(true);
    };
  const downloadMareList = () => {
    setMareListId(itemId);
    setAnchorEl(null);
    setOpenPopover(false);
  }
  const {
    goToSearch,
    goToStallionPage,
    goToFarmPage,
    sendMessageToBreeder,
    goToStallionReport,
    sendInvitation,
    edit,
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
  ];
  // ===============Always add function items to the END of the optionFunctions Array=======
  // ===================================!!!IMPORTANT!!!=====================================
  return(
      <Box>
          {name && openDeleteConfirmation && (
        <WrapperDialog
          open={openDeleteConfirmation}
          title="Are you sure?"
          dialogClassName='dialogPopup title-capitalize'
          onClose={() => setOpenDeleteConfirmation(false)}
          body={Confirm}
          farmId={farmId}
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
                  <Box>
                    <Box
                      sx={{ paddingX: 2, paddingY: '12px' }}
                      id={itemId}
                      accessKey={props.name}
                      className={'pointerOnHover'}
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
      <TableContainer component={Paper} className='DataList list-clumns mareListTable'>
        <Table className='DataListTable'>
          <TableHead>
            <TableRow>
              {columns.map((column: string, index: number) => (
                <TableCell sx={{ display: 'none' }} key={column + index}
                  className={
                    dataGridTableStyles(tableIdentifier, undefined, columnCount)
                      ?.columnRowClassName
                  }>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props?.data?.map((row: Row) => {
              return (
                <TableRow key={row.id}
                >
                  <TableCell className='mareheadlist'>
                    <Stack direction='row' sx={{ alignItems: 'center' }}>
                      {selectedListId == row.id ?
                        <Box sx={{ display: 'flex' }} className='mare-edit-box'>
                          <TextField
                            ref={editNameRef}
                            value={newListName}
                            onChange={(e: any) => { setNewListName(e.target.value) }}
                          />
                          <Button onClick={handleRenameMarelist}>Save</Button>
                        </Box>
                        : toPascalCase(row.list)
                      }
                    </Stack>
                  </TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <i
                      aria-describedby={id}
                      className={'icon-Dots-horizontal'}
                      onClick={toggleOptions}
                      accessKey={row.list}
                      id={row.id}
                    /></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default MareLists