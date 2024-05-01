import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithForgotPassword = splitApi.injectEndpoints({
  endpoints: (build) => ({
    forgotPassword: build.mutation<void, string>({
      query: (email: string) => (prepareAPIMutation(api.baseUrl, api.forgotPasswordUrl, '', 'POST', email)),      
    }),
  }),
});

export const { useForgotPasswordMutation } = apiWithForgotPassword;
