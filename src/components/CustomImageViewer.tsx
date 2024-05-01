import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Images } from 'src/assets/images';

const CustomImageViewer = ({ onClose, title, blobUrl }: any) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // handle fullscreen for sample report pdf
  function handleFullScreen() {
    let pdf = document.getElementsByClassName('pdf-report')[0];
    pdf?.requestFullscreen();
    setIsFullScreen(true);
  }

  // handle zoomin
  function zoomin() {
    var myImg: any = document.getElementById('imageBlock');
    var currWidth: any = myImg.clientWidth;
    if (currWidth > 4500) return false;
    else {
      myImg.style.width = currWidth + 100 + 'px';
    }
  }

  // handle zoomout
  function zoomout() {
    var myImg: any = document.getElementById('imageBlock');
    var currWidth: any = myImg.clientWidth;
    if (currWidth < 250) return false;
    else {
      myImg.style.width = currWidth - 100 + 'px';
    }
  }

  // on close reset the value
  useEffect(() => {
    // setScale(1);
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
        <img
          src={blobUrl}
          alt={title}
          width="100%"
          className={`pdf-report ${isFullScreen === true ? 'centered-pdf' : ''}`}
          id="imageBlock"
          style={{ maxWidth: 'none' }}
        />

        {/* Sample report controller */}
        <Stack className="report-modal-controller">
          <button onClick={zoomout}>
            <img src={Images.ZoomOut} alt="ZoomOut" />
          </button>
          <button onClick={zoomin}>
            <img src={Images.ZoomIn} alt="ZoomIn" />
          </button>
          <a href={blobUrl} download={title}>
            <i className="icon-Download"></i>
          </a>
          <button onClick={handleFullScreen} className="expand-modal">
            <i className="icon-Expand"></i>
          </button>
          <button onClick={onClose}>
            <i className="icon-Cross"></i>
          </button>
        </Stack>
      </>
    );
  } catch (error) {
    return <div>Error loading image: {error.message}</div>;
  }
};

export default CustomImageViewer;
