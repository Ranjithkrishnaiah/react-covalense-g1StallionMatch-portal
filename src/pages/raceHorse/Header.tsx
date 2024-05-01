import { Container, Grid, Typography, Button, StyledEngineProvider } from '@mui/material';
import './stallionsearch.css';
import React, { useEffect } from 'react';
import SocialShare from 'src/components/SocialShare';
import { useRaceHorsePedigreeDownloadPdfQuery, useRaceHorsePedigreeQuery } from 'src/redux/splitEndpoints/raceHorseSplit';
import { LoadingButton } from '@mui/lab';
import { useLocation } from 'react-router-dom';
import { toPascalCase } from 'src/utils/customFunctions';
import useCounter from 'src/hooks/useCounter';

function Header(props: any) {
  const { pathname } = useLocation();
  const currentPage = pathname.split("/");
  const horseName = decodeURIComponent(currentPage[2]);
  const horseId = currentPage[3];
  const pageUrl = window.location.href;
  const { sectionDisabled } = props;
  const pageTitle = horseName;
  const isHorseParam = (horseId === '') ? false : true;
  const isDownloadSearchAPI = isHorseParam ? true : false;
  const [downloadPDF, setDownloadPdf] = React.useState(false);
  const [isLoader, setIsLoader] = React.useState(false);
  const [isPrevSearchDone, setIsPrevSearchDone] = React.useState(1);
  let milliseconds = new Date().getTime();
  const searchParams = { horseId: horseId, rhtime: isPrevSearchDone };
  const apiCounterhook = useCounter(0);
  // Download race horse list api call
  const { data: pdfDownloadData, isFetching: isPdfDownloadFetching, isLoading: isPdfDownloadLoading, isSuccess: isPdfDownloadSuccess } = useRaceHorsePedigreeDownloadPdfQuery(searchParams, { skip: !downloadPDF });
  const { data: horseAllData, isLoading, isFetching, isSuccess, refetch } = useRaceHorsePedigreeQuery(horseId, { refetchOnMountOrArgChange: true });

  // Search page download function
  const handleDownloadPdf = () => {
    setDownloadPdf(true);
    setIsLoader(true);
  };

  useEffect(() => {
    if (isPdfDownloadSuccess) {
      // setIsPrevSearchDone(true);
      apiCounterhook.increment();
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
        <Grid container my={5} mb={3} className="stallionSearchHeader">
          <Grid lg={6} md={6} sm={6} xs={12} className="stallionSearchHeaderLeft">
            <Typography variant="h1" className="SDTitle">
              {toPascalCase(horseAllData ? horseAllData?.horseName : '')?.toString()}
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
            <SocialShare shareUrl={pageUrl} title={pageTitle} mediaUrl={'none'} pageType={'search'} sectionDisabled={sectionDisabled} />
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
    </StyledEngineProvider>
  );
}

export default Header;
