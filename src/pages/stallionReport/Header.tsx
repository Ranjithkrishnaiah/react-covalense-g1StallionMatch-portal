import { Avatar, Container, Grid, Stack, MenuItem, MenuList, StyledEngineProvider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import CustomizedProgressBars from 'src/components/ProgressBar'

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import SocialShare from 'src/components/SocialShare'
import { toPascalCase } from 'src/utils/customFunctions';
import { InsertCommas } from 'src/utils/FunctionHeap';
import { Images } from 'src/assets/images'
import { useDownloadStallionReportQuery } from 'src/redux/splitEndpoints/getDownloadStallionReport'
import { useNavigate } from 'react-router'
import CopyToClipboard from 'react-copy-to-clipboard';
import { Spinner } from 'src/components/Spinner'
import { LoadingButton } from '@mui/lab'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import './Stallionreport.css'

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
  const imgUrl = process.env.REACT_APP_STALLIONS_DEFAULT_IMAGE;;
  const pageUrl = window.location.href;
  const stallionReportTitle = props?.data?.horseName;
  
  const { fromDate, toDate, dateRangeValue, id, farmName, farmID } = props;
  const navigate = useNavigate();

  let obj = { stallionId: id, fromDate, toDate, filterBy: dateRangeValue }
  const [downloadPDF, setDownloadPdf] = React.useState(true);

  const downloadData = useDownloadStallionReportQuery(obj, { skip: downloadPDF });

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
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'stallion report.pdf';
        alink.click();
      })
    })
  }

  const handleStallionSearchNavigation = () => {
    navigate(`/stallion-search?stallionId=${id}`);
  }
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;  
  const stallionSearchUrl = `${BaseAPI}stallion-search?stallionId=${id}`;
  const [copied, setCopied] = React.useState(false);
  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  }

  const backToUrl = '/dashboard/' + `${farmName}/${farmID}`;
  const backToRoasterUrl = '/stallion-roster/' + `${farmName}/${farmID}`;

  return (
    <StyledEngineProvider injectFirst>
      <Box py={3} my={5} className='stallion-report' sx={{ position: 'relative' }}>
        <Container>
          <Grid container lg={12} xs={12}>
            <Grid item lg={12} xs={12}>
              <HeaderBreadcrumbs
                heading="Profile"
                links={[
                  // { name: 'Home', href: '/' },
                  { name: 'My Dashboard', href: '/dashboard' },
                  { name: toPascalCase(farmName)?.toString() + ' Dashboard', href: backToUrl },
                  { name: ' Stallion Roster', href: backToRoasterUrl },
                  { name: toPascalCase(props?.data?.horseName) + ' Report' },
                ]}
              />
            </Grid>
            <Grid item lg={6} xs={12} className='stallionReportLeft'>
              <Stack direction={{ lg: 'row', sm: 'row', xs: 'column' }} spacing={2}>
                <Box>
                  <Avatar src={Images.HorseProfile} sx={{ width: '72px', height: '72px' }} />
                </Box>
                <Box className='stallionReportLeftContent'>
                  <Typography variant='h2'>{toPascalCase(props.data?.horseName)}</Typography>
                  <Typography variant='h6'>Service Fee: {props?.data?.currencySymbol ? props?.data?.currencySymbol : '$'}{InsertCommas(props?.data?.fee)} </Typography>
                  <Typography variant='h6'>YOB: {props.data?.yob}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Stack direction={{ lg: 'row', sm: 'row', xs: 'column' }} spacing={{ xs: 0, sm: 2, md: 3 }}
                sx={{ justifyContent: { lg: 'end', xs: 'left' } }} className='report-links'>
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
                    <SocialShare shareUrl={pageUrl}
                      title={toPascalCase(stallionReportTitle)+""} mediaUrl={imgUrl} pageType={'stallionReport'}/>
                  </MenuItem>
                </MenuList>
                

              </Stack>
              <Stack>
                <Box className='progressbar' sx={{ mt: { lg: '1rem', xs: '0' }, width: { lg: '80%', xs: '95%' } }}>
                  <Box mb={1} sx={{ display: 'flex' }}>
                    <Typography variant="h6" flexGrow={1}>
                      Profile Rating: <b>{props.data?.profileRating > 75 ? "Good" :
                        props.data?.profileRating < 75 && props.data?.profileRating > 25 ? "Intermediate" : "Poor"}</b>
                    </Typography>

                    <HtmlTooltip
                      enterTouchDelay={0}
                      leaveTouchDelay={6000}
                      className="CommonTooltip studfee-tooltip"
                      placement="bottom-end"
                      title={
                        <React.Fragment>
                          {`Your stallion’s profile rating is determined by 
                  how much information is complete. To increase his 
                  profile rating, please update and add information 
                  to your stallion’s profile page.`}
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