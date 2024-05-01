import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithgetStallionSelection = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionSelection: build.query<any, any>({
      query: (params) => prepareAPIQuery(api.baseUrl, api.stallions, params),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'stallionSelection' }],
    }),
  }),
});

export const { useGetStallionSelectionQuery } = apiWithgetStallionSelection;
