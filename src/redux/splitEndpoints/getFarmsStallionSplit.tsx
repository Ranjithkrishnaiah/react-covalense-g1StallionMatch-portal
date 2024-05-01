import { FavoriteList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithGetFarmsStallion = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmStallions: build.query<FavoriteList, object>({
      query: (farmId) => prepareAPIQuery(api.baseUrl, api.farmStallionsUrl, farmId),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'FarmStallions' }],
    }),
    autosearchFarmStallions: build.query<any, any>({
      query: () => prepareAPIQuery(api.baseUrl, api.searchFarmStallions, '', true),
    }),
  }),
});

export const { useGetFarmStallionsQuery, useAutosearchFarmStallionsQuery } =
  apiWithGetFarmsStallion;
