import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';
import { QueryParams } from './getFavFarmsSplit';
export const RecentSearches = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getRecentSearchesSlider: build.query<any[], QueryParams>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.recentSearchesSliderUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Recent Searches' }],
    }),
  }),
});

export const { useGetRecentSearchesSliderQuery } = RecentSearches;