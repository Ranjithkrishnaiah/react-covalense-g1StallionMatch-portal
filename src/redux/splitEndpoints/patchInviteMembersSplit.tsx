import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithpatchInviteMembers = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchInviteMembers: builder.mutation<any, any>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.stallionPromotion, '', 'PATCH', data, true),
    }),
  }),
});

export const { usePatchInviteMembersMutation } = apiWithpatchInviteMembers;