import { Box, Container, Grid } from '@mui/material';
import TestimonialCard from 'src/components/cards/TestimonialCard';
import { CustomerTestimonials } from 'src/@types/Testimonials';
import { useState, useEffect } from 'react';
import { useGetStallionTestimonialsQuery } from 'src/redux/splitEndpoints/getStallionDetailsSplit';



function Testimonials(props: any) {

  const { stallionId } = props;
  const [testimonialData, setTestimonialData] = useState<CustomerTestimonials[]>([]);
  const { data } = useGetStallionTestimonialsQuery(stallionId);
   useEffect(() => {
    setTestimonialData(data || testimonialData)
  }, [data])

  return (
    <>
    {(data?.length > 0) ? ( 
    <Box className='TestimonialBG'> 
        <Container maxWidth='lg'>
          <Grid container>
            <Grid item lg={12} xs={12}>
              <Box
                sx={ {
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                } }
              >
                {
                  (testimonialData.length > 0 && testimonialData.map((data) => <TestimonialCard key={data.id} testimonial={data} cardType={'stallionPage'}/>))
                }
              </Box>
            </Grid>
          </Grid>
        </Container> 
    </Box>
    ) : ("")} 
    </>
  )
}

export default Testimonials