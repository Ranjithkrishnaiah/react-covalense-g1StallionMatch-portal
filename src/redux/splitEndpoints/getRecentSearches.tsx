import { RecentSearchesOutput } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';
import { QueryParams } from './getFavFarmsSplit';
export const RecentSearches = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getRecentSearches: build.query<RecentSearchesOutput[], QueryParams>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.recentSearchesUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Recent Searches' }],
    }),
  }),
});

export const { useGetRecentSearchesQuery } = RecentSearches;