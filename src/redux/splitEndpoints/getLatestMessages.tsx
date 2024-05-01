import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { api } from 'src/api/apiPaths';

export const latestMessages = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getLatestMessages: builder.query<any, any>({
      query: (farmId) =>
        prepareAPIQuery(api.baseUrl, api.latestMessagesUrl + farmId + '/latest','', true),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Latest Messages' }],
    }),
  }),
});

export const { useGetLatestMessagesQuery } = latestMessages;
