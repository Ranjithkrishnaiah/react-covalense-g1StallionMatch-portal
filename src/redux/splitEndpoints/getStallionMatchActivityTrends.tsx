import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const getStallionMatchActivityTrends = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionMatchActivityTrends: build.query<any, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.stallionMatchedActivityTrends,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Stallions Matched Activity trends' }],
    }),
  }),
});

export const { useGetStallionMatchActivityTrendsQuery } = getStallionMatchActivityTrends;