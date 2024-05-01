import { Favorite } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithPostMare = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToMyMaresList: build.mutation<any, Favorite>({
      query: (mareDetails) => (prepareAPIMutation(api.baseUrl, api.maresTableUrl, '', 'POST', mareDetails)),
    }),
  }),
});

export const { useAddToMyMaresListMutation } = apiWithPostMare;