import {
  Box,
  StyledEngineProvider,
  Typography,
  Stack,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../../src/utils/pagination/Pagination.css';
import { useState, useEffect } from 'react';
import { useBreederMatchedMaresQuery } from 'src/redux/splitEndpoints/breederMatchedMaresSplit';
import { useNavigate } from 'react-router';
import BreederMatchedMaresTable from './BreederMatchedMaresTable';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';

// BreederMatchedMareProps type
type BreederMatchedMareProps = {
  id: string;
  fromDate: string;
  toDate: string;
  filterBy:string;
};

function BreederMatchedMares(props: BreederMatchedMareProps) {
  const navigate = useNavigate();
  const { id, fromDate, toDate ,filterBy} = props;
  const [page, setPage] = useState(1);
  // API call to get matched Mare Data
  const {
    data: matchedMareData,
    isLoading,
    isSuccess,
  } = useBreederMatchedMaresQuery({ farmId: id, page, limit: 10, fromDate, toDate,filterBy });
  let matchedMaresList = matchedMareData ? matchedMareData?.data : [];

  // matched Mares Props
  const matchedMaresProps: any = {
    page: page,
    setPage,
    result: matchedMaresList,
    pagination: matchedMareData?.meta,
    query: matchedMareData,
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box pt={2} className="stallion-report-datatable matched-mares-datatable">
          {/* table section for breeder matched mares */}
          <Box className="common-table-scroll">
            <TableContainer component={Paper} className="DataList">
              <Table className="DataListTable" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Breeder Name</TableCell>
                    <TableCell align="left">Location</TableCell>
                    <TableCell align="left" className="matched-dam">
                      Total Searches
                    </TableCell>
                    <TableCell align="left" className="matched-yob">
                      20/20 Matches
                    </TableCell>
                    <TableCell align="left" className="matched-prize">
                      Most Common Mare
                    </TableCell>
                    <TableCell align="left">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchedMaresList?.map((row: any) => (
                    <BreederMatchedMaresTable key={row?.horse} row={row} stallionId={id} />
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
            {/* Pagination section */}
            <Stack spacing={16} my={5} className="SDpagenation">
              <PaginationSettings data={matchedMaresProps} />
            </Stack>
          </Box>
        </Box>
      </StyledEngineProvider>
    </>
  );
}
export default BreederMatchedMares;
