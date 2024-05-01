import { Button, Container,Drawer, Grid, IconButton, InputAdornment, OutlinedInput, Paper, Typography, Stack, StyledEngineProvider } from '@mui/material'
import React, { useEffect, useState ,forwardRef, useImperativeHandle} from 'react'
import { useNavigate } from 'react-router-dom';
import '../stallionDirectory/StallionDirectory.css'
import { CustomButton } from 'src/components/CustomButton';
import Box from '@mui/material/Box';
import { ROUTES } from '../../routes/paths'
import FarmFilter from './FarmFilter';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { getQueryParameterByName } from 'src/utils/customFunctions';

const Header = forwardRef((props: any,ref:any) => {
  const [search, setSearch] = useState<any>();
  const farmName  = getQueryParameterByName('search') || "";
  const isFarmParam = (farmName === '') ? false : true;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Checked the local storage and open corresponding search popup
  React.useEffect(() => {
    if(isFarmParam && farmName !== search) {
      setSearch(farmName);
      props.setSearchKey(farmName);
      props.setClear(false);
      props?.setPage(1);
      props.setIsSearchedClicked(true);
      props.query.refetch();
    }
  }, [isFarmParam, farmName, search]);

  useImperativeHandle(ref, () => ({
    handleClearText() {
      setSearch('');
    }
  }))

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDrawer(!openDrawer);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpenDrawer(!openDrawer);
    if(openDrawer){
      setAnchorEl(null);
    } 
  };
  const closeDrawer = ()=>{
    setAnchorEl(null);
  }

  //updates the search field and refetches the data
  const handleChange = (e: any) => {
    e.preventDefault();
    props.setSearchKey(search);
    props.setClear(false);
    props?.setPage(1);
    props.query.refetch();
    props.setIsSearchedClicked(true);
  }

  const handleClearAll = () => {
    props.clearAll();
    handleClose();
  }

  const navigate = useNavigate();

  const goToDirectory= () => {
    navigate(ROUTES.DIRECTORY)
  }


  
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 2,
    top: 3,
    color: '#ffffff',
    background: '#C75227',
    border: `2px solid #ffffff`,
    padding: '0px',
    fontSize: '10px',
    minWidth: '18px !important',
    height: '18px',
    lineHeight: '18px',
    zIndex: '0'
  },
}));
 
  return (
  <>
 <StyledEngineProvider injectFirst>
   <Box position='sticky' className='responsive-sticky-directory' sx={ { top: '-43px', background: '#FFFFFF', boxShadow: 'none' } }>
  <Container maxWidth="lg">
    <Grid container  my={5} className='stallion-directory-header-wrp'>
  <Grid item lg={6} xs={12}>
    <Typography variant='h1' className="SDTitle">
      Farm Directory
      </Typography>
      <Button className="root-button"  disableRipple onClick={goToDirectory}>
      Stallion Directory
          </Button>
  </Grid>
  <Grid item lg={6} xs={12} sx={ { display: 'grid', alignItems: 'center' } } className='filter-box-wrapper'>
  <form>
  <Paper
      component="form"
      className='StallionSearch'>
      <OutlinedInput
        sx={ {flex: 1 } }
        className='search'
        placeholder="Search farms"
        inputProps={ { 'aria-label': '' } }
        value={search}
        onChange={(e: any) => {setSearch(e.target.value)} } 
        endAdornment={
          <InputAdornment position="end">
            <IconButton type="submit" sx={ { p: '10px' } } aria-label="search" onClick={handleChange}>
            <i className='icon-Search'/>
            </IconButton>
          </InputAdornment>
        }
      />
    </Paper>
    </form>
    <Box className='filterBtnWrp'>
    <StyledBadge badgeContent={Math.abs(props.filterCounterhook.value)} color="secondary">
      <CustomButton className="filterBtn" sx={ { marginTop: { lg: '0', xs:'10px' } } } onClick={handleClick}><i className='icon-Filters'/> </CustomButton>
      </StyledBadge>
    </Box>
    <Drawer
    sx={ { display: { lg: 'none', xs: 'flex' }, zIndex: '999999' } }
    open={openDrawer}
    anchor={'right'}
    onClose={closeDrawer}  
    className='Responsive-drawer'
    ModalProps={{
      keepMounted: true,
    }}
  >
    <Stack className='filter-header'>
      <Typography variant='h4'>Filter results</Typography>
      <Button className='icon-close-btn' onClick={handleClose}><i className='icon-Cross'></i></Button>
    </Stack>
    <Box className='Responsive-filter'>
      <FarmFilter {...props} />
    <Box className='drawer-button-wrapper'>
      <Button type='button' fullWidth className='lr-btn lr-btn-outline' onClick={handleClearAll}>Clear all</Button>
      <Button type='button' fullWidth className='lr-btn' onClick={handleClose}>Apply</Button>
    </Box>
    </Box>
  </Drawer>
  </Grid>
</Grid>
</Container>
</Box>
</StyledEngineProvider>
</>
  )
});

export default Header