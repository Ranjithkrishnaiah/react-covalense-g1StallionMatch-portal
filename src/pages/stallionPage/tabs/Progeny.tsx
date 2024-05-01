import {
  Box,
  Container,
  MenuItem,
  Pagination,
  Stack,
  StyledEngineProvider,
  Typography,
} from '@mui/material';
import PaginationSettings from 'src/utils/pagination/PaginationFunction';
import DataTable from '../../../components/Datatable/DataTable';
import { Constants } from '../../../constants';
import { useGetStakesProgenyQuery } from 'src/redux/splitEndpoints/getStakesProgeny';
import { Spinner } from 'src/components/Spinner';
import 'src/utils/pagination/Pagination.css';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import '../StallionPage.css';
import { toPascalCase } from 'src/utils/customFunctions';
import { transformResponse } from 'src/utils/FunctionHeap';
import { useEffect, useState } from 'react';

type ProgenyProps = {
  stallionId: string;
};
function Progeny({ stallionId }: ProgenyProps) {
  const { progenyTableProps } = Constants.StallionPageConstants;
  const [transformedStakesProgenyData, setTransformedStakesProgenyData] = useState<any[]>([]);
  const [page, setPage] = useState<any>(1);
  const [sortBy, setSortBy] = useState<any>('Horsename');
  const params = {
    stallionId,
    page,
    sortBy,
  };

  const {
    data: stakesProgeny,
    isLoading,
    isSuccess: isStakesProgenySuccess,
  } = useGetStakesProgenyQuery(params);

  let pageData: any = null;
  if (stakesProgeny) {
    pageData = {
      page,
      setPage,
      query: stakesProgeny,
      pagination: stakesProgeny?.meta,
    };
  }
  useEffect(() => {
    if (stakesProgeny?.data) {
      if (isStakesProgenySuccess && stakesProgeny?.data?.length > 0) {
        const transformedResponse = transformResponse(stakesProgeny?.data, 'STAKES-PROGENY');
        setTransformedStakesProgenyData(transformedResponse);
      }
    }
  }, [stakesProgeny, isStakesProgenySuccess]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginLeft: '-0.5px',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };
  const sortStakesProgeny = (event: any) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      {transformedStakesProgenyData.length > 0 ? (
        <StyledEngineProvider injectFirst>
          <Box py={5} className="StakesProgenyWrapper">
            <Container>
              <Stack direction={{ lg: 'row', sm: 'row', xs: 'column' }}>
                <Box flexGrow={1}>
                  <Typography variant="h3" sx={{ color: '#1D472E' }}>
                    Stakes Progeny
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" pr={1}>
                    Sort by
                  </Typography>
                  <CustomSelect
                    defaultValue={'Horsename'}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    className="selectDropDownBox sort-recent"
                    MenuProps={MenuProps}
                    onChange={sortStakesProgeny}
                  >
                    <MenuItem className="selectDropDownList" value="Horsename">
                      {toPascalCase('HORSE')}
                    </MenuItem>
                    <MenuItem className="selectDropDownList" value="Yob">
                      {toPascalCase('YOB')}
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
                  </CustomSelect>
                </Box>
              </Stack>
            </Container>
            <Box className="StakesProgenyTable" mt={4}>
              {transformedStakesProgenyData.length > 0 && (
                <DataTable {...progenyTableProps} data={transformedStakesProgenyData} />
              )}
            </Box>
            <PaginationSettings data={pageData} />
          </Box>
        </StyledEngineProvider>
      ) : (
        <StyledEngineProvider injectFirst>
          <Box py={0} className="StakesProgenyWrapper">
            <Container>
              <Typography variant="h3" sx={{ color: '#1D472E' }}>
                Stakes Progeny
              </Typography>
            </Container>
            <Stack className="StakesProgenyTable" mt={2}>
            <Box className='smp-no-data'>
                <Typography variant='h6'>No Progeny Found!</Typography>
              </Box>
            </Stack>
          </Box>
        </StyledEngineProvider>
      )}
    </>
  );
}

export default Progeny;
