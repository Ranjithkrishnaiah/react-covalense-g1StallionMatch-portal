import React from 'react';
import * as common from '../../../locales/en.json';
import { StyledEngineProvider } from '@mui/material';
import CustomCountryStateDropdown from 'src/components/countryStateDropdown/CustomCountryStateDropdown';
import CustomMultiSelectTags from 'src/components/customMultiSelectTags/CustomMultiSelectTags';
function AdvancedFilters(props: any) {
  type filtersType = typeof common;
  const placeholderType: filtersType = common;
  const advancedFilterPlaceholders = [
    placeholderType.common.farm,
    placeholderType.common.YearToStud,
    placeholderType.common.colour,
  ];
  
  return (
    <>
      <StyledEngineProvider injectFirst>
        <CustomCountryStateDropdown {...props} />
        {advancedFilterPlaceholders.map((placeholder: string) => (
          <div key={placeholder}>
            <CustomMultiSelectTags placeholder={placeholder} {...props} />
          </div>
        ))}
      </StyledEngineProvider>
    </>
  );
}

export default AdvancedFilters;
