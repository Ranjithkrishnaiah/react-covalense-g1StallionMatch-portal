import { StallionRoster } from 'src/@types/StallionRoster';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { api } from 'src/api/apiPaths';
import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';

export const apiWithgetStallionsPromotedByFarmId = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getStallionsPromotedByFarmId: builder.query<any, object>({
      query: (params: any) =>
        prepareAPIQuery(api.baseUrl, api.farmsUrl + '/' + params.id + '/promoted-stallions', '', true),
      providesTags: (result, error) => [{ type: 'stallionsPromotedByFarmId' }],
    }),
  }),
});

export const { useGetStallionsPromotedByFarmIdQuery } = apiWithgetStallionsPromotedByFarmId;
