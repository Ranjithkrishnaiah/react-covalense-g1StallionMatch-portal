import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const paypalSuccess = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postToPaypalSuccess : build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.paypalSuccessUrl, '', 'POST', data,true)),
    }),
  }),
});

export const { usePostToPaypalSuccessMutation } = paypalSuccess