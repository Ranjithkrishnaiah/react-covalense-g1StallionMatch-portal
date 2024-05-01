import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithgetAllStallionsSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStallionsSplit: build.query<any, any>({
      query: (params) => prepareAPIQuery(api.baseUrl, api.stallions + '/get-all', params),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'getAllstallions' }],
    }),
  }),
});

export const { useGetAllStallionsSplitQuery } = apiWithgetAllStallionsSplit;
