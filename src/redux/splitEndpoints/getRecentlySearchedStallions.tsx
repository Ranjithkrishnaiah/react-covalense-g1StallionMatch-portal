import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const getRecentlySearchedStallions = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getRecentlySearchedStallions: build.query<any, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.recentStallionSearchesUrl,params,true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Recent Stallion Searches' }],
    }),
  }),
});

export const { useGetRecentlySearchedStallionsQuery } = getRecentlySearchedStallions;