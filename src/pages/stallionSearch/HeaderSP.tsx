import { Container, Grid, Typography, StyledEngineProvider } from '@mui/material';
import './stallionsearch.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SocialShare from 'src/components/SocialShare';
import { toPascalCase, getQueryParameterByName } from 'src/utils/customFunctions';
import { usePedigreeOverlapDownloadPdfQuery } from 'src/redux/splitEndpoints/perfectmatchSplit';
import { LoadingButton } from '@mui/lab';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

function HeaderSP(props: any) {
  const swHorseName = props.swHorseName;
  const swStallionId = props.stallionId;
  const swMareId = props.mareId;
  const backLink = '/stallion-search?stallionId=' + swStallionId + '&mareId=' + swMareId;

  const pageUrl = window.location.href;
  const pageTitle = 'Perfect matched search';

  const swId = getQueryParameterByName('swHorseId') || '';
  const [downloadPDF, setDownloadPdf] = React.useState(false);
  const searchParams = { stallionId: swStallionId, mareId: swMareId, swId: swId };
  const [isLoader, setIsLoader] = React.useState(false);

  // Download Overlap pedigree API call
  const downloadData = usePedigreeOverlapDownloadPdfQuery(searchParams, { skip: !downloadPDF });

  // Once Download button is clicked, state variable updated and perform API call  
  const handleDownloadPdf = () => {
    setDownloadPdf(true);
    setIsLoader(true);
  };

  useEffect(() => {
    if (downloadData.currentData && downloadData) {
      callDownloadPdf();
      setDownloadPdf(false);
      setIsLoader(false);
    }
  }, [downloadData.isSuccess]);

  // Download PDF from the S3 link from API response
  const callDownloadPdf = () => {
    fetch(downloadData?.data?.downloadUrl).then((response: any) => {
      response.blob().then((blob: any) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'stallionOverlap.pdf';
        alink.click();
      });
    });
  };

  return (
    <StyledEngineProvider injectFirst>
      <Container maxWidth="lg">
        <Grid container my={5} mb={3} mt={3} className="stallionSearchHeader">
          <Grid lg={12} xs={12}>
          <HeaderBreadcrumbs
            heading="Profile"
            links={[
              { name: 'Stallion Search', href: backLink },
              { name: swHorseName },
            ]}
            />
          </Grid>
          <Grid lg={6} md={6} sm={6} xs={12} mt={3} className="stallionSearchHeaderLeft">
            <Typography variant="h2" className="SDTitle">
              {swHorseName}
            </Typography>
          </Grid>
          <Grid
            lg={6}
            md={6}
            sm={6}
            xs={12}
            spacing={0}
            className="stallionSearchHeaderRight"
            sx={{
              display: 'flex',
              alignItems: 'center',
              direction: 'row',
              justifyContent: { lg: 'right', md: 'right', sm: 'right', xs: 'left' },
            }}
          >
            {/* Social share component */}
            <SocialShare shareUrl={pageUrl} title={pageTitle} mediaUrl={'none'} pageType={'search'} />
            <LoadingButton
              className="stallionsearchButton stallionsearchDWNButton"
              variant="text"
              onClick={handleDownloadPdf}
              loading={isLoader}
              loadingPosition="start"
            >
              <i className="icon-Document-Download" /> Download
            </LoadingButton>
          </Grid>
        </Grid>
      </Container>
    </StyledEngineProvider>
  );
}

export default HeaderSP;
