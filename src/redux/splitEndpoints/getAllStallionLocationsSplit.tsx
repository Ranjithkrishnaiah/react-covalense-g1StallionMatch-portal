import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithgetAllStallionsLocationSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStallionLocations: build.query<any, any>({
      query: () => prepareAPIQuery(api.baseUrl, api.stallions + '/locations', ''),
      providesTags: (result, error) => [{ type: 'getAllStallionLocations' }],
    }),
  }),
});

export const { useGetAllStallionLocationsQuery } = apiWithgetAllStallionsLocationSplit;
