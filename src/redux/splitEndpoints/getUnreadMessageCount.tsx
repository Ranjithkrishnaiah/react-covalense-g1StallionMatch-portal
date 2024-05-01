import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const getUnreadMessageCount = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMessageCount: build.query<any, any>({
      query: () => (prepareAPIQuery(api.baseUrl, api.unreadMessageCountUrl, '',true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Message Count' }],
    }),
  }),
});

export const { useGetMessageCountQuery } = getUnreadMessageCount;