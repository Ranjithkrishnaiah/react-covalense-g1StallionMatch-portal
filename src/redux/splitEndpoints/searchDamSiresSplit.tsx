import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithSearchDamSires = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    searchDamSires: builder.query<any, object>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.searchDamSiresUrl, params)),
      providesTags: (result, error) => [{ type: 'searchDamSires' }],
    }),
  }),
});

export const { useSearchDamSiresQuery } = apiWithSearchDamSires;
