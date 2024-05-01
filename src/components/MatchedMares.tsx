import {
  Box,
  StyledEngineProvider,
  Typography,
  Stack,
} from '@mui/material';
import { useMatchedMaresQuery } from 'src/redux/splitEndpoints/matchedMaresSplit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../../src/utils/pagination/Pagination.css';
import { useState, useEffect } from 'react';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import MatchedMaresTable from './MatchedMaresTable';

type MatchedMareProps = {
  id: string;
  fromDate: string;
  toDate: string;
  filterBy:string;
};

function MatchedMares(props: MatchedMareProps) {
  const columns = ['Mare', 'Sire', 'Dam', 'YOB', 'Prize Money', ''];
  const { id, fromDate, toDate,filterBy } = props;
  const [page, setPage] = useState(1);
  const {
    data: matchedMareData,
    isLoading,
    isSuccess,
  } = useMatchedMaresQuery({ stallionId: id, page, limit: 10, fromDate, toDate,filterBy });
    
  let matchedMaresList = matchedMareData ? matchedMareData?.data : [];
  const matchedMaresProps: any = {
    page: page,
    setPage,
    result: matchedMaresList,
    pagination: matchedMareData?.meta,
    query: matchedMareData,
    // clear,
    // setClear,
    // selectedBookmarks: bookmarkStallionIds,
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box pt={2} className="stallion-report-datatable matched-mares-datatable">
          <Box className="common-table-scroll">
            <TableContainer component={Paper} className="DataList">
              <Table className="DataListTable" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {columns.map((column: string) => (
                      <TableCell align="left" key={column}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Matched mare list component to display the data */}
                  {matchedMaresList?.map((row: any) => (
                    <MatchedMaresTable key={row?.horse} row={row} stallionId={id} />
                  ))}
                  {matchedMaresList?.length === 0 && (
                    <TableCell colSpan={6}>
                      <Box className="smp-no-data">
                        <Typography variant="h6">No data found!</Typography>
                      </Box>
                    </TableCell>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack spacing={16} my={5} className="SDpagenation">
              {/* Pagination component to display the pagination list */}              
              <PaginationSettings data={matchedMaresProps} />
            </Stack>
          </Box>
        </Box>
      </StyledEngineProvider>
    </>
  );
}
export default MatchedMares;
