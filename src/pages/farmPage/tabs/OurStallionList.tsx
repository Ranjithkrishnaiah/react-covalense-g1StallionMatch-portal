import { Box, Container, StyledEngineProvider, Typography } from '@mui/material';
import CustomStallionCard from 'src/components/cards/StallionCard';
import '../FarmPage.css'
import PaginationSettings from 'src/utils/pagination/PaginationFunction';


export default function OurStallionList(stallionListProps: any) {
  const finalData = stallionListProps.stallionListData ? stallionListProps.stallionListData : [];
  return (
    <>
    
    <StyledEngineProvider injectFirst>
    {(finalData.length > 0 ) ? (
      <Box pb={0}>
        <Container>
          <Typography variant='h3' sx={ { color: '#1D472E' } }>Our Stallions</Typography>
        </Container>
        <Container>
          <Box mt={4} pb={0}
            sx={ {
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            } }
          >
            {finalData.map((res: any) => (
              <CustomStallionCard key={res.name} stallion={res} shortlistedIds={""} />
            ))}
          </Box>
          <PaginationSettings data={stallionListProps} />
        </Container>
      </Box> 
      ):(
        <Box sx={ { paddingTop: '0rem' } }>
        <Container>
          <Typography variant='h3' sx={ { color: '#1D472E' } }>Our Stallions</Typography>
        </Container>
        <Container maxWidth="lg"> 
        <Box className='smp-no-data no-data-media'>
            <Typography variant='h6'>No stallion found!</Typography>
          </Box>
        </Container>
      </Box>
      )}
    </StyledEngineProvider>
    
    </>
  )
}
