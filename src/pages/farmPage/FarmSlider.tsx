import { Box, StyledEngineProvider } from '@mui/material';
import { useState, useCallback } from 'react';
import { Images } from 'src/assets/images';
import Slider from 'src/components/customCarousel/Slider';
import * as _ from 'lodash';
import './FarmPage.css';
import { useFullScreenHandle } from 'react-full-screen';
import FarmPageDefaultImage from 'src/components/FarmPageDefaultImage';
import FullScreenDialog from 'src/components/fullscreenDialog/FullScreenWrapperDialog';

export default function FarmSlider(data: any) {
  
  const inputPartArr: any =
    data.farmGalleryImagesData && data.farmGalleryImagesData.length > 0
      ? data.farmGalleryImagesData?.map((res: any, index: number) => {
          return { id: index + 1, type: 'img', src: res.mediaUrl };
        })
      : [];

  const caroselProps = {
    items: inputPartArr,
    slider: true,
    dots: true,
    arrows: false,
    mediaClassName: 'show',
    noOfVisibleItems: 1,
    autoScroll: false,
    sliderOnItemClick: false,
    styles: {
      item: {
        width: '100%',
        borderRadius: '8px',
      },

      arrows: {
        top: 0,
        right: 0,
      },
      arrowLeft: {},
      arrowRight: {},
      cardContent: {},
    },
    dimension: data.dimension,
    farmDetailsProps: data.farmDetailsProps,
  };
  const handle = useFullScreenHandle();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [open, setOpen] = useState(false);

  const openFullscreen = () => {
    handle.enter();
    setIsFullScreen(true);
  };
  const closeFullscreen = () => {
    handle.exit();
    setIsFullScreen(false);
  };
  const reportChange = useCallback(
    (state) => {
      setIsFullScreen(state);
    },
    [handle]
  );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <StyledEngineProvider injectFirst>
      <FullScreenDialog className={`fullscreen ${open ? 'fullscreen-enabled' : ''}`} open={open} setOpen={setOpen}>
          <Box className="farm-slider">
            {!open ? (
              inputPartArr.length > 0 && (
                <i className="icon-Arrows-expand" onClick={handleClickOpen} />
              )
            ) : (
              <img src={Images.arrowcollapse} className="arrowcollapse" alt="close" onClick={handleClose} />

            )}
            {inputPartArr.length > 0 ? (
              <Slider {...caroselProps} />
            ) : (
              <FarmPageDefaultImage {...data} />
            )}
          </Box>
        </FullScreenDialog>
      </StyledEngineProvider>
    </>
  );
}
