import { InviteUserSchema } from '../../forms/InviteUser'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithinviteUser = splitApi.injectEndpoints({
    endpoints: (build) =>({
        inviteUser: build.mutation<any,any>({
            query: userDetails => (prepareAPIMutation(api.baseUrl, api.inviteUserUrl, '', 'POST', userDetails, true)),
            invalidatesTags: ['InviteUsers Table']
        })
    })
});

export const { useInviteUserMutation } = apiWithinviteUser;