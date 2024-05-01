import React from 'react'
import { Box, Typography, TableContainer, Table, 
  TableHead, TableRow, TableCell, TableBody, Divider, Paper, Popover, Avatar} from '@mui/material';
import { useNav } from 'src/hooks/useNav';
import { dataGridTableStyles, toPascalCase } from '../../utils/customFunctions';
import { Row } from '../../@types/table';
import { Images } from 'src/assets/images';
import Confirm from '../Confirm';
import { WrapperDialog } from '../WrappedDialog/WrapperDialog';
import { capitalizeCountry } from '../../utils/FunctionHeap'

function CustomTable(props:any) {
  const { tableIdentifier, displayColumns, hasAvatar, columns, name, id: rowId } = props;
  const columnCount = props?.columns?.length;
  const [anchorEl, setAnchorEl] = React.useState<null | (EventTarget & Element)>(null);
  const [openPopover, setOpenPopover] = React.useState(false);
  const [itemId, setItemId] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);

  const toggleOptions = (evt: any) => {
    setItemId(evt.currentTarget.id);
    setItemName(evt.currentTarget.accessKey);
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
    sendInvitation,
    edit,
    openEditStallionProfile,
  } = useNav();

  const Remove = () => {
    setOpenDeleteConfirmation(true)
    setAnchorEl(null);
    setOpenPopover(false)
  };

  //For fixing the search issue
  // if (tableIdentifier === 'EMPTY-COLUMN-NAMES-DASHBOARD') {

    //goToSearchTemp = goToSearch(props?.data);
  // }


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
  ];
  // ===============Always add function items to the END of the optionFunctions Array=======
  // ===================================!!!IMPORTANT!!!=====================================
  return (
    <Box mt= {2}>
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
      <TableContainer component={Paper} className='DataList breederlist'>
        <Table className='DataListTable' aria-label="simple table">
        {(!props?.noColumns) &&
        <TableHead>
          <TableRow>
              {props?.columns.map((column:string,index:number) => (
                  <TableCell key={column+index} 
                  >
                    {column}
                  </TableCell>
              ))}
          </TableRow>
        </TableHead>
        }
        {/* {props.hascolumnDivider?<Divider sx={ { border: "solid 1px #B0B6AF" } }/>:""} */}
        <TableBody>
          {props?.data?.map((row: Row, rowIndex: number) => {
            const filteredArr = Object.keys(row).filter((key: string) => props.displayColumns.includes(key));
            return(
              <TableRow 
              className={
                dataGridTableStyles(props?.tableIdentifier, rowIndex, props?.data?.length || 0)?.className
              }
              key={new String(row.id).toString() + rowIndex}
              sx={dataGridTableStyles(props?.tableIdentifier, rowIndex, props?.data?.length || 0)?.rowSx}>
                {filteredArr.map((key:any, columnIndex: number) => {
                  const Key: keyof Row = key;
                    return(
                    <TableCell 
                    className='datatable-list-item breeders'
                    key={new String(row.id).toString() + rowIndex}
                    align="left">
                      <Box className={name!=="Favourite Mares"?"yourmares":'list-left-clumn'}>
                      {hasAvatar && columnIndex === 0 ? (
                      <Avatar alt={row?.name} src={row.src ? `${row.src}` : name !=='Favourite Farms'? Images.HorseProfile: Images.farmplaceholder} style={ { marginRight: '10px' } } />
                    ) : (
                      ''
                    )}
                    
                    { key === 'n' ? (
                      
                      <i
                        // aria-describedby={id}
                        className={'icon-Dots-horizontal'}
                        onClick={toggleOptions}
                        accessKey={row.name}
                        id={row.id}
                       
                      />
                     
                    ) : 
                    <Typography component="span" sx={ { textAlign: 'center' } }>
                    {' '}
                    {capitalizeCountry(toPascalCase(row[Key]))}
                  </Typography>
                  }
                  </Box>
                    </TableCell>
                )})}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </TableContainer>
      {openPopover && (
        <Popover
          sx={ { display: { lg: 'flex', xs: 'flex' } } }
          open={openPopover}
          anchorEl={anchorEl}
          onClose={() => setOpenPopover(false)}
          anchorOrigin={ {
            vertical: 'bottom',
            horizontal: 'right',
          } }
          transformOrigin={ {
            vertical: 'top',
            horizontal: 'right',
          } }
          className="sm-dropdown"
        >
          {props?.optionFunctionIndex && props?.options
            ? props?.options.map((option: string, index: number) => (
                <Box key={option + index} className="dropdown-menu">
                  {props?.optionFunctionIndex ? (
                    <Box>
                      <Box
                        sx={ { paddingX: 2, paddingY: '12px' } }
                        id={itemId}
                        accessKey = { props.name }
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
    </Box>
  )
}

export default CustomTable