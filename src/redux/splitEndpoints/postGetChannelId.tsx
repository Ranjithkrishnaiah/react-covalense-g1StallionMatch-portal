import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPostGetChannelId = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postGetChannelId: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(
          api.baseUrl,
          api.messagesUrl + '/channel-by-recieverid',
          '',
          'POST',
          data,
          true
        ),
      invalidatesTags: ['PostGetChannelId'],
    }),

    postCreateChannelId: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.messagesUrl + '/check-channel', '', 'POST', data, true),
      invalidatesTags: ['PostCreateChannelId'],
    }),
  }),
});

export const { usePostGetChannelIdMutation, usePostCreateChannelIdMutation } =
  apiWithPostGetChannelId;
