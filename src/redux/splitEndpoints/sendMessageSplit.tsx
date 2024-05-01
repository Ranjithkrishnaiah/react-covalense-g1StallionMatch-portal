import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithSendMessage = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<any, any>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl,api.messagesUrl, '', 'POST', data,true),
      invalidatesTags: ['AllMessages']
    }),
  }),
});

export const {useSendMessageMutation  } = apiWithSendMessage;