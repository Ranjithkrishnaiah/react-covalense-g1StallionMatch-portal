import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";
import { InviteUserSchema, CheckValidityInput } from '../../@types/inviteUser';

export const apiWithVerifyUserInvite = splitApi.injectEndpoints({
    endpoints: (build) =>({
        verifyUserInvite: build.mutation<InviteUserSchema, CheckValidityInput>({
            query: userDetails => prepareAPIMutation(api.baseUrl, api.validateInviteUserLinkUrl, '', 'POST', userDetails),
            invalidatesTags: (result, error) => [{ type: 'FarmUsersList' }]
        }),
        acceptFarmInvitation: build.mutation<any, any>({
            query: userDetails => prepareAPIMutation(api.baseUrl, api.acceptFarmInvitation, '', 'POST', userDetails,true),
        }),

    })
})

export const { useVerifyUserInviteMutation ,useAcceptFarmInvitationMutation} = apiWithVerifyUserInvite;