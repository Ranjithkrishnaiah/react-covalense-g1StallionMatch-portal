import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const popularStallions = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getPopularStallions: build.query<any, void>({
      query: () => prepareAPIQuery(api.baseUrl, api.popularStallionsUrl, '', true),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'popular-stallions' }],
    }),
  }),
});

export const { useGetPopularStallionsQuery } = popularStallions;
