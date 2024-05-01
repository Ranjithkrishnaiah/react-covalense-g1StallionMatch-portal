import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithGetHomePageStats = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getHomePageStats: build.query<any, void>({
      query: () => (prepareAPIQuery(api.mockBaseUrl, api.homepageStats, '')),
      providesTags: (result, error) => [{ type: 'homepageStats' }],
    }),
  }),
});

export const { useGetHomePageStatsQuery } = apiWithGetHomePageStats;
