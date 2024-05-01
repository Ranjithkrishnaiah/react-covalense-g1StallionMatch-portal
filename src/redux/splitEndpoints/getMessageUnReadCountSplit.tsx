//messageUnReadCount
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithGetMessageUnReadCount = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMessageUnReadCount: build.query<any, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.messagesUrl+api.messageUnReadCount, '',true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'MessageUnReadCount' }],
    }),
  }),
});

export const { useGetMessageUnReadCountQuery } = apiWithGetMessageUnReadCount;