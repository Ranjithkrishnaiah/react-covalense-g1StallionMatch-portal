import { Box } from '@mui/material';
import TestimonialCard from 'src/components/cards/TestimonialCard';
import { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";

function Testimonials(props: any) {
  let { testimonialList } = props;  
  const [pauseOnHover, setpauseOnHover] = useState(true);
  const [pauseOnClick, setpauseOnClick] = useState(false);
  
  useEffect(() => {
    const handleResizeWindow = () => {
      if (window.innerWidth > 768) {
        setpauseOnHover(true);
        setpauseOnClick(false);
      } else {
        setpauseOnHover(false);
        setpauseOnClick(true);
      }
    };
    
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, [])

  return (
    <Box className='TestimonialBG'>
      <Box className='Testimonial-Slider'>
        {/* Component to show testimonial lists */}
        {testimonialList?.length > 0 &&
          <Marquee pauseOnHover={pauseOnHover} pauseOnClick={pauseOnClick} loop={0} play={true} speed={60} gradient={false}>
            {testimonialList?.map((testimonial: any) => <TestimonialCard key={testimonial?.id} testimonial={testimonial} cardType={'Home'}/>)}
          </Marquee>}
      </Box>
    </Box>
  )
}

export default Testimonials