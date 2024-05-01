import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const paypalCancel = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postToPaypalCancel : build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.paypalCancelUrl, '', 'POST', data,true)),
    }),
  }),
});

export const { usePostToPaypalCancelMutation } = paypalCancel