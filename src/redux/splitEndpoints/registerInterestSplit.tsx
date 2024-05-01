import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithRegisterInterest = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    registerInterest: builder.mutation<any, object>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.registerInterest, '', 'POST', data)),
    }),
  }),
});

export const { useRegisterInterestMutation } = apiWithRegisterInterest;
