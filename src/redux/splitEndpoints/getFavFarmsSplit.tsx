import { FavoriteFarmTable } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export type QueryParams = {
  order: string;
  page: number;
  limit: number;
}
export const apiWithGetFavFarms = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFavoriteFarms: build.query<FavoriteFarmTable, QueryParams>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.favoriteFarmsUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'FavoriteFarms Table' }],
    }),
  }),
});

export const { useGetFavoriteFarmsQuery } = apiWithGetFavFarms;
