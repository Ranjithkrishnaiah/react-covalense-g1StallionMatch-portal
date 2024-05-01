import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  StyledEngineProvider,
} from '@mui/material';
import React from 'react';
import * as common from '../../../locales/en.json';
import { Images } from 'src/assets/images';

function SortBy(props: any) {
  type filtersType = typeof common;
  const placeholderType: filtersType = common;
  const sortByOptions = [
    placeholderType.common.promoted,
    placeholderType.common.alphabetical,
    placeholderType.common.stallionCount,
    placeholderType.common.recentlyUpdated,
  ];
  const [sort, setSort] = React.useState(
    props.clear || props.sortBy === null || props.sortBy === undefined
      ? sortByOptions[0]
      : props.sortBy
  );
  const [sortByLocal, setSortByLocal] = React.useState<any>('');
  React.useEffect(() => {
    let value: any = (window.localStorage.getItem('storedFarmFiltered')) || null;
    setSortByLocal(JSON.parse(value));
  }, [])

  
  React.useEffect(() => {
    // console.log(sortByLocal, 'sortByLocal')
    if (sortByLocal?.sortBy) {      
      props.setSortBy(sortByLocal?.sortBy);
      setSort(sortByLocal?.sortBy);
      props.setClear(false);
      props.setPage(1);
      props.query.refetch();
      if (props.sortBy === 0) {
        props.setIsSortBySelected(1);
        props.filterCounterhook.increment();
      }
    }
  }, [sortByLocal])

  React.useEffect(() => {
    if (props.clear) {
      setSort(sortByOptions[0]);
    }
  }, [props]);

  const handleChange = (e: any) => {
    props.setSortBy(e.target.value);
    setSort(e.target.value);
    props.setClear(false);
    props?.setPage(1);
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
            defaultValue={sortByOptions[0]}
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
