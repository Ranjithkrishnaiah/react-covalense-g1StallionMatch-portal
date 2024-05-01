import { Favorite } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithdeleteFromMyMares = splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteFromMyMares: build.mutation<any,Favorite>({
            query: obj => (prepareAPIMutation(api.baseUrl, api.maresTableUrl, '', 'DELETE', obj, true)),
            invalidatesTags: ['MyMares Table'],
        })
    })
});


export const { useDeleteFromMyMaresMutation } = apiWithdeleteFromMyMares;