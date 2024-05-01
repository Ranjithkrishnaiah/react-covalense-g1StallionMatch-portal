import { StyledEngineProvider } from '@mui/material';
import React from 'react';
import CustomMultiSelectTags from 'src/components/customMultiSelectTags/CustomMultiSelectTags';
import * as common from '../../../locales/en.json';

export default function StallionFilters(props: any) {
  type filtersType = typeof common;

  const placeholderType: filtersType = common;
  const advancedFilterPlaceholders = [
    placeholderType.common.YearToStud,
    placeholderType.common.colour,
  ];

  return (
    <>
      <StyledEngineProvider injectFirst>
        {advancedFilterPlaceholders.map((placeholder: string) => (
          <CustomMultiSelectTags placeholder={placeholder} key={placeholder} {...props} />
        ))}
      </StyledEngineProvider>
    </>
  );
}
