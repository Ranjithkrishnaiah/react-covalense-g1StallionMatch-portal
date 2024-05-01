import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type NewPasswordType = {
  hash: string;
  password: string;
}

export const apiWithResetPassword = splitApi.injectEndpoints({
  endpoints: (build) => ({
    resetPassword: build.mutation<any, NewPasswordType>({
      query: (newPassword) => 
      (prepareAPIMutation(api.baseUrl, api.resetPasswordUrl, '', 'POST', newPassword)),
    }),
  }),
});

export const { useResetPasswordMutation } = apiWithResetPassword;
