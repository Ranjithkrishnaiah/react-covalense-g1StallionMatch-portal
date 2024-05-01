import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithGetChannelState = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getChannelState: build.query<any, any>({
      query: (channelId) =>
        prepareAPIQuery(api.baseUrl, api.messagesUrl + '/channel' + '/' + channelId, '', true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'ChannelState' }],
    }),
  }),
});

export const { useGetChannelStateQuery } = apiWithGetChannelState;
