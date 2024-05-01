import { Container, Box, StyledEngineProvider, Typography, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import '../stallionsearch.css';
import {useGetStakesWinOverlapQuery} from 'src/redux/splitEndpoints/getOverlapStakesWin';
import 'src/components/Datatable/DataList.css';

function StakesWins(props: any) {
  const stallionId  = props?.swHorseId;
  // Stakes win API call
  const {data, isLoading, isSuccess } = useGetStakesWinOverlapQuery({stallionId: stallionId});
  let SWCList = data ? data : [];

  return (
  <>
  <StyledEngineProvider injectFirst>
    <Box className='stakes-winner-wrapper'>
      <Container>
        <Box>
          <Stack direction={ { lg: 'row', xs: 'column' } }  sx={ { marginBottom: '20px' } }>
          <Box flexGrow={1}> 
            <Typography variant='h3' sx={ { color: '#1D472E' } }>Stakes Wins</Typography>
          </Box>        
        </Stack>
        </Box>
      </Container>
      <Box className='stackWinnerTable'>
        <Container>
          <TableContainer component={Paper} className='DataList'>
            <Table className='DataListTable' aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">TYPE</TableCell>
                  <TableCell align="left">RACE</TableCell>
                  <TableCell align="left">YEAR</TableCell>
                  <TableCell align="left">LOCATION</TableCell>
                  <TableCell align="left">DISTANCE</TableCell>
                  <TableCell align="left">TRACK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {SWCList.map((row:any) => (
                <TableRow
                  key={row.type}
                  sx={ { '&:last-child td, &:last-child th': { border: 0 } } }
                >
                  <TableCell align="left">{row.stake || 'N/A'}</TableCell>
                  <TableCell align="left">{row.raceName || 'N/A'}</TableCell>
                  <TableCell align="left">{row.raceYear || 'N/A'}</TableCell>
                  <TableCell align="left">{row.countryName || 'N/A'}</TableCell>
                  <TableCell align="left">{row.raceDistance || 'N/A'} {row.distanceUnit}</TableCell>
                  <TableCell align="left">{row.trackName || 'N/A'}</TableCell>
                </TableRow>
              ))}
              {
                SWCList?.length === 0 && <TableCell  colSpan={6}>
                    <Box className='smp-no-data'>
                        <Typography variant='h6'>No data found!</Typography>
                      </Box>              
                  </TableCell>
              }
              </TableBody>
            </Table>
        </TableContainer>  
      </Container>
      </Box>     
    </Box>        
 </StyledEngineProvider>
  </>
  );
}
export default StakesWins;