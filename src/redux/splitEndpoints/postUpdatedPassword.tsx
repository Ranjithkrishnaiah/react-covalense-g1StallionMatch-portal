import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

type UpdatedPassword = {
    password: string;
  }
export const changePassword = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation<any, UpdatedPassword>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.authUpdatePasswordUrl, '', 'PATCH', data, true),
    }),
  }),
});

export const { useUpdatePasswordMutation } = changePassword;