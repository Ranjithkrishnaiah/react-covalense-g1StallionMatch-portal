import { Stack, Box, Container, Grid, StyledEngineProvider, Typography } from '@mui/material';
import '../../../components/cards/card.css';
import { useAlternateMatingSuggestionsQuery } from 'src/redux/splitEndpoints/AlternateMatingSuggestionsSplit';
import AlternateMatingSuggestionList from 'src/components/cards/AlternateMatingSuggestionList';
import '../stallionsearch.css'
import { getQueryParameterByName } from 'src/utils/customFunctions';
import { Spinner } from 'src/components/Spinner';

function AlternateMatingSuggestions() {
  const stallionId  = getQueryParameterByName('stallionId') || "";
  const mareId  = getQueryParameterByName('mareId') || "";
  const isStallionParam = (stallionId === '') ? false : true;
  const isMareParam = (mareId === '') ? false : true;   
  const isAlternateMatingAPI = (isStallionParam && isMareParam) ? true : false;
  const alternateMatingParams = {stallionId: stallionId, mareId: mareId}; 
  
  // Alternate mating suggestion API call
  const {data: responseAMS, isLoading, isSuccess, isFetching } = useAlternateMatingSuggestionsQuery(alternateMatingParams, { skip: (!isAlternateMatingAPI) });
  let AlternateMateSuggestionList = responseAMS ? responseAMS : [];
  
  // Load the stallion spinner is Stallion API is loading 
  // if (isFetching) {
  //   return <Spinner />
  // }
    return (
        <>
        <StyledEngineProvider injectFirst>
        <Box className='AlternateSuggesionWrp'>
          <Container maxWidth='lg'>
          <Grid container sx={ { justifyContent: 'center' } }>
          <Grid item lg={12} sm={12} xs={12}>
            <Typography variant='h3' sx={ { color: '#1D472E' } }>Alternate Mating Suggestions</Typography>
            {isFetching === true && <Spinner />}
            {(isFetching === false && AlternateMateSuggestionList.length === 0) ?
                  <Stack mt={3}>
                    <Box className='smp-no-data'>
                      <Typography variant='h6'>No Alternate Mating Suggestions found!</Typography>
                    </Box>
                  </Stack>
             :
            <Box className='alternate-mating-box'
              sx={ {
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
              } }>
                {/* AlternateMatingSuggestionList Component */}
                {
                  (AlternateMateSuggestionList.length>0 && AlternateMateSuggestionList.map((fsData:any)=>{
                      return <AlternateMatingSuggestionList key={fsData.horseId} data={fsData} />
                  }))
                }
              
            </Box> 
            }
            </Grid>          
          </Grid>
          </Container>
        </Box>
        </StyledEngineProvider>
      </>
    );
}

export default AlternateMatingSuggestions;