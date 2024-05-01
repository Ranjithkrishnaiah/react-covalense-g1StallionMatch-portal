import { FavoriteStallion } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithdeleteFromFavStallions= splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteFromFavStallions: build.mutation<any,FavoriteStallion>({
            query: obj => (prepareAPIMutation(api.baseUrl, api.favouriteStallionsUrl, '', 'DELETE', obj, true)),
            invalidatesTags: ['Favorite Stallion Table', 'favouriteStallions'],
        })
    })
});

export const { useDeleteFromFavStallionsMutation } = apiWithdeleteFromFavStallions;