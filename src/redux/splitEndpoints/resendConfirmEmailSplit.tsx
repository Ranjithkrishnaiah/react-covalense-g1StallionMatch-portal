import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type ValidationResponse = {
  isValid: boolean;
  //   errors?:{hash: string}
};


export const resendConfirmEmail = splitApi.injectEndpoints({
  endpoints: (build) => ({
    ResendConfirmEmail: build.mutation<ValidationResponse, string>({
      query: (param) => prepareAPIMutation(api.baseUrl, api.resendConfirmEmailUrl, '', 'POST',param = "check", true),
    }),
  }),
});

export const { useResendConfirmEmailMutation } = resendConfirmEmail;
