import { FarmUser } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const removeUser= splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteUser: build.mutation<any,FarmUser>({
            query: obj => (prepareAPIMutation(api.baseUrl, api.deleteFarmUserUrl, '', 'DELETE', obj, true)),
            invalidatesTags: ['InviteUsers Table'],
        })
    })
});

export const { useDeleteUserMutation } = removeUser;