import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { api } from 'src/api/apiPaths';

export const latestUserMessages = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getLatestUserMessages: builder.query<any, any>({
      query: () =>
        prepareAPIQuery(api.baseUrl, api.latestUserMessagesUrl, '', true),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Latest User Messages' }],
    }),
  }),
});

export const { useGetLatestUserMessagesQuery } = latestUserMessages;
