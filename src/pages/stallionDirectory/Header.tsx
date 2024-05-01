import { Button, Container, Drawer, Grid, IconButton, InputBase, Paper, StyledEngineProvider, Typography, Stack, OutlinedInput, InputAdornment } from '@mui/material'
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import './StallionDirectory.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomButton } from 'src/components/CustomButton';
import Box from '@mui/material/Box';
import { ROUTES } from '../../routes/paths'
import ShortlistFilter from './ShortlistFilter';
import StallionFilter from './StallionFilter';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { getQueryParameterByName,scrollToTop } from 'src/utils/customFunctions';
import PedigreeMatch from 'src/components/PedigreeMatch';

const Header = forwardRef((props: any, ref: any) => {
  // console.log(props,"dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  const [search, setSearch] = useState<any>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const stallionName = getQueryParameterByName('search') || "";
  const isStallionParam = (stallionName === '') ? false : true;

  // Checked the local storage and open corresponding search popup
  React.useEffect(() => {
    if (isStallionParam && stallionName !== search) {
      setSearch(stallionName);
      props.setSearchKey(stallionName);
      props.setIsStallionNameExactSearch(true);
      props.setClear(false);
      props?.setPage(1);
      props.setIsSearchedClicked(true);
      props.query.refetch();
      // console.log(stallionName, 'STALLION')
    }
  }, [isStallionParam, stallionName]);

  useEffect(() => {
    if (search?.length === 0) {
      props.setSearchKey('');
      props.setIsStallionNameExactSearch(true);
      props.setClear(false);
      props?.setPage(1);
      props.setIsSearchedClicked(true);
      props.query.refetch();
      navigate('/stallion-directory');
    }
  }, [search])

  useImperativeHandle(ref, () => ({
    handleClearText() {
      setSearch('');
    }
  }))

  //Close filter
  const handleClose = () => {
    setAnchorEl(null);
    setOpenDrawer(!openDrawer);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpenDrawer(!openDrawer);
    if (openDrawer) {
      setAnchorEl(null);
    }
  };


  const closeDrawer = () => {
    setAnchorEl(null);
  }

  // closes the filter
  const handleFilterAndClose = () => {
   
    handleClose();
  }
  //seacrch the stallion or fram 
  const handleChange = (e: any) => {
    e.preventDefault();
    scrollToTop(); 
    props.setSearchKey(search);
    props.setClear(false);
    props?.setPage(1);
    props.query.refetch();
    props.setIsSearchedClicked(true);
  }
  const { pathname } = useLocation();
  const isShortlist = pathname.match("shortlist");

  const handleClearAll = () => {
    props.clearAll();
    handleClose();
  }

  const navigate = useNavigate();
  // navigates to farms Directory
  const goToFarms = () => {
    if (isShortlist) navigate(ROUTES.DIRECTORY)
    else navigate(ROUTES.FARMS)
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

        <Box position='sticky' className='responsive-sticky-directory' sx={{ top: '-43px', background: '#FFFFFF', boxShadow: 'none' }}>
          <Container maxWidth="lg">
            <Grid container my={5} className='stallion-directory-header-wrp'>
              <PedigreeMatch />
              <Grid lg={6} xs={12}>
                <Typography variant='h1' className="SDTitle">
                  {isShortlist ? 'Stallion Shortlist' : 'Stallion Directory'}
                </Typography>
                <Button className="root-button" disableRipple onClick={goToFarms}>
                  {isShortlist ? 'Back to Stallion Directory' : 'Farm Directory'}
                </Button>
              </Grid>
              <Grid lg={6} xs={12} sx={{ display: 'grid', alignItems: 'center' }} className='filter-box-wrapper'>
                <form>
                  <Paper
                    component="form"
                    className='StallionSearch' >
                    <OutlinedInput
                      sx={{ flex: 1 }}
                      className='search'
                      placeholder="Search stallions"
                      inputProps={{ 'aria-label': '' }}
                      value={search}
                      onChange={(e: any) => { setSearch(e.target.value) }}
                      
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={handleChange}>
                            <i className='icon-Search' />
                          </IconButton>
                        </InputAdornment>
                      }

                    />

                  </Paper>
                </form>
                <Box className='filterBtnWrp'>
                  <StyledBadge badgeContent={props.filterCounterhook.value > 0 ? Math.abs(props.filterCounterhook.value) : 0} color="secondary">
                    <CustomButton className="filterBtn" sx={{ marginTop: { lg: '0', xs: '10px' } }} onClick={handleClick}><i className='icon-Filters' /> </CustomButton>
                  </StyledBadge>
                </Box>
                <Drawer
                  sx={{ display: { lg: 'none', xs: 'flex' }, zIndex: '999999' }}
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
                    {isShortlist ? (
                      <ShortlistFilter  {...props} />
                    ) : (
                      <StallionFilter  {...props} />
                    )}

                    <Box className='drawer-button-wrapper'>
                      <Button type='button' fullWidth className='lr-btn lr-btn-outline' onClick={handleClearAll}>Clear all</Button>
                      <Button type='button' fullWidth className='lr-btn' onClick={handleFilterAndClose}>Apply</Button>
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