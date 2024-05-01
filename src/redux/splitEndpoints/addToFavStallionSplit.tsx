import { FavoriteStallion } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithAddToStallion = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToStallions: build.mutation<any, FavoriteStallion>({
      query: (stallionDetails) => (prepareAPIMutation(api.baseUrl, api.favouriteStallionsUrl, '', 'POST', stallionDetails, true)),
      invalidatesTags: ['Favorite Stallion Table', 'favouriteStallions']
    }),
  }),
});

export const { useAddToStallionsMutation } = apiWithAddToStallion;
