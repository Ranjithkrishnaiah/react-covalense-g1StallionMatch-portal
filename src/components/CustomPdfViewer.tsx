import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { Images } from 'src/assets/images';

const CustomPdfViewer = ({ onClose, title, blobUrl }: any) => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [scaleVal, setScale] = useState(1.0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSuccessfullyLoaded, setIsSuccessfullyLoaded] = useState(false);

  //  On Document Load
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
    setScale(1);
    setIsFullScreen(false);
    setIsSuccessfullyLoaded(true);
  }

  // On page change
  function changePage(offSet: any) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  // on previous page
  function changePageBack() {
    changePage(-1);
  }

  // on next page
  function changePageNext() {
    changePage(+1);
  }

  // handle fullscreen for sample report pdf
  function handleFullScreen() {
    let pdf = document.getElementsByClassName('pdf-report')[0];
    pdf?.requestFullscreen();
    setScale(1.0);
    setIsFullScreen(true);
  }

  // change the scale of report
  function handleScale(type: string) {
    if (type === 'plus') {
      setScale((prev) => prev + 0.5);
    }
    if (type === 'minus') {
      scaleVal > 0.5 && setScale((prev) => prev - 0.5);
    }
  }

  // on close reset the value
  useEffect(() => {
    setPageNumber(1);
    setScale(1);
    setIsFullScreen(false);
  }, [onClose]);

  // set fullscreen state on fullscreen event listener
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullScreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  try {
    return (
      <>
        <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess} noData={''}>
          <Page
            height={600}
            width={410}
            scale={scaleVal}
            className={`pdf-report ${isFullScreen === true ? 'centered-pdf' : ''}`}
            pageNumber={pageNumber}
          ></Page>
        </Document>

        {/* Navigation buttons */}
        <Stack className="report-nav">
          {
            <button disabled={pageNumber <= 1} className="report-nav-left" onClick={changePageBack}>
              <i className="icon-Chevron-left"></i>
            </button>
          }
          {
            <button
              disabled={pageNumber >= numPages}
              className="report-nav-right"
              onClick={changePageNext}
            >
              <i className="icon-Chevron-right"></i>
            </button>
          }
        </Stack>

        {/* Sample report controller */}
        <Stack className="report-modal-controller">
          {isSuccessfullyLoaded && (
            <button onClick={() => handleScale('minus')}>
              <img src={Images.ZoomOut} alt="ZoomOut" />
            </button>
          )}
          {isSuccessfullyLoaded && (
            <button onClick={() => handleScale('plus')}>
              <img src={Images.ZoomIn} alt="ZoomIn" />
            </button>
          )}
          {isSuccessfullyLoaded && (
            <a href={blobUrl} download={title}>
              <i className="icon-Download"></i>
            </a>
          )}
          {isSuccessfullyLoaded && (
            <button onClick={handleFullScreen} className="expand-modal">
              <i className="icon-Expand"></i>
            </button>
          )}
          {
            <button onClick={onClose}>
              <i className="icon-Cross"></i>
            </button>
          }
        </Stack>
      </>
    );
  } catch (error) {
    return <div>Error loading PDF: {error.message}</div>;
  }
};

export default CustomPdfViewer;
