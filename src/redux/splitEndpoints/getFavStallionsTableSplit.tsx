import { FavoriteStallionList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';
import { QueryParams } from './getFavFarmsSplit';
export const FavStallionsTable = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFavStallionsTable: build.query<FavoriteStallionList, QueryParams>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.favouriteStallionsTableUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Favorite Stallion Table' }],
    }),
  }),
});

export const { useGetFavStallionsTableQuery } = FavStallionsTable;
