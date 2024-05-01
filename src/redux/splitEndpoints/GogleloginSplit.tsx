import { GoogleLoginSchema } from 'src/@types/login';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithGoogleLogin = splitApi.injectEndpoints({
  endpoints: (build) => ({
    GoogleLogin: build.mutation<any, GoogleLoginSchema>({
      query: (loginDetails) => (prepareAPIMutation(api.baseUrl, api.googleLoginUrl, '', 'POST', loginDetails)),
    }),
  }),
});

export const { useGoogleLoginMutation } = apiWithGoogleLogin;
