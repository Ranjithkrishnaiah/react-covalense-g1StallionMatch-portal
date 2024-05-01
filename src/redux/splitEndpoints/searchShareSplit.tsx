import { api } from '../../api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareHeaders, prepareAPIQuery, prepareAPIMutation } from "src/utils/customFunctions";


export const apiWithSearchShare = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postEmailShare: builder.mutation<any, any>({
      query: (emailPayload) => (prepareAPIMutation(api.baseUrl, api.searchShareWithoutAuthUrl, '', 'POST', emailPayload, false)),
    }),
    postEmailShareAuth: builder.mutation<any, any>({
      query: (emailPayload) => (prepareAPIMutation(api.baseUrl, api.searchShareAuthUrl, '', 'POST', emailPayload, true)),
    }),
  }),
});

export const { usePostEmailShareAuthMutation, usePostEmailShareMutation } = apiWithSearchShare;
