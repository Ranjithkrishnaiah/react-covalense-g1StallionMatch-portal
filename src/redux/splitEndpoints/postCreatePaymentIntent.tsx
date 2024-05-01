import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const createPaymentIntent = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postToCreatePaymentIntent : build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.createPaymentIntentUrl, '', 'POST', data,true)),
    }),
  }),
});

export const { usePostToCreatePaymentIntentMutation } = createPaymentIntent;