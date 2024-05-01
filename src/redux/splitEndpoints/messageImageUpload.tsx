import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithMessagesAttachment = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postMessageAttachment: build.mutation<any, any>({
        query: (payload) => (prepareAPIMutation(api.baseUrl, api.messagesMedia, '', 'POST', payload, true)),
        invalidatesTags: ['PatchMessageRead', 'MessageFarmList', 'getEnquiredFarms'],
      }),
    patchMessagesAttachement: build.mutation<any, any>({
        query: ({ ...payload }) => (prepareAPIMutation(api.baseUrl, api.messagesMedia, '', 'PATCH', payload, true)),
        invalidatesTags: ['PatchMessageRead', 'MessageFarmList', 'getEnquiredFarms'],
      }), 
  }),
});

export const { usePostMessageAttachmentMutation,usePatchMessagesAttachementMutation,} = apiWithMessagesAttachment;
