import { useEffect } from 'react';
import CustomAccordion from '../../components/customAccordion/CustomAccordion';
import CustomAccordionSummary from '../../components/customAccordion/CustomAccordionSummary';
import CustomAccordionDetails from '../../components/customAccordion/CustomAccordionDetails';
import SortFilter from './filters/SortBy';
import AdvancedFilter from './filters/AdvancedFilters';
import FeeRangeFilter from './filters/FeeRange';
import PedigreeFilter from './filters/Pedigree';
import * as common from '../../locales/en.json';
import { makeObjectArrayFromArrays } from 'src/utils/customFunctions';
import "./StallionDirectory.css";
import { Box, Button, StyledEngineProvider } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

type filtersType = typeof common;

const filtersParams: filtersType = common;
const filterTitles = [
  filtersParams.common.sortBy,
  filtersParams.common.advancedFilters,
  filtersParams.common.feeRange,
  filtersParams.common.pedigree,
];
const componentArray = [SortFilter, AdvancedFilter, FeeRangeFilter, PedigreeFilter]; //PedigreeFilter
function StallionFilter(props: any) {
  const ObjectArray = makeObjectArrayFromArrays(filterTitles, componentArray);
  const totalRecords = props.stallioncount;
  return (
    <div>
      <StyledEngineProvider injectFirst>
        <Box className="filter-drawer-left">
          <Box className="StallionCount"> {totalRecords} Stallions</Box>
          <Button className="clearBtn" onClick={props.clearAll}>
            Clear all
          </Button>
          {ObjectArray?.map((filterObject) => (
            <CustomAccordion
              key={Object.keys(filterObject)[0]}
              defaultExpanded={true}
              className="filterMenu"
            >
              <CustomAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon/>}>
                {Object.keys(filterObject)[0]}
              </CustomAccordionSummary>
              <CustomAccordionDetails sx={{cursor:"pointer"}}>{Object.values(filterObject)[0](props)}</CustomAccordionDetails>
            </CustomAccordion>
          ))}
        </Box>
      </StyledEngineProvider>
    </div>
  );
}

export default StallionFilter;
