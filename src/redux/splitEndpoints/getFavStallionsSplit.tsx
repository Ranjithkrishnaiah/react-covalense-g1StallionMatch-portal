import { FavoriteList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithGetFavStallionsSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFavoriteStallions: build.query<FavoriteList, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.favouriteStallionsUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'FavoriteStallions' }],
    }),
  }),
});

export const { useGetFavoriteStallionsQuery } = apiWithGetFavStallionsSplit;
