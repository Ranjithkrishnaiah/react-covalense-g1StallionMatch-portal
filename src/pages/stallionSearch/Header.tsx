import { Container, Grid, Typography, Button, StyledEngineProvider } from '@mui/material';
import './stallionsearch.css';
import React, { useEffect } from 'react';
import SocialShare from 'src/components/SocialShare';
import { getQueryParameterByName } from 'src/utils/customFunctions';
import { useSearchDownloadPdfQuery } from 'src/redux/splitEndpoints/perfectmatchSplit';
import { LoadingButton } from '@mui/lab';
import Page from 'src/components/Page';

function Header(props: any) {
  const pageUrl = window.location.href;
  const { sectionDisabled } = props;
  const pageTitle = 'Perfect matched search';
  const stallionId = getQueryParameterByName('stallionId') || '';
  const mareId = getQueryParameterByName('mareId') || '';
  const isStallionParam = stallionId === '' ? false : true;
  const isMareParam = mareId === '' ? false : true;
  const isDownloadSearchAPI = isStallionParam && isMareParam ? true : false;
  const [downloadPDF, setDownloadPdf] = React.useState(true);
  const [isLoader, setIsLoader] = React.useState(false);

  const searchParams = { stallionId: stallionId, mareId: mareId };
  const downloadData = useSearchDownloadPdfQuery(searchParams, { skip: downloadPDF });

  // Search page download function
  const handleDownloadPdf = () => {
    setDownloadPdf(false);
    setIsLoader(true);
  };

  useEffect(() => {
    if (downloadData.currentData && downloadData.isSuccess) {
      callDownloadPdf();
      setDownloadPdf(true);
      setIsLoader(false);
    }
  }, [downloadData.isSuccess]);

  const callDownloadPdf = () => {
    fetch(downloadData?.data?.downloadUrl).then((response: any) => {
      response.blob().then((blob: any) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'stallionSearch.pdf';
        alink.click();
      });
    });
  };
  
  return (
    <StyledEngineProvider injectFirst>
      <Page
          title={`${props.metaInfos.title}`}
          meta={`${props.metaInfos.title}`}
          customTitle={`${props.metaInfos.desc}`}
          urlpath={pageUrl}
          gallaryImage={""}
          sx={{ display: 'flex' }}
      >
      <Container maxWidth="lg">
        <Grid container my={5} mb={3} className="stallionSearchHeader">
          <Grid lg={6} md={6} sm={6} xs={12} className="stallionSearchHeaderLeft">
            <Typography variant="h1" className="SDTitle">
              Stallion Search
            </Typography>
          </Grid>
          <Grid
            className="stallionSearchHeaderRight"
            lg={6}
            md={6}
            sm={6}
            xs={12}
            spacing={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              direction: 'row',
              justifyContent: { lg: 'flex-end', md: 'flex-end', sm: 'flex-end', xs: 'flex-start' },
            }}
          >
            {/* Social share component */}
            <SocialShare shareUrl={pageUrl} title={pageTitle} mediaUrl={'none'} pageType={'search'} sectionDisabled={sectionDisabled}/>
            {/* Download Button */}
            <LoadingButton
              className="stallionsearchButton stallionsearchDWNButton"
              variant="text"
              onClick={handleDownloadPdf}
              disabled={!isDownloadSearchAPI}
              loading={isLoader}
              loadingPosition="start"
            >
              <i className="icon-Document-Download" /> Download
            </LoadingButton>
          </Grid>
        </Grid>
      </Container>
      </Page>
    </StyledEngineProvider>
  );
}

export default Header;
