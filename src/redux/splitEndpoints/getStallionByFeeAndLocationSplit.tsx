import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithGetStallionByFeeAndLocation = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionByFeeAndLocation: build.query<any, void>({
      query: (params: any) =>  (prepareAPIQuery(api.baseUrl, api.stallionDetailsURL+'/search-in-fee-range', params,true)),
      keepUnusedDataFor: 0,
      // providesTags: (result, error) => [{ type: 'stallionDetails' }],
    }),
  }),
});

export const { useGetStallionByFeeAndLocationQuery } = apiWithGetStallionByFeeAndLocation;