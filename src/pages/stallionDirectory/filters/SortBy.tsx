import React, { useEffect, useState } from 'react';
import * as common from '../../../locales/en.json';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { StyledEngineProvider } from '@mui/material';
import '../StallionDirectory.css';
import { Images } from 'src/assets/images';

function SortBy(props: any) {
  type filtersType = typeof common;
  const placeholderType: filtersType = common;
  const sortByOptions = [
    placeholderType.common.promoted,
    placeholderType.common.alphabetical,
    placeholderType.common.studFee,
    placeholderType.common.recentlyUpdated,
    placeholderType.common.availableNominations,
  ];
  const [sortByLocal, setSortByLocal] = useState<any>('');

  useEffect(() => {
    let value: any = (window.localStorage.getItem('storedFiltered')) || null;
    setSortByLocal(JSON.parse(value));
    // console.log(JSON.parse(value), 'JSON')
  }, [])

  useEffect(() => {
    // console.log(sortByLocal, 'sortByLocal')
    if (sortByLocal?.sortBy) {
      props.setSortBy(sortByLocal?.sortBy);
      setSort(sortByLocal?.sortBy);
      props.setClear(false);
      props.setPage(1);
      props.query.refetch();
      if (props.isSortBySelected === 0) {
        props.setIsSortBySelected(1);
        props.filterCounterhook.increment();
      }
    }
  }, [sortByLocal])

  // By default state variable is assigned the first option
  const [sort, setSort] = React.useState(
    props.clear || props.sortBy === null || props.sortBy === undefined
      ? sortByOptions[0]
      : props.sortBy
  );

  // If user clear the stallion filter, reset the state variable as the first option
  React.useEffect(() => {
    if (props.clear) {
      setSort(sortByOptions[0]);
    }
  }, [props]);

  // Upon selecting the sort by, update state varibale and refetch the Stallion search API call
  const handleChange = (e: any) => {
    props.setSortBy(e.target.value);
    setSort(e.target.value);
    props.setClear(false);
    props.setPage(1);
    props.query.refetch();
    if (props.isSortBySelected === 0) {
      props.setIsSortBySelected(1);
      props.filterCounterhook.increment();
    }
  };

  return (
    <div>
      <StyledEngineProvider injectFirst>
        <FormControl>
          <RadioGroup
            aria-labelledby="sort-by-options"
            defaultValue={sort}
            name="sort-by-filter"
            className="radio-global"
          >
            {sortByOptions.map((option: string) => (
              <FormControlLabel
                value={option}
                control={
                  <Radio
                    checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                    icon={<img src={Images.Radiounchecked} alt="checkbox" />}
                  />
                }
                label={option}
                key={option}
                checked={option == sort}
                onChange={(e) => handleChange(e)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </StyledEngineProvider>
    </div>
  );
}

export default SortBy;
