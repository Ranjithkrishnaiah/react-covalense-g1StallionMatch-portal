import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPatchAcceptInvitation = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchAcceptInvitation: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.acceptInvitationHash, '', 'PATCH', data, true),
      invalidatesTags: ['AcceptInvitation'],
    }),
  }),
});

export const { usePatchAcceptInvitationMutation } = apiWithPatchAcceptInvitation;
