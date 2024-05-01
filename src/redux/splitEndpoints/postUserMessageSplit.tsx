import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPostUserMessage = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postUserMessage: builder.mutation<any, any>({
      query: (data) => prepareAPIMutation(api.baseUrl, api.messagesUrl, '', 'POST', data, true),
      invalidatesTags: [
        'PostMessageFarmList',
        'AllMessages',
        'MessageFarmList',
        'getEnquiredFarms',
      ],
    }),
    patchUserMessage: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.messagesMediaUrl, '', 'PATCH', data, true),
      invalidatesTags: [
        'PostMessageFarmList',
        'AllMessages',
        'MessageFarmList',
        'getEnquiredFarms',
      ],
    }),
  }),
})

export const { usePostUserMessageMutation, usePatchUserMessageMutation } = apiWithPostUserMessage;
