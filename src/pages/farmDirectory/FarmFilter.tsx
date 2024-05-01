import * as common from '../../locales/en.json';
import SortFilter from './filters/SortBy';
import FarmFilters from './filters/FarmFilters';
import StallionFilter from './filters/StallionFilters';
import FeeRangeFilter from './filters/FeeRange';
import PedigreeFilter from './filters/Pedigree';
import { makeObjectArrayFromArrays } from 'src/utils/customFunctions';
import { Box, Button, StyledEngineProvider } from '@mui/material';
import CustomAccordion from '../../components/customAccordion/CustomAccordion';
import CustomAccordionSummary from '../../components/customAccordion/CustomAccordionSummary';
import CustomAccordionDetails from '../../components/customAccordion/CustomAccordionDetails';
import '../stallionDirectory/StallionDirectory.css';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

type filtersType = typeof common;

const filtersParams: filtersType = common;
const filterTitles = [
  filtersParams.common.sortBy,
  filtersParams.common.farmFilters,
  filtersParams.common.stallionFilters,
  filtersParams.common.feeRange,
  filtersParams.common.pedigree,
];
const componentArray = [SortFilter, FarmFilters, StallionFilter, FeeRangeFilter, PedigreeFilter]; //PedigreeFilter

export default function FarmFilter(props: any) {
  
  const ObjectArray = makeObjectArrayFromArrays(filterTitles, componentArray); 
  const totalRecords = props.farmcount; 
  return (
    <div>
      <StyledEngineProvider injectFirst>
      <Box className='filter-drawer-left'>
        <Box className="StallionCount"> {totalRecords} Farms</Box>
        <Button className="clearBtn"  onClick = {props.clearAll}>Clear all</Button> 
        {ObjectArray?.map((obj) => (
          <CustomAccordion key={Object.keys(obj)[0]} defaultExpanded={true} className="filterMenu">
            <CustomAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon />}>
              {Object.keys(obj)[0]}
            </CustomAccordionSummary>
            <CustomAccordionDetails sx={{cursor:"pointer"}}>{Object.values(obj)[0](props)}</CustomAccordionDetails>
          </CustomAccordion>
        ))}
        </Box>
      </StyledEngineProvider>
    </div>
  );
}
