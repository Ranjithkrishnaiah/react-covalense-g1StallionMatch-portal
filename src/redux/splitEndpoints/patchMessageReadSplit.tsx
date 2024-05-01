import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPatchMessageRead = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchMessageRead: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(
          api.baseUrl,
          api.messagesUrl + '/read/' + data?.channelId,
          '',
          'PATCH',
          data,
          true
        ),
      invalidatesTags: ['PatchMessageRead', 'MessageFarmList', 'getEnquiredFarms', 'Message Count'],
    }),

    patchMessageReadFromUnread: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(
          api.baseUrl,
          api.messagesUrl + '/read/' + data?.channelId,
          '',
          'PATCH',
          data,
          true
        ),
      invalidatesTags: ['PatchMessageRead', 'getEnquiredFarms', 'Message Count'],
    }),

    patchTOSMessage: builder.mutation<any, any>({
      query: (data) => prepareAPIMutation(api.baseUrl, api.messagesUrl, '', 'PATCH', data, true),
      invalidatesTags: ['MessageFarmList', 'AllMessages'],
    }),

    patchMessageRestore: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(
          api.baseUrl,
          api.messagesUrl + '/restore/' + data?.channelId,
          '',
          'PATCH',
          data,
          true
        ),
      invalidatesTags: ['PatchMessageRestore', 'MessageFarmList', 'getEnquiredFarms', 'Message Count'],
    }),
  }),
});

export const {
  usePatchMessageReadMutation,
  usePatchMessageReadFromUnreadMutation,
  usePatchTOSMessageMutation,
  usePatchMessageRestoreMutation,
} = apiWithPatchMessageRead;
