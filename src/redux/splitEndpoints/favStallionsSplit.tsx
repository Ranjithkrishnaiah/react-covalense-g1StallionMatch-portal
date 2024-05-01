import { FavoriteStallion } from 'src/@types/FavoriteStallion';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery, prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithFavStallions = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    favouriteStallions: builder.query<FavoriteStallion, object>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.favouriteStallionsUrl, params, true)),
      providesTags: (result, error) => [{ type: 'favouriteStallions' }],
    }),
    addFavouriteStallion: builder.mutation<{}, any>({
      query: (favouriteStallionPayload) => (prepareAPIMutation(api.baseUrl, api.favouriteStallionsUrl, '', 'POST', favouriteStallionPayload, true)),      
      invalidatesTags: ['favouriteStallions'],
    }),
    removeFavouriteStallion: builder.mutation<{}, any>({
      query: (favouriteStallionPayload) => (prepareAPIMutation(api.baseUrl, api.favouriteStallionsUrl, '', 'DELETE', favouriteStallionPayload, true)),      
      invalidatesTags: ['favouriteStallions'],
    }),
  }),
});

export const { useFavouriteStallionsQuery, useAddFavouriteStallionMutation, useRemoveFavouriteStallionMutation } = apiWithFavStallions;
