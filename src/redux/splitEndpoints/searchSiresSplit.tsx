import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithSearchSires = splitApi.injectEndpoints({
  endpoints: (build) => ({
    searchSires: build.query<any, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.searchSiresUrl, '')),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'SearchSires' }],
    }),
  }),
});

export const { useSearchSiresQuery } = apiWithSearchSires;
