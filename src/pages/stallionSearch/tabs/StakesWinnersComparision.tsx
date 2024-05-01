import {
  Container,
  Box,
  StyledEngineProvider,
  Typography,
  Stack,
  MenuItem,
  Button,
} from '@mui/material';
import { CustomSelect } from 'src/components/CustomSelect';
import '../stallionsearch.css';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStakesWinnersComparisionQuery } from 'src/redux/splitEndpoints/stakesWinnerCompSplit';
import { useNavigate } from 'react-router-dom';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import { useState } from 'react';
import Loader from 'src/components/Loader';
import { toPascalCase } from 'src/utils/customFunctions';
import { getQueryParameterByName } from 'src/utils/customFunctions';

function StakesWinnersComparision() {
  const navigate = useNavigate();  
  const stallionId  = getQueryParameterByName('stallionId') || "";
  const mareId  = getQueryParameterByName('mareId') || "";
  const isStallionParam = (stallionId === '') ? false : true;
  const isMareParam = (mareId === '') ? false : true;   
  const isBothParam = (isStallionParam && isMareParam) ? true : false;

  const [page, setPage] = useState<any>(1);
  const [sortBy, setSortBy] = useState<any>('Similarityscore');

  const params = {
    stallionId,
    mareId,
    page,
    sortBy,
  };
  
  // Stake winner API call
  const { data: SWCData, isSuccess, isLoading } = useStakesWinnersComparisionQuery(params, {skip : !isBothParam});
  let SWCList = SWCData ? SWCData.data : [];

  // Generate the Pedigree overlap url and redirect
  const handlePedigreeOverlap = (overlapId: any, sex: any) => {
    navigate(
      '/stallion-search/stallion-comparision?stallionId=' +
        stallionId +
        '&mareId=' +
        mareId +
        '&swHorseId=' +
        overlapId +
        '&type=' +
        sex
    );
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        marginLeft: '0px',
        marginTop: '-1px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };
  let pageData: any = null;
  if (SWCData) {
    pageData = {
      page,
      setPage,
      query: SWCData,
      pagination: SWCData?.meta,
    };
  }
  const sortStakesProgeny = (event: any) => {
    setSortBy(event.target.value);
    setPage(1);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <StyledEngineProvider injectFirst>
        <Box className="stakes-winner-wrapper">
          <Container maxWidth='lg'>
            <Box className="stakes-winner-header">
              <Stack
                className="stakes-winner-header-inner"
                direction={{ lg: 'row', sm:'row', xs: 'column' }}
                sx={{ marginBottom: '12px' }}
              >
                <Box flexGrow={1}>
                  <Typography variant="h3" sx={{ color: '#1D472E' }}>
                    Stakes Winners Comparison
                  </Typography>
                </Box>
                <Box className="SortByCommonStyle">
                  <Typography className="sortby" variant="h5">
                    Sort by
                  </Typography>
                  <CustomSelect
                  disablePortal
                    defaultValue={'Similarityscore'}
                    MenuProps={MenuProps}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    className="selectDropDownBox sort-recent"
                    onChange={sortStakesProgeny}
                    name={'Similarityscore'}
                  >
                    <MenuItem className="selectDropDownList" value="Horsename">
                      {toPascalCase('HORSE')}
                    </MenuItem> 
                    <MenuItem className="selectDropDownList" value="G1">
                      {toPascalCase('G1')}
                    </MenuItem>
                    <MenuItem className="selectDropDownList" value="G2">
                      {toPascalCase('G2')}
                    </MenuItem>
                    <MenuItem className="selectDropDownList" value="G3">
                      {toPascalCase('G3')}
                    </MenuItem>
                    <MenuItem className="selectDropDownList" value="Listed">
                      {toPascalCase('LISTED')}
                    </MenuItem>
                    <MenuItem className="selectDropDownList" value="Exactscore">
                      {toPascalCase('Exact score')}
                    </MenuItem>
                    <MenuItem className="selectDropDownList" value="Similarityscore">
                      {toPascalCase('Similarity score')}
                    </MenuItem>
                  </CustomSelect>
                </Box>
              </Stack>
            </Box>

            <Box className="StakesWinnersComparisionTable">
              <TableContainer component={Paper} className="DataList">
                <Table className="DataListTable" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Horse</TableCell>
                      <TableCell align="left">G1</TableCell>
                      <TableCell align="left">G2</TableCell>
                      <TableCell align="left">G3</TableCell>
                      <TableCell align="left">L</TableCell>
                      <TableCell align="left">
                        <em className="desk-stake">Exact Score</em>
                        <em className="mob-stake">E</em>
                      </TableCell>                      
                      <TableCell align="left">
                        <em className="desk-stake">Similarity Score</em>
                        <em className="mob-stake">S</em>
                      </TableCell>
                      <TableCell align="left">&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                    (SWCList?.length === 0) ?
                    <TableRow
                        key={"noData"}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                      <TableCell align="left" colSpan={7} sx={{'textAlign': 'center'}}>No Stakes Winners found!</TableCell>    
                      </TableRow>
                    :
                    (SWCList?.map((row: any) => (
                      <TableRow
                        key={row?.Horsename}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">
                          {toPascalCase(row?.Horsename)}{' '}
                          <span style={{ color: row?.sex == 'F' ? '#d5582a' : '#3139da' }}>
                            {row?.sex ? row?.sex : ''}
                          </span>
                        </TableCell>
                        <TableCell align="left">{row?.g1 ? row?.g1 : 0}</TableCell>
                        <TableCell align="left">{row?.g2 ? row?.g2 : 0}</TableCell>
                        <TableCell align="left">{row?.g3 ? row?.g3 : 0}</TableCell>
                        <TableCell align="left">{row?.g4 ? row?.g4 : 0}</TableCell>
                        <TableCell align="left">{row?.CSI ? Math.round(row?.ExactScore) : 0}</TableCell>
                        <TableCell align="left">{row?.CSI ? Math.round(row?.CSI) : 0}</TableCell>
                        <TableCell align="right">
                          <Button
                            type="button"
                            sx={{ marginRight: '20px' }}
                            className="arrowBtn"
                            onClick={() => handlePedigreeOverlap(row?.HorseId, row?.sex)}
                          >
                            <i className="icon-Chevron-right" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <PaginationSettings data={pageData} />
          </Container>
        </Box>
      </StyledEngineProvider>
    </>
  );
}

export default StakesWinnersComparision;
