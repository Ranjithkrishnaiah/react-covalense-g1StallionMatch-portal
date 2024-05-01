import { LoginSchema } from 'src/@types/login';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithLogin = splitApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, LoginSchema>({
      query: (loginDetails) => (prepareAPIMutation(api.baseUrl, api.loginUrl, '', 'POST', loginDetails)),
    }),
  }),
});

export const { useLoginMutation } = apiWithLogin;
