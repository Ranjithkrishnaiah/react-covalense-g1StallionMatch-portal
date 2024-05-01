import { FavoriteDamsire } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithdeleteFromFavDamsires= splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteFromFavDamsires: build.mutation<any,FavoriteDamsire>({
            query: obj => (prepareAPIMutation(api.baseUrl, api.favoriteDamsiresUrl, '', 'DELETE', obj, true)),
            invalidatesTags: ['FavoriteDamsires Table'],
        })
    })
});

export const { useDeleteFromFavDamsiresMutation } = apiWithdeleteFromFavDamsires;