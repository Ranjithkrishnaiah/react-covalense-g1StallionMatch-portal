import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation, prepareAPIQuery } from "src/utils/customFunctions";

export const createPaypalPaymentIntent = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postToCreatePaypalPaymentIntent: build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.createPaypalPaymentIntentUrl, '', 'POST', data, true)),
    }),
    postToCreateStripeNewCard: build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, '/order-transactions/create-stripe-charge', '', 'POST', data, true)),
    }),
    postToCreateStripeSavedCard: build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, '/order-transactions/create-payment-intent', '', 'POST', data, true)),
    }),
    postToTaxDetails: build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, '/order-transactions/estimate-tax', '', 'POST', data, true)),
    })
  }),
});

export const {
  usePostToCreatePaypalPaymentIntentMutation,
  usePostToCreateStripeNewCardMutation,
  usePostToCreateStripeSavedCardMutation,
  usePostToTaxDetailsMutation
} = createPaypalPaymentIntent