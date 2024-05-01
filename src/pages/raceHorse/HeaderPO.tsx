import { Container, Grid, Typography, StyledEngineProvider } from '@mui/material';
import './stallionsearch.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SocialShare from 'src/components/SocialShare';
import { toPascalCase } from 'src/utils/customFunctions';
import { useRaceHorsePedigreeOverlapDownloadPdfQuery } from 'src/redux/splitEndpoints/raceHorseSplit';
import { LoadingButton } from '@mui/lab';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

function HeaderPO(props: any) {
  const swHorseName = props.swHorseName;
  const horseName = props.horseName;
  const horseId = props.horseId;  
  const overlapId = props.swHorseId;
  const backLink = '/race-horse/' + horseName + '/' + horseId;
  const pageUrl = window.location.href;
  const pageTitle = 'Race Horse Pedigree Overlap';
  let milliseconds = new Date().getTime();  
  const [downloadPDF, setDownloadPdf] = React.useState(false);
  const searchParams = { horseId: horseId, overlapId: overlapId };
  const [isLoader, setIsLoader] = React.useState(false);

  // Download Overlap pedigree API call
  const { data: pdfDownloadData, isFetching: isPdfDownloadFetching, isLoading: isPdfDownloadLoading, isSuccess: isPdfDownloadSuccess } = useRaceHorsePedigreeOverlapDownloadPdfQuery(searchParams, { skip: !downloadPDF });

  // Search page download function
  const handleDownloadPdf = () => {
    setDownloadPdf(true);
    setIsLoader(true);
  };

  useEffect(() => {
    if(isPdfDownloadSuccess) {
      // setIsPrevSearchDone(true);
      callDownloadPdf();      
    }
  }, [isPdfDownloadFetching]);

  const callPrevDownloadPdf = () => {
    setIsLoader(true);
    callDownloadPdf();
  }

  // foercefully download the pdf to browser from s3
  const callDownloadPdf = () => {
    setDownloadPdf(false);
    setIsLoader(false);
    fetch(pdfDownloadData?.downloadUrl).then((response: any) => {
      response.blob().then((blob: any) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'racehorse.pdf';
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
              { name: horseName, href: backLink },
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

export default HeaderPO;
