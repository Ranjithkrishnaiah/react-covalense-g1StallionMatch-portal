import { Box, Container } from '@mui/material';
import '../stallionDirectory/StallionDirectory.css';
import { Images } from '../../assets/images';
import Slider from 'src/components/customCarousel/Slider'
import StallionPageDefaultImage from 'src/components/StallionPageDefaultImage';
function StallionSlider(data:any) {
  const { SMslider, Whiteruning, HomepageHeader } = Images;
 
 const  inputPartArr :any = data.stallionGalleryImageDetails && data.stallionGalleryImageDetails.length > 0 ? data.stallionGalleryImageDetails?.map((res: any, index: number) => {
      return { id: res.mediauuid, type: "img", src: res.mediaUrl }
    }): [];
  const caroselProps = {
    items: inputPartArr,
    slider: true,
    dots: true,
    arrows: false,
    mediaClassName: "farmSlider",
    noOfVisibleItems: 1,
    autoScroll: false,
    sliderOnItemClick: false,
    styles:{
      item:{
        width: "100%",
        borderRadius: "8px"
      },

      arrows:{
        top: 0,
        right:0
      },
      arrowLeft:{},
      arrowRight:{},
      cardContent:{}
    },
    dimension:data.dimension
  }
  return (
    <>   
      <Box style={ { position:'relative' } }>
        {inputPartArr.length > 0 ? <Slider {...caroselProps}/> : <StallionPageDefaultImage/> }
      </Box>
    </>
  );
}

export default StallionSlider;
