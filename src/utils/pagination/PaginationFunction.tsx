import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import Stack from '@mui/material/Stack';
import './Pagination.css';
import { StyledEngineProvider } from '@mui/material';

export interface Pagination {
  itemCount: number;
  limit: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

type PaginationProps = {
  data: Pagination;
};
export default function PaginationSettings(props: any) {
  const data = props?.data?.pagination || props.data;
  const totalRecords = data?.itemCount ? data?.itemCount : 0;
  const pageLimit = data?.limit ? data?.limit : 0;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageLimit) : 1;

  React.useEffect(() => {
    if (props?.data?.clear) {
      props?.data?.setPage(1);
    }
  }, [props?.data]);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    props?.data?.setPage(value);
    if (props?.data?.setClear) {
      props?.data?.setClear(false);
    }
    props?.data?.query.refetch();
  };

  return (
    <StyledEngineProvider injectFirst>
      {data?.itemCount > 0 ? (
        <Stack spacing={16} mt={5} className="SDpagenation">
          <Pagination
            count={totalPages}
            variant="outlined"
            shape="rounded"
            defaultPage={props.data.page}
            page={props.data.page}
            sx={{ justifyContent: 'center', display: 'flex' }}
            onChange={handleChange}
          boundaryCount={(window.innerWidth > 767 ? 1 : 1) || (window.innerWidth > 360 ? 0 : 1)}
          siblingCount={(window.innerWidth > 767 ? 1 : 0) || (window.innerWidth > 360 ? 0 : -2)}
            renderItem={(item) => (
              <PaginationItem
                components={{
                  previous: ArrowBackIosNewRoundedIcon,
                  next: ArrowForwardIosRoundedIcon,
                }}
                {...item}
              />
            )}
          />
        </Stack>
      ) : (
        ''
      )}
    </StyledEngineProvider>
  );
}
