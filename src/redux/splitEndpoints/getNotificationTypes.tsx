import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type NotificationPreferences = {
    NotificationId: number;
    isActive : boolean;
}
export const notificationTypes = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getNotificationTypes: build.query<NotificationPreferences[], void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.notificationTypesUrl, '', true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Notification Preferences' }],
    }),
  }),
});

export const { useGetNotificationTypesQuery } = notificationTypes;