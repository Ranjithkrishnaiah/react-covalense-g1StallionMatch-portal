import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const getStallionList = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchStallionList: builder.query<any, object>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.getSelectStallions, params)),
      providesTags: (result, error) => [{ type: 'getSelectStallions' }],
    }),
  }),
});

export const { useFetchStallionListQuery } = getStallionList;
