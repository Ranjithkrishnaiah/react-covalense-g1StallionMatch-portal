import { Box, Container, Grid, IconButton, Stack, TextField, Typography, Autocomplete, SxProps } from '@mui/material'
import { Images } from '../../assets/images';
import React, { useEffect, useState, useRef } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';
import { makeObjectArrayFromArrays, scrollToTop, toPascalCase, getQueryParameterByName } from 'src/utils/customFunctions';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import './layout.css';
import { useCountriesForFooterQuery, useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import Select from 'react-dropdown-select';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { useCookies } from 'react-cookie';
import { useGetProjectReportsQuery } from 'src/redux/splitEndpoints/getProjectReport';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import AddFarm from 'src/forms/AddFarm';
import AddStallion from 'src/forms/AddStallion';
import CreateAStallion from 'src/forms/CreateAStallion';
import AddStallionPromote from 'src/forms/AddStallionPromote';
import PromoteStallion from 'src/forms/PromoteStallion';
import { debounce } from 'lodash';
import { useFooterAutoSearchQuery } from 'src/redux/splitEndpoints/searchStallionNamesSplit';
import useAuth from 'src/hooks/useAuth';
import FooterReg from 'src/pages/raceHorse/FooterReg';

type FooterProps = {
  countryId?: string;
}
function MainFooter({ countryId }: FooterProps) {
  const { authentication } = useAuth();

  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const twitterUrl = process.env.REACT_APP_TWITTER_URL;
  const facebookUrl = process.env.REACT_APP_FACEBOOK_URL;
  const [findStallion, setFindStallion] = useState("");
  // Get all country API call
  const { data: countriesList } = useCountriesQuery();
  const { data: countriesFooterList } = useCountriesForFooterQuery();
  const { data: projectReportList, isSuccess: isProjectReportListSuccess } = useGetProjectReportsQuery({});
  const { TERMS_AND_CONDITIONS, PRIVACY_POLICY, COOKIE_POLICY } = ROUTES;
  let routesArray = [TERMS_AND_CONDITIONS, PRIVACY_POLICY, COOKIE_POLICY];
  let linkNames = ['Terms of Service', 'Privacy Policy', 'Cookie Policy'];
  const mappedArray = makeObjectArrayFromArrays(linkNames, routesArray);
  const [cookies, setCookie] = useCookies(['country']);
  let selectedCountry = countriesList?.filter((country: any) => country.id == countryId)[0];
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');

  const [openFarmModal, setOpenFarmModal] = useState(false);
  const [openStallionModal, setOpenStallionModal] = useState(false);
  const [stallionId, setStallionId] = useState('');
  const [openAddStallionPromoteModal, setAddStallionPromoteModal] = useState(false);
  const [newllyPromoted, setNewlyPromoted] = useState(false);
  const [dialogClassName, setDialogClassName] = useState('dialogPopup');
  const [stallionTitle, setStallionTitle] = useState('Add a Stallion');

  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const [openRaceHorseModal, setOpenRaceHorseModal] =  useState(false);
  // Country dropdown loading behaviour based on page display
  const scrollClassAdd = () => {
    let parentDiv: any = document.getElementsByClassName('global-dropdown-style footer-dropdown');
    if (parentDiv) {
      let childSelect: any = parentDiv[0]?.children[2];
      if (childSelect) {
        setTimeout(() => {
          let checkforBottom = childSelect.classList.contains('react-dropdown-select-dropdown-position-bottom');
          let checkforTop = childSelect.classList.contains('react-dropdown-select-dropdown-position-top');
          parentDiv[0]?.classList?.remove('bottom-dropdown');
          parentDiv[0]?.classList?.remove('top-dropdown');
          if (checkforBottom) {
            parentDiv[0]?.classList?.add('bottom-dropdown');
          } else {
            parentDiv[0]?.classList?.remove('bottom-dropdown');
          }
          if (checkforTop) {
            parentDiv[0]?.classList?.add('top-dropdown');
          } else {
            parentDiv[0]?.classList?.remove('top-dropdown');
          }
        }, 250);
      }
    }
  }

  // On country option choosen, set the country
  const handleChange = (value: any): void => {
    // console.log(value,'VVV');
    setCountry(value);
    localStorage.setItem('geoCountryName', value[0].countryName);
    scrollClassAdd();
    setCookie('country', value[0].id || 11, { path: '/', sameSite: 'none', secure: true });
    if (window?.location?.pathname == '/reports') {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  // Populate the countryList from API response
  const countryList: any = countriesList?.map((item: any) => {
    return {
      ...item,
      value: item.id
    }
  })
  const [country, setCountry] = React.useState<any | undefined>(authentication ? user?.memberaddress[0]?.countryId : countryList?.filter((v: any, i: number) => v.id == cookies?.country) || []);
  // Handle country scroll based on page scroll 
  useEffect(() => {
    const handleScroll = (event: any) => {
      scrollClassAdd()
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close the stallion popup modal
  const handleCloseStallion = () => {
    setOpenStallionModal(false);
  };

  // Open the create stallion popup modal
  const handleOpenCreateStallionModal = () => {
    setOpenCreateStallionModal(true);
  };

  // Set stallion Id
  const handleSelectedStallions = (value: any) => {
    setStallionId(value);
  };

  // Open promote stallion modal
  const handleOpenPromoteStallion = () => {
    setAddStallionPromoteModal(true);
  };

  // Close promote stallion modal
  const handleClosePromoteStallion = () => {
    setAddStallionPromoteModal(false);
  };

  // Open new promote stallion modal
  const handleOpenPromoteNew = () => {
    setNewlyPromoted(true);
  };

  // Close new promote stallion modal
  const handleClosePromoteNew = () => {
    setNewlyPromoted(false);
  };

  // Close the crete stallion popup
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
    setStallionTitle('Add a Stallion');
  };

  // Open the add farm popup modal 
  const handleAddFarm = () => {
    setOpenFarmModal(true);
  };

  const [stallionname, setStallionName] = useState<any>('');
  const [isStallionSearch, setIsStallionSearch] = useState(false);
  const [isClearStallion, setIsClearStallion] = useState(0);
  const [stallionListSelected, setStallionListSelected] = useState<any>();
  const [isSearchedClicked, setIsSearchedClicked] = useState(false);
  const [footerSearchUrl, setFooterSearchUrl] = useState<any>('');

  // assign payload variable for Stallion search 
  const stallionNameData: any = {
    keyWord: stallionname,
  };

  // Stallion search API call
  const {
    data: footerNameList,
    isSuccess,
    isFetching,
    refetch,
    requestId,
    isLoading,
  } = useFooterAutoSearchQuery(stallionNameData, { skip: !isStallionSearch });

  // Debounce mechanism to restrict cuncurrent Stallion search API call
  const debouncedStallionName = useRef(
    debounce(async (typedStallionName) => {
      if (typedStallionName?.length >= 3 && isClearStallion === 0) {
        await setStallionName(typedStallionName);
        await setIsStallionSearch(true);
        refetch();
      } else {
        setIsStallionSearch(false);
      }
    }, 250)
  ).current;

  // Once user inputs in stallion autocomplete, it checks and render the stallion search API
  const handleStallionInput = (e: any) => {
    setIsClearStallion(0);
    if (e?.target?.value && isClearStallion === 0) {
      debouncedStallionName(e?.target?.value);
    }
  };

  // Assign Stallion search response
  let stallionNameOptionsList =
    isStallionSearch && isClearStallion === 0 && !isFetching ? footerNameList : [];

  // Reset Stallion
  const handleStallionOptionsReset = (blurVal: number, selectedOptions: any) => {
    // setStallionName('');
    setIsStallionSearch(false);
    setIsClearStallion(blurVal);
    // setIsSearchedClicked(false);
  };


  const navigate = useNavigate();
  // Choose a Stallion from the Stallion search result
  const handleStallionSelect = (selectedOptions: any) => {
    setStallionListSelected(selectedOptions);
    setStallionName(selectedOptions?.name);
    handleStallionOptionsReset(0, selectedOptions);
    setIsSearchedClicked(true);
    //setFooterSearchUrl(selectedOptions?.type === 'Stallion' ? `/stallion-directory?search=${selectedOptions?.name}` : `/farm-directory?search=${selectedOptions?.name}`);
    if (selectedOptions?.type === 'Stallion' && selectedOptions?.isPromoted === 0) {
      setFooterSearchUrl(`/stallion-directory?search=${selectedOptions?.name}`)
    }
    if (selectedOptions?.type === 'Stallion' && selectedOptions?.isPromoted === 1) {
      setFooterSearchUrl(`/stallions/${toPascalCase(selectedOptions.name)}/${selectedOptions.uuid}/View`)
    }
    if (selectedOptions?.type === 'Farm' && selectedOptions?.isPromoted === 0) {
      setFooterSearchUrl(`/farm-directory?search=${selectedOptions?.name}`)
    }
    if (selectedOptions?.type === 'Farm' && selectedOptions?.isPromoted === 1) {
      setFooterSearchUrl(`/stud-farm/${toPascalCase(selectedOptions.name)}/${selectedOptions.uuid}`)
    }
  };


  // // Handle country scroll based on page scroll 
  // useEffect(() => {
  //   if(footerKeywordSearch) {
  //     setStallionName('');
  //     setIsSearchedClicked(false);
  //   }
  // }, [footerKeywordSearch]);

  const { pathname } = useLocation();
  const currentPage = pathname.split("/");
  const activePage = currentPage[1];
  const activeSubPage = currentPage[2];
  const directoryPageParam = getQueryParameterByName('location') || "";
  const isDirectoryPageParam = (directoryPageParam === '') ? false : true;
  const reportPageParam = getQueryParameterByName('reportId') || "";
  const isReportPageParam = (reportPageParam === '') ? false : true;

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box className='mainFooter' sx={{ backgroundColor: '#1D472E', padding: '20px 0' }}>
          <Container maxWidth="lg" sx={{ display: 'grid' }}>

            {/* First-Block */}
            <Grid container>
              <Grid item lg={4} md={10} xs={10} className='footer-left-wrapper'>
                <Link to='#'><img src={Images.logo} alt='Stallion Match Logo' /></Link>
              </Grid>
              <Grid item lg={8} md={12} xs={12} className='footer-right-wrapper'>
                <Stack>

                  <Box className='icon footer-right' justifyContent='flex-end' alignItems='flex-end'>
                    <Box mr={1} className='footer-right-inner' title={countryList?.length && country[0]?.countryName}>
                      {countryList?.length &&
                        <Select
                          options={countryList}
                          dropdownPosition="auto"
                          searchBy="countryName"
                          name="countryName"
                          searchable={false}
                          onChange={(values: any) => handleChange(values)}
                          values={authentication ? countryList?.filter((v: any, i: number) => v.id == (user?.memberaddress[0]?.countryId || 11)) : cookies?.country ? countryList?.filter((v: any, i: number) => v.id == cookies?.country) : [{
                            "id": 11,
                            "countryName": "Australia",
                            "countryCode": "AUS",
                            "countryA2Code": "AU",
                            "regionId": 1,
                            "preferredCurrencyId": 1,
                            "isDisplay": true
                          }]}
                          labelField="countryName"
                          className='global-dropdown-style footer-dropdown lg'
                          placeholder='Select Country'
                          dropdownHeight="180px"
                          dropdownHandleRenderer={({ state }) => (
                            // if dropdown is open show "–" else show "+"                               
                            <span>{state.dropdown ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}</span>
                          )}
                          itemRenderer={(data: any) => (
                            <div title={data?.item?.countryName} className={`react-dropdown-select-item ${data?.item?.countryName === country[0]?.countryName ? 'react-dropdown-select-item-selected' : ''}`} onClick={() => data?.methods.addItem(data?.item)}>{data?.item?.countryName}
                            </div>
                          )}
                        />
                      }
                    </Box>
                    <a target='_blank' href={twitterUrl}><img src={Images.twitter} alt='Twitter' className='footerIcons' /></a>
                    <a target='_blank' href={facebookUrl}><img src={Images.facebook} alt='Facebook' className='footerIcons' /></a>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {/* Second-Block */}
            <Grid container className='footer-stallion-farm'>
              <Grid item lg={12} md={12} sm={12} xs={12} className='footer-stallion-farm-body'>
                <Typography variant="h6" pb={2}>
                  Find A Stallion or Farm
                </Typography>
                <Stack direction="row" className="fonrfarms-search">
                  <Box className='SMregis'>
                    <Autocomplete
                      // freeSolo
                      disablePortal
                      popupIcon={<KeyboardArrowDownRoundedIcon />}
                      options={stallionNameOptionsList}
                      noOptionsText={
                        stallionname != '' &&
                        isClearStallion === 0 && (
                          <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                            <span className="fw-bold sorry-message">
                              {isFetching
                                ? 'Loading...'
                                : `Sorry, we couldn't find any matches for "${stallionname}"`}
                            </span>
                          </Box>
                        )
                      }
                      onInputChange={handleStallionInput}
                      getOptionLabel={(option: any) =>
                        `${toPascalCase(option?.name)?.toString()} ${option?.isPromoted === 0 ? '- go to directory' : ''}`
                      }
                      renderOption={(props, option: any) => (
                        <li
                          className="searchstallionListBox"
                          {...props}
                          key={`${option?.search}`}
                        >
                          <Stack className="stallionListBoxHead">
                            {option.search}
                          </Stack>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} placeholder={`Enter Stallion or Farm Name`} />
                      )}
                      onChange={(e: any, selectedOptions: any) => handleStallionSelect(selectedOptions)}
                      onBlur={() => handleStallionOptionsReset(1, '')}
                      className="directory-arrow stallionBlockInput"
                      sx={{ justifyContent: 'center', flexGrow: 1, minWidth: '100px' }}
                    />
                  </Box>
                  <Box className="SMregisIcon" px={2}>
                    <IconButton>
                      <Link to={footerSearchUrl}>
                        <i className="icon-Arrow-circle-right"></i>
                      </Link>
                    </IconButton>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {/* Third-Block */}
            <Grid container className='footer-third-block'>
              <Grid item lg={2.5} md={2.5} sm={4} xs={6} className='footer-item-link'>
                <Typography variant="h6" pb={2}>Stallions by Country</Typography>
                {countriesFooterList?.map((v: any, i: number) => {
                  const isCurrentStallionLocationDirectory =
                    activePage === 'stallion-directory' &&
                    isDirectoryPageParam &&
                    Number(directoryPageParam) === v?.id;
                  return (
                    <Link className={`footer-links ${isCurrentStallionLocationDirectory ? 'gold-highlight disabled-link' : ''}`} key={v.id} to={`/stallion-directory?location=${v.id}`} onClick={() => scrollToTop()}>{v.countryName}</Link>
                  )
                })}
              </Grid>
              <Grid item lg={2.5} md={2.5} sm={4} xs={6} className='footer-item-link'>
                <Typography variant="h6" pb={2}>Farms by Country</Typography>
                {countriesFooterList?.map((v: any, i: number) => {
                  const isCurrentFarmLocationDirectory =
                    activePage === 'farm-directory' &&
                    isDirectoryPageParam &&
                    Number(directoryPageParam) === v?.id;
                  return (
                    <Link className={`footer-links ${isCurrentFarmLocationDirectory ? 'gold-highlight disabled-link' : ''}`} key={v.id} to={`/farm-directory?location=${v.id}`} onClick={() => scrollToTop()}>{v.countryName}</Link>
                  )
                })}
              </Grid>
              <Grid item lg={3} md={3} sm={4} xs={12} className='footer-item-link'>
                <Typography variant="h6" pb={2}>Products</Typography>
                {projectReportList?.map((v: any, i: number) => {
                  const isCurrentReport = activePage === 'reports' && isReportPageParam && Number(reportPageParam) === v?.productId;
                  return (
                    <Link className={`footer-links ${isCurrentReport ? 'gold-highlight disabled-link' : ''}`} key={i} to={`/reports?reportId=${v?.productId == 14 ? 14 : i + 1}`} onClick={() => scrollToTop()}>{v.productName}</Link>
                  )
                })}
              </Grid>
              <Grid item lg={2.5} md={2.5} sm={4} xs={6} className='footer-item-link'>
                <Typography variant="h6" pb={2}>Solutions</Typography>
                <Link className='footer-links' to='#' onClick={() => setOpenStallionModal(true)}>+ Add a Stallion</Link>
                <Link className='footer-links' to='#' onClick={handleAddFarm}>+ Add a Farm</Link>
                <Link className={`footer-links ${activePage === 'stallion-trends' ? 'gold-highlight disabled-link' : ''}`} to='/stallion-trends'>Stallion Match Trends</Link>
                <Link className='footer-links' to='#'>Global Auctions</Link>
                <Link className={`footer-links ${activePage === 'stallion-directory' && isDirectoryPageParam === false ? 'gold-highlight disabled-link' : ''}`} to='/stallion-directory'>Stallion Directory</Link>
                <Link className={`footer-links ${activePage === 'farm-directory' && isDirectoryPageParam === false ? 'gold-highlight disabled-link' : ''}`} to='/farm-directory'>Farm Directory</Link>
                <Link className='footer-links' to='#'>Stakes Racing</Link>
                <Link className='footer-links' to='#' onClick={() => window.open("https://g1goldmine.com/", "_blank")}>G1 Goldmine</Link>
                <Link className={`footer-links ${activePage === 'stallion-search' ? 'gold-highlight disabled-link' : ''}`} to='/stallion-search'>Run a Search</Link>
                <Link className='footer-links' to='#' onClick={() => setOpenRaceHorseModal(true)}>Search for Racehorse</Link>
              </Grid>
              <Grid item lg={1.5} md={1.5} sm={4} xs={6} className='footer-item-link'>
                <Typography variant="h6" pb={2}>Company</Typography>
                <Link className={`footer-links ${activePage === 'about' && !activeSubPage ? 'gold-highlight disabled-link' : ''}`} to='/about'>About</Link>
                <Link className={`footer-links ${activePage === 'careers' ? 'gold-highlight disabled-link' : ''}`} to='/careers'>Careers</Link>
                <Link className='footer-links' to='#' onClick={() => window.open("https://g1goldmine.com/help", "_blank")}>Help</Link>
                <Link className={`footer-links ${activePage === 'contact-us' ? 'gold-highlight disabled-link' : ''}`} to='contact-us'>Contact Us</Link>
                <Link className={`footer-links ${activePage === 'sitemap' ? 'gold-highlight disabled-link' : ''}`} to='#'>Site Map</Link>
              </Grid>
            </Grid>

            {/* Fourth-Block */}
            <Grid container className='footer-fourth-block'>
              <Grid item lg={4} md={10} xs={10} className='footer-left-wrapper'>
              </Grid>
              <Grid item lg={8} md={12} xs={12} className='footer-right-wrapper'>
                <Stack>
                  <Box className='footerBottom'>
                    <Box className='footerBottomLeft' mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                      <Typography sx={{ margin: '0', padding: '0' }}>
                        {mappedArray?.map(obj =>
                          (<Link className={`footernav ${activePage === 'about' && activeSubPage === Object.values(obj)[0].replace('/about/', '') ? `gold-highlight disabled-link` : ''}`} to={Object.values(obj)[0]} key={Object.values(obj)[0]}>{Object.keys(obj)[0]}</Link>))
                        }
                      </Typography>
                    </Box>
                    <Box className='footerBottomRight' mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Typography className='footernav smp-version'>
                        v 1.1.69
                      </Typography>
                      <Typography className='footernav'>
                        Copyright ©2022 G1 Racesoft Pty Ltd
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Container>
          {/* Add a farm popup modal */}
          <Box>
            <WrapperDialog
              open={openFarmModal}
              title={'Add a Farm'}
              onClose={() => setOpenFarmModal(false)}
              addAFarm={'add a farm'}
              body={AddFarm}
            />
          </Box>
          {/* Add a Stallion popup modal */}
          <Box>
            <WrapperDialog
              open={openStallionModal}
              title={'Add a Stallion'}
              onClose={() => handleCloseStallion()}
              setDialogClassName={setDialogClassName}
              body={AddStallion}
              className={'cookieClass'}
              changeTitleTest={setStallionTitle}
              openOther={handleOpenCreateStallionModal}
              handleSelectedStallions={handleSelectedStallions}
              openPromoteStallion={handleOpenPromoteStallion}
              sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
            />
          </Box>
          {/* Create a Stallion popup modal */}
          <Box>
            <WrapperDialog
              open={openCreateStallionModal}
              title={stallionTitle}
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
          {/* Promote Your Stallion popup modal */}
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
              sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
            />
          </Box>
          {/* Promote Stallion popup modal */}
          <Box>
            <WrapperDialog
              open={newllyPromoted}
              title={'Promote Stallion'}
              onClose={handleClosePromoteNew}
              promoteStallionType={() => { }}
              selectedStallionIds={''}
              stallionId={stallionId}
              body={PromoteStallion}
            />
          </Box>
          {/* Add a RaceHorse popup modal */}
          <Box>
             <WrapperDialog
                open={openRaceHorseModal}
                title= 'Search for a racehorse'
                onClose={() => setOpenRaceHorseModal(false)}
                body={FooterReg}
                className=''
                dialogClassName={'dialogPopup raceHorseModel'}
              />
          </Box>
        </Box>
      </StyledEngineProvider>
    </>
  )
}
export default MainFooter