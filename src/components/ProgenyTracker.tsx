import { Container, Box, StyledEngineProvider, Typography, Stack, Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import '../../src/utils/pagination/Pagination.css';
import { useState } from 'react';
import { useProgenyTrackerQuery } from 'src/redux/splitEndpoints/stallionSplit';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import { toPascalCase } from 'src/utils/customFunctions';

function ProgenyTracker(props: any) {
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const columns = ['Horse', 'Dam', 'Age', 'Distance', 'Class', 'Location']
  const { id, fromDate, toDate,filterBy } = props;

  // Progeny tracker api call
  const { data: matchedMareData, isLoading, isSuccess } = useProgenyTrackerQuery({ stallionId: id, page, limit: 10, fromDate, toDate,filterBy });
  
  let progenyTrackerList = matchedMareData ? matchedMareData?.data : [];

  const stallionProgenyReportProps:any = {
    page: page,
    setPage,
    result: progenyTrackerList,
    pagination: matchedMareData?.meta,
    query: matchedMareData,
    // clear,
    // setClear,
    // selectedBookmarks: bookmarkStallionIds,
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box pt={10} pb={10} className='stallion-report-datatable progeny-tracker-datatable'>
          <Container>
            <Box mt={0}>
              <Stack direction={{ lg: 'row', xs: 'column' }} sx={{ marginBottom: '10px' }}>
                <Box flexGrow={1}>
                  <Typography variant='h3' sx={{ color: '#1D472E' }}>Progeny Tracker</Typography>
                </Box>
              </Stack>
            </Box>
          </Container>
          <Box className='common-table-scroll'>
            <TableContainer component={Paper} className='DataList'>
              <Table className='DataListTable' aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {columns.map((column: string) => (
                      <TableCell align="left" key={column}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progenyTrackerList?.map((row: any) => (
                    <TableRow
                      key={row.horse}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">{toPascalCase(row.horseName)}</TableCell>
                      <TableCell align="left">{toPascalCase(row.damName)}</TableCell>
                      <TableCell align="left">{row.age}</TableCell>
                      <TableCell align="left">{row.distance}{row.distanceCode}</TableCell>
                      <TableCell align="left">{row.class}</TableCell>
                      <TableCell align="left">{row.location}</TableCell>
                    </TableRow>
                  ))}
                   {
                    progenyTrackerList?.length === 0 && <TableCell colSpan={6}>
                     <Box className='smp-no-data'>
                            <Typography variant='h6'>No Progeny Found!</Typography>
                         </Box>        
                      </TableCell>
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Stack spacing={16} my={5} className="SDpagenation">
            <PaginationSettings data={stallionProgenyReportProps} />
          </Stack>
        </Box>
      </StyledEngineProvider>
    </>
  );
}
export default ProgenyTracker;