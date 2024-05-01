import { FavoriteDamsire } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithAddToDamSires = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToDamsires: build.mutation<any, FavoriteDamsire>({
      query: (damsireDetails) => (
        prepareAPIMutation(api.baseUrl, api.favoriteDamsiresUrl, '', 'POST', damsireDetails, true)
        ),
        invalidatesTags: ['FavoriteDamsires Table']
    }),
  }),
});

export const { useAddToDamsiresMutation } = apiWithAddToDamSires;
