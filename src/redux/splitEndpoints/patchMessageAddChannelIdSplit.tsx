import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPatchMessageAddChannelId = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchMessageAddChannelId: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(
          api.baseUrl,
          api.messagesUrl + api.messageAddChannelId + data?.channelId,
          '',
          'PATCH',
          data,
          true
        ),
      invalidatesTags: ['MessageAddChannelId'],
    }),
  }),
});

export const { usePatchMessageAddChannelIdMutation } = apiWithPatchMessageAddChannelId;
