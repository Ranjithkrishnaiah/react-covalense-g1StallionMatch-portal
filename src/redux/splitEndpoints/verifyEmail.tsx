import { api } from 'src/api/apiPaths';
import { prepareAPIMutation, prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type ValidationResponse = {
  isValid: boolean;
//   errors?:{hash: string}
};

type Hash = {
  hash: string;
};

export const verifyEmail = splitApi.injectEndpoints({
  endpoints: (build) => ({
    VerifyEmail: build.mutation<ValidationResponse, Hash>({
      query: (hash) => prepareAPIMutation(api.baseUrl, api.VerifyEmailUrl, '', 'POST', hash),
    }),
    getVerifedEmail: build.query<any, any>({
      query: (hashKey: any) => prepareAPIQuery(api.baseUrl, api.VerifyEmailUrl +"/"+ hashKey, ''),
    }),
  }),
});

export const { useVerifyEmailMutation, useGetVerifedEmailQuery } = verifyEmail;
