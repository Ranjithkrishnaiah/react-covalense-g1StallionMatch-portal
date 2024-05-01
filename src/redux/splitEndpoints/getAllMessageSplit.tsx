import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

//Needs to be reimplemented once the api is provided
export const apiWithgetAllMessages = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMessages: build.query<any, void>({
      query: (channelId: any) =>
        prepareAPIQuery(api.baseUrl, api.messagesUrl + '/' + channelId, '', true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'AllMessages' }],
    }),
  }),
});

export const { useGetAllMessagesQuery } = apiWithgetAllMessages;
