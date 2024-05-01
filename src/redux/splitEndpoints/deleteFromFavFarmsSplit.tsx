import { FavoriteFarm } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithdeleteFromFavFarms = splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteFromFavFarms: build.mutation<any,FavoriteFarm>({
            query: obj => (prepareAPIMutation(api.baseUrl, api.favoriteFarmsUrl, '', 'DELETE', obj, true)),
            invalidatesTags: ['FavoriteFarms Table', 'Farm Media'],
        })
    })
});

export const { useDeleteFromFavFarmsMutation } = apiWithdeleteFromFavFarms;