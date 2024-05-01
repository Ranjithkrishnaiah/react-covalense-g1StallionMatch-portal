import { Container, Grid, Stack, MenuItem, MenuList, StyledEngineProvider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import './BreederReport.css'
import React, { useEffect } from 'react'
import CustomizedProgressBars from 'src/components/ProgressBar'

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import SocialShare from 'src/components/SocialShare'
import { toPascalCase } from 'src/utils/customFunctions'
import { Images } from 'src/assets/images'
import { useDownloadBreederReportQuery } from 'src/redux/splitEndpoints/getdowloadbreederreport'
import Imgix from 'react-imgix';
import CopyToClipboard from 'react-copy-to-clipboard'
import { LoadingButton } from '@mui/lab'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 346,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function Header(props: any) {
  const imgUrl = process.env.REACT_APP_BREEDER_REPORT_HEADER_IMG;
  const pageUrl = window.location.href;
  const breederTitle = props?.data?.farmName;
  const { fromDate, toDate, dateRangeValue, id } = props;
  let obj = { farmId: id, fromDate, toDate, filterBy: dateRangeValue }
  const [downloadPDF, setDownloadPdf] = React.useState(true);
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;  
  const stallionSearchUrl = `${BaseAPI}stallion-search`;
  const [copied, setCopied] = React.useState(false);

  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  }


  const downloadData = useDownloadBreederReportQuery(obj,{skip:downloadPDF});

  const handleDownloadPdf = () => {
    setDownloadPdf(false);
  }
  
  useEffect(() => {
    if (downloadData.currentData && downloadData.isSuccess) {
      callDownloadPdf();
      setDownloadPdf(true)
    }
  }, [downloadData.isFetching])

  const callDownloadPdf = () => {
    fetch(downloadData?.data[0]?.downloadUrl).then((response: any) => {
      response.blob().then((blob: any) => {
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'BreederReport.pdf';
        alink.click();
      })
    })
  }

  const backToFarmDashboardUrl = '/dashboard/' + `${props.data?.farmName}/${id}`;

  return (
    <StyledEngineProvider injectFirst>
      <Box py={3} my={5} className='stallion-report' sx={{ position: 'relative' }}>
        <Container>
          <Grid container lg={12} xs={12}>
            <Grid item lg={12} xs={12}>
              <HeaderBreadcrumbs
                heading="Profile"
                links={[
                  { name: 'Home', href: '/' },
                  { name: 'My Dashboard', href: '/dashboard' },
                  { name: toPascalCase(props.data?.farmName)?.toString() + ' Dashboard', href: backToFarmDashboardUrl },
                  { name: toPascalCase(props?.data?.farmName) + ' Report' },
                ]}
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <Stack direction={{ lg: 'row', sm: 'row', xs: 'column' }} spacing={2}>
                <Box className="farmlogo-column breeder-report-logo">
                {props.data?.image  && props.data?.image  ? (
                <div >
                  <Imgix
                    src={props.data?.image }            
                    imgixParams={{w:120,h:80,ar:'3:2',fit:'crop'}}
                    htmlAttributes={{ alt: props.data?.farmName+' Logo' }}
                  />
                </div>
              ) : (
                <img
                  src={Images.farmplaceholder}
                  alt={props.data?.farmName+' Logo'}
                  
                />
              )}
                  </Box>
                <Box>
                  <Typography variant='h2'>{toPascalCase(props.data?.farmName)}</Typography>
                  <Typography variant='h6'>{props.data?.stateName}{props.data?.stateName ? ', ' : ''}{props.data?.countryName}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Stack direction={{ lg: 'row', sm: 'row', xs: 'column' }} spacing={{ xs: 0, sm: 2, md: 3 }} sx={{ justifyContent: { lg: 'end', xs: 'left' } }} className='report-links'>
                <MenuList>
                  <MenuItem disableGutters>
                    <i className='icon-Link' />
                    <CopyToClipboard text={stallionSearchUrl} onCopy={onSuccessfulCopy}>
                      <Box  className={"pointerOnHover"}> {!copied ? "Stallion Match Link" : "Stallion Match Link Copied!"}</Box>
                    </CopyToClipboard>
                  </MenuItem>
                </MenuList>
                <MenuList>
                  <MenuItem disableGutters onClick={handleDownloadPdf}>
                  <LoadingButton loading={downloadPDF === false}>
                  {downloadPDF === true && <i className='icon-Download' />} Download 
                    </LoadingButton>
                  </MenuItem>
                </MenuList>
                <MenuList>
                  <MenuItem disableGutters>
                    <SocialShare shareUrl={pageUrl} title={toPascalCase(breederTitle)+""} mediaUrl={imgUrl} pageType={'breederReport'}/>
                  </MenuItem>
                </MenuList>
                
              </Stack>
              <Stack>
                <Box className='progressbar' sx={{ mt: { lg: '1rem', xs: '0' }, width: { lg: '80%', xs: '95%' } }}>
                  <Box mb={1} sx={{ display: 'flex' }}>
                    <Typography variant="h6" flexGrow={1}>
                      Profile Rating: <b>{props.data?.profileRating > 75 ? "Good" :
                        props.data?.profileRating <= 75 && props.data?.profileRating > 25 ? "Intermediate" : "Poor"}</b>
                    </Typography>

                    <HtmlTooltip
                      enterTouchDelay={0}
                      leaveTouchDelay={6000}
                      className="CommonTooltip studfee-tooltip"
                      placement='bottom-end'
                      title={
                        <React.Fragment>
                          {'Your stallion’s profile rating is determined by how much information is complete. To increase his profile rating, please update and add information to your stallion’s profile page. '}
                          {' '}
                        </React.Fragment>
                      }
                    >
                      <i className="icon-Info-circle" style={{ fontSize: '16px' }} />
                    </HtmlTooltip>

                  </Box>
                  <CustomizedProgressBars profileRating={props.data?.profileRating} />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </StyledEngineProvider>
  )
}

export default Header