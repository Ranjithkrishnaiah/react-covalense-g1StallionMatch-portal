import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Stack,
  StyledEngineProvider,
  SelectChangeEvent,
  Typography,
  Divider,
  Popover,
} from '@mui/material';
import React, { useState } from 'react';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CustomDateRangePicker from 'src/components/customDateRangePicker/DateRangePicker';
import { CustomButton } from 'src/components/CustomButton';
import './Roaster.css';
import '../messages/Messages.css';
import AddStallion from 'src/forms/AddStallion';
import CreateAStallion from 'src/forms/CreateAStallion';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import PromoteStallion from 'src/forms/PromoteStallion';
import { DateRange } from 'src/@types/dateRangePicker';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { toPascalCase } from 'src/utils/customFunctions';

function Header(props: any) {
  const { handleSelectedStallionID, selectedStallionIds, farmNameFromData } = props;
  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [newllyPromoted, setNewlyPromoted] = useState(false);
  const [stallionId, setStallionId] = useState('');
  const [isDateSorted, setDateSort] = useState('This Month');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const sortByOptions = ['Alphabetical','Year of Birth','Top Performing'];
  
  const roasterFarmName = farmNameFromData && farmNameFromData[0]?.farmName;
  const roasterFarmId = farmNameFromData && farmNameFromData[0]?.farmId;
  const backToUrl = '/dashboard/' + `${roasterFarmName}/${roasterFarmId}`;
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }
  
  const checkForNull = (arr: any) => {
    return arr.some((el: any) => el === null);
  }

  const handleDueDate = (value: DateRange) => {
    if(!checkForNull(value)) {
      props.setDateSortSelected('Custom');
      props.setDueDateValue(value);
    }
  };

  const handleSelectedStallions = (value: any) => {
    handleSelectedStallionID(value);
    setStallionId(value);
  };

  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  const handleOpenPromoteStallion = () => {
    setAddStallionPromoteModal(true);
  };

  const handleClosePromoteStallion = () => {
    setAddStallionPromoteModal(false);
  };

  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
    setStallionTitle('Add a Stallion');
  };

  const handleOpenPromoteNew = () => {
    setNewlyPromoted(true);
  };

  const handleClosePromoteNew = () => {
    setNewlyPromoted(false);
  };

  const handleChange = (event: any,element:any): void => {
    console.log("EVT: ", event.target.innerText,element)
    props.setSortBy(element);
    handleClose();
  };

  const handleDatePicker = (event: SelectChangeEvent<any>): void => {
    if(event.target.value !== 'Custom') {
      props.setDateSortSelected(event.target.value);
    }
    setDateSort(event.target.value);
  };

  
  const ITEM_HEIGHT = 34;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        //   width: 166,
        //   minWidth: 166,
          marginLeft: '0px',
          marginTop:'-2px',
          boxShadow: 'none',
          border: 'solid 1px #161716',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxSizing: 'border-box',
        },
      },

}
  
  const id = anchorEl ? 'simple-popover' : undefined;
  return (
    <StyledEngineProvider injectFirst>
      <Container maxWidth="lg">
        <Grid container mt={5} mb={2}>
          <Grid item lg={8} xs={12}>
            <HeaderBreadcrumbs
              heading="Profile"
              links={[
                { name: 'Home', href: '/' },
                { name: 'My Dashboard', href: '/dashboard' },
                { name: toPascalCase(roasterFarmName)?.toString() + ' Dashboard', href: backToUrl },
                { name: 'Stallion Roster' },
              ]}
            />
          </Grid>
          <Grid item lg={8} sm={7} xs={12} className="roasterheading">
            <Typography variant="h2">Stallion Roster</Typography>
          </Grid>
          <Grid item lg={4} sm={5} xs={12} className="stallionRoaster-headerright">
            <Stack
              className="stallionRoaster-innrhed"
              direction="row"
              sx={ { justifyContent: { lg: 'flex-end', sm: 'flex-end', xs: 'left' }, display: 'flex' } }
            >
              <Box mr={2}>

              <Button
              disableRipple
              className="msg-btn sortby"
              aria-describedby={id}
              variant="contained"
              onClick={handleClick}
              disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}
            >
              Sort by 
              
              <i className='sortbyarrow'><KeyboardArrowDownRoundedIcon/></i>
              {/* <i className="icon-Chevron-down" /> */}
            </Button>
            <Popover
              sx={{
                display: { lg: 'flex', sm: 'flex', xs: 'flex' },
                mt: '6px',
                height: '350px',
                zIndex: '4',
              }}
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              className="sm-dropdown"
            >
              <Box className="sortby-menu">
                {sortByOptions?.map((element: any, index: number) => (
                  <Box
                    key={element + '-' + index}
                  >
                    <Box sx={{ paddingX: 2, paddingY: '12px' }} 
                    className={`popOverFilter ${props.sortBy === element ? 'active' : ''}`}
                    id = { element }
                    onClick={(e:any) => handleChange(e,element)}
                    >
                      {element}
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
            </Popover>
                
                {/* <CustomSelect
                  className="sort-Btn-Custom"
                  onChange={handleChange}
                  defaultValue={'none'}
                  IconComponent={KeyboardArrowDownIcon}
                  MenuProps={ {
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  } }
                  MenuProps={Menuprops}
                  PaperProps={ {
                    sx: paperSx
                  } }
                >
                  <MenuItem className="sortBtnDropDownList" value='none' disabled>
                    Sort by
                  </MenuItem>
                  <MenuItem className="sortBtnDropDownList" value="Alphabetical">
                    Alphabetical
                  </MenuItem>
                  <MenuItem className="sortBtnDropDownList" value="Year of birth">
                    Year of birth
                  </MenuItem>
                  <MenuItem className="sortBtnDropDownList" value="Top performing">
                    Top performing
                  </MenuItem>
                </CustomSelect> */}
              </Box>
              <Box>
                <CustomButton
                 disableRipple 
                 className="ListBtn" 
                 onClick={() => setOpenStallionModal(true)}
                 disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}
                 >
                  <i className="icon-Plus" /> Add Stallion
                </CustomButton>
              </Box>
            </Stack>
            <Stack
              className="stallionRoaster-innrhed"
              mt={2}
              direction="row"
              sx={ { justifyContent: { lg: 'right', sm: 'right', xs: 'left' }, display: 'flex' } }
            >
              <Box>
                <CustomSelect
                disablePortal
                  className="selectDropDownBox NameBtn"
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  defaultValue={'This Month'}
                  sx={ { marginTop: '8px', height: '40px' } }
                  MenuProps={MenuProps}
                  onChange={handleDatePicker}
                  disabled={props?.accessLevel ? props?.accessLevel === '3rd Party' ? true : false : false}
                >
                  <MenuItem className="selectDropDownList" value="Today">
                    Today
                  </MenuItem>
                  <MenuItem className="selectDropDownList" value="This Week">
                    This Week
                  </MenuItem>
                  <MenuItem className="selectDropDownList" value="This Month">
                    This Month
                    {/* Last 4 weeks */}
                  </MenuItem>
                  <MenuItem className="selectDropDownList" value="This Year">
                    This Year
                  </MenuItem>
                  <MenuItem className="selectDropDownList" value="Custom">
                    Custom
                  </MenuItem>
                </CustomSelect>
              </Box>
              <Box>
                {isDateSorted === 'Custom' && (
                  <Box ml={2} className="roaster-date">
                  <CustomDateRangePicker
                    roster="roster"
                    handleDueDate={handleDueDate}
                    dateSortSelected={props.dateSortSelected}
                    dueDate = {props.dueDateValue}
                  />
                  </Box>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Box>
          <WrapperDialog
            open={openStallionModal}
            title={'Add a Stallion'}
            setDialogClassName = { setDialogClassName }
            onClose={() => setOpenStallionModal(false)}
            openOther={handleOpenCreateStallionModal}
            changeTitleTest={setStallionTitle}
            handleSelectedStallions={handleSelectedStallions}
            openPromoteStallion={handleOpenPromoteStallion}
            body={AddStallion}
            className={'cookieClass'}
            sx={ { backgroundColor: '#1D472E', color: '#2EFFB4 !important' } }
          />
        </Box>

        <Box>
          <WrapperDialog
            open={openCreateStallionModal}
            setOpenStallionModal = { setOpenStallionModal }
            title={stallionTitle}
            dialogClassName = { dialogClassName }
            onClose={handleCloseCreateStallion}
            createStallion="createStallion"
            isSubmitStallion={true}
            isSubmitMare={false}
            closeAddMare={''}
            body={CreateAStallion}
            className={'cookieClass'}
            sx={ { backgroundColor: '#1D472E', color: '#2EFFB4 !important' } }
          />
        </Box>

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
            sx={ { backgroundColor: '#1D472E', color: '#2EFFB4 !important' } }
          />
        </Box>
        <Box>
          <WrapperDialog
            open={newllyPromoted}
            title={'Promote Stallion'}
            onClose={handleClosePromoteNew}
            promoteStallionType={() => {} }
            selectedStallionIds={''}
            stallionId={stallionId}
            body={PromoteStallion}
          />
        </Box>
      </Container>
    </StyledEngineProvider>
  );
}

export default Header;
