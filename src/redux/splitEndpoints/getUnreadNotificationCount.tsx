import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const getUnreadNotificationCount = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getNotificationCount: build.query<any, any>({
      query: () => (prepareAPIQuery(api.baseUrl, api.unreadNotificationCountUrl, '',true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Notification Count' }],
    }),
  }),
});

export const { useGetNotificationCountQuery } = getUnreadNotificationCount;