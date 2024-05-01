import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";
type EmailInput = {
  email: string;
}
export const apiWithRegisterInterestEmail = splitApi.injectEndpoints({
  endpoints: (build) => ({
    registerInterestEmail: build.query<any, EmailInput>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.registerInterestEmailValid, data)),
      providesTags: (result, error) => [{ type: 'registerInterestEmail' }],
    }),
  }),
});

export const { useRegisterInterestEmailQuery } = apiWithRegisterInterestEmail;
