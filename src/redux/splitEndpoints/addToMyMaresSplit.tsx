import { Favorite } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithAddToMyMares = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToMyMares: build.mutation<any, Favorite>({
      query: (mareDetails) => (prepareAPIMutation(api.baseUrl, api.maresTableUrl, '', 'POST', mareDetails, true)),
      invalidatesTags: ['MyMares Table']
    }),
  }),
});

export const { useAddToMyMaresMutation } = apiWithAddToMyMares;
