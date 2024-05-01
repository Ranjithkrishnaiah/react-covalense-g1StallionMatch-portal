import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { api } from 'src/api/apiPaths';

export const apiWithgetStallionNames = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getStallionNames: builder.query<any, object>({
      query: (params: any) =>
        prepareAPIQuery(api.baseUrl, api.farmsUrl + '/' + params.id + '/stallion-names', ''),
      providesTags: (result, error) => [{ type: 'stallionRoster' }],
    }),
  }),
});

export const { useGetStallionNamesQuery } = apiWithgetStallionNames;
