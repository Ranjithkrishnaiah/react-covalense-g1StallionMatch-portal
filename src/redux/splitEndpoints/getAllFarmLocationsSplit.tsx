import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithgetAllFarmsLocationSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getAllFarmLocations: build.query<any, any>({
      query: () => prepareAPIQuery(api.baseUrl, api.farmsUrl + '/locations', ''),
      providesTags: (result, error) => [{ type: 'getAllFarmLocations' }],
    }),
  }),
});

export const { useGetAllFarmLocationsQuery } = apiWithgetAllFarmsLocationSplit;
