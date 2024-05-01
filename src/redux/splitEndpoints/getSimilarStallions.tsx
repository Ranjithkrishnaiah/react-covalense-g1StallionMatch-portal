import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const similarStallions = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getSimilarStallions: build.query<any, void>({
      query: () => prepareAPIQuery(api.baseUrl, api.similarStallionsUrl, '', true),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'similar-stallions' }],
    }),
  }),
});

export const { useGetSimilarStallionsQuery } = similarStallions;