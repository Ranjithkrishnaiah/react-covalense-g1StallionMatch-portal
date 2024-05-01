import { FavoriteFarm } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithAddToFavFarms = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToFarms: build.mutation<any, FavoriteFarm>({
      query: (farmDetails) => (prepareAPIMutation(api.baseUrl, api.favoriteFarmsUrl, '', 'POST', farmDetails, true)),
      invalidatesTags: ['FavoriteFarms Table', 'Farm Media'],
    }),
  }),
});

export const { useAddToFarmsMutation } = apiWithAddToFavFarms;
