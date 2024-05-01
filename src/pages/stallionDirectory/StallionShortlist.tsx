import { Box, Button, StyledEngineProvider, Typography, Grid, Stack } from '@mui/material'
import './StallionDirectory.css'
import CustomStallionCard from 'src/components/cards/StallionCard';
import PaginationSettings from '../../utils/pagination/PaginationFunction';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import { useState, useEffect } from 'react';
import UpdateEmail from 'src/forms/UpdateEmail';
import { scrollToTop } from 'src/utils/customFunctions';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { VoidFunctionType } from 'src/@types/typeUtils'
import { Images } from 'src/assets/images';
import 'src/pages/reports/Reports.css';
import { useNavigate } from 'react-router';
function StallionShortlist({ shortListProps }: any) {
  const navigate = useNavigate();
  const [ openReport, setOpenReport ] = useState(false);
  const [ openUpdateEmail, setOpenUpdateEmail ] = useState(false);
 // go to the top of the page when ever page renders
  useEffect(() => {
    scrollToTop()
  },[])

  
  const [reportUrl, setReportUrl] = useState('https://dev-s3-lambda-bucket.s3.ap-southeast-2.amazonaws.com/69218218-391e-4d52-8cd7-4d4a6a83fba3/ShortlistReport.pdf');
  const [title, setTitle] = useState('My Shortlist Report');

  const handleOpenPdf = (url:string,title:string) => {
    setOpenReport(true);
    setReportUrl(url);
    setTitle(title);
  }
  //navigates to reports page
  const gotoReport = () => {
    navigate("/reports")
  }
  return (
    <StyledEngineProvider injectFirst>
    <Box className='shortlist-order' sx={ { display:{ lg: 'block', xs: 'block' } } }>
      <Box className='shortlist-tiles'/>
        <Box>
          <Typography variant="h3">
            Order a Stallion Match Report
          </Typography>
        </Box>
        <Box mt={1}>
        <Typography variant='h6'>
               Identify the best stallions for your mare for backed by data.
          </Typography>
        </Box>
        <Box mt={3}>
        <Button className='homeSignup' onClick={()=> gotoReport()} style={ { padding:'8px 30px' } }>Order Now</Button>        <Button className='view-sample' onClick={(e: any) => handleOpenPdf(reportUrl, title)}>View Sample</Button>
        </Box>        
      </Box>
      <WrapperDialog
        open={openReport}
        title={title}
        onClose={() => setOpenReport(false)}
        body={IframeComp}
        reportUrl={reportUrl}
        dialogClassName={'pdf-view-modal'}
      />

<WrapperDialog
      open = {openUpdateEmail}
      title= { "Update Email" }
      onClose = {() => setOpenUpdateEmail(false)}
      body= { UpdateEmail }
      />
      <Box
        sx={ {
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        } }
      >
        {shortListProps.result &&  shortListProps.result.map((res: any) => (
          <CustomStallionCard key={res.name} stallion={res} shortlistedIds={shortListProps.selectedBookmarks} />
        ))}
      </Box>
      <PaginationSettings data={shortListProps} />
    </StyledEngineProvider>
  )
}

const IframeComp = (onClose: VoidFunctionType,title:string,reportUrl:string) => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [scaleVal, setScale] = useState(1.0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSuccessfullyLoaded, setIsSuccessfullyLoaded] = useState(false);
  
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
    setScale(1);
    setIsFullScreen(false);
    setIsSuccessfullyLoaded(true);
  }
  function changePage(offSet: any) {
    setPageNumber(prevPageNumber => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1)
  }

  function changePageNext() {
    changePage(+1)
  }

  function handleFullScreen() {
    let pdf = document.getElementsByClassName('pdf-report')[0];
    pdf?.requestFullscreen();
    setScale(1.0);
    setIsFullScreen(true)
  }

  function handleScale(type: string) {
    if (type === 'plus') {
      setScale((prev) => prev + 0.5)
    }
    if (type === 'minus') {
      scaleVal > 0.5 && setScale((prev) => prev - 0.5)
    }
  }

  useEffect(() => {
    setPageNumber(1);
    setScale(1);
    setIsFullScreen(false);
  },[onClose])

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullScreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
  
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div>
      <header className="App-header">
        <Document file={reportUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page height={600} width={400} scale={scaleVal} className={`pdf-report ${isFullScreen === true ? 'centered-pdf' : ''}`} pageNumber={pageNumber} >
          </Page>
        </Document>



      <Stack className='report-nav'>
          { 
            <button disabled={(pageNumber <= 1)} className='report-nav-left' onClick={changePageBack}><i className='icon-Chevron-left'></i></button>
          }
          {
             
           <button disabled={(pageNumber >= numPages)} className='report-nav-right' onClick={changePageNext}><i className='icon-Chevron-right'></i></button>
          }

      </Stack>

      <Stack className='report-modal-controller'>

        {isSuccessfullyLoaded && <button onClick={() => handleScale('minus')}><img src={Images.ZoomOut}/></button>}
        {isSuccessfullyLoaded && <button onClick={() => handleScale('plus')}><img src={Images.ZoomIn}/></button>}
        {isSuccessfullyLoaded && <a href={reportUrl} download={title}><i className='icon-Download'></i></a>}
        {isSuccessfullyLoaded && <button onClick={handleFullScreen}><i className='icon-Expand'></i></button>}
        {<button onClick={onClose}><i className='icon-Cross'></i></button>}
      </Stack>
      </header>
    </div>
  )
}

export default StallionShortlist