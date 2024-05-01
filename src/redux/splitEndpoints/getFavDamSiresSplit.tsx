import { FavoriteDamsireTable } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";
import { QueryParams } from './getFavFarmsSplit';
export const apiWithGetDamSires = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFavoriteDamsires: build.query<FavoriteDamsireTable, QueryParams>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.favoriteDamsiresUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'FavoriteDamsires Table' }],
    }),
  }),
});

export const { useGetFavoriteDamsiresQuery } = apiWithGetDamSires;
