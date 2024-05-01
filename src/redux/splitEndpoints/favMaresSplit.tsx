import { FavouriteMares } from 'src/@types/FavoriteMares';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery, prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithFavMares = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    favouriteMares: builder.query<FavouriteMares, object>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.favouriteMaresUrl, params, true)),      
      providesTags: (result, error) => [{ type: 'favouriteMares' }],
    }),
    addFavouriteMare: builder.mutation<{}, any>({
      query: (favouriteMarePayload) => (prepareAPIMutation(api.baseUrl, api.favouriteMaresUrl, '', 'POST', favouriteMarePayload, true)),
      invalidatesTags: ['favouriteMares'],
    }),
  }),
});

export const { useFavouriteMaresQuery, useAddFavouriteMareMutation } = apiWithFavMares;
