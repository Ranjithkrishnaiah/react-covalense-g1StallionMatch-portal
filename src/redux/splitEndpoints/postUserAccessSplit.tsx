import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithpostUserAccess = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postUserAccess: builder.mutation<any, any>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.inviteUserUrl+'/invite-stallion', '', 'POST', data, true),
    }),
  }),
});

export const { usePostUserAccessMutation } = apiWithpostUserAccess;